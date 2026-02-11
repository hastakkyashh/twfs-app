-- Form submissions telemetry table
CREATE TABLE IF NOT EXISTS enquiry_form_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Form fields
  name TEXT NOT NULL,
  dob TEXT,
  place TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT,
  -- Location from Cloudflare (automatic, no permission needed)
  cf_country TEXT,
  cf_city TEXT,
  cf_region TEXT,
  cf_latitude TEXT,
  cf_longitude TEXT,
  cf_timezone TEXT,
  -- Browser location (only if user granted permission)
  browser_latitude REAL,
  browser_longitude REAL,
  -- Meta
  user_agent TEXT,
  ip_country TEXT,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for querying by date
CREATE INDEX IF NOT EXISTS idx_submissions_date ON enquiry_form_submissions(submitted_at DESC);

-- Index for querying by phone (to detect repeat leads)
CREATE INDEX IF NOT EXISTS idx_submissions_phone ON enquiry_form_submissions(phone);
