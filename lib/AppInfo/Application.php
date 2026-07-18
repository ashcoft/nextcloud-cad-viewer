<?php

declare(strict_types=1);

namespace OCA\CadViewer\AppInfo;

use OCA\CadViewer\Listener\LoadViewer;
use OCA\Viewer\Event\LoadViewer as ViewerLoadViewerEvent;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Files\IMimeTypeDetector;
use OCP\Util;

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

        // Register event listener for the Nextcloud Viewer LoadViewer event
        // This is called when the Viewer app loads and allows us to register
        // our handler for CAD file types
        $context->registerEventListener(
            ViewerLoadViewerEvent::class,
            LoadViewer::class
        );
    }

    /**
     * Provides the app bootstrap hook for runtime initialization.
     *
     * @param IBootContext $context The boot context.
     *
     * @return void
     */
    #[\Override]
    public function boot(IBootContext $context): void
    {
        // Ensure MIME type mappings are available
        $container = $context->getAppContainer();
        $detector = $container->get(IMimeTypeDetector::class);
        $detector->getAllMappings();
    }
}
