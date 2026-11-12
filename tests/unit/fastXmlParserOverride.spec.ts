/// <reference types="jest" />
/**
 * fast-xml-parser <= 5.11.2 scans a stop node's body in O(n^2) when no closing
 * '>' follows (CWE-407, advisory #36). It reaches the app only transitively,
 * through @nextcloud/files -> webdav, so nothing in package.json holds the
 * patched version in place: drop the pnpm-workspace.yaml override and a lockfile
 * regeneration silently restores the vulnerable parser, with every other check
 * still green.
 *
 * The overrides for element-plus, vue and three each fell behind package.json
 * this way before they were caught by hand, so guard the floor in both files.
 * They are read as text, as the other config guards do.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const PATCHED = '5.12.0'

const workspaceSource = readFileSync(resolve(__dirname, '../../pnpm-workspace.yaml'), 'utf8')
const lockfileSource = readFileSync(resolve(__dirname, '../../pnpm-lock.yaml'), 'utf8')

/** Every `fast-xml-parser@<version>` key the lockfile resolves. */
const resolvedVersions = [...lockfileSource.matchAll(/^\s+fast-xml-parser@(\d+\.\d+\.\d+):/gm)].map(
  (match) => match[1],
)

/** Compares dot-separated numeric versions, ignoring any prerelease suffix. */
function atLeast(version: string, floor: string): boolean {
  const actual = version.split('-')[0].split('.').map(Number)
  const required = floor.split('-')[0].split('.').map(Number)
  for (let i = 0; i < 3; i += 1) {
    if ((actual[i] ?? 0) !== (required[i] ?? 0)) {
      return (actual[i] ?? 0) > (required[i] ?? 0)
    }
  }
  return true
}

describe('fast-xml-parser security override', () => {
  it('pins a floor at or above the patched version', () => {
    const match = workspaceSource.match(/^\s+'fast-xml-parser':\s*'([^']+)'/m)
    expect(match).not.toBeNull()
    const floor = match![1].replace(/^[\^~>=]+/, '')
    expect(atLeast(floor, PATCHED)).toBe(true)
  })

  it.each(resolvedVersions)('resolves %s at or above the patched version', (version) => {
    expect(atLeast(version, PATCHED)).toBe(true)
  })

  it('resolves at least one entry, so the assertions above are not vacuous', () => {
    expect(resolvedVersions.length).toBeGreaterThan(0)
  })
})
