# Globalex Trading FZCO — Site Upgrade Implementation Brief

You are working on **globalex.me**, the corporate site for Globalex Trading FZCO — a freezone commodity trading house in Jumeirah Lakes Towers, Dubai, dealing in fertilizers, polymers and industrial chemicals sourced from Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan.

This brief implements 14 approved upgrades derived from a competitive analysis of nitrongroup.com, trammo.com, eurochemgroup.com and hexagon-group.com. Work through the phases in order — later phases depend on earlier ones.

---

## 0. Read this before writing any code

### 0.1 How the site is built

This is **not** a hand-edited HTML site. It is a static site generator written in plain Node with zero runtime dependencies.

```
_src/build.js          entry point — `npm run build`
  ├── reads _src/pages/*.js      one module per page
  ├── wraps each in render()     <head>, loader, chrome, header, footer
  ├── inlines _src/kernel-css.js as a <style> block on every page
  ├── inlines _src/kernel-js.js  as a <script> block on every page
  ├── writes <page>.html         to the repo root
  ├── emits functions/_lib/docs.js  (ESM copy of the doc catalogue for the Worker)
  └── emits admin.html           (separate minimal shell, not the marketing chrome)
```

**Every `*.html` file at the repo root is generated output.** Never edit them by hand — your edit will be destroyed on the next build. Edit the `_src/` module and run `npm run build`.
ooooooooooooooooo
Each page module exports:

```js
module.exports = {
  page: "about", // → about.html, and <body data-page="about">
  title: "About — Globalex Trading FZCO",
  desc: "…", // meta description + og:description
  three: false, // optional — true loads the three.js CDN bundle
  css: `…`, // page-scoped CSS, injected after the kernel
  body: `…`, // page HTML, injected inside <main id="main">
  js: `…`, // optional page script; define window.glxPage to run on ready
};
```

### 0.2 Key files

| File                 | Role                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `_src/build.js`      | Renderer + `<head>` construction. Modify for SEO work.                                                                           |
| `_src/shell.js`      | Header, nav, search overlay, footer, frame chrome, loader. Modify for nav work.                                                  |
| `_src/catalogue.js`  | **Single source of truth** for all 24 grades, the 3 classes, the page list and the flattened search index.                       |
| `_src/kernel-css.js` | The design system. Inlined into every page.                                                                                      |
| `_src/kernel-js.js`  | All shared behaviour. Inlined into every page.                                                                                   |
| `_src/parts.js`      | Reusable `hero({...})` and `cta({...})` section builders.                                                                        |
| `_src/docs.js`       | Controlled-document register (MSDS / TDS / SPEC metadata).                                                                       |
| `_src/docgate.js`    | The gated document UI — register, specimen panel, access modal.                                                                  |
| `_src/pages/*.js`    | The 12 page modules.                                                                                                             |
| `functions/`         | Cloudflare Pages Functions — `api/contact`, `api/request`, `api/track`, `api/pv`, `api/admin/*`, `d/[token].js`, `f/[token].js`. |
| `schema.sql`         | D1 schema.                                                                                                                       |
| `wrangler.toml`      | Bindings: `DB` (D1), `DOCS` (R2).                                                                                                |

Commands: `npm run build` · `npm run dev` (wrangler pages dev on :8788) · `npm run db:local`

### 0.3 The catalogue contract

`_src/catalogue.js` feeds three consumers that must never disagree: the three class pages, `products.html`, and the header search overlay. Adding a grade there puts it on its class page, in the products grid and in site search simultaneously. **Preserve this property.** Every new data file you create in this brief must follow the same rule: one source of truth, consumed by every surface that needs it, and folded into `searchIndex()` where users would reasonably search for it.

Helpers exported from `catalogue.js` you will reuse:

- `slug(s)` — generates anchor/URL ids; folds HTML entities first
- `plain(s)` — strips tags and entities to build search haystacks
- `CLASSES`, `FERTILIZERS`, `POLYMERS`, `CHEMICALS`, `SECTORS`, `PAGES`, `searchIndex()`

### 0.4 Design system — obey it

**Colour law (stated in `kernel-css.js`, enforce it):** cyan = system / network / document. sand = material / cargo. Do not mix these up. A shipping document is cyan. A tonne of urea is sand.

