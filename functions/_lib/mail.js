/* Outbound mail via Resend.

   Resend rather than SES/SendGrid because it authenticates with a single
   bearer token over plain fetch — no SDK, no SMTP, nothing that needs a
   Node runtime. Swapping provider means rewriting only `send` below. */

import { esc } from './util.js';

const ENDPOINT = 'https://api.resend.com/emails';

export async function send(env, { to, subject, html, text, replyTo }) {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'Globalex Documents <documents@globalex.me>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mail provider rejected the send (${res.status}): ${body.slice(0, 300)}`);
  }
  return res.json();
}

/* ------------------------------------------------------------------
   Templates.

   Inline styles and table layout on purpose: Outlook and Gmail strip
   <style> blocks and ignore flexbox. Dark ground with the brand cyan,
   but every colour is stated explicitly so clients that force a light
   theme still produce readable contrast.
   ------------------------------------------------------------------ */

const SHELL = (inner) => `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0F2A38;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F2A38;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#143544;border:1px solid rgba(146,190,204,.22);">
${inner}
</table>
<p style="max-width:560px;margin:18px auto 0;font:12px -apple-system,Segoe UI,sans-serif;color:#5F7D89;text-align:center;">
Globalex Trading DMCC &middot; 2605 X3 Tower, Cluster X, JLT, Dubai, UAE<br />
<a href="https://globalex.me" style="color:#8FAAB6;">globalex.me</a>
</p>
</td></tr></table>
</body></html>`;

const HEAD = `<tr><td style="padding:26px 30px 0;">
<span style="font:700 15px -apple-system,Segoe UI,sans-serif;letter-spacing:.16em;color:#E9F3F6;">GLOBALEX</span>
<span style="font:400 11px -apple-system,Segoe UI,sans-serif;letter-spacing:.2em;color:#5F7D89;display:block;margin-top:3px;">TRADING DMCC</span>
</td></tr>`;

/* `days` must match the grant that was actually minted. The copy used to say
   "30 days" unconditionally, which would be a lie the moment the desk shares
   a link on any other term. `shared` swaps the opening line for links the
   desk sends unprompted — the recipient never filled in a form. */
export function documentEmail({ doc, link, name, days = 30, shared = false }) {
  const hi = name ? `Hello ${esc(name)},` : 'Hello,';
  const life = days === 1 ? '24 hours' : `${days} days`;
  const intro = shared
    ? 'The Globalex desk has shared a controlled document with you.'
    : 'Here is the document you asked for on globalex.me.';

  const html = SHELL(`${HEAD}
<tr><td style="padding:22px 30px 6px;">
  <p style="font:400 15px/1.6 -apple-system,Segoe UI,sans-serif;color:#B4C9D2;margin:0 0 18px;">${hi}</p>
  <p style="font:400 15px/1.6 -apple-system,Segoe UI,sans-serif;color:#B4C9D2;margin:0 0 22px;">
    ${intro}
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid rgba(146,190,204,.22);background:#0F2A38;margin-bottom:24px;">
    <tr><td style="padding:16px 18px;">
      <span style="font:600 10px -apple-system,Segoe UI,sans-serif;letter-spacing:.18em;color:#35D6F5;">${esc(doc.kind)}</span>
      <div style="font:600 17px -apple-system,Segoe UI,sans-serif;color:#E9F3F6;margin-top:6px;">${esc(doc.title)}</div>
      <div style="font:400 12px -apple-system,Segoe UI,sans-serif;color:#5F7D89;margin-top:4px;">${esc(doc.sub)} &middot; ${esc(doc.origin)} &middot; ${doc.pages} pp</div>
    </td></tr>
  </table>
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="background:#35D6F5;">
      <a href="${link}" style="display:inline-block;padding:13px 26px;font:600 14px -apple-system,Segoe UI,sans-serif;color:#0F2A38;text-decoration:none;">Open the document &rarr;</a>
    </td>
  </tr></table>
  <p style="font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#5F7D89;margin:22px 0 0;">
    The link is yours and stays live for ${life}. If the button does not work, paste this into your browser:<br />
    <a href="${link}" style="color:#8FAAB6;word-break:break-all;">${link}</a>
  </p>
</td></tr>
<tr><td style="padding:22px 30px 28px;">
  <p style="font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#B4C9D2;margin:0;border-top:1px solid rgba(146,190,204,.2);padding-top:18px;">
    Need pricing, a different grade, or the full range? Reply to this email &mdash; it reaches the Dubai desk.
  </p>
</td></tr>`);

  const text = `${name ? `Hello ${name},` : 'Hello,'}

${intro}

${doc.kind} — ${doc.title}
${doc.sub} · ${doc.origin} · ${doc.pages} pp

Open it here:
${link}

The link is yours and stays live for ${life}.

Need pricing, a different grade, or the full range? Reply to this email — it reaches the Dubai desk.

Globalex Trading DMCC · 2605 X3 Tower, Cluster X, JLT, Dubai, UAE
globalex.me`;

  return { subject: `${doc.title} — ${doc.kind} from Globalex`, html, text };
}

