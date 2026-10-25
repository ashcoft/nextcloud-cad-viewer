<?php

/**
 * Stubs for private Nextcloud server classes used by this app. There is no
 * OCP API for these yet (https://github.com/nextcloud/server/issues/9192), so
 * the MIME registration writes to the config directory directly. Used by
 * PHPStan and Psalm only; never loaded at runtime.
 */

declare(strict_types=1);

namespace {
    class OC
    {
        /** @var string */
        public static $configDir = '';
    }
}
