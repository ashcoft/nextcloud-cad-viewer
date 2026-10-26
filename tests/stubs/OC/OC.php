<?php

/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

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

        public function registerPreviewProvider(string $previewProviderClass, string $mimeTypeRegex): void;
    }

    interface IBootContext
    {
        public function getServer(): \OCP\IServerContainer;

        public function injectFn(callable $fn): void;
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
        public function __construct()
        {
        }
    }

    interface IEventListener
    {
        public function handle(Event $event): void;
    }
}

namespace OCP\Files {
    interface IMimeTypeDetector
    {
        public function getAllMappings(): array;

        public function registerType(string $extension, string $mimeType): void;
    }

    interface IMimeTypeLoader
    {
        public function getId(string $mimetype): int;

        public function updateFilecache(string $ext, int $mimeTypeId): int;
    }

    interface FileInfo
    {
        public function getMimeType(): string;

        public function getName(): string;

        public function isCreatable();
    }

    interface Node extends FileInfo
    {
        public function getId(): int;
    }

    interface File extends Node
    {
        public function getEtag(): string;

        public function getContent(): string;
    }
}

namespace OCP\Files\Events\Node {
    abstract class AbstractNodeEvent extends \OCP\EventDispatcher\Event
    {
        public function __construct(private readonly \OCP\Files\Node $node)
        {
            parent::__construct();
        }

        public function getNode(): \OCP\Files\Node
        {
            return $this->node;
        }
    }

    class NodeDeletedEvent extends AbstractNodeEvent
    {
    }
}

namespace OCP\Files\AppData {
    interface IAppDataFactory
    {
        public function get(string $appId): mixed;
    }
}

namespace OCP\Files\SimpleFS {
    interface ISimpleFile
    {
        public function getName(): string;

        public function getContent(): string;

        public function delete(): void;
    }

    interface ISimpleFolder
    {
        /** @return list<ISimpleFile> */
        public function getDirectoryListing(): array;

        public function fileExists(string $name): bool;

        public function getFile(string $name): ISimpleFile;

        public function newFile(string $name, mixed $content = null): ISimpleFile;
    }
}

namespace OCP {
    interface IImage
    {
    }

    class Image implements IImage
    {
        public function loadFromData(string $str): mixed
        {
            return false;
        }

        public function width(): int
        {
            return 0;
        }

        public function height(): int
        {
            return 0;
        }

        public function scaleDownToFit(int $maxWidth, int $maxHeight): bool
        {
            return true;
        }
    }
}

namespace OCP\Preview {
    interface IProviderV2
    {
        public function getMimeType(): string;

        public function isAvailable(\OCP\Files\FileInfo $file): bool;

        public function getThumbnail(\OCP\Files\File $file, int $maxX, int $maxY): ?\OCP\IImage;
    }
}

namespace OCA\Files\Event {
    class LoadAdditionalScriptsEvent extends \OCP\EventDispatcher\Event
    {
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
         * @internal Test-only method — does not exist in real Nextcloud 34 API.
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
        // phpcs:ignore Squiz.Functions.MultiLineFunctionDeclaration.EmptyBody
        public static function addScript(string $appId, string $scriptName): void
        {
        }

        // phpcs:ignore Squiz.Functions.MultiLineFunctionDeclaration.EmptyBody
        public static function addStyle(string $appId, string $styleName): void
        {
        }

        /**
         * Add an initialization script that runs before the app's main script.
         *
         * Used to ensure handlers register before the Nextcloud Viewer app loads.
         *
         * @param string $appId      The app ID
         * @param string $scriptName The script name (without .js extension)
         *
         * @return void
         *
         * @SuppressWarnings(PHPMD.UnusedFormalParameter)
         */
        public static function addInitScript(string $appId, string $scriptName): void
        {
            // phpcs:ignore Squiz.Functions.MultiLineFunctionDeclaration.EmptyBody
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
