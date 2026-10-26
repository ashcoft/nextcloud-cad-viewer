<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\Service\ThumbnailService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\File;

/**
 * Removes cached CAD thumbnails when the drawing they belong to is deleted.
 *
 * Without this the thumbnail cache would keep an image per deleted drawing
 * forever, since nothing else references the file id again.
 *
 * @template-implements IEventListener<NodeDeletedEvent>
 */
class DeleteThumbnail implements IEventListener
{
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
        if (!$event instanceof NodeDeletedEvent) {
            return;
        }

        $node = $event->getNode();
        if (!$node instanceof File) {
            return;
        }

        $this->thumbnailService->deleteForFileId((int) $node->getId());
    }
}
