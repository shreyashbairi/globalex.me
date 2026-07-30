/* ============================================================
   404

   Cloudflare Pages falls back to index.html for any unmatched path when no
   404.html exists — with a 200 status. So every typo, every stale inbound
   link and every not-yet-built URL was answering "200 OK, here is the
   homepage", which is a soft 404: crawlers index the bogus URL, report the
   page as low quality, and spend crawl budget on paths that do not exist.

   Committing this file is the whole fix. Pages serves it with a real 404
   for unmatched paths. It is noindex, so emit() keeps it out of the
   sitemap by the same rule that excludes the dashboard.
   ============================================================ */

const { CLASSES } = require("../catalogue");

const routes = [
  ["products.html", "All products", `Every grade in the book, searchable`],
  ["procedures.html", "Trade procedures", "How an enquiry becomes a shipment"],
  ["contact.html", "Talk to the desk", "Tonnage, port and window"],
];

module.exports = {
  page: "404",
  noindex: true,
  title: "Page not found — Globalex Trading FZCO",
  desc: "That page does not exist. Browse the commodity book, the trade procedures, or contact the Dubai desk.",

  css: `
.e404{position:relative;min-height:76vh;display:flex;align-items:center;overflow:hidden;
  padding-top:clamp(8rem,16vh,11rem);padding-bottom:clamp(3rem,7vh,5rem)}
.e404 canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.7}
.e404-in{position:relative;z-index:2;display:grid;gap:1.6rem;max-width:70ch}
.e404-no{font-family:var(--f-disp);font-weight:800;font-size:clamp(5rem,17vw,11rem);line-height:.82;
  letter-spacing:-.045em;font-variation-settings:'wdth' 120;color:var(--frost)}
.e404-no i{font-style:normal;color:var(--cyan)}
.e404 .g3{margin-top:.8rem}
.e404-c{display:grid;gap:.5rem;align-content:start;padding:clamp(1.2rem,2.2vw,1.6rem);
  border:1px solid var(--line);background:rgba(var(--deep-rgb),.5);
  transition:border-color .4s var(--ease),background .4s var(--ease),transform .4s var(--ease)}
.e404-c:hover{border-color:var(--line-2);background:rgba(var(--panel-rgb),.62);transform:translateY(-3px)}
.e404-c b{font-family:var(--f-disp);font-weight:700;font-size:1.06rem;
  font-variation-settings:'wdth' 106;color:var(--frost)}
.e404-c small{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.11em;
  text-transform:uppercase;color:var(--haze-d)}
.e404-c span{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;
  text-transform:uppercase;color:var(--cyan);margin-top:.3rem}
`,

  body: `
<section class="e404" data-sec="Not found">
<canvas data-orn="cyan" data-tile="150" data-nodes="6" data-alpha="0.24" aria-hidden="true"></canvas>
<div class="wrap">
<div class="e404-in">
<span class="eb rv">Error 404 &middot; No such page</span>
<p class="e404-no" aria-hidden="true">4<i>0</i>4</p>
<h1 class="kin">That page is not on the manifest.</h1>
<p class="lead rv" style="--d:140ms">The link may be out of date, or the address mistyped. The ${CLASSES.reduce((n, c) => n + c.items.length, 0)} grades we trade are all reachable from the products index, and the desk answers directly.</p>
<div class="g3 rvs nch-m">
${routes
  .map(
    ([href, label, note]) => `<a class="e404-c nch-s" href="${href}">
  <b>${label}</b>
  <small>${note}</small>
  <span>Open &rarr;</span>
</a>`,
  )
  .join("\n")}
</div>
<p class="mono rv" style="--d:320ms;margin-top:.4rem">Or press <kbd>&#8984;K</kbd> to search the site</p>
</div>
</div>
</section>`,
};
