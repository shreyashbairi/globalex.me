/* POST /api/contact — the contact and careers forms.
   { kind, fields: [[label, value], ...], page? }

   Logged to D1 first, then emailed. If the mail provider is down the
   enquiry is still recorded, and the admin dashboard shows it — losing a
   buyer's message because a third party had a bad afternoon is not
   acceptable. */

import { send, formAlert, formReceipt } from '../_lib/mail.js';
import { json, bad, geo, clean, isEmail, now } from '../_lib/util.js';

const KINDS = new Set(['contact', 'careers']);

export async function onRequestPost(ctx) {
  const { request, env } = ctx;

  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Malformed request.');
  }

  const kind = KINDS.has(body.kind) ? body.kind : 'contact';
  const fields = Array.isArray(body.fields) ? body.fields.slice(0, 20) : [];
  if (!fields.length) return bad('Nothing to send.');

  const pairs = fields
    .map(([k, v]) => [clean(k, 80), clean(v, 4000)])
    .filter(([k, v]) => k && v);
  if (!pairs.length) return bad('Please fill in the form before sending.');

  /* Honeypot: a hidden field no human fills in. Bots do. Accept and drop,
     so the bot sees success and does not retry. */
  if (clean(body.website, 100)) return json({ ok: true });

  const find = (re) => (pairs.find(([k]) => re.test(k)) || [])[1] || '';
  const email = find(/e-?mail/i).toLowerCase();
  const name = find(/name|surname/i);
  const phone = find(/phone|tel/i);
  const company = find(/company|organisation|organization/i);
  const message = find(/message|note|why|volume|detail/i);

  if (email && !isEmail(email)) return bad('That email address does not look right.');

  const g = geo(request);
  const place = [g.city, g.region, g.country].filter(Boolean).join(', ');
  const desk = env.DESK_EMAIL || 'info@globalex.me';

  if (env.DB) {
    try {
      await env.DB
        .prepare(
          `INSERT INTO messages (kind,name,email,phone,company,subject,body,ts,ip,country,city,ua,page)
           VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)`
        )
        .bind(
          kind, name, email, phone, company,
          kind === 'careers' ? 'Career application' : 'Website enquiry',
          pairs.map(([k, v]) => `${k}: ${v}`).join('\n'),
          now(), g.ip, g.country, g.city, g.ua, clean(body.page, 200)
        )
        .run();
    } catch {
      /* Fall through — the email below is the message that actually matters. */
    }
  }

  try {
    const alert = formAlert({ kind, fields: pairs, place });
    await send(env, {
      to: desk,
      subject: alert.subject,
      html: alert.html,
      text: alert.text,
      replyTo: isEmail(email) ? email : undefined,
    });
  } catch (err) {
    /* 424 rather than 502 — see the note in api/request.js. */
    console.error('mail send failed:', err.message);
    return bad(
      'We could not send that just now. Please email info@globalex.me directly and we will pick it up.',
      424
    );
  }

  /* Acknowledge to the sender after the desk copy is safely away. */
  if (isEmail(email)) {
    ctx.waitUntil(
      (async () => {
        try {
          const r = formReceipt({ kind });
          await send(env, { to: email, subject: r.subject, html: r.html, text: r.text, replyTo: desk });
        } catch {
          /* Best effort. */
        }
      })()
    );
  }

  return json({ ok: true });
}
