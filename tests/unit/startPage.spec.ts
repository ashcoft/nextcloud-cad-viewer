/// <reference types="jest" />
/**
 * Tests for the CAD Viewer start page helpers.
 *
 * The Vue component itself is not mounted here: the repo's Babel 8 install is
 * not compatible with @vue/vue3-jest's synchronous template transform. All
 * behaviour that can fail (request shape, error handling, parsing the embedded
 * recent list) lives in plain modules and is covered below.
 */
import axios from '@nextcloud/axios'
import { readRecentDrawings } from '../../src/mount'
import { createBlankDrawing, requestErrorMessage } from '../../src/utils/startPage'
import type { RecentDrawing } from '../../src/types/recentDrawing'

const drawings: RecentDrawing[] = [
  {
    id: 7,
    name: 'plan.dwg',
    path: '/Projects/plan.dwg',
    extension: 'dwg',
    mtime: 1_700_000_000,
  },
  {
    id: 8,
    name: 'section.dxf',
    path: '/section.dxf',
    extension: 'dxf',
    mtime: 1_700_000_100,
  },
]

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

describe('readRecentDrawings', () => {
  it('reads valid entries from the container dataset', () => {
    const container = document.createElement('div')
    container.dataset.recentDrawings = JSON.stringify(drawings)

    expect(readRecentDrawings(container)).toEqual(drawings)
  })

  it('ignores malformed JSON and invalid entries', () => {
    const container = document.createElement('div')
    container.dataset.recentDrawings = '{not json'
    expect(readRecentDrawings(container)).toEqual([])

    container.dataset.recentDrawings = JSON.stringify([{ id: 1 }, drawings[0]])
    expect(readRecentDrawings(container)).toEqual([drawings[0]])
  })

  it('returns an empty list when the attribute is missing', () => {
    expect(readRecentDrawings(document.createElement('div'))).toEqual([])
  })
})
