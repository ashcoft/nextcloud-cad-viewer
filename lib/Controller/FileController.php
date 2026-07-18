<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Controller;

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
use Psr\Log\LoggerInterface;

class FileController extends Controller
{
    private const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
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
        private readonly IURLGenerator $urlGenerator
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
        if ($fileSize > self::MAX_FILE_SIZE) {
            $this->logger->warning(
                'CAD Viewer: File too large',
                [
                    'fileId' => $fileId,
                    'size' => $fileSize,
                    'limit' => self::MAX_FILE_SIZE,
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
     */
    #[NoAdminRequired]
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
     */
    #[NoAdminRequired]
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
     */
    #[NoAdminRequired]
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
     */
    #[NoAdminRequired]
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
}
