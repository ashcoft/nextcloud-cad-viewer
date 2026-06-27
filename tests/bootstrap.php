<?php

declare(strict_types=1);

$serverBootstrap = __DIR__ . '/../../../tests/bootstrap.php';
if (!file_exists($serverBootstrap)) {
    throw new RuntimeException('Expected Nextcloud test bootstrap at ' . $serverBootstrap);
}
require_once $serverBootstrap;
require_once __DIR__ . '/../vendor/autoload.php';

\OC_App::loadApp(OCA\CadViewer\AppInfo\Application::APP_ID);
OC_Hook::clear();
