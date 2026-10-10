-- ==============================================================================
-- PADIPPURA COMPREHENSIVE DATABASE SCHEMA & SECURITY POLICIES
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'moderator');
CREATE TYPE verification_status AS ENUM ('none', 'pending', 'verified', 'rejected', 'revoked');
CREATE TYPE resource_status AS ENUM ('draft', 'uploading', 'pending_review', 'approved', 'rejected', 'changes_requested', 'archived', 'removed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'student'::user_role NOT NULL,
    verification_status verification_status DEFAULT 'none'::verification_status NOT NULL,
    target_class TEXT,
    target_stream TEXT,
    reputation_score INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TAXONOMY TABLES
CREATE TABLE IF NOT EXISTS public.boards (
    id TEXT PRIMARY KEY, -- e.g. 'kerala-state', 'cbse'
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY, -- e.g. 'class-8', 'class-9', 'class-10', 'plus-one', 'plus-two'
    board_id TEXT REFERENCES public.boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'Class 10 / SSLC'
    numeric_order INT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.streams (
    id TEXT PRIMARY KEY, -- e.g. 'science', 'commerce', 'humanities', 'general'
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY, -- e.g. 'plus-two-biology'
    class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
    stream_id TEXT REFERENCES public.streams(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE(class_id, slug)
);

CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    UNIQUE(subject_id, slug)
);

CREATE TABLE IF NOT EXISTS public.resource_types (
    id TEXT PRIMARY KEY, -- 'notes', 'question-paper', 'answer-key', 'worksheet', 'practical-manual', 'model-paper'
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT
);

-- 5. ACADEMIC RESOURCES
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    board_id TEXT REFERENCES public.boards(id) ON DELETE RESTRICT NOT NULL,
    class_id TEXT REFERENCES public.classes(id) ON DELETE RESTRICT NOT NULL,
    stream_id TEXT REFERENCES public.streams(id) ON DELETE RESTRICT,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE RESTRICT NOT NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    resource_type_id TEXT REFERENCES public.resource_types(id) ON DELETE RESTRICT NOT NULL,
    language TEXT DEFAULT 'English' NOT NULL,
    
    -- Specific academic exam fields
    exam_year INT,
    exam_type TEXT, -- 'Onam / First Term', 'Christmas / Mid Term', 'Model Exam', 'Public Final Board Exam'
    syllabus_year INT,
    has_answer_key BOOLEAN DEFAULT FALSE,
    download_allowed BOOLEAN DEFAULT TRUE,
    
    -- Storage and Document Details
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    page_count INT DEFAULT 1 NOT NULL,
    file_type TEXT DEFAULT 'application/pdf' NOT NULL,
    
    -- Attribution & Rights
    author_name TEXT,
    school_or_institution TEXT,
    rights_declaration TEXT NOT NULL, -- Confirmation of ownership / permission
    
    -- Ownership & Lifecycle
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status resource_status DEFAULT 'pending_review'::resource_status NOT NULL,
    moderation_notes TEXT,
    moderated_by UUID REFERENCES public.profiles(id),
    moderated_at TIMESTAMPTZ,
    
    -- Cached Aggregated Engagement Counters (Maintained via triggers)
    views_count INT DEFAULT 0 NOT NULL,
    preview_opens INT DEFAULT 0 NOT NULL,
    downloads_count INT DEFAULT 0 NOT NULL,
    saves_count INT DEFAULT 0 NOT NULL,
    rating_sum INT DEFAULT 0 NOT NULL,
    ratings_count INT DEFAULT 0 NOT NULL,
    helpful_count INT DEFAULT 0 NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Search Index
CREATE INDEX IF NOT EXISTS idx_resources_search ON public.resources USING gin (
    to_tsvector('english', title || ' ' || description)
);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_class_subject ON public.resources(class_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_uploader ON public.resources(uploader_id);

-- 6. RATINGS & HELPFUL VOTES
CREATE TABLE IF NOT EXISTS public.resource_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(resource_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.resource_helpful_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(resource_id, user_id)
);

-- 7. BOOKMARKS & COLLECTIONS
CREATE TABLE IF NOT EXISTS public.resource_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(resource_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(collection_id, resource_id)
);

-- 8. READING HISTORY & EVENT TRACKING
CREATE TABLE IF NOT EXISTS public.reading_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    last_read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, resource_id)
);

CREATE TABLE IF NOT EXISTS public.resource_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'view', 'preview_open', 'download', 'bookmark', 'share'
    ip_hash TEXT, -- hashed for privacy and anti-abuse deduplication
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_resource_events_res_type ON public.resource_events(resource_id, event_type);

-- 9. STUDY PRODUCTIVITY TOOLS
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    due_date DATE,
    priority task_priority DEFAULT 'medium'::task_priority NOT NULL,
    status task_status DEFAULT 'pending'::task_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_exam_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    exam_name TEXT NOT NULL,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    exam_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chapter_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'not_started' NOT NULL, -- 'not_started', 'in_progress', 'revised', 'needs_practice'
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, chapter_id)
);

