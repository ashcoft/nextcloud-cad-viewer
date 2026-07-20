<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\AppInfo;

use OCA\CadViewer\Listener\LoadViewer;
use OCA\CadViewer\Settings\AdminSection;
use OCA\CadViewer\Settings\AdminSettings;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

class Application extends App implements IBootstrap
{
    public const APP_ID = 'cad_viewer';
    public const CANONICAL_DWG_MIME = 'application/dwg';

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
        // Register event listener to inject scripts/styles when files app loads
        $context->registerEventListener(
            \OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent::class,
            LoadViewer::class
        );

        // Register admin settings
        $context->registerSettingsSection(AdminSection::class);
        $context->registerAdminSettings(AdminSettings::class);
    }

    /**
     * Provides the app bootstrap hook without performing boot-time work.
     *
     * This app has no boot-time registrations; the method is intentionally a no-op
     * required by the IBootstrap interface contract.
     *
     * @param IBootContext $context Unused boot context.
     *
     * @return void
     */
    #[\Override]
    public function boot(IBootContext $context): void
    {
        // Intentional no-op: this app performs all setup in register().
    }
}
