<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Fixtures;

use OCP\Files\SimpleFS\ISimpleFile;

/**
 * A file stored by {@see InMemoryFolder}.
 *
 * Deleting it removes it from its folder so the storage logic under test sees
 * the same result it would from real app-data storage.
 */
class InMemoryFile implements ISimpleFile
{
    public function __construct(
        private readonly string $name,
        private string $content,
        private readonly ?InMemoryFolder $folder = null,
    ) {
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function delete(): void
    {
        $this->folder?->remove($this->name);
        $this->content = '';
    }

    public function getSize(): int|float
    {
        return strlen($this->content);
    }

    public function getETag(): string
    {
        return '';
    }

    public function getMTime(): int
    {
        return 0;
    }

    public function putContent($data): void
    {
        $this->content = (string) $data;
    }

    public function getMimeType(): string
    {
        return 'image/png';
    }

    public function getExtension(): string
    {
        return 'png';
    }

    public function read()
    {
        return $this->content;
    }

    public function write()
    {
        return true;
    }
}
