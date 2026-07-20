<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Settings;

use OCA\CadViewer\Controller\AdminSettingsController;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IL10N;
use OCP\Settings\ISettings;

class AdminSettings implements ISettings
{
    public function __construct(
        private readonly IConfig $config,
        private readonly IL10N $l10n,
        private readonly AdminSettingsController $settingsController,
    ) {
    }

    #[\Override]
    public function getForm(): TemplateResponse
    {
        return $this->settingsController->index();
    }

    #[\Override]
    public function getSection(): string
    {
        return 'cad_viewer';
    }

    #[\Override]
    public function getPriority(): int
    {
        return 60;
    }
}
