<?php

/**
 * Cad Viewer admin settings controller test suite.
 *
 * @category Tests
 * @package  OCA\CadViewer\Tests\Unit
 * @license  https://opensource.org/licenses/MIT MIT
 * @link     https://github.com/ashcoft/nextcloud-cad-viewer
 *
 * @covers \OCA\CadViewer\Controller\AdminSettingsController
 */

declare(strict_types=1);

namespace OCA\CadViewer\Tests\Unit;

require_once __DIR__ . '/../stubs/OC/OC.php';

use OCA\CadViewer\Config\AppConfig;
use OCA\CadViewer\Controller\AdminSettingsController;
use OCA\CadViewer\Settings\AdminSettings;
use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IAppConfig;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

/**
 * Test suite for the admin settings page and its save endpoint.
 */
#[AllowMockObjectsWithoutExpectations]
class AdminSettingsControllerTest extends TestCase
{
    /** @var array<string, string> */
    private array $store = [];

    protected function setUp(): void
    {
        parent::setUp();
        // OCP\Util::addScript resolves a translation factory from the server
        // container, which the app's test bootstrap does not provide.
        \OC::$server = $this->createStub(\OCP\IServerContainerExtended::class);
        $factory = $this->createMock(\OCP\L10N\IFactory::class);
        $factory->method('findLanguage')->willReturn('en');
        \OC::$server->method('get')->willReturn($factory);
    }

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

    /**
     * @param array<string, mixed> $params
     */
    private function controller(array $params = [], ?AppConfig $config = null): AdminSettingsController
    {
        $request = $this->createMock(IRequest::class);
        $request->method('getParam')->willReturnCallback(
            static fn (string $name, mixed $default = null): mixed => $params[$name] ?? $default
        );

        return new AdminSettingsController(
            'cad_viewer',
            $request,
            $config ?? $this->config(),
        );
    }

    public function testIndexRendersTheSettingsTemplate(): void
    {
        $response = $this->controller()->index();

        $this->assertInstanceOf(TemplateResponse::class, $response);
        $reflection = new \ReflectionObject($response);
        $this->assertSame('adminSettings', $reflection->getProperty('templateName')->getValue($response));
        $this->assertSame(
            TemplateResponse::RENDER_AS_BLANK,
            $reflection->getProperty('renderAs')->getValue($response),
        );
    }

    public function testIndexPassesTheStoredValuesToTheTemplate(): void
    {
        $this->store['Theme'] = 'dark';
        $this->store['Previews'] = 'no';

        $response = $this->controller()->index();
        $params = (new \ReflectionObject($response))->getProperty('params')->getValue($response);

        $this->assertSame('dark', $params['theme']);
        $this->assertSame('no', $params['previews']);
    }

    public function testSettingsPersistThePostedValues(): void
    {
        $response = $this->controller(['theme' => 'dark', 'previews' => 'no'])->settings();

        $this->assertInstanceOf(DataResponse::class, $response);
        $this->assertSame('dark', $this->store['Theme']);
        $this->assertSame('no', $this->store['Previews']);
        $this->assertSame(
            ['theme' => 'dark', 'previews' => 'no'],
            $response->getData(),
        );
    }

    public function testSettingsRejectInvalidValues(): void
    {
        $this->controller(['theme' => 'blue', 'previews' => 'maybe'])->settings();

        $this->assertSame('light', $this->store['Theme']);
        $this->assertSame('yes', $this->store['Previews']);
    }

    /**
     * A request that omits a field must keep the stored value. Falling back to
     * the default here would let a partial request silently reset a setting.
     */
    public function testSettingsKeepStoredValuesForOmittedParameters(): void
    {
        $this->store['Theme'] = 'dark';
        $this->store['Previews'] = 'no';

        $this->controller(['theme' => 'light'])->settings();

        $this->assertSame('light', $this->store['Theme']);
        $this->assertSame('no', $this->store['Previews'], 'omitted previews must not reset');
    }

    /**
     * Both endpoints change or expose app-wide configuration, so both must be
     * limited to administrators who may see this settings section.
     */
    public function testBothEndpointsRequireAuthorizedAdminSetting(): void
    {
        foreach (['index', 'settings'] as $method) {
            $attributes = (new \ReflectionMethod(AdminSettingsController::class, $method))
                ->getAttributes(AuthorizedAdminSetting::class);

            $this->assertNotEmpty($attributes, $method . ' must be admin-gated');
            $this->assertSame(
                AdminSettings::class,
                $attributes[0]->newInstance()->getSettings(),
                $method . ' must be gated on this app\'s settings',
            );
        }
    }

    /**
     * The form is embedded in the admin page, so it must not depend on a
     * request token the surrounding template does not carry.
     */
    public function testIndexCanBeRenderedWithoutARequestToken(): void
    {
        $attributes = (new \ReflectionMethod(AdminSettingsController::class, 'index'))
            ->getAttributes(NoCSRFRequired::class);

        $this->assertNotEmpty($attributes);
    }

    /**
     * The save endpoint is state-changing and must keep CSRF protection.
     */
    public function testSettingsKeepCsrfProtection(): void
    {
        $attributes = (new \ReflectionMethod(AdminSettingsController::class, 'settings'))
            ->getAttributes(NoCSRFRequired::class);

        $this->assertEmpty($attributes);
    }
}
