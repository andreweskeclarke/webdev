NVM_DIR:=$(HOME)/.nvm
NVM_ENV:=\. "$(NVM_DIR)/nvm.sh"
NODE:=$(NVM_ENV) && nvm use && node

.PHONY: deps
deps:
	test -f "$(NVM_DIR)/nvm.sh"
	$(NVM_ENV) && nvm install


.PHONY: node
node:
	$(NODE)