```
--void:#0F2A38  --deep:#143544  --panel:#173B4A  --steel:#23596B
--cyan:#35D6F5  --cyan-d:#0FA8C9   (system accent)
--sand:#D9B778  --sand-d:#B8934E   (material accent)
--frost:#E9F3F6 --haze:#B4C9D2 --haze-d:#8FAAB6   (text ramp)
--line:rgba(146,190,204,.19)   --line-2:rgba(146,190,204,.34)
--f-disp:Archivo   --f-body:'Instrument Sans'   --f-mono:'IBM Plex Mono'
```

Existing structural classes to reuse rather than reinvent: `.sec` `.sec-panel` `.is-tight` `.wrap` `.hd` `.eb` (`.eb.mat` for sand) `.lead` `.split.is-1-2` `.g3` `.card.pil` `.ix` `.lk` `.btn` `.btn-p` `.btn-o` `.btn-m` `.chips` `.chip` (`.spec` / `.org`) `.mono` `.stats` `.stat` `.form` `.fld` `.f-row` `.crumb` `.ph` `.ph-meta`.

Behaviour hooks provided by `kernel-js.js`:

- `.rv` — reveal on scroll; `--d:120ms` for stagger
- `.rvs` — reveal children in sequence
- `.kin` — kinetic headline reveal
- `[data-stat]` with a child `[data-to="24"][data-dur="1500"]` — count-up
- `[data-mag="6"]` — magnetic pointer pull on buttons
- `[data-sec="Label"]` — feeds the left rail section readout
- `[data-orn]` / `[data-lat]` / `[data-vis]` — canvas ornament stages
- `window.glxStage(canvas, drawFn)` — shared RAF canvas driver (visibility-gated)
- Define `window.glxPage = function(){…}` in a page's `js` to run on ready

**The signature corner-notch treatment** — use it on panels, not everything:

```css
clip-path: polygon(
  0 0,
  calc(100% - 20px) 0,
  100% 20px,
  100% 100%,
  20px 100%,
  0 calc(100% - 20px)
);
```

### 0.5 Hard constraints

1. **No build-time dependencies.** `package.json` has exactly one devDependency (`wrangler`). Do not add a framework, bundler, CSS processor or templating library. Plain Node string generation only.
2. **No external runtime scripts** beyond the two already in use (Google Fonts, the three.js CDN on `index.html`). No analytics SDKs, no tag managers.
3. **Dark theme only.** `<meta name="color-scheme" content="dark">` is deliberate.
4. **Accessibility is not optional.** Every interactive control needs a reachable name, visible focus, and correct ARIA. The existing search overlay is the reference implementation — match its quality.
5. **Respect `prefers-reduced-motion`.** Every animation added must check it.
6. **Delete `assets/css/`.** All five files (2,678 lines, a light-theme token set) are dead code — nothing in the repo references them. Remove the directory as part of Phase 0.

### 0.6 Placeholder data policy — read carefully

Four work items need real-world data that does not exist yet: leadership bios, product specification figures, office addresses, and news posts.

Create the data files with **obviously fake placeholder values** and this exact header on each:

```js
/* ============================================================
   ⚠️  PLACEHOLDER DATA — NOT FOR PRODUCTION
   Every value below is invented. Replace with verified company
   data before this page ships. Do not deploy as-is.
   ============================================================ */
```

Placeholder values must be self-evidently fake — `"[Name to be confirmed]"`, `"[Role]"`, `"00.0"`, `"[HS code]"`. **Never invent a plausible-looking specification figure, certificate number, licence number or person's name.** A fake-but-believable assay value on a fertilizer spec sheet is a commercial liability; an obviously blank one is merely unfinished.

Each affected page must render a visible build-time banner while placeholder data is present:

```html
<div class="draft-flag" role="status">
  Draft — placeholder content, not published
</div>
```

Style it loud (sand background, dark text, full-bleed). Gate it on a `DRAFT: true` flag in the data file so removing the flag removes the banner.

---

## Phase 1 — Build pipeline & SEO foundation

_Do this first: later phases generate pages that must inherit the new `<head>`._

### 1.1 Extend `render()` in `_src/build.js`

Add a `SITE` constant (`https://globalex.me`) and extend the page-module contract with optional `canonical`, `ogImage`, `jsonld`, and `noindex` fields.

Add to every generated `<head>`:

- `<link rel="canonical" href="${SITE}/${p.page}.html">` — honour `p.canonical` when set
- `<meta name="twitter:card" content="summary_large_image">` plus `twitter:title`, `twitter:description`, `twitter:image`
- `<meta property="og:url">` and `<meta property="og:image">` (default to a site-wide OG image; see 1.4)
- `<meta name="robots" content="noindex, nofollow">` when `p.noindex`

