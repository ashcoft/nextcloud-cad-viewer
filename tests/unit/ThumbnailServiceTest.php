<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Tests\unit;

use OCA\CadViewer\Service\ThumbnailService;
use OCP\Files\AppData\IAppDataFactory;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

#[AllowMockObjectsWithoutExpectations]
class ThumbnailServiceTest extends TestCase
{
    private function service(): ThumbnailService
    {
        $appDataFactory = $this->createMock(IAppDataFactory::class);
        $logger = $this->createMock(LoggerInterface::class);

        return new ThumbnailService($appDataFactory, $logger);
    }

    public function testDecodesValidPngDataUrl(): void
    {
        $png = "\x89PNG\r\n\x1a\n" . 'rest-of-image-bytes';
        $dataUrl = 'data:image/png;base64,' . base64_encode($png);

        $result = $this->service()->decodePngDataUrl($dataUrl);

        $this->assertNotNull($result);
        $this->assertSame($png, $result['binary']);
        $this->assertSame('image/png', $result['mimeType']);
    }

    public function testRejectsNonPngPrefix(): void
    {
        $this->assertNull($this->service()->decodePngDataUrl('data:image/svg+xml;base64,PHN2Zz4='));
    }

    public function testRejectsPngDataUrlWithoutPngSignature(): void
    {
        $dataUrl = 'data:image/png;base64,' . base64_encode('not a png');

        $this->assertNull($this->service()->decodePngDataUrl($dataUrl));
    }

    public function testRejectsPlainString(): void
    {
        $this->assertNull($this->service()->decodePngDataUrl('hello'));
    }

    public function testRejectsInvalidBase64(): void
    {
        $this->assertNull($this->service()->decodePngDataUrl('data:image/png;base64,@@@@'));
    }

    public function testRejectsOversizedImage(): void
    {
        $png = "\x89PNG\r\n\x1a\n" . str_repeat('a', 6 * 1024 * 1024);
        $dataUrl = 'data:image/png;base64,' . base64_encode($png);

        $this->assertNull($this->service()->decodePngDataUrl($dataUrl));
    }
}
