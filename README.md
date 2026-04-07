# Nextcloud CAD Viewer

A native Nextcloud app providing DWG and DXF file viewing capabilities integrated with [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer).

## Features

- 🎨 View DWG and DXF files directly in Nextcloud
- ⚡ Fast, browser-based rendering using WebGL
- 🔍 Zoom, pan, and fit-to-view controls
- 🖥️ Fullscreen mode support
- 📱 Responsive design
- 🔄 Easy updates from upstream cad-viewer
- 🧪 Fully tested and compatible with Nextcloud 33

## Requirements

- Nextcloud 33
- PHP 8.5 or higher
- Node.js 14+ (for development)

## Installation

### From Nextcloud App Store
1. Go to Settings → Apps
2. Search for "CAD Viewer"
3. Click "Download and enable"

### Manual Installation
1. Clone this repository to `nextcloud/apps/cad_viewer`
2. Enable the app in Nextcloud settings

## Development

### Setup

```bash
cd nextcloud/apps/cad_viewer
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## File Structure

```plaintext
 cad_viewer/
 ├── appinfo/
 │   └── info.xml # App manifest
 ├── lib/
 │   ├── AppInfo/
 │   │   └── Application.php
 │   ├── Controller/
 │   │   └── FileController.php
 │   └── Listener/
 │       └── LoadViewer.php
 ├── src/
 │   ├── main.js
 │   ├── App.vue
 │   ├── components/
 │   └── router/
 ├── css/
 │   └── cad-viewer.css
 ├── docs/
 │   ├── UPDATING.md
 │   └── DEVELOPMENT.md
 ├── package.json
 ├── webpack.config.js
 └── README.md
```

## Updating CAD Viewer

When new versions of [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer) are released:
1. Update `package.json`: `npm update @cad-viewer/core`
2. Rebuild the app: `npm run build`
3. Test thoroughly
4. Commit and push changes

See [UPDATING.md](docs/UPDATING.md) for detailed update procedures.

## Configuration

The app works out of the box with no additional configuration required.

## Troubleshooting

### Files not displaying
Check that your Nextcloud server is correctly installed and the cad_viewer app is enabled.

### Performance issues
For large files, ensure your server has sufficient resources.

## License

MIT License - See LICENSE file

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

- Issues: [GitHub Issues](https://github.com/ashcoft/nextcloud-cad-viewer/issues)
- Documentation: [GitHub Wiki](https://github.com/ashcoft/nextcloud-cad-viewer/wiki)

## Credits

- Built with [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer)
- Nextcloud community
