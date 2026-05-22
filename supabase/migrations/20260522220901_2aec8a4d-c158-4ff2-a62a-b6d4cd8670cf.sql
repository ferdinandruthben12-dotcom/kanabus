
-- Set search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Lock down SECURITY DEFINER functions: only callable from server-side / triggers
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_staff(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role / is_staff are needed inside RLS policies (run as postgres) — no grants needed
-- handle_new_user runs from trigger as definer — no grants needed

-- Replace permissive contacts insert policy with a basic validation
DROP POLICY IF EXISTS "contacts public insert" ON public.contacts;
CREATE POLICY "contacts public insert" ON public.contacts
  FOR INSERT
  WITH CHECK (
    length(coalesce(name,'')) BETWEEN 1 AND 200
    AND length(coalesce(email,'')) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(coalesce(message,'')) BETWEEN 1 AND 4000
  );
