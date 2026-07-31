/* ============================================================
   SCENE3D — the interior pages' WebGL stages

   The home page has one piece of spectacle, the corridor globe. Everywhere
   else the hero carried a flat gül ornament, which is fine as wallpaper and
   says nothing about the page it sits on. This file gives eight pages a scene
   of their own: a thing that is actually about the page, drawn in three
   dimensions, that a visitor can take hold of and turn.

   ------------------------------------------------------------
   HOW IT FITS TOGETHER

     _src/parts.js      hero({stage:{name, kicker}}) emits the canvas, the
                        readout and the has-3d class
     _src/kernel-css.js .ph.has-3d and .ph-3d — the frame around the canvas
     this file          the scene code, inlined into the page that asked for it

   A page opts in with three lines:

       three: true,                               // loads three.js from CDN
       body: hero({ ..., stage: {name:'skyline', kicker:'Dubai HQ'} }),
       js:   scene3d.bundle('skyline'),

   bundle() emits the shared bootstrap plus ONE scene, not all eight, so a
   page carries about 11 KB rather than 60.

   ------------------------------------------------------------
   THE RULES EVERY SCENE FOLLOWS

   1. Colour comes from GLXC, never from CSS. A three.js material takes a
      number or a string; a var() handed to one is silently ignored. Scene
      colours are named against the same tokens the globe uses — globeBorder
      for structure, globeGraticule for scaffolding, cyan / sand for the two
      accents, signal for anything moving — so recolouring the site in
      _src/theme.js recolours all eight scenes with it.

   2. A line drawn on a light palette takes the DARKER end of its accent.
      A.lineMat does that swap automatically: a mid cyan and a mid gold both
      sit at roughly the lightness of pale sage and disappear into it, which
      is the single mistake that cost the light theme most of its animation
      the first time round.

   3. Additive blending is switched off on a light palette. Additive adds
      light: it makes a thin line glow against near-black and does nothing at
      all against off-white.

   4. Nothing is required. No WebGL, no three.js, a context that fails to
      allocate — each falls back to the gül ornament the hero used to carry,
      on the same canvas. Reduced motion keeps the geometry and stops the
      motion; it never leaves an empty rectangle.
   ============================================================ */

/* ------------------------------------------------------------------ core */

const CORE = `
/* Shared bootstrap: renderer, orbit, readout, frame loop. Each scene is a
   function that receives this and returns a config plus a frame callback. */
function glx3d(build){
  var host = document.querySelector('[data-3d]');
  if (!host) return;
  var cv = host.querySelector('canvas');
  if (!cv) return;

  var T = window.THREE;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LIGHT = GLXC.polarity === 'light';
  var TONE = host.getAttribute('data-tone') || 'cyan';

  /* The hero carried a gül field before it carried a scene, so that is what a
     machine without WebGL gets back — on the same canvas, full-bleed, which
     is the design this replaced rather than a hole where it used to be. */
  function flat(){
    host.setAttribute('data-flat','');
    /* The readout names what the scene is showing and invites a drag. With no
       scene there is nothing to name and nothing to drag, so it goes with the
       scene rather than sitting there describing an absence. */
    var hud = document.querySelector('.ph-3d-hud');
    if (hud) hud.hidden = true;
    if (!window.glxOrnament) return;
    var s = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--orn-scale')) || 1;
    glxOrnament(cv, {tone:TONE, tile:146, nodes:5, alpha:0.3 * s});
  }
  if (!T){ flat(); return; }
  var renderer;
  try {
    renderer = new T.WebGLRenderer({canvas:cv, antialias:true, alpha:true,
      powerPreference:'high-performance'});
  } catch(e){ flat(); return; }
  if (!renderer.getContext()){ flat(); return; }

  var DPR = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  var BLEND = LIGHT ? T.NormalBlending : T.AdditiveBlending;

  var FOV = 30;
  var scene = new T.Scene();
  var cam = new T.PerspectiveCamera(FOV, 1, 0.1, 200);
  var uPx = {value: 900};

  var world = new T.Group();   // pitch, from the drag
  var root  = new T.Group();   // yaw, from the drag and the idle spin
  world.add(root); scene.add(world);

  /* ---- colour ----
     ink() is rule 2 of the file header in one line: on a light palette an
     accent takes the darker end of its ramp.

     It applies to sprites as well as to lines, which is not where this
     started. The globe gets away with mid-tone markers because it draws them
     onto a sphere; these scenes draw onto the page itself, and a six-pixel
     mid-gold dot on off-white is not a dot, it is nothing. Every colour a
     scene asks for goes through here. */
  var INK = LIGHT ? {cyan:'cyanD', sand:'sandD', frost:'textLead'} : {};
  function ink(n){ return INK[n] || n; }
  function col(n){ return new T.Color(GLXC.int[ink(n)]); }
  var BG = new T.Color(GLXC.int.pageBackground);

  function lineMat(n, o){
    return new T.LineBasicMaterial({color:GLXC.int[ink(n)], transparent:true,
      opacity:o, blending:BLEND, depthWrite:false});
  }
  function geo(a){
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(a, 3));
    return g;
  }
  function segs(a, n, o){ return new T.LineSegments(geo(a), lineMat(n, o)); }
  function poly(a, n, o){ return new T.Line(geo(a), lineMat(n, o)); }
  function ring(a, n, o){ return new T.LineLoop(geo(a), lineMat(n, o)); }

  /* Vertex-coloured segments, for anything that fades over its own length —
     a ground grid dying into the distance, a bond lighting as a wave crosses
     it. Fading is done by lerping toward the PAGE colour rather than toward
     black: on a dark palette those are the same thing, on a light one they
     are opposites and the grid would have got harder at the horizon. */
  function vsegs(n, count, o){
    var g = new T.BufferGeometry();
    var p = new Float32Array(count*3), c = new Float32Array(count*3);
    g.setAttribute('position', new T.BufferAttribute(p, 3));
    g.setAttribute('color', new T.BufferAttribute(c, 3));
    var obj = new T.LineSegments(g, new T.LineBasicMaterial({vertexColors:true,
      transparent:true, opacity:o, blending:BLEND, depthWrite:false}));
    /* Every buffer here is rewritten per frame, and three.js computes a
       bounding sphere once — from whatever was in the buffer the first time
       it was asked, which is all zeroes. Culling against that sphere is a
       coin flip, so it is switched off rather than kept correct. */
    obj.frustumCulled = false;
    return {obj:obj, geo:g, pos:p, col:c, base:col(n),
      put:function(i, ax, ay, az, bx, by, bz){
        var k = i*6; p[k]=ax; p[k+1]=ay; p[k+2]=az; p[k+3]=bx; p[k+4]=by; p[k+5]=bz;
      },
      /* f = 0 full strength, 1 gone */
      fade:function(i, f, c2){
        var s = (c2 || this.base).clone().lerp(BG, Math.max(0, Math.min(1, f)));
        var k = i*6;
        c[k]=s.r; c[k+1]=s.g; c[k+2]=s.b; c[k+3]=s.r; c[k+4]=s.g; c[k+5]=s.b;
      },
      flush:function(){ g.attributes.position.needsUpdate = true;
        g.attributes.color.needsUpdate = true; }};
  }

  /* ---- point sprites ----
     One shader, three shapes. The diamond is the site's marker everywhere
     else, so it is the default; round is for anything physically granular;
     the annulus is a shockwave. Size is held in world units and divided by
     depth, so a sprite keeps a constant SCREEN size however far back it is —
     the same trick the globe's dot field uses. */
  var SPRITE_V = [
    'attribute vec3 aCol; attribute float aS; attribute float aA;',
    'varying vec3 vC; varying float vA;',
    'uniform float uPx; uniform float uSize;',
    'void main(){ vC = aCol; vA = aA;',
    ' vec4 mv = modelViewMatrix * vec4(position,1.0);',
    ' gl_PointSize = uSize * max(aS,0.0) * uPx / max(0.001, -mv.z);',
    ' gl_Position = projectionMatrix * mv; }'
  ].join('\\n');

  function spriteF(shape){
    var d = shape === 'round' || shape === 'ring'
      ? ' float d = length(p);'
      : ' float d = abs(p.x) + abs(p.y);';
    var a = shape === 'ring'
      ? ' float e = smoothstep(0.50, 0.40, d) * smoothstep(0.26, 0.36, d);'
      : ' float e = smoothstep(0.50, 0.10, d);';
    return ['varying vec3 vC; varying float vA; uniform float uOp;',
      'void main(){', ' vec2 p = gl_PointCoord - 0.5;', d,
      ' if (d > 0.5) discard;', a,
      ' gl_FragColor = vec4(vC, e * uOp * clamp(vA, 0.0, 1.0));',
      '}'].join('\\n');
  }

  function cloud(n, size, op, shape){
    var g = new T.BufferGeometry();
    var p = new Float32Array(n*3), c = new Float32Array(n*3);
    var s = new Float32Array(n), a = new Float32Array(n);
    g.setAttribute('position', new T.BufferAttribute(p, 3));
    g.setAttribute('aCol', new T.BufferAttribute(c, 3));
    g.setAttribute('aS', new T.BufferAttribute(s, 1));
    g.setAttribute('aA', new T.BufferAttribute(a, 1));
    var m = new T.ShaderMaterial({transparent:true, depthWrite:false, blending:BLEND,
      uniforms:{uPx:uPx, uSize:{value:size}, uOp:{value:op}},
      vertexShader:SPRITE_V, fragmentShader:spriteF(shape)});
    var pts = new T.Points(g, m);
    pts.frustumCulled = false;
    return {obj:pts, geo:g, mat:m, pos:p, size:s, alpha:a, n:n,
      at:function(i, x, y, z){ p[i*3]=x; p[i*3+1]=y; p[i*3+2]=z; },
      tint:function(i, cc){ c[i*3]=cc.r; c[i*3+1]=cc.g; c[i*3+2]=cc.b; },
      flush:function(){
        g.attributes.position.needsUpdate = true; g.attributes.aCol.needsUpdate = true;
        g.attributes.aS.needsUpdate = true; g.attributes.aA.needsUpdate = true; }};
  }

  /* ---- misc ----
     Seeded, so the city a visitor saw on Friday is the city they see on
     Monday. Math.random reshuffles the layout on every reload, which reads as
     a rendering bug rather than as variety. */
  var seed = 20190411;
  function rnd(){ seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
  function rng(a, b){ return a + rnd() * (b - a); }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function V(x, y, z){ return new T.Vector3(x, y, z); }
  function circle(r, n, y, ax){
    var a = [];
    for (var i=0;i<n;i++){
      var th = i/n * Math.PI * 2;
      if (ax === 'y') a.push(Math.cos(th)*r, y, Math.sin(th)*r);
      else a.push(Math.cos(th)*r, Math.sin(th)*r, y);
    }
    return a;
  }
  function boxEdges(out, cx, cy, cz, hx, hy, hz){
    var v = [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],
             [-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]];
    var e = [0,1,1,2,2,3,3,0, 4,5,5,6,6,7,7,4, 0,4,1,5,2,6,3,7];
    for (var i=0;i<e.length;i++){
      var p = v[e[i]];
      out.push(cx + p[0]*hx, cy + p[1]*hy, cz + p[2]*hz);
    }
  }

  /* ---- readout ---- */
  var kEl = document.querySelector('[data-3d-k]');
  var vEl = document.querySelector('[data-3d-v]');
  function say(v, k){
    if (kEl && k) kEl.textContent = k;
    if (!vEl || vEl.textContent === v) return;
    vEl.textContent = v;
    vEl.removeAttribute('data-tick');
    void vEl.offsetWidth;          // restart the animation rather than skip it
    vEl.setAttribute('data-tick','');
  }

  var P = {x:0, y:0, over:false};
  var A = {T:T, scene:scene, root:root, world:world, cam:cam, uPx:uPx,
    LIGHT:LIGHT, RM:RM, BLEND:BLEND, p:P,
    ink:ink, col:col, lineMat:lineMat, geo:geo, segs:segs, poly:poly, ring:ring,
    vsegs:vsegs, cloud:cloud, rnd:rnd, rng:rng, clamp:clamp, V:V,
    circle:circle, boxEdges:boxEdges, say:say,
    data: (typeof GLX3D_DATA === 'undefined' ? null : GLX3D_DATA)};

  var S = build(A) || {};

  /* Camera distance is declared as S.fit — the radius of the sphere the
     scene wants inside the frame — rather than as a distance, because a
     distance is a number nobody can check. A sphere of radius R subtends the
     full field of view at R/sin(FOV/2), so that is the distance; 1/sin(15deg)
     is 3.864. Ground-plane scenes set S.dist directly instead: half their
     extent is depth, perspective already shortens it, and fitting them as a
     sphere puts the camera in the next postcode. */
  var DIST = S.fit ? S.fit / Math.sin(FOV * Math.PI / 360) : (S.dist || 4.8);
  var LIM = S.limit == null ? 0.85 : S.limit;
  var SPIN = S.spin == null ? 0.13 : S.spin;

  /* Yaw is kept as a base plus an offset rather than accumulated straight
     onto the object, because two things drive it and one of them has to be
     able to return.

     A scene that is roughly as wide as it is deep can turn all the way round
     and stay in frame. A corridor cannot: seen end-on it is a metre across
     and seen side-on it is seven, so a scene that spins freely spends half
     its life hanging off the edge of the stage. Those scenes declare S.sway
     instead — the idle motion becomes a slow oscillation about the framing
     they were composed for, and a drag still moves them anywhere the visitor
     wants, because the drag offset is added on top rather than replacing it. */
  var YAW0 = S.yaw || 0, yawOff = 0;
  var SWAY = S.sway || null;
  root.rotation.y = YAW0;
  world.rotation.x = S.tilt || 0;

  var LOOK = V(0, S.look || 0, 0);
  var OFF = V(0, S.lift || 0, DIST).sub(LOOK);
  function place(k){
    cam.position.copy(LOOK).addScaledVector(OFF, 1 + k * 0.5);
    cam.lookAt(LOOK);
    cam.rotation.z += k * 0.12;    // a slight roll as the hero leaves
  }

  /* ---- orbit with inertia ---- */
  var drag = false, lx = 0, ly = 0, vY = 0, vX = 0, idle = 0;
  var hint = document.querySelector('[data-3d-hint]');
  cv.style.touchAction = 'pan-y';
  /* Not cursor:grab. The site hides the native pointer on desktop and draws
     its own, so a CSS cursor here would put a second one on screen over the
     one interactive surface on the page. data-cur is the existing hook: the
     custom cursor opens and takes this as its label. */
  cv.setAttribute('data-cur', 'Drag to orbit');
  cv.addEventListener('pointerdown', function(e){
    drag = true; lx = e.clientX; ly = e.clientY; idle = 0;
    if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId);
    if (hint) hint.setAttribute('data-off','');
  });
  cv.addEventListener('pointermove', function(e){
    var r = cv.getBoundingClientRect();
    if (r.width && r.height){
      P.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      P.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      P.over = true;
    }
    if (!drag) return;
    vY = (e.clientX - lx) * 0.0055;
    vX = (e.clientY - ly) * 0.0035;
    lx = e.clientX; ly = e.clientY;
    yawOff += vY;
    world.rotation.x = clamp(world.rotation.x + vX, -LIM, LIM);
    idle = 0;
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
    cv.addEventListener(ev, function(){
      drag = false;
      if (ev === 'pointerleave') P.over = false;
    });
  });

  /* ---- resize ----
     A ResizeObserver rather than a window listener alone: the stage is sized
     from the hero rather than from the viewport, and it can arrive at zero —
     the preloader locks the body while this runs — in which case there is no
     resize event to wait for and a one-shot measurement would leave the
     renderer at its 300x150 default forever. */
  var sized = false;
  function resize(){
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    sized = true;
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / Math.max(1, r.height);
    cam.updateProjectionMatrix();
    // px per world unit at unit depth: (drawingBufferHeight/2) / tan(fov/2)
    uPx.value = (r.height * DPR * 0.5) / Math.tan(FOV * Math.PI / 360);
  }
  addEventListener('resize', resize, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(cv);
  resize();

  /* ---- scroll: the stage recedes as the hero leaves ---- */
  var sk = 0;
  function onScroll(){
    var r = host.getBoundingClientRect();
    sk = clamp(-r.top / Math.max(1, r.height), 0, 1);
    host.style.opacity = String(1 - sk * 0.82);
  }
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- frame ---- */
  var visible = true;
  if ('IntersectionObserver' in window)
    new IntersectionObserver(function(r){ visible = r[0].isIntersecting; }).observe(cv);

  var t0 = performance.now(), last = t0;
  function frame(now){
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible) return;
    if (!sized){ resize(); if (!sized) return; }
    var t = (now - t0) / 1000;

    if (P.tx != null){ P.x += (P.tx - P.x) * 0.06; P.y += (P.ty - P.y) * 0.06; }

    if (!drag){
      vY *= 0.94; vX *= 0.90;
      yawOff += vY;
      world.rotation.x = clamp(world.rotation.x + vX, -LIM, LIM);
      idle += dt;
      var wake = Math.min(1, (idle - 1.4) / 1.6);
      if (idle > 1.4 && !RM && !SWAY) yawOff += SPIN * dt * wake;
      /* A swaying scene walks its drag offset back to zero once the visitor
         lets go, so it always returns to the framing it was composed for. */
      if (SWAY && idle > 1.4) yawOff *= 1 - 0.6 * dt * wake;
    }
    root.rotation.y = YAW0 + yawOff
      + (SWAY && !RM ? Math.sin(t * SWAY.rate) * SWAY.amp : 0);

    place(sk);
    if (S.frame) S.frame(t, dt);
    renderer.render(scene, cam);
  }
  requestAnimationFrame(frame);
  world.updateMatrixWorld(true);
}
`;

