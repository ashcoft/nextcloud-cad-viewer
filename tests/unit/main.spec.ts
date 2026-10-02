import { DefaultType } from '@nextcloud/files'
import { createCadFileAction, isSupportedCadMime, SUPPORTED_MIMES } from '../../src/fileActions'

describe('CAD Viewer file action behavior', () => {
  const mockViewerOpen = jest.fn()
  const cadAction = createCadFileAction({
    translate: (_app: string, text: string) => text,
    openFile: mockViewerOpen,
    iconSvgInline: '<svg />',
  })

  beforeEach(() => {
    mockViewerOpen.mockReset()
  })

  it('creates a default CAD file action', () => {
    expect(cadAction.id).toBe('cad-viewer-open')
    expect(cadAction.default).toBe(DefaultType.DEFAULT)
  })

  it('tracks the supported DWG and DXF MIME types', () => {
    expect(SUPPORTED_MIMES).toContain('application/dwg')
    expect(SUPPORTED_MIMES).toContain('image/vnd.dxf')
    expect(SUPPORTED_MIMES).toHaveLength(10)
    expect(isSupportedCadMime('application/dwg')).toBe(true)
    expect(isSupportedCadMime('application/pdf')).toBe(false)
  })

  it('limits the action to supported single CAD files', () => {
    expect(cadAction.enabled({ nodes: [{ mime: 'application/dwg' }] })).toBe(true)
    expect(cadAction.enabled({ nodes: [{ mime: 'image/vnd.dxf' }] })).toBe(true)
    expect(cadAction.enabled({ nodes: [{ mime: 'application/pdf' }] })).toBe(false)
    expect(cadAction.enabled({ nodes: [{ mime: 'application/dwg' }, { mime: 'application/dwg' }] })).toBe(false)
  })

  it('passes the selected file path to the viewer opener', async () => {
    await cadAction.exec({ nodes: [{ id: 42, path: '/Documents/plan.dwg', mime: 'application/dwg' }] })

    expect(mockViewerOpen).toHaveBeenCalledWith({ id: 42, path: '/Documents/plan.dwg' })
  })

  it('passes the file id along for the standalone fallback', async () => {
    await cadAction.exec({ nodes: [{ id: '12345', path: '/plan.dxf', mime: 'image/vnd.dxf' }] })

    expect(mockViewerOpen).toHaveBeenCalledWith({ id: '12345', path: '/plan.dxf' })
  })

  it('ignores CAD actions without a path', async () => {
    await cadAction.exec({ nodes: [{ id: 42, mime: 'application/dwg' }] })

    expect(mockViewerOpen).not.toHaveBeenCalled()
  })
})
