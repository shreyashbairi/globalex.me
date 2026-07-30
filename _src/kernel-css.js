// Globalex design system — inlined into every page.
module.exports = `
/* ============================================================
   GLOBALEX — Caspian corridor instrument system
   Colour law: cyan = system/network/document. sand = material/cargo.
   ============================================================ */

*,*::before,*::after{box-sizing:border-box}
*{margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
img,svg,video,canvas{display:block;max-width:100%}
button,input,select,textarea{font:inherit;color:inherit;background:none;border:none}
ul,ol{list-style:none}
a{color:inherit;text-decoration:none}
:where(svg){fill:currentColor}

:root{
  /* Ground — petrol blue, never neutral black. The ramp sits well above
     black on purpose: the old near-black base made the accents shout and
     the whole site read as a dark console rather than a trading desk.
     Each step is roughly one perceptual notch, so panels separate from the
     ground without a border doing all the work. */
  --void:#0F2A38;
  --deep:#143544;
  --panel:#173B4A;
  --steel:#23596B;

  /* The same three as bare channels, for the many surfaces that need the
     ground at partial opacity. One place to retune the whole site. */
  --void-rgb:15,42,56;
  --deep-rgb:20,53,68;
  --panel-rgb:23,59,74;

  --line:rgba(146,190,204,.19);
  --line-2:rgba(146,190,204,.34);

  /* system accent (from the wordmark) */
  --cyan:#35D6F5;
  --cyan-d:#0FA8C9;
  --cyan-g:rgba(53,214,245,.16);

  /* material accent — physical cargo */
  --sand:#D9B778;
  --sand-d:#B8934E;
  --sand-g:rgba(217,183,120,.14);

  /* Text greys. Both sit on --void (#0F2A38) and are tuned for contrast there:
     --frost reads 13.2:1, --haze 8.9:1 and --haze-d 6.1:1, so even mono
     captions clear AA comfortably at small sizes on the lifted ground.
     They stay in the petrol family — brighter, never neutral grey. */
  --frost:#E9F3F6;
  --haze:#B4C9D2;
  --haze-d:#8FAAB6;

  --f-disp:'Archivo','Archivo Expanded',ui-sans-serif,system-ui,sans-serif;
  --f-body:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,sans-serif;
  --f-mono:'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace;

  --t-mono:clamp(.76rem, .74rem + .1vw, .86rem);
  --t-body:clamp(1.02rem, 1rem + .12vw, 1.12rem);
  --t-lead:clamp(1.07rem, 1rem + .36vw, 1.3rem);
  --t-h4:clamp(1.12rem, 1.04rem + .36vw, 1.4rem);
  --t-h3:clamp(1.45rem, 1.22rem + .85vw, 2.05rem);
  --t-h2:clamp(1.95rem, 1.5rem + 1.7vw, 3.25rem);
  --t-h1:clamp(2.3rem, 1.65rem + 2.5vw, 4.3rem);
  --t-hero:clamp(2.6rem, 1.8rem + 3.4vw, 5.35rem);

  --gut:clamp(1.15rem,3.4vw,2.6rem);
  --wrap:1440px;
  --pad-x:clamp(1.4rem,4.2vw,4.5rem);
  --sec-y:clamp(4.75rem,10.5vh,8.75rem);
  --frame:clamp(10px,1.35vw,20px);

  /* The signature corner notch, at three scales: chips and buttons, cards and
     panels, hero-weight surfaces. Existing components hardcode their own
     polygon at thirteen different sizes and are deliberately left alone —
     these are for new work, via .nch-s / .nch-m / .nch-l below. */
  --notch-s:9px;
  --notch-m:17px;
  --notch-l:24px;

  --ease:cubic-bezier(.16,1,.3,1);
  --ease-io:cubic-bezier(.65,0,.35,1);
}

/* rails claim the outer margin, so widen the gutter once they appear */
@media (min-width:1241px){:root{--pad-x:clamp(4.5rem, 5.6vw, 7rem)}}

html{scroll-behavior:smooth}
body{
  font-family:var(--f-body);
  font-size:var(--t-body);
  line-height:1.62;
  color:var(--frost);
  background:var(--void);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
  font-feature-settings:"ss01" 1,"cv05" 1;
}
body[data-lock]{overflow:hidden}
::selection{background:var(--cyan);color:var(--void)}

/* Ambient ground wash — procedural, no imagery. The steel pool at the foot
   is held back from its old strength: on the lifted ground it would carry the
   bottom of every page close to the panel tone and flatten the depth it is
   there to create. */
body::before{
  content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(115% 78% at 8% -12%,rgba(53,214,245,.075),transparent 62%),
    radial-gradient(95% 70% at 104% 8%,rgba(217,183,120,.05),transparent 60%),
    radial-gradient(140% 100% at 50% 118%,rgba(35,89,107,.34),transparent 68%);
}

/* ============ film grain + scanline (compositing layer) ============ */
.grain{
  position:fixed;inset:0;z-index:9000;pointer-events:none;
  opacity:.4;mix-blend-mode:overlay;
}
.grain::before{
  content:'';position:absolute;inset:-160%;
  background-image:var(--noise);
  animation:grainShift 5.4s steps(6) infinite;
}
.grain::after{
  content:'';position:absolute;inset:0;
  background:repeating-linear-gradient(to bottom,rgba(255,255,255,.028) 0 1px,transparent 1px 3px);
}
@keyframes grainShift{
  0%{transform:translate(0,0)}20%{transform:translate(-6%,3%)}40%{transform:translate(4%,-5%)}
  60%{transform:translate(-3%,6%)}80%{transform:translate(6%,2%)}100%{transform:translate(0,0)}
}

/* ============ instrument frame ============ */
.frame{position:fixed;inset:var(--frame);z-index:60;pointer-events:none;border:1px solid var(--line)}
.frame i{position:absolute;width:9px;height:9px;background:var(--cyan);opacity:.85;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.frame i:nth-child(1){top:-5px;left:-5px}
.frame i:nth-child(2){top:-5px;right:-5px}
.frame i:nth-child(3){bottom:-5px;right:-5px}
.frame i:nth-child(4){bottom:-5px;left:-5px}
.frame b{position:absolute;background:var(--cyan);opacity:.5}
.frame b:nth-child(5){top:50%;left:-3px;width:5px;height:22px;transform:translateY(-50%)}
.frame b:nth-child(6){top:50%;right:-3px;width:5px;height:22px;transform:translateY(-50%)}

/* ============ side rails ============ */
.rail{position:fixed;z-index:61;pointer-events:none;font-family:var(--f-mono);
  font-size:.69rem;letter-spacing:.16em;text-transform:uppercase;color:var(--haze-d)}
.rail-l{left:calc(var(--frame) + 16px);top:50%;transform:translateY(-50%);
  display:flex;align-items:center;gap:13px;writing-mode:vertical-rl}
.rail-l .rl-ix{color:var(--cyan);font-size:.67rem;font-variant-numeric:tabular-nums}
.rail-l .rl-nm{display:flex;align-items:center;gap:10px;transition:color .45s var(--ease)}
.rail-l .rl-nm::before{content:'';width:1px;height:28px;background:var(--line-2);flex:none}
.rail-r{right:calc(var(--frame) + 14px);top:50%;transform:translateY(-50%);
  display:flex;flex-direction:column;align-items:center;gap:10px}
.rail-r .gauge{width:1px;height:150px;background:var(--line-2);position:relative}
.rail-r .gauge i{position:absolute;left:-2px;width:5px;background:var(--cyan);top:0;height:0;
  box-shadow:0 0 10px var(--cyan)}
.rail-r .pct{writing-mode:vertical-rl;color:var(--cyan);font-size:.67rem}
@media (max-width:1240px){.rail{display:none}}

/* ============ custom cursor ============ */
/* Above every overlay. The body sets cursor:none, so anything that paints
   over this element leaves the visitor clicking blind — which is exactly
   what the access-gate modal (9600) and the preloader (9800) used to do. */
.cur{position:fixed;top:0;left:0;z-index:9990;pointer-events:none;mix-blend-mode:difference;
  will-change:transform}
.cur .dot{position:absolute;width:5px;height:5px;background:#fff;transform:translate(-50%,-50%);
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.cur .ring{position:absolute;width:34px;height:34px;border:1px solid rgba(255,255,255,.55);
  transform:translate(-50%,-50%) rotate(45deg);transition:width .32s var(--ease),height .32s var(--ease),
  border-color .32s var(--ease),border-radius .32s var(--ease)}
.cur[data-hot] .ring{width:56px;height:56px;border-color:#fff;border-radius:50%;transform:translate(-50%,-50%) rotate(0deg)}
.cur .tag{position:absolute;transform:translate(-50%,32px);font-family:var(--f-mono);font-size:.645rem;
  letter-spacing:.2em;text-transform:uppercase;color:#fff;white-space:nowrap;opacity:0;transition:opacity .25s}
.cur[data-tag] .tag{opacity:1}
@media (hover:none),(max-width:900px){.cur{display:none}}
@media (hover:hover) and (min-width:901px){body{cursor:none}a,button,input,select,textarea,label{cursor:none}}

/* ============ preloader ============ */
.load{position:fixed;inset:0;z-index:9800;background:var(--void);display:grid;place-items:center;
  transition:opacity .7s var(--ease),visibility .7s}
.load[data-done]{opacity:0;visibility:hidden}
.load-in{display:grid;justify-items:center;gap:30px;width:min(88vw,340px)}
/* concentric diamonds open around the logo, echoing the medallion's own rings */
.load-mark{position:relative;display:grid;place-items:center;width:140px;height:140px}
.load-mark img{width:82px;height:70px;object-fit:contain;opacity:0;transform:scale(.84);
  animation:logoIn .85s var(--ease) .12s forwards}
.load-mark i{position:absolute;border:1px solid var(--cyan);opacity:0;
  animation:ringIn 1.1s var(--ease) forwards}
.load-mark i:nth-child(1){inset:6px}
.load-mark i:nth-child(2){inset:26px;animation-delay:.14s}
.load-mark i:nth-child(3){inset:46px;animation-delay:.28s}
@keyframes logoIn{to{opacity:1;transform:scale(1)}}
@keyframes ringIn{
  0%{opacity:0;transform:rotate(45deg) scale(.35)}
  55%{opacity:.5}
  100%{opacity:.26;transform:rotate(45deg) scale(1)}
}
.load-bar{width:100%;height:1px;background:var(--line-2);position:relative;overflow:hidden}
.load-bar i{position:absolute;inset:0 auto 0 0;width:0;background:var(--cyan);box-shadow:0 0 12px var(--cyan)}
.load-txt{display:flex;justify-content:space-between;width:100%;font-family:var(--f-mono);
  font-size:.69rem;letter-spacing:.2em;text-transform:uppercase;color:var(--haze-d)}
.load-txt b{color:var(--cyan);font-weight:400}

/* ============ type ============ */
.disp,h1,h2,h3,h4{font-family:var(--f-disp);font-weight:700;line-height:1.03;
  letter-spacing:-.022em;font-variation-settings:'wdth' 112;text-wrap:balance}
.disp{font-size:var(--t-hero);letter-spacing:-.035em;font-variation-settings:'wdth' 118;font-weight:800}
h1{font-size:var(--t-h1);letter-spacing:-.03em;font-variation-settings:'wdth' 116}
h2{font-size:var(--t-h2);letter-spacing:-.026em;font-variation-settings:'wdth' 114}
h3{font-size:var(--t-h3);letter-spacing:-.02em}
h4{font-size:var(--t-h4);letter-spacing:-.012em;font-variation-settings:'wdth' 106}
.disp em,h1 em,h2 em{font-style:normal;color:var(--cyan)}
.disp .mat,h1 .mat,h2 .mat{color:var(--sand)}

.eb{display:inline-flex;align-items:center;gap:.6em;font-family:var(--f-mono);font-size:var(--t-mono);
  font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--cyan)}
.eb::before{content:'';width:6px;height:6px;background:currentColor;flex:none;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.eb.mat{color:var(--sand)}
.eb.dim{color:var(--haze-d)}

.lead{font-size:var(--t-lead);line-height:1.55;color:#C6D8DF;text-wrap:pretty}
.mut{color:var(--haze);text-wrap:pretty}
.mono{font-family:var(--f-mono);font-size:var(--t-mono);letter-spacing:.16em;text-transform:uppercase;
  color:var(--haze-d)}
.num{font-family:var(--f-mono);font-variant-numeric:tabular-nums}

/* ============ layout ============ */
.wrap{width:100%;max-width:var(--wrap);margin-inline:auto;padding-inline:var(--pad-x)}
.narrow{width:100%;max-width:840px;margin-inline:auto;padding-inline:var(--pad-x)}
.sec{position:relative;z-index:1;padding-block:var(--sec-y)}
/* The header is fixed, so an in-page anchor would otherwise scroll its own
   target underneath it. */
:target,section[id]{scroll-margin-top:clamp(74px,8.5vh,96px)}
.sec.is-tight{padding-block:clamp(3rem,6vh,4.75rem)}
.sec.is-flush{padding-block:0}
.sec-panel{background:linear-gradient(180deg,rgba(23,59,74,.52),rgba(15,42,56,0))}
.hd{display:grid;gap:1.1rem;max-width:62ch;margin-bottom:clamp(2.6rem,5vw,4.25rem)}
.hd .lead{margin-top:.35rem}

.g2{display:grid;gap:var(--gut);grid-template-columns:repeat(2,1fr)}
.g3{display:grid;gap:var(--gut);grid-template-columns:repeat(3,1fr)}
.split{display:grid;gap:clamp(2rem,5vw,4.5rem);grid-template-columns:1fr 1fr;align-items:start}
.split.is-1-2{grid-template-columns:.85fr 1.15fr}
@media (max-width:940px){.g3,.g2,.split,.split.is-1-2{grid-template-columns:1fr}}

/* beaded rule — echoes the wordmark's beaded ornament strokes */
.bead{height:1px;border:0;background-image:radial-gradient(circle,var(--line-2) 1px,transparent 1.4px);
  background-size:7px 1px;background-repeat:repeat-x;opacity:.9}

/* ============ header ============ */
.hdr{position:fixed;top:0;left:0;right:0;z-index:78;transition:background .45s var(--ease),
  backdrop-filter .45s,border-color .45s}
.hdr::after{content:'';position:absolute;inset:auto 0 0;height:1px;background:var(--line);opacity:0;
  transition:opacity .45s}
.hdr[data-solid]{background:rgba(15,42,56,.82);backdrop-filter:blur(18px) saturate(1.4)}
.hdr[data-solid]::after{opacity:1}
.hdr[data-hide]{transform:translateY(-104%);transition:transform .5s var(--ease)}
.hdr-in{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
  padding-block:clamp(.85rem,1.5vw,1.15rem);padding-inline:var(--pad-x);
  max-width:var(--wrap);margin-inline:auto}

.mark{display:flex;align-items:center;gap:.7rem;flex:none}
/* the gül has four-fold symmetry, so a quarter turn maps it onto itself */
.mark-logo{width:47px;height:40px;flex:none;object-fit:contain;
  transition:transform .9s var(--ease)}
.mark:hover .mark-logo{transform:rotate(90deg)}
.mark-txt{display:grid;line-height:1}
.mark-txt b{font-family:var(--f-disp);font-weight:800;font-size:1.05rem;letter-spacing:.055em;
  font-variation-settings:'wdth' 108;color:var(--frost)}
.mark-txt span{font-family:var(--f-mono);font-size:.62rem;letter-spacing:.3em;color:var(--haze-d);
  margin-top:3px}

.nav{display:flex;align-items:center;gap:clamp(.4rem,1.3vw,1.15rem)}
.nav-l{display:flex;align-items:center;gap:clamp(.1rem,.8vw,.5rem)}
.nl{position:relative;display:block;padding:.55rem .7rem;font-family:var(--f-mono);font-size:.79rem;
  font-weight:500;letter-spacing:.13em;text-transform:uppercase;color:var(--haze);
  transition:color .3s var(--ease)}
.nl::after{content:'';position:absolute;left:.7rem;right:.7rem;bottom:.28rem;height:1px;
  background:var(--cyan);transform:scaleX(0);transform-origin:left;transition:transform .4s var(--ease)}
/* data-on, not data-cur: kernel-js reads data-cur as the custom-cursor tag
   label, so a nav item carrying a value there would print it beside the
   pointer. data-on is what .pf, .srch-o and .dr already use for this state. */
.nl:hover,.nl[data-on]{color:var(--frost)}
.nl:hover::after,.nl[data-on]::after{transform:scaleX(1)}
.nl[data-on]{color:var(--cyan)}

/* ---------- hero background footage ----------
   Treated to the palette with the same recipe as .plate on the contact page,
   so the footage reads as part of the site rather than as stock dropped in.
   The poster carries the frame until the video can fade over it. */
.ph.has-vid{padding-top:clamp(9.5rem,19vh,13.5rem)}
.ph-vid{position:absolute;inset:0;overflow:hidden}
.ph-vid::after{content:'';position:absolute;inset:0;z-index:2;
  background:linear-gradient(155deg,rgba(53,214,245,.28),rgba(15,42,56,.62));
  mix-blend-mode:color}
.ph-vid-p,.ph-vid-v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  filter:grayscale(1) contrast(1.1) brightness(.55)}
.ph-vid-v{opacity:0;transition:opacity .6s var(--ease)}
.ph-vid-v[data-ready]{opacity:1}
/* scrim, so the fixed header stays legible over moving footage — the same
   pattern the homepage hero uses over the globe */
.ph.has-vid::before{content:'';position:absolute;inset:0 0 auto;height:230px;z-index:3;
  pointer-events:none;background:linear-gradient(180deg,rgba(var(--void-rgb),.92),rgba(var(--void-rgb),0))}
.ph.has-vid .wrap{position:relative;z-index:4}
/* and a floor, so the lead copy does not sit on a bright frame */
.ph.has-vid .ph-vid::before{content:'';position:absolute;inset:auto 0 0;height:55%;z-index:2;
  background:linear-gradient(0deg,rgba(var(--void-rgb),.86),rgba(var(--void-rgb),0))}
@media (prefers-reduced-motion:reduce){.ph-vid-v{display:none}}

/* ---------- dropdowns and mega-menus ----------
   The panel is hidden with the hidden attribute and transitioned with
   data-open, the same two-state pattern the search overlay uses. The old
   version was visibility-only with no script behind it, which meant it
   claimed role="menu" keyboard semantics it did not implement. */
.has-menu{position:relative;display:flex;align-items:center}
.nl-x{flex:none;width:20px;height:26px;display:grid;place-items:center;margin-left:-.5rem;
  color:var(--haze-d);transition:color .3s,transform .3s var(--ease);cursor:pointer}
.nl-x i{width:6px;height:6px;border-right:1.4px solid currentColor;
  border-bottom:1.4px solid currentColor;transform:rotate(45deg) translate(-1px,-1px)}
.has-menu:hover .nl-x,.nl-x:focus-visible{color:var(--cyan)}
.nl-x[aria-expanded=true]{color:var(--cyan);transform:rotate(180deg)}
.nl-x:focus-visible{outline:2px solid var(--cyan);outline-offset:1px}

.menu{position:absolute;top:calc(100% + 12px);left:-.7rem;width:340px;padding:.5rem;z-index:4;
  background:rgba(var(--deep-rgb),.97);backdrop-filter:blur(22px);border:1px solid var(--line-2);
  opacity:0;transform:translateY(-8px);transition:opacity .26s var(--ease),transform .26s var(--ease);
  clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)}
.menu[hidden]{display:none}
.menu[data-open]{opacity:1;transform:none}
.menu-l{display:grid}
.menu a{display:grid;gap:2px;padding:.8rem .85rem;border-left:1px solid transparent;
  transition:background .28s,border-color .28s}
.menu a:hover,.menu a:focus-visible{background:rgba(53,214,245,.06);border-left-color:var(--cyan)}
.menu a:focus-visible{outline:none;background:rgba(53,214,245,.1)}
.menu a b{display:block;font-family:var(--f-disp);font-weight:700;font-size:.99rem;
  font-variation-settings:'wdth' 106;color:var(--frost)}
.menu a small{display:block;font-family:var(--f-mono);font-size:.69rem;letter-spacing:.11em;
  color:var(--haze-d);text-transform:uppercase}

/* the full-bleed Products panel. Anchored to the header rather than the item,
   so it spans the page instead of hanging off one nav link. */
.menu.mm{position:fixed;left:var(--frame);right:var(--frame);width:auto;
  top:calc(var(--frame) + 68px);padding:clamp(1.2rem,2vw,1.9rem);
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
.mm-grid{display:grid;grid-template-columns:repeat(3,1fr) 1.15fr;gap:clamp(1rem,2vw,2.2rem)}
@media (max-width:1240px){.mm-grid{grid-template-columns:repeat(2,1fr)}}
.mm-col{min-width:0}
.mm-h{display:grid;grid-template-columns:auto 1fr;gap:0 .6rem;padding:0 0 .7rem;
  border-bottom:1px solid var(--line);border-left:0}
.mm-h:hover,.mm-h:focus-visible{background:none;border-left:0}
.mm-no{grid-row:1/3;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;
  color:var(--cyan);padding-top:.2rem}
.mm-h.mat .mm-no{color:var(--sand)}
.mm-h b{font-size:1.04rem}
.mm-h:hover b{color:var(--cyan)}
.mm-h.mat:hover b{color:var(--sand)}
.mm-l{display:grid;gap:0;margin-top:.35rem}
.mm-l a{padding:.4rem .5rem;font-size:.95rem;color:var(--haze);border-left:1px solid transparent;
  transition:color .26s,background .26s,border-color .26s}
.mm-l a:hover,.mm-l a:focus-visible{color:var(--frost);background:rgba(53,214,245,.06);
  border-left-color:var(--cyan)}
/* two classes, so this outbids .mm-l a on specificity rather than with
   !important; inline-flex keeps the arrow on the label's line.
   NB this file is one JS template literal — no backticks in comments. */
.mm-l .mm-more{display:inline-flex;align-items:center;gap:.5em;white-space:nowrap;
  font-family:var(--f-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--cyan);margin-top:.2rem}

.mm-feat{display:grid;gap:.8rem;align-content:start}
.mm-card{position:relative;overflow:hidden;padding:1.1rem;border:1px solid var(--line);
  background:rgba(var(--panel-rgb),.5);border-left:1px solid var(--line);
  clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
.mm-card canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.5}
.mm-card-b{position:relative;display:grid;gap:.45rem}
.mm-card:hover{border-color:var(--line-2);background:rgba(var(--panel-rgb),.7)}
.mm-card .lk{margin-top:.35rem;justify-self:start}
.mm-doc b{color:var(--frost)}

/* Under reduced motion the panel appears without travel. The global rule
   already flattens the duration; this drops the transform so it does not
   snap in from an offset position. */
@media (prefers-reduced-motion:reduce){
  .menu{transform:none}
  .nl-x[aria-expanded=true]{transform:none}
}

/* ============ buttons ============ */
.btn{position:relative;display:inline-flex;align-items:center;gap:.7em;
  padding:.92em 1.5em;font-family:var(--f-mono);font-size:.8rem;font-weight:500;letter-spacing:.16em;
  text-transform:uppercase;overflow:hidden;isolation:isolate;
  clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px));
  transition:color .34s var(--ease),background .34s var(--ease),border-color .34s var(--ease);
  will-change:transform}
.btn .ar{transition:transform .38s var(--ease)}
.btn:hover .ar{transform:translateX(5px)}
.btn::before{content:'';position:absolute;inset:0;z-index:-1;transform:translateY(101%);
  transition:transform .44s var(--ease)}
.btn:hover::before{transform:translateY(0)}

.btn-p{background:var(--cyan);color:var(--void);font-weight:600}
.btn-p::before{background:var(--frost)}
.btn-m{background:var(--sand);color:#2A1F0C;font-weight:600}
.btn-m::before{background:var(--frost)}
.btn-o{border:1px solid var(--line-2);color:var(--frost)}
.btn-o::before{background:var(--cyan)}
.btn-o:hover{color:var(--void);border-color:var(--cyan)}
.btn-g{padding-inline:0;color:var(--cyan);clip-path:none}
.btn-g::before{display:none}
.btn-g::after{content:'';position:absolute;left:0;bottom:.55em;width:100%;height:1px;
  background:currentColor;transform-origin:right;transition:transform .4s var(--ease)}
.btn-g:hover::after{transform:scaleX(0);transform-origin:left}
.btn-sm{padding:.72em 1.15em;font-size:.755rem}
.btns{display:flex;flex-wrap:wrap;gap:.85rem;align-items:center}

.lk{display:inline-flex;align-items:center;gap:.5em;font-family:var(--f-mono);font-size:.79rem;
  font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--cyan);
  padding-bottom:.3em;border-bottom:1px solid rgba(53,214,245,.32);transition:border-color .3s,gap .3s}
.lk:hover{border-color:var(--cyan);gap:.85em}
.lk.mat{color:var(--sand);border-bottom-color:rgba(217,183,120,.32)}
.lk.mat:hover{border-color:var(--sand)}

/* ============ nav toggle + mobile ============ */
.tog{display:none;position:relative;width:44px;height:44px;flex:none;z-index:80}
.tog i{position:absolute;left:11px;width:22px;height:1.5px;background:var(--frost);
  transition:.4s var(--ease)}
.tog i:nth-child(1){top:17px}
.tog i:nth-child(2){bottom:17px;width:14px}
.tog[aria-expanded=true] i:nth-child(1){transform:translateY(4.5px) rotate(45deg)}
.tog[aria-expanded=true] i:nth-child(2){width:22px;transform:translateY(-4.5px) rotate(-45deg)}
@media (max-width:1080px){.nav{display:none}.tog{display:block}}

.mnav{position:fixed;inset:0;z-index:75;background:rgba(15,42,56,.97);backdrop-filter:blur(24px);
  display:grid;align-content:center;gap:.4rem;padding:5.5rem var(--pad-x) 2.5rem;
  clip-path:circle(0% at calc(100% - 44px) 44px);transition:clip-path .78s var(--ease);
  overflow-y:auto}
.mnav[data-open]{clip-path:circle(150% at calc(100% - 44px) 44px)}
.mnav a{display:flex;align-items:baseline;gap:1rem;padding:.5rem 0;font-family:var(--f-disp);
  font-weight:700;font-size:clamp(1.6rem,7.5vw,2.6rem);font-variation-settings:'wdth' 112;
  letter-spacing:-.025em;color:var(--frost);opacity:0;transform:translateY(24px);
  transition:opacity .5s var(--ease),transform .5s var(--ease),color .3s}
.mnav[data-open] a{opacity:1;transform:none}
.mnav a i{font-family:var(--f-mono);font-size:.69rem;font-style:normal;letter-spacing:.14em;
  color:var(--cyan);opacity:.55}
.mnav a:hover{color:var(--cyan)}

/* Collapsible groups, so the four-item IA survives on a phone. Only the four
   groups are numbered — a running counter across every leaf would print
   twenty numerals and stop meaning anything. */
.mnav-g summary{display:flex;align-items:baseline;gap:1rem;padding:.5rem 0;cursor:pointer;
  list-style:none;font-family:var(--f-disp);font-weight:700;
  font-size:clamp(1.6rem,7.5vw,2.6rem);font-variation-settings:'wdth' 112;
  letter-spacing:-.025em;color:var(--frost);opacity:0;transform:translateY(24px);
  transition:opacity .5s var(--ease),transform .5s var(--ease),color .3s}
.mnav[data-open] .mnav-g summary{opacity:1;transform:none}
.mnav-g summary::-webkit-details-marker{display:none}
.mnav-g summary::marker{content:''}
.mnav-g summary:hover{color:var(--cyan)}
.mnav-g summary:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}
.mnav-g summary i{font-family:var(--f-mono);font-size:.69rem;font-style:normal;
  letter-spacing:.14em;color:var(--cyan);opacity:.55}
/* margin-right so the rotated glyph never presses the panel edge, and the
   long labels ("Sustainability") keep a hair of slack at 390px */
.mnav-g summary .ac-i{margin-left:auto;margin-right:.35rem;align-self:center;flex:none;
  width:10px;height:10px;color:var(--haze-d);
  border-right:1.6px solid currentColor;border-bottom:1.6px solid currentColor;
  transform:rotate(45deg);transition:transform .3s var(--ease),color .3s}
.mnav-g[open] summary .ac-i{transform:rotate(225deg);color:var(--cyan)}
.mnav-g[open] summary{color:var(--cyan)}
/* leaves: quieter than the group heads, and always revealed once the panel is
   open — they are inside a details that the user just opened */
.mnav-s{display:grid;gap:.1rem;padding:.2rem 0 .9rem 2.1rem;
  border-left:1px solid var(--line);margin-left:.35rem}
.mnav-s a{font-size:1.06rem;font-family:var(--f-body);font-weight:500;letter-spacing:0;
  color:var(--haze);padding:.42rem 0;opacity:1;transform:none}
.mnav-f{margin-top:2rem;display:grid;gap:.5rem;font-family:var(--f-mono);font-size:.75rem;
  letter-spacing:.13em;text-transform:uppercase;color:var(--haze-d);opacity:0;transition:opacity .6s .35s}
.mnav[data-open] .mnav-f{opacity:1}

/* ============ site search ============ */
/* Screen-reader-only. Not display:none — the label still has to be announced. */
.vh{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
  clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}

/* Anything an in-page anchor can land on has to clear the fixed header, or a
   deep link from search puts its target underneath the bar. */
.row[id],.fam-c[id],.pc[id],section[id],[data-sec][id]{scroll-margin-top:clamp(6.5rem,13vh,9.5rem)}

.hdr-r{display:flex;align-items:center;gap:clamp(.5rem,1.2vw,1rem)}
.srch-t{display:flex;align-items:center;gap:.6rem;padding:.5rem .8rem;flex:none;
  border:1px solid var(--line);color:var(--haze);font-family:var(--f-mono);font-size:.755rem;
  letter-spacing:.12em;text-transform:uppercase;cursor:pointer;
  transition:border-color .3s var(--ease),color .3s var(--ease),background .3s var(--ease)}
.srch-t:hover{border-color:var(--cyan);color:var(--cyan);background:var(--cyan-g)}
.srch-t svg{width:15px;height:15px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7}
.srch-t kbd{font-family:var(--f-mono);font-size:.66rem;letter-spacing:.06em;color:var(--haze-d);
  border:1px solid var(--line);padding:.15em .4em;line-height:1.3}
@media (max-width:1240px){.srch-t kbd{display:none}}
@media (max-width:1080px){.srch-t span{display:none}.srch-t{padding:.55rem}}

.srch{position:fixed;inset:0;z-index:9500;display:grid;justify-items:center;
  align-content:start;padding:clamp(3.5rem,11vh,8rem) 1.1rem 1.1rem;
  opacity:0;visibility:hidden;transition:opacity .32s var(--ease),visibility .32s}
.srch[data-open]{opacity:1;visibility:visible}
.srch-bd{position:absolute;inset:0;background:rgba(6,20,27,.78);backdrop-filter:blur(7px);
  -webkit-backdrop-filter:blur(7px)}
.srch-p{position:relative;width:min(100%,640px);max-height:calc(100svh - clamp(4.6rem,13vh,9.1rem));
  display:flex;flex-direction:column;overflow:hidden;
  background:linear-gradient(168deg,rgba(27,67,86,.97),rgba(20,53,68,.97));
  border:1px solid var(--line-2);box-shadow:0 34px 90px -30px rgba(6,20,27,.9);
  transform:translateY(-14px) scale(.99);transition:transform .38s var(--ease);
  clip-path:polygon(0 0,calc(100% - 17px) 0,100% 17px,100% 100%,17px 100%,0 calc(100% - 17px))}
.srch[data-open] .srch-p{transform:none}

.srch-f{display:flex;align-items:center;gap:.85rem;padding:.3rem 1rem .3rem 1.15rem;flex:none;
  border-bottom:1px solid var(--line)}
.srch-f svg{width:17px;height:17px;flex:none;fill:none;stroke:var(--haze-d);stroke-width:1.6;
  transition:stroke .3s}
.srch-f:focus-within svg{stroke:var(--cyan)}
.srch-f input{flex:1;min-width:0;padding:1.05rem 0;font-size:1.02rem;color:var(--frost);
  background:none;border:0;outline:none}
.srch-f input::placeholder{color:var(--haze-d)}
.srch-f input::-webkit-search-cancel-button{display:none}
.srch-esc{flex:none;font-family:var(--f-mono);font-size:.66rem;letter-spacing:.1em;color:var(--haze-d);
  border:1px solid var(--line);padding:.32em .55em;cursor:pointer;transition:color .3s,border-color .3s}
.srch-esc:hover{color:var(--cyan);border-color:var(--cyan)}

.srch-r{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:.35rem}
.srch-g{font-family:var(--f-mono);font-size:.645rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--haze-d);padding:.85rem .85rem .45rem}
/* Every cell is placed explicitly. Left auto-placement to sort it out, the
   kind label took column 1 and pushed the title to the right-hand edge. */
.srch-o{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.2rem .9rem;align-items:baseline;
  padding:.62rem .85rem;cursor:pointer;border-left:2px solid transparent;
  transition:background .22s,border-color .22s}
.srch-o b{grid-area:1/1;font-weight:600;font-size:.96rem;min-width:0;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.srch-o i{grid-area:1/2;font-style:normal;font-family:var(--f-mono);font-size:.645rem;
  letter-spacing:.13em;text-transform:uppercase;color:var(--haze-d);white-space:nowrap}
.srch-o small{grid-area:2/1/3/3;color:var(--haze-d);font-size:.8rem;line-height:1.45;
  display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
.srch-o mark{background:none;color:var(--cyan);font-weight:700}
.srch-o[data-on]{background:var(--cyan-g);border-left-color:var(--cyan)}
.srch-o[data-on] i{color:var(--cyan)}
.srch-none{padding:2.4rem 1rem;text-align:center;color:var(--haze-d);font-size:.92rem;line-height:1.6}
.srch-none b{display:block;color:var(--frost);font-size:1.02rem;margin-bottom:.45rem}
.srch-none a{color:var(--cyan);border-bottom:1px solid rgba(53,214,245,.4)}

.srch-ft{display:flex;align-items:center;gap:1.1rem;flex-wrap:wrap;flex:none;
  padding:.6rem 1.1rem;border-top:1px solid var(--line);background:rgba(var(--void-rgb),.4);
  font-family:var(--f-mono);font-size:.645rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--haze-d)}
.srch-ft kbd{font-family:inherit;border:1px solid var(--line);padding:.1em .35em;margin-right:.15em}
.srch-ft a{margin-left:auto;color:var(--cyan)}
@media (max-width:560px){.srch-ft span:nth-child(-n+2){display:none}}

/* ============ page hero (interior pages) ============ */
.ph{position:relative;padding-top:clamp(8.5rem,17vh,12.5rem);padding-bottom:clamp(3rem,7vh,5.5rem);
  overflow:hidden}
.ph canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.85}
.ph-in{position:relative;z-index:2;display:grid;gap:1.5rem;max-width:74ch}
.ph h1{margin-top:.3rem}
.crumb{display:flex;align-items:center;gap:.55rem;font-family:var(--f-mono);font-size:.725rem;
  letter-spacing:.15em;text-transform:uppercase;color:var(--haze-d);flex-wrap:wrap}
.crumb a:hover{color:var(--cyan)}
.crumb i{font-style:normal;color:var(--steel)}
.crumb b{color:var(--frost);font-weight:400}
.ph-meta{display:flex;flex-wrap:wrap;gap:0 2.25rem;margin-top:.5rem;font-family:var(--f-mono);
  font-size:.76rem;letter-spacing:.13em;text-transform:uppercase;color:var(--haze-d)}
.ph-meta b{display:block;color:var(--frost);font-weight:500;font-size:1rem;letter-spacing:.04em;
  margin-bottom:2px}

/* ============ surfaces / cards ============ */
.card{position:relative;padding:clamp(1.5rem,2.6vw,2.2rem);background:linear-gradient(160deg,
  rgba(35,89,107,.44),rgba(20,53,68,.72));border:1px solid var(--line);
  clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));
  transition:border-color .45s var(--ease),transform .55s var(--ease),background .45s var(--ease)}
.card::after{content:'';position:absolute;top:0;left:0;width:100%;height:1px;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent);opacity:0;
  transition:opacity .5s var(--ease)}
.card:hover{border-color:var(--line-2);transform:translateY(-4px)}
.card:hover::after{opacity:.75}
.card.mat::after{background:linear-gradient(90deg,transparent,var(--sand),transparent)}

/* numbered pillar */
.pil{display:flex;flex-direction:column;gap:.85rem;height:100%}
.pil .ix{font-family:var(--f-mono);font-size:.725rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--cyan)}
.pil.mat .ix{color:var(--sand)}
.pil p{color:var(--haze)}
.pil .lk,.pil .btn-g{margin-top:auto;align-self:flex-start}

/* commodity class card */
.cls{display:grid;grid-template-rows:auto 1fr auto;gap:1.15rem;padding:0;overflow:hidden;
  background:linear-gradient(165deg,rgba(35,89,107,.4),rgba(20,53,68,.78));border:1px solid var(--line);
  clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));
  transition:border-color .45s var(--ease),transform .55s var(--ease)}
.cls:hover{border-color:rgba(53,214,245,.45);transform:translateY(-6px)}
.cls-vis{position:relative;aspect-ratio:16/10;background:var(--deep);overflow:hidden;
  border-bottom:1px solid var(--line)}
.cls-vis canvas{position:absolute;inset:0;width:100%;height:100%}
.cls-vis .tag{position:absolute;top:12px;left:12px;z-index:2;padding:.34em .7em;
  font-family:var(--f-mono);font-size:.67rem;letter-spacing:.18em;text-transform:uppercase;
  background:rgba(15,42,56,.78);border:1px solid var(--line-2);color:var(--frost)}
.cls-b{padding:0 clamp(1.35rem,2.3vw,1.9rem);display:grid;gap:.7rem;align-content:start}
.cls-b p{color:var(--haze);font-size:1.02rem}
.cls-f{display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:1.05rem clamp(1.35rem,2.3vw,1.9rem);border-top:1px solid var(--line);
  font-family:var(--f-mono);font-size:.725rem;letter-spacing:.15em;text-transform:uppercase;
  color:var(--haze-d)}
.cls:hover .cls-f{color:var(--cyan)}

/* spec row — the document/spec-sheet register */
.rows{display:grid;border-top:1px solid var(--line)}
.row{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:clamp(1rem,3vw,2.5rem);
  align-items:start;padding:clamp(1.4rem,2.6vw,2.1rem) clamp(.5rem,1.5vw,1.25rem);
  border-bottom:1px solid var(--line);transition:background .4s var(--ease),padding-inline .4s var(--ease)}
.row:hover{background:rgba(53,214,245,.035)}
.row-ix{font-family:var(--f-mono);font-size:.76rem;letter-spacing:.12em;color:var(--steel);
  padding-top:.45rem;transition:color .4s}
.row:hover .row-ix{color:var(--cyan)}
.row-b{display:grid;gap:.7rem;min-width:0}
.row-b h3,.row-b h4{font-size:var(--t-h4)}
.row-b p{color:var(--haze);max-width:76ch;font-size:1.03rem}
.row-side{display:grid;gap:.5rem;justify-items:end;text-align:right;font-family:var(--f-mono);
  font-size:.725rem;letter-spacing:.14em;text-transform:uppercase;color:var(--haze-d)}
@media (max-width:760px){
  .row{grid-template-columns:auto 1fr;gap:1rem}
  .row-side{grid-column:1/-1;justify-items:start;text-align:left;margin-top:.4rem}
}

/* ============ shared primitives ============
   Added ahead of the pages that need them, so a spec table, an accordion and
   a placeholder banner are defined once rather than reinvented per page. */

/* the signature corner notch, at the three --notch-* scales */
.nch-s{clip-path:polygon(0 0,calc(100% - var(--notch-s)) 0,100% var(--notch-s),100% 100%,
  var(--notch-s) 100%,0 calc(100% - var(--notch-s)))}
.nch-m{clip-path:polygon(0 0,calc(100% - var(--notch-m)) 0,100% var(--notch-m),100% 100%,
  var(--notch-m) 100%,0 calc(100% - var(--notch-m)))}
.nch-l{clip-path:polygon(0 0,calc(100% - var(--notch-l)) 0,100% var(--notch-l),100% 100%,
  var(--notch-l) 100%,0 calc(100% - var(--notch-l)))}

/* tabular data — the first real table styling on the public site.
   The wrapper is the scroll container and it is focusable on purpose: a region
   that scrolls sideways has to be reachable by keyboard, not only by trackpad.
   Give it role="region" and an aria-label naming the table. */
.tbl-wrap{overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line);
  background:rgba(20,53,68,.42)}
.tbl-wrap:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.tbl{width:100%;border-collapse:collapse;font-size:.95rem}
/* opt-in floor for genuinely wide sheets: squeezing an assay table into 390px
   is worse than scrolling it */
.tbl.is-wide{min-width:660px}
.tbl caption{padding:.95rem 1.1rem;text-align:left;font-family:var(--f-mono);font-size:.7rem;
  letter-spacing:.17em;text-transform:uppercase;color:var(--haze-d);
  border-bottom:1px solid var(--line-2)}
/* row hairlines only — vertical rules turn a spec sheet into a grid of boxes
   and bury the figures the reader came for */
.tbl th,.tbl td{padding:.72rem 1.1rem;text-align:left;vertical-align:baseline;
  border-bottom:1px solid var(--line)}
.tbl thead th{font-family:var(--f-mono);font-size:.7rem;font-weight:500;letter-spacing:.15em;
  text-transform:uppercase;color:var(--cyan);white-space:nowrap;border-bottom-color:var(--line-2)}
.tbl tbody th{font-weight:500;color:var(--haze)}
.tbl td{color:var(--frost);font-variant-numeric:tabular-nums}
.tbl tbody tr:last-child>*{border-bottom:0}
.tbl tbody tr{transition:background .3s var(--ease)}
.tbl tbody tr:hover{background:rgba(53,214,245,.04)}
.tbl .num{text-align:right;font-family:var(--f-mono);font-size:.87rem}
.tbl .mat{color:var(--sand)}
.tbl .sys{color:var(--cyan)}
.tbl-n{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.13em;text-transform:uppercase;
  color:var(--haze-d);margin-top:.7rem}

/* accordion. No height transition: <details> cannot be animated open without
   scripting it, and not animating is also what reduced motion wants. */
.acc{border-top:1px solid var(--line)}
.acc>details{border-bottom:1px solid var(--line)}
.acc summary{display:flex;align-items:center;gap:1rem;padding:1.15rem .4rem;cursor:pointer;
  list-style:none;font-family:var(--f-disp);font-weight:700;font-size:1.06rem;
  font-variation-settings:'wdth' 106;color:var(--frost);
  transition:color .3s var(--ease),background .3s var(--ease)}
.acc summary::-webkit-details-marker{display:none}
.acc summary::marker{content:''}
.acc summary:hover{color:var(--cyan);background:rgba(53,214,245,.04)}
.acc summary:focus-visible{outline:2px solid var(--cyan);outline-offset:-2px}
.acc .ac-i{margin-left:auto;flex:none;width:9px;height:9px;color:var(--haze-d);
  border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
  transform:rotate(45deg);transition:transform .34s var(--ease),color .3s}
.acc details[open]>summary{color:var(--cyan)}
.acc details[open]>summary .ac-i{transform:rotate(225deg);color:var(--cyan)}
.acc .ac-b{padding:0 .4rem 1.4rem;display:grid;gap:.85rem;max-width:78ch}
.acc .ac-b p{color:var(--haze)}

/* placeholder-data banner. In flow at the top of <main> rather than fixed:
   no z-index argument with the header, and it cannot be scrolled past
   without being read. */
.draft-flag{position:relative;z-index:2;background:var(--sand);color:#2A1F0C;
  padding:.72rem var(--pad-x);font-family:var(--f-mono);font-size:.72rem;font-weight:500;
  letter-spacing:.16em;text-transform:uppercase;text-align:center}

/* document-kind badge. Lives here rather than in docgate.js because the
   products page renders the same badge and used to redeclare these rules —
   two edit sites for one token pair guarantees drift. Cyan is the default
   (system, document); sand marks a sheet that describes physical material. */
.dr-k{font-family:var(--f-mono);font-size:.645rem;letter-spacing:.16em;padding:.3em .6em;
  border:1px solid rgba(53,214,245,.3);color:var(--cyan);background:rgba(53,214,245,.07);
  flex:none;white-space:nowrap}
.dr-k[data-kind=TDS],.dr-k[data-kind=SPEC],.dr-k[data-kind=REPORT]{color:var(--sand);
  border-color:rgba(217,183,120,.34);background:var(--sand-g)}

/* origin ledger. Promoted from the homepage because the product pages render
   the same row per origin; --led-cols lets each caller set its own column
   template so the homepage renders byte-identically. */
.led{display:grid;border-top:1px solid var(--line)}
.led-r{display:grid;grid-template-columns:var(--led-cols,2.2rem 1.35fr .85fr 1.6fr auto);gap:clamp(.75rem,2vw,1.75rem);
  align-items:center;padding:1.1rem .5rem;border-bottom:1px solid var(--line);
  font-family:var(--f-mono);font-size:.765rem;letter-spacing:.1em;text-transform:uppercase;
  color:var(--haze-d);transition:background .38s var(--ease),color .38s}
.led-r:hover{background:rgba(53,214,245,.04);color:var(--haze)}
.led-r b{font-family:var(--f-disp);font-weight:700;font-size:1rem;letter-spacing:0;
  font-variation-settings:'wdth' 106;color:var(--frost);text-transform:none}
.led-r .co{color:var(--cyan)}
.led-r .fl{justify-self:end;width:44px;height:1px;background:var(--line-2);position:relative}
.led-r:hover .fl{background:var(--cyan)}
.led-r .fl::after{content:'';position:absolute;right:0;top:-2.5px;width:6px;height:6px;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:var(--line-2)}
.led-r:hover .fl::after{background:var(--cyan)}
@media (max-width:820px){
  .led-r{grid-template-columns:2rem 1fr;gap:.3rem .9rem;padding-block:1.15rem}
  .led-r .co,.led-r .cg{grid-column:2}
  .led-r .fl{display:none}
}

/* numbered objective list. Promoted from the About page for compliance.html. */
.obj{display:grid;counter-reset:o}
.obj li{position:relative;display:grid;grid-template-columns:3rem 1fr;gap:1.5rem;
  padding:1.5rem 0;border-bottom:1px solid var(--line);counter-increment:o;
  transition:padding-left .4s var(--ease)}
.obj li:first-child{border-top:1px solid var(--line)}
.obj li:hover{padding-left:.6rem}
.obj li::before{content:counter(o,decimal-leading-zero);font-family:var(--f-mono);font-size:.78rem;
  letter-spacing:.12em;color:var(--cyan);padding-top:.35rem}
.obj h4{margin-bottom:.35rem}
.obj p{color:var(--haze);font-size:1.02rem;max-width:64ch}
@media (max-width:560px){.obj li{grid-template-columns:2.2rem 1fr;gap:.9rem}}

/* A grade heading on a class page links to that grade's own page. The row
   keeps its id, so inbound links to the old anchor still land here. */
.row-lk{color:inherit;transition:color .3s var(--ease)}
.row-lk:hover{color:var(--cyan)}
.row-lk::after{content:' →';font-family:var(--f-mono);font-size:.62em;opacity:0;
  transition:opacity .3s var(--ease),margin-left .3s var(--ease);margin-left:-.25em}
.row-lk:hover::after{opacity:1;margin-left:.15em}

/* chips */
.chips{display:flex;flex-wrap:wrap;gap:.4rem}
.chip{display:inline-flex;align-items:center;gap:.45em;padding:.34em .7em;font-family:var(--f-mono);
  font-size:.69rem;letter-spacing:.13em;text-transform:uppercase;color:var(--haze);
  border:1px solid var(--line);background:rgba(15,42,56,.4)}
.chip.spec{color:var(--sand);border-color:rgba(217,183,120,.34);background:var(--sand-g)}
.chip.org{color:var(--cyan);border-color:rgba(53,214,245,.28);background:rgba(53,214,245,.06)}
.chip.org::before{content:'';width:5px;height:5px;background:currentColor;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.chip.hot{color:var(--void);background:var(--cyan);border-color:var(--cyan);font-weight:600}

/* stat readouts.
   Dividers are a 1px shadow on the right and bottom of every cell, clipped at
   the container edge — so the band tiles correctly at any number of stats and
   any wrap point, where the nth-child border patching this replaces only ever
   worked for exactly four. Column count is declarative: set --sc on .stats. */
.stats{display:grid;grid-template-columns:repeat(var(--sc,4),1fr);border:1px solid var(--line);
  background:rgba(20,53,68,.5);overflow:hidden}
.stat{padding:clamp(1.5rem,3vw,2.4rem) clamp(1.1rem,2vw,1.6rem);
  box-shadow:1px 0 0 var(--line),0 1px 0 var(--line);
  display:grid;gap:.5rem;position:relative;overflow:hidden}
.stat::before{content:'';position:absolute;inset:auto 0 0 0;height:1px;background:var(--cyan);
  transform:scaleX(0);transform-origin:left;transition:transform 1.1s var(--ease)}
.stat[data-in]::before{transform:scaleX(1)}
.stat b{font-family:var(--f-disp);font-weight:800;font-size:clamp(2rem,4.2vw,3.1rem);line-height:.95;
  letter-spacing:-.03em;font-variation-settings:'wdth' 118;color:var(--frost);
  font-variant-numeric:tabular-nums}
.stat b i{font-style:normal;color:var(--cyan);font-size:.67em;vertical-align:.04em;margin-left:.02em}
/* direct child only — the number lives in a nested span inside b */
.stat>span{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.16em;text-transform:uppercase;
  color:var(--haze-d)}
@media (max-width:900px){.stats{grid-template-columns:repeat(2,1fr)}}
@media (max-width:460px){.stats{grid-template-columns:1fr}}

/* marquee */
.mq{overflow:hidden;position:relative;padding-block:1.1rem;border-block:1px solid var(--line);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 11%,#000 89%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 11%,#000 89%,transparent)}
.mq-t{display:flex;gap:clamp(2.5rem,6vw,5rem);width:max-content;animation:mqr 42s linear infinite}
.mq-t.rev{animation-direction:reverse}
.mq:hover .mq-t{animation-play-state:paused}
.mq-i{display:flex;align-items:center;gap:clamp(2.5rem,6vw,5rem);font-family:var(--f-disp);
  font-weight:700;font-size:clamp(1rem,2vw,1.4rem);font-variation-settings:'wdth' 108;
  letter-spacing:.01em;color:var(--haze-d);white-space:nowrap;transition:color .4s}
.mq-i::after{content:'';width:7px;height:7px;background:var(--cyan);opacity:.6;flex:none;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.mq-i:hover{color:var(--frost)}
@keyframes mqr{to{transform:translateX(-50%)}}

/* CTA plate */
.cta{position:relative;overflow:hidden;padding:clamp(2.5rem,6vw,5rem);
  background:linear-gradient(140deg,var(--steel),var(--deep) 62%);border:1px solid var(--line-2);
  clip-path:polygon(0 0,calc(100% - 28px) 0,100% 28px,100% 100%,28px 100%,0 calc(100% - 28px))}
.cta canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.5}
.cta-in{position:relative;z-index:2;display:grid;gap:1.4rem;max-width:60ch}
.cta h2{max-width:24ch}

/* forms — instrument panel */
.form{display:grid;gap:1.15rem}
/* Honeypot. Off-screen rather than display:none — some bots skip hidden
   fields, but almost all of them fill anything with a name they recognise. */
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.f-row{display:grid;gap:1.15rem;grid-template-columns:1fr 1fr}
@media (max-width:640px){.f-row{grid-template-columns:1fr}}
.fld{display:grid;gap:.45rem;position:relative}
.fld label{font-family:var(--f-mono);font-size:.715rem;letter-spacing:.17em;text-transform:uppercase;
  color:var(--haze-d);transition:color .3s}
.fld:focus-within label{color:var(--cyan)}
.fld input,.fld select,.fld textarea{width:100%;padding:.82rem .95rem;background:rgba(15,42,56,.6);
  border:1px solid var(--line);color:var(--frost);font-size:1.02rem;
  transition:border-color .3s,background .3s,box-shadow .3s}
.fld textarea{min-height:132px;resize:vertical}
.fld input:hover,.fld select:hover,.fld textarea:hover{border-color:var(--line-2)}
.fld input:focus,.fld select:focus,.fld textarea:focus{outline:none;border-color:var(--cyan);
  background:rgba(53,214,245,.05);box-shadow:0 0 0 1px var(--cyan)}
.fld select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--cyan) 50%),
  linear-gradient(135deg,var(--cyan) 50%,transparent 50%);
  background-position:calc(100% - 19px) 50%,calc(100% - 13px) 50%;
  background-size:6px 6px,6px 6px;background-repeat:no-repeat;padding-right:2.5rem}
.fld select option{background:var(--deep);color:var(--frost)}
.fld input[type=file]{padding:.7rem;font-family:var(--f-mono);font-size:.8rem;color:var(--haze)}
.fld input[type=file]::file-selector-button{margin-right:.85rem;padding:.45em .9em;
  font-family:var(--f-mono);font-size:.715rem;letter-spacing:.14em;text-transform:uppercase;
  background:var(--steel);color:var(--frost);border:1px solid var(--line-2);cursor:pointer}
.f-note{font-family:var(--f-mono);font-size:.69rem;letter-spacing:.11em;color:var(--haze-d);
  text-transform:uppercase}

/* legal document */
.doc{display:grid;gap:1.15rem;max-width:74ch}
.doc h2{font-size:clamp(1.2rem,2.4vw,1.6rem);margin-top:2.4rem;padding-top:1.5rem;
  border-top:1px solid var(--line);font-variation-settings:'wdth' 108}
.doc h2:first-of-type{margin-top:1rem}
.doc p{color:#B9CDD5}
.doc ol{display:grid;gap:.85rem;counter-reset:d}
.doc ol li{position:relative;padding-left:2.6rem;color:var(--haze);counter-increment:d}
.doc ol li::before{content:counter(d,decimal-leading-zero);position:absolute;left:0;top:.1em;
  font-family:var(--f-mono);font-size:.76rem;letter-spacing:.1em;color:var(--cyan)}
.doc ol li strong{color:var(--frost);font-weight:600}
.doc a{color:var(--cyan);border-bottom:1px solid rgba(53,214,245,.3)}
.doc a:hover{border-color:var(--cyan)}
.doc-meta{font-family:var(--f-mono);font-size:.725rem;letter-spacing:.17em;text-transform:uppercase;
  color:var(--sand)}

/* pull quote */
.pq{position:relative;padding-left:clamp(1.5rem,4vw,3rem);font-family:var(--f-disp);font-weight:700;
  font-size:clamp(1.35rem,3.2vw,2.25rem);line-height:1.18;letter-spacing:-.024em;
  font-variation-settings:'wdth' 110;color:var(--frost);text-wrap:balance}
.pq::before{content:'';position:absolute;left:0;top:.2em;bottom:.2em;width:2px;
  background:linear-gradient(180deg,var(--cyan),transparent)}

/* ============ footer ============ */
.ftr{position:relative;z-index:1;padding-top:clamp(3.5rem,7vw,6rem);padding-bottom:2rem;
  border-top:1px solid var(--line);background:linear-gradient(180deg,rgba(20,53,68,0),rgba(20,53,68,.7))}
/* brand, then the three IA columns, then the Dubai desk */
.ftr-g{display:grid;gap:clamp(1.6rem,3vw,3rem);grid-template-columns:1.35fr .75fr .75fr .75fr 1.05fr;
  padding-bottom:clamp(2.5rem,5vw,4rem)}
/* the brand cell spans the row so the three link columns stay side by side
   for one more step before they stack */
@media (max-width:1180px){.ftr-g{grid-template-columns:repeat(3,1fr)}
  .ftr-g>:first-child{grid-column:1/-1}}
@media (max-width:760px){.ftr-g{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.ftr-g{grid-template-columns:1fr}}
.ftr-blurb{margin-top:1.15rem;max-width:38ch;color:var(--haze);font-size:.98rem}
.ftr-col h6{font-family:var(--f-mono);font-size:.715rem;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;color:var(--cyan);margin-bottom:1.15rem}
.ftr-col ul{display:grid;gap:.62rem}
.ftr-col a{color:var(--haze);font-size:1rem;transition:color .3s,padding-left .3s}
.ftr-col a:hover{color:var(--frost);padding-left:5px}
.ftr-line{display:block;color:var(--haze);font-size:1rem;margin-bottom:.62rem}
.ftr-line.hi{color:var(--frost);font-family:var(--f-mono);font-size:.95rem;letter-spacing:.04em}
.ftr-b{display:flex;flex-wrap:wrap;gap:1rem 2rem;justify-content:space-between;align-items:center;
  padding-top:1.6rem;border-top:1px solid var(--line);font-family:var(--f-mono);font-size:.69rem;
  letter-spacing:.14em;text-transform:uppercase;color:var(--haze-d)}
.ftr-b a:hover{color:var(--cyan)}
.ftr-b div{display:flex;gap:1.5rem;flex-wrap:wrap}

/* giant footer wordmark, clipped */
.ftr-word{overflow:hidden;padding-top:clamp(1.5rem,4vw,3rem);margin-bottom:-.14em}
.ftr-word svg{width:100%;height:auto;display:block}
.ftr-word text{font-family:var(--f-disp);font-weight:800;font-variation-settings:'wdth' 125;
  letter-spacing:-.03em;fill:none;stroke:var(--line-2);stroke-width:.4}

/* ============ reveal / motion ============ */
.rv{opacity:0;transform:translateY(26px);transition:opacity .95s var(--ease),transform .95s var(--ease);
  transition-delay:var(--d,0ms)}
.rv[data-in]{opacity:1;transform:none}
.rvs>*{opacity:0;transform:translateY(26px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.rvs[data-in]>*{opacity:1;transform:none}
.rvs[data-in]>*:nth-child(1){transition-delay:0ms}
.rvs[data-in]>*:nth-child(2){transition-delay:90ms}
.rvs[data-in]>*:nth-child(3){transition-delay:180ms}
.rvs[data-in]>*:nth-child(4){transition-delay:270ms}
.rvs[data-in]>*:nth-child(5){transition-delay:360ms}
.rvs[data-in]>*:nth-child(6){transition-delay:450ms}
.rvs[data-in]>*:nth-child(n+7){transition-delay:520ms}

/* kinetic headline — per-word mask reveal */
.kin{display:block}
.kin .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.06em;margin-bottom:-.06em}
.kin .w>i{display:inline-block;font-style:inherit;transform:translateY(105%);
  transition:transform 1.05s var(--ease);transition-delay:calc(var(--i) * 55ms)}
.kin[data-in] .w>i{transform:none}

.skip{position:absolute;left:-9999px;z-index:9999;padding:1rem 1.5rem;background:var(--cyan);
  color:var(--void);font-family:var(--f-mono);font-size:.8rem;letter-spacing:.15em;text-transform:uppercase}
.skip:focus{left:var(--frame);top:var(--frame)}
:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}

@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;
    transition-duration:.001ms!important}
  .rv,.rvs>*{opacity:1!important;transform:none!important}
  .kin .w>i{transform:none!important}
  .grain::before{animation:none}
  .mq-t{animation:none}
}
`;
