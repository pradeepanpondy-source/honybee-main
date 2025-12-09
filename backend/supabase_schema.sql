-- Supabase schema for profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    age TEXT,
    location TEXT,
    address TEXT,
    pincode TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own profile
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
CREATE POLICY "Users can delete own profile" ON profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Sellers table for seller registration and management
CREATE TABLE IF NOT EXISTS sellers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id TEXT UNIQUE NOT NULL, -- Unique seller identifier like SELLER-000001
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    seller_type TEXT NOT NULL CHECK (seller_type IN ('honey', 'beehive')),
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT,
    country_code TEXT,
    id_proof_url TEXT,
    profile_pic_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Register seller table (existing table from database.sql)
-- Add user_id column if it doesn't exist
ALTER TABLE register_seller ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS) for register_seller table
ALTER TABLE register_seller ENABLE ROW LEVEL SECURITY;

-- Register seller table policies
-- Users can view their own seller registration
DROP POLICY IF EXISTS "Users can view own seller registration" ON register_seller;
CREATE POLICY "Users can view own seller registration" ON register_seller
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all seller registrations (authenticated users can see all for admin purposes)
DROP POLICY IF EXISTS "Admins can view all seller registrations" ON register_seller;
CREATE POLICY "Admins can view all seller registrations" ON register_seller
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can insert their own seller registration
DROP POLICY IF EXISTS "Users can insert own seller registration" ON register_seller;
CREATE POLICY "Users can insert own seller registration" ON register_seller
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own seller registration
DROP POLICY IF EXISTS "Users can update own seller registration" ON register_seller;
CREATE POLICY "Users can update own seller registration" ON register_seller
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can update any seller registration
DROP POLICY IF EXISTS "Admins can update seller registrations" ON register_seller;
CREATE POLICY "Admins can update seller registrations" ON register_seller
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Products table for seller product management
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,  -- This column is missing
    discounted_total DECIMAL(10,2),
    coupon TEXT,
    discount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    customer_email TEXT,
    customer_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for sellers table
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security (RLS) for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Sellers table policies
-- Users can view their own seller profile
DROP POLICY IF EXISTS "Users can view own seller profile" ON sellers;
CREATE POLICY "Users can view own seller profile" ON sellers
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own seller profile (only one per user)
DROP POLICY IF EXISTS "Users can insert own seller profile" ON sellers;
CREATE POLICY "Users can insert own seller profile" ON sellers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own seller profile
DROP POLICY IF EXISTS "Users can update own seller profile" ON sellers;
CREATE POLICY "Users can update own seller profile" ON sellers
    FOR UPDATE USING (auth.uid() = user_id);

-- Products table policies
-- Sellers can view their own products
DROP POLICY IF EXISTS "Sellers can view own products" ON products;
CREATE POLICY "Sellers can view own products" ON products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sellers
            WHERE sellers.id = products.seller_id
            AND sellers.user_id = auth.uid()
        )
    );

-- Sellers can insert their own products
DROP POLICY IF EXISTS "Sellers can insert own products" ON products;
CREATE POLICY "Sellers can insert own products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sellers
            WHERE sellers.id = products.seller_id
            AND sellers.user_id = auth.uid()
            AND sellers.is_approved = TRUE
        )
    );

-- Sellers can update their own products
DROP POLICY IF EXISTS "Sellers can update own products" ON products;
CREATE POLICY "Sellers can update own products" ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM sellers
            WHERE sellers.id = products.seller_id
            AND sellers.user_id = auth.uid()
        )
    );

-- Sellers can delete their own products
DROP POLICY IF EXISTS "Sellers can delete own products" ON products;
CREATE POLICY "Sellers can delete own products" ON products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM sellers
            WHERE sellers.id = products.seller_id
            AND sellers.user_id = auth.uid()
        )
    );

-- Orders table for managing customer orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    discounted_total DECIMAL(10,2),
    coupon TEXT,
    discount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    customer_email TEXT,
    customer_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing orders table if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discounted_total DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE;

-- Update the total column to be NOT NULL if it exists but is nullable
-- Note: This is a manual step that may need to be done separately if there are existing NULL values

-- Order items table for individual items in orders
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security (RLS) for order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders table policies
-- Sellers can view orders for their products
DROP POLICY IF EXISTS "Sellers can view orders for their products" ON orders;
CREATE POLICY "Sellers can view orders for their products" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sellers
            WHERE sellers.id = orders.seller_id
            AND sellers.user_id = auth.uid()
        )
    );

-- Customers can view their own orders
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
CREATE POLICY "Customers can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Customers can insert their own orders
DROP POLICY IF EXISTS "Customers can insert own orders" ON orders;
CREATE POLICY "Customers can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sellers can update order status for their orders
DROP POLICY IF EXISTS "Sellers can update order status" ON orders;
CREATE POLICY "Sellers can update order status" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM sellers
            WHERE sellers.id = orders.seller_id
            AND sellers.user_id = auth.uid()
        )
    );

-- Order items table policies
-- Sellers can view order items for their products
DROP POLICY IF EXISTS "Sellers can view order items for their products" ON order_items;
CREATE POLICY "Sellers can view order items for their products" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            JOIN sellers ON sellers.id = orders.seller_id
            WHERE orders.id = order_items.order_id
            AND sellers.user_id = auth.uid()
        )
    );

-- Customers can view their own order items
DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;
CREATE POLICY "Customers can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Customers can insert order items for their orders
DROP POLICY IF EXISTS "Customers can insert order items" ON order_items;
CREATE POLICY "Customers can insert order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- KYC verification table for storing KYC documents and verification status
CREATE TABLE IF NOT EXISTS kyc (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id_type TEXT NOT NULL CHECK (id_type IN ('Adhaar', 'Passport')),
    id_number TEXT NOT NULL, -- Will store masked version (last 4 digits)
    address TEXT NOT NULL,
    pincode TEXT NOT NULL,
    front_side_url TEXT,
    back_side_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for kyc table
ALTER TABLE kyc ENABLE ROW LEVEL SECURITY;

-- KYC table policies
-- Users can view their own KYC records
DROP POLICY IF EXISTS "Users can view own KYC" ON kyc;
CREATE POLICY "Users can view own KYC" ON kyc
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own KYC records
DROP POLICY IF EXISTS "Users can insert own KYC" ON kyc;
CREATE POLICY "Users can insert own KYC" ON kyc
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own KYC records
DROP POLICY IF EXISTS "Users can update own KYC" ON kyc;
CREATE POLICY "Users can update own KYC" ON kyc
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all KYC records
DROP POLICY IF EXISTS "Admins can view all KYC records" ON kyc;
CREATE POLICY "Admins can view all KYC records" ON kyc
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Admins can update KYC status
DROP POLICY IF EXISTS "Admins can update KYC status" ON kyc;
CREATE POLICY "Admins can update KYC status" ON kyc
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_seller_id ON sellers(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_kyc_user_id ON kyc(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc(status);

-- Note: Storage bucket and policies must be created manually in Supabase Dashboard
-- Go to Storage > Create bucket named 'kyc-documents' (private)
-- Then create the following RLS policies for the bucket:
-- - INSERT: bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]
-- - SELECT: bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]
-- - UPDATE: bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]
-- - DELETE: bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]
