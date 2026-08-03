/* ============================================================
   PRODUCT IMAGE PROMPTS — writes _src/product-images-prompts.md

       npm run prompts

   NOT part of `npm run build`. This emits the twenty-four ready-to-paste
   image prompts described by product-images.md, which is the reasoning
   behind them; this file is the machinery that expands them.

   Generated rather than hand-written for the same reason the rest of the
   repo is: the whole point of the brief is that twenty-four frames share one
   camera, one light and one ground. Twenty-four hand-copied blocks drift on
   the first edit, and a drifted block is invisible until the set is seen
   together — which is the exact failure mode the brief warns about. Edit the
   master here and all twenty-four move.

   The product list is read from catalogue.js, so a grade added there fails
   this script loudly rather than quietly shipping without an image prompt.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const { CLASSES } = require("./catalogue");
const theme = require("./theme");

/* The ground is the site's own page background, read from the theme rather
   than typed in. Recolour the site and the next run of this script asks the
   generator for a matching ground. */
const GROUND = theme.THEME.pageBackground;

/* ------------------------------------------------------------------
   The three exclusion tails.

   A generator with no negative-prompt field (GPT-image, Imagen, Flux) only
   gets prose, so the exclusions have to live inside the positive prompt.
   They are not identical across the set: telling a liquid frame "no
   glassware" fights the dish it needs, and telling a sealed frame "no
   glassware" fights the ampoule. One tail per physical form.

   The `sealed` tail exists because of a specific failure. Ammonia and
   chlorine were first specified as a valve and gauge — "no loose material is
   shown, instead a cylinder valve" — on the reasoning that a liquefied gas
   cannot be poured onto paper. The generator complied exactly, and returned
   two photographs of plumbing. They were competent images of the wrong
   subject: a product page for chlorine that shows a brass valve has not shown
   chlorine. Both grades are now photographed as what they actually are, in
   the one vessel that can hold them, and the tail below bans the hardware by
   name so it cannot come back.
   ------------------------------------------------------------------ */
const EXCLUDE = {
  solid:
    "EXCLUDE — No packaging, sacks, bags, drums, labels, text, lettering, " +
    "logos or branding. No hands, people, gloves, scoops or tools. No " +
    "beakers, flasks, test tubes or laboratory glassware. No wooden, slate, " +
    "marble or fabric surface. No dark or gradient background, no vignette, " +
    "no lens flare, no HDR, no oversaturation, no 3D render or illustration.",

  liquid:
    "EXCLUDE — No packaging, bottles, drums, labels, text, lettering, logos " +
    "or branding. No hands, people, gloves, pipettes or tools. No beakers, " +
    "flasks, test tubes or graduated cylinders — the shallow dish described " +
    "above is the only vessel in frame. No wooden, slate, marble or fabric " +
    "surface. No dark or gradient background, no vignette, no lens flare, no " +
    "HDR, no oversaturation, no 3D render or illustration.",

  sealed:
    "EXCLUDE — No packaging, labels, text, lettering, logos, branding or " +
    "hazard placards. No hands, people or gloves. No valves, handwheels, " +
    "pressure gauges, regulators, cylinders, tanks, fittings or pipework of " +
    "any kind — the sealed glass tube described above is the only object in " +
    "frame, and the substance inside it is the subject. No metal hardware. " +
    "No wooden, slate, marble or fabric surface. No dark or gradient " +
    "background, no vignette, no lens flare, no HDR, no oversaturation, no " +
    "3D render or illustration.",
};

/* Greedy wrap. Every paragraph goes through this rather than being hand-
   wrapped, so the material sentences — which vary in length by a factor of
   three — sit in the same measure as the fixed paragraphs. Pasting ignores
   line breaks, but a block that is ragged in the editor looks unfinished,
   and these are meant to be read before they are used. */
const WIDTH = 76;
function wrap(s) {
  const out = [];
  let line = "";
  for (const word of s.split(/\s+/)) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= WIDTH) line += " " + word;
    else {
      out.push(line);
      line = word;
    }
  }
  if (line) out.push(line);
  return out.join("\n");
}

/* ------------------------------------------------------------------
   The master prompt. Everything except the opening sentence, the optional
   TONE clause and the exclusion tail is identical across all twenty-four.
   ------------------------------------------------------------------ */
