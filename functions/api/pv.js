/* POST /api/pv — first-party pageview beacon.
   { path, ref? }

   Deliberately cookie-free. The visitor id is a hash of IP + user agent +
   a server secret + today's date, so:
     - unique visitors are countable within a day,
     - the same person is a different id tomorrow,
     - nothing stored can be reversed to an IP or joined across days.

   That is the Plausible/Fathom model. It keeps the site out of consent-
   banner territory while still answering "how many people, from where". */

import { geo, sha256, clean, now, device } from '../_lib/util.js';

const ok = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  if (!env.DB) return ok();

  let body;
  try {
    body = await request.json();
  } catch {
    return ok();
  }

  const path = clean(body.path, 200) || '/';
  const g = geo(request);

  // Do-Not-Track is honoured. Losing a few rows is the correct trade.
  if (request.headers.get('DNT') === '1') return ok();

  const day = new Date().toISOString().slice(0, 10);
  const salt = env.ANALYTICS_SALT || env.ADMIN_SECRET || 'globalex';
  const vid = (await sha256(`${g.ip}|${g.ua}|${salt}|${day}`)).slice(0, 22);

  /* Referrers are kept host-only. The full URL of the page someone came
     from is more than we need and more than we should hold. */
  let ref = '';
  try {
    const r = clean(body.ref, 300);
    if (r) ref = new URL(r).hostname.replace(/^www\./, '');
  } catch {
    ref = '';
  }
  if (ref && ref.endsWith('globalex.me')) ref = '';

  try {
    await env.DB
      .prepare(
        `INSERT INTO pageviews (path,vid,ts,country,city,region,ref,device)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8)`
      )
      .bind(path, vid, now(), g.country, g.city, g.region, ref, device(g.ua))
      .run();
  } catch {
    /* Analytics never breaks a page. */
  }
  return ok();
}
