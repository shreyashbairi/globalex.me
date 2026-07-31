# Page generator (optional)

The eleven `.html` files at the repo root are **fully self-contained** — every
line of CSS and JS is inlined, and they open straight from disk. Nothing here is
needed to run or deploy the site.

This folder only exists so shared chrome doesn't have to be edited eleven times.

    node _src/build.js      # rewrites all 11 .html files at the repo root

- `theme.js`      — every colour on the site; edit here, nowhere else
- `kernel-css.js` — the whole design system (tokens, chrome, components)
- `kernel-js.js`  — shared runtime (preloader, cursor, rails, reveals, canvas engine)
- `shell.js`      — header, footer, gül mark, instrument frame, preloader markup
- `parts.js`      — reusable page hero and CTA
- `pages/*.js`    — one file per page: metadata, body, page-specific CSS/JS
- `geo.js`        — baked Natural Earth 110m coastlines and land mask, for the
                    home-page globe. Generated and committed, not built.
- `geo-build.js`  — regenerates the above (`npm run geo`). Needs two source
                    files fetched by hand; see its header.

Canvas colours never come from CSS. A 2D context and a three.js material take
a string or an int, not a `var()`, so anything drawn to a canvas reads the
palette from `GLXC` and builds colours with `RGBA(name, alpha)`, both published
by `kernel-js.js`. A `var(--x)` in a `fillStyle` is silently ignored; the same
string in `addColorStop` throws and takes the rest of the caller with it.

Third-party code is CDN-only and loaded at runtime: Three.js r128 (index globe)
and Google Fonts. No build tooling, no package.json, no API keys.
