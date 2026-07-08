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
 * Registers the DWG/DXF mime types so CAD files open in the viewer instead of
 * being downloaded.
 *
 * Nextcloud apps cannot declare new mime types declaratively, so this repair
 * step runs on install and:
 *   - writes the extension -> mime type mapping into the instance
 *     `config/mimetypemapping.json` so newly uploaded files are detected
 *     correctly, and
 *   - reclassifies already stored .dwg/.dxf files in the filecache so existing
 *     files are matched by the viewer handler.
 */
class RegisterMimeType implements IRepairStep
{
    /**
     * Extension -> list of mime types (first entry is the canonical one).
     *
     * Mirrors the aliases declared in Application::MIME_TYPES so every known
     * DWG/DXF variant resolves to a viewer-supported mime type.
     */
    private const MAPPING = [
        'dwg' => [
            'application/dwg',
            'application/acad',
            'application/autocad_dwg',
            'application/x-autocad',
            'application/x-dwg',
            'image/vnd.dwg',
        ],
        'dxf' => [
            'image/vnd.dxf',
            'application/dxf',
            'application/x-dxf',
            'image/x-dxf',
        ],
    ];

    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly IMimeTypeLoader $mimeTypeLoader,
    ) {
    }

    public function getName(): string
    {
        return 'Register DWG/DXF mime types for the CAD Viewer';
    }

    public function run(IOutput $output): void
    {
        $this->logger->info('CAD Viewer: registering DWG/DXF mime types');

        // New uploads first, so the mapping is available when reclassifying.
        $this->registerForNewFiles();
        $this->registerForExistingFiles();

        $this->logger->info('CAD Viewer: DWG/DXF mime types registered');
    }

    /**
     * Merge the extension mapping into the instance mimetypemapping.json so
     * newly uploaded files get the correct mime type.
     */
    private function registerForNewFiles(): void
    {
        $mappingFile = \OC::$configDir . 'mimetypemapping.json';
        $mapping = [];

        if (file_exists($mappingFile)) {
            $decoded = json_decode((string) file_get_contents($mappingFile), true);
            if (is_array($decoded)) {
                $mapping = $decoded;
            }
        }

        foreach (self::MAPPING as $extension => $mimeTypes) {
            $existing = $mapping[$extension] ?? [];
            $merged = array_values(array_unique([...$existing, ...$mimeTypes]));
            $mapping[$extension] = $merged;
        }

        file_put_contents(
            $mappingFile,
            json_encode($mapping, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT),
        );
    }

    /**
     * Reclassify already stored files whose extension matches a CAD format so
     * the viewer handler can open them instead of triggering a download.
     */
    private function registerForExistingFiles(): void
    {
        foreach (self::MAPPING as $extension => $mimeTypes) {
            $canonical = $mimeTypes[0];
            $mimeTypeId = $this->mimeTypeLoader->getId($canonical);
            $this->mimeTypeLoader->updateFilecache($extension, $mimeTypeId);
        }
    }
}
