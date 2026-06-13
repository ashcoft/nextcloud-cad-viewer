## [0.0.15] - 2026-06-06

## 0.0.16

### Patch Changes

- [`4e475b4`](https://github.com/ashcoft/nextcloud-cad-viewer/commit/4e475b4956d9a119e482e36ccd35ec8a02d5a09b) Thanks [@openhands-agent](https://github.com/openhands-agent)! - Release pending dependency updates from Dependabot:
  - chore(deps): bump @types/node from 25.9.2 to 25.9.3
  - chore(deps): bump the vue-dependencies group with 2 updates
  - chore(actions): bump shivammathur/setup-php from 2.37.1 to 2.37.2
  - chore(actions): bump codecov/codecov-action from 6.0.1 to 7.0.0
  - chore(deps): bump @mlightcad/data-model from 1.8.3 to 1.8.4
  - chore(deps): bump stylelint from 17.12.0 to 17.13.0
  - chore(deps): bump @mlightcad/data-model from 1.8.1 to 1.8.3
  - chore(deps): bump typescript-eslint from 8.60.1 to 8.61.0
  - chore(deps): bump @types/node from 25.9.1 to 25.9.2
  - chore(deps): bump vue-tsc in the vue-dependencies group

### What's Changed

- fix: handle cancelled state in psalm-matrix workflow summary ([9422347a](https://github.com/ashcoft/nextcloud-cad-viewer/commit/9422347afa031cfdb2f7fb87a083beacd142f64f)) by @openhands
- Delete node_modules directory ([102131fb](https://github.com/ashcoft/nextcloud-cad-viewer/commit/102131fbdb37613ed9da9d3353a197e17e70902f)) by @Dony Wibowo
- fix: exclude node_modules from REUSE compliance check ([b44c105e](https://github.com/ashcoft/nextcloud-cad-viewer/commit/b44c105e45177fb7b46770b77ba08fd0e345aa84)) by @openhands
- feat: add changeset version and release scripts ([4e827de5](https://github.com/ashcoft/nextcloud-cad-viewer/commit/4e827de5acb208147e653736995d8669729f0169)) by @openhands
- chore(deps): bump vue-i18n in the vue-dependencies group (#373) ([c8ce6b65](https://github.com/ashcoft/nextcloud-cad-viewer/commit/c8ce6b6578398a4b55a815fd4b6fbdc0c5c65940)) by @dependabot[bot]
- chore(deps): bump phpstan/phpstan from 2.2.1 to 2.2.2 (#372) ([6c3b02a8](https://github.com/ashcoft/nextcloud-cad-viewer/commit/6c3b02a8dcc6d99370fb320c7855307ad4c6b6ad)) by @dependabot[bot]

**Full Changelog**: [v0.0.14...v0.0.15](https://github.com/ashcoft/nextcloud-cad-viewer/compare/v0.0.14...v0.0.15)

## [0.0.14] - 2026-06-05

### What's Changed

- Update release.yml ([673008a5](https://github.com/ashcoft/nextcloud-cad-viewer/commit/673008a5c4e6f186f1e8b41aa0767362b0a7e52a)) by @Dony Wibowo
- Update config.json ([807fe765](https://github.com/ashcoft/nextcloud-cad-viewer/commit/807fe765633d28b2e27dbb10fbac0f1691af4d1a)) by @Dony Wibowo
- Update release.yml ([31754f39](https://github.com/ashcoft/nextcloud-cad-viewer/commit/31754f39d16a4cb6cc9121466ed7405ac80edcd7)) by @Dony Wibowo

**Full Changelog**: [v0.0.13...v0.0.14](https://github.com/ashcoft/nextcloud-cad-viewer/compare/v0.0.13...v0.0.14)

# Changelog

## 0.0.9

### Patch Changes

- [#319](https://github.com/ashcoft/nextcloud-cad-viewer/pull/319) [`ca07d90`](https://github.com/ashcoft/nextcloud-cad-viewer/commit/ca07d90230d3f8cbf9c6357ecb89ed320fc0084e) Thanks [@ashcoft](https://github.com/ashcoft)! - Enhance AGENTS.md with comprehensive development guide for AI agents

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Refactored release and artifact workflows for version increments
- Updated README with streamlined documentation

### Bug Fixes

- Replace broken upload-release-action with softprops/action-gh-release
- Correct release-please outputs syntax

## [2.0.7] - 2026-05-27

### Bug Fixes

- Add checkout step to integration-mariadb changes job
- Add get method to interfaces for PHPUnit mocking
- Add IBootstrap interface for PHPUnit
- Add missing OCP interfaces to stubs for PHPUnit
- Add OCP\AppFramework\App class for PHPUnit
- Add release assets build and fix Internal Server Error on NC33
- Align code style with php-cs-fixer rules
- Correct app_id parsing in Makefile
- Correct phpstan.neon configuration
- Define constants for duplicate error message strings
- Align cad-viewer version with lockfile
- Expand single-line function bodies to multi-line format
- Include lib/\*\* in paths-filter for node workflows
- Always upload Nextcloud app artifacts on release
- Keep component-prefixed tags for compare continuity
- Remove duplicate tag-release workflow
- Remove unnecessary null check in LoadViewer.php
- Remove unused code and cleanup phpstan config
- Resolve CI failures and rename app ID to compliant 'cad_viewer'
- Resolve CI failures and upgrade to Node 24, PHP 8.3, and Nextcloud 33-34
- Throw UnexpectedValueException for unsupported MIME types
- Update pnpm lockfile to match package.json
- Update type check for BeforeTemplateRenderedEvent response
- Use phpVersion instead of invalid min in phpstan.neon

### Maintenance

- Pin Node.js version to 24 in GitHub workflows
- Rebuild JS assets
- Remove integration-mariadb workflow
- Remove npm-build workflow, use artifact for Nextcloud app build

## [2.0.0] - 2026-04-15

### Features

- Initial release with DWG/DXF viewing capabilities based on @mlightcad/cad-viewer
- Add Nextcloud App Store publish to release workflow
- Add version to artifact filenames
- Add missing files from Nextcloud app_template

### Bug Fixes

- Resolve CI failures and TypeScript deprecation warnings
- Improve release workflow with manual dispatch and better structure

### Maintenance

- Migrate project to pnpm for Nextcloud 33 stability
- Update compatibility for Nextcloud 32-33 and PHP 8.1-8.5

---

## Version Increment Process

When a release tag is pushed (e.g., `v0.0.9`), the release workflow automatically:

1. **Updates package.json and package-lock.json** via `pnpm version`
2. **Updates appinfo/info.xml** via sed replacement
3. **Updates CHANGELOG.md** with new version entry template
4. **Commits all changes** and pushes to main branch
5. **Creates git tag** for the release

### Manual Version Update

To update version locally:

```bash
# Update all version files
pnpm version 0.0.9 --no-git-tag-version
sed -i 's|<version>.*</version>|<version>0.0.9</version>|' appinfo/info.xml
```
