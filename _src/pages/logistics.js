/* ============================================================
   LOGISTICS & SHIPPING

   Publishable now. The Incoterms 2020 allocation table, the shipping modes,
   the packaging vocabulary and the documentation set are all standard trade
   facts or already-known company practice — none of them needs a figure
   anyone has to look up.

   Two sections are gated in _src/flags.js because they are operational
   claims a counterparty would plan against:

     logisticsPorts    per-port draft, berths, load rate, rail connection
     logisticsTransit  origin-to-destination transit days

   Publishing a made-up load rate is worse than publishing nothing: a buyer
   sizes a vessel against it.
   ============================================================ */

const { hero, cta } = require("../parts");
const { PACKAGING, INCOTERMS } = require("../specs");
const { on } = require("../flags");
const { crossStrip, crossCss } = require("../trade-strip");

/* Incoterms 2020. Who bears what, and where risk passes. These are the
   published rules, not our terms — which is exactly why this table can ship
   while the port figures cannot. */
const TERMS = [
  {
    t: "EXW",
    name: "Ex Works",
    carriage: "Buyer",
    insurance: "Buyer",
    exportCl: "Buyer",
    importCl: "Buyer",
    risk: "At our premises, once goods are placed at the buyer's disposal",
  },
  {
    t: "FOB",
    name: "Free On Board",
    carriage: "Buyer",
    insurance: "Buyer",
    exportCl: "Seller",
    importCl: "Buyer",
    risk: "On board the vessel at the named load port",
  },
  {
    t: "CFR",
    name: "Cost and Freight",
    carriage: "Seller",
    insurance: "Buyer",
    exportCl: "Seller",
    importCl: "Buyer",
    risk: "On board the vessel at the load port &mdash; before the freight we pay for",
  },
  {
    t: "CIF",
    name: "Cost, Insurance and Freight",
    carriage: "Seller",
    insurance: "Seller",
    exportCl: "Seller",
    importCl: "Buyer",
    risk: "On board the vessel at the load port, as CFR",
  },
  {
    t: "DAP",
    name: "Delivered At Place",
    carriage: "Seller",
    insurance: "Seller",
    exportCl: "Seller",
    importCl: "Buyer",
    risk: "At the named destination, goods ready for unloading",
  },
];

const MODES = [
  [
    "Break bulk",
    "Bagged or palletised cargo loaded piece by piece. The default for big bags and 50 kg sacks where no container service serves the lane.",
    `<path d="M14 62h72M22 62V38h24v24M54 62V30h22v32"/><path d="M22 50h24M54 44h22"/>`,
  ],
  [
    "Containerised",
    "20 ft and 40 ft boxes, bagged or lined for bulk. Preferred where schedule reliability matters more than freight rate.",
    `<path d="M12 34h76v32H12z"/><path d="M28 34v32M44 34v32M60 34v32M76 34v32"/>`,
  ],
  [
    "ISO tank",
    "Liquid chemicals in 20 ft tank containers. Dedicated or last-cargo-certified depending on the grade.",
    `<path d="M18 38h58a10 10 0 0 1 0 24H18a10 10 0 0 1 0-24Z"/><path d="M30 50h34"/>`,
  ],
  [
    "Big bag",
    "One-tonne FIBCs, four-loop, with liner where the grade is hygroscopic. Handles on the same gear at both ends.",
    `<path d="M28 32h44l-6 40H34z"/><path d="M36 32V22M64 32V22"/>`,
  ],
  [
    "Bulk vessel",
    "Handysize and supramax for full cargoes. Where tonnage justifies it this is the cheapest freight per tonne by a wide margin.",
    `<path d="M10 56h80l-10 18H20z"/><path d="M34 56V34h30v22"/><path d="M46 34V24"/>`,
  ],
];

const DOCSET = [
  ["Bill of lading", "Title to the goods, issued on loading. Original or telex release as the payment terms require."],
  ["Certificate of origin", "Attested by Dubai Chambers. Required for preferential duty and for most letters of credit."],
  ["Certificate of analysis", "Per shipment, against the agreed specification. Issued by the load-port inspector, not by us."],
  ["Packing list", "Lot numbers, bag or container counts, gross and net weights."],
  ["Insurance certificate", "On CIF and DAP terms. Cover assigned to the buyer or the bank as agreed."],
  ["Phytosanitary certificate", "Where the destination requires it. Applies to fertilizer grades rather than to polymers or industrial chemicals."],
];

