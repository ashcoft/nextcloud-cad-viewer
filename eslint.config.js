const vuePlugin = require('eslint-plugin-vue');
const js = require('@eslint/js');
const vueParser = require('vue-eslint-parser');

/**
 * SPDX-FileCopyrightText: 2025 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */
module.exports = [
  js.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  {
    name: 'cad-viewer/ignores',
    ignores: [
      // Generated files
      'js/*',
      'vendor/*',
      // Build output
      'dist/*',
      'node_modules/*',
    ],
  },
  {
    name: 'cad-viewer/vue',
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: vueParser,
      globals: {
        document: 'readonly',
        window: 'readonly',
        URLSearchParams: 'readonly',
        OC: 'readonly',
        OCA: 'readonly',
        t: 'readonly',
        n: 'readonly',
        console: 'readonly',
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
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
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
];
