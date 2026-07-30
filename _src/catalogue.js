/* ============================================================
   PRODUCT CATALOGUE — single source of truth for everything the
   site sells, plus the pages and documents around it.

   Three consumers read this file and must never disagree:
     • the three class pages, which render their own slice of it
     • products.html, which renders all of it behind one search box
     • the header search overlay, which searches a flattened index

   Adding a grade here puts it on its class page, on the products
   page and in site search at once. There is nowhere else to add it.
   ============================================================ */

const { RELEASED: DOCS } = require("./docs");

/* Anchor ids are generated, never hand-written, so a rename cannot leave a
   deep link from the products page pointing at nothing. Entities are folded
   first — '&middot;' must not become the word "middot" in a URL. */
const slug = (s) =>
  String(s)
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* Search matches on plain text, so entities and markup come out before the
   haystack is built. Without this, "Cl₂" is unfindable by typing "cl2" and
   findable by typing "8322". */
const plain = (s) =>
  String(s == null ? "" : s)
    .replace(/<[^>]*>/g, " ")
    .replace(/&middot;|&mdash;|&ndash;|&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8320;/g, "0")
    .replace(/&#8321;/g, "1")
    .replace(/&#8322;/g, "2")
    .replace(/&#8323;/g, "3")
    .replace(/&#8324;/g, "4")
    .replace(/&#8325;/g, "5")
    .replace(/&#8326;/g, "6")
    .replace(/&#8327;/g, "7")
    .replace(/&#8328;/g, "8")
    .replace(/&#8329;/g, "9")
    /* U+208A is subscript PLUS, not a tenth digit. It used to fold to "0",
       which made any formula containing it unsearchable by its real text. */
    .replace(/&#8330;/g, "+")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/* Per-grade page filename. One rule, exported, so the generator, the nav and
   every link derive the same value — a grade cannot end up with two URLs. */
const purl = (cat, id) => `${cat}-${id}.html`;

// ------------------------------------------------------------------
// Class 01 — Fertilizers
// ------------------------------------------------------------------

const FERTILIZERS = [
  {
    name: "Urea B (N46)",
    kind: "Nitrogen fertilizer",
    npk: [46, 0, 0],
    specs: [
      "N46 &middot; 46% nitrogen",
      "Prilled",
      "Granular",
      "Bulk",
      "Liquid",
    ],
    origins: ["Turkmenistan", "Uzbekistan", "Azerbaijan"],
    body: "The most widely used nitrogen fertilizer, and the backbone of our fertilizer book. A white crystalline solid, highly soluble, releasing nitrogen slowly and steadily &mdash; which lifts yield while reducing runoff. Supplied bulk, prilled, granular and liquid.",
    alias: "carbamide n46 nitrogen prill",
  },
  {
    name: "Potash",
    kind: "Crop resilience",
    npk: [0, 0, 60],
    specs: ["Potassium-rich", "MOP grade"],
    origins: ["Turkmenistan", "Uzbekistan"],
    body: "Potash governs how well a crop handles stress &mdash; drought, disease, temperature swing. It is the input that protects the yield the nitrogen created, and it holds quality through storage and transport.",
    alias: "potassium chloride mop kcl muriate",
  },
  {
    name: "Ammonia",
    kind: "Upstream nitrogen",
    npk: [82, 0, 0],
    specs: ["Anhydrous", "Aqueous"],
    origins: ["Kazakhstan", "Uzbekistan"],
    body: "The upstream input from which most nitrogen fertilizers are made, and a direct-application fertilizer in its own right. Handled to specification, with the shipping and storage discipline anhydrous ammonia demands.",
    alias: "nh3 anhydrous aqua ammonia",
  },
  {
    name: "Ammonium Nitrate",
    kind: "Quick-release nitrogen",
    npk: [34, 0, 0],
    specs: ["34-0-0", "High-yield"],
    origins: ["Kazakhstan", "Uzbekistan"],
    body: "Where urea releases slowly, ammonium nitrate is immediately available &mdash; the grade to reach for when the growing window is short or a crop needs correcting mid-season.",
    alias: "an 34-0-0 nh4no3 calcium ammonium nitrate",
  },
  {
    name: "NPK Compound",
    kind: "Balanced blend",
    npk: [15, 15, 15],
    specs: ["N &middot; P &middot; K blend", "Compound granular"],
    origins: ["Turkmenistan", "Kazakhstan", "Uzbekistan", "Azerbaijan"],
    body: "Nitrogen, phosphorus and potassium in one granule, so every application delivers a balanced ration. The general-purpose workhorse across soil types and cropping systems.",
    alias: "npk 15-15-15 compound blend phosphorus",
  },
].map((p) => {
  const id = slug(p.name);
  return { ...p, id, cat: "fertilizers", url: purl("fertilizers", id) };
});

// ------------------------------------------------------------------
// Class 02 — Polymers
// ------------------------------------------------------------------

const POLYMER_ORIGINS = [
  "Turkmenistan",
  "Uzbekistan",
  "UAE",
  "Saudi Arabia",
  "China",
];

const POLYMERS = [
  {
    name: "Polyethylene",
    kind: "Resin family",
    vis: "pe",
    specs: ["LDPE", "HDPE", "LLDPE", "UHMWPE"],
    body: "One monomer, four very different materials &mdash; the difference is how tightly the chains pack. Low-density (LDPE) stays branched and flexible, which is why it becomes film and bags. High-density (HDPE) packs straight and stiff, so it becomes pipe, containers and automotive parts. Linear low-density (LLDPE) trades stiffness for puncture resistance in stretch film, and ultra-high molecular weight (UHMWPE) runs chains so long the material outwears steel in abrasion service.",
    alias: "pe resin film bags pipe pe100 stretch film blow moulding",
  },
  {
    name: "Polypropylene",
    kind: "Resin family",
    vis: "pp",
    specs: ["Homopolymer", "Copolymer", "PPR", "PPC"],
    body: "Lighter than polyethylene and considerably stiffer, with a higher melting point &mdash; which is what makes it the default for packaging that gets hot-filled, automotive interiors, textiles and rigid consumer goods. Homopolymer for stiffness and clarity; copolymer where impact strength at low temperature matters more.",
    alias: "pp turkmenplen tpp melt flow mfi hot-fill raffia",
  },
  {
    name: "Performance additives",
    kind: "Resin modifiers",
    vis: "add",
    specs: [
      "Plasticizers",
      "UV stabilizers",
      "Flame retardants",
      "Antimicrobials",
    ],
    body: "A resin only becomes a product once it is tuned. Plasticizers for flexibility, UV stabilizers so outdoor parts do not chalk and crack, flame retardants for building and electrical compliance, antimicrobials for medical and food contact. Specified by application, supplied to grade.",
    alias: "masterbatch antioxidant slip agent compounding",
  },
].map((p, i) => ({
  ...p,
  id: slug(p.name),
  url: purl("polymers", slug(p.name)),
  cat: "polymers",
  origins: POLYMER_ORIGINS,
  ix: `${String(i + 1).padStart(2, "0")} &mdash; ${p.name}`,
}));

// ------------------------------------------------------------------
// Class 03 — Industrial chemicals
// ------------------------------------------------------------------

const SECTORS = [
  ["all", "All grades"],
  ["water", "Water treatment"],
  ["mfg", "Manufacturing"],
  ["care", "Detergents &amp; care"],
  ["agri", "Agriculture &amp; energy"],
];

const CHEMICALS = [
  {
    name: "Sulphur",
    f: "S",
    specs: ["Granular", "Lump"],
    t: ["mfg", "agri"],
    origins: ["Turkmenistan", "Uzbekistan", "Kazakhstan"],
    body: "High-quality granular and lump sulphur &mdash; the upstream input for sulphuric acid, and from there for phosphate fertilizer and a long list of industrial processes.",
    alias: "sulfur brimstone",
  },
  {
    name: "Urea-A (technical)",
    f: "CH&#8324;N&#8322;O",
    specs: ["Technical Grade A"],
    t: ["mfg"],
    origins: ["Uzbekistan"],
    body: "High-purity urea for industrial rather than agricultural use: resin and adhesive production, and as the reducing agent in selective catalytic reduction (SCR) systems on diesel exhaust.",
    alias: "adblue def scr technical urea",
  },
  {
    name: "Caustic Soda",
    f: "NaOH",
    specs: ["Solid", "Liquid"],
    t: ["mfg", "water"],
    origins: [],
    body: "Sodium hydroxide, the most broadly used industrial alkali &mdash; pulp and paper, textiles, alumina, soap, and pH correction in water treatment. Supplied solid and liquid.",
    alias: "sodium hydroxide lye flakes pearls",
  },
  {
    name: "Sodium Hypochlorite",
    f: "NaOCl",
    specs: ["Disinfectant grade"],
    t: ["water"],
    origins: [],
    body: "The workhorse disinfectant and bleaching agent for municipal water purification and cleaning product manufacture.",
    alias: "bleach hypo disinfectant",
  },
  {
    name: "Hydrochloric Acid",
    f: "HCl",
    specs: ["Industrial grade"],
    t: ["mfg", "water"],
    origins: [],
    body: "Steel pickling, chemical synthesis and pH control. Supplied at industrial concentration with the handling documentation the grade requires.",
    alias: "muriatic acid pickling",
  },
  {
    name: "Liquid Chlorine",
    f: "Cl&#8322;",
    specs: ["Bulk supply"],
    t: ["water"],
    origins: [],
    body: "Bulk chlorine for water treatment, disinfection and chemical manufacture, shipped under pressure to specification.",
    alias: "cl2 chlorine gas",
  },
  {
    name: "Calcium Chloride",
    f: "CaCl&#8322;",
    specs: ["Solid", "Liquid"],
    t: ["mfg"],
    origins: [],
    body: "De-icing, dust suppression on unsealed roads, concrete acceleration and industrial drying. Hygroscopic enough to pull moisture out of almost anything.",
    alias: "cacl2 de-icing desiccant",
  },
  {
    name: "Sodium Sulphate",
    f: "Na&#8322;SO&#8324;",
    specs: ["Detergent grade"],
    t: ["care", "mfg"],
    origins: [],
    body: "The bulk filler and processing aid in powder detergents, and a flux in glass manufacture and pulping.",
    alias: "sodium sulfate glauber salt",
  },
  {
    name: "LABSA",
    f: "C&#8321;&#8328;H&#8323;&#8320;O&#8323;S",
    specs: ["96% purity"],
    t: ["care"],
    origins: [],
    body: "Linear alkyl benzene sulphonic acid at 96% &mdash; the primary anionic surfactant behind most detergent and cleaning formulations sold in the region.",
    alias: "linear alkyl benzene sulphonic acid surfactant 96%",
  },
  {
    name: "SLES",
    f: "C&#8321;&#8322;H&#8322;&#8325;NaO&#8324;S",
    specs: ["70% concentration"],
    t: ["care"],
    origins: [],
    body: "Sodium lauryl ether sulphate at 70% &mdash; the foaming surfactant in shampoo, body wash and liquid detergent.",
    alias: "sodium lauryl ether sulphate sles 70 surfactant shampoo",
  },
  {
    name: "Sulphuric Acid",
    f: "H&#8322;SO&#8324;",
    specs: ["Industrial"],
    t: ["mfg", "agri"],
    origins: [],
    body: "The single most produced industrial chemical on earth. Phosphate fertilizer production, oil refining, metal processing and wastewater neutralisation.",
    alias: "sulfuric acid h2so4 oleum",
  },
  {
    name: "Formic Acid",
    f: "CH&#8322;O&#8322;",
    specs: ["Preservative grade"],
    t: ["agri", "mfg"],
    origins: [],
    body: "Silage preservation in agriculture, plus leather tanning and textile dyeing where a strong, volatile acid is needed that leaves no residue.",
    alias: "methanoic acid silage tanning",
  },
  {
    name: "Acetex Plus",
    f: "&mdash;",
    specs: ["Multi-purpose"],
    t: ["mfg"],
    origins: [],
    body: "A versatile process chemical for coatings, adhesives and general chemical manufacture.",
    alias: "coatings adhesives process chemical",
  },
  {
    name: "Aluminium Sulphate",
    f: "Al&#8322;(SO&#8324;)&#8323;",
    specs: ["Water treatment"],
    t: ["water", "mfg"],
    origins: [],
    body: "The standard coagulant in drinking water and effluent treatment &mdash; it pulls suspended solids together so they settle. Also used in paper sizing and dyeing.",
    alias: "alum aluminum sulfate coagulant flocculant",
  },
  {
    name: "Iodine",
    f: "I&#8322;",
    specs: ["Pharma grade"],
    t: ["mfg"],
    origins: ["Turkmenistan"],
    body: "Pharmaceutical synthesis, X-ray contrast media, disinfectants and LCD polarising film. A genuinely scarce element, and one of the few we source single-origin.",
    alias: "i2 pharma contrast media",
  },
  {
    name: "Carbon Black",
    f: "C",
    specs: ["Rubber grade"],
    t: ["mfg"],
    origins: ["Turkmenistan"],
    body: "The reinforcing filler that makes a tyre last. Also pigment and UV protection in plastics, coatings and inks.",
    alias: "n330 n660 furnace black tyre filler pigment",
  },
].map((c) => ({
  ...c,
  id: slug(c.name),
  url: purl("industrials", slug(c.name)),
  cat: "industrials",
  /* A chemical's kind label is its sector tags, not an authored string. An
     unknown tag used to throw a bare TypeError at require() time with no
     grade name in the trace — name the offender instead. */
  kind: c.t
    .map((k) => {
      const s = SECTORS.find((row) => row[0] === k);
      if (!s)
        throw new Error(
          `catalogue: "${c.name}" has sector tag "${k}", which is not in SECTORS`,
        );
      return plain(s[1]);
    })
    .join(" &middot; "),
}));

// ------------------------------------------------------------------
// Classes, pages, documents
// ------------------------------------------------------------------

const CLASSES = [
  {
    key: "fertilizers",
    no: "01",
    title: "Fertilizers",
    href: "fertilizers.html",
    tone: "sand",
    items: FERTILIZERS,
    count: `${FERTILIZERS.length} grades`,
    blurb:
      "Urea B (N46), potash, ammonia, ammonium nitrate and NPK &mdash; the nitrogen and compound grades that set yield.",
  },
  {
    key: "polymers",
    no: "02",
    title: "Polymers",
    href: "polymers.html",
    tone: "cyan",
    items: POLYMERS,
    count: `${POLYMERS.length} families`,
    blurb:
      "Polyethylene across LDPE, HDPE, LLDPE and UHMWPE, polypropylene homo- and copolymer, plus performance additives.",
  },
  {
    key: "industrials",
    no: "03",
    title: "Industrial Chemicals",
    href: "industrials.html",
    tone: "cyan",
    items: CHEMICALS,
    count: `${CHEMICALS.length} grades`,
    blurb:
      "Sulphur, caustic soda, sulphuric and hydrochloric acid, LABSA 96%, SLES 70%, carbon black, iodine and more.",
  },
];

/* Everything on the site that is worth landing on from a search box.
   Section anchors are listed alongside whole pages, because "letter of
   credit" should go to the procedure step, not the top of the page. */
const PAGES = [
  [
    "index.html",
    "Home",
    "Caspian and Central Asian commodity trading out of Dubai, across fertilizers, polymers and industrial chemicals.",
    "globalex trading FZCO home landing",
  ],
  [
    "products.html",
    "Products",
    "Every grade we trade, searchable in one place across all three commodity classes.",
    "catalogue catalog grades search all products",
  ],
  [
    "about.html",
    "About",
    "Established 2019 on honesty, integrity and trust. A FZCO freezone trading house in Jumeirah Lakes Towers, Dubai.",
    "company history mission vision values leadership team FZCO freezone licence",
  ],
  [
    "procedures.html",
    "Trade Procedures",
    "The ten contractual checkpoints between handshake and hull.",
    "ncnd imfpa loi fco letter of credit lc proof of product pop performance bond sgs inspection incoterms cif fob shipment",
  ],
  [
    "sustainability.html",
    "Sustainability",
    "Six commitments applied to product, partner and process decisions.",
    "esg environment ethical sourcing transparency social impact",
  ],
  [
    "careers.html",
    "Careers",
    "Open roles in Dubai, and how to apply.",
    "jobs vacancies hiring apply cv digital marketing manager chemical engineer",
  ],
  [
    "contact.html",
    "Contact",
    "The Dubai desk — address, phone, and the enquiry form. Replies within two business days.",
    "enquiry quote rfq phone email address jlt cluster x map get in touch",
  ],
  [
    "index.html#specifications",
    "Specifications & MSDS",
    "The controlled document register — safety, technical and origin sheets, delivered by secure link.",
    "msds tds sds spec sheet datasheet safety data download documents",
  ],
  [
    "logistics.html",
    "Logistics & Shipping",
    "Incoterms, load ports, shipping modes, packaging options and the documentation set behind every Globalex shipment.",
    "incoterms fob cfr cif dap exw bill of lading certificate of origin packing list iso tank big bag break bulk containerised",
  ],
  [
    "compliance.html",
    "Compliance & Certifications",
    "Freezone licensing, Dubai Customs registration, counterparty due diligence, sanctions screening and third-party inspection.",
    "kyc ubo sanctions ofac eu un screening sgs intertek bureau veritas certificate of analysis anti-bribery trade controls",
  ],
  [
    "news.html",
    "News",
    "Market notes and corridor updates from the Globalex trading desk.",
    "market note corridor company product announcement",
  ],
  [
    "privacy-policy.html",
    "Privacy Policy",
    "How we collect, use and safeguard personal information.",
    "gdpr data protection cookies tracking",
  ],
  [
    "terms-conditions.html",
    "Terms & Conditions",
    "The terms governing use of this website and our services.",
    "legal terms conditions liability",
  ],
];

// ------------------------------------------------------------------
// Flattened search index — what ships to the browser
// ------------------------------------------------------------------

/* Deliberately short keys. This array is inlined into every page, so each
   character is paid for on every request:
     t title · k kind label · u url · d one-line description
     c category · h lowercase haystack the matcher actually scans

   `h` is lowercased here rather than in the browser: the query is lowercased
   once per keystroke, and the corpus never has to be. */
function searchIndex() {
  const rows = [];
  const add = (r) => rows.push({ ...r, h: r.h.toLowerCase() });

  CLASSES.forEach((cls) => {
    add({
      t: cls.title,
      k: "Commodity class",
      u: cls.href,
      c: cls.key,
      d: plain(cls.blurb),
      h: plain(
        `${cls.title} ${cls.blurb} ${cls.count} commodity class products`,
      ),
    });
    cls.items.forEach((p) => {
      const words = [
        p.name,
        p.kind,
        p.body,
        p.alias || "",
        p.f || "",
        (p.specs || []).join(" "),
        (p.origins || []).join(" "),
      ].join(" ");
      add({
        t: plain(p.name),
        k: plain(cls.title),
        u: p.url,
        c: cls.key,
        d:
          plain(p.body)
            .slice(0, 150)
            .replace(/\s+\S*$/, "") + "…",
        h: plain(words),
      });
    });
  });

  DOCS.forEach((d) => {
    add({
      t: `${d.title} (${d.kind})`,
      k: "Document",
      u: "index.html#specifications",
      c: "documents",
      d:
        plain(d.summary)
          .slice(0, 150)
          .replace(/\s+\S*$/, "") + "…",
      h: plain(
        `${d.title} ${d.kind} ${d.code} ${d.sub} ${d.origin} ${d.summary} ${(d.specs || []).map((s) => s.join(" ")).join(" ")} document sheet pdf`,
      ),
    });
  });

  PAGES.forEach(([u, t, d, extra]) => {
    add({
      t,
      k: "Page",
      u,
      c: "company",
      d: plain(d),
      h: plain(`${t} ${d} ${extra}`),
    });
  });

  return rows;
}

module.exports = {
  slug,
  plain,
  purl,
  SECTORS,
  FERTILIZERS,
  POLYMERS,
  CHEMICALS,
  POLYMER_ORIGINS,
  CLASSES,
  PAGES,
  searchIndex,
};
