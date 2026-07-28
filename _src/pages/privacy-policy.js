const { hero } = require('../parts');

const LEGAL_CSS = `
.legal{display:grid;grid-template-columns:210px 1fr;gap:clamp(2rem,5vw,4.5rem);align-items:start}
.toc{position:sticky;top:clamp(6rem,12vh,8rem);display:grid;gap:.1rem}
.toc b{font-family:var(--f-mono);font-size:.69rem;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;color:var(--cyan);margin-bottom:.9rem}
.toc a{display:block;padding:.42rem 0 .42rem .85rem;border-left:1px solid var(--line);
  font-size:.92rem;color:var(--haze-d);transition:color .3s,border-color .3s}
.toc a:hover{color:var(--frost);border-color:var(--line-2)}
.toc a[data-on]{color:var(--cyan);border-color:var(--cyan)}
@media (max-width:940px){.legal{grid-template-columns:1fr}.toc{position:static;
  display:flex;flex-wrap:wrap;gap:.4rem}
  .toc b{width:100%;margin-bottom:.4rem}
  .toc a{border-left:0;border:1px solid var(--line);padding:.4rem .7rem;font-family:var(--f-mono);
    font-size:.69rem;letter-spacing:.12em;text-transform:uppercase}}
`;

const LEGAL_JS = `
window.glxPage = function(){
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  var heads = links.map(function(a){ return document.getElementById(a.hash.slice(1)); }).filter(Boolean);
  if (!heads.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(rows){
    rows.forEach(function(r){
      if (!r.isIntersecting) return;
      var i = heads.indexOf(r.target);
      links.forEach(function(l, j){
        if (j === i) l.setAttribute('data-on',''); else l.removeAttribute('data-on');
      });
    });
  }, {rootMargin:'-15% 0px -70% 0px'});
  heads.forEach(function(h){ io.observe(h); });
};
`;

