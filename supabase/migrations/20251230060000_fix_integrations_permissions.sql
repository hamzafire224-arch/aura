-- Grant permissions for integrations table
GRANT ALL ON TABLE public.integrations TO postgres;
GRANT ALL ON TABLE public.integrations TO service_role;
GRANT ALL ON TABLE public.integrations TO authenticated;
GRANT ALL ON TABLE public.integrations TO anon;

-- Ensure sequence permissions if ID is auto-generated (UUID gen_random_uuid usually fine, but safe to add)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
