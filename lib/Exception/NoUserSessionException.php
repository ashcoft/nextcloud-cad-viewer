<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Exception;

/**
 * Thrown when a drawing operation runs without an authenticated user.
 */
class NoUserSessionException extends \RuntimeException
{
}
