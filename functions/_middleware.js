/* Runs before every Function and every static asset Pages serves.

   Two jobs: security headers on HTML, and keeping the admin surface out of
   search engines. The CSP is deliberately explicit about the handful of
   third parties the site uses — Google Fonts, the two CDN libraries, and
   the Maps embed on the contact page. Anything else is refused. */

const CSP = [
  "default-src 'self'",
  // The site is one self-contained file per page, so styles and scripts are
  // inline by design; that is what 'unsafe-inline' is buying here.
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  /* pdf.js pulls its worker cross-origin and re-wraps it as a blob. Without
     this it silently falls back to rendering on the main thread, which
     locks up the viewer on a large sheet. */
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-src https://maps.google.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/* Pages serves every file in the output directory, and the output directory
   is the repository root. Anything in here that is not part of the site is a
   public URL unless it is denied — .dev.vars included, which is how the
   secrets were once readable at https://globalex.me/.dev.vars. Deny by path,
   in one place, rather than trusting the upload to leave things out. */
const PRIVATE_DIRS = ['/_docs/', '/_src/', '/functions/', '/node_modules/'];
const PRIVATE_EXTS = ['.md', '.sql', '.toml', '.lock', '.log'];
const PRIVATE_FILES = new Set(['/package.json', '/package-lock.json']);

function isPrivate(path) {
  const p = path.toLowerCase();
  /* Dotfiles as a class: .dev.vars, .gitignore, .wrangler/. The ACME and
     well-known carve-out stays open so certificate and app-association
     lookups keep working. */
  if (p.startsWith('/.') && !p.startsWith('/.well-known/')) return true;
  if (PRIVATE_FILES.has(p)) return true;
  if (PRIVATE_DIRS.some((d) => p.startsWith(d))) return true;
  if (PRIVATE_EXTS.some((e) => p.endsWith(e))) return true;
  /* Only /f/:token may hand out a PDF, so a file accidentally committed to
     the repo still cannot bypass lead capture. */
  return p.endsWith('.pdf') && !p.startsWith('/f/');
}

export async function onRequest(ctx) {
  const path = new URL(ctx.request.url).pathname;

  if (isPrivate(path)) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  const res = await ctx.next();
  const type = res.headers.get('Content-Type') || '';
  if (!type.includes('text/html')) return res;


  const out = new Response(res.body, res);
  out.headers.set('Content-Security-Policy', CSP);
  out.headers.set('X-Content-Type-Options', 'nosniff');
  out.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  out.headers.set('X-Frame-Options', 'DENY');
  out.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=()');
  out.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  if (path.startsWith('/admin') || path.startsWith('/d/') || path.startsWith('/f/')) {
    out.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  return out;
}
