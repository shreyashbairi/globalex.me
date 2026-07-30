const { hero, cta } = require("../parts");
// Families live in the catalogue so this page, products.html and site search
// cannot drift apart.
const { POLYMERS } = require("../catalogue");

const family = (p) => `<article class="fam-c" id="${p.id}">
  <div class="fam-vis"><span class="ix">${p.ix}</span><canvas data-poly="${p.vis}"></canvas></div>
  <div class="fam-b">
    <h3>${p.name}</h3>
    <div class="chips">${p.specs.map((s) => `<span class="chip spec">${s}</span>`).join("")}</div>
    <p>${p.body}</p>
  </div>
</article>`;

const CRUMB = [["Products", "products.html"], "Polymers"];

module.exports = {
  page: "polymers",
  tier: "class",
  nav: "products",
  crumb: CRUMB,
  title: "Polymers — Globalex Trading FZCO",
  desc: "Polyethylene (LDPE, HDPE, LLDPE, UHMWPE), polypropylene homopolymer and copolymer, and performance additives — sourced from Turkmenistan, Uzbekistan, UAE, Saudi Arabia and China.",

  css: `
/* resin family cards, each with its own chain visual */
.fam{display:grid;gap:var(--gut)}
.fam-c{display:grid;grid-template-columns:minmax(0,320px) 1fr;gap:0;border:1px solid var(--line);
  overflow:hidden;transition:border-color .45s var(--ease)}
.fam-c:hover{border-color:var(--line-2)}
.fam-vis{position:relative;background:var(--deep);border-right:1px solid var(--line);min-height:230px}
.fam-vis canvas{position:absolute;inset:0;width:100%;height:100%}
.fam-vis .ix{position:absolute;top:14px;left:14px;z-index:2;font-family:var(--f-mono);font-size:.69rem;
  letter-spacing:.2em;text-transform:uppercase;color:var(--cyan)}
.fam-b{padding:clamp(1.6rem,3vw,2.4rem);display:grid;gap:1rem;align-content:center}
.fam-b p{color:var(--haze);max-width:70ch}
@media (max-width:860px){.fam-c{grid-template-columns:1fr}
  .fam-vis{border-right:0;border-bottom:1px solid var(--line);min-height:170px}}

/* application sectors */
.app{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line)}
.app-c{padding:clamp(1.5rem,2.8vw,2.2rem);border-right:1px solid var(--line);display:grid;gap:.85rem;
  align-content:start;position:relative;overflow:hidden;transition:background .45s var(--ease)}
.app-c:last-child{border-right:0}
.app-c:hover{background:rgba(53,214,245,.05)}
.app-c .eb{font-size:.69rem}
.app-c p{color:var(--haze);font-size:.99rem}
.app-c ul{display:grid;gap:.4rem;margin-top:.3rem}
.app-c li{display:flex;gap:.6rem;align-items:baseline;font-family:var(--f-mono);font-size:.725rem;
  letter-spacing:.12em;text-transform:uppercase;color:var(--haze-d)}
.app-c li::before{content:'';width:5px;height:5px;flex:none;background:var(--cyan);opacity:.65;
  clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
@media (max-width:900px){.app{grid-template-columns:1fr}
  .app-c{border-right:0;border-bottom:1px solid var(--line)}.app-c:last-child{border-bottom:0}}
`,

  body: `
${hero({
  crumb: CRUMB,
  eyebrow:
    "Class 02 &middot; 3 families &middot; Gulf, Caspian &amp; East Asia",
  h1: "Polymers",
  lead: "Polyethylene across LDPE, HDPE, LLDPE and UHMWPE; polypropylene homopolymer and copolymer; and the additives that tune a resin to its application.",
  meta: [
    ["3", "Families"],
    ["5", "Origin markets"],
    ["Dubai", "Held inventory"],
    ["MFI", "Spec matched"],
  ],
  sec: "Polymers",
})}

<section class="sec is-tight" data-sec="Families">
  <div class="wrap">
    <div class="fam rvs">

${POLYMERS.map(family).join("\n")}

    </div>
  </div>
</section>

<section class="sec sec-panel" data-sec="Applications">
  <div class="wrap">
    <div class="hd rv">
      <span class="eb">Where the resin ends up</span>
      <h2>One material category, most of modern manufacturing.</h2>
      <p class="lead">Our buyers are converters across the Middle East, North Africa and South Asia. We work to grade, packaging spec and delivery window &mdash; and we hold inventory positions in Dubai for short lead-time orders.</p>
    </div>

    <div class="app rvs">
      <div class="app-c">
        <span class="eb">Packaging</span>
        <p>Film, closures, rigid containers and the barrier layers that keep food and medical supplies sterile.</p>
        <ul><li>LDPE &middot; LLDPE film</li><li>HDPE blow-moulding</li><li>PP hot-fill</li></ul>
      </div>
      <div class="app-c">
        <span class="eb">Construction &amp; water</span>
        <p>Pressure pipe, conduit, geomembrane and fittings &mdash; where a fifty-year service life is the specification.</p>
        <ul><li>HDPE PE100 pipe</li><li>PPR hot water</li><li>UV-stabilised grades</li></ul>
      </div>
      <div class="app-c">
        <span class="eb">Automotive &amp; goods</span>
        <p>Bumpers, interior trim, battery casings, appliance housings and technical textiles.</p>
        <ul><li>PP impact copolymer</li><li>UHMWPE wear parts</li><li>Flame-retardant compounds</li></ul>
      </div>
    </div>
  </div>
</section>

<section class="sec is-tight" data-sec="Logistics">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="eb">Sourcing &amp; logistics</span>
        <h3 style="margin-top:.9rem">Five origins, so price and lead time stay negotiable.</h3>
      </div>
      <div class="rv" style="--d:120ms">
        <p class="lead">Polymer supply runs from <strong>Turkmenistan, Uzbekistan, the UAE, Saudi Arabia</strong> and <strong>China</strong>. Multiple origins let us match price, lead time and grade specification to your production window rather than to a single mill's schedule. Trade follows our standard ten-step procedure.</p>
        <div class="btns" style="margin-top:1.6rem"><a href="procedures.html" class="lk">Read the ten-step procedure</a></div>
      </div>
    </div>
  </div>
</section>

${cta({
  eyebrow: "Request a quote",
  h2: "Need polymer supply at scale?",
  lead: "Share grade, melt-flow index target, volume and destination &mdash; we match origin to spec and come back with pricing.",
  primary: ["Request a quote", "contact.html"],
})}
`,

  js: `
/* Polymer chain visuals: chain architecture is the actual difference between
   these families, so each canvas draws its own topology. */
function chains(cv, mode){
  var rows = [], i;
  var N = mode === 'add' ? 0 : (mode === 'pe' ? 5 : 4);
  for (i=0;i<N;i++){
    rows.push({y:(i+.85)/(N+.7), ph:Math.random()*6.3,
      amp: mode === 'pe' ? .055 + Math.random()*.05 : .028,
      f: mode === 'pe' ? 1.3 + Math.random()*1.4 : 2.6,
      sp:.24 + Math.random()*.26,
      branch: mode === 'pe' && i % 2 === 0});
  }
  var mol = [];
  if (mode === 'add'){
    for (i=0;i<22;i++) mol.push({x:Math.random(),y:Math.random(),
      vx:(Math.random()-.5)*.0012, vy:(Math.random()-.5)*.0012, r:1+Math.random()*1.7,
      sand: i % 3 === 0});
  }
  glxStage(cv, function(x,w,h,t){
    x.clearRect(0,0,w,h);

    if (mode === 'add'){
      mol.forEach(function(p){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<.03||p.x>.97)p.vx*=-1; if(p.y<.03||p.y>.97)p.vy*=-1;
      });
      for (var a=0;a<mol.length;a++) for (var b=a+1;b<mol.length;b++){
        var ax=mol[a].x*w, ay=mol[a].y*h, bx=mol[b].x*w, by=mol[b].y*h;
        var d=Math.hypot(ax-bx,ay-by), lim=Math.min(w,h)*.34;
        if (d<lim){
          x.strokeStyle='rgba(53,214,245,'+(.20*(1-d/lim)).toFixed(3)+')';
          x.lineWidth=1; x.beginPath(); x.moveTo(ax,ay); x.lineTo(bx,by); x.stroke();
        }
      }
      mol.forEach(function(p,k){
        var bx=p.x*w, by=p.y*h, pulse=Math.sin(t*.95+k)*.5+.5, r=p.r*(1+pulse*.55);
        x.save(); x.translate(bx,by); x.rotate(Math.PI/4);
        x.fillStyle = p.sand ? 'rgba(217,183,120,'+(.45+pulse*.4)+')'
                             : 'rgba(53,214,245,'+(.4+pulse*.45)+')';
        x.fillRect(-r,-r,r*2,r*2); x.restore();
      });
      return;
    }

    rows.forEach(function(c,ci){
      var pts = [];
      for (var px=0;px<=w;px+=4){
        var u=px/w;
        pts.push([px,(c.y + Math.sin(u*Math.PI*2*c.f + t*c.sp*2 + c.ph)*c.amp)*h]);
      }
      x.strokeStyle='rgba(53,214,245,.32)'; x.lineWidth=1.2;
      x.beginPath(); pts.forEach(function(p,k){ k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]); }); x.stroke();

      // LDPE branches: the short side chains that stop the polymer packing tight
      if (c.branch){
        for (var s=0.12;s<1;s+=.19){
          var k2 = Math.floor(s*(pts.length-1)), p0 = pts[k2];
          var dir = (ci%4<2) ? -1 : 1;
          x.strokeStyle='rgba(53,214,245,.22)';
          x.beginPath(); x.moveTo(p0[0],p0[1]);
          x.lineTo(p0[0]+9, p0[1]+dir*h*.075); x.stroke();
          x.save(); x.translate(p0[0]+9, p0[1]+dir*h*.075); x.rotate(Math.PI/4);
          x.fillStyle='rgba(53,214,245,.5)'; x.fillRect(-1.5,-1.5,3,3); x.restore();
        }
      }

      var beads = mode === 'pe' ? 12 : 16;
      for (var k=0;k<=beads;k++){
        var u2=k/beads, mx=u2*w;
        var my=(c.y + Math.sin(u2*Math.PI*2*c.f + t*c.sp*2 + c.ph)*c.amp)*h;
        var pulse=Math.sin(t*1.3 - k*.38 + ci)*.5+.5;
        x.save(); x.translate(mx,my); x.rotate(Math.PI/4);
        var r=1.9+pulse*1.4;
        x.fillStyle='rgba(53,214,245,'+(.35+pulse*.5)+')';
        x.fillRect(-r,-r,r*2,r*2); x.restore();
      }
    });
  });
}

window.glxPage = function(){
  [].forEach.call(document.querySelectorAll('[data-poly]'), function(cv){
    chains(cv, cv.getAttribute('data-poly'));
  });
};
`,
};
