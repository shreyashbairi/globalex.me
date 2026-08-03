# Product imagery — generation brief

> **Status.** All 32 grades are shot and encoded. They arrived in two
> deliveries — classes 01–03 at 2752x1536, class 04 (petroleum) at 2528x1696 —
> so `images-build.js` centre-crops any master that will not resize onto
> 1600x894 before encoding it. Every "24" in the rest of this file describes
> the first delivery; the system it specifies is unchanged.
>
> A grade added to the catalogue before its photography exists can carry
> `photo:false` and be served a generated stand-in plate by
> `npm run placeholders`, at the same two paths. Clear the flag and run
> `npm run images` when the master lands.

> **The expanded, ready-to-paste prompts are in
> [`product-images-prompts.md`](./product-images-prompts.md).** This file is
> the reasoning behind them. Neither is written by hand — both the master
> prompt and the per-grade material descriptions live in
> `product-images-build.js`; `npm run prompts` expands them against the product
> list in `catalogue.js`. Edit that script, not the generated markdown.

The site ships **no photography today**. Every visual is procedural: canvas
ornament fields, the WebGL globe, the specimen plate. That is a real
constraint on this brief, not a detail — a stock-looking product shot dropped
into that system will read as borrowed, and the whole set will look bought
rather than made.

So the images are specified as **one photographic system, run 24 times**: same
camera position, same light, same ground, same crop, same grade. Only the
material changes. Shot that way the set behaves like the rest of the site —
a register of specimens recorded under identical conditions — and it survives
the desaturation the stylesheet is going to apply to it anyway.

---

## 1. The master prompt

**It is not reproduced here.** It lives in `product-images-build.js` and is
expanded into all 24 blocks by `npm run prompts`; a second copy in this file
would be the same drift the generator exists to prevent, and within one edit it
was already wrong. Read it there, or read any block in
`product-images-prompts.md` — they are byte-identical apart from the opening
sentence and the exclusion tail.

What it is made of:

- **Six fixed paragraphs** — CAMERA, GROUND, LIGHT, COMPOSITION, COLOUR, MOOD.
  Identical in every frame. This is the part that makes 24 images a set.
- **One opening sentence** — the grade name and its `{{MATERIAL}}` description
  from §4. That table does the real work, because a prilled solid, a liquefied
  gas and a viscous surfactant cannot share a description.
- **An optional TONE clause** — only on the two grades that need it (§5).
- **An exclusion tail** — see below.

### Exclusions

Folded into the *positive* prompt as prose, because the current generation of
tools (GPT-image, Imagen, Flux) has no negative field at all. A separate
negative list is still emitted in §2 of the prompts file for tools that do.

They split three ways, because a single list contradicts itself:

| Form | Count | Vessel | The tail must not ban |
|---|---|---|---|
| `solid` | 15 | none — material on bare paper | — |
| `liquid` | 7 | wide shallow clear dish | glassware |
| `sealed` | 2 | thick-walled sealed ampoule | glassware, and it *must* ban metal hardware |

A liquid frame told "no glassware" loses the dish it needs. A sealed frame told
the same loses the ampoule. And a sealed frame that does **not** explicitly ban
valves and gauges gets a photograph of a valve — see §6.

---

## 2. Why top-down

It is the one camera position that survives twenty-four different physical
forms. A three-quarter view has to solve a new composition for every material
and the set stops matching after about six.

It also matches what the site already is. The ledger, the document register,
the spec tables and the notched panels are all plan-view, flat, and gridded.
A flat lay drops into that; a moody angled hero does not.

And it desaturates well, which matters — see §5.

---

## 3. Output specs

| Use | Slot | Ratio | Generate at |
|---|---|---|---|
| Class card visual | `.cls-vis` | **16:10** | 2048 × 1280 |
| Product page plate | product hero | 4:3 | 2048 × 1536 |
| Products-page tile | grid tile | 1:1 | 1600 × 1600 |

Generate the **16:10 master** and crop down. The centre-55% rule in the prompt
exists precisely so a 1:1 and a 4:3 crop can both be taken from the same file
without recomposing.

Ship as WebP, 1600px on the long edge, quality ~78, target under 120 KB.
Name by catalogue id so the mapping is derivable rather than hand-maintained:

```
assets/products/fertilizers-urea-b-n46.webp
assets/products/industrials-carbon-black.webp
assets/products/polymers-polypropylene.webp
```

Those ids come from `catalogue.js` (`slug(name)` prefixed by class), so a
rename that changes the URL changes the expected filename with it.

---

## 4. The `{{MATERIAL}}` table

Physically accurate — a buyer's QA team will look at these, and a urea prill
that renders as a pink crystal is worse than no image.

### Fertilizers

