<?php

/**
 * Cad Viewer AppConfig test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Config\AppConfig
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

use OCA\CadViewer\Config\AppConfig;
use OCP\AppFramework\Services\IAppConfig;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the app-wide viewer settings.
 */
#[AllowMockObjectsWithoutExpectations]
class AppConfigTest extends TestCase
{
    /** @var array<string, string> */
    private array $store = [];

    /**
     * Build an AppConfig backed by an in-memory store, so a value written by a
     * setter is the value the matching getter reads back.
     */
    private function config(): AppConfig
    {
        $store = &$this->store;

        $appConfig = $this->createMock(IAppConfig::class);
        $appConfig->method('setAppValueString')->willReturnCallback(
            static function (string $key, string $value) use (&$store): bool {
                $store[$key] = $value;

                return true;
            }
        );
        // A plain closure with `use (&$store)`: an arrow function would capture
        // the store by value and never see what the setter wrote.
        $appConfig->method('getAppValueString')->willReturnCallback(
            static function (string $key, string $default = '') use (&$store): string {
                return $store[$key] ?? $default;
            }
        );

        return new AppConfig($appConfig, $this->createMock(LoggerInterface::class));
    }

    public function testDefaultsWhenNothingIsStored(): void
    {
        $config = $this->config();

        $this->assertSame('light', $config->getTheme());
        $this->assertSame('yes', $config->getPreviews());
    }

    public function testThemeRoundTrips(): void
    {
        $config = $this->config();
        $config->setTheme('dark');

        $this->assertSame('dark', $config->getTheme());
        $this->assertSame('dark', $this->store['Theme']);
    }

    public function testPreviewsRoundTrips(): void
    {
        $config = $this->config();
        $config->setPreviews('no');

        $this->assertSame('no', $config->getPreviews());
        $this->assertSame('no', $this->store['Previews']);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function normalizationCases(): array
    {
        return [
            'trims and lower-cases' => ['  DARK  ', 'dark'],
            'accepts mixed case' => ['Dark', 'dark'],
            'rejects unknown values' => ['blue', 'light'],
            'rejects empty input' => ['', 'light'],
        ];
    }

    #[DataProvider('normalizationCases')]
    public function testThemeIsNormalized(string $input, string $expected): void
    {
        $config = $this->config();
        $config->setTheme($input);

        $this->assertSame($expected, $config->getTheme());
    }

    public function testInvalidPreviewsValueFallsBackToDefault(): void
    {
        $config = $this->config();
        $config->setPreviews('maybe');

        $this->assertSame('yes', $config->getPreviews());
    }

    /**
     * A value written straight to the database bypasses the setters, so it has
     * to be validated on read too. Otherwise the settings form would render
     * with no option selected.
     */
    public function testInvalidStoredValuesAreRejectedOnRead(): void
    {
        $this->store['Theme'] = 'blue';
        $this->store['Previews'] = 'sometimes';

        $config = $this->config();

        $this->assertSame('light', $config->getTheme());
        $this->assertSame('yes', $config->getPreviews());
    }

    /**
     * The log lines must stay free of user input and file paths.
     */
    public function testLogsOnlyTheNormalizedValue(): void
    {
        $appConfig = $this->createMock(IAppConfig::class);
        $appConfig->method('setAppValueString')->willReturn(true);

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())
            ->method('info')
            ->with('SetTheme: dark', ['app' => 'cad_viewer']);

        $config = new AppConfig($appConfig, $logger);
        $config->setTheme('  DARK  ');
    }
}
