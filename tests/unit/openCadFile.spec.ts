import { openCadFile } from '../../src/utils/openCadFile'

describe('openCadFile', () => {
  it('opens the Viewer with the DAV path, never a bare file id', () => {
    const open = jest.fn()

    const handled = openCadFile({ id: 42, path: '/Documents/plan.dwg' }, { open })

    expect(handled).toBe(true)
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

    expect(() => openCadFile({ id: 42, path: '/plan.dwg' }, { open })).not.toThrow()
  })

  it('reports that the Viewer did not handle the request when unavailable', () => {
    expect(openCadFile({ id: 7, path: '/plan.dwg' }, undefined)).toBe(false)
  })
})
