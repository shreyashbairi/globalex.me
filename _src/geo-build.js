/* ============================================================
   GEOGRAPHY GENERATOR — writes _src/geo.js.

   NOT part of `npm run build`. _src/geo.js is generated once and committed,
   because the home-page globe must not depend on a network fetch at build or
   at run time. This file exists so that dataset is reproducible rather than a
   blob nobody can regenerate: change a tolerance below, re-run, commit.

       npm run geo

   It needs the two Natural Earth 110m sources next to it, which are not
   committed (1MB of JSON for a 24KB output). Fetch them first:

     curl -sSo /tmp/land110.json \
       https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json
     curl -sSo /tmp/countries110.json \
       https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/cultural/ne_110m_admin_0_countries.json
     GEO_SRC=/tmp npm run geo

   Natural Earth is public domain: naturalearthdata.com.

   Two knobs worth knowing about. TOL is the Douglas-Peucker tolerance in
   degrees — raise it for a smaller file and a blockier coast. MIN_SPAN drops
   islands below that many degrees across; at the size the globe is drawn they
   are under a pixel, and they were a third of the ring count.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const SRC = process.env.GEO_SRC || __dirname;
const read = (f) => {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p))
    throw new Error(
      `geo-build: ${p} not found. See the header of this file for the two ` +
        `curl commands that fetch it, then re-run with GEO_SRC pointing at them.`,
    );
  return JSON.parse(fs.readFileSync(p, 'utf8'));
};

const land = read('land110.json');
const countries = read('countries110.json');

// ---------------------------------------------------------------- rings
function rings(geo, out) {
  const g = geo.geometry;
  if (!g) return;
  if (g.type === 'Polygon') g.coordinates.forEach((r) => out.push(r));
  else if (g.type === 'MultiPolygon')
    g.coordinates.forEach((p) => p.forEach((r) => out.push(r)));
}

const landRings = [];
land.features.forEach((f) => rings(f, landRings));
const borderRings = [];
countries.features.forEach((f) => rings(f, borderRings));
console.log('land rings', landRings.length, 'border rings', borderRings.length);

// ---------------------------------------------------------------- simplify
// Douglas–Peucker in lon/lat degrees. Good enough: at globe scale one degree
// is roughly one pixel.
function perp(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  if (!l2) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  let maxD = 0, ix = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perp(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; ix = i; }
  }
  if (maxD <= tol) return [pts[0], pts[pts.length - 1]];
  return dp(pts.slice(0, ix + 1), tol).slice(0, -1).concat(dp(pts.slice(ix), tol));
}

// Ring bounding-box span, to drop specks that cost bytes and draw nothing.
function span(r) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const p of r) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  return Math.max(x1 - x0, y1 - y0);
}

const TOL = 0.42;      // degrees
const MIN_SPAN = 1.4;  // degrees — smaller islands are sub-pixel on the globe

const simplified = [];
for (const r of borderRings) {
  if (span(r) < MIN_SPAN) continue;
  const s = dp(r, TOL);
  if (s.length < 3) continue;
  simplified.push(s);
}
console.log('kept rings', simplified.length,
  'points', simplified.reduce((n, r) => n + r.length, 0));

// ---------------------------------------------------------------- encode
/* Each ring is a run of quantised lon/lat pairs at 1/16 degree, delta-encoded
   and written as zig-zag varints in a 64-character alphabet. Rings are joined
   with a separator the alphabet does not contain. */
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-';
const Q = 16; // steps per degree

function varint(n, out) {
  let v = n < 0 ? -n * 2 - 1 : n * 2; // zig-zag
  do {
    let b = v & 31;             // 5 payload bits
    v = Math.floor(v / 32);
    out.push(A[b + (v > 0 ? 32 : 0)]);  // high bit = continue
  } while (v > 0);
}

function encodeRings(rs) {
  const parts = [];
  for (const r of rs) {
    const out = [];
    let px = 0, py = 0;
    for (const p of r) {
      const x = Math.round(p[0] * Q), y = Math.round(p[1] * Q);
      varint(x - px, out); varint(y - py, out);
      px = x; py = y;
    }
    parts.push(out.join(''));
  }
  return parts.join('|');
}

const BORDERS = encodeRings(simplified);
console.log('borders encoded', (BORDERS.length / 1024).toFixed(1), 'KB');

// ---------------------------------------------------------------- land mask
/* A 1-degree equirectangular land bitmask, scanline-filled from the land
   polygons under the even-odd rule (so the Caspian and the Great Lakes come
   out as holes, which is what the source encodes them as). */
const MW = 360, MH = 180;
const bits = new Uint8Array((MW * MH) / 8);

for (let row = 0; row < MH; row++) {
  const lat = 90 - (row + 0.5) * (180 / MH);
  const xs = [];
  for (const r of landRings) {
    for (let i = 0; i < r.length - 1; i++) {
      const a = r[i], b = r[i + 1];
      if ((a[1] > lat) === (b[1] > lat)) continue;
      xs.push(a[0] + ((lat - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
    }
  }
  xs.sort((p, q) => p - q);
  for (let k = 0; k + 1 < xs.length; k += 2) {
    const c0 = Math.floor((xs[k] + 180) / 360 * MW);
    const c1 = Math.ceil((xs[k + 1] + 180) / 360 * MW);
    for (let c = Math.max(0, c0); c < Math.min(MW, c1); c++) {
      const ix = row * MW + c;
      bits[ix >> 3] |= 1 << (ix & 7);
    }
  }
}
let landCells = 0;
for (let i = 0; i < MW * MH; i++) if (bits[i >> 3] & (1 << (i & 7))) landCells++;
console.log('land cells', landCells, '/', MW * MH,
  '=', ((landCells / (MW * MH)) * 100).toFixed(1) + '%');

const MASK = Buffer.from(bits).toString('base64');
console.log('mask encoded', (MASK.length / 1024).toFixed(1), 'KB');

// ---------------------------------------------------------------- emit
const out = `/* ============================================================
   GEOGRAPHY — Natural Earth 110m, baked.

   Generated once and committed; nothing in the build regenerates it. The
   home-page globe needs the earth to actually be the earth — before this it
   drew a uniform point field over the whole sphere and called it a landmass,
   so the corridor arcs terminated in empty space and there was no way to see
   that Jebel Ali was in the right place.

   Two datasets, both sized for a sphere about 900px across:

   BORDERS  coastlines and national borders, as simplified rings. Quantised to
            1/16 degree, delta-encoded, zig-zag varints in a 64-char alphabet.
            Rings separated by "|". Douglas-Peucker at ${TOL} degrees; rings
            spanning under ${MIN_SPAN} degrees are dropped as sub-pixel.

   LANDMASK a ${MW}x${MH} one-degree land bitmask, base64 of a little-endian
            bitfield, row 0 at the north pole and column 0 at 180W. Scanline
            filled under the even-odd rule, so enclosed water — the Caspian,
            which this company ships across — is correctly not land.

   Decoders live in _src/pages/index.js, next to the globe that uses them.
   Source: naturalearthdata.com, public domain.
   ============================================================ */

module.exports = {
  Q: ${Q},
  MW: ${MW},
  MH: ${MH},
  BORDERS: ${JSON.stringify(BORDERS)},
  LANDMASK: ${JSON.stringify(MASK)},
};
`;
fs.writeFileSync(path.join(__dirname, 'geo.js'), out);
console.log('wrote _src/geo.js', (out.length / 1024).toFixed(1), 'KB');
