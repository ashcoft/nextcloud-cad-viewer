<?php

/**
 * Cad Viewer BlankDrawingService test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Service\BlankDrawingService
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Service\BlankDrawingService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;

/**
 * Test suite for the blank drawing creation logic.
 */
#[AllowMockObjectsWithoutExpectations]
class BlankDrawingServiceTest extends TestCase
{
    /**
     * Build the service with a user folder double.
     *
     * @param array{0: string, 1: string|null}|null $written Receives the name
     *                                                      and content passed
     *                                                      to newFile().
     */
    private function service(?array &$written = null): BlankDrawingService
    {
        $user = $this->createMock(IUser::class);
        $user->method('getUID')->willReturn('alice');

        $userSession = $this->createMock(IUserSession::class);
        $userSession->method('getUser')->willReturn($user);

        $folder = $this->createMock(Folder::class);
        $folder->method('nodeExists')->willReturn(false);

        $file = $this->createMock(File::class);
        $file->method('getId')->willReturn(42);
        $folder->method('newFile')->willReturnCallback(
            static function (string $name, ?string $content = null) use (&$written, $file): File {
                $written = [$name, $content];

                return $file;
            },
        );

        $rootFolder = $this->createMock(IRootFolder::class);
        $rootFolder->method('getUserFolder')->with('alice')->willReturn($folder);

        return new BlankDrawingService($rootFolder, $userSession);
    }

    public function testNormalizeFallsBackToDefaultName(): void
    {
        $this->assertSame('Drawing.dxf', BlankDrawingService::normalizeFileName(''));
        $this->assertSame('Drawing.dxf', BlankDrawingService::normalizeFileName('   '));
        $this->assertSame('Drawing.dxf', BlankDrawingService::normalizeFileName(' . '));
    }

    public function testNormalizeAddsDxfExtensionAndDropsGivenCadExtension(): void
    {
        $this->assertSame('plan.dxf', BlankDrawingService::normalizeFileName('plan'));
        $this->assertSame('plan.dxf', BlankDrawingService::normalizeFileName('plan.dwg'));
        $this->assertSame('PLAN.dxf', BlankDrawingService::normalizeFileName('PLAN.DXF'));
    }

    public function testNormalizeStripsPathSeparatorsAndInvalidCharacters(): void
    {
        $this->assertSame('a-b-c.dxf', BlankDrawingService::normalizeFileName('a/b\\c'));
        $this->assertSame('what.dxf', BlankDrawingService::normalizeFileName('what?'));
    }

    public function testNormalizeKeepsUnicodeNames(): void
    {
        $this->assertSame('Grundriss für Küche.dxf', BlankDrawingService::normalizeFileName('Grundriss für Küche'));
    }

    public function testNormalizeTruncatesVeryLongNames(): void
    {
        $name = BlankDrawingService::normalizeFileName(str_repeat('a', 500));

        $this->assertSame(BlankDrawingService::MAX_NAME_LENGTH + strlen('.dxf'), strlen($name));
        $this->assertStringEndsWith('.dxf', $name);
    }

    public function testCreateWritesBlankDxf(): void
    {
        $written = null;
        $file = $this->service($written)->create('');

        $this->assertInstanceOf(File::class, $file);
        $this->assertSame(42, $file->getId());

        $this->assertNotNull($written);
        [$name, $content] = $written;
        $this->assertSame('Drawing.dxf', $name);
        $this->assertStringStartsWith("0\nSECTION", (string) $content);
        $this->assertStringContainsString('ENTITIES', (string) $content);
        $this->assertStringEndsWith("EOF\n", (string) $content);
    }

    public function testCreateNeverOverwritesAnExistingDrawing(): void
    {
        $user = $this->createMock(IUser::class);
        $user->method('getUID')->willReturn('alice');

        $userSession = $this->createMock(IUserSession::class);
        $userSession->method('getUser')->willReturn($user);

        $folder = $this->createMock(Folder::class);
        $folder->expects($this->exactly(2))
            ->method('nodeExists')
            ->willReturnOnConsecutiveCalls(true, false);

        $file = $this->createMock(File::class);
        $folder->expects($this->once())
            ->method('newFile')
            ->with('Drawing (1).dxf', $this->stringContains('ENTITIES'))
            ->willReturn($file);

        $rootFolder = $this->createMock(IRootFolder::class);
        $rootFolder->method('getUserFolder')->willReturn($folder);

        $service = new BlankDrawingService($rootFolder, $userSession);
        $service->create('');
    }
}
