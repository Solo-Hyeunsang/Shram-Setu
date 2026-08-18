-- =============================================================================
-- Shram Setu (श्रम सेतु) — PostgreSQL Schema (Supabase)
-- Version: 0.3 (Prototype — Two-Platform Architecture)
-- Generated from Product Requirements Document
-- =============================================================================
-- This schema is designed for a single Supabase project shared by:
--   1. Main Platform (RBC)  — workers & employers
--   2. Admin Platform       — admin + verifier roles
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE public.user_role AS ENUM (
  'worker',
  'employer',
  'admin',
  'verifier'
);

CREATE TYPE public.availability_status AS ENUM (
  'available',
  'busy',
  'not_taking_work'
);

CREATE TYPE public.verification_status AS ENUM (
  'unverified',
  'pending',
  'in_review',
  'verified',
  'rejected',
  'more_info_needed'
);

CREATE TYPE public.employer_type AS ENUM (
  'individual',
  'business',
  'government',
  'ngo'
);

CREATE TYPE public.institution_type AS ENUM (
  'government',
  'training_institute',
  'industry_body'
);

CREATE TYPE public.institution_member_role AS ENUM (
  'institution_admin',
  'reviewer'
);

CREATE TYPE public.verification_request_status AS ENUM (
  'pending',
  'in_review',
  'approved',
  'rejected',
  'more_info_needed'
);

CREATE TYPE public.job_status AS ENUM (
  'open',
  'applications_received',
  'assigned',
  'completed',
  'cancelled'
);

