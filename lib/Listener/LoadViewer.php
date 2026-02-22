<?php namespace OCA\CadViewer\Listener;

use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

class LoadViewer implements IEventListener {
    public function handle(Event $event): void {
        Util::addScript('cad_viewer', 'cad-viewer');
        Util::addStyle('cad_viewer', 'cad-viewer');
    }
}