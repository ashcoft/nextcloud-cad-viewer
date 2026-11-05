<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Controller;

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\NotFoundResponse;
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http\StreamResponse;
use OCP\IRequest;

/**
 * Serves the CAD viewer's runtime worker/WASM assets.
 *
 * The viewer loads these files by URL at runtime, not through the bundle. Its
 * MTEXT worker URL is hardcoded to "./assets/<name>" relative to the page, so
 * with URL rewriting off (the default) that resolves to a route under
 * /apps/cad_viewer/assets/. This controller answers those requests. When
 * rewriting is on the web server serves the same files statically instead.
 */
class AssetController extends Controller
{
    /**
     * Assets that may be served, with their content types.
     *
     * An allowlist keeps path traversal out of the file lookup.
     */
    private const ASSETS = [
        'libredwg-parser-worker.js' => 'application/javascript',
        'libredwg-web.wasm' => 'application/wasm',
        'mtext-renderer-worker.js' => 'application/javascript',
    ];

    public function __construct(
        string $appName,
        IRequest $request,
    ) {
        parent::__construct($appName, $request);
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    public function get(string $file): Response
    {
        if (!isset(self::ASSETS[$file])) {
            return new NotFoundResponse();
        }

        $path = __DIR__ . '/../../assets/' . $file;
        if (!is_file($path)) {
            return new NotFoundResponse();
        }

        $stream = fopen($path, 'rb');
        if ($stream === false) {
            return new NotFoundResponse();
        }

        $response = new StreamResponse($stream);
        $response->addHeader('Content-Type', self::ASSETS[$file]);
        $response->addHeader('Content-Length', (string) filesize($path));

        $policy = self::contentSecurityPolicyFor($file);
        if ($policy !== null) {
            $response->setContentSecurityPolicy($policy);
        }

        // The file name is stable across releases, so do not cache it
        // immutably: a new app version must be able to replace the worker.
        // Let the browser revalidate, using the mtime as the validator.
        $response->addHeader('Cache-Control', 'public, no-cache, must-revalidate');
        $mtime = filemtime($path);
        if ($mtime !== false) {
            $response->setLastModified(new \DateTime('@' . $mtime));
        }

        return $response;
    }

    /**
     * CSP for an asset, or null when Nextcloud's default policy is enough.
     *
     * A worker loaded by URL is governed by the CSP on its own script response,
     * not by the page's. The MTEXT worker fetches fonts from the viewer's CDN,
     * so its response needs the same allowance as the viewer page, or those
     * font requests stay blocked and MTEXT text fails to render.
     */
    private static function contentSecurityPolicyFor(string $file): ?ContentSecurityPolicy
    {
        if ($file !== 'mtext-renderer-worker.js') {
            return null;
        }

        $policy = new ContentSecurityPolicy();
        $policy->addAllowedConnectDomain(Application::VIEWER_RESOURCE_CDN);

        return $policy;
    }
}
