/* ============================================================
   PRODUCT IMAGE ENCODER — _masters/products -> assets/products

       npm run images

   NOT part of `npm run build`. Run it when a master changes.

   WHY THIS EXISTS
   The frames arrive at about 6 MB each — 192 MB across the set — as PNG data
   carrying a .webp extension, so the bytes and the Content-Type disagree.
   products.html renders every grade on one page. Shipped as delivered that is
   a 192 MB page.

   They also do not all arrive at one size: classes 01-03 came at 2752x1536
   and the petroleum set at 2528x1696. See the aspect fit in the loop below.

   Each master produces two derivatives, because the two placements want
   genuinely different files rather than one file used badly:

     <id>.webp     1600px wide   the product page plate
     <id>-sq.webp  512 x 512     the circular thumbnail on the products grid

   The square is a centre crop, which is only safe because every prompt in
   product-images.md pins the subject to the middle 55% of the frame. That
   composition rule was written for exactly this.

   Serving the 1600px file into a 128px circle twenty-four times would cost
   about 700 KB of wasted decode on the busiest page on the site; the square
   set is roughly 300 KB for all twenty-four.

   MASTERS ARE NOT COMMITTED
   _masters/ is in .gitignore and .assetsignore. 144 MB of PNG cannot be
   delta-compressed by git and would be in the history permanently. Keep the
   masters backed up outside the repo — everything in assets/products can be
   rebuilt from them, and nothing can rebuild them.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { CLASSES, IMG_W, IMG_H, IMG_SQ } = require("./catalogue");
const theme = require("./theme");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "_masters/products");
const OUT = path.join(ROOT, "assets/products");

/* Encoder settings. -m 6 is the slowest, smallest search; twenty-four images
   run in a few seconds and this is not on the build path, so there is no
   reason to trade quality for speed here. */
const WIDE_PX = IMG_W;
const WIDE_Q = 78;
const SQ_PX = IMG_SQ;
const SQ_Q = 80;

/* ------------------------------------------------------------------
   Paper normalisation.

   Every frame was prompted with the site's own pageBackground as its paper —
   but the generator only approximated it, and the delivered set landed
   anywhere from seventeen levels below that value to one level above. That
   does not sound like much; on a page whose own background is that exact
   colour it is the difference between a photograph that sits on the page and
   a grey rectangle stuck to it. Each run prints the measured before-and-after
   per image, so the drift in a re-delivered set is visible immediately.

   (No hex here on purpose — every colour on this site comes from theme.js,
   and `npm test` fails the build if a literal reappears anywhere else.)

   So the white point is measured per image and mapped onto the theme's real
   pageBackground before encoding. colorlevels scales everything below the
   white point with it, so the material keeps its relative tones and only the
   ground moves.

   The white point is the brightest of the four corner patches rather than an
   average of them. The subject is pinned to the middle 55% of every frame, so
   the corners are pure paper; and the light comes from the upper left by
   specification, so the corners differ from each other by ten or more levels
   within a single frame. The brightest one is the lit paper, which is what
   should land on the page colour — averaging would map a shadow onto it and
   push the whole frame too bright. */
const GROUND = theme.rgb(theme.THEME.pageBackground);

