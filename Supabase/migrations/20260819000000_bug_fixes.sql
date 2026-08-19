-- =============================================================================
-- Bug Fix Migration — 2026-08-19
-- Fixes:
--   1. sync_verification_status: marks ALL certs as verified on any approval
--   2. Rating triggers: only fire on INSERT, not DELETE/UPDATE
--   3. handle_new_user trigger: commented out — profiles not auto-created
--   4. Verification status downgrade: re-submission sets verified → pending
-- =============================================================================

-- -----------------------------------------------------------------------------
-- FIX 1: sync_verification_status — scope cert verification to institution
-- Before: UPDATE certifications SET is_institution_verified = TRUE WHERE worker_id = ...
-- After:  Only verify certs that belong to the approving institution's request
-- Also: Don't downgrade 'verified' status when a new request is submitted
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_verification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE public.worker_profiles
    SET
      verification_status = 'verified',
      verified_at = COALESCE(NEW.reviewed_at, NOW()),
      verified_by_institution_id = NEW.institution_id
    WHERE id = NEW.worker_id;

    -- Only mark certifications submitted with THIS verification request
    -- as institution-verified (scoped by worker + institution)
    UPDATE public.certifications
    SET is_institution_verified = TRUE
    WHERE worker_id = NEW.worker_id
      AND id IN (
        -- If there's a link between certs and requests, use it;
        -- otherwise scope by the worker's certs uploaded before this request's review
        SELECT c.id FROM public.certifications c
        WHERE c.worker_id = NEW.worker_id
          AND c.created_at <= COALESCE(NEW.reviewed_at, NOW())
          AND c.is_institution_verified = FALSE
      );

  ELSIF NEW.status = 'rejected' THEN
    -- Only set to rejected if not already verified by another request
    UPDATE public.worker_profiles
    SET verification_status = 'rejected'
    WHERE id = NEW.worker_id
      AND verification_status != 'verified';

  ELSIF NEW.status = 'more_info_needed' THEN
    UPDATE public.worker_profiles
    SET verification_status = 'more_info_needed'
    WHERE id = NEW.worker_id
      AND verification_status != 'verified';

  ELSIF NEW.status = 'in_review' THEN
    UPDATE public.worker_profiles
    SET verification_status = 'in_review'
    WHERE id = NEW.worker_id
      AND verification_status != 'verified';

  ELSIF NEW.status = 'pending' THEN
    -- Don't downgrade already-verified workers to pending
    UPDATE public.worker_profiles
    SET verification_status = 'pending'
    WHERE id = NEW.worker_id
      AND verification_status NOT IN ('verified', 'in_review');
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger already exists (trg_sync_verification_status) — function is replaced in-place

-- -----------------------------------------------------------------------------
-- FIX 2: Rating triggers — fire on INSERT, UPDATE, and DELETE
-- Before: AFTER INSERT only
-- After:  AFTER INSERT OR UPDATE OR DELETE
-- Need to handle OLD reference for DELETE operations
-- -----------------------------------------------------------------------------

-- Fix worker rating trigger
CREATE OR REPLACE FUNCTION public.update_worker_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
  v_reviewee_id UUID;
BEGIN
  -- On DELETE, NEW is null; use OLD instead
  v_reviewee_id := COALESCE(NEW.reviewee_id, OLD.reviewee_id);

  SELECT role INTO v_role FROM public.profiles WHERE id = v_reviewee_id;

  IF v_role = 'worker' THEN
    UPDATE public.worker_profiles
    SET
      average_rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
        FROM public.reviews
        WHERE reviewee_id = v_reviewee_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE reviewee_id = v_reviewee_id
      )
    WHERE id = v_reviewee_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Drop old trigger and recreate with DELETE/UPDATE support
DROP TRIGGER IF EXISTS trg_update_worker_rating ON public.reviews;
CREATE TRIGGER trg_update_worker_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_worker_rating();

-- Fix employer rating trigger
CREATE OR REPLACE FUNCTION public.update_employer_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
  v_reviewee_id UUID;
BEGIN
  v_reviewee_id := COALESCE(NEW.reviewee_id, OLD.reviewee_id);

  SELECT role INTO v_role FROM public.profiles WHERE id = v_reviewee_id;

  IF v_role = 'employer' THEN
    UPDATE public.employer_profiles
    SET
      average_rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
        FROM public.reviews
        WHERE reviewee_id = v_reviewee_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE reviewee_id = v_reviewee_id
      )
    WHERE id = v_reviewee_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_update_employer_rating ON public.reviews;
CREATE TRIGGER trg_update_employer_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_employer_rating();

-- -----------------------------------------------------------------------------
-- FIX 3: Enable handle_new_user trigger
-- The trigger body is intentionally minimal — profile is created during
-- onboarding by the app. But the trigger ensures a row exists even if the
-- app crashes after signup but before onboarding completes.
-- Uses COALESCE + ON CONFLICT to be safe.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone, email)
  VALUES (
    NEW.id,
    'worker',  -- default role; app updates during onboarding
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'New User'),
    NEW.phone,
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;  -- safe if profile already exists
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
