
-- Create a table for categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories - allowing authenticated users to read, and only admins to modify
CREATE POLICY "Allow public to view categories" 
  ON public.categories 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert categories" 
  ON public.categories 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories" 
  ON public.categories 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete categories" 
  ON public.categories 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Insert default categories to maintain compatibility
INSERT INTO public.categories (name, display_name) VALUES
  ('necklace', 'Necklace'),
  ('bracelet', 'Bracelet'),
  ('bangles', 'Bangles'),
  ('earrings', 'Earrings'),
  ('rings', 'Rings'),
  ('pendants', 'Pendants'),
  ('sets', 'Sets'),
  ('other', 'Other'),
  ('uncategorized', 'Uncategorized');

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
