<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2024, CAD Viewer Contributors
 * @license MIT
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Bootstrap\IBootContext;
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

        // Expect three listener registrations: LoadViewer, RegisterMimeTypes, RegisterMimeTypeAliases
        $mockContext->expects($this->exactly(3))
            ->method('registerEventListener');

        $app->register($mockContext);
    }

    public function testMimeTypesConstant(): void
    {
        $this->assertNotEmpty(Application::MIME_TYPES);
        $this->assertArrayHasKey('application/dwg', Application::MIME_TYPES);
        $this->assertSame('dwg', Application::MIME_TYPES['application/dwg']);
    }

    public function testMimeTypeAliasesConstant(): void
    {
        $this->assertNotEmpty(Application::MIME_TYPE_ALIASES);
        $this->assertArrayHasKey('application/acad', Application::MIME_TYPE_ALIASES);
        $this->assertSame('application/dwg', Application::MIME_TYPE_ALIASES['application/acad']);
    }

    public function testBoot(): void
    {
        $app = new Application();
        $mockContext = $this->createMock(IBootContext::class);

        // boot method should do nothing but not throw
        $app->boot($mockContext);
        $this->assertTrue(true);
    }
}