Escape all interpolated values — `title` and `desc` currently go in raw and a stray quote would break the tag.

### 1.2 JSON-LD

Emit a `<script type="application/ld+json">` block per page:

- **Every page** — `Organization`: legal name `Globalex Trading FZCO`, url, logo, `foundingDate: "2019"`, `PostalAddress` (2605 X3 Tower, Cluster X, Jumeirah Lakes Towers, 337622 Dubai, AE), `ContactPoint` (`+971 4 566 7713`, `contact@globalex.me`, `contactType: "sales"`, `availableLanguage: ["en"]`), `sameAs` → the LinkedIn URL already in the footer.
- **Every page except home** — `BreadcrumbList` built from the same `crumb` array `parts.js#hero()` already receives. Refactor `hero()` to return both the markup and the crumb data so the two cannot drift.
- **Per-product pages (Phase 3)** — `Product` with `name`, `description`, `category`, `sku` (the slug), `brand`, and `additionalProperty` entries for each spec row.
- **News posts (Phase 4)** — `NewsArticle` with `headline`, `datePublished`, `dateModified`, `author`, `publisher`.

Build these as small functions in a new `_src/schema-org.js` so page modules stay declarative.

### 1.3 `sitemap.xml` and `robots.txt`

Generate both in `build.js` after the page loop, from the actual list of rendered pages — never a hand-maintained list.

- `sitemap.xml` — every page except `admin.html` and anything flagged `noindex`. Include `<lastmod>` from the source module's `mtime`, and `<changefreq>`/`<priority>` (home `1.0`, class + product pages `0.8`, company pages `0.6`, legal `0.3`).
- `robots.txt` — allow all, disallow `/admin.html`, `/api/`, `/d/`, `/f/`, and point at the sitemap.

Add both to `.assetsignore` review — confirm they are _served_, not ignored.

### 1.4 Open Graph image

Generate a static `assets/og-default.png` equivalent as an SVG data URI built in `build.js` — reuse the `faviconPlate` pattern already there. Deep petrol ground, the logo, the wordmark, and the tagline "The Caspian corridor, operated from Dubai." 1200×630.

**Acceptance:** `curl localhost:8788/sitemap.xml` lists every page; every page passes a JSON-LD validator; no page emits a duplicate canonical.

---

## Phase 2 — Navigation: grouped mega-menus

Restructure `_src/shell.js` from six flat items to **four top-level items, each with a mega-menu**.

### 2.1 Structure

```
COMPANY ▾        PRODUCTS ▾        TRADE ▾              SUSTAINABILITY
├ About          ├ Fertilizers     ├ Trade Procedures   (direct link, no menu)
├ Leadership       (5 grades)      ├ Logistics & Shipping
├ Locations      ├ Polymers        └ Compliance & Certifications
├ News             (3 families)
└ Careers        ├ Industrials
                   (16 grades)
                 └ All products →
```

Keep the existing right-hand cluster unchanged: search trigger (`⌘K`), then the `Get in touch →` button.

### 2.2 Products mega-menu — full-width panel

Four columns inside a full-bleed dropdown:

1. **Fertilizers** — all 5 grades, linked to their Phase 3 detail pages
2. **Polymers** — all 3 families
3. **Industrial Chemicals** — first 8 grades, then `+ 8 more →` to `industrials.html`
4. **Featured** — a small corridor-globe thumbnail (static canvas ornament, not a second three.js instance), a link to the gated document register, and a link to `products.html`

Drive every column from `CLASSES` in `catalogue.js`. Hard-coding grade names in `shell.js` is a defect — a grade added to the catalogue must appear in the menu with no other edit.

### 2.3 Company and Trade menus

Narrower panels, same visual language as the existing `.menu` dropdown: `<b>` label plus `<small>` descriptor per row. Reuse the existing styling rather than authoring a second dropdown aesthetic.

### 2.4 Behaviour

- Open on hover **and** on focus; close on `Escape`, on blur out of the panel, and on outside click
- `aria-haspopup="true"` / `aria-expanded` maintained on the trigger; `role="menu"` / `role="menuitem"` inside
- Full keyboard path: `Tab` to trigger → `↓` or `Enter` opens → arrows move within → `Escape` closes and restores focus
- 120 ms open delay, 240 ms close delay, so a diagonal mouse path to a menu item does not dismiss the panel
- Top-level item gets `data-cur` when any descendant page is active — extend the existing `page` matching logic
- Under `prefers-reduced-motion`, panels appear without transform/fade

