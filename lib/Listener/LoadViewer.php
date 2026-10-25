<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Listener;

use OCA\CadViewer\AppInfo\Application;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent as FilesSharingBeforeTemplateRenderedEvent;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * Loads the CAD viewer script on the Files app, on public share pages and on
 * the app's own pages.
 *
 * The script is loaded with addInitScript so the "Open with CAD Viewer" file
 * action is registered before the Files list takes its first snapshot of the
 * available actions.
 *
 * @template-implements IEventListener<LoadAdditionalScriptsEvent|BeforeTemplateRenderedEvent|FilesSharingBeforeTemplateRenderedEvent>
 */
class LoadViewer implements IEventListener
{
    /**
     * @param Event $event The dispatched event.
     */
    #[\Override]
    public function handle(Event $event): void
    {
        if ($event instanceof LoadAdditionalScriptsEvent) {
            $this->addScripts();
            return;
        }

        if ($event instanceof FilesSharingBeforeTemplateRenderedEvent) {
            // Skip the share authentication (password) page.
            if ($event->getScope() === FilesSharingBeforeTemplateRenderedEvent::SCOPE_PUBLIC_SHARE_AUTH) {
                return;
            }

            $this->addScripts();
            return;
        }

        if ($event instanceof BeforeTemplateRenderedEvent) {
            $app = $event->getResponse()->getApp();
            $isCadViewerApp = $app === Application::APP_ID;

            if (!$isCadViewerApp) {
                return;
            }
            $this->addScripts();
        }
    }

    /**
     * Add the CAD viewer init script and stylesheet.
     */
    private function addScripts(): void
    {
        Util::addInitScript(Application::APP_ID, 'cad-viewer');
        Util::addStyle(Application::APP_ID, 'cad-viewer');
    }
}