function prompt(name, material, form, extra) {
  return [
    `Editorial macro specimen photograph of ${name}, a bulk-traded ` +
      `industrial commodity. ${material}`,

    `CAMERA — Shot from directly overhead, true flat lay, subject centred. ` +
      `Medium-format digital, 100mm macro, f/8. The material is sharp front ` +
      `to back with only a slight softness at the extreme edge of frame.`,

    `GROUND — A single seamless sheet of off-white paper, colour exactly ` +
      `${GROUND}: a very light neutral off-white carrying only the faintest ` +
      `warmth. Not cream, not beige, not tan, not ivory, not grey, and not ` +
      `pure white. It must read as the same sheet of paper in every frame of ` +
      `this series. Filling the frame edge to edge, very slight paper tooth ` +
      `visible. No table edge, no horizon, no second surface, no backdrop seam.`,

    `LIGHT — One large soft north-facing window from the upper left. A ` +
      `single gentle diffuse shadow falls to the lower right, short and ` +
      `soft-edged. No hard specular hotspots, no rim light, no second ` +
      `source, no visible reflector.`,

    `COMPOSITION — The material occupies the central 55% of the frame. ` +
      `Generous empty ground on all four sides; nothing crosses the outer ` +
      `15% of the frame. Nothing else in shot.`,

    `COLOUR — Restrained and near-neutral. The ground stays warm off-white ` +
      `and slightly desaturated. The only saturated colour anywhere in the ` +
      `frame is the material's own; it is not boosted. Fine natural film ` +
      `grain. Flat, even exposure holding detail in both the ground and the ` +
      `darkest part of the material.`,

    `MOOD — Quiet, factual, expensive. A specimen recorded for a technical ` +
      `document, not an advertisement.`,

    extra || null,
    EXCLUDE[form],
    `Aspect ratio 16:10, 2048 x 1280.`,
  ]
    .filter(Boolean)
    .map(wrap)
    .join("\n\n");
}

/* ------------------------------------------------------------------
   Per-grade material descriptions. Keyed by the catalogue's own display
   name, so a rename over there breaks the lookup here instead of silently
   pairing the wrong picture with the wrong grade.

   form:  solid | liquid | sealed  — picks the exclusion tail
   extra: an optional extra clause, used only where the master prompt is
          not enough on its own (see the tonal-collapse note in
          product-images.md section 5)
   ------------------------------------------------------------------ */
