const { hero } = require("../parts");

const CRUMB = ["Careers"];

module.exports = {
  page: "careers",
  tier: "company",
  nav: "company",
  crumb: CRUMB,
  title: "Careers — Globalex Trading FZCO",
  desc: "Open roles at Globalex Trading FZCO in Dubai: Digital Marketing Manager (Shopify and D2C growth) and Chemical Engineer. Apply with your CV.",

  css: `
.role{position:relative;padding:clamp(1.7rem,3vw,2.5rem);border:1px solid var(--line);
  background:linear-gradient(160deg,rgba(35,89,107,.34),rgba(20,53,68,.68));display:grid;gap:1.15rem;
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px));
  transition:border-color .45s var(--ease)}
.role:hover{border-color:rgba(53,214,245,.4)}
.role-h{display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;flex-wrap:wrap}
.role-h h3{max-width:24ch}
.role-m{display:flex;flex-wrap:wrap;gap:.5rem 1.15rem;margin-top:.7rem;font-family:var(--f-mono);
  font-size:.715rem;letter-spacing:.14em;text-transform:uppercase;color:var(--haze-d)}
.role-m span{display:flex;align-items:center;gap:.5em}
.role-m span::before{content:'';width:5px;height:5px;background:var(--cyan);opacity:.6;flex:none;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.role p{color:var(--haze);max-width:78ch}
.role ul{display:grid;gap:.5rem}
.role li{display:flex;gap:.7rem;align-items:baseline;color:var(--haze);font-size:1rem}
.role li::before{content:'';width:5px;height:5px;margin-top:.5em;flex:none;background:var(--sand);
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}

/* culture split */
.cul{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.cul-vis{position:relative;aspect-ratio:4/3;border:1px solid var(--line);overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))}
.cul-vis canvas{position:absolute;inset:0;width:100%;height:100%}
@media (max-width:940px){.cul{grid-template-columns:1fr}.cul-vis{order:-1;aspect-ratio:16/10}}

.apply{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(2rem,5vw,4rem);align-items:start}
@media (max-width:940px){.apply{grid-template-columns:1fr}}
.sent{font-family:var(--f-mono);font-size:.725rem;letter-spacing:.13em;text-transform:uppercase;
  color:var(--cyan);min-height:1.2em}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "Open roles &middot; Dubai, UAE",
  h1: "Global trade. Real ownership. Full exposure.",
  lead: "Two roles open in Dubai, and a standing interest in professionals who share our standards. We are a trading house where every person touches deals, owns relationships and sees the whole picture &mdash; from sourcing decision to bill of lading.",
  meta: [
    ["2", "Open roles"],
    ["Dubai", "On-site / hybrid"],
    ["Weekly", "Application review"],
  ],
  sec: "Careers",
})}

<section class="sec is-tight" data-sec="Culture">
  <div class="wrap">
    <div class="cul">
      <div class="cul-vis rv">
        <canvas data-orn="cyan" data-tile="126" data-nodes="6" data-alpha="0.38"></canvas>
      </div>
      <div class="rv" style="--d:120ms">
        <span class="eb">Working at Globalex</span>
        <h2 style="margin-top:.9rem">A small desk means nothing is somebody else's problem.</h2>
        <p class="lead" style="margin-top:1.35rem">There are no hidden corners in this work, and that is the point. You will see the sourcing conversation, the contract, the financing instrument and the shipment &mdash; usually on the same deal, often in the same week.</p>
        <p style="margin-top:1.15rem;color:var(--haze)">If you want to build a career in international commodity trading alongside people who care about getting the details right, send us your CV &mdash; including when we have not advertised a role that fits you.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec" data-sec="Open roles">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Current openings</span>
      <h2>Two open roles. Both in Dubai.</h2>
    </div>

    <div class="rvs" style="display:grid;gap:var(--gut)">

      <article class="role">
        <div class="role-h">
          <div>
            <h3>Digital Marketing Manager &mdash; Shopify &amp; D2C growth</h3>
            <div class="role-m">
              <span>Dubai, UAE</span><span>On-site / hybrid</span><span>Full-time</span>
            </div>
          </div>
          <span class="chip hot">Hiring now</span>
        </div>
        <p>We are looking for a data-driven marketer to own the growth of our Shopify store. You will architect the D2C strategy: driving qualified traffic, lifting conversion rates and building brand loyalty outside third-party marketplaces. This is a build-from-the-ground-up role, not a maintain-what-exists role.</p>
        <ul>
          <li>Expert-level Shopify &mdash; theme, apps, checkout, merchandising</li>
          <li>Paid media across Google and Meta, owned end to end from budget to ROAS</li>
          <li>E-commerce SEO: technical, content and category architecture</li>
          <li>Comfortable being the person accountable for the number</li>
        </ul>
        <div class="btns">
          <a href="#apply" class="btn btn-o btn-sm" data-mag="5">Apply for this role <span class="ar">&rarr;</span></a>
        </div>
      </article>

      <article class="role">
        <div class="role-h">
          <div>
            <h3>Chemical Engineer</h3>
            <div class="role-m">
              <span>Dubai, UAE</span><span>On-site</span><span>Full-time</span>
            </div>
          </div>
          <span class="chip hot">Hiring now</span>
        </div>
        <p>A technical seat inside a commercial team. You will support trading operations across fertilizers and polymers &mdash; providing technical expertise, analysing product quality, and handling the client questions that need an engineer rather than a salesperson to answer.</p>
        <ul>
          <li>Grade and specification analysis across nitrogen fertilizers and polyolefins</li>
          <li>Quality review of certificates of analysis before and after shipment</li>
          <li>Technical support to clients on application fit and handling</li>
          <li>Chemical engineering degree; trading or petrochemical exposure welcome</li>
        </ul>
        <div class="btns">
          <a href="#apply" class="btn btn-o btn-sm" data-mag="5">Apply for this role <span class="ar">&rarr;</span></a>
        </div>
      </article>

    </div>
  </div>
</section>

<section class="sec sec-panel" id="apply" data-sec="Apply">
  <div class="wrap">
    <div class="apply">
      <div class="rv">
        <span class="eb">Work for us</span>
        <h2 style="margin-top:.9rem">Think you are a good fit?</h2>
        <p class="lead" style="margin-top:1.3rem">Fill in the form and we will reply with next steps. Applications are reviewed weekly. Send your CV to <a href="mailto:info@globalex.me" style="color:var(--cyan)">info@globalex.me</a> and we will match it to your application.</p>
        <div style="margin-top:2rem;display:grid;gap:.75rem">
          <span class="mono">Applications &mdash; <a href="mailto:info@globalex.me" style="color:var(--cyan)">info@globalex.me</a></span>
          <span class="mono">Office &mdash; Cluster X, Jumeirah Lakes Towers, Dubai</span>
        </div>
      </div>

      <form class="form rv" style="--d:120ms" data-form="careers" data-mailto="info@globalex.me" data-subject="Career application — Globalex Trading FZCO">
        <div class="hp" aria-hidden="true"><label for="cw">Website</label><input id="cw" name="website" type="text" tabindex="-1" autocomplete="off" /></div>
        <div class="f-row">
          <div class="fld"><label for="fn">Name</label><input id="fn" name="fn" type="text" autocomplete="given-name" required /></div>
          <div class="fld"><label for="ln">Surname</label><input id="ln" name="ln" type="text" autocomplete="family-name" required /></div>
        </div>
        <div class="f-row">
          <div class="fld"><label for="ph">Phone</label><input id="ph" name="ph" type="tel" autocomplete="tel" required /></div>
          <div class="fld"><label for="em">Email</label><input id="em" name="em" type="email" autocomplete="email" required /></div>
        </div>
        <div class="fld">
          <label for="rl">Applying for</label>
          <select id="rl" name="rl">
            <option>Digital Marketing Manager</option>
            <option>Chemical Engineer</option>
            <option>General application</option>
          </select>
        </div>
        <div class="fld">
          <label for="nt">Why you would fit</label>
          <textarea id="nt" name="nt" placeholder="A short note — what you have run, and what you want to run next."></textarea>
        </div>
        <div class="btns">
          <button type="submit" class="btn btn-p" data-mag="5">Send application <span class="ar">&rarr;</span></button>
        </div>
        <span class="sent" data-sent aria-live="polite"></span>
        <span class="f-note">Sends to our team. Email your CV to info@globalex.me and we will match it to this application.</span>
      </form>
    </div>
  </div>
</section>
`,
};
