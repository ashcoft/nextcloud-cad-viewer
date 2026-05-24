<?php

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * @template-implements IEventListener<BeforeTemplateRenderedEvent>
 */
class LoadViewer implements IEventListener
{
    public function handle(Event $event): void
    {
        if (!$event instanceof BeforeTemplateRenderedEvent) {
            return;
        }

        $response = $event->getResponse();
        if (!($response instanceof TemplateResponse)) {
            return;
        }

        $app = $response->getApp();
        if ($app !== 'files' && $app !== 'files_sharing' && $app !== Application::APP_ID) {
            return;
        }

        // Inject the CAD viewer scripts and styles
        Util::addScript(Application::APP_ID, 'cad-viewer');
        Util::addStyle(Application::APP_ID, 'cad-viewer');
    }
}
