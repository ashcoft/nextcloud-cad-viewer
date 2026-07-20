<?php

declare(strict_types=1);

namespace OCA\CadViewer\Settings;

use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

class AdminSection implements IIconSection
{
    public function __construct(
        private readonly IURLGenerator $url,
        private readonly IL10N $l10n
    ) {
    }

    #[\Override]
    public function getID(): string
    {
        return 'cad_viewer';
    }

    #[\Override]
    public function getName(): string
    {
        return $this->l10n->t('CAD Viewer');
    }

    #[\Override]
    public function getPriority(): int
    {
        return 75;
    }

    #[\Override]
    public function getIcon(): string
    {
        return $this->url->imagePath('cad_viewer', 'app.svg');
    }
}
