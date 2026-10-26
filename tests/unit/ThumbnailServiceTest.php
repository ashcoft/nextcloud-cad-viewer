<?php

declare(strict_types=1);

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

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\Service\ThumbnailService;
use OCP\Files\AppData\IAppDataFactory;
use OCP\Files\File;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * An in-memory ISimpleFolder so the service's real storage logic runs.
 */
class InMemoryFolder implements ISimpleFolder
{
    /** @var array<string, InMemoryFile> */
    public array $files = [];

    public function getDirectoryListing(): array
    {
        return array_values($this->files);
    }

    public function fileExists(string $name): bool
    {
        return isset($this->files[$name]);
    }

    public function getFile(string $name): ISimpleFile
    {
        return $this->files[$name];
    }

    public function newFile(string $name, mixed $content = null): ISimpleFile
    {
        $file = new InMemoryFile($name, is_string($content) ? $content : '', $this);
        $this->files[$name] = $file;
        return $file;
    }

    public function remove(string $name): void
    {
        unset($this->files[$name]);
    }

    public function delete(): void
    {
        $this->files = [];
    }

    public function getName(): string
    {
        return 'thumbnails';
    }

    public function getFolder(string $name): ISimpleFolder
    {
        return $this;
    }

    public function newFolder(string $path): ISimpleFolder
    {
        return $this;
    }
}

class InMemoryFile implements ISimpleFile
{
    public function __construct(
        private readonly string $name,
        private string $content,
        private readonly ?InMemoryFolder $folder = null,
    ) {
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function delete(): void
    {
        $this->folder?->remove($this->name);
        $this->content = '';
    }

    public function getSize(): int|float
    {
        return strlen($this->content);
    }

    public function getETag(): string
    {
        return '';
    }

    public function getMTime(): int
    {
        return 0;
    }

    public function putContent($data): void
    {
        $this->content = (string) $data;
    }

    public function getMimeType(): string
    {
        return 'image/png';
    }

    public function getExtension(): string
    {
        return 'png';
    }

    public function read()
    {
        return $this->content;
    }

    public function write()
    {
        return true;
    }
}

/**
 * Test suite for the ThumbnailService.
 */
#[AllowMockObjectsWithoutExpectations]
class ThumbnailServiceTest extends TestCase
{
    private const PNG = "\x89PNG\r\n\x1a\n\x00\x00\x00\x0dIHDR";

    /**
     * A minimal valid 1x1 PNG so decodability checks can pass.
     */
    private function validPng(): string
    {
        return (string) base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
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
        $dataUrl = 'data:image/png;base64,' . base64_encode(self::PNG);

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

    public function testStoresAndReturnsThumbnail(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);
        $file = $this->file(42, 'etag-a');

        $this->assertTrue($service->storeThumbnail($file, $this->validPng(), 'etag-a'));

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

        $this->assertFalse($service->storeThumbnail($this->file(42, 'etag-b'), $this->validPng(), 'etag-a'));
        $this->assertSame([], $folder->files);
    }

    public function testUploadWithoutEtagIsAccepted(): void
    {
        $folder = new InMemoryFolder();
        $service = $this->service($folder);

        $this->assertTrue($service->storeThumbnail($this->file(42, 'etag-a'), $this->validPng()));
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

    public function testGetThumbnailReturnsNullWhenMissing(): void
    {
        $this->assertNull($this->service(new InMemoryFolder())->getThumbnail($this->file(42, 'etag-a')));
    }
}
