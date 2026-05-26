<?php

declare(strict_types=1);

namespace {
    class OC
    {
        public static $server;
    }
}

namespace OCP {
    interface IServerContainerExtended extends IServerContainer
    {
        public function getRegisteredAppContainer(string $appName);
    }
}

namespace OC\AppFramework\DependencyInjection {
    use OCP\AppFramework\IAppContainer;

    class DIContainer implements IAppContainer
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
