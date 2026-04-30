---
sidebar_position: 2
---

# Build Process

This document explains the build process for Nextcloud CAD Viewer.

## Build Commands

The following npm scripts are available in `package.json`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Development mode with hot reload |
| `npm run build` | Production build |
| `npm run watch` | Watch mode for development |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Development Build

For active development, use:

```bash
npm run dev
```

This command:

- Starts webpack dev server
- Enables source maps for debugging
- Watches for file changes
- Automatically rebuilds on changes
- Does NOT optimize for size

Access your app at `http://localhost:8080` during development.

## Production Build

Before deploying to production:

```bash
npm run build
```

This command:

- Minifies JavaScript and CSS
- Removes console.log statements
- Optimizes bundle size
- Generates production-ready assets
- Creates files in the `js/` directory

### Build Output

After running `npm run build`, you'll see:

```plaintext
js/
├── cad-viewer.js          # Main application bundle
└── cad-viewer.js.map      # Source map (optional)
```

## Webpack Configuration

The build process is configured in `webpack.config.js`:

```javascript
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'cad-viewer.js',
  },
  // ... more configuration
}
```

### Key Configuration Options

- **Entry Point**: `src/main.js` - where the app starts
- **Output Directory**: `js/` - built files go here
- **Loaders**: Handle Vue files, SCSS, images
- **Plugins**: Optimize bundles, extract CSS

## Customizing the Build

### Adding New Dependencies

```bash
npm install package-name --save
```

Then import in your code:

```javascript
import packageName from 'package-name';
```

### Adding New Entry Points

Edit `webpack.config.js`:

```javascript
entry: {
  main: './src/main.js',
  admin: './src/admin.js',
},
output: {
  filename: '[name].js',
},
```

## Build Optimization Tips

1. **Code Splitting**: Split large bundles into smaller chunks
2. **Tree Shaking**: Remove unused code
3. **Lazy Loading**: Load components on demand
4. **Asset Optimization**: Compress images and fonts

## Troubleshooting Builds

### Build Fails with Module Not Found

```bash
npm install
```

### Out of Memory Error

Increase Node.js memory:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Stale Build Artifacts

Clean and rebuild:

```bash
rm -rf js/
npm run build
```

## Continuous Integration

The project uses GitHub Actions for automated builds. Every push triggers:

1. Dependency installation
2. Linting
3. Unit tests
4. Production build

Check `.github/workflows/` for CI configuration.

Previous: [Development Setup](./setup.md) | Next: [Testing](./testing.md)
