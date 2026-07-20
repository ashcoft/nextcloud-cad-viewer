<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Controller;

use OCA\CadViewer\AppInfo\Application;
use OCA\CadViewer\Config\AppConfig;
use OCA\CadViewer\Settings\AdminSettings;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\Util;

class AdminSettingsController extends Controller
{
    public function __construct(
        string $appName,
        IRequest $request,
        private readonly AppConfig $config,
    ) {
        parent::__construct($appName, $request);
    }

    public function index(): TemplateResponse
    {
        $data = [
            'theme' => $this->config->getTheme(),
            'previews' => $this->config->getPreviews(),
            'libraries' => $this->config->getLibraries(),
            'autosave' => $this->config->getAutosave(),
        ];

        Util::addScript(Application::APP_ID, 'adminSettings');
        Util::addStyle(Application::APP_ID, 'settings');

        return new TemplateResponse($this->appName, 'adminSettings', $data, TemplateResponse::RENDER_AS_BLANK);
    }

    #[AuthorizedAdminSetting(settings: AdminSettings::class)]
    public function settings(): array
    {
        $theme = trim($this->request->getParam('theme', ''));
        $previews = trim($this->request->getParam('previews', ''));
        $libraries = trim($this->request->getParam('libraries', ''));
        $autosave = trim($this->request->getParam('autosave', ''));

        $this->config->setTheme($theme);
        $this->config->setPreviews($previews);
        $this->config->setLibraries($libraries);
        $this->config->setAutosave($autosave);

        return [
            'theme' => $this->config->getTheme(),
            'previews' => $this->config->getPreviews(),
            'libraries' => $this->config->getLibraries(),
            'autosave' => $this->config->getAutosave(),
        ];
    }
}
