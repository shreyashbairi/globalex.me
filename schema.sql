-- ============================================================
-- GLOBALEX — D1 schema
--   npx wrangler d1 execute globalex --remote --file=./schema.sql
-- Safe to re-run; every statement is IF NOT EXISTS.
-- ============================================================

-- Someone asked for a document. One row per request, never overwritten,
-- so a repeat request from the same address is visible as a repeat.
CREATE TABLE IF NOT EXISTS leads (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  name       TEXT,
  company    TEXT,
  doc_id     TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  ip         TEXT,
  country    TEXT,
  city       TEXT,
  region     TEXT,
  ua         TEXT,
  referer    TEXT,
  page       TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email   ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_doc     ON leads (doc_id);

-- The tokenised link that gets emailed. One grant per lead. Revoking a
-- grant kills the link without deleting the audit trail behind it.
CREATE TABLE IF NOT EXISTS grants (
  token      TEXT PRIMARY KEY,
  lead_id    TEXT NOT NULL,
  doc_id     TEXT NOT NULL,
  email      TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked    INTEGER NOT NULL DEFAULT 0,
  opens      INTEGER NOT NULL DEFAULT 0,
  downloads  INTEGER NOT NULL DEFAULT 0,
  last_open  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_grants_lead ON grants (lead_id);
CREATE INDEX IF NOT EXISTS idx_grants_doc  ON grants (doc_id);

-- Every interaction with a granted document. `kind` is one of:
--   open      viewer loaded
--   page      reader moved to a page (with dwell seconds on the previous one)
--   download  original PDF pulled down
--   heartbeat still open, still reading
CREATE TABLE IF NOT EXISTS doc_events (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  token   TEXT NOT NULL,
  doc_id  TEXT NOT NULL,
  email   TEXT NOT NULL,
  kind    TEXT NOT NULL,
  page    INTEGER,
  seconds INTEGER,
  ts      INTEGER NOT NULL,
  ip      TEXT,
  country TEXT,
  city    TEXT,
  region  TEXT,
  tz      TEXT,
  ua      TEXT
);
CREATE INDEX IF NOT EXISTS idx_ev_token ON doc_events (token);
CREATE INDEX IF NOT EXISTS idx_ev_ts    ON doc_events (ts DESC);
CREATE INDEX IF NOT EXISTS idx_ev_doc   ON doc_events (doc_id);

-- Contact + careers form submissions, logged as well as emailed so a
-- mail outage never loses an enquiry.
CREATE TABLE IF NOT EXISTS messages (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  kind    TEXT NOT NULL,
  name    TEXT,
  email   TEXT,
  phone   TEXT,
  company TEXT,
  subject TEXT,
  body    TEXT,
  ts      INTEGER NOT NULL,
  ip      TEXT,
  country TEXT,
  city    TEXT,
  ua      TEXT,
  page    TEXT
);
CREATE INDEX IF NOT EXISTS idx_msg_ts ON messages (ts DESC);

-- Pageviews. `vid` is a daily-rotating hash of IP+UA+salt, never the IP
-- itself: unique-visitor counts work, but nothing here identifies a person
-- or survives midnight, so the site needs no cookie banner.
CREATE TABLE IF NOT EXISTS pageviews (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  path    TEXT NOT NULL,
  vid     TEXT NOT NULL,
  ts      INTEGER NOT NULL,
  country TEXT,
  city    TEXT,
  region  TEXT,
  ref     TEXT,
  device  TEXT
);
CREATE INDEX IF NOT EXISTS idx_pv_ts  ON pageviews (ts DESC);
CREATE INDEX IF NOT EXISTS idx_pv_vid ON pageviews (vid);
