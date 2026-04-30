---
sidebar_position: 2
---

# Supported File Formats

Nextcloud CAD Viewer supports a wide range of CAD file formats.

## Primary Formats

### DWG (Drawing)

**AutoCAD Native Format**

| AutoCAD Version | DWG Version | Support |
|-----------------|-------------|---------|
| R14 | AC1014 | ✅ Full |
| 2000 | AC1015 | ✅ Full |
| 2004 | AC1018 | ✅ Full |
| 2007 | AC1021 | ✅ Full |
| 2010 | AC1024 | ✅ Full |
| 2013 | AC1027 | ✅ Full |
| 2018 | AC1032 | ✅ Full |

**Features Supported:**
- 2D and 3D geometry
- Layers and blocks
- Text and dimensions
- Hatches and fills
- Viewports and layouts

### DXF (Drawing Exchange Format)

**Autodesk Exchange Format**

| Type | Support | Notes |
|------|---------|-------|
| ASCII DXF | ✅ Full | Human-readable |
| Binary DXF | ✅ Full | Smaller file size |

**DXF Versions:**
- R14 through 2018 fully supported
- Earlier versions may have limited support

## Supported Entities

### 2D Entities

| Entity | Support | Notes |
|--------|---------|-------|
| Line | ✅ | - |
| Polyline | ✅ | 2D and 3D |
| Arc | ✅ | - |
| Circle | ✅ | - |
| Ellipse | ✅ | - |
| Spline | ✅ | NURBS |
| Text | ✅ | Single line |
| MText | ✅ | Multi-line |
| Dimension | ✅ | All types |
| Leader | ✅ | - |
| Hatch | ✅ | Pattern and solid |
| Image | ⚠️ | Limited support |

### 3D Entities

| Entity | Support | Notes |
|--------|---------|-------|
| 3D Face | ✅ | - |
| 3D Solid | ✅ | ACIS solids |
| Mesh | ✅ | Polygon mesh |
| Surface | ⚠️ | Basic support |
| Body | ⚠️ | Limited |

### Object Types

| Object | Support | Notes |
|--------|---------|-------|
| Block | ✅ | Block definitions |
| Insert | ✅ | Block references |
| Layer | ✅ | Full layer support |
| Layout | ✅ | Model and paper space |
| Viewport | ✅ | - |
| Style | ✅ | Text and dimension styles |
| Group | ✅ | Named groups |

## Limitations

### Not Supported

The following features are not currently supported:

- **Dynamic Blocks**: Converted to static blocks
- **Parametric Constraints**: Not rendered
- **External References (Xrefs)**: Must be bound
- **Point Clouds**: Not supported
- **Sheet Sets**: Individual sheets only
- **Custom Objects**: May not render correctly

### Partial Support

| Feature | Status | Notes |
|---------|--------|-------|
| Gradients | ⚠️ | Basic gradients only |
| Transparency | ⚠️ | Limited support |
| True Color | ✅ | RGB colors supported |
| Plot Styles | ❌ | Not applicable in viewer |

## File Size Recommendations

| File Size | Recommendation |
|-----------|----------------|
| < 10MB | Optimal performance |
| 10-50MB | Good performance |
| 50-100MB | Acceptable, may load slowly |
| > 100MB | Consider optimizing file |

## Optimization Tips

### For Best Performance

1. **Purge Unused Items**: Remove unused layers, blocks, and styles
2. **Audit Drawing**: Fix any errors before uploading
3. **Simplify Geometry**: Reduce complexity where possible
4. **Bind Xrefs**: Convert external references to blocks
5. **Compress Images**: If using raster images

### Converting Files

If you encounter issues:

```bash
# Using LibreCAD (free)
librecad input.dwg -export output.dxf

# Using ODA Converter (commercial)
odafileconverter input.dwg 2018 output.dwg
```

## Troubleshooting

### File Won't Load

1. Verify file extension (.dwg or .dxf)
2. Check file isn't corrupted
3. Try opening in desktop CAD software
4. Convert to different DWG version

### Missing Elements

1. Check if elements are on frozen layers
2. Verify block definitions are included
3. Ensure entities aren't outside visible area

### Display Issues

1. Clear browser cache
2. Update to latest browser version
3. Check WebGL support
4. Try different browser

Previous: [Requirements](./requirements.md) | Next: [Troubleshooting](../troubleshooting.md)
