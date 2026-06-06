"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompiler = getCompiler;
exports.getCompilerOptions = getCompilerOptions;
const semver = __importStar(require("semver"));
function getCompiler(loaderOptions, log) {
    let compiler;
    let errorMessage;
    let compilerDetailsLogMessage;
    let compilerCompatible = false;
    try {
        compiler = require(loaderOptions.compiler);
    }
    catch (_e) {
        errorMessage =
            loaderOptions.compiler === 'typescript'
                ? 'Could not load TypeScript. Try installing with `yarn add typescript` or `npm install typescript`. If TypeScript is installed globally, try using `yarn link typescript` or `npm link typescript`.'
                : `Could not load TypeScript compiler with NPM package name \`${loaderOptions.compiler}\`. Are you sure it is correctly installed?`;
    }
    if (errorMessage === undefined) {
        compilerDetailsLogMessage = `ts-loader: Using ${loaderOptions.compiler}@${compiler.version}`;
        compilerCompatible = false;
        if (loaderOptions.compiler === 'typescript') {
            if (compiler.version !== undefined &&
                semver.gte(compiler.version, '3.6.3')) {
                // don't log yet in this case, if a tsconfig.json exists we want to combine the message
                compilerCompatible = true;
            }
            else {
                log.logError(`${compilerDetailsLogMessage}. This version is incompatible with ts-loader. Please upgrade to the latest version of TypeScript.`);
            }
        }
        else {
            log.logWarning(`${compilerDetailsLogMessage}. This version may or may not be compatible with ts-loader.`);
        }
    }
    return {
        compiler,
        compilerCompatible,
        compilerDetailsLogMessage,
        errorMessage,
    };
}
function getCompilerOptions(configParseResult, compiler) {
    const defaultOptions = { skipLibCheck: true };
    const compilerOptions = Object.assign(defaultOptions, configParseResult.options, {
        suppressOutputPathCheck: true, // This is why: https://github.com/Microsoft/TypeScript/issues/7363
    });
    // if `module` is not specified and not using ES6+ target, default to CJS module output
    if (compilerOptions.module === undefined &&
        compilerOptions.target !== undefined &&
        compilerOptions.target < compiler.ScriptTarget.ES2015) {
        compilerOptions.module = compiler.ModuleKind.CommonJS;
    }
    if (configParseResult.options.configFile) {
        Object.defineProperty(compilerOptions, 'configFile', {
            enumerable: false,
            writable: false,
            value: configParseResult.options.configFile,
        });
    }
    return compilerOptions;
}
//# sourceMappingURL=compilerSetup.js.map