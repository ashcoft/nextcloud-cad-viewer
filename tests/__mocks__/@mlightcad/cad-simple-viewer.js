// Lazy mock - jest.fn() called only when accessed, not at module load time
module.exports = {
  AcApSettingManager: {
    get instance() {
      return {
        set: () => {},
        get: () => {},
        toggle: () => {},
      };
    },
  },
};
