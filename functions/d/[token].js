/* GET /d/:token — the trackable document viewer.

   A PDF cannot report back once it leaves the server: the file is opened by
   a local reader, offline, with no callback. Tracking pixels inside a PDF
   are blocked by every mainstream reader, so the only way to answer "was it
   opened, from where, how many times" is to make the canonical delivery a
   web page we serve. That is this route.

   The page renders the PDF with pdf.js against /f/:token, which streams the
   bytes from R2 and is itself gated on the same grant. The original file is
   never at a guessable public URL. */

import { DOC_BY_ID } from '../_lib/docs.js';
import { geo, esc, now } from '../_lib/util.js';

const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174';

export async function onRequestGet(ctx) {
  const { params, env, request } = ctx;
  const token = String(params.token || '');

  if (!env.DB) return page(gone('This link cannot be checked right now.', 'Storage is offline. Try again shortly, or write to info@globalex.me.'), 503);

  const grant = await env.DB
    .prepare('SELECT * FROM grants WHERE token = ?1')
    .bind(token)
    .first();

  if (!grant) {
    return page(gone('This link is not valid.', 'It may have been mistyped. Request the document again at globalex.me and a fresh link will arrive.'), 404);
  }
  if (grant.revoked) {
    return page(gone('This link has been withdrawn.', 'Contact info@globalex.me if you still need the document.'), 410);
  }
  if (grant.expires_at < Date.now()) {
    return page(gone('This link has expired.', 'Links stay live for 30 days. Request the document again at globalex.me for a new one.'), 410);
  }

  const doc = DOC_BY_ID[grant.doc_id];
  if (!doc) return page(gone('That document is no longer published.', 'Write to info@globalex.me and we will send the current revision.'), 404);

  /* Log the open before returning the page, but off the critical path so
     the reader is never waiting on a write. */
  const g = geo(request);
  ctx.waitUntil(
    env.DB.batch([
      env.DB
        .prepare(
          `INSERT INTO doc_events (token,doc_id,email,kind,ts,ip,country,city,region,tz,ua)
           VALUES (?1,?2,?3,'open',?4,?5,?6,?7,?8,?9,?10)`
        )
        .bind(token, doc.id, grant.email, now(), g.ip, g.country, g.city, g.region, g.tz, g.ua),
      env.DB
        .prepare('UPDATE grants SET opens = opens + 1, last_open = ?2 WHERE token = ?1')
        .bind(token, now()),
    ])
  );

  return page(viewer(doc, token, grant), 200);
}

const page = (html, status) =>
  new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      /* Never cache a gated page — the next viewer of this URL must go
         through the grant check again. */
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });

/* ------------------------------------------------------------------ */

const SHELL = (title, body, head = '') => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="robots" content="noindex, nofollow" />
<meta name="theme-color" content="#04121A" />
<title>${esc(title)} — Globalex</title>
<link rel="icon" type="image/webp" href="/assets/logo.webp" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box}*{margin:0;padding:0}
:root{
  --void:#04121A;--deep:#071C27;--panel:#0A2632;--line:rgba(146,190,204,.16);
  --line-2:rgba(146,190,204,.32);--cyan:#35D6F5;--cyan-d:#0FA8C9;--sand:#D9B778;
  --frost:#E9F3F6;--haze:#B4C9D2;--haze-d:#8FAAB6;
  --f-disp:'Archivo',system-ui,sans-serif;--f-body:'Instrument Sans',system-ui,sans-serif;
  --f-mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;
  --ease:cubic-bezier(.16,1,.3,1);
}
body{font-family:var(--f-body);background:var(--void);color:var(--frost);
  -webkit-font-smoothing:antialiased;min-height:100svh;font-size:1rem}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
button{font:inherit;color:inherit;background:none;border:none;cursor:pointer}
::selection{background:var(--cyan);color:var(--void)}
${head}
</style>
</head><body>${body}</body></html>`;

function gone(headline, note) {
  return SHELL(
    'Link unavailable',
    `<main class="empty">
      <img src="/assets/logo.webp" alt="" width="70" height="60" />
      <h1>${esc(headline)}</h1>
      <p>${esc(note)}</p>
      <a class="btn" href="https://globalex.me">Go to globalex.me &rarr;</a>
    </main>`,
    `.empty{min-height:100svh;display:grid;place-content:center;justify-items:center;
      text-align:center;gap:1.1rem;padding:2rem;max-width:34rem;margin:0 auto}
     .empty img{margin-bottom:1rem}
     .empty h1{font-family:var(--f-disp);font-variation-settings:'wdth' 112;font-weight:700;
       font-size:clamp(1.5rem,4vw,2.1rem);line-height:1.15}
     .empty p{color:var(--haze);line-height:1.65}
     .btn{margin-top:1rem;padding:.85em 1.6em;background:var(--cyan);color:var(--void);
       font-weight:600;font-size:.92rem;
       clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}`
  );
}

function viewer(doc, token, grant) {
  const body = `
