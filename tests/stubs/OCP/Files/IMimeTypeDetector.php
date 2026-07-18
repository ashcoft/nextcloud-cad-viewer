<?php

declare(strict_types=1);

namespace OCP\Files;

/**
 * Interface for MIME type detection in Nextcloud.
 *
 * @since 28.0.0
 */
interface IMimeTypeDetector
{
    /**
     * Get all MIME type mappings.
     *
     * @return array<string, string>
     */
    public function getAllMappings(): array;

    /**
     * Register a MIME type for a file extension.
     *
     * @param string $mimetype The MIME type
     * @param string $ext The file extension (without dot)
     *
     * @return void
     */
    public function registerType(string $mimetype, string $ext): void;
}
