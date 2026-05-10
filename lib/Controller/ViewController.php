<?php

declare(strict_types=1);

namespace OCA\CadViewer\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\IURLGenerator;

class ViewController extends Controller {
    public function __construct(
        IRequest $request,
        private IURLGenerator $urlGenerator,
    ) {
        parent::__construct($request);
    }

    public function index(): TemplateResponse {
        return new TemplateResponse('cad_viewer', 'main');
    }

    public function view(string $fileIds): TemplateResponse {
        return new TemplateResponse('cad_viewer', 'main', [
            'fileIds' => $fileIds,
        ]);
    }
}