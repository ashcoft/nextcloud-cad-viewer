<?php
declare(strict_types=1);

/**
 * @copyright Copyright (c) 2024, CAD Viewer Contributors
 * @license MIT
 */

namespace OCA\CadViewer\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\FileDisplayResponse;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IRequest;
use OCP\IUserSession;

class FileController extends Controller {
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
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function getFile(int $fileId): DataResponse {
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

            if (!$file->isReadable()) {
                return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
            }

            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, ['application/acad', 'image/vnd.dxf', 'application/x-autocad'])) {
                return new DataResponse(['error' => 'Unsupported file type'], Http::STATUS_UNSUPPORTED_MEDIA_TYPE);
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
        } catch (\Exception $e) {
            return new DataResponse(['error' => 'Internal server error'], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function preview(int $fileId) {
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

            if (!$file->isReadable()) {
                return new DataResponse(['error' => 'Access denied'], Http::STATUS_FORBIDDEN);
            }

            return new FileDisplayResponse($file, Http::STATUS_OK, ['Content-Type' => $file->getMimeType()]);
        } catch (NotFoundException $e) {
            return new DataResponse(['error' => 'File not found'], Http::STATUS_NOT_FOUND);
        } catch (\Exception $e) {
            return new DataResponse(['error' => 'Internal server error'], Http::STATUS_INTERNAL_SERVER_ERROR);
        }
    }
}
