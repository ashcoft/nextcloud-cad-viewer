// Stub for the optional @mlightcad/cad-onedrive-plugin.
// cad-viewer 1.7.5 dynamically imports "<plugin>/register" when OneDrive
// integration is configured. The Nextcloud app never enables it, but webpack
// still needs the specifier to resolve at build time.
module.exports = {
  registerOneDrivePlugin() {
    return null;
  },
};
