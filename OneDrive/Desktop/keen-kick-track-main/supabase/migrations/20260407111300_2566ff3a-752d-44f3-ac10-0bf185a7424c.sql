
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'rep');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  deal_value NUMERIC DEFAULT 0,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id),
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity_notes table
CREATE TABLE public.activity_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_notes ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
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

-- Helper: get user's team (users managed by same manager or self)
CREATE OR REPLACE FUNCTION public.get_team_user_ids(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- For simplicity, managers see all reps, admins see all
  SELECT user_id FROM public.user_roles WHERE role = 'rep'
  UNION
  SELECT _user_id
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Leads policies: reps see own, managers see team, admins see all
CREATE POLICY "Admins can do everything with leads" ON public.leads
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view team leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can manage team leads" ON public.leads
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Reps can view own leads" ON public.leads
  FOR SELECT TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Reps can insert leads" ON public.leads
  FOR INSERT TO authenticated
  WITH CHECK (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Reps can update own leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid());

-- Activities policies
CREATE POLICY "Admins can do everything with activities" ON public.activities
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all activities" ON public.activities
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can manage all activities" ON public.activities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Reps can view own activities" ON public.activities
  FOR SELECT TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Reps can insert activities" ON public.activities
  FOR INSERT TO authenticated
  WITH CHECK (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Reps can update own activities" ON public.activities
  FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid());

-- Activity notes policies
CREATE POLICY "Users can view notes for accessible activities" ON public.activity_notes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create notes" ON public.activity_notes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.activity_notes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  
  -- Default new users to 'rep' role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'rep');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