const MATERIAL = {
  // ---- Fertilizers ----
  "Urea B (N46)": {
    form: "solid",
    material:
      "A low, loose heap of uniform white spherical prills, 2-4 mm across, " +
      "matte and very slightly translucent, with a scatter of individual " +
      "prills that have rolled clear of the pile.",
  },
  Potash: {
    form: "solid",
    material:
      "A low heap of coarse faceted crystalline granules in muted brick-red " +
      "and pale pink, 2-4 mm, irregular and dry, with a few loose grains " +
      "scattered clear of the pile.",
    extra:
      "TONE — Push the separation between material and ground harder than " +
      "usual: a slightly deeper shadow under the heap and clear tonal " +
      "contrast at every granule edge. This grade is close to the ground in " +
      "brightness and must still read when the image is converted to " +
      "black and white.",
  },
  Ammonia: {
    form: "sealed",
    material:
      "A short, thick-walled sealed borosilicate glass specimen tube lying " +
      "flat and centred, holding anhydrous ammonia as a clear, colourless, " +
      "mobile liquid filling about two thirds of it, with a crisp bright " +
      "meniscus and a small vapour headspace above. The outside of the glass " +
      "carries a fine even bloom of white frost and beaded condensation from " +
      "the cold contents, heaviest at the ends and thinning across the " +
      "middle, where the liquid inside reads sharp and clear through it.",
  },
  "Ammonium Nitrate": {
    form: "solid",
    material:
      "A low heap of opaque off-white to pale-cream porous prills, 2-4 mm, " +
      "duller and slightly more angular than urea, with a scatter of loose " +
      "prills.",
  },
  "NPK Compound": {
    form: "solid",
    material:
      "A low heap of compound granules, 3-5 mm, mixing muted grey-brown, " +
      "brick-red and off-white within the same pile, irregular and matte.",
    extra:
      "TONE — Push the separation between material and ground harder than " +
      "usual: a slightly deeper shadow under the heap and clear tonal " +
      "contrast at every granule edge. This grade is close to the ground in " +
      "brightness and must still read when the image is converted to " +
      "black and white.",
  },

  // ---- Polymers ----
  Polyethylene: {
    form: "solid",
    material:
      "A low, loose spread of translucent milky-white cylindrical resin " +
      "pellets, 3-4 mm, glossy and faintly waxy, catching soft highlights, " +
      "several pellets rolled clear of the group.",
  },
  Polypropylene: {
    form: "solid",
    material:
      "A low, loose spread of translucent, near-colourless glassy resin " +
      "pellets, 3-4 mm, harder and clearer than polyethylene, with crisp " +
      "highlights and faint refracted shadow on the ground beneath each " +
      "pellet.",
  },
  "Performance additives": {
    form: "solid",
    material:
      "Three small separated shallow mounds of fine powder and micro-pellet " +
      "additive laid out in a loose row on the same ground - one chalk " +
      "white, one pale ivory, one soft mid-grey.",
  },

  // ---- Industrial chemicals ----
  Sulphur: {
    form: "solid",
    material:
      "A low heap of bright canary-yellow granules, 2-5 mm, matte with a " +
      "faint dusty bloom, with two or three larger irregular lumps of the " +
      "same yellow resting beside it.",
  },
  "Urea-A (technical)": {
    form: "solid",
    material:
      "A low heap of high-purity white prills, 2-4 mm, cleaner and brighter " +
      "than the agricultural grade, with a fine dusting of white powder " +
      "settled around the base.",
  },
  "Caustic Soda": {
    form: "solid",
    material:
      "A shallow scatter of hard white opaque flakes and pearls, 3-8 mm, " +
      "dry, with a slight glassiness at the broken edges.",
  },
  "Sodium Hypochlorite": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of pale " +
      "greenish-yellow liquid, its rim barely visible, a soft even sheen " +
      "across the still surface.",
  },
  "Hydrochloric Acid": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of colourless " +
      "transparent liquid with the faintest straw tint; the paper ground " +
      "reads clearly through it, with a clean bright meniscus at the rim.",
  },
  "Liquid Chlorine": {
    form: "sealed",
    material:
      "A short, thick-walled sealed borosilicate glass specimen ampoule " +
      "lying flat and centred, about two thirds full of clear amber-yellow " +
      "liquid chlorine with a crisp bright meniscus, and a distinctly " +
      "greenish-yellow vapour headspace above the liquid. The glass is clean " +
      "and dry, its thick walls refracting the ground behind it and casting " +
      "a faint caustic of the same yellow-green onto the paper.",
  },
  "Calcium Chloride": {
    form: "solid",
    material:
      "A low heap of white deliquescent pellets and flakes, 3-6 mm, chalky " +
      "and matte, with a faint damp gloss on a few surfaces.",
  },
  "Sodium Sulphate": {
    form: "solid",
    material:
      "A low heap of fine bright-white crystalline powder with visible fine " +
      "crystal glitter, drawn up into a soft peak, with a light dusting on " +
      "the surrounding ground.",
  },
  LABSA: {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thick, viscous amber-brown " +
      "liquid, slow-moving, with a heavy glossy surface and a thick rolling " +
      "edge where it meets the dish.",
  },
  SLES: {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thick, pearly, translucent " +
      "near-colourless viscous paste with a soft internal sheen and a slowly " +
      "settling surface.",
  },
  "Sulphuric Acid": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of dense, oily, " +
      "colourless-to-pale-amber liquid, visibly thicker than water, with a " +
      "heavy still surface.",
  },
  "Formic Acid": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of completely " +
      "colourless, water-thin transparent liquid with a crisp bright " +
      "meniscus.",
  },
  "Acetex Plus": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of clear, " +
      "faintly straw-coloured liquid with a light even surface sheen.",
  },
  "Aluminium Sulphate": {
    form: "solid",
    material:
      "A low heap of off-white to pale-grey crystalline granules and small " +
      "irregular slabs, 3-8 mm, dry and chalky.",
  },
  Iodine: {
    form: "solid",
    material:
      "A small, tight heap of dark violet-black crystalline flakes with a " +
      "distinct metallic purple-blue lustre catching the light, a few flakes " +
      "separated from the pile, and the faintest violet haze immediately " +
      "above it.",
  },
  "Carbon Black": {
    form: "solid",
    material:
      "A low heap of the deepest matte black fine powder and small beaded " +
      "pellets, absorbing almost all light that falls on it, its edge " +
      "softened by an extremely fine black dust halo on the surrounding " +
      "ground.",
  },

  // ---- Petroleum products ----
  /* Seven of the eight are transparent liquids that differ from each other
     only in tint and viscosity, which is the hardest set on this whole page
     to keep distinguishable. So each one names its colour against the one
     above it and states how it moves: a thin water-white cut and a heavy
     amber one have to look like different products at thumbnail size, and
     tint alone will not carry that once the frame is cropped to a 76px
     circle. Bitumen is the exception and is shot as a solid. */
  Gasoline: {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of very pale " +
      "straw-yellow liquid, thin and mobile, the paper ground reading " +
      "clearly through it, with a bright crisp meniscus at the rim and a " +
      "faint iridescent sheen where the surface catches the light.",
  },
  "Jet Fuel": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of water-white " +
      "to faintly straw liquid, the palest of the fuel cuts, almost " +
      "colourless and very clean, the ground reading through it almost " +
      "unchanged, with a clean bright meniscus and a perfectly still, " +
      "unbroken surface.",
    extra:
      "TONE — This cut is nearly colourless, so the dish itself has to do " +
      "the work: hold the glass rim, the meniscus and the shallow shadow the " +
      "dish casts on the paper crisply, so the frame still reads as a " +
      "liquid specimen and not as an empty dish.",
  },
  "Lighting Kerosene": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of clear pale " +
      "straw liquid, a shade deeper and slightly more viscous than jet fuel, " +
      "the ground reading through it with a warm cast, a soft even sheen " +
      "across the still surface.",
  },
  "Heating Kerosene": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of clear light " +
      "amber liquid, a step warmer and deeper than the lighting grade, the " +
      "ground still visible through it, with a soft even sheen and a clean " +
      "meniscus at the rim.",
  },
  Diesel: {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of clear amber " +
      "liquid with a faint green cast at the meniscus, noticeably more " +
      "viscous than the kerosene cuts so the surface settles slowly, the " +
      "ground reading through it warmly.",
  },
  "Base Oil": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of clear golden " +
      "amber oil, visibly thick and slow-moving, its surface glossy and " +
      "smooth with a deep even sheen, the meniscus climbing the rim higher " +
      "than the fuel cuts do.",
  },
  "Fuel Oil": {
    form: "liquid",
    material:
      "A wide, shallow clear-glass dish holding a thin layer of opaque " +
      "brown-black heavy oil, thick and tarry, the ground not visible " +
      "through it at all, its surface dull and slightly uneven with a slow " +
      "sluggish edge where it meets the rim.",
    extra:
      "TONE — Hold detail in the black: the surface needs a visible sheen " +
      "and a readable edge against the paper rather than collapsing into a " +
      "flat silhouette.",
  },
  Bitumen: {
    form: "solid",
    material:
      "A single fractured lump of solid black bitumen about 80 mm across, " +
      "centred, with a glossy conchoidal fracture face catching the light " +
      "and duller matte faces around it, plus two or three small chips that " +
      "have broken clear of it on the ground.",
    extra:
      "TONE — Push the separation between material and ground harder than " +
      "usual, and keep the fracture face bright enough to read as glass-like " +
      "rather than as an unlit black shape.",
  },
};

