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
