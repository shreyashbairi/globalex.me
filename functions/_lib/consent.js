/* Server-side consent check.

   Client-side gating alone is not a control: anyone can POST to /api/pv
   directly, and a bug in the page script would silently start collecting
   again. The endpoints refuse unconsented writes themselves.

   Absent cookie means no decision has been made, which is NOT consent. */
export function consented(request) {
  const cookie = request.headers.get('Cookie') || '';
  return /(?:^|;\s*)glx_consent=granted(?:;|$)/.test(cookie);
}
