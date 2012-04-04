SRC = $(shell find lib -type f)

all: dist/hubinfo.js

dist/hubinfo.js: $(SRC)
	@./node_modules/.bin/masher masher.json
	@cat lib/scripts/copyright.js dist/hubinfo.min.js > dist/hubinfo.min.tmp
	@mv dist/hubinfo.min.tmp dist/hubinfo.min.js
	@cp -r lib/images dist/

install:
	npm install masher
	npm install stylus

clean:
	rm -rf dist

preview:
	@python -m SimpleHTTPServer 8001

.PHONY: install clean preview
