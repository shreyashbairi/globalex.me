/* ============================================================
   PLACEHOLDER PRODUCT PLATES — for grades with no photograph yet

       npm run placeholders

   NOT part of `npm run build`. Run it when a grade is added to the catalogue
   carrying `photo:false`, or when the theme changes colour.

   WHY THIS EXISTS
   images-build.js turns a delivered master into the two derivatives every
   grade needs. A grade whose photography has not been shot has no master, and
   the two options without this script are both bad: ship a broken <img>, or
   special-case the markup so some grades have a plate and others do not. The
   second is worse than it sounds — the plate is in the hero, the circle is on
   two grids, and every one of those would grow a branch.

   So the gap is filled at the same two paths images-build.js writes, with a
   frame that is unmistakably not a photograph:

     <id>.webp     1600 x 894   the product page plate
     <id>-sq.webp  512 x 512    the circular thumbnail on the products grid

   The day a real master lands, drop it in _masters/products, clear `photo`
   in catalogue.js and run `npm run images`. It overwrites these two files at
   these two paths and nothing else changes anywhere.

   WHAT IT DRAWS
   The site's own paper, a hairline hatch, the notched rectangle the card
   system is cut from, and the diamond marker used everywhere else — the
   design system with the photograph missing, rather than a grey box with a
   camera icon. No text: the alt text on the page already says the plate is a
   placeholder, and burning a word into a raster that the theme can recolour
   but not re-typeset would go stale the first time a grade is renamed.

   Colour comes from theme.js like everything else. The ground is the page
   background, which is exactly what images-build.js normalises real masters
   onto, so a page holding both kinds sits on one continuous paper.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { CLASSES, IMG_W, IMG_H, IMG_SQ } = require("./catalogue");
const theme = require("./theme");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets/products");

const W = IMG_W;
const H = IMG_H;
/* Lower than images-build.js's 78/80, and deliberately. A hairline hatch
   across a flat ground is the worst case for a lossy codec — at the same
   quality this frame encodes to three times a real photograph, for an image
   that is standing in for one. */
const WIDE_Q = 72;
const SQ_Q = 82;

/* ------------------------------------------------------------------ paint */

const GROUND = theme.rgb(theme.THEME.pageBackground);
const HAIR = theme.rgb(theme.THEME.hairline);
const MARK = theme.rgb(theme.THEME.accentMaterial);

const buf = Buffer.alloc(W * H * 3);

/* Every mark on the frame is laid over the ground with an alpha, so the
   hatch, the outline and the marker all stay in one tonal family however the
   theme moves. */
function blend(x, y, c, a) {
  if (a <= 0 || x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  const k = a > 1 ? 1 : a;
  buf[i] = buf[i] + (c[0] - buf[i]) * k;
  buf[i + 1] = buf[i + 1] + (c[1] - buf[i + 1]) * k;
  buf[i + 2] = buf[i + 2] + (c[2] - buf[i + 2]) * k;
}

/* Antialiased segment: the distance from each pixel in the segment's bounding
   box to the segment itself, softened across one pixel. Slower than Bresenham
   and there are seven segments in the whole frame. */
function seg(x0, y0, x1, y1, c, a, wide) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy;
  const pad = Math.ceil(wide) + 2;
  const lo = (v, hi) => Math.max(0, Math.min(hi, Math.floor(v)));
  for (let y = lo(Math.min(y0, y1) - pad, H - 1); y <= lo(Math.max(y0, y1) + pad, H - 1); y++)
    for (let x = lo(Math.min(x0, x1) - pad, W - 1); x <= lo(Math.max(x0, x1) + pad, W - 1); x++) {
      let t = len2 ? ((x - x0) * dx + (y - y0) * dy) / len2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const ex = x - (x0 + dx * t);
      const ey = y - (y0 + dy * t);
      const d = Math.sqrt(ex * ex + ey * ey) - wide / 2;
      if (d < 1) blend(x, y, c, a * (d <= 0 ? 1 : 1 - d));
    }
}

/* The notched rectangle the whole card system is clipped from: square except
   for the top-right and bottom-left corners, which are cut. */
function notched(cx, cy, side, notch, c, a, wide) {
  const l = cx - side / 2;
  const r = cx + side / 2;
  const t = cy - side / 2;
  const b = cy + side / 2;
  const p = [
    [l, t], [r - notch, t], [r, t + notch], [r, b],
    [l + notch, b], [l, b - notch], [l, t],
  ];
  for (let i = 0; i < p.length - 1; i++)
    seg(p[i][0], p[i][1], p[i + 1][0], p[i + 1][1], c, a, wide);
}

