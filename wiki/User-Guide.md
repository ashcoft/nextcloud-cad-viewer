# User Guide

This comprehensive guide explains how to use the Nextcloud CAD Viewer to view and interact with DWG and DXF files.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Opening CAD Files](#opening-cad-files)
3. [Viewer Interface](#viewer-interface)
4. [Navigation Controls](#navigation-controls)
5. [Layer Management](#layer-management)
6. [View Options](#view-options)
7. [Fullscreen Mode](#fullscreen-mode)
8. [Printing and Exporting](#printing-and-exporting)
9. [Tips and Best Practices](#tips-and-best-practices)

---

## Getting Started

Once the CAD Viewer app is installed and enabled in your Nextcloud instance, you can immediately start viewing CAD files. No additional configuration is required for basic usage.

### First Time Use

1. **Upload a CAD file** to your Nextcloud storage
2. **Navigate** to the file in your Files app
3. **Click** on the DWG or DXF file
4. The CAD Viewer will automatically open and load the drawing

---

## Opening CAD Files

There are several ways to open CAD files in the viewer:

### Method 1: Direct Click

Simply click on any DWG or DXF file in your Nextcloud Files app. The file will open directly in the CAD Viewer.

### Method 2: Preview Panel

1. Select the file (single click)
2. Click the preview icon in the right sidebar
3. Click "Open" to launch the full viewer

### Method 3: Context Menu

1. Right-click on the CAD file
2. Select "Open" from the context menu
3. Choose "CAD Viewer" if prompted

### Method 4: From Shared Links

If someone shares a CAD file with you via a Nextcloud share link:
1. Click the shared link
2. The file will open in CAD Viewer automatically
3. You can view but not edit (unless given edit permissions)

---

## Viewer Interface

The CAD Viewer interface consists of several key components:

```
┌─────────────────────────────────────────────────────┐
│  Toolbar                                            │
│  [Zoom] [Pan] [Fit] [Layers] [Theme] [Fullscreen]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                    Drawing Area                     │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Status Bar                                         │
│  [File Name] [Dimensions] [Zoom Level] [Coordinates]│
└─────────────────────────────────────────────────────┘
```

### Toolbar

Located at the top of the viewer, contains all interactive controls:

- **Zoom Controls**: Zoom in/out buttons
- **Pan Tool**: Move around the drawing
- **Fit to View**: Automatically fit the drawing to the viewport
- **Layer Manager**: Toggle layer visibility
- **Theme Switcher**: Switch between light and dark themes
- **Fullscreen**: Enter/exit fullscreen mode

### Drawing Area

The main viewport where your CAD drawing is displayed. This area supports:
- Mouse interactions (zoom, pan)
- Touch gestures (on mobile/tablet)
- Keyboard shortcuts

### Status Bar

Located at the bottom, displays:
- Current file name
- Drawing dimensions (if available)
- Current zoom level percentage
- Cursor coordinates (when hovering over the drawing)

---

## Navigation Controls

### Zoom Operations

#### Using Toolbar Buttons
- Click **+** to zoom in (increase magnification)
- Click **-** to zoom out (decrease magnification)

#### Using Mouse Wheel
- Scroll **up** to zoom in
- Scroll **down** to zoom out

#### Using Keyboard
- **+** or **=** : Zoom in
- **-** : Zoom out
- **0** : Reset to 100% zoom

#### Pinch Gesture (Touch Devices)
- Pinch **out** to zoom in
- Pinch **in** to zoom out

### Pan Operations

#### Using Pan Tool
1. Click the **Pan** button in the toolbar
2. Click and drag in the drawing area
3. Release to stop panning

#### Using Middle Mouse Button
- Hold **middle mouse button** and drag to pan

#### Using Spacebar
- Hold **Spacebar** + left-click and drag to pan temporarily

#### Touch Drag (Mobile/Tablet)
- Drag with one finger to pan around the drawing

### Fit to View

Click the **Fit** button (or press **F**) to automatically scale and center the drawing to fit the current viewport.

### Zoom to Selection

*Note: This feature may be available in future versions*

1. Click and drag to create a selection rectangle
2. Release to zoom to the selected area

---

## Layer Management

CAD drawings often contain multiple layers for organizing different elements. The CAD Viewer allows you to control layer visibility.

### Opening Layer Manager

Click the **Layers** button in the toolbar to open the layer management panel.

### Layer Controls

The layer panel displays:
- **Layer Name**: Name of each layer
- **Visibility Toggle**: Eye icon to show/hide layers
- **Color Indicator**: Layer color (if defined in the drawing)

### Toggling Layer Visibility

1. Open the Layer Manager
2. Click the **eye icon** next to a layer name
   - 👁️ Visible: Layer is displayed
   - 👁️‍🗨️ Hidden: Layer is not displayed
3. Changes apply immediately

### Tips for Working with Layers

- **Hide clutter**: Turn off construction or dimension layers for cleaner viewing
- **Focus on details**: Hide unrelated layers to focus on specific elements
- **Performance**: Hiding complex layers can improve performance on large drawings

---

## View Options

### Theme Selection

Switch between light and dark themes based on your preference:

1. Click the **Theme** button in the toolbar
2. Select **Light** or **Dark** theme
3. Your preference is saved for future sessions

**Light Theme**: Traditional white background, ideal for bright environments
**Dark Theme**: Dark background, reduces eye strain in low-light conditions

### Display Quality

The viewer automatically adjusts quality based on:
- Screen resolution
- Browser capabilities
- Drawing complexity

### Orientation

- **Desktop**: Landscape orientation recommended
- **Tablet**: Either landscape or portrait
- **Mobile**: Landscape mode provides better viewing experience

---

## Fullscreen Mode

Fullscreen mode maximizes the drawing area by hiding browser UI elements.

### Entering Fullscreen

**Method 1: Toolbar Button**
- Click the **Fullscreen** button in the toolbar

**Method 2: Keyboard Shortcut**
- Press **F11** (browser fullscreen)
- Or **Esc** to exit

**Method 3: Double-Click**
- Double-click on the drawing area (if supported)

### Exiting Fullscreen

- Press **Esc** key
- Or click the **Exit Fullscreen** button

---

## Printing and Exporting

### Printing Drawings

*Note: Print functionality depends on browser capabilities*

1. Open the CAD file in the viewer
2. Use your browser's print function (**Ctrl+P** or **Cmd+P**)
3. Adjust print settings as needed
4. Print to paper or PDF

### Taking Screenshots

For sharing or documentation purposes:

1. Position the drawing as desired
2. Use your system's screenshot tool:
   - **Windows**: Win+Shift+S
   - **Mac**: Cmd+Shift+4
   - **Linux**: Depends on distribution
3. Save the screenshot

### Export Options

*Note: Export features may be added in future versions*

Currently, the viewer is read-only. To export or convert CAD files, use dedicated CAD software.

---

## Tips and Best Practices

### Performance Optimization

1. **For Large Files**:
   - Close unnecessary browser tabs
   - Use a wired network connection
   - Enable hardware acceleration in browser

2. **For Complex Drawings**:
   - Hide unnecessary layers
   - Zoom to areas of interest rather than viewing entire drawing
   - Consider breaking very large files into smaller sections

### Navigation Efficiency

1. **Learn Keyboard Shortcuts**:
   ```
   + / =    : Zoom in
   -        : Zoom out
   0        : Reset zoom
   F        : Fit to view
   Space    : Temporary pan mode
   Esc      : Cancel current operation
   ```

2. **Use Mouse Efficiently**:
   - Scroll wheel for quick zooming
   - Middle-click for panning
   - Right-click for context menu (if available)

### File Organization

1. **Naming Conventions**: Use descriptive file names
2. **Folder Structure**: Organize CAD files in logical folders
3. **Version Control**: Include version numbers in file names

### Collaboration

1. **Sharing Files**:
   - Use Nextcloud's share feature to share CAD files
   - Set appropriate permissions (view-only vs. edit)
   - Share with specific users or via public link

2. **Comments and Feedback**:
   - Use Nextcloud's comments feature for file discussions
   - Share screenshots with annotations for feedback

### Mobile Usage

1. **Best Practices**:
   - Use landscape orientation
   - Use two-finger pinch for zooming
   - Single-finger drag for panning

2. **Limitations**:
   - Complex drawings may be difficult to navigate
   - Some features may be limited on mobile
   - Consider using tablet for better experience

### Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| Drawing loads slowly | Check file size, network speed, clear browser cache |
| Can't zoom or pan | Refresh page, check browser console for errors |
| Layers not showing | Ensure layers aren't frozen in source CAD file |
| Colors look wrong | Try switching themes, check browser color settings |
| Text appears blurry | Zoom in closer, check screen resolution settings |

---

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| **+** or **=** | Zoom in |
| **-** | Zoom out |
| **0** | Reset to 100% zoom |
| **F** | Fit to view |
| **Space** (hold) | Temporary pan mode |
| **Esc** | Cancel operation / Exit fullscreen |
| **Ctrl/Cmd + 0** | Reset zoom |
| **Ctrl/Cmd + +** | Zoom in |
| **Ctrl/Cmd + -** | Zoom out |

---

## Accessibility Features

The CAD Viewer includes several accessibility features:

- **Keyboard Navigation**: All functions accessible via keyboard
- **Screen Reader Support**: Basic ARIA labels implemented
- **High Contrast**: Dark theme provides high contrast option
- **Resizable Interface**: Supports browser zoom up to 200%

---

## Getting Help

If you encounter issues or have questions:

1. Check the [Troubleshooting](Troubleshooting) guide
2. Review the [FAQ](FAQ) page
3. Report issues on [GitHub](https://github.com/ashcoft/nextcloud-cad-viewer/issues)
4. Contact your Nextcloud administrator

---

**Related Pages:**
- [Supported Formats](Supported-Formats)
- [Keyboard Shortcuts](Keyboard-Shortcuts)
- [Troubleshooting](Troubleshooting)
- [Mobile Usage](Mobile-Usage)