const PORTS = [
  ["Turkmenbashi", "Turkmenistan", "Caspian", "Our principal Caspian outlet for Turkmen urea, sulphur and polypropylene."],
  ["Aktau", "Kazakhstan", "Caspian", "Rail-fed from the Kazakh interior; the alternative Caspian route when Turkmenbashi is congested."],
  ["Baku", "Azerbaijan", "Caspian", "Trans-Caspian transfer point onto the Baku-Tbilisi-Kars corridor."],
  ["Jebel Ali", "UAE", "Arabian Gulf", "Our home port. Re-export, blending and consolidation under freezone customs."],
];

const CRUMB = ["Logistics &amp; Shipping"];

module.exports = {
  page: "logistics",
  gate: "logistics",
  tier: "company",
  nav: "trade",
  crumb: CRUMB,
  title: "Logistics & Shipping — Globalex Trading FZCO",
  desc: "Incoterms 2020 allocation, load ports on the Caspian and Arabian Gulf, shipping modes from break bulk to ISO tank, packaging options and the documentation set behind every shipment.",

  css: `
${crossCss}
/* ---------- modes ---------- */
.mode{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));
  gap:clamp(.9rem,2vw,1.4rem)}
.mode-c{display:grid;gap:.75rem;align-content:start;padding:clamp(1.3rem,2.4vw,1.8rem);
  border:1px solid var(--line);background:rgba(var(--deep-rgb),.5);
  transition:border-color .45s var(--ease),transform .5s var(--ease)}
.mode-c:hover{border-color:var(--line-2);transform:translateY(-4px)}
.mode-c svg{width:44px;height:44px;color:var(--steel);
  transition:color .45s var(--ease),transform .7s var(--ease)}
.mode-c:hover svg{color:var(--cyan)}
.mode-c h3{font-size:1.1rem}
.mode-c p{color:var(--haze);font-size:.99rem}

/* ---------- packaging ---------- */
.pk{display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}
.pk-r{display:grid;grid-template-columns:auto 1fr;gap:1rem 1.4rem;align-items:baseline;
  padding:1rem 1.15rem;background:rgba(var(--deep-rgb),.72)}
.pk-r b{font-family:var(--f-mono);font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--sand);white-space:nowrap}
.pk-r span{color:var(--haze);font-size:.99rem}
@media (max-width:640px){.pk-r{grid-template-columns:1fr;gap:.35rem}}

/* ---------- ports ---------- */
.port{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr));
  gap:clamp(.9rem,2vw,1.4rem)}
.port-c{display:grid;gap:.55rem;align-content:start;padding:clamp(1.3rem,2.4vw,1.8rem);
  border:1px solid var(--line);background:linear-gradient(160deg,rgba(var(--panel-rgb),.46),rgba(var(--deep-rgb),.7))}
.port-c .mono{color:var(--cyan)}
.port-c h3{font-size:1.14rem}
.port-c p{color:var(--haze);font-size:.99rem}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "Trade &middot; Movement",
  h1: "From the load port to your discharge berth.",
  lead: "Every cargo we sell moves on terms someone has to bear the cost and the risk of. This is who bears what, how the goods are packed, which ports we lift from and which documents travel with them.",
  meta: [
    ["5", "Incoterms quoted"],
    ["4", "Load ports"],
    ["5", "Shipping modes"],
  ],
  sec: "Logistics",
  video: on("heroVideo") ? "freight" : null,
})}

<section class="sec" data-sec="Incoterms">
<div class="wrap">
<div class="hd">
<span class="eb">Incoterms&reg; 2020</span>
<h2>Who bears what, and where risk passes.</h2>
<p class="lead">The single most common source of dispute in commodity trade is a
buyer and a seller who each thought the other was insuring the cargo. These are
the allocations under the 2020 revision &mdash; the terms we quote against.</p>
</div>

<div class="tbl-wrap rv" role="region" tabindex="0" aria-label="Incoterms 2020 cost and risk allocation">
<table class="tbl is-wide">
<caption>Cost and risk allocation &middot; Incoterms&reg; 2020</caption>
<thead><tr>
<th scope="col">Term</th>
<th scope="col">Carriage</th>
<th scope="col">Insurance</th>
<th scope="col">Export clearance</th>
<th scope="col">Import clearance</th>
<th scope="col">Risk passes</th>
</tr></thead>
<tbody>
${TERMS.map(
  (r) => `<tr>
<th scope="row"><span class="chip spec">${r.t}</span><br /><small class="mono" style="letter-spacing:.06em">${r.name}</small></th>
<td>${r.carriage}</td>
<td>${r.insurance}</td>
<td>${r.exportCl}</td>
<td>${r.importCl}</td>
<td>${r.risk}</td>
</tr>`,
).join("\n")}
</tbody></table>
</div>
<p class="tbl-n">Incoterms&reg; is a trademark of the International Chamber of
Commerce. The rules govern cost, risk and clearance &mdash; not payment terms,
title transfer or the law of the contract.</p>
</div>
</section>

<section class="sec sec-panel" data-sec="Ports">
<div class="wrap">
<div class="hd">
<span class="eb mat">Origin</span>
<h2>Where we load.</h2>
<p class="lead">Three Caspian ports and our home port in the Gulf. Which one a
cargo lifts from is a function of the grade, the origin mill and what is
berthing that month.</p>
</div>
<div class="port rvs">
${PORTS.map(
  ([name, country, sea, note]) => `<article class="port-c nch-m">
<span class="mono">${sea}</span>
<h3>${name}</h3>
<span class="mono" style="color:var(--haze-d)">${country}</span>
<p>${note}</p>
${
  on("logisticsPorts")
    ? ""
    : `<p class="mono" style="color:var(--steel);margin-top:.5rem">Operational figures on request</p>`
}
</article>`,
).join("\n")}
</div>
${
  on("logisticsPorts")
    ? ""
    : `<p class="tbl-n" style="margin-top:1.4rem">Draft, berth availability and
typical load rates are quoted per cargo rather than published &mdash; they move
with the season and the vessel. Ask the desk for the current position on a
specific lane.</p>`
}
</div>
</section>

<section class="sec" data-sec="Modes">
<div class="wrap">
<div class="hd">
<span class="eb">Carriage</span>
<h2>How it travels.</h2>
</div>
<div class="mode rvs">
${MODES.map(
  ([name, note, path]) => `<article class="mode-c nch-s">
<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">${path}</g></svg>
<h3>${name}</h3>
<p>${note}</p>
</article>`,
).join("\n")}
</div>
</div>
</section>

<section class="sec sec-panel" data-sec="Packaging">
<div class="wrap">
<div class="split is-1-2">
<div class="hd" style="margin-bottom:0">
<span class="eb mat">Presentation</span>
<h2>Packaging.</h2>
<p class="lead">The same controlled list the product pages quote from, so what
a grade page offers and what shipping can actually load cannot drift apart.</p>
</div>
<div class="pk rv">
${PACKAGING.map(
  (k) => `<div class="pk-r"><b>${k}</b><span>Available on the grades whose specification lists it.</span></div>`,
).join("\n")}
</div>
</div>
</div>
</section>

<section class="sec" data-sec="Documents">
<div class="wrap">
<div class="hd">
<span class="eb">Paperwork</span>
<h2>What travels with the cargo.</h2>
<p class="lead">A shipment is only as good as its documents. These are the set
we issue or procure as standard; anything a letter of credit adds is handled
per contract. The order they are raised in is set out in
<a class="lk" href="procedures.html">trade procedures</a>.</p>
</div>
<ol class="obj rvs">
${DOCSET.map(
  ([t, d]) => `<li><div><h4>${t}</h4><p>${d}</p></div></li>`,
).join("\n")}
</ol>
</div>
</section>

${
  on("logisticsTransit")
    ? ""
    : `<section class="sec is-tight sec-panel" data-sec="Transit">
<div class="wrap">
<div class="pp-req nch-m" style="max-width:70ch">
<span class="eb">Transit times</span>
<p>Indicative origin-to-destination transit is quoted per lane rather than
published. A figure on a page ages badly &mdash; it depends on the routing, the
season and the vessel &mdash; and a buyer plans a letter of credit around it.
Tell us the origin and the discharge port and the desk will give you a current
window.</p>
<div class="btns" style="margin-top:.3rem">
<a class="btn btn-p" data-mag="6" href="contact.html">Ask about a lane <span class="ar">&rarr;</span></a>
</div>
</div>
</div>
</section>`
}

${crossStrip("logistics")}

${cta({
  eyebrow: "Open a lane",
  h2: "Tell us the port and the window.",
  lead: "Origin, grade, tonnage and discharge port is enough for the desk to come back with terms.",
  primary: ["Contact the desk", "contact.html"],
})}`,
};
