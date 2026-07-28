/* GET /api/admin/summary?days=30
   Everything the dashboard's top half needs, in one round trip. */

import { requireAdmin } from '../../_lib/auth.js';
import { json, DAY } from '../../_lib/util.js';
import { DOCS } from '../../_lib/docs.js';

export const onRequestGet = requireAdmin(async ({ request, env }) => {
  const days = Math.min(365, Math.max(1, +new URL(request.url).searchParams.get('days') || 30));
  const since = Date.now() - days * DAY;
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Storage is not configured.' }, 503);

  const q = (sql, ...bind) => db.prepare(sql).bind(...bind);

  const [visitors, views, leads, opens, byDay, byCountry, byPath, byRef, byDoc, byDevice] =
    await db.batch([
      q('SELECT COUNT(DISTINCT vid) AS n FROM pageviews WHERE ts > ?1', since),
      q('SELECT COUNT(*) AS n FROM pageviews WHERE ts > ?1', since),
      q('SELECT COUNT(*) AS n FROM leads WHERE created_at > ?1', since),
      q("SELECT COUNT(*) AS n FROM doc_events WHERE kind = 'open' AND ts > ?1", since),

      /* SQLite has no date type, so bucket the epoch millis by day in SQL
         rather than pulling every row back to count them here. */
      q(
        `SELECT date(ts/1000,'unixepoch') AS d,
                COUNT(*) AS views,
                COUNT(DISTINCT vid) AS visitors
         FROM pageviews WHERE ts > ?1
         GROUP BY d ORDER BY d`,
        since
      ),
      q(
        `SELECT country, COUNT(DISTINCT vid) AS visitors, COUNT(*) AS views
         FROM pageviews WHERE ts > ?1 AND country != ''
         GROUP BY country ORDER BY visitors DESC LIMIT 12`,
        since
      ),
      q(
        `SELECT path, COUNT(*) AS views, COUNT(DISTINCT vid) AS visitors
         FROM pageviews WHERE ts > ?1
         GROUP BY path ORDER BY views DESC LIMIT 12`,
        since
      ),
      q(
        `SELECT ref, COUNT(*) AS views FROM pageviews
         WHERE ts > ?1 AND ref != '' GROUP BY ref ORDER BY views DESC LIMIT 8`,
        since
      ),

      /* Per-document funnel: requested → opened → downloaded, plus total
         reading time. This is the table that answers "is anyone actually
         reading the SN-600 sheet". */
      q(
        `SELECT g.doc_id AS doc_id,
                COUNT(DISTINCT g.token) AS requests,
                SUM(g.opens)            AS opens,
                SUM(g.downloads)        AS downloads,
                COUNT(DISTINCT CASE WHEN g.opens > 0 THEN g.token END) AS opened_links
         FROM grants g WHERE g.created_at > ?1
         GROUP BY g.doc_id`,
        since
      ),
      q(
        `SELECT device, COUNT(*) AS views FROM pageviews WHERE ts > ?1
         GROUP BY device ORDER BY views DESC`,
        since
      ),
    ]);

  const dwell = await q(
    `SELECT doc_id, SUM(seconds) AS secs FROM doc_events
     WHERE kind = 'page' AND ts > ?1 GROUP BY doc_id`,
    since
  ).all();
  const dwellBy = Object.fromEntries((dwell.results || []).map((r) => [r.doc_id, r.secs || 0]));

  const docStats = Object.fromEntries((byDoc.results || []).map((r) => [r.doc_id, r]));
  const documents = DOCS.map((d) => {
    const s = docStats[d.id] || {};
    return {
      id: d.id,
      kind: d.kind,
      title: d.title,
      requests: s.requests || 0,
      openedLinks: s.opened_links || 0,
      opens: s.opens || 0,
      downloads: s.downloads || 0,
      readSeconds: dwellBy[d.id] || 0,
    };
  }).sort((a, b) => b.requests - a.requests);

  return json({
    ok: true,
    days,
    totals: {
      visitors: visitors.results?.[0]?.n || 0,
      views: views.results?.[0]?.n || 0,
      leads: leads.results?.[0]?.n || 0,
      opens: opens.results?.[0]?.n || 0,
    },
    series: byDay.results || [],
    countries: byCountry.results || [],
    paths: byPath.results || [],
    referrers: byRef.results || [],
    devices: byDevice.results || [],
    documents,
  });
});
