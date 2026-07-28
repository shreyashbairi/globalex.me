const { hero, cta } = require('../parts');

const STEPS = [
  { tag: 'NCND', party: 'All parties', h: 'Non-circumvention and non-disclosure',
    d: 'An NCND agreement is signed between all parties involved. Nobody goes around anybody, and nothing discussed leaves the table.' },
  { tag: 'IMFPA', party: 'All parties', h: 'Master fee protection',
    d: 'An Irrevocable Master Fee Protection Agreement is signed between all parties, fixing intermediary compensation before commercial terms are discussed.' },
  { tag: 'LOI &middot; BCL &middot; ICPO', party: 'Buyer', h: 'Letter of intent issued',
    d: 'The buyer submits a valid LOI with complete banking coordinates, authorisation of soft probe, and either a Bank Comfort Letter or an Irrevocable Corporate Purchase Order.' },
  { tag: 'DC &middot; FCO', party: 'Seller', h: 'Draft contract and full corporate offer',
    d: 'The seller issues the draft contract and the Full Corporate Offer &mdash; product, grade, quantity, price basis, delivery terms, all in writing.' },
  { tag: 'Counter-signature', party: 'Buyer', h: 'Buyer counter-signs with a fresh BCL',
    d: 'The buyer returns the signed and stamped DC and FCO with a fresh Bank Comfort Letter confirming capability to open a Letter of Credit.' },
  { tag: 'Final contract', party: 'Seller', h: 'Final contract delivered',
    d: 'The seller sends soft and hard copies of the final contract to be signed and stamped by the buyer. This is the document the shipment runs on.' },
  { tag: 'Non-operative LC &middot; POF', party: 'Buyer', h: 'Non-operative letter of credit',
    d: 'The buyer issues a non-operative LC and provides Proof of Funds to the seller’s bank. Money is committed but not yet released.' },
  { tag: 'POP', party: 'Seller', h: 'Proof of product',
    d: 'The seller provides Proof of Product to the buyer’s bank &mdash; evidence the cargo exists, at the grade and quantity contracted.' },
  { tag: '2% PBG', party: 'Seller', h: 'Performance bond activates the LC',
    d: 'The seller issues a 2% Performance Bond Guarantee, which activates the Letter of Credit. Both sides now carry exposure.' },
  { tag: 'Delivery', party: 'All parties', h: 'Shipment begins',
    d: 'Shipment begins on the schedule agreed in the contract. Documentation follows the cargo; the desk tracks it to discharge.' },
];

const panel = (s, i) => `<article class="step" data-i="${i}">
<div class="step-n"><span>${String(i + 1).padStart(2, '0')}</span><i>/ 10</i></div>
<span class="step-tag">${s.tag}</span>
<h3>${s.h}</h3>
<p>${s.d}</p>
<span class="step-party" data-p="${s.party === 'Buyer' ? 'b' : s.party === 'Seller' ? 's' : 'a'}">${s.party}</span>
</article>`;

