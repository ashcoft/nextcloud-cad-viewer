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
use OCA\CadViewer\Tests\Fixtures\InMemoryAppConfig;
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
    /**
     * Build an AppConfig backed by an in-memory store.
     */
    private function config(): AppConfig
    {
        return new AppConfig(
            new InMemoryAppConfig(),
            $this->createMock(LoggerInterface::class),
        );
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
    }

    public function testPreviewsRoundTrips(): void
    {
        $config = $this->config();
        $config->setPreviews('no');

        $this->assertSame('no', $config->getPreviews());
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
        // Values written straight to the database bypass the setters, so the
        // getters have to reject them.
        $appConfig = new InMemoryAppConfig();
        $appConfig->setAppValueString('Theme', 'blue');
        $appConfig->setAppValueString('Previews', 'sometimes');
        $seeded = new AppConfig($appConfig, $this->createMock(LoggerInterface::class));

        $this->assertSame('light', $seeded->getTheme());
        $this->assertSame('yes', $seeded->getPreviews());
    }

    /**
     * The log lines must stay free of user input and file paths.
     */
    public function testLogsOnlyTheNormalizedValue(): void
    {
        $appConfig = new InMemoryAppConfig();

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())
            ->method('info')
            ->with('SetTheme: dark', ['app' => 'cad_viewer']);

        $config = new AppConfig($appConfig, $logger);
        $config->setTheme('  DARK  ');
    }
}
