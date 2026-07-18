/**
 * @jest-environment node
 */
/* eslint-env jest */
// Mock for @nextcloud/files
module.exports = {
  registerFileAction: jest.fn(),
  DefaultType: {
    DEFAULT: 'default',
    HIDDEN: 'hidden',
  },
}
