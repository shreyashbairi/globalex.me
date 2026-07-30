/* ============================================================
   COMPLIANCE & CERTIFICATIONS

   ⚠️  GATED IN _src/flags.js AND IT SHOULD STAY THAT WAY UNTIL READ.

   This page is structurally complete and every section is written, but unlike
   the rest of the site it is not marketing copy — it is a set of compliance
   representations. A counterparty's legal team will read it, quote it back,
   and rely on it. Several statements here describe what a trading house of
   this kind normally does; whether they describe what *we* do is a question
   only someone with authority can answer.

   Specifically, before PAGES.compliance goes true, someone must confirm:

     · the freezone that issued the trade licence, and its number
     · the Dubai Customs importer/exporter code
     · the Dubai Chambers membership number
     · which documents the KYC pack actually requires
     · which sanctions lists are screened, by what tool, and who signs a hit
     · the UBO threshold used, and the evidence accepted
     · which inspection agencies we genuinely have arrangements with
     · the anti-bribery policy text and the channel for raising a concern
     · the sanctions and trade-controls position — with legal sign-off

   Every number is a placeholder rendered as "[on file]" rather than invented,
   and the agencies section names no agency we have not confirmed.
   ============================================================ */

const { hero, cta } = require("../parts");
const { crossStrip, crossCss } = require("../trade-strip");

/* Regulatory standing. The three chips already in the site footer, promoted
   into full statements — which is what the brief asks for. The registrations
   themselves are real; only the identifying numbers are withheld. */
const STANDING = [
  [
    "FZCO freezone licence",
    "Registered and licensed as a Free Zone Company in the United Arab Emirates, trading under the activity scope granted by that licence.",
    "Licence number",
  ],
  [
    "Dubai Customs registration",
    "Registered with Dubai Customs as an importer and exporter, which is what allows cargo to clear in our own name rather than through an agent.",
    "Importer code",
  ],
  [
    "Dubai Chambers membership",
    "Member of Dubai Chambers, which attests our certificates of origin — a document most letters of credit will not settle without.",
    "Membership number",
  ],
];

/* Counterparty due diligence. Process description rather than a claim about
   any specific provider or list, because those need confirming. */
const KYC = [
  [
    "Onboarding",
    "No counterparty is invoiced before it is onboarded. Corporate identity, trade licence, and authority to contract are established and recorded before a first cargo moves.",
  ],
  [
    "Sanctions and restricted-party screening",
    "Counterparties, and the vessels and banks in a transaction, are screened against the applicable consolidated sanctions lists before contracting and again before shipment. A match stops the transaction until it is resolved and signed off.",
  ],
  [
    "Beneficial ownership",
    "Ownership is traced to the natural persons who ultimately control the counterparty, and evidenced rather than asserted. An ownership structure we cannot see through is a reason to decline.",
  ],
  [
    "Ongoing monitoring",
    "Onboarding is not a one-off. Standing counterparties are re-screened periodically and on any change of ownership, jurisdiction or trade pattern.",
  ],
];

const QA = [
  [
    "Independent inspection",
    "Quality and quantity are determined by a third-party inspector at load and, where the contract provides for it, again at discharge. The inspector is appointed by agreement between buyer and seller.",
  ],
  [
    "Certificate of analysis",
    "Issued per shipment against the contractual specification, by the inspector rather than by us. A certificate we wrote ourselves would be worth nothing to a buyer's QC team.",
  ],
  [
    "Sampling protocol",
    "Composite sampling at the point of loading, to the method named in the contract, so a later dispute has a defined reference rather than an argument.",
  ],
  [
    "Retained samples",
    "Sealed samples are retained against the shipment so a discharge-port result can be checked against what actually loaded.",
  ],
];

const CRUMB = ["Compliance &amp; Certifications"];