/* --------------------------------------------------------------- scenes */

const SCENES = {};

/* ---------------------------------------------------------------- about
   A wireframe Jumeirah Lakes Towers: two lakes with the cluster standing
   around them, our own tower called out in the system accent, and a survey
   plane sweeping up through the floors. The pointer drives the sweep — the
   one interaction on the page that is genuinely about looking at something
   rather than turning it. */
SCENES.skyline = {
  fn: 'sceneSkyline',
  src: `
function sceneSkyline(A){
  var T = A.T, root = A.root, rng = A.rng, rnd = A.rnd;

  /* --- the two lakes JLT is named after --- */
  var LAKES = [{x:-0.52, z:0.36, rx:0.48, rz:0.36}, {x:0.58, z:-0.38, rx:0.42, rz:0.32}];
  function inLake(x, z, pad){
    for (var i=0;i<LAKES.length;i++){
      var L = LAKES[i];
      var dx = (x - L.x) / (L.rx + pad), dz = (z - L.z) / (L.rz + pad);
      if (dx*dx + dz*dz < 1) return true;
    }
    return false;
  }
  LAKES.forEach(function(L){
    var a = [];
    for (var i=0;i<72;i++){
      var th = i/72 * Math.PI * 2;
      a.push(L.x + Math.cos(th)*L.rx, 0.004, L.z + Math.sin(th)*L.rz);
    }
    root.add(A.ring(a, 'cyan', A.LIGHT ? 0.62 : 0.34));
  });

  /* --- ground grid, dying into the distance --- */
  (function(){
    var R = 1.75, s = 0.22, lines = [];
    for (var v=-R; v<=R+0.001; v+=s){ lines.push([v,-R,v,R], [-R,v,R,v]); }
    var g = A.vsegs('globeGraticule', lines.length*2, 1);
    lines.forEach(function(L, i){
      g.put(i, L[0], 0, L[1], L[2], 0, L[3]);
      var m = (Math.abs(L[0]) + Math.abs(L[1]) + Math.abs(L[2]) + Math.abs(L[3])) / (4*R);
      g.fade(i, Math.pow(m, 1.4) * 0.95);
    });
    g.flush(); root.add(g.obj);
  })();

  /* --- the cluster ---
     Towers are the site's own instrument frame in three dimensions: four
     verticals, a cap, and a stack of floor plates. The plates are held in a
     vertex-coloured buffer of their own because they are what the survey
     plane lights as it passes, and recolouring 3,000 vertices a frame is
     cheaper than rebuilding any geometry. */
  var towers = [], edges = [];
  for (var gx=-1.6; gx<=1.61; gx+=0.27){
    for (var gz=-1.6; gz<=1.61; gz+=0.27){
      var x = gx + rng(-0.055, 0.055), z = gz + rng(-0.055, 0.055);
      if (inLake(x, z, 0.02)) continue;
      /* A round footprint, not a square one. The cluster turns on its own
         axis, and a square plan is 41% wider across the diagonal — it would
         swell out of frame twice a revolution and shrink back for no reason
         anyone watching could see. */
      var edge = Math.sqrt(x*x + z*z);
      if (edge > 1.52 || rnd() < 0.24) continue;
      /* Height falls off toward the edge: a real cluster is tallest on the
         waterfront, and a field of equal blocks reads as graph paper. */
      var near = 1 - Math.min(1, edge / 1.7);
      towers.push({x:x, z:z, w:rng(0.036, 0.064), h:rng(0.12, 0.26) + near * rng(0.22, 0.54)});
    }
  }
  var HERO = {x:0.05, z:-0.02, w:0.07, h:0.98, hero:true};
  towers.push(HERO);

  var plateCount = 0;
  towers.forEach(function(tw){
    tw.floors = Math.max(2, Math.round(tw.h / 0.062));
    plateCount += tw.floors * 4;
  });
  var plates = A.vsegs('globeBorder', plateCount*2, A.LIGHT ? 0.78 : 0.55);
  var pi = 0;
  towers.forEach(function(tw){
    var w = tw.w;
    if (!tw.hero){
      A.boxEdges(edges, tw.x, tw.h/2, tw.z, w, tw.h/2, w);
    }
    tw.i0 = pi;
    for (var f=1; f<=tw.floors; f++){
      var y = tw.h * f / tw.floors;
      plates.put(pi++, tw.x-w, y, tw.z-w, tw.x+w, y, tw.z-w);
      plates.put(pi++, tw.x+w, y, tw.z-w, tw.x+w, y, tw.z+w);
      plates.put(pi++, tw.x+w, y, tw.z+w, tw.x-w, y, tw.z+w);
      plates.put(pi++, tw.x-w, y, tw.z+w, tw.x-w, y, tw.z-w);
    }
  });
  plates.flush(); root.add(plates.obj);
  root.add(A.segs(edges, 'globeBorder', A.LIGHT ? 0.62 : 0.38));

  /* --- our own tower --- */
  var heroEdges = [];
  A.boxEdges(heroEdges, HERO.x, HERO.h/2, HERO.z, HERO.w, HERO.h/2, HERO.w);
  root.add(A.segs(heroEdges, 'cyan', A.LIGHT ? 1 : 0.85));
  var beam = A.poly([HERO.x, HERO.h, HERO.z, HERO.x, HERO.h + 0.62, HERO.z], 'signal', 0.5);
  root.add(beam);

  /* --- the survey plane ---
     A ring plus four arms, so the height being read is legible against the
     towers rather than being implied by them. */
  var scanY = 0.5, SCAN_TOP = 0.84;
  var scan = new T.Group();
  scan.add(A.ring(A.circle(1.45, 64, 0, 'y'), 'signal', 0.6));
  scan.add(A.segs([-1.45,0,0, 1.45,0,0, 0,0,-1.45, 0,0,1.45], 'signal', 0.22));
  root.add(scan);

  /* --- beacon, haze --- */
  var motes = A.cloud(150, 0.012, 0.95, 'diamond');
  var haze = A.col('cyan'), warm = A.col('sand');
  var M = [];
  for (var i=0;i<motes.n;i++){
    M.push({x:rng(-1.7,1.7), y:rng(0,1.3), z:rng(-1.7,1.7), sp:rng(0.02,0.07), ph:rng(0,6.28)});
    motes.tint(i, i % 7 === 0 ? warm : haze);
  }
  var beacon = A.cloud(1, 0.034, 1, 'diamond');
  beacon.at(0, HERO.x, HERO.h + 0.03, HERO.z);
  root.add(motes.obj); root.add(beacon.obj);

  var LINES = A.data || [];
  var line = 0, tick = 0;
  A.say(LINES[0] ? LINES[0][1] : '', LINES[0] ? LINES[0][0] : '');

  /* Scratch colours, hoisted. The floor loop below runs about five hundred
     times a frame and a Color per iteration is five hundred objects a frame
     for the garbage collector to find something to do with. */
  var HERO_C = A.col('cyan'), SIG = A.col('signal'), mix = A.col('signal');
  beacon.tint(0, SIG);

  return {dist:6.4, lift:2.0, look:0.25, tilt:0.02, spin:0.1, limit:0.62,
  frame:function(t, dt){
    /* Hovering hands the sweep to the pointer; letting go hands it back. The
       automatic pass is a triangle rather than a sawtooth — a survey rises
       and comes back down, and the sawtooth version dropped the plane
       through the whole city in one frame every eleven seconds. It also stops
       below the tallest floor: a ring hanging in clear air above the cluster
       stops reading as a measurement and starts reading as a flying saucer. */
    var u = (t * 0.085) % 2, tri = u < 1 ? u : 2 - u;
    var target = A.p.over ? (A.p.y * 0.5 + 0.5) * SCAN_TOP + 0.03
      : (A.RM ? 0.42 : 0.03 + tri * SCAN_TOP);
    scanY += (target - scanY) * (A.p.over ? 0.12 : 0.5);
    scan.position.y = scanY;
    scan.rotation.y = t * 0.06;

    for (var k=0;k<towers.length;k++){
      var tw = towers[k], base = tw.hero ? HERO_C : plates.base;
      for (var f=0; f<tw.floors; f++){
        var y = tw.h * (f+1) / tw.floors;
        var d = Math.abs(y - scanY);
        var lit = d < 0.10 ? 1 - d / 0.10 : 0;
        var c = base;
        if (lit > 0.02) c = mix.copy(SIG).lerp(base, 1 - lit);
        for (var e=0;e<4;e++) plates.fade(tw.i0 + f*4 + e, lit > 0.02 ? 0 : (tw.hero ? 0.1 : 0.42), c);
      }
    }
    plates.flush();

    var pulse = A.RM ? 0.7 : (Math.sin(t*2.2)*0.5+0.5);
    beacon.size[0] = 0.8 + pulse*1.5; beacon.alpha[0] = 0.55 + pulse*0.45;
    beacon.flush();
    beam.material.opacity = 0.16 + pulse * 0.34;

    for (var i=0;i<M.length;i++){
      var m = M[i];
      if (!A.RM){ m.y += m.sp * dt; if (m.y > 1.4) m.y = -0.05; }
      motes.at(i, m.x + Math.sin(t*0.3 + m.ph)*0.04, m.y, m.z);
      var f2 = Math.sin(t*0.8 + m.ph)*0.5+0.5;
      motes.size[i] = 0.4 + f2*0.6;
      motes.alpha[i] = (0.2 + f2*0.4) * (1 - Math.abs(m.y - 0.65)/1.1);
    }
    motes.flush();

    if (LINES.length){
      tick += dt;
      if (tick > 3.6){ tick = 0; line = (line+1) % LINES.length; A.say(LINES[line][1], LINES[line][0]); }
    }
  }};
}
`,
};

