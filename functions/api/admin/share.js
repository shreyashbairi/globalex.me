/* POST /api/admin/share
   { doc, email?, label?, days?, send? }

   Mints a tracked document link on the operator's behalf, so the desk can
   hand a controlled document to a contact directly instead of asking them
   to fill in the form on the site.

   The row it writes is an ordinary lead + grant, not a special case. That
   is deliberate: a shared link then shows up in the leads table, drills
   down to the same activity view, exports to the same CSV and revokes with
   the same button. The only difference is `page`, which records that the
   desk created it rather than a visitor. */

import { requireAdmin } from '../../_lib/auth.js';
import { DOC_BY_ID } from '../../_lib/docs.js';
import { send, documentEmail } from '../../_lib/mail.js';
import { json, bad, mintToken, isEmail, clean, now, DAY } from '../../_lib/util.js';

export const SHARE_PAGE = 'admin-share';

/* Bounded so a typo cannot mint a link that outlives anyone's memory of
   sending it. 3650 days is "effectively permanent" and still auditable. */
const MIN_DAYS = 1;
const MAX_DAYS = 3650;

export const onRequestPost = requireAdmin(async ({ request, env }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Malformed request.');
  }

  const db = env.DB;
  if (!db) return bad('Storage is not configured.', 503);

  const doc = DOC_BY_ID[body.doc];
  if (!doc) return bad('Pick a document to share.');

  /* The recipient address is optional — the operator may just want a link to
     paste into a chat. When it is given it must be real, because it is what
     the viewer stamps on the document and what the desk follows up. */
  const email = clean(body.email, 254).toLowerCase();
  if (email && !isEmail(email)) return bad('That email address does not look right.');

  const wantsMail = !!body.send;
  if (wantsMail && !email) return bad('Add a recipient address, or turn off "email the link".');

  const label = clean(body.label, 160);
  const days = Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(+body.days || 30)));

  const ts = now();
  const leadId = crypto.randomUUID();
  const token = mintToken();
  const expiresAt = ts + days * DAY;

  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO leads (id,email,name,company,doc_id,created_at,ip,country,city,region,ua,referer,page)
           VALUES (?1,?2,?3,?4,?5,?6,'','','','','','',?7)`
        )
        .bind(leadId, email, '', label, doc.id, ts, SHARE_PAGE),
      db
        .prepare(
          `INSERT INTO grants (token,lead_id,doc_id,email,created_at,expires_at)
           VALUES (?1,?2,?3,?4,?5,?6)`
        )
        .bind(token, leadId, doc.id, email, ts, expiresAt),
    ]);
  } catch (err) {
    return bad(`Could not create the link: ${err.message}`, 500);
  }

  const origin = new URL(request.url).origin;
  const link = `${origin}/d/${token}`;

  /* The link exists either way. If the mail fails, say so and still hand
     back the URL — the operator can paste it themselves, which is the
     whole point of this endpoint. */
  let mailed = false;
  let mailError = null;
  if (wantsMail) {
    try {
      const mail = documentEmail({ doc, link, name: '', days, shared: true });
      await send(env, {
        to: email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        replyTo: env.DESK_EMAIL || 'info@globalex.me',
      });
      mailed = true;
    } catch (err) {
      mailError = err.message;
    }
  }

  return json({
    ok: true,
    token,
    link,
    mailed,
    mailError,
    days,
    expiresAt,
    doc: { id: doc.id, title: doc.title, kind: doc.kind },
  });
});
