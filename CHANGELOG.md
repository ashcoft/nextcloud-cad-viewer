# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Refactored release and artifact workflows for version increments
- Updated README with streamlined documentation

## [2.0.8] - 2026-05-27

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
- Include lib/** in paths-filter for node workflows
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

When a release build is triggered via `workflow_dispatch` with a version input (e.g., `0.0.9`), the build workflow automatically:

1. **Updates package.json** via `pnpm version`
2. **Updates appinfo/info.xml** via sed replacement
3. **Updates CHANGELOG.md** by converting the `[Unreleased]` section to a versioned entry
4. **Builds the Nextcloud app** with updated version files
5. **Packages artifacts** with versioned filenames (e.g., `cad_viewer-v0.0.9.tar.gz`)

### Manual Release Build

To trigger a release build:

1. Navigate to GitHub Actions → "Build Nextcloud App"
2. Click "Run workflow"
3. Enter the version number (e.g., `0.0.9`)
4. The workflow will:
   - Update all version files
   - Increment CHANGELOG.md
   - Create the release artifact

### Local Version Update

```bash
# Update all version files locally
pnpm version 0.0.9 --no-git-tag-version
sed -i 's|<version>.*</version>|<version>0.0.9</version>|' appinfo/info.xml
```
