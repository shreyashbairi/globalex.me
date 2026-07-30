const { hero, cta } = require("../parts");

const COMMITS = [
  [
    "Environmental stewardship",
    "Environment",
    "Minimising ecological impact through renewable energy adoption, efficiency improvements and greenhouse gas reduction &mdash; alongside resource conservation, waste minimisation and recycling across operations.",
  ],
  [
    "Ethical sourcing and fair trade",
    "Sourcing",
    "Partnering with suppliers who share our position on labour practices and human rights, and supporting the sustainable development of the local economies we operate within.",
  ],
  [
    "Product quality and durability",
    "Quality",
    "Focusing on high-quality, long-lasting products that reduce the need for frequent replacement &mdash; the cheapest waste to eliminate is the waste never created.",
  ],
  [
    "Collaboration and transparency",
    "Transparency",
    "Engaging stakeholders through open dialogue and transparent reporting, so accountability is demonstrable rather than asserted.",
  ],
  [
    "Social impact",
    "Community",
    "Supporting initiatives in education, health and social well-being, alongside philanthropic work in the regions where we operate.",
  ],
  [
    "Continuous improvement",
    "Innovation",
    "Investing in research and development to explore new technologies while monitoring sustainability trends &mdash; doing better tomorrow than today is the standard, not the ambition.",
  ],
];

const CRUMB = ["Sustainability"];

module.exports = {
  page: "sustainability",
  tier: "company",
  nav: "sustainability",
  crumb: CRUMB,
  title: "Sustainability — Globalex Trading FZCO",
  desc: "Six commitments — environmental stewardship, ethical sourcing, product quality, transparency, social impact and continuous improvement — applied to product, partner and process decisions.",

  css: `
.cmt{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--gut)}
.cmt-c{position:relative;padding:clamp(1.6rem,2.8vw,2.3rem);border:1px solid var(--line);
  background:linear-gradient(160deg,rgba(35,89,107,.32),rgba(20,53,68,.66));
  display:grid;gap:.9rem;align-content:start;overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));
  transition:border-color .45s var(--ease),transform .55s var(--ease)}
.cmt-c:hover{border-color:rgba(217,183,120,.42);transform:translateY(-4px)}
.cmt-c svg{position:absolute;right:-30px;top:-30px;width:150px;height:150px;color:var(--sand);
  opacity:.07;transition:opacity .55s var(--ease),transform .9s var(--ease)}
.cmt-c:hover svg{opacity:.16;transform:rotate(45deg)}
.cmt-c h3{font-size:1.22rem;line-height:1.2;max-width:20ch}
.cmt-c p{color:var(--haze);font-size:1rem}
@media (max-width:820px){.cmt{grid-template-columns:1fr}}

/* why-it-matters split */
.why{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.why-vis{position:relative;aspect-ratio:1;border:1px solid var(--line);overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))}
.why-vis canvas{position:absolute;inset:0;width:100%;height:100%}
@media (max-width:940px){.why{grid-template-columns:1fr}.why-vis{order:-1;aspect-ratio:16/10}}

/* the three levers */
.lever{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
.lever div{padding:clamp(1.5rem,2.8vw,2.2rem) clamp(1rem,2vw,1.6rem) 0;display:grid;gap:.6rem;
  align-content:start;border-right:1px solid var(--line)}
.lever div:last-child{border-right:0}
.lever b{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.18em;text-transform:uppercase;
  color:var(--sand)}
.lever p{color:var(--frost);font-family:var(--f-disp);font-weight:600;font-size:1.05rem;
  font-variation-settings:'wdth' 104;line-height:1.32}
@media (max-width:820px){.lever{grid-template-columns:1fr}
  .lever div{border-right:0;border-bottom:1px solid var(--line);padding-bottom:1.4rem}
  .lever div:last-child{border-bottom:0}}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "Six commitments &middot; One standard",
  h1: "Sustainable practice is not an option. It is a responsibility we owe the planet and the generations after us.",
  lead: "",
  tone: "sand",
  sec: "Sustainability",
})}

<section class="sec is-tight" data-sec="Why">
  <div class="wrap">
    <div class="why">
      <div class="why-vis rv">
        <canvas data-orn="sand" data-tile="136" data-nodes="7" data-alpha="0.42"></canvas>
      </div>
      <div class="rv" style="--d:120ms">
        <span class="eb mat">Why this matters here</span>
        <h2 style="margin-top:.9rem">Trading commodities means having a hand in what the world becomes.</h2>
        <p class="lead" style="margin-top:1.35rem">Fertilizers shape food systems. Polymers shape packaging waste. Industrial chemicals shape water quality. Every shipment is a small contribution to the trajectory of climate, communities and supply chains &mdash; and we would rather contribute deliberately than by default.</p>
        <p style="margin-top:1.15rem;color:var(--haze)">The six commitments below are not a marketing exercise. They are the framework we use when choosing which suppliers to partner with, which contracts to sign, and which deals to walk away from.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec is-tight">
  <div class="wrap">
    <div class="lever rvs">
      <div><b>Product decision</b><p>Which grades we carry, and the lifecycle they imply.</p></div>
      <div><b>Partner decision</b><p>Whose labour and environmental practice we are willing to underwrite.</p></div>
      <div><b>Process decision</b><p>How we move cargo, and what that movement costs the atmosphere.</p></div>
    </div>
  </div>
</section>

<section class="sec" data-sec="Commitments">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb mat">Our commitments</span>
      <h2>Six areas where the practice has to meet the principle.</h2>
    </div>

    <div class="cmt rvs">
${COMMITS.map(
  ([h, tag, d]) => `      <article class="cmt-c">
        <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.5"><path d="M50 4 96 50 50 96 4 50Z"/><path d="M50 22 78 50 50 78 22 50Z"/><path d="M50 38 62 50 50 62 38 50Z" fill="currentColor"/></g></svg>
        <span class="eb mat">${tag}</span>
        <h3>${h}</h3>
        <p>${d}</p>
      </article>`,
).join("\n")}
    </div>
  </div>
</section>

<section class="sec sec-panel">
  <div class="narrow">
    <div class="rv">
      <span class="eb mat">The long view</span>
      <blockquote class="pq" style="margin-top:1.5rem">Sustainability is an ongoing journey &mdash; aimed at creating a better future for our planet, our stakeholders, and generations to come.</blockquote>
    </div>
  </div>
</section>

${cta({
  eyebrow: "Partner with us",
  h2: "Build with a partner who shares your standards.",
  lead: "If sustainability commitments factor into your sourcing decisions, let us show you how these six pillars translate into shipment-level practice.",
  primary: ["Get in touch", "contact.html"],
  secondary: ["About Globalex", "about.html"],
  tone: "sand",
})}
`,
};
