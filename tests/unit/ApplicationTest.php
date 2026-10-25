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
use OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent as FilesSharingBeforeTemplateRenderedEvent;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
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
     * register() must wire the LoadViewer listener to every supported event.
     */
    public function testRegisterRegistersAllEvents(): void
    {
        $app = new Application();
        $context = $this->createStub(IRegistrationContext::class);

        $expected = [
            LoadAdditionalScriptsEvent::class,
            FilesSharingBeforeTemplateRenderedEvent::class,
            BeforeTemplateRenderedEvent::class,
        ];

        $registered = [];
        $context->method('registerEventListener')
            ->willReturnCallback(function (string $event, string $listener) use (&$registered): void {
                $registered[$event] = $listener;
            });

        $app->register($context);

        foreach ($expected as $event) {
            $this->assertArrayHasKey($event, $registered);
            $this->assertSame(LoadViewer::class, $registered[$event]);
        }
    }

    public function testBootRegistersMimeTypes(): void
    {
        $app = new Application();
        $context = $this->createStub(IBootContext::class);
        $app->boot($context);
        $this->addToAssertionCount(1);
    }
}
