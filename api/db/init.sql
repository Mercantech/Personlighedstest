CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS accounts (
  sub TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  current_result_id UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY,
  user_sub TEXT NOT NULL REFERENCES accounts (sub) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  scores INTEGER[] NOT NULL,
  answers INTEGER[] NOT NULL,
  instrument TEXT NOT NULL,
  balanced BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accounts
  DROP CONSTRAINT IF EXISTS accounts_current_result_id_fkey;

ALTER TABLE accounts
  ADD CONSTRAINT accounts_current_result_id_fkey
  FOREIGN KEY (current_result_id) REFERENCES results (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS results_user_sub_idx ON results (user_sub);
CREATE INDEX IF NOT EXISTS results_user_created_idx ON results (user_sub, created_at DESC);

ALTER TABLE results
  ADD COLUMN IF NOT EXISTS length INTEGER NOT NULL DEFAULT 60;
