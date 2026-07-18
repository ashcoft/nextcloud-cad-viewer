<?php

declare(strict_types=1);

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * Loads the CAD viewer assets for the Nextcloud Viewer integration.
 *
 * Uses OCA\Viewer\Event\LoadViewer event (same as OnlyOffice integration)
 * to ensure the CAD viewer handler is registered BEFORE the Nextcloud Viewer
 * app processes handlers. This allows the CAD viewer to handle .dwg/.dxf files
 * inline without requiring the user to download them.
 *
 * The cad-viewer.js bundle contains only the lightweight registration code and
 * a thin Vue 3 component wrapper. The heavy CAD viewer engine (Three.js,
 * Element Plus) is loaded on-demand when the handler's onMounted() fires.
 *
 * @template-implements IEventListener<LoadViewer>
 */
class LoadViewer implements IEventListener
{
    /**
     * Loads the CAD viewer assets when the Nextcloud Viewer is being initialized.
     *
     * @param Event $event The LoadViewer event fired by the Viewer app.
     *
     * @return void
     */
    #[\Override]
    public function handle(Event $event): void
    {
        if (!$event instanceof LoadViewer) {
            return;
        }

        // Load the CAD viewer script with the "viewer" entry point
        // This is the same pattern used by OnlyOffice and other viewer integrations
        // The third parameter "viewer" specifies the entry point, resulting in js/cad-viewer.viewer.js
        Util::addScript(Application::APP_ID, 'cad-viewer', 'viewer');
        Util::addStyle(Application::APP_ID, 'cad-viewer');
    }
}
