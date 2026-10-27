<?php

/**
 * Cad Viewer FileController save endpoint test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Controller\FileController
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Config\AppConfig;
use OCA\CadViewer\Controller\FileController;
use OCA\CadViewer\Service\ThumbnailService;
use OCP\AppFramework\Http;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\IUserSession;
use OCP\Lock\ILockingProvider;
use OCP\Lock\LockedException;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the save endpoint of the FileController.
 *
 * The controller is exercised for real; only its collaborators are doubled.
 * Paths use the shape Nextcloud actually produces, which includes the user's
 * `files` mount segment.
 */
#[AllowMockObjectsWithoutExpectations]
class FileControllerSaveTest extends TestCase
{
    private const DXF = "0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n";

    /**
     * The class getUserFolder() is declared to return by the installed OCP.
     *
     * Read reflectively so the test works on Nextcloud 34/35 (which return a
     * Folder) and on newer versions (which return an IUserFolder). Naming the
     * class directly would make the autoloader warn where it does not exist.
     */
    private function userFolderType(): string
    {
        $type = (new \ReflectionMethod(IRootFolder::class, 'getUserFolder'))->getReturnType();

        return $type instanceof \ReflectionNamedType ? $type->getName() : Folder::class;
    }

    /**
     * Build a controller whose file lookup resolves to $file.
     *
     * @param array<string, mixed> $params Request parameters.
     */
    private function controller(
        File $file,
        array $params = [],
        ?ILockingProvider $locking = null,
        ?AppConfig $appConfig = null,
    ): FileController {
        $user = $this->createMock(IUser::class);
        $user->method('getUID')->willReturn('alice');

        $session = $this->createMock(IUserSession::class);
        $session->method('getUser')->willReturn($user);

        $userFolder = $this->createMock($this->userFolderType());
        $userFolder->method('getById')->willReturn([$file]);
        // Paths carry the /files segment, as in a real Nextcloud install.
        $userFolder->method('getRelativePath')->willReturnCallback(
            static fn (string $path) => str_starts_with($path, '/alice/files')
                ? substr($path, strlen('/alice/files'))
                : null
        );

        $rootFolder = $this->createMock(IRootFolder::class);
        $rootFolder->method('getUserFolder')->willReturn($userFolder);

        $request = $this->createMock(IRequest::class);
        $request->method('getParam')->willReturnCallback(
            static fn (string $name, $default = null) => $params[$name] ?? $default
        );

        return new FileController(
            'cad_viewer',
            $request,
            $rootFolder,
            $session,
            $this->createMock(LoggerInterface::class),
            $this->createMock(IURLGenerator::class),
            $this->createMock(ThumbnailService::class),
            $appConfig ?? $this->createMock(AppConfig::class),
            $locking ?? $this->createMock(ILockingProvider::class),
        );
    }

    /**
     * A writable DXF file.
     *
     * `$etags` are returned by successive getEtag() calls, so a save can be
     * shown to hand back the version it produced rather than the one it read.
     * PHPUnit keeps the *first* stub for a method, so every expectation is
     * configured here in one place instead of being overridden per test.
     *
     * @param list<string> $etags
     */
    private function dxfFile(
        array $etags = ['etag-a'],
        string $path = '/alice/files/plans/plan.dxf',
        bool $updateable = true,
    ): File {
        $parent = $this->createMock(Folder::class);
        $parent->method('getPath')->willReturn(dirname($path));

        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);
        $file->method('getName')->willReturn(basename($path));
        $file->method('getSize')->willReturn(100);
        $file->method('isReadable')->willReturn(true);
        $file->method('isUpdateable')->willReturn($updateable);
        $file->method('getEtag')->willReturnOnConsecutiveCalls(...$etags);
        $file->method('getPath')->willReturn($path);
        $file->method('getParent')->willReturn($parent);

