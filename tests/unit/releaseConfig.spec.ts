/// <reference types="jest" />
/**
 * Release policy: only feature work and breaking changes cut a release.
 *
 * Dependency bumps and maintenance commits used to trigger a patch release
 * each, which flooded the tags. This guards the policy in release.config.js
 * so it cannot silently regress.
 */
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import releaseConfig from '../../release.config.js'

interface ReleaseRule {
  type?: string
  breaking?: boolean
  release: string | false
}

const analyzer = (releaseConfig.plugins ?? []).find(
  (plugin): plugin is [string, { releaseRules: ReleaseRule[] }] =>
    Array.isArray(plugin) && plugin[0] === '@semantic-release/commit-analyzer',
)

const rules: ReleaseRule[] = analyzer?.[1]?.releaseRules ?? []

function ruleFor(predicate: (rule: ReleaseRule) => boolean): ReleaseRule | undefined {
  return rules.find(predicate)
}

describe('release policy', () => {
  it('configures the commit-analyzer', () => {
    expect(analyzer).toBeDefined()
    expect(rules.length).toBeGreaterThan(0)
  })

  it('releases a major version for breaking changes', () => {
    expect(ruleFor((rule) => rule.breaking === true)?.release).toBe('major')
  })

  it('releases a minor version for features', () => {
    expect(ruleFor((rule) => rule.type === 'feat')?.release).toBe('minor')
  })

  it.each([
    'fix',
    'perf',
    'refactor',
    'docs',
    'style',
    'test',
    'build',
    'ci',
    'chore',
    'revert',
    'deps',
  ])('does not release for %s commits', (type) => {
    // `release: false` is required (a missing rule would fall back to the
    // commit-analyzer's default patch rules).
    expect(ruleFor((rule) => rule.type === type)?.release).toBe(false)
  })

  it('never maps a non-breaking commit to a patch release', () => {
    const patchRules = rules.filter((rule) => rule.release === 'patch')
    expect(patchRules).toEqual([])
  })

  it('suppresses git-style reverts before the default rules can apply', () => {
    // git writes `Revert "feat: ..."` with no conventional type, so it only
    // matches a `revert` rule. Without it the analyzer's default
    // `{ revert: true, release: 'patch' }` would cut a patch release.
    const revertRule = ruleFor((rule) => rule.revert === true)
    expect(revertRule?.release).toBe(false)
  })
})

describe('release policy (behaviour)', () => {
  // Run the real analyzer (via scripts/release-type.mjs, since it is ESM) so
  // the policy is checked by behaviour, not just by inspecting the config.
  function releaseType(message: string): string {
    return execFileSync('node', [resolve(__dirname, '../../scripts/release-type.mjs'), message], {
      encoding: 'utf8',
    }).trim()
  }

  it.each([
    ['feat: add layer panel', 'minor'],
    ['feat: new thing\n\nBREAKING CHANGE: removes X', 'major'],
    ['feat!: drop legacy API', 'major'],
  ])('releases %j as %s', (message, expected) => {
    expect(releaseType(message)).toBe(expected)
  })

  it.each([
    'fix: correct worker url',
    'fix(deps): bump @mlightcad/cad-viewer',
    'chore(deps): bump element-plus from 2.14.6 to 2.14.7',
    'chore(actions): bump pullfrog/pullfrog from 0.1.85 to 0.1.95',
    'docs: update README',
    'test: add unit tests',
    'ci: pin setup-php',
    'refactor: split loader',
    'perf: faster parse',
    'revert: undo a change',
    'Revert "feat: add layer panel"\n\nThis reverts commit abc123.',
  ])('does not release for %j', (message) => {
    expect(releaseType(message)).toBe('none')
  })
})
