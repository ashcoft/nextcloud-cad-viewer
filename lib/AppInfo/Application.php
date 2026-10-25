<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\AppInfo;

use OCA\CadViewer\Listener\LoadViewer;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;

class Application extends App implements IBootstrap
{
    public const APP_ID = 'cad_viewer';
    public const CANONICAL_DWG_MIME = 'application/dwg';
    public const CANONICAL_DXF_MIME = 'image/vnd.dxf';

    public const MIME_TYPES = [
        'application/acad' => 'dwg',
        'application/autocad_dwg' => 'dwg',
        self::CANONICAL_DWG_MIME => 'dwg',
        'application/x-autocad' => 'dwg',
        'application/x-dwg' => 'dwg',
        'image/vnd.dwg' => 'dwg',
        'image/vnd.dxf' => 'dxf',
        'application/dxf' => 'dxf',
        'application/x-dxf' => 'dxf',
        'image/x-dxf' => 'dxf',
    ];

    public const MIME_TYPE_ALIASES = [
        'application/acad' => self::CANONICAL_DWG_MIME,
        'application/autocad_dwg' => self::CANONICAL_DWG_MIME,
        'application/x-autocad' => self::CANONICAL_DWG_MIME,
        'application/x-dwg' => self::CANONICAL_DWG_MIME,
        'image/vnd.dwg' => self::CANONICAL_DWG_MIME,
    ];

    /**
     * Initializes the Cad Viewer app.
     */
    public function __construct()
    {
        parent::__construct(self::APP_ID);
    }

    /**
     * Registers the viewer listener for template rendering events.
     *
     * @param IRegistrationContext $context The app registration context.
     *
     * @return void
     */
    #[\Override]
    public function register(IRegistrationContext $context): void
    {
        // Inject the file action / init script on the Files app and on the
        // app's own pages. Public share pages are skipped: the viewer and its
        // file API require a logged-in user.
        $context->registerEventListener(LoadAdditionalScriptsEvent::class, LoadViewer::class);
        $context->registerEventListener(
            BeforeTemplateRenderedEvent::class,
            LoadViewer::class
        );
    }

    /**
     * Boots the app and registers the DWG/DXF MIME types at runtime.
     *
     * @param IBootContext $context The boot context.
     *
     * @return void
     */
    #[\Override]
    public function boot(IBootContext $context): void
    {
        // The repair step writes the mappings to the config files; this covers
        // setups where the config directory is not writable.
        $context->injectFn(function (\OCP\Files\IMimeTypeDetector $detector): void {
            if (!method_exists($detector, 'registerType')) {
                return;
            }
            // getAllMappings() must be called first: it forces the detector to
            // load the default mappings, which would otherwise be skipped
            // because registerType() marks the mapping table as initialized.
            $detector->getAllMappings();
            $detector->registerType('dwg', self::CANONICAL_DWG_MIME);
            $detector->registerType('dxf', self::CANONICAL_DXF_MIME);
        });
    }
}
