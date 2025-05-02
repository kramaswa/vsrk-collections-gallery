
-- Create the media_items table to track uploads
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  featured BOOLEAN DEFAULT false NOT NULL
);

-- Enable RLS on media_items table
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to select media items
CREATE POLICY "Allow authenticated users to select media_items"
ON public.media_items FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users to insert media items
CREATE POLICY "Allow authenticated users to insert media_items"
ON public.media_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update media items
CREATE POLICY "Allow authenticated users to update media_items"
ON public.media_items FOR UPDATE
TO authenticated
USING (true);

-- Create policy to allow authenticated users to delete media items
CREATE POLICY "Allow authenticated users to delete media_items"
ON public.media_items FOR DELETE
TO authenticated
USING (true);

-- Create policy to allow public to view media items
CREATE POLICY "Allow public to view media_items"
ON public.media_items FOR SELECT
TO anon
USING (true);
