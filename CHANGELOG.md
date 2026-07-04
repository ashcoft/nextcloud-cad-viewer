## [0.0.20] - 2026-07-04

### Maintenance

- Refactored release workflow to use release-please-action with conventional commits
- Removed changesets-based release process
- Removed auto-changeset-dependabot.yml and cleanup-pr-comments.yml workflows
- Updated artifact.yml for cleaner build process

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

### Patch Changes

- [ca07d90](https://github.com/ashcoft/nextcloud-cad-viewer/commit/ca07d90230d3f8cbf9c6357ecb89ed320fc0084e) - Enhance AGENTS.md with comprehensive development guide for AI agents

---

## Version Increment Process

When a release tag is pushed (e.g., `v0.0.9`), the release-please workflow automatically:

1. **Updates package.json** via release-please
2. **Updates appinfo/info.xml** via sed replacement in the build job
3. **Creates GitHub Release** with changelog
4. **Uploads app artifacts** (tar.gz and zip) to the release

### Manual Version Update

To update version locally:

```bash
# Update all version files
pnpm version 0.0.9 --no-git-tag-version
sed -i 's|<version>.*</version>|<version>0.0.9</version>|' appinfo/info.xml
```
