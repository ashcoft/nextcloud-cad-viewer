module.exports = {
  registerFileAction: jest.fn(),
  FileAction: jest.fn().mockImplementation((config) => config),
};
