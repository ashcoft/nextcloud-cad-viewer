module.exports = {
  branches: ['main', 'stable'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        /*
         * Release policy: only features and release-worthy fixes cut a release.
         *
         *   feat! / BREAKING CHANGE  -> major
         *   feat                     -> minor
         *   perf                     -> minor
         *   fix(deps)                -> minor
         *   fix                      -> no release
         *   everything else          -> no release
         *
         * Dependency bumps and maintenance commits (chore(deps),
         * chore(actions), docs, test, ci, refactor) are kept out of releases on
         * purpose: they used to produce a patch release each, which flooded the
         * tags.
         *
         * Two subtleties, both verified against the real commit-analyzer:
         *
         * 1. Use `release: false` (not a missing rule). The analyzer falls back
         *    to its built-in patch rules when no custom rule matches, so
         *    omitting a type would re-enable it.
         * 2. `false` outranks any other type in compareReleaseTypes, so a plain
         *    `{ type: 'fix', release: false }` would also suppress
         *    `fix(deps)`. The fix rules are therefore scope-narrowed: `deps` is
         *    release-worthy (minor), and both an unscoped fix and any other
         *    scope are excluded explicitly.
         */
        releaseRules: [
          { breaking: true, release: 'major' },
          // git-style reverts ("Revert \"feat: ...\"") have no conventional
          // type, so they only match on `revert`. Without this rule the
          // analyzer falls back to its default revert -> patch rule.
          { revert: true, release: false },
          { type: 'feat', release: 'minor' },
          { type: 'perf', release: 'minor' },
          { type: 'fix', scope: 'deps', release: 'minor' },
          { type: 'fix', scope: null, release: false },
          { type: 'fix', scope: '!(deps)', release: false },
          { type: 'refactor', release: false },
          { type: 'docs', release: false },
          { type: 'style', release: false },
          { type: 'test', release: false },
          { type: 'build', release: false },
          { type: 'ci', release: false },
          { type: 'chore', release: false },
          { type: 'revert', release: false },
          { type: 'deps', release: false },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'make bump-version VERSION=${nextRelease.version}',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'appinfo/info.xml', 'package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: null,
        // Create the release as a draft; the build job publishes it after the
        // app archives are attached, so a release never goes public empty.
        draftRelease: true,
      },
    ],
  ],
};
