-- ==============================================================================
-- USERNAME-BASED AUTHENTICATION & EXTENDED TEACHER/STUDENT FIELDS
-- ==============================================================================

-- 1. Create Private Credentials Table
CREATE TABLE IF NOT EXISTS public.auth_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    username_normalized TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'student'::user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMPTZ
);

-- Index for normalized fast search
CREATE INDEX IF NOT EXISTS idx_auth_credentials_normalized ON public.auth_credentials(username_normalized);

-- 2. Extend Profiles with Onboarding Fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education_board TEXT DEFAULT 'kerala-state';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subjects_taught TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS classes_taught TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'English';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

-- 3. Row Level Security for Credentials
ALTER TABLE public.auth_credentials ENABLE ROW LEVEL SECURITY;

-- Deny all client-side direct access to credentials table
-- Only server functions (service-role or security definer) can query/write password hashes
CREATE POLICY "Deny all client direct access to credentials" ON public.auth_credentials
    FOR ALL USING (false);
