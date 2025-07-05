
-- Create admin users table for simple authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin user (username: 123, password: 123)
INSERT INTO public.admin_users (username, password) VALUES ('123', '123');

-- Add foreign key constraints to existing tables to link with categories
ALTER TABLE public.movies 
ADD CONSTRAINT fk_movies_category 
FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE public.movies 
ADD CONSTRAINT fk_movies_subcategory 
FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id);

ALTER TABLE public.subcategories 
ADD CONSTRAINT fk_subcategories_category 
FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE public.episodes 
ADD CONSTRAINT fk_episodes_movie 
FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin authentication (allow all operations for simplicity)
CREATE POLICY "Allow admin access" ON public.admin_users FOR ALL TO anon USING (true);

-- Ensure categories and subcategories are publicly readable
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT TO anon USING (true);

ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read subcategories" ON public.subcategories FOR SELECT TO anon USING (true);

-- Ensure movies and episodes are publicly readable
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read movies" ON public.movies FOR SELECT TO anon USING (true);
CREATE POLICY "Allow admin write movies" ON public.movies FOR ALL TO anon USING (true);

ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read episodes" ON public.episodes FOR SELECT TO anon USING (true);
CREATE POLICY "Allow admin write episodes" ON public.episodes FOR ALL TO anon USING (true);
