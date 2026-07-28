/* GET /api/admin/export?what=leads|messages|events
   CSV, so the list can go straight into a CRM or a spreadsheet. */

import { requireAdmin } from '../../_lib/auth.js';
import { json } from '../../_lib/util.js';
import { DOC_BY_ID } from '../../_lib/docs.js';

/* Excel treats a leading =, +, - or @ as a formula. Prefixing with a quote
   is the standard defence against a name field becoming a spreadsheet
   payload the moment someone opens the export. */
function cell(v) {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
const csv = (rows) => rows.map((r) => r.map(cell).join(',')).join('\r\n');

const stamp = (ms) => (ms ? new Date(ms).toISOString().replace('T', ' ').slice(0, 19) : '');

export const onRequestGet = requireAdmin(async ({ request, env }) => {
  const what = new URL(request.url).searchParams.get('what') || 'leads';
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Storage is not configured.' }, 503);

  let rows;
  let name;

  if (what === 'messages') {
    name = 'globalex-messages';
    const r = await db.prepare('SELECT * FROM messages ORDER BY ts DESC LIMIT 5000').all();
    rows = [['Received (UTC)', 'Type', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Country', 'City', 'Page']];
    for (const m of r.results || []) {
      rows.push([stamp(m.ts), m.kind, m.name, m.email, m.phone, m.company, m.body, m.country, m.city, m.page]);
    }
  } else if (what === 'events') {
    name = 'globalex-document-activity';
    const r = await db.prepare('SELECT * FROM doc_events ORDER BY ts DESC LIMIT 20000').all();
    rows = [['When (UTC)', 'Event', 'Document', 'Recipient', 'Page', 'Seconds', 'City', 'Region', 'Country', 'IP', 'Timezone']];
    for (const e of r.results || []) {
      rows.push([
        stamp(e.ts), e.kind, DOC_BY_ID[e.doc_id]?.title || e.doc_id, e.email,
        e.page, e.seconds, e.city, e.region, e.country, e.ip, e.tz,
      ]);
    }
  } else {
    name = 'globalex-leads';
    const r = await db
      .prepare(
        `SELECT l.*, g.token, g.opens, g.downloads, g.last_open, g.revoked
         FROM leads l LEFT JOIN grants g ON g.lead_id = l.id
         ORDER BY l.created_at DESC LIMIT 10000`
      )
      .all();
    rows = [['Requested (UTC)', 'Email', 'Name', 'Company', 'Document', 'Type', 'Opens', 'Downloads', 'Last opened (UTC)', 'City', 'Country', 'Link status']];
    for (const l of r.results || []) {
      rows.push([
        stamp(l.created_at), l.email, l.name, l.company,
        DOC_BY_ID[l.doc_id]?.title || l.doc_id, DOC_BY_ID[l.doc_id]?.kind || '',
        l.opens || 0, l.downloads || 0, stamp(l.last_open),
        l.city, l.country, l.revoked ? 'revoked' : 'active',
      ]);
    }
  }

  const day = new Date().toISOString().slice(0, 10);
  return new Response('﻿' + csv(rows), {
    headers: {
      /* The BOM makes Excel read it as UTF-8; without it, accented city
         names arrive mangled. */
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}-${day}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
});
