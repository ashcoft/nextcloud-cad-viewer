/// <reference types="jest" />
/**
 * Release policy: only feature work and breaking changes cut a release.
 *
 * Dependency bumps and maintenance commits used to trigger a patch release
 * each, which flooded the tags. This guards the policy in release.config.js
 * so it cannot silently regress.
 */
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
})