const SECTIONS = [
  ['collect', 'Information we collect', `
<ol>
<li><strong>Personal information.</strong> Name, email address, phone number, shipping address and payment details, collected when you interact with our services or make a purchase.</li>
<li><strong>Log data.</strong> IP address, browser type, operating system, referring website, pages visited, and the dates and times of your visits &mdash; collected automatically.</li>
<li><strong>Cookies and similar technologies.</strong> Used to collect information about your browsing activity. You can manage cookie preferences through your browser settings.</li>
</ol>`],
  ['use', 'How we use it', `
<p>We use the information we collect to:</p>
<ol>
<li>Provide, maintain and improve our services.</li>
<li>Process and fulfil your orders.</li>
<li>Communicate with you, including responding to enquiries and providing support.</li>
<li>Send promotional and marketing communications that may be of interest.</li>
<li>Conduct research and analysis to improve the service and user experience.</li>
<li>Protect against fraudulent or unauthorised transactions.</li>
<li>Comply with legal obligations.</li>
</ol>`],
  ['documents', 'Specification and safety documents', `
<p>When you request a safety data sheet, technical data sheet or specification from this website, we record the email address you give us, any name and company you supply, which document you asked for, and the date and time of the request. We use that to send you the document and to follow up on your enquiry.</p>
<p>The link we email opens the document in our own viewer rather than sending you a file attachment. <strong>We record each time that link is opened</strong> &mdash; the date and time, the IP address it was opened from, the approximate city and country that address resolves to, and which pages of the document were viewed and for how long. We also record it if you download the original PDF.</p>
<p>We do this so our commercial team knows whether the material we sent was useful and whether to follow up. We do not sell this information, and we do not share it outside Globalex Trading DMCC except as described under &ldquo;Disclosure of information&rdquo; below.</p>
<p>The link is intended for the person who requested it. Links expire 30 days after they are issued, and we can revoke one at any time. If you would prefer we did not track your use of a document, write to <a href="mailto:info@globalex.me">info@globalex.me</a> and we will send the file as a plain attachment instead.</p>`],
  ['analytics', 'Website analytics', `
<p>We count visits to this website using our own analytics, hosted on our own infrastructure. We do not use Google Analytics, advertising trackers or cross-site profiling, and we set no analytics cookies.</p>
<p>To count returning visitors within a day without identifying anyone, we convert your IP address and browser identifier into a one-way hash together with a secret and the current date. We store only that hash. It cannot be reversed into an IP address, and because the date is part of it, the same visitor produces a different value the following day. The IP address itself is not stored. We also record the page visited, the referring website's domain, and the country and city your connection resolves to.</p>
<p>If your browser sends a Do Not Track signal, we record nothing at all.</p>`],
  ['disclose', 'Disclosure of information', `
<p>We may disclose your personal information to third parties in the following circumstances:</p>
<ol>
<li><strong>Service providers.</strong> Trusted third parties who help deliver our services &mdash; payment processors, shipping partners and IT support providers.</li>
<li><strong>Legal requirements.</strong> Where required by law, or in response to a valid request from governmental authorities.</li>
<li><strong>Business transfers.</strong> If we are involved in a merger, acquisition or sale of assets, your information may transfer as part of that transaction.</li>
<li><strong>Consent.</strong> To third parties, with your consent.</li>
</ol>`],
  ['security', 'Data security', `
<p>We implement reasonable security measures to protect personal information from unauthorised access, use or disclosure. No method of transmission over the internet or electronic storage is completely secure, and we cannot represent otherwise.</p>`],
  ['choices', 'Your choices', `
<p>You have the right to:</p>
<ol>
<li>Opt out of marketing communications by following the instructions in any such message.</li>
<li>Update or correct your personal information by contacting us directly.</li>
<li>Request access to the personal information we hold about you, and request its deletion, subject to our legal obligations.</li>
</ol>`],
  ['third-party', 'Third-party sites', `
<p>Our services may link to third-party websites or services we neither control nor operate. This policy does not apply to them. Review their privacy policies before providing any personal information.</p>`],
  ['children', "Children's privacy", `
<p>Our services are not intended for individuals under 18, and we do not knowingly collect personal information from them. If you believe we have collected information from a minor, contact us and we will delete it promptly.</p>`],
  ['changes', 'Changes to this policy', `
<p>We may update this Privacy Policy from time to time. The updated version takes effect when posted to this website. We encourage you to review it periodically.</p>`],
  ['contact', 'Contact us', `
<p>Questions or concerns about this policy or our privacy practices? Contact us at <a href="mailto:info@globalex.me">info@globalex.me</a> or <a href="tel:+97145667713">+971 4 566 7713</a>.</p>
<p>By using our services you acknowledge that you have read and understood this Privacy Policy, and consent to the collection, use, disclosure and storage of your personal information as described here.</p>`],
];

module.exports = {
  page: 'privacy-policy',
  title: 'Privacy Policy — Globalex Trading DMCC',
  desc: 'How Globalex Trading DMCC collects, uses, discloses and safeguards your personal information.',
  css: LEGAL_CSS,
  js: LEGAL_JS,

  body: `
${hero({
    crumb: ['Privacy Policy'],
    eyebrow: 'Legal &middot; Effective 11.05.2026',
    h1: 'Privacy Policy',
    lead: 'Globalex Trading DMCC is committed to protecting your privacy. This policy explains how we collect, use, disclose and safeguard your personal information when you use our services.',
    sec: 'Privacy',
  })}

<section class="sec is-tight" data-sec="Policy">
  <div class="wrap">
    <div class="legal">
      <nav class="toc" aria-label="Sections">
        <b>Sections</b>
${SECTIONS.map(([id, t]) => `        <a href="#${id}">${t}</a>`).join('\n')}
      </nav>

      <div class="doc rv">
        <p class="doc-meta">Effective date &mdash; 27.07.2026</p>
        <p>By accessing or using our services, you consent to the collection, use, disclosure and storage of your personal information as described in this Privacy Policy.</p>
${SECTIONS.map(([id, t, b]) => `        <h2 id="${id}">${t}</h2>${b}`).join('\n')}
      </div>
    </div>
  </div>
</section>
`,
};
