/* ============================================================
   SPECIFICATIONS & RESOURCES — gated document register.

   Two halves: a register of controlled documents on the left, and a
   specimen panel on the right whose plate draws the document's OWN data.
   Base-oil sheets plot the kinematic-viscosity ladder with their grade
   lit; the polypropylene sheet plots melt flow instead, because
   viscosity is meaningless for a granulate. The art is the data.

   Nothing downloads directly. Selecting a document and requesting access
   opens the gate, which posts to /api/request. The backend mints a
   single-recipient token and emails a link to the tracked viewer.
   ============================================================ */

const { DOCS, BASE_OIL_FAMILY, PP_FAMILY } = require('./docs');

const css = `
/* ---------- register + specimen ---------- */
/* hero shortcut into this section — the glyph is a sheet with a down arrow,
   which is the honest promise: you get the document, after one step */
.btn-doc svg{width:13px;height:15px;flex:none;stroke-width:1.2;
  transition:transform .38s var(--ease)}
.btn-doc:hover svg{transform:translateY(2px)}

.dv{display:grid;grid-template-columns:minmax(0,.94fr) minmax(0,1.06fr);
  gap:clamp(1.5rem,3vw,3.4rem);align-items:start;margin-top:clamp(2.4rem,5vw,3.6rem)}
@media (max-width:1000px){.dv{grid-template-columns:1fr;gap:2rem}}

.dv-reg{border-top:1px solid var(--line-2)}
.dv-reg-h{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;
  padding:.7rem .2rem;font-family:var(--f-mono);font-size:.69rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--haze-d);border-bottom:1px solid var(--line)}

.dr{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;align-items:center;
  gap:clamp(.7rem,1.4vw,1.15rem);width:100%;text-align:left;cursor:pointer;
  padding:1.05rem .8rem 1.05rem 1rem;border-bottom:1px solid var(--line);position:relative;
  transition:background .4s var(--ease),padding-left .4s var(--ease)}
.dr::before{content:'';position:absolute;left:0;top:-1px;bottom:-1px;width:2px;background:var(--cyan);
  transform:scaleY(0);transform-origin:bottom;transition:transform .5s var(--ease)}
.dr:hover{background:rgba(53,214,245,.05)}
.dr:focus-visible{outline:1px solid var(--cyan);outline-offset:-2px}
.dr[data-on]{background:rgba(53,214,245,.075);padding-left:1.5rem}
.dr[data-on]::before{transform:scaleY(1);transform-origin:top}
.dr-ix{font-family:var(--f-mono);font-size:.715rem;color:var(--haze-d);
  font-variant-numeric:tabular-nums;transition:color .4s var(--ease)}
.dr[data-on] .dr-ix{color:var(--cyan)}
.dr-k{font-family:var(--f-mono);font-size:.645rem;letter-spacing:.16em;padding:.3em .6em;
  border:1px solid rgba(53,214,245,.3);color:var(--cyan);background:rgba(53,214,245,.07);
  flex:none;white-space:nowrap}
.dr-k[data-kind=TDS]{color:var(--sand);border-color:rgba(217,183,120,.34);background:var(--sand-g)}
.dr-k[data-kind=SPEC]{color:var(--sand);border-color:rgba(217,183,120,.34);background:var(--sand-g)}
.dr-t{min-width:0}
.dr-t b{display:block;font-weight:600;font-size:.99rem;line-height:1.3;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dr-t small{display:block;font-family:var(--f-mono);font-size:.67rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--haze-d);margin-top:.24rem}
/* a closed shackle that lifts off the body when the row is live */
.dr-lock{width:15px;height:19px;position:relative;flex:none;color:var(--haze-d);
  transition:color .4s var(--ease)}
.dr-lock i{position:absolute;left:2px;bottom:0;width:11px;height:9px;border:1px solid currentColor}
.dr-lock b{position:absolute;left:4px;top:3px;width:7px;height:7px;border:1px solid currentColor;
  border-bottom:0;transition:transform .45s var(--ease)}
.dr:hover .dr-lock,.dr[data-on] .dr-lock{color:var(--cyan)}
.dr:hover .dr-lock b,.dr[data-on] .dr-lock b{transform:translate(3px,-3px)}

/* ---------- specimen panel ---------- */
.dv-sp{position:sticky;top:calc(var(--frame) + 92px);border:1px solid var(--line-2);
  background:linear-gradient(165deg,rgba(23,59,74,.85),rgba(20,53,68,.7));
  clip-path:polygon(0 0,calc(100% - 17px) 0,100% 17px,100% 100%,17px 100%,0 calc(100% - 17px))}
@media (max-width:1000px){.dv-sp{position:static}}

.dv-plate{position:relative;aspect-ratio:16/10;border-bottom:1px solid var(--line);
  background:rgba(15,42,56,.55);overflow:hidden}
.dv-plate canvas{width:100%;height:100%}
/* Controlled-document seal. Centred on the corner diagonal at 45deg with the
   band wider than the corner, so overflow:hidden trims both ends flush
   instead of leaving a floating fragment. */
.dv-seal{position:absolute;top:44px;right:-56px;width:220px;transform:rotate(45deg);
  padding:.36rem 0;text-align:center;font-family:var(--f-mono);font-size:.67rem;
  letter-spacing:.24em;color:var(--void);font-weight:600;pointer-events:none;
  background:repeating-linear-gradient(135deg,var(--cyan) 0 7px,var(--cyan-d) 7px 14px);
  box-shadow:0 3px 14px rgba(15,42,56,.55)}

.dv-body{padding:clamp(1.2rem,2.6vw,1.85rem)}
.dv-code{display:flex;align-items:center;gap:.7rem;flex-wrap:wrap}
.dv-code b{font-family:var(--f-disp);font-variation-settings:'wdth' 118;font-weight:700;
  font-size:clamp(1.15rem,2.4vw,1.5rem);letter-spacing:.01em;line-height:1.15}
.dv-sub{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.18em;text-transform:uppercase;
  color:var(--haze-d);margin-top:.5rem}
.dv-sum{color:var(--haze);margin-top:1rem;font-size:.99rem;line-height:1.6}

.dv-tab{margin-top:1.35rem;border-top:1px solid var(--line)}
.dv-tab>div{display:flex;justify-content:space-between;align-items:baseline;gap:1.2rem;
  padding:.62rem 0;border-bottom:1px solid var(--line)}
.dv-tab dt{color:var(--haze);font-size:.92rem;min-width:0}
.dv-tab dd{font-family:var(--f-mono);font-size:.79rem;color:var(--frost);
  text-align:right;white-space:nowrap;flex:none}

.dv-foot{display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between;
  margin-top:1.6rem}
.dv-fig{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--haze-d)}
.dv-fig b{color:var(--haze)}

/* ---------- access gate ---------- */
.gate{position:fixed;inset:0;z-index:9600;display:grid;place-items:center;padding:1.2rem;
  opacity:0;visibility:hidden;transition:opacity .42s var(--ease),visibility .42s}
.gate[data-open]{opacity:1;visibility:visible}
.gate-bd{position:absolute;inset:0;background:rgba(6,20,27,.84);backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px)}
.gate-p{position:relative;width:min(100%,540px);max-height:calc(100vh - 2.4rem);overflow-y:auto;
  background:linear-gradient(168deg,#1B4356,#143544);border:1px solid var(--line-2);
  padding:clamp(1.5rem,3.4vw,2.3rem);transform:translateY(20px) scale(.985);
  transition:transform .5s var(--ease);
  clip-path:polygon(0 0,calc(100% - 19px) 0,100% 19px,100% 100%,19px 100%,0 calc(100% - 19px))}
.gate[data-open] .gate-p{transform:none}
.gate-x{position:absolute;top:.85rem;right:1.1rem;width:30px;height:30px;display:grid;
  place-items:center;color:var(--haze);cursor:pointer;transition:color .3s,transform .4s var(--ease)}
.gate-x:hover{color:var(--cyan);transform:rotate(90deg)}
.gate-x::before,.gate-x::after{content:'';position:absolute;width:14px;height:1px;background:currentColor}
.gate-x::before{transform:rotate(45deg)}.gate-x::after{transform:rotate(-45deg)}

.gate-doc{display:flex;align-items:center;gap:.75rem;padding:.8rem .9rem;margin:1.1rem 0 1.4rem;
  border:1px solid var(--line);background:rgba(15,42,56,.5)}
.gate-doc .dr-k{flex:none}
.gate-doc span{min-width:0;font-size:.95rem;font-weight:600;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.gate-note{font-size:.86rem;line-height:1.55;color:var(--haze-d);margin-top:1.1rem}
.gate-note a{color:var(--cyan);text-decoration:underline;text-underline-offset:3px}

/* the panel swaps between four states rather than stacking messages */
.gate [data-when]{display:none}
.gate[data-state=form] [data-when=form]{display:grid}
.gate[data-state=sending] [data-when=sending]{display:block}
.gate[data-state=done] [data-when=done]{display:block}
.gate[data-state=error] [data-when=error]{display:block}
.gate[data-state=sending] .gate-p::after{content:'';position:absolute;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent);
  animation:gateScan 1.15s var(--ease-io) infinite}
@keyframes gateScan{0%{top:0;opacity:0}12%{opacity:1}88%{opacity:1}100%{top:100%;opacity:0}}

.gate-wait{text-align:center;padding:2.2rem 0 1.4rem}
.gate-wait p{font-family:var(--f-mono);font-size:.755rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--cyan)}
.gate-ok{display:grid;gap:.55rem;justify-items:center;text-align:center;padding:.6rem 0}
.gate-ok i{width:46px;height:46px;display:grid;place-items:center;border:1px solid var(--cyan);
  color:var(--cyan);transform:rotate(45deg);margin-bottom:.7rem}
.gate-ok i b{transform:rotate(-45deg);font-size:1.15rem;line-height:1}
.gate-ok h4{font-family:var(--f-disp);font-variation-settings:'wdth' 112;font-size:1.22rem;font-weight:700}
.gate-ok p{color:var(--haze);font-size:.95rem;line-height:1.6}
.gate-ok em{color:var(--frost);font-style:normal;font-family:var(--f-mono);font-size:.86rem;
  word-break:break-all}
`;

