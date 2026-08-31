/* ============================================================
   JSON-LD NODE BUILDERS

   Every function returns a plain object or null, never a string —
   serialisation happens once, in esc.jsonScript(), so nodes can be
   composed, filtered and tested as data.

   Each page emits ONE script block holding an @graph array rather than a
   stack of separate blocks. Nodes carry an @id, so a BreadcrumbList or a
   Product references the company as {"@id": ".../#org"} instead of
   restating the whole Organization on all thirteen pages — which is what
   otherwise produces "duplicate entity" warnings in a validator.

   String values are passed through esc.decode() on the way in: JSON-LD is
   JSON inside <script> and is never HTML-parsed, so "&mdash;" here would
   reach a crawler as eight literal characters.
   ============================================================ */

const { decode } = require("./esc");

const LEGAL_NAME = "Globalex Trading FZCO";
const PHONE = "+971 4 566 7713";
const EMAIL = "contact@globalex.me";
const LINKEDIN = "https://www.linkedin.com/company/globalex-trading-FZCO-uae/";

/* Deliberately incomplete. "337622" appears in the footer address, but
   whether it is a PO Box or a postal code is unconfirmed, and the two are
   different schema.org fields (postOfficeBoxNumber vs postalCode). An
   omitted field is valid; a wrong one is an error a validator flags. Add
   it once the checklist item is answered. */
const address = () => ({
  "@type": "PostalAddress",
  streetAddress: "2605 X3 Tower, Cluster X, Jumeirah Lakes Towers",
  addressLocality: "Dubai",
  addressCountry: "AE",
});

/* The company node. Present on every page, referenced by @id from the
   rest, so it is stated once per page and identified everywhere. */
const organization = ({ site, logo }) => ({
  "@type": "Organization",
  "@id": `${site}/#org`,
  name: LEGAL_NAME,
  legalName: LEGAL_NAME,
  url: `${site}/`,
  ...(logo ? { logo: `${site}/${logo}` } : {}),
  foundingDate: "2019",
  address: address(),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: PHONE,
    email: EMAIL,
    contactType: "sales",
    availableLanguage: ["en"],
  },
  sameAs: [LINKEDIN],
});

/* The site node, so a search engine can attribute the domain rather than
   inferring it. Cheap, and it is what carries a sitewide name. */
const webSite = ({ site }) => ({
  "@type": "WebSite",
  "@id": `${site}/#site`,
  url: `${site}/`,
  name: LEGAL_NAME,
  inLanguage: "en",
  publisher: { "@id": `${site}/#org` },
});

/* Built from the very array parts.js#hero() renders, so the visible trail
   and the structured one cannot disagree — they are the same data, not two
   descriptions of it.

   hero()'s contract: "Home" is prepended by the template and is never in
   the array; a [label, href] tuple is a link; a bare string is the
   terminal, current-page label. The terminal item gets a name and no
   item — which is what Google wants for the page you are already on, and
   the reason this needs no canonical passed in.

   `url` maps an href to its absolute canonical form. It is injected rather
   than built here because only build.js knows how the host serves URLs —
   Pages strips the .html, so the trail must not assert links that redirect. */
const breadcrumbList = (crumb, { url }) => {
  if (!Array.isArray(crumb) || !crumb.length) return null;
  const trail = [["Home", "index.html"], ...crumb];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => {
      const last = i === trail.length - 1;
      const label = Array.isArray(c) ? c[0] : c;
      const href = Array.isArray(c) ? c[1] : null;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: decode(label),
        ...(href && !last ? { item: url(href) } : {}),
      };
    }),
  };
};

/* Per-grade node. Phase 3 renders the product pages that use it; the shape
   is settled here so the page template has nothing to decide.
   `spec` is the _src/specs.js entry when one exists. */
const product = (item, cls, spec, { site, url }) => {
  if (!item) return null;
  const href = url(item.url);
  const rows = (spec && spec.analysis) || [];
  /* A placeholder figure is worse than an absent one in structured data —
     "[--]" would be published as a real assay value. Drop them. */
  const real = rows.filter(
    ([, typical]) => typical && !/^\s*\[.*\]\s*$/.test(String(typical)),
  );
  return {
    "@type": "Product",
    "@id": `${href}#product`,
    name: decode(item.name),
    description: decode(item.body),
    category: decode(cls.title),
    sku: item.id,
    url: href,
    brand: { "@id": `${site}/#org` },
    ...(real.length
      ? {
          additionalProperty: real.map(([param, typical, , , unit]) => ({
            "@type": "PropertyValue",
            name: decode(param),
            value: decode(typical),
            ...(unit ? { unitText: decode(unit) } : {}),
          })),
        }
      : {}),
  };
};

/* Per-post node. Phase 4 renders the newsroom. */
const newsArticle = (post, { site, url }) => {
  if (!post) return null;
  const href = url(post.url);
  return {
    "@type": "NewsArticle",
    "@id": `${href}#article`,
    headline: decode(post.title),
    description: decode(post.summary),
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { "@id": `${site}/#org` },
    publisher: { "@id": `${site}/#org` },
    mainEntityOfPage: href,
  };
};

/* Wrap nodes in a single graph, dropping the nulls that the builders above
   return for "nothing to say". Returns null when there is nothing at all,
   so render() can skip the script block entirely. */
const graph = (nodes) => {
  const list = nodes.filter(Boolean);
  if (!list.length) return null;
  return { "@context": "https://schema.org", "@graph": list };
};

module.exports = {
  organization,
  webSite,
  breadcrumbList,
  product,
  newsArticle,
  graph,
  LEGAL_NAME,
};
