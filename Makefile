.PHONY: server screenshot-headless screenshot-xvfb

server:
	@python -m SimpleHTTPServer 8000

screenshot-headless:
	@node screenshot.js --headless=true

screenshot-xvfb:
	@xvfb-run --server-args='-screen 0 1500x1500x16' node screenshot.js --headless=false
