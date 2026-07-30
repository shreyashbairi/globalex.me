/* ============================================================
   ⚠️  PLACEHOLDER DATA — NOT FOR PRODUCTION
   Every value below is invented. Replace with verified company
   data before this page ships. Do not deploy as-is.
   ============================================================

   PRODUCT SPECIFICATIONS, keyed by catalogue grade id.

   Rendered by _src/product-page.js into three panels: typical analysis,
   physical & packaging, and trade terms. Hidden entirely while
   flags.js SECTIONS.productSpecs is false, which it is — so nothing in
   here is currently published.

   What is real and what is not:

     REAL      the `form` strings, lifted from the catalogue's own spec
               chips, and the fertilizer N/P/K typical values, which are
               already published on the class pages.

     BLANK     every "[--]" and "[...]". A blank spec figure reads as
               unfinished. A plausible-looking one is a commercial
               liability — a buyer's QC team will hold us to an assay
               value, and a made-up test method is worse still.

   To fill a grade in: replace its "[--]" values, add its analysis rows as
   [parameter, typical, min, max, unit, method], and set DRAFT: false. Once
   every grade is done, switch SECTIONS.productSpecs on in flags.js.

   An analysis row needs its test METHOD. A figure with no method behind
   it is not a specification, and buyers check.
   ============================================================ */

/* Controlled vocabularies. Closed lists on purpose: the filter bar, the
   product pages and the logistics packaging section all read these, so a
   free-typed value in one place cannot drift from another.
   Confirm against checklist 3.3a-3.3c. */
const PACKAGING = [
  "Bulk",
  "Big bag 1,000 kg",
  "PP bag 50 kg",
  "IBC",
  "ISO tank",
  "Drum",
];

const INCOTERMS = ["FOB", "CFR", "CIF", "DAP", "EXW"];

const SPECS = {
  /* ---------------- Fertilizers ---------------- */
  "urea-b-n46": {
    DRAFT: true,
    analysis: [
      ["Nitrogen (N)", "46", "[--]", "[--]", "%", "[ISO ----]"],
    ],
    physical: {
      form: "Prilled / Granular / Bulk / Liquid",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "potash": {
    DRAFT: true,
    analysis: [
      ["Potassium (K&#8322;O)", "60", "[--]", "[--]", "%", "[ISO ----]"],
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "ammonia": {
    DRAFT: true,
    analysis: [
      ["Nitrogen (N)", "82", "[--]", "[--]", "%", "[ISO ----]"],
    ],
    physical: {
      form: "Anhydrous / Aqueous",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "ammonium-nitrate": {
    DRAFT: true,
    analysis: [
      ["Nitrogen (N)", "34", "[--]", "[--]", "%", "[ISO ----]"],
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "npk-compound": {
    DRAFT: true,
    analysis: [
      ["Nitrogen (N)", "15", "[--]", "[--]", "%", "[ISO ----]"],
      ["Phosphorus (P&#8322;O&#8325;)", "15", "[--]", "[--]", "%", "[ISO ----]"],
      ["Potassium (K&#8322;O)", "15", "[--]", "[--]", "%", "[ISO ----]"],
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  /* ---------------- Polymers ---------------- */
  "polyethylene": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "polypropylene": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "performance-additives": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  /* ---------------- Industrial Chemicals ---------------- */
  "sulphur": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "Granular / Lump",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "urea-a-technical": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "caustic-soda": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "Solid / Liquid",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "sodium-hypochlorite": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "hydrochloric-acid": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "liquid-chlorine": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "calcium-chloride": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "Solid / Liquid",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "sodium-sulphate": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "labsa": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "sles": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "sulphuric-acid": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "formic-acid": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "acetex-plus": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "aluminium-sulphate": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "iodine": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
  "carbon-black": {
    DRAFT: true,
    analysis: [
      // [parameter, typical, min, max, unit, method] — from the supplier TDS
    ],
    physical: {
      form: "[--]",
      colour: "[--]",
      bulkDensity: "[--] kg/m&#179;",
      granulometry: "[--] mm",
    },
    packaging: [],
    trade: {
      hsCode: "[HS code]",
      loadPorts: [],
      incoterms: [],
      minLot: "[--] MT",
    },
    storage: "[Handling and storage note]",
  },
};

/* True when a grade still carries placeholder figures. The product page uses
   this to decide between rendering the tables and rendering the "request the
   specification" panel, so a grade whose real data lands is publishable on
   its own without waiting for the other twenty-three. */
const isDraft = (id) => !SPECS[id] || SPECS[id].DRAFT === true;

module.exports = { SPECS, PACKAGING, INCOTERMS, isDraft };
