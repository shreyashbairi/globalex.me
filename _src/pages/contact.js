const { hero } = require("../parts");

const CRUMB = ["Contact"];

module.exports = {
  page: "contact",
  tier: "company",
  crumb: CRUMB,
  title: "Contact — Globalex Trading FZCO, Dubai",
  desc: "Contact the Globalex Trading FZCO desk in Jumeirah Lakes Towers, Dubai. Quote requests, trade procedures and partnership enquiries answered within two business days.",

  css: `

.cs{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,4.5rem);align-items:start}
@media (max-width:940px){.cs{grid-template-columns:1fr}}

.map{position:relative;border:1px solid var(--line);overflow:hidden;aspect-ratio:4/3;
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
.map iframe{position:absolute;inset:0;width:100%;height:100%;border:0;
  filter:grayscale(1) invert(var(--map-invert)) hue-rotate(var(--map-hue)) saturate(1.5) brightness(var(--map-brightness)) contrast(1.05)}
.map-tag{position:absolute;top:12px;left:12px;z-index:2;padding:.4em .75em;font-family:var(--f-mono);
  font-size:.67rem;letter-spacing:.17em;text-transform:uppercase;background:rgba(var(--void-rgb),.86);
  border:1px solid var(--line-2);color:var(--cyan);pointer-events:none}

/* the one owned photograph on the site, treated to sit in the palette */
.plate{position:relative;border:1px solid var(--line);overflow:hidden;aspect-ratio:16/9;
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
.plate img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(var(--photo-contrast)) brightness(var(--photo-brightness))}
.plate::after{content:'';position:absolute;inset:0;
  background:linear-gradient(155deg,rgba(var(--cyan-rgb),.34),rgba(var(--void-rgb),.5) 55%,rgba(var(--sand-rgb),.2));
  mix-blend-mode:color}
.plate figcaption{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:1.1rem 1.3rem;
  background:linear-gradient(0deg,rgba(var(--void-rgb),.92),transparent);font-family:var(--f-mono);
  font-size:.69rem;letter-spacing:.17em;text-transform:uppercase;color:var(--haze)}

.hrs{display:grid;gap:.55rem;margin-top:1.6rem;padding-top:1.4rem;border-top:1px solid var(--line)}
.hrs div{display:flex;justify-content:space-between;gap:1.5rem;font-family:var(--f-mono);
  font-size:.725rem;letter-spacing:.13em;text-transform:uppercase;color:var(--haze-d)}
.hrs div b{color:var(--frost);font-weight:400}

.soc{display:inline-flex;align-items:center;gap:.75rem;margin-top:1.6rem;padding:.8em 1.15em;
  border:1px solid var(--line);font-family:var(--f-mono);font-size:.75rem;letter-spacing:.15em;
  text-transform:uppercase;color:var(--haze);transition:color .3s,border-color .3s,background .3s}
.soc:hover{color:var(--frost);border-color:var(--cyan);background:rgba(var(--cyan-rgb),.06)}
.soc svg{width:15px;height:15px;flex:none;color:var(--cyan)}
.sent{font-family:var(--f-mono);font-size:.725rem;letter-spacing:.13em;text-transform:uppercase;
  color:var(--cyan);min-height:1.2em}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "Dubai desk &middot; 25.0693&deg;N / 55.1413&deg;E",
  h1: "Tell us the tonnage, the port and the window.",
  lead: "Quote requests, trade procedures, partnership conversations. The Dubai desk responds within two business days &mdash; email is fastest, and for time-sensitive deals, call.",
  meta: [
    ["48h", "Typical response"],
    ["GST", "Mon&ndash;Fri 09:00&ndash;18:00"],
  ],
  /* Address, email and phone sit in the hero rather than in a band below it,
     so the three things a visitor came for are above the fold. */
  details: [
    [
      "Our address",
      "2605 X3 Tower, Cluster X,<br />Jumeirah Lakes Towers",
      null,
      "337622 Dubai, United Arab Emirates",
    ],
    [
      "Email us",
      "contact@globalex.me",
      "mailto:contact@globalex.me",
      "General enquiries &amp; quote requests",
    ],
    [
      "Call us",
      "+971 4 566 7713",
      "tel:+97145667713",
      "Mon&ndash;Fri &middot; 09:00&ndash;18:00 GST",
    ],
  ],
  sec: "Contact",
})}


<section class="sec" data-sec="Enquiry">
  <div class="wrap">
    <div class="cs">
      <div class="rv">
        <span class="eb">Send a message</span>
        <h2 style="margin-top:.9rem">Tell us about your enquiry.</h2>
        <p class="lead" style="margin-top:1.3rem">Share what you are looking for &mdash; grade, origin, volume, destination port and delivery window &mdash; and the desk comes back with pricing and procedure.</p>

        <form class="form" style="margin-top:2.2rem" data-form="contact" data-mailto="contact@globalex.me" data-subject="Website enquiry — Globalex Trading FZCO">
          <div class="hp" aria-hidden="true"><label for="cw">Website</label><input id="cw" name="website" type="text" tabindex="-1" autocomplete="off" /></div>
          <div class="f-row">
            <div class="fld"><label for="cn">Your name</label><input id="cn" name="cn" type="text" autocomplete="name" required /></div>
            <div class="fld"><label for="cco">Company</label><input id="cco" name="cco" type="text" autocomplete="organization" /></div>
          </div>
          <div class="f-row">
            <div class="fld"><label for="ce">Email</label><input id="ce" name="ce" type="email" autocomplete="email" required /></div>
            <div class="fld"><label for="cp">Phone</label><input id="cp" name="cp" type="tel" autocomplete="tel" /></div>
          </div>
          <div class="fld">
            <label for="cs">Commodity class</label>
            <select id="cs" name="cs">
              <option>Fertilizers</option>
              <option>Polymers</option>
              <option>Industrial chemicals</option>
              <option>Trade procedure question</option>
              <option>Partnership or other</option>
            </select>
          </div>
          <div class="fld">
            <label for="cm">Volume, destination and window</label>
            <textarea id="cm" name="cm" placeholder="e.g. 25,000 MT Urea B N46 prilled, CFR Mundra, loading March." required></textarea>
          </div>
          <div class="btns">
            <button type="submit" class="btn btn-p" data-mag="5">Send message <span class="ar">&rarr;</span></button>
          </div>
          <span class="sent" data-sent aria-live="polite"></span>
          <span class="f-note">Goes straight to the Dubai desk. We reply within two business days.</span>
        </form>
      </div>

      <div class="rv" style="--d:120ms">
        <span class="eb">Visit the office</span>
        <h2 style="margin-top:.9rem">Cluster X, X3 Tower, suite 2605.</h2>
        <p class="lead" style="margin-top:1.3rem">Drop in by appointment &mdash; coffee is on us.</p>

        <div class="map" style="margin-top:1.9rem">
          <span class="map-tag">JLT Cluster X &middot; 25.0693&deg;N 55.1413&deg;E</span>
          <iframe title="Globalex Trading FZCO office location, Jumeirah Lakes Towers, Dubai"
            src="https://maps.google.com/maps?q=Jumeirah%20Lakes%20Towers%20Cluster%20X%20Dubai&t=&z=14&ie=UTF8&iwloc=&output=embed"
            loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <figure class="plate" style="margin-top:1.25rem">
          <img src="assets/golden-hour-at-dubai.jpg" alt="Dubai skyline at golden hour, seen from across the water" loading="lazy" />
          <figcaption>Dubai &mdash; the bridge between Caspian production and global demand</figcaption>
        </figure>

        <div class="hrs">
          <div><span>Monday &ndash; Friday</span><b>09:00 &ndash; 18:00 GST</b></div>
          <div><span>Saturday &ndash; Sunday</span><b>Closed</b></div>
          <div><span>Response target</span><b>Two business days</b></div>
        </div>

        <a class="soc" href="https://www.linkedin.com/company/globalex-trading-FZCO-uae/" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
          Follow on LinkedIn <span class="ar">&nearr;</span>
        </a>
      </div>
    </div>
  </div>
</section>
`,
};
