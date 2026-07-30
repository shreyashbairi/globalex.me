/* ============================================================
   THEME — every colour on the site, in one place

   Change a value here, run `npm run build`, and it changes everywhere it is
   used: the pages, the document register, the admin dashboard, the tracked
   PDF viewer, the social share card and the WebGL globe on the home page.

   Nothing else needs editing. There are no colour literals left anywhere
   else — `npm test` fails if one is reintroduced.

   ------------------------------------------------------------
   HOW TO USE THIS FILE

   Each entry below says exactly what it paints. Change the hex value, keep
   the key. So:

       pageBackground: "#1C1A17",   ->   pageBackground: "#1A1A1F",

   turns the whole site charcoal.

   Alpha is NOT set here. Every translucent surface on the site is one of
   these colours at some opacity, and those opacities live with the component
   that needs them. So changing `accentSystem` also changes every faint cyan
   wash, hover tint and glow derived from it — you do not have to hunt them
   down.

   ------------------------------------------------------------
   THE ONE RULE WORTH KEEPING

   The site uses two accents and they mean different things:

       accentSystem    (cyan) = systems, networks, documents, data
       accentMaterial  (sand) = physical material, cargo, tonnage

   A shipping document is cyan. A tonne of urea is sand. If you swap these to
   two colours that read as interchangeable, the distinction the whole design
   rests on stops carrying information.

   ------------------------------------------------------------
   CONTRAST

   The text colours below are chosen to clear WCAG AA on `pageBackground`.
   Current ratios: textHeading 13.2:1, textBody 8.9:1, textLead 10.4:1,
   textMuted 6.1:1. If you lighten the background or darken the text, run
   `npm test` — it checks these and fails if any text colour drops below
   4.5:1, so an unreadable combination cannot ship by accident.
   ============================================================ */

/* ============================================================
   PRESETS

   Each preset is a complete palette. `ACTIVE` below picks one, and that is
   the only line to change to switch the whole site over — or back.

   `polarity` tells the rest of the build whether the palette is light-on-dark
   or dark-on-light. It is not decoration: it sets the color-scheme meta tag,
   and it flips the handful of treatments that encode direction rather than
   hue (photo filters, the scanline sheen, the globe's ground).
   ============================================================ */

