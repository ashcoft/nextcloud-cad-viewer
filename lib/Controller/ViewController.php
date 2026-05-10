<?php

declare(strict_types=1);

namespace OCA\CadViewer\Controller;

use OCA\CadViewer\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\IURLGenerator;

class ViewController extends Controller {
    public function __construct(
        IRequest $request,
        private IURLGenerator $urlGenerator,
    ) {
        parent::__construct(Application::APP_ID, $request);
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    public function index(): TemplateResponse {
        return new TemplateResponse(Application::APP_ID, 'main', []);
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    public function view(string $fileIds = ''): TemplateResponse {
        return new TemplateResponse(Application::APP_ID, 'main', [
            'fileIds' => $fileIds,
        ]);
    }
}
