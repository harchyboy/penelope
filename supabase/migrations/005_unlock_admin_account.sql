-- Unlock all personas and set admin role for the first registered user
-- This is a one-time bootstrap for the admin account

UPDATE public.personas SET is_unlocked = true;

UPDATE public.users SET role = 'admin' WHERE email = (
  SELECT email FROM auth.users ORDER BY created_at ASC LIMIT 1
);
