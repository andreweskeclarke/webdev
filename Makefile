.DEFAULT_GOAL := all

DEPLOY_DIR ?= dist

HTML_FILES = $(shell find src/html -name *.html)
OUT_HTML_FILES = $(patsubst src/%, $(DEPLOY_DIR)/%, $(HTML_FILES))

TS_FILES = $(shell find src/js -name *.ts)
OUT_JS_FILES = $(patsubst src/%.ts, $(DEPLOY_DIR)/%.js, $(TS_FILES))

OUT_CSS_FILES = $(DEPLOY_DIR)/css/tailwind.css

NVM_DIR = $(HOME)/.nvm/
NVM = NVM_SILENT=1 \. "$(NVM_DIR)/nvm.sh" && nvm
NVM_VERSIONED_DIR = $(NVM_DIR)/versions/node/$(shell cat .nvmrc)
NVM_BIN = $(NVM_VERSIONED_DIR)/bin
NVM_INC = $(NVM_VERSIONED_DIR)/include/node
NVM_ENV = PATH=$(NVM_BIN):$(PATH) NVM_DIR=$(NVM_DIR) NVM_BIN=$(NVM_BIN) NVM_INC=$(NVM_INC)

NODE = $(NVM_ENV) node
TAILWIND = $(NVM_ENV) npx tailwindcss
TSC = $(NVM_ENV) tsc


.PHONY: clean
clean:
	rm -rf $(DEPLOY_DIR)/*


node_modules: .nvmrc
	$(NVM) install


$(OUT_HTML_FILES): $(HTML_FILES)
	@mkdir -p $(@D)
	rsync -a --no-times $(patsubst $(DEPLOY_DIR)/%, src/%, $(@)) $(@)

.PHONY: html
html: $(OUT_HTML_FILES)
	@echo "--== HTML synced ==--"


$(OUT_JS_FILES): $(TS_FILES) node_modules
	$(TSC) -p tsconfig.json --outDir $(DEPLOY_DIR)/js

.PHONY: js
js: $(OUT_JS_FILES)
	@echo "--== JS synced   ==--"


$(OUT_CSS_FILES): $(OUT_HTML_FILES) $(OUT_JS_FILES) src/css/tailwind.css tailwind.config.js node_modules
	$(TAILWIND) -i src/css/tailwind.css -o $(DEPLOY_DIR)/css/tailwind.css

.PHONY: css
css: $(OUT_CSS_FILES)
	@echo "--== CSS synced  ==--"


.PHONY: all
all: html js css