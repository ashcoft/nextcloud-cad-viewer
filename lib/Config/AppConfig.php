<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Config;

use OCP\AppFramework\Services\IAppConfig;
use Psr\Log\LoggerInterface;

class AppConfig
{
    private const DEFAULT_THEME = 'light';
    private const DEFAULT_PREVIEWS = 'yes';
    private const DEFAULT_LIBRARIES = 'yes';
    private const DEFAULT_AUTOSAVE = 'yes';

    private const KEY_THEME = 'Theme';
    private const KEY_PREVIEWS = 'Previews';
    private const KEY_LIBRARIES = 'Libraries';
    private const KEY_AUTOSAVE = 'Autosave';

    public function __construct(
        private readonly IAppConfig $config,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function setTheme(string $theme): void
    {
        $theme = strtolower(trim($theme));
        if (!in_array($theme, ['light', 'dark'], true)) {
            $theme = self::DEFAULT_THEME;
        }
        $this->logger->info('SetTheme: ' . $theme, ['app' => 'cad_viewer']);
        $this->config->setAppValueString(self::KEY_THEME, $theme);
    }

    public function getTheme(): string
    {
        $val = $this->config->getAppValueString(self::KEY_THEME);
        if (empty($val)) {
            $val = self::DEFAULT_THEME;
        }

        return $val;
    }

    public function setPreviews(string $previews): void
    {
        $previews = strtolower(trim($previews));
        if (!in_array($previews, ['yes', 'no'], true)) {
            $previews = self::DEFAULT_PREVIEWS;
        }
        $this->logger->info('SetPreviews: ' . $previews, ['app' => 'cad_viewer']);
        $this->config->setAppValueString(self::KEY_PREVIEWS, $previews);
    }

    public function getPreviews(): string
    {
        $val = $this->config->getAppValueString(self::KEY_PREVIEWS);
        if (empty($val)) {
            $val = self::DEFAULT_PREVIEWS;
        }

        return $val;
    }

    public function setLibraries(string $libraries): void
    {
        $libraries = strtolower(trim($libraries));
        if (!in_array($libraries, ['yes', 'no'], true)) {
            $libraries = self::DEFAULT_LIBRARIES;
        }
        $this->logger->info('SetLibraries: ' . $libraries, ['app' => 'cad_viewer']);
        $this->config->setAppValueString(self::KEY_LIBRARIES, $libraries);
    }

    public function getLibraries(): string
    {
        $val = $this->config->getAppValueString(self::KEY_LIBRARIES);
        if (empty($val)) {
            $val = self::DEFAULT_LIBRARIES;
        }

        return $val;
    }

    public function setAutosave(string $autosave): void
    {
        $autosave = strtolower(trim($autosave));
        if (!in_array($autosave, ['yes', 'no'], true)) {
            $autosave = self::DEFAULT_AUTOSAVE;
        }
        $this->logger->info('SetAutosave: ' . $autosave, ['app' => 'cad_viewer']);
        $this->config->setAppValueString(self::KEY_AUTOSAVE, $autosave);
    }

    public function getAutosave(): string
    {
        $val = $this->config->getAppValueString(self::KEY_AUTOSAVE);
        if (empty($val)) {
            $val = self::DEFAULT_AUTOSAVE;
        }

        return $val;
    }
}
