<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\Service\ThumbnailService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\BeforeNodeDeletedEvent;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\File;
use OCP\Files\Folder;

/**
 * Removes cached CAD thumbnails when the drawing they belong to is deleted.
 *
 * Without this the thumbnail cache would keep an image per deleted drawing
 * forever, since nothing else references the file id again.
 *
 * A folder deletion fires a single event for the folder, not for the drawings
 * inside it, so the folder case is handled from the *before* event while the
 * subtree can still be enumerated.
 *
 * @template-implements IEventListener<NodeDeletedEvent|BeforeNodeDeletedEvent>
 */
class DeleteThumbnail implements IEventListener
{
    /**
     * Extensions the CAD viewer can render, and therefore the only ones that
     * can ever have a cached thumbnail.
     */
    private const CAD_EXTENSIONS = ['dwg', 'dxf'];

    public function __construct(
        private readonly ThumbnailService $thumbnailService,
    ) {
    }

    /**
     * @param Event $event The dispatched event.
     */
    #[\Override]
    public function handle(Event $event): void
    {
        if ($event instanceof BeforeNodeDeletedEvent) {
            $node = $event->getNode();
            if ($node instanceof Folder) {
                $this->deleteFolderThumbnails($node);
            }
            return;
        }

        if (!$event instanceof NodeDeletedEvent) {
            return;
        }

        $node = $event->getNode();
        if (!$node instanceof File) {
            return;
        }

        // A drawing may have been renamed since its thumbnail was cached (for
        // example plan.dwg to plan.bak), so the current extension cannot decide
        // whether an image exists. Ask the cache instead: the per-file layout
        // makes this a single folder lookup rather than a directory scan.
        $fileId = (int) $node->getId();
        if ($this->thumbnailService->hasThumbnail($fileId)) {
            $this->thumbnailService->deleteForFileId($fileId);
        }
    }

    /**
     * Remove the thumbnails of every CAD drawing inside a folder being deleted.
     */
    private function deleteFolderThumbnails(Folder $folder): void
    {
        try {
            foreach ($folder->searchByMime('application') as $node) {
                if ($node instanceof File && $this->isCadFile($node)) {
                    $this->thumbnailService->deleteForFileId((int) $node->getId());
                }
            }
            foreach ($folder->searchByMime('image') as $node) {
                if ($node instanceof File && $this->isCadFile($node)) {
                    $this->thumbnailService->deleteForFileId((int) $node->getId());
                }
            }
        } catch (\Throwable) {
            // A folder we cannot enumerate is not worth failing the deletion
            // over; the orphaned thumbnails are only a small cache.
        }
    }

    /**
     * Whether the node carries a DWG/DXF extension.
     */
    private function isCadFile(File $file): bool
    {
        $extension = strtolower(pathinfo($file->getName(), PATHINFO_EXTENSION));

        return in_array($extension, self::CAD_EXTENSIONS, true);
    }
}