<header class="bar">
  <a class="mark" href="https://globalex.me">
    <img src="/assets/logo.webp" alt="Globalex" width="40" height="34" />
    <span><b>GLOBALEX</b><i>TRADING DMCC</i></span>
  </a>
  <div class="doc">
    <span class="kind" data-kind="${esc(doc.kind)}">${esc(doc.kind)}</span>
    <span class="ttl">${esc(doc.title)}</span>
  </div>
  <div class="tools">
    <div class="pager">
      <button type="button" data-prev aria-label="Previous page">&larr;</button>
      <span><b data-pg>1</b> / <span data-pgs>${doc.pages}</span></span>
      <button type="button" data-next aria-label="Next page">&rarr;</button>
    </div>
    <button type="button" class="zoom" data-zoom="-" aria-label="Zoom out">&minus;</button>
    <button type="button" class="zoom" data-zoom="+" aria-label="Zoom in">+</button>
    <a class="dl" href="/f/${esc(token)}?download=1" data-dl>Download PDF</a>
  </div>
</header>

<div class="strip">
  <span>Issued to <b>${esc(grant.email)}</b></span>
  <span class="sep"></span>
  <span>Controlled document &middot; ${esc(doc.sub)} &middot; ${esc(doc.origin)}</span>
</div>

<main class="stage" data-stage>
  <div class="load" data-load><i></i><i></i><i></i><p>Loading document</p></div>
  <div class="pages" data-pages></div>
</main>

<footer class="foot">
  <span>&copy; <span data-yr>2026</span> Globalex Trading DMCC</span>
  <span>Questions? <a href="mailto:info@globalex.me">info@globalex.me</a></span>
</footer>