CREATE TYPE public.application_status AS ENUM (
  'pending',
  'accepted',
  'rejected'
);

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles (extends Supabase auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role            public.user_role NOT NULL,
  full_name       TEXT NOT NULL,
  phone           TEXT UNIQUE,
  email           TEXT UNIQUE,
  avatar_url      TEXT,
  district        TEXT,
  municipality    TEXT,
  bio             TEXT,
  is_suspended    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT profiles_phone_or_email_check
    CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

COMMENT ON TABLE public.profiles IS
  'Base profile for all users. admin/verifier accounts live on the Admin Platform; worker/employer on the Main Platform (RBC).';

-- -----------------------------------------------------------------------------
-- trades (skill taxonomy)
-- -----------------------------------------------------------------------------
CREATE TABLE public.trades (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name_en       TEXT NOT NULL,
  name_ne       TEXT,
  icon          TEXT,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.trades IS
  'Broad occupation categories (e.g. Electrician, Plumber, Mason).';

-- -----------------------------------------------------------------------------
-- worker_profiles (extends profiles for workers)
-- -----------------------------------------------------------------------------
CREATE TABLE public.worker_profiles (
  id                          UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  primary_trade               TEXT REFERENCES public.trades(slug),
  years_experience            INTEGER CHECK (years_experience IS NULL OR years_experience >= 0),
  daily_wage_min              INTEGER CHECK (daily_wage_min IS NULL OR daily_wage_min >= 0),
  daily_wage_max              INTEGER CHECK (daily_wage_max IS NULL OR daily_wage_max >= 0),
  availability                public.availability_status NOT NULL DEFAULT 'available',
  verification_status         public.verification_status NOT NULL DEFAULT 'unverified',
  verified_at                 TIMESTAMPTZ,
  verified_by_institution_id  UUID,  -- FK added after institutions table
  average_rating              DECIMAL(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews               INTEGER NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  total_jobs_completed        INTEGER NOT NULL DEFAULT 0 CHECK (total_jobs_completed >= 0),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT worker_wage_range_check
    CHECK (
      daily_wage_min IS NULL
      OR daily_wage_max IS NULL
      OR daily_wage_min <= daily_wage_max
    )
);

COMMENT ON TABLE public.worker_profiles IS
  'Worker-specific profile data. verification_status is synced from verification_requests via trigger.';

-- -----------------------------------------------------------------------------
-- employer_profiles (extends profiles for employers)
-- -----------------------------------------------------------------------------
CREATE TABLE public.employer_profiles (
  id                UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  employer_type     public.employer_type NOT NULL DEFAULT 'individual',
  company_name      TEXT,
  average_rating    DECIMAL(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews     INTEGER NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.employer_profiles IS
  'Employer-specific profile data (individual, business, government, NGO).';

-- -----------------------------------------------------------------------------
-- worker_skills (many-to-many: workers ↔ specific skills)
-- -----------------------------------------------------------------------------
CREATE TABLE public.worker_skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id   UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  skill_name  TEXT NOT NULL,
  trade_id    UUID REFERENCES public.trades(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT worker_skills_unique UNIQUE (worker_id, skill_name)
);

COMMENT ON TABLE public.worker_skills IS
  'Specific competencies within a trade (e.g. "Residential Wiring" under Electrician).';

-- -----------------------------------------------------------------------------
-- certifications
-- -----------------------------------------------------------------------------
CREATE TABLE public.certifications (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id               UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  title                   TEXT NOT NULL,
  issuing_body            TEXT,
  issue_date              DATE,
  expiry_date             DATE,
  document_url            TEXT,
  is_institution_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.certifications IS
  'Worker-uploaded certificates. is_institution_verified is set true by verifier role upon approval.';

-- -----------------------------------------------------------------------------
-- portfolio_items
-- -----------------------------------------------------------------------------
CREATE TABLE public.portfolio_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id   UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.portfolio_items IS
  'Photos of past work with optional captions.';

-- =============================================================================
-- INSTITUTION & VERIFICATION TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- institutions
-- -----------------------------------------------------------------------------
CREATE TABLE public.institutions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  type            public.institution_type NOT NULL DEFAULT 'government',
  trades_covered  UUID[] DEFAULT '{}',
  logo_url        TEXT,
  contact_email   TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.institutions IS
  'Accredited bodies authorized to verify worker credentials. Prototype seeds only CTEVT.';

-- Add FK from worker_profiles now that institutions exists
ALTER TABLE public.worker_profiles
  ADD CONSTRAINT worker_profiles_verified_by_institution_id_fkey
  FOREIGN KEY (verified_by_institution_id)
  REFERENCES public.institutions(id)
  ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- institution_members (staff who can review verifications)
-- -----------------------------------------------------------------------------
CREATE TABLE public.institution_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id  UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_role     public.institution_member_role NOT NULL DEFAULT 'reviewer',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT institution_members_unique UNIQUE (institution_id, user_id)
);

COMMENT ON TABLE public.institution_members IS
  'Links verifier-role profiles to an institution. RLS scopes verification access by institution_id.';

-- -----------------------------------------------------------------------------
-- verification_requests (the audit trail)
-- -----------------------------------------------------------------------------
CREATE TABLE public.verification_requests (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id           UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  institution_id      UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
  status              public.verification_request_status NOT NULL DEFAULT 'pending',
  reviewer_id         UUID REFERENCES public.institution_members(id) ON DELETE SET NULL,
  reviewer_notes      TEXT,
  rejection_reason    TEXT,
  more_info_message   TEXT,
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.verification_requests IS
  'Immutable audit trail of verification decisions. Workers can re-submit by creating a new row.';

-- =============================================================================
-- JOB & INTERACTION TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- jobs
-- -----------------------------------------------------------------------------
CREATE TABLE public.jobs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id         UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  trade_id            UUID REFERENCES public.trades(id) ON DELETE SET NULL,
  description         TEXT,
  district            TEXT,
  municipality        TEXT,
  duration_days       INTEGER CHECK (duration_days IS NULL OR duration_days > 0),
  budget_min          INTEGER CHECK (budget_min IS NULL OR budget_min >= 0),
  budget_max          INTEGER CHECK (budget_max IS NULL OR budget_max >= 0),
  status              public.job_status NOT NULL DEFAULT 'open',
  assigned_worker_id  UUID REFERENCES public.worker_profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT jobs_budget_range_check
    CHECK (
      budget_min IS NULL
      OR budget_max IS NULL
      OR budget_min <= budget_max
    )
);

COMMENT ON TABLE public.jobs IS
  'Job postings by employers. Status flow: open → applications_received → assigned → completed (or cancelled).';

-- -----------------------------------------------------------------------------
-- job_applications
-- -----------------------------------------------------------------------------
CREATE TABLE public.job_applications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id      UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id   UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  message     TEXT,
  status      public.application_status NOT NULL DEFAULT 'pending',
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT job_applications_unique UNIQUE (job_id, worker_id)
);

COMMENT ON TABLE public.job_applications IS
  'Worker expressions of interest on a job. One application per worker per job.';

-- -----------------------------------------------------------------------------
-- reviews
-- -----------------------------------------------------------------------------
CREATE TABLE public.reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id        UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  reviewer_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT reviews_no_self_review CHECK (reviewer_id <> reviewee_id),
  CONSTRAINT reviews_unique_per_job_pair UNIQUE (job_id, reviewer_id, reviewee_id)
);

COMMENT ON TABLE public.reviews IS
  'Write-once ratings (1–5) after a job is marked completed. Public and non-editable.';

-- -----------------------------------------------------------------------------
-- bookmarks
-- -----------------------------------------------------------------------------
CREATE TABLE public.bookmarks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id   UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  worker_id     UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT bookmarks_unique UNIQUE (employer_id, worker_id)
);

COMMENT ON TABLE public.bookmarks IS
  'Employers can save / bookmark workers for later.';

-- -----------------------------------------------------------------------------
-- notifications
-- -----------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS
  'In-app notifications. Types include: new_application, application_accepted, new_review, verification_approved, verification_rejected, new_verification_request, etc.';

-- =============================================================================
-- INDEXES
-- =============================================================================

-- profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_district ON public.profiles(district);
CREATE INDEX idx_profiles_is_suspended ON public.profiles(is_suspended);

-- worker_profiles
CREATE INDEX idx_worker_profiles_primary_trade ON public.worker_profiles(primary_trade);
CREATE INDEX idx_worker_profiles_verification_status ON public.worker_profiles(verification_status);
CREATE INDEX idx_worker_profiles_availability ON public.worker_profiles(availability);
CREATE INDEX idx_worker_profiles_average_rating ON public.worker_profiles(average_rating DESC);

-- employer_profiles
CREATE INDEX idx_employer_profiles_employer_type ON public.employer_profiles(employer_type);

-- worker_skills
CREATE INDEX idx_worker_skills_worker_id ON public.worker_skills(worker_id);
CREATE INDEX idx_worker_skills_trade_id ON public.worker_skills(trade_id);

-- certifications
CREATE INDEX idx_certifications_worker_id ON public.certifications(worker_id);

-- portfolio_items
CREATE INDEX idx_portfolio_items_worker_id ON public.portfolio_items(worker_id);

-- institutions
CREATE INDEX idx_institutions_slug ON public.institutions(slug);
CREATE INDEX idx_institutions_is_active ON public.institutions(is_active);

-- institution_members
CREATE INDEX idx_institution_members_institution_id ON public.institution_members(institution_id);
CREATE INDEX idx_institution_members_user_id ON public.institution_members(user_id);

-- verification_requests
CREATE INDEX idx_verification_requests_worker_id ON public.verification_requests(worker_id);
CREATE INDEX idx_verification_requests_institution_id ON public.verification_requests(institution_id);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);
CREATE INDEX idx_verification_requests_submitted_at ON public.verification_requests(submitted_at DESC);

-- jobs
CREATE INDEX idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX idx_jobs_trade_id ON public.jobs(trade_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_district ON public.jobs(district);
CREATE INDEX idx_jobs_assigned_worker_id ON public.jobs(assigned_worker_id);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);

-- job_applications
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_worker_id ON public.job_applications(worker_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

-- reviews
CREATE INDEX idx_reviews_job_id ON public.reviews(job_id);
CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- bookmarks
CREATE INDEX idx_bookmarks_employer_id ON public.bookmarks(employer_id);
CREATE INDEX idx_bookmarks_worker_id ON public.bookmarks(worker_id);

-- notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- updated_at trigger helper
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_worker_profiles_updated_at
  BEFORE UPDATE ON public.worker_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_employer_profiles_updated_at
  BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_verification_requests_updated_at
  BEFORE UPDATE ON public.verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- update_worker_rating()
-- Trigger after review insert: recalculate average_rating and total_reviews
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_worker_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = NEW.reviewee_id;

  IF v_role = 'worker' THEN
    UPDATE public.worker_profiles
    SET
      average_rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
        FROM public.reviews
        WHERE reviewee_id = NEW.reviewee_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE reviewee_id = NEW.reviewee_id
      )
    WHERE id = NEW.reviewee_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_worker_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_worker_rating();

-- -----------------------------------------------------------------------------
-- update_employer_rating()
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_employer_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = NEW.reviewee_id;

  IF v_role = 'employer' THEN
    UPDATE public.employer_profiles
    SET
      average_rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
        FROM public.reviews
        WHERE reviewee_id = NEW.reviewee_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE reviewee_id = NEW.reviewee_id
      )
    WHERE id = NEW.reviewee_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_employer_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_employer_rating();

