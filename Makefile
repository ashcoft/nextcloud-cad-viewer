# SPDX-FileCopyrightText: 2024 ashcoft
# SPDX-License-Identifier: MIT

# Makefile for Nextcloud CAD Viewer

# === Variables ===
app_id := $(shell sed -n 's/.*<id>\(.*\)<\/id>.*/\1/p' appinfo/info.xml | head -1)
build_dir := build/artifacts
app_dir := $(build_dir)/$(app_id)
info_xml := appinfo/info.xml

# === Version Bumping (used by semantic-release) ===
# Usage: make bump-version VERSION=x.x.x
bump-version: bump-info-xml bump-package-json
	@echo "Version bumped to $(VERSION)"

bump-info-xml:
ifndef VERSION
	$(error VERSION is undefined. Usage: make bump-version VERSION=x.x.x)
endif
	@echo "Bumping info.xml version to $(VERSION)"
	@sed -i "s|<version>[^<]*</version>|<version>$(VERSION)</version>|" $(info_xml)
	@NEW_VERSION=$$(sed -n 's/.*<version>\(.*\)<\/version>.*/\1/p' $(info_xml) | head -n 1 | xargs); \
	if [ "$$NEW_VERSION" != "$(VERSION)" ]; then \
		echo "ERROR: Failed to update info.xml. Expected $(VERSION), got $$NEW_VERSION"; \
		exit 1; \
	fi
	@echo "info.xml version updated to $(VERSION)"

bump-package-json:
ifndef VERSION
	$(error VERSION is undefined. Usage: make bump-version VERSION=x.x.x)
endif
	@echo "Bumping package.json version to $(VERSION)"
	@node -e "const pkg=require('./package.json'); pkg.version='$(VERSION)'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2)+'\\n');"
	@NEW_VERSION=$$(node -p "require('./package.json').version"); \
	if [ "$$NEW_VERSION" != "$(VERSION)" ]; then \
		echo "ERROR: Failed to update package.json. Expected $(VERSION), got $$NEW_VERSION"; \
		exit 1; \
	fi
	@echo "package.json version updated to $(VERSION)"

# === Build Targets ===
dev-setup: clean install build

production-setup: clean install build

install:
	pnpm install --frozen-lockfile

build:
	pnpm run build

# === Cleanup ===
clean:
	rm -rf $(build_dir)
	rm -rf js/*

# === Package for App Store ===
$(app_dir):
	mkdir -p $(app_dir)
	rsync -a --progress \
		--exclude='.git' --exclude='.github' --exclude='node_modules' --exclude='src' \
		--exclude='tests' --exclude='vendor-bin' --exclude='docs' --exclude='wiki' \
		--exclude='LICENSES' --exclude='AGENTS.md' \
		--exclude='build' --exclude='*.tar.gz' --exclude='*.zip' \
		--exclude='*.lock' --exclude='pnpm-lock.yaml' --exclude='composer.lock' \
		--exclude='tsconfig.json' --exclude='jest.config.js' --exclude='playwright.config.ts' \
		--exclude='phpstan.neon' --exclude='psalm.xml' --exclude='rector.php' \
		--exclude='eslint.config.js' --exclude='stylelint.config.js' --exclude='babel.config.js' \
		--exclude='webpack.config.js' --exclude='.npmrc' --exclude='.nvmrc' \
		--exclude='.php-cs-fixer.dist.php' --exclude='.codacy.yml' \
		--exclude='openapi.json' --exclude='sonar-project.properties' \
		--exclude='commitlint.config.js' --exclude='renovate.json' --exclude='release.config.js' \
		--exclude='pnpm-workspace.yaml' \
		--include='CHANGELOG.md' --include='l10n/' --include='l10n/**' \
		--exclude='*.md' \
		. $(app_dir)/
	find $(app_dir) -type d -exec chmod 755 {} +
	find $(app_dir) -type f -exec chmod 644 {} +

appstore: $(app_dir)
	cd $(build_dir) && tar -czf $(app_id).tar.gz --owner=www-data --group=www-data $(app_id)
	@command -v zip >/dev/null 2>&1 && \
		{ cd $(build_dir) && zip -r $(app_id).zip $(app_id); } || \
		echo "Warning: zip not installed, skipping zip archive"

# === Development ===
test:
	composer run test:unit
	pnpm run test

lint:
	composer run lint
	composer run cs:check
	pnpm run lint

lint-fix:
	composer run cs:fix

# === Meta ===
all: appstore
