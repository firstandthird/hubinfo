SRC = $(shell find lib -type f)

all: dist/hubinfo.js

dist/hubinfo.js: $(SRC) 
	@./support/template.js lib/templates/default.html > template.js
	@./node_modules/.bin/masher masher.json
	cp -r lib/images dist/
	rm template.js


install:
	npm install masher
	npm install stylus

clean:
	rm -rf dist

preview:
	@python -m SimpleHTTPServer 8001

.PHONY: install clean preview