        return $file;
    }

    public function testSavesContentAndReturnsTheNewVersion(): void
    {
        // The etag changes once the content is written.
        $file = $this->dxfFile(['etag-a', 'etag-b']);
        $file->expects($this->once())->method('putContent')->with(self::DXF);

        $locking = $this->createMock(ILockingProvider::class);
        $locking->expects($this->once())
            ->method('acquireLock')
            ->with('/alice/files/plans/plan.dxf', ILockingProvider::LOCK_EXCLUSIVE);
        $locking->expects($this->once())
            ->method('releaseLock')
            ->with('/alice/files/plans/plan.dxf', ILockingProvider::LOCK_EXCLUSIVE);

        $response = $this->controller(
            $file,
            ['content' => self::DXF, 'etag' => 'etag-a'],
            $locking,
        )->save(42);

        $this->assertSame(Http::STATUS_OK, $response->getStatus());
        $this->assertSame('etag-b', $response->getData()['etag']);
    }

    /**
     * A save based on a stale copy must not overwrite a newer version.
     */
    public function testRefusesAStaleSave(): void
    {
        // Another client already wrote etag-b, so the in-lock re-resolve sees a
        // version that no longer matches the one this request loaded.
        $file = $this->dxfFile(['etag-b']);
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => self::DXF, 'etag' => 'etag-a'])
            ->save(42);

        $this->assertSame(Http::STATUS_CONFLICT, $response->getStatus());
    }

    /**
     * The viewer can only serialise DXF, so a save that would exceed the load
     * limit is refused rather than writing a file the app cannot reopen.
     */
    public function testRefusesOversizedContent(): void
    {
        $file = $this->dxfFile();
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, [
            'content' => str_repeat('A', 50 * 1024 * 1024 + 1),
            'etag' => 'etag-a',
        ])->save(42);

        $this->assertSame(Http::STATUS_REQUEST_ENTITY_TOO_LARGE, $response->getStatus());
    }

    /**
     * A locked file cannot be written, and the lock must be released again.
     */
    public function testReportsALockedFile(): void
    {
        $file = $this->dxfFile();
        $file->expects($this->never())->method('putContent');

        $user = $this->createMock(IUser::class);
        $user->method('getUID')->willReturn('alice');
        $session = $this->createMock(IUserSession::class);
        $session->method('getUser')->willReturn($user);
        $userFolder = $this->createMock($this->userFolderType());
        $userFolder->method('getById')->willReturn([$file]);
        $rootFolder = $this->createMock(IRootFolder::class);
        $rootFolder->method('getUserFolder')->willReturn($userFolder);
        $request = $this->createMock(IRequest::class);
        $request->method('getParam')->willReturnCallback(
            static fn (string $name, $default = null) => ['content' => self::DXF, 'etag' => 'etag-a'][$name] ?? $default
        );

        $locking = $this->createMock(ILockingProvider::class);
        $locking->method('acquireLock')->willThrowException(new LockedException('busy'));
        // The lock was never acquired, so it must not be released.
        $locking->expects($this->never())->method('releaseLock');

        $controller = new FileController(
            'cad_viewer',
            $request,
            $rootFolder,
            $session,
            $this->createMock(LoggerInterface::class),
            $this->createMock(IURLGenerator::class),
            $this->createMock(ThumbnailService::class),
            $this->createMock(AppConfig::class),
            $locking,
        );

        $this->assertSame(Http::STATUS_CONFLICT, $controller->save(42)->getStatus());
    }

    /**
     * There is no DWG encoder, so a DWG must be refused rather than replaced
     * with DXF content under a .dwg name.
     */
    public function testRefusesToSaveADwg(): void
    {
        $file = $this->dxfFile(['etag-a'], '/alice/files/plans/plan.dwg');
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => self::DXF, 'etag' => 'etag-a'])
            ->save(42);

        $this->assertSame(Http::STATUS_UNSUPPORTED_MEDIA_TYPE, $response->getStatus());
    }

    public function testRefusesToSaveAReadOnlyFile(): void
    {
        $file = $this->dxfFile(['etag-a'], '/alice/files/plans/plan.dxf', false);
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => self::DXF, 'etag' => 'etag-a'])
            ->save(42);

        $this->assertSame(Http::STATUS_FORBIDDEN, $response->getStatus());
    }

    public function testRejectsAMissingEtag(): void
    {
        $file = $this->dxfFile();
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => self::DXF])->save(42);

        $this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
    }

    public function testRejectsMissingContent(): void
    {
        $file = $this->dxfFile();
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['etag' => 'etag-a'])->save(42);

        $this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
    }

    /**
     * The load response drives the toolbar, so it must report the folder as the
     * Files app names it (without the `files` segment) and whether the file can
     * be saved.
     */
    public function testLoadReportsDirectoryAndSaveCapability(): void
    {
        $file = $this->dxfFile();
        $file->method('getMimeType')->willReturn('image/vnd.dxf');

        $data = $this->controller($file)->load(42)->getData();

        $this->assertSame('/plans', $data['directory']);
        $this->assertTrue($data['canSave']);
    }

    /**
     * A file in the user's root must resolve to `/`, not `/files`.
     */
    public function testLoadReportsRootForAFileInTheUsersRoot(): void
    {
        $file = $this->dxfFile(['etag-a'], '/alice/files/plan.dxf');
        $file->method('getMimeType')->willReturn('image/vnd.dxf');

        $data = $this->controller($file)->load(42)->getData();

        $this->assertSame('/', $data['directory']);
    }

    public function testLoadReportsNoSaveForADwg(): void
    {
        $file = $this->dxfFile(['etag-a'], '/alice/files/plan.dwg');
        $file->method('getMimeType')->willReturn('application/dwg');

        $data = $this->controller($file)->load(42)->getData();

        $this->assertSame('/', $data['directory']);
        $this->assertFalse($data['canSave']);
    }

    /**
     * The viewer theme is an admin setting, so the metadata the client mounts
     * the viewer with has to carry it.
     */
    public function testLoadReportsTheConfiguredTheme(): void
    {
        $file = $this->dxfFile();
        $file->method('getMimeType')->willReturn('image/vnd.dxf');

        $appConfig = $this->createMock(AppConfig::class);
        $appConfig->method('getTheme')->willReturn('dark');

        $data = $this->controller($file, [], null, $appConfig)->load(42)->getData();

        $this->assertSame('dark', $data['theme']);
    }
}
