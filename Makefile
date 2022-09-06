.DEFAULT_GOAL := test

HTML_FILES := $(shell find src/html -name *.html | grep -v "\.test\.")
TS_FILES := $(shell find src/js -name *.ts)
CSS_FILES := src/css/tailwind.css

OUT_HTML_FILES := $(patsubst src/%, dist/%, $(HTML_FILES))
OUT_JS_FILES := $(patsubst src/%.ts, dist/%.js, $(TS_FILES))
OUT_CSS_FILES := dist/css/tailwind.css

NVM_DIR := $(HOME)/.nvm/
NVM := NVM_SILENT=1 \. "$(NVM_DIR)/nvm.sh" && nvm
NVM_VERSIONED_DIR := $(NVM_DIR)/versions/node/$(shell cat .nvmrc)
NVM_BIN := $(NVM_VERSIONED_DIR)/bin
NVM_INC := $(NVM_VERSIONED_DIR)/include/node
NVM_ENV := PATH=$(NVM_BIN):$(PATH) NVM_DIR=$(NVM_DIR) NVM_BIN=$(NVM_BIN) NVM_INC=$(NVM_INC)


node_modules: .nvmrc
	$(NVM) install


$(OUT_HTML_FILES): $(HTML_FILES)
	mkdir -p $(@D)
	rsync -a --no-times $(patsubst dist/%, src/%, $(@)) $(@)


$(OUT_JS_FILES): $(TS_FILES) node_modules
	$(NVM_ENV) tsc -p tsconfig.json --outDir dist/js


$(OUT_CSS_FILES): $(OUT_HTML_FILES) $(OUT_JS_FILES) $(CSS_FILES) tailwind.config.js node_modules
	$(NVM_ENV) npx tailwindcss -i src/css/tailwind.css -o dist/css/tailwind.css


.PHONY: html
html: $(OUT_HTML_FILES)
	@echo "--== HTML synced ==--"


.PHONY: js
js: $(OUT_JS_FILES)
	@echo "--== JS synced   ==--"


.PHONY: css
css: $(OUT_CSS_FILES)
	@echo "--== CSS synced  ==--"


.PHONY: build
build: html js css
	@echo ""


.PHONY: clean
clean:
	rm -rf dist/*


.PHONY: test
test: build
	$(NVM_ENV) npx jest --verbose --config jest.config.json


.PHONY: watch
watch:
	fswatch -or ./ | xargs -I{} make
