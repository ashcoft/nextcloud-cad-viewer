/// <reference types="jest" />
/**
 * Release policy: features, release-worthy fixes and bug fixes cut a release.
 *
 * Dependency bumps and maintenance commits used to trigger a patch release
 * each, which flooded the tags. Bug fixes are released as patches, so a fix
 * that lands on its own still reaches users. This guards the policy in
 * release.config.js so it cannot silently regress.
 */
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import releaseConfig from '../../release.config.js'

interface ReleaseRule {
  type?: string
  scope?: string | null
  breaking?: boolean
  revert?: boolean
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

  it.each(['feat', 'perf'])('releases a minor version for %s', (type) => {
    expect(ruleFor((rule) => rule.type === type)?.release).toBe('minor')
  })

  it('releases a minor version for fix(deps)', () => {
    const rule = ruleFor((r) => r.type === 'fix' && r.scope === 'deps')
    expect(rule?.release).toBe('minor')
  })

  it.each([
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

  it('releases a patch for a plain fix and for any non-deps scope', () => {
    // The rules are scope-narrowed so that fix(deps) can stay a minor release:
    // `false` outranks other release types, so a plain `{ type: 'fix',
    // release: false }` would suppress fix(deps) too.
    expect(ruleFor((rule) => rule.type === 'fix' && rule.scope === null)?.release).toBe('patch')
    expect(ruleFor((rule) => rule.type === 'fix' && rule.scope === '!(deps)')?.release).toBe('patch')
    // An unscoped catch-all is not needed: the two rules above cover it.
    expect(ruleFor((rule) => rule.type === 'fix' && rule.scope === undefined)).toBeUndefined()
  })

  it('only maps fix commits to a patch release', () => {
    // A patch release is reserved for fixes; nothing else may produce one.
    const patchRules = rules.filter((rule) => rule.release === 'patch')
    expect(patchRules.length).toBeGreaterThan(0)
    for (const rule of patchRules) {
      expect(rule.type).toBe('fix')
    }
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
    ['perf: faster parse', 'minor'],
    ['fix(deps): bump @mlightcad/data-viewer', 'minor'],
    ['fix: correct worker url', 'patch'],
    ['fix(ui): scoped bug fix', 'patch'],
    ['feat: new thing\n\nBREAKING CHANGE: removes X', 'major'],
    ['feat!: drop legacy API', 'major'],
  ])('releases %j as %s', (message, expected) => {
    expect(releaseType(message)).toBe(expected)
  })

  it.each([
    'chore(deps): bump element-plus from 2.14.6 to 2.14.7',
    'chore(actions): bump pullfrog/pullfrog from 0.1.85 to 0.1.95',
    'docs: update README',
    'test: add unit tests',
    'ci: pin setup-php',
    'refactor: split loader',
    'revert: undo a change',
    'Revert "feat: add layer panel"\n\nThis reverts commit abc123.',
  ])('does not release for %j', (message) => {
    expect(releaseType(message)).toBe('none')
  })
})
