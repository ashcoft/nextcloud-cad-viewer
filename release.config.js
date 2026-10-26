module.exports = {
  branches: ['main', 'stable'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        /*
         * Release policy: only feature work and breaking changes cut a release.
         *
         *   feat! / BREAKING CHANGE -> major
         *   feat                    -> minor
         *   everything else         -> no release
         *
         * Dependency bumps and maintenance commits (chore(deps), fix(deps),
         * chore(actions), docs, test, ci, refactor, perf, build) are kept out
         * of releases on purpose: they used to produce a patch release each,
         * which flooded the tags. Use `release: false` (not a missing rule) so
         * the commit-analyzer's default patch rules do not re-enable them.
         *
         * To cut patch releases for bug fixes again, change `fix` to
         * `release: 'patch'`.
         */
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: false },
          { type: 'perf', release: false },
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