-- -----------------------------------------------------------------------------
-- increment_jobs_completed()
-- Trigger when job status → completed
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_jobs_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed'
     AND (OLD.status IS DISTINCT FROM 'completed')
     AND NEW.assigned_worker_id IS NOT NULL
  THEN
    UPDATE public.worker_profiles
    SET total_jobs_completed = total_jobs_completed + 1
    WHERE id = NEW.assigned_worker_id;

    NEW.completed_at = COALESCE(NEW.completed_at, NOW());
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_jobs_completed
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.increment_jobs_completed();

-- -----------------------------------------------------------------------------
-- sync_verification_status()
-- Trigger when verification_requests.status changes
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_verification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Map verification_request_status → worker verification_status
  IF NEW.status = 'approved' THEN
    UPDATE public.worker_profiles
    SET
      verification_status = 'verified',
      verified_at = COALESCE(NEW.reviewed_at, NOW()),
      verified_by_institution_id = NEW.institution_id
    WHERE id = NEW.worker_id;

    -- Mark related certifications as institution-verified
    UPDATE public.certifications
    SET is_institution_verified = TRUE
    WHERE worker_id = NEW.worker_id;

  ELSIF NEW.status = 'rejected' THEN
    UPDATE public.worker_profiles
    SET verification_status = 'rejected'
    WHERE id = NEW.worker_id;

  ELSIF NEW.status = 'more_info_needed' THEN
    UPDATE public.worker_profiles
    SET verification_status = 'more_info_needed'
    WHERE id = NEW.worker_id;

  ELSIF NEW.status = 'in_review' THEN
    UPDATE public.worker_profiles
    SET verification_status = 'in_review'
    WHERE id = NEW.worker_id;

  ELSIF NEW.status = 'pending' THEN
    UPDATE public.worker_profiles
    SET verification_status = 'pending'
    WHERE id = NEW.worker_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_verification_status
  AFTER INSERT OR UPDATE OF status ON public.verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.sync_verification_status();

