<?php

declare(strict_types=1);

/**
 * Cad Viewer LoadViewer listener test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Listener\LoadViewer
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\AppInfo\Application;
use OCA\CadViewer\Listener\LoadViewer;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for the LoadViewer listener.
 */
class LoadViewerTest extends TestCase
{
    private LoadViewer $_listener;

    protected function setUp(): void
    {
        parent::setUp();
        $this->_listener = new LoadViewer();
    }

    /**
     * Build a BeforeTemplateRenderedEvent whose response reports the given app.
     */
    private function makeTemplateEvent(string $appName): BeforeTemplateRenderedEvent
    {
        $response = new class ($appName) {
            public function __construct(private readonly string $app)
            {
            }

            public function getApp(): string
            {
                return $this->app;
            }
        };

        $event = new BeforeTemplateRenderedEvent();
        $event->setResponse($response);
        return $event;
    }

    public function testImplementsIEventListener(): void
    {
        $this->assertInstanceOf(IEventListener::class, $this->_listener);
    }

    public function testHandleIgnoresUnrelatedEvent(): void
    {
        $this->_listener->handle(new class () extends Event {
        });
        $this->addToAssertionCount(1);
    }

    public function testHandleLoadsAssetsForFilesApp(): void
    {
        $this->_listener->handle(new LoadAdditionalScriptsEvent());
        $this->addToAssertionCount(1);
    }

    public function testHandleLoadsAssetsForCadViewerApp(): void
    {
        $this->_listener->handle($this->makeTemplateEvent(Application::APP_ID));
        $this->addToAssertionCount(1);
    }

    public function testHandleIgnoresOtherApps(): void
    {
        foreach (['dashboard', 'files', '', 'cad_viewer_extra'] as $app) {
            $this->_listener->handle($this->makeTemplateEvent($app));
        }
        $this->addToAssertionCount(1);
    }
}
