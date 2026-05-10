module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(element-plus|@element-plus|@mlightcad|lodash-es)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.css$': 'jest-transform-stub',
    '^@mlightcad/cad-viewer$': '<rootDir>/tests/__mocks__/@mlightcad/cad-viewer.js',
    '^@mlightcad/cad-simple-viewer$': '<rootDir>/tests/__mocks__/@mlightcad/cad-simple-viewer.js',
    '^element-plus$': '<rootDir>/tests/__mocks__/element-plus.js',
    '^element-plus/dist/index.css$': 'jest-transform-stub',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
    '**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**',
  ],
  globals: {
    OC: {},
    OCA: {},
  },
};