const PRESETS = {
  /* ------------------------------------------------------------------
     caspian — the original. Petrol-blue ground, cyan system accent, sand
     material accent. Light text on a dark page.
     ------------------------------------------------------------------ */
  caspian: {
    polarity: "dark",
    /* ============ SURFACES ============
       The backdrop, from furthest back to closest. */

    /* The background of every page, top to bottom. The single biggest lever
       here — everything else is judged against it. */
    pageBackground: "#0F2A38",
    /* Sits just in front of the background: alternating section bands, the
       footer, dropdown panels, the search overlay, the consent bar. */
    surfaceRaised: "#143544",
    /* Cards, spec panels, product tiles, office cards — anything that reads as
       a discrete object sitting on the page. */
    surfacePanel: "#173B4A",
    /* Muted mid-tone. Section rules, inactive icons, timeline nodes before they
       light, the quieter half of a gradient. */
    surfaceMuted: "#23596B",
    /* Deeper than the page background. Used where something should read as a
       hole rather than a surface: the globe's occluding core, the darkest
       corner of the share card. */
    surfaceDeepest: "#061C27",
    /* ============ TEXT ============
       Three weights of prose plus two for text sitting on an accent. */

    /* Headings, display type, table figures, the wordmark. The brightest text
       on the site. */
    textHeading: "#E9F3F6",
    /* Standfirsts and intro paragraphs — one step down from a heading, one step
       up from body copy. */
    textLead: "#C6D8DF",
    /* Body copy, card paragraphs, table labels. The workhorse. */
    textBody: "#B4C9D2",
    /* Captions, mono eyebrows, metadata, coordinates, timestamps. Quiet but
       still required to be readable. */
    textMuted: "#8FAAB6",
    /* Text and icons ON a cyan fill — the primary button, the active chip. Must
       contrast against accentSystem, not against the page. */
    textOnSystem: "#0F2A38",
    /* Text ON a sand fill — the material button, the draft banner. Must
       contrast against accentMaterial. */
    textOnMaterial: "#2A1F0C",
    /* ============ OVERLAYS ============
       The two surfaces a modal is made of. Separate from the page surfaces
       because an overlay has to read as being in front of everything, which
       means it goes darker behind and lighter in front, not the reverse. */

    /* The dimmed backdrop behind the search overlay, the document access modal
       and the dashboard dialogs. Also the colour of the large soft shadow those
       panels cast. Deeper than pageBackground on purpose. */
    overlayScrim: "#06141B",
    /* The panel of an overlay itself — the search box, the access modal. Sits
       one step lighter than surfaceRaised so it reads as lifted off the page. */
    overlayPanel: "#1B4356",
    /* Pure white, used only at very low opacity: the fine scanline texture over
       the whole page, and the ring of the custom pointer. Change this to tint
       those two highlights. */
    highlight: "#FFFFFF",
    /* ============ ACCENTS ============ */

    /* SYSTEM accent. Links, focus rings, active nav, document badges, the
       corridor arcs, every interactive affordance. Also the source of every
       faint cyan wash and hover tint on the site. */
    accentSystem: "#35D6F5",
    /* A darker system accent, for gradients and hazard stripes that need to
       stay legible against the lighter one. */
    accentSystemDark: "#0FA8C9",
    /* MATERIAL accent. Commodity figures, fertilizer pages, spec chips, the
       draft banner, tonnage and assay values. */
    accentMaterial: "#D9B778",
    /* A darker material accent, for the same reason as accentSystemDark. */
    accentMaterialDark: "#B8934E",

    /* Material accent used as TEXT rather than as a fill. On a dark ground the
       sand is already readable, so this matches accentMaterial. On a light
       ground it has to go much darker — gold on off-white is about 2:1. */
    accentMaterialText: "#D9B778",
    /* Errors and destructive actions: a failed form, a revoked document link, a
       delete control in the dashboard. Deliberately outside the two accents so
       it cannot be mistaken for either. */
    accentAlert: "#F5748A",
    /* ============ HOME-PAGE GLOBE ============
       The WebGL corridor globe uses three colours that appear nowhere else. They
       are here so recolouring the site recolours the globe with it, rather than
       leaving it on the old palette. */

    /* The sphere itself — the occluding body that arcs pass behind. On a dark
       page it is a near-black hole; on a light page it has to invert or the
       globe lands as a heavy black mass on an airy layout. */
    globeCore: "#061C27",

    /* The beaded latitude/longitude grid over the sphere. */
    globeGraticule: "#1B5468",
    /* The 4,200-point landmass dot field, unlit. */
    globeSurface: "#2A6E85",
    /* The lit rim of the atmosphere, and a corridor node under the pointer. The
       brightest thing on the home page — keep it close to accentSystem or the
       globe stops reading as part of the site. */
    globeGlow: "#9BEEFF",
    /* ============ LINES ============ */

    /* The base colour of every border, divider, table rule and hairline. It is
       always drawn translucent, so this is the tint rather than the final
       colour — which is why borders stay coherent when you change the
       background. */
    hairline: "#92BECC",
  },

  /* ------------------------------------------------------------------
     gptrade — matched to gptrade.shop, the Shopify storefront. Off-white
     ground, green system accent, gold material accent, dark text.

     Values taken from that theme's own colour-scheme variables:
       --color-background      250,250,247  ->  pageBackground
       --color-background      240,244,237  ->  the sage band
       --color-background       62,112,57   ->  accentSystem
       --color-button           58,107,53   ->  the darker button green
       --color-button          212,168,83   ->  accentMaterial
       --color-foreground       26, 26, 46  ->  text
       --color-background-contrast 15,28,14 ->  deepest green
       --color-background-contrast 174,196,158 -> sage
       (and 196,69,54, its terracotta, for alerts)
     ------------------------------------------------------------------ */
  gptrade: {
    polarity: "light",

    /* ============ SURFACES ============ */

    /* The warm off-white the storefront uses, rather than pure white — it
       stops large areas of text from glaring. */
    pageBackground: "#FAFAF7",

    /* Alternating section bands, footer, dropdown panels. The storefront's
       pale sage, which is what keeps the page from reading as plain white. */
    surfaceRaised: "#EEF2E9",

    /* Cards, spec panels, product tiles. One step deeper than the bands so a
       card still reads as an object when drawn at partial opacity. */
    surfacePanel: "#E3EBDC",

    /* Rules, inactive icons, the quieter half of a gradient. */
    surfaceMuted: "#AEC49E",

    /* Where something must read as a hole rather than a surface: the globe's
       core, the darkest corner of the share card. */
    surfaceDeepest: "#0F1C0E",

    /* ============ TEXT ============ */

    /* The storefront's foreground: a dark navy-green rather than pure black,
       which is softer against an off-white ground. */
    textHeading: "#1A1A2E",
    textLead: "#2D3A2C",
    textBody: "#3F4A3D",
    textMuted: "#6B7669",

    /* White on the green button. */
    textOnSystem: "#FFFFFF",
    /* A dark earthy brown on the gold button — black would be harsh on gold. */
    textOnMaterial: "#2D2308",

    /* ============ OVERLAYS ============ */

    /* A dark scrim stays dark on a light page: it is what puts the page
       behind the modal. */
    overlayScrim: "#0F1C0E",
    /* The modal panel itself is white, so it lifts off the off-white page. */
    overlayPanel: "#FFFFFF",
    /* On a light page the scanline sheen and the pointer ring have to be dark
       to be visible at all. This is the token that inverts. */
    highlight: "#1A1A2E",

    /* ============ ACCENTS ============ */

    /* SYSTEM accent — the storefront green. Links, focus rings, active nav,
       document badges, corridor arcs. */
    accentSystem: "#3E7039",
    /* The darker green, for gradients and hazard stripes. */
    accentSystemDark: "#2D5016",

    /* MATERIAL accent — the storefront gold. Commodity figures, spec chips,
       tonnage, assay values. */
    accentMaterial: "#D4A853",
    /* An earthy brown rather than a darker gold: it reads as material, and it
       gives the palette somewhere warm to go. */
    accentMaterialDark: "#8B6914",

    /* Material accent used as TEXT. The gold is kept for fills — buttons and
       chip backgrounds, as intended — but gold type on off-white is about
       2:1 and unreadable, so text takes this earthy brown instead: same
       family, 6.1:1 on the page and 5.6:1 on the sage panels. */
    accentMaterialText: "#7A5A16",

    /* The storefront's terracotta. Outside both accents so an error cannot be
       mistaken for either. */
    accentAlert: "#C44536",

    /* ============ HOME-PAGE GLOBE ============
       Inverted along with the page: a pale sage sphere with dark green
       markings, so it reads as an airy wireframe rather than a black hole
       punched in the layout. */
    globeCore: "#EAF0E4",
    globeGraticule: "#7E9A72",
    globeSurface: "#3E7039",
    globeGlow: "#2D5016",

    /* ============ LINES ============
       Dark on a light page — a light hairline on off-white is invisible. This
       is the other token that inverts. */
    hairline: "#3F4A3D",
  },
};

