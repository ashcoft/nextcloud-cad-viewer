/// <reference types="jest" />
import { saveCadFile, serializeCadDrawing } from './saveCadFile'

jest.mock('@nextcloud/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}))

const DXF = '0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n'

function mockDocManager(manager: unknown) {
  jest.doMock('@mlightcad/cad-simple-viewer', () => ({
    AcApDocManager: { tryGetInstance: () => manager },
  }))
}

/**
 * A document manager whose current document has the given name.
 *
 * Pass `null` for a document with no name (the viewer's start-up placeholder);
 * an explicit `undefined` would fall back to the default parameter.
 */
function managerWithDatabase(dxfOut: () => unknown, fileName: string | null = 'plan.dxf') {
  return {
    curDocument: {
      ...(fileName === null ? {} : { fileName }),
      database: { dxfOut },
    },
  }
}

describe('serializeCadDrawing', () => {
  afterEach(() => {
    jest.dontMock('@mlightcad/cad-simple-viewer')
    jest.resetModules()
  })

  it('returns the ASCII DXF produced by the viewer', async () => {
    mockDocManager(managerWithDatabase(() => DXF))

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize()).toBe(DXF)
  })

  it('serialises the requested drawing', async () => {
    mockDocManager(managerWithDatabase(() => DXF, 'plan.dxf'))

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize('plan.dxf')).toBe(DXF)
  })

  /**
   * The viewer keeps one document manager for the page, so a save must not
   * serialise the start-up placeholder or a leftover drawing.
   */
  it('refuses to serialise a different drawing than requested', async () => {
    mockDocManager(managerWithDatabase(() => DXF, 'other.dwg'))

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize('plan.dxf')).toBeNull()
  })

  it('refuses to serialise the untitled start-up document', async () => {
    mockDocManager(managerWithDatabase(() => DXF, null))

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize('plan.dxf')).toBeNull()
  })

  it('returns null when no drawing is open', async () => {
    mockDocManager(undefined)

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize()).toBeNull()
  })

  it('returns null when the viewer is not loaded', async () => {
    jest.doMock('@mlightcad/cad-simple-viewer', () => {
      throw new Error('not installed')
    })

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize()).toBeNull()
  })

  it('returns null when the database cannot serialise', async () => {
    mockDocManager(
      managerWithDatabase(() => {
        throw new Error('unsupported entity')
      }),
    )

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize()).toBeNull()
  })

  it('ignores binary output', async () => {
    mockDocManager(managerWithDatabase(() => new Uint8Array([1, 2, 3])))

    const { serializeCadDrawing: serialize } = await import('./saveCadFile')

    expect(await serialize()).toBeNull()
  })
})

describe('saveCadFile', () => {
  afterEach(() => {
    jest.dontMock('@mlightcad/cad-simple-viewer')
  })

  /**
   * Resetting the module registry gives the freshly imported module a new
   * axios mock, so the post spy must be taken from that same instance.
   */
  async function loadSave() {
    jest.resetModules()
    const axiosMock = (await import('@nextcloud/axios')).default as unknown as {
      post: jest.Mock
    }
    const { saveCadFile: save } = await import('./saveCadFile')

    return { save, post: axiosMock.post }
  }

  it('posts the serialised drawing with the loaded version', async () => {
    mockDocManager(managerWithDatabase(() => DXF, 'plan.dxf'))
    const { save, post } = await loadSave()
    post.mockResolvedValue({ data: { etag: 'etag-b' } })

    const result = await save(42, 'etag-a', 'plan.dxf')

    expect(post).toHaveBeenCalledWith('/apps/cad_viewer/api/save/42', {
      content: DXF,
      etag: 'etag-a',
    })
    expect(result).toEqual({ ok: true, etag: 'etag-b' })
  })

  it('reports the server error on a rejected save', async () => {
    mockDocManager(managerWithDatabase(() => DXF, 'plan.dxf'))
    const { save, post } = await loadSave()
    post.mockRejectedValue({
      response: { data: { error: 'The file was changed by someone else.' } },
    })

    const result = await save(42, 'etag-a')

    expect(result.ok).toBe(false)
    expect(result.error).toBe('The file was changed by someone else.')
  })

  it('does not post when a different drawing is open', async () => {
    mockDocManager(managerWithDatabase(() => DXF, 'other.dwg'))
    const { save, post } = await loadSave()

    const result = await save(42, 'etag-a', 'plan.dxf')

    expect(result.ok).toBe(false)
    expect(post).not.toHaveBeenCalled()
  })

  it('does not post when the drawing cannot be serialised', async () => {
    mockDocManager(undefined)
    const { save, post } = await loadSave()

    const result = await save(42, 'etag-a')

    expect(result.ok).toBe(false)
    expect(post).not.toHaveBeenCalled()
  })

  it('reads an error carried in a JSON string body', async () => {
    mockDocManager(managerWithDatabase(() => DXF, 'plan.dxf'))
    const { save, post } = await loadSave()
    post.mockRejectedValue({
      response: { data: JSON.stringify({ error: 'Previews are disabled' }) },
    })

    const result = await save(42, 'etag-a')

    expect(result.error).toBe('Previews are disabled')
  })
})

describe('saveCadFile (module export)', () => {
  it('exposes both helpers', () => {
    expect(typeof saveCadFile).toBe('function')
    expect(typeof serializeCadDrawing).toBe('function')
  })
})
