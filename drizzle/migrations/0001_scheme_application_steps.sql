ALTER TABLE public.schemes ADD COLUMN IF NOT EXISTS application_steps text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.government_updates ADD COLUMN IF NOT EXISTS last_verified date;
GRANT SELECT ON public.schemes TO anon, authenticated;
GRANT SELECT ON public.government_updates TO anon, authenticated;
GRANT ALL ON public.schemes TO service_role;
GRANT ALL ON public.government_updates TO service_role;