/* ------------------------------------------------------------------
   Reconcile against the catalogue in both directions.
   ------------------------------------------------------------------ */
/* Read from CLASSES, so a new commodity class arrives here as a new section of
   the brief rather than needing this list edited to notice it. */
const GROUPS = CLASSES.map((c) => [c.title, c.items]);
const products = GROUPS.flatMap(([g, arr]) => arr.map((p) => ({ ...p, group: g })));

{
  const missing = products.filter((p) => !MATERIAL[p.name]).map((p) => p.name);
  if (missing.length)
    throw new Error(
      `product-images-build: catalogue.js has grades with no material ` +
        `description: ${missing.join(", ")}. Add them to MATERIAL in this file.`,
    );
  const known = new Set(products.map((p) => p.name));
  const orphan = Object.keys(MATERIAL).filter((n) => !known.has(n));
  if (orphan.length)
    throw new Error(
      `product-images-build: MATERIAL describes grades that are not in ` +
        `catalogue.js: ${orphan.join(", ")}. Remove them or fix the name.`,
    );
  for (const [name, m] of Object.entries(MATERIAL))
    if (!EXCLUDE[m.form])
      throw new Error(`product-images-build: ${name} has unknown form "${m.form}"`);
}

/* ------------------------------------------------------------------
   Emit
   ------------------------------------------------------------------ */
const F = "```"; // fence, kept out of the template literals below
const counts = Object.values(MATERIAL).reduce((a, m) => {
  a[m.form] = (a[m.form] || 0) + 1;
  return a;
}, {});

