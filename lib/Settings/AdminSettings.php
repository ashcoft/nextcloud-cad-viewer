<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Settings;

use OCA\CadViewer\Controller\AdminSettingsController;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\Settings\IDelegatedSettings;

class AdminSettings implements IDelegatedSettings
{
    public function __construct(
        private readonly AdminSettingsController $settingsController,
    ) {
    }

    #[\Override]
    public function getName(): ?string
    {
        return null;
    }

    #[\Override]
    public function getAuthorizedAppConfig(): array
    {
        return [
            'cad_viewer' => ['/.*/'],
        ];
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
