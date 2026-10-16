#!/usr/bin/env python3
"""
Tiny static dev server for this site.

It mimics the "clean URL" behaviour of Cloudflare Pages / Netlify:
    /            -> index.html
    /setup       -> setup.html
    /foo/        -> foo/index.html

Usage:
    python3 serve.py            # serves on http://localhost:8080
    python3 serve.py 3000       # pick another port
"""

import os
import sys
import http.server
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        local = super().translate_path(path)
        if os.path.isdir(local):
            index = os.path.join(local, "index.html")
            if os.path.isfile(index):
                return index
        if not os.path.exists(local):
            # /setup -> setup.html
            if os.path.isfile(local + ".html"):
                return local + ".html"
            # /about/ -> about.html
            if local.endswith(os.sep):
                trimmed = local.rstrip(os.sep)
                if os.path.isfile(trimmed + ".html"):
                    return trimmed + ".html"
            if os.path.isfile(os.path.join(ROOT, "404.html")):
                return os.path.join(ROOT, "404.html")
        return local

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print("Serving %s at http://localhost:%d  (Ctrl+C to stop)" % (ROOT, PORT))
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nbye")
