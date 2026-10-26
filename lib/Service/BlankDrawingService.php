<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Service;

use OCA\CadViewer\Exception\NoUserSessionException;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotPermittedException;
use OCP\IUserSession;
use OCP\Lock\LockedException;

/**
 * Creates a new, empty DXF drawing in the user's files.
 *
 * DXF is used because it is the text-based CAD exchange format: a minimal
 * document is a few hundred bytes and every supported viewer can open it.
 */
class BlankDrawingService
{
    public const DEFAULT_NAME = 'Drawing';
    public const EXTENSION = 'dxf';

    /**
     * Maximum length of the base name in UTF-8 bytes.
     *
     * Most filesystems cap file names at 255 bytes. Keeping the base at 120
     * leaves room for the `.dxf` extension and a ` (999)` collision suffix.
     */
    private const MAX_NAME_BYTES = 120;

    /** Attempts made when another request takes the chosen name. */
    private const MAX_CREATE_ATTEMPTS = 5;

    /**
     * A minimal, valid DXF R12 document with an empty ENTITIES section.
     *
     * R12 is used on purpose: unlike newer DXF versions it needs no handles
     * or object dictionary, so the document stays trivially valid.
     */
    private const BLANK_DXF = <<<'DXF'
0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
1
0
LAYER
2
0
70
0
62
7
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
0
ENDSEC
0
EOF
DXF;

    public function __construct(
        private readonly IRootFolder $rootFolder,
        private readonly IUserSession $userSession,
    ) {
    }

    /**
     * Create a blank drawing in the root of the current user's files.
     *
     * An existing file is never overwritten: the name gets a counter suffix
     * instead. If two requests race for the same free name, the write is
     * retried with the next free name.
     *
     * @throws NoUserSessionException when there is no user session
     * @throws NotPermittedException when no name could be written
     */
    public function create(string $name = ''): File
    {
        $user = $this->userSession->getUser();
        if ($user === null) {
            throw new NoUserSessionException('A user session is required to create a drawing');
        }

        $userFolder = $this->rootFolder->getUserFolder($user->getUID());
        $baseName = self::normalizeFileName($name);
        $content = self::BLANK_DXF . "\n";
        $lastError = null;

        for ($attempt = 0; $attempt < self::MAX_CREATE_ATTEMPTS; $attempt++) {
            try {
                return $userFolder->newFile(
                    $this->uniqueFileName($userFolder, $baseName),
                    $content,
                );
            } catch (NotPermittedException | LockedException $e) {
                // Another request can take the name between the existence
                // check and the write, so try the next free name.
                $lastError = $e;
            }
        }

        if ($lastError !== null) {
            throw $lastError;
        }

        throw new NotPermittedException('Could not create the drawing');
    }

    /**
     * Turn user input into a safe DXF file name.
     *
     * Path separators and characters that are invalid on common filesystems
     * are replaced, a given DWG/DXF extension is dropped (the drawing is
     * always stored as DXF), and an empty name falls back to the default.
     */
    public static function normalizeFileName(string $name): string
    {
        $name = trim($name);
        $name = (string) preg_replace('/\.(?:dwg|dxf)$/i', '', $name);
        $name = (string) preg_replace('/[\\\\\/:*?"<>|\x00-\x1F]+/u', '-', $name);
        $name = trim($name, " .-");

        if ($name === '') {
            $name = self::DEFAULT_NAME;
        }

        if (strlen($name) > self::MAX_NAME_BYTES) {
            // mb_strcut() cuts on byte boundaries without splitting a
            // multibyte character, so the result stays valid UTF-8.
            $name = rtrim(mb_strcut($name, 0, self::MAX_NAME_BYTES, 'UTF-8'), " .-");
        }

        return $name . '.' . self::EXTENSION;
    }

    /**
     * Pick a file name that does not collide with an existing node.
     */
    private function uniqueFileName(Folder $folder, string $fileName): string
    {
        if (!$folder->nodeExists($fileName)) {
            return $fileName;
        }

        $base = pathinfo($fileName, PATHINFO_FILENAME);

        for ($i = 1; $i < 1000; $i++) {
            $candidate = sprintf('%s (%d).%s', $base, $i, self::EXTENSION);
            if (!$folder->nodeExists($candidate)) {
                return $candidate;
            }
        }

        return sprintf('%s (%s).%s', $base, bin2hex(random_bytes(4)), self::EXTENSION);
    }
}
