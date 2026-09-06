# Requirements

This document outlines the system requirements and dependencies for running Nextcloud CAD Viewer.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Server Requirements](#server-requirements)
3. [Client/Browser Requirements](#clientbrowser-requirements)
4. [File Format Support](#file-format-support)
5. [Performance Considerations](#performance-considerations)
6. [Network Requirements](#network-requirements)

---

## System Requirements

### Nextcloud Version

| Requirement | Details |
|-------------|---------|
| **Minimum Version** | Nextcloud 34 |
| **Maximum Version** | Nextcloud 35 |
| **Recommended** | Latest stable release of Nextcloud 35 |

> ⚠️ **Note**: The app is specifically tested and optimized for Nextcloud 34-35.

### PHP Requirements

| Component | Version | Notes |
|-----------|---------|-------|
| **PHP Version** | 8.4+ | Required |
| **Memory Limit** | 512MB minimum, 1GB recommended | For large files |
| **Max Execution Time** | 120 seconds minimum | For file processing |
| **Upload Max Filesize** | 100MB minimum, 500MB+ recommended | For CAD file uploads |

### Required PHP Extensions

The following PHP extensions must be enabled:

- ✅ `gd` or `imagick` - Image processing
- ✅ `fileinfo` - MIME type detection
- ✅ `json` - JSON handling
- ✅ `libxml` - XML parsing
- ✅ `dom` - DOM manipulation
- ✅ `xml` - XML support
- ✅ `zip` - Archive handling
- ✅ `curl` - HTTP requests
- ✅ `openssl` - SSL/TLS support
- ✅ `mbstring` - Multi-byte string handling

### Database Requirements

Supported databases:

- ✅ MySQL 8.0+
- ✅ MariaDB 10.5+
- ✅ PostgreSQL 13+
- ✅ SQLite 3.35+ (not recommended for production)

---

## Server Requirements

### Web Server

#### Apache

- **Version**: 2.4+
- **Required Modules**:
  - `mod_headers`
  - `mod_rewrite`
  - `mod_mime`
  - `mod_ssl` (for HTTPS)

#### Nginx

- **Version**: 1.20+
- **Configuration**: Proper MIME type handling required

### Server Resources

#### Minimum Specifications

| Resource | Specification |
|----------|--------------|
| **CPU** | 2 cores |
| **RAM** | 2 GB |
| **Storage** | 100 MB for app + space for CAD files |
| **Bandwidth** | 10 Mbps |

#### Recommended Specifications

| Resource | Specification |
|----------|--------------|
| **CPU** | 4+ cores |
| **RAM** | 4-8 GB |
| **Storage** | SSD storage recommended |
| **Bandwidth** | 100 Mbps+ |

### Operating System

Tested on:

- ✅ Ubuntu 22.04 LTS
- ✅ Ubuntu 24.04 LTS
- ✅ Debian 11/12
- ✅ CentOS 8/Rocky Linux 8
- ✅ RHEL 8/9
- ✅ Other Linux distributions with PHP 8.4+

---

## Client/Browser Requirements

### Supported Browsers

| Browser | Minimum Version | Recommended Version |
|---------|----------------|---------------------|
| **Google Chrome** | 90+ | Latest |
| **Mozilla Firefox** | 88+ | Latest |
| **Apple Safari** | 14+ | Latest |
| **Microsoft Edge** | 90+ | Latest |
| **Opera** | 76+ | Latest |

### Browser Features Required

- ✅ **WebGL 2.0** - For 3D rendering
- ✅ **JavaScript** - Must be enabled
- ✅ **Local Storage** - For caching
- ✅ **Fetch API** - For data loading
- ✅ **ES6 Support** - Modern JavaScript features

### Mobile Support

| Platform | Minimum Version | Notes |
|----------|----------------|-------|
| **iOS Safari** | 14+ | iPad recommended for better UX |
| **Android Chrome** | 90+ | Tablet recommended |
| **Mobile Firefox** | 88+ | Limited mobile support |

> 📱 **Mobile Note**: While mobile browsers are supported, the CAD Viewer is optimized for desktop use. Complex drawings may be difficult to navigate on small screens.

### Hardware Acceleration

For optimal performance, ensure hardware acceleration is enabled in your browser:

#### Chrome/Edge
1. Go to Settings → System
2. Enable "Use hardware acceleration when available"

#### Firefox
1. Go to Settings → General
2. Under Performance, uncheck "Use recommended performance settings"
3. Check "Use hardware acceleration when available"

---

## File Format Support

### DWG Files

| Format | Versions Supported | Notes |
|--------|-------------------|-------|
| **AutoCAD DWG** | R14, 2000, 2004, 2007, 2010, 2013, 2018 | Full support |
| **MIME Types** | `application/acad`, `application/autocad_dwg`, `application/dwg`, `application/x-autocad`, `application/x-dwg`, `image/vnd.dwg` | |

### DXF Files

| Format | Versions Supported | Notes |
|--------|-------------------|-------|
| **AutoCAD DXF** | R12, R13, R14, 2000+ | Full support |
| **MIME Types** | `image/vnd.dxf`, `application/dxf`, `application/x-dxf`, `image/x-dxf` | |

### File Size Limits

| Category | Maximum Size | Notes |
|----------|-------------|-------|
| **Small Files** | < 10 MB | Optimal performance |
| **Medium Files** | 10-50 MB | Good performance |
| **Large Files** | 50-200 MB | May require more resources |
| **Very Large Files** | 200-500 MB | Performance depends on server/client |
| **Maximum** | 500 MB+ | Configure upload limits accordingly |

---

## Performance Considerations

### Server-Side Factors

1. **CPU Performance**
   - Faster CPUs improve file streaming
   - Multi-core processors handle concurrent users better

2. **Memory**
   - More RAM allows larger file caching
   - Consider 2GB per concurrent user for heavy usage

3. **Storage I/O**
   - SSD storage significantly improves load times
   - RAID configurations improve reliability

4. **Network Bandwidth**
   - Higher bandwidth supports more concurrent users
   - Consider CDN for distributed user base

### Client-Side Factors

1. **GPU Performance**
   - Dedicated GPU recommended for complex drawings
   - Integrated graphics sufficient for simple files

2. **Browser Memory**
   - Large files require more browser memory
   - Close unused tabs when viewing large CAD files

3. **Network Connection**
   - Broadband connection recommended (10+ Mbps)
   - Latency affects initial load time

### Optimization Tips

#### For Administrators

- Enable server-side caching (Redis/Memcached)
- Use a CDN for static assets
- Configure proper gzip/brotli compression
- Optimize database queries
- Use PHP OPcache

#### For Users

- Clear browser cache periodically
- Use wired connection for large files
- Close unnecessary browser tabs
- Update browser to latest version

---

## Network Requirements

### Bandwidth Recommendations

| Usage Scenario | Minimum Bandwidth | Recommended Bandwidth |
|---------------|------------------|----------------------|
| **Single User, Small Files** | 5 Mbps | 25 Mbps |
| **Single User, Large Files** | 25 Mbps | 100 Mbps |
| **Multiple Users (5-10)** | 50 Mbps | 200 Mbps |
| **Enterprise (50+ users)** | 500 Mbps | 1 Gbps+ |

### Firewall Configuration

Ensure the following ports are open:

| Port | Protocol | Purpose |
|------|----------|---------|
| 80 | TCP | HTTP (if not using HTTPS) |
| 443 | TCP | HTTPS (recommended) |

### CORS Configuration

If hosting CAD files on a different domain, configure CORS headers:

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"
```

---

## Dependencies

### Frontend Dependencies

The app uses the following major libraries:

- **Vue.js** 3.5+ - Frontend framework
- **MLightCAD CAD Viewer** 1.5+ - Core CAD rendering engine
- **Element Plus** 2.14+ - UI components
- **Axios** 1.16+ - HTTP client
- **Vue Router** 5.0+ - Routing

### Backend Dependencies

- **Nextcloud App Framework** - PHP backend framework
- **Composer packages** - See `composer.json` for details

---

## Compatibility Matrix

| Nextcloud | PHP | CAD Viewer Version | Status |
|-----------|-----|-------------------|--------|
| 35 |8.4+ | 1.0.0 | ✅ Fully Supported |
| 34 |8.4 | 1.0.0 | ✅ Fully Supported |
| 33 |8.3 | - | ❌ Not Supported |

---

## Upgrade Path

When upgrading from previous versions:

1. Backup your Nextcloud installation
2. Update to Nextcloud 34 (if not already)
3. Update PHP to 8.4+
4. Install/update CAD Viewer app
5. Clear caches
6. Test with sample CAD files

---

**Related Pages:**
- [Installation Guide](Installation-Guide)
- [Configuration](Configuration)
- [Performance Tuning](Performance-Tuning)
