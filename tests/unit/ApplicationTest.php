<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2024, CAD Viewer Contributors
 * @license MIT
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\IConfig;
use OCP\IServerContainerExtended;
use PHPUnit\Framework\TestCase;

class ApplicationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        \OC::$server = $this->createMock(IServerContainerExtended::class);
        $config = $this->createMock(IConfig::class);
        \OC::$server->method('get')->with(IConfig::class)->willReturn($config);
    }

    public function testAppId(): void
    {
        $this->assertSame('cad_viewer', Application::APP_ID);
    }

    public function testConstructor(): void
    {
        $app = new Application();
        $this->assertInstanceOf(Application::class, $app);
    }

    public function testRegister(): void
    {
        $app = new Application();
        $mockContext = $this->createMock(IRegistrationContext::class);

        $mockContext->expects($this->once())
            ->method('registerEventListener')
            ->with(
                \OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent::class,
                \OCA\CadViewer\Listener\LoadViewer::class
            );

        $app->register($mockContext);
    }

    public function testBoot(): void
    {
        $app = new Application();
        $mockContext = $this->createMock(\OCP\AppFramework\Bootstrap\IBootContext::class);

        // boot method should do nothing but not throw
        $app->boot($mockContext);
        $this->assertTrue(true);
    }
}
