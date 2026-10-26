<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Controller;

use OCA\CadViewer\AppInfo\Application;
use OCA\CadViewer\Config\AppConfig;
use OCA\CadViewer\Service\ThumbnailService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\IUserSession;
use OCP\Lock\ILockingProvider;
use OCP\Lock\LockedException;
use Psr\Log\LoggerInterface;

class FileController extends Controller
{
    private const ALLOWED_EXTENSIONS = ['dwg', 'dxf'];
    private const ERR_FILE_NOT_FOUND = 'File not found';
    private const ERR_ACCESS_DENIED = 'Access denied';
    private const ERR_NOT_A_FILE = 'Not a file';
    private const ERR_INTERNAL_SERVER_ERROR = 'Internal server error';

    public function __construct(
        string $appName,
        IRequest $request,
        private readonly IRootFolder $rootFolder,
        private readonly IUserSession $userSession,
        private readonly LoggerInterface $logger,
        private readonly IURLGenerator $urlGenerator,
        private readonly ThumbnailService $thumbnailService,
        private readonly AppConfig $appConfig,
        private readonly ILockingProvider $lockingProvider,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * Resolve a file by ID for the current user.
     *
     * @throws NotFoundException if file not found
     * @throws NotPermittedException if access denied
     * @throws \InvalidArgumentException if not a file
     */
    private function _resolveFile(int $fileId): File
    {
        $user = $this->userSession->getUser();
        if ($user === null) {
            throw new \RuntimeException('Unauthorized');
        }

        $userFolder = $this->rootFolder->getUserFolder($user->getUID());
        $files = $userFolder->getById($fileId);

        if (empty($files)) {
            throw new NotFoundException('File not found');
        }

        $file = $files[0];
        if (!($file instanceof File)) {
            throw new \InvalidArgumentException('Not a file');
        }

        if (!$file->isReadable()) {
            throw new NotPermittedException('Access denied');
        }

        return $file;
    }

    /**
     * Validate file constraints (extension and size).
     *
     * @return DataResponse|null Error response if validation fails, null otherwise
     */
    private function _validateFileConstraints(File $file, int $fileId): ?DataResponse
    {
        $fileName = $file->getName();
        $fileSize = $file->getSize();

        // Check file extension allowlist
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            $this->logger->warning(
                'CAD Viewer: Unsupported file extension',
                ['fileId' => $fileId, 'extension' => $extension]
            );
            return new DataResponse(
                ['error' => 'Unsupported file type. Only DWG/DXF supported.'],
                Http::STATUS_UNSUPPORTED_MEDIA_TYPE
            );
        }

        // Check file size limit to prevent memory exhaustion
        if ($fileSize > Application::MAX_FILE_SIZE) {
            $this->logger->warning(
                'CAD Viewer: File too large',
                [
                    'fileId' => $fileId,
                    'size' => $fileSize,
                    'limit' => Application::MAX_FILE_SIZE,
                ]
            );
            return new DataResponse(
                ['error' => 'File too large. Maximum supported size is 50MB.'],
                Http::STATUS_REQUEST_ENTITY_TOO_LARGE
            );
        }

        return null;
    }

    /**
     * Handle exceptions from file operations and return appropriate error response.
     */
    private function _handleFileError(
        \Throwable $e,
        int $fileId,
        ?string $logMessage = null,
    ): DataResponse {
        $logMessage ??= $e->getMessage();

        if ($e instanceof NotFoundException) {
            $this->logger->warning(
                'CAD Viewer: File not found',
                ['fileId' => $fileId]
            );
            return new DataResponse(
                ['error' => self::ERR_FILE_NOT_FOUND],
                Http::STATUS_NOT_FOUND
            );
        }

        if ($e instanceof NotPermittedException) {
            $this->logger->warning(
                'CAD Viewer: Access denied',
                ['fileId' => $fileId]
            );
            return new DataResponse(
                ['error' => self::ERR_ACCESS_DENIED],
                Http::STATUS_FORBIDDEN
            );
        }

        if ($e instanceof \RuntimeException) {
            $this->logger->warning('CAD Viewer: Unauthorized access attempt');
            return new DataResponse(
                ['error' => 'Unauthorized'],
                Http::STATUS_UNAUTHORIZED
            );
        }

        if ($e instanceof \InvalidArgumentException) {
            return new DataResponse(
                ['error' => self::ERR_NOT_A_FILE],
                Http::STATUS_BAD_REQUEST
            );
        }

        $this->logger->error(
            'CAD Viewer: Error loading file',
            ['fileId' => $fileId, 'error' => $logMessage]
        );
        return new DataResponse(
            ['error' => self::ERR_INTERNAL_SERVER_ERROR],
            Http::STATUS_INTERNAL_SERVER_ERROR
        );
    }

