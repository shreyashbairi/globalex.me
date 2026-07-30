const { hero, cta } = require("../parts");

const CRUMB = ["About"];

module.exports = {
  page: "about",
  tier: "company",
  nav: "company",
  crumb: CRUMB,
  title: "About — Globalex Trading FZCO",
  desc: "Established in 2019 on honesty, integrity and trust. A FZCO freezone trading house in Jumeirah Lakes Towers, Dubai, sourcing across the Caspian and Central Asia.",

  css: `
/* HQ plate */
.hq{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.hq-vis{position:relative;aspect-ratio:4/5;border:1px solid var(--line);overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))}
.hq-vis canvas{position:absolute;inset:0;width:100%;height:100%}
.hq-tag{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:1.15rem 1.35rem;
  background:linear-gradient(0deg,rgba(15,42,56,.94),transparent);
  font-family:var(--f-mono);font-size:.725rem;letter-spacing:.16em;text-transform:uppercase;
  color:var(--haze);display:grid;gap:.3rem}
.hq-tag b{color:var(--cyan);font-weight:500}
@media (max-width:940px){.hq{grid-template-columns:1fr}.hq-vis{aspect-ratio:16/11}}

/* mission / vision plates */
.mv{display:grid;grid-template-columns:1fr 1fr;gap:var(--gut)}
.mv-c{position:relative;padding:clamp(1.9rem,3.6vw,3rem);border:1px solid var(--line);
  display:grid;gap:1.4rem;align-content:start;
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
.mv-c.a{background:linear-gradient(155deg,rgba(53,214,245,.09),rgba(20,53,68,.6))}
.mv-c.b{background:linear-gradient(155deg,rgba(217,183,120,.08),rgba(20,53,68,.6))}
.mv-c q{quotes:none;font-family:var(--f-disp);font-weight:700;
  font-size:clamp(1.15rem,2.3vw,1.62rem);line-height:1.28;letter-spacing:-.018em;
  font-variation-settings:'wdth' 108;color:var(--frost);text-wrap:pretty}
@media (max-width:840px){.mv{grid-template-columns:1fr}}

/* five values — a defined set, not a sequence, so they get the gül not a number */
.vals{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--line)}
.val{padding:clamp(1.5rem,2.6vw,2.1rem) clamp(1.1rem,1.9vw,1.5rem);border-right:1px solid var(--line);
  display:grid;gap:.7rem;align-content:start;position:relative;transition:background .45s var(--ease)}
.val:last-child{border-right:0}
.val:hover{background:rgba(53,214,245,.05)}
.val svg{width:26px;height:26px;color:var(--steel);transition:color .45s var(--ease),transform .7s var(--ease)}
.val:hover svg{color:var(--cyan);transform:rotate(90deg)}
.val h4{font-size:1.08rem}
.val p{color:var(--haze);font-size:.95rem;line-height:1.5}
@media (max-width:1100px){.vals{grid-template-columns:repeat(2,1fr)}
  .val{border-bottom:1px solid var(--line)}
  .val:nth-child(2n){border-right:0}
  .val:last-child{grid-column:1/-1;border-bottom:0}}
@media (max-width:560px){.vals{grid-template-columns:1fr}
  .val{border-right:0}.val:last-child{grid-column:auto}}

/* objectives — genuinely ordered operating goals */
.obj{display:grid;counter-reset:o}
.obj li{position:relative;display:grid;grid-template-columns:3rem 1fr;gap:1.5rem;
  padding:1.5rem 0;border-bottom:1px solid var(--line);counter-increment:o;
  transition:padding-left .4s var(--ease)}
.obj li:first-child{border-top:1px solid var(--line)}
.obj li:hover{padding-left:.6rem}
.obj li::before{content:counter(o,decimal-leading-zero);font-family:var(--f-mono);font-size:.78rem;
  letter-spacing:.12em;color:var(--cyan);padding-top:.35rem}
.obj h4{margin-bottom:.35rem}
.obj p{color:var(--haze);font-size:1.02rem;max-width:64ch}
@media (max-width:560px){.obj li{grid-template-columns:2.2rem 1fr;gap:.9rem}}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "Established 2019 &middot; FZCO Freezone",
  h1: "An international trading house built in Dubai, sourced from the Caspian.",
  lead: "Globalex Trading FZCO specialises in urea, sulphur, fertilizers and polymers &mdash; registered and licensed as a freezone company under FZCO in the United Arab Emirates.",
  meta: [
    ["2019", "Founded"],
    ["FZCO", "Freezone licence"],
    ["24+", "Grades traded"],
    ["7", "Origin markets"],
  ],
  sec: "About",
})}

<section class="sec">
  <div class="wrap">
    <div class="split is-1-2">
      <div class="rv">
        <span class="eb">Who we are</span>
        <h2 style="margin-top:.9rem">A trading partner built for the long game.</h2>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">Globalex operates from Jumeirah Lakes Towers as a FZCO freezone licensed company. Since 2019 we have built our practice on three principles: source from origins we trust, deliver with the rigour our clients expect, and never compromise on the quality of what we move.</p>
        <p class="lead" style="margin-top:1.2rem">Our products originate mostly in the Caspian region and Central Asia &mdash; Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan &mdash; with additional sourcing partnerships in the UAE, Saudi Arabia and China.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-panel" data-sec="Headquarters">
  <div class="wrap">
    <div class="hq">
      <div>
        <span class="eb rv">Jumeirah Lakes Towers &middot; Dubai</span>
        <h2 class="rv" style="--d:80ms;margin-top:.9rem">Positioned deliberately between producer and buyer.</h2>
        <p class="lead rv" style="--d:150ms;margin-top:1.35rem">Suite 2605, X3 Tower, sits inside Cluster X of Jumeirah Lakes Towers &mdash; one of the world's most active commercial freezones. The location does three jobs: FZCO gives us regulatory clarity, Jebel Ali and DP World give us logistics depth, and the time zone puts us within a working day of both Caspian producers and global buyers.</p>
        <p class="rv" style="--d:210ms;margin-top:1.1rem;color:var(--haze)">This is where shipments are negotiated, contracts are signed, and the relationships behind two dozen trade lanes are kept warm.</p>
        <div class="btns rv" style="--d:270ms;margin-top:1.9rem">
          <a href="contact.html" class="lk">Visit the Dubai desk</a>
        </div>
      </div>
      <div class="hq-vis rv" style="--d:120ms">
        <canvas data-orn="cyan" data-tile="120" data-nodes="5" data-alpha="0.4"></canvas>
        <div class="hq-tag">
          <span><b>2605 X3 Tower</b> &middot; Cluster X, JLT</span>
          <span>25.0693&deg;N / 55.1413&deg;E &middot; 337622 Dubai, UAE</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec" data-sec="Mandate">
  <div class="wrap">
    <div class="mv rvs">
      <article class="mv-c a">
        <span class="eb">Mission</span>
        <q>Our mission is to always exceed our clients, producers and suppliers expectations by providing highest quality products and exceptional services.</q>
      </article>
      <article class="mv-c b">
        <span class="eb mat">Vision</span>
        <q>Our vision is to maintain an existence in international trading that is both invigorated and prevalent.</q>
      </article>
    </div>
  </div>
</section>

<section class="sec" data-sec="Values">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Our core five</span>
      <h2>The principles behind every shipment, contract and conversation.</h2>
    </div>
    <div class="vals rv">
      <article class="val">
        <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4"><path d="M50 8 92 50 50 92 8 50Z"/><path d="M50 34 66 50 50 66 34 50Z" fill="currentColor"/></g></svg>
        <h4>Integrity</h4>
        <p>Honest dealing as the baseline, not the differentiator.</p>
      </article>
      <article class="val">
        <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4"><path d="M50 8 92 50 50 92 8 50Z"/><path d="M50 26 74 50 50 74 26 50Z"/></g></svg>
        <h4>Leadership</h4>
        <p>Setting the standard in our trade lanes and origin markets.</p>
      </article>
      <article class="val">
        <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4"><path d="M50 8 92 50 50 92 8 50Z"/><path d="M28 50h44M50 28v44"/></g></svg>
        <h4>Commitment</h4>
        <p>When we sign, we deliver &mdash; on volume, on quality, on time.</p>
      </article>
      <article class="val">
        <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4"><path d="M50 8 92 50 50 92 8 50Z"/><path d="M32 32 68 68M68 32 32 68"/></g></svg>
        <h4>Innovation</h4>
        <p>Better logistics, smarter financing, cleaner products.</p>
      </article>
      <article class="val">
        <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4"><path d="M50 8 92 50 50 92 8 50Z"/><circle cx="50" cy="50" r="15"/></g></svg>
        <h4>Impact</h4>
        <p>Trading that strengthens the economies we touch.</p>
      </article>
    </div>
  </div>
</section>

<section class="sec sec-panel" data-sec="Objectives">
  <div class="wrap">
    <div class="split is-1-2" style="margin-bottom:clamp(2rem,4vw,3.25rem)">
      <div class="rv">
        <span class="eb">Operating objectives</span>
        <h2 style="margin-top:.9rem">Six goals we measure ourselves against each quarter.</h2>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">These are not aspirations. They are the operating targets the team reports on, in order of how they compound: growth first, then the controls that make growth survivable.</p>
      </div>
    </div>

    <ol class="obj rvs">
      <li><div><h4>Grow market share</h4><p>Expand across existing trade lanes while opening disciplined new corridors.</p></div></li>
      <li><div><h4>Mitigate risk</h4><p>Layered counterparty, currency and logistics controls embedded in every deal.</p></div></li>
      <li><div><h4>Increase profitability</h4><p>Sustainable margin growth through tighter sourcing, smarter financing and operational rigour.</p></div></li>
      <li><div><h4>Promote sustainability</h4><p>Six commitments applied to product, partner and process decisions.</p></div></li>
      <li><div><h4>Enhance the client experience</h4><p>Faster quotes, clearer documentation, proactive shipment communication at every stage.</p></div></li>
      <li><div><h4>Build the culture</h4><p>Investing in the team, and in the values that make this a place professionals stay.</p></div></li>
    </ol>
  </div>
</section>

<section class="sec" data-sec="Why us">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Why clients return</span>
      <h2>Three reasons the second deal follows the first.</h2>
    </div>
    <div class="g3 rvs">
      <article class="card pil">
        <span class="ix">Deal discipline</span>
        <h3>Ten checkpoints, every time.</h3>
        <p>From NCND and IMFPA through LC activation and shipment, one standardised procedure protects every party while keeping the pace.</p>
        <a href="procedures.html" class="lk">See the procedure</a>
      </article>
      <article class="card pil">
        <span class="ix">Origin expertise</span>
        <h3>We know the plants, not just the paperwork.</h3>
        <p>A specialist focus on the Caspian and Central Asian corridor means our supplier relationships are personal, not merely contractual.</p>
      </article>
      <article class="card pil">
        <span class="ix">Counterparties</span>
        <h3>The company we keep.</h3>
        <p>SOCAR, DP World, the World Economic Forum, AIFC and Horasis &mdash; the institutions we work alongside reflect the standard we hold ourselves to.</p>
      </article>
    </div>
  </div>
</section>

${cta({
  eyebrow: "Work with us",
  h2: "Tell us about your sourcing needs.",
  lead: "Caspian-origin fertilizer supply, polymer pricing, or a specialty industrial chemical &mdash; start a conversation with the Dubai team.",
  primary: ["Contact us", "contact.html"],
  secondary: ["Careers at Globalex", "careers.html"],
})}
`,
};