### 2.5 Mobile nav

Extend `#mnav` to the new IA with collapsible groups (`<details>`/`<summary>` is acceptable and cheap). Keep the existing numbered-index treatment (`<i>01</i>`) and the contact block at the bottom.

### 2.6 Footer

Update the footer columns to mirror the new IA — the current _Commodities / Company / Dubai Desk_ grid becomes _Commodities / Company / Trade / Dubai Desk_. Add News, Locations, Logistics and Compliance to the appropriate columns.

**Acceptance:** every new page in this brief is reachable from the header within two interactions; keyboard-only navigation reaches every menu item; adding a test grade to `catalogue.js` makes it appear in the mega-menu after a rebuild.

---

## Phase 3 — Product depth

### 3.1 Per-product detail pages

Generate one page per grade — 24 pages — from the existing catalogue. **No new page module per product.** Extend the `build.js` loop with a second generator that iterates `CLASSES → items` and renders through a shared template.

**URLs:** `<class>-<slug>.html` (e.g. `fertilizers-urea-b-n46.html`, `industrials-labsa.html`). Flat root-level files, consistent with the existing output. Update `catalogue.js` to expose a `url` field per item and switch every existing deep link (currently `fertilizers.html#urea-b-n46`) to the new page. Keep the anchors working on class pages so old links do not break.

**Page template** (new `_src/product-page.js`):

1. `hero()` from `parts.js` — crumb `Home / Products / <Class> / <Grade>`, eyebrow `Class 0N · <Class>`, `h1` = grade name, lead = the catalogue `body` copy, `ph-meta` showing NPK or formula, form, and origin count
2. **Specification table** (§3.2)
3. **Applications** — where the grade ends up; a `.g3` of `.card.pil` items
4. **Origins strip** — reuse the `.led` origin-ledger row treatment from `index.js`, filtered to this grade's `origins`
5. **Documents** — if a doc in `_src/docs.js` matches this grade, surface the gated register row inline via `docgate`; otherwise show a "request specification" CTA that deep-links into the register
6. **Related grades** — three cards from the same class
7. `cta()` from `parts.js`, pre-worded for this grade: _"Tell us the tonnage, the port and the window for `<grade>`."_ Pass the grade through to `contact.html` as a query param and have the contact form pre-select the commodity class and pre-fill the message textarea.

Add every product page to `PAGES`/`searchIndex()` so `⌘K` search returns the page, not just the anchor.

### 3.2 Structured specification tables

New file `_src/specs.js`, keyed by product id, following the placeholder policy in §0.6.

```js
const SPECS = {
  "urea-b-n46": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method]
      ["Nitrogen (N)", "[--]", "[--]", "[--]", "%", "[ISO ----]"],
      ["Biuret", "[--]", "—", "[--]", "%", "[ISO ----]"],
      ["Moisture", "[--]", "—", "[--]", "%", "[ISO ----]"],
    ],
    physical: {
      form: "Prilled / granular",
      colour: "White",
      bulkDensity: "[--] kg/m³",
      granulometry: "[--] mm",
    },
    packaging: ["Bulk", "Big bag 1,000 kg", "PP bag 50 kg"],
    trade: {
      hsCode: "[HS code]",
      loadPorts: ["Turkmenbashi", "Aktau"],
      incoterms: ["FOB", "CFR", "CIF"],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  // … one entry per grade
};
```

**Render as three panels:**

- **Typical analysis** — a real `<table>` with `<caption>`, `<thead>`, scope-d headers. Mono figures, `font-variant-numeric: tabular-nums`, right-aligned numerics. Parameter rows in `--haze`, values in `--frost`. Hairline `--line` row separators, no vertical rules.
- **Physical & packaging** — definition-list grid, matching the `.dv-tab` pattern already in `docgate.js`
- **Trade terms** — HS code, load ports, Incoterms, minimum lot. Ports as `.chip` elements; Incoterms as `.chip.spec`.

Sand accent for material figures, cyan for document/method references — the colour law applies here.

On narrow viewports the analysis table must scroll inside its own `overflow-x:auto` container, never force the page to scroll sideways.

### 3.3 Product filter & compare on `products.html`

`_src/pages/products.js` currently renders every grade behind one search box. Add, above the grid:

**Faceted filters** — a horizontal filter bar with grouped toggle chips:

