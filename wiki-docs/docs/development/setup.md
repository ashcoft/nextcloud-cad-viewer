---
sidebar_position: 1
---

# Development Setup

This guide walks you through setting up a development environment for Nextcloud CAD Viewer.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Nextcloud** 33+ development instance
- **PHP** 8.5 or higher
- A code editor (VS Code recommended)

## Step 1: Clone the Repository

```bash
git clone https://github.com/ashcoft/nextcloud-cad-viewer.git
cd nextcloud-cad-viewer
```

## Step 2: Install Dependencies

Install all npm dependencies:

```bash
npm install
```

This will install:

- Build tools (webpack, Babel)
- Vue.js and related packages
- Testing frameworks (Jest)
- Linting tools (ESLint)

## Step 3: Link to Nextcloud

### Option A: Symlink (Recommended for Development)

```bash
# On Linux/Mac
ln -s $(pwd) /path/to/nextcloud/apps/cad_viewer

# On Windows (run as Administrator)
mklink /D "C:\path\to\nextcloud\apps\cad_viewer" "C:\path\to\nextcloud-cad-viewer"
```

### Option B: Copy Files

```bash
cp -r . /path/to/nextcloud/apps/cad_viewer
```

## Step 4: Enable the App

1. Start your Nextcloud development server
2. Log in as an administrator
3. Go to Settings → Apps
4. Find "CAD Viewer" and enable it

## Step 5: Start Development Server

```bash
npm run dev
```

This starts webpack in watch mode, automatically rebuilding when you make changes.

## Project Structure

```
nextcloud-cad-viewer/
├── appinfo/           # App metadata and routing
│   └── info.xml
├── lib/               # PHP backend code
│   ├── AppInfo/
│   ├── Controller/
│   └── Listener/
├── src/               # Vue.js frontend source
│   ├── components/    # Vue components
│   ├── router/        # Vue Router configuration
│   └── main.js        # Entry point
├── css/               # Stylesheets
├── tests/             # Unit and integration tests
├── docs/              # Documentation files
└── package.json       # Node.js dependencies
```

## Verify Setup

1. Upload a test DWG or DXF file to your Nextcloud
2. Click on the file to open it in the viewer
3. Make a change to `src/App.vue`
4. Save the file - webpack should rebuild automatically
5. Refresh your browser to see the changes

## Common Issues

### Port Already in Use

If port 8080 is in use:

```bash
# Kill the process using port 8080
lsof -ti:8080 | xargs kill -9
```

### Permission Denied

Ensure proper ownership:

```bash
chown -R www-data:www-data /path/to/nextcloud/apps/cad_viewer
```

### Module Not Found

Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

Previous: [Fullscreen Mode](../features/fullscreen.md) | Next: [Build Process](./build.md)
