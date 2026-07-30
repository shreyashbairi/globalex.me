// Shared chrome: mark, header, search, mobile nav, footer, frame, loader.
const NAV = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["__products__", "Products"],
  ["procedures.html", "Procedures"],
  ["sustainability.html", "Sustainability"],
  ["careers.html", "Careers"],
];

/* The dropdown leads with the index page rather than jumping straight into
   Fertilizers — the header used to imply fertilizer was the whole book. */
const PRODUCTS = [
  ["products.html", "All products", "Search 24 grades"],
  ["fertilizers.html", "Fertilizers", "5 grades · Caspian origin"],
  ["polymers.html", "Polymers", "PE · PP · Additives"],
  ["industrials.html", "Industrial Chemicals", "16 specialty grades"],
];

/* The company mark — the supplied logo file, used as-is.
   Native raster is 70x60, so every placement is a whole-ratio scale of that. */
const gul = () =>
  `<img class="mark-logo" src="assets/logo.webp" alt="" width="47" height="40" />`;

const magnifier = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.75"/><path d="M15.4 15.4 21 21"/></svg>`;

function header(page) {
  const links = NAV.map(([href, label]) => {
    if (href === "__products__") {
      const cur = [
        "products",
        "fertilizers",
        "polymers",
        "industrials",
      ].includes(page);
      return `<li class="has-menu">
<a class="nl"${cur ? " data-cur" : ""} href="products.html" aria-haspopup="true">Products</a>
<div class="menu" role="menu">
${PRODUCTS.map(([h, t, s]) => `<a role="menuitem" href="${h}"><b>${t}</b><small>${s}</small></a>`).join("\n")}
</div></li>`;
    }
    const cur = href === `${page}.html`;
    return `<li><a class="nl"${cur ? ' data-cur aria-current="page"' : ""} href="${href}">${label}</a></li>`;
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
<ul class="nav-l">${links}</ul>
<a href="contact.html" class="btn btn-p btn-sm" data-mag="5">Get in touch <span class="ar">&rarr;</span></a>
</nav>
<button class="tog" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><i></i><i></i></button>
</div>
</div>
</header>

<nav id="mnav" class="mnav" aria-label="Mobile">
<a href="index.html"><i>01</i>Home</a>
<a href="about.html"><i>02</i>About</a>
<a href="products.html"><i>03</i>Products</a>
<a href="fertilizers.html"><i>04</i>Fertilizers</a>
<a href="polymers.html"><i>05</i>Polymers</a>
<a href="industrials.html"><i>06</i>Industrials</a>
<a href="procedures.html"><i>07</i>Procedures</a>
<a href="sustainability.html"><i>08</i>Sustainability</a>
<a href="careers.html"><i>09</i>Careers</a>
<a href="contact.html"><i>10</i>Contact</a>
<div class="mnav-f">
<span>info@globalex.me</span>
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
<div class="ftr-col">
<h6>Commodities</h6>
<ul>
<li><a href="products.html">All products</a></li>
<li><a href="fertilizers.html">Fertilizers</a></li>
<li><a href="polymers.html">Polymers</a></li>
<li><a href="industrials.html">Industrial Chemicals</a></li>
<li><a href="procedures.html">Trade Procedures</a></li>
<li><a href="index.html#specifications">Specifications &amp; MSDS</a></li>
</ul>
</div>
<div class="ftr-col">
<h6>Company</h6>
<ul>
<li><a href="about.html">About</a></li>
<li><a href="sustainability.html">Sustainability</a></li>
<li><a href="careers.html">Careers</a></li>
<li><a href="contact.html">Contact</a></li>
</ul>
</div>
<div class="ftr-col">
<h6>Dubai Desk</h6>
<span class="ftr-line hi"><a href="tel:+97145667713">+971 4 566 7713</a></span>
<span class="ftr-line"><a href="mailto:info@globalex.me">info@globalex.me</a></span>
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
