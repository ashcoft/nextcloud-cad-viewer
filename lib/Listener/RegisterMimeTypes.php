<?php

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Event\RegisterAdditionalMimeTypeEvent;

/**
 * @template-implements IEventListener<Event>
 */
class RegisterMimeTypes implements IEventListener
{
    /** @var array<string, string> */
    private array $mimeTypes;

    /**
     * @param array<string, string> $mimeTypes
     */
    public function __construct(array $mimeTypes)
    {
        $this->mimeTypes = $mimeTypes;
    }

    public function handle(Event $event): void
    {
        if (!$event instanceof RegisterAdditionalMimeTypeEvent) {
            return;
        }

        foreach ($this->mimeTypes as $mimeType => $extension) {
            $event->addMimeType($mimeType, '.' . $extension);
        }
    }
}
