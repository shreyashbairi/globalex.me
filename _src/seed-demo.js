#!/usr/bin/env node
/* Fill the LOCAL database with plausible traffic, leads and document activity,
   so the dashboard can be checked against something other than empty tables.

     node _src/seed-demo.js > /tmp/seed.sql
     npx wrangler d1 execute globalex --local --file=/tmp/seed.sql

   Wipe it again with:

     npx wrangler d1 execute globalex --local \
       --command "DELETE FROM pageviews; DELETE FROM doc_events; DELETE FROM grants; DELETE FROM leads;"

   Never point this at --remote. */

const { DOCS } = require('./docs');

const DAY = 86400000;
const now = Date.now();
const out = [];
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

/* Deterministic PRNG. Re-running the seeder should produce the same numbers,
   or comparing two dashboard screenshots proves nothing. */
let seed = 7;
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const pick = (a) => a[Math.floor(rnd() * a.length)];

const GEO = [
  ['AE', 'Dubai', 'Dubai'], ['IN', 'Mumbai', 'Maharashtra'], ['CN', 'Shanghai', 'Shanghai'],
  ['TR', 'Istanbul', 'Istanbul'], ['NL', 'Rotterdam', 'South Holland'], ['KZ', 'Almaty', 'Almaty'],
  ['UZ', 'Tashkent', 'Tashkent'], ['SG', 'Singapore', 'Singapore'], ['DE', 'Hamburg', 'Hamburg'],
  ['KE', 'Mombasa', 'Mombasa'], ['VN', 'Ho Chi Minh City', 'Ho Chi Minh'], ['BR', 'Santos', 'Sao Paulo'],
];
const PATHS = ['/index.html', '/fertilizers.html', '/polymers.html', '/industrials.html',
  '/procedures.html', '/contact.html', '/about.html', '/sustainability.html', '/careers.html'];
const REFS = ['google.com', 'linkedin.com', 'bing.com', '', '', '', ''];

for (let d = 29; d >= 0; d--) {
  // A workweek shape — quiet at the weekend, busier midweek.
  const dow = new Date(now - d * DAY).getUTCDay();
  const base = dow === 5 || dow === 6 ? 9 : 26;
  const visitors = Math.round(base * (0.6 + rnd() * 0.9));
  for (let v = 0; v < visitors; v++) {
    const [c, city, region] = pick(GEO);
    const vid = `v${d}_${v}`;
    for (let h = 0, hits = 1 + Math.floor(rnd() * 3); h < hits; h++) {
      const ts = now - d * DAY + Math.floor(rnd() * DAY);
      out.push(
        `INSERT INTO pageviews (path,vid,ts,country,city,region,ref,device) VALUES ` +
        `(${q(pick(PATHS))},${q(vid)},${ts},${q(c)},${q(city)},${q(region)},${q(pick(REFS))},${q(rnd() > 0.68 ? 'mobile' : 'desktop')});`
      );
    }
  }
}

const PEOPLE = [
  ['procurement@sinograin.cn', 'Wei Zhang', 'Sinograin Trading'],
  ['k.patel@bharatpoly.in', 'Kiran Patel', 'Bharat Polymers'],
  ['m.yilmaz@anadolukimya.com.tr', 'Mehmet Yilmaz', 'Anadolu Kimya'],
  ['j.devries@rotterdambulk.nl', 'Jan de Vries', 'Rotterdam Bulk BV'],
  ['a.nazarov@kazoil.kz', 'Aigul Nazarova', 'KazOil Logistics'],
  ['sourcing@mombasaagri.co.ke', 'Njeri Kamau', 'Mombasa Agri'],
  ['t.nguyen@saigonplast.vn', 'Thanh Nguyen', 'Saigon Plast'],
  ['r.silva@santospetro.br', 'Rafael Silva', 'Santos Petro'],
  ['buyer@gulfchem.ae', 'Fatima Al Suwaidi', 'Gulf Chem FZE'],
  ['h.schmidt@hamburgtrade.de', 'Hanna Schmidt', 'Hamburg Trade GmbH'],
];

PEOPLE.forEach(([email, name, co], i) => {
  const [c, city, region] = GEO[i % GEO.length];
  const doc = DOCS[i % DOCS.length];
  const created = now - Math.floor(rnd() * 26 * DAY);
  const id = `demo-lead-${i}`;
  const tok = `demotoken${String(i).padStart(3, '0')}xxxxxxxxxxxxxxx`;

  out.push(
    `INSERT INTO leads (id,email,name,company,doc_id,created_at,ip,country,city,region,ua,referer,page) VALUES ` +
    `(${q(id)},${q(email)},${q(name)},${q(co)},${q(doc.id)},${created},'203.0.113.${i}',${q(c)},${q(city)},${q(region)},'Mozilla/5.0','','/index.html');`
  );

  // Every fourth link goes unopened — that gap is what the funnel column exists to show.
  const opens = i % 4 === 3 ? 0 : 1 + Math.floor(rnd() * 4);
  const dls = opens ? Math.floor(rnd() * 2) : 0;
  const last = opens ? created + Math.floor(rnd() * 5 * DAY) : null;

  out.push(
    `INSERT INTO grants (token,lead_id,doc_id,email,created_at,expires_at,revoked,opens,downloads,last_open) VALUES ` +
    `(${q(tok)},${q(id)},${q(doc.id)},${q(email)},${created},${created + 30 * DAY},0,${opens},${dls},${last === null ? 'NULL' : last});`
  );

  for (let o = 0; o < opens; o++) {
    const ts = created + Math.floor(rnd() * 5 * DAY);
    out.push(
      `INSERT INTO doc_events (token,doc_id,email,kind,ts,ip,country,city,region,tz,ua) VALUES ` +
      `(${q(tok)},${q(doc.id)},${q(email)},'open',${ts},'203.0.113.${i}',${q(c)},${q(city)},${q(region)},'UTC','Mozilla/5.0');`
    );
    for (let pg = 1; pg <= doc.pages; pg++) {
      out.push(
        `INSERT INTO doc_events (token,doc_id,email,kind,page,seconds,ts) VALUES ` +
        `(${q(tok)},${q(doc.id)},${q(email)},'page',${pg},${10 + Math.floor(rnd() * 90)},${ts + pg * 1000});`
      );
    }
  }
  if (dls) {
    out.push(
      `INSERT INTO doc_events (token,doc_id,email,kind,ts,country,city) VALUES ` +
      `(${q(tok)},${q(doc.id)},${q(email)},'download',${last},${q(c)},${q(city)});`
    );
  }
});

console.log(out.join('\n'));