    /**
     * Generate a secure download callback URL.
     *
     * Follows ONLYOFFICE pattern:
     * - URL is short and doesn't expose file ID directly
     * - Download endpoint validates permissions per request
     * - Memory efficient: file is streamed directly
     */
    private function generateDownloadUrl(int $fileId): string
    {
        // Generate a secure download callback URL
        // The actual file download happens through a separate callback endpoint
        return $this->urlGenerator->linkToRouteAbsolute(
            $this->appName . '.file.download',
            ['fileId' => $fileId]
        );
    }

    /**
     * Load a CAD file by ID and return its metadata with download URL.
     *
     * Returns metadata with a secure callback URL for downloading the file.
     * The download URL is session-authenticated and memory-efficient.
     *
     * Design inspired by ONLYOFFICE integration:
     * - Secure callback URLs instead of direct file paths
     * - Session-authenticated downloads
     * - Efficient streaming (no encoding overhead)
     * - Size validation (max 50MB)
     *
     * @NoAdminRequired
     */
    public function load(int $fileId): DataResponse
    {
        try {
            $file = $this->_resolveFile($fileId);

            $errorResponse = $this->_validateFileConstraints($file, $fileId);
            if ($errorResponse !== null) {
                return $errorResponse;
            }

            $downloadUrl = $this->generateDownloadUrl($fileId);

            $this->logger->info(
                'CAD Viewer: Loading file',
                [
                    'fileId' => $fileId,
                    'name' => $file->getName(),
                    'size' => $file->getSize(),
                ]
            );

            return new DataResponse([
                'id' => $file->getId(),
                'name' => $file->getName(),
                'size' => $file->getSize(),
                'mimeType' => $file->getMimeType(),
                'path' => $file->getPath(),
                'directory' => $this->getUserDirectory($file),
                'etag' => $file->getEtag(),
                'canSave' => $this->canSave($file),
                'url' => $downloadUrl,
                'contentType' => 'application/octet-stream',
            ]);
        } catch (\Throwable $e) {
            $this->logger->error(
                'CAD Viewer: Error loading file',
                [
                    'fileId' => $fileId,
                    'exception' => $e,
                ]
            );
            return $this->_handleFileError($e, $fileId);
        }
    }

    /**
     * Download CAD file content - Memory efficient streaming.
     *
     * Called by frontend when loading file content.
     * Streams file directly without buffering.
     *
     * @NoAdminRequired
     */
    public function download(int $fileId): DataResponse|StreamResponse
    {
        try {
            $file = $this->_resolveFile($fileId);

            // Validate file is CAD type
            $extension = strtolower(pathinfo($file->getName(), PATHINFO_EXTENSION));
            if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
                return new DataResponse(
                    ['error' => 'Unsupported file type'],
                    Http::STATUS_UNSUPPORTED_MEDIA_TYPE
                );
            }

            // Stream file directly
            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(
                    ['error' => 'Could not open file'],
                    Http::STATUS_INTERNAL_SERVER_ERROR
                );
            }

            $response = new StreamResponse($stream);
            $response->addHeader('Content-Type', 'application/octet-stream');
            $response->addHeader('Content-Length', (string) $file->getSize());
            $response->addHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            $response->addHeader('Content-Disposition', 'attachment; filename="' . $file->getName() . '"');

            $this->logger->info(
                'CAD Viewer: Download file',
                [
                    'fileId' => $fileId,
                    'name' => $file->getName(),
                    'size' => $file->getSize(),
                ]
            );

