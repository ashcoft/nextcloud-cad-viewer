<?php

declare(strict_types=1);

namespace OCA\CadViewer\AppInfo;

use OCA\CadViewer\Listener\LoadViewer;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Util;

class Application extends App implements IBootstrap
{
    public const APP_ID = 'cad_viewer';
    private const CANONICAL_DWG_MIME = 'application/dwg';

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

    public function __construct()
    {
        parent::__construct(self::APP_ID);
    }

    public function register(IRegistrationContext $context): void
    {
        // Register event listener to inject scripts/styles when files app loads
        $context->registerEventListener(
            \OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent::class,
            LoadViewer::class
        );
    }

    public function boot(IBootContext $context): void {}
}
