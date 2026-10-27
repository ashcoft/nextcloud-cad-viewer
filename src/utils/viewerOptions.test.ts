/// <reference types="jest" />
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
