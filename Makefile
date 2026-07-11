# SPDX-FileCopyrightText: 2024 ashcoft
# SPDX-License-Identifier: MIT

# Makefile for building the project

app_name=cad_viewer
project_dir=$(CURDIR)
build_dir=$(project_dir)/build/artifacts
sign_dir=$(build_dir)/sign
version=$(shell sed -n 's/.*<version>\(.*\)<\/version>.*/\1/p' appinfo/info.xml | xargs)
info_xml=appinfo/info.xml

all: dev-setup build-production

dev-setup: clean-dev pnpm-init build-js
production-setup: clean-dev pnpm-init build-js-production

build-js:
	pnpm run build

build-js-production:
	pnpm run build

release: appstore create-tag

create-tag:
	git tag -a v$(version) -m "Tagging the $(version) release."
	git push origin v$(version)

pnpm-init:
	pnpm install --frozen-lockfile

pnpm-update:
	pnpm update

clean:
	rm -rf js/*
	rm -rf $(build_dir)

clean-dev: clean
	rm -rf vendor
	rm -rf node_modules

appstore:
	rm -rf $(build_dir)
	mkdir -p $(sign_dir)
	rsync -a \
		--exclude=/build \
		--exclude=.git \
		--exclude=.github \
		--exclude=node_modules \
		--exclude=src \
		--exclude=tests \
		--exclude=vendor-bin \
		--exclude=docs \
		--exclude=wiki \
		--exclude=*.tar.gz \
		--exclude=*.zip \
		--exclude=Makefile \
		--exclude=package.json \
		--exclude=pnpm-lock.yaml \
		--exclude=tsconfig.json \
		--exclude=*.config.js \
		--exclude=*.config.mjs \
		--exclude=jest.config.js \
		--exclude=playwright.config.ts \
		--exclude=rector.php \
		--exclude=phpstan.neon \
		--exclude=psalm.xml \
		--exclude=eslint.config.js \
		--exclude=stylelint.config.js \
		--exclude=commitlint.config.js \
		--exclude=.stylelintignore \
		--exclude=composer.json \
		--exclude=composer.lock \
		--exclude=composer.*.json \
		--exclude=vendor \
		$(project_dir)/ $(sign_dir)/$(app_name)
	cp package.json pnpm-lock.yaml $(sign_dir)/$(app_name)/
	tar -czf $(build_dir)/$(app_name).tar.gz -C $(sign_dir) $(app_name)
	@if command -v zip >/dev/null 2>&1; then \
		cd $(sign_dir) && zip -r $(app_name).zip $(app_name); \
		mv $(sign_dir)/$(app_name).zip $(build_dir)/; \
	else \
		echo "Warning: zip not installed, skipping zip archive"; \
	fi

# Bump version in appinfo/info.xml and package.json
# Usage: make bump-version VERSION=x.x.x
bump-version: bump-info-xml bump-package-json
	@echo "Version bumped to $(VERSION)"

bump-info-xml:
ifndef VERSION
	$(error VERSION is undefined. Usage: make bump-version VERSION=x.x.x)
endif
	@echo "Bumping info.xml version to $(VERSION)"
	@sed -i "s|<version>[^<]*</version>|<version>$(VERSION)</version>|" $(info_xml)
	@NEW_VERSION=$$(sed -n 's/.*<version>\(.*\)<\/version>.*/\1/p' $(info_xml) | xargs); \
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

test:
	composer run test:unit
	pnpm run test

lint:
	composer run lint
	composer run cs:check
	pnpm run lint

lint-fix:
	composer run cs:fix
