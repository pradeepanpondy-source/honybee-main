-- ============================================================
-- BeeBridge: Order Receipt System — Database Migration
-- Task 8 — Professional receipt fields
-- Run this in Supabase SQL Editor.
-- All operations use ADD COLUMN IF NOT EXISTS — safe to re-run.
-- ============================================================

-- Receipt & invoice identifiers
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt_number  TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number  TEXT;

-- Payment details
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method  TEXT DEFAULT 'COD';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status  TEXT DEFAULT 'pending'
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- Address capture at time of order (snapshot — not linked to profile)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address  TEXT;

-- Pricing breakdown
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax             DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_charge DECIMAL(10,2) DEFAULT 0;

-- Delivery
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;

-- Email receipt tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_sent     BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_sent_at  TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_attempts INTEGER DEFAULT 0;

-- Audit log (JSON array of status changes)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_receipt_number ON orders(receipt_number) WHERE receipt_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_payment_status  ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_email_sent      ON orders(email_sent);

-- ============================================================
-- Helper function: generate receipt number
-- Format: BB-YYYYMMDD-XXXXX  (e.g. BB-20260801-00001)
-- ============================================================
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  today TEXT := TO_CHAR(NOW(), 'YYYYMMDD');
  seq   INTEGER;
BEGIN
  SELECT COUNT(*) + 1
    INTO seq
    FROM orders
   WHERE DATE(created_at) = CURRENT_DATE;
  RETURN 'BB-' || today || '-' || LPAD(seq::TEXT, 5, '0');
END;
$$;
