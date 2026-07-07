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
use OCP\IUserSession;
use Psr\Log\LoggerInterface;

class FileController extends Controller
{
    private const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    private const ALLOWED_EXTENSIONS = ['dwg', 'dxf'];

    public function __construct(
        string $appName,
        IRequest $request,
        private readonly IRootFolder $rootFolder,
        private readonly IUserSession $userSession,
        private readonly LoggerInterface $logger
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * Load a CAD file by ID and return its content.
     *
     * Returns file content as base64 for the CAD viewer.
     * Validates extension (.dwg/.dxf) and file size (max 50MB).
     */
    #[NoAdminRequired]
    public function load(int $fileId): DataResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                $this->logger->warning('CAD Viewer: Unauthorized access attempt');
                return new DataResponse([
                    'error' => 'Unauthorized',
                ], Http::STATUS_UNAUTHORIZED);
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                $this->logger->warning('CAD Viewer: File not found', [
                    'fileId' => $fileId,
                ]);
                return new DataResponse([
                    'error' => 'File not found',
                ], Http::STATUS_NOT_FOUND
                );
            }

            $file = $files[0];
            if (!($file instanceof File)) {
                return new DataResponse([
                    'error' => 'Not a file',
                ], Http::STATUS_BAD_REQUEST
                );
            }

            if (!$file->isReadable()) {
                $this->logger->warning('CAD Viewer: Access denied', [
                    'fileId' => $fileId,
                ]);
                return new DataResponse([
                    'error' => 'Access denied',
                ], Http::STATUS_FORBIDDEN
                );
            }

            $mimeType = $file->getMimeType();
            $fileName = $file->getName();
            $fileSize = $file->getSize();

