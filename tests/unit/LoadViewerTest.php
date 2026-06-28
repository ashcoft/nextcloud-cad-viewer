<?php

declare(strict_types=1);

/**
 * Cad Viewer LoadViewer listener test suite.
 *
 * PHP version 8.3
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @author   CAD Viewer Contributors <contributors@cadviewer.local>
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Listener\LoadViewer
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\AppInfo\Application;
use OCA\CadViewer\Listener\LoadViewer;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for LoadViewer listener.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @author   CAD Viewer Contributors <contributors@cadviewer.local>
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 */
class LoadViewerTest extends TestCase
{
    /**
     * The LoadViewer listener instance.
     *
     * @var LoadViewer
     */
    private LoadViewer $_listener;

    /**
     * Set up test fixtures.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->_listener = new LoadViewer();
    }

    /**
     * Helper: build a BeforeTemplateRenderedEvent stub whose response returns
     * the given app name from getApp().
     *
     * Uses the real stub constructor (so $login is correctly initialised) and
     * injects the response via setResponse() added in BUG 5.
     *
     * @param string $appName The app name the response stub will return.
     *
     * @return BeforeTemplateRenderedEvent
     */
    private function _makeBeforeTemplateRenderedEvent(
        string $appName,
    ): BeforeTemplateRenderedEvent {
        $response = new class ($appName) {
            public function __construct(private readonly string $app)
            {
            }

            public function getApp(): string
            {
                return $this->app;
            }

            public function getRenderAs(): string
            {
                return 'user';
            }

            public function getTemplateName(): string
            {
                return 'main';
            }
        };

        $event = new BeforeTemplateRenderedEvent(); // $login defaults to false ✓
        $event->setResponse($response);
        return $event;
    }

    /**
     * Test that a non-BeforeTemplateRenderedEvent is silently ignored.
     *
     * @return void
     */
    public function testHandleIgnoresNonBeforeTemplateRenderedEvent(): void
    {
        $genericEvent = new class () extends Event {
        };
        // Should return early without any error or exception
        $this->_listener->handle($genericEvent);
        $this->addToAssertionCount(1);
    }

    /**
     * Test that handle() does nothing for an unsupported app name.
     *
     * @return void
     */
    public function testHandleIgnoresUnsupportedApp(): void
    {
        $event = $this->_makeBeforeTemplateRenderedEvent('dashboard');
        // Should return early - no scripts/styles injected, no exception
        $this->_listener->handle($event);
        $this->addToAssertionCount(1);
    }

    /**
     * Test that handle() injects scripts and styles for the 'files' app.
     *
     * @return void
     */
    public function testHandleAddsAssetsForFilesApp(): void
    {
        $event = $this->_makeBeforeTemplateRenderedEvent('files');
        // Must reach Util::addScript / Util::addStyle without throwing
        $this->_listener->handle($event);
        $this->addToAssertionCount(1);
    }

    /**
     * Test that handle() injects scripts and styles for the 'files_sharing' app.
     *
     * @return void
     */
    public function testHandleAddsAssetsForFilesSharingApp(): void
    {
        $event = $this->_makeBeforeTemplateRenderedEvent('files_sharing');
        $this->_listener->handle($event);
        $this->addToAssertionCount(1);
    }

    /**
     * Test that handle() injects scripts and styles for the CAD viewer app.
     *
     * @return void
     */
    public function testHandleAddsAssetsForCadViewerApp(): void
    {
        $event = $this->_makeBeforeTemplateRenderedEvent(Application::APP_ID);
        $this->_listener->handle($event);
        $this->addToAssertionCount(1);
    }

    /**
     * Test that handle() silently ignores an empty app name (boundary case).
     *
     * @return void
     */
    public function testHandleIgnoresEmptyAppName(): void
    {
        $event = $this->_makeBeforeTemplateRenderedEvent('');
        $this->_listener->handle($event);
        $this->addToAssertionCount(1);
    }

    /**
     * Test that LoadViewer implements IEventListener.
     *
     * @return void
     */
    public function testImplementsIEventListener(): void
    {
        $this->assertInstanceOf(
            \OCP\EventDispatcher\IEventListener::class,
            $this->_listener,
        );
    }

    /**
     * Regression: only the three whitelisted apps trigger asset injection.
     *
     * @return void
     */
    public function testHandleIgnoresPartiallyMatchingAppName(): void
    {
        foreach (['file', 'Files', 'FILES', 'files_', 'cad_viewer_extra'] as $app) {
            $event = $this->_makeBeforeTemplateRenderedEvent($app);
            // Should return early without exception
            $this->_listener->handle($event);
        }
        $this->addToAssertionCount(1);
    }
}
