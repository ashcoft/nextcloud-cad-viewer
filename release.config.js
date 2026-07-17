module.exports = {
  branches: ['main', 'stable'],
  plugins: [
    '@semantic-release/commit-analyzer',
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
        assets: [
          { path: 'build/artifacts/cad_viewer.tar.gz', label: 'Nextcloud App (tar.gz)' },
          { path: 'build/artifacts/cad_viewer.zip', label: 'Nextcloud App (zip)' },
        ],
      },
    ],
  ],
};
