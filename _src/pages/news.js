/* Newsroom index. Gated by PAGES.news, which is off.

   If every post is DRAFT the page renders an honest empty state rather than a
   fabricated feed — the brief is explicit about that, and it is the right call:
   a placeholder headline in a newsroom reads as a dead company. */

const { hero, cta } = require("../parts");
const { sorted, url, KINDS, allDraft } = require("../news");

const fmt = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });

const posts = sorted();
const empty = allDraft();
const lead = posts[0];
const rest = posts.slice(1);

const CRUMB = ["News"];

module.exports = {
  page: "news",
  gate: "news",
  tier: "company",
  nav: "company",
  crumb: CRUMB,
  title: "News — Globalex Trading FZCO",
  desc: "Market notes and corridor updates from the Globalex trading desk in Dubai.",

  css: `
.nx-f{position:relative;overflow:hidden;padding:clamp(1.8rem,4vw,3rem);
  border:1px solid var(--line-2);background:linear-gradient(150deg,var(--steel),var(--deep) 62%)}
.nx-f canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.42}
.nx-f-in{position:relative;z-index:2;display:grid;gap:1rem;max-width:60ch}
.nx-f h2{font-size:var(--t-h2);max-width:26ch}
.nx-by{display:flex;align-items:center;gap:.9rem;flex-wrap:wrap;font-family:var(--f-mono);
  font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--haze-d)}
.nx-l{display:grid;grid-template-columns:1fr 1fr;gap:clamp(.9rem,2vw,1.4rem);margin-top:var(--gut)}
@media (max-width:820px){.nx-l{grid-template-columns:1fr}}
.nx-c{display:flex;flex-direction:column;gap:.6rem;padding:clamp(1.3rem,2.4vw,1.8rem);
  border:1px solid var(--line);background:rgba(var(--deep-rgb),.5);
  transition:border-color .4s var(--ease),transform .4s var(--ease)}
.nx-c:hover{border-color:var(--line-2);transform:translateY(-3px)}
.nx-c h3{font-size:1.16rem}
.nx-c p{color:var(--haze);font-size:.99rem}
.nx-c .lk{margin-top:auto;align-self:flex-start}
.nx-c[hidden]{display:none}
.nx-empty{display:grid;gap:1rem;padding:clamp(2rem,5vw,3.5rem);border:1px dashed var(--line-2);
  background:rgba(var(--deep-rgb),.42);max-width:70ch}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "The desk",
  h1: "Notes from the corridor.",
  lead: "What we are seeing on the lanes we work &mdash; origin availability, freight, and the regulatory changes that move a delivered price.",
  sec: "News",
})}

<section class="sec" data-sec="Posts">
<div class="wrap">
${
  empty
    ? `<div class="nx-empty nch-m rv">
<span class="eb">Nothing published yet</span>
<h2 style="font-size:var(--t-h3)">The first note is being written.</h2>
<p class="lead">Rather than fill this page with placeholder headlines, it stays
empty until there is something worth reading. If you want the corridor view in
the meantime, the desk answers directly.</p>
<div class="btns" style="margin-top:.4rem">
<a class="btn btn-p" data-mag="6" href="contact.html">Ask the desk <span class="ar">&rarr;</span></a>
</div>
</div>`
    : `<div class="pfacets" style="margin-bottom:var(--gut)">
<div class="pfg" role="group" aria-labelledby="fg-kind">
<span class="pfg-l" id="fg-kind">Kind</span>
${KINDS.map(
  (k) =>
    `<button class="pf" type="button" role="switch" aria-checked="false" data-kind="${k}">${k}</button>`,
).join("\n")}
</div>
<span class="pcount" data-count aria-live="polite"></span>
</div>

<article class="nx-f rv">
<canvas data-orn="cyan" data-tile="130" data-nodes="5" data-alpha="0.3" aria-hidden="true"></canvas>
<div class="nx-f-in">
<div class="nx-by"><span class="chip spec">${lead.kind}</span>
<time datetime="${lead.date}">${fmt(lead.date)}</time></div>
<h2>${lead.title}</h2>
<p class="lead">${lead.summary}</p>
<a class="lk" href="${url(lead)}">Read the note</a>
</div>
</article>

${
  rest.length
    ? `<div class="nx-l rvs">
${rest
  .map(
    (p) => `<article class="nx-c nch-s" data-kind="${p.kind}">
<div class="nx-by"><span class="chip spec">${p.kind}</span>
<time datetime="${p.date}">${fmt(p.date)}</time></div>
<h3>${p.title}</h3>
<p>${p.summary}</p>
<a class="lk" href="${url(p)}">Read &rarr;</a>
</article>`,
  )
  .join("\n")}
</div>`
    : ""
}`
}
</div>
</section>

${cta({
  eyebrow: "The desk",
  h2: "Prefer the short version?",
  lead: "Tell us the grade and the destination and you get the current position without the reading.",
  primary: ["Contact the desk", "contact.html"],
})}`,

  js: empty
    ? ""
    : `
/* Kind filter. Same chip semantics as the products facet bar: multi-select,
   OR within the group. The feature post is always shown — it is the page's
   lead, not a list row. */
window.glxPage = function(){
  var chips = [].slice.call(document.querySelectorAll('[data-kind][role=switch]'));
  var rows  = [].slice.call(document.querySelectorAll('.nx-c[data-kind]'));
  var count = document.querySelector('[data-count]');
  if (!chips.length) return;
  var sel = new Set();
  function apply(){
    var shown = 0;
    rows.forEach(function(r){
      var ok = !sel.size || sel.has(r.getAttribute('data-kind'));
      r.hidden = !ok;
      if (ok) shown++;
    });
    if (count) count.innerHTML = sel.size ? '<b>' + shown + '</b> shown' : '';
    if (sel.size && window.glxReveal) window.glxReveal(document.querySelector('.nx-l'));
  }
  chips.forEach(function(c){
    c.addEventListener('click', function(){
      var k = c.getAttribute('data-kind');
      var nowOn = c.getAttribute('aria-checked') !== 'true';
      c.setAttribute('aria-checked', nowOn ? 'true' : 'false');
      if (nowOn) sel.add(k); else sel.delete(k);
      apply();
    });
  });
  apply();
};
`,
};
