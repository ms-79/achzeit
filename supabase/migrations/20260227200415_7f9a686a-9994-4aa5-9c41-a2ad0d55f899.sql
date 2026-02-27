
CREATE TABLE public.guest_guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  checkin DATE NOT NULL,
  checkout DATE NOT NULL,
  box_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_guides ENABLE ROW LEVEL SECURITY;

-- Public read access via token (no auth needed for guests)
CREATE POLICY "Anyone can read guide by token"
  ON public.guest_guides
  FOR SELECT
  USING (true);
