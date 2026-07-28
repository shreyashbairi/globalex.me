/* ============================================================
   DOCUMENT CATALOGUE — single source of truth.

   The site, the backend and the admin dashboard all read this list.
   build.js emits a copy to functions/_lib/docs.js so the Worker never
   drifts from what the page advertises.

   Every number below is lifted from the actual PDF, not invented. The
   base-oil figures come from the range TDS (which tabulates SN-80
   through SN-1200); the per-grade MSDS sheets agree with it, so where a
   sheet states its own value we use the sheet's.
   ============================================================ */

// Kinematic viscosity @100°C, cSt — the property that defines a base oil
// grade and the only axis on which the five sheets meaningfully differ.
const BASE_OIL_FAMILY = [
  { grade: 'SN-80',   kv: [2.5, 3.5],   flash: 170, density: 870, pour: -12, vi: 95 },
  { grade: 'SN-180',  kv: [4.5, 6.0],   flash: 205, density: 880, pour: -12, vi: 95 },
  { grade: 'SN-350',  kv: [8.0, 9.5],   flash: 220, density: 890, pour: -12, vi: 95 },
  { grade: 'SN-600',  kv: [11.5, 13.5], flash: 225, density: 900, pour: -9,  vi: 95 },
  { grade: 'SN-1200', kv: [18.0, 23.0], flash: 250, density: 905, pour: -9,  vi: 90 },
];

// Melt flow rate, g/10min — the equivalent defining axis for polypropylene.
const PP_FAMILY = [
  { grade: 'TPP D30 S',    mfi: [2.7, 3.7],  flex: 1300, vicat: 145 },
  { grade: 'TPP F 79 FB',  mfi: [10, 15],    flex: 1450, vicat: 150 },
  { grade: 'TPP D 382 BF', mfi: [2.7, 3.7],  flex: 1300, vicat: null },
];

const DOCS = [
  {
    id: 'msds-sn180',
    kind: 'MSDS',
    code: 'SN-180',
    title: 'Base Oil SN-180',
    sub: 'Material Safety Data Sheet',
    // Source file on disk → the key it is stored under in R2.
    source: 'Globalex_SN180_MSDS.pdf',
    key: 'msds-base-oil-sn-180.pdf',
    pages: 3,
    bytes: 4888421,
    origin: 'Turkmenistan',
    // Which family plot this document's specimen plate draws, and which
    // member of it to light up.
    plot: 'viscosity',
    highlight: 'SN-180',
    specs: [
      ['Kinematic viscosity @ 100 °C', '4.5 – 6.0 cSt'],
      ['Flash point', '> 207 °C'],
      ['Pour point', '−12 °C'],
      ['Viscosity index', '95'],
      ['Density @ 20 °C', '880 kg/m³'],
      ['CAS number', '64742-54-7'],
    ],
    summary: 'Full 16-section GHS safety sheet for the SN-180 cut — hazard identification, first aid, firefighting, spill response, exposure controls and transport classification.',
  },
  {
    id: 'msds-sn350',
    kind: 'MSDS',
    code: 'SN-350',
    title: 'Base Oil SN-350',
    sub: 'Material Safety Data Sheet',
    source: 'MSDS_SN350_Globalex.pdf.pdf',
    key: 'msds-base-oil-sn-350.pdf',
    pages: 2,
    bytes: 497012,
    origin: 'Turkmenistan',
    plot: 'viscosity',
    highlight: 'SN-350',
    specs: [
      ['Kinematic viscosity @ 100 °C', '8.0 – 9.5 cSt'],
      ['Flash point', '≥ 220 °C'],
      ['Pour point', '−12 °C'],
      ['Viscosity index', '95'],
      ['Density @ 20 °C', '≤ 890 kg/m³'],
      ['Colour (ASTM)', '1.0'],
    ],
    summary: 'Mid-range solvent-neutral grade. Not classified as hazardous; biodegradable under favourable conditions and unregulated for transport.',
  },
  {
    id: 'msds-sn600',
    kind: 'MSDS',
    code: 'SN-600',
    title: 'Base Oil SN-600',
    sub: 'Material Safety Data Sheet',
    source: 'MSDS_SN600_Globalex.pdf',
    key: 'msds-base-oil-sn-600.pdf',
    pages: 2,
    bytes: 939543,
    origin: 'Turkmenistan',
    plot: 'viscosity',
    highlight: 'SN-600',
    specs: [
      ['Kinematic viscosity @ 100 °C', '11.5 – 13.5 cSt'],
      ['Flash point', '≥ 225 °C'],
      ['Pour point', '−9 °C'],
      ['Viscosity index', '95'],
      ['Density @ 20 °C', '≤ 900 kg/m³'],
      ['Colour (ASTM)', '2.0'],
    ],
    summary: 'Heavy solvent-neutral grade for higher-viscosity blends. Same hazard profile as the lighter cuts, with a correspondingly higher flash point.',
  },
  {
    id: 'tds-base-oil',
    kind: 'TDS',
    code: 'RANGE',
    title: 'Base Oil — full range',
    sub: 'Technical Data Sheet',
    source: 'TDS BASE OIL Globalex.pdf',
    key: 'tds-base-oil-range.pdf',
    pages: 1,
    bytes: 396549,
    origin: 'Turkmenistan',
    plot: 'viscosity',
    highlight: null, // the sheet is the whole family, so light all five
    specs: [
      ['Grades covered', 'SN-80 · 180 · 350 · 600 · 1200'],
      ['Viscosity span @ 100 °C', '2.5 – 23.0 cSt'],
      ['Flash point span', '170 – 250 °C'],
      ['Density span @ 20 °C', '870 – 905 kg/m³'],
      ['Sulphur content', '≤ 0.03 %'],
      ['Ash / mechanical impurities', '≤ 0.005 %'],
    ],
    summary: 'The comparison table for all five solvent-neutral cuts — eleven indices side by side, including sulphur, ash, acidity and mechanical impurities. Start here when selecting a grade.',
  },
  {
    id: 'pp-turkmenplen',
    kind: 'SPEC',
    code: 'TURKMENPLEN',
    title: 'Polypropylene — Turkmenplen',
    sub: 'Origin & grade specification',
    source: 'PP origin Turkmenistan.pdf',
    key: 'spec-polypropylene-turkmenplen.pdf',
    pages: 1,
    bytes: 453147,
    origin: 'Turkmenistan',
    plot: 'meltflow',
    highlight: null,
    specs: [
      ['Grades covered', 'TPP D30 S · F 79 FB · D 382 BF'],
      ['Melt flow rate', '2.7 – 15 g/10 min'],
      ['Flexural modulus', '1300 – 1450 N/mm²'],
      ['Vicat softening point', '145 – 150 °C'],
      ['Thermooxidising stability @ 150 °C', '120 – 360 h'],
      ['Granule size', '40 – 60 pcs/g'],
    ],
    summary: 'Thirteen indices for the three Turkmenplen homopolymer grades, including fluidity, elasticity modulus, gel count and turbidity for film applications.',
  },
];

module.exports = { DOCS, BASE_OIL_FAMILY, PP_FAMILY };
