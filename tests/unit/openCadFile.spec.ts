import { openCadFile } from '../../src/utils/openCadFile'

describe('openCadFile', () => {
  it('opens the Viewer with the DAV path, never a bare file id', () => {
    const open = jest.fn()

    const fallback = openCadFile({ id: 42, path: '/Documents/plan.dwg' }, { open }, undefined)

    expect(fallback).toBeNull()
    expect(open).toHaveBeenCalledTimes(1)
    expect(open).toHaveBeenCalledWith({ path: '/Documents/plan.dwg' })
  })

  it('does not throw the "needs either an URL or path" error', () => {
    // Regression for the reported bug: the Viewer throws when opened with a
    // file id only. Ensure a path is always provided.
    const open = jest.fn((options: { path?: string }) => {
      if (!options.path) {
        throw new Error('Viewer needs either an URL or path to open. None given')
      }
    })

    expect(() => openCadFile({ id: 42, path: '/plan.dwg' }, { open }, undefined)).not.toThrow()
  })

  it('falls back to the standalone app route when the Viewer is unavailable', () => {
    const generateUrl = jest.fn((path: string) => path)

    const fallback = openCadFile({ id: 7, path: '/plan.dwg' }, undefined, { generateUrl })

    expect(fallback).toBe('/apps/cad_viewer/view?fileIds=7')
    expect(generateUrl).toHaveBeenCalledWith('/apps/cad_viewer/view')
  })

  it('returns null when neither the Viewer nor a file id is available', () => {
    const fallback = openCadFile({ path: '/plan.dwg' }, undefined, { generateUrl: (p) => p })

    expect(fallback).toBeNull()
  })
})
