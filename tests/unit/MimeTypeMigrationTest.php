<?php

declare(strict_types=1);

/**
 * CAD Viewer mime type migration test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 */

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

// Minimal Nextcloud interface stubs required by the migration under test.
// These are only declared when the real Nextcloud core is not available
// (e.g. in the sandboxed unit test harness).
if (!interface_exists(\OCP\Migration\IRepairStep::class, false)) {
    require_once __DIR__ . '/stubs.php';
}

use OCA\CadViewer\Migration\RegisterMimeType;
use OCA\CadViewer\Migration\UnregisterMimeType;
use OCP\Files\IMimeTypeLoader;
use OCP\Migration\IOutput;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the DWG/DXF mime type registration migration.
 *
 * @covers \OCA\CadViewer\Migration\RegisterMimeType
 * @covers \OCA\CadViewer\Migration\UnregisterMimeType
 */
class MimeTypeMigrationTest extends TestCase
{
    private string $configDir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->configDir = sys_get_temp_dir() . '/cad-viewer-mime-' . uniqid('', true) . '/';
        mkdir($this->configDir, 0o777, true);
        \OC::$configDir = $this->configDir;
    }

    protected function tearDown(): void
    {
        $file = $this->configDir . 'mimetypemapping.json';
        if (file_exists($file)) {
            unlink($file);
        }
        rmdir($this->configDir);

        parent::tearDown();
    }

    private function createMimeTypeLoader(): IMimeTypeLoader
    {
        $mimeIds = [
            'application/dwg' => 100,
            'application/acad' => 101,
            'application/autocad_dwg' => 102,
            'application/x-autocad' => 103,
            'application/x-dwg' => 104,
            'image/vnd.dwg' => 105,
            'image/vnd.dxf' => 200,
            'application/dxf' => 201,
            'application/x-dxf' => 202,
            'image/x-dxf' => 203,
            'application/octet-stream' => 1,
        ];

        return new class ($mimeIds) implements IMimeTypeLoader {
            /** @var array<string, int> */
            private array $ids;

            /** @var array<string, int> */
            public array $updated = [];

            public function __construct(array $ids)
            {
                $this->ids = $ids;
            }

            public function getId(string $mimetype): int
            {
                return $this->ids[$mimetype] ?? 999;
            }

            public function updateFilecache(string $ext, int $mimeTypeId): int
            {
                $this->updated[$ext] = $mimeTypeId;

                return 1;
            }
        };
    }

    private function createLogger(): LoggerInterface
    {
        return new class () implements LoggerInterface {
            public function emergency(\Stringable|string $message, array $context = []): void
            {
            }
            public function alert(\Stringable|string $message, array $context = []): void
            {
            }
            public function critical(\Stringable|string $message, array $context = []): void
            {
            }
            public function error(\Stringable|string $message, array $context = []): void
            {
            }
            public function warning(\Stringable|string $message, array $context = []): void
            {
            }
            public function notice(\Stringable|string $message, array $context = []): void
            {
            }
            public function info(\Stringable|string $message, array $context = []): void
            {
            }
            public function debug(\Stringable|string $message, array $context = []): void
            {
            }
            public function log($level, \Stringable|string $message, array $context = []): void
            {
            }
        };
    }

    private function createOutput(): IOutput
    {
        return new class () implements IOutput {
            public function debug(string $message): void
            {
            }
            public function info($message): void
            {
            }
            public function warning($message): void
            {
            }
            public function startProgress($max = 0): void
            {
            }
            public function advance($step = 1, $description = ''): void
            {
            }
            public function finishProgress(): void
            {
            }
        };
    }

    public function testRegisterWritesMappingFile(): void
    {
        $migration = new RegisterMimeType($this->createLogger(), $this->createMimeTypeLoader());
        $migration->run($this->createOutput());

        $file = $this->configDir . 'mimetypemapping.json';
        $this->assertFileExists($file);

        $mapping = json_decode((string) file_get_contents($file), true);
        $this->assertArrayHasKey('dwg', $mapping);
        $this->assertArrayHasKey('dxf', $mapping);
        $this->assertSame('application/dwg', $mapping['dwg'][0]);
        $this->assertSame('image/vnd.dxf', $mapping['dxf'][0]);
    }

    public function testRegisterReclassifiesExistingFiles(): void
    {
        $loader = $this->createMimeTypeLoader();
        $migration = new RegisterMimeType($this->createLogger(), $loader);
        $migration->run($this->createOutput());

        $this->assertSame(100, $loader->updated['dwg']);
        $this->assertSame(200, $loader->updated['dxf']);
    }

    public function testRegisterMergesWithExistingMapping(): void
    {
        $existing = ['pdf' => ['application/pdf']];
        file_put_contents(
            $this->configDir . 'mimetypemapping.json',
            json_encode($existing, JSON_PRETTY_PRINT),
        );

        $migration = new RegisterMimeType($this->createLogger(), $this->createMimeTypeLoader());
        $migration->run($this->createOutput());

        $mapping = json_decode((string) file_get_contents($this->configDir . 'mimetypemapping.json'), true);
        $this->assertArrayHasKey('pdf', $mapping);
        $this->assertArrayHasKey('dwg', $mapping);
        $this->assertArrayHasKey('dxf', $mapping);
    }

    public function testUnregisterRemovesExtensions(): void
    {
        $mapping = [
            'pdf' => ['application/pdf'],
            'dwg' => ['application/dwg'],
            'dxf' => ['image/vnd.dxf'],
        ];
        file_put_contents(
            $this->configDir . 'mimetypemapping.json',
            json_encode($mapping, JSON_PRETTY_PRINT),
        );

        $migration = new UnregisterMimeType($this->createLogger(), $this->createMimeTypeLoader());
        $migration->run($this->createOutput());

        $result = json_decode((string) file_get_contents($this->configDir . 'mimetypemapping.json'), true);
        $this->assertArrayHasKey('pdf', $result);
        $this->assertArrayNotHasKey('dwg', $result);
        $this->assertArrayNotHasKey('dxf', $result);
    }
}
