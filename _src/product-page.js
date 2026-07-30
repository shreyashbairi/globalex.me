/* ============================================================
   PER-GRADE PRODUCT PAGE

   A factory, not a page module: it returns the same object shape
   _src/pages/*.js export, so build.js#emit() and render() need no knowledge
   of whether a page was authored or generated. One template, 24 pages.

   Adding a grade to _src/catalogue.js therefore produces its page, its
   sitemap entry, its search row, its mega-menu row and its Product JSON-LD
   with no other edit.

   The CSS is a module-level constant shared by every returned object, so the
   24 pages interpolate one string rather than 24 copies of it.
   ============================================================ */

const { hero, cta } = require("./parts");
const { CLASSES, plain } = require("./catalogue");
const { SPECS, isDraft } = require("./specs");
const { RELEASED: DOCS } = require("./docs");
const S = require("./schema-org");
const { on } = require("./flags");

/* Applications are written per grade rather than derived: what a material is
   used for is real, useful, commercially safe copy that does not depend on an
   assay figure. Anything not listed here falls back to the sector tags. */
const USES = {
  "urea-b-n46": [
    ["Broadacre cereals", "Wheat, barley and rice at pre-plant and top-dress."],
    ["Sugar and cotton", "High-nitrogen demand crops through the growing window."],
    ["Industrial resins", "Urea-formaldehyde for panel and board adhesives."],
  ],
  potash: [
    ["Fruit and vegetables", "Quality, colour and shelf life rather than bulk yield."],
    ["Oil palm and sugar", "Heavy potassium feeders on leached tropical soils."],
    ["Blending", "The K component of compound and bulk-blended NPK."],
  ],
  ammonia: [
    ["Fertilizer manufacture", "Feedstock for urea, ammonium nitrate and phosphates."],
    ["Direct application", "Injected anhydrous, where handling capability exists."],
    ["Industrial refrigeration", "R-717 in cold chain and process cooling."],
  ],
  "ammonium-nitrate": [
    ["Short-season correction", "Immediately available nitrogen mid-season."],
    ["Pasture and forage", "Grassland where response time matters."],
    ["Cold soils", "Where urea volatilises or converts too slowly."],
  ],
  "npk-compound": [
    ["General cropping", "One balanced ration per application."],
    ["Establishment", "Starter nutrition at planting."],
    ["Smallholder supply", "Where separate straights are impractical."],
  ],
  polyethylene: [
    ["Film and packaging", "LDPE and LLDPE for stretch, shrink and liner film."],
    ["Pipe and fittings", "HDPE pressure pipe for water and gas distribution."],
    ["Wear parts", "UHMWPE where abrasion resistance outlives steel."],
  ],
  polypropylene: [
    ["Rigid packaging", "Hot-fill containers, closures and thin-wall mouldings."],
    ["Woven sacks", "Raffia grades for fertilizer and grain bagging."],
    ["Automotive", "Interior trim and under-bonnet components."],
  ],
  "performance-additives": [
    ["Compounding", "Property tuning at the masterbatch stage."],
    ["Outdoor durability", "UV stabilisation for pipe, profile and geomembrane."],
    ["Regulated end use", "Flame retardancy for building and electrical."],
  ],
  sulphur: [
    ["Sulphuric acid", "Feedstock for the largest-volume industrial chemical."],
    ["Fertilizer manufacture", "Phosphate processing and sulphur-bearing grades."],
    ["Soil amendment", "Correcting alkaline soils and sulphur deficiency."],
  ],
  "caustic-soda": [
    ["Pulp and textiles", "Digestion, mercerising and scouring."],
    ["Alumina refining", "Bauxite digestion in the Bayer process."],
    ["Water treatment", "pH correction and heavy-metal precipitation."],
  ],
  "sodium-hypochlorite": [
    ["Municipal water", "Primary and residual disinfection."],
    ["Food and beverage", "Clean-in-place sanitation."],
    ["Institutional cleaning", "Bleach and hard-surface disinfectant blends."],
  ],
  labsa: [
    ["Laundry detergent", "The primary anionic surfactant in powders and liquids."],
    ["Dishwash", "Hand dishwash concentrates."],
    ["Industrial cleaners", "Degreasers and hard-surface formulations."],
  ],
  "carbon-black": [
    ["Tyre manufacture", "Reinforcing filler governing tread wear."],
    ["Plastics and coatings", "Pigment and UV protection."],
    ["Cables", "Conductive and semi-conductive compounds."],
  ],
};

