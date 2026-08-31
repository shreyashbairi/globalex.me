// Shared chrome: mark, header, search, mobile nav, footer, frame, loader.
// The IA itself lives in _src/nav.js — this file only renders it.
const { CLASSES } = require("./catalogue");
const { NAV_LIVE, ownerOf, footerColumns, MENU_GRADE_CAP } = require("./nav");

/* The company mark — the supplied logo file, used as-is.
   Native raster is 70x60, so every placement is a whole-ratio scale of that. */
const gul = () =>
  `<img class="mark-logo" src="assets/logo.webp" alt="" width="47" height="40" />`;

const magnifier = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.75"/><path d="M15.4 15.4 21 21"/></svg>`;

/* A row inside a dropdown or mega-menu column. role="menuitem" is honoured by
   the roving-tabindex implementation in kernel-js — tabindex is -1 here and
   the open panel promotes exactly one item to 0. */
const menuRow = (r) =>
  `<a role="menuitem" tabindex="-1" href="${r.href}"><b>${r.label}</b>${
    r.desc ? `<small>${r.desc}</small>` : ""
  }</a>`;

/* One Products column per commodity class, driven entirely by CLASSES. The
   grade list is capped so the panel stays a menu rather than becoming the
   products page; the overflow link is generated from the real remainder, so
   it cannot claim the wrong number. */
const productColumn = (cls) => {
  const shown = cls.items.slice(0, MENU_GRADE_CAP);
  const rest = cls.items.length - shown.length;
  return `<div class="mm-col">
<a class="mm-h${cls.tone === "sand" ? " mat" : ""}" href="${cls.href}">
<span class="mm-no">${cls.no}</span><b>${cls.title}</b><small>${cls.count}</small>
</a>
<ul class="mm-l">
${shown
  .map(
    (p) =>
      `<li><a role="menuitem" tabindex="-1" href="${p.url || `${cls.href}#${p.id}`}">${p.name}</a></li>`,
  )
  .join("\n")}
${
  rest > 0
    ? `<li><a class="mm-more" role="menuitem" tabindex="-1" href="${cls.href}">+ ${rest} more <span class="ar">&rarr;</span></a></li>`
    : ""
}
</ul>
</div>`;
};

/* The fourth column: a static canvas ornament, the document register and the
   full index. data-orn is the shared ornament stage from kernel-js, not a
   second three.js instance — the WebGL budget belongs to the homepage. */
const featuredColumn = () => `<div class="mm-col mm-feat">
<a class="mm-card" href="products.html">
<canvas data-orn="cyan" data-tile="104" data-nodes="4" data-alpha="0.3" aria-hidden="true"></canvas>
<span class="mm-card-b">
<b>The whole book</b>
<small>Search every grade by name, formula, application or origin</small>
<span class="lk">All products <span class="ar">&rarr;</span></span>
</span>
</a>
<a class="mm-doc" role="menuitem" tabindex="-1" href="index.html#specifications">
<b>Document register</b><small>MSDS, TDS and specifications on request</small>
</a>
</div>`;

function header(page, navOwner) {
  const owner = ownerOf(page, navOwner);

  const items = NAV_LIVE.map((n) => {
    /* Exact page match takes aria-current; an ancestor match gets the visual
       state only. Two aria-current="page" links on one page is a spec
       violation and a screen reader announces both. */
    const exact = n.href === `${page}.html`;
    const on = exact || owner === n.id;
    const state = exact ? ' data-on aria-current="page"' : on ? " data-on" : "";

    if (n.kind === "link")
      return `<li><a class="nl"${state} href="${n.href}">${n.label}</a></li>`;

    const panelId = `mm-${n.id}`;
    const mega = n.kind === "mega";
    const body = mega
      ? `<div class="mm-grid" style="--mm-cols:${CLASSES.length}">
${CLASSES.map(productColumn).join("\n")}
${featuredColumn()}
</div>`
      : `<div class="menu-l">
${n.rows.map(menuRow).join("\n")}
</div>`;

    /* The label stays a real link — Products *is* products.html — and the
       disclosure is a separate button beside it. That is the only
       arrangement where both "click the label to go to the page" and
       "open the panel from the keyboard" are true at once. */
    return `<li class="has-menu" data-menu>
<a class="nl"${state} href="${n.href}">${n.label}</a>
<button class="nl-x" type="button" aria-haspopup="true" aria-expanded="false"
 aria-controls="${panelId}" aria-label="Open the ${n.label} menu"><i></i></button>
<div class="menu${mega ? " mm" : ""}" id="${panelId}" role="menu"
 aria-label="${n.label}" hidden>${body}</div>
</li>`;
  }).join("\n");

  /* Mobile. Groups are numbered, leaves are not: a running counter over
     twenty leaves reads as noise, where four group numerals keep the
     original treatment and make the boundaries legible. */
  const mobile = NAV_LIVE.map((n, i) => {
    const no = String(i + 1).padStart(2, "0");
    if (n.kind === "link")
      return `<a class="mnav-lk" href="${n.href}"><i>${no}</i>${n.label}</a>`;

    const rows =
      n.kind === "mega"
        ? [{ href: "products.html", label: "All products" }].concat(
            CLASSES.map((c) => ({ href: c.href, label: c.title })),
          )
        : n.rows;

    return `<details class="mnav-g">
<summary><i>${no}</i>${n.label}<span class="ac-i" aria-hidden="true"></span></summary>
<div class="mnav-s">
${rows.map((r) => `<a href="${r.href}">${r.label}</a>`).join("\n")}
</div>
</details>`;
  }).join("\n");

  return `<header class="hdr">
<div class="hdr-in">
<a href="index.html" class="mark" aria-label="Globalex Trading FZCO — home">
${gul()}
<span class="mark-txt"><b>GLOBALEX</b><span>TRADING FZCO</span></span>
</a>
<div class="hdr-r">
<button class="srch-t" type="button" data-srch-open aria-label="Search the site" aria-haspopup="dialog">
${magnifier}
<span>Search</span>
<kbd>&#8984;K</kbd>
</button>
<nav class="nav" aria-label="Primary">
<ul class="nav-l">${items}</ul>
<a href="contact.html" class="btn btn-p btn-sm" data-mag="5">Get in touch <span class="ar">&rarr;</span></a>
</nav>
<button class="tog" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><i></i><i></i></button>
</div>
</div>
</header>

<nav id="mnav" class="mnav" aria-label="Mobile">
<a class="mnav-lk" href="index.html"><i>00</i>Home</a>
${mobile}
<a class="mnav-lk" href="contact.html"><i>&rarr;</i>Contact</a>
<div class="mnav-f">
<span>contact@globalex.me</span>
<span>+971 4 566 7713</span>
<span>Cluster X, JLT — Dubai, UAE</span>
</div>
</nav>

${search}`;
}

