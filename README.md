# Nextcloud CAD Viewer

[![Latest Release](https://img.shields.io/github/v/release/ashcoft/nextcloud-cad-viewer)](https://github.com/ashcoft/nextcloud-cad-viewer/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Nextcloud Version](https://img.shields.io/badge/Nextcloud-34-blue)](https://nextcloud.com)
[![PHP Version](https://img.shields.io/badge/PHP-8.4-purple)](https://php.net)

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
- 🧪 **Fully tested** and compatible with Nextcloud 34-35

## 📋 Requirements

| Component | Version |
|-----------|---------|
| Nextcloud | 34-35     |
| PHP       | 8.4+    |
| Node.js   | 24+ (dev. only) |
| pnpm      | 10+ (dev. only) |

## 📦 Installation

> **Note:** CAD Viewer is not yet listed in the Nextcloud App Store. Install it
> from the release archive or from source as described below.

### From a release archive (Recommended)

1. Download the latest `cad_viewer.tar.gz` from the
   [releases page](https://github.com/ashcoft/nextcloud-cad-viewer/releases).
2. Extract it into your Nextcloud `apps` directory:
   ```bash
   tar -xzf cad_viewer.tar.gz -C /path/to/nextcloud/apps
   chown -R www-data:www-data /path/to/nextcloud/apps/cad_viewer
   ```
   The archive already contains the built frontend assets, so no Node.js/pnpm
   step is needed.
3. Enable the app:
   ```bash
   occ app:enable cad_viewer
   ```
4. Register the DWG/DXF MIME types (see the [From source](#from-source) steps below).

### From source

1. Clone this repository into your Nextcloud `apps` directory:
   ```bash
   cd /path/to/nextcloud/apps
   git clone https://github.com/ashcoft/nextcloud-cad-viewer.git cad_viewer
   ```

2. Set proper permissions:
   ```bash
   chown -R www-data:www-data cad_viewer
   ```

3. Build the frontend assets:
   ```bash
   cd cad_viewer
   pnpm install
   pnpm run build
   ```

4. Register the DWG/DXF MIME types.

   Nextcloud core does not ship a MIME mapping for `.dwg`/`.dxf` files, so without
   this step uploaded CAD files are treated as `application/octet-stream` and the
   **Open with CAD Viewer** action will not appear. Create
   `config/mimetypemapping.json` in your Nextcloud config directory (merge with an
   existing file if present) and refresh the MIME database:
   ```json
   {
       "dwg": ["application/dwg"],
       "dxf": ["image/vnd.dxf"]
   }
   ```
   ```bash
   occ maintenance:mimetype:update-db --repair-filecache
   ```
   The `--repair-filecache` flag re-detects the MIME type of files that were
   uploaded before the mapping was added.

5. Enable the app:

   ```bash
   occ app:enable cad_viewer
   ```
   Or go to **Settings** → **Apps**, find "CAD Viewer" in the disabled apps
   section and click **Enable**.

## 🚀 Usage

Once installed, the CAD Viewer integrates seamlessly with Nextcloud:

1. **Navigate** to any DWG or DXF file in your Nextcloud files
2. **Click** the file, or right-click it and choose **Open with CAD Viewer**
3. The file opens in the CAD Viewer
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
- Nextcloud 34 development environment
- PHP 8.4+

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

# Type-check Vue + TypeScript sources
pnpm run check-types

# Run linter
pnpm run lint

# Fix linting issues
pnpm run lint -- --fix

# Run stylelint
pnpm run stylelint

# Run frontend (Jest) tests
pnpm test

# Run backend (PHPUnit) tests
composer test:unit
```

The `Makefile` wraps the common flows:

```bash
make dev-setup          # clean, install and build the production bundle
make production-setup   # clean, install and build for production
make appstore           # build the installable tar.gz/zip archives
make test               # run PHPUnit and Jest suites
make lint               # run PHP and frontend linters
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

The pinned `@mlightcad` versions and compatibility overrides live in
`pnpm-workspace.yaml`; review them when bumping the viewer. Note that the CAD
viewer library is bundled at build time, so a rebuild and redeploy is required
for changes to take effect.

## ⚙️ Configuration

The app works out of the box. Administrators can additionally tune the viewer
under **Settings** → **Administration** → **CAD Viewer**:

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| Theme | Light / Dark | Light | Default viewer theme |
| Activate autosave | Yes / No | Yes | Automatically save while editing |
| Enable libraries | Yes / No | Yes | Access CAD component libraries |
| Enable file previews | Yes / No | Yes | Generate CAD file previews |

## 🐛 Troubleshooting

### Files Not Displaying

1. Verify the CAD Viewer app is enabled in Nextcloud
2. Check that the file is a supported format (DWG or DXF)
3. Confirm the MIME types are registered — for manual installs see
   [Register the DWG/DXF MIME types](#from-source) above. Files showing a
   generic icon or no **Open with CAD Viewer** action usually mean the mapping is
   missing.
4. Ensure you have read permissions for the file
5. Check the browser console for JavaScript errors
6. Review Nextcloud logs at `nextcloud/data/nextcloud.log`

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
| "Open with CAD Viewer" missing | Register the DWG/DXF MIME types (see Installation) |
| Slow loading | Optimize CAD file, check server resources |
| Missing layers | Ensure CAD file layers are not frozen in source application |
| Mobile display issues | Use landscape orientation for better viewing |

## 🧪 Testing

Run the frontend and backend suites:

```bash
pnpm test              # Jest (frontend)
composer test:unit     # PHPUnit (backend)
```

Static analysis and linting:

```bash
pnpm run check-types   # vue-tsc
pnpm run lint          # ESLint
pnpm run stylelint     # Stylelint
composer psalm         # Psalm
composer phpstan       # PHPStan
```

For compatibility testing procedures, see [COMPATIBILITY.md](docs/COMPATIBILITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Run** linters and tests (`pnpm run lint && pnpm test`)
5. **Build** the production assets (`pnpm run build`)
6. **Commit** your changes using [conventional commit](https://www.conventionalcommits.org/) messages (`git commit -m 'feat: add amazing feature'`)
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
- **Releases**: https://github.com/ashcoft/nextcloud-cad-viewer/releases
- **CAD Viewer (upstream)**: https://github.com/mlightcad/cad-viewer
- **MLightCAD**: https://github.com/mlightcad
