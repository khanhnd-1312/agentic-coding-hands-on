-- Auto-create a profile row when a new user signs up via Supabase Auth.
-- This trigger fires AFTER INSERT on auth.users and pulls name/avatar
-- from the OAuth metadata that Google (or other providers) supply.
-- A random department is assigned from the existing departments table.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, department_id)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'avatar_url',
      NEW.raw_user_meta_data ->> 'picture'
    ),
    (SELECT id FROM public.departments ORDER BY random() LIMIT 1)
  );
  RETURN NEW;
END;
$$;

-- Trigger: runs once per new auth user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