// --------------------------------------------------------------
// markup
// --------------------------------------------------------------

const bytes = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

/* `cls` lets the caller control the section background, so the register can
   be dropped anywhere in the page without breaking the panel/plain
   alternation that gives the scroll its rhythm. */
function section(cls = 'sec sec-panel') {
  const rows = DOCS.map((d, i) => `<button class="dr" type="button" role="tab" data-doc="${i}"
 aria-selected="${i === 0 ? 'true' : 'false'}"${i === 0 ? ' data-on' : ''}>
<span class="dr-ix">${String(i + 1).padStart(2, '0')}</span>
<span class="dr-k" data-kind="${d.kind}">${d.kind}</span>
<span class="dr-t"><b>${d.title}</b><small>${d.sub} &middot; ${d.origin}</small></span>
<span class="dr-lock" aria-hidden="true"><i></i><b></b></span>
</button>`).join('\n');

  return `<section class="${cls}" id="specifications" data-sec="Documents">
<div class="wrap">
  <div class="split">
    <div class="rv">
      <span class="eb">Specifications &amp; resources</span>
      <h2 style="margin-top:.9rem">Every grade we ship has a sheet behind it.</h2>
    </div>
    <p class="lead rv" style="--d:110ms">Safety data, technical data and origin specifications for the base oil and polypropylene we move out of Turkmenistan &mdash; the same documents your QA and customs teams will ask for. Tell us where to send it and a secure link arrives in your inbox.</p>
  </div>

  <div class="dv">
    <div class="dv-reg rv" role="tablist" aria-label="Controlled documents">
      <div class="dv-reg-h"><span>Document register</span><span>${DOCS.length} controlled</span></div>
      ${rows}
    </div>

    <div class="dv-sp rv" style="--d:120ms">
      <div class="dv-plate">
        <canvas data-plate aria-hidden="true"></canvas>
        <span class="dv-seal">CONTROLLED</span>
      </div>
      <div class="dv-body">
        <div class="dv-code">
          <span class="dr-k" data-kind="MSDS" data-sp-kind>MSDS</span>
          <b data-sp-title>Base Oil SN-180</b>
        </div>
        <div class="dv-sub" data-sp-sub>Material Safety Data Sheet &middot; Turkmenistan</div>
        <p class="dv-sum" data-sp-sum></p>
        <dl class="dv-tab" data-sp-tab></dl>
        <div class="dv-foot">
          <button class="btn btn-p" type="button" data-gate-open data-mag="6">Request access <span class="ar">&rarr;</span></button>
          <span class="dv-fig"><b data-sp-pages>3</b> pp &middot; <b data-sp-size>4.7 MB</b> &middot; PDF</span>
        </div>
      </div>
    </div>
  </div>
</div>
</section>`;
}