-- -----------------------------------------------------------------------------
-- create_notification() helper (callable via RPC or from other triggers)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id   UUID,
  p_type      TEXT,
  p_title     TEXT,
  p_message   TEXT DEFAULT NULL,
  p_metadata  JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_metadata)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- Notify worker on verification decision
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_verification_decision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'approved' THEN
      PERFORM public.create_notification(
        NEW.worker_id,
        'verification_approved',
        'Verification Approved',
        'Your credentials have been verified. A Government Verified badge is now on your profile.',
        jsonb_build_object('verification_request_id', NEW.id)
      );
    ELSIF NEW.status = 'rejected' THEN
      PERFORM public.create_notification(
        NEW.worker_id,
        'verification_rejected',
        'Verification Rejected',
        COALESCE(NEW.rejection_reason, 'Your verification request was rejected. Please update documents and re-submit.'),
        jsonb_build_object('verification_request_id', NEW.id, 'rejection_reason', NEW.rejection_reason)
      );
    ELSIF NEW.status = 'more_info_needed' THEN
      PERFORM public.create_notification(
        NEW.worker_id,
        'verification_more_info',
        'More Information Needed',
        COALESCE(NEW.more_info_message, 'Please provide additional documents for your verification request.'),
        jsonb_build_object('verification_request_id', NEW.id, 'more_info_message', NEW.more_info_message)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_verification_decision
  AFTER UPDATE OF status ON public.verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_verification_decision();

-- -----------------------------------------------------------------------------
-- Notify employer on new application
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_employer_id UUID;
  v_job_title TEXT;
BEGIN
  SELECT employer_id, title INTO v_employer_id, v_job_title
  FROM public.jobs
  WHERE id = NEW.job_id;

  PERFORM public.create_notification(
    v_employer_id,
    'new_application',
    'New Job Application',
    'A worker applied to your job: ' || COALESCE(v_job_title, 'Untitled'),
    jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id, 'worker_id', NEW.worker_id)
  );

  -- Bump job status if still open
  UPDATE public.jobs
  SET status = 'applications_received'
  WHERE id = NEW.job_id AND status = 'open';

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_new_application
  AFTER INSERT ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_application();

