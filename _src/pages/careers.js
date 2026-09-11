const { hero } = require("../parts");

const CRUMB = ["Careers"];

module.exports = {
  page: "careers",
  tier: "company",
  nav: "company",
  crumb: CRUMB,
  title: "Careers — Globalex Trading FZCO",
  desc: "Careers at Globalex Trading FZCO in Dubai. We are reviewing applications and will open new roles soon — register your interest with your CV.",

  css: `
.role{position:relative;padding:clamp(1.7rem,3vw,2.5rem);border:1px solid var(--line);
  background:linear-gradient(160deg,rgba(var(--steel-rgb),.34),rgba(var(--deep-rgb),.68));display:grid;gap:1.15rem;
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px));
  transition:border-color .45s var(--ease)}
.role:hover{border-color:rgba(var(--cyan-rgb),.4)}
.role-h{display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;flex-wrap:wrap}
.role-h h3{max-width:24ch}
.role-m{display:flex;flex-wrap:wrap;gap:.5rem 1.15rem;margin-top:.7rem;font-family:var(--f-mono);
  font-size:.715rem;letter-spacing:.14em;text-transform:uppercase;color:var(--haze-d)}
.role-m span{display:flex;align-items:center;gap:.5em}
.role-m span::before{content:'';width:5px;height:5px;background:var(--cyan);opacity:.6;flex:none;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.role p{color:var(--haze);max-width:78ch}

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
  eyebrow: "Careers &middot; Dubai, UAE",
  h1: "Global trade. Real ownership. Full exposure.",
  lead: "We are currently reviewing applications and will open new roles soon. We keep a standing interest in professionals who share our standards &mdash; a trading house where every person touches deals, owns relationships and sees the whole picture, from sourcing decision to bill of lading.",
  meta: [
    ["Paused", "Reviewing applications"],
    ["Dubai", "On-site / hybrid"],
    ["Soon", "New roles"],
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

<section class="sec" data-sec="Openings">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Current openings</span>
      <h2>No open roles right now. New ones soon.</h2>
    </div>

    <article class="role rv">
      <div class="role-h">
        <div>
          <h3>We are reviewing applications</h3>
          <div class="role-m">
            <span>Recruitment paused</span><span>Dubai, UAE</span>
          </div>
        </div>
        <span class="chip org">Opening soon</span>
      </div>
      <p>Thank you to everyone who applied for our recent openings. Recruitment is paused while we review every application we received, and we will be in touch with shortlisted candidates directly.</p>
      <p>We expect to open new roles soon. If you would like to be considered when we do, send us your CV below &mdash; we keep every application on file and reach out when a fitting role opens.</p>
      <div class="btns">
        <a href="#apply" class="btn btn-o btn-sm" data-mag="5">Register your interest <span class="ar">&rarr;</span></a>
      </div>
    </article>
  </div>
</section>

<section class="sec sec-panel" id="apply" data-sec="Apply">
  <div class="wrap">
    <div class="apply">
      <div class="rv">
        <span class="eb">Work for us</span>
        <h2 style="margin-top:.9rem">Be first in line for the next role.</h2>
        <p class="lead" style="margin-top:1.3rem">Fill in the form and we will keep your details on file for upcoming openings. Send your CV to <a href="mailto:contact@globalex.me" style="color:var(--cyan)">contact@globalex.me</a> and we will match it to your submission.</p>
        <div style="margin-top:2rem;display:grid;gap:.75rem">
          <span class="mono">Applications &mdash; <a href="mailto:contact@globalex.me" style="color:var(--cyan)">contact@globalex.me</a></span>
          <span class="mono">Office &mdash; Cluster X, Jumeirah Lakes Towers, Dubai</span>
        </div>
      </div>

      <form class="form rv" style="--d:120ms" data-form="careers" data-mailto="contact@globalex.me" data-subject="Career application — Globalex Trading FZCO">
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
          <label for="nt">Why you would fit</label>
          <textarea id="nt" name="nt" placeholder="A short note — your background, and the kind of role you want next."></textarea>
        </div>
        <div class="btns">
          <button type="submit" class="btn btn-p" data-mag="5">Register interest <span class="ar">&rarr;</span></button>
        </div>
        <span class="sent" data-sent aria-live="polite"></span>
        <span class="f-note">Sends to our team. Email your CV to contact@globalex.me and we will match it to this application.</span>
      </form>
    </div>
  </div>
</section>
`,
};
