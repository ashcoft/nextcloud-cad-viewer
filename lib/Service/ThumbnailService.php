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
     * Store a thumbnail for a file, replacing any previous one.
     *
     * @param File $file The file the thumbnail belongs to.
     * @param string $binary Validated PNG bytes.
     * @param string|null $clientEtag Etag of the drawing the client rendered.
     *        When it does not match the file's current etag the upload is
     *        stale (the file changed after it was downloaded) and is rejected.
     *
     * @return bool True when the thumbnail was stored.
     */
    public function storeThumbnail(File $file, string $binary, ?string $clientEtag = null): bool
    {
        if ($clientEtag !== null && $clientEtag !== '' && $clientEtag !== $file->getEtag()) {
            $this->logger->info('CAD Viewer: discarding stale thumbnail upload', [
                'fileId' => $file->getId(),
            ]);
            return false;
        }

        try {
            $folder = $this->getFolder(true);
            if ($folder === null) {
                return false;
            }

            // A new etag means a new file name; drop the superseded versions so
            // the cache does not grow with every edit of the drawing.
            $this->deleteThumbnails($folder, (int) $file->getId());

            $folder->newFile($this->thumbnailName($file), $binary);
            return true;
        } catch (\Throwable $e) {
            $this->logger->warning('CAD Viewer: failed to store thumbnail', [
                'fileId' => $file->getId(),
                'exception' => $e,
            ]);
            return false;
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
        if ($info === false || $info[0] < 1 || $info[1] < 1) {
            return null;
        }

        return ['binary' => $binary, 'mimeType' => 'image/png'];
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
        $prefix = $fileId . '-';
        foreach ($folder->getDirectoryListing() as $existing) {
            if (str_starts_with($existing->getName(), $prefix)) {
                $existing->delete();
            }
        }
    }

    private function thumbnailName(File $file): string
    {
        return $file->getId() . '-' . $file->getEtag() . '.png';
    }
}
