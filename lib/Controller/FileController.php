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
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IRequest;
use OCP\IUserSession;

class FileController extends Controller
{
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

    private IRootFolder $rootFolder;
    private IUserSession $userSession;

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

            $file = $this->getValidatedFile($user->getUID(), $fileId);

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

            $file = $this->getValidatedFile($user->getUID(), $fileId);

            $stream = $file->fopen('r');
            if ($stream === false) {
                return new DataResponse(['error' => 'Could not open file'], Http::STATUS_INTERNAL_SERVER_ERROR);
            }

            $response = new StreamResponse($stream);
            $response->addHeader('Content-Type', $file->getMimeType());
            $response->addHeader('Content-Disposition', 'inline; filename="' . htmlspecialchars($file->getName(), ENT_QUOTES, 'UTF-8') . '"');
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

            $file = $this->getValidatedFile($user->getUID(), $fileId);

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

    /**
     * Get and validate a CAD file from user storage
     *
     * @throws NotFoundException
     * @throws NotPermittedException
     */
    private function getValidatedFile(string $userId, int $fileId): \OCP\Files\File
    {
        $userFolder = $this->rootFolder->getUserFolder($userId);
        $files = $userFolder->getById($fileId);

        if (empty($files)) {
            throw new NotFoundException('File not found');
        }

        $file = $files[0];
        if (!($file instanceof \OCP\Files\File)) {
            throw new NotFoundException('Not a file');
        }

        if (!$file->isReadable()) {
            throw new NotPermittedException('Access denied');
        }

        $mimeType = $file->getMimeType();
        if (!in_array($mimeType, self::SUPPORTED_MIME_TYPES, true)) {
            throw new NotFoundException('Unsupported file type');
        }

        return $file;
    }
}
