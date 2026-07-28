/* Admin session handling.

   A signed cookie rather than a session table: the dashboard has one
   operator, so there is nothing to look up. The cookie carries its own
   expiry and an HMAC over it, both verified on every admin request, so
   a stolen-but-expired cookie is worthless and D1 is never touched. */

import { b64url } from './util.js';

const COOKIE = 'glx_admin';
const TTL = 12 * 60 * 60 * 1000; // 12h — one working day, then re-auth

async function key(env) {
  if (!env.ADMIN_SECRET) throw new Error('ADMIN_SECRET is not configured');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.ADMIN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function sign(env, payload) {
  const mac = await crypto.subtle.sign('HMAC', await key(env), new TextEncoder().encode(payload));
  return b64url(new Uint8Array(mac));
}

export async function mintSession(env) {
  const exp = Date.now() + TTL;
  const nonce = b64url(crypto.getRandomValues(new Uint8Array(8)));
  const payload = `${exp}.${nonce}`;
  return `${payload}.${await sign(env, payload)}`;
}

export async function validSession(env, request) {
  const raw = (request.headers.get('Cookie') || '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;

  const value = raw.slice(COOKIE.length + 1);
  const parts = value.split('.');
  if (parts.length !== 3) return false;

  const [exp, nonce, mac] = parts;
  if (!Number(exp) || Number(exp) < Date.now()) return false;

  const expected = await sign(env, `${exp}.${nonce}`);
  return timingSafeEqual(mac, expected);
}

/* Compare in constant time. The window is tiny here, but a length-and-
   short-circuit compare on a MAC is the kind of thing that should never
   be written the naive way. */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function sessionCookie(value, maxAge = TTL / 1000) {
  return `${COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

export const clearCookie = () => sessionCookie('', 0);

/* Password check, also constant time. The password lives in a Pages secret,
   never in the repo. */
export async function passwordOk(env, given) {
  if (!env.ADMIN_PASSWORD || typeof given !== 'string') return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(given)),
    crypto.subtle.digest('SHA-256', enc.encode(env.ADMIN_PASSWORD)),
  ]);
  return timingSafeEqual(b64url(new Uint8Array(a)), b64url(new Uint8Array(b)));
}

/* Wrap an admin handler so the auth check can never be forgotten. */
export function requireAdmin(handler) {
  return async (ctx) => {
    if (!(await validSession(ctx.env, ctx.request))) {
      return new Response(JSON.stringify({ ok: false, error: 'Not authorised' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }
    return handler(ctx);
  };
}
