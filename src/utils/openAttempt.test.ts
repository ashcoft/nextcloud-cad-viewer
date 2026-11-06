/// <reference types="jest" />
/**
 * Tests for the reload-loop guard.
 *
 * The guard is what turns an endless refresh loop into a single recoverable
 * step, so the properties that matter are that it only fires for the same file
 * within its window, that it survives where sessionStorage is denied, and that
 * it is cleared by a normal exit but not by a crash.
 */
import {
  clearOpenAttempt,
  hasUnfinishedOpenAttempt,
  installOpenAttemptCleanup,
  markOpenAttempt,
} from './openAttempt'

const KEY = 'cad_viewer:pending-open'

function pagehide(persisted = false): void {
  const event = new Event('pagehide') as Event & { persisted?: boolean }
  Object.defineProperty(event, 'persisted', { value: persisted })
  window.dispatchEvent(event)
}

describe('open attempt guard', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.name = ''
  })

  it('reports an unfinished attempt for the file that was marked', () => {
    markOpenAttempt(42)

    expect(hasUnfinishedOpenAttempt(42)).toBe(true)
    expect(hasUnfinishedOpenAttempt('42')).toBe(true)
  })

  it('does not report an attempt for a different file', () => {
    markOpenAttempt(42)

    expect(hasUnfinishedOpenAttempt(43)).toBe(false)
  })

  it('stops reporting once the attempt is cleared', () => {
    markOpenAttempt(42)
    clearOpenAttempt()

    expect(hasUnfinishedOpenAttempt(42)).toBe(false)
  })

  it('ignores an empty file id', () => {
    markOpenAttempt('')

    expect(window.sessionStorage.getItem(KEY)).toBeNull()
    expect(hasUnfinishedOpenAttempt('')).toBe(false)
  })

  it('ignores a stale attempt from an earlier visit', () => {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ fileId: '42', at: Date.now() - 10 * 60 * 1000 }),
    )

    expect(hasUnfinishedOpenAttempt(42)).toBe(false)
  })

  it('ignores a marker dated in the future', () => {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ fileId: '42', at: Date.now() + 10 * 60 * 1000 }),
    )

    expect(hasUnfinishedOpenAttempt(42)).toBe(false)
  })

  it('ignores a malformed or unexpected marker', () => {
    window.sessionStorage.setItem(KEY, '{not json')
    expect(hasUnfinishedOpenAttempt(42)).toBe(false)

    window.sessionStorage.setItem(KEY, JSON.stringify({ fileId: 42 }))
    expect(hasUnfinishedOpenAttempt(42)).toBe(false)

    window.sessionStorage.setItem(KEY, JSON.stringify({ fileId: '42', at: 'now' }))
    expect(hasUnfinishedOpenAttempt(42)).toBe(false)
  })

  /**
   * Storage can be denied (private mode, blocked storage, an embedded context).
   * `window.name` survives a reload in the same tab, so the guard must keep
   * working there instead of silently disappearing.
   */
  it('falls back to window.name when sessionStorage is denied', () => {
    const storage = window.sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('denied')
      },
    })

    try {
      markOpenAttempt(42)

      expect(hasUnfinishedOpenAttempt(42)).toBe(true)

      clearOpenAttempt()
      expect(hasUnfinishedOpenAttempt(42)).toBe(false)
    } finally {
      Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        value: storage,
      })
    }
  })

  /**
   * A normal reload or navigation fires `pagehide`, so refreshing while a
   * drawing loads must not be mistaken for a crash. A renderer killed for
   * running out of memory never fires it, which is why the marker survives in
   * the case the guard exists for.
   */
  it('clears the marker when the page is left normally', () => {
    installOpenAttemptCleanup()
    markOpenAttempt(42)

    pagehide(false)

    expect(hasUnfinishedOpenAttempt(42)).toBe(false)
  })

  /**
   * A page going into the back-forward cache may be restored and carry on
   * loading, so its marker must survive that transition.
   */
  it('keeps the marker when the page enters the back-forward cache', () => {
    installOpenAttemptCleanup()
    markOpenAttempt(42)

    pagehide(true)

    expect(hasUnfinishedOpenAttempt(42)).toBe(true)
  })
})
