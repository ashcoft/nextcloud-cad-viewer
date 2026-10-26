export interface CadThumbnailOptions {
  /** Maximum width/height of the captured image in pixels. */
  longSide?: number
  /** How long to wait for the drawing to finish opening and rendering. */
  timeoutMs?: number
  /**
   * File name of the drawing being opened.
   *
   * The viewer keeps one document manager for the whole page, so a drawing from
   * a previous viewer session can still be active when this runs. Only an
   * activation whose document carries this name is captured.
   */
  fileName?: string
  /** Aborts the capture, e.g. when the viewer unmounts. */
  signal?: AbortSignal
  /**
   * Document that was active before this drawing was opened.
   *
   * The viewer keeps one document manager for the whole page, so the document
   * from a previous session can still be active when this runs. A document that
   * is this very object is the old one, even if it has the same file name.
   */
  previousDocument?: unknown
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

interface CadDocumentLike {
  fileName?: string
  isReusableUntitled?: boolean
}

interface DocumentActivatedArgs {
  doc?: CadDocumentLike
}

interface CadDocManagerLike {
  curView: CadViewLike
  curDocument?: CadDocumentLike
  events: {
    documentActivated: {
      addEventListener(listener: (args: DocumentActivatedArgs) => void): void
      removeEventListener(listener: (args: DocumentActivatedArgs) => void): void
    }
  }
}

/**
 * Whether a document is the drawing we are waiting for.
 *
 * Matching on the file name rejects the viewer's untitled start-up placeholder
 * and a drawing left over from a previous session. When the caller reports the
 * document that was active before this load, that exact object is also rejected:
 * reopening the same file name (a changed drawing, or the same name in another
 * folder) must still wait for the fresh activation.
 *
 * The `isReusableUntitled` flag is only consulted when present, so the check
 * keeps working on viewer versions that do not expose it.
 */
function isTargetDocument(
  doc: CadDocumentLike | undefined,
  fileName?: string,
  previousDocument?: unknown,
): boolean {
  if (!doc || doc.isReusableUntitled === true) {
    return false
  }
  if (previousDocument !== undefined && doc === previousDocument) {
    return false
  }
  if (fileName !== undefined && fileName !== '') {
    return doc.fileName === fileName
  }
  return typeof doc.fileName === 'string' && doc.fileName !== ''
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
 * The document currently active in the viewer, if any.
 *
 * Call this before opening a drawing and pass the result as
 * {@link CadThumbnailOptions.previousDocument}, so a document left over from an
 * earlier session cannot be mistaken for the drawing being opened now.
 */
export async function getCurrentCadDocument(): Promise<unknown> {
  const manager = await getDocManager()

  return manager?.curDocument
}

/**
 * Wait until the requested drawing has been activated.
 *
 * Resolves `true` once a `documentActivated` event carries the target drawing.
 * The event must arrive after this call, so a document left over from an
 * earlier viewer session is never mistaken for the new one. Resolves `false`
 * when the timeout elapses or the capture is aborted.
 */
async function waitForDrawing(
  manager: CadDocManagerLike,
  fileName: string | undefined,
  timeoutMs: number,
  signal?: AbortSignal,
  previousDocument?: unknown,
): Promise<boolean> {
  if (isTargetDocument(manager.curDocument, fileName, previousDocument)) {
    return true
  }
  if (signal?.aborted) {
    return false
  }

  // Annotated rather than `new Promise<boolean>`: the Jest Babel config parses
  // `.ts` as TSX, where an explicit type argument on a `new` expression is
  // rejected.
  const activated: Promise<boolean> = new Promise((resolve) => {
    let settled = false
    const finish = (matched: boolean) => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      manager.events.documentActivated.removeEventListener(onActivated)
      resolve(matched)
    }
    const onActivated = (args: DocumentActivatedArgs) => {
      if (isTargetDocument(args?.doc, fileName, previousDocument)) {
        finish(true)
      }
    }
    const onAbort = () => finish(false)

    const timer = setTimeout(() => finish(false), timeoutMs)
    signal?.addEventListener('abort', onAbort, { once: true })
    manager.events.documentActivated.addEventListener(onActivated)
  })

  return activated
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
 * the requested drawing never becomes ready.
 */
export async function captureCadThumbnail(options: CadThumbnailOptions = {}): Promise<string | null> {
  const { longSide = 512, timeoutMs = 20000, fileName, signal, previousDocument } = options

  const manager = await getDocManager()
  if (!manager) {
    return null
  }

  if (!(await waitForDrawing(manager, fileName, timeoutMs, signal, previousDocument))) {
    return null
  }
  if (signal?.aborted) {
    return null
  }

  const view = manager.curView
  if (!view) {
    return null
  }

  let idle: boolean | undefined
  try {
    idle = await view.waitUntilIdle?.(timeoutMs)
  } catch {
    idle = false
  }

  // A partial render must not be cached under the drawing's etag, or every
  // later preview request would keep serving an unfinished image.
  if (idle === false) {
    return null
  }
  if (signal?.aborted) {
    return null
  }

  await nextFrame()

  if (signal?.aborted) {
    return null
  }

  try {
    // Re-draw so the buffer holds a complete frame, then read it back before
    // yielding to the browser (which would discard the un-preserved buffer).
    view.activeLayoutView.render(view.cadScene)
    return captureCanvasThumbnail(view.canvas, longSide)
  } catch {
    return null
  }
}
