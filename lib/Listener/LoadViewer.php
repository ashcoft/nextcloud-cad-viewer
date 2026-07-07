<?php

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * Loads the CAD viewer assets lazily for supported template renders.
 *
 * Uses addInitScript to ensure the handler registers BEFORE the Nextcloud Viewer
 * app loads. This allows the CAD viewer to handle .dwg/.dxf files inline without
 * requiring the user to download them.
 *
 * The cad-viewer.js bundle contains only the lightweight registration code and
 * a thin Vue 3 component wrapper. The heavy CAD viewer engine (Three.js,
 * Element Plus) is loaded on-demand when the handler's onMounted() fires.
 *
 * @template-implements IEventListener<BeforeTemplateRenderedEvent>
 */
class LoadViewer implements IEventListener
{
    /**
     * Loads the CAD viewer assets for supported template renders.
     *
     * @param Event $event The event fired before a template is rendered.
     *
     * @return void
     */
    #[\Override]
    public function handle(Event $event): void
    {
        if (!$event instanceof BeforeTemplateRenderedEvent) {
            return;
        }

        $response = $event->getResponse();

        $app = $response->getApp();
        $isFilesApp = $app === 'files';
        $isSharingApp = $app === 'files_sharing';
        $isCadViewerApp = $app === Application::APP_ID;

        if (!$isFilesApp && !$isSharingApp && !$isCadViewerApp) {
            return;
        }

        // Use addInitScript to ensure handler registration happens BEFORE
        // the Nextcloud Viewer app initializes. This is critical for the
        // registerHandler() call to be picked up by the Viewer.
        // The script is injected before the Viewer's own initialization.
        //
        // The actual CAD viewer bundle is lazy-loaded only when a CAD file
        // is opened (in the component's onMounted hook), avoiding unnecessary
        // bundle loading on every Files page view.
        Util::addInitScript(Application::APP_ID, 'cad-viewer');
        Util::addStyle(Application::APP_ID, 'cad-viewer');
    }
}
