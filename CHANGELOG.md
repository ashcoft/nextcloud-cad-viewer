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

## [0.1.1](https://github.com/ashcoft/nextcloud-cad-viewer/compare/v0.1.0...v0.1.1) (2026-07-04)


### Bug Fixes

* **build:** resolve mlightcad optional plugin imports and dxf-json-converter version mismatch ([8c62480](https://github.com/ashcoft/nextcloud-cad-viewer/commit/8c62480104591d87d222ad6743dac09ae81ba95e))
* **ci:** remove duplicate 'contents' permission in openapi.yml ([f03d457](https://github.com/ashcoft/nextcloud-cad-viewer/commit/f03d457a0ca23edfcf1ebeeee0700989be749db5))
* dedupe corrupted pnpm-lock.yaml ([a99d21e](https://github.com/ashcoft/nextcloud-cad-viewer/commit/a99d21e33422a2cf9b8a0084c54adb4b75863afa))
* pin release-please-action to commit SHA for security ([0c97c34](https://github.com/ashcoft/nextcloud-cad-viewer/commit/0c97c34fc2e84a8c5ec5923ac079c22b9b07439b))
* **security:** use explicit path mapping to avoid path traversal false positive ([8abdad2](https://github.com/ashcoft/nextcloud-cad-viewer/commit/8abdad26e621feb3a989fd277dd6ecd3b4192d5f))
* update babel preset-typescript options for compatibility ([e5dc991](https://github.com/ashcoft/nextcloud-cad-viewer/commit/e5dc99152e6321ba880f59dcf9f2e09852e3f71e))
* update read-package-engines-version-actions to latest SHA to fix Node.js 20 deprecation warning ([d5ad953](https://github.com/ashcoft/nextcloud-cad-viewer/commit/d5ad953e5ead0b76dcd2cd93e13d53b7e5ecb38c))

## [0.1.0](https://github.com/ashcoft/nextcloud-cad-viewer/compare/v0.0.20...v0.1.0) (2026-07-04)


### Features

* PHP 8.4 / PHPUnit 13 / NC33+ compatibility ([fd99a7f](https://github.com/ashcoft/nextcloud-cad-viewer/commit/fd99a7f9d76f7de080fdf9f2bb70f6ea23191859))


### Bug Fixes

* accept skipped status in psalm summary job ([6d3af1a](https://github.com/ashcoft/nextcloud-cad-viewer/commit/6d3af1a5bb36416ec25a7071e9b1d0d47db8f0b0))
* add --ignore-platform-reqs to all composer commands ([65dc841](https://github.com/ashcoft/nextcloud-cad-viewer/commit/65dc841195190b2df3d3f9aacc40c5d75bf129f0))
* add .npmrc with supply-chain=false to disable policy check ([dde9437](https://github.com/ashcoft/nextcloud-cad-viewer/commit/dde9437632170ded08e3bb8f0bc0eb99bfbf90e2))
* add #[\Override] attributes for psalm v6 compatibility ([7d427a1](https://github.com/ashcoft/nextcloud-cad-viewer/commit/7d427a1d283d34a72155a4b28ff95485ab60891c))
* add closing braces to stub files and remove trailing spaces ([a094e59](https://github.com/ashcoft/nextcloud-cad-viewer/commit/a094e592d0b58e70e4f522e81b2180a96488b8f7))
* add COMPOSER_IGNORE_PLATFORM_REQS for PHP 8.2 runners ([d9b10b5](https://github.com/ashcoft/nextcloud-cad-viewer/commit/d9b10b5429aee34087bf12166494d0687a2a683f))
* add dangerouslyAllowAllBuilds for pnpm v11 strictDepBuilds ([ae289e2](https://github.com/ashcoft/nextcloud-cad-viewer/commit/ae289e2ae95007843218b8a2a2f59854b0602dfb))
* add ignore-platform-reqs to phpstan workflow ([d6ceec9](https://github.com/ashcoft/nextcloud-cad-viewer/commit/d6ceec91ed53242a7854867e925f25cb83992c59))
* add OC\Hooks\Emitter stub to OC.php ([2f258fb](https://github.com/ashcoft/nextcloud-cad-viewer/commit/2f258fbec439f95e78793137ecc88ea956b076b2))
* add parentheses to anonymous class for php-cs-fixer ([7f1c03e](https://github.com/ashcoft/nextcloud-cad-viewer/commit/7f1c03ec8a519955e00a6b52586ab981b7c93e42))
* add proper PSR-4 autoloading for OC and OC\Hooks namespaces ([362ee39](https://github.com/ashcoft/nextcloud-cad-viewer/commit/362ee39bb040865f52069165b62562a2deaf888e))
* apply CodeRabbit auto-fixes ([f79bb5a](https://github.com/ashcoft/nextcloud-cad-viewer/commit/f79bb5a79f1db9e3116f5785fc10add8b7e7b2a8))
* apply PSR-12 coding standard to all test and stub files ([428d637](https://github.com/ashcoft/nextcloud-cad-viewer/commit/428d6379a88100420490d038d73d2506640b9f81))
* build and upload NC app to GitHub release assets ([06b86d6](https://github.com/ashcoft/nextcloud-cad-viewer/commit/06b86d6c91ab513ef4bdd81c80640adb28d209a2))
* **ci:** add paths filter to static analysis workflows ([bdefc81](https://github.com/ashcoft/nextcloud-cad-viewer/commit/bdefc81c71befa98716af266e17169b6fb5ab3ed))
* **ci:** include frontend dependency files in PHPUnit paths filter ([22cc84d](https://github.com/ashcoft/nextcloud-cad-viewer/commit/22cc84d42383948bb099c8be513172ddd551a92d))
* **ci:** prevent psalm workflow from being cancelled ([347334c](https://github.com/ashcoft/nextcloud-cad-viewer/commit/347334cd13d90e748e29aab61ab798d4e77c2866))
* **ci:** remove duplicate unpinned pnpm/action-setup in lint-typescript.yml ([e2fa08f](https://github.com/ashcoft/nextcloud-cad-viewer/commit/e2fa08f876554d76bc29f676a285c723d2c5b9a7))
* **ci:** resolve lint-php-cs and psalm CI failures ([feb3c29](https://github.com/ashcoft/nextcloud-cad-viewer/commit/feb3c298c0201cd2f99374fbe551d16d563ec0a1))
* **ci:** update psalm-matrix.yml to use composer bin nextcloud-ocp ([4edfc25](https://github.com/ashcoft/nextcloud-cad-viewer/commit/4edfc258cace5e410fe15bbe37fd118718d509df))
* **coding-style:** fix method brace formatting in OC.php stubs ([f8963d3](https://github.com/ashcoft/nextcloud-cad-viewer/commit/f8963d379cdc0d6fd90cef585ea651eef0fd2cd4))
* convert tabs to spaces and use PSR-12 coding standard ([3156335](https://github.com/ashcoft/nextcloud-cad-viewer/commit/31563358e4410c979af026a40e1a4f6684db9c94))
* correct all workflow summary step bash conditions ([7873f4d](https://github.com/ashcoft/nextcloud-cad-viewer/commit/7873f4d6ea73df9c2015c3c2ae0bfae9017e9b92))
* correct method indentation to 4 spaces ([938950e](https://github.com/ashcoft/nextcloud-cad-viewer/commit/938950e5cc6988cc5b60ce1210e30b525a2cdf83))
* **deps:** update [@mlightcad](https://github.com/mlightcad) packages to 1.5.6/1.9.6 ([25fb12d](https://github.com/ashcoft/nextcloud-cad-viewer/commit/25fb12d7b9eefd8ec0eb4c6644cb60d60bfca0d3))
* **deps:** update dependency @nextcloud/files to v4 ([74f7315](https://github.com/ashcoft/nextcloud-cad-viewer/commit/74f7315f7f96f9df0ccb98fa999ff5f34fd3c70b))
* **deps:** update js-yaml override to ^5.0.0 to resolve CVE ([3623a93](https://github.com/ashcoft/nextcloud-cad-viewer/commit/3623a9337af243857471b79494788e1b4092c2af))
* **deps:** update js-yaml to non-vulnerable version ([6ad5af4](https://github.com/ashcoft/nextcloud-cad-viewer/commit/6ad5af4eb39bf43f823a0201de820582a0099353))
* **deps:** update mlightcad-ecosystem to v1.5.7 ([4a7a803](https://github.com/ashcoft/nextcloud-cad-viewer/commit/4a7a803f0b0df561d3613414915d222f7883726e))
* disable pnpm supply-chain policy check in CI workflows ([041ebf0](https://github.com/ashcoft/nextcloud-cad-viewer/commit/041ebf015b2525af8afa9af7f68df347511312cd))
* disable supply-chain policy check to fix CI failures ([a6de59f](https://github.com/ashcoft/nextcloud-cad-viewer/commit/a6de59f29b57f18742bced36e52b17f72de2426b))
* ensure proper PSR-12 formatting for remaining files ([13d22e1](https://github.com/ashcoft/nextcloud-cad-viewer/commit/13d22e17563677ff5d7961a4c1fb277da76ba5b8))
* ensure stub files have single trailing newline ([01811e2](https://github.com/ashcoft/nextcloud-cad-viewer/commit/01811e2061cb552e043afc9f45765cf7570cff56))
* exclude vendor-bin from psalm analysis ([c35773b](https://github.com/ashcoft/nextcloud-cad-viewer/commit/c35773b91e13d5becd899c3b01499fcf8977fd47))
* filter PHP versions to minimum 8.4 in CI workflows ([86957d4](https://github.com/ashcoft/nextcloud-cad-viewer/commit/86957d4236d9f8b702c8a7618a820a73ab13501a))
* final PSR-12 formatting adjustments ([22d58cd](https://github.com/ashcoft/nextcloud-cad-viewer/commit/22d58cdfd64ca00c35d88c521a5b271bf5e8ca7d))
* keep platform.php at 8.3 for CI compatibility ([adf91fb](https://github.com/ashcoft/nextcloud-cad-viewer/commit/adf91fbd5416209e88d3d336e0966bc9eb3c8821))
* output PHP versions as JSON array for matrix parsing ([947759c](https://github.com/ashcoft/nextcloud-cad-viewer/commit/947759c2467c7f95638f05eb98bf5afea12d6158))
* pin upload-artifact to SHA for v4.6.2 ([e450a97](https://github.com/ashcoft/nextcloud-cad-viewer/commit/e450a97140a5186323583ba4a803214a699e2a92))
* pnpm v11 compatibility and test suite fixes ([39bb61c](https://github.com/ashcoft/nextcloud-cad-viewer/commit/39bb61c53359810d2290b067744db6760489a7dd))
* provide default PHP 8.4 when no versions pass filter ([cb505a1](https://github.com/ashcoft/nextcloud-cad-viewer/commit/cb505a17773f316f4f5677d6642aadd6d0a3473b))
* Psalm v6 upgrade - PHPUnit tests and lint fixes ([529d15a](https://github.com/ashcoft/nextcloud-cad-viewer/commit/529d15a119798fbbe096ae0e4b1ab5a3e6a395ab))
* refactor release workflow to properly build and upload artifacts ([c72f50d](https://github.com/ashcoft/nextcloud-cad-viewer/commit/c72f50de961c404e0e86a62bdbea3e294abb57ef))
* refresh CI with comments clarifying PHP 8.3 requirement ([ab073ba](https://github.com/ashcoft/nextcloud-cad-viewer/commit/ab073ba5d33bf9e06a6d01f83e34cf433a6be7aa))
* regenerate autoloader after dependency changes ([bdd21d9](https://github.com/ashcoft/nextcloud-cad-viewer/commit/bdd21d9a27f249cb3b790fb7f8008e15147f1911))
* remove duplicate method definitions in test file ([3086c8f](https://github.com/ashcoft/nextcloud-cad-viewer/commit/3086c8fc52cf909a5ff648567b122674136b7fd2))
* remove empty env block from node-test.yml ([322f883](https://github.com/ashcoft/nextcloud-cad-viewer/commit/322f883ef1bf44f14fda77b6931487853817cf69))
* remove fail-on-warning and fail-on-risky flags from test script ([45c9000](https://github.com/ashcoft/nextcloud-cad-viewer/commit/45c90001a45447dc35045fbc6b307a5a04f7889e))
* remove non-ASCII character from test file ([4f2ea35](https://github.com/ashcoft/nextcloud-cad-viewer/commit/4f2ea358429ff0cfa097362b18962a5dab452d9a))
* resolve multiple PR 524 issues ([c26803b](https://github.com/ashcoft/nextcloud-cad-viewer/commit/c26803b3d73f52c25735e5115a23d90524c13a73))
* resolve nextcloud/ocp missing vendor-bin setup (closes [#404](https://github.com/ashcoft/nextcloud-cad-viewer/issues/404)) ([7847d7b](https://github.com/ashcoft/nextcloud-cad-viewer/commit/7847d7b817cac9e544ed2c68bb5c60de84f56d3c))
* resolve Node test failures by fixing Jest config ([96020a3](https://github.com/ashcoft/nextcloud-cad-viewer/commit/96020a3fc3af0ec8e97aa4cd473bb3a9c6e8456a))
* **security:** prevent untrusted checkout in command-openapi workflow ([4067ae7](https://github.com/ashcoft/nextcloud-cad-viewer/commit/4067ae7dc0e3d711aeada257e67686e961e175c5))
* simplify release-please workflow to only run on push ([743246d](https://github.com/ashcoft/nextcloud-cad-viewer/commit/743246d4f0f4b1c6e524dcd69a144189442571f3))
* split function declaration and opening brace to new lines ([6744a34](https://github.com/ashcoft/nextcloud-cad-viewer/commit/6744a348b43acd78588c083a1a41bfb765b293e0))
* update @mlightcad/cad-viewer to 1.5.6 and downgrade Jest to 29.x ([7b78b9c](https://github.com/ashcoft/nextcloud-cad-viewer/commit/7b78b9cefa98d19fe33876ec795a820c602df3da))
* update @mlightcad/data-model to 1.9.12 to fix build error ([100f53f](https://github.com/ashcoft/nextcloud-cad-viewer/commit/100f53ffbef49d82c5338045dc0051c8827e26b8))
* update @mlightcad/data-model to 1.9.12 to resolve build error ([7d62ed4](https://github.com/ashcoft/nextcloud-cad-viewer/commit/7d62ed4795ae627a4034dfccf4f98533b9d00fde))
* update @nextcloud/files v4 API usage ([218a270](https://github.com/ashcoft/nextcloud-cad-viewer/commit/218a2703baa0dd2e8ccc5cbd192c1c2105a1deff))
* update CodeQL workflow to use v4 and correct language config ([db53856](https://github.com/ashcoft/nextcloud-cad-viewer/commit/db53856f8c35da53906484a19ddfb01cb296c73c))
* update documentation for consistency with PHP 8.3+ and Nextcloud 33-34 ([a41f798](https://github.com/ashcoft/nextcloud-cad-viewer/commit/a41f798823e081d8c225f6baa40c0df49ad15aac))
* update platform.php to 8.3 (aligns with main require) ([d00e3ad](https://github.com/ashcoft/nextcloud-cad-viewer/commit/d00e3addddb17d1b7ac6bd187b7161a4e15a7d55))
* update pnpm to v10.34.4 and add missing cad-plugin dependencies ([56b4773](https://github.com/ashcoft/nextcloud-cad-viewer/commit/56b4773a04603c0715576ccf65452ea7873144ab)), closes [#475](https://github.com/ashcoft/nextcloud-cad-viewer/issues/475)
* update psalm-matrix workflow grep pattern to use PHP 8.3 ([268066b](https://github.com/ashcoft/nextcloud-cad-viewer/commit/268066b430c9f9d93c2d28ebffac36c29556ec74))
* update release-please-action to v4.1.1 ([1c234a8](https://github.com/ashcoft/nextcloud-cad-viewer/commit/1c234a85911ffb79fb229a937884f68672b72963))
* update to PHPUnit v12 and fix DB connection ([1ca371e](https://github.com/ashcoft/nextcloud-cad-viewer/commit/1ca371ee05a30f141c476d92c99b403237723d70))
* update workflow grep patterns to use PHP 8.3 ([c3f7e97](https://github.com/ashcoft/nextcloud-cad-viewer/commit/c3f7e97be2280d7411c408e6ab88f02e09748e60))
* upgrade psalm to ^6.0 for PHPUnit v12 compatibility ([bbb0d01](https://github.com/ashcoft/nextcloud-cad-viewer/commit/bbb0d01376bd6dc366c5e59fab9444a51ea99824))
* use allowBuilds instead of onlyBuiltDependencies for pnpm v11 ([aac788b](https://github.com/ashcoft/nextcloud-cad-viewer/commit/aac788bbe05fe9cbdd410b96469d008da4a215cc))
* use commit message for version bump detection instead of changeset output ([e1f1418](https://github.com/ashcoft/nextcloud-cad-viewer/commit/e1f14182369d5239f2c3340df83373d66457536c))
* use COMPOSER_IGNORE_PLATFORM_REQS env var for composer run ([7d1e651](https://github.com/ashcoft/nextcloud-cad-viewer/commit/7d1e651426d5bb6fe6182763158de93c4d4823b7))
* use correct @nextcloud/files API types ([edaec04](https://github.com/ashcoft/nextcloud-cad-viewer/commit/edaec046e23d8f85f8a89985c685dce13ea77184))
* use minimumReleaseAge:0 to disable supply-chain age check ([992f259](https://github.com/ashcoft/nextcloud-cad-viewer/commit/992f259da43ceb10dd257ac0dc370995fd4be8d8))
* use PHP 8.4 explicitly in psalm-matrix workflow ([a7052a1](https://github.com/ashcoft/nextcloud-cad-viewer/commit/a7052a169a44dc512c959c54eeaa31424f6e93ef))
* use PHP version from composer.json instead of hardcoded 8.3 ([3713854](https://github.com/ashcoft/nextcloud-cad-viewer/commit/3713854341aa27b1105668997a1d80d6b856fda7))


### Reverts

* keep Jest 29 for Node 20 compatibility ([afca5ef](https://github.com/ashcoft/nextcloud-cad-viewer/commit/afca5ef509646c3d8cb69fca56edcb0242221e3e))
* keep PHP 8.3 for CI compatibility ([0740d16](https://github.com/ashcoft/nextcloud-cad-viewer/commit/0740d16d1b4e14c787d6b6cb522c1b173cb616a5))
* revert to PHPUnit v10 and psalm v5 for PHP 8.2 compatibility ([2b7b057](https://github.com/ashcoft/nextcloud-cad-viewer/commit/2b7b057f502c11996d1fd75c1176e923dab7cbf6))

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