/* ----------------------------------------------------------- procedures
   Ten gates down a corridor, one per checkpoint, cut with the same notched
   corner every panel on the site carries. A packet of value walks the
   corridor and each gate fires as it arrives; the ring is coloured by which
   party produces that document, which is the same legend printed under the
   scroller below. */
SCENES.corridor = {
  fn: 'sceneCorridor',
  src: `
function sceneCorridor(A){
  var T = A.T, root = A.root;
  var STEPS = A.data || [];
  var N = Math.max(1, STEPS.length);
  /* Spacing and gate size are set together with the camera distance below:
     the binding constraint is the NEAR gate, which at yaw theta sits
     Z0*sin(theta) off the axis at a depth of dist - Z0*cos(theta), and has
     to stay inside a frustum half-width of depth*tan(15deg). Shortening the
     run is what buys the gates their on-screen size; a longer corridor only
     pushes the camera back and makes every gate smaller. */
  var SP = 0.62, Z0 = (N-1) * SP / 2;
  var HW = 0.44, HH = 0.30, CUT = 0.10;

  var PARTY = {b:'cyan', s:'sand', a:'frost'};

  /* The notch: clipped at top-right and bottom-left, exactly as the CSS
     clip-path on every panel does it. Drawn rather than approximated because
     it is the one shape that makes this read as part of the site. */
  function gateRing(z){
    return [-HW,HH,z, HW-CUT,HH,z, HW,HH-CUT,z, HW,-HH,z,
            -HW+CUT,-HH,z, -HW,-HH+CUT,z];
  }

  var gates = [], rails = [], ties = [];
  for (var i=0;i<N;i++){
    var z = Z0 - i*SP;
    var tone = PARTY[STEPS[i] ? STEPS[i][1] : 'a'] || 'frost';
    var g = A.ring(gateRing(z), tone, 0.34);
    root.add(g);

    /* the document inside the gate: a plate, three ruled lines and a seal */
    var d = new T.Group();
    d.position.z = z;
    var pw = 0.135, ph = 0.175;
    d.add(A.ring([-pw,ph,0, pw*0.5,ph,0, pw,ph-0.055,0, pw,-ph,0, -pw,-ph,0], tone, 0.5));
    var ruled = [];
    for (var r=0;r<3;r++){
      var y = ph - 0.072 - r*0.05;
      ruled.push(-pw*0.62, y, 0, pw*(r === 2 ? 0.1 : 0.6), y, 0);
    }
    d.add(A.segs(ruled, tone, 0.38));
    var seal = A.ring(A.circle(0.026, 4, 0, 'z'), tone, 0.6);
    seal.position.set(pw*0.45, -ph+0.062, 0);
    d.add(seal);
    root.add(d);

    gates.push({obj:g, doc:d, z:z, tone:tone, lit:0,
      tag:(STEPS[i] ? STEPS[i][0] : ''), name:(STEPS[i] ? STEPS[i][2] : '')});

    if (i < N-1){
      var z2 = Z0 - (i+1)*SP;
      rails.push(-HW,HH,z, -HW,HH,z2,  HW,HH,z, HW,HH,z2,
                 -HW,-HH,z, -HW,-HH,z2, HW,-HH,z, HW,-HH,z2);
      ties.push(-HW,-HH,(z+z2)/2, HW,-HH,(z+z2)/2);
    }
  }
  root.add(A.segs(rails, 'globeGraticule', A.LIGHT ? 0.7 : 0.36));
  root.add(A.segs(ties, 'globeGraticule', A.LIGHT ? 0.5 : 0.24));

  /* the spine the packet runs on, and the packet itself */
  root.add(A.poly([0,-HH+0.015,Z0+0.24, 0,-HH+0.015,-Z0-0.24], 'globeBorder', 0.5));
  var pk = A.cloud(26, 0.024, 1, 'diamond');
  var hotC = A.col('signal'), dimC = A.col('cyan');
  for (var p=0;p<pk.n;p++) pk.tint(p, p === 0 ? hotC : dimC);
  root.add(pk.obj);

  /* progress ticks under the corridor — ten of them, the page's own count */
  var ticks = A.cloud(N, 0.019, 1, 'diamond');
  for (var q=0;q<N;q++){
    ticks.at(q, 0, -HH-0.12, Z0 - q*SP);
    ticks.tint(q, A.col(gates[q].tone));
  }
  root.add(ticks.obj);

  /* The packet walks the corridor: it crosses to the next gate, then stops
     there while the checkpoint is read. A constant glide would say the
     sequence is a conveyor, and the page's whole argument is that it is ten
     discrete agreements, each of which has to complete before the next one
     starts. HOLD is the reading beat; CROSS is how long a leg takes.

     cur is the gate the packet is AT or has just left; u is 0..1 across the
     leg to cur+1. After the last gate the sequence restarts from the head,
     and fade covers that jump so it reads as a new deal rather than as the
     packet teleporting backwards. */
  var HOLD = 1.6, CROSS = 1.55;
  var cur = 0, u = 0, hold = HOLD, fade = 0;
  A.say(gates[0].name, gates[0].tag);

  return {dist:8.8, lift:0.62, look:0, yaw:0.42, tilt:0.12, limit:0.5,
  sway:{amp:0.10, rate:0.13},
  frame:function(t, dt){
    if (!A.RM){
      if (hold > 0){
        hold -= dt;
        fade = Math.min(1, fade + dt * 3);
      } else {
        u += dt / CROSS;
        if (u >= 1){
          u = 0;
          if (cur === N-1){ cur = 0; fade = 0; }   // new deal, from the head
          else cur++;
          hold = HOLD;
          A.say(gates[cur].name, gates[cur].tag);
        }
      }
    } else { u = 0; fade = 1; }

    var zNow = Z0 - (cur + u) * SP;

    /* trail: a head with a wake, so the direction of travel reads */
    for (var i=0;i<pk.n;i++){
      var lag = i * 0.035;
      pk.at(i, Math.sin(t*1.6 - lag)*0.012, Math.cos(t*1.3 - lag)*0.012, zNow + lag*SP*1.4);
      pk.size[i] = i === 0 ? 1.5 : 0.85 * (1 - i/pk.n);
      pk.alpha[i] = fade * (i === 0 ? 1 : 0.5 * (1 - i/pk.n));
    }
    pk.flush();

    for (var g=0;g<N;g++){
      var G = gates[g];
      var near = Math.max(0, 1 - Math.abs(G.z - zNow) / 0.55);
      var done = g < cur ? 1 : 0;
      G.lit += (near - G.lit) * 0.16;
      G.obj.material.opacity = A.clamp(0.32 + G.lit*0.66 + done*0.14, 0, 1);
      G.doc.children[0].material.opacity = A.clamp(0.36 + G.lit*0.62 + done*0.12, 0, 1);
      G.doc.rotation.z = G.lit * 0.06 * Math.sin(t*1.4 + g);
      G.doc.scale.setScalar(1 + G.lit*0.12);
      ticks.size[g] = 0.7 + G.lit*1.5 + done*0.35;
      ticks.alpha[g] = 0.24 + G.lit*0.76 + done*0.3;
    }
    ticks.flush();

    /* the corridor breathes with the pointer rather than ignoring it */
    root.position.y = A.p.y * 0.06;
    root.position.x = A.p.x * 0.08;
  }};
}
`,
};

