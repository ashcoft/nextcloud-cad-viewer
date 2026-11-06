/// <reference types="jest" />
/**
 * The viewer must be mounted with the main-thread render mode by default.
 *
 * The worker render mode keeps a second copy of the drawing geometry, which
 * roughly doubles peak memory for a DWG. On a phone that was enough for the
 * browser to discard the tab, reload it, reopen the same drawing and crash
 * again — the refresh loop this guards against.
 *
 * These assertions read the props actually handed to the viewer component
 * rather than the source text, so moving the default or overriding the value
 * when the props are built fails the test instead of passing unnoticed.
 */
import { loadCADViewer } from './cadLoader'

const mockCreateApp = jest.fn()
const mockUse = jest.fn()

jest.mock('vue', () => ({
  createApp: (...args: unknown[]) => mockCreateApp(...args),
}))

jest.mock('@mlightcad/cad-viewer', () => ({
  i18n: {},
  MlCadViewer: { name: 'MlCadViewer' },
}))

jest.mock('@mlightcad/data-model', () => ({
  AcDbDatabaseConverterManager: { instance: { register: jest.fn() } },
  AcDbFileType: { DWG: 'DWG' },
}))

jest.mock('@mlightcad/libredwg-converter', () => ({
  AcDbLibreDwgConverter: class {},
}))

describe('loadCADViewer render mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateApp.mockReturnValue({
      use: mockUse,
      mount: jest.fn(),
      unmount: jest.fn(),
    })
  })

  /** Props the loader passed as the second argument to createApp. */
  function mountedProps(): Record<string, unknown> {
    const calls = mockCreateApp.mock.calls
    const call = calls[calls.length - 1] as unknown[] | undefined
    return (call?.[1] ?? {}) as Record<string, unknown>
  }

  it('mounts the viewer on the main thread by default', async () => {
    await loadCADViewer(document.createElement('div'), { localFile: new File([], 'a.dwg') })

    expect(mountedProps().useMainThreadDraw).toBe(true)
  })

  it('honours an explicit worker-mode request', async () => {
    await loadCADViewer(document.createElement('div'), {
      localFile: new File([], 'a.dwg'),
      useMainThreadDraw: false,
    })

    expect(mountedProps().useMainThreadDraw).toBe(false)
  })
})
