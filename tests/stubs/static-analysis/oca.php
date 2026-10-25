<?php

/**
 * Stubs for OCA classes from other apps (files, files_sharing) that are not
 * part of the nextcloud/ocp package. Signatures mirror nextcloud/server
 * stable35. Used by PHPStan and Psalm only; never loaded at runtime.
 */

declare(strict_types=1);

namespace OCA\Files\Event {
    class LoadAdditionalScriptsEvent extends \OCP\EventDispatcher\Event
    {
    }
}

namespace OCA\Files_Sharing\Event {
    class BeforeTemplateRenderedEvent extends \OCP\EventDispatcher\Event
    {
        public const SCOPE_PUBLIC_SHARE_AUTH = 'publicShareAuth';

        public function getShare(): \OCP\Share\IShare
        {
        }

        public function getScope(): ?string
        {
        }
    }
}
