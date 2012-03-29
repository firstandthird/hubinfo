SRC = $(shell find lib -type f)
TEMPLATES = $(shell find lib/templates -type f)

all: dist/hubinfo.js

dist/hubinfo.js: $(SRC)
	@./support/templates.js lib/templates dist/templates
	@./node_modules/.bin/masher masher.json
	@cp -r lib/images dist/


install:
	npm install masher
	npm install stylus

clean:
	rm -rf dist

preview:
	@python -m SimpleHTTPServer 8001

.PHONY: install clean preview