- Class (Fertilizers / Polymers / Industrials)
- Origin (Turkmenistan / Uzbekistan / Kazakhstan / Azerbaijan / UAE / Saudi Arabia / China)
- Form (Prilled / Granular / Liquid / Solid / Bulk)
- Sector — reuse `SECTORS` from `catalogue.js`

Behaviour: multi-select within a group (OR), intersect across groups (AND). Live result count (`"12 of 24 grades"`). A `Clear all` control appears only when a filter is active. Filtering is instant and client-side — the catalogue is already inlined. Reflect active filters in the URL query string so a filtered view is shareable, and restore state on load. Filters must compose with the existing search box, not replace it.

**Compare** — a checkbox on each product card, maximum three selections. A sticky compare bar rises from the bottom edge showing selected grade names and a `Compare →` button. It opens a full-screen panel with a side-by-side table: one column per grade, rows drawn from `_src/specs.js` (analysis, physical, packaging, trade). Rows where all selected grades agree are dimmed; rows that differ stay at full contrast — the point of the view is the difference.

Compare state lives in `sessionStorage` so it survives navigation to a product page and back. Keyboard-accessible, `Escape` closes, focus trapped while open, focus restored on close.

**Acceptance:** 24 product pages build; every grade is reachable from search, mega-menu, class page and products grid; filters produce shareable URLs; compare works with 2 and 3 grades and refuses a 4th with a clear message.

---

## Phase 4 — New pages

All four use `hero()` and `cta()` from `parts.js`, get a `data-sec` rail label per section, and are registered in `PAGES`, `searchIndex()`, the mega-menu, the footer and the sitemap.

### 4.1 Newsroom — `news.html` + per-post pages

New data file `_src/news.js` (placeholder policy applies):

```js
const NEWS = [
  {
    id: "corridor-note-placeholder", // → news-corridor-note-placeholder.html
    date: "2026-01-01", // ISO, used for sort + <time> + JSON-LD
    kind: "Market note", // Market note | Corridor | Company | Product
    title: "[Headline to be written]",
    summary: "[One-paragraph standfirst]",
    body: `[Post body — HTML fragment]`,
    tags: ["urea", "turkmenistan"],
    DRAFT: true,
  },
];
```

**Index page** — reverse-chronological. Lead post gets a full-width feature treatment (large display heading, canvas ornament, kind chip, date in mono); the rest form a two-column list of `.card.pil` rows with kind chip, mono date, title, standfirst and a `.lk` "Read →". Add a kind filter bar reusing the Phase 3 chip toggles.

**Post pages** — generated by the same second-pass build loop as products. Crumb `Home / News / <title>`. Mono `<time datetime>` byline, kind chip, prose body constrained to `65ch`, and a "More from the desk" trio at the foot. `NewsArticle` JSON-LD.

Fold news posts into `searchIndex()` with `k: "News"`.

If every post is `DRAFT`, the index renders the draft banner and an honest empty state — not a fake feed.

### 4.2 Locations — `locations.html`

New data file `_src/locations.js` (placeholder policy applies) — `{ id, region, city, country, kind: "HQ" | "Origin desk" | "Representative", address, phone, email, coords: [lat, lon], note }`.

**The Dubai HQ entry is the only one that is real** — it already exists on `contact.html`. Every other entry is a placeholder until confirmed. Do not publish an office that does not exist.

Layout:

1. Hero
2. **Regional tabs** — Middle East / Central Asia / Caspian. Tabs, not a dropdown; `role="tablist"` with proper `aria-controls` and arrow-key movement.
3. **Office cards per region** — corner-notch panels: kind chip (HQ in cyan, others in sand), city + country as display heading, address block, `tel:` and `mailto:` links, mono coordinates. HQ card is double-width and carries the Google Maps embed already used on `contact.html` (same greyscale/hue-rotate filter — keep it in the palette).
4. **Corridor map** — reuse the `data-orn` canvas ornament with node markers at each location's coordinates. Do **not** instantiate a second three.js globe; the WebGL cost belongs to the homepage alone.
5. `cta()`

### 4.3 Compliance & Certifications — `compliance.html`

No new data file needed — content is declarative in the page module, but any licence or certificate **number** is placeholder-gated.

Sections:

