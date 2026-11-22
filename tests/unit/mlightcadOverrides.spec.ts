/// <reference types="jest" />
/**
 * The mlightcad packages are held by overrides in pnpm-workspace.yaml, and an
 * override wins over the package.json range. So a Dependabot bump of
 * `@mlightcad/libredwg-converter` changes the manifest but leaves the lockfile
 * resolving the old version: the update silently does nothing, with every other
 * check still green.
 *
 * That is what happened in #1691 and #1722 — package.json said 3.15.30 while the
 * lockfile still resolved 3.15.21, so the bump never took effect.
 *
 * Guard both directions: the override must name the version the manifest asks
 * for, and the lockfile must actually resolve it. Read as text, as the other
 * config guards do.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const workspaceSource = readFileSync(resolve(__dirname, '../../pnpm-workspace.yaml'), 'utf8')
const manifestSource = readFileSync(resolve(__dirname, '../../package.json'), 'utf8')
const lockfileSource = readFileSync(resolve(__dirname, '../../pnpm-lock.yaml'), 'utf8')

const PACKAGES = ['@mlightcad/data-model', '@mlightcad/libredwg-converter'] as const

/** The exact version package.json pins for `name`. */
function manifestVersion(name: string): string {
  const match = manifestSource.match(new RegExp(`"${name}":\\s*"([^"]+)"`))
  expect(match).not.toBeNull()
  return match![1].replace(/^[\^~>=]+/, '')
}

/** The version the pnpm-workspace.yaml override pins for `name`. */
function overrideVersion(name: string): string {
  const match = workspaceSource.match(new RegExp(`'${name}':\\s*'([^']+)'`))
  expect(match).not.toBeNull()
  return match![1].replace(/^[\^~>=]+/, '')
}

/** Every `<name>@<version>` key the lockfile resolves. */
function resolvedVersions(name: string): string[] {
  const escaped = name.replace(/[/@]/g, (c) => `\\${c}`)
  return [...lockfileSource.matchAll(new RegExp(`^\\s+'?${escaped}@(\\d+\\.\\d+\\.\\d+)`, 'gm'))].map(
    (match) => match[1],
  )
}

describe.each(PACKAGES)('%s override', (name) => {
  it('pins the version package.json asks for', () => {
    expect(overrideVersion(name)).toBe(manifestVersion(name))
  })

  it('resolves the version package.json asks for', () => {
    const versions = resolvedVersions(name)
    expect(versions.length).toBeGreaterThan(0)
    expect(new Set(versions)).toEqual(new Set([manifestVersion(name)]))
  })
})
