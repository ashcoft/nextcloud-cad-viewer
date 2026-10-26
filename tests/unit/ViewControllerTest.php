<?php

/**
 * Cad Viewer ViewController test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Controller\ViewController
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Controller\ViewController;
use OCA\CadViewer\Service\BlankDrawingService;
use OCA\CadViewer\Service\RecentDrawingsService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\Files\File;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the app's page controller.
 */
#[AllowMockObjectsWithoutExpectations]
class ViewControllerTest extends TestCase
{
    private function controller(
        ?IRequest $request = null,
        ?BlankDrawingService $blankDrawings = null,
    ): ViewController {
        return new ViewController(
            'cad_viewer',
            $request ?? $this->createMock(IRequest::class),
            $this->createMock(RecentDrawingsService::class),
            $blankDrawings ?? $this->createMock(BlankDrawingService::class),
            $this->createMock(LoggerInterface::class),
        );
    }

    /**
     * The app menu links to this route without a request token. Without
     * NoCSRFRequired Nextcloud rejects the navigation with "CSRF check
     * failed", which is exactly the bug this guards against.
     */
    public function testIndexCanBeOpenedWithoutARequestToken(): void
    {
        $method = new \ReflectionMethod(ViewController::class, 'index');

        $this->assertNotEmpty($method->getAttributes(NoCSRFRequired::class));
        $this->assertNotEmpty($method->getAttributes(NoAdminRequired::class));
    }

    /**
     * Creating a file changes state, so it must keep CSRF protection.
     */
    public function testCreateBlankKeepsCsrfProtection(): void
    {
        $method = new \ReflectionMethod(ViewController::class, 'createBlank');

        $this->assertEmpty($method->getAttributes(NoCSRFRequired::class));
    }

    public function testCreateBlankReturnsTheNewFileId(): void
    {
        $request = $this->createMock(IRequest::class);
        $request->method('getParam')->with('name', '')->willReturn('Plan');

        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);

        $service = $this->createMock(BlankDrawingService::class);
        $service->expects($this->once())
            ->method('create')
            ->with('Plan')
            ->willReturn($file);

        $response = $this->controller($request, $service)->createBlank();

        $this->assertSame(Http::STATUS_CREATED, $response->getStatus());
        $this->assertSame(['fileId' => 42], $response->getData());
    }

    public function testCreateBlankReportsFailures(): void
    {
        $service = $this->createMock(BlankDrawingService::class);
        $service->method('create')->willThrowException(new \RuntimeException('quota'));

        $response = $this->controller(null, $service)->createBlank();

        $this->assertSame(Http::STATUS_INTERNAL_SERVER_ERROR, $response->getStatus());
        $this->assertArrayHasKey('error', $response->getData());
    }

    public function testBlankRouteIsAPostEndpoint(): void
    {
        $routes = require __DIR__ . '/../../appinfo/routes.php';

        $blankRoutes = array_values(array_filter(
            $routes['routes'],
            static fn (array $route): bool => $route['name'] === 'view#createBlank',
        ));

        $this->assertCount(1, $blankRoutes);
        $this->assertSame('POST', $blankRoutes[0]['verb']);
    }
}