/* Internal notification. Goes to the desk, not the visitor, so it is dense
   and skips the pleasantries. */
export function leadAlert({ doc, email, name, company, place }) {
  const row = (k, v) =>
    `<tr><td style="padding:7px 0;font:400 12px -apple-system,Segoe UI,sans-serif;color:#5F7D89;width:120px;">${k}</td>
     <td style="padding:7px 0;font:500 14px -apple-system,Segoe UI,sans-serif;color:#E9F3F6;">${esc(v || '—')}</td></tr>`;

  const html = SHELL(`${HEAD}
<tr><td style="padding:22px 30px 28px;">
  <p style="font:600 16px -apple-system,Segoe UI,sans-serif;color:#35D6F5;margin:0 0 16px;">New document request</p>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    ${row('Document', `${doc.kind} — ${doc.title}`)}
    ${row('Email', email)}
    ${row('Name', name)}
    ${row('Company', company)}
    ${row('Location', place)}
  </table>
  <p style="font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#5F7D89;margin:20px 0 0;">
    The link has been sent. Opens and downloads appear in the admin dashboard.
  </p>
</td></tr>`);

  return {
    subject: `Document request — ${doc.title} — ${email}`,
    html,
    text: `New document request\n\nDocument: ${doc.kind} — ${doc.title}\nEmail: ${email}\nName: ${name || '—'}\nCompany: ${company || '—'}\nLocation: ${place || '—'}\n`,
  };
}

/* Contact and careers submissions, forwarded verbatim to the desk. */
export function formAlert({ kind, fields, place }) {
  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 0;font:400 12px -apple-system,Segoe UI,sans-serif;color:#5F7D89;width:130px;vertical-align:top;">${esc(k)}</td>
         <td style="padding:7px 0;font:500 14px/1.55 -apple-system,Segoe UI,sans-serif;color:#E9F3F6;white-space:pre-wrap;">${esc(v || '—')}</td></tr>`
    )
    .join('');

  const title = kind === 'careers' ? 'Career application' : 'Website enquiry';
  const html = SHELL(`${HEAD}
<tr><td style="padding:22px 30px 28px;">
  <p style="font:600 16px -apple-system,Segoe UI,sans-serif;color:#35D6F5;margin:0 0 16px;">${title}</p>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${rows}
    <tr><td style="padding:7px 0;font:400 12px -apple-system,Segoe UI,sans-serif;color:#5F7D89;">Location</td>
        <td style="padding:7px 0;font:500 14px -apple-system,Segoe UI,sans-serif;color:#E9F3F6;">${esc(place || '—')}</td></tr>
  </table>
</td></tr>`);

  const text = `${title}\n\n${fields.map(([k, v]) => `${k}: ${v || '—'}`).join('\n')}\nLocation: ${place || '—'}\n`;
  return { subject: `${title} — ${fields[0]?.[1] || 'globalex.me'}`, html, text };
}

/* Sent to the visitor so a submitted form does not feel like a void. */
export function formReceipt({ kind }) {
  const line =
    kind === 'careers'
      ? 'Thank you for applying to Globalex. Your application is with our team and we will come back to you if there is a fit.'
      : 'Thank you for contacting Globalex. Your message is with the Dubai desk and we typically reply within two business days.';

  const html = SHELL(`${HEAD}
<tr><td style="padding:22px 30px 28px;">
  <p style="font:400 15px/1.65 -apple-system,Segoe UI,sans-serif;color:#B4C9D2;margin:0 0 16px;">${line}</p>
  <p style="font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#5F7D89;margin:0;border-top:1px solid rgba(146,190,204,.2);padding-top:18px;">
    This is an automatic acknowledgement &mdash; you can reply to it and a person will read it.
  </p>
</td></tr>`);

  return { subject: 'We received your message — Globalex Trading DMCC', html, text: line };
}
