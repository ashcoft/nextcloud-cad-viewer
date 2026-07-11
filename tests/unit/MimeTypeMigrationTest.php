<?php

declare(strict_types=1);

/**
 * Cad Viewer mimetype migration test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @author   CAD Viewer Contributors <contributors@cadviewer.local>
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Migration\MimeTypeBase
 * @covers \OCA\CadViewer\Migration\MimeTypeInstall
 * @covers \OCA\CadViewer\Migration\MimeTypeUninstall
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\Migration\MimeTypeInstall;
use OCA\CadViewer\Migration\MimeTypeUninstall;
use OCP\Files\IMimeTypeLoader;
use OCP\Migration\IOutput;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the DWG/DXF mimetype repair steps.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @author   CAD Viewer Contributors <contributors@cadviewer.local>
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 */
class MimeTypeMigrationTest extends TestCase
{
    private string $configDir;
    private IMimeTypeLoader $mimeTypeLoader;
    private LoggerInterface $logger;
    private IOutput $output;

    protected function setUp(): void
    {
        parent::setUp();

        // Use a temporary config directory so the migration writes its
        // mapping / aliases files somewhere harmless.
        $this->configDir = sys_get_temp_dir() . '/cadviewer_mime_' . uniqid();
        mkdir($this->configDir);
        \OC::$configDir = $this->configDir;

        $this->mimeTypeLoader = $this->createMock(IMimeTypeLoader::class);
        $this->logger = $this->createMock(LoggerInterface::class);
        $this->output = $this->createMock(IOutput::class);
    }

    protected function tearDown(): void
    {
        // Best effort cleanup of the temporary config directory.
        foreach (glob($this->configDir . '/*') ?: [] as $file) {
            @unlink($file);
        }
        @rmdir($this->configDir);
        \OC::$configDir = '';

        parent::tearDown();
    }

    public function testInstallRegistersCanonicalMimesAndUpdatesFilecache(): void
    {
        $this->mimeTypeLoader->method('getId')
            ->willReturnCallback(fn (string $mime): int => match ($mime) {
                'application/dwg' => 10,
                'image/vnd.dxf' => 20,
                default => 1,
            });
        $this->mimeTypeLoader->expects($this->exactly(2))
            ->method('updateFilecache')
            ->withConsecutive(
                ['dwg', 10],
                ['dxf', 20],
            );

        $step = new MimeTypeInstall($this->mimeTypeLoader, $this->logger);
        $step->run($this->output);

        $mapping = json_decode((string) file_get_contents($this->configDir . '/mimetypemapping.json'), true);
        $this->assertSame(['application/dwg'], $mapping['dwg']);
        $this->assertSame(['image/vnd.dxf'], $mapping['dxf']);

        $aliases = json_decode((string) file_get_contents($this->configDir . '/mimetypealiases.json'), true);
        $this->assertSame('dwg', $aliases['application/dwg']);
        $this->assertSame('dxf', $aliases['image/vnd.dxf']);
    }

    public function testUninstallRevertsFilecacheAndRemovesMapping(): void
    {
        // Seed the config files so we can verify they get cleaned up.
        file_put_contents(
            $this->configDir . '/mimetypemapping.json',
            (string) json_encode(['dwg' => ['application/dwg'], 'dxf' => ['image/vnd.dxf']]),
        );

        $this->mimeTypeLoader->method('getId')
            ->willReturnCallback(fn (string $mime): int => $mime === 'application/octet-stream' ? 99 : 1);
        $this->mimeTypeLoader->expects($this->exactly(2))
            ->method('updateFilecache')
            ->withConsecutive(
                ['dwg', 99],
                ['dxf', 99],
            );

        $step = new MimeTypeUninstall($this->mimeTypeLoader, $this->logger);
        $step->run($this->output);

        $mapping = json_decode((string) file_get_contents($this->configDir . '/mimetypemapping.json'), true);
        $this->assertArrayNotHasKey('dwg', $mapping);
        $this->assertArrayNotHasKey('dxf', $mapping);
    }
}
