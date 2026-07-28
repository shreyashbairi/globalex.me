/* GET /api/admin/leads?limit=&offset=&q=&doc=
   The table the brief asked for: email, which file, when — plus what
   happened to the link afterwards.

   POST /api/admin/leads  { token, revoke }  — kill or restore a link. */

import { requireAdmin } from '../../_lib/auth.js';
import { json, bad, clean } from '../../_lib/util.js';
import { DOC_BY_ID } from '../../_lib/docs.js';

export const onRequestGet = requireAdmin(async ({ request, env }) => {
  const url = new URL(request.url);
  const limit = Math.min(500, Math.max(1, +url.searchParams.get('limit') || 100));
  const offset = Math.max(0, +url.searchParams.get('offset') || 0);
  const search = clean(url.searchParams.get('q') || '', 120);
  const doc = clean(url.searchParams.get('doc') || '', 60);

  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Storage is not configured.' }, 503);

  /* Bound parameters throughout — the search box is a string from a browser,
     and it never reaches SQL as syntax. */
  const where = [];
  const bind = [];
  if (search) {
    where.push(`(l.email LIKE ?${bind.length + 1} OR l.company LIKE ?${bind.length + 1} OR l.name LIKE ?${bind.length + 1})`);
    bind.push(`%${search}%`);
  }
  if (doc) {
    where.push(`l.doc_id = ?${bind.length + 1}`);
    bind.push(doc);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const rows = await db
    .prepare(
      `SELECT l.id, l.email, l.name, l.company, l.doc_id, l.created_at,
              l.country, l.city, l.region, l.ip,
              g.token, g.opens, g.downloads, g.last_open, g.revoked, g.expires_at
       FROM leads l
       LEFT JOIN grants g ON g.lead_id = l.id
       ${clause}
       ORDER BY l.created_at DESC
       LIMIT ?${bind.length + 1} OFFSET ?${bind.length + 2}`
    )
    .bind(...bind, limit, offset)
    .all();

  const total = await db
    .prepare(`SELECT COUNT(*) AS n FROM leads l ${clause}`)
    .bind(...bind)
    .first();

  return json({
    ok: true,
    total: total?.n || 0,
    limit,
    offset,
    leads: (rows.results || []).map((r) => ({
      ...r,
      docTitle: DOC_BY_ID[r.doc_id]?.title || r.doc_id,
      docKind: DOC_BY_ID[r.doc_id]?.kind || '',
      place: [r.city, r.region, r.country].filter(Boolean).join(', '),
    })),
  });
});

export const onRequestPost = requireAdmin(async ({ request, env }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Malformed request.');
  }
  const token = clean(body.token, 64);
  if (!token) return bad('Which link?');

  await env.DB
    .prepare('UPDATE grants SET revoked = ?2 WHERE token = ?1')
    .bind(token, body.revoke ? 1 : 0)
    .run();

  return json({ ok: true, token, revoked: !!body.revoke });
});