-- -----------------------------------------------------------------------------
-- Notify worker on application accepted / rejected
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_application_decision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_title TEXT;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title INTO v_job_title FROM public.jobs WHERE id = NEW.job_id;

    IF NEW.status = 'accepted' THEN
      PERFORM public.create_notification(
        NEW.worker_id,
        'application_accepted',
        'Application Accepted',
        'Your application for "' || COALESCE(v_job_title, 'a job') || '" was accepted.',
        jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id)
      );
    ELSIF NEW.status = 'rejected' THEN
      PERFORM public.create_notification(
        NEW.worker_id,
        'application_rejected',
        'Application Rejected',
        'Your application for "' || COALESCE(v_job_title, 'a job') || '" was not selected.',
        jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_application_decision
  AFTER UPDATE OF status ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_application_decision();

-- -----------------------------------------------------------------------------
-- Notify on new review
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_new_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.create_notification(
    NEW.reviewee_id,
    'new_review',
    'New Review Received',
    'You received a ' || NEW.rating || '-star review.',
    jsonb_build_object('review_id', NEW.id, 'job_id', NEW.job_id, 'rating', NEW.rating)
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_review();

-- =============================================================================
-- AUTO-CREATE PROFILE ON AUTH SIGNUP (optional helper)
-- =============================================================================
-- Call from your app after signup, or use this trigger if you prefer.
-- Supabase best practice: create profile in a secure edge function or client
-- after verifying role. This function is provided for convenience.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Profile is intentionally created by the application so that role,
  -- full_name, etc. can be set correctly during onboarding.
  -- Uncomment below only if you want a minimal auto-profile:
  --
  -- INSERT INTO public.profiles (id, role, full_name, phone, email)
  -- VALUES (
  --   NEW.id,
  --   'worker',  -- default; app should update
  --   COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
  --   NEW.phone,
  --   NEW.email
  -- );
  RETURN NEW;
END;
$$;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Helper: current user's role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- -----------------------------------------------------------------------------
-- Helper: is current user an active member of a given institution?
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_institution_member(p_institution_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.institution_members
    WHERE institution_id = p_institution_id
      AND user_id = auth.uid()
      AND is_active = TRUE
  );
$$;

-- -----------------------------------------------------------------------------
-- Helper: is current user a verifier for the institution that owns this request?
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.can_review_request(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.verification_requests vr
    JOIN public.institution_members im
      ON im.institution_id = vr.institution_id
     AND im.user_id = auth.uid()
     AND im.is_active = TRUE
    WHERE vr.id = p_request_id
  );
$$;

-- =============================================================================
-- RLS POLICIES — profiles
-- =============================================================================

-- Anyone authenticated can read non-suspended public profile fields
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (TRUE);

-- Users can update their own profile (but not role or is_suspended)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Users can insert their own profile (onboarding)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Admins can update any profile (suspend, etc.)
CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — worker_profiles
-- =============================================================================

CREATE POLICY "worker_profiles_select_all"
  ON public.worker_profiles FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "worker_profiles_insert_own"
  ON public.worker_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "worker_profiles_update_own"
  ON public.worker_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "worker_profiles_admin_all"
  ON public.worker_profiles FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- Verifiers need to read worker profiles for review
CREATE POLICY "worker_profiles_verifier_select"
  ON public.worker_profiles FOR SELECT
  TO authenticated
  USING (public.current_user_role() = 'verifier');

-- =============================================================================
-- RLS POLICIES — employer_profiles
-- =============================================================================

CREATE POLICY "employer_profiles_select_all"
  ON public.employer_profiles FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "employer_profiles_insert_own"
  ON public.employer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "employer_profiles_update_own"
  ON public.employer_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "employer_profiles_admin_all"
  ON public.employer_profiles FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — trades (public read)
-- =============================================================================

CREATE POLICY "trades_select_all"
  ON public.trades FOR SELECT
  TO authenticated, anon
  USING (TRUE);

CREATE POLICY "trades_admin_write"
  ON public.trades FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — worker_skills
-- =============================================================================

CREATE POLICY "worker_skills_select_all"
  ON public.worker_skills FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "worker_skills_insert_own"
  ON public.worker_skills FOR INSERT
  TO authenticated
  WITH CHECK (worker_id = auth.uid());

CREATE POLICY "worker_skills_update_own"
  ON public.worker_skills FOR UPDATE
  TO authenticated
  USING (worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid());

CREATE POLICY "worker_skills_delete_own"
  ON public.worker_skills FOR DELETE
  TO authenticated
  USING (worker_id = auth.uid());

CREATE POLICY "worker_skills_admin_all"
  ON public.worker_skills FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — certifications
-- Owner + institution reviewers + admin
-- =============================================================================

CREATE POLICY "certifications_select_owner"
  ON public.certifications FOR SELECT
  TO authenticated
  USING (worker_id = auth.uid());

CREATE POLICY "certifications_select_verifier"
  ON public.certifications FOR SELECT
  TO authenticated
  USING (
    public.current_user_role() = 'verifier'
    AND EXISTS (
      SELECT 1
      FROM public.verification_requests vr
      JOIN public.institution_members im
        ON im.institution_id = vr.institution_id
       AND im.user_id = auth.uid()
       AND im.is_active = TRUE
      WHERE vr.worker_id = certifications.worker_id
    )
  );

CREATE POLICY "certifications_select_admin"
  ON public.certifications FOR SELECT
  TO authenticated
  USING (public.current_user_role() = 'admin');

CREATE POLICY "certifications_insert_own"
  ON public.certifications FOR INSERT
  TO authenticated
  WITH CHECK (worker_id = auth.uid());

CREATE POLICY "certifications_update_own"
  ON public.certifications FOR UPDATE
  TO authenticated
  USING (worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid());

CREATE POLICY "certifications_delete_own"
  ON public.certifications FOR DELETE
  TO authenticated
  USING (worker_id = auth.uid());

CREATE POLICY "certifications_admin_all"
  ON public.certifications FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — portfolio_items
-- =============================================================================

CREATE POLICY "portfolio_select_all"
  ON public.portfolio_items FOR SELECT
  TO authenticated, anon
  USING (TRUE);

CREATE POLICY "portfolio_insert_own"
  ON public.portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (worker_id = auth.uid());

CREATE POLICY "portfolio_update_own"
  ON public.portfolio_items FOR UPDATE
  TO authenticated
  USING (worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid());

CREATE POLICY "portfolio_delete_own"
  ON public.portfolio_items FOR DELETE
  TO authenticated
  USING (worker_id = auth.uid());

CREATE POLICY "portfolio_admin_all"
  ON public.portfolio_items FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — institutions
-- =============================================================================

CREATE POLICY "institutions_select_active"
  ON public.institutions FOR SELECT
  TO authenticated, anon
  USING (is_active = TRUE OR public.current_user_role() IN ('admin', 'verifier'));

CREATE POLICY "institutions_admin_all"
  ON public.institutions FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- Institution admins can update their own institution profile
CREATE POLICY "institutions_member_admin_update"
  ON public.institutions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE institution_id = institutions.id
        AND user_id = auth.uid()
        AND member_role = 'institution_admin'
        AND is_active = TRUE
    )
  );

