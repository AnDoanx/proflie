# Mizu — Personal Site (editable source)

A fully working, editable copy of the site at **https://mizu.pages.dev/**.

Everything is plain static HTML + CSS + vanilla JavaScript. No build step, no
framework, no npm install required — edit a file, refresh the browser, done.

Original design & content by **MiyagawaMizu** ("Mizu"). This copy is provided as
a readable, editable project so you can study it and build your own version.
Please change the personal content (name, photos, social links, text) before
putting it online.

---

## 1. Run it locally

```bash
python3 serve.py          # -> http://localhost:8080
python3 serve.py 3000     # or pick another port
```

Then open <http://localhost:8080>.

> Why not just double-click `index.html`?
> The page loads its CSS/JS with relative paths and the `/setup` page has a
> "clean URL" (no `.html`). A real web server handles that; a plain file open
> does not. `serve.py` is a 60-line dev server that mimics the clean-URL
> behaviour of Cloudflare Pages, so every link works exactly like the live site.

Any other static server works too (`npx serve`, `php -S localhost:8080`, nginx,
Apache, ...) as long as it maps `/setup` → `setup.html`.

---

## 2. Project structure

```
.
├── index.html              ← home page (profile, bento widgets, social cards)
├── setup.html              ← /setup page (the gear / desk setup list)
├── 404.html                ← custom not-found page
├── favicon.ico             ← multi-size icon
├── serve.py                ← tiny local dev server (clean URLs)
├── _redirects              ← clean-URL rules for Cloudflare Pages / Netlify
├── .nojekyll               ← tells GitHub Pages to serve the folder as-is
│
├── css/
│   ├── style.css           ← main stylesheet (all home-page styling)
│   └── setup.css           ← setup-page styling
│
├── scripts/                ← the JavaScript (readable, see §4)
│   ├── script.js           ← status box, settings modal, password auth
│   ├── clock.js            ← live clock (Asia/Ho_Chi_Minh) + date + Halloween hairclip
│   ├── lanyard.js          ← Discord presence card (Lanyard API)
│   ├── plushie.js          ← the plushie / pet interaction + sound
│   └── setup.js            ← renders the gear list on /setup
│
├── _original-js/           ← the as-published JS, kept for reference
│
└── src/                    ← all media
    ├── assets/
    │   ├── fonts/          ← Minecraft.woff2 / .woff / .ttf / .eot
    │   ├── images/
    │   │   ├── backgrounds/   ← page backgrounds + animated GIFs + bike photo
    │   │   ├── decor/         ← heart.png
    │   │   ├── icons/         ← social + UI icons (svg / png / avif)
    │   │   ├── profile/       ← avatar + thumbnail
    │   │   └── social/        ← Facebook, Spotify, Steam, gmail, instagram, ...
    │   └── sounds/         ← nom-nom-nom.mp3
    ├── public/             ← food / item / ui pixel-art sprites
    ├── gamepad.svg
    └── *.webp / *.gif      ← character art used on the setup page
```

---

## 3. Where to edit what

| I want to change... | File | Look for |
| --- | --- | --- |
| Name, bio, tagline text | `index.html` | `.mememe`, `.username`, the `about-me` block |
| Avatar / banner images | `index.html` + `src/assets/images/profile/` | `av.gif`, `thumbnail*.jpg` |
| Social links & labels | `index.html` | `class="widget widget-social"` blocks |
| Colours, sizes, spacing | `css/style.css` | `:root` variables at the top |
| Background image / GIFs | `css/style.css` | `url(...)` rules + `src/assets/images/backgrounds/` |
| Clock timezone | `scripts/clock.js` | `timeZone: "Asia/Ho_Chi_Minh"` |
| Discord presence | `scripts/lanyard.js` | the Discord user ID near the top |
| Gear list on `/setup` | `scripts/setup.js` + `setup.html` | the gear data array |
| Status box text / image | `scripts/script.js` | `API_URL` (points at a Cloudflare Worker) |

Most colours live in one place — the `:root` block at the top of
`css/style.css` — so re-theming the whole site is usually a 10-line change.

---

## 4. About the JavaScript

The published site ships its JS **obfuscated** (variable names like `_0x4f2a1`,
hex string lookups, junk arithmetic). That is unusable for editing.

In this project the scripts have been:

1. **Deobfuscated** — every obfuscated string lookup resolved back to the real
   string, the string-rotation wrapper removed.
2. **Renamed** — `_0x…` identifiers replaced with clean sequential names.
3. **Beautified** — properly indented, one statement per line, comments kept.

The behaviour is unchanged; it is the same logic, just readable. The untouched
originals are in `_original-js/` if you ever want to diff them.

The CSS and HTML were likewise re-formatted (one rule / one attribute per line)
so they can be edited by hand.

---

## 5. Third-party services the page talks to

These are live calls the page makes to *someone else's* endpoints. If you keep
them, they will keep working; if you want your own version, replace them:

| Feature | Endpoint | Where |
| --- | --- | --- |
| Status bubble (text + emoji image) | `https://api.miyagawamizu.workers.dev/` | `scripts/script.js` |
| Discord presence card | Lanyard API | `scripts/lanyard.js` |
| Gear list on `/setup` | `https://gear.miyagawamizu.workers.dev` | `scripts/setup.js` |
| Fonts | Google Fonts | `<link>` in `index.html` |
| Embedded videos | YouTube nocookie | `scripts/setup.js` |

`scripts/script.js` also contains a password-gated "update status" panel that
POSTs to that same worker. The password itself is **not** in the front-end — it
is verified server-side. Keeping the panel means anyone can try passwords
against that worker, so for your own site either point `API_URL` at your own
worker or delete the settings modal (`.setting` button + `#setting-panel`).

---

## 6. Publishing it

It is a static folder, so any host works:

* **Cloudflare Pages** — drag the folder in, or connect a Git repo. Build command
  empty, output directory `/`. `_redirects` is already included and handles the
  `/setup` clean URL.
* **Netlify** — same thing, `_redirects` is understood natively.
* **GitHub Pages** — push the folder to a repo, enable Pages. `.nojekyll` is
  included so nothing gets filtered out.
* **Your own server** — drop it in the web root of nginx/Apache. Add a rewrite
  rule so `/setup` serves `setup.html`:

  ```nginx
  location /setup { try_files /setup.html =404; }
  ```

---

## 7. Known issues found in the original

* `404.html` references `./images/mahiro_flex.ico` — that file does not exist on
  the live site either, so the 404 page falls back to the browser's default
  icon. Point it at `./favicon.ico` if you care.
* `index.html` points `og:image` and `canonical` at `https://miyagawamizu.github.io/…`,
  a different domain from the one it is served on. Update those for your own
  deployment.
* The status bubble depends on that third-party worker, so if it is ever down or
  rate-limited the bubble will be empty. That is expected, not a bug in your copy.
