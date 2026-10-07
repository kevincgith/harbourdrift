-- Harbour Drift analytics — D1 schema
-- Anonymous event counts only: no IP, no user-agent, no identifiers.
CREATE TABLE IF NOT EXISTS events (
  ts           INTEGER NOT NULL,            -- unix epoch seconds (server clock)
  name         TEXT    NOT NULL,            -- allowlisted event name
  level        INTEGER,                     -- 1-4 difficulty, when relevant
  score_bucket INTEGER,                     -- score rounded down to nearest 50
  flag         INTEGER,                     -- event-specific boolean (e.g. beat the challenge)
  country      TEXT                         -- coarse request.cf.country, nothing finer
);
CREATE INDEX IF NOT EXISTS idx_events_name_ts ON events (name, ts);
