<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Preview;

use OCA\CadViewer\Config\AppConfig;
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
 * thumbnail once the viewer has uploaded one. Until then `isAvailable()`
 * reports false so Nextcloud keeps showing the generic file icon and never
 * caches a failed preview attempt.
 *
 * Administrators can turn previews off entirely from the app settings, which
 * also keeps the viewer from uploading any thumbnails.
 */
class CadPreviewProvider implements IProviderV2
{
    /**
     * Matches every CAD MIME type the viewer supports.
     *
     * Anchored so a MIME type merely *starting* with a CAD one (for example
     * `application/dwgx`) is not treated as a CAD drawing. Nextcloud matches
     * this with `preg_match`, so an unanchored pattern would over-match.
     */
    public const MIME_TYPE_REGEX = '~^(?:application/(?:acad|autocad_dwg|dwg|x-autocad|x-dwg|dxf|x-dxf)'
        . '|image/(?:vnd\.(?:dwg|dxf)|x-dxf))$~';

    public function __construct(
        private readonly ThumbnailService $thumbnailService,
        private readonly AppConfig $appConfig,
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
        if ($this->appConfig->getPreviews() !== 'yes') {
            return false;
        }

        return $file instanceof File && $this->thumbnailService->getThumbnail($file) !== null;
    }

    /**
     * {@inheritDoc}
     *
     * The stored image is scaled down to the requested size before it reaches
     * Nextcloud's preview pipeline.
     */
    #[\Override]
    public function getThumbnail(File $file, int $maxX, int $maxY): ?IImage
    {
        if ($this->appConfig->getPreviews() !== 'yes') {
            return null;
        }

        $thumbnail = $this->thumbnailService->getThumbnail($file);
        if ($thumbnail === null) {
            return null;
        }

        return $this->loadImage($thumbnail->getContent(), $maxX, $maxY);
    }

    /**
     * Decode PNG bytes into an image, or null when they cannot be read.
     *
     * @psalm-suppress MissingDependency OCP\Image extends the private OC\Image, which the OCP stub omits.
     * @psalm-suppress UndefinedMethod Same reason: the inherited methods are not visible to Psalm.
     */
    private function loadImage(string $content, int $maxX, int $maxY): ?IImage
    {
        $image = new Image();
        if ($image->loadFromData($content) === false) {
            return null;
        }

        if ($maxX > 0 && $maxY > 0 && ($image->width() > $maxX || $image->height() > $maxY)) {
            $image->scaleDownToFit($maxX, $maxY);
        }

        return $image;
    }
}
