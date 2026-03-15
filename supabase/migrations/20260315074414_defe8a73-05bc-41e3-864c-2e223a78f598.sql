
CREATE TABLE public.login_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.login_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert login requests" ON public.login_requests
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can view login requests" ON public.login_requests
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can update login requests" ON public.login_requests
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete login requests" ON public.login_requests
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
