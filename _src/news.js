/* ============================================================
   ⚠️  PLACEHOLDER DATA — NOT FOR PRODUCTION
   Every value below is invented. Replace with verified company
   data before this page ships. Do not deploy as-is.
   ============================================================

   NEWSROOM POSTS

   Gated by PAGES.news in _src/flags.js, which is off — so neither the index
   nor any post page is written and nothing here is published.

   Before switching it on, two things are needed and only one of them is
   content: at least three real posts, AND someone who will keep writing
   them. A newsroom whose most recent item is eighteen months old dates the
   whole site more effectively than having no newsroom at all.

   Post shape:
     id       -> news-<id>.html
     date     ISO. Drives sort order, the <time datetime>, and JSON-LD.
     kind     Market note | Corridor | Company | Product
     title    headline
     summary  one-paragraph standfirst
     body     HTML fragment
     tags     lowercase keywords, folded into site search
   ============================================================ */

const KINDS = ["Market note", "Corridor", "Company", "Product"];

const NEWS = [
  {
    id: "placeholder-market-note",
    date: "2026-01-01",
    kind: "Market note",
    title: "[Headline to be written]",
    summary: "[One-paragraph standfirst — what changed, and why it matters to a buyer.]",
    body: `<p>[Post body. An HTML fragment: paragraphs, and a subheading or two
if it runs long. Written for someone deciding whether to cover a position, not
for a search engine.]</p>`,
    tags: ["placeholder"],
    DRAFT: true,
  },
];

/* Newest first. Sorted here rather than at each call site so the index, the
   "more from the desk" trio and the search index cannot disagree about order. */
const sorted = () => NEWS.slice().sort((a, b) => (a.date < b.date ? 1 : -1));

const url = (post) => `news-${post.id}.html`;

const allDraft = () => NEWS.every((p) => p.DRAFT);

module.exports = { NEWS, KINDS, sorted, url, allDraft };
