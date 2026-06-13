# DXF-JSON

This is forked version of [dotoritos-kim/dxf-json](https://github.com/dotoritos-kim/dxf-json) with the following extensions which are not supported in the original repository.

Entities:

- MLEADER (enhanced)
- TABLE

Objects:

- DIMASSOC
- GROUP
- IMAGEDEF
- LAYER_FILTER
- LAYER_INDEX
- MLEADERSTYLE
- MLINESTYLE

## JSON Viewer

Run the local JSON viewer to inspect DXF parsing results in the browser:

```bash
npm run viewer
```

Then choose a `.dxf` file from the page. After parsing succeeds, the parsed JSON result will be shown in the viewer.
