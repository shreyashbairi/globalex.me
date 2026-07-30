// Reusable page sections.

/* Optional background footage for an interior hero.

   Deliberately no mute control: both files were encoded with -an and carry no
   audio track at all, so a mute button would toggle silence. Shipping one
   would be worse than shipping none.

   preload="none" and no src on the <source> elements — kernel-js attaches the
   real source only when the hero enters the viewport, so 8.5 MB never sits on
   the critical path. Under prefers-reduced-motion or Save-Data it is never
   attached and the poster stands as a still background. */
const heroVideo = () => `<div class="ph-vid" data-hero-vid aria-hidden="true">
<img class="ph-vid-p" src="assets/hero-poster.jpg" alt="" width="1920" height="1080" />
<video class="ph-vid-v" muted loop playsinline preload="none" tabindex="-1"
 data-src-sm="assets/hero-720.mp4" data-src-lg="assets/hero-1080.mp4"></video>
</div>`;

function hero({
  crumb = [],
  eyebrow,
  h1,
  lead,
  tone = 'cyan',
  meta = [],
  sec = 'Overview',
  video = null,
}) {
  const trail = crumb.map((c) =>
    typeof c === 'string'
      ? `<b>${c}</b>`
      : `<a href="${c[1]}">${c[0]}</a><i>/</i>`
  ).join('\n');
  const metaHtml = meta.length
    ? `<div class="ph-meta rv" style="--d:220ms">${meta.map(([v, l]) => `<span><b>${v}</b>${l}</span>`).join('')}</div>`
    : '';
  return `<section class="ph${video ? ' has-vid' : ''}" data-sec="${sec}">
${video ? heroVideo() : `<canvas data-orn="${tone}" data-tile="146" data-nodes="5" data-alpha="0.26" aria-hidden="true"></canvas>`}
<div class="wrap">
<div class="ph-in">
<nav class="crumb rv" aria-label="Breadcrumb"><a href="index.html">Home</a><i>/</i>${trail}</nav>
<span class="eb${tone === 'sand' ? ' mat' : ''} rv" style="--d:60ms">${eyebrow}</span>
<h1 class="kin">${h1}</h1>
${lead ? `<p class="lead rv" style="--d:160ms">${lead}</p>` : ''}
${metaHtml}
</div>
</div>
</section>`;
}

function cta({ eyebrow = 'Open a lane', h2, lead, primary = ['Contact us', 'contact.html'], secondary = ['info@globalex.me', 'mailto:info@globalex.me'], tone = 'cyan' }) {
  return `<section class="sec">
<div class="wrap">
<div class="cta rv">
<canvas data-lat="${tone}" data-count="26" aria-hidden="true"></canvas>
<div class="cta-in">
<span class="eb${tone === 'sand' ? ' mat' : ''}">${eyebrow}</span>
<h2>${h2}</h2>
${lead ? `<p class="lead">${lead}</p>` : ''}
<div class="btns">
<a href="${primary[1]}" class="btn ${tone === 'sand' ? 'btn-m' : 'btn-p'}" data-mag="6">${primary[0]} <span class="ar">&rarr;</span></a>
<a href="${secondary[1]}" class="btn btn-o" data-mag="6">${secondary[0]}</a>
</div>
</div>
</div>
</div>
</section>`;
}

module.exports = { hero, cta };
