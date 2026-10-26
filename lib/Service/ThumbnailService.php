<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Service;

use OCP\Files\AppData\IAppDataFactory;
use OCP\Files\File;
use OCP\Files\SimpleFS\ISimpleFile;
use Psr\Log\LoggerInterface;

/**
 * Stores client-rendered CAD thumbnails in the app data directory.
 *
 * CAD rendering happens in the browser (WebGL), so the backend cannot produce
 * a drawing preview on its own. The viewer renders the drawing, uploads the
 * resulting PNG, and the preview provider serves it back for the Files grid.
 *
 * Thumbnails are keyed by file id and etag so they are invalidated whenever the
 * file changes.
 */
class ThumbnailService
{
    private const APP_ID = 'cad_viewer';
    private const FOLDER = 'thumbnails';
    private const MAX_DECODED_BYTES = 5 * 1024 * 1024; // 5MB
    private const PNG_SIGNATURE = "\x89PNG\r\n\x1a\n";

    public function __construct(
        private readonly IAppDataFactory $appDataFactory,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Return the stored thumbnail for a file, or null when none exists.
     */
    public function getThumbnail(File $file): ?ISimpleFile
    {
        try {
            $folder = $this->appDataFactory->get(self::APP_ID)->getFolder(self::FOLDER);
        } catch (\Throwable) {
            return null;
        }

        $name = $this->thumbnailName($file);
        if (!$folder->fileExists($name)) {
            return null;
        }

        try {
            return $folder->getFile($name);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Store a thumbnail for a file, replacing any previous one.
     */
    public function storeThumbnail(File $file, string $binary): void
    {
        try {
            $appData = $this->appDataFactory->get(self::APP_ID);
            try {
                $folder = $appData->getFolder(self::FOLDER);
            } catch (\Throwable) {
                $folder = $appData->newFolder(self::FOLDER);
            }

            $name = $this->thumbnailName($file);
            if ($folder->fileExists($name)) {
                $folder->getFile($name)->delete();
            }
            $folder->newFile($name, $binary);
        } catch (\Throwable $e) {
            $this->logger->warning('CAD Viewer: failed to store thumbnail', [
                'fileId' => $file->getId(),
                'exception' => $e,
            ]);
        }
    }

    /**
     * Validate and decode a PNG data URL into raw bytes.
     *
     * @return array{binary: string, mimeType: string}|null
     */
    public function decodePngDataUrl(string $dataUrl): ?array
    {
        if (!preg_match('#^data:image/png;base64,([A-Za-z0-9+/=]+)$#', $dataUrl, $matches)) {
            return null;
        }

        $binary = base64_decode($matches[1], true);
        if ($binary === false || $binary === '' || strlen($binary) > self::MAX_DECODED_BYTES) {
            return null;
        }

        // Trust the bytes, not the data URL prefix.
        if (!str_starts_with($binary, self::PNG_SIGNATURE)) {
            return null;
        }

        return ['binary' => $binary, 'mimeType' => 'image/png'];
    }

    private function thumbnailName(File $file): string
    {
        return $file->getId() . '-' . $file->getEtag() . '.png';
    }
}
