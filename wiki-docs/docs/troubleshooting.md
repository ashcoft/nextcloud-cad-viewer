---
sidebar_position: 6
---

# Troubleshooting

Common issues and solutions for Nextcloud CAD Viewer.

## Files Not Displaying

### Issue: File shows blank or won't load

**Possible Causes:**
- Corrupted file
- Unsupported DWG version
- Browser WebGL not enabled
- Server configuration issue

**Solutions:**

1. **Verify File Integrity**
   ```bash
   # Try opening in desktop CAD software
   libreCAD your-file.dwg
   ```

2. **Check Browser Console**
   - Press `F12` to open developer tools
   - Look for errors in the Console tab
   - Check Network tab for failed requests

3. **Enable WebGL**
   - Visit `chrome://gpu` (Chrome) or `about:support` (Firefox)
   - Ensure WebGL is listed as "Hardware accelerated"

4. **Convert File Version**
   - Use ODA File Converter to convert to DWG 2018 or earlier
   - Or export as DXF format

## Performance Issues

### Issue: Slow loading or laggy navigation

**Solutions:**

1. **Optimize the Drawing**
   ```autocad
   ; In AutoCAD, run these commands:
   PURGE      ; Remove unused items
   AUDIT      ; Fix errors
   OVERKILL   ; Remove duplicate objects
   ```

2. **Clear Browser Cache**
   - Chrome: `Ctrl+Shift+Delete`
   - Firefox: `Ctrl+Shift+Delete`
   - Safari: `Cmd+Option+E`

3. **Check Server Resources**
   ```bash
   # Monitor memory usage
   free -h
   
   # Check PHP memory limit
   php -i | grep memory_limit
   ```

4. **Reduce File Complexity**
   - Turn off unnecessary layers
   - Simplify complex hatches
   - Reduce image resolutions

## Installation Problems

### Issue: App won't enable

**Solutions:**

1. **Check Permissions**
   ```bash
   chown -R www-data:www-data /path/to/nextcloud/apps/cad_viewer
   chmod -R 755 /path/to/nextcloud/apps/cad_viewer
   ```

2. **Verify Dependencies**
   ```bash
   cd /path/to/nextcloud/apps/cad_viewer
   npm install
   npm run build
   ```

3. **Check Nextcloud Logs**
   ```bash
   tail -f /path/to/nextcloud/data/nextcloud.log
   ```

4. **Reinstall App**
   ```bash
   # Disable app
   sudo -u www-data php occ app:disable cad_viewer
   
   # Remove and reinstall
   rm -rf /path/to/nextcloud/apps/cad_viewer
   # Then reinstall from App Store
   ```

## Display Issues

### Issue: Colors appear wrong

**Solutions:**

1. **Check Layer Colors**
   - Open layer panel in viewer
   - Verify layer colors are set correctly

2. **Browser Color Profile**
   - Some browsers apply color profiles
   - Try disabling hardware acceleration

3. **True Color Support**
   - Ensure file uses RGB colors
   - Avoid indexed color palettes

### Issue: Text not displaying

**Solutions:**

1. **Font Issues**
   - Some custom fonts may not render
   - Text converts to default font

2. **Text Style**
   - Check text style definitions
   - Ensure text isn't on frozen layer

3. **Special Characters**
   - Unicode characters may not display
   - Try using standard ASCII characters

## Mobile Issues

### Issue: Touch controls not working

**Solutions:**

1. **Browser Compatibility**
   - Use latest Chrome or Safari
   - Avoid third-party browsers

2. **Clear Site Data**
   - Settings → Site Settings → CAD Viewer
   - Clear data and reload

3. **Orientation**
   - Try landscape mode for better experience
   - Lock orientation if needed

## Error Messages

### "WebGL not supported"

**Solution:**
- Update graphics drivers
- Enable WebGL in browser settings
- Try a different browser
- Check if hardware acceleration is disabled

### "File too large"

**Solution:**
- Increase PHP upload limits in `php.ini`:
  ```ini
  upload_max_filesize = 100M
  post_max_size = 100M
  memory_limit = 512M
  ```
- Optimize the CAD file before uploading
- Consider splitting large drawings

### "Failed to load file"

**Solution:**
1. Check file permissions in Nextcloud
2. Verify file isn't locked by another user
3. Check server disk space
4. Review Nextcloud logs for details

## Getting Help

If you can't resolve the issue:

1. **Search Existing Issues**
   - Check [GitHub Issues](https://github.com/ashcoft/nextcloud-cad-viewer/issues)

2. **Create New Issue**
   - Include Nextcloud version
   - Include browser and OS details
   - Attach error messages and logs
   - Provide sample file if possible

3. **Community Support**
   - Nextcloud Community Forum
   - GitHub Discussions

Previous: [File Formats](./compatibility/file-formats.md) | Next: [Contributing](./contributing.md)
