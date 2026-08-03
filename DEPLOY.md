# globalex.me — deployment

The site is a set of static HTML files plus a small backend. Everything runs on
Cloudflare: Pages serves the HTML, Pages Functions run the API, D1 stores the
data, R2 stores the PDFs. One deploy, one domain, no servers to patch.

---

## Why this stack

**Cloudflare Pages + Functions.** The site was already static, and it stays
static. Functions add an API on the _same origin_, so there is no CORS, no
second service to deploy, and no separate domain to secure. The alternative —
a Node server on a VPS — would mean patching an OS forever to run about 600
lines of request handling.

**Cloudflare's geolocation is why the tracking requirement is cheap.**
Requirement 4 needs the location a document was opened from. Every request
Cloudflare handles arrives with `request.cf.country`, `.city`, `.region` and
`.timezone` already attached. On any other host that is a paid IP-lookup API
with a key and a rate limit. Here it is a property on an object.

**D1** is SQLite at the edge; the whole dataset here is four small tables.
**R2** is object storage with no egress fees, and — critically — no public URL
unless you create one, which is what keeps the PDFs behind the gate.

**Resend** for mail, because it authenticates with one bearer token over
`fetch`. No SMTP, no SDK, nothing that needs a Node runtime.

### Cost

Free tier covers all of it at this business's volume: Pages is unlimited
requests, D1 gives 5 GB and 5 M row reads/day, R2 gives 10 GB. Resend's free
tier is 3,000 emails/month, which is the only line that would ever bind —
their paid tier starts at $20/month for 50,000.

---

## What you need first

1. A Cloudflare account with `globalex.me` on it, and **R2 turned on**. R2 is
   opt-in per account: enable it under **R2 Object Storage** in the dashboard
   before you start. It asks for a payment method even though this site never
   leaves the free tier, and until it is on, step 3 fails with
   `Please enable R2 through the Cloudflare Dashboard [code: 10042]`.
