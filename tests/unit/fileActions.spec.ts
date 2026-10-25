import { DefaultType } from '@nextcloud/files'
import { createCadFileAction, buildViewerUrl, isCadNode } from '../../src/fileActions'
import { SUPPORTED_MIMES, isSupportedCadMime, hasCadExtension } from '../../src/utils/mimeTypes'

const translate = (_app: string, text: string) => text

describe('CAD MIME helpers', () => {
  it('tracks the supported DWG and DXF MIME types', () => {
    expect(SUPPORTED_MIMES).toContain('application/dwg')
    expect(SUPPORTED_MIMES).toContain('image/vnd.dxf')
    expect(isSupportedCadMime('application/dwg')).toBe(true)
    expect(isSupportedCadMime('image/vnd.dxf')).toBe(true)
    expect(isSupportedCadMime('application/pdf')).toBe(false)
  })

  it('detects CAD files by extension as a fallback', () => {
    expect(hasCadExtension('plan.dwg')).toBe(true)
    expect(hasCadExtension('plan.DXF')).toBe(true)
    expect(hasCadExtension('plan.pdf')).toBe(false)
  })

  it('treats unresolved octet-stream drawings as CAD by extension', () => {
    expect(isCadNode({ type: 'file', mime: 'application/octet-stream', basename: 'plan.dwg' })).toBe(true)
    expect(isCadNode({ type: 'file', mime: 'application/octet-stream', basename: 'plan.txt' })).toBe(false)
  })

  it('never treats a folder as a CAD file', () => {
    expect(isCadNode({ type: 'folder', mime: 'httpd/unix-directory', basename: 'plan.dwg' })).toBe(false)
  })
})

describe('CAD Viewer file action', () => {
  const navigate = jest.fn()
  const action = createCadFileAction({ translate, iconSvgInline: '<svg />', navigate })

  beforeEach(() => navigate.mockReset())

  it('creates a default CAD file action', () => {
    expect(action.id).toBe('cad-viewer-open')
    expect(action.default).toBe(DefaultType.DEFAULT)
    expect(action.displayName({} as never)).toBe('Open with CAD Viewer')
  })

  it('is enabled only for a single CAD file', () => {
    expect(action.enabled?.({ nodes: [{ type: 'file', mime: 'application/dwg', basename: 'a.dwg' }] } as never)).toBe(true)
    expect(action.enabled?.({ nodes: [{ type: 'file', mime: 'image/vnd.dxf', basename: 'a.dxf' }] } as never)).toBe(true)
    expect(action.enabled?.({ nodes: [{ type: 'file', mime: 'application/pdf', basename: 'a.pdf' }] } as never)).toBe(false)
    expect(action.enabled?.({
      nodes: [
        { type: 'file', mime: 'application/dwg', basename: 'a.dwg' },
        { type: 'file', mime: 'application/dwg', basename: 'b.dwg' },
      ],
    } as never)).toBe(false)
  })

  it('is enabled for unresolved drawings by extension', () => {
    expect(action.enabled?.({
      nodes: [{ type: 'file', mime: 'application/octet-stream', basename: 'plan.dwg' }],
    } as never)).toBe(true)
    expect(action.enabled?.({
      nodes: [{ type: 'file', mime: 'application/octet-stream', basename: 'plan.dxf' }],
    } as never)).toBe(true)
    expect(action.enabled?.({
      nodes: [{ type: 'file', mime: 'application/octet-stream', basename: 'plan.txt' }],
    } as never)).toBe(false)
  })

  it('is disabled for a folder named like a drawing', () => {
    expect(action.enabled?.({
      nodes: [{ type: 'folder', mime: 'httpd/unix-directory', basename: 'plan.dwg' }],
    } as never)).toBe(false)
  })

  it('opens the app viewer for the file id', async () => {
    await action.exec({ nodes: [{ fileid: 42, mime: 'application/dwg', basename: 'a.dwg' }] } as never)
    expect(navigate).toHaveBeenCalledWith('/apps/cad_viewer/view?fileIds=42')
  })

  it('reports failure when the node has no file id', async () => {
    await expect(action.exec({ nodes: [{ mime: 'application/dwg', basename: 'a.dwg' }] } as never)).resolves.toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('builds an encoded viewer URL', () => {
    expect(buildViewerUrl('12 3')).toBe('/apps/cad_viewer/view?fileIds=12%203')
  })
})
