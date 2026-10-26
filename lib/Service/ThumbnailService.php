<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Service;

use OCP\Files\AppData\IAppDataFactory;
use OCP\Files\File;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use Psr\Log\LoggerInterface;

/**
 * Stores client-rendered CAD thumbnails in the app data directory.
 *
 * CAD rendering happens in the browser (WebGL), so the backend cannot produce
 * a drawing preview on its own. The viewer renders the drawing, uploads the
 * resulting PNG, and the preview provider serves it back for the Files grid.
 *
 * Layout: `thumbnails/<file id>/<etag>.png`. Keying the file by etag gives a
 * drawing that changed a fresh preview, and grouping by file id lets the whole
 * entry be removed with a single folder delete, without scanning a shared
 * directory. Only the newest thumbnail per file is kept.
 */
class ThumbnailService
{
    private const APP_ID = 'cad_viewer';
    private const FOLDER = 'thumbnails';
    private const MAX_DECODED_BYTES = 5 * 1024 * 1024; // 5MB
    private const MAX_DIMENSION = 4096;
    private const PNG_SIGNATURE = "\x89PNG\r\n\x1a\n";

    /**
     * Outcome of a thumbnail upload attempt.
     *
     * The controller maps these to distinct HTTP statuses so a storage failure
     * is not reported to the client as a version conflict.
     */
    public const STORED = 'stored';
    public const STALE = 'stale';
    public const FAILED = 'failed';

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
        $folder = $this->getFileFolder((int) $file->getId(), false);
        if ($folder === null) {
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
     *
     * The new image is written before the superseded versions are removed, so a
     * failed write never destroys a usable preview.
     *
     * @param File $file The file the thumbnail belongs to.
     * @param string $binary Validated PNG bytes.
     * @param string|null $clientEtag Etag of the drawing the client rendered.
     *        When it does not match the file's current etag the upload is
     *        stale (the file changed after it was downloaded) and is rejected.
     *
     * @return string One of {@see self::STORED}, {@see self::STALE} or
     *         {@see self::FAILED}.
     */
    public function storeThumbnail(File $file, string $binary, ?string $clientEtag = null): string
    {
        if ($clientEtag !== null && $clientEtag !== '' && $clientEtag !== $file->getEtag()) {
            $this->logger->info('CAD Viewer: discarding stale thumbnail upload', [
                'fileId' => $file->getId(),
            ]);
            return self::STALE;
        }

        try {
            $folder = $this->getFileFolder((int) $file->getId(), true);
            if ($folder === null) {
                return self::FAILED;
            }

            $name = $this->thumbnailName($file);

            // Reopening an unchanged drawing re-uploads the same image. Treat
            // it as already stored rather than trying to create the file again.
            if ($folder->fileExists($name)) {
                return self::STORED;
            }

            $folder->newFile($name, $binary);

            // Only once the replacement is safely stored: a new etag means a
            // new file name, so drop the superseded versions.
            foreach ($folder->getDirectoryListing() as $existing) {
                if ($existing->getName() !== $name) {
                    $existing->delete();
                }
            }

            return self::STORED;
        } catch (\Throwable $e) {
            $this->logger->warning('CAD Viewer: failed to store thumbnail', [
                'fileId' => $file->getId(),
                'exception' => $e,
            ]);
            return self::FAILED;
        }
    }

    /**
     * Whether a file has a cached thumbnail.
     *
     * A single existence check, so callers can skip work for files that were
     * never opened.
     */
    public function hasThumbnail(int $fileId): bool
    {
        $folder = $this->getFileFolder($fileId, false);
        if ($folder === null) {
            return false;
        }

        try {
            return $folder->getDirectoryListing() !== [];
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Remove every cached thumbnail belonging to a file id.
     */
    public function deleteForFileId(int $fileId): void
    {
        $folder = $this->getFileFolder($fileId, false);
        if ($folder === null) {
            return;
        }

        try {
            // One folder delete instead of scanning a shared directory.
            $folder->delete();
        } catch (\Throwable $e) {
            $this->logger->warning('CAD Viewer: failed to delete thumbnails', [
                'fileId' => $fileId,
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

        // The signature alone is not enough: reject bytes that do not decode to
        // a real image, otherwise a bad upload would replace a usable preview
        // with something the preview pipeline cannot render.
        $info = @getimagesizefromstring($binary);
        if ($info === false || $info[2] !== IMAGETYPE_PNG || $info[0] < 1 || $info[1] < 1) {
            return null;
        }

        // The byte cap does not bound the decoded bitmap: a small, highly
        // compressible PNG can declare huge dimensions and exhaust memory in
        // the preview pipeline.
        if ($info[0] > self::MAX_DIMENSION || $info[1] > self::MAX_DIMENSION) {
            return null;
        }

        // getimagesizefromstring() reads only the header, so a PNG with a
        // complete IHDR chunk but no pixel data would pass. Decode it fully
        // before it replaces an existing preview.
        if (!$this->isDecodableImage($binary)) {
            return null;
        }

        return ['binary' => $binary, 'mimeType' => 'image/png'];
    }

    /**
     * Whether the bytes decode to an actual bitmap.
     */
    private function isDecodableImage(string $binary): bool
    {
        if (function_exists('imagecreatefromstring')) {
            $image = @imagecreatefromstring($binary);
            if ($image === false) {
                return false;
            }

            imagedestroy($image);

            return true;
        }

        // No decoder to verify the pixels with, and the header checks alone
        // would accept a truncated PNG. Refuse rather than store an image the
        // preview pipeline may not be able to read.
        $this->logger->warning('CAD Viewer: refusing thumbnail upload, no image decoder available');

        return false;
    }

    /**
     * Resolve the per-file thumbnail folder, optionally creating it.
     */
    private function getFileFolder(int $fileId, bool $create): ?ISimpleFolder
    {
        $root = $this->getRootFolder($create);
        if ($root === null) {
            return null;
        }

        $name = (string) $fileId;
        try {
            return $root->getFolder($name);
        } catch (\Throwable) {
            if (!$create) {
                return null;
            }

            try {
                return $root->newFolder($name);
            } catch (\Throwable $e) {
                $this->logger->warning('CAD Viewer: failed to create thumbnail folder', [
                    'fileId' => $fileId,
                    'exception' => $e,
                ]);
                return null;
            }
        }
    }

    /**
     * Resolve the shared thumbnail root folder, optionally creating it.
     */
    private function getRootFolder(bool $create): ?ISimpleFolder
    {
        try {
            $appData = $this->appDataFactory->get(self::APP_ID);
        } catch (\Throwable) {
            return null;
        }

        try {
            return $appData->getFolder(self::FOLDER);
        } catch (\Throwable) {
            if (!$create) {
                return null;
            }

            try {
                return $appData->newFolder(self::FOLDER);
            } catch (\Throwable $e) {
                $this->logger->warning('CAD Viewer: failed to create thumbnail root folder', [
                    'exception' => $e,
                ]);
                return null;
            }
        }
    }

    private function thumbnailName(File $file): string
    {
        return $file->getEtag() . '.png';
    }
}
