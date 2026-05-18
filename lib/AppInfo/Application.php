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
