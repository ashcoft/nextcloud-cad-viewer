<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Migration;

use OCP\Files\IMimeTypeLoader;
use OCP\Migration\IRepairStep;

/**
 * Base class for the CAD MIME type repair steps.
 *
 * Nextcloud has no public API to register MIME types at runtime
 * (https://github.com/nextcloud/server/issues/9192), so the mappings are
 * written to config/mimetypemapping.json and config/mimetypealiases.json, the
 * approach recommended by the Nextcloud documentation and shared by other
 * apps.
 */
abstract class MimeTypeMigration implements IRepairStep
{
    protected const CUSTOM_MIMETYPEMAPPING = 'mimetypemapping.json';
    protected const CUSTOM_MIMETYPEALIASES = 'mimetypealiases.json';

    public function __construct(protected readonly IMimeTypeLoader $mimeTypeLoader)
    {
    }
}
