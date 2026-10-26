<?php

/**
 * Cad Viewer RecentDrawingsService test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Service\RecentDrawingsService
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\AppInfo\Application;
use OCA\CadViewer\Service\RecentDrawingsService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the recent drawing lookup.
 */
#[AllowMockObjectsWithoutExpectations]
class RecentDrawingsServiceTest extends TestCase
{
    private function file(
        int $id,
        string $name,
        int $mtime = 0,
        int $size = 1024,
        bool $readable = true,
    ): File {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn($id);
        $file->method('getName')->willReturn($name);
        $file->method('getMTime')->willReturn($mtime);
        $file->method('getSize')->willReturn($size);
        $file->method('isReadable')->willReturn($readable);
        $file->method('getPath')->willReturn('/alice/files/' . $name);

        return $file;
    }

    private function service(
        ?Folder $userFolder = null,
        ?IUserSession $userSession = null,
        ?LoggerInterface $logger = null,
    ): RecentDrawingsService {
        if ($userSession === null) {
            $user = $this->createMock(IUser::class);
            $user->method('getUID')->willReturn('alice');

            $userSession = $this->createMock(IUserSession::class);
            $userSession->method('getUser')->willReturn($user);
        }

        if ($userFolder === null) {
            $userFolder = $this->createMock(Folder::class);
            $userFolder->method('getRecent')->willReturn([]);
        }

        $userFolder->method('getRelativePath')->willReturnCallback(
            static fn (string $path): string => str_starts_with($path, '/alice/files')
                ? substr($path, strlen('/alice/files'))
                : '/' . basename($path),
        );

        $rootFolder = $this->createMock(IRootFolder::class);
        $rootFolder->method('getUserFolder')->with('alice')->willReturn($userFolder);

        return new RecentDrawingsService(
            $rootFolder,
            $userSession,
            $logger ?? $this->createMock(LoggerInterface::class),
        );
    }

    public function testReturnsNewestDrawingsWithinTheLimit(): void
    {
        $older = $this->file(1, 'older.dwg', 100);
        $newer = $this->file(2, 'newer.DXF', 200);

        $userFolder = $this->createMock(Folder::class);
        $userFolder->expects($this->once())
            ->method('getRecent')
            ->with(200)
            ->willReturn([$older, $newer]);

        $result = $this->service($userFolder)->getRecentDrawings(1);

        $this->assertCount(1, $result);
        $this->assertSame(2, $result[0]['id']);
        $this->assertSame('newer.DXF', $result[0]['name']);
        $this->assertSame('/newer.DXF', $result[0]['path']);
        $this->assertSame('dxf', $result[0]['extension']);
        $this->assertSame(200, $result[0]['mtime']);
    }

    public function testSkipsNonDrawingsUnreadableAndOversizedFiles(): void
    {
        $userFolder = $this->createMock(Folder::class);
        $userFolder->method('getRecent')->willReturn([
            $this->file(1, 'notes.txt'),
            $this->file(2, 'secret.dwg', 0, 1024, false),
            $this->file(3, 'huge.dxf', 0, Application::MAX_FILE_SIZE + 1),
            $this->file(4, 'plan.dwg'),
        ]);

        $result = $this->service($userFolder)->getRecentDrawings();

        $this->assertSame([4], array_column($result, 'id'));
    }

    public function testReturnsAnEmptyListWithoutAUser(): void
    {
        $userSession = $this->createMock(IUserSession::class);
        $userSession->method('getUser')->willReturn(null);

        $this->assertSame([], $this->service(null, $userSession)->getRecentDrawings());
    }

    public function testReturnsAnEmptyListForANonPositiveLimit(): void
    {
        $this->assertSame([], $this->service()->getRecentDrawings(0));
    }

    public function testReadFailuresAreLoggedWithoutExceptionDetails(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())
            ->method('warning')
            ->with(
                $this->anything(),
                $this->callback(static fn (array $context): bool => isset($context['error'])
                    && is_string($context['error'])
                    && !isset($context['exception'])),
            );

        $userFolder = $this->createMock(Folder::class);
        $userFolder->method('getRecent')
            ->willThrowException(new \RuntimeException('/secret/internal/path'));

        $this->assertSame([], $this->service($userFolder, null, $logger)->getRecentDrawings());
    }
}