| Product | `{{MATERIAL}}` |
|---|---|
| **Urea B (N46)** | A low, loose heap of uniform white spherical prills, 2–4 mm across, matte and very slightly translucent, with a scatter of individual prills that have rolled clear of the pile. |
| **Potash** | A low heap of coarse faceted crystalline granules in muted brick-red and pale pink, 2–4 mm, irregular and dry, with a few loose grains scattered clear of the pile. |
| **Ammonia** | A short, thick-walled sealed borosilicate glass specimen tube lying flat and centred, holding anhydrous ammonia as a clear, colourless, mobile liquid filling about two thirds of it, with a crisp bright meniscus and a small vapour headspace above. The outside of the glass carries a fine even bloom of white frost and beaded condensation from the cold contents, heaviest at the ends and thinning across the middle, where the liquid inside reads sharp and clear through it. |
| **Ammonium Nitrate** | A low heap of opaque off-white to pale-cream porous prills, 2–4 mm, duller and slightly more angular than urea, with a scatter of loose prills. |
| **NPK Compound** | A low heap of compound granules, 3–5 mm, mixing muted grey-brown, brick-red and off-white within the same pile, irregular and matte. |

### Polymers

| Product | `{{MATERIAL}}` |
|---|---|
| **Polyethylene** | A low, loose spread of translucent milky-white cylindrical resin pellets, 3–4 mm, glossy and faintly waxy, catching soft highlights, several pellets rolled clear of the group. |
| **Polypropylene** | A low, loose spread of translucent, near-colourless glassy resin pellets, 3–4 mm, harder and clearer than polyethylene, with crisp highlights and faint refracted shadow on the ground beneath each pellet. |
| **Performance additives** | Three small separated shallow mounds of fine powder and micro-pellet additive laid out in a loose row on the same ground — one chalk white, one pale ivory, one soft mid-grey. |

### Industrial chemicals

| Product | `{{MATERIAL}}` |
|---|---|
| **Sulphur** | A low heap of bright canary-yellow granules, 2–5 mm, matte with a faint dusty bloom, with two or three larger irregular lumps of the same yellow resting beside it. |
| **Urea-A (technical)** | A low heap of high-purity white prills, 2–4 mm, cleaner and brighter than the agricultural grade, with a fine dusting of white powder settled around the base. |
| **Caustic Soda** | A shallow scatter of hard white opaque flakes and pearls, 3–8 mm, dry, with a slight glassiness at the broken edges. |
| **Sodium Hypochlorite** | A wide, shallow clear-glass dish holding a thin layer of pale greenish-yellow liquid, its rim barely visible, a soft even sheen across the still surface. |
| **Hydrochloric Acid** | A wide, shallow clear-glass dish holding a thin layer of colourless transparent liquid with the faintest straw tint; the paper ground reads clearly through it, with a clean bright meniscus at the rim. |
| **Liquid Chlorine** | A short, thick-walled sealed borosilicate glass specimen ampoule lying flat and centred, about two thirds full of clear amber-yellow liquid chlorine with a crisp bright meniscus, and a distinctly greenish-yellow vapour headspace above the liquid. The glass is clean and dry, its thick walls refracting the ground behind it and casting a faint caustic of the same yellow-green onto the paper. |
| **Calcium Chloride** | A low heap of white deliquescent pellets and flakes, 3–6 mm, chalky and matte, with a faint damp gloss on a few surfaces. |
| **Sodium Sulphate** | A low heap of fine bright-white crystalline powder with visible fine crystal glitter, drawn up into a soft peak, with a light dusting on the surrounding ground. |
| **LABSA** | A wide, shallow clear-glass dish holding a thick, viscous amber-brown liquid, slow-moving, with a heavy glossy surface and a thick rolling edge where it meets the dish. |
| **SLES** | A wide, shallow clear-glass dish holding a thick, pearly, translucent near-colourless viscous paste with a soft internal sheen and a slowly settling surface. |
| **Sulphuric Acid** | A wide, shallow clear-glass dish holding a thin layer of dense, oily, colourless-to-pale-amber liquid, visibly thicker than water, with a heavy still surface. |
| **Formic Acid** | A wide, shallow clear-glass dish holding a thin layer of completely colourless, water-thin transparent liquid with a crisp bright meniscus. |
| **Acetex Plus** | A wide, shallow clear-glass dish holding a thin layer of clear, faintly straw-coloured liquid with a light even surface sheen. |
| **Aluminium Sulphate** | A low heap of off-white to pale-grey crystalline granules and small irregular slabs, 3–8 mm, dry and chalky. |
| **Iodine** | A small, tight heap of dark violet-black crystalline flakes with a distinct metallic purple-blue lustre catching the light, a few flakes separated from the pile, and the faintest violet haze immediately above it. |
| **Carbon Black** | A low heap of the deepest matte black fine powder and small beaded pellets, absorbing almost all light that falls on it, its edge softened by an extremely fine black dust halo on the surrounding ground. |

---

## 5. What the stylesheet will do to these

Worth knowing before approving a set, because two of these treatments discard
information the image may be relying on.

- **Standard photo treatment** — `brightness(.96) contrast(1.04)` on the light
  palette, from `--photo-brightness` / `--photo-contrast` in `theme.js`. Mild;
  images come through close to as-shot.
- **Hero treatment** — `grayscale(1) contrast(1.1) brightness(.9)`, from
  `.ph-vid-p` in `kernel-css.js`. **Colour is thrown away entirely.** Anything
  used full-bleed in a hero has to work as a black-and-white image, which is
  the other reason the brief leans on form, texture and tonal separation
  rather than on hue.
