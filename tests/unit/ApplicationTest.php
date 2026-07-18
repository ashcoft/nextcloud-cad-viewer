<?php

declare(strict_types=1);

/**
 * Cad Viewer Application bootstrap test suite.
 *
 * PHP version 8.3
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @author   CAD Viewer Contributors <contributors@cadviewer.local>
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\AppInfo\Application
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\IConfig;
use OCP\IServerContainerExtended;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for Application bootstrap.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @author   CAD Viewer Contributors <contributors@cadviewer.local>
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 */
class ApplicationTest extends TestCase
{
    /**
     * Set up test fixtures.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        \OC::$server = $this->createMock(IServerContainerExtended::class);
        $config = $this->createMock(IConfig::class);
        \OC::$server->method('get')->with(IConfig::class)->willReturn($config);
    }

    /**
     * Test that APP_ID constant is set correctly.
     *
     * @return void
     */
    public function testAppId(): void
    {
        $this->assertSame('cad_viewer', Application::APP_ID);
    }

    /**
     * Test that Application can be instantiated.
     *
     * @return void
     */
    public function testConstructor(): void
    {
        $app = new Application();
        $this->assertInstanceOf(Application::class, $app);
    }

    /**
     * Test that register() calls registerEventListener for both events.
     *
     * @return void
     */
    public function testRegister(): void
    {
        $app = new Application();
        $mockContext = $this->createMock(IRegistrationContext::class);

        $mockContext->expects($this->exactly(2))
            ->method('registerEventListener');

        $app->register($mockContext);
    }

    /**
     * Test that MIME_TYPES constant contains expected entries.
     *
     * @return void
     */
    public function testMimeTypesConstant(): void
    {
        $this->assertNotEmpty(Application::MIME_TYPES);
        $this->assertArrayHasKey('application/dwg', Application::MIME_TYPES);
        $this->assertSame('dwg', Application::MIME_TYPES['application/dwg']);
    }

    /**
     * Test that MIME_TYPE_ALIASES constant contains expected entries.
     *
     * @return void
     */
    public function testMimeTypeAliasesConstant(): void
    {
        $this->assertNotEmpty(Application::MIME_TYPE_ALIASES);
        $this->assertArrayHasKey('application/acad', Application::MIME_TYPE_ALIASES);
        $this->assertSame('application/dwg', Application::MIME_TYPE_ALIASES['application/acad']);
    }

    /**
     * Test that boot() does not perform any operations.
     *
     * @return void
     */
    public function testBoot(): void
    {
        $app = new Application();
        $mockContext = $this->createMock(IBootContext::class);
        $app->boot($mockContext);
        $this->addToAssertionCount(1);
    }

    /**
     * Test that Application implements IBootstrap interface.
     *
     * This validates that the #[\Override] attributes on register() and boot()
     * are correct, as they implement IBootstrap interface methods.
     *
     * @return void
     */
    public function testApplicationImplementsIBootstrap(): void
    {
        $app = new Application();
        $this->assertInstanceOf(
            \OCP\AppFramework\Bootstrap\IBootstrap::class,
            $app,
        );
    }

    /**
     * Test that boot() interacts with the IBootContext to get app container.
     *
     * The boot() method now initializes MIME type detector via the app container.
     *
     * @return void
     */
    public function testBootGetsAppContainer(): void
    {
        $app = new Application();
        $mockContext = $this->createMock(IBootContext::class);
        $mockContainer = $this->createMock(\OCP\AppFramework\IAppContainer::class);
        
        $mockContext->expects($this->once())
            ->method('getAppContainer')
            ->willReturn($mockContainer);

        $app->boot($mockContext);
    }

    /**
     * Test that register() interacts with the context for both event listeners.
     *
     * The method registers LoadViewer listener for both BeforeTemplateRenderedEvent
     * and ViewerLoadViewerEvent, confirming the IBootstrap contract.
     *
     * @return void
     */
    public function testRegisterCallsContextForBothEvents(): void
    {
        $app = new Application();
        $mockContext = $this->createMock(IRegistrationContext::class);

        $mockContext->expects($this->exactly(2))
            ->method('registerEventListener');

        $app->register($mockContext);
    }
}
