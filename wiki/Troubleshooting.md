# Troubleshooting

This guide helps you diagnose and resolve common issues with Nextcloud CAD Viewer.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [File Loading Issues](#file-loading-issues)
3. [Display Issues](#display-issues)
4. [Performance Issues](#performance-issues)
5. [Browser Issues](#browser-issues)
6. [Server Issues](#server-issues)
7. [Mobile Issues](#mobile-issues)
8. [Error Messages](#error-messages)
9. [Getting Help](#getting-help)

---

## Installation Issues

### App Not Appearing in Apps List

**Symptoms:**
- CAD Viewer doesn't show up in Nextcloud Apps page
- App folder exists but isn't recognized

**Solutions:**

1. **Verify app location:**
   ```bash
   ls -la /var/www/nextcloud/apps/cad_viewer
   ```
   The app must be in the `apps/` directory, not `apps/cad_viewer/cad_viewer/`

2. **Check permissions:**
   ```bash
   chown -R www-data:www-data /var/www/nextcloud/apps/cad_viewer
   chmod -R 755 /var/www/nextcloud/apps/cad_viewer
   ```

3. **Clear cache:**
   ```bash
   sudo -u www-data php /var/www/nextcloud/occ maintenance:repair
   sudo -u www-data php /var/www/nextcloud/occ app:list
   ```

4. **Check info.xml:**
   Ensure `appinfo/info.xml` is valid XML and contains correct version information

### Build Errors During Installation

**Symptoms:**
- `pnpm run build` fails with errors
- Missing dependencies

**Solutions:**

1. **Clean reinstall:**
   ```bash
   cd /var/www/nextcloud/apps/cad_viewer
   rm -rf node_modules pnpm-lock.yaml
   pnpm store prune
   pnpm install
   pnpm run build
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   ```
   Must be version 24 or higher

3. **Check disk space:**
   ```bash
   df -h
   ```
   Ensure sufficient space for node_modules (typically 200-300MB)

4. **Network issues:**
   If behind a proxy, configure pnpm:
   ```bash
   pnpm config set proxy http://proxy.company.com:8080
   pnpm config set https-proxy http://proxy.company.com:8080
   ```

### App Won't Enable

**Symptoms:**
- Enable button doesn't work
- Error message when trying to enable

**Solutions:**

1. **Check Nextcloud logs:**
   ```bash
   tail -f /var/www/nextcloud/data/nextcloud.log
   ```
   Look for errors related to cad_viewer

2. **Verify PHP version:**
   ```bash
   php --version
   ```
   Must be PHP 8.3 or higher

3. **Check Nextcloud version:**
   The app requires Nextcloud 34

4. **Manual enable via OCC:**
   ```bash
   sudo -u www-data php /var/www/nextcloud/occ app:enable cad_viewer
   ```

---

## File Loading Issues

### File Won't Open

**Symptoms:**
- Clicking on DWG/DXF file does nothing
- Error message appears
- Blank screen

**Solutions:**

1. **Check file permissions:**
   - Ensure you have read access to the file
   - Check file ownership in Nextcloud

2. **Verify file type:**
   - Confirm the file is actually a DWG or DXF format
   - Check file extension matches actual content

3. **Check browser console:**
   - Press F12 to open developer tools
   - Look for JavaScript errors in Console tab
   - Check Network tab for failed requests

4. **Test with different file:**
   Try opening a different DWG/DXF file to isolate the issue

5. **Check file size:**
   Very large files (>500MB) may timeout or fail to load

### File Loads Slowly

**Symptoms:**
- Long loading times
- Spinner displays for extended period

**Solutions:**

1. **Check network speed:**
   ```bash
   # Test download speed
   curl -o /dev/null http://speedtest.wdc01.softlayer.com/downloads/test10.zip
   ```

2. **Optimize file:**
   - Open in AutoCAD and use PURGE command
   - Remove unnecessary layers and blocks
   - Save as newer DWG version if possible

3. **Enable server caching:**
   Configure Redis or Memcached in Nextcloud

4. **Check server resources:**
   ```bash
   top
   free -h
   ```

5. **Use CDN:**
   Consider using a CDN for static assets

### File Corrupted or Invalid

**Symptoms:**
- Error: "Invalid file format"
- Error: "Could not parse file"

**Solutions:**

1. **Verify file integrity:**
   - Try opening the file in desktop CAD software
   - Check if file was uploaded completely

2. **Re-upload file:**
   Delete and re-upload the file to Nextcloud

3. **Check MIME types:**
   Ensure proper MIME types are configured in web server

4. **File version compatibility:**
   Very old or very new DWG versions may have limited support

---

## Display Issues

### Blank White Screen

**Symptoms:**
- Viewer opens but shows only white screen
- No drawing visible

**Solutions:**

1. **Check browser console:**
   Press F12 and look for errors

2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

3. **Disable browser extensions:**
   Some ad blockers or privacy extensions may interfere

4. **Try different browser:**
   Test in Chrome, Firefox, or Edge

5. **Check WebGL support:**
   Visit https://get.webgl.org/ to verify WebGL is working

### Colors Appear Wrong

**Symptoms:**
- Colors don't match original CAD file
- Everything appears in one color

**Solutions:**

1. **Switch theme:**
   Try toggling between light and dark themes

2. **Check layer colors:**
   Open layer manager to verify layer colors

3. **Browser color profile:**
   Some browsers apply color profiles that affect display

4. **Graphics driver:**
   Update graphics drivers on client machine

### Text Appears Blurry or Missing

**Symptoms:**
- Text is hard to read
- Some text doesn't display

**Solutions:**

1. **Zoom in:**
   Use zoom controls to get closer view

2. **Check font support:**
   Some specialized fonts may not render correctly

3. **Browser zoom:**
   Reset browser zoom to 100%

4. **Screen resolution:**
   Higher resolution displays may need browser scaling adjustments

### Layers Not Showing

**Symptoms:**
- Some layers don't appear in layer manager
- Can't toggle certain layers

**Solutions:**

1. **Check layer state in source file:**
   Frozen or locked layers may not be fully supported

2. **Refresh viewer:**
   Reload the page to refresh layer list

3. **Complex layer structures:**
   Nested blocks or xrefs may affect layer visibility

---

## Performance Issues

### Slow Zoom/Pan

**Symptoms:**
- Laggy navigation
- Delayed response to mouse/touch input

**Solutions:**

1. **Enable hardware acceleration:**
   - Chrome: Settings → System → Hardware acceleration
   - Firefox: Settings → General → Performance

2. **Reduce drawing complexity:**
   Hide unnecessary layers

3. **Close other tabs:**
   Free up browser memory

4. **Update graphics drivers:**
   Ensure latest GPU drivers are installed

5. **Use wired connection:**
   WiFi may introduce latency

### High Memory Usage

**Symptoms:**
- Browser becomes unresponsive
- System slows down

**Solutions:**

1. **Check file size:**
   Large files consume more memory

2. **Close unused applications:**
   Free up system RAM

3. **Increase browser memory limit:**
   Some browsers allow memory configuration

4. **Use 64-bit browser:**
   32-bit browsers have lower memory limits

### Crashes or Freezes

**Symptoms:**
- Browser tab crashes
- System freezes when viewing CAD files

**Solutions:**

1. **Reduce file complexity:**
   Simplify the drawing if possible

2. **Update browser:**
   Use latest browser version

3. **Check system resources:**
   Ensure adequate RAM and CPU

4. **Try different browser:**
   Some browsers handle large files better

---

## Browser Issues

### Unsupported Browser

**Symptoms:**
- Error message about browser compatibility
- Features don't work

**Solutions:**

1. **Update browser:**
   Use latest version of Chrome, Firefox, Safari, or Edge

2. **Enable required features:**
   - JavaScript must be enabled
   - WebGL must be supported
   - Local storage must be allowed

3. **Try different browser:**
   Switch to a supported browser

### WebGL Not Supported

**Symptoms:**
- Error: "WebGL not supported"
- Black or blank canvas

**Solutions:**

1. **Check WebGL support:**
   Visit https://get.webgl.org/

2. **Enable WebGL:**
   - Chrome: chrome://flags/#ignore-gpu-blacklist
   - Firefox: about:config → webgl.disabled = false

3. **Update graphics drivers:**
   Install latest GPU drivers

4. **Hardware limitations:**
   Very old hardware may not support WebGL 2.0

---

## Server Issues

### 500 Internal Server Error

**Symptoms:**
- Error 500 when opening files
- Server error in logs

**Solutions:**

1. **Check server logs:**
   ```bash
   tail -f /var/www/nextcloud/data/nextcloud.log
   tail -f /var/log/apache2/error.log  # or nginx error log
   ```

2. **Increase PHP limits:**
   ```ini
   memory_limit = 1024M
   max_execution_time = 300
   upload_max_filesize = 500M
   post_max_size = 500M
   ```

3. **Check file permissions:**
   ```bash
   chown -R www-data:www-data /var/www/nextcloud
   ```

4. **Restart web server:**
   ```bash
   systemctl restart apache2  # or nginx
   ```

### Timeout Errors

**Symptoms:**
- Request timeout when loading large files
- Connection reset

**Solutions:**

1. **Increase timeout settings:**
   Apache:
   ```apache
   Timeout 300
   ```
   
   Nginx:
   ```nginx
   proxy_read_timeout 300;
   ```

2. **Optimize file size:**
   Reduce CAD file size if possible

3. **Check network:**
   Verify stable connection between client and server

---

## Mobile Issues

### Touch Controls Not Working

**Symptoms:**
- Pinch zoom doesn't work
- Drag to pan fails

**Solutions:**

1. **Use landscape orientation:**
   Rotate device to landscape mode

2. **Update mobile browser:**
   Ensure latest browser version

3. **Try different browser:**
   Chrome or Safari recommended on mobile

4. **Clear mobile browser cache:**
   In browser settings

### Poor Performance on Mobile

**Symptoms:**
- Slow rendering
- Choppy navigation

**Solutions:**

1. **Use tablet instead:**
   Tablets have more processing power

2. **Simplify drawing:**
   Hide layers before viewing on mobile

3. **Close other apps:**
   Free up device memory

4. **Check network:**
   Use WiFi instead of cellular data

---

## Error Messages

### Common Error Messages and Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "File not found" | File deleted or moved | Refresh page, check file location |
| "Access denied" | Insufficient permissions | Contact file owner or admin |
| "Unsupported file type" | Not a DWG/DXF file | Verify file format |
| "WebGL not supported" | Browser/GPU limitation | Update browser/drivers |
| "Out of memory" | File too large | Optimize file, increase resources |
| "Network error" | Connection issue | Check network, retry |
| "Invalid file format" | Corrupted file | Re-upload or repair file |
| "Timeout" | Slow connection or large file | Increase timeout, optimize file |

---

## Getting Help

### Before Seeking Help

1. ✅ Check this troubleshooting guide
2. ✅ Review the [FAQ](FAQ) page
3. ✅ Search existing GitHub issues
4. ✅ Check Nextcloud logs
5. ✅ Test in different browser

### Collecting Information

When reporting an issue, include:

1. **System Information:**
   - Nextcloud version
   - PHP version
   - Browser name and version
   - Operating system

2. **Error Details:**
   - Exact error messages
   - Browser console errors (screenshots)
   - Nextcloud log entries

3. **Steps to Reproduce:**
   - What you were doing
   - What you expected
   - What actually happened

4. **File Information:**
   - File size
   - File format (DWG/DXF version)
   - Can you share a test file?

### Where to Get Help

1. **GitHub Issues:**
   https://github.com/ashcoft/nextcloud-cad-viewer/issues

2. **Nextcloud Community:**
   https://help.nextcloud.com/

3. **Documentation:**
   - [User Guide](User-Guide)
   - [Installation Guide](Installation-Guide)
   - [FAQ](FAQ)

4. **Contact Administrator:**
   For enterprise installations, contact your IT administrator

---

**Related Pages:**
- [FAQ](FAQ)
- [User Guide](User-Guide)
- [Performance Tuning](Performance-Tuning)
- [Configuration](Configuration)
