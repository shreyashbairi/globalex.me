// Shared runtime — inlined into every page.
const { searchIndex } = require('./catalogue');

module.exports = `
(function(){
'use strict';
/* The whole site index, ~9 KB, inlined rather than fetched: search has to
   answer on the first keystroke, and a request per page load to serve 50
   rows would cost more than shipping them. */
var GLXSEARCH = ${JSON.stringify(searchIndex())};
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
var TOUCH = matchMedia('(hover: none)').matches || innerWidth < 901;
var PAL = {cyan:'53,214,245', sand:'217,183,120'};

/* ---------- procedural film grain ---------- */
(function(){
  var n = 128, c = document.createElement('canvas');
  c.width = c.height = n;
  var x = c.getContext('2d'), d = x.createImageData(n,n), p = d.data;
  for (var i=0;i<p.length;i+=4){
    var v = (Math.random()*255)|0;
    p[i]=p[i+1]=p[i+2]=v; p[i+3]=26;
  }
  x.putImageData(d,0,0);
  document.documentElement.style.setProperty('--noise','url('+c.toDataURL()+')');
})();

/* ---------- preloader ---------- */
(function(){
  var el = document.querySelector('.load');
  if (!el) return;
  var bar = el.querySelector('.load-bar i'), pct = el.querySelector('[data-pct]');
  var p = 0, done = false, floor = RM ? 1 : 1500, t0 = performance.now();
  function finish(){
    if (done) return; done = true;
    p = 100; if (bar) bar.style.width = '100%'; if (pct) pct.textContent = '100';
    setTimeout(function(){
      el.setAttribute('data-done','');
      document.body.removeAttribute('data-lock');
      document.dispatchEvent(new Event('glx:ready'));
      setTimeout(function(){ el.remove(); }, 800);
    }, RM ? 0 : 340);
  }
  function tick(){
    if (done) return;
    var el2 = performance.now() - t0;
    var target = Math.min(96, (el2 / floor) * 100);
    p += (target - p) * 0.16;
    if (bar) bar.style.width = p.toFixed(1) + '%';
    if (pct) pct.textContent = String(Math.round(p)).padStart(2,'0');
    requestAnimationFrame(tick);
  }
  document.body.setAttribute('data-lock','');
  tick();
  // Gate on DOM + fonts only. Waiting on window.load would hold the curtain
  // for third-party embeds (the map on contact.html) that nobody is looking at yet.
  var ready = Promise.all([
    new Promise(function(r){
      if (document.readyState !== 'loading') r();
      else addEventListener('DOMContentLoaded', r, {once:true});
    }),
    (document.fonts ? document.fonts.ready : Promise.resolve())
  ]);
  ready.then(function(){
    var wait = Math.max(0, floor - (performance.now() - t0));
    setTimeout(finish, wait);
  });
  setTimeout(finish, 3500);
})();

/* ---------- custom cursor ---------- */
(function(){
  if (TOUCH || RM) return;
  var cur = document.querySelector('.cur');
  if (!cur) return;
  var dot = cur.querySelector('.dot'), ring = cur.querySelector('.ring'), tag = cur.querySelector('.tag');
  var mx = innerWidth/2, my = innerHeight/2, dx = mx, dy = my, rx = mx, ry = my, vis = false;
  addEventListener('pointermove', function(e){
    mx = e.clientX; my = e.clientY;
    if (!vis){ vis = true; cur.style.opacity = '1'; }
  }, {passive:true});
  addEventListener('pointerdown', function(){ cur.setAttribute('data-hot',''); });
  addEventListener('pointerup', function(){ if (!cur.dataset.lockHot) cur.removeAttribute('data-hot'); });
  (function loop(){
    dx += (mx-dx)*.42; dy += (my-dy)*.42;
    rx += (mx-rx)*.14; ry += (my-ry)*.14;
    dot.style.transform = 'translate('+dx+'px,'+dy+'px) translate(-50%,-50%) rotate(45deg)';
    ring.style.transform = 'translate('+rx+'px,'+ry+'px) translate(-50%,-50%) rotate(45deg)';
    if (tag) tag.style.transform = 'translate('+rx+'px,'+(ry+30)+'px) translate(-50%,0)';
    requestAnimationFrame(loop);
  })();
  var HOT = 'a,button,input,select,textarea,label,[data-cur],summary';
  document.addEventListener('pointerover', function(e){
    var t = e.target.closest ? e.target.closest(HOT) : null;
    if (!t) return;
    cur.setAttribute('data-hot',''); cur.dataset.lockHot = '1';
    var label = t.getAttribute('data-cur');
    if (label && tag){ tag.textContent = label; cur.setAttribute('data-tag',''); }
  });
  document.addEventListener('pointerout', function(e){
    var t = e.target.closest ? e.target.closest(HOT) : null;
    if (!t) return;
    cur.removeAttribute('data-hot'); delete cur.dataset.lockHot;
    cur.removeAttribute('data-tag');
  });
})();

/* ---------- magnetic elements ---------- */
(function(){
  if (TOUCH || RM) return;
  [].forEach.call(document.querySelectorAll('[data-mag]'), function(el){
    var raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
    function run(){
      cx += (tx-cx)*.16; cy += (ty-cy)*.16;
      el.style.transform = 'translate('+cx.toFixed(2)+'px,'+cy.toFixed(2)+'px)';
      if (Math.abs(tx-cx) > .1 || Math.abs(ty-cy) > .1) raf = requestAnimationFrame(run);
      else { el.style.transform = 'translate('+tx+'px,'+ty+'px)'; raf = null; }
    }
    function kick(){ if (!raf) raf = requestAnimationFrame(run); }
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect(), s = parseFloat(el.getAttribute('data-mag')) || 8;
      tx = ((e.clientX - r.left)/r.width - .5) * s * 2;
      ty = ((e.clientY - r.top)/r.height - .5) * s * 2;
      kick();
    });
    el.addEventListener('pointerleave', function(){ tx = 0; ty = 0; kick(); });
  });
})();

/* ---------- header ---------- */
(function(){
  var h = document.querySelector('.hdr');
  if (!h) return;
  var last = 0;
  function upd(){
    var y = scrollY;
    if (y > 40) h.setAttribute('data-solid',''); else h.removeAttribute('data-solid');
    if (y > 320 && y > last + 4) h.setAttribute('data-hide','');
    else if (y < last - 4 || y < 320) h.removeAttribute('data-hide');
    last = y;
  }
  addEventListener('scroll', upd, {passive:true}); upd();
})();

/* ---------- mobile nav ---------- */
(function(){
  var tog = document.querySelector('.tog'), nav = document.getElementById('mnav');
  if (!tog || !nav) return;
  function set(open){
    tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) nav.setAttribute('data-open',''); else nav.removeAttribute('data-open');
    if (open) document.body.setAttribute('data-lock',''); else document.body.removeAttribute('data-lock');
  }
  tog.addEventListener('click', function(){ set(tog.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function(e){ if (e.target.closest('a')) set(false); });
  addEventListener('keydown', function(e){ if (e.key === 'Escape') set(false); });
})();

/* ---------- site search ----------
   Every product, document and page is in GLXSEARCH with a pre-lowercased
   haystack, so a query is a scan of ~50 short strings — fast enough to run
   on every keystroke without debouncing, and it works offline. */
(function(){
  var panel = document.getElementById('srch');
  if (!panel) return;
  var box  = document.getElementById('srch-q');
  var out  = document.getElementById('srch-r');
  var hits = [], sel = -1, lastFocus = null;

  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  /* Highlight by index, not by regex — a query like "Al2(SO4)3" is a perfectly
     reasonable thing to type and a perfectly broken regex. */
  function hl(text, terms){
    var low = text.toLowerCase(), marks = [];
    terms.forEach(function(q){
      var i = low.indexOf(q);
      while (i > -1){ marks.push([i, i + q.length]); i = low.indexOf(q, i + q.length); }
    });
    if (!marks.length) return esc(text);
    marks.sort(function(a,b){ return a[0]-b[0]; });
    var merged = [marks[0]];
    marks.slice(1).forEach(function(m){
      var last = merged[merged.length-1];
      if (m[0] <= last[1]) last[1] = Math.max(last[1], m[1]); else merged.push(m);
    });
    var html = '', at = 0;
    merged.forEach(function(m){
      html += esc(text.slice(at, m[0])) + '<mark>' + esc(text.slice(m[0], m[1])) + '</mark>';
      at = m[1];
    });
    return html + esc(text.slice(at));
  }

  /* Every term must land somewhere, so extra words narrow the result set.
     A title hit outranks a body hit, and a title that starts with the term
     outranks one that merely contains it. */
  function score(it, terms){
    var t = it.t.toLowerCase(), s = 0, titled = false;
    for (var i = 0; i < terms.length; i++){
      var q = terms[i], at = t.indexOf(q);
      if (at === 0){ s += 70; titled = true; }
      else if (at > 0){ s += 42; titled = true; }
      else if (it.h.indexOf(q) > -1) s += 14;
      else return -1;
    }
    if (t === terms.join(' ')) s += 80;
    if (titled && it.k === 'Commodity class') s += 8;
    /* Matched only in the body? Then the specific grade is the better answer
       than the class that contains it — "HDPE" should land on Polyethylene,
       not on Polymers. */
    else if (!titled && it.k !== 'Commodity class') s += 2;
    return s;
  }

  var GROUP = {documents:'Documents', company:'Pages'};
  function groupOf(it){ return GROUP[it.c] || 'Products'; }

  function suggestions(){
    return GLXSEARCH.filter(function(it){
      return it.k === 'Commodity class' || it.t === 'Specifications & MSDS' || it.t === 'Products';
    }).slice(0, 5);
  }

  function render(q){
    var terms = q ? q.toLowerCase().split(/\\s+/).filter(Boolean) : [];
    var head = '';

    if (!terms.length){
      hits = suggestions();
      head = 'Jump to';
    } else {
      hits = GLXSEARCH
        .map(function(it){ return {it: it, s: score(it, terms)}; })
        .filter(function(r){ return r.s >= 0; })
        .sort(function(a, b){ return b.s - a.s; })
        .slice(0, 12)
        .map(function(r){ return r.it; });
    }

    box.setAttribute('aria-expanded', hits.length ? 'true' : 'false');

    if (!hits.length){
      out.innerHTML = '<div class="srch-none"><b>Nothing matches &ldquo;' + esc(q) + '&rdquo;</b>'
        + 'We trade well beyond what is listed here &mdash; '
        + '<a href="contact.html">ask the desk</a> what you need.</div>';
      sel = -1;
      return;
    }

    var html = '', group = null;
    hits.forEach(function(it, i){
      var g = head || groupOf(it);
      if (g !== group){ html += '<div class="srch-g">' + esc(g) + '</div>'; group = g; }
      html += '<a class="srch-o" role="option" aria-selected="false" href="' + esc(it.u) + '" data-i="' + i + '">'
        + '<b>' + hl(it.t, terms) + '</b>'
        + '<i>' + esc(it.k) + '</i>'
        + '<small>' + esc(it.d) + '</small></a>';
    });
    out.innerHTML = html;
    mark(0);
  }

  function mark(i){
    var opts = out.querySelectorAll('.srch-o');
    if (!opts.length){ sel = -1; return; }
    sel = (i + opts.length) % opts.length;
    [].forEach.call(opts, function(o, k){
      o.toggleAttribute('data-on', k === sel);
      o.setAttribute('aria-selected', k === sel ? 'true' : 'false');
    });
    var on = opts[sel];
    if (on.scrollIntoView) on.scrollIntoView({block:'nearest'});
  }

  function open(){
    lastFocus = document.activeElement;
    panel.hidden = false;
    render('');
    requestAnimationFrame(function(){
      panel.setAttribute('data-open','');
      document.body.setAttribute('data-lock','');
      box.focus(); box.select();
    });
  }
  function close(){
    panel.removeAttribute('data-open');
    document.body.removeAttribute('data-lock');
    setTimeout(function(){ panel.hidden = true; }, 340);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  [].forEach.call(document.querySelectorAll('[data-srch-open]'), function(b){
    b.addEventListener('click', open);
  });
  [].forEach.call(panel.querySelectorAll('[data-srch-close]'), function(b){
    b.addEventListener('click', close);
  });

  box.addEventListener('input', function(){ render(box.value.trim()); });

  box.addEventListener('keydown', function(e){
    if (e.key === 'ArrowDown'){ e.preventDefault(); mark(sel + 1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); mark(sel - 1); }
    else if (e.key === 'Enter'){
      e.preventDefault();
      var on = out.querySelector('.srch-o[data-on]');
      // No match to pick? Hand the query to the products page rather than
      // dead-ending on an empty panel.
      if (on) location.href = on.getAttribute('href');
      else if (box.value.trim()) location.href = 'products.html?q=' + encodeURIComponent(box.value.trim());
    }
  });

  // Pointer selection has to agree with the keyboard cursor, or Enter opens
  // something other than the row under the mouse.
  out.addEventListener('mousemove', function(e){
    var o = e.target.closest('.srch-o');
    if (o) mark(+o.getAttribute('data-i'));
  });

  addEventListener('keydown', function(e){
    var open_ = panel.hasAttribute('data-open');
    if (open_ && e.key === 'Escape'){ e.preventDefault(); close(); return; }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')){
      e.preventDefault();
      open_ ? close() : open();
      return;
    }
    // "/" is the web's other search shortcut, but only when the visitor is
    // not already typing into something.
    if (!open_ && e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey){
      var a = document.activeElement, tag = a ? a.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (a && a.isContentEditable)) return;
      e.preventDefault(); open();
    }
  });
})();

/* ---------- reveal ---------- */
(function(){
  var SEL = '.rv,.rvs,.kin,[data-stat]';

  function show(el){
    el.setAttribute('data-in','');
    if (el.hasAttribute('data-stat')) count(el);
  }

  /* No observer: reveal everything outright, but still publish glxReveal so
     callers do not have to care which branch they landed in. */
  if (!('IntersectionObserver' in window)){
    window.glxReveal = function(root){
      [].forEach.call((root || document).querySelectorAll(SEL), function(e){ show(e); });
    };
    window.glxReveal(document);
    return;
  }

  var io = new IntersectionObserver(function(rows){
    rows.forEach(function(r){
      if (!r.isIntersecting) return;
      show(r.target);
      io.unobserve(r.target);
    });
  }, {rootMargin:'0px 0px -12% 0px', threshold:.12});

  /* The -12% bottom margin is right for scroll-triggered reveals, but it would
     strand anything already on screen at load (hero CTAs, for one). Reveal the
     first screenful outright and observe only what is genuinely below it.

     Published, because this list used to be snapshotted once at parse time:
     anything injected or unhidden afterwards never revealed, and an injected
     [data-stat] never counted up. Call glxReveal(container) after inserting
     or unhiding content. Nodes already revealed are skipped and re-observing
     is a no-op, so calling it repeatedly on overlapping roots is safe. */
  window.glxReveal = function(root){
    [].forEach.call((root || document).querySelectorAll(SEL), function(e){
      if (e.hasAttribute('data-in')) return;
      if (e.getBoundingClientRect().top < innerHeight) show(e);
      else io.observe(e);
    });
  };
  window.glxReveal(document);

  function count(el){
    var node = el.querySelector('[data-to]');
    if (!node) return;
    var to = parseFloat(node.getAttribute('data-to')), dur = +node.getAttribute('data-dur') || 1500;
    var pad = node.getAttribute('data-pad') === '1';
    if (RM){ node.textContent = pad ? String(to).padStart(2,'0') : to; return; }
    var t0 = performance.now();
    (function step(t){
      var k = Math.min(1, (t-t0)/dur), e = 1 - Math.pow(1-k, 3);
      var v = Math.round(to * e);
      node.textContent = pad ? String(v).padStart(2,'0') : v;
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
})();

/* ---------- kinetic headline split ---------- */
(function(){
  [].forEach.call(document.querySelectorAll('.kin'), function(el){
    if (el.dataset.split) return;
    el.dataset.split = '1';
    var i = 0;
    function walk(node){
      var kids = [].slice.call(node.childNodes);
      kids.forEach(function(n){
        if (n.nodeType === 3){
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\\s+)/).forEach(function(tok){
            if (!tok) return;
            if (/^\\s+$/.test(tok)){ frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('i');
            inner.style.setProperty('--i', i++);
            inner.textContent = tok;
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) {
          walk(n);
        }
      });
    }
    walk(el);
  });
})();

/* ---------- rails: section index + scroll gauge ---------- */
(function(){
  var railL = document.querySelector('.rail-l'), fill = document.querySelector('.rail-r .gauge i'),
      pct = document.querySelector('.rail-r .pct');
  var secs = [].slice.call(document.querySelectorAll('[data-sec]'));
  if (railL && secs.length){
    var ixEl = railL.querySelector('.rl-ix'), nmEl = railL.querySelector('.rl-nm');
    var total = String(secs.length).padStart(2,'0');
    function mark(i){
      ixEl.textContent = String(i+1).padStart(2,'0') + '/' + total;
      nmEl.textContent = secs[i].getAttribute('data-sec');
    }
    mark(0);
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(rows){
        rows.forEach(function(r){
          if (!r.isIntersecting) return;
          var i = secs.indexOf(r.target);
          if (i >= 0) mark(i);
        });
      }, {rootMargin:'-45% 0px -45% 0px'});
      secs.forEach(function(s){ io.observe(s); });
    }
  }
  function upd(){
    var max = document.documentElement.scrollHeight - innerHeight;
    var k = max > 0 ? Math.min(1, scrollY / max) : 0;
    if (fill) fill.style.height = (k*100).toFixed(1) + '%';
    if (pct) pct.textContent = String(Math.round(k*100)).padStart(3,'0');
  }
  addEventListener('scroll', upd, {passive:true});
  addEventListener('resize', upd); upd();
})();

/* ---------- canvas helper: DPR-aware sizing + visibility gating ---------- */
function stage(cv, draw){
  var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = 1, live = true, raf = null;
  function size(){
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return true;
  }
  if (!size()) return null;
  addEventListener('resize', function(){ size(); }, {passive:true});
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(r){ live = r[0].isIntersecting; })
      .observe(cv);
  }
  var api = {ctx:ctx, get w(){return w}, get h(){return h}, dpr:dpr};
  (function loop(t){
    raf = requestAnimationFrame(loop);
    if (!live || !w) return;
    draw(ctx, w, h, t*0.001);
  })(0);
  return api;
}
window.glxStage = stage;

/* ---------- ornament field: tessellated Caspian gül, drawn procedurally ---------- */
function gulTile(size, rgb, alpha){
  var c = document.createElement('canvas'), s = size;
  c.width = c.height = s;
  var x = c.getContext('2d'), m = s/2;
  x.translate(m,m);
  x.strokeStyle = 'rgba('+rgb+','+alpha+')';
  x.fillStyle = 'rgba('+rgb+','+(alpha*1.5)+')';
  x.lineWidth = 1;
  // concentric rotated squares — the medallion frame
  [s*0.40, s*0.27, s*0.15].forEach(function(r, i){
    x.beginPath();
    x.moveTo(0,-r); x.lineTo(r,0); x.lineTo(0,r); x.lineTo(-r,0); x.closePath();
    x.globalAlpha = i === 1 ? .55 : 1;
    x.stroke();
  });
  x.globalAlpha = 1;
  // beaded arms on the diagonals — the ornament's dotted strokes
  for (var a=0;a<4;a++){
    x.save(); x.rotate(a*Math.PI/2 + Math.PI/4);
    for (var d = s*0.10; d <= s*0.45; d += s*0.055){
      x.beginPath(); x.arc(d, 0, .95, 0, 6.2832); x.fill();
    }
    // hooked terminal
    x.beginPath();
    x.moveTo(s*0.45, 0); x.lineTo(s*0.47, -s*0.05); x.lineTo(s*0.41, -s*0.055);
    x.stroke();
    x.restore();
  }
  // core diamond
  x.beginPath();
  var k = s*0.055;
  x.moveTo(0,-k); x.lineTo(k,0); x.lineTo(0,k); x.lineTo(-k,0); x.closePath();
  x.globalAlpha = 1; x.fill();
  return c;
}

function ornamentField(cv, opt){
  opt = opt || {};
  var rgb = PAL[opt.tone || 'cyan'];
  var tileSize = opt.tile || 132;
  var tile = gulTile(tileSize, rgb, opt.alpha || .30);
  var pat = null, nodes = [], mx = .5, my = .5, cmx = .5, cmy = .5;
  var n = opt.nodes == null ? 7 : opt.nodes;
  for (var i=0;i<n;i++){
    nodes.push({x:Math.random(), y:Math.random(), ph:Math.random()*6.28, sp:.5+Math.random()*.9});
  }
  if (!TOUCH){
    addEventListener('pointermove', function(e){
      mx = e.clientX/innerWidth; my = e.clientY/innerHeight;
    }, {passive:true});
  }
  return stage(cv, function(x, w, h, t){
    x.clearRect(0,0,w,h);
    if (!pat) pat = x.createPattern(tile,'repeat');
    cmx += (mx-cmx)*.045; cmy += (my-cmy)*.045;
    var px = (cmx-.5)*-46, py = (cmy-.5)*-30;
    var rot = RM ? 0 : t*0.012;

    // ornament plane, parallaxed + slowly rotating, radially masked
    x.save();
    x.translate(w/2 + px, h/2 + py);
    x.rotate(rot);
    x.fillStyle = pat;
    var R = Math.hypot(w,h);
    x.translate(-R/2, -R/2);
    x.fillRect(0,0,R,R);
    x.restore();

    // radial vignette mask keeps the pattern a whisper at the edges
    var g = x.createRadialGradient(w*0.5+px*.4, h*0.42+py*.4, 0, w*0.5, h*0.5, R*0.52);
    g.addColorStop(0,'rgba(15,42,56,0)');
    g.addColorStop(.55,'rgba(15,42,56,.5)');
    g.addColorStop(1,'rgba(15,42,56,.97)');
    x.fillStyle = g; x.fillRect(0,0,w,h);

    // live nodes — diamond markers with breathing halo
    nodes.forEach(function(nd){
      var bx = nd.x*w + px*1.5, by = nd.y*h + py*1.5;
      var pulse = RM ? .6 : (Math.sin(t*nd.sp + nd.ph)*.5+.5);
      var r = 3 + pulse*2.4;
      x.save();
      x.translate(bx, by); x.rotate(Math.PI/4);
      x.fillStyle = 'rgba('+rgb+','+(.28+pulse*.5)+')';
      x.fillRect(-r/2,-r/2,r,r);
      x.restore();
      var hg = x.createRadialGradient(bx,by,0,bx,by,26+pulse*20);
      hg.addColorStop(0,'rgba('+rgb+','+(.16+pulse*.12)+')');
      hg.addColorStop(1,'rgba('+rgb+',0)');
      x.fillStyle = hg;
      x.beginPath(); x.arc(bx,by,26+pulse*20,0,6.2832); x.fill();
    });

    // scanning sweep — a slow instrument pass
    if (!RM){
      var sy = ((t*0.055) % 1.4 - .2) * h;
      var sg = x.createLinearGradient(0, sy-90, 0, sy+90);
      sg.addColorStop(0,'rgba('+rgb+',0)');
      sg.addColorStop(.5,'rgba('+rgb+',.055)');
      sg.addColorStop(1,'rgba('+rgb+',0)');
      x.fillStyle = sg; x.fillRect(0, sy-90, w, 180);
    }
  });
}
window.glxOrnament = ornamentField;

/* ---------- lattice field: drifting nodes + proximity links (CTA plates) ---------- */
function latticeField(cv, opt){
  opt = opt || {};
  var rgb = PAL[opt.tone || 'cyan'];
  var pts = [], N = opt.count || 34;
  for (var i=0;i<N;i++){
    pts.push({x:Math.random(), y:Math.random(),
      vx:(Math.random()-.5)*.00016, vy:(Math.random()-.5)*.00016,
      s:.7+Math.random()*1.5});
  }
  return stage(cv, function(x, w, h, t){
    x.clearRect(0,0,w,h);
    pts.forEach(function(p){
      if (!RM){ p.x += p.vx; p.y += p.vy; }
      if (p.x<0||p.x>1) p.vx*=-1; if (p.y<0||p.y>1) p.vy*=-1;
    });
    // links
    x.lineWidth = 1;
    for (var i=0;i<pts.length;i++){
      for (var j=i+1;j<pts.length;j++){
        var ax=pts[i].x*w, ay=pts[i].y*h, bx=pts[j].x*w, by=pts[j].y*h;
        var d = Math.hypot(ax-bx, ay-by), lim = Math.min(w,h)*0.30;
        if (d < lim){
          x.strokeStyle = 'rgba('+rgb+','+(.16*(1-d/lim)).toFixed(3)+')';
          x.beginPath(); x.moveTo(ax,ay); x.lineTo(bx,by); x.stroke();
        }
      }
    }
    // diamond nodes
    pts.forEach(function(p, i){
      var bx = p.x*w, by = p.y*h;
      var pulse = RM ? .5 : (Math.sin(t*.8 + i)*.5+.5);
      var r = p.s * (1.8 + pulse*1.1);
      x.save(); x.translate(bx,by); x.rotate(Math.PI/4);
      x.fillStyle = 'rgba('+rgb+','+(.35+pulse*.4)+')';
      x.fillRect(-r,-r,r*2,r*2);
      x.restore();
    });
  });
}
window.glxLattice = latticeField;

/* ---------- boot page canvases ---------- */
function boot(){
  [].forEach.call(document.querySelectorAll('[data-orn]'), function(cv){
    ornamentField(cv, {tone: cv.getAttribute('data-orn') || 'cyan',
      tile: +cv.getAttribute('data-tile') || 132,
      nodes: cv.hasAttribute('data-nodes') ? +cv.getAttribute('data-nodes') : 7,
      alpha: +cv.getAttribute('data-alpha') || .30});
  });
  [].forEach.call(document.querySelectorAll('[data-lat]'), function(cv){
    latticeField(cv, {tone: cv.getAttribute('data-lat') || 'cyan',
      count: +cv.getAttribute('data-count') || 34});
  });
  if (window.glxPage) try { window.glxPage(); } catch(e){ console.warn('page init', e); }
}
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot); else boot();

/* ---------- year stamp ---------- */
[].forEach.call(document.querySelectorAll('[data-year]'), function(e){
  e.textContent = new Date().getFullYear();
});

/* ---------- forms ----------
   Post to the API when there is one. Opened straight off disk, or with the
   backend down, fall back to the visitor's mail client rather than
   swallowing the message — either way it reaches info@globalex.me. */
[].forEach.call(document.querySelectorAll('form[data-mailto]'), function(f){
  var btn = f.querySelector('button[type=submit]');
  var note = f.querySelector('[data-sent]');
  var label = btn ? btn.innerHTML : '';

  function fields(){
    var out = [];
    [].forEach.call(f.elements, function(el){
      if (!el.name || el.type === 'file' || el.type === 'submit' || el.type === 'hidden') return;
      var lab = f.querySelector('label[for="'+el.id+'"]');
      out.push([lab ? lab.textContent.trim() : el.name, el.value]);
    });
    return out;
  }

  function toMail(rows){
    var to = f.getAttribute('data-mailto');
    var subj = f.getAttribute('data-subject') || 'Website enquiry';
    location.href = 'mailto:'+to+'?subject='+encodeURIComponent(subj)
      +'&body='+encodeURIComponent(rows.map(function(r){ return r[0]+': '+r[1]; }).join('\\n'));
  }

  function say(msg, bad){
    if (!note) return;
    note.textContent = msg;
    note.style.color = bad ? 'var(--sand)' : 'var(--cyan)';
  }

  f.addEventListener('submit', function(e){
    e.preventDefault();
    if (!f.checkValidity()){ f.reportValidity(); return; }

    var rows = fields();
    if (btn){ btn.disabled = true; btn.innerHTML = 'Sending&hellip;'; }
    say('');

    fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        kind: f.getAttribute('data-form') || 'contact',
        fields: rows,
        website: (f.querySelector('[name=website]') || {}).value || '',
        page: location.pathname
      })
    }).then(function(r){
      return r.json().then(function(j){
        if (!r.ok || j.ok === false) throw new Error(j.error || 'Send failed');
        return j;
      });
    }).then(function(){
      f.reset();
      say(f.getAttribute('data-form') === 'careers'
        ? 'Application received. We will be in touch if there is a fit.'
        : 'Message sent. The Dubai desk replies within two business days.');
    }).catch(function(err){
      // A TypeError means the request never left the browser — no backend
      // here. Anything else is a real server answer worth showing.
      if (err instanceof TypeError){
        say('Opening your email client — attach files there if needed.');
        toMail(rows);
      } else {
        say(err.message, true);
      }
    }).then(function(){
      if (btn){ btn.disabled = false; btn.innerHTML = label; }
    });
  });
});

/* ---------- pageview beacon ----------
   Cookie-free and fire-and-forget. Skipped on file:// so local previews do
   not spray failed requests into the console. */
if (location.protocol.indexOf('http') === 0){
  try {
    var pv = JSON.stringify({path: location.pathname, ref: document.referrer || ''});
    if (navigator.sendBeacon){
      navigator.sendBeacon('/api/pv', new Blob([pv], {type:'application/json'}));
    } else {
      fetch('/api/pv', {method:'POST', headers:{'Content-Type':'application/json'},
        body: pv, keepalive:true}).catch(function(){});
    }
  } catch (e){}
}
})();
`;
