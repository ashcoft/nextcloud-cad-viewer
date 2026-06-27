<?php

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
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

        // NC33+ compatible: BeforeTemplateRenderedEvent::getResponse() may not exist
        // Use reflection or interface check for compatibility across NC25-34
        $app = null;
        if (method_exists($event, 'getResponse')) {
            $response = $event->getResponse();
            if (method_exists($response, 'getApp')) {
                $app = $response->getApp();
            }
        }

        if ($app !== null && $app !== 'files' && $app !== 'files_sharing' && $app !== Application::APP_ID) {
            return;
        }

        // Inject the CAD viewer scripts and styles
        // Using addScript to ensure the handler registers before the viewer loads
        Util::addScript(Application::APP_ID, 'cad-viewer');
        Util::addStyle(Application::APP_ID, 'cad-viewer');
    }
}
