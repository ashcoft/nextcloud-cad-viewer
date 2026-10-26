<?php

declare(strict_types=1);

/**
 * Cad Viewer DeleteThumbnail listener test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Listener\DeleteThumbnail
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\Listener\DeleteThumbnail;
use OCA\CadViewer\Service\ThumbnailService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\File;
use OCP\Files\Node;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for the DeleteThumbnail listener.
 *
 * The thumbnail storage itself is covered by ThumbnailServiceTest; here the
 * service is doubled so only the listener's own branching is exercised.
 */
#[AllowMockObjectsWithoutExpectations]
class DeleteThumbnailTest extends TestCase
{
    public function testImplementsIEventListener(): void
    {
        $service = $this->createMock(ThumbnailService::class);

        $this->assertInstanceOf(IEventListener::class, new DeleteThumbnail($service));
    }

    public function testRemovesThumbnailsForADeletedFile(): void
    {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);

        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->once())->method('deleteForFileId')->with(42);

        (new DeleteThumbnail($service))->handle(new NodeDeletedEvent($file));
    }

    public function testIgnoresFolderDeletions(): void
    {
        $folder = $this->createMock(Node::class);

        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->never())->method('deleteForFileId');

        (new DeleteThumbnail($service))->handle(new NodeDeletedEvent($folder));
    }

    public function testIgnoresUnrelatedEvents(): void
    {
        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->never())->method('deleteForFileId');

        (new DeleteThumbnail($service))->handle(new class () extends Event {
        });
    }
}
