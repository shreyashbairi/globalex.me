/* ============================================================
   PRODUCTS — the whole book behind one search box.

   Previously "Products" in the header went straight to Fertilizers,
   which quietly told visitors that fertilizer was all we did. This page
   is the actual index: every grade in every class, filterable by class
   and searchable by name, formula, application or origin, with each
   card deep-linking to its row on the class page.

   Filtering is done in the browser against markup that is already in
   the HTML, so the grades are indexed by search engines and readable
   with JavaScript off — the box only ever narrows what is on screen.
   ============================================================ */

const { hero, cta } = require("../parts");
const { CLASSES, plain } = require("../catalogue");
const { DOCS } = require("../docs");

const TOTAL = CLASSES.reduce((n, c) => n + c.items.length, 0);

/* Everything the matcher scans, baked into the element. One attribute read
   beats rebuilding a string per keystroke per card. */
const haystack = (p, cls) =>
  plain(
    [
      p.name,
      p.kind,
      p.body,
      p.alias || "",
      p.f || "",
      (p.specs || []).join(" "),
      (p.origins || []).join(" "),
      cls.title,
    ].join(" "),
  ).toLowerCase();

const card = (p, cls, i) => `<a class="pc" href="${cls.href}#${p.id}"
 data-cat="${cls.key}" data-h="${haystack(p, cls)}" data-cur="Open grade">
<span class="pc-top">
  <span class="pc-ix">${String(i + 1).padStart(2, "0")}</span>
  <span class="pc-cls${cls.tone === "sand" ? " mat" : ""}">${cls.title}</span>
</span>
<span class="pc-h">
  <b>${p.name}</b>
  ${p.f ? `<i class="formula">${p.f}</i>` : ""}
</span>
<span class="pc-kind">${p.kind}</span>
<span class="pc-p">${p.body}</span>
<span class="chips">${(p.specs || []).map((s) => `<span class="chip spec">${s}</span>`).join("")}</span>
${
  (p.origins || []).length
    ? `<span class="chips">${p.origins.map((o) => `<span class="chip org">${o}</span>`).join("")}</span>`
    : ""
}
<span class="pc-go">Open grade <em>&rarr;</em></span>
</a>`;

const classSection = (
  cls,
) => `<section class="sec is-tight pcls" data-cat="${cls.key}" id="${cls.key}" data-sec="${cls.title}">
<div class="wrap">
  <div class="pcls-h rv">
    <span class="pcls-no">${cls.no}</span>
    <div>
      <h2>${cls.title}</h2>
      <p class="lead">${cls.blurb}</p>
    </div>
    <a class="lk${cls.tone === "sand" ? " mat" : ""}" href="${cls.href}">Full class page</a>
  </div>
  <div class="pgrid rvs">
${cls.items.map((p, i) => card(p, cls, i)).join("\n")}
  </div>
</div>
</section>`;

/* Documents are searchable here too — buyers hunt for "MSDS" far more often
   than they hunt for a grade name — but they are not downloadable from this
   page. The register on the home page owns that flow. */
const docRow = (d) => `<a class="drow" href="index.html#specifications"
 data-cat="documents" data-h="${plain(`${d.title} ${d.kind} ${d.code} ${d.sub} ${d.origin} ${d.summary} document sheet pdf`).toLowerCase()}">
<span class="dr-k" data-kind="${d.kind}">${d.kind}</span>
<span class="drow-t"><b>${d.title}</b><small>${d.sub} &middot; ${d.origin} &middot; ${d.pages} pp</small></span>
<span class="drow-go">Request &rarr;</span>
</a>`;

