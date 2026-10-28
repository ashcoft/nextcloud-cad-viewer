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

use OCA\CadViewer\Config\AppConfig;
use OCA\CadViewer\Controller\AdminSettingsController;
use OCA\CadViewer\Settings\AdminSettings;
use OCA\CadViewer\Tests\Fixtures\InMemoryAppConfig;
use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\TemplateResponse;
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
    protected function setUp(): void
    {
        parent::setUp();
        // The stub declares several namespaces, so it cannot go through the
        // PSR-4 autoloader and is loaded here rather than at file scope.
        require_once __DIR__ . '/../stubs/OC/OC.php';
        // OCP\Util::addScript resolves a translation factory from the server
        // container, which the app's test bootstrap does not provide.
        \OC::$server = $this->createStub(\OCP\IServerContainerExtended::class);
        $factory = $this->createMock(\OCP\L10N\IFactory::class);
        $factory->method('findLanguage')->willReturn('en');
        \OC::$server->method('get')->willReturn($factory);
    }

    private function config(): AppConfig
    {
        return new AppConfig(
            new InMemoryAppConfig(),
            $this->createMock(LoggerInterface::class),
        );
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
        $config = $this->config();
        $config->setTheme('dark');
        $config->setPreviews('no');

        $response = $this->controller([], $config)->index();
        $params = (new \ReflectionObject($response))->getProperty('params')->getValue($response);

        $this->assertSame('dark', $params['theme']);
        $this->assertSame('no', $params['previews']);
    }

    public function testSettingsPersistThePostedValues(): void
    {
        $config = $this->config();
        $response = $this->controller(['theme' => 'dark', 'previews' => 'no'], $config)->settings();

        $this->assertInstanceOf(DataResponse::class, $response);
        $this->assertSame('dark', $config->getTheme());
        $this->assertSame('no', $config->getPreviews());
        $this->assertSame(
            ['theme' => 'dark', 'previews' => 'no'],
            $response->getData(),
        );
    }

    public function testSettingsRejectInvalidValues(): void
    {
        $config = $this->config();
        $this->controller(['theme' => 'blue', 'previews' => 'maybe'], $config)->settings();

        $this->assertSame('light', $config->getTheme());
        $this->assertSame('yes', $config->getPreviews());
    }

    /**
     * A request that omits a field must keep the stored value. Falling back to
     * the default here would let a partial request silently reset a setting.
     */
    public function testSettingsKeepStoredValuesForOmittedParameters(): void
    {
        $config = $this->config();
        $config->setTheme('dark');
        $config->setPreviews('no');

        $this->controller(['theme' => 'light'], $config)->settings();

        $this->assertSame('light', $config->getTheme());
        $this->assertSame('no', $config->getPreviews(), 'omitted previews must not reset');
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
