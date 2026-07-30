const { hero } = require("../parts");

module.exports = {
  page: "contact",
  title: "Contact — Globalex Trading FZCO, Dubai",
  desc: "Contact the Globalex Trading FZCO desk in Jumeirah Lakes Towers, Dubai. Quote requests, trade procedures and partnership enquiries answered within two business days.",

  css: `
.cc{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line)}
.cc-c{padding:clamp(1.6rem,2.8vw,2.3rem);border-right:1px solid var(--line);display:grid;gap:.7rem;
  align-content:start;position:relative;overflow:hidden;transition:background .45s var(--ease)}
.cc-c:last-child{border-right:0}
.cc-c:hover{background:rgba(53,214,245,.05)}
.cc-c .lbl{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--cyan)}
.cc-c .val{font-family:var(--f-disp);font-weight:700;font-size:clamp(1.05rem,1.9vw,1.3rem);
  line-height:1.32;font-variation-settings:'wdth' 106;color:var(--frost)}
.cc-c .val a:hover{color:var(--cyan)}
.cc-c .sub{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.13em;text-transform:uppercase;
  color:var(--haze-d)}
@media (max-width:900px){.cc{grid-template-columns:1fr}
  .cc-c{border-right:0;border-bottom:1px solid var(--line)}.cc-c:last-child{border-bottom:0}}

.cs{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,4.5rem);align-items:start}
@media (max-width:940px){.cs{grid-template-columns:1fr}}

.map{position:relative;border:1px solid var(--line);overflow:hidden;aspect-ratio:4/3;
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
.map iframe{position:absolute;inset:0;width:100%;height:100%;border:0;
  filter:grayscale(1) invert(.92) hue-rotate(165deg) saturate(1.5) brightness(.86) contrast(1.05)}
.map-tag{position:absolute;top:12px;left:12px;z-index:2;padding:.4em .75em;font-family:var(--f-mono);
  font-size:.67rem;letter-spacing:.17em;text-transform:uppercase;background:rgba(15,42,56,.86);
  border:1px solid var(--line-2);color:var(--cyan);pointer-events:none}

/* the one owned photograph on the site, treated to sit in the palette */
.plate{position:relative;border:1px solid var(--line);overflow:hidden;aspect-ratio:16/9;
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
.plate img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.12) brightness(.72)}
.plate::after{content:'';position:absolute;inset:0;
  background:linear-gradient(155deg,rgba(53,214,245,.34),rgba(15,42,56,.5) 55%,rgba(217,183,120,.2));
  mix-blend-mode:color}
.plate figcaption{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:1.1rem 1.3rem;
  background:linear-gradient(0deg,rgba(15,42,56,.92),transparent);font-family:var(--f-mono);
  font-size:.69rem;letter-spacing:.17em;text-transform:uppercase;color:var(--haze)}

.hrs{display:grid;gap:.55rem;margin-top:1.6rem;padding-top:1.4rem;border-top:1px solid var(--line)}
.hrs div{display:flex;justify-content:space-between;gap:1.5rem;font-family:var(--f-mono);
  font-size:.725rem;letter-spacing:.13em;text-transform:uppercase;color:var(--haze-d)}
.hrs div b{color:var(--frost);font-weight:400}

.soc{display:inline-flex;align-items:center;gap:.75rem;margin-top:1.6rem;padding:.8em 1.15em;
  border:1px solid var(--line);font-family:var(--f-mono);font-size:.75rem;letter-spacing:.15em;
  text-transform:uppercase;color:var(--haze);transition:color .3s,border-color .3s,background .3s}
.soc:hover{color:var(--frost);border-color:var(--cyan);background:rgba(53,214,245,.06)}
.soc svg{width:15px;height:15px;flex:none;color:var(--cyan)}
.sent{font-family:var(--f-mono);font-size:.725rem;letter-spacing:.13em;text-transform:uppercase;
  color:var(--cyan);min-height:1.2em}
`,

  body: `
${hero({
  crumb: ["Contact"],
  eyebrow: "Dubai desk &middot; 25.0693&deg;N / 55.1413&deg;E",
  h1: "Tell us the tonnage, the port and the window.",
  lead: "Quote requests, trade procedures, partnership conversations. The Dubai desk responds within two business days &mdash; email is fastest, and for time-sensitive deals, call.",
  meta: [
    ["48h", "Typical response"],
    ["GST", "Mon&ndash;Fri 09:00&ndash;18:00"],
    ["Cluster X", "JLT, Dubai"],
  ],
  sec: "Contact",
})}

<section class="sec is-tight" data-sec="Reach us">
  <div class="wrap">
    <div class="cc rv">
      <article class="cc-c">
        <span class="lbl">Our address</span>
        <p class="val">2605 X3 Tower, Cluster X,<br />Jumeirah Lakes Towers</p>
        <span class="sub">337622 Dubai, United Arab Emirates</span>
      </article>
      <article class="cc-c">
        <span class="lbl">Email us</span>
        <p class="val"><a href="mailto:info@globalex.me">info@globalex.me</a></p>
        <span class="sub">General enquiries &amp; quote requests</span>
      </article>
      <article class="cc-c">
        <span class="lbl">Call us</span>
        <p class="val"><a href="tel:+97145667713">+971 4 566 7713</a></p>
        <span class="sub">Mon&ndash;Fri &middot; 09:00&ndash;18:00 GST</span>
      </article>
    </div>
  </div>
</section>

<section class="sec" data-sec="Enquiry">
  <div class="wrap">
    <div class="cs">
      <div class="rv">
        <span class="eb">Send a message</span>
        <h2 style="margin-top:.9rem">Tell us about your enquiry.</h2>
        <p class="lead" style="margin-top:1.3rem">Share what you are looking for &mdash; grade, origin, volume, destination port and delivery window &mdash; and the desk comes back with pricing and procedure.</p>

        <form class="form" style="margin-top:2.2rem" data-form="contact" data-mailto="info@globalex.me" data-subject="Website enquiry — Globalex Trading FZCO">
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
