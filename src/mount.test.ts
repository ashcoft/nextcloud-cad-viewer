/// <reference types="jest" />
/**
 * Tests for parsing the recent drawing list the PHP template embeds.
 */
import { readRecentDrawings } from './mount'
import type { RecentDrawing } from './types/recentDrawing'

const drawings: RecentDrawing[] = [
  {
    id: 7,
    name: 'plan.dwg',
    path: '/Projects/plan.dwg',
    extension: 'dwg',
    mtime: 1_700_000_000,
    hasPreview: true,
  },
  {
    id: 8,
    name: 'section.dxf',
    path: '/section.dxf',
    extension: 'dxf',
    mtime: 1_700_000_100,
    hasPreview: false,
  },
]

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
