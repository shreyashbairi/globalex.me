/* ============================================================
   VISIBILITY FLAGS — the one place to switch things on and off

   Everything in the upgrade that is built but not yet publishable is gated
   here, so making it live is a one-word edit in one file followed by
   `npm run build`. Nothing else needs touching.

   Two kinds of gate:

     PAGES    a page that exists in the information architecture but is not
              linked, because the page itself has not been built yet.
              Switching one on makes it appear in the header mega-menu, the
              mobile nav, the footer and the sitemap.

     DRAFT    a page that IS built and linked, but carries placeholder data.
              While its flag is true the page renders a loud sand banner
              reading "Draft — placeholder content, not published". Set it
              false once the real figures are in and the banner disappears.

   SAFETY: `npm run build` refuses to finish if a PAGES flag is on for a page
   that does not exist. That turns "flip the switch too early" into a build
   error rather than a live 404, which is the whole point of the flag.
   ============================================================ */

/* ---------------------------------------------------------------- PAGES
   These five are declared in _src/nav.js but not yet built. Each needs the
   company data listed beside it before the page is worth publishing; see
   globalex-upgrade-data-checklist.md for the full ask. */
const PAGES = {
  // Names, roles, bios, and written consent from each individual (UAE PDPL).
  leadership: false,
  // Whether any office outside Dubai actually exists.
  locations: false,
  // At least three posts, plus someone to keep writing them.
  news: false,
  // Per-port draft, berths and load rates; a transit-time matrix.
  logistics: false,
  // Licence numbers, KYC pack, sanctions position (needs legal sign-off).
  compliance: false,
};

/* ---------------------------------------------------------------- DRAFT
   Pages that ship with placeholder content behind a visible banner. Empty
   for now: Phases 0 to 2 deliberately covered only work with no data
   dependency, so nothing currently published is placeholder-gated.

   Phase 3 onward will add entries here — the 24 product spec sheets, the
   sustainability KPI band, the About timeline. The mechanism is already
   wired: a page module setting `draft: DRAFT.<key>` gets the banner from
   build.js#render() with no further work. */
const DRAFT = {
  // productSpecs: true,   // 24 grades of assay figures (checklist 3.1)
  // esgMetrics:   true,   // KPI band figures (checklist 6.1)
  // timeline:     true,   // the five milestone years (checklist 5.2)
};

/* True when a page is switched on. Unknown keys are off, so a typo hides a
   row rather than publishing something unintended. */
const pageLive = (key) => PAGES[key] === true;

module.exports = { PAGES, DRAFT, pageLive };
