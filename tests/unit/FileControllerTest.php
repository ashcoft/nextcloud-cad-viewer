<?php
declare(strict_types=1);

/**
 * @copyright Copyright (c) 2024, CAD Viewer Contributors
 * @license MIT
 */

namespace OCA\CadViewer\Tests\Unit\Controller;

use OCA\CadViewer\Controller\FileController;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IRequest;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\TestCase;

class FileControllerTest extends TestCase {
    private IRequest $request;
    private IRootFolder $rootFolder;
    private IUserSession $userSession;
    private FileController $controller;

    protected function setUp(): void {
        parent::setUp();
        $this->request = $this->createMock(IRequest::class);
        $this->rootFolder = $this->createMock(IRootFolder::class);
        $this->userSession = $this->createMock(IUserSession::class);
        $this->controller = new FileController(
            'cadviewer',
            $this->request,
            $this->rootFolder,
            $this->userSession
        );
    }

    public function testGetFileUnauthorized(): void {
        $this->userSession->method('getUser')->willReturn(null);
        $result = $this->controller->getFile(123);
        $this->assertInstanceOf(DataResponse::class, $result);
        $this->assertEquals(Http::STATUS_UNAUTHORIZED, $result->getStatus());
    }

    public function testGetFileNotFound(): void {
        $user = $this->createMock(IUser::class);
        $user->method('getUID')->willReturn('testuser');
        $this->userSession->method('getUser')->willReturn($user);
        
        $folder = $this->createMock(\OCP\Files\Folder::class);
        $folder->method('getById')->with(123)->willReturn([]);
        $this->rootFolder->method('getUserFolder')->with('testuser')->willReturn($folder);
        
        $result = $this->controller->getFile(123);
        $this->assertInstanceOf(DataResponse::class, $result);
        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }
}
