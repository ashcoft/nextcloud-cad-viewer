<?php

declare(strict_types=1);

return [
    'routes' => [
        ['name' => 'view#index', 'url' => '/', 'verb' => 'GET'],
        ['name' => 'view#view', 'url' => '/view', 'verb' => 'GET'],
        // Metadata endpoint - returns file info + secure download URL
        ['name' => 'file#load', 'url' => '/api/load/{fileId}', 'verb' => 'GET'],
        // Download endpoint - streams file directly (session-authenticated)
        ['name' => 'file#download', 'url' => '/api/download/{fileId}', 'verb' => 'GET'],
        // File metadata endpoint
        ['name' => 'file#getFile', 'url' => '/api/file/{fileId}', 'verb' => 'GET'],
        // Preview endpoint
        ['name' => 'file#preview', 'url' => '/api/preview/{fileId}', 'verb' => 'GET'],
    ],
];
