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

    await uploadCadThumbnail(42, 'etag-a')

    expect(mockedPost).toHaveBeenCalledWith(
      '/apps/cad_viewer/api/thumbnail/42',
      { image: 'data:image/png;base64,AAAA', etag: 'etag-a' },
    )
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
    )
  })
})
