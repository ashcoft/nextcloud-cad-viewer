<?php

declare(strict_types=1);

namespace {
    class OC
    {
        public static $server;
    }
}

namespace OCP {
    interface IConfig
    {
        public function getSystemValue(string $key, $default = null);
        public function getAppValue(string $appName, string $key, string $default = null): string;
    }

    interface IServerContainer
    {
        public function query(string $name, bool $autoload = true);
        public function get(string $id);
    }

    interface IServerContainerExtended extends IServerContainer
    {
        public function getRegisteredAppContainer(string $appName);
    }
}

namespace OCP\AppFramework\Bootstrap {
    interface IRegistrationContext
    {
        public function registerEventListener(string $eventClass, string $listenerClass, array $options = []): void;
    }

    interface IBootContext
    {
        public function getServer(): \OCP\IServerContainer;
    }

    interface IBootstrap
    {
        public function register(IRegistrationContext $context): void;
        public function boot(IBootContext $context): void;
    }
}

namespace OCP\AppFramework\Http {
    class BeforeTemplateRenderedEvent {}
}

namespace OCP\AppFramework {
    class App
    {
        public function __construct(string $appName) {}
    }
}

namespace OCP\AppFramework {
    interface IAppContainer extends \OCP\IServerContainer
    {
        public function get(string $id);
    }
}

namespace OC\AppFramework\DependencyInjection {
    class DIContainer implements \OCP\AppFramework\IAppContainer
    {
        public function __construct(string $appName, array $urlParams = []) {}
        public function query(string $name, bool $autoload = true)
        {
            return null;
        }
        public function registerService($name, \Closure $closure, $shared = true) {}
        public function registerParameter($name, $value) {}
        public function resolve($name)
        {
            return null;
        }
        public function registerAlias($alias, $target) {}
        public function getAppName()
        {
            return '';
        }
        public function getServer() {}
        public function registerMiddleWare($middleWare) {}
        public function getAppId(): string
        {
            return '';
        }
        public function registerCapability($serviceName) {}
        public function registerEventListener(string $event, string $listener, int $priority = 0) {}
        public function get(string $id)
        {
            return null;
        }
        public function has(string $id): bool
        {
            return false;
        }
    }
}
