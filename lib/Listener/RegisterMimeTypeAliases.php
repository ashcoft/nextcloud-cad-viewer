<?php

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Event\RegisterAdditionalMimeTypeEvent;

/**
 * @template-implements IEventListener<Event>
 */
class RegisterMimeTypeAliases implements IEventListener
{
    /** @var array<string, string> */
    private array $aliases;

    /**
     * @param array<string, string> $aliases
     */
    public function __construct(array $aliases)
    {
        $this->aliases = $aliases;
    }

    public function handle(Event $event): void
    {
        if (!$event instanceof RegisterAdditionalMimeTypeEvent) {
            return;
        }

        foreach ($this->aliases as $alias => $canonical) {
            $event->addMimeTypeAlias($alias, $canonical);
        }
    }
}
