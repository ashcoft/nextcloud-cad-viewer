<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Controller;

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IRequest;
use OCP\IUserSession;
use Psr\Log\LoggerInterface;

/**
 * Controller for CAD file operations.
 * 
 * Follows the same pattern as draw.io and OnlyOffice Nextcloud apps:
 * - Simple load endpoint that returns file content by ID
 * - No strict MIME type validation (Nextcloud already filters by file type)
 * - FileId is the primary identifier
 */
class FileController extends Controller
{
    private IRootFolder $rootFolder;
    private IUserSession $userSession;
    private LoggerInterface $logger;

    public function __construct(
        string $appName,
        IRequest $request,
        IRootFolder $rootFolder,
        IUserSession $userSession,
        LoggerInterface $logger
    ) {
        parent::__construct($appName, $request);
        $this->rootFolder = $rootFolder;
        $this->userSession = $userSession;
        $this->logger = $logger;
    }

    /**
     * Load a CAD file by ID and return its content.
     * 
     * Simple endpoint similar to draw.io /load/{fileId}.
     * Returns file content directly for the CAD viewer to process.
     * No MIME type validation - file was already selected by user in Nextcloud.
     */
    #[NoAdminRequired]
    public function load(int $fileId): DataResponse|StreamResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                $this->logger->warning('CAD Viewer: Unauthorized access attempt');
                return new DataResponse(['error' => 'Unauthorized'], Http::STATUS_UNAUTHORIZED);
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                $this->logger->warning('CAD Viewer: File not found', ['fileId' => $fileId]);
                return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
            }

            $file = $files[0];
            if (!($file instanceof \OCP\Files\File)) {
                return new DataResponse(['error' => 'Not a file'], Http::STATUS_BAD_REQUEST);
            }

            if (!$file->isReadable()) {
                $this->logger->warning('CAD Viewer: Access denied', ['fileId' => $fileId]);
                return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
            }

            $mimeType = $file->getMimeType();
            $fileName = $file->getName();
            $fileSize = $file->getSize();

            $this->logger->info('CAD Viewer: Loading file', [
                'fileId' => $fileId,
                'name' => $fileName,
                'mime' => $mimeType,
                'size' => $fileSize
            ]);

            // Get file content
            $content = $file->getContent();

            // Return as data response with metadata - similar to draw.io approach
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
            $this->logger->warning('CAD Viewer: File not found', ['fileId' => $fileId]);
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (NotPermittedException $e) {
            $this->logger->warning('CAD Viewer: Access denied', ['fileId' => $fileId]);
            return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
        } catch (\Exception $e) {
            $this->logger->error('CAD Viewer: Error loading file', [
                'fileId' => $fileId,
                'error' => $e->getMessage()
            ]);
            return new DataResponse(['error' => 'Internal server error: ' . $e->getMessage()], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get file metadata for a CAD file
     */
    #[NoAdminRequired]
    public function getFile(int $fileId): DataResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                return new DataResponse(['error' => 'Unauthorized'], Http::STATUS_UNAUTHORIZED);
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
            }

            $file = $files[0];
            if (!($file instanceof \OCP\Files\File)) {
                return new DataResponse(['error' => 'Not a file'], Http::STATUS_BAD_REQUEST);
            }

            if (!$file->isReadable()) {
                return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
            }

            return new DataResponse([
                'id' => $file->getId(),
                'name' => $file->getName(),
                'size' => $file->getSize(),
                'mimeType' => $file->getMimeType(),
                'path' => $file->getPath(),
            ]);
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (NotPermittedException $e) {
            return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
        } catch (\Exception $e) {
            return new DataResponse(['error' => 'Internal server error'], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Stream the raw CAD file content for the viewer to load.
     * 
     * Uses application/octet-stream to prevent browser download attempts.
     * The CAD viewer library will fetch and process this content via JavaScript.
     */
    #[NoAdminRequired]
    public function getFileContent(int $fileId): DataResponse|StreamResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                return new DataResponse(['error' => 'Unauthorized'], Http::STATUS_UNAUTHORIZED);
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
            }

            $file = $files[0];
            if (!($file instanceof \OCP\Files\File)) {
                return new DataResponse(['error' => 'Not a file'], Http::STATUS_BAD_REQUEST);
            }

            if (!$file->isReadable()) {
                return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
            }

            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(['error' => 'Could not open file'], Http::STATUS_INTERNAL_SERVER_ERROR);
            }

            $response = new StreamResponse($stream);
            $response->addHeader('Content-Type', 'application/octet-stream');
            $response->addHeader('Content-Length', (string) $file->getSize());
            $response->addHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            return $response;
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (NotPermittedException $e) {
            return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
        } catch (\Exception $e) {
            return new DataResponse(['error' => 'Internal server error'], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a preview/thumbnail for a CAD file
     */
    #[NoAdminRequired]
    public function preview(int $fileId): DataResponse|StreamResponse
    {
        try {
            $user = $this->userSession->getUser();
            if ($user === null) {
                return new DataResponse(['error' => 'Unauthorized'], Http::STATUS_UNAUTHORIZED);
            }

            $userFolder = $this->rootFolder->getUserFolder($user->getUID());
            $files = $userFolder->getById($fileId);

            if (empty($files)) {
                return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
            }

            $file = $files[0];
            if (!($file instanceof \OCP\Files\File)) {
                return new DataResponse(['error' => 'Not a file'], Http::STATUS_BAD_REQUEST);
            }

            if (!$file->isReadable()) {
                return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
            }

            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(['error' => 'Could not open file'], Http::STATUS_INTERNAL_SERVER_ERROR);
            }

            $response = new StreamResponse($stream);
            $response->addHeader('Content-Type', $file->getMimeType());
            return $response;
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (NotPermittedException $e) {
            return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
        } catch (\Exception $e) {
            return new DataResponse(['error' => 'Internal server error'], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }
}
