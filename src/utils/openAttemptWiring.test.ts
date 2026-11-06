/// <reference types="jest" />
/**
 * Structural checks on how `App.vue` drives the reload-loop guard.
 *
 * `App.vue` cannot be mounted here: `@vue/vue3-jest` has no Jest 30 release, so
 * an SFC import is parsed as ESM and rejected. The component is therefore read
 * as text, the same way `viewerOptions.test.ts` and `assetController.spec.ts`
 * check their call sites.
 *
 * The guard is keyed by file id, so the heartbeat must be given the id. Passing
 * the file name instead makes every later check miss and silently disables the
 * guard for exactly the slow loads the heartbeat exists to protect.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const source = readFileSync(resolve(__dirname, '../App.vue'), 'utf8')

describe('App.vue guard wiring', () => {
  it('starts the heartbeat with the file id, not the file name', () => {
    const calls = source.match(/startOpenAttemptHeartbeat\([^)]*\)/g) ?? []

    expect(calls.length).toBeGreaterThan(0)
    for (const call of calls) {
      expect(call).toBe('startOpenAttemptHeartbeat(fileId)')
    }
  })

  it('clears the marker only through the opened-drawing helper', () => {
    // A bare clearOpenAttempt() in the load path would drop the marker before
    // the parse and render, which is the bug the guard exists to avoid. It is
    // expected only in the guard's own short-circuits, retry setup and unmount.
    const clears = source.match(/clearOpenAttempt\(\)/g) ?? []

    expect(clears.length).toBeGreaterThan(0)
    expect(source).toMatch(/if \(opened && !controller\.signal\.aborted\) \{\s*clearOpenAttempt\(\)/)
  })
})
