<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Service;

use OCA\CadViewer\AppInfo\Application;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\IUserSession;
use Psr\Log\LoggerInterface;

/**
 * Lists the drawings a user worked on last, for the app's start page.
 *
 * The list only contains metadata: the viewer fetches the drawing itself when
 * the user opens it.
 */
class RecentDrawingsService
{
    /** Number of drawings shown on the start page. */
    public const DEFAULT_LIMIT = 12;

    /**
     * How many recently touched files are inspected per requested drawing.
     *
     * `getRecent()` returns every file type, so the CAD drawings are only a
     * fraction of its result. A bounded multiple keeps the query cheap.
     */
    private const RECENT_SCAN_FACTOR = 5;

    private const EXTENSIONS = ['dwg', 'dxf'];

    public function __construct(
        private readonly IRootFolder $rootFolder,
        private readonly IUserSession $userSession,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Return the most recently modified DWG/DXF files of the current user.
     *
     * @return list<array{id: int, name: string, path: string, extension: string, mtime: int}>
     */
    public function getRecentDrawings(int $limit = self::DEFAULT_LIMIT): array
    {
        if ($limit < 1) {
            return [];
        }

        $user = $this->userSession->getUser();
        if ($user === null) {
            return [];
        }

        try {
            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $drawings = $this->collect(
                $userFolder->getRecent($limit * self::RECENT_SCAN_FACTOR),
                $userFolder,
            );

            if ($drawings === []) {
                // getRecent() only covers roughly the last two weeks. A user
                // whose drawings are older would otherwise see an empty page.
                $drawings = $this->collect(
                    array_merge(
                        $userFolder->searchByMime(Application::CANONICAL_DWG_MIME),
                        $userFolder->searchByMime(Application::CANONICAL_DXF_MIME),
                    ),
                    $userFolder,
                );
            }
        } catch (\Throwable $e) {
            // The start page is a convenience; never fail it because the file
            // search is unavailable.
            $this->logger->warning(
                'CAD Viewer: could not list recent drawings',
                ['exception' => $e],
            );

            return [];
        }

        usort(
            $drawings,
            static fn (array $a, array $b): int => $b['mtime'] <=> $a['mtime'],
        );

        return array_slice($drawings, 0, $limit);
    }

    /**
     * Reduce nodes to the drawing metadata the start page needs.
     *
     * @param Node[] $nodes
     *
     * @return list<array{id: int, name: string, path: string, extension: string, mtime: int}>
     */
    private function collect(array $nodes, Folder $userFolder): array
    {
        $drawings = [];

        foreach ($nodes as $node) {
            if (!$node instanceof File || !$node->isReadable()) {
                continue;
            }

            $name = $node->getName();
            $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!in_array($extension, self::EXTENSIONS, true)) {
                continue;
            }

            $relativePath = $userFolder->getRelativePath($node->getPath());
            $drawings[$node->getId()] = [
                'id' => $node->getId(),
                'name' => $name,
                'path' => $relativePath ?? '/' . $name,
                'extension' => $extension,
                'mtime' => $node->getMTime(),
            ];
        }

        return array_values($drawings);
    }
}
