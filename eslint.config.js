const vuePlugin = require('eslint-plugin-vue');
const js = require('@eslint/js');
const vueParser = require('vue-eslint-parser');

module.exports = [
  js.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 2021,
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
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        es2021: true,
        console: true,
        document: 'readonly',
        window: 'readonly',
        URLSearchParams: 'readonly',
        OC: 'readonly',
        OCA: 'readonly',
        t: 'readonly',
        n: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
