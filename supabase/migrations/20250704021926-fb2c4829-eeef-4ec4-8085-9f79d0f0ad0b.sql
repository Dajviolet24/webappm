
-- Create a table to track user watch progress
CREATE TABLE public.watch_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
  progress_seconds INTEGER NOT NULL DEFAULT 0,
  total_duration_seconds INTEGER,
  last_watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id, episode_id)
);

-- Enable RLS
ALTER TABLE public.watch_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own watch progress
CREATE POLICY "Users can view their own watch progress" 
  ON public.watch_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch progress" 
  ON public.watch_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch progress" 
  ON public.watch_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch progress" 
  ON public.watch_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Admins can view all watch progress for management purposes
CREATE POLICY "Admins can view all watch progress" 
  ON public.watch_progress 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));
