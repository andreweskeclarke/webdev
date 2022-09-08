.DEFAULT_GOAL := test

HTML_FILES := $(shell find src/html -name *.html | grep -v "\.test\.")
TS_FILES := $(shell find src/js -name *.ts)
CSS_FILES := src/css/tailwind.css
ASSETS := $(shell find assets/ -type f)

OUT_HTML_FILES := $(patsubst src/%, dist/%, $(HTML_FILES))
OUT_JS_FILES := $(patsubst src/%.ts, dist/%.js, $(TS_FILES))
OUT_CSS_FILES := dist/css/tailwind.css
OUT_ASSETS := $(patsubst assets/%, dist/%, $(ASSETS))

# Assumes the user has nvm installed (so far this is true for me and Github Actions)
NVM_DIR := $(HOME)/.nvm
NVM_VERSIONED_DIR := $(NVM_DIR)/versions/node/$(shell cat .nvmrc)
NVM_BIN := $(NVM_VERSIONED_DIR)/bin
NVM_INC := $(NVM_VERSIONED_DIR)/include/node
NVM_ENV := PATH=$(NVM_BIN):$(PATH) NVM_DIR=$(NVM_DIR) NVM_BIN=$(NVM_BIN) NVM_INC=$(NVM_INC)
NPM := NVM_SILENT=1 \. "$(NVM_DIR)/nvm.sh" && npm

node_modules: .nvmrc
	$(NPM) install


.PHONY: deps
deps: node_modules


$(OUT_HTML_FILES): $(HTML_FILES)
	mkdir -p $(@D)
	rsync -a --no-times $(patsubst dist/%, src/%, $(@)) $(@)


$(OUT_ASSETS): $(ASSETS)
	mkdir -p $(@D)
	rsync -a --no-times $(patsubst dist/%, assets/%, $(@)) $(@)


$(OUT_JS_FILES): $(TS_FILES) node_modules
	$(NVM_ENV) tsc -p tsconfig.json --outDir dist/js


$(OUT_CSS_FILES): $(OUT_HTML_FILES) $(OUT_JS_FILES) $(CSS_FILES) tailwind.config.cjs node_modules
	$(NVM_ENV) npx tailwindcss -i src/css/tailwind.css -o dist/css/tailwind.css -c tailwind.config.cjs


.PHONY: html
html: $(OUT_HTML_FILES)
	@echo "--== HTML synced   ==--"


.PHONY: js
js: $(OUT_JS_FILES)
	@echo "--== JS synced     ==--"


.PHONY: css
css: $(OUT_CSS_FILES)
	@echo "--== CSS synced    ==--"


.PHONY: assets
assets: $(OUT_ASSETS)
	@echo "--== Assets synced ==--"


.PHONY: build
build: html js css assets
	@echo ""


.PHONY: clean
clean:
	rm -rf dist/*


.PHONY: test
test: build
 	# flag Necessary for ES modules
	$(NVM_ENV) NODE_OPTIONS=--experimental-vm-modules npx jest --verbose --config jest.config.json


.PHONY: watch
watch:
	fswatch -or ./ | xargs -I{} make


.PHONY: local
local: build
	npx http-server dist/ -o html/index.html