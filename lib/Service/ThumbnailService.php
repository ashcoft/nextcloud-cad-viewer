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
 * Thumbnails are keyed by file id and etag so a drawing that changes gets a
 * fresh preview. Only the newest thumbnail per file is kept.
 */
class ThumbnailService
{
    private const APP_ID = 'cad_viewer';
    private const FOLDER = 'thumbnails';
    private const MAX_DECODED_BYTES = 5 * 1024 * 1024; // 5MB
    private const MAX_DIMENSION = 4096;
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
        $folder = $this->getFolder(false);
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
     * Outcome of a thumbnail upload attempt.
     *
     * The controller maps these to distinct HTTP statuses so a storage failure
     * is not reported to the client as a version conflict.
     */
    public const STORED = 'stored';
    public const STALE = 'stale';
    public const FAILED = 'failed';

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
            $folder = $this->getFolder(true);
            if ($folder === null) {
                return self::FAILED;
            }

            $name = $this->thumbnailName($file);
            $folder->newFile($name, $binary);

            // Only once the replacement is safely stored: a new etag means a
            // new file name, so drop the superseded versions to keep the cache
            // from growing with every edit of the drawing.
            $this->deleteThumbnailsExcept($folder, (int) $file->getId(), $name);

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
     * Remove every cached thumbnail belonging to a file id.
     */
    public function deleteForFileId(int $fileId): void
    {
        $folder = $this->getFolder(false);
        if ($folder === null) {
            return;
        }

        try {
            $this->deleteThumbnails($folder, $fileId);
        } catch (\Throwable $e) {
            $this->logger->warning('CAD Viewer: failed to delete thumbnails', [
                'fileId' => $fileId,
                'exception' => $e,
            ]);
        }
    }

    /**
     * File ids that currently have at least one cached thumbnail.
     *
     * Used by the prune job, which cannot know the id of a drawing that was
     * deleted as part of a folder.
     *
     * @return list<int>
     */
    public function listCachedFileIds(): array
    {
        $folder = $this->getFolder(false);
        if ($folder === null) {
            return [];
        }

        $ids = [];
        try {
            foreach ($folder->getDirectoryListing() as $existing) {
                $name = $existing->getName();
                $separator = strpos($name, '-');
                if ($separator === false) {
                    continue;
                }
                $ids[(int) substr($name, 0, $separator)] = true;
            }
        } catch (\Throwable $e) {
            $this->logger->warning('CAD Viewer: failed to list thumbnails', [
                'exception' => $e,
            ]);
            return [];
        }

        return array_keys($ids);
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
        if (!function_exists('imagecreatefromstring')) {
            // Without GD the header checks above are the best available guard.
            return true;
        }

        $image = @imagecreatefromstring($binary);
        if ($image === false) {
            return false;
        }

        imagedestroy($image);

        return true;
    }

    /**
     * Resolve the thumbnail folder, optionally creating it.
     */
    private function getFolder(bool $create): ?ISimpleFolder
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
                $this->logger->warning('CAD Viewer: failed to create thumbnail folder', [
                    'exception' => $e,
                ]);
                return null;
            }
        }
    }

    /**
     * Delete every thumbnail whose name belongs to the given file id.
     */
    private function deleteThumbnails(ISimpleFolder $folder, int $fileId): void
    {
        $this->deleteThumbnailsExcept($folder, $fileId, null);
    }

    /**
     * Delete every thumbnail belonging to the file id, keeping one name.
     *
     * @param string|null $keepName Name to leave in place, or null to remove all.
     */
    private function deleteThumbnailsExcept(ISimpleFolder $folder, int $fileId, ?string $keepName): void
    {
        $prefix = $fileId . '-';
        foreach ($folder->getDirectoryListing() as $existing) {
            $name = $existing->getName();
            if ($name !== $keepName && str_starts_with($name, $prefix)) {
                $existing->delete();
            }
        }
    }

    private function thumbnailName(File $file): string
    {
        return $file->getId() . '-' . $file->getEtag() . '.png';
    }
}
