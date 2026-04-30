---
sidebar_position: 1
---

# System Requirements

This document outlines the system requirements for running Nextcloud CAD Viewer.

## Server Requirements

### Nextcloud

- **Version**: Nextcloud 33 or higher
- **Recommended**: Latest stable release

### PHP

- **Minimum Version**: PHP 8.5
- **Required Extensions**:
  - `pdo_mysql` or `pdo_pgsql`
  - `gd`
  - `json`
  - `libxml`
  - `mbstring`
  - `openssl`
  - `zip`

### Web Server

- **Apache** 2.4+ with `mod_rewrite`
- **Nginx** 1.18+ with proper configuration
- **Lighttpd** 1.4.59+ (community support)

### Database

- **MySQL** 8.0+
- **MariaDB** 10.5+
- **PostgreSQL** 13+
- **SQLite** 3.35+ (development only)

### Memory

- **Minimum**: 512MB RAM for Nextcloud
- **Recommended**: 2GB+ RAM for handling large CAD files
- **PHP Memory Limit**: 512MB minimum (`memory_limit` in php.ini)

### Storage

- **App Size**: ~50MB
- **Temporary Storage**: Additional space for file processing
- **Recommended**: SSD storage for better performance

## Client Requirements

### Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Recommended |
| Firefox | 88+ | Recommended |
| Safari | 14+ | macOS and iOS |
| Edge | 90+ | Chromium-based |
| Opera | 76+ | - |

### WebGL

- **WebGL 2.0** required for hardware acceleration
- Most modern browsers support WebGL by default
- Can be verified at [webglreport.com](https://webglreport.com/)

### JavaScript

- **ES6+** support required
- Must have JavaScript enabled

### Screen Resolution

- **Minimum**: 1024×768
- **Recommended**: 1920×1080 or higher

### Mobile Support

- **iOS**: 14+ (Safari, Chrome)
- **Android**: 10+ (Chrome, Firefox)
- Touch gestures supported

## Network Requirements

### Bandwidth

- **Minimum**: 5 Mbps for basic viewing
- **Recommended**: 25+ Mbps for large files
- Large DWG/DXF files (>50MB) benefit from faster connections

### Protocols

- **HTTPS** strongly recommended
- HTTP/2 support improves performance

## Performance Considerations

### File Size Limits

| File Size | Expected Load Time | Experience |
|-----------|-------------------|------------|
| < 10MB | < 2 seconds | Excellent |
| 10-50MB | 2-10 seconds | Good |
| 50-100MB | 10-30 seconds | Acceptable |
| > 100MB | 30+ seconds | May vary |

### Optimization Tips

1. **Enable Browser Caching**: Reduces load times for repeat views
2. **Use CDN**: For distributed teams
3. **Increase PHP Timeout**: For very large files
4. **Optimize Database**: Regular maintenance improves performance

## Troubleshooting Requirements Issues

### Checking PHP Version

```bash
php -v
```

### Verifying Extensions

```bash
php -m | grep -E 'pdo|gd|json|mbstring|openssl'
```

### Testing WebGL

Visit [webglreport.com](https://webglreport.com/) in your browser to verify WebGL support.

### Browser Console Errors

Press `F12` to open developer tools and check the Console tab for errors.

Previous: [Testing](../development/testing.md) | Next: [File Formats](./file-formats.md)