/* ============================================================
   ACTIVE PRESET — change this one word to switch the site over.
   ============================================================ */
const ACTIVE = "gptrade";

const PRESET = PRESETS[ACTIVE];
if (!PRESET)
  throw new Error(
    `theme: ACTIVE is "${ACTIVE}", which is not in PRESETS (${Object.keys(PRESETS).join(", ")})`,
  );

const POLARITY = PRESET.polarity;
const THEME = Object.fromEntries(
  Object.entries(PRESET).filter(([k]) => k !== "polarity"),
);

/* Every preset must define the same colours, or switching leaves a token
   undefined and the surface it paints renders transparent. */
{
  const base = Object.keys(PRESETS.caspian).filter((k) => k !== "polarity");
  for (const [name, p] of Object.entries(PRESETS)) {
    const missing = base.filter((k) => !(k in p));
    if (missing.length)
      throw new Error(`theme: preset "${name}" is missing ${missing.join(", ")}`);
  }
}

/* ------------------------------------------------------------------
   Derived values. Nothing below needs editing.
   ------------------------------------------------------------------ */

/* "#35D6F5" -> "53,214,245".
   Emitted alongside each colour so a component can write
   rgba(var(--accent-system-rgb), .06) and follow the theme automatically. */
const rgb = (hex) => {
  const h = String(hex).replace("#", "").trim();
  const n =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const v = parseInt(n, 16);
  if (!/^[0-9a-fA-F]{6}$/.test(n) || Number.isNaN(v))
    throw new Error(`theme: "${hex}" is not a 6-digit hex colour`);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};

/* 0x35D6F5, for three.js on the home page — it wants a number, not a string. */
const int = (hex) => parseInt(String(hex).replace("#", ""), 16);

/* camelCase key -> --kebab-case custom property. */
const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

/* Relative luminance and contrast ratio, per WCAG 2.x. Used by the test
   suite to prove the text colours are still readable on whatever background
   someone has chosen. */
