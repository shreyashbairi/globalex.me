const { hero } = require('../parts');
const privacy = require('./privacy-policy');

const SECTIONS = [
  ['eligibility', 'Subscriptions & eligibility',
    '<p>Users must be 18 years of age or older to access our services. You agree to provide accurate, current and complete information when registering or interacting with our services.</p>'],
  ['use', 'Service use',
    '<p>You agree to use our services in compliance with these Terms and all applicable laws and regulations. You are responsible for the security of your account credentials and for all activity under your account.</p>'],
  ['products', 'Products & orders',
    '<p>The Company does not warrant the accuracy, completeness or reliability of product descriptions or other content available through the services. Prices and availability are subject to change without notice.</p>'],
  ['payment', 'Payment',
    '<p>Users must pay all applicable fees and taxes associated with purchases. Payment terms specific to each transaction are set out in the relevant trade contract &mdash; see our standard <a href="procedures.html">trade procedures</a>.</p>'],
  ['ip', 'Intellectual property',
    '<p>All intellectual property rights in our services &mdash; including the website, content, trademarks and proprietary materials &mdash; are owned by or licensed to the Company. Use of any such materials without explicit permission is prohibited.</p>'],
  ['liability', 'Limitation of liability',
    '<p>To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, special or consequential damages arising out of or in connection with your use of our services.</p>'],
  ['indemnity', 'Indemnification',
    '<p>You agree to indemnify and hold harmless the Company, its officers, directors, employees and agents from any claims, damages or expenses resulting from your use of the services or violation of these Terms.</p>'],
  ['modifications', 'Modifications',
    '<p>We reserve the right to modify these Terms at any time. Changes are effective immediately upon posting to the website. Continued use of the services following a modification constitutes acceptance of the revised Terms.</p>'],
  ['termination', 'Termination',
    '<p>We may, at our sole discretion, suspend or terminate your access to our services at any time, with or without notice, for any reason, including violation of these Terms.</p>'],
  ['law', 'Governing law',
    '<p>These Terms and any dispute arising under them are governed by and construed in accordance with the laws of the United Arab Emirates, with exclusive jurisdiction in the courts of Dubai.</p>'],
  ['severability', 'Severability',
    '<p>If any provision of these Terms is found invalid or unenforceable, the remaining provisions continue in full force and effect.</p>'],
  ['entire', 'Entire agreement',
    '<p>These Terms constitute the entire agreement between you and the Company regarding your use of our services, and supersede all prior understandings, agreements or representations.</p>'],
  ['contact', 'Contact',
    '<p>For questions about these Terms, contact us at <a href="mailto:info@globalex.me">info@globalex.me</a> or <a href="tel:+97145667713">+971 4 566 7713</a>.</p>'],
];

module.exports = {
  page: 'terms-conditions',
  title: 'Terms & Conditions — Globalex Trading DMCC',
  desc: 'The terms governing use of the Globalex Trading DMCC website and services.',
  css: privacy.css,
  js: privacy.js,

  body: `
${hero({
    crumb: ['Terms &amp; Conditions'],
    eyebrow: 'Legal &middot; Terms of service',
    h1: 'Terms &amp; Conditions',
    lead: 'These terms govern your use of the Globalex Trading DMCC website and services. By accessing or using our services, you agree to be bound by them.',
    sec: 'Terms',
  })}

<section class="sec is-tight" data-sec="Terms">
  <div class="wrap">
    <div class="legal">
      <nav class="toc" aria-label="Sections">
        <b>Sections</b>
${SECTIONS.map(([id, t], i) => `        <a href="#${id}">${String(i + 1).padStart(2, '0')} &nbsp;${t}</a>`).join('\n')}
      </nav>

      <div class="doc rv">
        <p class="doc-meta">Globalex Trading DMCC &mdash; terms of service</p>
        <p>Trade transactions are additionally governed by the contract executed for that shipment. Where these Terms and a signed trade contract differ, the contract prevails.</p>
${SECTIONS.map(([id, t, b], i) => `        <h2 id="${id}">${i + 1}. ${t}</h2>${b}`).join('\n')}
      </div>
    </div>
  </div>
</section>
`,
};
