<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Migration;

use OCA\CadViewer\AppInfo\Application;
use OCP\Migration\IOutput;

/**
 * Registers the DWG/DXF MIME types so Nextcloud recognises CAD drawings
 * instead of treating them as application/octet-stream.
 */
class RegisterMimeType extends MimeTypeMigration
{
    private const EXTENSION_MAPPING = [
        'dwg' => ['application/dwg'],
        'dxf' => ['image/vnd.dxf'],
    ];

    private const ALIAS_MAPPING = [
        'application/acad' => 'dwg',
        'application/autocad_dwg' => 'dwg',
        'application/x-autocad' => 'dwg',
        'application/x-dwg' => 'dwg',
        'image/vnd.dwg' => 'dwg',
        'application/dxf' => 'dxf',
        'application/x-dxf' => 'dxf',
        'image/x-dxf' => 'dxf',
    ];

    #[\Override]
    public function getName(): string
    {
        return 'Register MIME types for CAD Viewer';
    }

    #[\Override]
    public function run(IOutput $output): void
    {
        $output->info('Registering the CAD MIME types...');

        $this->registerForExistingFiles();
        $this->registerForNewFiles();

        $output->info('The CAD MIME types were successfully registered.');
    }

    /**
     * Re-detect the MIME type of files uploaded before the mapping existed.
     */
    private function registerForExistingFiles(): void
    {
        $dwgId = $this->mimeTypeLoader->getId(Application::CANONICAL_DWG_MIME);
        $this->mimeTypeLoader->updateFilecache('dwg', $dwgId);

        $dxfId = $this->mimeTypeLoader->getId(Application::CANONICAL_DXF_MIME);
        $this->mimeTypeLoader->updateFilecache('dxf', $dxfId);
    }

    /**
     * Write the extension mapping and aliases for files uploaded later.
     */
    private function registerForNewFiles(): void
    {
        $this->mergeIntoConfigFile(
            \OC::$configDir . self::CUSTOM_MIMETYPEMAPPING,
            self::EXTENSION_MAPPING,
        );
        $this->mergeIntoConfigFile(
            \OC::$configDir . self::CUSTOM_MIMETYPEALIASES,
            self::ALIAS_MAPPING,
        );
    }

    /**
     * Merge entries into a JSON config file, creating it when absent.
     *
     * @param string $filename Absolute path of the config file.
     * @param array<string, mixed> $data Entries to merge in.
     */
    private function mergeIntoConfigFile(string $filename, array $data): void
    {
        $existing = [];
        if (file_exists($filename)) {
            $decoded = json_decode((string)file_get_contents($filename), true);
            if (is_array($decoded)) {
                $existing = $decoded;
            }
        }

        file_put_contents(
            $filename,
            json_encode(array_merge($existing, $data), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        );
    }
}
