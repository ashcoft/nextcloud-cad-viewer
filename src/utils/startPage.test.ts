/// <reference types="jest" />
/**
 * Tests for the start page request helpers.
 */
import axios from '@nextcloud/axios'
import { createBlankDrawing, requestErrorMessage } from './startPage'

const post = axios.post as jest.Mock

describe('createBlankDrawing', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('posts the requested name and returns the new file id', async () => {
    post.mockResolvedValue({ data: { fileId: 12 } })

    await expect(createBlankDrawing('Site plan')).resolves.toBe(12)

    expect(post).toHaveBeenCalledWith('/apps/cad_viewer/api/blank', { name: 'Site plan' })
  })

  it('fails when the response has no file id', async () => {
    post.mockResolvedValue({ data: {} })

    await expect(createBlankDrawing('Site plan')).rejects.toThrow('file id')
  })
})

describe('requestErrorMessage', () => {
  it('prefers the error message returned by Nextcloud', () => {
    const error = { response: { data: { error: 'No space left' } } }

    expect(requestErrorMessage(error, 'fallback')).toBe('No space left')
  })

  it.each([
    ['network error', undefined],
    ['empty message', { response: { data: { error: '' } } }],
    ['unexpected body', { response: { data: { error: 42 } } }],
  ])('falls back on %s', (_label, error) => {
    expect(requestErrorMessage(error, 'fallback')).toBe('fallback')
  })
})
