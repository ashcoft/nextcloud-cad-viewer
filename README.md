# Nextcloud CAD Viewer

A native Nextcloud app providing DWG and DXF file viewing capabilities based on [@mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer).

[![Release](https://img.shields.io/github/v/release/ashcoft/nextcloud-cad-viewer)](https://github.com/ashcoft/nextcloud-cad-viewer/releases/latest)
[![Nextcloud](https://img.shields.io/badge/Nextcloud-33-blue)](https://nextcloud.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple)](https://php.net)
[![Node](https://img.shields.io/badge/Node-24+-green)](https://nodejs.org)

## Features

- **View DWG and DXF files** directly in the Nextcloud web interface
- **Fast browser-based rendering** using WebGL technology
- **Interactive controls**: Zoom, pan, fit-to-view
- **Layer management**: Toggle layer visibility
- **Theme support**: Dark and light mode
- **Fullscreen mode** for detailed viewing
- **Responsive design** for desktop and mobile

## Requirements

| | |
|---|---|
| **Nextcloud** | 33+ |
| **PHP** | 8.2+ |
| **Node.js** | 24+ (development only) |
| **pnpm** | 10+ (development only) |

## Installation

### From Nextcloud App Store (Recommended)

1. Log in as an administrator
2. Go to **Settings → Apps**
3. Search for "CAD Viewer"
4. Click **Download and enable**

### Manual Installation

```bash
# Clone to Nextcloud apps directory
git clone https://github.com/ashcoft/nextcloud-cad-viewer.git /path/to/nextcloud/apps/cad_viewer

# Build frontend assets
cd /path/to/nextcloud/apps/cad_viewer
pnpm install
pnpm run build
```

## Usage

1. Navigate to any DWG or DXF file in Nextcloud
2. Click the file to open it in the CAD Viewer
3. Use toolbar controls to zoom, pan, toggle layers, or switch themes

### Supported Formats

| Format | Extension | MIME Types |
|--------|-----------|------------|
| AutoCAD DWG | `.dwg` | `application/acad`, `application/dwg`, `image/vnd.dwg` |
| AutoCAD DXF | `.dxf` | `image/vnd.dxf`, `application/dxf`, `image/x-dxf` |

## Development

```bash
# Install dependencies
pnpm install

# Development build with watch
pnpm run dev

# Production build
pnpm run build

# Lint and fix
pnpm run lint --fix

# Run tests
pnpm test
```

### Project Structure

```
nextcloud-cad-viewer/
├── src/                   # Vue.js frontend
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   ├── router/
│   └── utils/
├── lib/                   # PHP backend
│   ├── AppInfo/
│   ├── Controller/
│   └── Listener/
├── appinfo/               # App metadata
├── css/
├── js/                    # Compiled JavaScript
├── templates/
└── docs/
```

## Version Increments

The release workflow automatically updates version files when a tag is pushed:

1. **package.json** and **package-lock.json** via `pnpm version`
2. **appinfo/info.xml** via sed
3. **CHANGELOG.md** with new version entry
4. Creates git commit and pushes changes

### Manual Version Update

```bash
# Update version files locally
pnpm version 0.0.9 --no-git-tag-version

# Or via workflow_dispatch with version input
```

## Configuration

No additional configuration required. File permissions are managed through Nextcloud's standard controls.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Files not displaying | Verify app is enabled, check file format, check permissions |
| Slow loading | Optimize CAD file, check server resources |
| Missing layers | Ensure layers are not frozen in the source application |
| Mobile display issues | Use landscape orientation |

## Testing

```bash
pnpm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and run linter/tests (`pnpm run lint --fix && pnpm test`)
4. Build (`pnpm run build`)
5. Commit and push (`git commit -m 'Add amazing feature' && git push`)
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file.