#!/usr/bin/env node
/* Push the PDFs in _docs/ to the R2 bucket, under the exact keys the
   catalogue expects.

   Run after adding or replacing a document:
     node _src/upload-docs.js            # to production R2
     node _src/upload-docs.js --local    # to the wrangler dev bucket

   It refuses to upload anything the catalogue does not reference, and
   reports catalogue entries with no file, so the two can never quietly
   drift apart. */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { DOCS } = require('./docs');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, '_docs');
const BUCKET = 'globalex-docs';
const local = process.argv.includes('--local');

if (!fs.existsSync(DIR)) {
  console.error(`No _docs/ directory. Put the source PDFs there first.`);
  process.exit(1);
}

const onDisk = new Set(fs.readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.pdf')));
const wanted = new Set(DOCS.map((d) => d.key));

let uploaded = 0;
let missing = 0;

for (const doc of DOCS) {
  const file = path.join(DIR, doc.key);
  if (!fs.existsSync(file)) {
    console.error(`  MISSING  ${doc.key}  (catalogue entry "${doc.id}" has no file)`);
    missing++;
    continue;
  }

  const size = fs.statSync(file).size;
  if (size !== doc.bytes) {
    /* The size is shown on the site, so a mismatch means the card is
       advertising the wrong figure. Warn, upload anyway. */
    console.warn(`  NOTE     ${doc.key} is ${size} bytes, catalogue says ${doc.bytes} — update _src/docs.js`);
  }

  execFileSync(
    'npx',
    [
      'wrangler', 'r2', 'object', 'put', `${BUCKET}/${doc.key}`,
      '--file', file,
      '--content-type', 'application/pdf',
      ...(local ? ['--local'] : ['--remote']),
    ],
    { stdio: ['ignore', 'ignore', 'inherit'], cwd: ROOT }
  );
  console.log(`  uploaded ${doc.key}  ${(size / 1024).toFixed(0)} KB`);
  uploaded++;
}

for (const f of onDisk) {
  if (!wanted.has(f)) console.warn(`  SKIPPED  ${f} — not in the catalogue, so nothing would serve it`);
}

console.log(`\n${uploaded} uploaded to ${local ? 'local' : 'remote'} R2${missing ? `, ${missing} missing` : ''}.`);
if (missing) process.exit(1);
