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

/**
 * The value of `key` in a YAML/JSON-ish text block: the first line that starts
 * with the quoted key, split on the colon. Avoids building regexes from
 * interpolated values.
 */
function valueFor(source: string, key: string): string {
  const prefix = `'${key}':`
  const quoted = `"${key}":`
  const line = source
    .split('\n')
    .map((candidate) => candidate.trim())
    .find((candidate) => candidate.startsWith(prefix) || candidate.startsWith(quoted))

  expect(line).toBeDefined()
  const [, rawValue = ''] = line!.split(':')
  return rawValue.trim().replace(/^["']|["',]+$/g, '').replace(/^[\^~>=]+/, '')
}

/** The exact version package.json pins for `name`. */
function manifestVersion(name: string): string {
  return valueFor(manifestSource, name)
}

/** The version the pnpm-workspace.yaml override pins for `name`. */
function overrideVersion(name: string): string {
  return valueFor(workspaceSource, name)
}

/**
 * Every version the lockfile resolves for `name`, taken from the
 * two-space-indented package keys. Keys look like
 * `  '@mlightcad/data-model@1.15.30':` or, when the package has peers,
 * `  '@mlightcad/libredwg-converter@3.15.30(@mlightcad/data-model@1.15.30)':`.
 * Only the version right after the package name is wanted, so the rest of the
 * key (including any peer suffix) is discarded.
 */
function resolvedVersions(name: string): string[] {
  const marker = `${name}@`
  return lockfileSource
    .split('\n')
    .filter((line) => line.startsWith(`  ${name}@`) || line.startsWith(`  '${name}@`))
    .map((line) => line.slice(line.indexOf(marker) + marker.length))
    .map((rest) => rest.split(/[(,:'\s]/)[0])
    .filter(Boolean)
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
