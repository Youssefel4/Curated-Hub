-- Migration: Add Storage Bucket for Images
-- This needs to be run in Supabase Dashboard SQL Editor

-- Create storage bucket for images (if using Supabase Dashboard, create bucket named 'images' and set it to public)

-- Note: The following policies should be created in Supabase Dashboard under Storage > Policies

-- Policy 1: Allow authenticated users to upload images
-- Name: "Allow authenticated uploads"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- Policy definition: (auth.role() = 'authenticated')

-- Policy 2: Allow public read access to images
-- Name: "Allow public read"
-- Allowed operation: SELECT
-- Target roles: public
-- Policy definition: true

-- Policy 3: Allow users to delete their own uploads
-- Name: "Allow delete own uploads"
-- Allowed operation: DELETE
-- Target roles: authenticated
-- Policy definition: (auth.uid()::text = (storage.foldername(name))[1])

-- If you prefer SQL, here's the equivalent (run in Supabase SQL Editor):

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'images',
--   'images',
--   true,
--   5242880, -- 5MB
--   ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
-- );

-- CREATE POLICY "Allow authenticated uploads"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'images');

-- CREATE POLICY "Allow public read"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'images');

-- CREATE POLICY "Allow authenticated delete"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'images');
