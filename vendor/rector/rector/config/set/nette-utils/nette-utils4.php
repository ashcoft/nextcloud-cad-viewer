<?php

declare (strict_types=1);
namespace RectorPrefix202605;

use Rector\Config\RectorConfig;
use Rector\NetteUtils\Rector\StaticCall\UtilsJsonStaticCallNamedArgRector;
return static function (RectorConfig $rectorConfig): void {
    $rectorConfig->rules([UtilsJsonStaticCallNamedArgRector::class]);
};
