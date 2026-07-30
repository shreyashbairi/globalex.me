/* ============================================================
   TRADE CROSS-LINK STRIP

   procedures / logistics / compliance are one story told in three parts, and
   the brief asks for a consistent strip on all three. Built here rather than
   copied into each page so the wording, the order and the styling cannot
   drift, and so a page that is switched off in flags.js drops out of the
   other two strips automatically instead of leaving a dead link.
   ============================================================ */

const { pageLive } = require("./flags");

const PARTS = [
  {
    id: "procedures",
    href: "procedures.html",
    label: "Trade procedures",
    note: "How an enquiry becomes a shipment, step by step",
    /* always live — it is an existing authored page with no gate */
    gate: null,
  },
  {
    id: "logistics",
    href: "logistics.html",
    label: "Logistics &amp; shipping",
    note: "Incoterms, load ports, packing and documents",
    gate: "logistics",
  },
  {
    id: "compliance",
    href: "compliance.html",
    label: "Compliance &amp; certifications",
    note: "Licensing, due diligence, inspection and controls",
    gate: "compliance",
  },
];

/* `current` is the page rendering the strip; it is shown as the present
   position rather than as a link to itself. */
const crossStrip = (current) => {
  const rows = PARTS.filter((p) => p.id === current || !p.gate || pageLive(p.gate));
  if (rows.length < 2) return "";
  return `<section class="sec is-tight" data-sec="Also">
<div class="wrap">
<div class="xs rv">
<span class="xs-l">One process, three parts</span>
<div class="xs-g">
${rows
  .map((p) =>
    p.id === current
      ? `<span class="xs-c is-here"><b>${p.label}</b><small>${p.note}</small><i>You are here</i></span>`
      : `<a class="xs-c" href="${p.href}"><b>${p.label}</b><small>${p.note}</small><i>Open &rarr;</i></a>`,
  )
  .join("\n")}
</div>
</div>
</div>
</section>`;
};

const crossCss = `
/* ---------- trade cross-link strip ---------- */
.xs{display:grid;gap:1.1rem;padding:clamp(1.4rem,2.8vw,2.1rem);border:1px solid var(--line);
  background:linear-gradient(150deg,rgba(var(--panel-rgb),.4),rgba(var(--deep-rgb),.62));
  clip-path:polygon(0 0,calc(100% - var(--notch-m)) 0,100% var(--notch-m),100% 100%,
    var(--notch-m) 100%,0 calc(100% - var(--notch-m)))}
.xs-l{font-family:var(--f-mono);font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;
  color:var(--steel)}
.xs-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:1px;
  background:var(--line)}
.xs-c{display:grid;gap:.3rem;align-content:start;padding:1.05rem 1.15rem;
  background:rgba(var(--deep-rgb),.66);transition:background .35s var(--ease)}
.xs-c:hover{background:rgba(var(--cyan-rgb),.07)}
.xs-c b{font-family:var(--f-disp);font-weight:700;font-size:1.03rem;
  font-variation-settings:'wdth' 106;color:var(--frost)}
.xs-c small{color:var(--haze);font-size:.93rem}
.xs-c i{font-style:normal;margin-top:.35rem;font-family:var(--f-mono);font-size:.66rem;
  letter-spacing:.15em;text-transform:uppercase;color:var(--cyan)}
.xs-c.is-here{background:rgba(var(--panel-rgb),.5)}
.xs-c.is-here i{color:var(--sand-t)}
.xs-c.is-here b{color:var(--haze)}
`;

module.exports = { crossStrip, crossCss, PARTS };
