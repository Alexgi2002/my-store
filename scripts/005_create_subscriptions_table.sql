-- Create table for push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public to insert subscriptions (users subscribing)
-- Replace IF NOT EXISTS (not supported in some Postgres versions) by a safe drop/create
DROP POLICY IF EXISTS "Anyone can subscribe" ON push_subscriptions;
CREATE POLICY "Anyone can subscribe"
ON push_subscriptions FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to delete their own subscriptions
DROP POLICY IF EXISTS "Anyone can unsubscribe" ON push_subscriptions;
CREATE POLICY "Anyone can unsubscribe"
ON push_subscriptions FOR DELETE
TO public
USING (true);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
