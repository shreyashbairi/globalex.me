/* ============================================================
   ASSET CACHE STAMP

   _headers serves everything under /assets/ with

       Cache-Control: public, max-age=31536000, immutable

   and justifies it with "content-addressed by hand rather than by hash: these
   filenames change when the asset changes". That was an assumption about how
   people would behave, not a property of the system — and it broke the first
   time it was tested. The eight petroleum plates shipped as generated
   placeholders, then the photographs arrived and were written to the same
   eight filenames. Cloudflare's edge and every browser that had loaded the
   page kept serving the placeholder, and `immutable` means a browser will not
   revalidate even on a manual reload. The site had eight wrong images with a
   one-year lifetime and no way to correct them short of renaming files.

   So the claim is now enforced instead of asserted. Every product image URL in
   the markup carries the first eight hex digits of a hash of the bytes it
   points at. Same bytes, same URL, and the year-long cache is doing exactly
   what it should. Different bytes, different URL, and every cache in the chain
   misses and refetches on the next deploy — including the poisoned ones,
   because it is a URL they have never seen.

   The query string is deliberate rather than a rename. Cloudflare Pages
   resolves the file from the path and ignores the query, but caches on the
   full URL, so this buys the cache behaviour without renaming files on disk,
   without touching the image pipeline, and without the catalogue's filenames
   ceasing to be readable.

   Paths stay bare in the catalogue: `img` and `imgSq` are filesystem paths and
   images-build.js, placeholder-images.js and the test suite all read them as
   such. Stamping happens where markup is written, and nowhere else.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");

/* One read per file per build. Thirty-two grades appear on the products page,
   their own pages and their class page, so the same file is stamped upwards of
   three times and hashing it once matters more than it looks. */
const cache = new Map();

function stamp(rel) {
  if (cache.has(rel)) return cache.get(rel);
  let out = rel;
  try {
    const h = crypto
      .createHash("md5")
      .update(fs.readFileSync(path.join(ROOT, rel)))
      .digest("hex")
      .slice(0, 8);
    out = `${rel}?v=${h}`;
  } catch {
    /* A missing file gets a bare URL rather than a thrown build. It is already
       a broken <img> and `npm test` names it by path — failing here instead
       would only replace a specific error with a generic one. */
  }
  cache.set(rel, out);
  return out;
}

module.exports = { stamp };
