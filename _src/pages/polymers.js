const { hero, cta } = require("../parts");
// Families live in the catalogue so this page, products.html and site search
// cannot drift apart. The row markup lives in product-row.js, shared with the
// fertilizers and industrials pages.
const { POLYMERS } = require("../catalogue");
const { productRow } = require("../product-row");

/* This page used to render its own card, .fam-c, with a procedural canvas
   drawing each family's chain architecture in a 320px column. The animation
   was the nicest thing on the page and it is gone on purpose: it made this one
   class page look like a different site from the other two, and a drawing of a
   polymer chain is not a picture of the product. The photograph is. */
const family = (p, i) => productRow(p, i, { side: `<span>${p.kind}</span>` });

const CRUMB = [["Products", "products.html"], "Polymers"];

module.exports = {
  page: "polymers",
  tier: "class",
  nav: "products",
  crumb: CRUMB,
  title: "Polymers — Globalex Trading FZCO",
  desc: "Polyethylene (LDPE, HDPE, LLDPE, UHMWPE), polypropylene homopolymer and copolymer, and performance additives — sourced from Turkmenistan, Uzbekistan, UAE, Saudi Arabia and China.",

  css: `
/* application sectors */
.app{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line)}
.app-c{padding:clamp(1.5rem,2.8vw,2.2rem);border-right:1px solid var(--line);display:grid;gap:.85rem;
  align-content:start;position:relative;overflow:hidden;transition:background .45s var(--ease)}
.app-c:last-child{border-right:0}
.app-c:hover{background:rgba(var(--cyan-rgb),.05)}
.app-c .eb{font-size:.69rem}
.app-c p{color:var(--haze);font-size:.99rem}
.app-c ul{display:grid;gap:.4rem;margin-top:.3rem}
.app-c li{display:flex;gap:.6rem;align-items:baseline;font-family:var(--f-mono);font-size:.725rem;
  letter-spacing:.12em;text-transform:uppercase;color:var(--haze-d)}
.app-c li::before{content:'';width:5px;height:5px;flex:none;background:var(--cyan);opacity:.65;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
@media (max-width:900px){.app{grid-template-columns:1fr}
  .app-c{border-right:0;border-bottom:1px solid var(--line)}.app-c:last-child{border-bottom:0}}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow:
    "Class 02 &middot; 3 families &middot; Gulf, Caspian &amp; East Asia",
  h1: "Polymers",
  lead: "Polyethylene across LDPE, HDPE, LLDPE and UHMWPE; polypropylene homopolymer and copolymer; and the additives that tune a resin to its application.",
  meta: [
    ["3", "Families"],
    ["5", "Origin markets"],
    ["Dubai", "Held inventory"],
    ["MFI", "Spec matched"],
  ],
  sec: "Polymers",
})}

<section class="sec is-tight" data-sec="Families">
  <div class="wrap">
    <div class="rows rvs">
${POLYMERS.map(family).join("\n")}
    </div>
  </div>
</section>

<section class="sec sec-panel" data-sec="Applications">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Where the resin ends up</span>
      <h2>One material category, most of modern manufacturing.</h2>
      <p class="lead">Our buyers are converters across the Middle East, North Africa and South Asia. We work to grade, packaging spec and delivery window &mdash; and we hold inventory positions in Dubai for short lead-time orders.</p>
    </div>

    <div class="app rvs">
      <div class="app-c">
        <span class="eb">Packaging</span>
        <p>Film, closures, rigid containers and the barrier layers that keep food and medical supplies sterile.</p>
        <ul><li>LDPE &middot; LLDPE film</li><li>HDPE blow-moulding</li><li>PP hot-fill</li></ul>
      </div>
      <div class="app-c">
        <span class="eb">Construction &amp; water</span>
        <p>Pressure pipe, conduit, geomembrane and fittings &mdash; where a fifty-year service life is the specification.</p>
        <ul><li>HDPE PE100 pipe</li><li>PPR hot water</li><li>UV-stabilised grades</li></ul>
      </div>
      <div class="app-c">
        <span class="eb">Automotive &amp; goods</span>
        <p>Bumpers, interior trim, battery casings, appliance housings and technical textiles.</p>
        <ul><li>PP impact copolymer</li><li>UHMWPE wear parts</li><li>Flame-retardant compounds</li></ul>
      </div>
    </div>
  </div>
</section>

<section class="sec is-tight" data-sec="Logistics">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="eb">Sourcing &amp; logistics</span>
        <h3 style="margin-top:.9rem">Five origins, so price and lead time stay negotiable.</h3>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">Polymer supply runs from <strong>Turkmenistan, Uzbekistan, the UAE, Saudi Arabia</strong> and <strong>China</strong>. Multiple origins let us match price, lead time and grade specification to your production window rather than to a single mill's schedule. Trade follows our standard ten-step procedure.</p>
        <div class="btns" style="margin-top:1.6rem"><a href="procedures.html" class="lk">Read the ten-step procedure</a></div>
      </div>
    </div>
  </div>
</section>

${cta({
  eyebrow: "Request a quote",
  h2: "Need polymer supply at scale?",
  lead: "Share grade, melt-flow index target, volume and destination &mdash; we match origin to spec and come back with pricing.",
  primary: ["Request a quote", "contact.html"],
})}
`,

};