            // Check file extension allowlist
            $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
                $this->logger->warning('CAD Viewer: Unsupported file extension', [
                    'fileId' => $fileId,
                    'extension' => $extension,
                ]);
                return new DataResponse([
                    'error' => 'Unsupported file type. Only DWG/DXF supported.',
                ], Http::STATUS_UNSUPPORTED_MEDIA_TYPE
                );
            }

            // Check file size limit to prevent memory exhaustion
            if ($fileSize > self::MAX_FILE_SIZE) {
                $this->logger->warning('CAD Viewer: File too large', [
                    'fileId' => $fileId,
                    'size' => $fileSize,
                    'limit' => self::MAX_FILE_SIZE,
                ]);
                return new DataResponse([
                    'error' => 'File too large. Maximum supported size is 50MB.',
                ], Http::STATUS_REQUEST_ENTITY_TOO_LARGE
                );
            }

            $this->logger->info('CAD Viewer: Loading file', [
                'fileId' => $fileId,
                'name' => $fileName,
                'mime' => $mimeType,
                'size' => $fileSize,
            ]);

            $content = $file->getContent();

            return new DataResponse([
                'id' => $file->getId(),
                'name' => $fileName,
                'size' => $fileSize,
                'mime' => $mimeType,
                'path' => $file->getPath(),
                'content' => base64_encode($content),
                'contentType' => 'application/octet-stream',
            ]);
        } catch (NotFoundException $e) {
            $this->logger->warning('CAD Viewer: File not found', [
                'fileId' => $fileId,
            ]);
            return new DataResponse([
                'error' => 'File not found',
            ], Http::STATUS_NOT_FOUND
            );
        } catch (NotPermittedException $e) {
            $this->logger->warning('CAD Viewer: Access denied', [
                'fileId' => $fileId,
            ]);
            return new DataResponse([
                'error' => 'Access denied',
            ], Http::STATUS_FORBIDDEN
            );
        } catch (\Exception $e) {
            $this->logger->error('CAD Viewer: Error loading file', [
                'fileId' => $fileId,
                'error' => $e->getMessage(),
            ]);
            return new DataResponse([
                'error' => 'Internal server error: ' . $e->getMessage(),
            ], Http::STATUS_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get file metadata for a CAD file.
     */
    #[NoAdminRequired]
    public function getFile(int $fileId): DataResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                return new DataResponse(
                    ['error' => 'Unauthorized'],
                    Http::STATUS_UNAUTHORIZED
                );
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                return new DataResponse(
                    ['error' => 'File not found'],
                    Http::STATUS_NOT_FOUND
                );
            }

            $file = $files[0];
            if (!($file instanceof File)) {
                return new DataResponse(
                    ['error' => 'Not a file'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            if (!$file->isReadable()) {
                return new DataResponse(
                    ['error' => 'Access denied'],
                    Http::STATUS_FORBIDDEN
                );
            }

            return new DataResponse([
                'id' => $file->getId(),
                'name' => $file->getName(),
                'size' => $file->getSize(),
                'mimeType' => $file->getMimeType(),
                'path' => $file->getPath(),
            ]);
        } catch (NotFoundException $e) {
            return new DataResponse(
                ['error' => 'File not found'],
                Http::STATUS_NOT_FOUND
            );
        } catch (NotPermittedException $e) {
            return new DataResponse(
                ['error' => 'Access denied'],
                Http::STATUS_FORBIDDEN
            );
        } catch (\Exception $e) {
            return new DataResponse(
                ['error' => 'Internal server error'],
                Http::STATUS_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Stream raw CAD file content.
     */
    #[NoAdminRequired]
    public function getFileContent(int $fileId): DataResponse|StreamResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                return new DataResponse(
                    ['error' => 'Unauthorized'],
                    Http::STATUS_UNAUTHORIZED
                );
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                return new DataResponse(
                    ['error' => 'File not found'],
                    Http::STATUS_NOT_FOUND
                );
            }

            $file = $files[0];
            if (!($file instanceof File)) {
                return new DataResponse(
                    ['error' => 'Not a file'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            if (!$file->isReadable()) {
                return new DataResponse(
                    ['error' => 'Access denied'],
                    Http::STATUS_FORBIDDEN
                );
            }

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
            $response->addHeader(
                'Cache-Control',
                'no-cache, no-store, must-revalidate'
            );
            return $response;
        } catch (NotFoundException $e) {
            return new DataResponse(
                ['error' => 'File not found'],
                Http::STATUS_NOT_FOUND
            );
        } catch (NotPermittedException $e) {
            return new DataResponse(
                ['error' => 'Access denied'],
                Http::STATUS_FORBIDDEN
            );
        } catch (\Exception $e) {
            return new DataResponse(
                ['error' => 'Internal server error'],
                Http::STATUS_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get a preview/thumbnail for a CAD file.
     */
    #[NoAdminRequired]
    public function preview(int $fileId): DataResponse|StreamResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                return new DataResponse(
                    ['error' => 'Unauthorized'],
                    Http::STATUS_UNAUTHORIZED
                );
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                return new DataResponse(
                    ['error' => 'File not found'],
                    Http::STATUS_NOT_FOUND
                );
            }

            $file = $files[0];
            if (!($file instanceof File)) {
                return new DataResponse(
                    ['error' => 'Not a file'],
                    Http::STATUS_BAD_REQUEST
                );
            }

            if (!$file->isReadable()) {
                return new DataResponse(
                    ['error' => 'Access denied'],
                    Http::STATUS_FORBIDDEN
                );
            }

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
        } catch (NotFoundException $e) {
            return new DataResponse(
                ['error' => 'File not found'],
                Http::STATUS_NOT_FOUND
            );
        } catch (NotPermittedException $e) {
            return new DataResponse(
                ['error' => 'Access denied'],
                Http::STATUS_FORBIDDEN
            );
        } catch (\Exception $e) {
            return new DataResponse(
                ['error' => 'Internal server error'],
                Http::STATUS_INTERNAL_SERVER_ERROR
            );
        }
    }
}
