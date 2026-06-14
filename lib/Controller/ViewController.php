<?php

declare(strict_types=1);

namespace OCA\CadViewer\Controller;

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;

class ViewController extends Controller
{
    public function __construct(
        string $appName,
        IRequest $request,
    ) {
        parent::__construct($appName, $request);
    }

    #[NoAdminRequired]
    public function index(): TemplateResponse
    {
        return new TemplateResponse(Application::APP_ID, 'main', []);
    }

    /**
     * Open the CAD viewer for a specific file.
     * This endpoint is accessed via the Files sidebar action and needs to work
     * without CSRF validation since it's triggered from JavaScript.
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    public function view(string $fileIds = ''): TemplateResponse
    {
        return new TemplateResponse(Application::APP_ID, 'main', [
            'fileIds' => $fileIds,
        ]);
    }
}
