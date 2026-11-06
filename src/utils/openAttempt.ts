/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

/**
 * Guards against a reload loop when opening a drawing kills the page.
 *
 * Opening a large DWG needs a WebAssembly parse plus a WebGL canvas. On a phone
 * that can exhaust the tab's memory budget, and the mobile browser then
 * discards the page and reloads it. The reload immediately opens the same
 * drawing again and crashes again, so the user is stuck on a refresh loop.
 *
 * The app cannot stop the browser from reloading a page it decided to kill, but
 * it can notice that a previous attempt for the same file never finished and
 * refuse to start another one. The caller then shows a message and a Retry
 * button instead, which turns an endless loop into one recoverable step.
 *
 * A marker in `sessionStorage` survives the reload but not a new tab, which is
 * exactly the lifetime needed: it must outlive the crash, yet must not block a
 * fresh visit.
 */

const STORAGE_KEY = 'cad_viewer:pending-open'

/**
 * How long a marker stays meaningful.
 *
 * A crashed reload happens within seconds, so an older marker belongs to an
 * attempt the user simply navigated away from and must not block a new open.
 */
const ATTEMPT_WINDOW_MS = 60_000

/** sessionStorage access can throw (private mode, blocked storage). */
function storage(): Storage | null {
  try {
    return globalThis.sessionStorage ?? null
  } catch {
    return null
  }
}

function fileIdOf(value: unknown): string | null {
  const id = (value as { fileId?: unknown } | null)?.fileId
  return typeof id === 'string' && id !== '' ? id : null
}

/**
 * Record that an attempt to open `fileId` is in progress.
 *
 * Call this immediately before loading the file. A page reload caused by the
 * load then leaves the marker behind for {@link hasUnfinishedOpenAttempt}.
 */
export function markOpenAttempt(fileId: string | number): void {
  const id = String(fileId)
  if (id === '') {
    return
  }

  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify({ fileId: id, at: Date.now() }))
  } catch {
    // Without storage the guard degrades to "no guard"; never break the open.
  }
}

/**
 * Drop the marker once the attempt has finished, successfully or with an error
 * the viewer already rendered. Only an attempt that never returns leaves it.
 */
export function clearOpenAttempt(): void {
  try {
    storage()?.removeItem(STORAGE_KEY)
  } catch {
    // Ignore: nothing to clean up if storage is unavailable.
  }
}

/**
 * Whether an earlier attempt to open `fileId` started and never completed.
 *
 * True only for the same file and only within {@link ATTEMPT_WINDOW_MS}, so a
 * stale marker or one written for a different drawing does not block the open.
 */
export function hasUnfinishedOpenAttempt(fileId: string | number): boolean {
  const id = String(fileId)
  if (id === '') {
    return false
  }

  let raw: string | null
  try {
    raw = storage()?.getItem(STORAGE_KEY) ?? null
  } catch {
    return false
  }

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

  return Date.now() - at <= ATTEMPT_WINDOW_MS
}

let cleanupInstalled = false

/**
 * Clear the marker whenever the page is left normally.
 *
 * `pagehide` fires for a user reload or navigation, so refreshing the page while
 * a drawing is still loading does not look like a crash. A renderer killed for
 * running out of memory does not run unload handlers, which is exactly why the
 * marker survives the reload in the case the guard is meant to catch.
 *
 * Safe to call more than once; the listener is registered only once.
 */
export function installOpenAttemptCleanup(): void {
  if (cleanupInstalled) {
    return
  }
  cleanupInstalled = true

  try {
    globalThis.addEventListener?.('pagehide', clearOpenAttempt)
  } catch {
    // No event target available; the guard simply keeps its default behaviour.
  }
}
