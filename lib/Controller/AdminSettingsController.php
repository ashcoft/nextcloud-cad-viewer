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
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
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

    #[AuthorizedAdminSetting(settings: AdminSettings::class)]
    #[NoCSRFRequired]
    public function index(): TemplateResponse
    {
        Util::addScript(Application::APP_ID, 'adminSettings');
        Util::addStyle(Application::APP_ID, 'settings');

        return new TemplateResponse(
            $this->appName,
            'adminSettings',
            $this->currentSettings(),
            TemplateResponse::RENDER_AS_BLANK,
        );
    }

    /**
     * Persist the posted settings.
     *
     * A missing parameter keeps the stored value instead of falling back to the
     * default: the form always posts every field, but a partial request must
     * not silently reset the ones it omits.
     */
    #[AuthorizedAdminSetting(settings: AdminSettings::class)]
    public function settings(): DataResponse
    {
        $this->config->setTheme($this->stringParam('theme', $this->config->getTheme()));
        $this->config->setPreviews($this->stringParam('previews', $this->config->getPreviews()));

        return new DataResponse($this->currentSettings());
    }

    /**
     * @return array{theme: string, previews: string}
     */
    private function currentSettings(): array
    {
        return [
            'theme' => $this->config->getTheme(),
            'previews' => $this->config->getPreviews(),
        ];
    }

    private function stringParam(string $name, string $default): string
    {
        $value = $this->request->getParam($name, $default);

        return is_string($value) ? $value : $default;
    }
}
