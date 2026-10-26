<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Fixtures;

use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;

/**
 * An in-memory ISimpleFolder so the thumbnail storage logic runs for real in
 * tests instead of being mocked away.
 */
class InMemoryFolder implements ISimpleFolder
{
    /** @var array<string, InMemoryFile> */
    public array $files = [];

    public function getDirectoryListing(): array
    {
        return array_values($this->files);
    }

    public function fileExists(string $name): bool
    {
        return isset($this->files[$name]);
    }

    public function getFile(string $name): ISimpleFile
    {
        return $this->files[$name];
    }

    public function newFile(string $name, mixed $content = null): ISimpleFile
    {
        $file = new InMemoryFile($name, is_string($content) ? $content : '', $this);
        $this->files[$name] = $file;

        return $file;
    }

    /**
     * Remove a stored file, used by {@see InMemoryFile::delete()}.
     */
    public function remove(string $name): void
    {
        unset($this->files[$name]);
    }

    public function delete(): void
    {
        $this->files = [];
    }

    public function getName(): string
    {
        return 'thumbnails';
    }

    public function getFolder(string $name): ISimpleFolder
    {
        return $this;
    }

    public function newFolder(string $path): ISimpleFolder
    {
        return $this;
    }

    public function getOrCreateFolder(string $path, int $maxRetries = 5): ISimpleFolder
    {
        return $this;
    }
}
