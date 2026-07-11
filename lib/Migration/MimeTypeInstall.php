<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Migration;

use OCP\Migration\IOutput;

/**
 * Repair step executed on app install / enable.
 *
 * Registers the DWG and DXF mimetypes so that files with those extensions are
 * detected with a mime the CAD Viewer handler can open, and refreshes the
 * filecache for files that were uploaded before the app was enabled.
 */
class MimeTypeInstall extends MimeTypeBase
{
    public function getName(): string
    {
        return 'Register DWG/DXF mimetypes for the CAD Viewer';
    }

    public function run(IOutput $output): void
    {
        $output->info('Registering DWG/DXF mimetypes...');

        // Make sure the canonical mimes exist in the database and re-detect the
        // mime type of already uploaded .dwg / .dxf files based on their extension.
        foreach (self::EXT_MIME_MAP as $ext => $mimes) {
            $canonical = $mimes[0];
            $mimeTypeId = $this->mimeTypeLoader->getId($canonical);
            $this->mimeTypeLoader->updateFilecache($ext, $mimeTypeId);
        }

        // Persist the extension -> mime mapping so new uploads are detected
        // correctly. Nextcloud reads the global mimetypemapping.json at runtime.
        $configDir = $this->configDir();
        if ($configDir !== null) {
            $this->appendToMapping($configDir . '/' . self::CUSTOM_MIMETYPEMAPPING, self::EXT_MIME_MAP);
            $this->appendToAliases($configDir . '/' . self::CUSTOM_MIMETYPEALIASES, self::EXT_MIME_MAP);
        }

        $this->updateMimeTypeJs();

        $output->info('...done.');
    }
}