function draw() {
  for (let i = 0; i < W * H; i++) {
    buf[i * 3] = GROUND[0];
    buf[i * 3 + 1] = GROUND[1];
    buf[i * 3 + 2] = GROUND[2];
  }

  /* Hatch. A 45-degree field reads as "nothing here yet" in every drafting
     convention there is, and at this weight it survives the 512 downscale
     without turning into moire. */
  const PITCH = 38;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if ((x + y) % PITCH === 0) blend(x, y, HAIR, 0.085);

  /* The motif is sized off the SHORT edge, so it lands identically framed in
     the wide plate and in the square centre crop taken out of it. */
  const cx = W / 2;
  const cy = H / 2;
  const side = H * 0.42;

  notched(cx, cy, side, side * 0.14, HAIR, 0.34, 2);
  notched(cx, cy, side * 0.62, side * 0.09, HAIR, 0.18, 1.4);

  /* The diamond marker, in the material accent — the one piece of colour, and
     the same glyph the rails, chips and readouts use. */
  const r = H * 0.036;
  for (let y = Math.floor(cy - r - 2); y <= Math.ceil(cy + r + 2); y++)
    for (let x = Math.floor(cx - r - 2); x <= Math.ceil(cx + r + 2); x++) {
      const d = Math.abs(x - cx) + Math.abs(y - cy) - r;
      if (d < 1) blend(x, y, MARK, 0.9 * (d <= 0 ? 1 : 1 - d));
    }
}

/* -------------------------------------------------------------- encode */

const run = (bin, args, input) => {
  try {
    return execFileSync(bin, args, {
      input,
      maxBuffer: 1 << 28,
      stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
    });
  } catch (e) {
    if (e.code === "ENOENT")
      throw new Error(
        `placeholder-images: ${bin} not found. Install it with ` +
          `\`brew install ${bin === "cwebp" ? "webp" : bin}\`.`,
      );
    throw new Error(`placeholder-images: ${bin} failed — ${e.stderr || e.message}`);
  }
};

/* Raw RGB into ffmpeg, PNG out, cwebp for the actual encode — the same two
   tools and the same order images-build.js uses, so the two sets of files are
   produced by one pipeline rather than two. */
function encode(png, wide, sq) {
  run("ffmpeg", ["-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
    "-s", `${W}x${H}`, "-i", "pipe:0", "-frames:v", "1", "-y", png], buf);

  run("cwebp", ["-quiet", "-q", String(WIDE_Q), "-m", "6", png, "-o", wide]);

  const side = Math.min(W, H);
  run("cwebp", ["-quiet",
    "-crop", String(Math.round((W - side) / 2)), String(Math.round((H - side) / 2)),
    String(side), String(side),
    "-resize", String(IMG_SQ), String(IMG_SQ),
    "-q", String(SQ_Q), "-m", "6", png, "-o", sq]);
}

/* ------------------------------------------------------------------ main */

/* Driven by the catalogue, not by a list here: a grade is a placeholder
   because it says so, and clearing the flag is what retires it. */
const pending = CLASSES.flatMap((c) => c.items).filter((p) => p.photo === false);

if (!pending.length) {
  console.log("  no grade carries photo:false — nothing to draw.");
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
draw();

const tmp = path.join(OUT, ".placeholder.png");
const first = pending[0];
encode(tmp, path.join(ROOT, first.img), path.join(ROOT, first.imgSq));

/* Every plate is the same frame, so it is drawn and encoded once and copied.
   Encoding it twenty times would produce twenty byte-identical files slowly. */
const wideBytes = fs.readFileSync(path.join(ROOT, first.img));
const sqBytes = fs.readFileSync(path.join(ROOT, first.imgSq));
for (const p of pending.slice(1)) {
  fs.writeFileSync(path.join(ROOT, p.img), wideBytes);
  fs.writeFileSync(path.join(ROOT, p.imgSq), sqBytes);
}
fs.unlinkSync(tmp);

const kb = (b) => Math.round(b.length / 1024);
for (const p of pending)
  console.log(`  ${p.url.replace(/\.html$/, "").padEnd(34)} ${kb(wideBytes)} KB + ${kb(sqBytes)} KB`);
console.log(
  `\n${pending.length} placeholder plate(s) written to assets/products, ` +
    `${W}x${H} and ${IMG_SQ}x${IMG_SQ}.\n` +
    `Drop a real master in _masters/products, clear photo:false in ` +
    `catalogue.js and run \`npm run images\` to replace one.`,
);
