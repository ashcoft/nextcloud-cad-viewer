module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(element-plus|@element-plus|@mlightcad|lodash-es)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.css$': 'jest-transform-stub',
    '^@mlightcad/cad-viewer$': '<rootDir>/tests/__mocks__/@mlightcad/cad-viewer.js',
    '^element-plus$': '<rootDir>/tests/__mocks__/element-plus.js',
    '^element-plus/dist/index.css$': 'jest-transform-stub',
  },
  // snapshotSerializers removed - jest-serializer-vue is incompatible with Jest 30
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
    'src/**/*.{ts,vue}',
    '!src/main.ts',
    '!src/router/index.ts',
    '!**/node_modules/**',
  ],
  globals: {
    OC: {},
    OCA: {},
    t: (app, text) => text,
    n: (app, singular) => singular,
  },
};