module.exports = {
  page: 'procedures',
  title: 'Trade Procedures — Globalex Trading DMCC',
  desc: 'The ten contractual checkpoints between handshake and hull: NCND, IMFPA, LOI, FCO, letter of credit, proof of product, performance bond and shipment.',

  css: `
/* ---------- scroll-driven corridor ---------- */
.corr{position:relative}
.corr-pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;
  justify-content:center;gap:clamp(1.5rem,3.5vh,2.75rem);overflow:hidden;
  padding-block:clamp(5.5rem,12vh,8rem) clamp(2.5rem,6vh,4rem)}

.corr-head{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;flex-wrap:wrap;
  padding-inline:var(--pad-x);max-width:var(--wrap);margin-inline:auto;width:100%}
.corr-read{display:flex;align-items:baseline;gap:.7rem;font-family:var(--f-mono)}
.corr-read b{font-family:var(--f-disp);font-weight:800;font-size:clamp(2.2rem,5vw,3.6rem);
  line-height:.9;letter-spacing:-.03em;font-variation-settings:'wdth' 118;color:var(--cyan);
  font-variant-numeric:tabular-nums}
.corr-read i{font-style:normal;font-size:.825rem;letter-spacing:.18em;color:var(--haze-d)}
.corr-read em{font-style:normal;font-size:.76rem;letter-spacing:.17em;text-transform:uppercase;
  color:var(--frost);padding-left:.85rem;margin-left:.2rem;border-left:1px solid var(--line-2)}

/* the read head: fixed marker the steps travel past */
.corr-head-line{position:absolute;top:0;bottom:0;left:var(--head,22%);width:1px;z-index:3;
  background:linear-gradient(180deg,transparent,rgba(53,214,245,.42) 22%,rgba(53,214,245,.42) 78%,transparent);
  pointer-events:none}
.corr-head-line::before,.corr-head-line::after{content:'';position:absolute;left:-4px;width:9px;height:9px;
  background:var(--cyan);clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.corr-head-line::before{top:24%}
.corr-head-line::after{bottom:24%}

.corr-vp{position:relative;overflow:hidden}
.corr-track{display:flex;gap:clamp(1rem,2vw,1.75rem);width:max-content;
  padding-left:var(--head,22%);will-change:transform}

.step{position:relative;width:min(74vw,392px);flex:none;padding:clamp(1.5rem,2.6vw,2.1rem);
  border:1px solid var(--line);background:linear-gradient(160deg,rgba(16,57,74,.34),rgba(7,28,39,.7));
  display:grid;gap:.85rem;align-content:start;min-height:clamp(300px,46vh,392px);
  clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));
  opacity:.34;transition:opacity .5s var(--ease),border-color .5s var(--ease),transform .5s var(--ease)}
.step[data-on]{opacity:1;border-color:rgba(53,214,245,.5);transform:translateY(-6px)}
.step[data-done]{opacity:.6}
.step-n{display:flex;align-items:baseline;gap:.5rem}
.step-n span{font-family:var(--f-disp);font-weight:800;font-size:2rem;line-height:1;
  letter-spacing:-.03em;font-variation-settings:'wdth' 118;color:var(--frost)}
.step[data-on] .step-n span{color:var(--cyan)}
.step-n i{font-family:var(--f-mono);font-style:normal;font-size:.69rem;letter-spacing:.16em;
  color:var(--haze-d)}
.step-tag{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.17em;text-transform:uppercase;
  color:var(--sand);padding:.3em .6em;border:1px solid rgba(217,183,120,.3);background:var(--sand-g);
  justify-self:start}
.step h3{font-size:1.28rem;line-height:1.16}
.step p{color:var(--haze);font-size:1rem;line-height:1.56}
.step-party{margin-top:auto;font-family:var(--f-mono);font-size:.67rem;letter-spacing:.18em;
  text-transform:uppercase;display:flex;align-items:center;gap:.5em;color:var(--haze-d)}
.step-party::before{content:'';width:6px;height:6px;flex:none;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:var(--haze-d)}
.step-party[data-p=b]::before{background:var(--cyan)}
.step-party[data-p=s]::before{background:var(--sand)}
.step-party[data-p=a]::before{background:var(--frost)}

/* sits on the same gutter as .wrap content */
.corr-bar{position:relative;height:1px;background:var(--line);
  width:min(100%,var(--wrap));max-width:calc(min(100%,var(--wrap)) - var(--pad-x) * 2);
  margin-inline:auto}
.corr-bar i{position:absolute;inset:0 auto 0 0;width:0;background:var(--cyan);
  box-shadow:0 0 12px var(--cyan)}
.corr-legend{display:flex;gap:1.5rem;flex-wrap:wrap;padding-inline:var(--pad-x);
  max-width:var(--wrap);margin-inline:auto;width:100%;
  font-family:var(--f-mono);font-size:.67rem;letter-spacing:.16em;text-transform:uppercase;
  color:var(--haze-d)}
.corr-legend span{display:flex;align-items:center;gap:.5em}
.corr-legend i{width:6px;height:6px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}

/* stacked fallback: short viewports, narrow screens, reduced motion */
@media (max-width:820px),(max-height:560px),(prefers-reduced-motion:reduce){
  .corr{height:auto !important}
  .corr-pin{position:static;height:auto;padding-block:0;gap:1.5rem}
  .corr-head-line{display:none}
  .corr-vp{overflow:visible}
  .corr-track{display:grid;grid-template-columns:1fr;gap:1rem;width:100%;
    max-width:var(--wrap);margin-inline:auto;padding:0 var(--pad-x);
    transform:none !important}
  .step{width:100%;min-height:0;opacity:1;transform:none !important}
  .corr-read b{font-size:2.2rem}
}

/* party responsibilities */
.who{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line)}
.who div{padding:clamp(1.4rem,2.6vw,2.1rem);border-right:1px solid var(--line);display:grid;gap:.7rem;
  align-content:start}
.who div:last-child{border-right:0}
.who b{font-family:var(--f-disp);font-weight:700;font-size:1.1rem;font-variation-settings:'wdth' 106;
  display:flex;align-items:center;gap:.6em}
.who b::before{content:'';width:8px;height:8px;flex:none;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.who div:nth-child(1) b::before{background:var(--cyan)}
.who div:nth-child(2) b::before{background:var(--sand)}
.who div:nth-child(3) b::before{background:var(--frost)}
.who p{color:var(--haze);font-size:1rem}
.who ul{display:grid;gap:.35rem;margin-top:.2rem}
.who li{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.13em;text-transform:uppercase;
  color:var(--haze-d)}
@media (max-width:820px){.who{grid-template-columns:1fr}
  .who div{border-right:0;border-bottom:1px solid var(--line)}.who div:last-child{border-bottom:0}}
`,

  body: `
${hero({
    crumb: ['Procedures'],
    eyebrow: 'Trade workflow &middot; 10 checkpoints',
    h1: 'Ten checkpoints between handshake and hull.',
    lead: 'We keep standardised procedures, but the goal is mutual agreement. If any step does not fit the shape of your transaction, tell us &mdash; most of it is negotiable, and the parts that are not exist to protect you.',
    meta: [['10', 'Checkpoints'], ['2%', 'Performance bond'], ['LC', 'Payment instrument'], ['48h', 'Typical response']],
    sec: 'Procedure',
  })}

<section class="corr" id="corr" data-sec="Checkpoints">
  <div class="corr-pin">
    <div class="corr-head-line" aria-hidden="true"></div>

    <div class="corr-head">
      <div>
        <span class="eb">Corridor sequence</span>
        <p class="mut" style="margin-top:.6rem;max-width:42ch;font-size:1rem">Scroll to advance the sequence. Each checkpoint names the document and the party responsible for producing it.</p>
      </div>
      <div class="corr-read">
        <b data-step>01</b><i>/ 10</i><em data-name>Non-circumvention</em>
      </div>
    </div>

    <div class="corr-vp">
      <div class="corr-track" data-track>
${STEPS.map(panel).join('\n')}
      </div>
    </div>

    <div class="corr-bar"><i data-bar></i></div>

    <div class="corr-legend">
      <span><i style="background:var(--cyan)"></i> Buyer produces</span>
      <span><i style="background:var(--sand)"></i> Seller produces</span>
      <span><i style="background:var(--frost)"></i> Both parties sign</span>
    </div>
  </div>
</section>

<section class="sec" data-sec="Responsibilities">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Who does what</span>
      <h2>The sequence is symmetrical on purpose.</h2>
      <p class="lead">Neither side carries exposure the other has not matched. The buyer commits funds before the seller proves product; the seller bonds performance before the credit turns operative.</p>
    </div>

    <div class="who rvs">
      <div>
        <b>Buyer</b>
        <p>Establishes capability, then commits funds against a contract that is already signed.</p>
        <ul><li>Letter of intent</li><li>Bank comfort letter</li><li>Counter-signed contract</li><li>Non-operative LC</li><li>Proof of funds</li></ul>
      </div>
      <div>
        <b>Seller</b>
        <p>Offers on paper, proves the cargo exists, then bonds its own performance.</p>
        <ul><li>Draft contract</li><li>Full corporate offer</li><li>Final contract</li><li>Proof of product</li><li>2% performance bond</li></ul>
      </div>
      <div>
        <b>Both parties</b>
        <p>The agreements that make the rest of it enforceable.</p>
        <ul><li>NCND agreement</li><li>IMFPA</li><li>Shipment schedule</li></ul>
      </div>
    </div>
  </div>
</section>

${cta({
    eyebrow: 'Questions',
    h2: 'Every deal is shaped differently.',
    lead: 'Tell us your transaction structure and the desk will walk through how each checkpoint maps to your scenario &mdash; including which ones can move.',
    primary: ['Contact the desk', 'contact.html'],
  })}
`,

  js: `
window.glxPage = function(){
  var sec = document.getElementById('corr');
  var track = document.querySelector('[data-track]');
  if (!sec || !track) return;
  var steps = [].slice.call(track.children);
  var stepN = document.querySelector('[data-step]');
  var stepName = document.querySelector('[data-name]');
  var bar = document.querySelector('[data-bar]');
  var NAMES = steps.map(function(s){ return s.querySelector('h3').textContent; });

  var stacked = false, dist = 0;
  function layout(){
    // matches the CSS fallback breakpoints — keep the two in step
    stacked = innerWidth <= 820 || innerHeight <= 560
      || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (stacked){
      sec.style.height = '';
      track.style.transform = '';
      steps.forEach(function(s){ s.setAttribute('data-on',''); });
      return;
    }
    steps.forEach(function(s){ s.removeAttribute('data-on'); });
    var vp = track.parentElement.getBoundingClientRect().width;
    var head = vp * 0.22;
    // travel until the last panel sits under the read head
    dist = Math.max(1, track.scrollWidth - head - steps[steps.length-1].getBoundingClientRect().width - 24);
    sec.style.height = (innerHeight + dist * 1.05) + 'px';
    update();
  }

  var cur = -1;
  function update(){
    if (stacked) return;
    var r = sec.getBoundingClientRect();
    var travel = sec.offsetHeight - innerHeight;
    var k = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
    track.style.transform = 'translate3d(' + (-k * dist).toFixed(1) + 'px,0,0)';
    if (bar) bar.style.width = (k*100).toFixed(1) + '%';

    var i = Math.min(steps.length-1, Math.round(k * (steps.length-1)));
    if (i !== cur){
      cur = i;
      steps.forEach(function(s, j){
        if (j === i) s.setAttribute('data-on',''); else s.removeAttribute('data-on');
        if (j < i) s.setAttribute('data-done',''); else s.removeAttribute('data-done');
      });
      if (stepN) stepN.textContent = String(i+1).padStart(2,'0');
      if (stepName) stepName.textContent = NAMES[i];
    }
  }

  addEventListener('scroll', update, {passive:true});
  addEventListener('resize', layout, {passive:true});
  layout();
  // fonts settling changes panel widths, so re-measure once they land
  if (document.fonts) document.fonts.ready.then(layout);
};
`,
};
