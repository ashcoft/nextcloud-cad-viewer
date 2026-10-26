#!/usr/bin/env node
/**
 * Reports the release type the configured commit-analyzer would pick for a
 * commit message.
 *
 * Used by tests/unit/releaseConfig.spec.ts to verify the release policy by
 * behaviour (the analyzer is ESM, so it cannot be imported from a Jest CJS
 * test directly). Prints "major", "minor", "patch" or "none".
 *
 * Usage: node scripts/release-type.mjs "<commit message>"
 */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const releaseConfig = require('../release.config.js')

// `@semantic-release/commit-analyzer` is a dependency of semantic-release, not
// a direct dependency, so resolve it from semantic-release's own tree. Anchor
// on the package entry point (always resolvable) rather than its
// package.json, which is not a guaranteed exported subpath.
const semanticReleaseRequire = createRequire(require.resolve('semantic-release'))
const { analyzeCommits } = await import(semanticReleaseRequire.resolve('@semantic-release/commit-analyzer'))

const analyzer = releaseConfig.plugins.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === '@semantic-release/commit-analyzer',
)

const message = process.argv[2] ?? ''
const result = await analyzeCommits(analyzer[1], {
  commits: [{ message, hash: 'x'.repeat(40) }],
  cwd: process.cwd(),
  logger: { log() {} },
})

console.log(result ?? 'none')