2. A [Resend](https://resend.com) account with `globalex.me` verified as a
   sending domain — that means adding their DKIM and SPF records to DNS.
   Skipping this puts every email in spam.
3. Node 18+ locally.

---

## Setup

### 1. Install and sign in

```bash
npm install
npx wrangler login
```

### 2. Create the database

```bash
npx wrangler d1 create globalex
```

Copy the `database_id` it prints into `wrangler.toml`, replacing
`PASTE_YOUR_D1_DATABASE_ID_HERE`. Then create the tables:

```bash
npx wrangler d1 execute globalex --remote --file=./schema.sql
```

### 3. Create the document bucket

```bash
npx wrangler r2 bucket create globalex-docs
```

**Do not enable public access on this bucket.** The whole gate depends on it
being reachable only through `/f/:token`.

### 4. Upload the PDFs

The source files live in `_docs/`, which is git-ignored and blocked at the
edge — they are never part of a deploy.

```bash
node _src/upload-docs.js
```

This uploads each file under the exact key `_src/docs.js` expects and warns
about any mismatch between the two.

### 5. Deploy

```bash
npm run build          # regenerate the HTML from _src/
npx wrangler pages deploy .
```

Deploying comes _before_ the secrets, because the first deploy is what
creates the Pages project. Run `wrangler pages secret put` any earlier and it
fails with `Project "globalex-me" does not exist`. Accept the project name
`globalex-me` when prompted — it has to match `name` in `wrangler.toml`.

### 6. Set the secrets

```bash
npx wrangler pages secret put RESEND_API_KEY    # from resend.com/api-keys
npx wrangler pages secret put ADMIN_PASSWORD    # your dashboard password
npx wrangler pages secret put ADMIN_SECRET      # 32+ random chars
npx wrangler pages secret put ANALYTICS_SALT    # 32+ random chars, different
```

Generate the two random values with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

`ADMIN_SECRET` signs the dashboard session cookie and `ANALYTICS_SALT` salts
the visitor hash. Changing `ADMIN_SECRET` signs everyone out; changing
`ANALYTICS_SALT` makes today's visitors look new. Neither is an emergency.

Then deploy a second time:

```bash
npx wrangler pages deploy .
```

Secrets apply to _new_ deployments, not to the one already running. Skip this
and the site is live with no mail and no way into the dashboard.

### 7. Point the domain at Pages

Add `globalex.me` to Cloudflare as a site, move the nameservers at the
registrar, then **Compute → Workers & Pages → globalex-me → Custom domains →
Set up a custom domain** for both `globalex.me` and `www`. Cloudflare writes
the DNS records itself; delete any `A`/`CNAME` left over from a previous host
first, or the record will collide.

Before switching nameservers, copy the existing zone. Cloudflare's importer
is best-effort and the records that matter most are the ones nobody notices
until they break: `MX`, the apex `SPF` TXT, and `_dmarc`.

### 8. Verify the domain in Resend

Resend gives you three records: a `TXT` at `resend._domainkey`, and an `MX`
plus `SPF TXT` on a `send` subdomain. Add them by hand rather than granting
the Cloudflare integration write access to the whole zone. Leave **Enable
Receiving** off — inbound mail is not Resend's job here.

None of them touch the apex, so mailboxes on the domain keep working. The one
thing that would break them is a second `v=spf1` record at the apex; if
Resend ever asks for one there, merge `include:_spf.resend.com` into the
existing record instead of adding a new one.

**If DKIM will not verify, look for an `NS` record on `_domainkey`.** A host
that signs your mailbox mail — Infomaniak does this — delegates that whole
subtree to its own nameservers, so `resend._domainkey` resolves to NXDOMAIN
no matter what you put in Cloudflare. Copy the existing selector out of the
old nameserver (`dig TXT mail._domainkey.globalex.me @ns31.infomaniak.com`),
add it to Cloudflare as a plain `TXT`, then delete the delegation.

### 9. Check it end to end

- Open the site, go to **Specifications & resources**, request a document.
- The email should arrive within seconds.
- Open the link. Go to `/admin`, sign in, and confirm the lead appears
  with an open recorded against it.

---

## Working locally

```bash
cp .dev.vars.example .dev.vars     # if you do not already have one
npm run db:local                   # create local tables
node _src/upload-docs.js --local   # seed the local bucket
npm run dev                        # http://localhost:8788
```

`.dev.vars` holds local secrets and is git-ignored. Mail will fail locally
unless you put a real `RESEND_API_KEY` in it — everything else works, and the
site reports the mail failure honestly rather than pretending it sent.

To see the dashboard with data in it, fill the **local** database with
plausible traffic and leads:

```bash
node _src/seed-demo.js > /tmp/seed.sql
npx wrangler d1 execute globalex --local --file=/tmp/seed.sql
```

Then sign in at `http://localhost:8788/admin.html`. Clear it again with:

```bash
npx wrangler d1 execute globalex --local \
  --command "DELETE FROM pageviews; DELETE FROM doc_events; DELETE FROM grants; DELETE FROM leads;"
```

Never run the seeder against `--remote`.

> **Keep `--local` on the clear command too.** Run that `DELETE` against
> `--remote` and it does not just empty the dashboard: every live document
> link dies with it, because the token in someone's inbox is only valid while
> its `grants` row exists. Recipients then see _"This link is not valid"_ —
> which is the missing-row message, not the expiry one, and is the way to tell
> the two apart. There is no undo; the only fix is to issue fresh links from
> **Share a document** in the dashboard.

---

## How the document gate works

```
visitor clicks a document
        │
        ▼
POST /api/request ──► leads row + grants row (32-byte random token)
        │
        ├─► email to the visitor with https://globalex.me/d/<token>
        └─► notification to info@globalex.me
                │
                ▼
GET /d/<token> ──► verify grant, log an "open" with IP + city + country,
        │          render the viewer
        ▼
GET /f/<token> ──► stream the PDF from R2 (never a public URL)
        │
        ▼
POST /api/track ──► page turns, dwell time, downloads
```

**Why a viewer instead of tracking the PDF itself.** A PDF cannot report back
once it leaves the server. It gets opened by a local reader, often offline,
with no callback — and every mainstream reader blocks the remote-image trick
that PDF "tracking pixels" rely on. Commercial tools like DocSend and
PandaDoc solve this the same way: they stop sending the file and send a link
to a page they control. That is what `/d/:token` is. You get open events,
location, repeat opens, per-page dwell time and download events, none of which
an emailed attachment can give you, and it costs nothing per document.

Downloading the original is still allowed — the viewer is a measurement
surface, not a lock. Once someone downloads it, that copy is untracked, and
the dashboard says so by counting downloads separately from opens.

**Links the desk creates.** `POST /api/admin/share` (behind the admin session)
mints the same pair of rows without a visitor filling in the form, so a
document can be handed to a contact directly:

```
Share a document ──► POST /api/admin/share {doc, email?, label?, days, send?}
        │                    │
        │                    └─► leads row (page = "admin-share") + grants row
        ├─► the URL, returned to the dashboard to copy
        └─► optionally, the same email the visitor flow sends
```

A recipient address is optional — leave it blank for a link to paste into a
chat, and the viewer says "controlled link" instead of naming anyone. The
lifetime is chosen per link (7 / 30 / 90 / 365 days) and the email quotes
whichever was picked. Because the rows are ordinary leads and grants, shared
links appear in the Leads table tagged **Shared**, drill down to the same
activity view, export to the same CSV, and revoke with the same button.

---

## The dashboard

`https://globalex.me/admin.html` — password only, no user accounts.

- **Unique visitors / page views / requests / opens** for the selected period
- **Traffic chart**, visitors against views
- **Where from** and **most read pages**
- **Document engagement** — requested, links opened, total opens, downloads,
  total read time per document
- **Share a document** — pick a document, set a lifetime, optionally name a
  recipient, and get a tracked link to copy (or have it emailed for you)
- **Leads** — email, document, timestamp, location, opens, downloads, last
  opened, with **Activity** (every open with city and IP, plus per-page dwell)
  and **Revoke** (kills the link, keeps the history). Links the desk created
  are tagged **Shared**
- **CSV export** for leads, messages and raw activity

Sessions last 12 hours. Everything under `/admin`, `/d/` and `/f/` is
`noindex`.

---

## Analytics: what is and is not collected

The site uses **first-party analytics only** — no Google Analytics, no
advertising trackers, no cookies. Unique visitors are counted with a
daily-rotating one-way hash of IP + user agent + secret + date. The IP itself
is never stored for pageviews, the hash cannot be reversed, and it changes at
midnight, so no one can be followed across days. `DNT: 1` is honoured.

That is deliberate: it is the reason the site needs no cookie banner.

**Document tracking is different and is not anonymous.** It records real IP
addresses against a named email, because that is what the requirement asks
for. This is disclosed twice — in the request form itself and in the
[privacy policy](privacy-policy.html) — and recipients are offered a plain
attachment instead. Keep both of those in place; that disclosure is what makes
the tracking defensible under UAE PDPL and GDPR.

### Optional: add Cloudflare Web Analytics

The built-in dashboard covers the brief. If you also want Cloudflare's own,
turn on **Web Analytics** in the dashboard for `globalex.me` and choose
automatic setup — it injects the beacon at the edge with no code change and no
effect on page weight. It is free and unlimited.

---

## Editing the site

Do not hand-edit the root `.html` files; they are generated.

```bash
node _src/build.js
```

| Path                 | What it is                                              |
| -------------------- | ------------------------------------------------------- |
| `_src/pages/*.js`    | one module per page                                     |
| `_src/kernel-css.js` | the design system                                       |
| `_src/kernel-js.js`  | shared runtime                                          |
| `_src/docs.js`       | the document catalogue — **the single source of truth** |
| `_src/docgate.js`    | the specifications section and the request modal        |
| `_src/admin.js`      | the dashboard                                           |
| `functions/`         | the backend                                             |

Adding a document means adding an entry to `_src/docs.js`, dropping the PDF in
`_docs/` under the same `key`, then `node _src/build.js && node
_src/upload-docs.js`. The build regenerates `functions/_lib/docs.js`, so the
site and the backend cannot disagree about what exists.

---

## Caching

`_headers` at the repo root sets cache lifetimes. There was no cache policy at
all before it, which meant the 8.5 MB and 3.3 MB hero MP4s were re-fetched on
whatever Cloudflare's default happened to be.

| Path | Policy | Why |
|---|---|---|
| `/assets/*` | `max-age=31536000, immutable` | Filenames change when the asset changes, so a year is safe. This is what stops the hero video being re-downloaded. |
| `/sitemap.xml`, `/robots.txt` | `max-age=3600` | Regenerated every build; an hour is short enough. |
| everything else (HTML) | Pages default | `no-store`-ish via `must-revalidate`; the pages are cheap and must not go stale after a deploy. |

**If you change a file under `assets/` without renaming it, the year-long cache
will serve the old one.** Rename it, or purge the cache from the dashboard.

**Never add `_routes.json`.** It is the standard advice for speeding up Pages
Functions and it would silently break this site's security model:
`functions/_middleware.js` returns 404 for `.dev.vars`, `_src/`, `functions/`,
`.md`, `.sql`, `.toml` and every `.pdf` outside `/f/`, and that protection
exists *only because the middleware runs on every request*. Adding
`_routes.json` would re-expose `.dev.vars`, which is the bug commit `2751044`
fixed. `_headers` does not have this problem.

## Analytics and consent

Nothing is measured until a visitor accepts. `_src/consent.js` owns the only
code path to the network: `kernel-js.js` pushes a page view onto `window.glxQ`
and never sends it, so if the consent script is missing for any reason nothing
is sent at all — fail-closed by construction rather than by a conditional.

`functions/api/pv.js` and `functions/api/track.js` also check the
`glx_consent` cookie server-side and refuse unconsented writes. Client-side
gating alone is not a control: anyone can POST to the endpoint directly.

The `ANALYTICS_SALT` daily-hash visitor identification applies **on top of**
consent, not instead of it. An accepted visitor is still only ever a rotating
daily hash, never a stored IP address.

Two things in `privacy-policy.html` are still marked as unconfirmed and need
answering: the **retention period** for page-view and document-event rows, and
the **data-protection contact** for subject-access requests. Both are stated on
the page as pending rather than omitted.

To verify the gate after a deploy: open the site in a private window, watch the
network panel, and confirm nothing hits `/api/pv` before you choose. Decline,
reload, and confirm it stays that way.

## Switching gated content on

`_src/flags.js` is the one place. Each entry names the data it is waiting on.
Flip a value to `true`, run `npm run build`, commit the regenerated HTML and
deploy.

`npm run build` fails if a page flag is on for a page that does not exist, and
removes the HTML of any page whose flag is off — so switching something off
actually un-publishes it rather than leaving the last build's file in place.

## Things worth knowing

- **The PDFs are blocked at the edge.** `functions/_middleware.js` returns 404
  for any `.pdf` path that is not under `/f/`, so a file accidentally
  committed to the repo still cannot bypass lead capture.
- **So is everything else that is not the site.** `pages_build_output_dir` is
  `.`, which means Pages serves the repository root — `.dev.vars` included,
  and that file holds every secret. `.gitignore` does not apply to uploads.
  Two things stop it: `.assetsignore` keeps the files out of the deploy, and
  `isPrivate()` in the middleware 404s them anyway. Adding a config file,
  a `.md`, or anything under `_src/` needs no further thought, but adding a
  new _kind_ of private file means checking it against that function.
- **Mail failures answer 424, not 502.** Cloudflare replaces the body of any
  5xx a Pages Function returns with its own error page, so the honest "we
  saved your request but could not send the email" JSON never reached the
  browser and the modal died on `Unexpected token '<'`. Any handler that
  needs to report an upstream failure to the visitor has to do it with a
  4xx.
- **The forms degrade.** If the API is unreachable — including when a page is
  opened straight off disk — the contact, careers and document forms fall back
  to the visitor's mail client rather than failing silently. The site still
  works as standalone files.
- **Rate limit.** Six document requests per hour per IP.
- **Link lifetime.** 30 days, then the link 410s. Change `GRANT_TTL` in
  `functions/api/request.js`.
- **Your PDFs say "GLOBALEX TRADING FZCO"** while the site says "Globalex
  Trading FZCO". Worth reconciling before these go out to counterparties.
