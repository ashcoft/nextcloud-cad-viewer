<?php

/**
 * Cad Viewer ThumbnailService test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Service\ThumbnailService
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Service\ThumbnailService;
use OCA\CadViewer\Tests\Fixtures\InMemoryFolder;
use OCP\Files\AppData\IAppDataFactory;
use OCP\Files\File;
use OCP\Files\SimpleFS\ISimpleFolder;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the ThumbnailService.
 *
 * The storage doubles live in tests/fixtures so the service's real logic runs
 * against them rather than being mocked away.
 */
#[AllowMockObjectsWithoutExpectations]
class ThumbnailServiceTest extends TestCase
{
    /**
     * A minimal valid 1x1 PNG so decodability checks can pass.
     */
    private function validPng(): string
    {
        return (string) base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAA7EAAAO'
            . 'xAGVKw4bAAAADElEQVQImWP4//8/AAX+Av5Y8msOAAAAAElFTkSuQmCC',
            true
        );
    }

    /**
     * @param InMemoryFolder $folder Receives the folder the service resolves.
     */
    private function service(InMemoryFolder $folder): ThumbnailService
    {
        $appData = new class ($folder) {
            public function __construct(private readonly InMemoryFolder $folder)
            {
            }

            public function getFolder(string $name): ISimpleFolder
            {
                return $this->folder;
            }

            public function newFolder(string $name): ISimpleFolder
            {
                return $this->folder;
            }
        };

        $factory = $this->createMock(IAppDataFactory::class);
        $factory->method('get')->willReturn($appData);
        $logger = $this->createMock(LoggerInterface::class);

        return new ThumbnailService($factory, $logger);
    }

    private function file(int $id, string $etag): File
    {
        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn($id);
        $file->method('getEtag')->willReturn($etag);

        return $file;
    }

    public function testDecodesValidPngDataUrl(): void
    {
        $png = $this->validPng();
        $dataUrl = 'data:image/png;base64,' . base64_encode($png);

        $result = $this->service(new InMemoryFolder())->decodePngDataUrl($dataUrl);

        $this->assertNotNull($result);
        $this->assertSame($png, $result['binary']);
        $this->assertSame('image/png', $result['mimeType']);
    }

    public function testRejectsNonPngPrefix(): void
    {
        $this->assertNull(
            $this->service(new InMemoryFolder())->decodePngDataUrl('data:image/svg+xml;base64,PHN2Zz4=')
        );
    }

    public function testRejectsDataUrlWithoutPngSignature(): void
    {
        $dataUrl = 'data:image/png;base64,' . base64_encode('not a png');

        $this->assertNull($this->service(new InMemoryFolder())->decodePngDataUrl($dataUrl));
    }

    /**
     * A bare PNG signature is not a readable image and must be rejected, so a
     * malformed upload cannot replace a working preview.
     */
    public function testRejectsSignatureOnlyPayload(): void
    {
        $signature = "\x89PNG\r\n\x1a\n\x00\x00\x00\x0dIHDR";
        $dataUrl = 'data:image/png;base64,' . base64_encode($signature);

        $this->assertNull($this->service(new InMemoryFolder())->decodePngDataUrl($dataUrl));
    }

    public function testRejectsPlainString(): void
    {
        $this->assertNull($this->service(new InMemoryFolder())->decodePngDataUrl('hello'));
    }

    public function testRejectsInvalidBase64(): void
    {
        $this->assertNull(
            $this->service(new InMemoryFolder())->decodePngDataUrl('data:image/png;base64,@@@@')
        );
    }

    public function testRejectsOversizedImage(): void
    {
        $png = $this->validPng() . str_repeat('a', 6 * 1024 * 1024);
        $dataUrl = 'data:image/png;base64,' . base64_encode($png);

        $this->assertNull($this->service(new InMemoryFolder())->decodePngDataUrl($dataUrl));
    }

    /**
     * A PNG whose header declares huge dimensions must be rejected: the byte
     * cap does not bound the decoded bitmap.
     */
    public function testRejectsImageWithHugeDimensions(): void
    {
        $png = $this->pngWithDimensions(20000, 20000);
        $dataUrl = 'data:image/png;base64,' . base64_encode($png);

        $this->assertNull($this->service(new InMemoryFolder())->decodePngDataUrl($dataUrl));
    }

    /**
     * A PNG with a complete IHDR chunk but no pixel data is not decodable and
     * must not replace a working preview.
     */
    public function testRejectsTruncatedPng(): void
    {
        // Signature + IHDR chunk header + 1x1 dimensions, then nothing.
        $png = "\x89PNG\r\n\x1a\n\x00\x00\x00\x0dIHDR"
            . pack('N', 1) . pack('N', 1) . "\x08\x06\x00\x00\x00";
        $dataUrl = 'data:image/png;base64,' . base64_encode($png);

        $this->assertNull($this->service(new InMemoryFolder())->decodePngDataUrl($dataUrl));
    }

    /**
     * Build a PNG with the requested dimensions but no real pixel data, so only
     * the dimension guard can reject it.
     */
    private function pngWithDimensions(int $width, int $height): string
    {
        return "\x89PNG\r\n\x1a\n\x00\x00\x00\x0dIHDR"
            . pack('N', $width) . pack('N', $height) . "\x08\x06\x00\x00\x00";
    }

    public function testStoresAndReturnsThumbnail(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);
        $file = $this->file(42, 'etag-a');

        $this->assertSame(ThumbnailService::STORED, $service->storeThumbnail($file, $this->validPng(), 'etag-a'));

        $this->assertNotNull($service->getThumbnail($file));
        $this->assertSame(['42-etag-a.png'], array_keys($folder->files));
    }

    /**
     * Storing a new version must drop the superseded thumbnail instead of
     * leaving it behind.
     */
    public function testStoringNewVersionRemovesOldThumbnail(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);

        $service->storeThumbnail($this->file(42, 'etag-a'), $this->validPng(), 'etag-a');
        $service->storeThumbnail($this->file(42, 'etag-b'), $this->validPng(), 'etag-b');

        $this->assertSame(['42-etag-b.png'], array_keys($folder->files));
    }

    /**
     * An upload tagged with a version the file has already moved past must be
     * rejected, so an edit made while a drawing was open cannot become the
     * preview of the newer version.
     */
    public function testRejectsStaleUpload(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);

        $this->assertSame(
            ThumbnailService::STALE,
            $service->storeThumbnail($this->file(42, 'etag-b'), $this->validPng(), 'etag-a')
        );
        $this->assertSame([], $folder->files);
    }

    public function testUploadWithoutEtagIsAccepted(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);

        $this->assertSame(
            ThumbnailService::STORED,
            $service->storeThumbnail($this->file(42, 'etag-a'), $this->validPng())
        );
    }

    public function testDeleteForFileIdRemovesEveryVersion(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);

        $service->storeThumbnail($this->file(42, 'etag-a'), $this->validPng(), 'etag-a');
        $service->storeThumbnail($this->file(7, 'etag-a'), $this->validPng(), 'etag-a');

        $service->deleteForFileId(42);

        $this->assertSame(['7-etag-a.png'], array_keys($folder->files));
    }

    /**
     * A failed write must not destroy the preview that is already stored.
     */
    public function testFailedWriteKeepsExistingThumbnail(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);

        $this->assertSame(
            ThumbnailService::STORED,
            $service->storeThumbnail($this->file(42, 'etag-a'), $this->validPng(), 'etag-a')
        );

        $failing = new class () {
            public function getFolder(string $name): ISimpleFolder
            {
                throw new \RuntimeException('app data unavailable');
            }
        };

        $factory = $this->createMock(IAppDataFactory::class);
        $factory->method('get')->willReturn($failing);
        $logger = $this->createMock(LoggerInterface::class);
        $failingService = new ThumbnailService($factory, $logger);

        $this->assertSame(
            ThumbnailService::FAILED,
            $failingService->storeThumbnail($this->file(42, 'etag-b'), $this->validPng(), 'etag-b')
        );
        // The etag-a preview must survive the failed etag-b write.
        $this->assertSame(['42-etag-a.png'], array_keys($folder->files));
    }

    public function testGetThumbnailReturnsNullWhenMissing(): void
    {
        $this->assertNull($this->service(new InMemoryFolder())->getThumbnail($this->file(42, 'etag-a')));
    }
}
