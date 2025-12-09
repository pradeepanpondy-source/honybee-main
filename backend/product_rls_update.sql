-- Allow public read access to active products for the shop page
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT
    USING (is_active = TRUE);
