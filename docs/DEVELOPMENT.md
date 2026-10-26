# Development Guide

## Local Setup

### Prerequisites
- Node.js 24+
- pnpm 10+
- Nextcloud 34 installation
- PHP 8.4+

### Installation
1. Clone the repository
2. Navigate to the directory
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Building

### Development Build (with watch)
```bash
pnpm run dev
```
This will rebuild automatically as you change files.

### Production Build
```bash
pnpm run build
```

## Project Structure
```
src/
├── main.js  # Entry point
├── App.vue  # Root component
├── components/  # Vue components
│ ├── Viewer.vue  # Main viewer
│ ├── Toolbar.vue  # Control buttons
│ └── ...
├── router/  # Vue Router config
├── assets/  # Images, fonts
└── utils/  # Helper functions
lib/
├── AppInfo/
│ └── Application.php  # Bootstrap
├── Controller/
│ └── FileController.php  # API endpoints
└── Listener/
    └── LoadViewer.php  # Event listener
appinfo/
└── info.xml  # App manifest
css/
└── cad-viewer.css  # Styles
```

## Key Components
### App.vue
Main Vue component that renders the viewer interface

### FileController.php
Handles file requests and serves CAD file content

### Application.php
Bootstrap class that registers listeners and initializes the app

## Adding New Features
### Example: Add Drawing Tools
1. Create component: `src/components/DrawingTools.vue`
2. Import in App.vue
3. Add toolbar buttons
4. Implement via cad-viewer API
5. Test and build

## Testing
```bash
pnpm test
```
Run Jest tests

## Code Style
Eslint enforces project code style. Run linter:
```bash
pnpm run lint
pnpm run lint -- --fix
```

## Nextcloud Integration
The app integrates with Nextcloud through:
- **FileController.php**: REST API for file operations
- **LoadViewer.php**: Listener that injects scripts/styles
- **Application.php**: Bootstrap and dependency injection
- **info.xml**: App metadata and requirements

## API Endpoints
Registered in `routes.php`:
- `GET /` - Start page with recent drawings and a blank drawing shortcut
- `POST /api/blank` - Create a blank DXF drawing and return its file id
- `GET /api/file/{fileId}` - Get file content
- `GET /api/preview/{fileId}` - Get file preview
- `POST /api/thumbnail/{fileId}` - Store a browser-rendered preview thumbnail
- `POST /api/save/{fileId}` - Save edited DXF content back to the file

Example requests:
```bash
curl http://localhost/index.php/apps/cad_viewer/api/file/123
curl http://localhost/index.php/apps/cad_viewer/api/preview/123
```

The thumbnail endpoint is called by the viewer, not by hand. It requires an
authenticated session plus the request token, and the `etag` must match the
file's current version:

```bash
curl -X POST http://localhost/index.php/apps/cad_viewer/api/thumbnail/123 \
  -b 'oc_sessionPassphrase=...; <session cookies>' \
  -H 'requesttoken: <request token>' \
  -H 'Content-Type: application/json' \
  -d '{"image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAADElEQVQImWP4//8/AAX+Av5Y8msOAAAAAElFTkSuQmCC","etag":"<file etag>"}'
```

A successful upload returns `{"status":"ok"}`. A stale `etag` returns
`409 Conflict`, and a storage failure returns `500`.

## Debugging
### Browser Console
Open DevTools (F12) to see:
- Vue DevTools
- CAD Viewer logs
- Network requests

### Server Logs
Check `nextcloud/data/nextcloud.log` for PHP errors

### Webpack Build Debug
```bash
pnpm run dev -- --stats
```

## Submitting Code
1. Create a feature branch
2. Make your changes
3. Run linter: `pnpm run lint --fix`
4. Build: `pnpm run build`
5. Test thoroughly
6. Submit PR with description

## Release Process
Releases are automated with [semantic-release](https://semantic-release.gitbook.io/)
and driven by conventional commit messages. Do not bump versions or tag
manually.

1. Merge your change to `main` (or `stable`) using a conventional commit
   message.
2. `release.yml` runs semantic-release, which decides the version, bumps
   `package.json` and `appinfo/info.xml`, updates `CHANGELOG.md`, creates the
   tag and a draft GitHub Release, then builds and attaches the app archives
   and publishes the release.

Only these commit types cut a release:

| Commit | Release |
| --- | --- |
| breaking change (`feat!` / `BREAKING CHANGE:`) | major |
| `feat`, `perf`, `fix(deps)` | minor |
| everything else (`fix`, `chore`, `docs`, `test`, `ci`, ...) | none |

Dependency bumps and maintenance commits therefore do not create a release
each. See `release.config.js` to change the policy.

## Resources
- [Nextcloud Development Guide](https://docs.nextcloud.com/server/latest/developer_manual/)
- [Vue 3 Documentation](https://vuejs.org/)
- [MLightCAD CAD Viewer](https://github.com/mlightcad/cad-viewer)
