<?php

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer as ViewerLoadViewerEvent;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * Loads the CAD viewer assets when the Nextcloud Viewer is being used.
 *
 * This listener hooks into two events:
 * 1. BeforeTemplateRenderedEvent - Injects scripts/styles into the Files app
 * 2. LoadViewer event - Registers the CAD viewer handler with Nextcloud Viewer
 *
 * The cad-viewer.js bundle contains the lightweight registration code and
 * a Vue 3 component wrapper. The heavy CAD viewer engine (Three.js,
 * Element Plus) is loaded on-demand when the handler's onMounted() fires.
 *
 * @template-implements IEventListener<BeforeTemplateRenderedEvent|ViewerLoadViewerEvent>
 */
class LoadViewer implements IEventListener
{
    /**
     * Loads the CAD viewer assets for supported template renders.
     *
     * @param Event $event The event fired before a template is rendered or when Viewer loads.
     *
     * @return void
     */
    #[\Override]
    public function handle(Event $event): void
    {
        if ($event instanceof ViewerLoadViewerEvent) {
            $this->handleViewerLoadEvent($event);
            return;
        }

        if ($event instanceof BeforeTemplateRenderedEvent) {
            $this->handleBeforeTemplateRendered($event);
        }
    }

    /**
     * Handle the Viewer LoadViewer event.
     * This is called when the Nextcloud Viewer app loads and allows us to
     * register our handler for CAD file types.
     *
     * @param ViewerLoadViewerEvent $event The viewer load event.
     *
     * @return void
     */
    private function handleViewerLoadEvent(ViewerLoadViewerEvent $event): void
    {
        // Register our handler for CAD file types
        // The actual handler registration is done in JavaScript via OCA.Viewer.registerHandler()
        // which is loaded via addInitScript
        Util::addInitScript(Application::APP_ID, 'cad-viewer');
        Util::addStyle(Application::APP_ID, 'cad-viewer');
    }

    /**
     * Handle the BeforeTemplateRenderedEvent.
     * Injects scripts/styles into supported apps.
     *
     * @param BeforeTemplateRenderedEvent $event The template render event.
     *
     * @return void
     */
    private function handleBeforeTemplateRendered(BeforeTemplateRenderedEvent $event): void
    {
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
