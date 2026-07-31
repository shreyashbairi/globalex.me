const docgate = require("../docgate");
const geo = require("../geo");

module.exports = {
  page: "index",
  tier: "home",
  title: "Globalex Trading FZCO — The Caspian corridor, operated from Dubai",
  desc: "Dubai FZCO freezone commodity trading house. Urea, sulphur, fertilizers, polymers and 16 industrial chemicals sourced across Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan, delivered worldwide.",
  three: true,

  css:
    `
/* ---------- hero ---------- */
.hero{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;
  padding-top:clamp(6rem,12vh,8rem);padding-bottom:clamp(4rem,8vh,6rem)}
/* scrim keeps the header legible where the globe rides beneath it */
.hero::before{content:'';position:absolute;inset:0 0 auto;height:210px;z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(var(--void-rgb),.9),rgba(var(--void-rgb),0))}
/* The globe is the page's one piece of spectacle and it was being drawn small
   enough to read as a decorative bullet. It gets the right-hand half of the
   viewport now; .hero-in caps itself at 48vw, so the two do not collide. */
.hero-stage{position:absolute;top:50%;right:calc(var(--pad-x) * .3);
  width:min(96vh,52vw,1010px);aspect-ratio:1;transform:translateY(-50%);z-index:0;
  transition:opacity .3s linear}
.hero-stage canvas{width:100%;height:100%}
/* 62ch, not 52ch, purely so the three hero actions hold one line — the copy
   above is unaffected because every text child carries its own narrower cap. */
.hero-in{position:relative;z-index:3;display:grid;gap:1.3rem;max-width:min(62ch,48vw)}
.hero .disp{max-width:16ch}
.hero .lead{max-width:44ch}
@media (max-width:1080px){
  .hero{min-height:auto;flex-direction:column;align-items:stretch;
    padding-top:clamp(7rem,16vh,10rem);padding-bottom:clamp(3.5rem,7vh,5rem)}
  .hero-stage{position:relative;top:auto;right:auto;inset:auto;width:min(104vw,620px);
    margin:0 auto clamp(1rem,4vw,2rem);transform:none;opacity:.9}
  .hero-in{max-width:100%}
  .hero .disp,.hero .lead{max-width:100%}
}

/* node labels projected from the globe */
.g-labels{position:absolute;inset:0;z-index:2;pointer-events:none}
.g-lab{position:absolute;top:0;left:0;display:flex;align-items:center;gap:7px;
  font-family:var(--f-mono);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;
  white-space:nowrap;color:var(--glabel);opacity:0;transition:opacity .45s var(--ease),color .3s;
  will-change:transform}
.g-lab::before{content:'';width:1px;height:11px;background:currentColor;opacity:.5}
.g-lab[data-flip]{flex-direction:row-reverse}
.g-lab[data-on]{opacity:1}
.g-lab[data-hub]{color:var(--glabel-hub);font-size:.76rem;letter-spacing:.2em}
.g-lab[data-out]{color:var(--sand-t)}
@media (max-width:820px){.g-lab{display:none}}

/* hero telemetry readout */
.hud{position:relative;z-index:3;margin-top:.4rem;padding:1.05rem 1.25rem;max-width:44ch;
  background:rgba(var(--void-rgb),.62);backdrop-filter:blur(9px);border:1px solid var(--line);
  clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
.hud-r{display:grid;grid-template-columns:6.6rem 1fr;gap:.35rem .9rem;font-family:var(--f-mono);
  font-size:.725rem;letter-spacing:.13em;text-transform:uppercase}
.hud-r dt{color:var(--haze-d)}
.hud-r dd{color:var(--frost)}
.hud-r dd.sys{color:var(--cyan)}
.hud-r dd.mat{color:var(--sand-t)}
.hud-legend{display:flex;gap:1.25rem;margin-top:.85rem;padding-top:.75rem;border-top:1px solid var(--line);
  font-family:var(--f-mono);font-size:.64rem;letter-spacing:.15em;text-transform:uppercase;
  color:var(--haze-d);flex-wrap:wrap}
.hud-legend span{display:flex;align-items:center;gap:.45em}
.hud-legend i{width:6px;height:6px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}

.cue{position:absolute;left:var(--pad-x);bottom:clamp(1.5rem,4vh,2.75rem);z-index:3;
  display:flex;align-items:center;gap:.7rem;font-family:var(--f-mono);font-size:.67rem;
  letter-spacing:.24em;text-transform:uppercase;color:var(--haze-d)}
.cue i{display:block;width:34px;height:1px;background:linear-gradient(90deg,var(--cyan),transparent);
  position:relative;overflow:hidden}
.cue i::after{content:'';position:absolute;inset:0;width:10px;background:var(--cyan);
  animation:cueRun 2.1s var(--ease-io) infinite}
@keyframes cueRun{0%{transform:translateX(-12px)}100%{transform:translateX(38px)}}
@media (max-width:1080px){.cue{display:none}}

/* .led origin ledger lives in kernel-css.js — product pages reuse it. */

/* ---------- procedure strip ---------- */
.strip{display:grid;grid-template-columns:repeat(10,1fr);gap:0;border:1px solid var(--line);
  overflow:hidden}
.strip a{position:relative;padding:1.5rem .85rem 1.15rem;border-right:1px solid var(--line);
  display:grid;gap:.6rem;align-content:start;min-height:170px;
  transition:background .4s var(--ease)}
.strip a:last-child{border-right:0}
.strip a:hover{background:rgba(var(--cyan-rgb),.06)}
.strip a i{font-family:var(--f-mono);font-style:normal;font-size:.715rem;letter-spacing:.14em;
  color:var(--cyan)}
.strip a span{font-family:var(--f-disp);font-weight:600;font-size:.86rem;line-height:1.3;
  font-variation-settings:'wdth' 100;color:var(--haze);transition:color .35s}
.strip a:hover span{color:var(--frost)}
.strip a::after{content:'';position:absolute;left:0;bottom:0;width:100%;height:2px;
  background:var(--cyan);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}
.strip a:hover::after{transform:scaleX(1)}

/* A checkpoint runs 01 to 10 on a loop — the sequence the copy is describing,
   performed rather than listed. Ten staggered copies of one keyframe, offset
   .44s apart, so the last cell fires 3.96s in; the cycle is 7s, which leaves
   about a second of rest before it starts over. Longer than that and the
   strip sits dead for most of the time anyone is looking at it. Hovering the
   strip pauses it, because a cell lighting under the pointer competes with
   the hover state the visitor just asked for. */
.strip a::before{content:'';position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(var(--cyan-rgb),.2),rgba(var(--signal-rgb),.06));
  opacity:0;animation:stripRun 7s linear infinite}
.strip:hover a::before{animation-play-state:paused}
.strip a>i,.strip a>span{position:relative}
@keyframes stripRun{0%,14%{opacity:0}4%{opacity:1}}
.strip a:nth-child(1)::before{animation-delay:0s}
.strip a:nth-child(2)::before{animation-delay:.44s}
.strip a:nth-child(3)::before{animation-delay:.88s}
.strip a:nth-child(4)::before{animation-delay:1.32s}
.strip a:nth-child(5)::before{animation-delay:1.76s}
.strip a:nth-child(6)::before{animation-delay:2.2s}
.strip a:nth-child(7)::before{animation-delay:2.64s}
.strip a:nth-child(8)::before{animation-delay:3.08s}
.strip a:nth-child(9)::before{animation-delay:3.52s}
.strip a:nth-child(10)::before{animation-delay:3.96s}
@media (max-width:1080px){.strip{grid-template-columns:repeat(5,1fr)}
  .strip a:nth-child(5){border-right:0}
  .strip a:nth-child(-n+5){border-bottom:1px solid var(--line)}}
@media (max-width:620px){.strip{grid-template-columns:repeat(2,1fr)}
  .strip a{border-right:1px solid var(--line);border-bottom:1px solid var(--line);min-height:132px}
  .strip a:nth-child(2n){border-right:0}}

/* ---------- CTA on the ink band ----------
   No plate of its own: the section IS the plate, so the block only has to
   place the lattice canvas and the standing figures beside the copy. */
.cta-ink{position:relative;display:grid;grid-template-columns:1.35fr .65fr;
  gap:clamp(2rem,5vw,4.5rem);align-items:center;padding-block:clamp(1rem,3vw,2.5rem)}
.cta-ink canvas{position:absolute;inset:-2rem;width:calc(100% + 4rem);height:calc(100% + 4rem);
  opacity:.55;z-index:0;pointer-events:none}
.cta-ink .cta-in{position:relative;z-index:2;display:grid;gap:1.4rem;max-width:52ch}
.cta-ink h2{max-width:22ch}
.cta-fig{position:relative;z-index:2;display:grid;gap:0;
  border-top:1px solid rgba(var(--void-rgb),.28)}
.cta-fig>div{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;
  padding:.85rem .1rem;border-bottom:1px solid rgba(var(--void-rgb),.28)}
.cta-fig dt{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--steel)}
.cta-fig dd{font-family:var(--f-disp);font-weight:700;font-size:.95rem;
  font-variation-settings:'wdth' 108;color:var(--void)}
@media (max-width:940px){.cta-ink{grid-template-columns:1fr}}

/* ---------- sustainability split ---------- */
.sus{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(2rem,5vw,4.5rem);
  align-items:center}
.sus-vis{position:relative;aspect-ratio:1/1;border:1px solid var(--line);overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))}
.sus-vis canvas{position:absolute;inset:0;width:100%;height:100%}
@media (max-width:940px){.sus{grid-template-columns:1fr}.sus-vis{order:-1;aspect-ratio:16/11}}
` + docgate.css,

  body:
    `
<section class="hero" data-sec="Corridor">
  <div class="hero-stage" id="stage">
    <canvas id="globe"></canvas>
    <div class="g-labels" id="glabels"></div>
  </div>

  <div class="wrap">
    <div class="hero-in">
      <span class="eb rv">Globalex Trading FZCO &middot; Dubai, UAE</span>
      <h1 class="disp kin">The Caspian corridor, operated from <em>Dubai</em>.</h1>
      <p class="lead rv" style="--d:180ms">Urea, sulphur, fertilizers, polymers and specialty chemicals &mdash; sourced across Turkmenistan, Uzbekistan, Kazakhstan and Azerbaijan, cleared through FZCO, delivered worldwide.</p>

      <div class="hud rv" style="--d:300ms" id="hud">
        <dl class="hud-r">
          <dt>Corridor</dt><dd class="sys" data-hud="lane">Turkmenbashi &rarr; Jebel Ali</dd>
          <dt>Cargo</dt><dd class="mat" data-hud="cargo">Urea B &middot; N46 &middot; prilled</dd>
          <dt>Great circle</dt><dd data-hud="dist">1,214 km</dd>
        </dl>
        <div class="hud-legend">
          <span><i style="background:var(--cyan)"></i> Origin corridor</span>
          <span><i style="background:var(--sand)"></i> Delivery lane</span>
          <span data-hint>Drag globe to orbit</span>
        </div>
      </div>

      <div class="btns rv" style="--d:400ms">
        <a href="#classes" class="btn btn-p" data-mag="6">Explore commodities <span class="ar">&rarr;</span></a>
        <a href="#specifications" class="btn btn-o btn-doc" data-mag="6">
          <svg viewBox="0 0 14 16" aria-hidden="true"><path d="M2 .5h6.5L12.5 4.5v11h-11z" fill="none" stroke="currentColor"/><path d="M8.2.8v4h4" fill="none" stroke="currentColor"/><path d="M7 7.2v5m0 0 2-2m-2 2-2-2" fill="none" stroke="currentColor"/></svg>
          Download spec sheet</a>
        <a href="procedures.html" class="btn btn-o" data-mag="6">Trade procedures</a>
      </div>
    </div>
  </div>

  <span class="cue"><i></i> Scroll to descend</span>
</section>

<!-- ============ readouts ============ -->
<section class="sec is-tight">
  <div class="wrap">
    <div class="stats rv">
      <div class="stat" data-stat><b><span data-to="24" data-dur="1500">0</span><i>+</i></b><span>Commodities traded</span></div>
      <div class="stat" data-stat><b><span data-to="7" data-dur="1200">0</span></b><span>Origin markets</span></div>
      <div class="stat" data-stat><b><span data-to="10" data-dur="1200" data-pad="1">00</span></b><span>Contract checkpoints</span></div>
      <div class="stat" data-stat><b><span data-to="2019" data-dur="1800">0</span></b><span>Trading since</span></div>
    </div>
  </div>
</section>

<!-- ============ thesis ============ -->
<section class="sec" data-sec="Mandate">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Mandate</span>
      <h2>A trading house is only as good as the promises it keeps.</h2>
      <p class="lead">Globalex was built in 2019 on honesty, integrity and trust &mdash; and structured so those words survive contact with a bill of lading. Every deal runs the same ten checkpoints. Every grade is verified before it leaves origin.</p>
    </div>

    <div class="g3 rvs">
      <article class="card pil">
        <span class="ix">Mission</span>
        <h3>Exceed expectations, every time.</h3>
        <p>To always exceed the expectations of our clients, producers and suppliers by providing the highest quality products and exceptional service.</p>
      </article>
      <article class="card pil">
        <span class="ix">Vision</span>
        <h3>Lead international trading.</h3>
        <p>To maintain a presence in international trading that is both invigorated and prevalent &mdash; and to become the reference point for our corridors.</p>
      </article>
      <article class="card pil">
        <span class="ix">Values</span>
        <h3>Five principles, one standard.</h3>
        <p>Integrity, leadership, commitment, innovation, impact. The values our team operates by in every deal, every shipment, every relationship.</p>
        <a href="about.html" class="lk">Read the full mandate</a>
      </article>
    </div>
  </div>
</section>

<!-- ============ commodity classes ============ -->
<section class="sec sec-panel" id="classes" data-sec="Commodities">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb mat">Commodity classes</span>
      <h2>Three classes. Twenty-four grades. One accountable counterparty.</h2>
      <p class="lead">From nitrogen that drives global yields to the surfactants behind every detergent line &mdash; traded with disciplined sourcing and documentation that closes.</p>
    </div>

    <div class="g3 rvs">
      <a href="fertilizers.html" class="cls" data-cur="5 grades">
        <div class="cls-vis"><canvas data-vis="crystal"></canvas><span class="tag">Class 01 &middot; Fertilizers</span></div>
        <div class="cls-b">
          <h3>Fertilizers</h3>
          <p>Urea B (N46), potash, ammonia, ammonium nitrate and NPK &mdash; the nitrogen and compound grades that set yield.</p>
          <div class="chips">
            <span class="chip spec">N46</span><span class="chip spec">Prilled</span><span class="chip spec">Granular</span>
          </div>
        </div>
        <div class="cls-f"><span>5 grades</span><span>Open class &rarr;</span></div>
      </a>

      <a href="polymers.html" class="cls" data-cur="3 families">
        <div class="cls-vis"><canvas data-vis="chain"></canvas><span class="tag">Class 02 &middot; Polymers</span></div>
        <div class="cls-b">
          <h3>Polymers</h3>
          <p>Polyethylene across LDPE, HDPE, LLDPE and UHMWPE, polypropylene homo- and copolymer, plus performance additives.</p>
          <div class="chips">
            <span class="chip spec">HDPE</span><span class="chip spec">LLDPE</span><span class="chip spec">PP copo</span>
          </div>
        </div>
        <div class="cls-f"><span>3 families</span><span>Open class &rarr;</span></div>
      </a>

      <a href="industrials.html" class="cls" data-cur="16 grades">
        <div class="cls-vis"><canvas data-vis="react"></canvas><span class="tag">Class 03 &middot; Industrials</span></div>
        <div class="cls-b">
          <h3>Industrial chemicals</h3>
          <p>Sulphur, caustic soda, sulphuric and hydrochloric acid, LABSA 96%, SLES 70%, carbon black, iodine and more.</p>
          <div class="chips">
            <span class="chip spec">LABSA 96%</span><span class="chip spec">SLES 70%</span><span class="chip spec">Granular S</span>
          </div>
        </div>
        <div class="cls-f"><span>16 grades</span><span>Open class &rarr;</span></div>
      </a>
    </div>
  </div>
</section>

<!-- ============ specifications & resources ============ -->
` +
    docgate.section("sec") +
    `

<!-- ============ procedure strip ============ -->
<section class="sec sec-panel" data-sec="Procedure">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Trade procedure</span>
      <h2>Ten checkpoints between handshake and hull.</h2>
      <p class="lead">Standardised, not rigid. The sequence protects every party; the terms stay negotiable.</p>
    </div>

    <div class="strip rv">
      <a href="procedures.html"><i>01</i><span>NCND signed</span></a>
      <a href="procedures.html"><i>02</i><span>IMFPA signed</span></a>
      <a href="procedures.html"><i>03</i><span>Buyer LOI + BCL</span></a>
      <a href="procedures.html"><i>04</i><span>Draft contract + FCO</span></a>
      <a href="procedures.html"><i>05</i><span>Buyer counter-signs</span></a>
      <a href="procedures.html"><i>06</i><span>Final contract</span></a>
      <a href="procedures.html"><i>07</i><span>Non-operative LC</span></a>
      <a href="procedures.html"><i>08</i><span>Proof of product</span></a>
      <a href="procedures.html"><i>09</i><span>2% PBG issued</span></a>
      <a href="procedures.html"><i>10</i><span>Shipment begins</span></a>
    </div>

    <div class="btns rv" style="margin-top:2rem">
      <a href="procedures.html" class="lk">Walk the full procedure</a>
    </div>
  </div>
</section>

<!-- ============ sustainability ============ -->
<section class="sec" data-sec="Responsibility">
  <div class="wrap">
    <div class="sus">
      <div class="rv">
        <span class="eb mat">Responsibility</span>
        <h2 style="margin-top:.9rem">Fertilisers shape food systems. Polymers shape waste. We choose deliberately.</h2>
        <p class="lead" style="margin-top:1.35rem">Six commitments &mdash; environmental stewardship, ethical sourcing, product quality, transparency, social impact and continuous improvement &mdash; decide which suppliers we partner with, which contracts we sign, and which deals we walk away from.</p>
        <div class="btns" style="margin-top:1.9rem">
          <a href="sustainability.html" class="lk mat">Read the commitments</a>
        </div>
      </div>
      <div class="sus-vis rv" style="--d:150ms"><canvas data-orn="sand" data-tile="150" data-nodes="6" data-alpha="0.4"></canvas></div>
    </div>
  </div>
</section>

<!-- ============ origin ledger ============ -->
<section class="sec sec-panel" data-sec="Origins">
  <div class="wrap">
    <div class="split is-1-2" style="margin-bottom:clamp(2rem,4vw,3.25rem)">
      <div class="rv">
        <span class="eb">Origin network</span>
        <h2 style="margin-top:.9rem">Anchored in the Caspian. Cleared through Dubai.</h2>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">Our origin desks sit close to production &mdash; gas-fed nitrogen in Turkmenistan and Uzbekistan, Caspian sulphur out of Aktau and Baku, polyolefins from the Gulf and East Asia. Dubai is where those flows are consolidated, documented and financed.</p>
      </div>
    </div>

    <div class="led rvs">
      <div class="led-r"><span>01</span><b>Turkmenistan</b><span class="co">40.02&deg;N 52.96&deg;E</span><span class="cg">Urea B &middot; Sulphur &middot; Carbon black &middot; Iodine</span><span class="fl"></span></div>
      <div class="led-r"><span>02</span><b>Uzbekistan</b><span class="co">41.30&deg;N 69.24&deg;E</span><span class="cg">Urea A/B &middot; Potash &middot; NPK &middot; Polymers</span><span class="fl"></span></div>
      <div class="led-r"><span>03</span><b>Kazakhstan</b><span class="co">43.64&deg;N 51.20&deg;E</span><span class="cg">Ammonia &middot; Ammonium nitrate &middot; Sulphur</span><span class="fl"></span></div>
      <div class="led-r"><span>04</span><b>Azerbaijan</b><span class="co">40.41&deg;N 49.87&deg;E</span><span class="cg">Urea B N46 &middot; NPK</span><span class="fl"></span></div>
      <div class="led-r"><span>05</span><b>United Arab Emirates</b><span class="co">25.07&deg;N 55.14&deg;E</span><span class="cg">Trading hub &middot; Polymers &middot; Inventory</span><span class="fl"></span></div>
      <div class="led-r"><span>06</span><b>Saudi Arabia</b><span class="co">26.43&deg;N 50.10&deg;E</span><span class="cg">Polyethylene &middot; Polypropylene</span><span class="fl"></span></div>
      <div class="led-r"><span>07</span><b>China</b><span class="co">31.23&deg;N 121.47&deg;E</span><span class="cg">PP/PE grades &middot; Additives</span><span class="fl"></span></div>
    </div>

    <p class="mono rv" style="margin-top:1.5rem">Delivery worldwide &mdash; Rotterdam, Mundra, Mombasa, Ho Chi Minh City, Santos</p>
  </div>
</section>

<!-- ============ partners ============ -->
<section class="sec is-tight" data-sec="Counterparties">
  <div class="wrap" style="margin-bottom:2rem">
    <span class="eb dim rv">Counterparties &amp; institutions</span>
  </div>
  <div class="mq" aria-label="Partners">
    <div class="mq-t">
      <span class="mq-i">SOCAR</span><span class="mq-i">DP World</span><span class="mq-i">World Economic Forum</span>
      <span class="mq-i">AIFC</span><span class="mq-i">Horasis</span><span class="mq-i">Integral Petroleum</span>
      <span class="mq-i">SOCAR</span><span class="mq-i">DP World</span><span class="mq-i">World Economic Forum</span>
      <span class="mq-i">AIFC</span><span class="mq-i">Horasis</span><span class="mq-i">Integral Petroleum</span>
    </div>
  </div>
  <div class="mq" aria-label="Partners, second row">
    <div class="mq-t rev">
      <span class="mq-i">PTC Commodities</span><span class="mq-i">Esalco Logistics</span>
      <span class="mq-i">Great Caspian Association</span><span class="mq-i">Ady Containers</span>
      <span class="mq-i">PTC Commodities</span><span class="mq-i">Esalco Logistics</span>
      <span class="mq-i">Great Caspian Association</span><span class="mq-i">Ady Containers</span>
    </div>
  </div>
</section>

<!-- ============ CTA ============ -->
<section class="sec sec-ink" data-sec="Contact">
  <div class="wrap">
    <div class="cta-ink rv">
      <canvas data-lat="signal" data-count="42" aria-hidden="true"></canvas>
      <div class="cta-in">
        <span class="eb">Open a lane</span>
        <h2>Tell us the tonnage, the port and the window.</h2>
        <p class="lead">Share volume, destination and target delivery window &mdash; the Dubai desk returns pricing and procedure within two business days.</p>
        <div class="btns">
          <a href="contact.html" class="btn btn-p" data-mag="6">Start a conversation <span class="ar">&rarr;</span></a>
          <a href="mailto:info@globalex.me" class="btn btn-o" data-mag="6">info@globalex.me</a>
        </div>
      </div>
      <dl class="cta-fig">
        <div><dt>Response</dt><dd>2 business days</dd></div>
        <div><dt>Desk</dt><dd>Dubai &middot; JLT</dd></div>
        <div><dt>Incoterms</dt><dd>FOB &middot; CIF &middot; CFR</dd></div>
      </dl>
    </div>
  </div>
</section>
` +
    docgate.modal,

  js:
    `
/* ================= commodity class visuals ================= */
function visCrystal(cv){
  /* Fertilizers: a prilled urea bed. Prills fall, settle into a heap and the
     heap grows a dendritic frost over it — the two things urea actually does.
     Drawn in the material accent throughout, because this is cargo. */
  var seeds = [], N = 5;
  for (var i=0;i<N;i++) seeds.push({x:.2+Math.random()*.6, y:.2+Math.random()*.6, ph:Math.random()*6.3});
  var prills = [];
  for (var p=0;p<34;p++) prills.push({x:Math.random(), y:Math.random(),
    sp:.055+Math.random()*.10, r:.9+Math.random()*1.7, ph:Math.random()*6.3});
  glxStage(cv, function(x,w,h,t){
    x.clearRect(0,0,w,h);
    var g = x.createLinearGradient(0,0,0,h);
    g.addColorStop(0, RGBA('sand', .16));
    g.addColorStop(1, RGBA('sandD', .04));
    x.fillStyle=g; x.fillRect(0,0,w,h);

    // falling prills, wrapping at the foot of the frame
    prills.forEach(function(pr){
      pr.y += pr.sp * 0.016;
      if (pr.y > 1.04) { pr.y = -0.04; pr.x = Math.random(); }
      var px2 = (pr.x + Math.sin(t*.6 + pr.ph)*.012) * w, py = pr.y*h;
      x.fillStyle = RGBA('sandD', .5);
      x.beginPath(); x.arc(px2, py, pr.r, 0, 6.284); x.fill();
    });

    seeds.forEach(function(s,si){
      var cx = s.x*w, cy = s.y*h;
      var grow = (Math.sin(t*.35 + s.ph)*.5+.5)*.65+.35;
      for (var a=0;a<6;a++){
        var ang = a*Math.PI/3 + t*.05 + si;
        var L = Math.min(w,h)*.42*grow;
        x.strokeStyle=RGBA('sandD', .55); x.lineWidth=1.2;
        x.beginPath(); x.moveTo(cx,cy);
        x.lineTo(cx+Math.cos(ang)*L, cy+Math.sin(ang)*L); x.stroke();
        for (var b=.28;b<1;b+=.24){
          var bx = cx+Math.cos(ang)*L*b, by = cy+Math.sin(ang)*L*b;
          var bl = L*.22*(1-b);
          [-1,1].forEach(function(sd){
            var ba = ang + sd*Math.PI/3;
            x.strokeStyle=RGBA('sandD', .34);
            x.beginPath(); x.moveTo(bx,by);
            x.lineTo(bx+Math.cos(ba)*bl, by+Math.sin(ba)*bl); x.stroke();
          });
        }
      }
      // the nucleus flares as the lattice reaches full extension
      var flare = Math.pow(grow, 3);
      x.save(); x.translate(cx,cy); x.rotate(Math.PI/4);
      x.fillStyle=RGBA('sandD', .95); x.fillRect(-2.5,-2.5,5,5);
      x.strokeStyle=RGBA('sand', flare*.9); x.lineWidth=1;
      var rr = 4 + flare*7;
      x.strokeRect(-rr,-rr,rr*2,rr*2);
      x.restore();
    });
  });
}

function visChain(cv){
  // polymers: long monomer chains, flowing
  var chains = [];
  for (var i=0;i<5;i++) chains.push({y:.14+i*.18, ph:Math.random()*6.3, amp:.055+Math.random()*.06,
    sp:.28+Math.random()*.3, f:1.4+Math.random()*1.5});
  glxStage(cv, function(x,w,h,t){
    x.clearRect(0,0,w,h);
    chains.forEach(function(c,ci){
      x.strokeStyle=RGBA('cyan', .42); x.lineWidth=1.3;
      x.beginPath();
      for (var px=0;px<=w;px+=4){
        var u = px/w;
        var py = (c.y + Math.sin(u*Math.PI*2*c.f + t*c.sp*2 + c.ph)*c.amp)*h;
        px===0 ? x.moveTo(px,py) : x.lineTo(px,py);
      }
      x.stroke();
      /* One monomer per chain is mid-reaction at any moment: the travelling
         index carries the signal green and a halo, so the eye is given
         something to follow rather than a uniformly shimmering field. */
      var hot = Math.floor(((t*0.55 + ci*0.37) % 1) * 14);
      for (var k=0;k<=13;k++){
        var u2 = k/13;
        var mx = u2*w;
        var my = (c.y + Math.sin(u2*Math.PI*2*c.f + t*c.sp*2 + c.ph)*c.amp)*h;
        var pulse = Math.sin(t*1.4 - k*.4 + ci)*.5+.5;
        var isHot = k === hot;
        x.save(); x.translate(mx,my); x.rotate(Math.PI/4);
        var r = (isHot ? 3.4 : 1.9) + pulse*1.5;
        if (isHot){ x.shadowColor = RGBA('signal', .9); x.shadowBlur = 12; }
        x.fillStyle = isHot ? RGBA('signal', .95) : RGBA('cyan', .42+pulse*.5);
        x.fillRect(-r,-r,r*2,r*2); x.restore();
      }
    });
  });
}

function visReact(cv){
  /* Industrials: a reacting particle field with transient bonds. Every bond
     that forms fires once — a reaction is an event, and the previous version
     drew only the standing lattice, which is the one state a reactor is never
     actually in. */
  var P = [], flash = [];
  for (var i=0;i<26;i++) P.push({x:Math.random(),y:Math.random(),
    vx:(Math.random()-.5)*.0013,vy:(Math.random()-.5)*.0013,r:1+Math.random()*1.8});
  glxStage(cv, function(x,w,h,t){
    x.clearRect(0,0,w,h);
    P.forEach(function(p){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<.02||p.x>.98)p.vx*=-1; if(p.y<.02||p.y>.98)p.vy*=-1;
    });
    for (var i=0;i<P.length;i++) for (var j=i+1;j<P.length;j++){
      var ax=P[i].x*w,ay=P[i].y*h,bx=P[j].x*w,by=P[j].y*h;
      var d=Math.hypot(ax-bx,ay-by), lim=Math.min(w,h)*.30;
      if (d<lim){
        var near = 1-d/lim;
        x.strokeStyle=RGBA('sandD', (.42*near).toFixed(3));
        x.lineWidth=1; x.beginPath(); x.moveTo(ax,ay); x.lineTo(bx,by); x.stroke();
        // a bond crossing the close threshold ignites at its midpoint
        if (near > .93 && flash.length < 14 && Math.random() < .06)
          flash.push({x:(ax+bx)/2, y:(ay+by)/2, t:0});
      }
    }
    for (var f=flash.length-1; f>=0; f--){
      var fl = flash[f];
      fl.t += .045;
      if (fl.t >= 1){ flash.splice(f,1); continue; }
      var k = 1-fl.t;
      x.strokeStyle = RGBA('signal', k*.85); x.lineWidth = 1.4;
      x.beginPath(); x.arc(fl.x, fl.y, 3 + fl.t*17, 0, 6.284); x.stroke();
    }
    P.forEach(function(p,i){
      var bx=p.x*w, by=p.y*h, pulse=Math.sin(t*.9+i)*.5+.5;
      x.save(); x.translate(bx,by); x.rotate(Math.PI/4);
      var r=p.r*(1+pulse*.5);
      x.fillStyle=RGBA('sandD', .5+pulse*.45);
      x.fillRect(-r,-r,r*2,r*2); x.restore();
    });
  });
}

/* ================= corridor globe ================= */
// ly = manual label offset; the four Caspian nodes sit within a few degrees
// of each other and would otherwise stack on screen.
var NODES = [
  {n:'Turkmenbashi', c:'TM', lat:40.02, lon:52.96, k:'in',  g:'Urea B N46 / prilled', ly:0},
  {n:'Aktau',        c:'KZ', lat:43.64, lon:51.20, k:'in',  g:'Ammonia / anhydrous', ly:-19},
  {n:'Tashkent',     c:'UZ', lat:41.30, lon:69.24, k:'in',  g:'Potash / NPK blend', ly:-7},
  {n:'Baku',         c:'AZ', lat:40.41, lon:49.87, k:'in',  g:'Ammonium nitrate', ly:17},
  {n:'Dammam',       c:'SA', lat:26.43, lon:50.10, k:'in',  g:'HDPE / film grade', ly:-14},
  {n:'Shanghai',     c:'CN', lat:31.23, lon:121.47,k:'in',  g:'PP copolymer / additives', ly:0},
  {n:'Jebel Ali',    c:'AE', lat:25.07, lon:55.14, k:'hub', g:'Consolidation / FZCO clearing', ly:14},
  {n:'Rotterdam',   c:'NL', lat:51.92, lon:4.48,  k:'out', g:'NPK / granular', ly:0},
  {n:'Mundra',      c:'IN', lat:22.84, lon:69.72, k:'out', g:'Urea B N46 / bulk', ly:12},
  {n:'Mombasa',     c:'KE', lat:-4.04, lon:39.66, k:'out', g:'NPK / bagged', ly:0},
  {n:'Ho Chi Minh', c:'VN', lat:10.82, lon:106.63,k:'out', g:'LABSA 96% / SLES 70%', ly:0},
  {n:'Santos',      c:'BR', lat:-23.96,lon:-46.33,k:'out', g:'Urea B N46 / bulk', ly:0}
];
var HUB = NODES[6];

/* ---- baked geography (see _src/geo.js for the encoding) ---- */
var GEO = {Q:${geo.Q}, MW:${geo.MW}, MH:${geo.MH},
  B:${JSON.stringify(geo.BORDERS)}, M:${JSON.stringify(geo.LANDMASK)}};

/* Rings of [lon,lat], from delta-encoded zig-zag varints. */
function geoRings(){
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-';
  var IX = {}; for (var n=0;n<64;n++) IX[A.charAt(n)] = n;
  return GEO.B.split('|').map(function(r){
    var pts = [], px = 0, py = 0, i = 0;
    function rd(){
      var v = 0, sh = 1, c;
      do { c = IX[r.charAt(i++)]; v += (c & 31) * sh; sh *= 32; } while (c & 32);
      return (v & 1) ? -((v + 1) / 2) : v / 2;
    }
    while (i < r.length){ px += rd(); py += rd(); pts.push([px/GEO.Q, py/GEO.Q]); }
    return pts;
  });
}

/* One-degree land bitmask. Row 0 is the north pole, column 0 is 180W. */
function landTest(){
  var bin = atob(GEO.M), bytes = new Uint8Array(bin.length);
  for (var i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  return function(lat, lon){
    var row = Math.floor((90 - lat) / 180 * GEO.MH);
    if (row < 0 || row >= GEO.MH) return false;
    var col = Math.floor((lon + 180) / 360 * GEO.MW);
    col = ((col % GEO.MW) + GEO.MW) % GEO.MW;
    var ix = row * GEO.MW + col;
    return (bytes[ix >> 3] & (1 << (ix & 7))) !== 0;
  };
}

function ll2v(lat, lon, r){
  var phi = (90-lat)*Math.PI/180, th = (lon+180)*Math.PI/180;
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th));
}
/* Exact inverse of ll2v for a unit vector — the dot field is generated as
   points on a sphere and has to ask the mask which of them are on land. If
   these two ever disagree the continents rotate away from the corridors, so
   they are written as a pair on purpose. */
function v2ll(x, y, z){
  var lat = 90 - Math.acos(Math.max(-1, Math.min(1, y))) * 180/Math.PI;
  var lon = Math.atan2(z, -x) * 180/Math.PI - 180;
  if (lon < -180) lon += 360;
  return [lat, lon];
}
function haversine(a, b){
  var R=6371, p1=a.lat*Math.PI/180, p2=b.lat*Math.PI/180;
  var dp=p2-p1, dl=(b.lon-a.lon)*Math.PI/180;
  var x=Math.sin(dp/2)*Math.sin(dp/2)+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)*Math.sin(dl/2);
  return Math.round(2*R*Math.asin(Math.sqrt(x)));
}
function fmt(n){ return String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','); }

function globeFallback(cv){
  if (window.glxOrnament) glxOrnament(cv, {tone:'cyan', tile:150, nodes:9, alpha:.34});
}

function buildGlobe(){
  /* The globe is built out of six additively-blended materials. Additive
     blending adds light: an arc glows against a near-black sphere and
     disappears against a pale one, because adding to near-white is still
     near-white. On a light palette every one of them draws normally instead,
     darker than the sphere, and the thin ones need more opacity to hold. */
  var LIGHT = GLXC.polarity === 'light';
  var BLEND = LIGHT ? THREE.NormalBlending : THREE.AdditiveBlending;
  var cv = document.getElementById('globe');
  if (!cv) return;
  var labelBox = document.getElementById('glabels');
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!window.THREE){ globeFallback(cv); return; }
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas:cv, antialias:true, alpha:true, powerPreference:'high-performance'});
  } catch(e){ globeFallback(cv); return; }
  if (!renderer.getContext()){ globeFallback(cv); return; }

  // Linear output on purpose: hex values then render exactly as authored,
  // which matters because the palette is shared with the CSS.
  var DPR = Math.min(devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);

  /* At FOV 30 the half-height of the view at distance d is d*tan(15deg), so
     the unit sphere fills 1/(d*0.2679) of it: 5.4 put the globe at 69% of the
     canvas and left a wide dead margin, which is most of why it read as having
     shrunk. 4.55 takes it to about 82%, still clear of the projected labels,
     which sit out at radius 1.15. */
  var FOV = 30, DIST = 4.55;
  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(FOV, 1, .1, 100);
  cam.position.set(0,0,DIST);
  // pixels-per-world-unit at unit depth — keeps point sprites a fixed on-screen size
  var uPx = {value: 900};

  var outer = new THREE.Group();   // latitude tilt
  var inner = new THREE.Group();   // spin
  outer.add(inner); scene.add(outer);

  // face Dubai on load
  var baseY = -(HUB.lon+90)*Math.PI/180;
  inner.rotation.y = baseY;
  outer.rotation.x = HUB.lat*Math.PI/180 * 0.82;

  /* --- occluding core so back-side points hide --- */
  var core = new THREE.Mesh(
    new THREE.SphereGeometry(.985, 64, 48),
    new THREE.MeshBasicMaterial({color:new THREE.Color(GLXC.int.globeCore)})
  );
  inner.add(core);

  /* --- fresnel atmosphere ---
     A wide soft halo is a dark-theme device: it works because it adds light to
     a black field. Added to off-white it only bleaches the limb and costs the
     sphere its silhouette. On a light palette the same shader is retuned into
     a tight limb-darkening — higher exponent, tighter shell, drawn in the
     border green — so the edge reads as the curve of a solid body. */
  var atmo = new THREE.Mesh(
    new THREE.SphereGeometry(LIGHT ? 1.015 : 1.06, 64, 48),
    new THREE.ShaderMaterial({
      transparent:true, blending:BLEND, side:THREE.BackSide, depthWrite:false,
      uniforms:{
        uC:{value:new THREE.Color(LIGHT ? GLXC.int.globeBorder : GLXC.int.cyan)},
        uPow:{value:LIGHT ? 6.0 : 3.4},
        uAmt:{value:LIGHT ? 0.55 : 0.34}
      },
      vertexShader:[
        'varying vec3 vN; varying vec3 vP;',
        'void main(){ vN = normalize(normalMatrix * normal);',
        ' vec4 mv = modelViewMatrix * vec4(position,1.0); vP = mv.xyz;',
        ' gl_Position = projectionMatrix * mv; }'
      ].join('\\n'),
      fragmentShader:[
        'uniform vec3 uC; uniform float uPow; uniform float uAmt;',
        'varying vec3 vN; varying vec3 vP;',
        'void main(){',
        ' float f = pow(clamp(1.0 - abs(dot(normalize(vN), normalize(-vP))), 0.0, 1.0), uPow);',
        ' gl_FragColor = vec4(uC, f * uAmt);',
        '}'
      ].join('\\n')
    })
  );
  outer.add(atmo);

  /* --- graticule: beaded lat/long rings --- */
  (function(){
    var pos = [];
    for (var la=-60; la<=60; la+=30){
      for (var lo=-180; lo<180; lo+=2){
        var a = ll2v(la, lo, 1.001), b = ll2v(la, lo+2, 1.001);
        pos.push(a.x,a.y,a.z, b.x,b.y,b.z);
      }
    }
    for (var lo2=-180; lo2<180; lo2+=30){
      for (var la2=-84; la2<84; la2+=2){
        var c = ll2v(la2, lo2, 1.001), d = ll2v(la2+2, lo2, 1.001);
        pos.push(c.x,c.y,c.z, d.x,d.y,d.z);
      }
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    inner.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({
      color:GLXC.int.globeGraticule, transparent:true,
      opacity:LIGHT?.62:.34, depthWrite:false
    })));
  })();

  /* --- corridor arcs: origin -> hub (system) and hub -> market (material) --- */
  var arcs = [];
  NODES.forEach(function(nd){
    if (nd.k === 'hub') return;
    var from = nd.k === 'in' ? nd : HUB, to = nd.k === 'in' ? HUB : nd;
    var a = ll2v(from.lat, from.lon, 1), b = ll2v(to.lat, to.lon, 1);
    var mid = a.clone().add(b).multiplyScalar(.5);
    var lift = 1 + a.distanceTo(b) * 0.30;
    mid.normalize().multiplyScalar(lift);
    arcs.push({
      curve: new THREE.QuadraticBezierCurve3(a, mid, b),
      kind: nd.k, node: nd,
      lane: nd.k === 'in' ? nd.n + ' \\u2192 Jebel Ali' : 'Jebel Ali \\u2192 ' + nd.n,
      dist: haversine(from, to)
    });
  });

  /* The corridors are the subject of the whole graphic, so on a light ground
     they take the darker end of each accent: a mid cyan and a mid gold both
     sit at roughly the same lightness as pale sage and vanish into it. The
     idle and selected opacities are held here rather than in setHud so the
     two states cannot drift apart. */
  var ARC_DIM = LIGHT ? .5 : .26, ARC_LIT = LIGHT ? 1 : .95;
  arcs.forEach(function(ar){
    var pts = ar.curve.getPoints(72);
    var g = new THREE.BufferGeometry().setFromPoints(pts);
    ar.line = new THREE.Line(g, new THREE.LineBasicMaterial({
      color: ar.kind === 'in'
        ? (LIGHT ? GLXC.int.cyanD : GLXC.int.cyan)
        : (LIGHT ? GLXC.int.sandD : GLXC.int.sand),
      transparent:true, opacity:ARC_DIM, blending:BLEND, depthWrite:false
    }));
    inner.add(ar.line);
  });

  /* --- coastlines and national borders ---
     The hardest line on the sphere. Segments are subdivided so a simplified
     span does not chord through the globe, and any segment that wraps the
     antimeridian is dropped rather than drawn straight across the Pacific. */
  (function(){
    var pos = [];
    geoRings().forEach(function(ring){
      for (var i=0;i<ring.length-1;i++){
        var a = ring[i], b = ring[i+1];
        var dlon = b[0] - a[0];
        if (Math.abs(dlon) > 180) continue;           // antimeridian wrap
        var arcDeg = Math.max(Math.abs(dlon), Math.abs(b[1]-a[1]));
        var steps = Math.max(1, Math.ceil(arcDeg / 3));
        var prev = ll2v(a[1], a[0], 1.003);
        for (var s=1;s<=steps;s++){
          var f = s/steps;
          var v = ll2v(a[1] + (b[1]-a[1])*f, a[0] + dlon*f, 1.003);
          pos.push(prev.x, prev.y, prev.z, v.x, v.y, v.z);
          prev = v;
        }
      }
    });
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    inner.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({
      color:GLXC.int.globeBorder, transparent:true, opacity:LIGHT?.85:.55,
      depthWrite:false
    })));
  })();

  /* --- dot field over land, brightness driven by proximity to corridors ---
     Candidates are a Fibonacci sphere; only those the land mask accepts are
     kept, so the continents are drawn rather than implied. */
  (function(){
    var CAND = 17000, pos = [], glow = [];
    var onLand = landTest();
    var samples = [];
    arcs.forEach(function(ar){
      ar.curve.getPoints(32).forEach(function(p){ samples.push(p.clone().normalize()); });
    });
    var gold = Math.PI * (3 - Math.sqrt(5));
    for (var i=0;i<CAND;i++){
      var y = 1 - (i/(CAND-1))*2, r = Math.sqrt(Math.max(0,1-y*y)), th = gold*i;
      var vx = Math.cos(th)*r, vy = y, vz = Math.sin(th)*r;
      var ll = v2ll(vx, vy, vz);
      if (!onLand(ll[0], ll[1])) continue;
      pos.push(vx, vy, vz);
      var best = 0;
      for (var s=0;s<samples.length;s++){
        var dt = vx*samples[s].x + vy*samples[s].y + vz*samples[s].z;
        if (dt > best) best = dt;
      }
      // best is cos(angular distance); shape it into a halo hugging the corridors
      glow.push(Math.pow(Math.max(0, (best - 0.9965) / 0.0035), 1.05));
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aGlow', new THREE.Float32BufferAttribute(glow, 1));
    var m = new THREE.ShaderMaterial({
      transparent:true, depthWrite:false, blending:BLEND,
      uniforms:{uPx:uPx, uOp:{value:LIGHT?0.82:0.44},
        uDim:{value:new THREE.Color(GLXC.int.globeSurface)},
        uHot:{value:new THREE.Color(GLXC.int.globeGlow)}},
      vertexShader:[
        'attribute float aGlow; varying float vG; uniform float uPx;',
        'void main(){ vG = aGlow;',
        ' vec4 mv = modelViewMatrix * vec4(position,1.0);',
        ' gl_PointSize = (0.0040 + aGlow * 0.0042) * uPx / -mv.z;',
        ' gl_Position = projectionMatrix * mv; }'
      ].join('\\n'),
      /* uOp lifts the whole field on a light palette. These points are drawn
         normally there rather than additively, and a 0.44 alpha that read as a
         glowing landmass against near-black is a grey smudge on pale sage. */
      fragmentShader:[
        'varying float vG; uniform vec3 uDim; uniform vec3 uHot; uniform float uOp;',
        'void main(){',
        ' vec2 p = gl_PointCoord - 0.5;',
        ' float d = abs(p.x) + abs(p.y);',
        ' if (d > 0.5) discard;',
        ' float e = smoothstep(0.5, 0.12, d);',
        ' vec3 c = mix(uDim, uHot, vG);',
        ' gl_FragColor = vec4(c, e * (uOp + vG * (1.0 - uOp)));',
        '}'
      ].join('\\n')
    });
    inner.add(new THREE.Points(g, m));
  })();

  /* --- flowing cargo along the corridors --- */
  var FLOW = 14, flowGeo, flowPos, flowT = [];
  (function(){
    var total = arcs.length * FLOW;
    flowPos = new Float32Array(total*3);
    var col = new Float32Array(total*3);
    /* Packet colour comes from the palette rather than from two hand-tuned
       float triples. Those were a pale cyan and a pale gold — chosen to glow
       against a near-black sphere, and on a pale one they were two invisible
       tints of off-white. */
    var IN_C = new THREE.Color(LIGHT ? GLXC.int.globeGlow : GLXC.int.cyan);
    var OUT_C = new THREE.Color(LIGHT ? GLXC.int.accentMaterialDark : GLXC.int.sand);
    for (var a=0;a<arcs.length;a++){
      var c = arcs[a].kind === 'in' ? IN_C : OUT_C;
      for (var f=0;f<FLOW;f++){
        var i = a*FLOW+f;
        flowT.push({a:a, t:f/FLOW, sp:0.055 + (arcs[a].kind==='in'?0.02:0)});
        col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
      }
    }
    flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
    flowGeo.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
    var m = new THREE.ShaderMaterial({
      transparent:true, depthWrite:false, blending:BLEND,
      uniforms:{uPx:uPx},
      vertexShader:[
        'attribute vec3 aCol; varying vec3 vC; uniform float uPx;',
        'void main(){ vC = aCol;',
        ' vec4 mv = modelViewMatrix * vec4(position,1.0);',
        ' gl_PointSize = 0.0135 * uPx / -mv.z;',
        ' gl_Position = projectionMatrix * mv; }'
      ].join('\\n'),
      fragmentShader:[
        'varying vec3 vC;',
        'void main(){',
        ' vec2 p = gl_PointCoord - 0.5;',
        ' float d = abs(p.x) + abs(p.y);',
        ' if (d > 0.5) discard;',
        ' gl_FragColor = vec4(vC, smoothstep(0.5, 0.06, d));',
        '}'
      ].join('\\n')
    });
    inner.add(new THREE.Points(flowGeo, m));
  })();

  /* --- node markers --- */
  var markers = [];
  NODES.forEach(function(nd){
    var v = ll2v(nd.lat, nd.lon, 1.006);
    var isHub = nd.k === 'hub';
    var size = isHub ? .05 : .028;
    var col = isHub ? GLXC.int.highlight : (nd.k === 'in' ? GLXC.int.cyan : GLXC.int.sand);
    var m = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:.95,
        blending:BLEND, depthWrite:false, side:THREE.DoubleSide})
    );
    m.position.copy(v);
    m.lookAt(v.clone().multiplyScalar(2));
    m.rotateZ(Math.PI/4);
    inner.add(m);
    // outward tick
    var tg = new THREE.BufferGeometry().setFromPoints([
      v.clone(), v.clone().normalize().multiplyScalar(isHub ? 1.13 : 1.07)]);
    inner.add(new THREE.Line(tg, new THREE.LineBasicMaterial({
      color:col, transparent:true, opacity:LIGHT?.85:.5, blending:BLEND, depthWrite:false})));

    var lab = document.createElement('div');
    lab.className = 'g-lab';
    if (isHub) lab.setAttribute('data-hub','');
    if (nd.k === 'out') lab.setAttribute('data-out','');
    lab.innerHTML = '<span>' + nd.n + (isHub ? ' &middot; HUB' : ' <b style="color:var(--haze-d);font-weight:400">' + nd.c + '</b>') + '</span>';
    if (labelBox) labelBox.appendChild(lab);
    markers.push({nd:nd, mesh:m, lab:lab, anchor:v.clone().normalize().multiplyScalar(isHub ? 1.15 : 1.09)});
  });

  /* --- telemetry readout --- */
  var hud = {lane:document.querySelector('[data-hud=lane]'), cargo:document.querySelector('[data-hud=cargo]'),
    dist:document.querySelector('[data-hud=dist]')};
  var cursorArc = 0, hudTimer = 0, hudHold = false;
  function setHud(i){
    var ar = arcs[i]; if (!ar || !hud.lane) return;
    hud.lane.textContent = ar.lane;
    hud.lane.className = ar.kind === 'in' ? 'sys' : 'mat';
    hud.cargo.textContent = ar.node.g;
    hud.cargo.className = ar.kind === 'in' ? 'mat' : 'sys';
    hud.dist.textContent = fmt(ar.dist) + ' km';
    arcs.forEach(function(a2, j){ a2.line.material.opacity = j === i ? ARC_LIT : ARC_DIM; });
  }
  setHud(0);

  /* --- pointer orbit with inertia --- */
  var drag = false, px = 0, py = 0, vY = 0, vX = 0, idle = 0;
  cv.style.touchAction = 'pan-y';
  cv.addEventListener('pointerdown', function(e){
    drag = true; px = e.clientX; py = e.clientY; idle = 0;
    cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
    var hint = document.querySelector('[data-hint]');
    if (hint) hint.style.opacity = '.35';
  });
  cv.addEventListener('pointermove', function(e){
    if (!drag) return;
    var dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    vY = dx * 0.0055; vX = dy * 0.0035;
    inner.rotation.y += vY;
    outer.rotation.x = Math.max(-1.05, Math.min(1.05, outer.rotation.x + vX));
    idle = 0;
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
    cv.addEventListener(ev, function(){ drag = false; });
  });

  /* --- hover a marker to lock the readout --- */
  var ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), hovered = null;
  ray.params.Points = {threshold:.05};
  cv.addEventListener('pointermove', function(e){
    var r = cv.getBoundingClientRect();
    ptr.x = ((e.clientX-r.left)/r.width)*2-1;
    ptr.y = -((e.clientY-r.top)/r.height)*2+1;
    ray.setFromCamera(ptr, cam);
    var hits = ray.intersectObjects(markers.map(function(m){ return m.mesh; }), false);
    if (hits.length){
      var mk = markers.filter(function(m){ return m.mesh === hits[0].object; })[0];
      if (mk && mk !== hovered){
        hovered = mk;
        var ai = -1;
        arcs.forEach(function(a2, j){ if (a2.node === mk.nd) ai = j; });
        if (ai >= 0){ hudHold = true; setHud(ai); cursorArc = ai; }
      }
    } else if (hovered){ hovered = null; hudHold = false; }
  });

  /* --- resize --- */
  function resize(){
    var r = cv.getBoundingClientRect();
    if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / Math.max(1, r.height);
    cam.updateProjectionMatrix();
    // px per world unit at depth 1: (drawingBufferHeight/2) / tan(fov/2)
    uPx.value = (r.height * DPR * 0.5) / Math.tan(FOV * Math.PI / 360);
  }
  addEventListener('resize', resize, {passive:true});
  resize();

  /* --- scroll: descend past the hero --- */
  var stage = document.getElementById('stage');
  function onScroll(){
    var k = Math.min(1, Math.max(0, scrollY / Math.max(1, innerHeight)));
    cam.position.z = DIST + k * 2.2;
    if (stage) stage.style.opacity = String(1 - k*0.9);
    outer.rotation.z = k * 0.14;
  }
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* --- frame loop --- */
  var visible = true;
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(r){ visible = r[0].isIntersecting; }).observe(cv);
  }
  var tmp = new THREE.Vector3(), camDir = new THREE.Vector3();
  var t0 = performance.now(), last = t0;

  function frame(now){
    requestAnimationFrame(frame);
    var dt = Math.min(.05, (now-last)/1000); last = now;
    if (!visible) return;
    var t = (now - t0)/1000;

    if (!drag){
      vY *= 0.94; vX *= 0.90;
      inner.rotation.y += vY;
      outer.rotation.x = Math.max(-1.05, Math.min(1.05, outer.rotation.x + vX));
      idle += dt;
      if (idle > 1.6 && !RM) inner.rotation.y += 0.028 * dt * Math.min(1,(idle-1.6)/1.4) * 3;
    }

    // cargo flow
    if (!RM){
      for (var i=0;i<flowT.length;i++){
        var ft = flowT[i];
        ft.t += ft.sp * dt;
        if (ft.t > 1) ft.t -= 1;
        var p = arcs[ft.a].curve.getPoint(ft.t);
        flowPos[i*3] = p.x; flowPos[i*3+1] = p.y; flowPos[i*3+2] = p.z;
      }
      flowGeo.attributes.position.needsUpdate = true;
    }

    // marker pulse
    markers.forEach(function(m, i){
      var s = m.nd.k === 'hub' ? 1 + Math.sin(t*2.1)*.22 : 1 + Math.sin(t*1.5 + i)*.16;
      m.mesh.scale.setScalar(s);
    });

    // project labels, then push apart any that would collide
    var rect = cv.getBoundingClientRect();
    var shown = [];
    markers.forEach(function(m){
      tmp.copy(m.anchor).applyMatrix4(inner.matrixWorld);
      var facing = tmp.clone().normalize().dot(cam.position.clone().normalize());
      var sp = tmp.clone().project(cam);
      if (facing <= 0.16 || sp.z >= 1){ m.lab.removeAttribute('data-on'); return; }
      shown.push({m:m, x:(sp.x*.5+.5)*rect.width,
        y:(-sp.y*.5+.5)*rect.height + (m.nd.ly||0), hub:m.nd.k === 'hub'});
    });
    // hub keeps its place; the rest yield to it and to each other
    shown.sort(function(a,b){ return (b.hub?1:0)-(a.hub?1:0) || a.y-b.y; });
    for (var i=0;i<shown.length;i++){
      for (var j=0;j<i;j++){
        if (Math.abs(shown[i].x - shown[j].x) > 195) continue;
        var gap = shown[i].y - shown[j].y;
        if (Math.abs(gap) < 17) shown[i].y = shown[j].y + (gap >= 0 ? 17 : -17);
      }
    }
    shown.forEach(function(s){
      var flip = s.x > rect.width - 152;
      s.m.lab.setAttribute('data-on','');
      if (flip) s.m.lab.setAttribute('data-flip',''); else s.m.lab.removeAttribute('data-flip');
      s.m.lab.style.transform = 'translate('+s.x.toFixed(1)+'px,'+(s.y-7).toFixed(1)+'px)'
        + (flip ? ' translateX(-100%)' : '');
    });

    // cycle the readout when nothing is hovered
    if (!hudHold){
      hudTimer += dt;
      if (hudTimer > 3.4){
        hudTimer = 0;
        cursorArc = (cursorArc+1) % arcs.length;
        setHud(cursorArc);
      }
    }

    renderer.render(scene, cam);
  }
  requestAnimationFrame(frame);
  inner.updateMatrixWorld(true);
}

window.glxPage = function(){
  var vis = {crystal:visCrystal, chain:visChain, react:visReact};
  [].forEach.call(document.querySelectorAll('[data-vis]'), function(cv){
    var f = vis[cv.getAttribute('data-vis')];
    if (f) f(cv);
  });
  buildGlobe();
};
` + docgate.js,
};
