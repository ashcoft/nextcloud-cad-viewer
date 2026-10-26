<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Fixtures;

use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;

/**
 * An in-memory folder tree so the thumbnail storage logic runs for real in
 * tests instead of being mocked away.
 */
class InMemoryFolder implements ISimpleFolder
{
    /** @var array<string, InMemoryFile> */
    public array $files = [];

    /** @var array<string, InMemoryFolder> */
    public array $folders = [];

    public function __construct(
        private readonly string $name = '',
        private readonly ?InMemoryFolder $parent = null,
    ) {
    }

    /**
     * @return list<InMemoryFile>
     */
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
        if (!isset($this->files[$name])) {
            throw new NotFoundException($name);
        }

        return $this->files[$name];
    }

    public function newFile(string $name, mixed $content = null): ISimpleFile
    {
        $file = new InMemoryFile($name, is_string($content) ? $content : '', $this);
        $this->files[$name] = $file;

        return $file;
    }

    public function delete(): void
    {
        $this->parent?->removeFolder($this->name);
        $this->files = [];
        $this->folders = [];
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getFolder(string $name): ISimpleFolder
    {
        if (!isset($this->folders[$name])) {
            throw new NotFoundException($name);
        }

        return $this->folders[$name];
    }

    public function newFolder(string $path): ISimpleFolder
    {
        $folder = new InMemoryFolder($path, $this);
        $this->folders[$path] = $folder;

        return $folder;
    }

    public function getOrCreateFolder(string $path, int $maxRetries = 5): ISimpleFolder
    {
        return $this->folders[$path] ?? $this->newFolder($path);
    }

    /**
     * Remove a stored file, used by {@see InMemoryFile::delete()}.
     */
    public function remove(string $name): void
    {
        unset($this->files[$name]);
    }

    /**
     * Remove a child folder, used by {@see self::delete()}.
     */
    public function removeFolder(string $name): void
    {
        unset($this->folders[$name]);
    }
}