-- =============================================================================
-- RLS POLICIES — institution_members
-- =============================================================================

CREATE POLICY "institution_members_select_own_or_admin"
  ON public.institution_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.current_user_role() = 'admin'
    OR public.is_institution_member(institution_id)
  );

CREATE POLICY "institution_members_admin_all"
  ON public.institution_members FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- Institution admins can manage members of their institution
CREATE POLICY "institution_members_institution_admin_manage"
  ON public.institution_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.institution_members im
      WHERE im.institution_id = institution_members.institution_id
        AND im.user_id = auth.uid()
        AND im.member_role = 'institution_admin'
        AND im.is_active = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.institution_members im
      WHERE im.institution_id = institution_members.institution_id
        AND im.user_id = auth.uid()
        AND im.member_role = 'institution_admin'
        AND im.is_active = TRUE
    )
  );

-- =============================================================================
-- RLS POLICIES — verification_requests
-- =============================================================================

-- Workers can insert their own requests
CREATE POLICY "verification_requests_insert_worker"
  ON public.verification_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    worker_id = auth.uid()
    AND public.current_user_role() = 'worker'
  );

-- Workers can read their own requests
CREATE POLICY "verification_requests_select_own"
  ON public.verification_requests FOR SELECT
  TO authenticated
  USING (worker_id = auth.uid());