/* -------------------------------------------------------------- products
   The whole book as one instrument: three orbits, one per commodity class,
   carrying a marker per grade around a turning gül core. The read head names
   whatever it is passing; the pointer overrides it, so the thing can be
   searched by hand. */
SCENES.book = {
  fn: 'sceneBook',
  src: `
function sceneBook(A){
  var T = A.T, root = A.root;
  var CLS = A.data || [];

  /* the gül core: two counter-turning octahedra and a bright centre */
  function octa(r){
    var v = [[r,0,0],[-r,0,0],[0,r,0],[0,-r,0],[0,0,r],[0,0,-r]];
    var e = [0,2,2,1,1,3,3,0, 0,4,4,1,1,5,5,0, 2,4,4,3,3,5,5,2];
    var a = [];
    for (var i=0;i<e.length;i++) a.push(v[e[i]][0], v[e[i]][1], v[e[i]][2]);
    return a;
  }
  var coreA = A.segs(octa(0.26), 'frost', A.LIGHT ? 0.7 : 0.46);
  var coreB = A.segs(octa(0.16), 'cyan', A.LIGHT ? 0.95 : 0.75);
  root.add(coreA); root.add(coreB);
  var centre = A.cloud(1, 0.055, 1, 'diamond');
  centre.tint(0, A.col('signal')); centre.at(0,0,0,0);
  root.add(centre.obj);

  /* one orbit per class. Radius, tilt and marker size separate them as much
     as colour does — on the light palette two of the three classes share an
     accent, and a ring that is only distinguishable by hue would collapse. */
  var ORB = [{r:0.80, rx:0.36, rz:0.18, s:1.5}, {r:1.14, rx:-0.44, rz:-0.3, s:1.35},
             {r:1.48, rx:0.14, rz:0.52, s:1.05}];
  var ITEMS = [], rings = [];
  CLS.forEach(function(cl, ci){
    var o = ORB[ci] || ORB[2];
    var grp = new T.Group();
    grp.rotation.x = o.rx; grp.rotation.z = o.rz;
    var path = A.ring(A.circle(o.r, 160, 0, 'y'), cl.tone, A.LIGHT ? 0.68 : 0.34);
    grp.add(path);
    rings.push({grp:grp, path:path, o:o, tone:cl.tone});
    root.add(grp);
    cl.items.forEach(function(nm, i){
      ITEMS.push({grp:grp, o:o, th:i / cl.items.length * Math.PI*2,
        name:nm, cls:cl.title, tone:cl.tone, ci:ci});
    });
  });

  /* markers live in one cloud so the whole book is one draw call, and the
     raycaster can still name an individual grade by index */
  var dots = A.cloud(ITEMS.length, 0.027, 1, 'diamond');
  var lit = A.col('signal');
  ITEMS.forEach(function(it, i){
    it.c = A.col(it.tone);    // hoisted: this is read every frame
    dots.tint(i, it.c);
  });
  root.add(dots.obj);
  var beads = A.cloud(rings.length, 0.018, 1, 'round');
  rings.forEach(function(r, i){ beads.tint(i, lit); });
  root.add(beads.obj);

  /* the spoke to whatever is selected — the only line that moves */
  var spokeGeo = A.geo([0,0,0, 0,0,0]);
  var spoke = new T.Line(spokeGeo, A.lineMat('signal', 0.6));
  spoke.frustumCulled = false;
  root.add(spoke);
  var halo = A.cloud(1, 0.07, 1, 'ring');
  halo.tint(0, A.col('signal'));
  root.add(halo.obj);

  var sel = 0, tick = 0, spin = [], at3 = new T.Vector3();
  ITEMS.forEach(function(){ spin.push(0); });
  A.say(ITEMS.length ? ITEMS[0].name : '', ITEMS.length ? ITEMS[0].cls : '');

  var ray = new T.Raycaster(), ptr = new T.Vector2();
  ray.params.Points = {threshold: 0.07};

  return {fit:1.66, lift:0.5, look:0, tilt:0.18, spin:0.12, limit:0.8,
  frame:function(t, dt){
    var w = A.RM ? 0 : t;
    rings.forEach(function(r, i){
      r.grp.rotation.y = w * (0.11 - i*0.028) + i*0.7;
      /* The bead rides its own ring's group, but the cloud holding all three
         beads lives on the root — so the group's rotation is applied here by
         hand rather than by the scene graph. */
      var u = ((w * 0.09 + i*0.33) % 1) * Math.PI*2;
      at3.set(Math.cos(u)*r.o.r, 0, Math.sin(u)*r.o.r).applyEuler(r.grp.rotation);
      beads.at(i, at3.x, at3.y, at3.z);
      beads.size[i] = 1; beads.alpha[i] = 0.85;
    });
    beads.flush();

    coreA.rotation.y = w*0.24; coreA.rotation.x = w*0.16;
    coreB.rotation.y = -w*0.36; coreB.rotation.z = w*0.2;
    var cp = A.RM ? 0.7 : Math.sin(t*1.7)*0.5+0.5;
    centre.size[0] = 0.8 + cp*0.7; centre.alpha[0] = 0.6 + cp*0.4;
    centre.flush();

    for (var i=0;i<ITEMS.length;i++){
      var it = ITEMS[i];
      at3.set(Math.cos(it.th)*it.o.r, 0, Math.sin(it.th)*it.o.r);
      at3.applyEuler(it.grp.rotation);
      dots.at(i, at3.x, at3.y, at3.z);
      var on = i === sel;
      spin[i] += ((on ? 1 : 0) - spin[i]) * 0.14;
      var b = A.RM ? 0.5 : (Math.sin(t*1.3 + i)*0.5+0.5);
      dots.size[i] = it.o.s * (0.7 + b*0.3 + spin[i]*1.5);
      dots.alpha[i] = 0.6 + b*0.24 + spin[i]*0.16;
      dots.tint(i, on ? lit : it.c);
      if (on){
        spokeGeo.attributes.position.setXYZ(1, at3.x, at3.y, at3.z);
        spokeGeo.attributes.position.needsUpdate = true;
        halo.at(0, at3.x, at3.y, at3.z);
        halo.size[0] = 2.1 + b*0.5; halo.alpha[0] = 0.55 + b*0.3;
        halo.flush();
      }
    }
    dots.flush();

    /* Pointer picks; otherwise the read head walks the book on its own. */
    var picked = -1;
    if (A.p.over && A.p.tx != null){
      ptr.set(A.p.tx, A.p.ty);
      ray.setFromCamera(ptr, A.cam);
      var hit = ray.intersectObject(dots.obj, false);
      if (hit.length) picked = hit[0].index;
    }
    if (picked >= 0 && picked !== sel){
      sel = picked; tick = 0;
      A.say(ITEMS[sel].name, ITEMS[sel].cls);
    } else if (picked < 0 && ITEMS.length){
      tick += dt;
      if (tick > 2.5){
        tick = 0; sel = (sel+1) % ITEMS.length;
        A.say(ITEMS[sel].name, ITEMS[sel].cls);
      }
    }
  }};
}
`,
};

/* -------------------------------------------------------- sustainability
   A thing that grows. The trunk draws itself once on arrival, roots and all,
   and then keeps running sap: the page's argument is that this is a practice
   rather than a campaign, and a loop that restarts from nothing every eight
   seconds would have argued the opposite. Six tips are the six commitments. */
