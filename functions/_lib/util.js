/* Shared helpers for every Function. Nothing here touches storage. */

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

export const bad = (message, status = 400) => json({ ok: false, error: message }, status);

/* Cloudflare attaches geo to every request, so location needs no third-party
   lookup and no API key — it is already on the object we were handed. */
export function geo(request) {
  const cf = request.cf || {};
  return {
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: cf.country || '',
    city: cf.city || '',
    region: cf.region || '',
    tz: cf.timezone || '',
    ua: (request.headers.get('User-Agent') || '').slice(0, 400),
  };
}

/* 24 random bytes, base64url. Long enough that guessing a live grant is not
   a realistic attack even with unlimited attempts. */
export function mintToken() {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return b64url(b);
}

export function b64url(bytes) {
  let s = '';
  for (const byte of bytes) s += String.fromCharCode(byte);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return b64url(new Uint8Array(buf));
}

/* Email validation deliberately stops at shape. Anything stricter rejects
   valid addresses; whether it delivers is the mail provider's problem. */
export const isEmail = (s) =>
  typeof s === 'string' && s.length < 255 && /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(s);

/* Strip control characters. They serve no purpose in a name or company field
   and are the injection vector for the mail we build from these values. */
export const clean = (s, max = 200) =>
  typeof s === 'string'
    ? s.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, max)
    : '';

/* Escape before interpolating anything user-supplied into an HTML email or
   the admin dashboard. Lead names arrive from a public form. */
export const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const now = () => Date.now();
export const DAY = 86400000;

/* Coarse bucket only — enough to answer "mobile or desktop" without
   fingerprinting. */
export function device(ua) {
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  return 'desktop';
}

/* Fixed-window limiter backed by D1. Not perfectly precise under concurrency,
   which is fine — it exists to stop a script hammering the mail API, not to
   meter a paid quota. */
export async function rateLimited(db, key, limit, windowMs) {
  const since = Date.now() - windowMs;
  const row = await db
    .prepare('SELECT COUNT(*) AS n FROM leads WHERE ip = ?1 AND created_at > ?2')
    .bind(key, since)
    .first();
  return (row?.n || 0) >= limit;
}
