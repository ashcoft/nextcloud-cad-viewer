/// <reference types="jest" />
/**
 * Tests for the reload-loop guard.
 *
 * The guard is what turns an endless refresh loop into a single recoverable
 * step, so the two properties that matter are that it only fires for the same
 * file and only for a recent attempt.
 */
import {
  clearOpenAttempt,
  hasUnfinishedOpenAttempt,
  installOpenAttemptCleanup,
  markOpenAttempt,
} from './openAttempt'

const KEY = 'cad_viewer:pending-open'

describe('open attempt guard', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
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

  it('ignores a malformed or unexpected marker', () => {
    window.sessionStorage.setItem(KEY, '{not json')
    expect(hasUnfinishedOpenAttempt(42)).toBe(false)

    window.sessionStorage.setItem(KEY, JSON.stringify({ fileId: 42 }))
    expect(hasUnfinishedOpenAttempt(42)).toBe(false)

    window.sessionStorage.setItem(KEY, JSON.stringify({ fileId: '42', at: 'now' }))
    expect(hasUnfinishedOpenAttempt(42)).toBe(false)
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

    window.dispatchEvent(new Event('pagehide'))

    expect(hasUnfinishedOpenAttempt(42)).toBe(false)
  })
})