SCENES.growth = {
  fn: 'sceneGrowth',
  src: `
function sceneGrowth(A){
  var T = A.T, root = A.root, rng = A.rng;
  var NAMES = A.data || [];

  var segsUp = [], segsDn = [], tips = [], chains = [];

  function frame3(dir){
    var up = Math.abs(dir.y) > 0.92 ? A.V(1,0,0) : A.V(0,1,0);
    var side = new T.Vector3().crossVectors(dir, up).normalize();
    return [side, new T.Vector3().crossVectors(side, dir).normalize()];
  }
  function bend(dir, ang, ph){
    var f = frame3(dir);
    return dir.clone().multiplyScalar(Math.cos(ang))
      .addScaledVector(f[0], Math.sin(ang)*Math.cos(ph))
      .addScaledVector(f[1], Math.sin(ang)*Math.sin(ph)).normalize();
  }
  function grow(from, dir, len, depth, max, out, trail){
    var to = from.clone().addScaledVector(dir, len);
    out.push({a:from.clone(), b:to.clone(), d:depth});
    var path = trail.concat([to.clone()]);
    if (depth >= max){ tips.push(to.clone()); chains.push(path); return; }
    var n = depth === 0 ? 3 : 2;
    for (var i=0;i<n;i++){
      var ph = (i / n) * Math.PI*2 + depth*1.1 + rng(-0.4, 0.4);
      /* Wide angles. A narrow fan reads as a whisk rather than as a canopy,
         and the canopy is the whole point — six of its tips are the six
         commitments the page is about. */
      grow(to, bend(dir, rng(0.5, 0.8), ph), len * rng(0.72, 0.86),
        depth+1, max, out, path);
    }
  }
  var BASE = A.V(0, -0.66, 0);
  /* A short trunk. The first version gave it the same length as the branch
     that follows it, which drew a long bare pole with a canopy balanced on
     top — a diagram of a tree rather than a tree. */
  grow(BASE, A.V(0,1,0), 0.40, 0, 4, segsUp, [BASE.clone()]);
  var rootTips = tips.length;
  grow(BASE, A.V(0,-1,0), 0.26, 0, 2, segsDn, [BASE.clone()]);
  tips.length = rootTips;                  // roots do not carry commitments
  chains.length = rootTips;

  /* canopy and roots share one buffer each so growth is a buffer rewrite */
  function limb(list, tone, op){
    var v = A.vsegs(tone, list.length*2, op);
    list.forEach(function(s, i){
      v.put(i, s.a.x, s.a.y, s.a.z, s.b.x, s.b.y, s.b.z);
      v.fade(i, s.d * 0.1);
    });
    v.flush(); root.add(v.obj);
    return v;
  }
  var canopy = limb(segsUp, 'sand', A.LIGHT ? 1 : 0.8);
  var roots = limb(segsDn, 'sand', A.LIGHT ? 0.5 : 0.3);

  /* ground: concentric rings and radial spokes, the earth as an instrument */
  (function(){
    for (var r=0.3; r<1.55; r+=0.3)
      root.add(A.ring(A.circle(r, 76, -0.66, 'y'), 'globeGraticule', A.LIGHT ? 0.55 : 0.28));
    var spokes = [];
    for (var i=0;i<16;i++){
      var th = i/16 * Math.PI*2;
      spokes.push(Math.cos(th)*0.3, -0.66, Math.sin(th)*0.3,
        Math.cos(th)*1.5, -0.66, Math.sin(th)*1.5);
    }
    root.add(A.segs(spokes, 'globeGraticule', A.LIGHT ? 0.4 : 0.18));
  })();

  /* leaves at every tip; the six commitments get the bright ones */
  var leaf = A.cloud(tips.length, 0.026, 1, 'diamond');
  var leafC = A.col('cyan'), markC = A.col('sand'), hotC = A.col('signal');
  var MARK = [];
  var step = Math.max(1, Math.floor(tips.length / Math.max(1, NAMES.length)));
  for (var i=0;i<tips.length;i++){
    leaf.at(i, tips[i].x, tips[i].y, tips[i].z);
    leaf.tint(i, leafC);
  }
  for (var m=0; m<NAMES.length && m*step < tips.length; m++) MARK.push(m*step);
  MARK.forEach(function(i){ leaf.tint(i, markC); });
  root.add(leaf.obj);

  /* sap, and motes lifting off the canopy */
  var sap = A.cloud(140, 0.014, 1, 'round');
  var SAP = [];
  for (var s=0;s<sap.n;s++){
    SAP.push({c: Math.floor(rng(0, chains.length)), u: rng(0,1), sp: rng(0.16, 0.3)});
    sap.tint(s, hotC);
  }
  root.add(sap.obj);
  var motes = A.cloud(90, 0.012, 0.9, 'diamond');
  var MO = [];
  for (var k=0;k<motes.n;k++){
    MO.push({x:rng(-1.2,1.2), y:rng(-0.66,1.3), z:rng(-1.2,1.2), sp:rng(0.04,0.13), ph:rng(0,6.3)});
    motes.tint(k, k % 3 === 0 ? markC : leafC);
  }
  root.add(motes.obj);

  function onChain(ci, u){
    var p = chains[ci];
    if (!p || p.length < 2) return A.V(0,0,0);
    var f = A.clamp(u, 0, 0.9999) * (p.length - 1);
    var i = Math.floor(f);
    return p[i].clone().lerp(p[i+1], f - i);
  }

  var g = A.RM ? 1 : 0, mark = 0, tick = 0;
  if (NAMES.length) A.say(NAMES[0][1], NAMES[0][0]);

  return {dist:5.2, lift:0.38, look:0.06, tilt:0.06, spin:0.09, limit:0.6,
  frame:function(t, dt){
    /* One growth pass, then it stays grown. */
    if (g < 1){
      g = Math.min(1, g + dt * 0.26);
      var e = 1 - Math.pow(1 - g, 3);
      [[canopy, segsUp, 5], [roots, segsDn, 3]].forEach(function(pair){
        var buf = pair[0], list = pair[1], depth = pair[2];
        list.forEach(function(s, i){
          var t0 = s.d / depth, k = A.clamp((e - t0) / (1/depth), 0, 1);
          buf.put(i, s.a.x, s.a.y, s.a.z,
            s.a.x + (s.b.x-s.a.x)*k, s.a.y + (s.b.y-s.a.y)*k, s.a.z + (s.b.z-s.a.z)*k);
        });
        buf.flush();
      });
    }

    var open = A.clamp((g - 0.72) / 0.28, 0, 1);
    for (var i=0;i<tips.length;i++){
      var isMark = MARK.indexOf(i) >= 0;
      var b = A.RM ? 0.6 : (Math.sin(t*1.1 + i*0.7)*0.5+0.5);
      var on = isMark && MARK[mark] === i ? 1 : 0;
      leaf.size[i] = open * ((isMark ? 1.5 : 0.85) + b*0.3 + on*1.4);
      leaf.alpha[i] = open * ((isMark ? 0.8 : 0.5) + b*0.2 + on*0.2);
      if (on) leaf.tint(i, hotC); else if (isMark) leaf.tint(i, markC);
    }
    leaf.flush();

    for (var s=0;s<SAP.length;s++){
      var S = SAP[s];
      if (!A.RM) S.u += S.sp * dt;
      if (S.u > 1){ S.u -= 1; S.c = Math.floor(A.rnd() * chains.length); }
      var p = onChain(S.c, S.u * g);
      sap.at(s, p.x, p.y, p.z);
      sap.size[s] = g * (0.7 + Math.sin(S.u*Math.PI)*0.6);
      sap.alpha[s] = g * 0.75 * Math.sin(A.clamp(S.u,0,1)*Math.PI);
    }
    sap.flush();

    for (var k=0;k<MO.length;k++){
      var M = MO[k];
      if (!A.RM){ M.y += M.sp * dt; if (M.y > 1.4) M.y = -0.66; }
      motes.at(k, M.x + Math.sin(t*0.4 + M.ph)*0.07, M.y, M.z + Math.cos(t*0.33 + M.ph)*0.07);
      var f = Math.sin(t*0.9 + M.ph)*0.5+0.5;
      motes.size[k] = 0.35 + f*0.55;
      motes.alpha[k] = (0.18 + f*0.32) * open;
    }
    motes.flush();

    /* a breeze, so a static tree is never actually static */
    if (!A.RM){
      root.rotation.z = Math.sin(t*0.31)*0.017 + A.p.x*0.03;
      root.position.y = Math.sin(t*0.47)*0.012;
    }

    if (NAMES.length && g > 0.7){
      tick += dt;
      if (tick > 3.4){
        tick = 0; mark = (mark+1) % Math.min(NAMES.length, MARK.length);
        A.say(NAMES[mark][1], NAMES[mark][0]);
      }
    }
  }};
}
`,
};

/* ------------------------------------------------------------- logistics
   A terminal: water, quay, a vessel alongside, a stacked yard and a gantry
   working between them. The crane runs a real cycle — traverse, lower, lift,
   traverse, place — because the page is about the handover between modes and
   a crane that only slid back and forth would be a screensaver. */
