<?php

namespace OCA\CadViewer\Listener;

use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\BeforeTemplateRenderedEvent;
use OCP\Util;

class LoadViewer implements IEventListener {
    public function handle(Event $event): void {
        if ($event instanceof BeforeTemplateRenderedEvent) {
            Util::addScript('cad_viewer', 'cad-viewer');
            Util::addStyle('cad_viewer', 'cad-viewer');
        }
    }
}
