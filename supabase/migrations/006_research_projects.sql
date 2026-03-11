-- ============================================
-- RESEARCH PROJECTS TABLE
-- ============================================
-- Groups personas under research projects for the Research Workspace feature.

CREATE TABLE IF NOT EXISTS public.research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('b2c_individual', 'b2b_company')),
  business_context JSONB NOT NULL,
  company_profile_id UUID REFERENCES public.company_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_research_projects_user_id ON public.research_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_created_at ON public.research_projects(created_at DESC);

-- Updated_at trigger
CREATE TRIGGER set_research_projects_updated_at
  BEFORE UPDATE ON public.research_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;

-- Users can read their own research projects
CREATE POLICY "Users can view own research projects"
  ON public.research_projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own research projects
CREATE POLICY "Users can insert own research projects"
  ON public.research_projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own research projects
CREATE POLICY "Users can update own research projects"
  ON public.research_projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own research projects
CREATE POLICY "Users can delete own research projects"
  ON public.research_projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can read all research projects
CREATE POLICY "Admins can view all research projects"
  ON public.research_projects
  FOR SELECT
  USING (public.is_admin());

-- ============================================
-- ALTER PERSONAS TABLE
-- ============================================
-- Add research_project_id column to link personas to research projects.

ALTER TABLE public.personas
  ADD COLUMN IF NOT EXISTS research_project_id UUID REFERENCES public.research_projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_personas_research_project_id ON public.personas(research_project_id);

-- ============================================
-- BACKFILL: Create research projects from existing personas
-- ============================================
-- Group existing personas by user_id + business_name + type and create research projects.

INSERT INTO public.research_projects (user_id, title, type, business_context)
SELECT DISTINCT ON (p.user_id, p.business_context->>'business_name', p.type)
  p.user_id,
  COALESCE(p.business_context->>'business_name', 'Untitled Research') AS title,
  p.type,
  p.business_context
FROM public.personas p
WHERE p.user_id IS NOT NULL
  AND p.type IN ('b2c_individual', 'b2b_company')
ORDER BY p.user_id, p.business_context->>'business_name', p.type, p.created_at ASC;

-- Link existing personas to their research projects
UPDATE public.personas p
SET research_project_id = rp.id
FROM public.research_projects rp
WHERE p.user_id = rp.user_id
  AND p.type = rp.type
  AND p.business_context->>'business_name' = rp.title
  AND p.research_project_id IS NULL;
