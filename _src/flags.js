/* ============================================================
   VISIBILITY FLAGS — the one place to switch things on and off

   Everything in the upgrade that is built but not yet publishable is gated
   here, so making it live is a one-word edit in one file followed by
   `npm run build`. Nothing else needs touching.

   Three kinds of gate:

     PAGES     a whole page. Switching one on makes it appear in the header
               mega-menu, the mobile nav, the footer and the sitemap.
               Switching it off also stops the page being written at all, so
               there is no orphan URL sitting there unlinked.

     SECTIONS  a section inside a page that IS live. The rest of the page
               publishes normally; the gated block is simply absent. Use this
               where one part of a page needs data the rest does not.

     DRAFT     a page that is live and carries visible placeholder data. While
               true the page renders a loud sand banner reading
               "Draft — placeholder content, not published".

   SAFETY: `npm run build` fails if a PAGES flag is on for a page with no
   module, and warns if a SECTIONS flag is on while the data behind it is
   still placeholder. Flipping a switch too early is a local build error
   rather than a live 404 or a published invented figure.
   ============================================================ */

/* ---------------------------------------------------------------- PAGES */
const PAGES = {
  /* Needs: confirmation that any office outside Dubai actually exists. The
     Dubai HQ entry is real; everything else is placeholder. Checklist 4.2b. */
  locations: false,

  /* Needs: at least three posts, and someone to keep writing them. An empty
     newsroom dates the site. Checklist 4.1a/4.1c. */
  news: false,

  /* LIVE. The Incoterms 2020 matrix, the shipping modes, the packaging
     options and the documentation set need no company data. The per-port
     figures and the transit matrix are gated separately below.
     Switched on in the same commit that adds the page. */
  logistics: true,

  /* Needs: trade licence number and issuing freezone, Dubai Customs code,
     Dubai Chambers membership, the KYC pack, the sanctions-screening lists
     and provider, the UBO threshold, the contracted inspection agencies, and
     legal sign-off on the sanctions position. Checklist 4.3a-4.3j.

     The page is built and every section is written, but almost every
     statement on it is a compliance representation a counterparty may hold
     us to, so it stays off until someone with authority has read it. */
  compliance: false,
};

/* -------------------------------------------------------------- SECTIONS */
const SECTIONS = {
  /* Typical-analysis, physical and trade-terms tables on the 24 product
     pages. Every figure is "[--]" until real assay data lands, so the tables
     are hidden and each page shows a "request the specification" panel
     instead. Checklist 3.1. The rest of each product page — the grade copy,
     applications, origins, related grades — is real and publishes now. */
  productSpecs: false,

  /* Side-by-side comparison. Depends entirely on productSpecs: with
     placeholder figures every row would read "[--]" against "[--]", which
     looks broken rather than informative. */
  productCompare: false,

  /* The Form facet on the products filter bar. There is no form field in the
     catalogue — the information is buried in free-text spec strings that also
     carry grade, purity and packaging, so deriving it would be wrong for
     roughly half the book. Needs the closed vocabulary in checklist 3.3a,
     then a real `form: []` array per grade. */
  filterForm: false,

  /* Per-port draft, berths, load rate and rail/road connection. Operational
     figures a counterparty would plan against. Checklist 4.4a. */
  logisticsPorts: false,

  /* Origin-to-destination transit matrix. Needs both axes: which
     destinations we quote, and indicative days per pair. Checklist 4.4b. */
  logisticsTransit: false,

  /* The leadership grid on the About page. Needs names, roles, bios, and
     written consent from each individual to publish their personal data
     (UAE PDPL) — a legal gate, not a data gap. Checklist 5.1a/5.1b.

     The nav row for it points at about.html#leadership, so switching this on
     makes both the section and its menu entry appear. */
  leadership: false,

  /* The company timeline on the About page. 2019 and today's figures are
     known; the three milestones between them need verifiable years.
     Checklist 5.2b-5.2d. */
  timeline: false,

  /* Sustainability KPI band. Needs the number, unit, period and citable
     source per metric — or an explicit "not tracked yet", which renders as an
     em dash with a "Tracking from 2026" caption. Checklist 6.1. */
  esgKpis: false,

  /* Measurable target, current status and operational practice for each of
     the six commitments. While off, the commitments render as they do today:
     clean prose cards. Accordions with nothing extra inside them would be a
     downgrade. Checklist 6.2. */
  esgTargets: false,

  /* The gated ESG report register row. Stays hidden until the PDF exists in
     R2, because the request path would otherwise mint a token for a document
     that cannot be delivered. Set docs.js#released too. Checklist 6.3a. */
  esgReport: false,

  /* Background video in the logistics hero. The footage is in the repo and
     depicts freight, so it matches that page — but its licence and
     provenance are unconfirmed, and unlicensed footage on a corporate site
     is a real exposure. Checklist 7.1b.

     Note the files carry no audio track (encoded -an), so there is
     deliberately no mute control; a mute button over silence is worse than
     none. */
  heroVideo: false,
};

/* ---------------------------------------------------------------- DRAFT */
/* Empty. Nothing currently published carries placeholder content: where data
   is missing the section is hidden rather than shown with invented figures.
   The banner exists for the case where showing a draft is preferable to
   hiding it — a page whose shape needs review before the numbers arrive. */
const DRAFT = {};

/* Unknown keys are off, so a typo hides something rather than publishing
   something unintended. */
const pageLive = (key) => PAGES[key] === true;
const on = (key) => SECTIONS[key] === true;

module.exports = { PAGES, SECTIONS, DRAFT, pageLive, on };
