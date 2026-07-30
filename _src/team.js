/* ============================================================
   ⚠️  PLACEHOLDER DATA — NOT FOR PRODUCTION
   Every value below is invented. Replace with verified company
   data before this page ships. Do not deploy as-is.
   ============================================================

   LEADERSHIP

   Gated by SECTIONS.leadership in _src/flags.js, which is off.

   This is the one gate on the site that is a LEGAL requirement rather than a
   data gap. Publishing a person's name, role, photograph and biography is
   processing their personal data on a public website. Under the UAE PDPL that
   needs their consent, in writing, per individual — and it needs to remain
   withdrawable.

   So: no name here is real, and none should be invented. A plausible-looking
   executive name on a trading house's website is worse than a blank section —
   it is a claim about who stands behind the contracts.

   On photographs: stock portraits of strangers presented as your leadership
   is a misrepresentation, so the card treatment falls back to a generated
   geometric avatar built from the gül motif. Supply real portraits (min
   800x1000, plain background works best with the greyscale + palette blend)
   or keep the avatars.

   Per person: name, role, location, 40-60 word bio, LinkedIn URL, order.
   ============================================================ */

const TEAM = [
  {
    id: "p1",
    name: "[Name to be confirmed]",
    role: "[Role]",
    location: "Dubai, UAE",
    bio: "[40 to 60 words. What this person is responsible for, and the experience that makes that credible. Written for a counterparty deciding whether to trade with us, not for a recruiter.]",
    image: null,
    linkedin: null,
    order: 1,
    CONSENTED: false,
  },
  {
    id: "p2",
    name: "[Name to be confirmed]",
    role: "[Role]",
    location: "Dubai, UAE",
    bio: "[40 to 60 words.]",
    image: null,
    linkedin: null,
    order: 2,
    CONSENTED: false,
  },
  {
    id: "p3",
    name: "[Name to be confirmed]",
    role: "[Role]",
    location: "Dubai, UAE",
    bio: "[40 to 60 words.]",
    image: null,
    linkedin: null,
    order: 3,
    CONSENTED: false,
  },
];

/* Second gate, per person. Switching the section on must not publish someone
   who has not consented — that is the whole point of tracking it per record
   rather than trusting the section flag. */
const publishable = () =>
  TEAM.filter((p) => p.CONSENTED).sort((a, b) => a.order - b.order);

/* Headcount for the About hero. Null while unknown rather than a guess. */
const HEADCOUNT = null;

module.exports = { TEAM, publishable, HEADCOUNT };
