/* ============================================================
   PRODUCT ROW — the listing used by all three class pages.

   Fertilizers, polymers and industrials each render the same thing: a list of
   grades in a class. They had drifted into three different components —
   fertilizers and industrials shared `.row` but built their own markup for it,
   and polymers had `.fam-c`, a card with a procedural canvas animation in a
   320px column on the left. Three formats for one job, so the three pages did
   not look like the same site.

   This is that one job, once. The only thing a page supplies is what goes in
   the right-hand column, because that is the only part that genuinely differs:
   a nutrient split for a fertilizer, sector tags for a chemical, the family
   name for a resin.

   The whole row is a link to the grade's own page, rather than only the title
   being one. It matches the product cards on products.html, which are already
   whole-card links, and it means the photograph and the description are
   clickable too — on a row this wide, a text-only target was a small fraction
   of what reads as clickable.
   ============================================================ */

const { stamp } = require("./asset-stamp");

const chips = (list, kind) =>
  list && list.length
    ? `<span class="chips">${list.map((s) => `<span class="chip ${kind}">${s}</span>`).join("")}</span>`
    : "";

/* `side`  markup for the right-hand column — the page's own business
   `cls`   extra class on the row, for page-specific styling or filtering
   `attrs` extra attributes, e.g. the industrials filter's data-tags */
function productRow(p, i, { side = "", cls = "", attrs = "" } = {}) {
  return `<a class="row prod${cls ? " " + cls : ""}" href="${p.url}" id="${p.id}" data-cur="Open grade"${attrs}>
<span class="row-ix">${String(i + 1).padStart(2, "0")}</span>
<span class="row-img">
  <img src="${stamp(p.imgSq)}" alt="" width="512" height="512" loading="lazy" decoding="async" />
</span>
<span class="row-b">
  <h3 class="row-h">${p.name}${p.f && p.f !== "&mdash;" ? `<i class="formula">${p.f}</i>` : ""}</h3>
  ${chips(p.specs, "spec")}
  <span class="row-p">${p.body}</span>
  ${chips(p.origins, "org")}
</span>
<span class="row-side">${side}</span>
</a>`;
}

module.exports = { productRow };
