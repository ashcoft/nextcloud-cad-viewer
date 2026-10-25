import { fetchCadFile } from '../../src/utils/fetchCadFile'
import axios from '@nextcloud/axios'

jest.mock('@nextcloud/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))

const mockedGet = axios.get as unknown as jest.Mock

describe('fetchCadFile', () => {
  beforeEach(() => {
    mockedGet.mockReset()
  })

  it('returns the metadata and a File built from the downloaded bytes', async () => {
    const meta = {
      id: 42,
      name: 'plan.dwg',
      size: 3,
      mimeType: 'application/dwg',
      path: '/plan.dwg',
      url: '/apps/cad_viewer/api/download/42',
      contentType: 'application/octet-stream',
    }
    const blob = new Blob([new Uint8Array([1, 2, 3])])

    mockedGet
      .mockResolvedValueOnce({ data: meta })
      .mockResolvedValueOnce({ data: blob })

    const result = await fetchCadFile(42)

    expect(mockedGet).toHaveBeenNthCalledWith(
      1,
      '/apps/cad_viewer/api/load/42',
    )
    expect(mockedGet).toHaveBeenNthCalledWith(
      2,
      '/apps/cad_viewer/api/download/42',
      { responseType: 'blob' },
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.meta).toBe(meta)
      expect(result.file).toBeInstanceOf(File)
      expect(result.file.name).toBe('plan.dwg')
      expect(result.file.type).toBe('application/dwg')
    }
  })

  it('surfaces the server error message from a failed response', async () => {
    mockedGet.mockRejectedValueOnce({
      response: { data: { error: 'File too large. Maximum supported size is 50MB.' } },
    })

    const result = await fetchCadFile(7)

    expect(result).toEqual({
      ok: false,
      error: 'File too large. Maximum supported size is 50MB.',
    })
  })

  it('falls back to a generic message when the error has no body', async () => {
    mockedGet.mockRejectedValueOnce(new Error('network down'))

    const result = await fetchCadFile(7)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Failed to load file content. Please try again.')
    }
  })
})