-- Verifiers can read requests for their institution only
CREATE POLICY "verification_requests_select_verifier"
  ON public.verification_requests FOR SELECT
  TO authenticated
  USING (
    public.current_user_role() = 'verifier'
    AND public.is_institution_member(institution_id)
  );

-- Verifiers can update (approve/reject/request more info) for their institution
-- Note: admin role CANNOT update verification_requests (separation of concerns)
CREATE POLICY "verification_requests_update_verifier"
  ON public.verification_requests FOR UPDATE
  TO authenticated
  USING (
    public.current_user_role() = 'verifier'
    AND public.is_institution_member(institution_id)
  )
  WITH CHECK (
    public.current_user_role() = 'verifier'
    AND public.is_institution_member(institution_id)
  );

-- Admins can read all verification requests (for oversight) but not act on them
CREATE POLICY "verification_requests_select_admin"
  ON public.verification_requests FOR SELECT
  TO authenticated
  USING (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — jobs
-- =============================================================================

CREATE POLICY "jobs_select_authenticated"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "jobs_insert_employer"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id = auth.uid()
    AND public.current_user_role() = 'employer'
  );

CREATE POLICY "jobs_update_own"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "jobs_admin_all"
  ON public.jobs FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — job_applications
-- =============================================================================

-- Workers can apply
CREATE POLICY "job_applications_insert_worker"
  ON public.job_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    worker_id = auth.uid()
    AND public.current_user_role() = 'worker'
  );

-- Workers can see their own applications
CREATE POLICY "job_applications_select_own_worker"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (worker_id = auth.uid());

-- Employers can see applications on their jobs
CREATE POLICY "job_applications_select_employer"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.employer_id = auth.uid()
    )
  );

