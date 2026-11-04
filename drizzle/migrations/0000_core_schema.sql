CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  preferred_language text NOT NULL DEFAULT 'en',
  state text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, NULLIF(left(NEW.raw_user_meta_data->>'full_name', 80), ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Government schemes (public read, verified data only; managed by service role)
CREATE TABLE public.schemes (
  id text PRIMARY KEY,
  name text NOT NULL,
  level text NOT NULL CHECK (level IN ('Central','State')),
  state text,
  category text NOT NULL,
  beneficiary text NOT NULL,
  description text NOT NULL,
  eligibility_summary text,
  benefits text,
  eligibility text[] NOT NULL DEFAULT '{}',
  documents text[] NOT NULL DEFAULT '{}',
  official_url text,
  source text NOT NULL,
  last_verified date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schemes TO anon, authenticated;
GRANT ALL ON public.schemes TO service_role;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schemes are public" ON public.schemes FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER schemes_updated BEFORE UPDATE ON public.schemes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Government updates
CREATE TABLE public.government_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  category text NOT NULL,
  state text,
  official_url text,
  source text NOT NULL,
  published_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.government_updates TO anon, authenticated;
GRANT ALL ON public.government_updates TO service_role;
ALTER TABLE public.government_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Updates are public" ON public.government_updates FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER updates_updated BEFORE UPDATE ON public.government_updates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Saved schemes (scheme_id is text so sample and verified schemes can both be saved)
CREATE TABLE public.saved_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scheme_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, scheme_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_schemes TO authenticated;
GRANT ALL ON public.saved_schemes TO service_role;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own saved read" ON public.saved_schemes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own saved insert" ON public.saved_schemes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own saved delete" ON public.saved_schemes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Documents metadata
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  mime_type text NOT NULL CHECK (mime_type IN ('application/pdf','image/png','image/jpeg','image/webp')),
  size_bytes integer NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 10485760),
  status text NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded','processing','analysed','failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own docs read" ON public.documents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own docs insert" ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'uploaded' AND storage_path LIKE auth.uid()::text || '/%');
CREATE POLICY "Own docs delete" ON public.documents FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER documents_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Analysis results (written only by the server)
CREATE TABLE public.document_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  extracted_text text,
  simple_explanation text,
  important_dates jsonb NOT NULL DEFAULT '[]',
  requirements jsonb NOT NULL DEFAULT '[]',
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.document_analyses TO authenticated;
GRANT ALL ON public.document_analyses TO service_role;
ALTER TABLE public.document_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own analyses read" ON public.document_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Conversations & messages
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New conversation',
  document_id uuid REFERENCES public.documents(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own conv all" ON public.conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER conversations_updated BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.conversation_messages TO authenticated;
GRANT ALL ON public.conversation_messages TO service_role;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own msgs read" ON public.conversation_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own msgs insert" ON public.conversation_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role = 'user' AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid()));

-- Storage policies for private documents bucket
CREATE POLICY "Own files read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Own files upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Own files delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);