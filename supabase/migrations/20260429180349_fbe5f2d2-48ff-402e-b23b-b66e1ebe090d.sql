-- Enums
CREATE TYPE public.voice_note_status AS ENUM ('Open', 'In Progress', 'Resolved', 'Archived');
CREATE TYPE public.voice_note_intent AS ENUM ('Reservation', 'Complaint', 'Price Inquiry', 'General', 'Urgent', 'Order', 'Cancellation');
CREATE TYPE public.voice_note_urgency AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.user_plan AS ENUM ('Free', 'Pro', 'Premium');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  email TEXT,
  whatsapp_number TEXT,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  plan public.user_plan NOT NULL DEFAULT 'Free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own profile delete" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name, whatsapp_number, timezone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    NEW.raw_user_meta_data->>'whatsapp_number',
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'Asia/Jakarta')
  );
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- customers
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, phone)
);
CREATE INDEX customers_user_id_idx ON public.customers(user_id);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own customers select" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own customers insert" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own customers update" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own customers delete" ON public.customers FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- voice_notes
CREATE TABLE public.voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_number TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'English',
  full_text TEXT NOT NULL,
  summary TEXT NOT NULL,
  intent public.voice_note_intent NOT NULL DEFAULT 'General',
  urgency public.voice_note_urgency NOT NULL DEFAULT 'medium',
  status public.voice_note_status NOT NULL DEFAULT 'Open',
  duration_sec INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX voice_notes_user_id_idx ON public.voice_notes(user_id);
CREATE INDEX voice_notes_status_idx ON public.voice_notes(user_id, status);
CREATE INDEX voice_notes_created_idx ON public.voice_notes(user_id, created_at DESC);
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own vn select" ON public.voice_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own vn insert" ON public.voice_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own vn update" ON public.voice_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own vn delete" ON public.voice_notes FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER voice_notes_updated_at BEFORE UPDATE ON public.voice_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- entities
CREATE TABLE public.entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_note_id UUID NOT NULL REFERENCES public.voice_notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX entities_vn_idx ON public.entities(voice_note_id);
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own entities select" ON public.entities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own entities insert" ON public.entities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own entities update" ON public.entities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own entities delete" ON public.entities FOR DELETE USING (auth.uid() = user_id);

-- tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#FBBF24',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tags select" ON public.tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own tags insert" ON public.tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own tags update" ON public.tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own tags delete" ON public.tags FOR DELETE USING (auth.uid() = user_id);

-- voice_note_tags (M:N)
CREATE TABLE public.voice_note_tags (
  voice_note_id UUID NOT NULL REFERENCES public.voice_notes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (voice_note_id, tag_id)
);
ALTER TABLE public.voice_note_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own vnt select" ON public.voice_note_tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own vnt insert" ON public.voice_note_tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own vnt delete" ON public.voice_note_tags FOR DELETE USING (auth.uid() = user_id);