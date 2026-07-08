<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Migration;

use OCP\Files\IMimeTypeLoader;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;
use Psr\Log\LoggerInterface;

/**
 * Removes the DWG/DXF mime type registration when the app is uninstalled so the
 * files fall back to their generic handling (download) again.
 */
class UnregisterMimeType implements IRepairStep
{
    private const EXTENSIONS = ['dwg', 'dxf'];

    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly IMimeTypeLoader $mimeTypeLoader,
    ) {
    }

    public function getName(): string
    {
        return 'Unregister DWG/DXF mime types for the CAD Viewer';
    }

    public function run(IOutput $output): void
    {
        $this->logger->info('CAD Viewer: unregistering DWG/DXF mime types');

        $this->unregisterForExistingFiles();
        $this->unregisterForNewFiles();

        $this->logger->info('CAD Viewer: DWG/DXF mime types unregistered');
    }

    /**
     * Reclassify stored CAD files to a generic mime type.
     */
    private function unregisterForExistingFiles(): void
    {
        $genericId = $this->mimeTypeLoader->getId('application/octet-stream');

        foreach (self::EXTENSIONS as $extension) {
            $this->mimeTypeLoader->updateFilecache($extension, $genericId);
        }
    }

    /**
     * Drop the CAD extensions from the instance mimetypemapping.json.
     */
    private function unregisterForNewFiles(): void
    {
        $mappingFile = \OC::$configDir . 'mimetypemapping.json';
        if (!file_exists($mappingFile)) {
            return;
        }

        $mapping = json_decode((string) file_get_contents($mappingFile), true);
        if (!is_array($mapping)) {
            return;
        }

        foreach (self::EXTENSIONS as $extension) {
            unset($mapping[$extension]);
        }

        file_put_contents(
            $mappingFile,
            json_encode($mapping, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT),
        );
    }
}
