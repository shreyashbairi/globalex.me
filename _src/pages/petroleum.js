const { hero, cta } = require("../parts");
// Cuts live in the catalogue so this page, products.html and site search cannot
// drift apart. The row markup lives in product-row.js, shared with the other
// three class pages so the four cannot drift apart either.
const { PETROLEUM, PETROLEUM_BANDS } = require("../catalogue");
const { productRow } = require("../product-row");
const { decode } = require("../esc");
const scene3d = require("../scene3d");

/* The hero is a fractionating column, which is where every grade on this page
   physically comes from, and the eight trays are these eight cuts in this
   order. The scene reads the same array the rows below do, so it cannot light
   a tray for a grade the page does not list. */
const STAGE = PETROLEUM.map((p) => [decode(p.name), decode(p.kind)]);

/* This class's contribution to the shared row: where the cut comes off the
   barrel. It is the fertilizers page's N-P-K bar solved for a different
   question — four rungs, one lit, so the position is readable at a glance and
   the whole book of eight is legible as a ladder when the rows are scrolled. */
const row = (p, i) =>
  productRow(p, i, {
    side: `<span>${p.kind}</span>
  <span class="cut" role="img" aria-label="Distillation band: ${decode(PETROLEUM_BANDS.find((b) => b.k === p.band).label)}">
    ${PETROLEUM_BANDS.map(
      (b) =>
        `<span class="cut-r${b.k === p.band ? " on" : ""}"><i></i><b>${b.label}</b></span>`,
    ).join("")}
  </span>`,
  });

const CRUMB = [["Products", "products.html"], "Petroleum Products"];

