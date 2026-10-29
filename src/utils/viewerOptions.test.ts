/// <reference types="jest" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { viewerOptionsFor } from './viewerOptions'
import type { LoadResponse } from '../types/loadResponse'

function meta(overrides: Partial<LoadResponse> = {}): LoadResponse {
  return {
    id: 1,
    name: 'plan.dxf',
    size: 10,
    mimeType: 'image/vnd.dxf',
    path: '/plan.dxf',
    directory: '/',
    etag: 'v1',
    canSave: true,
    url: '/apps/cad_viewer/api/download/1',
    theme: 'light',
    contentType: 'application/octet-stream',
    ...overrides,
  }
}

describe('viewerOptionsFor', () => {
  it('forwards the administrator theme to the viewer', () => {
    expect(viewerOptionsFor(meta({ theme: 'light' }), new File([], 'a.dxf')).theme).toBe('light')
    expect(viewerOptionsFor(meta({ theme: 'dark' }), new File([], 'a.dxf')).theme).toBe('dark')
  })

  it('passes the file and its name through', () => {
    const file = new File(['x'], 'plan.dxf')
    const options = viewerOptionsFor(meta({ name: 'plan.dxf' }), file)

    expect(options.localFile).toBe(file)
    expect(options.fileName).toBe('plan.dxf')
  })
})

/**
 * App.vue mounts the viewer twice: on the first load and on retry. Both call
 * sites must build their options through this helper, otherwise one of them
 * silently keeps a hardcoded theme again — the bug this helper exists to fix.
 *
 * The SFC is read as text because it cannot be imported here: @vue/vue3-jest
 * has no Jest 30 release, so the module would be parsed as ESM and rejected.
 * The same pattern is used by webpackAssets.spec.ts and assetController.spec.ts.
 */
describe('App.vue viewer mounting', () => {
  const source = readFileSync(resolve(__dirname, '../App.vue'), 'utf8')

  it('mounts the viewer exactly twice', () => {
    expect(source.match(/loadCADViewer\(/g)).toHaveLength(2)
  })

  it('builds the options for every mount through viewerOptionsFor', () => {
    const mounts = source.match(/loadCADViewer\([\s\S]*?\}\)/g) ?? []

    expect(mounts).toHaveLength(2)
    for (const mount of mounts) {
      expect(mount).toContain('...viewerOptionsFor(result.meta, result.file)')
    }
  })

  it('does not hardcode a viewer theme', () => {
    expect(source).not.toMatch(/theme:\s*'(?:light|dark)'/)
  })
})
