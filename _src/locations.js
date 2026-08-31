/* ============================================================
   ⚠️  PLACEHOLDER DATA — NOT FOR PRODUCTION
   Every value below is invented. Replace with verified company
   data before this page ships. Do not deploy as-is.
   ============================================================

   OFFICES AND DESKS

   THE DUBAI HQ ENTRY IS THE ONLY REAL ONE. It is the same address, phone,
   email and coordinates already published on contact.html.

   Every other entry is a placeholder, and the page is gated by
   PAGES.locations in _src/flags.js. Do not publish an office that does not
   exist: it is the single most checkable claim on a corporate site, and a
   counterparty who calls a number that does not answer draws a conclusion
   about everything else.

   If Dubai is genuinely the only office, the honest move is to leave this
   page off permanently and let contact.html do the job — which is what the
   data checklist recommends.
   ============================================================ */

const REGIONS = [
  ["me", "Middle East"],
  ["ca", "Central Asia"],
  ["cas", "Caspian"],
];

const LOCATIONS = [
  {
    id: "dubai",
    region: "me",
    city: "Dubai",
    country: "United Arab Emirates",
    kind: "HQ",
    address:
      "2605 X3 Tower, Cluster X, Jumeirah Lakes Towers, 337622 Dubai, UAE",
    phone: "+971 4 566 7713",
    email: "contact@globalex.me",
    coords: [25.0693, 55.1413],
    note: "Trading, documentation and treasury. Every contract is written here and every cargo clears in our own name under the freezone licence.",
    REAL: true,
  },
  {
    id: "placeholder-central-asia",
    region: "ca",
    city: "[City]",
    country: "[Country]",
    kind: "Origin desk",
    address: "[Street address to be confirmed]",
    phone: "[+000 0 000 0000]",
    email: "[email to be confirmed]",
    coords: null,
    note: "[What this desk does — origin liaison, mill relationships, loading supervision.]",
    REAL: false,
  },
  {
    id: "placeholder-caspian",
    region: "cas",
    city: "[City]",
    country: "[Country]",
    kind: "Representative",
    address: "[Street address to be confirmed]",
    phone: "[+000 0 000 0000]",
    email: "[email to be confirmed]",
    coords: null,
    note: "[What this representative covers.]",
    REAL: false,
  },
];

/* Only entries confirmed real are ever rendered, independently of the page
   flag. Two layers on purpose: switching the page on must not publish a
   placeholder office as a side effect. */
const real = () => LOCATIONS.filter((l) => l.REAL);
const byRegion = (key) => real().filter((l) => l.region === key);
const liveRegions = () => REGIONS.filter(([k]) => byRegion(k).length > 0);

module.exports = { LOCATIONS, REGIONS, real, byRegion, liveRegions };
