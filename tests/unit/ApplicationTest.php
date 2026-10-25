<?php

declare(strict_types=1);

/**
 * Cad Viewer Application bootstrap test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\AppInfo\Application
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\AppInfo\Application;
use OCA\CadViewer\Listener\LoadViewer;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\Files\IMimeTypeDetector;
use OCP\IConfig;
use OCP\IServerContainerExtended;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for the Application bootstrap.
 */
class ApplicationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        \OC::$server = $this->createStub(IServerContainerExtended::class);
        $config = $this->createStub(IConfig::class);
        \OC::$server->method('get')->willReturn($config);
    }

    public function testAppId(): void
    {
        $this->assertSame('cad_viewer', Application::APP_ID);
    }

    public function testConstructor(): void
    {
        $this->assertInstanceOf(Application::class, new Application());
    }

    public function testImplementsIBootstrap(): void
    {
        $this->assertInstanceOf(IBootstrap::class, new Application());
    }

    public function testMimeTypesConstant(): void
    {
        $this->assertArrayHasKey(Application::CANONICAL_DWG_MIME, Application::MIME_TYPES);
        $this->assertSame('dwg', Application::MIME_TYPES[Application::CANONICAL_DWG_MIME]);
    }

    public function testMimeTypeAliasesConstant(): void
    {
        $this->assertSame(Application::CANONICAL_DWG_MIME, Application::MIME_TYPE_ALIASES['application/acad']);
    }

    /**
     * register() must wire the LoadViewer listener to each supported event
     * exactly once.
     */
    public function testRegisterRegistersAllEvents(): void
    {
        $app = new Application();
        $context = $this->createStub(IRegistrationContext::class);

        $expected = [
            LoadAdditionalScriptsEvent::class,
            BeforeTemplateRenderedEvent::class,
        ];

        $calls = [];
        $context->method('registerEventListener')
            ->willReturnCallback(function (string $event, string $listener) use (&$calls): void {
                $calls[] = [$event, $listener];
            });

        $app->register($context);

        $this->assertCount(count($expected), $calls);
        foreach ($expected as $event) {
            $matches = array_filter($calls, static fn (array $call): bool => $call[0] === $event);
            $this->assertCount(1, $matches, "Expected exactly one registration for {$event}");
            $this->assertSame(LoadViewer::class, array_values($matches)[0][1]);
        }
    }

    /**
     * boot() must register the DWG and DXF MIME types through the detector.
     */
    public function testBootRegistersMimeTypes(): void
    {
        $app = new Application();

        $detector = $this->createMock(IMimeTypeDetector::class);
        $detector->expects($this->once())->method('getAllMappings')->willReturn([]);
        $detector->expects($this->exactly(2))
            ->method('registerType')
            ->with(
                $this->logicalOr($this->equalTo('dwg'), $this->equalTo('dxf')),
                $this->logicalOr(
                    $this->equalTo(Application::CANONICAL_DWG_MIME),
                    $this->equalTo(Application::CANONICAL_DXF_MIME),
                ),
            );

        $context = $this->createMock(IBootContext::class);
        $context->expects($this->once())
            ->method('injectFn')
            ->willReturnCallback(static function (callable $callback) use ($detector): void {
                $callback($detector);
            });

        $app->boot($context);
    }
}