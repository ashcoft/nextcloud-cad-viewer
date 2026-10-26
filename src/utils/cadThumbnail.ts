export interface CadThumbnailOptions {
  /** Maximum width/height of the captured image in pixels. */
  longSide?: number
  /** How long to wait for the drawing to finish rendering. */
  timeoutMs?: number
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

/**
 * Downscale a rendered canvas into a PNG data URL with a white backdrop.
 *
 * The WebGL buffer is transparent, so compositing on white avoids the
 * black-background thumbnail that a bare canvas read would produce.
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

/**
 * Capture a thumbnail of the CAD drawing currently shown by the viewer.
 *
 * Reuses the viewer's own document manager (webpack dedupes
 * `@mlightcad/cad-simple-viewer` into a single instance), waits for the scene
 * to become idle and grabs the WebGL canvas. Returns null when no drawing is
 * available.
 */
export async function captureCadThumbnail(options: CadThumbnailOptions = {}): Promise<string | null> {
  const { longSide = 512, timeoutMs = 15000 } = options

  let docManager: { curView?: { waitUntilIdle?: (timeout?: number) => Promise<boolean>; canvas?: HTMLCanvasElement } } | undefined
  try {
    const { AcApDocManager } = await import(
      /* webpackChunkName: "cad-viewer-engine" */ '@mlightcad/cad-simple-viewer'
    )
    docManager = AcApDocManager.instance
  } catch {
    return null
  }

  const view = docManager?.curView
  if (!view) {
    return null
  }

  try {
    await view.waitUntilIdle?.(timeoutMs)
  } catch {
    // Best effort: fall through and capture whatever is on screen.
  }

  await nextFrame()

  const canvas = view.canvas
  if (!canvas) {
    return null
  }

  return captureCanvasThumbnail(canvas, longSide)
}
