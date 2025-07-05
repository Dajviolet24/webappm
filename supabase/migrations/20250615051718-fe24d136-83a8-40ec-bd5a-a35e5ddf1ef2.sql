
-- First, let's disable RLS temporarily to insert predefined categories
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;

-- Insert predefined categories
INSERT INTO public.categories (name, icon) VALUES
('Movies', 'Film'),
('TV Shows', 'Tv'),
('Anime', 'Zap'),
('Documentaries', 'BookOpen'),
('Kids', 'Baby')
ON CONFLICT DO NOTHING;

-- Get category IDs for subcategories (we'll use the first few for examples)
DO $$
DECLARE
    movies_id uuid;
    tv_shows_id uuid;
    anime_id uuid;
    docs_id uuid;
    kids_id uuid;
BEGIN
    SELECT id INTO movies_id FROM public.categories WHERE name = 'Movies' LIMIT 1;
    SELECT id INTO tv_shows_id FROM public.categories WHERE name = 'TV Shows' LIMIT 1;
    SELECT id INTO anime_id FROM public.categories WHERE name = 'Anime' LIMIT 1;
    SELECT id INTO docs_id FROM public.categories WHERE name = 'Documentaries' LIMIT 1;
    SELECT id INTO kids_id FROM public.categories WHERE name = 'Kids' LIMIT 1;

    -- Insert subcategories for Movies
    INSERT INTO public.subcategories (name, category_id) VALUES
    ('Action', movies_id),
    ('Comedy', movies_id),
    ('Drama', movies_id),
    ('Horror', movies_id),
    ('Romance', movies_id),
    ('Sci-Fi', movies_id),
    ('Thriller', movies_id)
    ON CONFLICT DO NOTHING;

    -- Insert subcategories for TV Shows
    INSERT INTO public.subcategories (name, category_id) VALUES
    ('Drama Series', tv_shows_id),
    ('Comedy Series', tv_shows_id),
    ('Reality TV', tv_shows_id),
    ('News', tv_shows_id)
    ON CONFLICT DO NOTHING;

    -- Insert subcategories for Anime
    INSERT INTO public.subcategories (name, category_id) VALUES
    ('Shonen', anime_id),
    ('Shoujo', anime_id),
    ('Seinen', anime_id),
    ('Slice of Life', anime_id)
    ON CONFLICT DO NOTHING;

    -- Insert subcategories for Documentaries
    INSERT INTO public.subcategories (name, category_id) VALUES
    ('Nature', docs_id),
    ('History', docs_id),
    ('Science', docs_id),
    ('Biography', docs_id)
    ON CONFLICT DO NOTHING;

    -- Insert subcategories for Kids
    INSERT INTO public.subcategories (name, category_id) VALUES
    ('Cartoons', kids_id),
    ('Educational', kids_id),
    ('Family Movies', kids_id)
    ON CONFLICT DO NOTHING;
END $$;

-- Now let's create proper RLS policies that allow public read access
-- but restrict write access to authenticated users (admins)

-- Categories policies - allow public read, admin write
CREATE POLICY "Public can view categories" 
  ON public.categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage categories" 
  ON public.categories 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Subcategories policies - allow public read, admin write
CREATE POLICY "Public can view subcategories" 
  ON public.subcategories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage subcategories" 
  ON public.subcategories 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Movies policies - allow public read, admin write
CREATE POLICY "Public can view movies" 
  ON public.movies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage movies" 
  ON public.movies 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Episodes policies - allow public read, admin write
CREATE POLICY "Public can view episodes" 
  ON public.episodes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage episodes" 
  ON public.episodes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Re-enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
