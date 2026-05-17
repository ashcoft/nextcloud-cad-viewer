const mockInstance = {
  set: jest.fn(),
  get: jest.fn(),
  toggle: jest.fn(),
};

module.exports = {
  AcApSettingManager: {
    get instance() { return mockInstance; },
  },
};
