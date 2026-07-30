/* Locations. Gated by PAGES.locations.

   Two independent gates: the page flag, and the REAL flag per entry in
   _src/locations.js. Switching the page on cannot publish a placeholder
   office, and a region with no confirmed office renders no tab rather than an
   empty one — three empty regional tabs advertise absence more loudly than
   having no page. */

const { hero, cta } = require("../parts");
const { real, byRegion, liveRegions, LOCATIONS } = require("../locations");

const regions = liveRegions();
const offices = real();
const unconfirmed = LOCATIONS.length - offices.length;

const card = (l) => `<article class="loc-c nch-m${l.kind === "HQ" ? " is-hq" : ""}">
<span class="chip ${l.kind === "HQ" ? "org" : "spec"}">${l.kind}</span>
<h3>${l.city}</h3>
<span class="loc-co">${l.country}</span>
<address>${l.address}</address>
<div class="loc-l">
<a href="tel:${l.phone.replace(/[^+\d]/g, "")}">${l.phone}</a>
<a href="mailto:${l.email}">${l.email}</a>
</div>
${l.coords ? `<span class="mono loc-xy">${l.coords[0].toFixed(4)}&deg;N / ${l.coords[1].toFixed(4)}&deg;E</span>` : ""}
<p>${l.note}</p>
${
  l.kind === "HQ"
    ? `<div class="map">
<span class="map-tag">JLT Cluster X</span>
<iframe title="Globalex Trading FZCO office location, Jumeirah Lakes Towers, Dubai"
 src="https://maps.google.com/maps?q=Jumeirah%20Lakes%20Towers%20Cluster%20X%20Dubai&t=&z=14&ie=UTF8&iwloc=&output=embed"
 loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>`
    : ""
}
</article>`;

const CRUMB = ["Locations"];

module.exports = {
  page: "locations",
  gate: "locations",
  tier: "company",
  nav: "company",
  crumb: CRUMB,
  title: "Locations — Globalex Trading FZCO",
  desc: "Where Globalex Trading FZCO operates from — the Dubai headquarters in Jumeirah Lakes Towers, and the origin desks along the Caspian corridor.",

  css: `
.loc-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:var(--gut)}
.loc-t{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.14em;text-transform:uppercase;
  padding:.55em 1em;border:1px solid var(--line);color:var(--haze-d);cursor:pointer;
  transition:border-color .3s,color .3s,background .3s}
.loc-t:hover{border-color:var(--line-2);color:var(--frost)}
.loc-t[aria-selected=true]{border-color:var(--cyan);color:var(--cyan);background:var(--cyan-g)}
.loc-t:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.loc-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr));
  gap:clamp(.9rem,2vw,1.4rem)}
.loc-c{display:grid;gap:.45rem;align-content:start;padding:clamp(1.4rem,2.6vw,2rem);
  border:1px solid var(--line);background:linear-gradient(160deg,rgba(var(--panel-rgb),.46),rgba(var(--deep-rgb),.7))}
.loc-c.is-hq{grid-column:span 2}
@media (max-width:820px){.loc-c.is-hq{grid-column:auto}}
.loc-c h3{font-size:var(--t-h4);margin-top:.3rem}
.loc-co{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--haze-d)}
.loc-c address{font-style:normal;color:var(--haze);margin-top:.5rem;line-height:1.55}
.loc-l{display:grid;gap:.25rem;margin-top:.6rem}
.loc-l a{color:var(--cyan);font-family:var(--f-mono);font-size:.8rem;letter-spacing:.05em}
.loc-l a:hover{color:var(--frost)}
.loc-xy{margin-top:.5rem;color:var(--steel)}
.loc-c p{color:var(--haze);margin-top:.7rem;font-size:.99rem}
.loc-c .map{margin-top:1.1rem}
.map{position:relative;aspect-ratio:16/9;border:1px solid var(--line);overflow:hidden}
.map iframe{position:absolute;inset:0;width:100%;height:100%;border:0;
  filter:grayscale(1) invert(.92) hue-rotate(165deg) saturate(1.5) brightness(.86) contrast(1.05)}
.map-tag{position:absolute;left:0;bottom:0;z-index:2;padding:.5rem .8rem;
  background:rgba(var(--void-rgb),.86);font-family:var(--f-mono);font-size:.66rem;
  letter-spacing:.15em;text-transform:uppercase;color:var(--haze)}
[role=tabpanel][hidden]{display:none}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow: "Where we are",
  h1: "Operated from Dubai, present at the origin.",
  lead: "The contracts, the documentation and the money move through Jumeirah Lakes Towers. The relationships that make a cargo available sit closer to the mills.",
  meta: [
    [String(offices.length), offices.length === 1 ? "Office" : "Offices"],
    ["JLT", "Headquarters"],
    ["GMT+4", "Desk hours"],
  ],
  sec: "Locations",
})}

<section class="sec" data-sec="Offices">
<div class="wrap">
${
  regions.length > 1
    ? `<div class="loc-tabs" role="tablist" aria-label="Offices by region">
${regions
  .map(
    ([k, label], i) =>
      `<button class="loc-t" type="button" role="tab" id="lt-${k}"
 aria-controls="lp-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`,
  )
  .join("\n")}
</div>
${regions
  .map(
    ([k], i) => `<div class="loc-g rvs" role="tabpanel" id="lp-${k}"
 aria-labelledby="lt-${k}"${i === 0 ? "" : " hidden"}>
${byRegion(k).map(card).join("\n")}
</div>`,
  )
  .join("\n")}`
    : `<div class="loc-g rvs">
${offices.map(card).join("\n")}
</div>`
}
${
  unconfirmed
    ? `<p class="tbl-n" style="margin-top:1.6rem">Only confirmed offices are
listed. ${unconfirmed} further ${unconfirmed === 1 ? "location is" : "locations are"}
pending confirmation and will appear here once verified.</p>`
    : ""
}
</div>
</section>

${cta({
  eyebrow: "The desk",
  h2: "One desk, four origin markets.",
  lead: "Whatever the origin, the contract and the paperwork come from Dubai.",
  primary: ["Contact us", "contact.html"],
})}`,

  js:
    regions.length > 1
      ? `
/* Regional tabs. Arrow keys move between them and the panel follows, which is
   what role=tablist promises — the same contract the mega-menu honours. */
window.glxPage = function(){
  var tabs = [].slice.call(document.querySelectorAll('[role=tab]'));
  if (!tabs.length) return;
  function select(i){
    tabs.forEach(function(t, k){
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel){
        panel.hidden = !on;
        if (on && window.glxReveal) window.glxReveal(panel);
      }
    });
    tabs[i].focus();
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(i); });
    t.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); select((i+1)%tabs.length); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); select((i-1+tabs.length)%tabs.length); }
      else if (e.key === 'Home'){ e.preventDefault(); select(0); }
      else if (e.key === 'End'){ e.preventDefault(); select(tabs.length-1); }
    });
  });
};
`
      : "",
};
