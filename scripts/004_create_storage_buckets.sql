-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
CREATE POLICY IF NOT EXISTS "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('products', 'banners'));

-- Allow anyone to upload (we'll control this at the API level)
CREATE POLICY IF NOT EXISTS "Anyone can upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id IN ('products', 'banners'));

-- Allow anyone to update images
CREATE POLICY IF NOT EXISTS "Anyone can update images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id IN ('products', 'banners'));

-- Allow anyone to delete images
CREATE POLICY IF NOT EXISTS "Anyone can delete images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id IN ('products', 'banners'));
