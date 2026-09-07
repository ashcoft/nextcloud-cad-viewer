# Installation Guide

This guide provides detailed instructions for installing the Nextcloud CAD Viewer app on your Nextcloud instance.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: Nextcloud App Store (Recommended)](#method-1-nextcloud-app-store-recommended)
   - [Method 2: Manual Installation](#method-2-manual-installation)
   - [Method 3: Git Installation](#method-3-git-installation)
3. [Post-Installation Steps](#post-installation-steps)
4. [Verification](#verification)
5. [Troubleshooting Installation](#troubleshooting-installation)

---

## Prerequisites

Before installing the CAD Viewer, ensure your system meets the following requirements:

### System Requirements

| Component | Minimum Version | Recommended Version |
|-----------|----------------|---------------------|
| Nextcloud | 34 | 35 |
| PHP | 8.4 | 8.4+ |
| Node.js (development only) | 24 | 24+ |
| Web Server | Apache/Nginx | Latest stable |
| Database | MySQL/MariaDB/PostgreSQL | Latest stable |

### Browser Requirements

For end users, the following browsers are supported:

- **Chrome**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+
- **Opera**: Version 76+

All modern browsers with WebGL support are compatible.

### Server Requirements

- **PHP Extensions**: 
  - `gd` or `imagick`
  - `fileinfo`
  - `json`
  - `libxml`
  - `dom`
  - `xml`
  - `zip`

- **Web Server Configuration**:
  - Enable mod_headers (Apache) or equivalent (Nginx)
  - Configure proper MIME types for DWG/DXF files
  - Ensure adequate upload limits for large CAD files

---

## Installation Methods

### Method 1: Nextcloud App Store (Recommended)

This is the easiest and recommended method for most users.

#### Step 1: Access the App Store

1. Log in to your Nextcloud instance as an **administrator**
2. Click on your profile icon in the top-right corner
3. Select **Apps** from the dropdown menu

#### Step 2: Find CAD Viewer

1. In the Apps page, use the search bar at the top
2. Type "**CAD Viewer**" and press Enter
3. Look for "CAD Viewer" in the search results

#### Step 3: Install the App

1. Click the **Download and enable** button next to CAD Viewer
2. Wait for the download and installation to complete
3. The button will change to **Enabled** when installation is successful

#### Step 4: Verify Installation

1. Navigate to **Settings** → **Administration** → **Overview**
2. Check that there are no warnings related to CAD Viewer
3. The app should now appear in your enabled apps list

---

### Method 2: Manual Installation

Use this method if you can't access the Nextcloud App Store or need a specific version.

#### Step 1: Download the App

1. Visit the [GitHub Releases page](https://github.com/ashcoft/nextcloud-cad-viewer/releases)
2. Download the latest release archive (e.g., `cad_viewer-v1.0.0.tar.gz`)
3. Alternatively, clone the repository:
   ```bash
   git clone https://github.com/ashcoft/nextcloud-cad-viewer.git cad_viewer
   ```

#### Step 2: Extract to Apps Directory

1. Navigate to your Nextcloud installation directory:
   ```bash
   cd /var/www/nextcloud/apps
   ```

2. Extract the downloaded archive:
   ```bash
   tar -xzf ~/Downloads/cad_viewer-v1.0.0.tar.gz
   ```

   Or if you cloned via git, the files should already be in place.

#### Step 3: Set Permissions

Set proper ownership and permissions:

```bash
# Replace www-data with your web server user
chown -R www-data:www-data cad_viewer
chmod -R 755 cad_viewer
```

#### Step 4: Build Frontend Assets

If you downloaded a source archive (not a pre-built release), you need to build the frontend:

```bash
cd cad_viewer
pnpm install
pnpm run build
```

#### Step 5: Enable the App

1. Log in to Nextcloud as administrator
2. Go to **Settings** → **Apps**
3. Find "CAD Viewer" in the **Disabled apps** section
4. Click **Enable**

---

### Method 3: Git Installation

This method is ideal for developers or those who want to contribute to the project.

#### Step 1: Clone the Repository

```bash
cd /var/www/nextcloud/apps
git clone https://github.com/ashcoft/nextcloud-cad-viewer.git cad_viewer
cd cad_viewer
```

#### Step 2: Install Dependencies

```bash
pnpm install
```

#### Step 3: Build the Application

```bash
pnpm run build
```

#### Step 4: Set Permissions

```bash
chown -R www-data:www-data /var/www/nextcloud/apps/cad_viewer
chmod -R 755 /var/www/nextcloud/apps/cad_viewer
```

#### Step 5: Enable via Command Line

```bash
# Using occ command
sudo -u www-data php /var/www/nextcloud/occ app:enable cad_viewer
```

Or enable through the web interface as described in Method 2.

---

## Post-Installation Steps

### 1. Verify File Associations

Ensure that DWG and DXF files are properly associated with the CAD Viewer:

1. Go to **Settings** → **Administration** → **File handling**
2. Check that `.dwg` and `.dxf` extensions are listed
3. If not, add them manually

### 2. Configure MIME Types

Add or verify MIME types in your web server configuration:

#### Apache (.htaccess or httpd.conf)

```apache
AddType application/acad .dwg
AddType application/dxf .dxf
AddType image/vnd.dwg .dwg
AddType image/vnd.dxf .dxf
```

#### Nginx

```nginx
types {
    application/acad dwg;
    application/dxf dxf;
    image/vnd.dwg dwg;
    image/vnd.dxf dxf;
}
```

### 3. Adjust Upload Limits

For large CAD files, increase upload limits:

#### PHP (php.ini)

```ini
upload_max_filesize = 500M
post_max_size = 500M
memory_limit = 1024M
max_execution_time = 300
```

#### Nextcloud (config/config.php)

```php
'upload_max_filesize' => '500M',
'max_filesize_animated_gifs_public_shared' => 500,
```

### 4. Clear Caches

Clear Nextcloud caches to ensure the app loads correctly:

```bash
sudo -u www-data php /var/www/nextcloud/occ maintenance:repair
sudo -u www-data php /var/www/nextcloud/occ maintenance:update:theme
```

---

## Verification

After installation, verify that everything is working correctly:

### 1. Check App Status

```bash
sudo -u www-data php /var/www/nextcloud/occ app:list | grep cad_viewer
```

The app should be listed under "enabled:"

### 2. Test File Viewing

1. Upload a test DWG or DXF file to your Nextcloud
2. Click on the file to open it
3. The CAD Viewer should load and display the drawing

### 3. Check Logs

Review Nextcloud logs for any errors:

```bash
tail -f /var/www/nextcloud/data/nextcloud.log
```

Look for entries related to "cad_viewer"

### 4. Browser Console

Open browser developer tools (F12) and check the console for any JavaScript errors when opening a CAD file.

---

## Troubleshooting Installation

### Issue: App Not Appearing in App List

**Solution:**
- Verify the app folder is in the correct location (`apps/cad_viewer`)
- Check file permissions
- Run: `sudo -u www-data php /var/www/nextcloud/occ app:list`
- Clear cache: `sudo -u www-data php /var/www/nextcloud/occ maintenance:repair`

### Issue: Build Errors During Installation

**Solution:**
```bash
cd /var/www/nextcloud/apps/cad_viewer
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
pnpm run build
```

### Issue: Files Not Opening in Viewer

**Solution:**
- Check that the app is enabled
- Verify file permissions on the CAD files
- Check browser console for errors
- Review Nextcloud logs
- Ensure MIME types are configured correctly

### Issue: Blank or White Screen

**Solution:**
- Clear browser cache
- Check JavaScript console for errors
- Verify that all frontend assets were built successfully
- Check that webpack compilation completed without errors

### Issue: Permission Denied Errors

**Solution:**
```bash
# Fix ownership
chown -R www-data:www-data /var/www/nextcloud/apps/cad_viewer

# Fix permissions
find /var/www/nextcloud/apps/cad_viewer -type d -exec chmod 755 {} \;
find /var/www/nextcloud/apps/cad_viewer -type f -exec chmod 644 {} \;
```

---

## Next Steps

After successful installation:

1. Read the [User Guide](User-Guide) to learn how to use the viewer
2. Review [Configuration](Configuration) for advanced settings
3. Check [Supported Formats](Supported-Formats) for compatibility information
4. See [Troubleshooting](Troubleshooting) if you encounter issues

---

**Related Pages:**
- [Quick Start](Quick-Start)
- [Requirements](Requirements)
- [Administration Guide](Administration-Guide)
