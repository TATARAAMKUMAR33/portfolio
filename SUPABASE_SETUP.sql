-- ═══════════════════════════════════════════════════════════════
-- TATA RAAM KUMAR PORTFOLIO — Supabase Database Setup
-- Run this entire file in Supabase → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Categories (dynamic filter system) ────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  parent_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Research Briefs (PDF Library) ─────────────────────────
CREATE TABLE IF NOT EXISTS briefs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  summary        TEXT,
  category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags           TEXT[] DEFAULT '{}',
  access_level   TEXT DEFAULT 'public' CHECK (access_level IN ('public','premium','recruiter')),
  pdf_url        TEXT,
  thumbnail_url  TEXT,
  published_at   TIMESTAMPTZ DEFAULT NOW(),
  download_count INT DEFAULT 0,
  is_featured    BOOLEAN DEFAULT FALSE
);

-- ── 3. Live Trackers ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trackers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  update_frequency TEXT DEFAULT 'monthly' CHECK (update_frequency IN ('monthly','quarterly','annual')),
  access_level     TEXT DEFAULT 'public' CHECK (access_level IN ('public','premium')),
  last_updated     TIMESTAMPTZ,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Tracker Monthly Updates ───────────────────────────────
CREATE TABLE IF NOT EXISTS tracker_updates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_id          UUID NOT NULL REFERENCES trackers(id) ON DELETE CASCADE,
  month               TEXT NOT NULL,
  what_improved       TEXT,
  what_remaining      TEXT,
  gap_analysis        TEXT,
  recommendation      TEXT,
  progress_score      INT DEFAULT 0 CHECK (progress_score BETWEEN 0 AND 100),
  supporting_pdf_url  TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. Content Feed (LinkedIn + Substack cache) ──────────────
CREATE TABLE IF NOT EXISTS content_feed (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL CHECK (type IN ('linkedin','substack')),
  title         TEXT NOT NULL,
  url           TEXT,
  thumbnail_url TEXT,
  excerpt       TEXT,
  access_level  TEXT DEFAULT 'public' CHECK (access_level IN ('public','premium')),
  published_at  TIMESTAMPTZ DEFAULT NOW(),
  is_featured   BOOLEAN DEFAULT FALSE
);

-- ── 6. Fullstack Tools ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS tools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  github_url    TEXT,
  demo_url      TEXT,
  tech_stack    TEXT[] DEFAULT '{}',
  category      TEXT DEFAULT 'Other',
  is_featured   BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0
);

-- ── 7. Subscribers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                     TEXT UNIQUE NOT NULL,
  plan                      TEXT DEFAULT 'free' CHECK (plan IN ('free','premium_monthly','premium_annual','sector_report')),
  plan_start                TIMESTAMPTZ DEFAULT NOW(),
  plan_expiry               TIMESTAMPTZ,
  razorpay_subscription_id  TEXT,
  stripe_subscription_id    TEXT,
  is_active                 BOOLEAN DEFAULT FALSE,
  access_type               TEXT DEFAULT 'paid' CHECK (access_type IN ('paid','recruiter','manual_grant')),
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. Contact Requests ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  organisation  TEXT,
  email         TEXT NOT NULL,
  inquiry_type  TEXT,
  message       TEXT,
  status        TEXT DEFAULT 'new' CHECK (status IN ('new','in_progress','replied','closed')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE trackers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_feed    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools           ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Public read policies (categories, public content)
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Public can read public briefs"
  ON briefs FOR SELECT USING (access_level = 'public');

CREATE POLICY "Public can read active trackers"
  ON trackers FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can read tracker updates"
  ON tracker_updates FOR SELECT USING (TRUE);

CREATE POLICY "Public can read public content feed"
  ON content_feed FOR SELECT USING (access_level = 'public');

CREATE POLICY "Public can read tools"
  ON tools FOR SELECT USING (TRUE);

-- Allow contact form submissions
CREATE POLICY "Anyone can submit contact"
  ON contact_requests FOR INSERT WITH CHECK (TRUE);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin full access to categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to briefs"
  ON briefs FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to trackers"
  ON trackers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to tracker_updates"
  ON tracker_updates FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to content_feed"
  ON content_feed FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to tools"
  ON tools FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to subscribers"
  ON subscribers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to contacts"
  ON contact_requests FOR ALL USING (auth.role() = 'authenticated');

-- Subscribers can read their own data
CREATE POLICY "Subscribers read own data"
  ON subscribers FOR SELECT USING (email = auth.jwt()->>'email');

-- ═══════════════════════════════════════════════════════════════
-- Supabase Storage Bucket
-- ═══════════════════════════════════════════════════════════════
-- Run this in Supabase Dashboard → Storage → New Bucket:
-- Bucket name: pdfs
-- Public: YES (for public briefs)
-- Then add a policy for authenticated upload:
-- INSERT allowed for authenticated users only

-- ═══════════════════════════════════════════════════════════════
-- Sample seed data (optional — delete after testing)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO categories (name, slug, display_order) VALUES
  ('BRICS & Multilateral', 'brics', 1),
  ('India State Policy', 'state-policy', 2),
  ('Regulatory Intelligence', 'regulatory', 3),
  ('Scam & Risk Intelligence', 'scam-risk', 4),
  ('Energy & Industry', 'energy-industry', 5),
  ('EdTech & Education', 'edtech', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO trackers (name, slug, description, update_frequency, access_level, is_active) VALUES
  (
    'BRICS Delhi Declaration Implementation Scorecard',
    'brics-delhi-scorecard',
    'Monthly tracking of which BRICS Delhi Declaration commitments India has implemented, what remains pending, and the gap between announcement and execution.',
    'monthly', 'public', TRUE
  ),
  (
    'India State Investment Readiness Index',
    'state-investment-index',
    'Monthly ranking of Indian states by investment readiness — ease of paperwork, land acquisition speed, labour law clarity, and incentive reality vs promise.',
    'monthly', 'premium', TRUE
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (name, description, github_url, demo_url, tech_stack, category, is_featured, display_order) VALUES
  (
    'US Sanctions Textile Landing Cost Calculator',
    'Calculate the exact cost impact of US sanctions on Indian textile exports. Input product type, origin state, target country, and current price — get percentage impact, profit/loss scenario, and alternative market comparison.',
    'https://github.com/TATARAAMKUMAR33/sanctions-calculator',
    '',
    ARRAY['React', 'Tailwind CSS', 'Cloudflare Pages'],
    'Finance Tools',
    TRUE,
    1
  )
ON CONFLICT DO NOTHING;

SELECT 'Database setup complete. All tables, policies, and seed data created.' AS result;