1. Hero — eyebrow `Compliance · FZCO Freezone`, `ph-meta` showing licence status, jurisdiction, inspection standard
2. **Regulatory standing** — FZCO freezone licence, Dubai Customs registration, Dubai Chambers membership. Three panels; promote the chips already sitting in the footer into full statements here.
3. **Counterparty due diligence** — KYC onboarding, sanctions screening (OFAC / EU / UN consolidated lists), UBO verification, ongoing monitoring. Numbered `.obj` list, matching the objectives treatment on `about.html`.
4. **Quality assurance** — third-party inspection at load and discharge (SGS / Intertek / Bureau Veritas), certificate of analysis per shipment, sampling protocol, retained samples. Link to the gated document register.
5. **Anti-bribery & ethics** — a clear statement of position, plus how a concern is raised.
6. **Sanctions & trade controls** — the position on restricted destinations and end-use, stated plainly.
7. `cta()` — "Request our compliance pack"

Cyan throughout — this is documentation, not cargo.

### 4.4 Logistics & Shipping — `logistics.html`

Sections:

1. Hero
2. **Incoterms matrix** — a real `<table>`: rows FOB / CFR / CIF / DAP / EXW, columns for who bears carriage, insurance, export clearance, import clearance, risk transfer point. Cyan header row, hairline separators, horizontally scrollable on mobile.
3. **Load ports** — Turkmenbashi, Aktau, Baku, Jebel Ali. Panel per port: draft, berth availability, typical load rate, rail/road connection, onward routing. **All operational figures are placeholders.**
4. **Modes** — break bulk, containerised, ISO tank, big bag, bulk vessel. Icon-led grid; SVG icons drawn in the existing geometric line style (`stroke-width:4` on a `0 0 100 100` viewBox, matching the values icons on `about.html`).
5. **Packaging options** — bulk / 1,000 kg big bag / 50 kg PP bag / IBC / ISO tank, with the grades each suits. Drive from the `packaging` arrays in `_src/specs.js` so it cannot drift from the product pages.
6. **Documentation set** — bill of lading, certificate of origin, certificate of analysis, packing list, insurance certificate, phytosanitary where applicable. Cross-link to `procedures.html`.
7. **Transit times** — origin → destination matrix, placeholder figures, clearly marked as indicative.
8. `cta()`

Cross-link `procedures.html` ↔ `logistics.html` ↔ `compliance.html` in a consistent footer strip on all three — they are one story told in three parts.

---

## Phase 5 — About page: leadership and timeline

Both additions go into the existing `_src/pages/about.js`, between the HQ section and the Mission/Vision plates.

### 5.1 Leadership & team

New data file `_src/team.js` (placeholder policy applies) — `{ id, name, role, location, bio, image, linkedin, order }`.

**Every name, role, bio and photograph is a placeholder.** Do not invent a person. Use `"[Name to be confirmed]"` and a generated geometric avatar (the gül/rosette motif already used in the loader) rather than a stock photograph.

Card treatment: portrait-ratio panel with corner notch. Image (or generated avatar) with the same greyscale + palette-blend treatment used on `.plate` in `contact.js` — `filter:grayscale(1) contrast(1.12) brightness(.72)` plus the cyan/sand gradient overlay in `mix-blend-mode:color`. Name in display type, role in mono uppercase, location in `--haze-d`. Bio revealed by expanding the card in place (`<details>` or a height transition) — no modal.

Grid: three across on desktop, two on tablet, one on mobile. Hover lifts the card 4 px and shifts the border to `--line-2`. Respect reduced motion.

### 5.2 Company timeline

Data lives inline in `about.js` — these are facts you already have.

Vertical timeline, entries alternating left/right on desktop and collapsing to a single left-aligned rail on mobile. A continuous cyan hairline spine with a diamond node per entry (reuse the `clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)` diamond already used in `.hud-legend i`).

Seed entries — **2019 Founded** (FZCO freezone licence, Jumeirah Lakes Towers), **First Caspian corridor**, **Polymer book opened**, **Industrial chemicals to 16 grades**, **Today — 24 grades, 7 origin markets**. Year in large display type; title and one line of body per entry. Any year between 2019 and today that you cannot verify is a placeholder.

Animate the spine drawing downward as the section scrolls into view, nodes lighting in sequence — use the existing `IntersectionObserver` reveal machinery in `kernel-js.js` rather than a new observer. Under reduced motion, render fully drawn.

Update the About hero `ph-meta` to include a team size figure once `_src/team.js` is populated.

---

## Phase 6 — Sustainability: ESG metrics

Upgrade `_src/pages/sustainability.js` from six prose commitments to commitments **plus measurement**.

### 6.1 KPI band

Insert a `.stats` band below the hero using the existing count-up mechanism (`[data-stat]` + `[data-to]`). Four to six metrics — verified tonnage handled, origin audits completed, suppliers screened, shipments third-party inspected, documentation digitised.

