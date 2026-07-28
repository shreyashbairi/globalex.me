/* GET /api/admin/events?token=…   — the open history for one link
   GET /api/admin/events            — the most recent activity across all links

   This is the drill-down behind a lead row: every open, with city, country
   and time, plus how long was spent on each page. */

import { requireAdmin } from '../../_lib/auth.js';
import { json, clean, DAY } from '../../_lib/util.js';
import { DOC_BY_ID } from '../../_lib/docs.js';

export const onRequestGet = requireAdmin(async ({ request, env }) => {
  const url = new URL(request.url);
  const token = clean(url.searchParams.get('token') || '', 64);
  const limit = Math.min(500, Math.max(1, +url.searchParams.get('limit') || 200));

  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Storage is not configured.' }, 503);

  const rows = token
    ? await db
        .prepare(
          `SELECT * FROM doc_events WHERE token = ?1 ORDER BY ts DESC LIMIT ?2`
        )
        .bind(token, limit)
        .all()
    : await db
        .prepare(
          `SELECT * FROM doc_events WHERE ts > ?1 AND kind IN ('open','download')
           ORDER BY ts DESC LIMIT ?2`
        )
        .bind(Date.now() - 90 * DAY, limit)
        .all();

  const events = (rows.results || []).map((r) => ({
    ...r,
    docTitle: DOC_BY_ID[r.doc_id]?.title || r.doc_id,
    place: [r.city, r.region, r.country].filter(Boolean).join(', '),
  }));

  /* Per-page dwell, so the drill-down can show which page held attention.
     Only meaningful for a single link. */
  let pages = [];
  if (token) {
    const p = await db
      .prepare(
        `SELECT page, SUM(seconds) AS secs, COUNT(*) AS visits
         FROM doc_events WHERE token = ?1 AND kind = 'page' AND page IS NOT NULL
         GROUP BY page ORDER BY page`
      )
      .bind(token)
      .all();
    pages = p.results || [];
  }

  return json({ ok: true, events, pages });
});