const modal = `<div class="gate" id="gate" role="dialog" aria-modal="true" aria-labelledby="gate-h" hidden>
<div class="gate-bd" data-gate-close></div>
<div class="gate-p">
<button class="gate-x" type="button" aria-label="Close" data-gate-close></button>

<div data-when="form">
  <span class="eb">Request access</span>
  <h3 id="gate-h" style="margin-top:.75rem;font-size:1.28rem">Where should we send it?</h3>
  <div class="gate-doc">
    <span class="dr-k" data-kind="MSDS" data-g-kind>MSDS</span>
    <span data-g-title>Base Oil SN-180</span>
  </div>
  <form class="form" data-gate-form novalidate>
    <div class="fld">
      <label for="g-email">Work email</label>
      <input id="g-email" name="email" type="email" autocomplete="email" required
        placeholder="you@company.com" />
    </div>
    <div class="f-row">
      <div class="fld"><label for="g-name">Name</label>
        <input id="g-name" name="name" type="text" autocomplete="name" /></div>
      <div class="fld"><label for="g-co">Company</label>
        <input id="g-co" name="company" type="text" autocomplete="organization" /></div>
    </div>
    <div class="btns" style="margin-top:.3rem">
      <button class="btn btn-p" type="submit" data-mag="5">Send me the link <span class="ar">&rarr;</span></button>
    </div>
  </form>
  <p class="gate-note">The link opens in our document viewer and is meant for you alone. We record when it is opened, and roughly where from, so the desk knows whether to follow up. See the <a href="privacy-policy.html">privacy policy</a>.</p>
</div>

<div data-when="sending">
  <div class="gate-wait"><p data-gate-status>Minting secure link</p></div>
</div>

<div data-when="done">
  <div class="gate-ok">
    <i aria-hidden="true"><b>&#10003;</b></i>
    <h4>Link dispatched</h4>
    <p>Sent to <em data-g-sent>you@company.com</em></p>
    <p style="color:var(--haze-d);font-size:.86rem">If it has not landed in a minute, check spam &mdash; it comes from documents@globalex.me. The link stays live for 30 days.</p>
  </div>
</div>

<div data-when="error">
  <div class="gate-ok">
    <i aria-hidden="true" style="border-color:var(--sand);color:var(--sand)"><b>!</b></i>
    <h4>That did not go through</h4>
    <p data-g-err>Something broke on our side.</p>
    <div class="btns" style="justify-content:center;margin-top:.9rem">
      <button class="btn btn-o" type="button" data-gate-retry data-mag="5">Try again</button>
      <a class="btn btn-o" href="mailto:info@globalex.me?subject=Document%20request" data-mag="5">Email the desk</a>
    </div>
  </div>
</div>

</div>
</div>`;

