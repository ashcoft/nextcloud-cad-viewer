import { captureCanvasThumbnail } from '../../src/utils/cadThumbnail'

const DATA_URL = 'data:image/png;base64,AAAA'
const context2d = {
  fillStyle: '',
  fillRect: jest.fn(),
  drawImage: jest.fn(),
}

describe('captureCanvasThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // jsdom ships no 2D canvas implementation.
    HTMLCanvasElement.prototype.getContext = jest.fn(() => context2d) as unknown as HTMLCanvasElement['getContext']
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => DATA_URL)
  })

  function makeCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

  it('returns null for a zero-sized canvas', () => {
    expect(captureCanvasThumbnail(makeCanvas(0, 0), 512)).toBeNull()
  })

  it('composites on a white backdrop and encodes PNG', () => {
    const canvas = makeCanvas(2000, 1000)
    const result = captureCanvasThumbnail(canvas, 512)

    expect(result).toBe(DATA_URL)
    expect(context2d.fillStyle).toBe('#ffffff')
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png')
  })

  it('returns null when reading the canvas throws (tainted canvas)', () => {
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => {
      throw new Error('tainted')
    })

    expect(captureCanvasThumbnail(makeCanvas(800, 600), 512)).toBeNull()
  })
})