- **Film grain and scanline** — `.grain` sits over the whole page at 40%
  opacity in `overlay` blend. Images pick up the site's texture for free; do
  not bake grain in heavily as well or it will read as noise.

Two consequences for the set:

1. **Potash and NPK are the risk.** Muted red-brown granules on warm off-white
   collapse to nearly the same grey as the ground under `grayscale(1)`. If
   either is used in a hero, ask for a harder shadow and more tonal separation
   than the master prompt specifies.
2. **Carbon black and iodine are the wins.** Near-black material on off-white
   is the strongest pairing available and holds up under every treatment. Good
   candidates for the largest placements.

---

## 6. Running the set

Consistency is the entire point, so generate them as a batch, not one at a
time as each page needs one.

1. Generate **Urea B (N46)** first and iterate until the ground, light and
   shadow are right. That frame is the reference.
2. Lock the seed / style reference and run the other 23 against it, changing
   only `{{MATERIAL}}`.
3. Review the 24 as a contact sheet, all at the same size, before accepting
   any of them. A single frame that looks good alone but has a different
   shadow direction is the failure mode here, and it is invisible until they
   are seen together.
4. Re-run outliers with the seed held.

### The liquefied-gas mistake, and the fix

**Ammonia** and **Liquid Chlorine** were first specified as *containment*
frames: no material shown, a cylinder valve and pressure gauge instead, on the
reasoning that a liquefied gas cannot be poured onto a sheet of paper.

The generator did that exactly, and returned two clean photographs of
plumbing — a frosted steel valve with a gauge, and a brass valve in a steel
yoke. Both were competent images of the wrong subject. **A product page for
chlorine that shows a brass valve has not shown chlorine.** The prompt was
wrong, not the tool.

The premise was the error. It is true that neither can sit in an open dish —
liquid chlorine boils at −34 °C and anhydrous ammonia at −33 °C — but "cannot
be poured onto paper" is not the same as "cannot be photographed". Both are
photographed now as **sealed frames**: a short, thick-walled borosilicate
specimen ampoule lying flat, with the substance itself as the subject.

- **Liquid Chlorine** — clear amber-yellow liquid, two thirds full, with a
  distinctly greenish-yellow vapour headspace above it. The headspace is the
  point: it is the colour chlorine is known by, and it makes this the most
  identifiable frame in the whole set.
- **Ammonia** — clear colourless liquid, with a bloom of white frost and
  condensation on the *outside* of the glass. Anhydrous ammonia is colourless,
  so the frost is doing the identifying work: it is what a cold liquefied gas
  actually looks like, and it separates this frame from the seven clear-liquid
  dish frames that would otherwise resemble it.

Both keep the paper ground, the overhead camera and the single soft light, so
they sit in the set rather than beside it. The `sealed` exclusion tail bans
valves, handwheels, gauges, regulators, cylinders and pipework **by name** —
the failure is specific enough to be worth naming rather than gesturing at.

---

## 7. How they are wired up

**Masters** live in `_masters/products/`, one per grade, named after the
grade's page (`fertilizers-urea-b-n46.webp`). That directory is in both
`.gitignore` and `.assetsignore` — 144 MB of PNG cannot be delta-compressed by
git and would sit in the history permanently. **Back the masters up somewhere
outside the repo**: everything in `assets/products/` can be rebuilt from them,
and nothing can rebuild them.

**`npm run images`** turns each master into two derivatives:

| File | Size | Used by |
|---|---|---|
| `<id>.webp` | 1600 × 894 | the plate in the grade page's hero |
| `<id>-sq.webp` | 512 × 512 | the circular thumbnail on the products grid |

It also does two things worth knowing about:

- **Normalises the paper.** Each frame's white point is measured from its
  brightest corner and mapped onto the theme's `pageBackground`, so the
  photograph's ground and the page's ground are the same colour. The delivered
  set drifted by up to seventeen levels, which on a page of that exact colour
  reads as a grey rectangle stuck to it rather than a photograph sitting on it.
  Because of this the product images deliberately **skip** the site-wide
  `--photo-brightness` / `--photo-contrast` filter — they are already graded to
  the page, and darkening them a further 4% is the one thing that would break
  the match.
- **Asserts the output dimensions** against `IMG_W` / `IMG_H` / `IMG_SQ` in
  `catalogue.js`, which is where the markup gets the `width`/`height` it uses to
  reserve space. A master re-delivered at a different aspect ratio fails at
  encode time instead of shipping as a page that reflows.

**Paths are derived, never written.** `catalogue.js` gives every grade `img`
and `imgSq` from its id, the same way it derives `url`. A rename moves the
page and its photograph together.

**Placement.** The grid card pairs the circle with the grade name, so the two
read as one entry. The grade page puts the plate in the hero beside the copy,
next to the N-P-K figures and the formula — on a grade page the first question
is what the material physically is, and that answer should not be below the
fold. Under 940px both collapse to one column with the copy first.

The grid loads only the square set: **432 KB of imagery for all 24 grades**,
lazily, against 144 MB if the masters had been used directly.
