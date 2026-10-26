/// <reference types="jest" />
import { uploadCadThumbnail } from './thumbnailUpload'
import { captureCadThumbnail } from './cadThumbnail'
import axios from '@nextcloud/axios'

jest.mock('@nextcloud/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}))

jest.mock('./cadThumbnail', () => ({
  captureCadThumbnail: jest.fn(),
}))

const mockedPost = axios.post as unknown as jest.Mock
const mockedCapture = captureCadThumbnail as unknown as jest.Mock

describe('uploadCadThumbnail', () => {
  beforeEach(() => {
    mockedPost.mockReset()
    mockedCapture.mockReset()
  })

  it('posts the captured image and the rendered version', async () => {
    mockedCapture.mockResolvedValue('data:image/png;base64,AAAA')
    mockedPost.mockResolvedValue({ data: { status: 'ok' } })

    await uploadCadThumbnail(42, 'etag-a', { fileName: 'plan.dwg' })

    expect(mockedCapture).toHaveBeenCalledWith({
      fileName: 'plan.dwg',
      signal: undefined,
    })
    expect(mockedPost).toHaveBeenCalledWith(
      '/apps/cad_viewer/api/thumbnail/42',
      { image: 'data:image/png;base64,AAAA', etag: 'etag-a' },
      { signal: undefined },
    )
  })

  it('passes the abort signal through to the capture', async () => {
    mockedCapture.mockResolvedValue('data:image/png;base64,AAAA')
    mockedPost.mockResolvedValue({ data: { status: 'ok' } })
    const controller = new AbortController()

    await uploadCadThumbnail(42, 'etag-a', {
      fileName: 'plan.dwg',
      signal: controller.signal,
    })

    expect(mockedCapture).toHaveBeenCalledWith({
      fileName: 'plan.dwg',
      signal: controller.signal,
    })
    expect(mockedPost).toHaveBeenCalledWith(
      '/apps/cad_viewer/api/thumbnail/42',
      expect.anything(),
      { signal: controller.signal },
    )
  })

  it('does not upload when the capture is aborted before it finishes', async () => {
    const controller = new AbortController()
    mockedCapture.mockImplementation(async () => {
      controller.abort()
      return 'data:image/png;base64,AAAA'
    })

    await uploadCadThumbnail(42, 'etag-a', {
      fileName: 'plan.dwg',
      signal: controller.signal,
    })

    expect(mockedPost).not.toHaveBeenCalled()
  })

  it('does not upload when no drawing was captured', async () => {
    mockedCapture.mockResolvedValue(null)

    await uploadCadThumbnail(42, 'etag-a')

    expect(mockedPost).not.toHaveBeenCalled()
  })

  it('never rejects, even when the upload fails', async () => {
    mockedCapture.mockResolvedValue('data:image/png;base64,AAAA')
    mockedPost.mockRejectedValue(new Error('network down'))

    await expect(uploadCadThumbnail(42)).resolves.toBeUndefined()
  })

  it('sends an empty etag when the version is unknown', async () => {
    mockedCapture.mockResolvedValue('data:image/png;base64,AAAA')
    mockedPost.mockResolvedValue({ data: { status: 'ok' } })

    await uploadCadThumbnail('7')

    expect(mockedPost).toHaveBeenCalledWith(
      '/apps/cad_viewer/api/thumbnail/7',
      { image: 'data:image/png;base64,AAAA', etag: '' },
      { signal: undefined },
    )
  })
})