const luminance = (hex) => {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const la = luminance(a),
    lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/* Values that depend on which way round the palette is, rather than on hue.
   A photo filtered to brightness(.55) sinks into a dark page and turns to mud
   on a light one; a map inverted for a dark theme must not be inverted for a
   light one. Components read these instead of assuming. */
const polarVars = () => {
  const light = POLARITY === "light";
  return [
    `  /* set from the active preset's polarity: ${POLARITY} */`,
    `  --photo-brightness:${light ? ".96" : ".72"};`,
    `  --photo-contrast:${light ? "1.04" : "1.12"};`,
    `  --hero-photo-brightness:${light ? ".9" : ".55"};`,
    /* the embedded map is a light Google tile; a dark theme inverts it, a
       light theme leaves it alone and just desaturates */
    `  --map-invert:${light ? "0" : ".92"};`,
    `  --map-hue:${light ? "0deg" : "165deg"};`,
    `  --map-brightness:${light ? "1" : ".86"};`,
    /* the scanline sheen and the pointer ring */
    `  --sheen-alpha:${light ? ".055" : ".028"};`,
    `  --ring-alpha:${light ? ".38" : ".55"};`,
    /* Hairlines. A light tint at 19% over a dark page reads as a crisp rule;
       a dark tint at 19% over off-white barely registers, so the light
       palette needs them stronger. */
    `  --line:rgba(var(--hairline-rgb),${light ? ".30" : ".19"});`,
    `  --line-2:rgba(var(--hairline-rgb),${light ? ".52" : ".34"});`,
    /* The supplied logo is white artwork on transparency, so on a light page
       it disappears entirely. brightness(0) turns it solid dark while keeping
       the alpha channel, which needs no second asset.

       Not invert(1): that flips the cyan centre of the mark to orange-red.
       Not a sepia/hue-rotate tint either — it washes the fine strokes out. A
       supplied dark-on-transparent logo would be better than any of these. */
    `  --logo-filter:${light ? "brightness(0)" : "none"};`,
    /* The procedural ornament field was tuned against a dark ground. The same
       alpha over off-white reads as loud wallpaper, so it is scaled down. */
    `  --orn-scale:${light ? "0.42" : "1"};`,
    /* Port labels sit on the globe's surface, so they follow the sphere rather
       than the page: dark type on a pale sphere, light type on a dark one. */
    `  --glabel-hub:${light ? "var(--text-heading)" : "var(--text-heading)"};`,
    `  --glabel:${light ? "var(--text-body)" : "var(--text-muted)"};`,
  ].join("\n");
};

/* The :root block. Every colour appears twice — once as a hex custom property
   and once as bare channels, so translucent variants can reference it. */
const cssVars = () => {
  const lines = Object.entries(THEME).map(([k, v]) => {
    const name = kebab(k);
    return `  --${name}:${v};\n  --${name}-rgb:${rgb(v).join(",")};`;
  });

  /* Fixed alpha steps that enough components share to be worth naming. */
  lines.push(`
  /* Accent washes: the faint tinted fill behind an active chip or a
     highlighted panel. --cyan-g / --sand-g are the names the component CSS has
     always used; the longer names are aliases for readability. */
  --system-wash:rgba(var(--accent-system-rgb),.16);
  --material-wash:rgba(var(--accent-material-rgb),.14);
  --cyan-g:var(--system-wash);
  --sand-g:var(--material-wash);`);

  lines.push(polarVars());
  return lines.join("\n");
};

/* Short aliases, so component CSS reads as design intent rather than as a
   long semantic path. --cyan is quicker to scan than --accent-system in a
   500-line stylesheet, and both resolve to the same value. */
const ALIAS = {
  void: "page-background",
  deep: "surface-raised",
  panel: "surface-panel",
  steel: "surface-muted",
  abyss: "surface-deepest",
  frost: "text-heading",
  lead: "text-lead",
  haze: "text-body",
  "haze-d": "text-muted",
  cyan: "accent-system",
  "cyan-d": "accent-system-dark",
  sand: "accent-material",
  "sand-d": "accent-material-dark",
  "sand-t": "accent-material-text",
  alert: "accent-alert",
  "on-cyan": "text-on-system",
  "on-sand": "text-on-material",
  scrim: "overlay-scrim",
  "ov-panel": "overlay-panel",
};

const cssAliases = () =>
  Object.entries(ALIAS)
    .map(([a, real]) => `  --${a}:var(--${real});\n  --${a}-rgb:var(--${real}-rgb);`)
    .join("\n");

/* The palette as plain data, for JavaScript that cannot use a CSS custom
   property — canvas fill styles, and the three.js globe. Keys are the short
   aliases so page scripts read the same names the CSS does. */
const jsPalette = () => {
  /* polarity travels with the palette: canvas and WebGL code has to know
     whether it is drawing onto a light or a dark ground, because additive
     blending glows on dark and disappears on light. */
  const out = { polarity: POLARITY, rgb: {}, int: {} };
  const put = (name, hex) => {
    out[name] = hex;
    out.rgb[name] = rgb(hex).join(",");
    out.int[name] = int(hex);
  };
  /* every colour under its own camelCase name */
  for (const [k, v] of Object.entries(THEME)) put(k, v);
  /* plus the short aliases, so page scripts read the names the CSS uses.
     Hyphenated aliases are skipped: GLXC.ovPanel has to be dot-accessible. */
  for (const [alias, real] of Object.entries(ALIAS)) {
    if (alias.includes("-")) continue;
    const key = Object.keys(THEME).find((k) => kebab(k) === real);
    if (key) put(alias, THEME[key]);
  }
  return out;
};

module.exports = {
  THEME,
  polarVars,
  PRESETS,
  PRESET,
  ACTIVE,
  POLARITY,
  jsPalette,
  rgb,
  int,
  kebab,
  contrast,
  luminance,
  cssVars,
  cssAliases,
  ALIAS,
};
