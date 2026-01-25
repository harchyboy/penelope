-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
-- Note: This extends Supabase auth.users with app-specific fields
-- The id references auth.users(id) for RLS policies

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  free_persona_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================
-- PERSONAS TABLE
-- ============================================
-- Stores both B2C individual personas and B2B company personas

CREATE TABLE IF NOT EXISTS public.personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('b2c_individual', 'b2b_company', 'b2b_buyer')),
  business_context JSONB NOT NULL,
  persona_data JSONB,
  company_profile JSONB, -- For b2b_company type
  company_id UUID, -- For b2b_buyer type, references parent company
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON public.personas(user_id);
CREATE INDEX IF NOT EXISTS idx_personas_type ON public.personas(type);
CREATE INDEX IF NOT EXISTS idx_personas_company_id ON public.personas(company_id);
CREATE INDEX IF NOT EXISTS idx_personas_created_at ON public.personas(created_at DESC);

-- Self-referencing FK for b2b_buyer linking to b2b_company
ALTER TABLE public.personas
  ADD CONSTRAINT fk_personas_company
  FOREIGN KEY (company_id) REFERENCES public.personas(id) ON DELETE SET NULL;

-- ============================================
-- COMPANY_PROFILES TABLE
-- ============================================
-- Stores B2B company profiles separately for better querying

CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON public.company_profiles(user_id);

-- ============================================
-- BUYER_PERSONAS TABLE
-- ============================================
-- Links buyer personas to company profiles

CREATE TABLE IF NOT EXISTS public.buyer_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_profile_id UUID NOT NULL REFERENCES public.company_profiles(id) ON DELETE CASCADE,
  persona_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for company profile lookups
CREATE INDEX IF NOT EXISTS idx_buyer_personas_company_profile_id ON public.buyer_personas(company_profile_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_personas ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- USERS POLICIES
-- --------------------------------------------

-- Users can read their own record
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own record
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own record (during registration)
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- --------------------------------------------
-- PERSONAS POLICIES
-- --------------------------------------------

-- Users can read their own personas
CREATE POLICY "Users can view own personas"
  ON public.personas
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own personas
CREATE POLICY "Users can insert own personas"
  ON public.personas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own personas
CREATE POLICY "Users can update own personas"
  ON public.personas
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own personas
CREATE POLICY "Users can delete own personas"
  ON public.personas
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can read all personas
CREATE POLICY "Admins can view all personas"
  ON public.personas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- --------------------------------------------
-- COMPANY_PROFILES POLICIES
-- --------------------------------------------

-- Users can read their own company profiles
CREATE POLICY "Users can view own company profiles"
  ON public.company_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own company profiles
CREATE POLICY "Users can insert own company profiles"
  ON public.company_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own company profiles
CREATE POLICY "Users can update own company profiles"
  ON public.company_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own company profiles
CREATE POLICY "Users can delete own company profiles"
  ON public.company_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can read all company profiles
CREATE POLICY "Admins can view all company profiles"
  ON public.company_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- --------------------------------------------
-- BUYER_PERSONAS POLICIES
-- --------------------------------------------

-- Users can read buyer personas linked to their company profiles
CREATE POLICY "Users can view own buyer personas"
  ON public.buyer_personas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_profiles
      WHERE id = buyer_personas.company_profile_id
      AND user_id = auth.uid()
    )
  );

-- Users can insert buyer personas to their company profiles
CREATE POLICY "Users can insert own buyer personas"
  ON public.buyer_personas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_profiles
      WHERE id = company_profile_id
      AND user_id = auth.uid()
    )
  );

-- Users can update buyer personas linked to their company profiles
CREATE POLICY "Users can update own buyer personas"
  ON public.buyer_personas
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.company_profiles
      WHERE id = buyer_personas.company_profile_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_profiles
      WHERE id = company_profile_id
      AND user_id = auth.uid()
    )
  );

-- Users can delete buyer personas linked to their company profiles
CREATE POLICY "Users can delete own buyer personas"
  ON public.buyer_personas
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.company_profiles
      WHERE id = buyer_personas.company_profile_id
      AND user_id = auth.uid()
    )
  );

-- Admins can read all buyer personas
CREATE POLICY "Admins can view all buyer personas"
  ON public.buyer_personas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FUNCTIONS FOR UPDATED_AT
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_personas_updated_at
  BEFORE UPDATE ON public.personas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
