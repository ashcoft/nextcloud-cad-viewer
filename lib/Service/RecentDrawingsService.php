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
use OCP\IPreview;
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
     * Number of the newest files inspected for drawings.
     *
     * Kept above 100 because `getRecent()` only applies its two-week cutoff up
     * to that limit: a larger limit returns the newest files regardless of
     * their age. The bound keeps the start page fast and memory-safe even for
     * users with a very large archive of drawings.
     */
    private const RECENT_SCAN_LIMIT = 200;

    private const EXTENSIONS = ['dwg', 'dxf'];

    public function __construct(
        private readonly IRootFolder $rootFolder,
        private readonly IUserSession $userSession,
        private readonly IPreview $preview,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Return the most recently modified DWG/DXF files of the current user.
     *
     * @return list<array{id: int, name: string, path: string, extension: string, mtime: int, hasPreview: bool}>
     */
    public function getRecentDrawings(int $limit = self::DEFAULT_LIMIT): array
    {
        $user = $this->userSession->getUser();
        if ($limit < 1 || $user === null) {
            return [];
        }

        try {
            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            [$drawings, $files] = $this->collect(
                $userFolder->getRecent(self::RECENT_SCAN_LIMIT),
                $userFolder,
            );
        } catch (\Throwable $e) {
            // The start page is a convenience; never fail it because the file
            // search is unavailable. Log the class only: exception messages
            // can contain internal paths.
            $this->logger->warning(
                'CAD Viewer: could not list recent drawings',
                ['error' => $e::class],
            );

            return [];
        }

        usort(
            $drawings,
            static fn (array $a, array $b): int => $b['mtime'] <=> $a['mtime'],
        );

        $result = [];
        foreach (array_slice($drawings, 0, min($limit, self::RECENT_SCAN_LIMIT)) as $drawing) {
            // Only check the preview state of the drawings that are actually
            // shown: each check reads the app's thumbnail storage.
            $drawing['hasPreview'] = $this->hasPreview($files[$drawing['id']] ?? null);
            $result[] = $drawing;
        }

        return $result;
    }

    /**
     * Whether a stored preview exists for a drawing.
     *
     * A preview is only stored after the viewer rendered the drawing once, so
     * most drawings fall back to the generic icon.
     */
    private function hasPreview(?File $file): bool
    {
        if ($file === null) {
            return false;
        }

        try {
            return $this->preview->isAvailable($file);
        } catch (\Throwable) {
            // Keep the drawing listed; the client falls back to the icon.
            return false;
        }
    }

    /**
     * Reduce nodes to the drawing metadata the start page needs.
     *
     * @param Node[] $nodes
     *
     * @return array{
     *     0: list<array{id: int, name: string, path: string, extension: string, mtime: int}>,
     *     1: array<int, File>
     * }
     */
    private function collect(array $nodes, Folder $userFolder): array
    {
        $drawings = [];
        $files = [];

        foreach ($nodes as $node) {
            if (!$node instanceof File || !$node->isReadable()) {
                continue;
            }

            // The viewer refuses larger files, so listing one would only lead
            // to an error page.
            if ($node->getSize() > Application::MAX_FILE_SIZE) {
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
            $files[$node->getId()] = $node;
        }

        return [array_values($drawings), $files];
    }
}
