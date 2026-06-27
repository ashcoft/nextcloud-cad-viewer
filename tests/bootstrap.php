<?php

declare(strict_types=1);

$serverBootstrap = __DIR__ . '/../../../tests/bootstrap.php';
if (file_exists($serverBootstrap)) {
    require_once $serverBootstrap;
}

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/stubs/OC/OC.php';
