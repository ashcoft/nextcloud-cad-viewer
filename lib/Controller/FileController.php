<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2024, CAD Viewer Contributors
 * @license MIT
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
        // Fallback for systems that don't detect CAD MIME types properly
        'application/octet-stream',
    ];

    /** @var array<string, string[]> Map of file extensions to their expected MIME types */
    private const EXTENSION_MIME_MAP = [
        'dwg' => ['application/dwg', 'application/acad', 'application/autocad_dwg', 'application/x-autocad', 'application/x-dwg', 'image/vnd.dwg'],
        'dxf' => ['application/dxf', 'image/vnd.dxf', 'application/x-dxf', 'image/x-dxf'],
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
            
            // Check if MIME type is supported, with extension-based fallback for octet-stream
            if (!in_array($mimeType, self::SUPPORTED_MIME_TYPES, true)) {
                // If MIME type is octet-stream or unknown, check file extension as fallback
                if ($mimeType === 'application/octet-stream' || !self::isKnownCadMimeType($mimeType)) {
                    $extension = strtolower(pathinfo($file->getName(), PATHINFO_EXTENSION));
                    if (isset(self::EXTENSION_MIME_MAP[$extension])) {
                        // File has a CAD extension, allow it even with generic MIME type
                        // Resolve the MIME type based on file extension
                        $expectedMimes = self::EXTENSION_MIME_MAP[$extension];
                        $mimeType = $expectedMimes[0];
                    } else {
                        throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
                    }
                } else {
                    throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
                }
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
            
            // Check if MIME type is supported, with extension-based fallback for octet-stream
            if (!in_array($mimeType, self::SUPPORTED_MIME_TYPES, true)) {
                // If MIME type is octet-stream or unknown, check file extension as fallback
                if ($mimeType === 'application/octet-stream' || !self::isKnownCadMimeType($mimeType)) {
                    $extension = strtolower(pathinfo($file->getName(), PATHINFO_EXTENSION));
                    if (isset(self::EXTENSION_MIME_MAP[$extension])) {
                        // File has a CAD extension, allow it even with generic MIME type
                        // Use the expected MIME type based on extension for Content-Type
                        $expectedMimes = self::EXTENSION_MIME_MAP[$extension];
                        $mimeType = $expectedMimes[0];
                    } else {
                        throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
                    }
                } else {
                    throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
                }
            }

            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(['error' => 'Could not open file'], Http::STATUS_INTERNAL_SERVER_ERROR);
            }

            $response = new StreamResponse($stream);
            $response->addHeader('Content-Type', $mimeType);
            $response->addHeader('Content-Disposition', 'inline; filename="' . $file->getName() . '"');
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
            
            // Check if MIME type is supported, with extension-based fallback for octet-stream
            if (!in_array($mimeType, self::SUPPORTED_MIME_TYPES, true)) {
                // If MIME type is octet-stream or unknown, check file extension as fallback
                if ($mimeType === 'application/octet-stream' || !self::isKnownCadMimeType($mimeType)) {
                    $extension = strtolower(pathinfo($file->getName(), PATHINFO_EXTENSION));
                    if (isset(self::EXTENSION_MIME_MAP[$extension])) {
                        // File has a CAD extension, allow it even with generic MIME type
                        // Use the expected MIME type based on extension for Content-Type
                        $expectedMimes = self::EXTENSION_MIME_MAP[$extension];
                        $mimeType = $expectedMimes[0];
                    } else {
                        throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
                    }
                } else {
                    throw new \UnexpectedValueException(self::ERROR_UNSUPPORTED_FILE_TYPE_WITH_MIME . $mimeType);
                }
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

    /**
     * Check if a MIME type is a known CAD MIME type (not octet-stream)
     */
    private static function isKnownCadMimeType(string $mimeType): bool
    {
        return $mimeType !== 'application/octet-stream' && 
               (strpos($mimeType, 'dwg') !== false || 
                strpos($mimeType, 'dxf') !== false ||
                strpos($mimeType, 'acad') !== false ||
                strpos($mimeType, 'autocad') !== false);
    }
}
