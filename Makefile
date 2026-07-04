# SPDX-FileCopyrightText: 2024 ashcoft
# SPDX-License-Identifier: MIT

# Makefile for building the project

app_id=$(shell sed -n 's/.*<id>\(.*\)<\/id>.*/\1/p' appinfo/info.xml | head -1)
app_version=$(shell sed -n 's/.*<version>\(.*\)<\/version>.*/\1/p' appinfo/info.xml | xargs)
project_dir=$(CURDIR)
build_dir=$(project_dir)/build/artifacts
app_dir=$(build_dir)/$(app_id)

all: appstore source

dev-setup: clean npm-init build-js

production-setup: clean npm-init build-js-production

build-js:
	pnpm run build

build-js-production:
	pnpm run build

test:
	composer run test:unit
	pnpm run test

lint:
	composer run lint
	composer run cs:check
	pnpm run lint

lint-fix:
	composer run cs:fix

npm-init:
	pnpm install --frozen-lockfile

clean:
	rm -rf $(build_dir)
	rm -rf js/*

$(app_dir):
	mkdir -p $(app_dir)
	# Use tar to copy files (excludes built-in tar exclusions for .* files)
	tar --exclude='.git' --exclude='.github' --exclude='node_modules' --exclude='src' \
		--exclude='tests' --exclude='vendor-bin' --exclude='docs' --exclude='wiki' \
		--exclude='build' --exclude='vendor' \
		--exclude='*.tar.gz' --exclude='*.zip' \
		-cf - . | tar -xf - -C $(app_dir)
	# Copy specific files that are needed (not excluded above)
	cp composer.json composer.lock package.json pnpm-lock.yaml tsconfig.json $(app_dir)/ 2>/dev/null || true
	# Ensure proper permissions
	find $(app_dir) -type d -exec chmod 755 {} +
	find $(app_dir) -type f -exec chmod 644 {} +

appstore: $(app_dir)
	cd $(build_dir) && tar -czf $(app_id).tar.gz --owner=www-data --group=www-data $(app_id)
	@if command -v zip >/dev/null 2>&1; then \
		cd $(build_dir) && zip -r $(app_id).zip $(app_id); \
	else \
		echo "Warning: zip not installed, skipping zip archive"; \
	fi

source:
	mkdir -p $(build_dir)
	git archive --format=tar.gz --prefix=$(app_id)/ -o $(build_dir)/$(app_id)-source.tar.gz HEAD
	git archive --format=zip --prefix=$(app_id)/ -o $(build_dir)/$(app_id)-source.zip HEAD
