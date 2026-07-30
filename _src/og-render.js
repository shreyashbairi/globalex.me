/* Rasterise assets/og-default.svg to assets/og-default.png.  `npm run og`

   Run this when the plate in _src/og-plate.js changes; the PNG is committed
   because that is what crawlers fetch. build.js warns if the SVG is newer
   than the PNG, so a forgotten run is loud rather than silent.

   Chrome headless does the rendering, not qlmanage: it fetches the real
   Archivo and IBM Plex Mono from Google Fonts, so the wordmark rasterises in
   the site's own typeface instead of whatever the system substitutes. This
   is the only step in the repo that needs a browser, and it is a manual,
   occasional one — `npm run build` never depends on it. */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const plate = require("./og-plate");
const { THEME } = require("./theme");
const { W, H } = plate;

const ROOT = path.resolve(__dirname, "..");
const PNG = path.join(ROOT, "assets/og-default.png");

const CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

function chrome() {
  for (const c of CANDIDATES) if (fs.existsSync(c)) return c;
  return null;
}

const bin = chrome();
if (!bin) {
  console.error(
    "No Chrome/Chromium/Edge found. Produce a " +
      `${W}x${H} raster from _src/og-plate.js by hand and commit it as\n` +
      "assets/og-default.png.",
  );
  process.exit(1);
}

/* The plate is built in memory and inlined into a page sized exactly to it,
   with the webfonts linked, so the screenshot is the plate and nothing else —
   no scrollbars, no margin, no letterboxing. Nothing intermediate is written
   to assets/, because only the raster should ship. */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900" +
  "&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

const wrapper = path.join(
  fs.mkdtempSync(path.join(require("os").tmpdir(), "glx-og-")),
  "plate.html",
);
fs.writeFileSync(
  wrapper,
  `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<style>html,body{margin:0;padding:0;background:${THEME.pageBackground};overflow:hidden}
svg{display:block;width:${W}px;height:${H}px}</style></head>
<body>${plate.svg()}</body></html>`,
);

execFileSync(
  bin,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    // generous, so the webfonts are fetched and laid out before capture
    "--virtual-time-budget=12000",
    `--window-size=${W},${H}`,
    `--screenshot=${PNG}`,
    "file://" + wrapper,
  ],
  { stdio: "ignore" },
);

fs.rmSync(path.dirname(wrapper), { recursive: true, force: true });

if (!fs.existsSync(PNG)) {
  console.error("Chrome ran but wrote no PNG.");
  process.exit(1);
}
const kb = (fs.statSync(PNG).size / 1024).toFixed(0);
console.log(`  assets/og-default.png  ${W}x${H}  ${kb} KB`);
console.log("  Commit it — crawlers fetch the raster, not the SVG.");
