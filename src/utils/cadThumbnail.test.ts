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
    expect(context2d.fillRect).toHaveBeenCalledWith(0, 0, 512, 256)
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


interface FakeDoc {
  fileName?: string
  isReusableUntitled?: boolean
}

type ActivatedListener = (args: { doc?: FakeDoc }) => void

/**
 * Builds a fake viewer whose documentActivated event the test can fire, so the
 * capture timing logic runs for real.
 */
function makeFakeManager(initialDoc: FakeDoc) {
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
    curDocument: initialDoc,
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
function activateDrawing(fake: ReturnType<typeof makeFakeManager>, doc: FakeDoc): void {
  fake.manager.curDocument = doc
  for (const listener of [...fake.listeners]) {
    listener({ doc })
  }
}

/** Wait until the capture has registered its activation listener. */
async function waitForListener(fake: ReturnType<typeof makeFakeManager>): Promise<void> {
  for (let i = 0; i < 50 && fake.listeners.length === 0; i++) {
    await Promise.resolve()
  }
  expect(fake.listeners.length).toBeGreaterThan(0)
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

  it('renders before reading the canvas, once the drawing is open', async () => {
    const fake = makeFakeManager({ fileName: 'plan.dwg', isReusableUntitled: false })
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const result = await capture({ fileName: 'plan.dwg' })

    expect(result).toBe(DATA_URL)
    // The buffer is not preserved, so the render must precede the read.
    const renderOrder = fake.render.mock.invocationCallOrder[0]
    const readOrder = (HTMLCanvasElement.prototype.toDataURL as jest.Mock).mock
      .invocationCallOrder[0]
    expect(renderOrder).toBeLessThan(readOrder)
  })

  it('waits for the requested drawing and ignores the placeholder', async () => {
    const fake = makeFakeManager({ isReusableUntitled: true })
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const pending = capture({ fileName: 'plan.dwg', timeoutMs: 500 })
    await waitForListener(fake)

    // The placeholder document must not trigger a capture.
    activateDrawing(fake, { isReusableUntitled: true })
    await Promise.resolve()
    expect(fake.render).not.toHaveBeenCalled()

    // A leftover drawing from an earlier viewer session must be ignored too.
    activateDrawing(fake, { fileName: 'other.dwg', isReusableUntitled: false })
    await Promise.resolve()
    expect(fake.render).not.toHaveBeenCalled()

    activateDrawing(fake, { fileName: 'plan.dwg', isReusableUntitled: false })

    expect(await pending).toBe(DATA_URL)
    expect(fake.render).toHaveBeenCalled()
  })

  it('returns null when a different drawing is already open', async () => {
    const fake = makeFakeManager({ fileName: 'other.dwg', isReusableUntitled: false })
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')

    expect(await capture({ fileName: 'plan.dwg', timeoutMs: 10 })).toBeNull()
    expect(fake.render).not.toHaveBeenCalled()
  })

  /**
   * Reopening the same file name (a changed drawing, or the same name in
   * another folder) must wait for the fresh activation rather than capturing
   * the document that is still active.
   */
  it('does not capture a leftover document with the same name', async () => {
    const leftover = { fileName: 'plan.dwg', isReusableUntitled: false }
    const fake = makeFakeManager(leftover)
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const pending = capture({
      fileName: 'plan.dwg',
      timeoutMs: 500,
      previousDocument: { ref: leftover, fileName: 'plan.dwg' },
    })
    await waitForListener(fake)

    // The stale document must not be captured.
    await Promise.resolve()
    expect(fake.render).not.toHaveBeenCalled()

    const fresh = { fileName: 'plan.dwg', isReusableUntitled: false }
    activateDrawing(fake, fresh)

    expect(await pending).toBe(DATA_URL)
    expect(fake.render).toHaveBeenCalled()
  })

  it('returns null when only the previous document is present', async () => {
    const leftover = { fileName: 'plan.dwg', isReusableUntitled: false }
    const fake = makeFakeManager(leftover)
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')

    expect(
      await capture({
        fileName: 'plan.dwg',
        timeoutMs: 10,
        previousDocument: { ref: leftover, fileName: 'plan.dwg' },
      }),
    ).toBeNull()
    expect(fake.render).not.toHaveBeenCalled()
  })

  /**
   * The viewer reuses its untitled start-up document for the first file,
   * mutating it in place, so that document must be accepted once it carries
   * the target name.
   */
  it('accepts a reused untitled document once it has the target name', async () => {
    const reused: FakeDoc = { isReusableUntitled: false }
    const fake = makeFakeManager(reused)
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const pending = capture({
      fileName: 'plan.dwg',
      timeoutMs: 500,
      previousDocument: { ref: reused, fileName: undefined },
    })
    await waitForListener(fake)

    // The same object, now carrying the target name.
    reused.fileName = 'plan.dwg'
    activateDrawing(fake, reused)

    expect(await pending).toBe(DATA_URL)
    expect(fake.render).toHaveBeenCalled()
  })

  /**
   * The viewer supports several documents; if another drawing becomes active
   * before the canvas is read, the image would be stored under the wrong file.
   */
  it('returns null when another drawing becomes active before the read', async () => {
    const fake = makeFakeManager({ fileName: 'plan.dwg', isReusableUntitled: false })
    mockDocManager(fake.manager)

    // Switch the active document while the idle wait is in flight.
    let resolveIdle: (value: boolean) => void = () => {}
    const idle: Promise<boolean> = new Promise((resolve) => {
      resolveIdle = resolve
    })
    fake.waitUntilIdle.mockReturnValue(idle)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const pending = capture({ fileName: 'plan.dwg' })

    // Wait until the capture is blocked on the idle wait.
    while (fake.waitUntilIdle.mock.calls.length === 0) {
      await Promise.resolve()
    }
    fake.manager.curDocument = { fileName: 'other.dwg', isReusableUntitled: false }
    resolveIdle(true)

    expect(await pending).toBeNull()
    expect(fake.render).not.toHaveBeenCalled()
  })

  it('returns null when the scene never becomes idle', async () => {
    const fake = makeFakeManager({ fileName: 'plan.dwg', isReusableUntitled: false })
    fake.waitUntilIdle.mockResolvedValue(false)
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')

    expect(await capture({ fileName: 'plan.dwg' })).toBeNull()
    expect(fake.render).not.toHaveBeenCalled()
  })

  it('returns null when the capture is aborted', async () => {
    const fake = makeFakeManager({ isReusableUntitled: true })
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')
    const controller = new AbortController()
    const pending = capture({ fileName: 'plan.dwg', timeoutMs: 500, signal: controller.signal })
    await waitForListener(fake)

    controller.abort()

    expect(await pending).toBeNull()
    expect(fake.render).not.toHaveBeenCalled()
  })

  it('returns null when no drawing opened before the timeout', async () => {
    const fake = makeFakeManager({ isReusableUntitled: true })
    mockDocManager(fake.manager)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')

    expect(await capture({ fileName: 'plan.dwg', timeoutMs: 10 })).toBeNull()
  })

  it('returns null when the viewer is not loaded', async () => {
    mockDocManager(undefined)

    const { captureCadThumbnail: capture } = await import('./cadThumbnail')

    expect(await capture({ fileName: 'plan.dwg' })).toBeNull()
  })
})
