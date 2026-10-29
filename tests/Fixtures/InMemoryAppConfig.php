<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Fixtures;

use OCP\AppFramework\Services\IAppConfig;

/**
 * An IAppConfig backed by arrays, so a value written by a setter is the value
 * the matching getter reads back.
 *
 * A real implementation rather than a mock, following InMemoryFile and
 * InMemoryFolder: the value stored is the value read, which is exactly what the
 * settings tests need to assert round trips.
 *
 * Only app values are exercised by the app under test. The user-value methods
 * are backed by their own array rather than stubbed out, so a future test that
 * reaches for them cannot silently read back a default.
 */
class InMemoryAppConfig implements IAppConfig
{
    /** @var array<string, string> */
    public array $store = [];

    /** @var array<string, string> Keyed by "<userId>|<key>". */
    public array $userStore = [];

    public function getAppKeys(): array
    {
        return array_keys($this->store);
    }

    public function hasAppKey(string $key, ?bool $lazy = false): bool
    {
        return isset($this->store[$key]);
    }

    public function isSensitive(string $key, ?bool $lazy = false): bool
    {
        return false;
    }

    public function isLazy(string $key): bool
    {
        return false;
    }

    public function getAllAppValues(string $key = '', bool $filtered = false): array
    {
        return $this->store;
    }

    public function setAppValue(string $key, string $value): void
    {
        $this->store[$key] = $value;
    }

    public function setAppValueString(string $key, string $value, bool $lazy = false, bool $sensitive = false): bool
    {
        $this->store[$key] = $value;

        return true;
    }

    public function setAppValueInt(string $key, int $value, bool $lazy = false, bool $sensitive = false): bool
    {
        $this->store[$key] = (string) $value;

        return true;
    }

    public function setAppValueFloat(string $key, float $value, bool $lazy = false, bool $sensitive = false): bool
    {
        $this->store[$key] = (string) $value;

        return true;
    }

    public function setAppValueBool(string $key, bool $value, bool $lazy = false): bool
    {
        $this->store[$key] = $value ? '1' : '0';

        return true;
    }

    public function setAppValueArray(string $key, array $value, bool $lazy = false, bool $sensitive = false): bool
    {
        $this->store[$key] = (string) json_encode($value);

        return true;
    }

    public function getAppValue(string $key, string $default = ''): string
    {
        return $this->store[$key] ?? $default;
    }

    public function getAppValueString(string $key, string $default = '', bool $lazy = false): string
    {
        return $this->store[$key] ?? $default;
    }

    public function getAppValueInt(string $key, int $default = 0, bool $lazy = false): int
    {
        return isset($this->store[$key]) ? (int) $this->store[$key] : $default;
    }

    public function getAppValueFloat(string $key, float $default = 0, bool $lazy = false): float
    {
        return isset($this->store[$key]) ? (float) $this->store[$key] : $default;
    }

    public function getAppValueBool(string $key, bool $default = false, bool $lazy = false): bool
    {
        return isset($this->store[$key]) ? (bool) $this->store[$key] : $default;
    }

    public function getAppValueArray(string $key, array $default = [], bool $lazy = false): array
    {
        return isset($this->store[$key]) ? (array) json_decode($this->store[$key], true) : $default;
    }

    public function deleteAppValue(string $key): void
    {
        unset($this->store[$key]);
    }

    public function deleteAppValues(): void
    {
        $this->store = [];
    }

    public function setUserValue(string $userId, string $key, string $value, ?string $preCondition = null): void
    {
        $this->userStore[$userId . '|' . $key] = $value;
    }

    public function getUserValue(string $userId, string $key, string $default = ''): string
    {
        return $this->userStore[$userId . '|' . $key] ?? $default;
    }

    public function deleteUserValue(string $userId, string $key): void
    {
        unset($this->userStore[$userId . '|' . $key]);
    }
}
