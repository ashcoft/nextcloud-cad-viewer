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
use OCP\AppFramework\Http\ContentSecurityPolicy;
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
        // No CDN allowance here: this page only lists recent drawings and
        // links to the viewer, so it never fetches the viewer's resources.
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
        return $this->allowViewerResources(new TemplateResponse(Application::APP_ID, 'main', [
            'fileIds' => $fileIds,
        ]));
    }

    /**
     * Let the viewer page reach the CDN it loads fonts and templates from.
     *
     * The library fetches `fonts.json` and the font binaries with `fetch()`,
     * which the browser checks against `connect-src`. The MTEXT worker runs in
     * its own context, so it needs the same allowance on the response that
     * serves its script; see AssetController.
     *
     * The policy is merged with Nextcloud's defaults by CSPMiddleware, so the
     * existing 'self' entries stay in place.
     */
    private function allowViewerResources(TemplateResponse $response): TemplateResponse
    {
        $policy = new ContentSecurityPolicy();
        $policy->addAllowedConnectDomain(Application::VIEWER_RESOURCE_CDN);
        $response->setContentSecurityPolicy($policy);

        return $response;
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