<script src="${PDFJS}/pdf.min.js"></script>
<script>
(function(){
  var TOKEN = ${JSON.stringify(token)};
  var TOTAL = ${Number(doc.pages) || 1};
  document.querySelector('[data-yr]').textContent = new Date().getFullYear();

  /* ---------- telemetry ----------
     Page dwell is measured against the page we are leaving, not the one we
     arrive at, so the number is time actually spent reading it. */
  var seenFrom = Date.now(), curPage = 1;
  function beacon(kind, extra){
    var payload = Object.assign({token:TOKEN, kind:kind}, extra || {});
    var blob = new Blob([JSON.stringify(payload)], {type:'application/json'});
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', blob);
    else fetch('/api/track', {method:'POST', body:JSON.stringify(payload),
      headers:{'Content-Type':'application/json'}, keepalive:true}).catch(function(){});
  }
  function leftPage(n){
    var secs = Math.round((Date.now() - seenFrom)/1000);
    if (secs > 0 && secs < 3600) beacon('page', {page:n, seconds:secs});
    seenFrom = Date.now();
  }
  addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'hidden') leftPage(curPage);
    else seenFrom = Date.now();
  });
  addEventListener('pagehide', function(){ leftPage(curPage); });
  // A long read with no page turns would otherwise report nothing at all.
  setInterval(function(){
    if (document.visibilityState === 'visible') beacon('heartbeat', {page:curPage});
  }, 60000);

  var dl = document.querySelector('[data-dl]');
  if (dl) dl.addEventListener('click', function(){ beacon('download', {page:curPage}); });

  /* ---------- render ---------- */
  var lib = window.pdfjsLib;
  var stage = document.querySelector('[data-stage]');
  var wrap  = document.querySelector('[data-pages]');
  var load  = document.querySelector('[data-load]');
  var pgEl  = document.querySelector('[data-pg]');
  var pgsEl = document.querySelector('[data-pgs]');

  if (!lib){ fallback('This browser could not load the viewer.'); return; }
  lib.GlobalWorkerOptions.workerSrc = '${PDFJS}/pdf.worker.min.js';

  var zoom = 1, pdf = null, rendered = [];

  lib.getDocument({url:'/f/' + TOKEN, withCredentials:false}).promise.then(function(d){
    pdf = d;
    pgsEl.textContent = d.numPages;
    TOTAL = d.numPages;
    load.remove();
    var chain = Promise.resolve();
    for (var i = 1; i <= d.numPages; i++) chain = chain.then(draw.bind(null, i));
    return chain;
  }).then(function(){
    watch();
  }).catch(function(e){
    fallback('The document could not be rendered here.');
  });

  function draw(n){
    return pdf.getPage(n).then(function(p){
      var holder = document.createElement('div');
      holder.className = 'pg';
      holder.setAttribute('data-n', n);
      var cv = document.createElement('canvas');
      var tag = document.createElement('span');
      tag.className = 'pgno';
      tag.textContent = String(n).padStart(2,'0');
      holder.appendChild(cv); holder.appendChild(tag);
      wrap.appendChild(holder);

      // Render at device resolution but lay out in CSS pixels, or the sheet
      // is soft on any retina display.
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var base = p.getViewport({scale:1});
      var target = Math.min(stage.clientWidth - 48, 900) * zoom;
      var scale = target / base.width;
      var vp = p.getViewport({scale: scale * dpr});
      cv.width = vp.width; cv.height = vp.height;
      cv.style.width = (vp.width/dpr) + 'px';
      cv.style.height = (vp.height/dpr) + 'px';
      rendered.push({page:p, canvas:cv});
      return p.render({canvasContext: cv.getContext('2d'), viewport: vp}).promise;
    });
  }

  function redraw(){
    if (!pdf) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    rendered.forEach(function(r){
      var base = r.page.getViewport({scale:1});
      var target = Math.min(stage.clientWidth - 48, 900) * zoom;
      var vp = r.page.getViewport({scale: (target/base.width) * dpr});
      r.canvas.width = vp.width; r.canvas.height = vp.height;
      r.canvas.style.width = (vp.width/dpr) + 'px';
      r.canvas.style.height = (vp.height/dpr) + 'px';
      r.page.render({canvasContext: r.canvas.getContext('2d'), viewport: vp});
    });
  }

  /* Which page is "current" is whichever one covers the middle of the
     viewport — the honest answer for a continuously scrolling reader. */
  function watch(){
    var io = new IntersectionObserver(function(rows){
      rows.forEach(function(r){
        if (!r.isIntersecting) return;
        var n = +r.target.getAttribute('data-n');
        if (n === curPage) return;
        leftPage(curPage);
        curPage = n;
        pgEl.textContent = n;
      });
    }, {rootMargin:'-45% 0px -45% 0px'});
    [].forEach.call(wrap.children, function(c){ io.observe(c); });
  }

  function go(n){
    var t = wrap.querySelector('[data-n="'+n+'"]');
    if (t) t.scrollIntoView({behavior:'smooth', block:'start'});
  }
  document.querySelector('[data-prev]').addEventListener('click', function(){ go(Math.max(1, curPage-1)); });
  document.querySelector('[data-next]').addEventListener('click', function(){ go(Math.min(TOTAL, curPage+1)); });
  [].forEach.call(document.querySelectorAll('[data-zoom]'), function(b){
    b.addEventListener('click', function(){
      zoom = Math.min(2, Math.max(.6, zoom + (b.getAttribute('data-zoom')==='+' ? .2 : -.2)));
      redraw();
    });
  });
  addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight' || e.key === 'PageDown'){ e.preventDefault(); go(Math.min(TOTAL, curPage+1)); }
    if (e.key === 'ArrowLeft'  || e.key === 'PageUp'){ e.preventDefault(); go(Math.max(1, curPage-1)); }
  });
  var rt; addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(redraw, 220); }, {passive:true});

  /* If pdf.js cannot run, the reader still gets the file — the viewer is a
     tracking surface, not a paywall. */
  function fallback(msg){
    if (load) load.remove();
    wrap.innerHTML = '<div class="fb"><p>' + msg + '</p>'
      + '<a class="btn" href="/f/' + TOKEN + '?download=1">Download the PDF instead &rarr;</a></div>';
  }
})();
</script>`;

  const style = `
.bar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:1.2rem;
  padding:.8rem clamp(.9rem,2.6vw,1.6rem);background:rgba(4,18,26,.94);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid var(--line);flex-wrap:wrap}
