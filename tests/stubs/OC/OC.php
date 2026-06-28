<?php

declare(strict_types=1);

namespace {
    class OC
    {
        /** @var mixed */
        public static $server;
    }
}

namespace OCP {
    interface IConfig
    {
        /** @return mixed */
        public function getSystemValue(string $key, $default = null);

        public function getAppValue(string $appName, string $key, string $default = ''): string;
    }

    interface IServerContainer
    {
        /** @return mixed */
        public function query(string $name, bool $autoload = true);

        /** @return mixed */
        public function get(string $id);
    }

    interface IServerContainerExtended extends IServerContainer
    {
        /** @return mixed */
        public function getRegisteredAppContainer(string $appName);
    }
}

namespace OCP\AppFramework\Bootstrap {
    interface IRegistrationContext
    {
        public function registerEventListener(string $eventClass, string $listenerClass): void;
    }

    interface IBootContext
    {
        public function getServer(): \OCP\IServerContainer;
    }

    interface IBootstrap
    {
        public function register(\OCP\AppFramework\Bootstrap\IRegistrationContext $context): void;

        public function boot(\OCP\AppFramework\Bootstrap\IBootContext $context): void;
    }
}

// OCP\EventDispatcher MUST come before OCP\AppFramework\Http\Events
// because BeforeTemplateRenderedEvent extends the Event class.

namespace OCP\EventDispatcher {
    abstract class Event
    {
    }

    interface IEventListener
    {
        public function handle(Event $event): void;
    }
}

namespace OCP\AppFramework\Http\Events {
    /**
     * @extends \OCP\EventDispatcher\Event
     */
    class BeforeTemplateRenderedEvent extends \OCP\EventDispatcher\Event
    {
        /** @var object|null */
        private ?object $response = null;

        public function __construct(private readonly bool $login = false)
        {
        }

        public function isLoggedIn(): bool
        {
            return $this->login;
        }

        /**
         * Returns the response object set for this event.
         *
         * @return object The response object
         */
        public function getResponse(): object
        {
            return $this->response ?? new class () {
                public function getApp(): string
                {
                    return '';
                }

                public function getRenderAs(): string
                {
                    return 'user';
                }

                public function getTemplateName(): string
                {
                    return '';
                }
            };
        }

        /**
         * @internal Test-only method — does not exist in real Nextcloud 33 API.
         *
         * @param object $response The response object to set
         *
         * @return void
         */
        public function setResponse(object $response): void
        {
            $this->response = $response;
        }
    }
}

namespace OCP\AppFramework {
    class App
    {
        public function __construct(string $appName, array $urlParams = [])
        {
        }
    }

    interface IAppContainer extends \OCP\IServerContainer
    {
    }
}

namespace OCP {
    class Util
    {
        public static function addScript(string $appId, string $scriptName): void
        {
        }

        public static function addStyle(string $appId, string $styleName): void
        {
        }
    }
}

namespace OC\AppFramework\DependencyInjection {
    class DIContainer implements \OCP\AppFramework\IAppContainer
    {
        public function __construct(string $appName, array $urlParams = [])
        {
        }

        /** @return mixed */
        public function query(string $name, bool $autoload = true)
        {
            return null;
        }

        /** @return mixed */
        public function get(string $id)
        {
            return null;
        }
    }
}
