# Development Guide

## Local Setup

### Prerequisites
- Node.js 14+
- npm or yarn
- Nextcloud 32/33 installation
- PHP 7.4+

### Installation
1. Clone the repository
2. Navigate to the directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Building

### Development Build (with watch)
```bash
npm run dev
```
This will rebuild automatically as you change files.

### Production Build
```bash
npm run build
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
npm test
```
Run Jest tests

## Code Style
Eslint enforces project code style. Run linter:
```bash
npm run lint
npm run lint -- --fix
```

## Nextcloud Integration
The app integrates with Nextcloud through:
- **FileController.php**: REST API for file operations
- **LoadViewer.php**: Listener that injects scripts/styles
- **Application.php**: Bootstrap and dependency injection
- **info.xml**: App metadata and requirements

## API Endpoints
Registered in `routes.php`:
- `GET /api/file/{fileId}` - Get file content
- `GET /api/preview/{fileId}` - Get file preview

Example requests:
```bash
curl http://localhost/index.php/apps/cad_viewer/api/file/123
curl http://localhost/index.php/apps/cad_viewer/api/preview/123
```

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
npm run dev -- --stats
```

## Submitting Code
1. Create a feature branch
2. Make your changes
3. Run linter: `npm run lint --fix`
4. Build: `npm run build`
5. Test thoroughly
6. Submit PR with description

## Release Process
1. Update version in `package.json` and `appinfo/info.xml`
2. Update `CHANGELOG.md`
3. Build: `npm run build`
4. Commit: `git commit -m "v1.0.0 release"`
5. Tag: `git tag v1.0.0`
6. Push: `git push origin main --tags`

## Resources
- [Nextcloud Development Guide](https://docs.nextcloud.com/server/latest/developer_manual/)
- [Vue 3 Documentation](https://vuejs.org/)
- [MLightCAD CAD Viewer](https://github.com/mlightcad/cad-viewer)