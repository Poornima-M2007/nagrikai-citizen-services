ALTER TABLE public.schemes ADD COLUMN record_type text NOT NULL DEFAULT 'scheme' CHECK (record_type IN ('scheme', 'scholarship_portal'));
ALTER TABLE public.schemes ADD COLUMN related_links jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(related_links) = 'array');
COMMENT ON COLUMN public.schemes.official_url IS 'Official application or scholarship application portal URL only; never a status-only or information-only destination.';
COMMENT ON COLUMN public.schemes.source IS 'Official information/provenance source, distinct from application destination.';
COMMENT ON COLUMN public.schemes.related_links IS 'Additional labelled official information or status destinations; each entry contains label, url and kind (information or status).';