-- Employers can update application status (accept/reject)
CREATE POLICY "job_applications_update_employer"
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.employer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "job_applications_admin_all"
  ON public.job_applications FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — reviews
-- =============================================================================

CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT
  TO authenticated, anon
  USING (TRUE);

-- Write-once: insert only, no update/delete by users
CREATE POLICY "reviews_insert_authenticated"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = reviews.job_id
        AND jobs.status = 'completed'
        AND (
          jobs.employer_id = auth.uid()
          OR jobs.assigned_worker_id = auth.uid()
        )
    )
  );

CREATE POLICY "reviews_admin_all"
  ON public.reviews FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — bookmarks
-- =============================================================================

CREATE POLICY "bookmarks_select_own"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING (employer_id = auth.uid());

CREATE POLICY "bookmarks_insert_own"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id = auth.uid()
    AND public.current_user_role() = 'employer'
  );

CREATE POLICY "bookmarks_delete_own"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

CREATE POLICY "bookmarks_admin_all"
  ON public.bookmarks FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- RLS POLICIES — notifications
-- =============================================================================

CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Inserts happen via SECURITY DEFINER functions (create_notification)
CREATE POLICY "notifications_insert_system"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "notifications_admin_all"
  ON public.notifications FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- =============================================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via storage API)
-- =============================================================================
-- The following are documentation comments. Create buckets via Supabase UI
-- or SQL against storage.buckets if preferred.
--
-- Bucket: avatars
--   Public read, authenticated write (own path)
--
-- Bucket: certifications
--   Authenticated read (owner + institution reviewers + admin), owner write
--
-- Bucket: portfolio
--   Public read, owner write
--
-- Bucket: institution-logos
--   Public read, admin write
--
-- Example (if using SQL):
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('avatars', 'avatars', true),
--   ('certifications', 'certifications', false),
--   ('portfolio', 'portfolio', true),
--   ('institution-logos', 'institution-logos', true);

-- =============================================================================
-- SEED DATA (prototype)
-- =============================================================================

-- Trades taxonomy (initial set)
INSERT INTO public.trades (slug, name_en, name_ne, icon, description) VALUES
  ('electrician',    'Electrician',    'इलेक्ट्रीशियन',   'zap',          'Electrical installation, wiring, and repair'),
  ('plumber',        'Plumber',        'प्लम्बर',          'droplet',      'Pipe fitting, water systems, and sanitation'),
  ('carpenter',      'Carpenter',      'सिल्पकार',        'hammer',       'Woodwork, furniture, and structural carpentry'),
  ('mason',          'Mason',          'मिस्त्री',         'brick',        'Brick, stone, and concrete masonry'),
  ('welder',         'Welder',         'वेल्डर',           'flame',        'Metal welding and fabrication'),
  ('mechanic',       'Mechanic',       'मेकानिक',         'wrench',       'Vehicle and machinery repair'),
  ('painter',        'Painter',        'पेन्टर',           'paintbrush',   'Interior and exterior painting'),
  ('construction',   'Construction Worker', 'निर्माण कामदार', 'hard-hat', 'General construction and labour'),
  ('agri-tech',      'Agricultural Technician', 'कृषि प्राविधिक', 'leaf', 'Farm equipment and agri-techniques'),
  ('machine-op',     'Machine Operator', 'मेसिन अपरेटर',   'cog',         'Heavy and light machinery operation');

-- CTEVT institution (prototype only)
INSERT INTO public.institutions (name, slug, type, contact_email, is_active) VALUES
  (
    'Council for Technical Education and Vocational Training (CTEVT)',
    'ctevt',
    'government',
    'info@ctevt.org.np',
    TRUE
  );

-- Link CTEVT to all trades (optional convenience)
UPDATE public.institutions
SET trades_covered = (SELECT ARRAY_AGG(id) FROM public.trades)
WHERE slug = 'ctevt';

-- =============================================================================
-- GRANTS (Supabase default roles)
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