**Every figure is a placeholder** until sourced. Where a metric is genuinely not yet tracked, show `—` with a mono caption `"Tracking from 2026"` rather than a fabricated number. That is more credible than a round invention, and it is honest.

### 6.2 Commitment detail

Each of the six existing commitments gains: a measurable target, current status, and the operational practice behind it. Expand each into an accordion (`<details>`/`<summary>`, styled, keyboard-accessible) so the page keeps its current scan-ability while carrying real depth.

### 6.3 Gated ESG report

Register a new entry in `_src/docs.js`:

```js
{
  id: "esg-report-2026", kind: "REPORT", code: "ESG-2026",
  title: "Sustainability & HSE Report", sub: "Annual · 2026",
  key: "esg-report-2026.pdf",   // R2 object key
  pages: 0, bytes: 0, origin: "Globalex Trading FZCO",
  summary: "[Report summary]",
}
```

`REPORT` is a new `kind` — add a colour case to the `.dr-k[data-kind]` rules in `docgate.js`. Use sand, matching TDS/SPEC, since it describes physical operations.

This flows automatically into the gated register, the emailed-token delivery path and the admin lead tracking — no backend change. Confirm `build.js#emitDocCatalogue()` carries the new entry to `functions/_lib/docs.js`, and upload the PDF with `npm run docs:upload` when it exists. Until then, the register row must not be rendered — filter out doc entries whose R2 object is not yet uploaded rather than shipping a broken request path.

Add a "Download the report" CTA in the sustainability hero that deep-links into the register with the row pre-selected.

---

## Phase 7 — Hero video

`assets/hero-1080.mp4` (8.5 MB) and `assets/hero-720.mp4` (3.3 MB) with `assets/hero-poster.jpg` (225 KB) are in the repo and **referenced by nothing**. Put them to work.

### 7.1 Where

**Not** on `index.html` — the three.js corridor globe is the homepage's signature and must not compete with a video for the same attention or the same GPU budget.

Instead, extend `parts.js#hero()` with an optional `video` parameter, and enable it on the interior pages whose subject the footage actually matches — `logistics.html`, `locations.html`, and `about.html`. Only use the footage where it is honest about what it depicts.

### 7.2 Implementation

```html
<video
  class="ph-vid"
  autoplay
  muted
  loop
  playsinline
  preload="none"
  poster="assets/hero-poster.jpg"
  aria-hidden="true"
  tabindex="-1"
>
  <source
    src="assets/hero-720.mp4"
    type="video/mp4"
    media="(max-width: 900px)"
  />
  <source src="assets/hero-1080.mp4" type="video/mp4" />
</video>
```

- `preload="none"` and attach the source only when the hero enters the viewport — 8.5 MB must never sit on the critical path
- Poster shows immediately; video fades in over 600 ms once `canplay` fires
- Treat the footage to the palette: `filter:grayscale(1) contrast(1.1) brightness(.55)` with a `linear-gradient(155deg, rgba(53,214,245,.28), rgba(15,42,56,.62))` overlay in `mix-blend-mode:color`, matching the `.plate` treatment on `contact.js`. The video must look like it belongs to this site, not like stock footage dropped in.
- A scrim gradient at the top of the hero keeps the header legible — the same `.hero::before` pattern used on `index.js`
- **Mute toggle** — bottom-right of the hero, mono uppercase label with a small icon, matching Hexagon's control. Track state in `sessionStorage`. It must have a real accessible name that updates (`"Unmute background video"` / `"Mute background video"`).
- **`prefers-reduced-motion: reduce`** → do not load or play the video at all; render the poster as a static background.
- **Save-Data** → honour `navigator.connection.saveData` the same way.
- Pause when the hero scrolls out of view (`IntersectionObserver`) and on `visibilitychange`.

Add `assets/*.mp4` to the Cloudflare cache headers review in `DEPLOY.md`.

---

## Phase 8 — Cookie consent & tracking gate

**This closes a live compliance gap.** `_src/kernel-js.js:728` fires a page-view beacon to `/api/pv` on every load, and `functions/api/track.js` records events — with no consent UI anywhere on the site, while `privacy-policy.html` is published.

### 8.1 Gate the beacons

In `kernel-js.js`, wrap both `/api/pv` and `/api/track` calls behind a consent check. **Default to not sending.** No beacon fires until consent is explicitly granted. Queue events that occur before a decision and flush them only on accept; discard them on reject.

