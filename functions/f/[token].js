/* GET /f/:token — stream the PDF bytes for a valid grant.

   The objects live in a private R2 bucket with no public URL, so this is the
   only way to reach a file, and every hit is bound to a grant we can revoke.
   Add ?download=1 to get a Content-Disposition attachment; without it the
   bytes are served inline for pdf.js in the viewer. */

import { DOC_BY_ID } from '../_lib/docs.js';
import { geo, now } from '../_lib/util.js';

export async function onRequestGet(ctx) {
  const { params, env, request } = ctx;
  const token = String(params.token || '');
  const wantsDownload = new URL(request.url).searchParams.get('download') === '1';

  if (!env.DB || !env.DOCS) return new Response('Storage unavailable', { status: 503 });

  const grant = await env.DB.prepare('SELECT * FROM grants WHERE token = ?1').bind(token).first();
  if (!grant || grant.revoked) return new Response('Not found', { status: 404 });
  if (grant.expires_at < Date.now()) return new Response('This link has expired', { status: 410 });

  const doc = DOC_BY_ID[grant.doc_id];
  if (!doc) return new Response('Not found', { status: 404 });

  const object = await env.DOCS.get(doc.key);
  if (!object) return new Response('The file is not in storage', { status: 404 });

  /* Only downloads are logged here. Inline reads are already covered by the
     viewer's open event, and pdf.js issues range requests — counting those
     would multiply one read into dozens. */
  if (wantsDownload) {
    const g = geo(request);
    ctx.waitUntil(
      env.DB.batch([
        env.DB
          .prepare(
            `INSERT INTO doc_events (token,doc_id,email,kind,ts,ip,country,city,region,tz,ua)
             VALUES (?1,?2,?3,'download',?4,?5,?6,?7,?8,?9,?10)`
          )
          .bind(token, doc.id, grant.email, now(), g.ip, g.country, g.city, g.region, g.tz, g.ua),
        env.DB.prepare('UPDATE grants SET downloads = downloads + 1 WHERE token = ?1').bind(token),
      ])
    );
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Content-Type', 'application/pdf');
  headers.set('Cache-Control', 'private, max-age=300');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Content-Disposition',
    `${wantsDownload ? 'attachment' : 'inline'}; filename="${doc.key}"`);
  if (object.httpEtag) headers.set('ETag', object.httpEtag);

  return new Response(object.body, { headers });
}