-- 10. TEACHER VERIFICATION REQUESTS
CREATE TABLE IF NOT EXISTS public.teacher_verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    school_name TEXT NOT NULL,
    subject_specialization TEXT NOT NULL,
    experience_years INT NOT NULL,
    document_proof_path TEXT, -- private bucket path
    status verification_status DEFAULT 'pending'::verification_status NOT NULL,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. REPORTS & MODERATION
CREATE TABLE IF NOT EXISTS public.resource_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status report_status DEFAULT 'pending'::report_status NOT NULL,
    resolved_by UUID REFERENCES public.profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exam_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Public can read basic profile info; Users can update only their own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (role IS NULL OR role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    AND (verification_status IS NULL OR verification_status = (SELECT verification_status FROM public.profiles WHERE id = auth.uid()))
  );

-- Resources: Public can view approved resources. Uploaders can view all their own. Admins view all.
CREATE POLICY "Public can view approved resources" ON public.resources
  FOR SELECT USING (
    status = 'approved' OR 
    (auth.uid() IS NOT NULL AND uploader_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Users can insert pending resources" ON public.resources
  FOR INSERT WITH CHECK (
    auth.uid() = uploader_id AND
    status = 'pending_review'
  );

CREATE POLICY "Uploaders can update their own unapproved resources" ON public.resources
  FOR UPDATE USING (
    auth.uid() = uploader_id AND status IN ('draft', 'pending_review', 'changes_requested')
  )
  WITH CHECK (
    auth.uid() = uploader_id AND
    status IN ('draft', 'pending_review', 'changes_requested')
  );

CREATE POLICY "Admins have full access to resources" ON public.resources
  FOR ALL USING (public.is_admin());

-- Ratings: Viewable by all; Insert/update only own
CREATE POLICY "Ratings viewable by everyone" ON public.resource_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own rating" ON public.resource_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rating" ON public.resource_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rating" ON public.resource_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Helpful Votes
CREATE POLICY "Helpful votes viewable by everyone" ON public.resource_helpful_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own helpful vote" ON public.resource_helpful_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own helpful vote" ON public.resource_helpful_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks: Private to user
CREATE POLICY "Bookmarks private to user" ON public.resource_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Collections & Items: Private to user
CREATE POLICY "Collections private to user" ON public.collections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Collection items accessible to collection owner" ON public.collection_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
  );

-- Reading History: Private to user
CREATE POLICY "Reading history private to user" ON public.reading_history
  FOR ALL USING (auth.uid() = user_id);

-- Study Tasks: Private to user
CREATE POLICY "Study tasks private to user" ON public.study_tasks
  FOR ALL USING (auth.uid() = user_id);

-- User Exam Dates: Private to user
CREATE POLICY "Exam dates private to user" ON public.user_exam_dates
  FOR ALL USING (auth.uid() = user_id);

-- Chapter Progress: Private to user
CREATE POLICY "Chapter progress private to user" ON public.chapter_progress
  FOR ALL USING (auth.uid() = user_id);

-- Notifications: Private to user
CREATE POLICY "Notifications private to user" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Teacher Verification Requests: User sees own; Admin sees all
CREATE POLICY "Users can view and create own verification request" ON public.teacher_verification_requests
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert verification request" ON public.teacher_verification_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage verification requests" ON public.teacher_verification_requests
  FOR UPDATE USING (public.is_admin());

-- Reports: Users can insert; Admins can view/update
CREATE POLICY "Users can create reports" ON public.resource_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view and manage reports" ON public.resource_reports
  FOR ALL USING (public.is_admin());

-- Audit logs: Admins only
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
  FOR SELECT USING (public.is_admin());

-- Storage Bucket Setup (Storage bucket: 'resources' private, 'avatars' public)
-- Executable in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
