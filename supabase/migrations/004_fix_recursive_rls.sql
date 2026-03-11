-- Fix infinite recursion in RLS policies on public.users.
-- The "Admins can view all users" policy queries public.users to check admin role,
-- which triggers the same RLS policies again, causing infinite recursion.
--
-- Fix: use auth.jwt() to read role from the JWT metadata instead of querying the table.
-- This requires setting the role in the user's app_metadata via a trigger.

-- Step 1: Drop the recursive admin policies on all tables
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all personas" ON public.personas;
DROP POLICY IF EXISTS "Admins can view all company profiles" ON public.company_profiles;
DROP POLICY IF EXISTS "Admins can view all buyer personas" ON public.buyer_personas;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;

-- Step 2: Create a helper function that checks admin role without hitting RLS.
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 3: Recreate admin policies using the helper function
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all personas"
  ON public.personas FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all company profiles"
  ON public.company_profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all buyer personas"
  ON public.buyer_personas FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (public.is_admin());
