<?php
namespace OCA\CadViewer\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCA\CadViewer\Listener\LoadViewer;
use OCP\Files\IMimeTypeDetector;

class Application extends App implements IBootstrap {
    const APP_ID = 'cad_viewer';

    public function __construct() {
        parent::__construct(self::APP_ID);
    }

    public function register(IRegistrationContext $context): void {
        $context->registerEventListener(\OCP\Files\Events\BeforeDirectoryRendered::class, LoadViewer::class);
    }

    public function boot(IBootContext $context): void {
    }
}