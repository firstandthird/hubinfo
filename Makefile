build: clean
	@git fetch origin
	@git checkout origin/master docs/index.md
	@node ~/code/markx-project/bin/markx-project.js --title "HubInfo | A Github Repo Widget" --user jgallen23 --repo hubinfo docs/index.md
	#@node node_modules/.bin/markx-project --title "HubInfo | A Github Repo Widget" --user jgallen23 --repo hubinfo docs/index.md

preview: build
	@python -m SimpleHTTPServer 8001

install:
	@npm install markx-project

clean:
	@rm -rf dist/*

.PHONY: preview install