/* ---------------------------------------------------------------
   Site search overlay.

   Every page carries the same index and the same panel, so search is
   one keystroke from anywhere and never costs a round trip. Results
   are built by kernel-js from the catalogue; this is only the shell.
   --------------------------------------------------------------- */
const search = `<div class="srch" id="srch" hidden>
<div class="srch-bd" data-srch-close></div>
<div class="srch-p" role="dialog" aria-modal="true" aria-label="Search Globalex">
<form class="srch-f" role="search" onsubmit="return false">
${magnifier}
<label class="vh" for="srch-q">Search products, documents and pages</label>
<input id="srch-q" type="search" autocomplete="off" spellcheck="false" role="combobox"
 aria-expanded="false" aria-controls="srch-r" aria-autocomplete="list"
 placeholder="Search products, documents, pages&hellip;" />
<button class="srch-esc" type="button" data-srch-close aria-label="Close search">ESC</button>
</form>
<div class="srch-r" id="srch-r" role="listbox" aria-label="Search results"></div>
<div class="srch-ft">
<span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
<span><kbd>&crarr;</kbd> Open</span>
<span><kbd>esc</kbd> Close</span>
<a href="products.html">Browse all products &rarr;</a>
</div>
</div>
</div>`;

function footer() {
  return `<footer class="ftr">
<div class="wrap">
<div class="ftr-g">
<div>
<div class="mark" style="pointer-events:none">
${gul()}
<span class="mark-txt"><b>GLOBALEX</b><span>TRADING FZCO</span></span>
</div>
<p class="ftr-blurb">Registered and licensed as a freezone company under the rules and regulations of FZCO, United Arab Emirates.</p>
<div class="chips" style="margin-top:1.3rem">
<span class="chip org">FZCO Freezone</span>
<span class="chip org">Dubai Customs</span>
<span class="chip org">Dubai Chambers</span>
</div>
</div>
${footerColumns()
  .map(
    (c) => `<div class="ftr-col">
<h6>${c.title}</h6>
<ul>
${c.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("\n")}
</ul>
</div>`,
  )
  .join("\n")}
<div class="ftr-col">
<h6>Dubai Desk</h6>
<span class="ftr-line hi"><a href="tel:+97145667713">+971 4 566 7713</a></span>
<span class="ftr-line"><a href="mailto:contact@globalex.me">contact@globalex.me</a></span>
<span class="ftr-line">2605 X3 Tower, Cluster X,<br />Jumeirah Lakes Towers,<br />337622 Dubai, UAE</span>
<span class="ftr-line mono" style="margin-top:.4rem">25.0693&deg;N / 55.1413&deg;E</span>
</div>
</div>

<div class="ftr-word" aria-hidden="true">
<svg viewBox="0 0 1000 118" preserveAspectRatio="xMidYMax meet">
<text x="500" y="112" text-anchor="middle" font-size="150" textLength="1000" lengthAdjust="spacingAndGlyphs">GLOBALEX</text>
</svg>
</div>

<div class="ftr-b">
<span><span data-year>2026</span> &copy; Globalex Trading FZCO. All rights reserved.</span>
<div>
<a href="terms-conditions.html">Terms &amp; Conditions</a>
<a href="privacy-policy.html">Privacy Policy</a>
<button type="button" class="ftr-cc" data-cc-open>Cookie preferences</button>
<a href="https://www.linkedin.com/company/globalex-trading-FZCO-uae/" target="_blank" rel="noopener noreferrer">LinkedIn &nearr;</a>
</div>
</div>
</div>
</footer>`;
}

const chrome = `<div class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b><b></b></div>
<div class="rail rail-l" aria-hidden="true"><span class="rl-ix">01/01</span><span class="rl-nm"></span></div>
<div class="rail rail-r" aria-hidden="true">
<span class="pct">000</span>
<div class="gauge"><i></i></div>
<span style="writing-mode:vertical-rl;font-size:.64rem">SCROLL</span>
</div>
<div class="cur" aria-hidden="true" style="opacity:0"><div class="ring"></div><div class="dot"></div><div class="tag"></div></div>
<div class="grain" aria-hidden="true"></div>`;

const loader = `<div class="load">
<div class="load-in">
<div class="load-mark" aria-hidden="true">
<i></i><i></i><i></i>
<img src="assets/logo.webp" alt="" width="82" height="70" />
</div>
<div class="load-bar"><i></i></div>
<div class="load-txt"><span>Establishing corridor link</span><b><span data-pct>00</span>%</b></div>
</div>
</div>`;

module.exports = { gul, header, footer, chrome, loader };
