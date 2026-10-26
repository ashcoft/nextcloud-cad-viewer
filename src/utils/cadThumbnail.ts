export interface CadThumbnailOptions {
  /** Maximum width/height of the captured image in pixels. */
  longSide?: number
  /** How long to wait for the drawing to finish opening and rendering. */
  timeoutMs?: number
}

/**
 * Minimal view of the CAD viewer's document manager used for capture.
 *
 * Declared structurally so this module does not depend on the viewer's
 * declaration files (which pull in `three`, whose types are not installed).
 */
interface CadViewLike {
  cadScene: unknown
  activeLayoutView: { render(scene: unknown): unknown }
  canvas: HTMLCanvasElement
  waitUntilIdle(timeoutMs?: number): Promise<boolean>
}

interface DocumentActivatedArgs {
  doc?: { isReusableUntitled?: boolean }
}

interface CadDocManagerLike {
  curView: CadViewLike
  curDocument: { isReusableUntitled?: boolean }
  events: {
    documentActivated: {
      addEventListener(listener: (args: DocumentActivatedArgs) => void): void
      removeEventListener(listener: (args: DocumentActivatedArgs) => void): void
    }
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

/**
 * Downscale a rendered canvas into a PNG data URL with a white backdrop.
 *
 * The WebGL buffer is transparent where nothing was drawn, so compositing on
 * white avoids a black-background thumbnail.
 *
 * The source must still hold its rendered frame when this is called; see
 * {@link captureCadThumbnail} for why.
 */
export function captureCanvasThumbnail(
  canvas: HTMLCanvasElement,
  longSide: number,
): string | null {
  const { width, height } = canvas
  if (!width || !height) {
    return null
  }

  const scale = longSide > 0 ? Math.min(1, longSide / Math.max(width, height)) : 1
  const outputWidth = Math.max(1, Math.round(width * scale))
  const outputHeight = Math.max(1, Math.round(height * scale))

  const output = document.createElement('canvas')
  output.width = outputWidth
  output.height = outputHeight

  const context = output.getContext('2d')
  if (!context) {
    return null
  }

  try {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, outputWidth, outputHeight)
    context.drawImage(canvas, 0, 0, outputWidth, outputHeight)
    return output.toDataURL('image/png')
  } catch {
    // Reading a tainted canvas (e.g. cross-origin xref images) throws.
    return null
  }
}

async function getDocManager(): Promise<CadDocManagerLike | null> {
  try {
    const module = await import(
      /* webpackChunkName: "cad-viewer-engine" */ '@mlightcad/cad-simple-viewer'
    )
    const manager = module.AcApDocManager as unknown as {
      tryGetInstance?: () => CadDocManagerLike | undefined
      instance?: CadDocManagerLike
    }
    return manager.tryGetInstance?.() ?? manager.instance ?? null
  } catch {
    return null
  }
}

/**
 * Wait until a real drawing (not the viewer's placeholder) has been activated.
 *
 * Resolves immediately when a drawing is already open, so a fast load is not
 * mistaken for "nothing happened". Falls back to the timeout when the event
 * never arrives, so the caller still attempts a capture.
 */
async function waitForDrawing(
  manager: CadDocManagerLike,
  timeoutMs: number,
): Promise<void> {
  if (manager.curDocument?.isReusableUntitled === false) {
    return
  }

  // Annotated rather than `new Promise<void>`: the Jest Babel config parses
  // `.ts` as TSX, where an explicit type argument on a `new` expression is
  // rejected.
  const activated: Promise<void> = new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      manager.events.documentActivated.removeEventListener(onActivated)
      resolve()
    }
    const onActivated = (args: DocumentActivatedArgs) => {
      // Ignore the placeholder document the viewer creates at start-up.
      if (args?.doc?.isReusableUntitled === false) {
        finish()
      }
    }

    const timer = setTimeout(finish, timeoutMs)
    manager.events.documentActivated.addEventListener(onActivated)
  })

  await activated
}

/**
 * Capture a thumbnail of the CAD drawing currently shown by the viewer.
 *
 * The viewer's WebGL context is created without `preserveDrawingBuffer`, so the
 * canvas is only readable within the same task that drew it. The layout is
 * therefore rendered explicitly and read back synchronously, mirroring how the
 * viewer's own PNG export works.
 *
 * Reuses the viewer's document manager (webpack dedupes
 * `@mlightcad/cad-simple-viewer` into a single instance) and returns null when
 * no drawing is available.
 */
export async function captureCadThumbnail(options: CadThumbnailOptions = {}): Promise<string | null> {
  const { longSide = 512, timeoutMs = 20000 } = options

  const manager = await getDocManager()
  if (!manager) {
    return null
  }

  await waitForDrawing(manager, timeoutMs)

  // No real drawing opened (still the start-up placeholder, e.g. because the
  // file failed to parse). Capturing now would upload a blank preview.
  if (manager.curDocument?.isReusableUntitled !== false) {
    return null
  }

  const view = manager.curView
  if (!view) {
    return null
  }

  try {
    await view.waitUntilIdle?.(timeoutMs)
  } catch {
    // Best effort: fall through and capture whatever is on screen.
  }

  await nextFrame()

  try {
    // Re-draw so the buffer holds a complete frame, then read it back before
    // yielding to the browser (which would discard the un-preserved buffer).
    view.activeLayoutView.render(view.cadScene)
    return captureCanvasThumbnail(view.canvas, longSide)
  } catch {
    return null
  }
}
