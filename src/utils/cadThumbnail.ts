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
   * The document that was active before this drawing was opened, as returned
   * by {@link getCurrentCadDocument}.
   *
   * The viewer keeps one document manager for the whole page, so the document
   * from a previous session can still be active when this runs.
   */
  previousDocument?: PreviousCadDocument
}

/**
 * Snapshot of the document that was active before a drawing was opened.
 *
 * The object identity alone is not enough: the viewer reuses its untitled
 * start-up document for the first file, mutating it in place. `fileName` is
 * therefore recorded as it was at snapshot time, so a document that already
 * carried the target name can be told apart from one that was reused.
 */
export interface PreviousCadDocument {
  ref: unknown
  fileName?: string
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
 * and a drawing left over from a previous session.
 *
 * When the caller reports the document that was active before this load, that
 * object is rejected only while it still carries the name it had then. The
 * viewer reuses its untitled document for the first file (mutating it in
 * place), so once it has been given the target name it is the drawing we want;
 * a document that already had the target name before the load is the leftover
 * one and must keep waiting.
 *
 * The `isReusableUntitled` flag is only consulted when present, so the check
 * keeps working on viewer versions that do not expose it.
 */
function isTargetDocument(
  doc: CadDocumentLike | undefined,
  fileName?: string,
  previousDocument?: PreviousCadDocument,
): boolean {
  if (!doc || doc.isReusableUntitled === true) {
    return false
  }
  if (
    previousDocument !== undefined
    && doc === previousDocument.ref
    && doc.fileName === previousDocument.fileName
  ) {
    // Unchanged since the snapshot: still the previous document.
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
 * Snapshot the document currently active in the viewer, if any.
 *
 * Call this before opening a drawing and pass the result as
 * {@link CadThumbnailOptions.previousDocument}, so a document left over from an
 * earlier session cannot be mistaken for the drawing being opened now. The
 * document's name is captured alongside it, because the viewer reuses its
 * untitled document in place for the first file.
 */
export async function getCurrentCadDocument(): Promise<PreviousCadDocument | undefined> {
  const manager = await getDocManager()
  const doc = manager?.curDocument
  if (!doc) {
    return undefined
  }

  return { ref: doc, fileName: doc.fileName }
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
  previousDocument?: PreviousCadDocument,
): Promise<CadDocumentLike | null> {
  if (isTargetDocument(manager.curDocument, fileName, previousDocument)) {
    return manager.curDocument ?? null
  }
  if (signal?.aborted) {
    return null
  }

  // Annotated rather than `new Promise<CadDocumentLike | null>`: the Jest Babel
  // config parses `.ts` as TSX, where an explicit type argument on a `new`
  // expression is rejected.
  const activated: Promise<CadDocumentLike | null> = new Promise((resolve) => {
    let settled = false
    const finish = (doc: CadDocumentLike | null) => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      manager.events.documentActivated.removeEventListener(onActivated)
      resolve(doc)
    }
    const onActivated = (args: DocumentActivatedArgs) => {
      if (isTargetDocument(args?.doc, fileName, previousDocument)) {
        finish(args.doc ?? null)
      }
    }
    const onAbort = () => finish(null)

    const timer = setTimeout(() => finish(null), timeoutMs)
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

  const matched = await waitForDrawing(manager, fileName, timeoutMs, signal, previousDocument)
  if (matched === null) {
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

  // The viewer supports several documents and switches the active one when
  // another drawing opens, so the canvas must still belong to the drawing that
  // was matched; otherwise the image would be stored under the wrong file.
  if (manager.curDocument !== matched) {
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