module.exports = {
  page: "products",
  title: "Products — Globalex Trading FZCO",
  desc: `Search all ${TOTAL} grades Globalex Trading FZCO supplies across fertilizers, polymers and industrial chemicals — by name, formula, application or origin.`,

  css: `
/* ---------- search console ---------- */
/* The console belongs to the hero above it, not to the classes below, so it
   loses its own vertical padding and sits tight under the lead. */
.sec.psec{padding-top:clamp(1rem,2.5vh,2rem);padding-bottom:clamp(1.4rem,3vh,2.4rem)}
.psearch{position:relative;z-index:3;max-width:56rem}
.psearch-f{position:relative;display:flex;align-items:center;gap:.9rem;
  padding:.25rem .3rem .25rem 1.15rem;border:1px solid var(--line-2);
  background:rgba(var(--deep-rgb),.72);backdrop-filter:blur(14px);
  transition:border-color .4s var(--ease),box-shadow .4s var(--ease);
  clip-path:polygon(0 0,calc(100% - 13px) 0,100% 13px,100% 100%,13px 100%,0 calc(100% - 13px))}
.psearch-f:focus-within{border-color:var(--cyan);box-shadow:0 0 0 1px var(--cyan-g),0 10px 40px -18px var(--cyan)}
.psearch-f svg{width:17px;height:17px;flex:none;stroke:var(--haze-d);fill:none;stroke-width:1.6;
  transition:stroke .35s}
.psearch-f:focus-within svg{stroke:var(--cyan)}
.psearch input{flex:1;min-width:0;padding:1rem 0;font-size:1.05rem;color:var(--frost);
  background:none;border:0;outline:none}
.psearch input::placeholder{color:var(--haze-d)}
.psearch input::-webkit-search-cancel-button{display:none}
.psearch-clr{flex:none;width:34px;height:34px;display:grid;place-items:center;color:var(--haze-d);
  font-size:1.1rem;line-height:1;transition:color .3s}
.psearch-clr:hover{color:var(--cyan)}
.psearch-clr[hidden]{display:none}
.psearch-k{flex:none;margin-right:.85rem;font-family:var(--f-mono);font-size:.66rem;letter-spacing:.14em;
  color:var(--haze-d);border:1px solid var(--line);padding:.28em .5em}
@media (max-width:620px){.psearch-k{display:none}}

.pfilters{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-top:1.15rem}
.pf{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.14em;text-transform:uppercase;
  padding:.5em .95em;border:1px solid var(--line);color:var(--haze-d);cursor:pointer;
  transition:border-color .3s,color .3s,background .3s}
.pf:hover{border-color:var(--line-2);color:var(--frost)}
.pf[data-on]{border-color:var(--cyan);color:var(--cyan);background:var(--cyan-g)}
.pf b{font-weight:400;opacity:.65;margin-left:.45em}
.pcount{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--haze-d);margin-left:auto;padding-left:.6rem}
.pcount b{color:var(--cyan);font-weight:500}

/* ---------- class sections ---------- */
.pcls[hidden]{display:none}
.pcls-h{display:grid;grid-template-columns:auto 1fr auto;gap:clamp(1rem,2.4vw,2rem);
  align-items:start;margin-bottom:clamp(1.6rem,3vw,2.4rem)}
.pcls-no{font-family:var(--f-mono);font-size:.755rem;letter-spacing:.2em;color:var(--cyan);
  padding-top:.55rem}
.pcls-h h2{font-size:var(--t-h3)}
.pcls-h .lead{margin-top:.6rem;max-width:62ch;font-size:1.02rem}
.pcls-h .lk{white-space:nowrap;margin-top:.7rem}
@media (max-width:820px){.pcls-h{grid-template-columns:auto 1fr}.pcls-h .lk{grid-column:2;margin-top:1rem}}

.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));
  gap:clamp(.9rem,1.8vw,1.3rem)}

/* Flex column rather than grid so the CTA can be pushed to the foot of the
   card. Grid stretches every card in a row to the tallest; without this the
   "Open grade" line lands at a different height in each one. */
.pc{display:flex;flex-direction:column;gap:.7rem;padding:clamp(1.2rem,2.2vw,1.6rem);
  border:1px solid var(--line);background:rgba(var(--deep-rgb),.5);position:relative;overflow:hidden;
  transition:border-color .4s var(--ease),background .4s var(--ease),transform .4s var(--ease);
  clip-path:polygon(0 0,calc(100% - 15px) 0,100% 15px,100% 100%,15px 100%,0 calc(100% - 15px))}
.pc::after{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--cyan);
  transform:scaleY(0);transform-origin:bottom;transition:transform .5s var(--ease)}
.pc:hover{border-color:var(--line-2);background:rgba(var(--panel-rgb),.62);transform:translateY(-3px)}
.pc:hover::after{transform:scaleY(1);transform-origin:top}
.pc:focus-visible{outline:1px solid var(--cyan);outline-offset:3px}
.pc[hidden]{display:none}

.pc-top{display:flex;align-items:center;gap:.7rem;justify-content:space-between}
.pc-ix{font-family:var(--f-mono);font-size:.715rem;color:var(--haze-d);font-variant-numeric:tabular-nums}
.pc-cls{font-family:var(--f-mono);font-size:.645rem;letter-spacing:.15em;text-transform:uppercase;
  padding:.3em .6em;color:var(--cyan);border:1px solid rgba(53,214,245,.3);background:var(--cyan-g)}
.pc-cls.mat{color:var(--sand);border-color:rgba(217,183,120,.34);background:var(--sand-g)}
.pc-h{display:flex;align-items:baseline;gap:.7rem;flex-wrap:wrap}
.pc-h b{font-family:var(--f-disp);font-variation-settings:'wdth' 108;font-weight:700;
  font-size:1.14rem;line-height:1.25}
.pc-h .formula{font-style:normal;font-family:var(--f-mono);font-size:.79rem;letter-spacing:.06em;
  color:var(--sand);padding:.2em .5em;border:1px solid rgba(217,183,120,.3);background:var(--sand-g)}
.pc-kind{font-family:var(--f-mono);font-size:.67rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--haze-d)}
.pc-p{color:var(--haze);font-size:.95rem;line-height:1.6;
  display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.pc .chips{margin-top:.1rem}
.pc-go{margin-top:auto;padding-top:.35rem;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.15em;
  text-transform:uppercase;color:var(--cyan);display:flex;align-items:center;gap:.5em}
.pc-go em{font-style:normal;transition:transform .38s var(--ease)}
.pc:hover .pc-go em{transform:translateX(5px)}

/* ---------- document strip ---------- */
.dreg{display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}
.drow{display:flex;align-items:center;gap:1rem;padding:1rem 1.15rem;background:rgba(var(--deep-rgb),.72);
  transition:background .35s var(--ease),padding-left .35s var(--ease)}
.drow:hover{background:rgba(var(--panel-rgb),.8);padding-left:1.5rem}
.drow[hidden]{display:none}
.dr-k{font-family:var(--f-mono);font-size:.645rem;letter-spacing:.16em;padding:.3em .6em;flex:none;
  border:1px solid rgba(53,214,245,.3);color:var(--cyan);background:var(--cyan-g);white-space:nowrap}
.dr-k[data-kind=TDS],.dr-k[data-kind=SPEC]{color:var(--sand);border-color:rgba(217,183,120,.34);
  background:var(--sand-g)}
.drow-t{flex:1;min-width:0}
.drow-t b{display:block;font-weight:600;font-size:.99rem}
.drow-t small{display:block;font-family:var(--f-mono);font-size:.67rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--haze-d);margin-top:.24rem}
.drow-go{flex:none;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;
  color:var(--cyan)}
@media (max-width:560px){.drow-go{display:none}}

/* ---------- nothing found ---------- */
.pnone{display:grid;justify-items:center;gap:1rem;text-align:center;padding:clamp(3rem,8vh,5.5rem) 1rem}
.pnone[hidden]{display:none}
.pnone i{width:54px;height:54px;display:grid;place-items:center;border:1px solid var(--line-2);
  color:var(--haze-d);transform:rotate(45deg);font-style:normal}
.pnone i b{transform:rotate(-45deg);font-size:1.2rem}
.pnone h3{font-family:var(--f-disp);font-variation-settings:'wdth' 112;font-weight:700;font-size:1.3rem}
.pnone p{color:var(--haze);max-width:44ch}
.pnone em{font-style:normal;color:var(--frost)}
`,

  body: `
${hero({
  crumb: ["Products"],
  eyebrow: `Three classes &middot; ${TOTAL} grades &middot; Caspian, Gulf &amp; East Asia`,
  h1: "Products",
  lead: "Fertilizers, polymers and industrial chemicals &mdash; the whole book in one place. Search by grade name, chemical formula, application or origin, or browse the classes below.",
  sec: "Products",
})}

<section class="sec psec" data-sec="Search">
  <div class="wrap">
    <div class="psearch rv">
      <form class="psearch-f" role="search" onsubmit="return false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.75"/><path d="M15.4 15.4 21 21"/></svg>
        <label for="pq" class="vh">Search products</label>
        <input id="pq" type="search" autocomplete="off" spellcheck="false"
          placeholder="Search grades &mdash; urea, HDPE, LABSA, NaOH, MSDS&hellip;" />
        <button class="psearch-clr" type="button" data-clear aria-label="Clear search" hidden>&times;</button>
        <span class="psearch-k">${TOTAL} GRADES</span>
      </form>

      <div class="pfilters">
        <button class="pf" type="button" data-filter="all" data-on>All<b>${TOTAL + DOCS.length}</b></button>
${CLASSES.map((c) => `        <button class="pf" type="button" data-filter="${c.key}">${c.title}<b>${c.items.length}</b></button>`).join("\n")}
        <button class="pf" type="button" data-filter="documents">Documents<b>${DOCS.length}</b></button>
        <span class="pcount" data-count aria-live="polite"></span>
      </div>
    </div>
  </div>
</section>

${CLASSES.map(classSection).join("\n")}

<section class="sec sec-panel pcls" data-cat="documents" id="documents" data-sec="Documents">
  <div class="wrap">
    <div class="pcls-h rv">
      <span class="pcls-no">04</span>
      <div>
        <h2>Specifications &amp; documents</h2>
        <p class="lead">Safety, technical and origin sheets for the grades above. Tell us where to send it and a secure link arrives in your inbox.</p>
      </div>
      <a class="lk" href="index.html#specifications">Open the register</a>
    </div>
    <div class="dreg rvs">
${DOCS.map(docRow).join("\n")}
    </div>
  </div>
</section>

<div class="pnone" data-none hidden>
  <i aria-hidden="true"><b>?</b></i>
  <h3>Nothing matches <em data-none-q></em></h3>
  <p>We trade well beyond what is listed here. Tell the desk what you need and we will tell you honestly whether we can source it.</p>
  <div class="btns" style="justify-content:center">
    <a href="contact.html" class="btn btn-p" data-mag="6">Ask the desk <span class="ar">&rarr;</span></a>
    <button class="btn btn-o" type="button" data-clear data-mag="6">Clear search</button>
  </div>
</div>

${cta({
  eyebrow: "Request a quote",
  h2: "Found the grade? Tell us the tonnage.",
  lead: "Share volume, destination port and target delivery window &mdash; we return pricing and procedure within two business days.",
  primary: ["Request a quote", "contact.html"],
})}
`,

  js: `
/* Catalogue filtering. Every card carries its own lowercase haystack in
   data-h, so a keystroke is one string scan per card and no re-render. */
window.glxPage = function(){
  var box = document.getElementById('pq');
  if (!box) return;
  var cards   = [].slice.call(document.querySelectorAll('.pc, .drow'));
  var groups  = [].slice.call(document.querySelectorAll('.pcls'));
  var filters = [].slice.call(document.querySelectorAll('[data-filter]'));
  var countEl = document.querySelector('[data-count]');
  var noneEl  = document.querySelector('[data-none]');
  var noneQ   = document.querySelector('[data-none-q]');
  var clears  = [].slice.call(document.querySelectorAll('[data-clear]'));
  var cat = 'all';

  /* Every term must appear somewhere in the haystack, in any order, so
     "urea turkmenistan" narrows rather than widens. */
  function hit(hay, terms){
    for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) < 0) return false;
    return true;
  }

  function apply(){
    var q = box.value.trim().toLowerCase();
    var terms = q ? q.split(/\\s+/) : [];
    var shown = 0;

    cards.forEach(function(c){
      var ok = (cat === 'all' || c.getAttribute('data-cat') === cat)
        && (!terms.length || hit(c.getAttribute('data-h'), terms));
      c.hidden = !ok;
      if (ok) shown++;
    });

    /* A class with nothing left in it drops out entirely rather than leaving a
       heading over empty space. The page-level empty state covers the case
       where every class drops out. */
    groups.forEach(function(g){
      var live = g.querySelectorAll('.pc:not([hidden]), .drow:not([hidden])').length;
      g.hidden = live === 0;
    });

    /* Then force the survivors visible. The site-wide scroll reveal holds
       .rvs children at opacity 0 until their container intersects, and a
       container that rises into view only because everything above it was
       filtered out never trips the observer's threshold — so the single
       result somebody searched for would render as blank space. Only while a
       search or filter is active; an untouched page still reveals on scroll. */
    if (terms.length || cat !== 'all'){
      groups.forEach(function(g){
        if (g.hidden) return;
        [].forEach.call(g.querySelectorAll('.rv, .rvs'), function(n){
          n.setAttribute('data-in', '');
        });
      });
    }

    if (noneEl){
      noneEl.hidden = shown > 0;
      if (noneQ) noneQ.textContent = q ? '"' + box.value.trim() + '"' : 'that filter';
    }
    if (countEl){
      countEl.innerHTML = (terms.length || cat !== 'all')
        ? '<b>' + shown + '</b> shown' : '';
    }
    var clr = document.querySelector('.psearch-clr');
    if (clr) clr.hidden = !q;
  }

  box.addEventListener('input', apply);
  box.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){ box.value = ''; apply(); }
  });

  filters.forEach(function(b){
    b.addEventListener('click', function(){
      cat = b.getAttribute('data-filter');
      filters.forEach(function(o){ o.toggleAttribute('data-on', o === b); });
      apply();
    });
  });

  clears.forEach(function(b){
    b.addEventListener('click', function(){ box.value = ''; box.focus(); apply(); });
  });

  /* Arriving from site search with ?q= should land already filtered. */
  var q0 = new URLSearchParams(location.search).get('q');
  if (q0){ box.value = q0; box.focus(); }
  apply();
};
`,
};
