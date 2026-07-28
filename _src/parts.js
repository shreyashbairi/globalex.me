// Reusable page sections.

function hero({ crumb = [], eyebrow, h1, lead, tone = 'cyan', meta = [], sec = 'Overview' }) {
  const trail = crumb.map((c) =>
    typeof c === 'string'
      ? `<b>${c}</b>`
      : `<a href="${c[1]}">${c[0]}</a><i>/</i>`
  ).join('\n');
  const metaHtml = meta.length
    ? `<div class="ph-meta rv" style="--d:220ms">${meta.map(([v, l]) => `<span><b>${v}</b>${l}</span>`).join('')}</div>`
    : '';
  return `<section class="ph" data-sec="${sec}">
<canvas data-orn="${tone}" data-tile="146" data-nodes="5" data-alpha="0.26" aria-hidden="true"></canvas>
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
<p class="lead">${lead}</p>
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