Consent state: a first-party cookie `glx_consent` = `granted` | `denied`, 12-month expiry, `SameSite=Lax`, `Secure`, path `/`. Read it server-side in `functions/api/pv.js` and `functions/api/track.js` too and reject unconsented writes there — client-side gating alone is not a control.

Note in `DEPLOY.md` that `ANALYTICS_SALT` daily-hash visitor identification continues to apply on top of consent, not instead of it.

### 8.2 The banner

A bottom-anchored bar, not a full-screen modal — it must not block content.

- Panel styling consistent with the site: `--deep` background, `--line-2` border, corner notch on the top-left, backdrop blur
- Copy: one plain sentence — what is measured (page views and document requests), that it is anonymised, and a link to `privacy-policy.html`. No dark patterns.
- Three controls, **equal visual weight**: `Accept`, `Decline`, `Preferences`. Decline must not be styled as the lesser option — that is the pattern regulators penalise.
- `Preferences` expands the panel in place with two toggles: _Essential_ (always on, disabled, explained) and _Analytics_ (off by default).
- Appears 800 ms after load, animating up; skips the animation under reduced motion.
- `role="dialog"` `aria-label="Cookie preferences"` `aria-live="polite"`. Focus moves to the panel on appearance; `Escape` is equivalent to Decline. Not a focus trap — the user must be able to keep reading.
- Once decided, the banner never reappears for the cookie lifetime. Add a persistent `Cookie preferences` link in the footer legal row that reopens it.

Implement as a new `_src/consent.js` exporting `{ css, html, js }`, composed into `build.js#render()` so it lands on every page including `admin.html`.

### 8.3 Privacy policy

Update `_src/pages/privacy-policy.js` with a cookie table — name, purpose, duration, type — listing `glx_consent` and the analytics identifiers, and describe the consent mechanism and how to withdraw it.

---

## Verification

Run before declaring done:

1. `npm run build` — clean, no warnings. Confirm the expected file count: 12 existing pages + 24 product pages + news index + N post pages + `locations.html` + `compliance.html` + `logistics.html` + `admin.html` + `sitemap.xml` + `robots.txt`.
2. `npm run dev` and walk every page at 1440 px, 900 px and 390 px. No horizontal scroll at any width. Tables scroll inside their own containers.
3. **Keyboard-only pass** — reach every mega-menu item, every filter chip, the compare panel, the consent banner, and the accordions. Visible focus throughout. `Escape` closes every overlay and restores focus.
4. **Reduced-motion pass** — set the OS flag and confirm: no hero video loads, the timeline renders drawn, the mega-menu appears without transform, reveals are instant.
5. **Consent pass** — with a cleared cookie, confirm via devtools Network that zero requests hit `/api/pv` or `/api/track` before a choice is made; confirm Decline keeps it that way across a reload; confirm Accept flushes the queue.
6. **Catalogue integrity** — add a throwaway grade to `catalogue.js`, rebuild, and confirm it appears on its class page, the products grid, the mega-menu, `⌘K` search and the sitemap. Remove it.
7. **Placeholder audit** — grep for the placeholder header comment and confirm every file carrying it also renders the draft banner. No fabricated specification figure, licence number or person's name anywhere in the output.
8. Validate the JSON-LD on one product page, one news post and the homepage.
9. Confirm `assets/css/` is deleted and nothing references it.

---

## Out of scope — do not build

These were considered and explicitly declined. Do not add them, and do not leave scaffolding for them:

- **RFQ / quote basket.** No cross-page product basket, no multi-grade enquiry cart. The contact form stays a single-enquiry form (the Phase 3 pre-fill via query param is the approved extent).
- **Multi-language / region switcher.** English only. Do not extract strings into a locale layer, do not add a language selector, do not render per-locale page sets.

---

## Working order

Phases are dependency-ordered — 1 and 2 unblock everything else. Suggested commits:

1. Phase 0 + 1 — dead CSS removed, SEO foundation, sitemap, robots, JSON-LD
2. Phase 2 — navigation restructure
3. Phase 3 — product pages, spec tables, filter and compare _(largest phase; consider splitting product pages from filter/compare)_
4. Phase 4 — the four new pages
5. Phase 5 + 6 — About and Sustainability upgrades
6. Phase 7 — hero video
7. Phase 8 — consent

Build and verify at the end of each phase rather than at the end of the brief. Report honestly on anything that could not be completed, and never mark a phase done while its placeholder data still blocks publication — say so explicitly instead.
