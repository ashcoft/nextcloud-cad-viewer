<?php

declare(strict_types=1);

return [
    'routes' => [
        ['name' => 'view#index', 'url' => '/', 'verb' => 'GET'],
        ['name' => 'view#view', 'url' => '/view', 'verb' => 'GET'],
        // Simple load endpoint - returns file content by ID (like draw.io approach)
        ['name' => 'file#load', 'url' => '/api/load/{fileId}', 'verb' => 'GET'],
        // Keep legacy endpoints for compatibility
        ['name' => 'file#getFile', 'url' => '/api/file/{fileId}', 'verb' => 'GET'],
        ['name' => 'file#getFileContent', 'url' => '/api/file/{fileId}/content', 'verb' => 'GET'],
        ['name' => 'file#preview', 'url' => '/api/preview/{fileId}', 'verb' => 'GET'],
    ],
];
