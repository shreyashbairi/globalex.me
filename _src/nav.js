/* ============================================================
   INFORMATION ARCHITECTURE — single source of truth

   Before this file, four places independently described the navigation and
   drifted apart: shell.js's NAV array, its PRODUCTS dropdown with counts
   typed in by hand ("Search 24 grades"), a fully hardcoded #mnav mobile
   list, and three footer <ul>s. Adding a page meant editing four lists and
   remembering all four.

   Now: the header mega-menus, the mobile nav, the footer columns, the
   current-page highlight and the sitemap tiers all read this.

   It lives here rather than in shell.js because build.js needs the tree for
   sitemap priorities and must not import header markup, and rather than in
   catalogue.js because that file is product truth — its PAGES export is a
   *search* list that contains a fragment URL, which is a different thing
   from an IA tree.
   ============================================================ */

const { CLASSES } = require("./catalogue");

/* Rows marked hold:true are declared but not yet linked — the page does not
   exist. That keeps the intended IA visible in one place while the rendered
   menu only offers pages that resolve, so there are no 404s in the header.
   Building the page is then a one-word edit here.

   The five held rows are the Phase 4 and Phase 5 pages, which are blocked on
   company data rather than on engineering. */
const NAV = [
  {
    id: "company",
    label: "Company",
    href: "about.html",
    kind: "menu",
    tier: "company",
    rows: [
      {
        href: "about.html",
        label: "About",
        desc: "Who we are, and how the desk operates",
      },
      {
        href: "leadership.html",
        label: "Leadership",
        desc: "The people behind the trades",
        hold: true,
      },
      {
        href: "locations.html",
        label: "Locations",
        desc: "Dubai HQ and origin desks",
        hold: true,
      },
      {
        href: "news.html",
        label: "News",
        desc: "Market notes from the corridor",
        hold: true,
      },
      {
        href: "careers.html",
        label: "Careers",
        desc: "Open roles and speculative applications",
      },
    ],
  },
  /* No rows: the Products columns are derived from CLASSES at render time.
     That is what makes "add a grade to catalogue.js and it appears in the
     menu" structurally true rather than a thing to remember. */
  {
    id: "products",
    label: "Products",
    href: "products.html",
    kind: "mega",
    tier: "class",
  },
  {
    id: "trade",
    label: "Trade",
    href: "procedures.html",
    kind: "menu",
    tier: "company",
    rows: [
      {
        href: "procedures.html",
        label: "Trade Procedures",
        desc: "How an enquiry becomes a shipment",
      },
      {
        href: "logistics.html",
        label: "Logistics &amp; Shipping",
        desc: "Incoterms, load ports and packing",
        hold: true,
      },
      {
        href: "compliance.html",
        label: "Compliance &amp; Certifications",
        desc: "Licensing, KYC and inspection",
        hold: true,
      },
    ],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    href: "sustainability.html",
    kind: "link",
    tier: "company",
  },
];

/* How many industrial grades the mega-menu column shows before it defers to
   the class page. Catalogue order, which is a stand-in for commercial
   priority — the checklist asks for a ranked order, and until it arrives
   this drops LABSA, SLES and Sulphuric Acid from the menu. */
const MENU_GRADE_CAP = 8;

const live = (n) => !n.hold;

/* The tree as rendered: held rows removed, and a top-level item with a menu
   that has lost every row degrades to a plain link rather than presenting an
   empty panel. */
const NAV_LIVE = NAV.map((n) => {
  if (!n.rows) return n;
  const rows = n.rows.filter(live);
  return { ...n, rows, kind: rows.length ? n.kind : "link" };
});

/* Which top-level item owns a page, so the header can highlight an ancestor
   when a descendant is open.

   Declared, never inferred from the page name. "products" and "procedures"
   share a prefix, and Phase 3's product pages will be named
   "fertilizers-urea-b-n46" — any prefix heuristic gets both wrong. A page
   may also state its own owner via `nav:` in its module, which is how
   generated pages will do it. */
const base = (href) => String(href).replace(/\.html$/, "").replace(/#.*$/, "");

const OWNER = {};
for (const n of NAV) {
  OWNER[base(n.href)] = n.id;
  for (const r of n.rows || []) OWNER[base(r.href)] = n.id;
}
for (const cls of CLASSES) {
  OWNER[cls.key] = "products";
  for (const item of cls.items) if (item.url) OWNER[base(item.url)] = "products";
}

const ownerOf = (page, declared) => declared || OWNER[page] || null;

/* Footer columns. Commodities and Company/Trade come from the tree; the
   Dubai Desk block stays in shell.js because an address is not IA. */
const footerColumns = () => [
  {
    title: "Commodities",
    links: [
      { href: "products.html", label: "All products" },
      ...CLASSES.map((c) => ({ href: c.href, label: c.title })),
      { href: "index.html#specifications", label: "Specifications &amp; MSDS" },
    ],
  },
  {
    title: "Company",
    /* Sustainability sits here rather than under Trade: it is a company
       commitment, not a trade function, and that is where it was before. */
    links: (NAV_LIVE.find((n) => n.id === "company").rows || []).concat([
      { href: "sustainability.html", label: "Sustainability" },
      { href: "contact.html", label: "Contact" },
    ]),
  },
  {
    title: "Trade",
    links: NAV_LIVE.find((n) => n.id === "trade").rows || [],
  },
];

module.exports = {
  NAV,
  NAV_LIVE,
  OWNER,
  ownerOf,
  footerColumns,
  MENU_GRADE_CAP,
  base,
};
