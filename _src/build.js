const fs = require("fs");
const path = require("path");

const KCSS = require("./kernel-css");
const KJS = require("./kernel-js");
const { header, footer, chrome, loader } = require("./shell");
const { html, jsonScript, xml } = require("./esc");
const S = require("./schema-org");
const ogPlate = require("./og-plate");

/* Repo root, derived rather than hardcoded — LOGO_B64 below reads through it
   at module load, so a wrong value fails at require() time, not at write. */
const OUT = path.resolve(__dirname, "..");
const HERE = __dirname;

/* Absolute origin for canonical, og:url and the sitemap. Apex, not www; the
   www host must 301 here, which is a DNS/Pages setting rather than code. */
const SITE = "https://globalex.me";
const OG_IMAGE = "assets/og-default.png";

/* Cloudflare Pages 308-redirects /about.html to /about, and /index.html to /.
   Verified against `wrangler pages dev`. So every URL we *assert* — canonical,
   og:url, twitter:image's page, breadcrumb items, sitemap <loc> — uses the
   extensionless form Pages actually answers 200 for. A canonical pointing at a
   redirect is a wasted signal, and Google reports sitemap URLs that redirect.

   Internal hrefs keep their .html form. They resolve through the same 308, and
   rewriting every link across twelve page modules is a larger, separate change
   with its own regression surface. */
const urlFor = (page) => (page === "index" ? `${SITE}/` : `${SITE}/${page}`);
const hrefToUrl = (href) =>
  urlFor(
    String(href)
      .replace(/^\/+/, "")
      .replace(/\.html$/, ""),
  );

const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
const THREE_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

// The logo is white-on-transparent, so it also gets served on the brand plate
// for light browser chrome — same file, unmodified, just composited.
const LOGO_B64 = fs
  .readFileSync(path.join(OUT, "assets/logo.webp"))
  .toString("base64");
const faviconPlate =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 70 70">` +
      `<rect width="70" height="70" fill="#0F2A38"/>` +
      `<image xlink:href="data:image/webp;base64,${LOGO_B64}" x="2" y="7" width="66" height="56"/>` +
      `</svg>`,
  );

/* Sitemap hints by page tier. Tier is declared on the page module; no page
   carries a raw priority number, so the ranking stays consistent. */
const PRIORITY = { home: "1.0", class: "0.8", company: "0.6", legal: "0.3" };
const CHANGEFREQ = {
  home: "weekly",
  class: "monthly",
  company: "monthly",
  legal: "yearly",
};

/* ------------------------------------------------------------------ render */

