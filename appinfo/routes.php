<?php declare(strict_types=1);

use OCA\CadViewer\Controller\ViewController;

return [
    'routes' => [
        ['name' => 'view#index', 'url' => '/', 'verb' => 'GET'],
        ['name' => 'view#view', 'url' => '/view', 'verb' => 'GET'],
        ['name' => 'file#getFile', 'url' => '/api/file/{fileId}', 'verb' => 'GET'],
        ['name' => 'file#preview', 'url' => '/api/preview/{fileId}', 'verb' => 'GET'],
    ],
];
