import { captureCanvasThumbnail } from './cadThumbnail'

const DATA_URL = 'data:image/png;base64,AAAA'

describe('captureCanvasThumbnail', () => {
  const context2d = {
    fillStyle: '',
    fillRect: jest.fn(),
    drawImage: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // jsdom ships no 2D canvas implementation.
    HTMLCanvasElement.prototype.getContext = jest.fn(
      () => context2d,
    ) as unknown as HTMLCanvasElement['getContext']
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
    const result = captureCanvasThumbnail(makeCanvas(2000, 1000), 512)

    expect(result).toBe(DATA_URL)
    expect(context2d.fillStyle).toBe('#ffffff')
    expect(context2d.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 512, 256)
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png')
  })

  it('keeps the source size when it already fits', () => {
    captureCanvasThumbnail(makeCanvas(300, 200), 512)

    expect(context2d.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 300, 200)
  })

  it('returns null when reading the canvas throws (tainted canvas)', () => {
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => {
      throw new Error('tainted')
    })

    expect(captureCanvasThumbnail(makeCanvas(800, 600), 512)).toBeNull()
  })
})

type ActivatedListener = (args: { doc?: { isReusableUntitled?: boolean } }) => void

/**
 * Builds a fake viewer whose documentActivated event can be fired by the test,
 * so the capture timing logic runs for real.
 */
function makeFakeManager(options: { reusableUntitled?: boolean } = {}) {
  const listeners: ActivatedListener[] = []
  const render = jest.fn()
  const waitUntilIdle = jest.fn().mockResolvedValue(true)

  const view = {
    cadScene: {},
    activeLayoutView: { render },
    canvas: Object.assign(document.createElement('canvas'), { width: 400, height: 300 }),
    waitUntilIdle,
  }

  const manager = {
    curView: view,
    curDocument: { isReusableUntitled: options.reusableUntitled ?? false },
    events: {
      documentActivated: {
        addEventListener: (fn: ActivatedListener) => listeners.push(fn),
        removeEventListener: (fn: ActivatedListener) => {
          const index = listeners.indexOf(fn)
          if (index >= 0) {
            listeners.splice(index, 1)
          }
        },
      },
    },
  }

  return { manager, view, render, waitUntilIdle, listeners }
}

/**
 * Simulates the viewer activating a document: the manager's current document
 * changes, then the event fires.
 */
function activateDrawing(
  fake: ReturnType<typeof makeFakeManager>,
  reusableUntitled: boolean,
): void {
  fake.manager.curDocument = { isReusableUntitled: reusableUntitled }
  for (const listener of [...fake.listeners]) {
    listener({ doc: { isReusableUntitled: reusableUntitled } })
  }
}

function mockDocManager(manager: unknown) {
  jest.doMock('@mlightcad/cad-simple-viewer', () => ({
    AcApDocManager: { tryGetInstance: () => manager },
  }))
}

describe('captureCadThumbnail', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      fillStyle: '',
      fillRect: jest.fn(),
      drawImage: jest.fn(),
    })) as unknown as HTMLCanvasElement['getContext']
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => DATA_URL)
    // requestAnimationFrame is not implemented in jsdom.
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0)
      return 0
    }) as typeof globalThis.requestAnimationFrame
  })

  afterEach(() => {
    jest.dontMock('@mlightcad/cad-simple-viewer')
  })

  it('renders and captures once a drawing is open', async () => {
    const { manager, render } = makeFakeManager({ reusableUntitled: false })
    mockDocManager(manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const result = await capture()

    expect(result).toBe(DATA_URL)
    expect(render).toHaveBeenCalled()
  })

  it('waits for a real drawing before capturing, and skips the placeholder', async () => {
    const fake = makeFakeManager({ reusableUntitled: true })
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const pending = capture({ timeoutMs: 100 })

    // The placeholder document must not trigger a capture.
    await Promise.resolve()
    expect(fake.render).not.toHaveBeenCalled()

    activateDrawing(fake, true)
    await Promise.resolve()
    expect(fake.render).not.toHaveBeenCalled()

    activateDrawing(fake, false)

    expect(await pending).toBe(DATA_URL)
    expect(fake.render).toHaveBeenCalled()
  })

  it('returns null when no drawing opened before the timeout', async () => {
    const { manager } = makeFakeManager({ reusableUntitled: true })
    mockDocManager(manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')

    expect(await capture({ timeoutMs: 10 })).toBeNull()
  })

  it('returns null when the viewer is not loaded', async () => {
    mockDocManager(undefined)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')

    expect(await capture()).toBeNull()
  })
})
