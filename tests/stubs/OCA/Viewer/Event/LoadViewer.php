<?php

declare(strict_types=1);

namespace OCA\Viewer\Event;

/**
 * Event fired when the Nextcloud Viewer loads.
 *
 * This event is dispatched by the Viewer app to allow other apps
 * to register handlers for specific file types.
 *
 * @package OCA\Viewer\Event
 */
class LoadViewer extends \OCP\EventDispatcher\Event
{
    // This event is used to trigger handler registration
}
