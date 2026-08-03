# Page generator (optional)

The `.html` files at the repo root are **fully self-contained** — every line of
CSS and JS is inlined, and they open straight from disk. Nothing here is needed
to run or deploy the site.

This folder only exists so shared chrome doesn't have to be edited once per
page.

    node _src/build.js      # rewrites every .html file at the repo root

- `theme.js`      — every colour on the site; edit here, nowhere else
- `kernel-css.js` — the whole design system (tokens, chrome, components)
- `kernel-js.js`  — shared runtime (preloader, cursor, rails, reveals, canvas engine)
- `shell.js`      — header, footer, gül mark, instrument frame, preloader markup
- `parts.js`      — reusable page hero and CTA
- `scene3d.js`    — the interior pages' WebGL hero stages, one scene per page.
                    A page opts in with `three: true`, a `stage:` on its hero
                    and `js: scene3d.bundle(name, data)`. Only the scene that
                    page asked for is inlined, never all nine.
- `pages/*.js`    — one file per page: metadata, body, page-specific CSS/JS
- `geo.js`        — baked Natural Earth 110m coastlines and land mask, for the
                    home-page globe. Generated and committed, not built.
- `geo-build.js`  — regenerates the above (`npm run geo`). Needs two source
                    files fetched by hand; see its header.
- `images-build.js` — encodes the product photographs from `_masters/products`
                    into `assets/products` (`npm run images`). Masters are
                    gitignored and must be backed up separately. Grades marked
                    `photo:false` in the catalogue are skipped — they have no
                    master yet.
- `placeholder-images.js` — draws the stand-in plate for exactly those grades
                    (`npm run placeholders`), at the same two paths, so no
                    page has to know whether a grade has been photographed.
- `product-images.md`        — the imagery brief: what the photographs are,
                    where they go, and what the stylesheet does to them.
- `product-images-build.js`  — one image-generation prompt per grade
                    (`npm run prompts`), expanded into `product-images-prompts.md`.

Canvas colours never come from CSS. A 2D context and a three.js material take
a string or an int, not a `var()`, so anything drawn to a canvas reads the
palette from `GLXC` and builds colours with `RGBA(name, alpha)`, both published
by `kernel-js.js`. A `var(--x)` in a `fillStyle` is silently ignored; the same
string in `addColorStop` throws and takes the rest of the caller with it.

Third-party code is CDN-only and loaded at runtime: Three.js r128 (the home
page globe and the eight interior stages) and Google Fonts. No build tooling,
no package.json, no API keys. Every scene falls back to the 2D gül ornament if
three.js or WebGL is unavailable, so no page depends on the CDN answering.