const CSS = `
/* ---------- product page ---------- */
.pp-grid{display:grid;grid-template-columns:1.55fr .95fr;gap:clamp(1.6rem,3.5vw,3rem);align-items:start}
@media (max-width:1000px){.pp-grid{grid-template-columns:1fr}}

.pp-panel{padding:clamp(1.4rem,2.6vw,2.1rem);border:1px solid var(--line);
  background:linear-gradient(160deg,rgba(var(--panel-rgb),.5),rgba(var(--deep-rgb),.7))}
.pp-panel h2,.pp-panel h3{font-size:var(--t-h4);margin-bottom:.2rem}
.pp-h{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
  margin-bottom:1.1rem;padding-bottom:.8rem;border-bottom:1px solid var(--line)}

/* definition grid, matching the register's spec table */
.pp-dl{border-top:1px solid var(--line)}
.pp-dl>div{display:flex;justify-content:space-between;align-items:baseline;gap:1.2rem;
  padding:.62rem 0;border-bottom:1px solid var(--line)}
.pp-dl dt{color:var(--haze);font-size:.95rem;min-width:0}
.pp-dl dd{font-family:var(--f-mono);font-size:.79rem;color:var(--frost);text-align:right;
  white-space:nowrap;flex:none}
.pp-dl dd.mat{color:var(--sand-t)}

/* the "no figures yet" panel that stands in for the tables */
.pp-req{display:grid;gap:.9rem;padding:clamp(1.5rem,3vw,2.3rem);border:1px dashed var(--line-2);
  background:rgba(var(--deep-rgb),.42)}
.pp-req .eb{margin-bottom:.2rem}
.pp-req p{color:var(--haze);max-width:62ch}

/* related grades */
.pp-rel{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(.9rem,1.8vw,1.3rem)}
@media (max-width:820px){.pp-rel{grid-template-columns:1fr}}
.pp-rc{display:flex;flex-direction:column;gap:.55rem;padding:clamp(1.1rem,2.2vw,1.5rem);
  border:1px solid var(--line);background:rgba(var(--deep-rgb),.5);
  transition:border-color .4s var(--ease),background .4s var(--ease),transform .4s var(--ease)}
.pp-rc:hover{border-color:var(--line-2);background:rgba(var(--panel-rgb),.62);transform:translateY(-3px)}
.pp-rc b{font-family:var(--f-disp);font-weight:700;font-size:1.06rem;
  font-variation-settings:'wdth' 106;color:var(--frost)}
.pp-rc small{font-family:var(--f-mono);font-size:.68rem;letter-spacing:.12em;
  text-transform:uppercase;color:var(--haze-d)}
.pp-rc span{margin-top:auto;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;
  text-transform:uppercase;color:var(--cyan)}

/* applications */
.pp-use{display:grid;gap:.85rem}
.pp-use b{display:block;font-family:var(--f-disp);font-weight:700;font-size:1.04rem;
  font-variation-settings:'wdth' 106;color:var(--frost)}
.pp-use p{color:var(--haze);font-size:1rem}
`;

/* --------------------------------------------------------------- helpers */

const analysisTable = (name, rows) => `<div class="tbl-wrap" role="region"
 tabindex="0" aria-label="Typical analysis for ${plain(name)}">
<table class="tbl is-wide">
<caption>Typical analysis &middot; ${name}</caption>
<thead><tr>
<th scope="col">Parameter</th><th scope="col" class="num">Typical</th>
<th scope="col" class="num">Min</th><th scope="col" class="num">Max</th>
<th scope="col">Unit</th><th scope="col">Method</th>
</tr></thead>
<tbody>
${rows
  .map(
    ([param, typ, min, max, unit, method]) => `<tr>
