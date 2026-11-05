<?php

/**
 * Cad Viewer AssetController test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Controller\AssetController
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Controller\AssetController;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for the worker/WASM asset controller.
 */
class AssetControllerTest extends TestCase
{
    private static function policyFor(string $file): ?\OCP\AppFramework\Http\ContentSecurityPolicy
    {
        $method = new \ReflectionMethod(AssetController::class, 'contentSecurityPolicyFor');

        return $method->invoke(null, $file);
    }

    /**
     * A worker loaded by URL is governed by the CSP on its own script response,
     * not by the page's. The MTEXT worker fetches fonts from the viewer's CDN,
     * so its response must allow that origin or MTEXT text fails to render.
     */
    public function testMtextWorkerResponseAllowsTheFontCdn(): void
    {
        $policy = self::policyFor('mtext-renderer-worker.js');

        $this->assertNotNull($policy);
        $this->assertMatchesRegularExpression(
            "/connect-src [^;]*https:\/\/cdn\.jsdelivr\.net/",
            $policy->buildPolicy(),
        );
    }

    /**
     * The other assets do not fetch from the CDN, so they keep Nextcloud's
     * default policy and do not widen the connection allowance.
     */
    public function testOtherAssetsKeepTheDefaultPolicy(): void
    {
        $this->assertNull(self::policyFor('libredwg-parser-worker.js'));
        $this->assertNull(self::policyFor('libredwg-web.wasm'));
    }
}