module.exports = {
  page: "compliance",
  gate: "compliance",
  tier: "company",
  nav: "trade",
  crumb: CRUMB,
  title: "Compliance & Certifications — Globalex Trading FZCO",
  desc: "Freezone licensing and Dubai Customs registration, counterparty due diligence and sanctions screening, third-party inspection and certificates of analysis, and our position on trade controls.",

  css: `
${crossCss}
/* ---------- regulatory standing ---------- */
.std{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr));
  gap:clamp(.9rem,2vw,1.4rem)}
.std-c{display:grid;gap:.6rem;align-content:start;padding:clamp(1.4rem,2.6vw,2rem);
  border:1px solid var(--line);background:linear-gradient(160deg,rgba(var(--panel-rgb),.46),rgba(var(--deep-rgb),.7));
  transition:border-color .45s var(--ease),transform .5s var(--ease)}
.std-c:hover{border-color:rgba(var(--cyan-rgb),.42);transform:translateY(-4px)}
.std-c h3{font-size:1.12rem}
.std-c p{color:var(--haze);font-size:.99rem}
/* the withheld identifier, shown as withheld rather than invented */
.std-n{margin-top:.3rem;display:flex;align-items:baseline;justify-content:space-between;
  gap:1rem;padding-top:.7rem;border-top:1px solid var(--line);font-family:var(--f-mono);
  font-size:.68rem;letter-spacing:.13em;text-transform:uppercase;color:var(--haze-d)}
.std-n b{color:var(--steel);font-weight:500}

/* ---------- position statements ---------- */
.pos{display:grid;gap:var(--gut)}
.pos-c{padding:clamp(1.5rem,3vw,2.3rem);border:1px solid var(--line);
  border-left:2px solid var(--cyan);background:rgba(var(--deep-rgb),.5);display:grid;gap:.85rem}
.pos-c h3{font-size:var(--t-h4)}
.pos-c p{color:var(--haze);max-width:74ch}
.pos-c.mat{border-left-color:var(--sand-t)}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "Compliance &middot; FZCO Freezone",
  h1: "Licensed, screened, inspected, documented.",
  lead: "A commodity trade is only as sound as the counterparty at the other end of it and the paperwork in between. This is how we establish both &mdash; what we are licensed to do, who we will deal with, and what we will not carry.",
  meta: [
    ["FZCO", "Freezone licence"],
    ["UAE", "Jurisdiction"],
    ["Third party", "Inspection standard"],
  ],
  sec: "Compliance",
})}

<section class="sec" data-sec="Standing">
<div class="wrap">
<div class="hd">
<span class="eb">Regulatory standing</span>
<h2>What we are registered to do.</h2>
</div>
<div class="std rvs">
${STANDING.map(
  ([t, d, label]) => `<article class="std-c nch-m">
<h3>${t}</h3>
<p>${d}</p>
<div class="std-n"><span>${label}</span><b>[on file]</b></div>
</article>`,
).join("\n")}
</div>
<p class="tbl-n" style="margin-top:1.4rem">Licence, registration and membership
numbers are supplied directly to counterparties as part of onboarding rather
than published.</p>
</div>
</section>

<section class="sec sec-panel" data-sec="Due diligence">
<div class="wrap">
<div class="hd">
<span class="eb">Counterparty due diligence</span>
<h2>Who we will trade with.</h2>
<p class="lead">Know-your-counterparty is not a formality here. A cargo moving
to the wrong end user is a problem no commercial term can fix afterwards.</p>
</div>
<ol class="obj rvs">
${KYC.map(([t, d]) => `<li><div><h4>${t}</h4><p>${d}</p></div></li>`).join("\n")}
</ol>
</div>
</section>

<section class="sec" data-sec="Quality">
<div class="wrap">
<div class="hd">
<span class="eb">Quality assurance</span>
<h2>How quality is established.</h2>
<p class="lead">By someone other than us. Every figure a buyer relies on comes
from an independent inspector, and the sealed samples stay available if a
discharge result ever needs checking.</p>
</div>
<ol class="obj rvs">
${QA.map(([t, d]) => `<li><div><h4>${t}</h4><p>${d}</p></div></li>`).join("\n")}
</ol>
<p class="tbl-n" style="margin-top:1.4rem">The inspection agencies we hold
arrangements with are named per contract. Safety and technical sheets are issued
through the <a class="lk" href="index.html#specifications">controlled document
register</a>.</p>
</div>
</section>

<section class="sec sec-panel" data-sec="Position">
<div class="wrap">
<div class="hd">
<span class="eb">Stated positions</span>
<h2>Where the lines are.</h2>
</div>
<div class="pos rvs">

<article class="pos-c">
<h3>Anti-bribery and ethics</h3>
<p>We do not offer, pay, solicit or accept a bribe, a facilitation payment or
any other improper inducement, and we do not engage anyone to do so on our
behalf. That applies to public officials and to private counterparties equally,
and it applies where a payment would be customary as much as where it would be
plainly unlawful.</p>
<p>A concern about conduct &mdash; ours, a counterparty's, or an agent's &mdash;
can be raised with the desk directly and will be handled without retaliation
against the person raising it.</p>
</article>

<article class="pos-c mat">
<h3>Sanctions and trade controls</h3>
<p>We do not ship to a restricted destination, to a restricted party, or for a
restricted end use. Where a grade has a dual-use character we establish the end
use before contracting, and we will decline a transaction we cannot satisfy
ourselves about &mdash; including after a contract is signed, if something
changes.</p>
<p>Diversion is a real risk in this trade rather than a theoretical one. Routing
and end-user documentation are part of the transaction, not an afterthought.</p>
</article>

</div>
<p class="tbl-n" style="margin-top:1.4rem">These are statements of position. The
governing obligations in any transaction are those in the contract.</p>
</div>
</section>

${crossStrip("compliance")}

${cta({
  eyebrow: "Due diligence",
  h2: "Request the compliance pack.",
  lead: "Licence, registration and membership documentation, our screening approach and the inspection arrangements for your lane &mdash; sent to counterparties on request.",
  primary: ["Request the pack", "contact.html"],
})}`,
};