            return $response;
        } catch (\Throwable $e) {
            return $this->_handleFileError($e, $fileId);
        }
    }

    /**
     * Get file metadata for a CAD file.
     *
     * @NoAdminRequired
     */
    public function getFile(int $fileId): DataResponse
    {
        try {
            $file = $this->_resolveFile($fileId);

            return new DataResponse([
                'id' => $file->getId(),
                'name' => $file->getName(),
                'size' => $file->getSize(),
                'mimeType' => $file->getMimeType(),
                'path' => $file->getPath(),
            ]);
        } catch (\Throwable $e) {
            return $this->_handleFileError($e, $fileId);
        }
    }

    /**
     * Get a preview/thumbnail for a CAD file.
     *
     * @NoAdminRequired
     */
    public function preview(int $fileId): DataResponse|StreamResponse
    {
        try {
            $file = $this->_resolveFile($fileId);

            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(
                    ['error' => 'Could not open file'],
                    Http::STATUS_INTERNAL_SERVER_ERROR
                );
            }

            $response = new StreamResponse($stream);
            $response->addHeader('Content-Type', $file->getMimeType());
            return $response;
        } catch (\Throwable $e) {
            return $this->_handleFileError($e, $fileId);
        }
    }

    /**
     * Save new drawing content back to a CAD file.
     *
     * The viewer can edit a drawing and serialise it to DXF, so a save writes
     * the posted DXF text over the file. Only DXF can be written: the bundled
     * LibreDWG converter parses DWG but has no encoder, so a DWG file is
     * rejected rather than silently replaced with DXF content.
     *
     * The etag the client loaded is required and checked, so a save based on a
     * stale copy is refused instead of overwriting someone else's edit.
     *
     * @NoAdminRequired
     */
    public function save(int $fileId): DataResponse
    {
        try {
            $file = $this->_resolveFile($fileId);

            $errorResponse = $this->_validateFileConstraints($file, $fileId);
            if ($errorResponse !== null) {
                return $errorResponse;
            }

            if (!$file->isUpdateable()) {
                return new DataResponse(
                    ['error' => self::ERR_ACCESS_DENIED],
                    Http::STATUS_FORBIDDEN
                );
            }

            if (!$this->canSave($file)) {
                return new DataResponse(
                    ['error' => 'This file type cannot be saved. Only DXF files can be written.'],
                    Http::STATUS_UNSUPPORTED_MEDIA_TYPE
                );
            }

            $content = $this->request->getParam('content');
            if (!is_string($content) || $content === '') {
                return new DataResponse(
                    ['error' => 'Missing file content'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            // The viewer re-serialises the drawing, so the result can be larger
            // than the file that was loaded. Refuse an oversized save rather
            // than write a file this app can no longer open.
            if (strlen($content) > self::MAX_FILE_SIZE) {
                return new DataResponse(
                    ['error' => 'File too large. Maximum supported size is 50MB.'],
                    Http::STATUS_REQUEST_ENTITY_TOO_LARGE
                );
            }

            $etag = $this->request->getParam('etag');
            if (!is_string($etag) || $etag === '') {
                return new DataResponse(
                    ['error' => 'Missing file version'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            return $this->writeWithLock($file, $fileId, $content, $etag);
        } catch (\Throwable $e) {
            return $this->_handleFileError($e, $fileId);
        }
    }

    /**
     * Write the new content while holding an exclusive lock on the file.
     *
     * The version is re-checked *inside* the lock, so two saves based on the
     * same etag cannot both pass and the later one silently discard the first
     * edit: the second sees the new etag and is refused with 409.
     */
    private function writeWithLock(File $file, int $fileId, string $content, string $etag): DataResponse
    {
        $lockPath = $file->getPath();
        $locked = false;

        try {
            $this->lockingProvider->acquireLock($lockPath, ILockingProvider::LOCK_EXCLUSIVE);
            $locked = true;

            // Re-resolve the node under the lock. A Nextcloud Node caches its
            // FileInfo from before the lock, so getEtag() on the original node
            // would still report the version this request started from and two
            // overlapping saves would both pass.
            $file = $this->_resolveFile($fileId);

            $current = $file->getEtag();
            if ($etag !== $current) {
                $this->logger->info('CAD Viewer: refusing save, file changed', ['fileId' => $fileId]);
                return new DataResponse(
                    ['error' => 'The file was changed by someone else. Reload it before saving.'],
                    Http::STATUS_CONFLICT
                );
            }

            $file->putContent($content);
            clearstatcache();

            $this->logger->info('CAD Viewer: Saved file', [
                'fileId' => $fileId,
                'size' => $file->getSize(),
            ]);

            return new DataResponse([
                'etag' => $file->getEtag(),
                'size' => $file->getSize(),
                'mtime' => $file->getMTime(),
            ]);
        } catch (LockedException $e) {
            return new DataResponse(
                ['error' => 'The file is locked.'],
                Http::STATUS_CONFLICT
            );
        } catch (NotPermittedException $e) {
            return new DataResponse(
                ['error' => self::ERR_ACCESS_DENIED],
                Http::STATUS_FORBIDDEN
            );
        } finally {
            if ($locked) {
                try {
                    $this->lockingProvider->releaseLock($lockPath, ILockingProvider::LOCK_EXCLUSIVE);
                } catch (\Throwable $e) {
                    $this->logger->warning('CAD Viewer: failed to release save lock', [
                        'fileId' => $fileId,
                        'exception' => $e,
                    ]);
                }
            }
        }
    }

    /**
     * Whether the drawing can be written back.
     *
     * Only DXF is supported: the bundled converter can parse DWG but cannot
     * encode it, so a DWG would have to be written as DXF under a .dwg name.
     */
    private function canSave(File $file): bool
    {
        if (!$file->isUpdateable()) {
            return false;
        }

        $extension = strtolower(pathinfo($file->getName(), PATHINFO_EXTENSION));

        return $extension === 'dxf';
    }

    /**
     * The user-visible folder the file lives in, for "back to Files" links.
     *
     * `Node::getPath()` returns the full storage path, which includes the
     * user's `files` mount segment (`/alice/files/plans/plan.dxf`). Resolving it
     * against the user folder yields the folder as the Files app names it
     * (`/plans`), including `/` for a file in the user's root.
     */
    private function getUserDirectory(File $file): string
    {
        $user = $this->userSession->getUser();
        if ($user === null) {
            return '/';
        }

        try {
            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $relative = $userFolder->getRelativePath($file->getParent()->getPath());
        } catch (\Throwable) {
            return '/';
        }

        if ($relative === null || $relative === '') {
            return '/';
        }

        return '/' . ltrim($relative, '/');
    }

    /**
     * Store a browser-rendered PNG thumbnail for a CAD file.
     *
     * CAD files cannot be rendered server-side, so the viewer uploads the
     * thumbnail it rendered. The JSON body is
     * `{"image": "data:image/png;base64,...", "etag": "<version>"}`.
     *
     * Only users who may modify the file are allowed to set its thumbnail:
     * otherwise a read-only share recipient could change the preview everyone
     * else sees.
     *
     * @NoAdminRequired
     */
    public function thumbnail(int $fileId): DataResponse
    {
        try {
            $file = $this->_resolveFile($fileId);

            $errorResponse = $this->_validateFileConstraints($file, $fileId);
            if ($errorResponse !== null) {
                return $errorResponse;
            }

            if (!$file->isUpdateable()) {
                return new DataResponse(
                    ['error' => self::ERR_ACCESS_DENIED],
                    Http::STATUS_FORBIDDEN
                );
            }

            // The administrator can turn previews off; then there is no point
            // in storing thumbnails nothing will serve.
            if ($this->appConfig->getPreviews() !== 'yes') {
                return new DataResponse(
                    ['error' => 'Previews are disabled'],
                    Http::STATUS_FORBIDDEN
                );
            }

            $dataUrl = $this->request->getParam('image');
            if (!is_string($dataUrl) || $dataUrl === '') {
                return new DataResponse(
                    ['error' => 'Missing image data'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            $decoded = $this->thumbnailService->decodePngDataUrl($dataUrl);
            if ($decoded === null) {
                return new DataResponse(
                    ['error' => 'Invalid image data'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            $etag = $this->request->getParam('etag');
            if (!is_string($etag) || $etag === '') {
                // The etag ties the image to the version it was rendered from;
                // without it a stale image could be accepted.
                return new DataResponse(
                    ['error' => 'Missing file version'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            $result = $this->thumbnailService->storeThumbnail($file, $decoded['binary'], $etag);

            if ($result === ThumbnailService::STALE) {
                // The drawing changed after the viewer downloaded it, so this
                // image does not describe the current version.
                return new DataResponse(
                    ['error' => 'Stale thumbnail'],
                    Http::STATUS_CONFLICT
                );
            }

            if ($result === ThumbnailService::FAILED) {
                return new DataResponse(
                    ['error' => self::ERR_INTERNAL_SERVER_ERROR],
                    Http::STATUS_INTERNAL_SERVER_ERROR
                );
            }

            return new DataResponse(['status' => 'ok']);
        } catch (\Throwable $e) {
            return $this->_handleFileError($e, $fileId);
        }
    }
}