SCENES.yard = {
  fn: 'sceneYard',
  src: `
function sceneYard(A){
  var T = A.T, root = A.root, rng = A.rng, rnd = A.rnd;
  var MODES = A.data || [];

  /* --- water --- */
  var WX = 2.15, WZ0 = 0.85, WZ1 = 2.35, waveN = 18;
  /* The water is drawn in the system accent rather than in the scaffolding
     grey. It is the difference between a yard and a port, and at the alpha a
     grid line wants it was not there at all. */
  var water = A.vsegs('cyan', waveN*2*26, A.LIGHT ? 0.5 : 0.3);
  var WROW = [];
  for (var i=0;i<waveN;i++) WROW.push(WZ0 + (WZ1-WZ0) * i/(waveN-1));
  root.add(water.obj);

  /* --- quay --- */
  var quay = [];
  quay.push(-WX, 0, WZ0, WX, 0, WZ0);
  quay.push(-WX, -0.06, WZ0, WX, -0.06, WZ0);
  for (var b=-1.9; b<=1.91; b+=0.5) quay.push(b, 0, WZ0, b, 0.06, WZ0);
  root.add(A.segs(quay, 'globeBorder', A.LIGHT ? 0.9 : 0.55));

  /* --- vessel alongside --- */
  var ship = new T.Group();
  ship.position.set(-0.12, 0, 1.55);
  (function(){
    var L = 1.4, W = 0.28, D = 0.17;
    var hull = [];
    /* a hull profile rather than a box: bow rake at one end, transom at the
       other, which is the difference between reading as a ship and as freight */
    var prof = [[-L,0],[-L*0.86,-D],[L*0.72,-D],[L,-D*0.35],[L,0]];
    [-W, W].forEach(function(w){
      for (var i=0;i<prof.length-1;i++)
        hull.push(prof[i][0], prof[i][1], w, prof[i+1][0], prof[i+1][1], w);
    });
    for (var i=0;i<prof.length;i++) hull.push(prof[i][0], prof[i][1], -W, prof[i][0], prof[i][1], W);
    ship.add(A.segs(hull, 'globeBorder', A.LIGHT ? 0.95 : 0.6));
    var deck = [];
    for (var x=-L*0.75; x<L*0.5; x+=0.26)
      for (var tier=0; tier<2; tier++)
        if (rnd() > 0.22) A.boxEdges(deck, x, 0.065 + tier*0.13, rng(-W*0.5, W*0.5), 0.12, 0.06, 0.075);
    ship.add(A.segs(deck, 'cyan', A.LIGHT ? 0.78 : 0.46));
    var house = [];
    A.boxEdges(house, L*0.72, 0.15, 0, 0.11, 0.15, W*0.8);
    ship.add(A.segs(house, 'globeBorder', A.LIGHT ? 1 : 0.65));
  })();
  root.add(ship);

  /* --- the yard ---
     One buffer for every box in the stack, so a single container can be lit
     as the crane sets it down without rebuilding anything. */
  var BOXES = [];
  var BW = 0.135, BH = 0.062, BD = 0.076;
  for (var bay=0; bay<7; bay++){
    for (var rw=0; rw<4; rw++){
      var h = 3 - Math.floor(rnd()*3);
      for (var tier=0; tier<h; tier++){
        BOXES.push({x: -1.35 + bay*0.45, y: BH + tier*BH*2.1, z: -0.3 - rw*0.3});
      }
    }
  }
  var stack = A.vsegs('cyan', BOXES.length*24, A.LIGHT ? 0.8 : 0.44);
  BOXES.forEach(function(B, i){
    var e = [];
    A.boxEdges(e, B.x, B.y, B.z, BW, BH, BD);
    for (var k=0;k<12;k++)
      stack.put(i*12 + k, e[k*6], e[k*6+1], e[k*6+2], e[k*6+3], e[k*6+4], e[k*6+5]);
    B.lit = 0;
    for (var k2=0;k2<12;k2++) stack.fade(i*12 + k2, 0.55);
  });
  stack.flush(); root.add(stack.obj);

  /* apron grid */
  (function(){
    var ap = [];
    for (var x=-WX; x<=WX+0.01; x+=0.24) ap.push(x, 0, 0.8, x, 0, -1.85);
    for (var z=-1.85; z<=0.81; z+=0.24) ap.push(-WX, 0, z, WX, 0, z);
    var g = A.vsegs('globeGraticule', ap.length/3, A.LIGHT ? 0.5 : 0.22);
    for (var i=0;i<ap.length/6;i++){
      g.put(i, ap[i*6], ap[i*6+1], ap[i*6+2], ap[i*6+3], ap[i*6+4], ap[i*6+5]);
      g.fade(i, 0.35);
    }
    g.flush(); root.add(g.obj);
  })();

  /* --- gantry --- */
  var crane = new T.Group();
  var LEGX = 0.42, TOPY = 1.02;
  (function(){
    var f = [];
    [-LEGX, LEGX].forEach(function(x){
      f.push(x, 0, WZ0-0.12, x, TOPY, WZ0-0.12);
      f.push(x, 0, -0.85, x, TOPY, -0.85);
      f.push(x, 0, WZ0-0.12, x, 0, -0.85);
      f.push(x, TOPY, 1.95, x, TOPY, -1.15);
      f.push(x, TOPY*0.62, WZ0-0.12, x, TOPY, WZ0-0.12);
    });
    f.push(-LEGX, TOPY, 1.95, LEGX, TOPY, 1.95);
    f.push(-LEGX, TOPY, -1.15, LEGX, TOPY, -1.15);
    f.push(-LEGX, TOPY, WZ0-0.12, LEGX, TOPY, WZ0-0.12);
    f.push(-LEGX, TOPY*0.94, 0.15, LEGX, TOPY*0.94, 0.15);
    crane.add(A.segs(f, 'globeBorder', A.LIGHT ? 1 : 0.68));
  })();
  var trolley = new T.Group();
  (function(){
    var e = [];
    A.boxEdges(e, 0, TOPY - 0.06, 0, LEGX*0.62, 0.045, 0.085);
    trolley.add(A.segs(e, 'cyan', A.LIGHT ? 1 : 0.78));
  })();
  crane.add(trolley);
  var ropeGeo = A.geo([0,TOPY-0.1,0, 0,0.4,0]);
  var rope = new T.LineSegments(ropeGeo, A.lineMat('signal', 0.5));
  trolley.add(rope);
  /* The spreader is the frame the crane always carries; the box is only in
     it between the pick and the set-down. They are separate objects so the
     hoist can be seen going down empty, which is half of what makes the
     cycle read as a cycle. */
  var load = new T.Group();
  var boxObj, spreader;
  (function(){
    var e = [];
    A.boxEdges(e, 0, 0, 0, BW, BH, BD);
    boxObj = A.segs(e, 'signal', 0.95);
    load.add(boxObj);
    var sp = [];
    A.boxEdges(sp, 0, BH + 0.035, 0, BW*0.9, 0.014, BD*0.8);
    spreader = A.segs(sp, 'cyan', 0.75);
    load.add(spreader);
  })();
  trolley.add(load);
  root.add(crane);

  /* --- crane cycle ---
     Z is the traverse, Y is the hoist. Both are keyed off one phase so the
     rope, the spreader and the box can never disagree about where the load
     is. */
  var CYCLE = 11.5, mode = -1, landed = -1;
  var hotC = A.col('signal'), mix = A.col('signal');
  function ease(a, b, k){ k = A.clamp(k, 0, 1); return a + (b-a) * (k*k*(3-2*k)); }

  return {dist:9.4, lift:3.2, look:0.3, yaw:-0.3, tilt:0.2, limit:0.5,
  sway:{amp:0.26, rate:0.09},
  frame:function(t, dt){
    /* water */
    var wi = 0, step = 0.24, cap = water.pos.length/6;
    for (var r=0;r<WROW.length;r++){
      var z = WROW[r];
      for (var x=-WX; x<WX-0.001 && wi<cap; x+=step){
        var y1 = Math.sin(x*2.1 + t*0.9 + z*1.4) * 0.012;
        var y2 = Math.sin((x+step)*2.1 + t*0.9 + z*1.4) * 0.012;
        water.put(wi, x, y1 - 0.02, z, Math.min(x+step, WX), y2 - 0.02, z);
        water.fade(wi, 0.1 + (z - WZ0)/(WZ1-WZ0) * 0.62);
        wi++;
      }
    }
    water.flush();

    var ph = A.RM ? 0.02 : (t % CYCLE) / CYCLE;
    var m = Math.floor(t / CYCLE) % Math.max(1, MODES.length);
    if (m !== mode && MODES.length){ mode = m; A.say(MODES[m][1], MODES[m][0]); }

    /* One phase drives the traverse, the hoist, the rope and the box, so the
       four can never disagree about where the load is:
         0.00 lower empty over the ship | 0.14 pick and lift
         0.28 traverse to the yard      | 0.54 lower | 0.66 set down and lift
         0.76 traverse back empty */
    var zShip = 1.55, zYard = -0.6, yTop = 0.6, yShip = 0.17, yYard = 0.3;
    var tz, ty, carrying = false;
    if (ph < 0.14){ tz = zShip; ty = ease(yTop, yShip, ph/0.14); }
    else if (ph < 0.28){ tz = zShip; ty = ease(yShip, yTop, (ph-0.14)/0.14); carrying = true; }
    else if (ph < 0.54){ tz = ease(zShip, zYard, (ph-0.28)/0.26); ty = yTop; carrying = true; }
    else if (ph < 0.66){ tz = zYard; ty = ease(yTop, yYard, (ph-0.54)/0.12); carrying = true; }
    else if (ph < 0.76){ tz = zYard; ty = ease(yYard, yTop, (ph-0.66)/0.1); }
    else { tz = ease(zYard, zShip, (ph-0.76)/0.24); ty = yTop; }

    trolley.position.z = tz;
    /* gantry travel: the whole portal walks the quay between cycles */
    crane.position.x = Math.sin(t * 0.055) * 0.8;
    load.position.y = ty;
    boxObj.visible = carrying;
    load.rotation.y = Math.sin(t*1.1) * 0.02;
    ropeGeo.attributes.position.setY(1, ty + BH);
    ropeGeo.attributes.position.needsUpdate = true;

    /* The box that lights is the one the crane actually just set down —
       nearest the spreader, not an arbitrary index, because the gantry is
       travelling in x while the cycle runs. */
    if (ph > 0.5 && ph < 0.56){
      var best = -1, bd = 1e9, cx = crane.position.x;
      for (var s=0;s<BOXES.length;s++){
        var d2 = Math.abs(BOXES[s].x - cx) * 1.4 + Math.abs(BOXES[s].z - zYard);
        if (d2 < bd){ bd = d2; best = s; }
      }
      landed = best;
    }
    for (var i=0;i<BOXES.length;i++){
      var B = BOXES[i];
      var want = (i === landed && ph > 0.6 && ph < 0.94) ? 1 : 0;
      B.lit += (want - B.lit) * 0.08;
      if (B.lit > 0.005 || want){
        var c = mix.copy(hotC).lerp(stack.base, 1 - B.lit);
        for (var k=0;k<12;k++) stack.fade(i*12 + k, 0.55 - B.lit*0.55, c);
      }
    }
    stack.flush();

    ship.position.y = Math.sin(t*0.7) * 0.008;
    ship.rotation.z = Math.sin(t*0.5) * 0.006;
    root.position.y = A.p.y * 0.05;
  }};
}
`,
};

/* ------------------------------------------------------------ industrials
   A crystal cell with a reaction running through it. Sixteen nodes on the
   near face are the sixteen grades; a wave crosses the lattice on the
   diagonal and every bond it touches fires, because a reactor is never
   actually in the standing state a still lattice draws. */
