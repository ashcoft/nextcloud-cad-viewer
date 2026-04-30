<?php

declare(strict_types=1);

namespace OCA\CadViewer\AppInfo;

return [
    'routes' => [
        ['name' => 'file#getFile', 'url' => '/api/file/{fileId}', 'verb' => 'GET'],
        ['name' => 'file#preview', 'url' => '/api/preview/{fileId}', 'verb' => 'GET'],
    ]
];
