
-- Create table for access keys
CREATE TABLE public.access_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the 10 access keys
INSERT INTO public.access_keys (username, password) VALUES
('a1b2c', 'Df$5g7A!'),
('z3p8d', 'WqZ8h2@E'),
('f4t1n', 'S&9hLp!8'),
('q7h1x', '3B#tA2g'),
('k9e3m', 'Wt!Fz4D'),
('u2v9r', 'J8#lKm1'),
('p1q5y', 'L@7uT9E'),
('l2c5z', 'Zm$W9qP'),
('o4g1f', '9R1pH8Y'),
('i3b7w', 'X2$4EzB');

-- Enable RLS
ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading access keys (needed for authentication)
CREATE POLICY "Allow reading access keys for authentication" 
ON public.access_keys 
FOR SELECT 
USING (true);

-- Create policy to allow deleting used access keys
CREATE POLICY "Allow deleting used access keys" 
ON public.access_keys 
FOR DELETE 
USING (true);
