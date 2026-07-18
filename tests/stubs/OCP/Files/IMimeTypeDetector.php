<?php

declare(strict_types=1);

namespace OCP\Files;

/**
 * Stub for IMimeTypeDetector interface.
 * Used for testing purposes only.
 */
interface IMimeTypeDetector
{
    /**
     * Get all MIME type mappings.
     *
     * @return array
     */
    public function getAllMappings(): array;
}
