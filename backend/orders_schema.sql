-- Create the orders table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    -- We need a seller_id to associate an order with a seller.
    -- For simplicity, this schema assumes one seller per order.
    -- The checkout logic will need to handle grouping cart items by seller.
    seller_id UUID REFERENCES public.sellers(id) NOT NULL,
    total numeric(10, 2) NOT NULL,
    discounted_total numeric(10, 2),
    coupon text,
    discount numeric(10, 2),
    status text NOT NULL,
    customer_email text,
    customer_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the order_items table
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id),
    name text NOT NULL,
    price numeric(10, 2) NOT NULL,
    quantity integer NOT NULL
);

-- Enable RLS for the new tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'orders' table
CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sellers can view their orders" ON public.orders
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM sellers
        WHERE sellers.id = orders.seller_id AND sellers.user_id = auth.uid()
    ));

-- RLS Policies for 'order_items' table
CREATE POLICY "Users can insert items for their new orders" ON public.order_items
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Users and Sellers can view items for accessible orders" ON public.order_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
    ));
