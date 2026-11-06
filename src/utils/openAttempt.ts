/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

/**
 * Guards against a reload loop when opening a drawing kills the page.
 *
 * Opening a large drawing needs a WebAssembly parse plus a WebGL canvas. On a
 * phone that can exhaust the tab's memory budget, and the mobile browser then
 * discards the page and reloads it. The reload immediately opens the same
 * drawing again and crashes again, so the user is stuck on a refresh loop.
 *
 * The app cannot stop the browser from reloading a page it decided to kill, but
 * it can notice that a previous attempt for the same file never finished and
 * refuse to start another one. The caller then shows a message and a Retry
 * button instead, which turns an endless loop into one recoverable step.
 *
 * The marker must outlive the crash and must not outlive a normal visit:
 *
 * - It is written before the load starts and refreshed once the file is in hand
 *   but before the viewer parses it, because a slow download would otherwise
 *   let it expire before the phase that actually crashes.
 * - It is cleared once the viewer reports the drawing open, or once the load
 *   fails in a way the viewer already reported.
 * - It is deliberately **not** cleared while the drawing is still being parsed
 *   and drawn: that is exactly the window in which the tab can be killed, and a
 *   renderer killed for running out of memory never runs an unload handler.
 * - `pagehide` clears it for an ordinary reload or navigation, except when the
 *   page is going into the back-forward cache and may be resumed.
 */

const STORAGE_KEY = 'cad_viewer:pending-open'

/** `window.name` fallback, for contexts that deny sessionStorage. */
const NAME_PREFIX = 'cadViewerOpenAttempt='

/**
 * The window name, or null when there is no window (a worker, a test runner).
 *
 * Declared through a narrow cast because `globalThis.name` is not part of the
 * shared DOM/ES lib types.
 */
function windowName(): { get(): string; set(value: string): void } | null {
  const target = globalThis as { name?: unknown }
  if (typeof target.name !== 'string') {
    return null
  }

  return {
    get: () => target.name as string,
    set: (value: string) => {
      target.name = value
    },
  }
}

/**
 * How long a marker stays meaningful.
 *
 * A crashed reload happens within seconds, so an older marker belongs to an
 * attempt the user simply navigated away from and must not block a new open.
 * The marker is refreshed before the memory-heavy phase, so this only has to
 * cover the parse and render, not the download.
 */
const ATTEMPT_WINDOW_MS = 60_000

/**
 * Read the marker, preferring sessionStorage.
 *
 * Storage can be denied (private mode, blocked storage, an embedded context).
 * `window.name` survives a reload in the same tab and needs no storage API, so
 * it keeps the guard working where sessionStorage throws.
 */
function readMarker(): string | null {
  try {
    const value = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    if (value !== null && value !== undefined) {
      return value
    }
  } catch {
    // Fall through to window.name.
  }

  return readNameToken()
}

/** Write the marker, or remove it when `value` is null. */
function writeMarker(value: string | null): void {
  try {
    const storage = globalThis.sessionStorage
    if (value === null) {
      storage?.removeItem(STORAGE_KEY)
    } else {
      storage?.setItem(STORAGE_KEY, value)
    }
  } catch {
    // Fall through to window.name.
  }

  writeNameToken(value)
}

function readNameToken(): string | null {
  const target = windowName()
  if (target === null) {
    return null
  }

  for (const part of target.get().split('\n')) {
    if (part.startsWith(NAME_PREFIX)) {
      return part.slice(NAME_PREFIX.length)
    }
  }

  return null
}

function writeNameToken(value: string | null): void {
  const target = windowName()
  if (target === null) {
    return
  }

  const parts = target
    .get()
    .split('\n')
    .filter((part: string) => part !== '' && !part.startsWith(NAME_PREFIX))
  if (value !== null) {
    parts.push(NAME_PREFIX + value)
  }
  target.set(parts.join('\n'))
}

function fileIdOf(value: unknown): string | null {
  const id = (value as { fileId?: unknown } | null)?.fileId
  return typeof id === 'string' && id !== '' ? id : null
}

/**
 * Record that an attempt to open `fileId` is in progress.
 *
 * Call this immediately before loading the file, and again once the file is in
 * hand but before the viewer parses and draws it. The second call restarts the
 * window, so a slow download cannot let the marker expire before the phase that
 * actually crashes.
 */
export function markOpenAttempt(fileId: string | number): void {
  const id = String(fileId)
  if (id === '') {
    return
  }

  writeMarker(JSON.stringify({ fileId: id, at: Date.now() }))
}

/**
 * Drop the marker once the attempt has finished: the drawing opened, or the
 * viewer reported an error the user can see.
 */
export function clearOpenAttempt(): void {
  writeMarker(null)
}

/**
 * Whether an earlier attempt to open `fileId` started and never completed.
 *
 * True only for the same file and only within {@link ATTEMPT_WINDOW_MS}, so a
 * stale marker or one written for a different drawing does not block the open.
 * A marker dated in the future (a clock change, or a tampered value) is treated
 * as invalid rather than as an attempt that never expires.
 */
export function hasUnfinishedOpenAttempt(fileId: string | number): boolean {
  const id = String(fileId)
  if (id === '') {
    return false
  }

  const raw = readMarker()
  if (raw === null) {
    return false
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return false
  }

  if (fileIdOf(parsed) !== id) {
    return false
  }

  const at = (parsed as { at?: unknown }).at
  if (typeof at !== 'number') {
    return false
  }

  const age = Date.now() - at
  return Number.isFinite(age) && age >= 0 && age <= ATTEMPT_WINDOW_MS
}

let cleanupInstalled = false

/**
 * Clear the marker whenever the page is left normally.
 *
 * A user reload or navigation fires `pagehide`, so refreshing the page while a
 * drawing is loading does not look like a crash. A renderer killed for running
 * out of memory does not run unload handlers, which is exactly why the marker
 * survives the reload in the case the guard is meant to catch.
 *
 * A page entering the back-forward cache (`persisted`) may be restored and
 * carry on loading, so the marker is removed for the cached copy and written
 * again when that page is resumed. Keeping it in place would make a later open
 * of the same file look like a crash the user never had.
 *
 * Safe to call more than once; the listener is registered only once.
 */
export function installOpenAttemptCleanup(): void {
  if (cleanupInstalled) {
    return
  }
  cleanupInstalled = true

  let cachedMarker: string | null = null

  try {
    globalThis.addEventListener?.('pagehide', (event) => {
      cachedMarker = readMarker()
      clearOpenAttempt()

      if (!(event as PageTransitionEvent).persisted) {
        cachedMarker = null
      }
    })

    globalThis.addEventListener?.('pageshow', (event) => {
      if ((event as PageTransitionEvent).persisted && cachedMarker !== null) {
        writeMarker(cachedMarker)
      }
      cachedMarker = null
    })
  } catch {
    // No event target available; the guard simply keeps its default behaviour.
  }
}

/**
 * Keep an active attempt from expiring while it is still running.
 *
 * A parse and render can take longer than {@link ATTEMPT_WINDOW_MS} on a slow
 * phone. Without this the marker would age out mid-load, and an out-of-memory
 * kill after that point would reload straight into another automatic open —
 * exactly the heavy drawings the guard exists for.
 *
 * Returns a function that stops the heartbeat.
 */
export function startOpenAttemptHeartbeat(
  fileId: string | number,
  intervalMs = 20_000,
): () => void {
  const id = String(fileId)
  const timer = globalThis.setInterval?.(() => markOpenAttempt(id), intervalMs)

  return () => {
    if (timer !== undefined) {
      globalThis.clearInterval?.(timer)
    }
  }
}
