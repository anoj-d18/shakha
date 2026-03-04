
-- Create shakhas table
CREATE TABLE public.shakhas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  phone TEXT,
  address TEXT,
  role TEXT,
  shikshana TEXT,
  shakha_id UUID REFERENCES public.shakhas(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shakha_id UUID REFERENCES public.shakhas(id) ON DELETE CASCADE,
  shakha_name TEXT NOT NULL,
  date DATE NOT NULL,
  place TEXT NOT NULL,
  taruna INTEGER DEFAULT 0,
  balaka INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  shishu INTEGER DEFAULT 0,
  abhyagata INTEGER DEFAULT 0,
  anya INTEGER DEFAULT 0,
  pravasa INTEGER DEFAULT 0,
  vishesha TEXT,
  submitted_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin roles using enum pattern
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.shakhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies: Admins can do everything
CREATE POLICY "Admins can manage shakhas" ON public.shakhas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view shakhas" ON public.shakhas FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage members" ON public.members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view members" ON public.members FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert members" ON public.members FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage attendance" ON public.attendance FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view attendance" ON public.attendance FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert attendance" ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
