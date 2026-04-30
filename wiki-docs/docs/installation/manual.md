---
sidebar_position: 2
---

# Manual Installation

If you prefer not to use the App Store or need to install a development version, you can install Nextcloud CAD Viewer manually.

## Prerequisites

- Nextcloud 33 or higher
- SSH access to your Nextcloud server
- Git installed on your server (optional, for cloning)
- Node.js 20+ (for building from source)

## Method 1: Clone from GitHub

### Steps

1. **Navigate to Apps Directory**
   ```bash
   cd /path/to/nextcloud/apps
   ```

2. **Clone the Repository**
   ```bash
   git clone https://github.com/ashcoft/nextcloud-cad-viewer.git cad_viewer
   ```

3. **Set Permissions**
   ```bash
   chown -R www-data:www-data cad_viewer
   chmod -R 755 cad_viewer
   ```

4. **Enable the App**
   - Log in to Nextcloud as an administrator
   - Go to Settings → Apps
   - Find "CAD Viewer" in the disabled apps section
   - Click "Enable"

## Method 2: Download and Extract

### Steps

1. **Download the Release**
   ```bash
   cd /tmp
   wget https://github.com/ashcoft/nextcloud-cad-viewer/archive/main.zip
   unzip main.zip
   ```

2. **Move to Apps Directory**
   ```bash
   mv nextcloud-cad-viewer-main /path/to/nextcloud/apps/cad_viewer
   ```

3. **Set Permissions**
   ```bash
   chown -R www-data:www-data /path/to/nextcloud/apps/cad_viewer
   chmod -R 755 /path/to/nextcloud/apps/cad_viewer
   ```

4. **Enable the App**
   - Follow step 4 from Method 1

## Building from Source

If you cloned the repository and need to build the assets:

```bash
cd /path/to/nextcloud/apps/cad_viewer
npm install
npm run build
```

## Verification

After installation:

1. Upload a DWG or DXF file to your Nextcloud
2. Click on the file to open it in the CAD Viewer
3. Verify that the file renders correctly

## Updating

To update a manual installation:

```bash
cd /path/to/nextcloud/apps/cad_viewer
git pull origin main
npm install
npm run build
```

Then clear the Nextcloud cache if needed.

Previous: [App Store Installation](./app-store.md)