function ground(file, w, h) {
  const P = 200, I = 20;
  const corners = [
    [I, I],
    [w - P - I, I],
    [I, h - P - I],
    [w - P - I, h - P - I],
  ];
  let best = null,
    bestLum = -1;
  for (const [x, y] of corners) {
    const raw = execFileSync(
      "ffmpeg",
      ["-v", "error", "-i", file, "-vf", `crop=${P}:${P}:${x}:${y},scale=1:1`,
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
      { maxBuffer: 1 << 20 },
    );
    const [r, g, b] = [raw[0], raw[1], raw[2]];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (lum > bestLum) { bestLum = lum; best = [r, g, b]; }
  }
  return best;
}

/* Normalised full-size PNG, handed to cwebp for the actual encode — cwebp
   compresses better than ffmpeg's libwebp path, and this keeps the two jobs
   separate. */
function normalise(src, out, w, h) {
  const [r, g, b] = ground(src, w, h);
  const lv = [
    `rimax=${r / 255}:romax=${GROUND[0] / 255}`,
    `gimax=${g / 255}:gomax=${GROUND[1] / 255}`,
    `bimax=${b / 255}:bomax=${GROUND[2] / 255}`,
  ].join(":");
  execFileSync(
    "ffmpeg",
    ["-v", "error", "-i", src, "-vf", `colorlevels=${lv}`, "-frames:v", "1", "-y", out],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  return [r, g, b];
}

const cwebp = (args) => {
  try {
    execFileSync("cwebp", ["-quiet", ...args], { stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    if (e.code === "ENOENT")
      throw new Error(
        "images-build: cwebp not found. Install it with `brew install webp`.",
      );
    throw new Error(`images-build: cwebp failed — ${e.stderr || e.message}`);
  }
};

/* The pixel dimensions of a master, read from the file rather than assumed:
   the centre-crop offset depends on them, and a master delivered at a
   different size would otherwise be cropped off-subject in silence. */
function size(file) {
  const out = execFileSync("webpinfo", [file], { encoding: "utf8" }).match(
    /Width:\s*(\d+)[\s\S]*?Height:\s*(\d+)/,
  );
  if (out) return { w: +out[1], h: +out[2] };
  throw new Error(`images-build: could not read dimensions of ${file}`);
}

/* PNG and WebP both, because the delivered masters are PNG bytes under a
   .webp name and may be re-delivered either way. */
function dimensions(file) {
  const buf = fs.readFileSync(file);
  if (buf.slice(1, 4).toString() === "PNG")
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.slice(0, 4).toString() === "RIFF") return size(file);
  throw new Error(`images-build: ${path.basename(file)} is neither PNG nor WebP`);
}

/* Read from CLASSES rather than from three named arrays, so a new commodity
   class is encoded by this script the day it is added instead of the day
   someone remembers to name it here.

   A grade carrying `photo:false` has no master and is not meant to: its two
   files are drawn by `npm run placeholders`. Demanding a master for it would
   make this script fail for the whole book because one class has not been
   photographed yet. Clearing the flag is what hands it back to this script. */
const products = CLASSES.flatMap((c) => c.items);
const awaiting = products.filter((p) => p.photo === false);
const shoot = products.filter((p) => p.photo !== false);
const kb = (f) => Math.round(fs.statSync(f).size / 1024);

if (!fs.existsSync(SRC))
  throw new Error(
    `images-build: ${path.relative(ROOT, SRC)} does not exist. Masters live ` +
      `there, one per grade, named <class>-<id>.webp — see product-images.md.`,
  );
fs.mkdirSync(OUT, { recursive: true });

/* Reconcile before encoding anything, so a missing master is one clear error
   at the start rather than twenty-three successes and a gap. */
const missing = shoot
  .map((p) => p.url.replace(/\.html$/, ".webp"))
  .filter((f) => !fs.existsSync(path.join(SRC, f)));
if (missing.length)
  throw new Error(
    `images-build: no master for ${missing.length} grade(s): ` +
      `${missing.join(", ")}. Expected in ${path.relative(ROOT, SRC)}/.`,
  );

if (awaiting.length)
  console.log(
    `  ${awaiting.length} grade(s) carry photo:false and are skipped — ` +
      `${awaiting.map((p) => p.id).join(", ")}.\n` +
      `  Their plates come from \`npm run placeholders\`.\n`,
  );

let totalIn = 0,
  totalWide = 0,
  totalSq = 0;

for (const p of shoot) {
  const base = p.url.replace(/\.html$/, "");
  const src = path.join(SRC, `${base}.webp`);
  const wide = path.join(OUT, `${base}.webp`);
  const sq = path.join(OUT, `${base}-sq.webp`);
  const { w, h } = dimensions(src);

  /* Normalise the paper to the page background first; both derivatives come
     from the corrected frame, so the circle and the plate agree. */
  const tmp = path.join(OUT, `.${base}.norm.png`);
  const was = normalise(src, tmp, w, h);

  /* Fit the frame to the declared output ratio.

     The first delivery was 2752x1536 throughout, which a plain width resize
     lands on 1600x894 by itself. The petroleum set arrived at 2528x1696 — a
     different ratio entirely — and the same resize would put it at 1600x1073:
     eight product pages reflowing as each photograph landed, and eight plates
     a different shape from the other twenty-four.

     So a master that will not resize onto IMG_W x IMG_H is centre-cropped to
     that ratio first. Cropping is safe for exactly the reason the square crop
     is: every prompt pins the subject to the middle 55% of the frame.

     Conditional rather than unconditional, and that is deliberate. Cropping
     every master to the exact ratio would take three pixels off the width of
     the twenty-four frames that are already correct, re-encoding all of them
     to no visible end. A master within a pixel or two of the target is left
     alone. */
  const fit = Math.round((h * WIDE_PX) / w);
  if (Math.abs(fit - IMG_H) <= 2) {
    cwebp(["-resize", String(WIDE_PX), "0", "-q", String(WIDE_Q), "-m", "6", tmp, "-o", wide]);
  } else {
    let cw = w,
      ch = Math.round((w * IMG_H) / IMG_W);
    if (ch > h) { ch = h; cw = Math.round((h * IMG_W) / IMG_H); }
    cwebp([
      "-crop", String(Math.round((w - cw) / 2)), String(Math.round((h - ch) / 2)),
      String(cw), String(ch),
      "-resize", String(WIDE_PX), String(IMG_H),
      "-q", String(WIDE_Q), "-m", "6", tmp, "-o", wide,
    ]);
    console.log(
      `  ${base.padEnd(34)} master is ${w}x${h}, cropped to ${cw}x${ch} for the ` +
        `${IMG_W}x${IMG_H} plate`,
    );
  }

  /* Centre square. Landscape masters crop horizontally, portrait ones
     vertically; the short edge always sets the square. */
  const side = Math.min(w, h);
  const x = Math.round((w - side) / 2);
  const y = Math.round((h - side) / 2);
  cwebp([
    "-crop", String(x), String(y), String(side), String(side),
    "-resize", String(SQ_PX), String(SQ_PX),
    "-q", String(SQ_Q), "-m", "6", tmp, "-o", sq,
  ]);
  fs.unlinkSync(tmp);

  /* The markup reserves space using IMG_W/IMG_H/IMG_SQ from catalogue.js. If
     an output does not match them the pages would reflow as each photograph
     lands, so the mismatch is fatal here rather than visible there. */
  const gotW = dimensions(wide);
  const gotS = dimensions(sq);
  if (gotW.w !== IMG_W || gotW.h !== IMG_H)
    throw new Error(
      `images-build: ${base}.webp encoded to ${gotW.w}x${gotW.h}, but ` +
        `catalogue.js declares IMG_W/IMG_H as ${IMG_W}x${IMG_H}. The master ` +
        `is a different aspect ratio from the rest — re-crop it, or update ` +
        `those constants for the whole set.`,
    );
  if (gotS.w !== IMG_SQ || gotS.h !== IMG_SQ)
    throw new Error(
      `images-build: ${base}-sq.webp encoded to ${gotS.w}x${gotS.h}, ` +
        `expected ${IMG_SQ}x${IMG_SQ}.`,
    );

  totalIn += fs.statSync(src).size;
  totalWide += fs.statSync(wide).size;
  totalSq += fs.statSync(sq).size;
  const hex = (c) => "#" + c.map((n) => n.toString(16).padStart(2, "0")).join("");
  console.log(
    `  ${base.padEnd(34)} ${String(Math.round(fs.statSync(src).size / 1048576)).padStart(2)} MB ` +
      `-> ${String(kb(wide)).padStart(4)} KB + ${String(kb(sq)).padStart(3)} KB   ` +
      `paper ${hex(was)} -> ${hex(GROUND)}`,
  );
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(
  `\n${shoot.length} grade(s): ${mb(totalIn)} MB of masters -> ` +
    `${mb(totalWide)} MB wide + ${mb(totalSq)} MB square, ` +
    `${Math.round((1 - (totalWide + totalSq) / totalIn) * 100)}% smaller.`,
);
console.log(
  `The products grid loads only the square set: ${Math.round(totalSq / 1024)} KB ` +
    `for all ${shoot.length}.`,
);
