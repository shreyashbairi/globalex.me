/* Per-post page. A factory returning the same shape a page module exports, so
   build.js#emit() treats it identically to an authored page. */

const { hero, cta } = require("./parts");
const { plain } = require("./catalogue");
const { sorted, url } = require("./news");
const S = require("./schema-org");

const CSS = `
.np{max-width:65ch}
.np-by{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;padding-bottom:1.2rem;
  margin-bottom:1.8rem;border-bottom:1px solid var(--line);font-family:var(--f-mono);
  font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--haze-d)}
.np p{color:#C6D8DF;margin-bottom:1.1rem;line-height:1.65}
.np h3{font-size:var(--t-h4);margin:2rem 0 .7rem}
.np ul{display:grid;gap:.5rem;margin:0 0 1.2rem 1.1rem;color:var(--haze)}
.np ul li{list-style:disc}
.np-more{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(.9rem,1.8vw,1.3rem)}
@media (max-width:820px){.np-more{grid-template-columns:1fr}}
.np-c{display:flex;flex-direction:column;gap:.5rem;padding:clamp(1.1rem,2.2vw,1.5rem);
  border:1px solid var(--line);background:rgba(var(--deep-rgb),.5);
  transition:border-color .4s var(--ease),transform .4s var(--ease)}
.np-c:hover{border-color:var(--line-2);transform:translateY(-3px)}
.np-c b{font-family:var(--f-disp);font-weight:700;font-size:1.04rem;
  font-variation-settings:'wdth' 106;color:var(--frost)}
.np-c time{font-family:var(--f-mono);font-size:.68rem;letter-spacing:.13em;color:var(--haze-d)}
.np-c span{margin-top:auto;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;
  text-transform:uppercase;color:var(--cyan)}
`;

const fmt = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });

module.exports = function newsPost(post) {
  const others = sorted().filter((p) => p.id !== post.id).slice(0, 3);
  const CRUMB = [["News", "news.html"], plain(post.title)];

  return {
    page: url(post).replace(/\.html$/, ""),
    tier: "company",
    nav: "company",
    crumb: CRUMB,
    draft: post.DRAFT === true,
    title: `${plain(post.title)} — Globalex Trading FZCO`,
    desc: plain(post.summary).slice(0, 155).replace(/\s+\S*$/, ""),
    jsonld: S.newsArticle({ ...post, url: url(post) }, {
      site: "https://globalex.me",
      url: (u) => `https://globalex.me/${String(u).replace(/\.html$/, "")}`,
    }),
    css: CSS,
    body: `
${hero({
  crumb: CRUMB,
  eyebrow: post.kind,
  h1: post.title,
  lead: post.summary,
  sec: "News",
})}

<section class="sec is-tight" data-sec="Post">
<div class="wrap">
<article class="np rv">
<div class="np-by">
<span class="chip spec">${post.kind}</span>
<time datetime="${post.date}">${fmt(post.date)}</time>
<span>Globalex Trading desk</span>
</div>
${post.body}
</article>
</div>
</section>

${
  others.length
    ? `<section class="sec sec-panel" data-sec="More">
<div class="wrap">
<div class="hd"><span class="eb">More from the desk</span><h2>Recent notes</h2></div>
<div class="np-more rvs">
${others
  .map(
    (p) => `<a class="np-c nch-s" href="${url(p)}">
<time datetime="${p.date}">${fmt(p.date)} &middot; ${p.kind}</time>
<b>${p.title}</b>
<span>Read &rarr;</span>
</a>`,
  )
  .join("\n")}
</div>
</div>
</section>`
    : ""
}

${cta({
  eyebrow: "The desk",
  h2: "Working a position in one of these grades?",
  lead: "Tell us the tonnage, the port and the window and you get one reply with an indication.",
  primary: ["Contact the desk", "contact.html"],
})}`,
  };
};
