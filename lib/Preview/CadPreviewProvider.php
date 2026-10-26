<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

namespace OCA\CadViewer\Preview;

use OCA\CadViewer\Service\ThumbnailService;
use OCP\Files\File;
use OCP\Files\FileInfo;
use OCP\IImage;
use OCP\Image;
use OCP\Preview\IProviderV2;

/**
 * Serves CAD previews from thumbnails rendered by the browser viewer.
 *
 * The provider never renders anything itself; it only returns a cached
 * thumbnail when the viewer has previously uploaded one, so Nextcloud falls
 * back to the generic file icon until the drawing has been opened once.
 */
class CadPreviewProvider implements IProviderV2
{
    /**
     * Matches every CAD mimetype the viewer supports.
     */
    public const MIME_TYPE_REGEX = '/application\/(acad|autocad_dwg|dwg|x-autocad|x-dwg|dxf|x-dxf)|image\/vnd\.(dwg|dxf)|image\/x-dxf/';

    public function __construct(
        private readonly ThumbnailService $thumbnailService,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    #[\Override]
    public function getMimeType(): string
    {
        return self::MIME_TYPE_REGEX;
    }

    /**
     * {@inheritDoc}
     */
    #[\Override]
    public function isAvailable(FileInfo $file): bool
    {
        return $file instanceof File && $this->thumbnailService->getThumbnail($file) !== null;
    }

    /**
     * {@inheritDoc}
     */
    #[\Override]
    public function getThumbnail(File $file, int $maxX, int $maxY): ?IImage
    {
        $thumbnail = $this->thumbnailService->getThumbnail($file);
        if ($thumbnail === null) {
            return null;
        }

        /** @psalm-suppress MissingDependency OCP\Image extends OC\Image, which is not part of the OCP stubs */
        $image = new Image();
        if ($image->loadFromData($thumbnail->getContent()) === false) {
            return null;
        }

        // Nextcloud's generator scales the result to the requested size.
        if ($maxX > 0 && $maxY > 0 && ($image->width() > $maxX || $image->height() > $maxY)) {
            $image->scaleDownToFit($maxX, $maxY);
        }

        return $image;
    }
}
