<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Migration;

use OCP\Migration\IOutput;

/**
 * Repair step executed on app uninstall / disable.
 *
 * Reverts the filecache entries to a downloadable type and removes the CAD
 * Viewer extension mapping and aliases so the instance is left in a clean
 * state.
 */
class MimeTypeUninstall extends MimeTypeBase
{
    public function getName(): string
    {
        return 'Unregister DWG/DXF mimetypes for the CAD Viewer';
    }

    public function run(IOutput $output): void
    {
        $output->info('Unregistering DWG/DXF mimetypes...');

        // Revert existing files back to a generic, downloadable type.
        $mimeTypeId = $this->mimeTypeLoader->getId('application/octet-stream');
        foreach (array_keys(self::EXT_MIME_MAP) as $ext) {
            $this->mimeTypeLoader->updateFilecache($ext, $mimeTypeId);
        }

        $configDir = $this->configDir();
        if ($configDir !== null) {
            $this->removeFromMapping($configDir . '/' . self::CUSTOM_MIMETYPEMAPPING, self::EXT_MIME_MAP);
            $this->removeFromAliases($configDir . '/' . self::CUSTOM_MIMETYPEALIASES, self::EXT_MIME_MAP);
        }

        $this->updateMimeTypeJs();

        $output->info('...done.');
    }
}