// --------------------------------------------------------------
// runtime — injected as page JS
// --------------------------------------------------------------

const js = `
var GLXDOCS = ${JSON.stringify(DOCS.map((d) => ({
    id: d.id, kind: d.kind, code: d.code, title: d.title, sub: d.sub,
    pages: d.pages, size: bytes(d.bytes), origin: d.origin,
    plot: d.plot, hi: d.highlight, specs: d.specs, summary: d.summary,
  })))};
var GLXFAM = {
  viscosity: {
    axis: 'Kinematic viscosity @ 100 \\u00B0C',
    unit: 'cSt', max: 24,
    rows: ${JSON.stringify(BASE_OIL_FAMILY.map((g) => ({ g: g.grade, lo: g.kv[0], hi: g.kv[1] })))}
  },
  meltflow: {
    axis: 'Melt flow rate @ 230 \\u00B0C / 2.16 kg',
    unit: 'g/10min', max: 16,
    rows: ${JSON.stringify(PP_FAMILY.map((g) => ({ g: g.grade, lo: g.mfi[0], hi: g.mfi[1] })))}
  }
};

(function(){
  var reg = document.querySelectorAll('.dr');
  if (!reg.length) return;
  var gate = document.getElementById('gate');
  var cur = 0, lastFocus = null;

  /* ---------- specimen plate ----------
     Draws the family this document belongs to and lights the member the
     document describes. Bars tween on selection, so switching sheets
     reads as one instrument re-tuning rather than a hard swap. */
  var plate = document.querySelector('[data-plate]');
  var set = GLXFAM.viscosity;
  // Both arrays must be full-length from the start: glxStage runs one frame
  // synchronously as it is created, which is before the first select() call.
  // A ragged array there would leave NaN in tw, and canvas silently keeps the
  // previous fillStyle when handed a NaN alpha — every bar would stay dim.
  var want = set.rows.map(function(){ return 0; });
  var tw = want.slice();   // per-row lit amount, lerped toward want

  function retarget(d){
    var prev = set;
    set = GLXFAM[d.plot];
    want = set.rows.map(function(r){ return (!d.hi || r.g === d.hi) ? 1 : 0; });
    // a different plot is a different row count, so start dark rather than
    // carrying one family's tween values onto another's bars
    if (prev !== set) tw = set.rows.map(function(){ return 0; });
  }

  if (plate && window.glxStage){
    window.glxStage(plate, function(c, w, h, t){
      c.clearRect(0,0,w,h);
      var padL = Math.max(62, w*0.17), padR = 20, padT = 34, padB = 30;
      var iw = w - padL - padR, ih = h - padT - padB;
      var n = set.rows.length, rowH = ih / n;
      var X = function(v){ return padL + (v / set.max) * iw; };

      // Axis caption carries the unit, so the tick row stays pure numbers —
      // a trailing unit down there collided with the last tick.
      c.font = '500 11px IBM Plex Mono, monospace';
      c.fillStyle = 'rgba(180,201,210,.95)';
      c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      c.fillText(set.axis.toUpperCase() + '  \\u2014  ' + set.unit.toUpperCase(), padL, 18);

      // gridlines + tick labels
      var step = set.max > 20 ? 6 : 4;
      c.textAlign = 'center';
      for (var v = 0; v <= set.max; v += step){
        var x = X(v);
        c.strokeStyle = 'rgba(146,190,204,.17)';
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(x, padT - 6); c.lineTo(x, h - padB + 4); c.stroke();
        c.fillStyle = 'rgba(143,170,182,.8)';
        c.fillText(String(v), x, h - padB + 18);
      }

      for (var i = 0; i < n; i++){
        var r = set.rows[i];
        tw[i] += ((want[i] || 0) - tw[i]) * 0.11;
        var lit = tw[i];
        var cy = padT + rowH * (i + 0.5);
        var bh = Math.min(15, rowH * 0.4);

        // grade label
        c.textAlign = 'right'; c.textBaseline = 'middle';
        c.font = (lit > .5 ? '600 ' : '400 ') + '11.5px IBM Plex Mono, monospace';
        c.fillStyle = 'rgba(' + (lit > .5 ? '53,214,245,' : '160,186,197,') + (0.6 + lit*0.4) + ')';
        c.fillText(r.g, padL - 12, cy);

        // full-width track, so the unlit grades still read as a family
        c.strokeStyle = 'rgba(146,190,204,.14)';
        c.beginPath(); c.moveTo(padL, cy); c.lineTo(w - padR, cy); c.stroke();

        var x0 = X(r.lo), x1 = X(r.hi), bw = Math.max(3, x1 - x0);
        c.save();
        if (lit > .02){
          c.shadowColor = 'rgba(53,214,245,' + (lit*0.55) + ')';
          c.shadowBlur = 16 * lit;
        }
        // dim base + lit overlay, so the tween is a crossfade not a jump
        c.fillStyle = 'rgba(146,190,204,.2)';
        c.fillRect(x0, cy - bh/2, bw, bh);
        c.fillStyle = 'rgba(53,214,245,' + (lit * 0.9) + ')';
        c.fillRect(x0, cy - bh/2, bw, bh);
        c.restore();

        // end caps mark the tolerance limits
        if (lit > .3){
          c.fillStyle = 'rgba(233,243,246,' + lit + ')';
          [x0, x1].forEach(function(x){
            c.beginPath();
            c.moveTo(x, cy - bh/2 - 3); c.lineTo(x + 2.5, cy);
            c.lineTo(x, cy + bh/2 + 3); c.lineTo(x - 2.5, cy);
            c.closePath(); c.fill();
          });
          c.font = '500 11px IBM Plex Mono, monospace';
          c.fillStyle = 'rgba(233,243,246,' + (lit*0.95) + ')';
          // keep both ends at the same precision — "4.5-6" reads as sloppy
          var dp = (r.lo % 1 || r.hi % 1) ? 1 : 0;
          var txt = r.lo.toFixed(dp) + '\\u2013' + r.hi.toFixed(dp);
          // the widest grade in each family sits near the right edge, so the
          // readout flips inside the bar rather than running off the plate
          if (x1 + 14 + c.measureText(txt).width > w - padR){
            c.textAlign = 'right'; c.fillText(txt, x0 - 12, cy);
          } else {
            c.textAlign = 'left';  c.fillText(txt, x1 + 12, cy);
          }
        }
      }

      // slow sweep — the plate reads as live instrumentation
      var sx = padL + ((t * 0.16) % 1) * iw;
      var g = c.createLinearGradient(sx - 24, 0, sx + 24, 0);
      g.addColorStop(0,'rgba(53,214,245,0)');
      g.addColorStop(.5,'rgba(53,214,245,.09)');
      g.addColorStop(1,'rgba(53,214,245,0)');
      c.fillStyle = g;
      c.fillRect(padL, padT - 8, iw, ih + 12);
    });
  }

  /* ---------- selection ---------- */
  var el = {
    kind:  document.querySelector('[data-sp-kind]'),
    title: document.querySelector('[data-sp-title]'),
    sub:   document.querySelector('[data-sp-sub]'),
    sum:   document.querySelector('[data-sp-sum]'),
    tab:   document.querySelector('[data-sp-tab]'),
    pages: document.querySelector('[data-sp-pages]'),
    size:  document.querySelector('[data-sp-size]')
  };

  function select(i){
    cur = i;
    var d = GLXDOCS[i];
    [].forEach.call(reg, function(b, k){
      b.toggleAttribute('data-on', k === i);
      b.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
    el.kind.textContent = d.kind;
    el.kind.setAttribute('data-kind', d.kind);
    el.title.textContent = d.title;
    el.sub.innerHTML = d.sub + ' &middot; ' + d.origin;
    el.sum.textContent = d.summary;
    el.tab.innerHTML = d.specs.map(function(s){
      return '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>';
    }).join('');
    el.pages.textContent = d.pages;
    el.size.textContent = d.size;
    retarget(d);
  }

  [].forEach.call(reg, function(b, i){
    b.addEventListener('click', function(){ select(i); });
    // arrow keys walk the register, as a tablist should
    b.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var nx = (i + d + reg.length) % reg.length;
      reg[nx].focus(); select(nx);
    });
  });
  select(0);

  /* ---------- the gate ---------- */
  if (!gate) return;
  var form = gate.querySelector('[data-gate-form]');
  var status = gate.querySelector('[data-gate-status]');

  function open(){
    var d = GLXDOCS[cur];
    lastFocus = document.activeElement;
    gate.querySelector('[data-g-kind]').textContent = d.kind;
    gate.querySelector('[data-g-kind]').setAttribute('data-kind', d.kind);
    gate.querySelector('[data-g-title]').textContent = d.title;
    gate.setAttribute('data-state','form');
    gate.hidden = false;
    // one frame of layout before the transition, or it snaps open
    requestAnimationFrame(function(){
      gate.setAttribute('data-open','');
      document.body.setAttribute('data-lock','');
      var f = gate.querySelector('#g-email');
      if (f) f.focus();
    });
  }
  function close(){
    gate.removeAttribute('data-open');
    document.body.removeAttribute('data-lock');
    setTimeout(function(){ gate.hidden = true; }, 430);
    if (lastFocus) lastFocus.focus();
  }

  [].forEach.call(document.querySelectorAll('[data-gate-open]'), function(b){
    b.addEventListener('click', open);
  });
  [].forEach.call(gate.querySelectorAll('[data-gate-close]'), function(b){
    b.addEventListener('click', close);
  });
  var retry = gate.querySelector('[data-gate-retry]');
  if (retry) retry.addEventListener('click', function(){ gate.setAttribute('data-state','form'); });

  addEventListener('keydown', function(e){
    if (e.key === 'Escape' && gate.hasAttribute('data-open')) close();
    if (e.key !== 'Tab' || !gate.hasAttribute('data-open')) return;
    // trap focus inside the panel while it is modal
    var f = gate.querySelectorAll('a[href],button:not([disabled]),input,select,textarea');
    f = [].filter.call(f, function(n){ return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length-1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });

  var STEPS = ['Verifying address','Minting secure link','Dispatching'];
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^@\\s]+@[^@\\s.]+\\.[^@\\s]+$/.test(email)){
      form.email.focus();
      form.email.style.borderColor = 'var(--sand)';
      return;
    }
    var d = GLXDOCS[cur];
    gate.setAttribute('data-state','sending');
    var s = 0;
    var tick = setInterval(function(){
      s = (s + 1) % STEPS.length;
      if (status) status.textContent = STEPS[s];
    }, 900);

    var payload = {
      doc: d.id,
      email: email,
      name: form.name.value.trim(),
      company: form.company.value.trim(),
      page: location.pathname
    };

    fetch('/api/request', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).then(function(r){
      return r.json().then(function(j){
        if (!r.ok) throw new Error(j.error || 'Request failed');
        return j;
      });
    }).then(function(){
      clearInterval(tick);
      gate.querySelector('[data-g-sent]').textContent = email;
      gate.setAttribute('data-state','done');
      form.reset();
    }).catch(function(err){
      clearInterval(tick);
      // No backend reachable (opened from disk, or the API is down) — hand
      // off to the mail client rather than dead-ending the visitor.
      if (err instanceof TypeError){
        var body = 'Please send me: ' + d.title + ' (' + d.sub + ')\\n\\n'
          + 'Name: ' + payload.name + '\\nCompany: ' + payload.company + '\\nEmail: ' + email;
        location.href = 'mailto:info@globalex.me?subject='
          + encodeURIComponent('Document request \\u2014 ' + d.title)
          + '&body=' + encodeURIComponent(body);
        gate.querySelector('[data-g-sent]').textContent = email;
        gate.setAttribute('data-state','done');
        return;
      }
      var m = gate.querySelector('[data-g-err]');
      if (m) m.textContent = err.message || 'Something broke on our side.';
      gate.setAttribute('data-state','error');
    });
  });
})();
`;

module.exports = { css, modal, section, js, bytes };
