<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Migration;

use OCP\Files\IMimeTypeLoader;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;
use Psr\Log\LoggerInterface;

/**
 * Shared logic for registering and unregistering the DWG and DXF mimetypes.
 *
 * Nextcloud only opens a file inside a registered Viewer handler when the
 * file's detected mime type matches one of the handler's mimes. Out of the
 * box Nextcloud does not know the .dwg / .dxf extensions, so uploaded CAD
 * files are detected as application/octet-stream. Because no handler matches
 * that mime, the browser downloads the file instead of opening the CAD viewer.
 *
 * These repair steps map the extensions to the canonical mimes, update the
 * filecache for files that were already uploaded and regenerate the client
 * side mime list so the Files app opens the viewer on click instead of
 * triggering a download.
 */
abstract class MimeTypeBase implements IRepairStep
{
    public const CUSTOM_MIMETYPEMAPPING = 'mimetypemapping.json';
    public const CUSTOM_MIMETYPEALIASES = 'mimetypealiases.json';

    /**
     * Map of file extension to the list of mimes it can represent.
     *
     * The first mime is the canonical one used for detection and is the same
     * mime the Viewer handler registers itself for.
     *
     * @var array<string, string[]>
     */
    public const EXT_MIME_MAP = [
        'dwg' => ['application/dwg'],
        'dxf' => ['image/vnd.dxf'],
    ];

    protected IMimeTypeLoader $mimeTypeLoader;
    protected LoggerInterface $logger;

    public function __construct(IMimeTypeLoader $mimeTypeLoader, LoggerInterface $logger)
    {
        $this->mimeTypeLoader = $mimeTypeLoader;
        $this->logger = $logger;
    }

    /**
     * Append the given extension -> mime entries to a mimetype mapping file.
     */
    protected function appendToMapping(string $filename, array $data): void
    {
        $obj = $this->readJson($filename);
        foreach ($data as $ext => $mimes) {
            $obj[$ext] = $mimes;
        }
        $this->writeJson($filename, $obj);
    }

    /**
     * Remove the given extension entries from a mimetype mapping file.
     */
    protected function removeFromMapping(string $filename, array $data): void
    {
        $obj = $this->readJson($filename);
        foreach ($data as $ext => $mimes) {
            unset($obj[$ext]);
        }
        $this->writeJson($filename, $obj);
    }

    /**
     * Append mime -> extension alias entries used for icon resolution.
     */
    protected function appendToAliases(string $filename, array $data): void
    {
        $obj = $this->readJson($filename);
        foreach ($data as $ext => $mimes) {
            foreach ((array) $mimes as $mime) {
                $obj[$mime] = $ext;
            }
        }
        $this->writeJson($filename, $obj);
    }

    /**
     * Remove mime -> extension alias entries used for icon resolution.
     */
    protected function removeFromAliases(string $filename, array $data): void
    {
        $obj = $this->readJson($filename);
        foreach ($data as $ext => $mimes) {
            foreach ((array) $mimes as $mime) {
                unset($obj[$mime]);
            }
        }
        $this->writeJson($filename, $obj);
    }

    /**
     * Regenerate the client side mimetypelist.js so the new aliases are picked
     * up by the Files app. Best effort: opening files still works server side
     * without it.
     */
    protected function updateMimeTypeJs(): void
    {
        try {
            $updateJs = \OCP\Server::get(\OC\Core\Command\Maintenance\Mimetype\UpdateJS::class);
            $updateJs->run(
                new \Symfony\Component\Console\Input\StringInput(''),
                new \Symfony\Component\Console\Output\ConsoleOutput(),
            );
        } catch (\Throwable $e) {
            $this->logger->warning('CAD Viewer: could not regenerate mimetypelist.js', [
                'exception' => $e,
            ]);
        }
    }

    private function readJson(string $filename): array
    {
        if (!file_exists($filename)) {
            return [];
        }
        $content = file_get_contents($filename);
        if ($content === false) {
            return [];
        }
        $decoded = json_decode($content, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function writeJson(string $filename, array $obj): void
    {
        $mask = empty($obj)
            ? JSON_FORCE_OBJECT | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
            : JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES;
        file_put_contents($filename, json_encode($obj, $mask));
    }

    /**
     * Resolve the Nextcloud config directory, or null when it is not available
     * (e.g. in a constrained test environment). The mapping / aliases files are
     * only written when a config directory can be determined.
     */
    protected function configDir(): ?string
    {
        $configDir = \OC::$configDir ?? '';
        if (!is_string($configDir) || $configDir === '') {
            return null;
        }
        return rtrim($configDir, '/');
    }

    abstract public function run(IOutput $output): void;
}
