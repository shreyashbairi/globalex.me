const { hero, cta } = require('../parts');

const SECTORS = [
  ['all', 'All grades'],
  ['water', 'Water treatment'],
  ['mfg', 'Manufacturing'],
  ['care', 'Detergents &amp; care'],
  ['agri', 'Agriculture &amp; energy'],
];

const CHEMS = [
  { n: 'Sulphur', f: 'S', s: ['Granular', 'Lump'], t: ['mfg', 'agri'], o: ['Turkmenistan', 'Uzbekistan', 'Kazakhstan'],
    d: 'High-quality granular and lump sulphur &mdash; the upstream input for sulphuric acid, and from there for phosphate fertilizer and a long list of industrial processes.' },
  { n: 'Urea-A (technical)', f: 'CH&#8324;N&#8322;O', s: ['Technical Grade A'], t: ['mfg'], o: ['Uzbekistan'],
    d: 'High-purity urea for industrial rather than agricultural use: resin and adhesive production, and as the reducing agent in selective catalytic reduction (SCR) systems on diesel exhaust.' },
  { n: 'Caustic Soda', f: 'NaOH', s: ['Solid', 'Liquid'], t: ['mfg', 'water'], o: [],
    d: 'Sodium hydroxide, the most broadly used industrial alkali &mdash; pulp and paper, textiles, alumina, soap, and pH correction in water treatment. Supplied solid and liquid.' },
  { n: 'Sodium Hypochlorite', f: 'NaOCl', s: ['Disinfectant grade'], t: ['water'], o: [],
    d: 'The workhorse disinfectant and bleaching agent for municipal water purification and cleaning product manufacture.' },
  { n: 'Hydrochloric Acid', f: 'HCl', s: ['Industrial grade'], t: ['mfg', 'water'], o: [],
    d: 'Steel pickling, chemical synthesis and pH control. Supplied at industrial concentration with the handling documentation the grade requires.' },
  { n: 'Liquid Chlorine', f: 'Cl&#8322;', s: ['Bulk supply'], t: ['water'], o: [],
    d: 'Bulk chlorine for water treatment, disinfection and chemical manufacture, shipped under pressure to specification.' },
  { n: 'Calcium Chloride', f: 'CaCl&#8322;', s: ['Solid', 'Liquid'], t: ['mfg'], o: [],
    d: 'De-icing, dust suppression on unsealed roads, concrete acceleration and industrial drying. Hygroscopic enough to pull moisture out of almost anything.' },
  { n: 'Sodium Sulphate', f: 'Na&#8322;SO&#8324;', s: ['Detergent grade'], t: ['care', 'mfg'], o: [],
    d: 'The bulk filler and processing aid in powder detergents, and a flux in glass manufacture and pulping.' },
  { n: 'LABSA', f: 'C&#8321;&#8328;H&#8330;&#8320;O&#8323;S', s: ['96% purity'], t: ['care'], o: [],
    d: 'Linear alkyl benzene sulphonic acid at 96% &mdash; the primary anionic surfactant behind most detergent and cleaning formulations sold in the region.' },
  { n: 'SLES', f: 'C&#8321;&#8322;H&#8322;&#8325;NaO&#8324;S', s: ['70% concentration'], t: ['care'], o: [],
    d: 'Sodium lauryl ether sulphate at 70% &mdash; the foaming surfactant in shampoo, body wash and liquid detergent.' },
  { n: 'Sulphuric Acid', f: 'H&#8322;SO&#8324;', s: ['Industrial'], t: ['mfg', 'agri'], o: [],
    d: 'The single most produced industrial chemical on earth. Phosphate fertilizer production, oil refining, metal processing and wastewater neutralisation.' },
  { n: 'Formic Acid', f: 'CH&#8322;O&#8322;', s: ['Preservative grade'], t: ['agri', 'mfg'], o: [],
    d: 'Silage preservation in agriculture, plus leather tanning and textile dyeing where a strong, volatile acid is needed that leaves no residue.' },
  { n: 'Acetex Plus', f: '&mdash;', s: ['Multi-purpose'], t: ['mfg'], o: [],
    d: 'A versatile process chemical for coatings, adhesives and general chemical manufacture.' },
  { n: 'Aluminium Sulphate', f: 'Al&#8322;(SO&#8324;)&#8323;', s: ['Water treatment'], t: ['water', 'mfg'], o: [],
    d: 'The standard coagulant in drinking water and effluent treatment &mdash; it pulls suspended solids together so they settle. Also used in paper sizing and dyeing.' },
  { n: 'Iodine', f: 'I&#8322;', s: ['Pharma grade'], t: ['mfg'], o: ['Turkmenistan'],
    d: 'Pharmaceutical synthesis, X-ray contrast media, disinfectants and LCD polarising film. A genuinely scarce element, and one of the few we source single-origin.' },
  { n: 'Carbon Black', f: 'C', s: ['Rubber grade'], t: ['mfg'], o: ['Turkmenistan'],
    d: 'The reinforcing filler that makes a tyre last. Also pigment and UV protection in plastics, coatings and inks.' },
];