.mark{display:flex;align-items:center;gap:.6rem;flex:none}
.mark span{display:grid;line-height:1.1}
.mark b{font-family:var(--f-disp);font-variation-settings:'wdth' 112;font-weight:700;
  font-size:.86rem;letter-spacing:.13em}
.mark i{font-family:var(--f-mono);font-style:normal;font-size:.6rem;letter-spacing:.2em;color:var(--haze-d)}
.doc{display:flex;align-items:center;gap:.7rem;min-width:0;flex:1}
.kind{font-family:var(--f-mono);font-size:.67rem;letter-spacing:.16em;padding:.3em .6em;flex:none;
  border:1px solid rgba(53,214,245,.32);color:var(--cyan);background:rgba(53,214,245,.08)}
.kind[data-kind=TDS],.kind[data-kind=SPEC]{color:var(--sand);border-color:rgba(217,183,120,.36);
  background:rgba(217,183,120,.1)}
.ttl{font-weight:600;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tools{display:flex;align-items:center;gap:.5rem;flex:none}
.pager{display:flex;align-items:center;gap:.5rem;font-family:var(--f-mono);font-size:.76rem;
  color:var(--haze);padding-right:.4rem}
.pager b{color:var(--cyan)}
.pager button,.zoom{width:30px;height:30px;display:grid;place-items:center;border:1px solid var(--line);
  color:var(--haze);transition:border-color .3s,color .3s,background .3s}
.pager button:hover,.zoom:hover{border-color:var(--cyan);color:var(--cyan);background:rgba(53,214,245,.08)}
.dl{padding:.6em 1.05em;background:var(--cyan);color:var(--void);font-weight:600;font-size:.79rem;
  white-space:nowrap;
  clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
  transition:background .3s}
.dl:hover{background:var(--frost)}
@media (max-width:720px){.doc{order:3;width:100%;flex:none}.tools{margin-left:auto}}

.strip{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap;
  padding:.55rem clamp(.9rem,2.6vw,1.6rem);background:rgba(10,38,50,.6);
  border-bottom:1px solid var(--line);font-family:var(--f-mono);font-size:.69rem;
  letter-spacing:.1em;color:var(--haze-d);text-transform:uppercase}
.strip b{color:var(--haze);font-weight:500}
.sep{width:1px;height:11px;background:var(--line-2)}

.stage{padding:clamp(1.1rem,3vw,2.2rem) 1rem 3rem;
  background:radial-gradient(120% 70% at 50% 0,rgba(53,214,245,.05),transparent 60%)}
.pages{display:grid;gap:clamp(1rem,2.4vw,1.8rem);justify-items:center}
.pg{position:relative;box-shadow:0 18px 50px rgba(0,0,0,.5);border:1px solid var(--line);
  background:#fff;line-height:0}
.pg canvas{display:block}
.pgno{position:absolute;top:0;left:-2.4rem;font-family:var(--f-mono);font-size:.69rem;
  color:var(--haze-d);letter-spacing:.14em;line-height:1;padding-top:.4rem}
@media (max-width:900px){.pgno{display:none}}

.load{display:grid;justify-items:center;gap:.5rem;padding:5rem 0;position:relative}
.load i{position:absolute;top:4rem;width:54px;height:54px;border:1px solid var(--cyan);
  transform:rotate(45deg) scale(.4);opacity:0;animation:ring 1.5s var(--ease) infinite}
.load i:nth-child(2){animation-delay:.25s}
.load i:nth-child(3){animation-delay:.5s}
.load p{margin-top:7.2rem;font-family:var(--f-mono);font-size:.755rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--cyan)}
@keyframes ring{0%{opacity:0;transform:rotate(45deg) scale(.3)}
  40%{opacity:.7}100%{opacity:0;transform:rotate(45deg) scale(1.15)}}

.fb{display:grid;justify-items:center;gap:1.2rem;padding:4rem 1rem;text-align:center}
.fb p{color:var(--haze)}
.btn{padding:.85em 1.6em;background:var(--cyan);color:var(--void);font-weight:600;font-size:.92rem;
  clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}

.foot{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;
  padding:1.1rem clamp(.9rem,2.6vw,1.6rem);border-top:1px solid var(--line);
  font-family:var(--f-mono);font-size:.69rem;letter-spacing:.1em;color:var(--haze-d)}
.foot a{color:var(--cyan)}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms !important;
  transition-duration:.01ms !important;scroll-behavior:auto !important}}
`;

  return SHELL(doc.title, body, style);
}