module.exports = {
  page: "petroleum",
  tier: "class",
  nav: "products",
  crumb: CRUMB,
  title: "Petroleum Products — Globalex Trading FZCO",
  desc: "Gasoline, jet fuel, lighting and heating kerosene, diesel, base oil, fuel oil and bitumen — the full atmospheric and vacuum cut range, traded to specification out of Dubai.",
  three: true,

  css: `
/* ---------- distillation band ladder ----------
   The row-side column on this page carries four rungs rather than three bars,
   so it needs a little more width than the default row gives it. */
.prod .row-side{min-width:180px}
.cut{display:grid;gap:.28rem;margin-top:.35rem}
.cut-r{display:flex;align-items:center;gap:.55rem}
.cut-r i{display:block;width:26px;height:4px;flex:none;border:1px solid var(--line);
  background:rgba(var(--hairline-rgb),.1)}
.cut-r b{font-family:var(--f-mono);font-size:.63rem;font-weight:400;letter-spacing:.11em;
  text-transform:uppercase;color:var(--haze-d);white-space:nowrap}
.cut-r.on i{background:var(--sand);border-color:var(--sand);
  box-shadow:0 0 8px rgba(var(--sand-rgb),.5)}
.cut-r.on b{color:var(--sand-t);font-weight:500}
@media (max-width:760px){.cut{margin-top:.7rem;grid-template-columns:1fr 1fr;gap:.28rem .9rem}}

/* ---------- the barrel band ----------
   The same instrument as the industrials sector band, counting a different
   thing: how the eight grades divide across the four distillate bands. */
.brl{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line)}
.brl div{padding:clamp(1.4rem,2.5vw,2rem);border-right:1px solid var(--line);display:grid;gap:.6rem;
  align-content:start}
.brl div:last-child{border-right:0}
.brl b{font-family:var(--f-disp);font-weight:800;font-size:clamp(1.7rem,3.4vw,2.5rem);line-height:1;
  font-variation-settings:'wdth' 118;color:var(--sand-t);font-variant-numeric:tabular-nums}
.brl span{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.16em;text-transform:uppercase;
  color:var(--haze-d)}
@media (max-width:820px){.brl{grid-template-columns:1fr 1fr}
  .brl div:nth-child(2){border-right:0}
  .brl div:nth-child(-n+2){border-bottom:1px solid var(--line)}}

/* ---------- end-use cards ----------
   Three columns, matching the polymers page's application band, because the
   question a buyer asks of both classes is the same one: where does it go. */
.use{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line)}
.use-c{padding:clamp(1.5rem,2.8vw,2.2rem);border-right:1px solid var(--line);display:grid;gap:.85rem;
  align-content:start;position:relative;overflow:hidden;transition:background .45s var(--ease)}
.use-c:last-child{border-right:0}
.use-c:hover{background:rgba(var(--sand-rgb),.05)}
.use-c .eb{font-size:.69rem}
.use-c p{color:var(--haze);font-size:.99rem}
.use-c ul{display:grid;gap:.4rem;margin-top:.3rem}
.use-c li{display:flex;gap:.6rem;align-items:baseline;font-family:var(--f-mono);font-size:.725rem;
  letter-spacing:.12em;text-transform:uppercase;color:var(--haze-d)}
.use-c li::before{content:'';width:5px;height:5px;flex:none;background:var(--sand);opacity:.7;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
@media (max-width:900px){.use{grid-template-columns:1fr}
  .use-c{border-right:0;border-bottom:1px solid var(--line)}.use-c:last-child{border-bottom:0}}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: `Class 04 &middot; ${PETROLEUM.length} grades &middot; Refinery cuts`,
  h1: "Petroleum products",
  lead: "Gasoline off the top, bitumen out of the boot, and everything the tower gives up in between &mdash; jet fuel, lighting and heating kerosene, diesel, base oil and fuel oil, traded to the specification the destination market actually accepts.",
  tone: "sand",
  /* Kept as short as the industrials band, which is the widest of these that
     still holds one line at 1600px. "Distillate bands" and "Confirmed before
     dispatch" wrapped it onto two. */
  meta: [
    [String(PETROLEUM.length), "Grades"],
    [String(PETROLEUM_BANDS.length), "Cut bands"],
    ["Spec", "Verified at load"],
    ["MSDS", "Supplied with every lot"],
  ],
  sec: "Petroleum",
  stage: { name: "column", kicker: "Cut" },
})}

<section class="sec is-tight" data-sec="Barrel">
  <div class="wrap">
    <div class="brl rv">
${PETROLEUM_BANDS.map(
  (b) => `      <div><b>${b.count}</b><span>${b.label}</span></div>`,
).join("\n")}
    </div>
  </div>
</section>

<section class="sec is-tight" data-sec="Cuts">
  <div class="wrap">
    <div class="hd rv" style="margin-bottom:1.6rem">
      <span class="eb mat">The cut range</span>
      <h2>${PETROLEUM.length} grades, in the order the barrel gives them up.</h2>
      <p class="lead">Lightest overhead, heaviest at the bottom. It is not a ranking &mdash; it is the physical order these products separate in, and it is why a refinery that wants gasoline still has to sell bitumen.</p>
    </div>

    <div class="rows rvs">
${PETROLEUM.map(row).join("\n")}
    </div>
  </div>
</section>

<section class="sec sec-panel" data-sec="Applications">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb mat">Where the barrel ends up</span>
      <h2>One feedstock, most of how a country moves and builds.</h2>
      <p class="lead">Our buyers are fuel distributors, marine bunker suppliers, lubricant blenders and road contractors. Each takes a different part of the same barrel, and each is holding us to a different specification for it.</p>
    </div>

    <div class="use rvs">
      <div class="use-c">
        <span class="eb mat">Transport &amp; aviation</span>
        <p>Road, rail, marine and air &mdash; the cuts where the specification is written by an engine manufacturer or a regulator rather than by us.</p>
        <ul><li>Gasoline &middot; octane grade</li><li>Diesel &middot; cetane and cold flow</li><li>Jet A-1 &middot; segregated chain</li></ul>
      </div>
      <div class="use-c">
        <span class="eb mat">Power, heat &amp; light</span>
        <p>Generation, industrial boilers, domestic heating and the household lighting fuel that still moves in real volume across South Asia and East Africa.</p>
        <ul><li>Fuel oil &middot; viscosity graded</li><li>Heating kerosene &middot; burners</li><li>Lighting kerosene &middot; wick</li></ul>
      </div>
      <div class="use-c">
        <span class="eb mat">Lubricants &amp; construction</span>
        <p>The two cuts nobody burns: the base stock that becomes finished lubricant, and the binder that becomes road.</p>
        <ul><li>Base oil &middot; SN range</li><li>Bitumen &middot; penetration grade</li><li>Bitumen &middot; roofing &amp; coating</li></ul>
      </div>
    </div>
  </div>
</section>

<section class="sec is-tight" data-sec="Standard">
  <div class="wrap">
    <div class="split is-1-2">
      <div class="rv">
        <span class="eb mat">Specification first</span>
        <h2 style="margin-top:.9rem">A fuel is the specification. Everything else is logistics.</h2>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">Two cargoes called diesel can be different products: sulphur limit, cetane, cold-flow point and flash point decide which markets will discharge them and which will reject them at the jetty. The same is true of a bitumen penetration grade and of a fuel oil viscosity band.</p>
        <p style="margin-top:1.2rem;color:var(--haze)">So the specification is agreed in writing before anything loads, quality is confirmed by independent inspection at load, and the safety and technical documentation travels with the cargo rather than following it. Handling class governs the rest &mdash; heated tanks for bitumen, segregated systems for jet, dedicated tankage for base oil.</p>
        <div class="btns" style="margin-top:1.7rem"><a href="procedures.html" class="lk mat">Read the ten-step procedure</a></div>
      </div>
    </div>
  </div>
</section>

${cta({
  eyebrow: "Request a quote",
  h2: "Need a refined product at cargo scale?",
  lead: "Tell us the grade, the specification you are held to, the volume and the discharge port &mdash; we come back with an indication and a load window.",
  primary: ["Request a quote", "contact.html"],
  tone: "sand",
})}
`,

  js: scene3d.bundle("column", STAGE),
};
