const { hero, cta } = require("../parts");
// Nutrient split is what actually distinguishes these grades, so it becomes
// the visual. The grades themselves live in the catalogue, which the products
// page and site search read from the same object.
const { FERTILIZERS: PRODUCTS } = require("../catalogue");

const row = (p, i) => `<article class="row prod" id="${p.id}">
<span class="row-ix">${String(i + 1).padStart(2, "0")}</span>
<div class="row-b">
  <h3>${p.name}</h3>
  <div class="chips">${p.specs.map((s) => `<span class="chip spec">${s}</span>`).join("")}</div>
  <p>${p.body}</p>
  <div class="chips">${p.origins.map((o) => `<span class="chip org">${o}</span>`).join("")}</div>
</div>
<div class="row-side">
  <span>${p.kind}</span>
  <div class="npk" role="img" aria-label="Nutrient split: ${p.npk[0]} nitrogen, ${p.npk[1]} phosphorus, ${p.npk[2]} potassium">
    ${["N", "P", "K"].map((L, k) => `<span class="npk-b"><i style="--v:${p.npk[k]}%"></i><b>${L}</b><em>${p.npk[k]}</em></span>`).join("")}
  </div>
</div>
</article>`;

module.exports = {
  page: "fertilizers",
  title: "Fertilizers — Globalex Trading FZCO",
  desc: "Urea B (N46), Potash, Ammonia, Ammonium Nitrate and NPK compound fertilizers sourced from Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan.",

  css: `
.prod .row-side{min-width:170px}
.npk{display:flex;gap:.85rem;align-items:flex-end;margin-top:.3rem}
.npk-b{display:grid;justify-items:center;gap:.35rem;width:34px}
.npk-b i{display:block;width:8px;height:62px;background:rgba(146,190,204,.16);position:relative;
  border:1px solid var(--line)}
.npk-b i::after{content:'';position:absolute;left:-1px;right:-1px;bottom:-1px;height:var(--v);
  min-height:2px;background:var(--sand);box-shadow:0 0 8px rgba(217,183,120,.5)}
.npk-b b{font-family:var(--f-mono);font-size:.715rem;font-weight:500;color:var(--sand);letter-spacing:.1em}
.npk-b em{font-style:normal;font-family:var(--f-mono);font-size:.67rem;color:var(--haze-d)}
@media (max-width:760px){.npk{margin-top:.7rem}}

/* origin corridor feature */
.orig{display:grid;grid-template-columns:.95fr 1.05fr;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.orig-vis{position:relative;aspect-ratio:5/4;border:1px solid var(--line);overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))}
.orig-vis canvas{position:absolute;inset:0;width:100%;height:100%}
@media (max-width:940px){.orig{grid-template-columns:1fr}.orig-vis{order:-1;aspect-ratio:16/10}}
`,

  body: `
${hero({
  crumb: [["Products", "products.html"], "Fertilizers"],
  eyebrow: "Class 01 &middot; 5 grades &middot; Caspian origin",
  h1: "Fertilizers",
  lead: "Urea B (N46), potash, ammonia, ammonium nitrate and NPK &mdash; the nitrogen and compound grades that set yield, sourced from Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan.",
  tone: "sand",
  meta: [
    ["5", "Grades"],
    ["N46", "Flagship spec"],
    ["4", "Origin markets"],
    ["Bulk", "Vessel &amp; bagged"],
  ],
  sec: "Fertilizers",
})}

<section class="sec is-tight" data-sec="Grades">
  <div class="wrap">
    <div class="rows rvs">
${PRODUCTS.map(row).join("\n")}
    </div>
  </div>
</section>

<section class="sec sec-panel" data-sec="Origin">
  <div class="wrap">
    <div class="orig">
      <div class="orig-vis rv">
        <canvas data-orn="sand" data-tile="128" data-nodes="6" data-alpha="0.42"></canvas>
      </div>
      <div class="rv" style="--d:120ms">
        <span class="eb mat">Origin story</span>
        <h2 style="margin-top:.9rem">The Caspian basin is one of the world's cheapest places to make nitrogen.</h2>
        <p class="lead" style="margin-top:1.35rem">Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan sit on abundant natural gas &mdash; the feedstock for ammonia, and therefore for urea and ammonium nitrate. Decades of state-backed capacity turned that gas into some of the most cost-efficient nitrogen production on the planet.</p>
        <p style="margin-top:1.1rem;color:var(--haze)">We move that production to global agriculture: European arable farms, South Asian smallholder programmes, East African cooperatives. Contracts are structured for transparency; shipments are timed to the planting window, not to our convenience.</p>
        <div class="chips" style="margin-top:1.6rem">
          <span class="chip spec">N46 grade</span>
          <span class="chip org">Turkmenistan</span>
          <span class="chip org">Uzbekistan</span>
          <span class="chip org">Kazakhstan</span>
          <span class="chip org">Azerbaijan</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec is-tight" data-sec="Logistics">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="eb">Sourcing &amp; logistics</span>
        <h3 style="margin-top:.9rem">Disciplined supply out of the Caspian.</h3>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">Every fertilizer grade moves through long-standing partnerships in Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan, and through our standard ten-step procedure &mdash; full documentation, financial instruments and shipment terms agreed before anything loads.</p>
        <div class="btns" style="margin-top:1.6rem"><a href="procedures.html" class="lk">Read the ten-step procedure</a></div>
      </div>
    </div>
  </div>
</section>

${cta({
  eyebrow: "Request a quote",
  h2: "Need fertilizer supply at scale?",
  lead: "Share volume, destination port and target delivery window &mdash; we return pricing and procedure within two business days.",
  primary: ["Request a quote", "contact.html"],
  tone: "sand",
})}
`,
};
