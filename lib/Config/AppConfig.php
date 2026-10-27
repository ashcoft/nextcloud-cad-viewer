<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Config;

use OCP\AppFramework\Services\IAppConfig;
use Psr\Log\LoggerInterface;

/**
 * App-wide viewer settings, read and written from the admin settings page.
 *
 * Only settings the viewer actually honours are kept here: the theme it opens
 * with, and whether previews may be rendered and stored at all.
 */
class AppConfig
{
    public const DEFAULT_THEME = 'light';
    public const DEFAULT_PREVIEWS = 'yes';

    public const THEMES = ['light', 'dark'];
    public const YES_NO = ['yes', 'no'];

    private const KEY_THEME = 'Theme';
    private const KEY_PREVIEWS = 'Previews';

    public function __construct(
        private readonly IAppConfig $config,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function setTheme(string $theme): void
    {
        $theme = $this->normalize($theme, self::THEMES, self::DEFAULT_THEME);
        $this->logger->info('SetTheme: ' . $theme, ['app' => 'cad_viewer']);
        $this->config->setAppValueString(self::KEY_THEME, $theme);
    }

    public function getTheme(): string
    {
        return $this->normalize(
            $this->config->getAppValueString(self::KEY_THEME),
            self::THEMES,
            self::DEFAULT_THEME,
        );
    }

    public function setPreviews(string $previews): void
    {
        $previews = $this->normalize($previews, self::YES_NO, self::DEFAULT_PREVIEWS);
        $this->logger->info('SetPreviews: ' . $previews, ['app' => 'cad_viewer']);
        $this->config->setAppValueString(self::KEY_PREVIEWS, $previews);
    }

    public function getPreviews(): string
    {
        return $this->normalize(
            $this->config->getAppValueString(self::KEY_PREVIEWS),
            self::YES_NO,
            self::DEFAULT_PREVIEWS,
        );
    }

    /**
     * Lower-case and trim a value, falling back to the default when it is not
     * one of the allowed ones.
     *
     * Applied on read as well as on write: a value written straight to the
     * database (occ config:app:set) would otherwise reach the viewer unchecked
     * and leave the settings form with no option selected.
     *
     * @param string[] $allowed
     */
    private function normalize(string $value, array $allowed, string $default): string
    {
        $value = strtolower(trim($value));

        return in_array($value, $allowed, true) ? $value : $default;
    }
}
