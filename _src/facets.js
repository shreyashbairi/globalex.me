/* ============================================================
   PRODUCT FILTER FACETS

   Built from the catalogue, so a facet value cannot exist that no grade has,
   and a grade cannot be invisible to every value in a group.

   The honesty problem this file solves: twelve of the sixteen industrial
   chemicals have no origins recorded, and only those sixteen carry sector
   tags at all. Three ways to handle that, and two of them are wrong:

     Ship the facet as-is        a buyer filtering "UAE" sees no caustic soda
                                 and concludes we do not supply it. Silently
                                 wrong, and invisible to us.

     Fill in plausible values    fabricated commercial data in the file that
                                 is explicitly the real catalogue. This is the
                                 exact failure §0.6 of the brief forbids.

     Name the gap               a chip reading "Origin not published (12)"
                                 whose count comes from the real arrays. No
                                 product is hidden, the gap is visible every
                                 time anyone looks at the page, and the chip
                                 disappears on its own once the data lands.

   The third. Counts are derived, never typed.
   ============================================================ */

const { CLASSES, SECTORS, plain } = require("./catalogue");
const { on } = require("./flags");

const ALL = CLASSES.flatMap((c) => c.items.map((i) => ({ item: i, cls: c })));

/* Every distinct origin actually present, in catalogue order of first
   appearance rather than alphabetical — the Caspian four lead the book and
  should lead the filter. */
const origins = () => {
  const seen = [];
  for (const { item } of ALL)
    for (const o of item.origins || []) if (!seen.includes(o)) seen.push(o);
  return seen;
};

const countBy = (pred) => ALL.filter(({ item, cls }) => pred(item, cls)).length;

/* A group renders only if it can discriminate: a facet where every grade
   matches every value is noise on the page. */
const groups = () => {
  const g = [];

  g.push({
    key: "class",
    label: "Class",
    values: CLASSES.map((c) => ({
      v: c.key,
      label: c.title,
      count: c.items.length,
      tone: c.tone,
    })),
  });

  const orig = origins();
  const unpublished = countBy((i) => !(i.origins || []).length);
  g.push({
    key: "origin",
    label: "Origin",
    values: orig
      .map((o) => ({
        v: plain(o).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: o,
        count: countBy((i) => (i.origins || []).includes(o)),
      }))
      .concat(
        /* Rendered only while the gap exists. When checklist 3.2a lands the
           count drops to zero and the chip removes itself. */
        unpublished
          ? [
              {
                v: "none",
                label: "Origin not published",
                count: unpublished,
                gap: true,
              },
            ]
          : [],
      ),
  });

  /* SECTORS[0] is ['all','All grades'], a UI pseudo-value from the old
     single-select bar. Slicing it off keeps an "All grades" chip from
     appearing inside a multi-select group next to Clear all. */
  const sectors = SECTORS.slice(1);
  const untagged = countBy((i) => !(i.t || []).length);
  g.push({
    key: "sector",
    label: "Sector",
    values: sectors
      .map(([v, label]) => ({
        v,
        label,
        count: countBy((i) => (i.t || []).includes(v)),
      }))
      .filter((x) => x.count > 0)
      .concat(
        untagged
          ? [
              {
                v: "none",
                label: "Not classified",
                count: untagged,
                gap: true,
              },
            ]
          : [],
      ),
  });

  /* Form is deferred, not derived. The catalogue's spec strings mix form
     ("Prilled", "Anhydrous") with grade ("N46 · 46% nitrogen"), purity
     ("96% purity") and packaging ("Bulk"), so a keyword sniff over them is
     wrong for about half the book and impossible to audit. Needs the closed
     vocabulary in checklist 3.3a and a real form field per grade. */
  if (on("filterForm"))
    g.push({
      key: "form",
      label: "Form",
      values: [],
    });

  return g.filter((x) => x.values.length > 1);
};

/* Per-grade facet values, baked into the card as data attributes so filtering
   is an attribute read rather than a lookup. */
const attrs = (item, cls) => {
  const o = (item.origins || []).map((x) =>
    plain(x).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  );
  const s = item.t || [];
  return (
    ` data-f-class="${cls.key}"` +
    ` data-f-origin="${o.length ? o.join(" ") : "none"}"` +
    ` data-f-sector="${s.length ? s.join(" ") : "none"}"`
  );
};

module.exports = { groups, attrs, ALL };