<th scope="row">${param}</th>
<td class="num mat">${typ}</td><td class="num">${min}</td><td class="num">${max}</td>
<td>${unit}</td><td class="sys">${method}</td>
</tr>`,
  )
  .join("\n")}
</tbody></table></div>
<p class="tbl-n">Typical values, not guaranteed. A certificate of analysis is issued per shipment.</p>`;

const specPanels = (item, spec) => {
  const t = spec.trade || {};
  const ph = spec.physical || {};
  return `
<div class="pp-grid">
<div>
${spec.analysis && spec.analysis.length ? analysisTable(item.name, spec.analysis) : ""}
</div>
<div style="display:grid;gap:var(--gut)">
<div class="pp-panel nch-m">
<div class="pp-h"><h3>Physical &amp; packaging</h3></div>
<dl class="pp-dl">
<div><dt>Form</dt><dd class="mat">${ph.form || "&mdash;"}</dd></div>
<div><dt>Colour</dt><dd>${ph.colour || "&mdash;"}</dd></div>
<div><dt>Bulk density</dt><dd>${ph.bulkDensity || "&mdash;"}</dd></div>
<div><dt>Granulometry</dt><dd>${ph.granulometry || "&mdash;"}</dd></div>
</dl>
${
  (spec.packaging || []).length
    ? `<div class="chips" style="margin-top:1rem">${spec.packaging
        .map((k) => `<span class="chip">${k}</span>`)
        .join("")}</div>`
    : ""
}
</div>
<div class="pp-panel nch-m">
<div class="pp-h"><h3>Trade terms</h3></div>
<dl class="pp-dl">
<div><dt>HS code</dt><dd>${t.hsCode || "&mdash;"}</dd></div>
<div><dt>Minimum lot</dt><dd class="mat">${t.minLot || "&mdash;"}</dd></div>
</dl>
${
  (t.loadPorts || []).length
    ? `<p class="mono" style="margin-top:1rem">Load ports</p>
<div class="chips">${t.loadPorts.map((p) => `<span class="chip">${p}</span>`).join("")}</div>`
    : ""
}
${
  (t.incoterms || []).length
    ? `<p class="mono" style="margin-top:1rem">Incoterms</p>
<div class="chips">${t.incoterms.map((i) => `<span class="chip spec">${i}</span>`).join("")}</div>`
    : ""
}
</div>
</div>
</div>`;
};

/* Stands in for the tables while the assay data is missing. Deliberately not
   an empty table: a buyer who needs figures gets a route to them, and we do
   not publish "[--]" as though it were a specification. */
const requestPanel = (item) => `<div class="pp-req nch-m">
<span class="eb">Specification on request</span>
<p>The full typical analysis for ${item.name} &mdash; parameters, tolerances and
test methods &mdash; is issued as a controlled document. Tell us the destination
and intended use and the desk will send the current sheet.</p>
<div class="btns" style="margin-top:.3rem">
<a class="btn btn-p" data-mag="6" href="contact.html?grade=${item.id}&amp;class=${item.cat}">Request the specification <span class="ar">&rarr;</span></a>
<a class="btn btn-o" data-mag="6" href="index.html#specifications">Document register</a>
</div>
</div>`;

/* ------------------------------------------------------------------ page */

