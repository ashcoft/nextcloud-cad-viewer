<?php

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

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Listener\DeleteThumbnail;
use OCA\CadViewer\Service\ThumbnailService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\BeforeNodeDeletedEvent;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\File;
use OCP\Files\Folder;
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
        $file->method('getName')->willReturn('plan.dwg');

        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->once())->method('deleteForFileId')->with(42);

        (new DeleteThumbnail($service))->handle(new NodeDeletedEvent($file));
    }

    /**
     * A non-CAD deletion cannot have a thumbnail, so it must not scan the
     * shared thumbnail folder.
     */
    public function testIgnoresNonCadFiles(): void
    {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);
        $file->method('getName')->willReturn('report.pdf');

        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->never())->method('deleteForFileId');

        (new DeleteThumbnail($service))->handle(new NodeDeletedEvent($file));
    }

    public function testIgnoresFolderDeletions(): void
    {
        $folder = $this->createMock(Node::class);

        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->never())->method('deleteForFileId');

        (new DeleteThumbnail($service))->handle(new NodeDeletedEvent($folder));
    }

    /**
     * A folder deletion reports only the folder, so its drawings must be found
     * from the "before" event while the subtree still exists.
     */
    public function testRemovesThumbnailsOfDrawingsInsideADeletedFolder(): void
    {
        $dwg = $this->createMock(File::class);
        $dwg->method('getId')->willReturn(7);
        $dwg->method('getName')->willReturn('plan.dwg');
        $readme = $this->createMock(File::class);
        $readme->method('getName')->willReturn('readme.txt');

        $folder = $this->createMock(Folder::class);
        $folder->method('searchByMime')->willReturnCallback(
            static fn (string $mime) => $mime === 'application' ? [$dwg, $readme] : []
        );

        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->once())->method('deleteForFileId')->with(7);

        (new DeleteThumbnail($service))->handle(new BeforeNodeDeletedEvent($folder));
    }

    public function testIgnoresUnrelatedEvents(): void
    {
        $service = $this->createMock(ThumbnailService::class);
        $service->expects($this->never())->method('deleteForFileId');

        (new DeleteThumbnail($service))->handle(new class () extends Event {
        });
    }
}
