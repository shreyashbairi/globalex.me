# Page generator (optional)

The eleven `.html` files at the repo root are **fully self-contained** — every
line of CSS and JS is inlined, and they open straight from disk. Nothing here is
needed to run or deploy the site.

This folder only exists so shared chrome doesn't have to be edited eleven times.

    node _src/build.js      # rewrites all 11 .html files at the repo root

- `kernel-css.js` — the whole design system (tokens, chrome, components)
- `kernel-js.js`  — shared runtime (preloader, cursor, rails, reveals, canvas engine)
- `shell.js`      — header, footer, gül mark, instrument frame, preloader markup
- `parts.js`      — reusable page hero and CTA
- `pages/*.js`    — one file per page: metadata, body, page-specific CSS/JS

Third-party code is CDN-only and loaded at runtime: Three.js r128 (index globe)
and Google Fonts. No build tooling, no package.json, no API keys.
