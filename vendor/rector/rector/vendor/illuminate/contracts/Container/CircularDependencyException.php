<?php

namespace RectorPrefix202605\Illuminate\Contracts\Container;

use Exception;
use RectorPrefix202605\Psr\Container\ContainerExceptionInterface;
class CircularDependencyException extends Exception implements ContainerExceptionInterface
{
    //
}
