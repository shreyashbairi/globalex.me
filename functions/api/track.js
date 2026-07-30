/* POST /api/track — telemetry from the document viewer.
   { token, kind, page?, seconds? }

   Arrives via sendBeacon, so it must stay cheap and must never fail loudly:
   the reader gets a 204 regardless. Only the four known event kinds are
   accepted, and the grant is verified before anything is written, so this
   endpoint cannot be used to stuff the events table.

   ON CONSENT: this is NOT anonymous marketing analytics. The recipient
   supplied their email and asked for the document; DEPLOY.md records that raw
   IP and full user agent are stored against that named address, and that is a
   contractual relationship rather than a cookie-notice one. The token-gated
   viewer is deliberately not fitted with a banner — putting one in front of a
   document somebody specifically requested is hostile.

   An explicit refusal in the same browser is honoured anyway, so a visitor who
   declined is not tracked here either. In practice that is close to a no-op:
   the viewer is served by the Worker and never inlines the site kernel, so it
   usually carries no glx_consent cookie at all. Kept because "we said we would
   not measure you" should hold everywhere it can. */

import { geo, now } from '../_lib/util.js';
import { consented } from '../_lib/consent.js';

const KINDS = new Set(['page', 'download', 'heartbeat', 'close']);
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

  const token = typeof body.token === 'string' ? body.token.slice(0, 64) : '';
  const kind = String(body.kind || '');
  if (!token || !KINDS.has(kind)) return ok();

  /* An explicit refusal is honoured. No cookie at all is the normal case here
     and does not block the write: the grant itself is the lawful basis. */
  if (/(?:^|;\s*)glx_consent=denied(?:;|$)/.test(request.headers.get('Cookie') || ''))
    return ok();

  const grant = await env.DB
    .prepare('SELECT doc_id, email, revoked, expires_at FROM grants WHERE token = ?1')
    .bind(token)
    .first();
  if (!grant || grant.revoked || grant.expires_at < Date.now()) return ok();

  /* Clamp rather than reject. A machine that sleeps mid-read reports an
     absurd dwell, and one bad number should not cost us the event. */
  const page = Number.isFinite(+body.page) ? Math.max(0, Math.min(9999, Math.round(+body.page))) : null;
  const seconds = Number.isFinite(+body.seconds) ? Math.max(0, Math.min(3600, Math.round(+body.seconds))) : null;

  const g = geo(request);
  try {
    await env.DB
      .prepare(
        `INSERT INTO doc_events (token,doc_id,email,kind,page,seconds,ts,ip,country,city,region,tz,ua)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)`
      )
      .bind(token, grant.doc_id, grant.email, kind, page, seconds, now(),
        g.ip, g.country, g.city, g.region, g.tz, g.ua)
      .run();
  } catch {
    /* Telemetry is best-effort by design. */
  }
  return ok();
}
