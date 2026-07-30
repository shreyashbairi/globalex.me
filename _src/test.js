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
  const pages = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith(".html") && f !== "admin.html");

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
  t("sitemap excludes the dashboard", () =>
    assert.ok(!read("sitemap.xml").includes("admin")));
  t("sitemap lists every built marketing page", () => {
    const sm = read("sitemap.xml");
    const n = (sm.match(/<url>/g) || []).length;
    assert.strictEqual(n, pages.length, `${n} urls vs ${pages.length} pages`);
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
}

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
