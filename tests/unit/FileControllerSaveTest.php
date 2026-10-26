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
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the save endpoint of the FileController.
 *
 * The controller is exercised for real; only its collaborators are doubled.
 */
#[AllowMockObjectsWithoutExpectations]
class FileControllerSaveTest extends TestCase
{
    /**
     * Build a controller whose file lookup resolves to $file.
     */
    private function controller(File $file, array $params = []): FileController
    {
        $user = $this->createMock(IUser::class);
        $user->method('getUID')->willReturn('alice');

        $session = $this->createMock(IUserSession::class);
        $session->method('getUser')->willReturn($user);

        $userFolder = $this->createMock(IUserFolder::class);
        $userFolder->method('getById')->willReturn([$file]);

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
            $this->createMock(AppConfig::class),
        );
    }

    /**
     * A writable DXF file at the given etag.
     */
    private function dxfFile(string $etag = 'etag-a'): File
    {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);
        $file->method('getName')->willReturn('plan.dxf');
        $file->method('getSize')->willReturn(100);
        $file->method('isReadable')->willReturn(true);
        $file->method('isUpdateable')->willReturn(true);
        $file->method('getEtag')->willReturn($etag);
        $file->method('getPath')->willReturn('/alice/plans/plan.dxf');

        return $file;
    }

    public function testSavesContentAndReturnsTheNewVersion(): void
    {
        $file = $this->dxfFile('etag-a');
        $file->expects($this->once())->method('putContent')->with('0\nEOF\n');

        $response = $this->controller($file, ['content' => '0\nEOF\n', 'etag' => 'etag-a'])
            ->save(42);

        $this->assertSame(Http::STATUS_OK, $response->getStatus());
        $this->assertSame('etag-a', $response->getData()['etag']);
    }

    /**
     * A save based on a stale copy must not overwrite a newer version.
     */
    public function testRefusesAStaleSave(): void
    {
        $file = $this->dxfFile('etag-b');
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => '0\nEOF\n', 'etag' => 'etag-a'])
            ->save(42);

        $this->assertSame(Http::STATUS_CONFLICT, $response->getStatus());
    }

    /**
     * There is no DWG encoder, so a DWG must be refused rather than replaced
     * with DXF content under a .dwg name.
     */
    public function testRefusesToSaveADwg(): void
    {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);
        $file->method('getName')->willReturn('plan.dwg');
        $file->method('getSize')->willReturn(100);
        $file->method('isReadable')->willReturn(true);
        $file->method('isUpdateable')->willReturn(true);
        $file->method('getEtag')->willReturn('etag-a');
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => '0\nEOF\n', 'etag' => 'etag-a'])
            ->save(42);

        $this->assertSame(Http::STATUS_UNSUPPORTED_MEDIA_TYPE, $response->getStatus());
    }

    public function testRefusesToSaveAReadOnlyFile(): void
    {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);
        $file->method('getName')->willReturn('plan.dxf');
        $file->method('getSize')->willReturn(100);
        $file->method('isReadable')->willReturn(true);
        $file->method('isUpdateable')->willReturn(false);
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => '0\nEOF\n', 'etag' => 'etag-a'])
            ->save(42);

        $this->assertSame(Http::STATUS_FORBIDDEN, $response->getStatus());
    }

    public function testRejectsAMissingEtag(): void
    {
        $file = $this->dxfFile();
        $file->expects($this->never())->method('putContent');

        $response = $this->controller($file, ['content' => '0\nEOF\n'])->save(42);

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
     * The load response drives the toolbar, so it must report the folder and
     * whether the file can be saved.
     */
    public function testLoadReportsDirectoryAndSaveCapability(): void
    {
        $file = $this->dxfFile();
        $file->method('getMimeType')->willReturn('image/vnd.dxf');

        $data = $this->controller($file)->load(42)->getData();

        $this->assertSame('/plans', $data['directory']);
        $this->assertTrue($data['canSave']);
    }

    public function testLoadReportsNoSaveForADwg(): void
    {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);
        $file->method('getName')->willReturn('plan.dwg');
        $file->method('getSize')->willReturn(100);
        $file->method('getMimeType')->willReturn('application/dwg');
        $file->method('isReadable')->willReturn(true);
        $file->method('isUpdateable')->willReturn(true);
        $file->method('getEtag')->willReturn('etag-a');
        $file->method('getPath')->willReturn('/alice/plan.dwg');

        $data = $this->controller($file)->load(42)->getData();

        $this->assertSame('/', $data['directory']);
        $this->assertFalse($data['canSave']);
    }
}
