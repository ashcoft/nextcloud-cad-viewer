<?php

declare(strict_types=1);

namespace OCA\CadViewer\AppInfo;

use OCA\CadViewer\Listener\LoadViewer;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Files\Event\RegisterAdditionalMimeTypeEvent;
use OCP\Util;

class Application extends App implements IBootstrap
{
    public const APP_ID = 'cad_viewer';

    private const MIME_TYPES = [
        'application/acad' => 'dwg',
        'application/autocad_dwg' => 'dwg',
        'application/dwg' => 'dwg',
        'application/x-autocad' => 'dwg',
        'application/x-dwg' => 'dwg',
        'image/vnd.dwg' => 'dwg',
        'image/vnd.dxf' => 'dxf',
        'application/dxf' => 'dxf',
        'application/x-dxf' => 'dxf',
        'image/x-dxf' => 'dxf',
    ];

    private const MIME_TYPE_ALIASES = [
        'application/acad' => 'application/dwg',
        'application/autocad_dwg' => 'application/dwg',
        'application/x-autocad' => 'application/dwg',
        'application/x-dwg' => 'application/dwg',
        'image/vnd.dwg' => 'application/dwg',
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

        // Register MIME types for DWG and DXF files
        foreach (self::MIME_TYPES as $mimeType => $extension) {
            $context->registerEventListener(
                RegisterAdditionalMimeTypeEvent::class,
                function (RegisterAdditionalMimeTypeEvent $event) use ($mimeType, $extension) {
                    $event->addMimeType($mimeType, '.' . $extension);
                }
            );
        }

        // Register MIME type aliases
        foreach (self::MIME_TYPE_ALIASES as $alias => $canonical) {
            $context->registerEventListener(
                RegisterAdditionalMimeTypeEvent::class,
                function (RegisterAdditionalMimeTypeEvent $event) use ($alias, $canonical) {
                    $event->addMimeTypeAlias($alias, $canonical);
                }
            );
        }
    }

    public function boot(IBootContext $context): void {}
}
