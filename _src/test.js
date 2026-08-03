/* Build-time assertions. `npm test` — plain Node, no framework.

   Scope is deliberately narrow: the pure functions that shape output, where
   a mistake is silent rather than loud. Escaping bugs do not throw, they
   just publish a broken tag or a JSON-LD block a crawler rejects. */

const assert = require("assert");
const { html, entities, decode, jsonScript, xml } = require("./esc");
const { slug, plain, CLASSES, SECTORS, searchIndex } = require("./catalogue");

let pass = 0;
const cases = [];
const t = (name, fn) => cases.push([name, fn]);

// ---------------------------------------------------------------- esc.html
t("html: authored entities survive untouched", () =>
  assert.strictEqual(
    html("Terms &amp; Conditions &mdash; Globalex"),
    "Terms &amp; Conditions &mdash; Globalex",
  ));
t("html: a bare ampersand is escaped", () =>
  assert.strictEqual(html("Smith & Sons"), "Smith &amp; Sons"));
t("html: a stray quote cannot break an attribute", () =>
  assert.strictEqual(html('He said "no"'), "He said &quot;no&quot;"));
t("html: numeric entities survive", () =>
  assert.strictEqual(html("Cl&#8322;"), "Cl&#8322;"));
t("html: angle brackets are escaped", () =>
  assert.strictEqual(html("a<b>c"), "a&lt;b&gt;c"));
t("html: null and undefined are empty, not the word", () => {
  assert.strictEqual(html(null), "");
  assert.strictEqual(html(undefined), "");
});

// -------------------------------------------------------------- esc.decode
t("decode: em dash entity becomes the character", () =>
  assert.strictEqual(decode("Globalex &mdash; FZCO"), "Globalex — FZCO"));
t("decode: subscript entity becomes the character", () =>
  assert.strictEqual(decode("Cl&#8322;"), "Cl₂"));
t("decode: tags are removed", () =>
  assert.strictEqual(decode("<p>hi <b>there</b></p>"), "hi there"));
t("decode: an unknown entity stays visible rather than vanishing", () =>
  assert.strictEqual(decode("x &zzz; y"), "x &zzz; y"));
t("decode: differs from plain() on an em dash", () => {
  assert.strictEqual(decode("a &mdash; b"), "a — b");
  assert.strictEqual(plain("a &mdash; b"), "a b");
});