const chem = (c, i) => `<article class="row chem" data-tags="${c.t.join(' ')}">
<span class="row-ix">${String(i + 1).padStart(2, '0')}</span>
<div class="row-b">
  <div class="chem-h"><h3>${c.n}</h3><span class="formula">${c.f}</span></div>
  <div class="chips">${c.s.map((s) => `<span class="chip spec">${s}</span>`).join('')}</div>
  <p>${c.d}</p>
  ${c.o.length ? `<div class="chips">${c.o.map((o) => `<span class="chip org">${o}</span>`).join('')}</div>` : ''}
</div>
<div class="row-side">
  ${c.t.map((t) => `<span>${SECTORS.find((s) => s[0] === t)[1]}</span>`).join('')}
</div>
</article>`;

module.exports = {
  page: 'industrials',
  title: 'Industrial Chemicals — Globalex Trading DMCC',
  desc: 'Sixteen specialty chemicals — sulphur, caustic soda, sulphuric and hydrochloric acid, LABSA 96%, SLES 70%, carbon black, iodine and more — for water treatment, manufacturing, personal care, agriculture and energy.',

  css: `
.chem-h{display:flex;align-items:baseline;gap:.9rem;flex-wrap:wrap}
.formula{font-family:var(--f-mono);font-size:.825rem;letter-spacing:.06em;color:var(--sand);
  padding:.2em .55em;border:1px solid rgba(217,183,120,.3);background:var(--sand-g)}
.chem[hidden]{display:none}

/* sector filter */
.filt{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:.5rem}
.filt button{position:relative;padding:.6em 1.05em;font-family:var(--f-mono);font-size:.725rem;
  font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:var(--haze);
  border:1px solid var(--line);background:rgba(4,18,26,.4);cursor:pointer;
  transition:color .3s var(--ease),border-color .3s var(--ease),background .3s var(--ease)}
.filt button:hover{color:var(--frost);border-color:var(--line-2)}
.filt button[aria-pressed=true]{color:var(--void);background:var(--cyan);border-color:var(--cyan);
  font-weight:600}
.filt-n{margin-left:auto;font-family:var(--f-mono);font-size:.725rem;letter-spacing:.15em;
  text-transform:uppercase;color:var(--haze-d)}
.filt-n b{color:var(--cyan);font-weight:500}
@media (max-width:640px){.filt-n{margin-left:0;width:100%}}

/* sector overview */
.sect{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line)}
.sect div{padding:clamp(1.4rem,2.5vw,2rem);border-right:1px solid var(--line);display:grid;gap:.6rem;
  align-content:start}
.sect div:last-child{border-right:0}
.sect b{font-family:var(--f-disp);font-weight:800;font-size:clamp(1.7rem,3.4vw,2.5rem);line-height:1;
  font-variation-settings:'wdth' 118;color:var(--sand);font-variant-numeric:tabular-nums}
.sect span{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.16em;text-transform:uppercase;
  color:var(--haze-d)}
@media (max-width:820px){.sect{grid-template-columns:1fr 1fr}
  .sect div:nth-child(2){border-right:0}
  .sect div:nth-child(-n+2){border-bottom:1px solid var(--line)}}
`,

  body: `
${hero({
    crumb: [['Products', 'fertilizers.html'], 'Industrial Chemicals'],
    eyebrow: 'Class 03 &middot; 16 grades &middot; Multi-origin',
    h1: 'Industrial chemicals',
    lead: 'Sulphur and caustic soda through LABSA, SLES, sulphuric acid, carbon black and iodine &mdash; sixteen specialty grades across water treatment, manufacturing, personal care, agriculture and energy.',
    meta: [['16', 'Grades'], ['4', 'End sectors'], ['Spec', 'Verified at origin'], ['MSDS', 'Supplied with every lot']],
    sec: 'Industrials',
  })}

<section class="sec is-tight" data-sec="Sectors">
  <div class="wrap">
    <div class="sect rv">
      <div><b>5</b><span>Water treatment</span></div>
      <div><b>11</b><span>Manufacturing</span></div>
      <div><b>3</b><span>Detergents &amp; care</span></div>
      <div><b>3</b><span>Agriculture &amp; energy</span></div>
    </div>
  </div>
</section>

<section class="sec is-tight" data-sec="Catalogue">
  <div class="wrap">
    <div class="hd rv" style="margin-bottom:1.6rem">
      <span class="eb">Catalogue</span>
      <h2>Sixteen grades, filtered by where they end up.</h2>
    </div>

    <div class="filt rv" role="group" aria-label="Filter grades by sector">
${SECTORS.map(([k, l], i) => `      <button type="button" data-filt="${k}" aria-pressed="${i === 0}">${l}</button>`).join('\n')}
      <span class="filt-n"><b data-count>16</b> of 16 shown</span>
    </div>

    <div class="rows rvs" id="chems">
${CHEMS.map(chem).join('\n')}
    </div>
  </div>
</section>

<section class="sec sec-panel" data-sec="Standard">
  <div class="wrap">
    <div class="split is-1-2">
      <div class="rv">
        <span class="eb mat">Specification first</span>
        <h2 style="margin-top:.9rem">A chemical is only useful if it is the right grade.</h2>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">Our buyers include refiners running sulphuric acid in pretreatment, municipal authorities operating chlorine-based potable water plants, detergent formulators drawing LABSA and SLES by the tanker, and tyre makers consuming carbon black at tonne scale.</p>
        <p style="margin-top:1.2rem;color:var(--haze)">For every grade we hold to one principle: specification matters. Grades are verified before dispatch, packaging is matched to the use case and the handling class, and documentation is complete before a single drum or container leaves origin.</p>
        <div class="btns" style="margin-top:1.7rem"><a href="procedures.html" class="lk">Read the ten-step procedure</a></div>
      </div>
    </div>
  </div>
</section>

${cta({
    eyebrow: 'Request a quote',
    h2: 'Need a specialty chemical at scale?',
    lead: 'Industrial chemicals need precise spec, packaging and documentation. Send your requirements and we will match origin to specification.',
    primary: ['Request a quote', 'contact.html'],
  })}
`,

  js: `
window.glxPage = function(){
  var btns = [].slice.call(document.querySelectorAll('[data-filt]'));
  var rows = [].slice.call(document.querySelectorAll('.chem'));
  var count = document.querySelector('[data-count]');
  if (!btns.length) return;
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      var k = b.getAttribute('data-filt');
      btns.forEach(function(o){ o.setAttribute('aria-pressed', String(o === b)); });
      var n = 0;
      rows.forEach(function(r){
        var on = k === 'all' || r.getAttribute('data-tags').split(' ').indexOf(k) > -1;
        r.hidden = !on;
        if (on) n++;
      });
      if (count) count.textContent = n;
    });
  });
};
`,
};
