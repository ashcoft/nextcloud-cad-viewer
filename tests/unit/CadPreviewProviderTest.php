<?php

/**
 * Cad Viewer CadPreviewProvider test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Preview\CadPreviewProvider
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Config\AppConfig;
use OCA\CadViewer\Preview\CadPreviewProvider;
use OCA\CadViewer\Service\ThumbnailService;
use OCP\Files\File;
use OCP\Files\FileInfo;
use OCP\Preview\IProviderV2;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for the CadPreviewProvider.
 */
#[AllowMockObjectsWithoutExpectations]
class CadPreviewProviderTest extends TestCase
{
    private function provider(string $previews = 'yes'): CadPreviewProvider
    {
        $appConfig = $this->createMock(AppConfig::class);
        $appConfig->method('getPreviews')->willReturn($previews);

        return new CadPreviewProvider(
            $this->createMock(ThumbnailService::class),
            $appConfig,
        );
    }

    public function testImplementsIProviderV2(): void
    {
        $this->assertInstanceOf(IProviderV2::class, $this->provider());
    }

    /**
     * The regex is registered with Nextcloud, so it must match every supported
     * CAD MIME type and nothing else.
     */
    public function testMimeTypeRegexMatchesCadTypesOnly(): void
    {
        foreach (
            [
            'application/acad',
            'application/autocad_dwg',
            'application/dwg',
            'application/x-autocad',
            'application/x-dwg',
            'image/vnd.dwg',
            'image/vnd.dxf',
            'application/dxf',
            'application/x-dxf',
            'image/x-dxf',
            ] as $mime
        ) {
            $this->assertSame(1, preg_match(CadPreviewProvider::MIME_TYPE_REGEX, $mime), $mime);
        }

        foreach (['application/pdf', 'text/plain', 'image/png', 'application/dwgx'] as $mime) {
            $this->assertSame(0, preg_match(CadPreviewProvider::MIME_TYPE_REGEX, $mime), $mime);
        }
    }

    public function testGetMimeTypeReturnsTheRegisteredRegex(): void
    {
        $this->assertSame(CadPreviewProvider::MIME_TYPE_REGEX, $this->provider()->getMimeType());
    }

    public function testIsUnavailableWhenPreviewsAreDisabled(): void
    {
        $file = $this->createMock(File::class);

        $this->assertFalse($this->provider('no')->isAvailable($file));
    }

    public function testIsUnavailableWithoutACachedThumbnail(): void
    {
        $file = $this->createMock(File::class);

        $this->assertFalse($this->provider()->isAvailable($file));
    }

    public function testIsUnavailableForAFolder(): void
    {
        $this->assertFalse($this->provider()->isAvailable($this->createMock(FileInfo::class)));
    }

    public function testReturnsNullWhenPreviewsAreDisabled(): void
    {
        $file = $this->createMock(File::class);

        $this->assertNull($this->provider('no')->getThumbnail($file, 128, 128));
    }

    public function testReturnsNullWithoutACachedThumbnail(): void
    {
        $file = $this->createMock(File::class);

        $this->assertNull($this->provider()->getThumbnail($file, 128, 128));
    }
}