// ---------------------------------------------------------- esc.jsonScript
t("jsonScript: closing script tag is unrepresentable in the body", () => {
  const out = jsonScript({ a: "</script><script>alert(1)</script>" });
  const body = out.slice(0, -"</script>".length);
  assert.ok(!body.includes("</script"), "body still contains a script close");
});
t("jsonScript: output round-trips to the identical value", () => {
  const v = "</script> & <b>   end";
  const out = jsonScript({ a: v });
  const body = out.replace(/^[^{]*/, "").replace(/<\/script>$/, "");
  assert.strictEqual(JSON.parse(body).a, v);
});
t("jsonScript: ordinary spaces are not mangled", () =>
  assert.ok(jsonScript({ a: "one two three" }).includes("one two three")));
t("jsonScript: U+2028 is escaped", () =>
  assert.ok(
    jsonScript({ a: "x" + String.fromCodePoint(0x2028) + "y" }).includes(
      "\\u2028",
    ),
  ));

// ----------------------------------------------------------------- esc.xml
t("xml: escapes the five predefined entities", () =>
  assert.strictEqual(xml('a&b<c>d"e'), "a&amp;b&lt;c&gt;d&quot;e"));
t("xml: resolves authored entities first, so no XML parse error ships", () =>
  assert.strictEqual(xml("a &mdash; b"), "a — b"));
t("xml: a literal angle bracket is escaped, not dropped as a tag", () =>
  assert.ok(xml("<c>").includes("&lt;c&gt;")));
t("entities: does not strip tags", () =>
  assert.strictEqual(entities("<b>x</b>"), "<b>x</b>"));

// ----------------------------------------------------------- catalogue data
t("catalogue: LABSA formula carries subscript three, not subscript plus", () => {
  const labsa = CLASSES.find((c) => c.key === "industrials").items.find(
    (i) => i.id === "labsa",
  );
  assert.ok(labsa, "labsa not in the catalogue");
  assert.ok(
    !labsa.f.includes("&#8330;"),
    "formula still contains U+208A subscript plus",
  );
  assert.strictEqual(decode(labsa.f), "C₁₈H₃₀O₃S");
});
t("catalogue: LABSA is findable by its real formula", () => {
  const row = searchIndex().find((r) => r.t === "LABSA");
  assert.ok(row, "no LABSA search row");
  assert.ok(row.h.includes("c18h30o3s"), "haystack: " + row.h.slice(0, 90));
});
t("catalogue: subscript plus decodes as a plus, not a digit", () =>
  assert.strictEqual(plain("H&#8330;O"), "H+O"));
t("catalogue: every sector tag resolves to a SECTORS row", () => {
  const keys = new Set(SECTORS.map((s) => s[0]));
  for (const cls of CLASSES)
    for (const item of cls.items)
      for (const tag of item.t || [])
        assert.ok(keys.has(tag), `${item.name} has unknown sector tag "${tag}"`);
});
t("catalogue: grade ids are unique across the whole book", () => {
  const seen = new Map();
  for (const cls of CLASSES)
    for (const item of cls.items) {
      const key = `${cls.key}/${item.id}`;
      assert.ok(!seen.has(key), `duplicate id ${key}`);
      seen.set(key, item.name);
    }
});
t("catalogue: every grade id is a safe filename stem", () => {
  for (const cls of CLASSES)
    for (const item of cls.items)
      assert.match(item.id, /^[a-z0-9][a-z0-9-]*$/, `${item.name} -> ${item.id}`);
});
t("slug: folds entities rather than transliterating them", () =>
  assert.strictEqual(slug("Urea B &middot; N46"), "urea-b-n46"));

// ------------------------------------------------------- template-literal files
/* kernel-css.js and kernel-js.js are each one big JS template literal. A stray
   backtick anywhere in them — including inside a CSS or JS comment — ends the
   string and the build dies with a syntax error pointing at the wrong thing.
   Cheap to assert, and it has already happened once. */
t("no backtick inside the kernel template literals", () => {
  /* kernel-css.js and kernel-js.js each wrap their whole body in one template
     literal. A backtick anywhere inside ends the string and the build dies
     pointing at the wrong line — that has happened twice. Backticks in the
     file's preamble comments are fine, so the check is scoped to the region
     between the opening backtick and the closing one. */
  const fsx = require("fs");
  const px = require("path");
  for (const f of ["kernel-css.js", "kernel-js.js"]) {
    const src = fsx.readFileSync(px.join(__dirname, f), "utf8");
    /* Anchored on the export, not on the first backtick in the file — the
       preamble comments contain backticks and are allowed to. */
    const marker = "module.exports = `";
    const open = src.indexOf(marker) + marker.length - 1;
    const close = src.lastIndexOf("`");
    assert.ok(src.includes(marker) && close > open, `${f}: no template literal found`);
    const inner = src.slice(open + 1, close);
    const at = inner.indexOf("`");
    if (at > -1) {
      const line = src.slice(0, open + 1 + at).split("\n").length;
      assert.fail(`${f}:${line} has a backtick inside the template literal`);
    }
  }
});

/* scene3d.js carries the same hazard in a harder-to-spot form: it is not one
   literal but nine — the shared core and one per scene — so the anchoring
   trick above does not apply. Compiling what it emits is a stronger check
   anyway, and it catches every other syntax slip in the client code as well.
   The three page modules that already own a glxPage rely on that code
   parsing; a broken bundle would take their filter bars down with it. */
t("scene3d: every emitted bundle is syntactically valid JavaScript", () => {
  const scene3d = require("./scene3d");
  const names = Object.keys(scene3d.SCENES);
  assert.ok(names.length >= 8, `only ${names.length} scene(s) registered`);
  for (const n of names) {
    /* new Function compiles without running: a syntax error throws here, and
       nothing touches the DOM or three.js, neither of which exists in node. */
    assert.doesNotThrow(() => new Function(scene3d.bundle(n, [])), `scene "${n}"`);
  }
});

/* Every scene the pages ask for has to exist. bundle() throws on an unknown
   name, so this is really a check that the staged heroes and the scenes have
   not drifted apart under a rename. */
t("scene3d: every stage a page declares resolves to a scene", () => {
  const fsx = require("fs");
  const px = require("path");
  const scene3d = require("./scene3d");
  const dir = px.join(__dirname, "pages");
  let found = 0;
  for (const f of fsx.readdirSync(dir).filter((x) => x.endsWith(".js"))) {
    const src = fsx.readFileSync(px.join(dir, f), "utf8");
    for (const m of src.matchAll(/stage:\s*\{\s*name:\s*"([a-z]+)"/g)) {
      assert.ok(scene3d.SCENES[m[1]], `pages/${f} asks for missing scene "${m[1]}"`);
      found++;
    }
  }
  /* One staged hero per class page, plus the five non-class pages that carry a
     scene: about, procedures, products, sustainability, logistics. Asserted as
     a number rather than as "at least one", so a hero that silently loses its
     stage in an edit fails here. */
  const staged = CLASSES.length + 5;
  assert.strictEqual(found, staged, `expected ${staged} staged heroes, found ${found}`);
});

/* Every product image the catalogue points at has to be on disk, whether it is
   a delivered photograph or a generated placeholder. A missing file is a
   broken <img> on the busiest page on the site, and neither image script runs
   as part of `npm run build` — so nothing else would catch it. */
t("catalogue: every grade's plate and thumbnail exist in assets/products", () => {
  const fsx = require("fs");
  const px = require("path");
  const root = px.resolve(__dirname, "..");
  const gone = [];
  for (const cls of CLASSES)
    for (const item of cls.items)
      for (const f of [item.img, item.imgSq])
        if (!fsx.existsSync(px.join(root, f))) gone.push(f);
  assert.strictEqual(
    gone.length,
    0,
    `missing ${gone.length} image(s): ${gone.slice(0, 6).join(", ")} — run ` +
      `\`npm run images\`, or \`npm run placeholders\` for grades with photo:false`,
  );
});

// ------------------------------------------------------------- generated SEO
/* These read the built output, so they only mean something after a build.
   Skipped rather than failed when it has not run, so `npm test` is useful on
   a fresh clone. */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const built = fs.existsSync(path.join(ROOT, "sitemap.xml"));

if (!built) {
  console.log("note: no sitemap.xml yet — run `npm run build` for the SEO checks");
} else {
  const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
  const all = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  /* Derived from the emitted markup rather than a filename list, so a new
     noindex page (404, admin, a future gated page) is handled by the rule
     instead of needing this test edited. */
  const noindex = (f) => /<meta name="robots" content="noindex/.test(read(f));
  const pages = all.filter((f) => !noindex(f));

  t("every page has exactly one canonical", () => {
    for (const f of pages) {
      const n = (read(f).match(/<link rel="canonical"/g) || []).length;
      assert.strictEqual(n, 1, `${f} has ${n}`);
    }
  });
  t("every page has exactly one JSON-LD block and it parses", () => {
    for (const f of pages) {
      const m = read(f).match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      );
      assert.strictEqual(m.length, 1, `${f} has ${m.length} blocks`);
      const g = JSON.parse(
        m[0].replace(/^[^{]*/, "").replace(/<\/script>$/, ""),
      );
      assert.ok(Array.isArray(g["@graph"]), `${f} has no @graph`);
      const orgs = g["@graph"].filter((n) => n["@type"] === "Organization");
      assert.strictEqual(orgs.length, 1, `${f} has ${orgs.length} Organization`);
    }
  });
  /* Cloudflare Pages 308-redirects /foo.html to /foo. Asserting a URL that
     redirects wastes the canonical signal, so nothing we publish may carry
     the extension. This is the check that would have caught it. */
  t("no asserted URL uses the .html form Pages redirects away from", () => {
    const sm = read("sitemap.xml");
    assert.ok(!/<loc>[^<]*\.html<\/loc>/.test(sm), "sitemap has a .html <loc>");
    for (const f of pages) {
      const s = read(f);
      const canon = s.match(/<link rel="canonical" href="([^"]+)"/)[1];
      assert.ok(!canon.endsWith(".html"), `${f} canonical is ${canon}`);
      const og = s.match(/<meta property="og:url" content="([^"]+)"/)[1];
      assert.strictEqual(og, canon, `${f}: og:url and canonical disagree`);
      const g = JSON.parse(
        s
          .match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
          .replace(/^[^{]*/, ""),
      );
      const bc = g["@graph"].find((n) => n["@type"] === "BreadcrumbList");
      for (const li of (bc && bc.itemListElement) || [])
        if (li.item)
          assert.ok(!li.item.endsWith(".html"), `${f} crumb item ${li.item}`);
    }
  });
  t("sitemap lists every indexable page and nothing else", () => {
    const sm = read("sitemap.xml");
    const n = (sm.match(/<url>/g) || []).length;
    assert.strictEqual(n, pages.length, `${n} urls vs ${pages.length} indexable`);
    for (const f of all.filter(noindex)) {
      const stem = f.replace(/\.html$/, "");
      assert.ok(
        !new RegExp(`<loc>[^<]*/${stem}</loc>`).test(sm),
        `sitemap lists noindex page ${f}`,
      );
    }
  });
  t("a 404 page is committed, so Pages cannot soft-404 to the homepage", () => {
    assert.ok(fs.existsSync(path.join(ROOT, "404.html")), "no 404.html");
    assert.ok(noindex("404.html"), "404.html should be noindex");
  });
  t("robots.txt points at the sitemap and blocks the private routes", () => {
    const r = read("robots.txt");
    for (const line of [
      "Sitemap: https://globalex.me/sitemap.xml",
      "Disallow: /admin.html",
      "Disallow: /api/",
      "Disallow: /d/",
      "Disallow: /f/",
    ])
      assert.ok(r.includes(line), `robots.txt missing: ${line}`);
  });
  t("the og:image raster exists and is referenced absolutely", () => {
    assert.ok(
      fs.existsSync(path.join(ROOT, "assets/og-default.png")),
      "assets/og-default.png missing — run `npm run og`",
    );
    for (const f of pages)
      assert.ok(
        read(f).includes(
          '<meta property="og:image" content="https://globalex.me/assets/og-default.png"',
        ),
        `${f} og:image is not the absolute raster`,
      );
  });
  t("no page leaks the literal word undefined", () => {
    for (const f of pages)
      assert.ok(!read(f).includes(">undefined<"), `${f} renders "undefined"`);
  });

  /* nav.js declares the full intended IA but marks unbuilt pages hold:true and
     renders only the live rows. This is the check that the hold actually holds:
     every internal link in the shipped chrome must resolve to a real file. */
  t("every internal link resolves to a file that exists", () => {
    const missing = new Map();
    for (const f of pages) {
      const s = read(f);
      for (const m of s.matchAll(/href="([^"#?:][^"]*)"/g)) {
        const href = m[1];
        if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
        const target = href.split("#")[0].split("?")[0];
        if (!target || !target.endsWith(".html")) continue;
        if (!fs.existsSync(path.join(ROOT, target)))
          missing.set(target, (missing.get(target) || new Set()).add(f));
      }
    }
    assert.strictEqual(
      missing.size,
      0,
      "dead links: " +
        [...missing]
          .map(([t2, from]) => `${t2} (from ${[...from].join(", ")})`)
          .join("; "),
    );
  });

  /* The switch has to actually hide things, or it is decoration. Every page
     whose flag is off must appear nowhere in the shipped output. */
  t("a page switched off in flags.js is linked from nowhere", () => {
    const { PAGES } = require("./flags");
    const off = Object.keys(PAGES).filter((k) => PAGES[k] !== true);
    for (const f of all)
      for (const k of off)
        assert.ok(
          !read(f).includes(`href="${k}.html"`),
          `${f} links to ${k}.html, which flags.js has switched off`,
        );
    assert.ok(
      !off.some((k) => read("sitemap.xml").includes(`/${k}<`)),
      "sitemap lists a page that flags.js has switched off",
    );
  });

  t("every page switched on in flags.js actually exists", () => {
    const { PAGES } = require("./flags");
    for (const [k, on] of Object.entries(PAGES))
      if (on)
        assert.ok(
          fs.existsSync(path.join(ROOT, `${k}.html`)),
          `flags.js switches on ${k} but ${k}.html was not built`,
        );
  });
}

// ------------------------------------------------------------------- theme
const theme = require("./theme");

t("theme: every colour is a valid 6-digit hex", () => {
  for (const [k, v] of Object.entries(theme.THEME)) {
    assert.match(v, /^#[0-9A-Fa-f]{6}$/, `${k} = ${v}`);
    theme.rgb(v); // throws if unparseable
  }
});

/* The point of theme.js is that it is the ONLY place a colour is written. If a
   literal creeps back into a component, changing the theme stops changing the
   whole site and the file's promise quietly becomes false. */
t("theme: no colour literal survives outside theme.js", () => {
  const fsx = require("fs");
  const px = require("path");
  const files = [
    ...fsx.readdirSync(__dirname).filter((f) => f.endsWith(".js") && f !== "theme.js"),
    ...fsx.readdirSync(px.join(__dirname, "pages")).map((f) => px.join("pages", f)),
  ];
  const rgba = /rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,/;
  const hex = /(?<![&#\w])#[0-9A-Fa-f]{6}\b/;
  const found = [];
  for (const f of files) {
    const src = fsx.readFileSync(px.join(__dirname, f), "utf8");
    src.split("\n").forEach((line, i) => {
      if (rgba.test(line) || hex.test(line)) found.push(`${f}:${i + 1}`);
    });
  }
  assert.strictEqual(found.length, 0, "colour literals at " + found.join(", "));
});

/* A recolour must not make text unreadable. Anyone editing theme.js gets a
   failing build rather than a shipped accessibility regression. */
t("theme: text clears WCAG AA on the page background", () => {
  const bg = theme.THEME.pageBackground;
  for (const k of ["textHeading", "textLead", "textBody", "textMuted"]) {
    const r = theme.contrast(theme.THEME[k], bg);
    assert.ok(r >= 4.5, `${k} is ${r.toFixed(2)}:1 on pageBackground, needs 4.5:1`);
  }
  for (const [fg, on] of [
    ["textOnSystem", "accentSystem"],
    ["textOnMaterial", "accentMaterial"],
  ]) {
    const r = theme.contrast(theme.THEME[fg], theme.THEME[on]);
    assert.ok(r >= 4.5, `${fg} is ${r.toFixed(2)}:1 on ${on}, needs 4.5:1`);
  }
});

/* Every var() a stylesheet reaches for has to resolve, or the declaration is
   silently dropped and the surface renders transparent. This caught --cyan-g
   and --sand-g going undefined during the theme refactor. */
t("theme: every custom property used in CSS is defined", () => {
  const fsx = require("fs");
  const px = require("path");
  let all = require("./kernel-css");
  for (const f of fsx.readdirSync(px.join(__dirname, "pages")))
    all += require("./pages/" + f).css || "";
  all += require("./docgate").css;
  all += require("./consent").css;
  all += require("./trade-strip").crossCss;

  const defined = new Set(
    [...all.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
  );
  /* set inline via a style attribute or from JavaScript, never in a rule */
  const inline = new Set([
    "--d", "--i", "--v", "--sc", "--led-cols", "--mm-cols", "--noise", "--head",
    "--x-rgb",
  ]);
  const missing = [...new Set([...all.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]))]
    .filter((u) => !defined.has(u) && !inline.has(u))
    .sort();
  assert.strictEqual(missing.length, 0, "undefined: " + missing.join(", "));
});

/* A bare identifier inside a template literal emits its own name as text. In
   an SVG attribute that is an invalid value which silently falls back — the
   share card's gradient rendered a black corner for two commits because
   stop-color=THEME.surfaceDeepest was never interpolated. */
t("og plate: every SVG attribute value is quoted and interpolated", () => {
  const svg = require("./og-plate").svg();
  const bare = [...svg.matchAll(/(?:stop-color|fill|stroke|x|y|width|height)=(?!")[^\s>/]+/g)];
  assert.strictEqual(
    bare.length,
    0,
    "unquoted attribute value(s): " + bare.map((m) => m[0]).join(", "),
  );
  assert.ok(!svg.includes("THEME."), "an uninterpolated THEME reference reached the output");
  /* and every colour it does emit must be a real hex */
  for (const m of svg.matchAll(/(?:stop-color|fill|stroke)="([^"]+)"/g))
    if (m[1] !== "none" && !m[1].startsWith("url("))
      assert.match(m[1], /^#[0-9A-Fa-f]{6}$/, `bad colour ${m[1]}`);
});

/* The two presets have to stay swappable, which means the light one has to be
   as readable as the dark one. Checked for whichever is active. */
t("theme: the active preset names a polarity", () =>
  assert.ok(["light", "dark"].includes(theme.POLARITY), theme.POLARITY));

// ------------------------------------------------------------------- runner
const failures = [];
for (const [name, fn] of cases) {
  try {
    fn();
    pass++;
  } catch (e) {
    failures.push([name, e.message]);
  }
}

for (const [name, msg] of failures) console.error(`FAIL  ${name}\n      ${msg}`);
console.log(
  `\n${pass}/${cases.length} assertions passed` +
    (failures.length ? `, ${failures.length} FAILED` : ""),
);
process.exit(failures.length ? 1 : 0);
