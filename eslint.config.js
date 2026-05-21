const vuePlugin = require('eslint-plugin-vue');
const js = require('@eslint/js');
const vueParser = require('vue-eslint-parser');
const tseslint = require('typescript-eslint');

/**
 * SPDX-FileCopyrightText: 2025 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */
module.exports = tseslint.config(
  js.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    name: 'cad-viewer/ignores',
    ignores: [
      // Generated files
      'js/*',
      'vendor/*',
      // Build output
      'dist/*',
      'node_modules/*',
      // Polyfills
      'src/polyfills/*',
    ],
  },
  {
    name: 'cad-viewer/vue',
    files: ['**/*.vue', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        URLSearchParams: 'readonly',
        OC: 'readonly',
        OCA: 'readonly',
        t: 'readonly',
        n: 'readonly',
        console: 'readonly',
        HTMLElement: 'readonly',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'warn',
      'no-console': 'off',
    },
  },
  {
    name: 'cad-viewer/javascript',
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        console: true,
        document: 'readonly',
        window: 'readonly',
        URLSearchParams: 'readonly',
        OC: 'readonly',
        OCA: 'readonly',
        t: 'readonly',
        n: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
);