SCENES.lattice = {
  fn: 'sceneLattice',
  src: `
function sceneLattice(A){
  var T = A.T, root = A.root, rng = A.rng;
  var GRADES = A.data || [];

  var N = 4, S = 0.42, O = -(N-1)*S/2;
  var NODES = [], IX = {};
  for (var i=0;i<N;i++) for (var j=0;j<N;j++) for (var k=0;k<N;k++){
    IX[i+','+j+','+k] = NODES.length;
    NODES.push({i:i, j:j, k:k, x:O+i*S, y:O+j*S, z:O+k*S,
      ph:(i+j+k)/((N-1)*3)});
  }

  var BONDS = [];
  NODES.forEach(function(n, a){
    [[1,0,0],[0,1,0],[0,0,1]].forEach(function(d){
      var b = IX[(n.i+d[0])+','+(n.j+d[1])+','+(n.k+d[2])];
      if (b != null) BONDS.push({a:a, b:b, ph:(n.ph + NODES[b].ph)/2});
    });
  });
  var bonds = A.vsegs('globeBorder', BONDS.length*2, A.LIGHT ? 0.85 : 0.5);
  root.add(bonds.obj);

  var dots = A.cloud(NODES.length, 0.026, 1, 'diamond');
  var dimC = A.col('cyan'), gradeC = A.col('sand'), hotC = A.col('signal');
  var mix = A.col('signal');     // scratch, rewritten per bond per frame
  /* the near face is the book: sixteen nodes, sixteen grades */
  var FACE = [];
  NODES.forEach(function(n, i){
    dots.tint(i, dimC);
    n.grade = n.k === N-1;
    if (n.grade) FACE.push(i);
  });
  FACE.forEach(function(i){ dots.tint(i, gradeC); });
  root.add(dots.obj);

  /* free reagents outside the cell, and the shock ring a collision makes */
  var free = A.cloud(46, 0.016, 1, 'round');
  var FR = [];
  for (var f=0; f<free.n; f++){
    FR.push({r:rng(1.0, 1.55), th:rng(0,6.3), ph:rng(0,6.3),
      sr:rng(0.1,0.3), sp:rng(0.15,0.4), hit:0});
    free.tint(f, f % 4 === 0 ? gradeC : dimC);
  }
  root.add(free.obj);
  var flash = A.cloud(8, 0.05, 1, 'ring');
  var FL = [];
  for (var q=0;q<flash.n;q++){ FL.push({t:1, x:0, y:0, z:0}); flash.tint(q, hotC); }
  root.add(flash.obj);

  var halo = A.cloud(1, 0.06, 1, 'ring');
  halo.tint(0, hotC); root.add(halo.obj);

  var sel = 0, tick = 0, next = 0;
  if (GRADES.length) A.say(GRADES[0][0], GRADES[0][1]);

  return {fit:1.62, lift:0.25, look:0, tilt:0.22, yaw:0.5, spin:0.14, limit:0.85,
  frame:function(t, dt){
    var w = A.RM ? 0.5 : (t * 0.24) % 1.5 - 0.25;

    /* the cell breathes — a crystal at temperature, not a diagram */
    NODES.forEach(function(n, i){
      var s = A.RM ? 0 : 0.022;
      n.px = n.x + Math.sin(t*1.1 + n.i*1.7 + n.j)*s;
      n.py = n.y + Math.sin(t*0.93 + n.j*1.9 + n.k)*s;
      n.pz = n.z + Math.sin(t*1.27 + n.k*1.5 + n.i)*s;
      dots.at(i, n.px, n.py, n.pz);
      var near = Math.max(0, 1 - Math.abs(n.ph - w)/0.16);
      var isG = n.grade;
      var isSel = isG && FACE[sel % FACE.length] === i;
      dots.size[i] = (isG ? 1.3 : 0.8) + near*1.1 + (isSel ? 1.5 : 0);
      dots.alpha[i] = (isG ? 0.85 : 0.5) + near*0.15 + (isSel ? 0.15 : 0);
      dots.tint(i, isSel ? hotC : near > 0.4 ? hotC : (isG ? gradeC : dimC));
      if (isSel){
        halo.at(0, n.px, n.py, n.pz);
        halo.size[0] = 2 + Math.sin(t*2.4)*0.35;
        halo.alpha[0] = 0.6;
        halo.flush();
      }
    });
    dots.flush();

    BONDS.forEach(function(b, i){
      var A1 = NODES[b.a], B1 = NODES[b.b];
      bonds.put(i, A1.px, A1.py, A1.pz, B1.px, B1.py, B1.pz);
      var near = Math.max(0, 1 - Math.abs(b.ph - w)/0.14);
      bonds.fade(i, near > 0.02 ? 0 : 0.45,
        near > 0.02 ? mix.copy(hotC).lerp(bonds.base, 1-near) : bonds.base);
    });
    bonds.flush();

    for (var f=0; f<FR.length; f++){
      var R = FR[f];
      if (!A.RM){ R.th += R.sp * dt; R.ph += R.sr * dt; }
      var x = Math.cos(R.th) * R.r * Math.cos(R.ph);
      var y = Math.sin(R.ph) * R.r * 0.72;
      var z = Math.sin(R.th) * R.r * Math.cos(R.ph);
      free.at(f, x, y, z);
      var d = Math.sqrt(x*x + y*y + z*z);
      free.size[f] = 0.8 + Math.max(0, 1.3 - d)*0.7;
      free.alpha[f] = 0.45 + Math.max(0, 1.4 - d)*0.45;
      /* a reagent reaching the cell wall fires once */
      if (d < 0.95 && R.hit <= 0 && !A.RM){
        R.hit = 2.2;
        for (var q=0;q<FL.length;q++) if (FL[q].t >= 1){
          FL[q] = {t:0, x:x, y:y, z:z}; break;
        }
      }
      if (R.hit > 0) R.hit -= dt;
    }
    free.flush();

    for (var q2=0;q2<FL.length;q2++){
      var L = FL[q2];
      if (L.t < 1){ L.t = Math.min(1, L.t + dt*1.5); }
      flash.at(q2, L.x, L.y, L.z);
      flash.size[q2] = 0.6 + L.t*4.2;
      flash.alpha[q2] = (1 - L.t) * 0.85;
    }
    flash.flush();

    if (GRADES.length){
      tick += dt;
      if (tick > 2.3){
        tick = 0; next = (next+1) % Math.min(GRADES.length, FACE.length);
        sel = next;
        A.say(GRADES[next][0], GRADES[next][1]);
      }
    }
  }};
}
`,
};

/* --------------------------------------------------------------- polymers
   Chains in the melt. Seven of them, writhing on layered sines, one lit at a
   time with a monomer running its length — the 2D chain visual on the home
   page, given the third dimension it always wanted. The pointer shears the
   melt, which is the one thing a converter actually does to a resin. */
SCENES.chain = {
  fn: 'sceneChain',
  src: `
function sceneChain(A){
  var T = A.T, root = A.root, rng = A.rng;
  var LABELS = A.data || [];
  var NC = Math.max(3, LABELS.length || 7), NP = 84, SPAN = 3.2;

  var dim = A.col(A.ink('cyan')), warm = A.col('sand'), hot = A.col('signal');
  /* the lit-but-not-firing bead colour, mixed once rather than 600 times a
     frame — there are seven chains of eighty-four monomers each */
  var half = A.col('signal').lerp(dim, 0.45);

  /* One sprite material for every chain's beads. A.cloud is the only place
     that builds one, so a single throwaway cloud is made for its material and
     its own Points object is simply never added to the scene. */
  var beadMat = A.cloud(1, 0.017, 1, 'round').obj.material;

  var CH = [];
  for (var c=0;c<NC;c++){
    var geo = new T.BufferGeometry();
    var pos = new Float32Array(NP*3);
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    var mat = new T.LineBasicMaterial({color:GLXC.int[A.ink('cyan')], transparent:true,
      opacity:A.LIGHT ? 0.5 : 0.32, blending:A.BLEND, depthWrite:false});
    var ln = new T.Line(geo, mat);
    ln.frustumCulled = false;
    root.add(ln);

    /* the beads share the backbone's buffer — one write, two objects */
    var bg = new T.BufferGeometry();
    bg.setAttribute('position', geo.attributes.position);
    var bc = new Float32Array(NP*3), bs = new Float32Array(NP), ba = new Float32Array(NP);
    bg.setAttribute('aCol', new T.BufferAttribute(bc, 3));
    bg.setAttribute('aS', new T.BufferAttribute(bs, 1));
    bg.setAttribute('aA', new T.BufferAttribute(ba, 1));
    var pts = new T.Points(bg, beadMat);
    pts.frustumCulled = false;
    root.add(pts);

    CH.push({geo:geo, pos:pos, mat:mat, bg:bg, bc:bc, bs:bs, ba:ba,
      y:(c - (NC-1)/2) * 0.30 + rng(-0.05, 0.05),
      /* A wide z spread is what makes this read as a melt rather than as
         seven sine waves: chains have to pass visibly in front of and behind
         each other, and perspective only sells that if they are at genuinely
         different depths. */
      z:rng(-0.95, 0.95), ph:rng(0, 6.3),
      f1:rng(1.1, 2.0), f2:rng(2.4, 3.8), f3:rng(0.8, 1.7), f4:rng(1.9, 3.1),
      a1:rng(0.10, 0.19), a2:rng(0.04, 0.08), a3:rng(0.22, 0.42), a4:rng(0.05, 0.11),
      s1:rng(0.5, 0.9), s2:rng(0.7, 1.3), s3:rng(0.4, 0.8), s4:rng(0.9, 1.5),
      label: LABELS[c] || null});
  }

  /* the melt around the chains */
  var motes = A.cloud(110, 0.011, 0.85, 'diamond');
  var MO = [];
  for (var i=0;i<motes.n;i++){
    MO.push({x:rng(-1.7,1.7), y:rng(-1.2,1.2), z:rng(-1.1,1.1), ph:rng(0,6.3), sp:rng(0.02,0.07)});
    motes.tint(i, i % 5 === 0 ? warm : dim);
  }
  root.add(motes.obj);

  var act = 0, tick = 0;
  if (CH[0].label) A.say(CH[0].label[1], CH[0].label[0]);

  return {dist:5.9, lift:0.15, look:0, tilt:0.12, yaw:0.25, limit:0.7,
  sway:{amp:0.34, rate:0.11},
  frame:function(t, dt){
    var w = A.RM ? 0 : t;
    var shear = 1 + A.p.y * 0.35;      // the pointer works the melt
    for (var c=0;c<CH.length;c++){
      var C = CH[c], on = c === act;
      var hotU = ((w * 0.42 + c*0.31) % 1);
      for (var i=0;i<NP;i++){
        var u = i/(NP-1);
        var x = (u - 0.5) * SPAN;
        var y = C.y + Math.sin(u*C.f1*6.283 + w*C.s1 + C.ph)*C.a1*shear
                    + Math.sin(u*C.f2*6.283 + w*C.s2)*C.a2;
        var z = C.z + Math.sin(u*C.f3*6.283 + w*C.s3 + C.ph*1.4)*C.a3
                    + Math.cos(u*C.f4*6.283 + w*C.s4)*C.a4;
        C.pos[i*3] = x; C.pos[i*3+1] = y; C.pos[i*3+2] = z;

        var d = Math.abs(u - hotU);
        var heat = on ? Math.max(0, 1 - d/0.06) : 0;
        var b = Math.sin(w*1.4 - i*0.28 + c)*0.5+0.5;
        var cc = heat > 0.02 ? hot : (on ? half : dim);
        C.bc[i*3] = cc.r; C.bc[i*3+1] = cc.g; C.bc[i*3+2] = cc.b;
        C.bs[i] = (on ? 0.95 : 0.6) + b*0.3 + heat*2.4;
        C.ba[i] = (on ? 0.85 : 0.5) + b*0.15 + heat*0.15;
      }
      C.geo.attributes.position.needsUpdate = true;
      C.bg.attributes.aCol.needsUpdate = true;
      C.bg.attributes.aS.needsUpdate = true;
      C.bg.attributes.aA.needsUpdate = true;
      C.mat.opacity = on ? (A.LIGHT ? 1 : 0.75) : (A.LIGHT ? 0.6 : 0.26);
      C.mat.color.set(GLXC.int[on ? 'signal' : A.ink('cyan')]);
    }

    for (var m=0;m<MO.length;m++){
      var M = MO[m];
      if (!A.RM){ M.x += M.sp * dt; if (M.x > 2.1) M.x = -2.1; }
      motes.at(m, M.x, M.y + Math.sin(w*0.5 + M.ph)*0.05, M.z);
      var f = Math.sin(w*0.8 + M.ph)*0.5+0.5;
      motes.size[m] = 0.35 + f*0.5;
      motes.alpha[m] = 0.18 + f*0.3;
    }
    motes.flush();

    if (LABELS.length){
      tick += dt;
      if (tick > 4){
        tick = 0; act = (act+1) % CH.length;
        if (CH[act].label) A.say(CH[act].label[1], CH[act].label[0]);
      }
    }
  }};
}
`,
};

