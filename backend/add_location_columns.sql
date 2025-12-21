-- Add latitude and longitude columns to sellers table
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