function render(p) {
  const three = p.three ? `<script src="${THREE_CDN}"></script>\n` : "";
  const canonical = p.canonical || urlFor(p.page);
  const ogImage = `${SITE}/${p.ogImage || OG_IMAGE}`;
  const title = html(p.title);
  const desc = html(p.desc);

  /* One script block per page holding an @graph, rather than a stack of
     blocks. Nodes reference the company by @id instead of restating it, so a
     validator sees one Organization per page and not several. */
  const ld = S.graph([
    S.organization({ site: SITE, logo: "assets/logo.webp" }),
    S.webSite({ site: SITE }),
    p.crumb ? S.breadcrumbList(p.crumb, { url: hrefToUrl }) : null,
    ...(p.jsonld ? [].concat(p.jsonld) : []),
  ]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#0F2A38" />
<meta name="color-scheme" content="dark" />
<title>${title}</title>
<meta name="description" content="${desc}" />
${p.noindex ? `<meta name="robots" content="noindex, nofollow" />\n` : ""}<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${html(S.LEGAL_NAME)}" />
<meta property="og:locale" content="en_US" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:width" content="${ogPlate.W}" />
<meta property="og:image:height" content="${ogPlate.H}" />
<meta property="og:image:alt" content="${html(ogPlate.TAGLINE)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${ogImage}" />
<link rel="icon" type="image/svg+xml" href="${faviconPlate}" />
<link rel="alternate icon" type="image/webp" href="assets/logo.webp" />
<link rel="apple-touch-icon" href="assets/logo.webp" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${FONTS}" rel="stylesheet" />
${ld ? jsonScript(ld) + "\n" : ""}<style>${KCSS}${p.css || ""}</style>
</head>
<body data-page="${p.page}">

${loader}
${chrome}
<a class="skip" href="#main">Skip to content</a>

${header(p.page, p.nav)}

<main id="main">
${p.draft ? `<div class="draft-flag" role="status">Draft &mdash; placeholder content, not published</div>\n` : ""}${p.body}
</main>

${footer()}

${three}<script>${KJS}</script>
${p.js ? `<script>${p.js}</script>` : ""}
</body>
</html>
`;
}

/* ---------------------------------------------------------------- manifest */

/* Every marketing page is written through emit(), and the sitemap is built
   from what emit() recorded. That is the point: the sitemap cannot list a
   page that was never written, and cannot omit one that was. */
const MANIFEST = [];
const SEEN = new Set();

const mtimes = new Map();
const mtime = (f) => {
  if (!mtimes.has(f)) mtimes.set(f, fs.statSync(f).mtimeMs);
  return mtimes.get(f);
};

/* lastmod tracks CONTENT, deliberately not chrome. If kernel-css.js counted,
   one token tweak would stamp today's date on every page at once, and a
   sitemap whose lastmods all move in lockstep is discounted as noise. */
const lastmod = (files) =>
  new Date(Math.max(...files.map(mtime))).toISOString().slice(0, 10);

function record(mod, file, srcFiles) {
  MANIFEST.push({
    page: mod.page,
    file,
    url: mod.canonical || urlFor(mod.page),
    noindex: !!mod.noindex,
    tier: mod.tier || "company",
    lastmod: srcFiles ? lastmod(srcFiles) : null,
  });
}

function emit(mod, srcFiles) {
  /* The filename comes from data, so it is validated rather than trusted —
     this is the guard that stops a future generated page from traversing a
     path or silently overwriting a hand-authored one. */
  if (!/^[a-z0-9][a-z0-9-]*$/.test(mod.page))
    throw new Error(`build: unsafe page id "${mod.page}"`);
  const file = `${mod.page}.html`;
  if (SEEN.has(file)) throw new Error(`build: duplicate output "${file}"`);
  SEEN.add(file);

  const out = path.join(OUT, file);
  fs.writeFileSync(out, render(mod));
  record(mod, file, srcFiles);
  console.log(`  ${file}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}

/* ----------------------------------------------------------------- emitters */

/* The Worker cannot require() out of _src, so emit an ESM copy of the
   catalogue it can import. One source of truth, no drift between what the
   page offers and what the backend will serve. */
function emitDocCatalogue() {
  const { DOCS } = require("./docs");
  const slim = DOCS.map((d) => ({
    id: d.id,
    kind: d.kind,
    code: d.code,
    title: d.title,
    sub: d.sub,
    key: d.key,
    pages: d.pages,
    bytes: d.bytes,
    origin: d.origin,
  }));
  const out = path.join(OUT, "functions/_lib/docs.js");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(
    out,
    `/* GENERATED by _src/build.js from _src/docs.js — do not edit by hand. */\n\n` +
      `export const DOCS = ${JSON.stringify(slim, null, 2)};\n\n` +
      `export const DOC_BY_ID = Object.fromEntries(DOCS.map((d) => [d.id, d]));\n`,
  );
  console.log(`  functions/_lib/docs.js  ${slim.length} document(s)`);
}

/* The dashboard is an app, not a marketing page — it takes none of the site
   chrome, so it gets its own minimal shell rather than render(). It still
   records itself as noindex, so the sitemap excludes it by rule rather than
   by a special case and the page count stays honest. */
function emitAdmin() {
  const a = require("./admin");
  const out = path.join(OUT, "admin.html");
  fs.writeFileSync(
    out,
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<meta name="theme-color" content="#0F2A38" />
<meta name="color-scheme" content="dark" />
<title>Control — Globalex Trading FZCO</title>
<link rel="icon" type="image/svg+xml" href="${faviconPlate}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${a.FONTS}" rel="stylesheet" />
<style>${a.css}</style>
</head>
<body>
${a.body}
<script>${a.js}</script>
</body>
</html>
`,
  );
  SEEN.add("admin.html");
  record({ page: "admin", noindex: true, tier: "company" }, "admin.html", null);
  console.log(`  admin.html  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}

/* The social card. The SVG is generated; the PNG beside it is rasterised by
   `npm run og` and committed, because that is what a crawler fetches — none
   of them will follow a data: URI and most reject SVG. */
function emitOgPlate() {
  const svgPath = path.join(OUT, "assets/og-default.svg");
  fs.writeFileSync(svgPath, ogPlate.svg());
  const png = path.join(OUT, OG_IMAGE);
  if (!fs.existsSync(png)) {
    console.log(
      `  ! ${OG_IMAGE} is missing — run \`npm run og\`. og:image is a dead link until then.`,
    );
  } else if (fs.statSync(svgPath).mtimeMs > fs.statSync(png).mtimeMs + 1000) {
    console.log(`  ! ${OG_IMAGE} is older than the plate — run \`npm run og\`.`);
  }
}

function emitSitemap() {
  const rows = MANIFEST.filter((p) => !p.noindex);
  const body = rows
    .map(
      (p) =>
        `  <url>\n` +
        `    <loc>${xml(p.url)}</loc>\n` +
        (p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>\n` : "") +
        `    <changefreq>${CHANGEFREQ[p.tier] || "monthly"}</changefreq>\n` +
        `    <priority>${PRIORITY[p.tier] || "0.6"}</priority>\n` +
        `  </url>`,
    )
    .join("\n");
  fs.writeFileSync(
    path.join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<!-- GENERATED by _src/build.js from the pages actually written. Do not edit. -->\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  );
  console.log(`  sitemap.xml  ${rows.length} url(s)`);
}

function emitRobots() {
  fs.writeFileSync(
    path.join(OUT, "robots.txt"),
    `# GENERATED by _src/build.js — do not edit by hand.\n` +
      `User-agent: *\n` +
      `Allow: /\n` +
      `\n` +
      `# The dashboard is staff-only.\n` +
      `Disallow: /admin.html\n` +
      `# Endpoints, not pages.\n` +
      `Disallow: /api/\n` +
      `# Tokenised document links are per-recipient and must never be indexed.\n` +
      `Disallow: /d/\n` +
      `Disallow: /f/\n` +
      `\n` +
      `Sitemap: ${SITE}/sitemap.xml\n`,
  );
  console.log(`  robots.txt`);
}

/* --------------------------------------------------------------------- main */

function main() {
  emitDocCatalogue();
  emitOgPlate();

  const files = fs
    .readdirSync(path.join(HERE, "pages"))
    .filter((f) => f.endsWith(".js"))
    .sort();
  for (const f of files) {
    const mod = require(path.join(HERE, "pages", f));
    emit(mod, [path.join(HERE, "pages", f)]);
  }

  emitAdmin();
  emitSitemap();
  emitRobots();

  console.log(`\n${MANIFEST.length} page(s) written.`);
}

main();
