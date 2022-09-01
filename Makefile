.DEFAULT_GOAL := build

NVM_DIR?=$(HOME)/.nvm
DEPLOY_DIR?=./dist

NVM_ENV:=\. "$(NVM_DIR)/nvm.sh"
NODE:=$(NVM_ENV) && nvm use && node
TSC:=$(NVM_ENV) && nvm use && tsc



.PHONY: deps
deps:
	test -f "$(NVM_DIR)/nvm.sh"
	$(NVM_ENV) && nvm install

.PHONY: clean
clean:
	rm -rf $(DEPLOY_DIR)


.PHONY: build
build: deps clean
	mkdir $(DEPLOY_DIR)
	$(TSC) -p tsconfig.json --outDir $(DEPLOY_DIR)
	rsync -a src/html/ $(DEPLOY_DIR)

