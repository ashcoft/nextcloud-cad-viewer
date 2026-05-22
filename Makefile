app_id=$(shell sed -n 's/.*<id>\(.*\)<\/id>.*/\1/p' appinfo/info.xml | xargs)
app_version=$(shell sed -n 's/.*<version>\(.*\)<\/version>.*/\1/p' appinfo/info.xml | xargs)
project_dir=$(shell pwd)
build_dir=$(project_dir)/build/artifacts
app_dir=$(build_dir)/$(app_id)

all: appstore source

clean:
	rm -rf $(build_dir)

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

appstore: clean $(app_dir)
	cd $(build_dir) && tar -czf $(app_id).tar.gz --owner=www-data --group=www-data $(app_id)
	cd $(build_dir) && zip -r $(app_id).zip $(app_id)

source:
	mkdir -p $(build_dir)
	git archive --format=tar.gz --prefix=$(app_id)/ -o $(build_dir)/$(app_id)-source.tar.gz HEAD
	git archive --format=zip --prefix=$(app_id)/ -o $(build_dir)/$(app_id)-source.zip HEAD
