/* ============================================================
   OUTPUT ESCAPING

   Everything in this repo is authored as HTML fragments carrying real
   entities — "&mdash;", "&amp;", "Cl&#8322;". That is fine inside <main>,
   where the markup is trusted and goes out verbatim. It stops being fine
   at two sinks:

     • <head> attribute values, where an unescaped quote in a title or
       description silently truncates the tag
     • JSON-LD, which is JSON inside <script> and is never HTML-parsed, so
       "&mdash;" there reaches a crawler as eight literal characters

   Those two sinks want opposite treatments — escape, and decode — which
   is why both live here rather than being improvised per call site.

   Not in catalogue.js: slug() and plain() are data helpers that build ids
   and search haystacks. These build output.
   ============================================================ */

/* Escape for markup, preserving entities that are already there.

   The negative lookahead is the whole trick. A bare "&" becomes "&amp;",
   but "&mdash;" and "&#8322;" are left alone — so authored copy survives
   into <title> unchanged while "Smith & Sons" is still corrected. Quotes,
   angle brackets and the ampersand are the full set an attribute value or
   an element body can be broken by, so one function serves both; a
   separate attr() would only ever be picked wrongly. */
const html = (s) =>
  String(s == null ? "" : s)
    .replace(/&(?!#\d+;|#x[0-9a-fA-F]+;|[a-zA-Z][a-zA-Z0-9]*;)/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/* Named entities the content actually uses. Anything outside this table
   and the numeric forms is left as written, which is visible in output
   and therefore fixable, rather than silently dropped. */
const NAMED = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00A0",
  mdash: "—",
  ndash: "–",
  middot: "·",
  hellip: "…",
  deg: "°",
  times: "×",
  rarr: "→",
  larr: "←",
  uarr: "↑",
  darr: "↓",
  crarr: "↵",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  eacute: "é",
  sup2: "²",
  sup3: "³",
};

/* Entities to real characters. Tags are left alone — see decode() for the
   variant that removes them. Split out because xml() must not strip
   anything tag-shaped: "<" is a character it has to be able to carry and
   escape, not something to silently delete. */
const entities = (s) =>
  String(s == null ? "" : s)
    .replace(/&#(\d+);/g, (_, d) => cp(+d))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, x) => cp(parseInt(x, 16)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => {
      const k = n.toLowerCase();
      return Object.prototype.hasOwnProperty.call(NAMED, k) ? NAMED[k] : m;
    });

/* Markup to display text, for values a crawler will show.

   Deliberately not plain(): that turns "&mdash;" into a space and folds
   subscript entities to ASCII digits, which is right for a search
   haystack and wrong for a Product name. This is faithful — "&mdash;"
   becomes an em dash, "&#8322;" becomes a subscript two.

   Note \s in JavaScript matches U+00A0, so the final collapse also
   normalises a non-breaking space to an ordinary one. That is wanted here:
   structured data should not carry layout whitespace. */
const decode = (s) =>
  entities(String(s == null ? "" : s).replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const cp = (n) => {
  try {
    return String.fromCodePoint(n);
  } catch {
    return "";
  }
};

/* Serialise a JSON-LD node into a <script> block.

   Escaping "<" as < makes the sequence "</script>" unrepresentable
   in the output while still parsing back to the identical string, which
   is the only reliable way to do this — never try to detect "</script"
   in the serialised text. U+2028/9 are legal in JSON but not in a JS
   string literal, so they go too. */
const jsonScript = (obj) =>
  '<script type="application/ld+json">' +
  JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029") +
  "</script>";

/* XML text, for sitemap.xml. Distinct from html(): an XML parser knows only
   the five predefined entities, so "&mdash;" is a hard parse error there
   rather than a rendering nicety. Resolve entities to characters first, then
   escape the five — via entities() rather than decode(), so a literal "<"
   is escaped instead of being mistaken for a tag and dropped.

   URLs are the only thing this sees today, but a <lastmod> or a future
   <image:title> would go through the same door. */
const xml = (s) =>
  entities(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

module.exports = { html, entities, decode, jsonScript, xml };
