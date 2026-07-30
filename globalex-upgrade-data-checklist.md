# Globalex Site Upgrade — Data You Need to Provide

Companion to [globalex-upgrade-prompt.md](globalex-upgrade-prompt.md). Every item below is
something the code cannot invent. Items marked **BLOCKING** stop a page from being
publishable (the phase can still be *built*, it just ships behind the `DRAFT` banner from
§0.6 until the data lands). Items marked **DECISION** need a choice from you, not research.

Anything already in the repo is marked ✅ HAVE with its source, so you don't re-supply it.

---

## Phase 0–1 — Build pipeline & SEO foundation

Small ask. Mostly confirmations, and it unblocks everything else.

| # | Item | Status |
|---|---|---|
| 1.1 | Production canonical origin — `https://globalex.me` (apex) vs `https://www.globalex.me`. Pick one; the other must 301. | **DECISION** |
| 1.2 | Legal name for `Organization` JSON-LD: `Globalex Trading FZCO` | ✅ HAVE (shell.js) |
| 1.3 | Postal address: 2605 X3 Tower, Cluster X, Jumeirah Lakes Towers, 337622 Dubai, AE | ✅ HAVE ([_src/shell.js:156](_src/shell.js#L156)) |
| 1.4 | **Is `337622` a PO Box or a postal code?** It maps to different JSON-LD fields (`postOfficeBoxNumber` vs `postalCode`). Getting this wrong is a schema error Google flags. | **DECISION** |
| 1.5 | Phone `+971 4 566 7713`, email `info@globalex.me`, LinkedIn company URL | ✅ HAVE |
| 1.6 | `foundingDate` — brief says `2019`. Supply the **exact incorporation date** (YYYY-MM-DD) if you want it precise, else it stays year-only. | non-blocking |
| 1.7 | Any additional `sameAs` profiles — X/Twitter, Instagram, Facebook, Crunchbase, trade directory listings. Currently LinkedIn only. | **DECISION** (list or "LinkedIn only") |
| 1.8 | Logo for JSON-LD `logo` + OG plate: a **square** raster ≥ 512×512 PNG, or the logo as SVG paths. `assets/logo.webp` is the only asset present and I don't know its aspect ratio/transparency. | **BLOCKING** for OG image quality |
| 1.9 | OG tagline — brief proposes "The Caspian corridor, operated from Dubai." Approve or replace. This string ships on every social share card. | **DECISION** |
| 1.10 | Twitter/X handle for `twitter:site` (omit the tag if none) | **DECISION** |

---

## Phase 2 — Grouped mega-menus

No new facts needed — this is IA and copy. But the menu rows need one-line descriptors
(`<small>`) or they'll read as bare links.

| # | Item | Status |
|---|---|---|
| 2.1 | Approve the 4-item IA and its ordering: `COMPANY · PRODUCTS · TRADE · SUSTAINABILITY` | **DECISION** |
| 2.2 | A ~6–10 word descriptor for each of these 9 menu rows: **About, Leadership, Locations, News, Careers, Trade Procedures, Logistics & Shipping, Compliance & Certifications, All products**. I can draft them from existing page copy for your edit — say the word. | **DECISION** (or delegate) |
| 2.3 | Industrial chemicals column shows "first 8, then +8 more". **Which 8?** Catalogue order gives Sulphur, Urea-A, Caustic Soda, Sodium Hypochlorite, Hydrochloric Acid, Liquid Chlorine, Calcium Chloride, Sodium Sulphate — which drops LABSA, SLES and Sulphuric Acid from the menu. Supply a commercial priority order (highest-volume / highest-margin first) or confirm catalogue order is fine. | **DECISION** |
| 2.4 | Footer column assignment: News + Locations → Company; Logistics + Compliance → Trade. Confirm. | **DECISION** |

---

## Phase 3 — Product depth (the largest data ask by far)

### 3.1 Per-grade specification data — 24 grades

This is the critical path for the whole brief. For **each** of the 24 grades below I need
the five blocks. Send it however is easiest — one spreadsheet with a tab or row-block per
grade is ideal; scanned supplier TDS/COA sheets are also fine and I'll transcribe.

**Blocks required per grade:**

1. **Typical analysis** — one row per parameter: `parameter · typical · min · max · unit · test method`
   (e.g. `Nitrogen (N) · 46.2 · 46.0 · — · % · ISO 5378`). The **test method** matters —
   a spec figure with no method behind it isn't a spec, and buyers' QC teams check it.
2. **Physical** — form, colour, bulk density (kg/m³), granulometry/particle size (mm).
   For liquids instead: concentration %, density @20 °C, freezing/pour point, appearance.
3. **Packaging actually offered** for that grade (from the controlled vocabulary in 3.3).
4. **Trade terms** — HS code (8-digit as declared at Dubai Customs), load ports,
   Incoterms you'll quote, minimum lot in MT.
5. **Storage & handling note** — one or two sentences.

**The 24 grades:**

*Fertilizers (5):* `urea-b-n46` · `potash` · `ammonia` · `ammonium-nitrate` · `npk-compound`

*Polymers (3):* `polyethylene` · `polypropylene` · `performance-additives`
→ These are **families, not grades** (Polyethylene covers LDPE/HDPE/LLDPE/UHMWPE). A single
analysis table can't describe all four. **DECISION:** either (a) supply one representative
grade's spec per family and label it as such, or (b) supply a per-sub-grade table and I'll
render a grade-selector on the page.

*Industrial chemicals (16):* `sulphur` · `urea-a-technical` · `caustic-soda` ·
`sodium-hypochlorite` · `hydrochloric-acid` · `liquid-chlorine` · `calcium-chloride` ·
`sodium-sulphate` · `labsa` · `sles` · `sulphuric-acid` · `formic-acid` · `acetex-plus` ·
`aluminium-sulphate` · `iodine` · `carbon-black`

> `acetex-plus` reads as a trade name rather than a chemical. I need its actual composition
> and CAS number(s) to write anything defensible about it.

**Status: BLOCKING for all 24 product pages.** Per §0.6 I will not invent an assay figure.
Without this, 24 pages build with `[--]` placeholders and a draft banner.

**Partial delivery is genuinely useful** — a grade with real data loses its banner
independently of the others. If the full set is far off, send the top 5 by volume first.

### 3.2 Catalogue gaps that block the filter bar

| # | Item | Status |
|---|---|---|
| 3.2a | **12 of 16 industrial chemicals have no `origins` array**: caustic-soda, sodium-hypochlorite, hydrochloric-acid, liquid-chlorine, calcium-chloride, sodium-sulphate, labsa, sles, sulphuric-acid, formic-acid, acetex-plus, aluminium-sulphate. They will be invisible under every Origin filter. | **BLOCKING** for the Origin facet |
| 3.2b | **Sector tags missing on all 5 fertilizers and all 3 polymers.** Only the 16 chemicals carry `t:` tags. Map each of the 8 to one or more of: `water` (Water treatment), `mfg` (Manufacturing), `care` (Detergents & care), `agri` (Agriculture & energy). | **BLOCKING** for the Sector facet |
| 3.2c | The Origin facet list in the brief is Turkmenistan / Uzbekistan / Kazakhstan / Azerbaijan / UAE / Saudi Arabia / China. Confirm that's the complete origin set, and whether trans-shipment origins should appear. | **DECISION** |

### 3.3 Controlled vocabularies (needed so filters and specs can't drift)

| # | Item | Status |
|---|---|---|
| 3.3a | **Form vocabulary** — brief proposes Prilled / Granular / Liquid / Solid / Bulk. Your catalogue copy also uses Lump, Flake, Powder, Anhydrous, Aqueous, Prilled. Give me the canonical closed list; "Bulk" is arguably packaging, not form. | **DECISION** |
| 3.3b | **Packaging vocabulary** — Bulk / big bag 1,000 kg / PP bag 50 kg / IBC / ISO tank / drum? Include exact nominal weights, since Phase 4.4 renders this list too. | **DECISION** |
| 3.3c | **Incoterms you actually quote** — brief assumes FOB / CFR / CIF / DAP / EXW. Confirm; add or remove. | **DECISION** |
| 3.3d | Contact form commodity-class options must match the pre-fill from product pages. Confirm the current select options are the three classes. | non-blocking |

### 3.4 Flag — documents don't line up with the catalogue

The gated register holds 5 documents: three **Base Oil MSDS** (SN-180/350/600), a **Base
Oil TDS** (full range), and a **Polypropylene SPEC** (Turkmenplen).

- Base oils are **not a catalogue grade at all** — so 4 of your 5 real documents attach to
  nothing, and no product page can surface them.
- Only `polypropylene` gets an inline document row. The other 23 grades get the
  "request specification" CTA.

**DECISION:** should base oils become a fourth product line (or a grade under Industrials)?
You have real, verified spec data for them — which makes them the *only* product page that
could ship without a draft banner today. Worth considering as the pilot page.

---

## Phase 4 — New pages

### 4.1 Newsroom (`news.html`)

| # | Item | Status |
|---|---|---|
| 4.1a | **3 posts minimum** for the layout to make sense (1 feature + 2 list rows). Per post: ISO date, kind (`Market note` / `Corridor` / `Company` / `Product`), headline, one-paragraph standfirst, body, tags. | **BLOCKING** |
| 4.1b | **Author attribution** — company byline ("Globalex Trading desk") or named authors? `NewsArticle` JSON-LD needs an `author`, and a named author needs that person's consent. | **DECISION** |
| 4.1c | Publishing cadence and who writes the posts — determines whether this page is worth shipping at all. An empty newsroom is worse than no newsroom. | **DECISION** |
| 4.1d | Optional per-post hero image. Not in the brief; say if you want it. | non-blocking |

### 4.2 Locations (`locations.html`)

| # | Item | Status |
|---|---|---|
| 4.2a | Dubai HQ — address, phone, email, coords 25.0693°N 55.1413°E, Maps embed | ✅ HAVE ([_src/pages/contact.js:79](_src/pages/contact.js#L79)) |
| 4.2b | **Do any non-Dubai offices, origin desks or representatives actually exist?** If no — this page is one real card and three tabs with nothing in them, and I'd recommend deferring it or folding it into `contact.html`. If yes, per location: region, city, country, kind (`HQ`/`Origin desk`/`Representative`), full address, phone, email, lat/lon, one-line note. | **BLOCKING — answer determines whether the page is built at all** |
| 4.2c | Regional tab grouping — Middle East / Central Asia / Caspian. Confirm which countries fall in which, especially Kazakhstan (Central Asia vs Caspian) and Azerbaijan (Caspian vs neither). | **DECISION** |

### 4.3 Compliance & Certifications (`compliance.html`)

Every number here is a legal-liability item. All **BLOCKING**, all need sign-off from
whoever holds the licences.

| # | Item | Status |
|---|---|---|
| 4.3a | **FZCO trade licence** — number, issuing authority (DMCC? DAFZA? which freezone), activity scope as licensed, expiry/validity | **BLOCKING** |
| 4.3b | **Dubai Customs** — registration/importer-exporter code | **BLOCKING** |
| 4.3c | **Dubai Chambers** — membership number and category | **BLOCKING** |
| 4.3d | **VAT TRN** — include on the site or not? | **DECISION** |
| 4.3e | **KYC onboarding pack** — the actual documents you require from a counterparty, in order | **BLOCKING** |
| 4.3f | **Sanctions screening** — which lists (OFAC SDN / EU consolidated / UN / UK HMT), which tool or provider, screening frequency, who signs off a hit | **BLOCKING** |
| 4.3g | **UBO verification** — threshold used (25%?) and evidence accepted | **BLOCKING** |
| 4.3h | **Inspection agencies actually contracted** — SGS, Intertek, Bureau Veritas: which ones do you have arrangements with? Naming an agency you don't use is a misrepresentation. | **BLOCKING** |
| 4.3i | **Anti-bribery & ethics** — approved policy statement text, and the channel for raising a concern (dedicated email? phone? named officer?) | **BLOCKING** |
| 4.3j | **Sanctions & trade controls position** — your stated position on restricted destinations and end-use. This paragraph needs legal review before it goes public; it will be quoted back at you. | **BLOCKING + legal sign-off** |
| 4.3k | **"Compliance pack"** (the CTA target) — does this document exist? If yes, supply the PDF and it becomes a gated register entry; if no, the CTA becomes a contact form route. | **DECISION** |
| 4.3l | Any ISO certifications (9001/14001/45001) — certificate numbers and certifying body, or confirm none | **DECISION** |

### 4.4 Logistics & Shipping (`logistics.html`)

| # | Item | Status |
|---|---|---|
| 4.4a | **Per port — Turkmenbashi, Aktau, Baku, Jebel Ali:** max draft (m), berths available to you, typical load rate (MT/day), rail and road connection, onward routing options. | **BLOCKING** for the ports section |
| 4.4b | **Transit-time matrix** — I need both axes. Which **destinations** do you quote (Jebel Ali? Mundra? Karachi? Chittagong? Mersin? Novorossiysk?), and indicative transit days per origin→destination pair. | **BLOCKING** |
| 4.4c | **Modes offered** — break bulk, containerised, ISO tank, big bag, bulk vessel. Confirm you do all five; remove any you don't. | **DECISION** |
| 4.4d | **Documentation set** — bill of lading, certificate of origin, COA, packing list, insurance certificate, phytosanitary. Confirm the list and note **which grades require phytosanitary** (fertilizers only?). | **DECISION** |
| 4.4e | Incoterms matrix (who bears carriage/insurance/clearance/risk transfer) — these are Incoterms 2020 facts, no input needed beyond 3.3c. Confirm the **2020** revision. | ✅ derivable |

---

## Phase 5 — About: leadership & timeline

### 5.1 Leadership

| # | Item | Status |
|---|---|---|
| 5.1a | For each person: full name, role title, location, 40–60 word bio, LinkedIn URL, display order. | **BLOCKING** |
| 5.1b | **Written consent from each individual** to publish their name, role and bio. Non-negotiable — this is personal data on a public site under UAE PDPL. | **BLOCKING** |
| 5.1c | **Photographs** — supply portrait photos (min 800×1000, consistent lighting, plain background works best with the greyscale + palette-blend treatment), or approve the generated geometric avatar instead. I will not use stock photos of strangers as your executives. | **DECISION** |
| 5.1d | **Team size figure** for the About hero `ph-meta` — headcount, and as of when. | **BLOCKING** for that meta row |
| 5.1e | How many people go on the page at all? A 3-across grid with two cards looks unfinished; with one it looks like a mistake. | **DECISION** |

### 5.2 Timeline

Five entries, each needs a **verifiable year** (or it ships as a placeholder):

| # | Item | Status |
|---|---|---|
| 5.2a | **2019 — Founded.** Confirm the freezone authority name and the licence issue date. | **BLOCKING** |
| 5.2b | **First Caspian corridor shipment** — which year, which grade, which origin→destination? | **BLOCKING** |
| 5.2c | **Polymer book opened** — which year? | **BLOCKING** |
| 5.2d | **Industrial chemicals reached 16 grades** — which year? | **BLOCKING** |
| 5.2e | **Today** — "24 grades, 7 origin markets". The 24 matches the catalogue ✅. Confirm the origin count is 7 (catalogue shows Turkmenistan, Uzbekistan, Kazakhstan, Azerbaijan, UAE, Saudi Arabia, China = 7 ✅). | ✅ HAVE, confirm |
| 5.2f | Any additional milestone worth a node (first LC-backed deal, first 10,000 MT cargo, office move, key certification) | non-blocking |

---

## Phase 6 — Sustainability: ESG metrics

### 6.1 KPI band — 4 to 6 figures

For each: the **number**, the **unit**, the **reporting period**, and the **source** you'd
cite if challenged. Where a metric isn't tracked yet, say so explicitly — it renders as `—`
with a "Tracking from 2026" caption, which reads better than a round invention.

| # | Metric | Status |
|---|---|---|
| 6.1a | Verified tonnage handled (MT, period) | **BLOCKING** or mark untracked |
| 6.1b | Origin audits completed (count, period) | **BLOCKING** or mark untracked |
| 6.1c | Suppliers screened (count, period) | **BLOCKING** or mark untracked |
| 6.1d | Shipments third-party inspected (count or %, period) | **BLOCKING** or mark untracked |
| 6.1e | Documentation digitised (%, period) | **BLOCKING** or mark untracked |
| 6.1f | Which of the above are genuinely tracked today, and from what date tracking begins for the rest | **DECISION** |

### 6.2 Commitment detail — 3 fields × 6 commitments = 18 items

Your six existing commitments (from [_src/pages/sustainability.js](_src/pages/sustainability.js)),
each needing a **measurable target**, a **current status**, and the **operational practice**
behind it:

1. Environmental stewardship *(Environment)*
2. Ethical sourcing and fair trade *(Sourcing)*
3. Product quality and durability *(Quality)*
4. Collaboration and transparency *(Transparency)*
5. Social impact *(Community)*
6. Continuous improvement *(Innovation)*

**Status: BLOCKING.** The current copy is aspiration; the phase exists to add measurement.
Without targets the accordions have nothing inside them and the page is better left as-is.

### 6.3 Gated ESG report

| # | Item | Status |
|---|---|---|
| 6.3a | Does `esg-report-2026.pdf` exist? If yes: the PDF file, its page count, and a 1–2 sentence summary for the register row. | **BLOCKING** — until the R2 object exists the register row stays hidden by design |
| 6.3b | Report period and title — "Annual · 2026" per the brief. Confirm. | **DECISION** |

---

## Phase 7 — Hero video

| # | Item | Status |
|---|---|---|
| 7.1a | **What does the footage actually depict?** The brief permits it only on pages whose subject it honestly matches (`logistics`, `locations`, `about`). If it's a Dubai skyline drone shot, it fits `about`/`locations` and *not* `logistics`. I need a description or a viewing. | **BLOCKING** |
| 7.1b | **Licence / provenance** — is this footage owned, or stock under licence? If stock, the licence terms (web use, perpetuity) and whether attribution is required. Unlicensed footage on a corporate site is a real exposure. | **BLOCKING** |
| 7.1c | **The mute toggle in §7.2 is moot as things stand — `assets/hero-1080.mp4` has no audio track** (video stream only, 1920×1080 h264). Either supply footage with usable audio, or I drop the toggle. Shipping a mute button that controls silence is worse than shipping none. | **DECISION** |
| 7.1d | A one-line alt/description of the footage for the poster's accessible name | non-blocking |

---

## Phase 8 — Cookie consent & tracking gate

This phase closes a **live compliance gap** — `/api/pv` fires on every page load today with
no consent UI, while `privacy-policy.html` is published. The engineering doesn't need your
input; the disclosures do.

| # | Item | Status |
|---|---|---|
| 8.1a | **Which regime does the policy claim?** UAE PDPL, GDPR, both. Determines the legal basis wording and whether "Decline" must be as prominent as "Accept" (under GDPR it must — the brief already assumes this). | **DECISION** |
| 8.1b | **Privacy contact** — email address for data-subject requests, and a named DPO/officer if one is appointed. Currently the policy has no route for a request. | **BLOCKING** |
| 8.1c | **Retention periods** — how long `/api/pv` page-view rows and `/api/track` event rows are kept in D1 before deletion. The cookie table needs a duration and "indefinitely" is not an acceptable answer. | **BLOCKING** |
| 8.1d | **Processor disclosure** — the policy should name who processes the data: Cloudflare (hosting, D1, R2) and Resend (email delivery). Confirm there are no others, and whether you want them named individually or described by category. | **DECISION** |
| 8.1e | Cookie table content. Known cookies: `glx_consent` (new, 12 months, consent state) and `glx_admin` (session, staff-only, essential — [functions/_lib/auth.js:10](functions/_lib/auth.js#L10)). Plus the `ANALYTICS_SALT` daily visitor hash, which is **not** a cookie and should be described as such. Confirm nothing else is set. | ✅ derivable, confirm |
| 8.1f | **Consent banner copy** — one plain sentence, no dark patterns. I'll draft it; it needs your sign-off before it ships since it's a legal disclosure. | **DECISION** (or delegate + review) |
| 8.1g | Approve that declining analytics leaves the site fully functional (it does — nothing depends on the beacons). | ✅ confirm |

---

## The shortest path to something publishable

If you want to send one batch first, send this — it unblocks the most surface area per item:

1. **Item 1.4 + 1.8** (PO Box vs postal code, square logo) — unblocks Phase 1 entirely, ~10 minutes.
2. **Items 3.2a + 3.2b** (origins for 12 chemicals, sector tags for 8 grades) — unblocks the whole Phase 3 filter bar without needing a single assay figure.
3. **Spec data for your top 5 grades by volume** (§3.1) — proves the product-page template on real data and gives you 5 banner-free pages.
4. **The 5 timeline years** (§5.2) — cheap, entirely from your own records, and finishes half of Phase 5.
5. **Items 8.1b + 8.1c** (privacy contact, retention periods) — closes the live compliance gap, which is the only item here that is currently a *risk* rather than a *gap*.

## Phases that are fully buildable with zero input from you

- **Phase 1** except the two items above
- **Phase 2** (I can draft the descriptors for your edit)
- **Phase 3.3 filter/compare mechanics** — the machinery works on placeholder specs
- **Phase 4.4 Incoterms matrix** — standard terms, no company data
- **Phase 8** engineering — the gate, the queue, the server-side rejection, the banner

## Decisions where I'd recommend deferring the page rather than shipping placeholders

- **`locations.html`** if Dubai is the only real office (§4.2b) — three empty tabs advertise absence.
- **`news.html`** if there's no writer and no cadence (§4.1c) — a stale feed dates the site.
- **Phase 6.2** if the six commitments have no targets yet (§6.2) — empty accordions are a downgrade from the current clean prose.
