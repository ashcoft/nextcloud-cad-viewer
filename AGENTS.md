# Agent Instructions for CAD Viewer App

This document provides instructions and tips for AI agents working on this repository.

## Project Overview
This is a Nextcloud app called `cad_viewer` that integrates the `@mlightcad/cad-viewer` library to view DWG and DXF files entirely in the browser.

## Technical Stack
- **Backend:** PHP ^8.2
- **Nextcloud Compatibility:** Target Nextcloud 33 (uses `nextcloud/ocp:dev-stable33`).
- **Frontend:** Vue 3 with Element Plus.

## Prerequisites for /mlightcad/cad-viewer
- **Engine** Node.js >= 24
- **pnpm Compatibility:** pnpm >= 10

## Development Guidelines

### Dependencies
- **Backend:** Use Composer. When updating dependencies, ensure compatibility with PHP 8.2 unless specifically instructed to upgrade.
  - If you need to update `composer.lock` but your local environment has a different PHP version, use `--ignore-platform-reqs`.
- **Frontend:** Use NPM. Always use the `--legacy-peer-deps` flag when installing dependencies due to peer dependency conflicts in `@mlightcad` packages:
  ```bash
  npm install --legacy-peer-deps
  ```

### Testing
- **Backend Tests:** Run PHPUnit tests using:
  ```bash
  composer test:unit
  ```
  Note: Unit tests may fail locally if they depend on Nextcloud core classes that are not fully mocked or available in the environment.
- **Frontend Tests:** Run Jest tests using:
  ```bash
  npm test
  ```
- **Static Analysis:** Run Psalm using:
  ```bash
  composer psalm
  ```
  Ensure `psalm.xml` has the correct `phpVersion` configured.

### GitHub Actions
- All workflows should use consistent pinned hashes for actions.
- Use the `v` prefix for `shivammathur/setup-php` tags (e.g., `v2.37.0`).
- The repository follows Nextcloud organization template patterns for CI/CD.

## Known Issues
- Local Psalm analysis may fail if the target PHP version is not supported by the local Psalm installation or if dependencies have missing classes.
- Some tests require a full Nextcloud environment and may not pass in a minimal sandbox.
