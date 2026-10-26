<?php

declare(strict_types=1);

namespace OCA\CadViewer\Controller;

use OCA\CadViewer\AppInfo\Application;
use OCA\CadViewer\Service\BlankDrawingService;
use OCA\CadViewer\Service\RecentDrawingsService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

class ViewController extends Controller
{
    public function __construct(
        string $appName,
        IRequest $request,
        private readonly RecentDrawingsService $recentDrawings,
        private readonly BlankDrawingService $blankDrawings,
        private readonly LoggerInterface $logger,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * Start page: recent drawings and the option to create a blank one.
     *
     * CSRF is not required: this is a plain page navigation (bookmark, app
     * menu) that carries no request token, just like the Files app's own
     * entry point.
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    public function index(): TemplateResponse
    {
        return new TemplateResponse(Application::APP_ID, 'start', [
            'recentDrawings' => $this->recentDrawings->getRecentDrawings(),
        ]);
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

    /**
     * Create a blank DXF drawing and return its file id.
     *
     * The client navigates to the viewer once the file exists. This is a
     * state-changing request, so it keeps the default CSRF protection.
     */
    #[NoAdminRequired]
    public function createBlank(): DataResponse
    {
        $name = $this->request->getParam('name', '');

        try {
            $file = $this->blankDrawings->create(is_string($name) ? $name : '');
        } catch (\Throwable $e) {
            // Log the class only: exception messages can contain file paths.
            $this->logger->error(
                'CAD Viewer: could not create a blank drawing',
                ['error' => $e::class],
            );

            return new DataResponse(
                ['error' => 'Could not create the drawing.'],
                Http::STATUS_INTERNAL_SERVER_ERROR,
            );
        }

        return new DataResponse(['fileId' => $file->getId()], Http::STATUS_CREATED);
    }
}
