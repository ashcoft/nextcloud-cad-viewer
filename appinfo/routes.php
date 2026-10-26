<?php

declare(strict_types=1);

return [
    'routes' => [
        ['name' => 'view#index', 'url' => '/', 'verb' => 'GET'],
        ['name' => 'view#view', 'url' => '/view', 'verb' => 'GET'],
        // Create a blank DXF drawing and open it in the viewer
        ['name' => 'view#createBlank', 'url' => '/api/blank', 'verb' => 'POST'],
        // Runtime worker/WASM assets. The viewer loads its MTEXT worker from
        // "./assets/<name>" relative to the page; with URL rewriting off that
        // is this route. With rewriting on the web server serves them statically.
        ['name' => 'asset#get', 'url' => '/assets/{file}', 'verb' => 'GET'],
        // Metadata endpoint - returns file info + secure download URL
        ['name' => 'file#load', 'url' => '/api/load/{fileId}', 'verb' => 'GET'],
        // Download endpoint - streams file directly (session-authenticated)
        ['name' => 'file#download', 'url' => '/api/download/{fileId}', 'verb' => 'GET'],
        // File metadata endpoint
        ['name' => 'file#getFile', 'url' => '/api/file/{fileId}', 'verb' => 'GET'],
        // Preview endpoint
        ['name' => 'file#preview', 'url' => '/api/preview/{fileId}', 'verb' => 'GET'],
        // Store a browser-rendered thumbnail for a CAD file
        ['name' => 'file#thumbnail', 'url' => '/api/thumbnail/{fileId}', 'verb' => 'POST'],
        // Save edited drawing content back to a DXF file
        ['name' => 'file#save', 'url' => '/api/save/{fileId}', 'verb' => 'POST'],
        // Admin settings endpoint
        ['name' => 'AdminSettings#index', 'url' => '/settings/admin', 'verb' => 'GET'],
        ['name' => 'AdminSettings#settings', 'url' => '/settings/save', 'verb' => 'POST'],
    ],
];
