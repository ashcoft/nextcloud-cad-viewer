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
use OCP\AppFramework\Http\DataDownloadResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IRequest;
use OCP\IUserSession;

class FileController extends Controller
{
    private IRootFolder $rootFolder;
    private IUserSession $userSession;

    /** @var string[] Supported CAD MIME types */
    private const SUPPORTED_MIME_TYPES = [
        'application/acad',
        'application/autocad_dwg',
        'application/dwg',
        'application/x-autocad',
        'application/x-dwg',
        'image/vnd.dwg',
        'image/vnd.dxf',
        'application/dxf',
        'application/x-dxf',
        'image/x-dxf',
    ];

    private const ERROR_UNSUPPORTED_FILE_TYPE = 'Unsupported file type';
    private const ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME = 'Unsupported file type: ';

    public function __construct(
        string $appName,
        IRequest $request,
        IRootFolder $rootFolder,
        IUserSession $userSession
    ) {
        parent::__construct($appName, $request);
        $this->rootFolder = $rootFolder;
        $this->userSession = $userSession;
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

            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, self::SUPPORTED_MIME_TYPES, true)) {
                throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
            }

            return new DataResponse([
                'id' => $file->getId(),
                'name' => $file->getName(),
                'size' => $file->getSize(),
                'mimeType' => $mimeType,
                'path' => $file->getPath(),
            ]);
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (NotPermittedException $e) {
            return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
        } catch (\UnexpectedValueException $e) {
            return new DataResponse(['error' => self::ERROR_UNSUPPORTED_FILE_TYPE], Http::STATUS_UNSUPPORTED_MEDIA_TYPE);
        } catch (\Exception $e) {
            return new DataResponse(['error' => 'Internal server error'], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Stream the raw CAD file content for the viewer to load
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

            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, self::SUPPORTED_MIME_TYPES, true)) {
                throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
            }

            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(['error' => 'Could not open file'], Http::STATUS_INTERNAL_SERVER_ERROR);
            }

            $response = new StreamResponse($stream);
            // Use application/octet-stream to prevent browser handling
            // Browser won't display or auto-download unknown binary types
            // JavaScript fetch() can read the response body normally
            $response->addHeader('Content-Type', 'application/octet-stream');
            $response->addHeader('Content-Length', (string) $file->getSize());
            // No Content-Disposition header - browser won't trigger download
            // Allow caching for performance
            $response->addHeader('Cache-Control', 'private, max-age=3600');
            return $response;
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (NotPermittedException $e) {
            return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
        } catch (\UnexpectedValueException $e) {
            return new DataResponse(['error' => self::ERROR_UNSUPPORTED_FILE_TYPE], Http::STATUS_UNSUPPORTED_MEDIA_TYPE);
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

            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, self::SUPPORTED_MIME_TYPES, true)) {
                throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
            }

            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(['error' => 'Could not open file'], Http::STATUS_INTERNAL_SERVER_ERROR);
            }

            $response = new StreamResponse($stream);
            $response->addHeader('Content-Type', $mimeType);
            return $response;
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (NotPermittedException $e) {
            return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
        } catch (\UnexpectedValueException $e) {
            return new DataResponse(['error' => self::ERROR_UNSUPPORTED_FILE_TYPE], Http::STATUS_UNSUPPORTED_MEDIA_TYPE);
        } catch (\Exception $e) {
            return new DataResponse(['error' => 'Internal server error'], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }
}
