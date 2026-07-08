<?php

declare(strict_types=1);

/**
 * Minimal Nextcloud interface stubs used by the unit test harness when the
 * real Nextcloud core is not available (e.g. in a sandboxed environment).
 *
 * These mirror the subset of the public API consumed by the CAD Viewer mime
 * type migrations.
 *
 * @license https://opensource.org/licenses/MIT MIT
 */

namespace OCP\Migration {
    interface IOutput
    {
        public function debug(string $message): void;

        public function info($message): void;

        public function warning($message): void;

        public function startProgress($max = 0): void;

        public function advance($step = 1, $description = ''): void;

        public function finishProgress(): void;
    }

    interface IRepairStep
    {
        public function getName(): string;

        public function run(IOutput $output): void;
    }
}

namespace OCP\Files {
    interface IMimeTypeLoader
    {
        public function getId(string $mimetype): int;

        public function updateFilecache(string $ext, int $mimeTypeId): int;
    }
}
