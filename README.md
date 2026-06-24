# Nextcloud CAD Viewer

[![Latest Release](https://img.shields.io/github/v/release/ashcoft/nextcloud-cad-viewer)](https://github.com/ashcoft/nextcloud-cad-viewer/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Nextcloud Version](https://img.shields.io/badge/Nextcloud-33-blue)](https://nextcloud.com)
[![PHP Version](https://img.shields.io/badge/PHP-8.3-purple)](https://php.net)

A native Nextcloud app providing DWG and DXF file viewing capabilities based on [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer). View your CAD drawings directly in Nextcloud without downloading or installing additional software.

## ✨ Features

- 🎨 **View DWG and DXF files** directly in Nextcloud web interface
- ⚡ **Fast, browser-based rendering** using WebGL technology
- 🔍 **Interactive controls**: Zoom, pan, and fit-to-view
- 📐 **Layer management**: Toggle layer visibility on/off
- 🌓 **Theme support**: Dark and light mode options
- 🖥️ **Fullscreen mode** for detailed viewing
- 📱 **Responsive design** that works on desktop and mobile
- 🔒 **Secure integration** with Nextcloud's file permissions
- 🔄 **Easy updates** from upstream cad-viewer
- 🧪 **Fully tested** and compatible with Nextcloud 33

## 📋 Requirements

| Component | Version |
|-----------|---------|
| Nextcloud | 33+     |
| PHP       | 8.3+    |
| Node.js   | 24+ (dev. only) |
| pnpm      | 10+ (dev. only) |

## 📦 Installation

### From Nextcloud App Store (Recommended)

1. Log in to your Nextcloud instance as an administrator
2. Go to **Settings** → **Apps**
3. Search for "**CAD Viewer**"
4. Click "**Download and enable**"
5. The app is now ready to use!

### Manual Installation

1. Clone this repository to your Nextcloud apps directory:
   ```bash
   cd /path/to/nextcloud/apps
   git clone https://github.com/ashcoft/nextcloud-cad-viewer.git cad_viewer
   ```

2. Set proper permissions:
   ```bash
   chown -R www-data:www-data cad_viewer
   ```

3. Enable the app:
   - Go to **Settings** → **Apps**
   - Find "CAD Viewer" in the disabled apps section
   - Click "**Enable**"

4. Build the frontend assets:
   ```bash
   cd cad_viewer
   pnpm install
   pnpm run build
   ```

## 🚀 Usage

Once installed, the CAD Viewer integrates seamlessly with Nextcloud:

1. **Navigate** to any DWG or DXF file in your Nextcloud files
2. **Click** on the file to open it
3. The file will automatically open in the CAD Viewer
4. Use the toolbar controls to:
   - Zoom in/out
   - Pan around the drawing
   - Fit the drawing to view
   - Toggle layers
   - Switch between dark/light themes
   - Enter fullscreen mode

### Supported File Formats

| Format | Extension | MIME Types |
|--------|-----------|------------|
| AutoCAD DWG | `.dwg` | `application/acad`, `application/autocad_dwg`, `application/dwg`, `application/x-autocad`, `application/x-dwg`, `image/vnd.dwg` |
| AutoCAD DXF | `.dxf` | `image/vnd.dxf`, `application/dxf`, `application/x-dxf`, `image/x-dxf` |

## 🛠️ Development

### Prerequisites

- Node.js 24+
- pnpm 10+
- Nextcloud 33 development environment
- PHP 8.3+

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/ashcoft/nextcloud-cad-viewer.git
cd nextcloud-cad-viewer

# Install dependencies
pnpm install
```

### Build Commands

```bash
# Development build with watch mode
pnpm run dev

# Production build
pnpm run build

# Run linter
pnpm run lint

# Fix linting issues
pnpm run lint -- --fix

# Run tests
pnpm test
```

## 🔄 Updating CAD Viewer

When new versions of [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer) are released:

1. Update the dependency:
   ```bash
   pnpm update @mlightcad/cad-viewer
   ```

2. Rebuild the application:
   ```bash
   pnpm run build
   ```

3. Test thoroughly with various DWG/DXF files

4. Commit and push changes:
   ```bash
   git add package.json pnpm-lock.yaml
   git commit -m "Update cad-viewer dependency"
   git push
   ```

See [docs/UPDATING.md](docs/UPDATING.md) for detailed update procedures.

## ⚙️ Configuration

The app works out of the box with no additional configuration required. All settings are managed through Nextcloud's standard file permissions and access controls.

## 🐛 Troubleshooting

### Files Not Displaying

1. Verify the CAD Viewer app is enabled in Nextcloud
2. Check that the file is a supported format (DWG or DXF)
3. Ensure you have read permissions for the file
4. Check the browser console for JavaScript errors
5. Review Nextcloud logs at `nextcloud/data/nextcloud.log`

### Performance Issues with Large Files

1. Ensure your server has sufficient RAM and CPU resources
2. Consider enabling browser hardware acceleration
3. For very large files, consider optimizing the DWG/DXF in AutoCAD
4. Check network bandwidth between client and server

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

2. Ensure you're using Node.js 24+
3. Check that all dependencies are properly installed

### Common Issues

| Issue | Solution |
|-------|----------|
| Blank viewer | Check browser console for errors, verify file permissions |
| Slow loading | Optimize CAD file, check server resources |
| Missing layers | Ensure CAD file layers are not frozen in source application |
| Mobile display issues | Use landscape orientation for better viewing |

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

For compatibility testing procedures, see [COMPATIBILITY.md](docs/COMPATIBILITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Run** linter and tests (`pnpm run lint --fix && pnpm test`)
5. **Build** the production assets (`pnpm run build`)
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

## 📞 Support

- **Issues & Bug Reports**: [GitHub Issues](https://github.com/ashcoft/nextcloud-cad-viewer/issues)
- **Documentation**: [GitHub Wiki](https://github.com/ashcoft/nextcloud-cad-viewer/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/ashcoft/nextcloud-cad-viewer/discussions)

## 🙏 Credits

- Built with [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer) by MLightCAD
- Powered by [Vue.js](https://vuejs.org/)
- Integrated with [Nextcloud](https://nextcloud.com/)
- Thanks to all contributors and the Nextcloud community

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## 🔗 Links

- **GitHub Repository**: https://github.com/ashcoft/nextcloud-cad-viewer
- **Nextcloud App Store**: https://apps.nextcloud.com/apps/cad_viewer
- **CAD Viewer (upstream)**: https://github.com/mlightcad/cad-viewer
- **MLightCAD**: https://github.com/mlightcad
# Test
