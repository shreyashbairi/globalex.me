/* POST /api/admin/login   { password }
   DELETE /api/admin/login  — sign out
   GET /api/admin/login     — is this browser signed in? */

import { mintSession, sessionCookie, clearCookie, passwordOk, validSession } from '../../_lib/auth.js';
import { json, bad } from '../../_lib/util.js';

export async function onRequestPost(ctx) {
  const { request, env } = ctx;

  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Malformed request.');
  }

  if (!env.ADMIN_PASSWORD || !env.ADMIN_SECRET) {
    return bad('The dashboard is not configured. Set ADMIN_PASSWORD and ADMIN_SECRET.', 503);
  }

  if (!(await passwordOk(env, body.password))) {
    /* A fixed delay on failure. It does not stop a determined attacker, but
       it turns online guessing from cheap into impractical. */
    await new Promise((r) => setTimeout(r, 700));
    return bad('Wrong password.', 401);
  }

  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(await mintSession(env)) });
}

export async function onRequestGet(ctx) {
  return json({ ok: true, signedIn: await validSession(ctx.env, ctx.request) });
}

export async function onRequestDelete() {
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });
}