module.exports = function productPage(item, cls) {
  const spec = SPECS[item.id] || {};
  const showSpecs = on("productSpecs") && !isDraft(item.id);

  const uses = USES[item.id];
  const origins = item.origins || [];

  /* A doc in the register whose title or code names this grade. Loose match
     on purpose — the register is small and the alternative is a hand-kept
     mapping that would silently rot. */
  const key = plain(item.name).toLowerCase();
  const docs = DOCS.filter(
    (d) =>
      plain(d.title).toLowerCase().includes(key) ||
      key.includes(plain(d.code).toLowerCase()),
  );

  const related = cls.items.filter((p) => p.id !== item.id).slice(0, 3);

  const H = {
    crumb: [
      ["Products", "products.html"],
      [cls.title, cls.href],
      item.name,
    ],
    eyebrow: `Class ${cls.no} &middot; ${cls.title}`,
    h1: item.name,
    lead: item.body,
    tone: cls.tone,
    sec: item.name,
    meta: [
      item.npk
        ? [`${item.npk[0]}-${item.npk[1]}-${item.npk[2]}`, "N-P-K"]
        : item.f && item.f !== "&mdash;"
          ? [item.f, "Formula"]
          : [cls.title, "Class"],
      [spec.physical && spec.physical.form !== "[--]" ? spec.physical.form.split(" / ")[0] : "&mdash;", "Form"],
      [String(origins.length || "&mdash;"), origins.length === 1 ? "Origin" : "Origins"],
    ],
  };

  return {
    page: item.url.replace(/\.html$/, ""),
    tier: "class",
    nav: "products",
    hero: H,
    title: `${plain(item.name)} — ${cls.title} — Globalex Trading FZCO`,
    desc: plain(item.body).slice(0, 155).replace(/\s+\S*$/, ""),
    jsonld: S.product(item, cls, showSpecs ? spec : null, {
      site: "https://globalex.me",
      url: (u) => `https://globalex.me/${String(u).replace(/\.html$/, "")}`,
    }),
    css: CSS,

    body: `
${hero(H)}

<section class="sec is-tight" data-sec="Specification">
<div class="wrap">
${showSpecs ? specPanels(item, spec) : requestPanel(item)}
</div>
</section>

${
  uses
    ? `<section class="sec sec-panel" data-sec="Applications">
<div class="wrap">
<div class="hd"><span class="eb${cls.tone === "sand" ? " mat" : ""}">Where it goes</span>
<h2>Applications</h2></div>
<div class="g3 rvs">
${uses
  .map(
    ([t, d]) => `<article class="card pil${cls.tone === "sand" ? " mat" : ""}">
<div class="pp-use"><b>${t}</b><p>${d}</p></div>
</article>`,
  )
  .join("\n")}
</div>
</div>
</section>`
    : ""
}

${
  origins.length
    ? `<section class="sec" data-sec="Origins">
<div class="wrap">
<div class="hd"><span class="eb">Sourcing</span><h2>Where we lift it</h2></div>
<div class="led rvs" style="--led-cols:2.2rem 1fr auto">
${origins
  .map(
    (o, i) => `<div class="led-r"><span>${String(i + 1).padStart(2, "0")}</span><b>${o}</b><span class="fl"></span></div>`,
  )
  .join("\n")}
</div>
</div>
</section>`
    : ""
}

${
  docs.length
    ? `<section class="sec sec-panel" data-sec="Documents">
<div class="wrap">
<div class="hd"><span class="eb">Controlled documents</span>
<h2>Sheets on file for this grade</h2></div>
<div class="dreg rv">
${docs
  .map(
    (d) => `<a class="drow" href="index.html#doc-${d.id}">
<span class="dr-k" data-kind="${d.kind}">${d.kind}</span>
<span class="drow-t"><b>${d.title}</b><small>${d.sub} &middot; ${d.origin} &middot; ${d.pages} pp</small></span>
<span class="drow-go">Request &rarr;</span>
</a>`,
  )
  .join("\n")}
</div>
</div>
</section>`
    : ""
}

${
  related.length
    ? `<section class="sec" data-sec="Related">
<div class="wrap">
<div class="hd"><span class="eb${cls.tone === "sand" ? " mat" : ""}">Same class</span>
<h2>Other ${cls.title.toLowerCase()} grades</h2></div>
<div class="pp-rel rvs">
${related
  .map(
    (p) => `<a class="pp-rc nch-s" href="${p.url}">
<b>${p.name}</b><small>${p.kind}</small>
<span>Open grade &rarr;</span>
</a>`,
  )
  .join("\n")}
</div>
</div>
</section>`
    : ""
}

${cta({
  eyebrow: "Open a lane",
  h2: `Tell us the tonnage, the port and the window for ${item.name}.`,
  lead: "One reply from the Dubai desk with an indication, an origin and a load window. No obligation and no chain of intermediaries.",
  primary: [
    "Enquire about this grade",
    `contact.html?grade=${item.id}&class=${item.cat}`,
  ],
  tone: cls.tone,
})}`,
  };
};