const out = [];
out.push(`<!-- GENERATED by _src/product-images-build.js — run \`npm run prompts\`.`);
out.push(`     Edit the master prompt or the material table in that file, not here. -->`);
out.push(``);
out.push(`# Product image prompts — ready to paste`);
out.push(``);
out.push(
  wrap(
    `All ${products.length} grades in \`catalogue.js\`, one block each. The ` +
      `camera, ground, light, composition, colour and mood paragraphs are ` +
      `byte-identical across every block — that is what makes them a set. Only ` +
      `the opening sentence and the exclusion tail change.`,
  ),
);
out.push(``);
out.push(
  wrap(
    `Each block is self-sufficient prose, so it works in a generator with no ` +
      `negative-prompt field (GPT-image, Imagen, Flux) as well as one that has ` +
      `one. If your tool does take a negative field, the shared list is in ` +
      `section 2 and you can delete the EXCLUDE line from the block.`,
  ),
);
out.push(``);
out.push(
  wrap(
    `Reasoning, output specs and the post-processing the stylesheet applies to ` +
      `these: \`product-images.md\`. Read its section 6 before running them — ` +
      `generate Urea B (N46) first, lock the seed, then run the other ` +
      `${products.length - 1} against it. Consistency across the set is the ` +
      `whole point, and it is invisible until they are seen together.`,
  ),
);
out.push(``);
out.push(`---`);
out.push(``);
out.push(`## 1. Contents`);
out.push(``);
out.push(`| # | Grade | Form | Save as |`);
out.push(`|---|---|---|---|`);
products.forEach((p, i) => {
  const m = MATERIAL[p.name];
  out.push(
    `| ${String(i + 1).padStart(2, "0")} | ${p.name} | ${m.form} | ` +
      `\`assets/products/${p.url.replace(/\.html$/, ".webp")}\` |`,
  );
});
out.push(``);
out.push(
  `${counts.solid} solid, ${counts.liquid} liquid, ${counts.sealed} sealed.`,
);
out.push(``);
out.push(`---`);
out.push(``);
out.push(`## 2. Shared negative prompt`);
out.push(``);
out.push(`Only for tools with a separate negative field. The EXCLUDE line already`);
out.push(`inside each block says the same thing in prose.`);
out.push(``);
out.push(`For the ${counts.solid} solid frames:`);
out.push(``);
out.push(F);
out.push(
  `packaging, sacks, bags, drums, labels, text, lettering, watermarks, logos,`,
);
out.push(
  `branding, trademarks, hands, people, gloves, scoops, spoons, tools, beakers,`,
);
out.push(
  `flasks, test tubes, graduated cylinders, tractors, fields, crops, factories,`,
);
out.push(
  `warehouses, wooden table, slate, marble, fabric, dark background, black`,
);
out.push(
  `background, gradient background, vignette, bokeh lights, lens flare, teal and`,
);
out.push(
  `orange grade, HDR, oversaturated, glossy reflective floor, mirror reflection,`,
);
out.push(`3D render, CGI, plastic-looking, illustration, drawing, collage, multiple`);
out.push(`panels, borders, frames`);
out.push(F);
out.push(``);
out.push(
  wrap(
    `For the ${counts.liquid} liquid and ${counts.sealed} sealed frames, drop ` +
      `\`beakers, flasks, test tubes, graduated cylinders\` from that list. Those ` +
      `frames need their vessel — a shallow dish or a sealed glass ampoule — and ` +
      `a negative that broad will suppress it. For the sealed frames add ` +
      `\`valve, handwheel, pressure gauge, regulator, cylinder, tank, pipework, ` +
      `metal fitting\` instead: that is the failure those two frames actually ` +
      `have, and it is worth naming twice.`,
  ),
);
out.push(``);
out.push(`---`);
out.push(``);

let n = 0;
let group = null;
for (const p of products) {
  if (p.group !== group) {
    group = p.group;
    out.push(`## ${group}`);
    out.push(``);
  }
  n++;
  const m = MATERIAL[p.name];
  out.push(`### ${String(n).padStart(2, "0")} · ${p.name}`);
  out.push(``);
  out.push(`Save as \`assets/products/${p.url.replace(/\.html$/, ".webp")}\``);
  out.push(``);
  out.push(F);
  out.push(prompt(p.name, m.material, m.form, m.extra));
  out.push(F);
  out.push(``);
}

fs.writeFileSync(
  path.join(__dirname, "product-images-prompts.md"),
  out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n",
);
console.log(
  `wrote _src/product-images-prompts.md — ${products.length} prompts ` +
    `(${counts.solid} solid, ${counts.liquid} liquid, ${counts.sealed} sealed)`,
);
