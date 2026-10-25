/* eslint-env jest */
// Manual mock for @nextcloud/axios
module.exports = {
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}
