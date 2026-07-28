/* POST /api/request
   { doc, email, name?, company?, page? }

   Records the lead, mints a single-recipient grant, emails the link.
   Responds 200 as soon as the visitor's mail is accepted; the internal
   notification goes out afterwards on waitUntil so a slow provider call
   never holds the modal open. */

import { DOC_BY_ID } from '../_lib/docs.js';
import { send, documentEmail, leadAlert } from '../_lib/mail.js';
import { json, bad, geo, mintToken, isEmail, clean, now, DAY, rateLimited } from '../_lib/util.js';

const GRANT_TTL = 30 * DAY;

export async function onRequestPost(ctx) {
  const { request, env } = ctx;

  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Malformed request.');
  }

  const doc = DOC_BY_ID[body.doc];
  if (!doc) return bad('Unknown document.');

  const email = clean(body.email, 254).toLowerCase();
  if (!isEmail(email)) return bad('That email address does not look right.');

  const g = geo(request);
  const db = env.DB;
  if (!db) return bad('Storage is not configured.', 503);

  /* Six requests an hour from one address is generous for a real buyer
     comparing grades, and low enough that the mail API cannot be used as
     an open relay. */
  if (g.ip && (await rateLimited(db, g.ip, 6, 60 * 60 * 1000))) {
    return bad('That is a lot of requests. Email info@globalex.me and we will send everything at once.', 429);
  }

  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const ts = now();
  const leadId = crypto.randomUUID();
  const token = mintToken();

  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO leads (id,email,name,company,doc_id,created_at,ip,country,city,region,ua,referer,page)
           VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)`
        )
        .bind(
          leadId, email, name, company, doc.id, ts,
          g.ip, g.country, g.city, g.region, g.ua,
          clean(request.headers.get('Referer') || '', 400),
          clean(body.page, 200)
        ),
      db
        .prepare(
          `INSERT INTO grants (token,lead_id,doc_id,email,created_at,expires_at)
           VALUES (?1,?2,?3,?4,?5,?6)`
        )
        .bind(token, leadId, doc.id, email, ts, ts + GRANT_TTL),
    ]);
  } catch (err) {
    return bad(`Could not record the request: ${err.message}`, 500);
  }

  const origin = new URL(request.url).origin;
  const link = `${origin}/d/${token}`;

  try {
    const mail = documentEmail({ doc, link, name });
    await send(env, {
      to: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: env.DESK_EMAIL || 'info@globalex.me',
    });
  } catch (err) {
    /* The lead is already saved, so the desk can follow up by hand. Say so
       plainly rather than pretending the mail went out.

       424 and not 502: Cloudflare's edge swaps the body of any 5xx a Pages
       Function returns for its own error page, so the message below would
       never reach the visitor and the modal would fail parsing JSON. */
    console.error('mail send failed:', err.message);
    return bad(
      'We saved your request but could not send the email just now. The desk will follow up, or write to info@globalex.me.',
      424
    );
  }

  const place = [g.city, g.region, g.country].filter(Boolean).join(', ');
  ctx.waitUntil(
    (async () => {
      try {
        const alert = leadAlert({ doc, email, name, company, place });
        await send(env, {
          to: env.DESK_EMAIL || 'info@globalex.me',
          subject: alert.subject,
          html: alert.html,
          text: alert.text,
          replyTo: email,
        });
      } catch {
        /* The visitor already has their document; a missing internal copy
           is not worth failing their request over. It is in D1 regardless. */
      }
    })()
  );

  return json({ ok: true, sent: email });
}
