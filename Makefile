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
	npx -y pnpm@9.3.0 install --frozen-lockfile

clean:
	rm -rf $(build_dir)
	rm -rf js/*

$(app_dir):
	mkdir -p $(app_dir)
	rsync -a \
		--exclude=.git \
		--exclude=.github \
		--exclude=.gitignore \
		--exclude=.editorconfig \
		--exclude=.php-cs-fixer.dist.php \
		--exclude=.php-cs-fixer.cache \
		--exclude=.reuse \
		--exclude=LICENSES \
		--exclude=node_modules \
		--exclude=src \
		--exclude=tests \
		--exclude=vendor-bin \
		--exclude=docs \
		--exclude=wiki \
		--exclude=Makefile \
		--exclude=composer.json \
		--exclude=composer.lock \
		--exclude=package.json \
		--exclude=pnpm-lock.yaml \
		--exclude=tsconfig.json \
		--exclude=webpack.config.js \
		--exclude=babel.config.js \
		--exclude=eslint.config.js \
		--exclude=jest.config.js \
		--exclude=phpstan.neon \
		--exclude=psalm.xml \
		--exclude=rector.php \
		--exclude=stylelint.config.js \
		--exclude=sonar-project.properties \
		--exclude=commitlint.config.js \
		--exclude=AGENTS.md \
		--exclude=playwright.config.ts \
		--exclude=playwright-report \
		--exclude=test-results \
		--exclude=build \
		--exclude=openapi.json \
		--exclude='*.tar.gz' \
		--exclude='*.zip' \
		./ $(app_dir)/
	find $(app_dir) -type d -exec chmod 755 {} +
	find $(app_dir) -type f -exec chmod 644 {} +

appstore: $(app_dir)
	cd $(build_dir) && tar -czf $(app_id).tar.gz --owner=www-data --group=www-data $(app_id)
	cd $(build_dir) && zip -r $(app_id).zip $(app_id)

source:
	mkdir -p $(build_dir)
	git archive --format=tar.gz --prefix=$(app_id)/ -o $(build_dir)/$(app_id)-source.tar.gz HEAD
	git archive --format=zip --prefix=$(app_id)/ -o $(build_dir)/$(app_id)-source.zip HEAD
