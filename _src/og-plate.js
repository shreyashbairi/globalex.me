/* ============================================================
   OPEN GRAPH PLATE — 1200x630 social share card

   Emitted as assets/og-default.svg by build.js, then rasterised once to
   assets/og-default.png by `npm run og`. The PNG is what ships.

   Why a committed raster rather than the data-URI SVG the favicon uses:
   Facebook, X and LinkedIn crawlers fetch og:image as a URL and want a
   raster. None of them will follow a data: URI, and most reject SVG
   outright. The faviconPlate pattern is right for rel="icon" and wrong
   here.

   Why the mark is drawn rather than composited: assets/logo.webp is 70x60
   pixels. Scaling it to fill a 1200x630 card would be visibly soft, so the
   gul/rosette motif is redrawn as vector geometry at the size it is used —
   the same diamond language as the loader and .hud-legend. Supplying a
   square logo at 512px or above would let this use the real mark instead.
   ============================================================ */

const W = 1200;
const H = 630;

/* Palette, restated rather than imported: kernel-css.js is one CSS string,
   and an SVG cannot read a custom property. If the tokens change, these
   change with them. */
const VOID = "#0F2A38";
const DEEP = "#143544";
const CYAN = "#35D6F5";
const SAND = "#D9B778";
const FROST = "#E9F3F6";
const HAZE = "#B4C9D2";
const LINE = "#5C7F8C";

const TAGLINE = "The Caspian corridor, operated from Dubai.";

/* One rosette: four-point diamond in a ring of four smaller ones, which is
   the motif the loader draws and the ornament canvas tiles. */
const rosette = (cx, cy, r, stroke, width, opacity) => {
  const d = (x, y, s) =>
    `M${x} ${y - s} L${x + s} ${y} L${x} ${y + s} L${x - s} ${y} Z`;
  return (
    `<g fill="none" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}">` +
    `<path d="${d(cx, cy, r)}"/>` +
    `<path d="${d(cx, cy, r * 0.52)}"/>` +
    `<path d="${d(cx, cy - r, r * 0.3)}"/>` +
    `<path d="${d(cx, cy + r, r * 0.3)}"/>` +
    `<path d="${d(cx - r, cy, r * 0.3)}"/>` +
    `<path d="${d(cx + r, cy, r * 0.3)}"/>` +
    `</g>`
  );
};

function svg() {
  const notch = 34;
  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
  );

  parts.push(
    `<defs>` +
      `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${DEEP}"/>` +
      `<stop offset=".55" stop-color="${VOID}"/>` +
      `<stop offset="1" stop-color="#0B2029"/>` +
      `</linearGradient>` +
      /* the corridor sweep: cyan inbound, sand outbound, same law as the site */
      `<linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">` +
      `<stop offset="0" stop-color="${CYAN}" stop-opacity="0"/>` +
      `<stop offset=".42" stop-color="${CYAN}" stop-opacity=".85"/>` +
      `<stop offset=".62" stop-color="${SAND}" stop-opacity=".85"/>` +
      `<stop offset="1" stop-color="${SAND}" stop-opacity="0"/>` +
      `</linearGradient>` +
      `</defs>`,
  );

  parts.push(`<rect width="${W}" height="${H}" fill="url(#g)"/>`);

  // ornament field, low contrast, clipped to the right two-fifths
  parts.push(`<g clip-path="url(#rightpane)">`);
  parts.push(
    `<clipPath id="rightpane"><rect x="${W * 0.56}" y="0" width="${W * 0.44}" height="${H}"/></clipPath>`,
  );
  for (let row = -1; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = W * 0.6 + col * 132 + (row % 2 ? 66 : 0);
      const cy = 60 + row * 132;
      parts.push(rosette(cx, cy, 46, CYAN, 2, 0.13));
    }
  }
  parts.push(`</g>`);

  /* the corridor arc — origin to destination. Both ends are inset from the
     canvas edge: a platform that crops the card even slightly would clip an
     endpoint marker sitting on the boundary. */
  const ax0 = W * 0.585,
    ay0 = H * 0.34,
    ax1 = W * 0.935,
    ay1 = H * 0.5;
  parts.push(
    `<path d="M${ax0} ${ay0} Q ${W * 0.79} ${H * 0.13} ${ax1} ${ay1}" ` +
      `fill="none" stroke="url(#arc)" stroke-width="2.5"/>`,
  );
  [
    [ax0, ay0, CYAN],
    [ax1, ay1, SAND],
  ].forEach(([x, y, c]) => {
    parts.push(
      `<path d="M${x} ${y - 7} L${x + 7} ${y} L${x} ${y + 7} L${x - 7} ${y} Z" fill="${c}"/>`,
    );
  });

  // brand mark, drawn at size
  parts.push(rosette(112, 118, 40, CYAN, 3.4, 0.95));

  // wordmark. Archivo is a webfont and will not be installed on the machine
  // doing the rasterising, so a stack is given and the fallback is a
  // neutral grotesque rather than a serif.
  const disp =
    "Archivo, 'Archivo Expanded', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const mono = "'IBM Plex Mono', 'SF Mono', Menlo, monospace";

  parts.push(
    `<text x="176" y="106" font-family="${disp}" font-size="42" font-weight="800" ` +
      `letter-spacing="6" fill="${FROST}">GLOBALEX</text>`,
  );
  parts.push(
    `<text x="178" y="138" font-family="${mono}" font-size="17" ` +
      `letter-spacing="7.5" fill="${CYAN}">TRADING FZCO</text>`,
  );

  // rule
  parts.push(
    `<rect x="112" y="196" width="150" height="1" fill="${LINE}" opacity=".85"/>`,
  );

  // tagline, the line that ships on every share card
  parts.push(
    `<text x="112" y="300" font-family="${disp}" font-size="58" font-weight="700" ` +
      `fill="${FROST}">The Caspian corridor,</text>`,
  );
  parts.push(
    `<text x="112" y="368" font-family="${disp}" font-size="58" font-weight="700" ` +
      `fill="${FROST}">operated from Dubai.</text>`,
  );

  // standfirst
  parts.push(
    `<text x="112" y="438" font-family="${disp}" font-size="24" fill="${HAZE}">` +
      `Fertilizers &#183; Polymers &#183; Industrial chemicals</text>`,
  );

  // footer strip
  parts.push(
    `<text x="112" y="536" font-family="${mono}" font-size="18" letter-spacing="3.4" ` +
      `fill="${SAND}">TURKMENISTAN &#183; UZBEKISTAN &#183; KAZAKHSTAN &#183; AZERBAIJAN</text>`,
  );
  parts.push(
    `<text x="112" y="566" font-family="${mono}" font-size="16" letter-spacing="3" ` +
      `fill="${HAZE}" opacity=".8">GLOBALEX.ME</text>`,
  );

  // the signature notch, as a frame rather than a clip so it reads on any
  // background a platform composites the card onto
  parts.push(
    `<path d="M0 0 H${W - notch} L${W} ${notch} V${H} H${notch} L0 ${H - notch} Z" ` +
      `fill="none" stroke="${LINE}" stroke-width="2" opacity=".5"/>`,
  );

  parts.push(`</svg>`);
  return parts.join("\n");
}

module.exports = { svg, W, H, TAGLINE };