/* ----------------------------------------------------------- fertilizers
   A prilling tower. Melt falls from the spray head, solidifies on the way
   down and builds the cone at the base, which is exactly how the flagship
   grade on this page is made — and it is also, unavoidably, a picture of
   tonnage. A tenth of the prills carry the phosphate and potash tints, so
   the NPK split the rows below quantify is visible in the material itself. */
SCENES.prill = {
  fn: 'scenePrill',
  src: `
function scenePrill(A){
  var T = A.T, root = A.root, rng = A.rng, rnd = A.rnd;
  var GRADES = A.data || [];

  var TOP = 1.05, FLOOR = -0.85, TR = 0.44;
  var CONE_R = 0.86, CONE_H = 0.54;
  var BX0 = 0.62, BX1 = 1.82, BZ0 = 0.3, BZ1 = 0.78;

  /* --- the tower --- */
  (function(){
    var f = [];
    for (var i=0;i<18;i++){
      var th = i/18 * Math.PI*2;
      f.push(Math.cos(th)*TR, FLOOR, Math.sin(th)*TR, Math.cos(th)*TR, TOP, Math.sin(th)*TR);
    }
    root.add(A.segs(f, 'globeBorder', A.LIGHT ? 0.55 : 0.26));
    for (var y=FLOOR; y<=TOP+0.01; y+=0.32)
      root.add(A.ring(A.circle(TR, 56, y, 'y'), 'globeBorder', A.LIGHT ? 0.75 : 0.4));
    /* the spray head */
    root.add(A.ring(A.circle(0.17, 40, TOP+0.05, 'y'), 'cyan', A.LIGHT ? 1 : 0.75));
    var sp = [];
    for (var k=0;k<12;k++){
      var th2 = k/12 * Math.PI*2;
      sp.push(0, TOP+0.14, 0, Math.cos(th2)*0.17, TOP+0.05, Math.sin(th2)*0.17);
    }
    root.add(A.segs(sp, 'cyan', A.LIGHT ? 0.85 : 0.52));
  })();

  /* --- the pile silhouette --- */
  (function(){
    var c = [];
    for (var i=0;i<40;i++){
      var th = i/40 * Math.PI*2;
      c.push(Math.cos(th)*CONE_R, FLOOR, Math.sin(th)*CONE_R, 0, FLOOR+CONE_H, 0);
    }
    root.add(A.segs(c, 'sand', A.LIGHT ? 0.38 : 0.16));
    root.add(A.ring(A.circle(CONE_R, 72, FLOOR, 'y'), 'sand', A.LIGHT ? 0.85 : 0.48));
    for (var r=0.26; r<CONE_R; r+=0.24)
      root.add(A.ring(A.circle(r, 56, FLOOR + (1 - r/CONE_R)*CONE_H, 'y'),
        'sand', A.LIGHT ? 0.42 : 0.18));
  })();

  /* --- the ground and the outbound conveyor --- */
  (function(){
    for (var r=1.12; r<1.62; r+=0.24)
      root.add(A.ring(A.circle(r, 80, FLOOR, 'y'), 'globeGraticule', A.LIGHT ? 0.5 : 0.22));
    var belt = [];
    belt.push(BX0, FLOOR+0.09, BZ0+0.04, BX1, FLOOR-0.22, BZ1+0.04);
    belt.push(BX0, FLOOR-0.02, BZ0, BX1, FLOOR-0.33, BZ1);
    for (var s=0;s<=8;s++){
      var k = s/8;
      belt.push(BX0 + (BX1-BX0)*k, FLOOR+0.09 - 0.31*k, BZ0+0.04 + (BZ1-BZ0)*k,
                BX0 + (BX1-BX0)*k, FLOOR-0.02 - 0.31*k, BZ0 + (BZ1-BZ0)*k);
    }
    root.add(A.segs(belt, 'globeBorder', A.LIGHT ? 0.9 : 0.55));
  })();

  /* --- the prills ---
     Three tints, so the N-P-K split the rows below quantify is visible in the
     material. On a light palette the mid gold and the dark gold are one step
     apart and both read; the potash tint takes the system accent, which is
     the only third colour the palette has that is not an alert. */
  var NP = 1150;
  var prills = A.cloud(NP, 0.0115, 1, 'round');
  var N_C = A.col('sand');
  var P_C = A.col(A.LIGHT ? 'accentMaterialText' : 'sandD');
  var K_C = A.col('cyan');
  var PR = [];
  for (var i=0;i<NP;i++){
    var tint = rnd();
    prills.tint(i, tint < 0.7 ? N_C : tint < 0.9 ? P_C : K_C);
    PR.push(spawn(rng(0, 5.5)));
  }
  function spawn(delay){
    var th = rng(0, 6.283), r = Math.sqrt(rnd()) * 0.16;
    var rest = Math.sqrt(rnd()) * CONE_R;
    var rth = rng(0, 6.283);
    return {x:Math.cos(th)*r, z:Math.sin(th)*r, y:TOP + rng(0, 0.1),
      vy:0, wait:delay, state:0,
      rx:Math.cos(rth)*rest, rz:Math.sin(rth)*rest,
      ry:FLOOR + (1 - rest/CONE_R) * CONE_H * rng(0.9, 1.0) + 0.008,
      hold:rng(2.5, 7)};
  }
  root.add(prills.obj);

  /* the belt's cargo */
  var belt = A.cloud(34, 0.013, 1, 'round');
  var BE = [];
  for (var b=0;b<belt.n;b++){ BE.push(b/belt.n); belt.tint(b, N_C); }
  root.add(belt.obj);

  var grade = 0, tick = 0;
  if (GRADES.length) A.say(GRADES[0][1], GRADES[0][0]);

  /* look sits at the tower's own mid-height rather than at the origin: the
     content runs from the floor to the spray head, and aiming at the floor
     put the head through the top of the frame. */
  return {dist:7.0, lift:0.85, look:0.16, tilt:0.1, spin:0.1, limit:0.7,
  frame:function(t, dt){
    var lean = A.p.x * 0.18;
    for (var i=0;i<NP;i++){
      var p = PR[i];
      if (A.RM){
        prills.at(i, p.rx, p.ry, p.rz);
        prills.size[i] = 1; prills.alpha[i] = 0.9;
        continue;
      }
      if (p.wait > 0){ p.wait -= dt; prills.alpha[i] = 0; prills.size[i] = 0; continue; }
      if (p.state === 0){
        p.vy -= 2.4 * dt;
        p.y += p.vy * dt;
        /* the fall drifts toward where the prill will land, so the cone
           builds from the spray rather than teleporting into shape */
        var k = A.clamp((TOP - p.y) / (TOP - p.ry), 0, 1);
        var kk = k*k;
        prills.at(i, p.x + (p.rx - p.x)*kk + lean*k, p.y, p.z + (p.rz - p.z)*kk);
        prills.size[i] = 0.85 + k*0.25;
        prills.alpha[i] = 0.55 + k*0.4;
        if (p.y <= p.ry){ p.state = 1; p.y = p.ry; }
      } else {
        prills.at(i, p.rx, p.ry, p.rz);
        prills.size[i] = 1; prills.alpha[i] = 0.92;
        p.hold -= dt;
        if (p.hold <= 0) PR[i] = spawn(0);
      }
    }
    prills.flush();

    for (var b=0;b<BE.length;b++){
      if (!A.RM) BE[b] = (BE[b] + dt*0.22) % 1;
      var k2 = BE[b];
      belt.at(b, BX0 + (BX1-BX0)*k2 + (A.rnd()-0.5)*0.005,
        FLOOR + 0.035 - 0.31*k2, BZ0 + 0.02 + (BZ1-BZ0)*k2);
      belt.size[b] = 1; belt.alpha[b] = 0.4 + Math.sin(k2*Math.PI)*0.5;
    }
    belt.flush();

    if (GRADES.length){
      tick += dt;
      if (tick > 3.2){
        tick = 0; grade = (grade+1) % GRADES.length;
        A.say(GRADES[grade][1], GRADES[grade][0]);
      }
    }
  }};
}
`,
};

/* ------------------------------------------------------------------ emit */

/* One page gets ONE scene. Emitting all eight everywhere would put 60 KB of
   dead code on every hero for the sake of a shared file. */
function bundle(name, data) {
  const scene = SCENES[name];
  if (!scene)
    throw new Error(
      `scene3d: no scene named "${name}" (have ${Object.keys(SCENES).join(", ")})`,
    );

  /* glxPage is called once by kernel-js after DOMContentLoaded, and three of
     these pages already define one. Chain rather than replace: a filter bar
     that stops working because its hero grew a scene is a worse trade than
     no scene at all. */
  return `
/* ---------- ${name} stage — see _src/scene3d.js ---------- */
${data === undefined ? "" : `var GLX3D_DATA = ${JSON.stringify(data)};\n`}${CORE}
${scene.src}
(function(){
  var prev = window.glxPage;
  window.glxPage = function(){
    if (prev) try { prev(); } catch(e){ console.warn('page init', e); }
    glx3d(${scene.fn});
  };
})();
`;
}

module.exports = { bundle, SCENES };
