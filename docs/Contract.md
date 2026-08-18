# Shram Setu (श्रम सेतु) — Backend API & Contracts Specification

**Document:** `Contract.md`  
**Version:** 0.3 (Prototype)  
**Last Updated:** 18 August 2026  
**Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)  
**Clients:** Main Platform (RBC), Admin Platform  

---

## 1. Purpose & Scope

This specification defines the **contracts** between client applications and the shared Supabase backend:

- Authentication contracts  
- Data entity contracts (tables / views as API resources)  
- Mutation & query contracts (allowed operations, filters, side effects)  
- Storage contracts  
- Database function / RPC contracts  
- Error and status conventions  
- Role-based access matrix  

It is the formal companion to `api.md` (client usage guide) and `schema.sql` (physical schema). Where they differ, **`schema.sql` + RLS policies** are the runtime source of truth; this document describes the intended contract.

### 1.1 Out of scope

- Custom REST or GraphQL gateway (none in prototype)  
- Payment, chat, push, or government API integrations  
- Versioned public third-party API  

### 1.2 Contract style

Clients use the **Supabase JS client** against:

| Surface | Contract type |
|---------|----------------|
| `supabase.auth.*` | Auth API |
| `supabase.from('<table>')` | PostgREST-style table API (filtered by RLS) |
| `supabase.storage.from('<bucket>')` | Storage API |
| `supabase.rpc('<fn>', args)` | RPC / database functions |

There are **no numeric HTTP status codes owned by Shram Setu** beyond what Supabase/PostgREST returns. Clients must treat Supabase `error` objects as the failure channel.

---

## 2. Conventions

### 2.1 Identifiers

| Field | Type | Notes |
|-------|------|--------|
| Primary keys | `UUID` | `uuid_generate_v4()` or `auth.users.id` |
| Foreign keys | `UUID` | Match referenced PK |
| Timestamps | `timestamptz` | ISO-8601 in JSON |
| Money (NPR) | `integer` | Whole rupees; no decimals in prototype |
| Ratings | `integer` 1–5; averages `decimal(3,2)` | |

### 2.2 Naming

- Database and wire fields: **snake_case**  
- Enum values: **snake_case** strings as defined in `schema.sql`  
- Clients may map to camelCase in UI only; contracts below use snake_case  

### 2.3 Response envelope (client-normalized)

API modules SHOULD normalize Supabase results to:

```ts
// Conceptual contract (JS projects implement without TypeScript)
{ data: T | T[] | null, error: ErrorShape | null }
```

```ts
ErrorShape = {
  message: string,      // human-safe or logged
  code?: string,        // Postgres / PostgREST code when present
  details?: string,
  hint?: string
}
```

### 2.4 Pagination (prototype)

| Pattern | Contract |
|---------|----------|
| Default list | `select` + `order` + optional `limit` / `range` |
| Prototype recommendation | `limit` 20–50 for queues and search; page via `.range(from, to)` |

No cursor protocol required for prototype.

### 2.5 Idempotency

| Operation | Idempotent? | Notes |
|-----------|-------------|--------|
| Profile update | Yes | Same payload → same state |
| Job apply | No (unique constraint) | Second apply same job+worker → unique violation |
| Review insert | No (unique per job/pair) | Duplicate → constraint error |
| Verification re-submit | New row | Intentionally non-idempotent; creates audit history |
| Approve/reject request | Conditional | Update by id + institution scope |

---

## 3. Roles & Actors

| Role | `profiles.role` | Primary client | Auth method |
|------|-----------------|----------------|-------------|
| Worker | `worker` | Main Platform | Phone OTP |
| Employer | `employer` | Main Platform | Phone OTP or email magic link |
| Admin | `admin` | Admin Platform | Email + password |
| Verifier | `verifier` | Admin Platform | Email + password |

**Verifier tenancy:** Access to verification data is further scoped by `institution_members(institution_id, user_id, is_active)`.

**Suspended users:** `profiles.is_suspended = true` → clients MUST deny app access after session load (contractual UX); RLS still protects rows.

---

## 4. Authentication Contracts

### 4.1 Main Platform — phone OTP

| Step | Client call | Success contract |
|------|-------------|------------------|
| Request OTP | `auth.signInWithOtp({ phone })` | No session yet; delivery side-effect |
| Verify OTP | `auth.verifyOtp({ phone, token, type: 'sms' })` | Session + `user.id` |
| Session | `auth.getSession()` | `{ session, user }` or null |
| Sign out | `auth.signOut()` | Session cleared |

**Post-condition (app-level):** Client MUST create `profiles` + (`worker_profiles` | `employer_profiles`) if missing before using domain features.

### 4.2 Main Platform — email magic link

| Step | Client call | Success contract |
|------|-------------|------------------|
| Request link | `auth.signInWithOtp({ email })` | Email sent |
| Complete | User opens link; session established via Supabase redirect handling | Session present |

### 4.3 Admin Platform — password

| Step | Client call | Success contract |
|------|-------------|------------------|
| Login | `auth.signInWithPassword({ email, password })` | Session; user must already have `profiles.role` in (`admin`,`verifier`) |
| Role resolve | `from('profiles').select(...).eq('id', user.id)` + optional `institution_members` | Role routing input |

### 4.4 Auth error contract

Clients MUST handle at least:

| Condition | Expected handling |
|-----------|-------------------|
| Invalid OTP / credentials | User-visible auth error |
| Network failure | Retry-safe message |
| Suspended profile | Sign out + suspended message |
| Missing profile row | Force onboarding / contact admin (admin users) |

---

## 5. Entity Contracts

### 5.1 `profiles`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | uuid | PK | = `auth.users.id` |
| role | enum | yes | `worker` \| `employer` \| `admin` \| `verifier` |
| full_name | text | yes | |
| phone | text | unique, nullable | Required for most workers |
| email | text | unique, nullable | |
| avatar_url | text | no | Storage URL/path |
| district | text | no | |
| municipality | text | no | |
| bio | text | no | |
| is_suspended | bool | default false | Admin-controlled |
| created_at / updated_at | timestamptz | auto | |

**Operations**

| Op | Actor | Contract |
|----|-------|----------|
| INSERT | Authenticated self | `id = auth.uid()`; role set at onboarding |
| SELECT | Authenticated | Broad read (public marketplace fields) |
| UPDATE | Owner | Own row; must not self-escalate role or clear suspension |
| UPDATE | Admin | Any row (suspend/unsuspend, moderation) |

**Invariant:** `phone IS NOT NULL OR email IS NOT NULL`.

---

### 5.2 `worker_profiles`

| Field | Type | Notes |
|-------|------|--------|
| id | uuid PK/FK → profiles | |
| primary_trade | text FK → trades.slug | |
| years_experience | int ≥ 0 | |
| daily_wage_min / max | int ≥ 0 | min ≤ max |
| availability | enum | `available` \| `busy` \| `not_taking_work` |
| verification_status | enum | Synced from verification_requests |
| verified_at | timestamptz | Set on approve |
| verified_by_institution_id | uuid | Set on approve |
| average_rating | decimal | Trigger-maintained |
| total_reviews | int | Trigger-maintained |
| total_jobs_completed | int | Trigger-maintained |

**Operations:** Owner insert/update own row; authenticated select; admin all; verifier select for review context.

**Contractual rule:** Clients MUST NOT set `verification_status`, `verified_at`, `verified_by_institution_id`, or rating aggregates directly. Those are **system-owned** (triggers / verifier flow).

---

### 5.3 `employer_profiles`

| Field | Type | Notes |
|-------|------|--------|
| id | uuid PK/FK → profiles | |
| employer_type | enum | `individual` \| `business` \| `government` \| `ngo` |
| company_name | text | Optional |
| average_rating / total_reviews | system-maintained | |

**Operations:** Owner CRUD-ish (insert/update own); authenticated select; admin all.

---

### 5.4 `trades`

| Field | Type | Notes |
|-------|------|--------|
| id | uuid | |
| slug | text unique | Stable API key (e.g. `electrician`) |
| name_en / name_ne | text | |
| icon | text | Icon key |
| description | text | |

**Operations:** Public/authenticated SELECT; admin write only. Seeded at deploy.

---

### 5.5 `worker_skills`

| Field | Type | Notes |
|-------|------|--------|
| worker_id | uuid | Owner |
| skill_name | text | |
| trade_id | uuid | Optional parent trade |

**Unique:** `(worker_id, skill_name)`  
**Operations:** Owner insert/update/delete; authenticated select.

---

### 5.6 `certifications`

| Field | Type | Notes |
|-------|------|--------|
| worker_id | uuid | Owner |
| title | text | |
| issuing_body | text | e.g. CTEVT |
| issue_date / expiry_date | date | |
| document_url | text | Storage path preferred |
| is_institution_verified | bool | System-set on approval |

**Operations:** Owner write; SELECT for owner, relevant verifiers, admin.  
**Contract:** `is_institution_verified` is **read-only** for workers.

---

### 5.7 `portfolio_items`

| Field | Type | Notes |
|-------|------|--------|
| worker_id | uuid | |
| image_url | text | Public bucket URL/path |
| caption | text | |

**Operations:** Owner write; public/authenticated read; admin delete for moderation.

---

### 5.8 `institutions`

| Field | Type | Notes |
|-------|------|--------|
| name / slug | text | Prototype: CTEVT / `ctevt` |
| type | enum | government, training_institute, industry_body |
| trades_covered | uuid[] | |
| contact_email | text | |
| is_active | bool | |

**Operations:** Read active (or admin/verifier read); admin write; institution_admin may update own institution profile.

---

### 5.9 `institution_members`

| Field | Type | Notes |
|-------|------|--------|
| institution_id | uuid | |
| user_id | uuid | profile with role verifier |
| member_role | enum | `institution_admin` \| `reviewer` |
| is_active | bool | |

**Unique:** `(institution_id, user_id)`  
**Operations:** Admin manage; institution_admin manage peers; members can read own membership.

---

### 5.10 `verification_requests`

| Field | Type | Notes |
|-------|------|--------|
| worker_id | uuid | Requester |
| institution_id | uuid | Prototype: CTEVT |
| status | enum | `pending` \| `in_review` \| `approved` \| `rejected` \| `more_info_needed` |
| reviewer_id | uuid | institution_members.id |
| reviewer_notes | text | Internal |
| rejection_reason | text | Shown to worker |
| more_info_message | text | Shown to worker |
| submitted_at / reviewed_at | timestamptz | |

**Operations**

| Op | Actor | Contract |
|----|-------|----------|
| INSERT | Worker (self) | status defaults `pending`; institution CTEVT |
| SELECT | Worker | Own rows only |
| SELECT | Verifier | Rows where `institution_id` is theirs |
| UPDATE | Verifier | Status transitions + notes/reasons for own institution |
| SELECT | Admin | All rows (oversight) |
| UPDATE | Admin | **Forbidden** by contract and RLS |

**Status transition contract (verifier)**

| From | To | Required fields |
|------|----|-----------------|
| pending | in_review | reviewer_id recommended |
| in_review / pending | approved | reviewer_notes recommended; reviewed_at set |
| * | rejected | rejection_reason **required** (app-level); reviewed_at set |
| * | more_info_needed | more_info_message **required** (app-level); reviewed_at set |

**Side effects (system):**

- Sync `worker_profiles.verification_status`  
- On approved: set `verified_at`, `verified_by_institution_id`; mark certifications verified  
- Notify worker on approved / rejected / more_info_needed  

**Re-submit contract:** Worker inserts a **new** row; previous rows remain immutable history.

---

### 5.11 `jobs`

| Field | Type | Notes |
|-------|------|--------|
| employer_id | uuid | Owner |
| title | text | |
| trade_id | uuid | |
| description | text | |
| district / municipality | text | |
| duration_days | int > 0 | |
| budget_min / max | int | min ≤ max |
| status | enum | `open` \| `applications_received` \| `assigned` \| `completed` \| `cancelled` |
| assigned_worker_id | uuid | Nullable |
| completed_at | timestamptz | |

**Status transition contract**

| Transition | Actor | Notes |
|------------|-------|--------|
| → open | Employer on create | Default |
| open → applications_received | System on first application | Trigger |
| * → assigned | Employer | Must set `assigned_worker_id` |
| assigned → completed | Employer | Trigger increments worker jobs_completed |
| * → cancelled | Employer or Admin | |

**Operations:** Authenticated select; employer insert/update own; admin all.

---

### 5.12 `job_applications`

| Field | Type | Notes |
|-------|------|--------|
| job_id | uuid | |
| worker_id | uuid | |
| message | text | Optional cover note |
| status | enum | `pending` \| `accepted` \| `rejected` |
| applied_at | timestamptz | |

**Unique:** `(job_id, worker_id)`  

| Op | Actor |
|----|--------|
| INSERT | Worker (self) |
| SELECT | Worker (own) or Employer (jobs they own) |
| UPDATE status | Employer (on their jobs) |

**Side effects:** Notify employer on insert; notify worker on accept/reject; may bump job to `applications_received`.

---

### 5.13 `reviews`

| Field | Type | Notes |
|-------|------|--------|
| job_id | uuid | Job must be `completed` |
| reviewer_id | uuid | = auth.uid() |
| reviewee_id | uuid | ≠ reviewer |
| rating | int 1–5 | |
| comment | text | |

**Unique:** `(job_id, reviewer_id, reviewee_id)`  
**Contract:** **Write-once** — INSERT only for participants; no user UPDATE/DELETE. Admin may delete for moderation.  
**Side effects:** Update rating aggregates; notify reviewee.

---

### 5.14 `bookmarks`

| Field | Type | Notes |
|-------|------|--------|
| employer_id | uuid | Owner |
| worker_id | uuid | |

**Unique:** `(employer_id, worker_id)`  
**Operations:** Employer insert/select/delete own; admin all.

---

### 5.15 `notifications`

| Field | Type | Notes |
|-------|------|--------|
| user_id | uuid | Recipient |
| type | text | See §6 |
| title / message | text | |
| is_read | bool | default false |
| metadata | jsonb | ids payload |

**Operations:** Recipient select/update (`is_read`); inserts primarily via SECURITY DEFINER triggers/RPC.

---

## 6. Notification Type Contract

| `type` | When | Typical `metadata` |
|--------|------|---------------------|
| `new_application` | Worker applied | `job_id`, `application_id`, `worker_id` |
| `application_accepted` | Employer accepted | `job_id`, `application_id` |
| `application_rejected` | Employer rejected | `job_id`, `application_id` |
| `new_review` | Review created | `review_id`, `job_id`, `rating` |
| `verification_approved` | Request approved | `verification_request_id` |
| `verification_rejected` | Request rejected | `verification_request_id`, `rejection_reason` |
| `verification_more_info` | More info requested | `verification_request_id`, `more_info_message` |
| `new_verification_request` | Optional institution notify | `verification_request_id`, `worker_id` |

Clients MUST tolerate unknown `type` values (forward compatibility).

---

## 7. Storage Contracts

### 7.1 Buckets

| Bucket | Public read | Write | Path convention (recommended) |
|--------|-------------|-------|-------------------------------|
| `avatars` | Yes | Owner | `{user_id}/{timestamp}.ext` |
| `portfolio` | Yes | Owner | `{user_id}/{timestamp}.ext` |
| `certifications` | No | Owner | `{user_id}/{timestamp}-{filename}` |
| `institution-logos` | Yes | Admin | `{institution_id}/logo.ext` |

### 7.2 Upload contract

1. Client uploads to bucket path.  
2. Client stores returned **path** or **public URL** on the entity row.  
3. For private buckets, client requests **signed URL** for display/download.  

### 7.3 Content policy (app + Storage)

| Rule | Contract |
|------|----------|
| MIME | Images and PDF only for certifications; images for avatars/portfolio |
| Size | Enforce in UI and Storage; recommend ≤ 5MB image, ≤ 10MB PDF |
| Ownership | Path prefixed by `auth.uid()` for user uploads |

---

## 8. RPC / Database Function Contracts

### 8.1 `create_notification(p_user_id, p_type, p_title, p_message, p_metadata)`

| Item | Contract |
|------|----------|
| Returns | uuid (notification id) |
| Security | SECURITY DEFINER |
| Caller | Triggers; optional authenticated RPC |
| Effect | Inserts `notifications` row |

### 8.2 Trigger-owned functions (not called directly by UI)

| Function | Trigger point | Effect |
|----------|---------------|--------|
| `set_updated_at` | BEFORE UPDATE | Touch `updated_at` |
| `update_worker_rating` | AFTER INSERT reviews | Recompute worker aggregates |
| `update_employer_rating` | AFTER INSERT reviews | Recompute employer aggregates |
| `increment_jobs_completed` | BEFORE UPDATE jobs | When → completed |
| `sync_verification_status` | AFTER INSERT/UPDATE verification_requests.status | Sync worker badge fields |
| Notification helpers | Application / verification / review events | Insert notifications |

**Contract:** Clients must not attempt to replicate these side effects in application code except for UX optimistic UI that is reconciled on refresh.

---

## 9. Query Contracts by Use Case

### 9.1 Worker search (employer)

**Resource:** `worker_profiles` joined to `profiles`, optional `worker_skills`  

**Allowed filters (prototype):**

| Filter | Field |
|--------|--------|
| Trade | `primary_trade` (= slug) |
| Verification | `verification_status` |
| Availability | `availability` |
| Experience | `years_experience` gte |
| Wage | `daily_wage_min` / `daily_wage_max` range |
| Rating | `average_rating` gte |
| Location | `profiles.district` / `municipality` |
| Suspended | MUST exclude `profiles.is_suspended = true` |

**Sort default:** `average_rating` desc (or `created_at` desc).

### 9.2 Job browse (worker)

**Resource:** `jobs` where `status IN ('open','applications_received')`  
**Filters:** trade_id, district, budget range  
**Sort:** `created_at` desc  

### 9.3 Verification queue (verifier)

**Resource:** `verification_requests`  
**Required scope:** `institution_id = member’s institution`  
**Filters:** status, submitted_at range, worker trade (via join)  
**Sort:** `submitted_at` asc for pending (FIFO)  

### 9.4 Admin user lists

**Resource:** `profiles` + role-specific extension table  
**Filters:** name search (ilike), district, suspended flag  
**Actions:** update `is_suspended` only via admin role  

---

## 10. Access Control Matrix (Contract Summary)

| Resource | Worker | Employer | Admin | Verifier |
|----------|--------|----------|-------|----------|
| Own profile extension | RW | RW | RW all | R workers (review) |
| Others’ public profiles | R | R | R | R |
| certifications (others) | — | — | R | R (in-scope requests) |
| jobs | R / apply | R own W | R W (cancel) | — |
| job_applications | own W | own jobs RW status | all | — |
| reviews | insert own | insert own | delete mod | — |
| verification_requests | insert+R own | — | R all | R/W own institution |
| bookmarks | — | own RW | all | — |
| notifications | own RW read flag | own | all | own |
| institutions | R active | R active | RW | R + limited update |
| trades | R | R | RW | R |

R = read, W = write, — = no access by contract.

---

## 11. Error Contracts

### 11.1 Classes

| Class | Typical cause | Client behavior |
|-------|---------------|-----------------|
| Auth | Missing/expired session | Re-login |
| RLS denial | Wrong role or ownership | Friendly “not allowed” |
| Unique violation | Duplicate apply/review/bookmark | Explain already exists |
| Check violation | Invalid rating, wage range | Field validation message |
| FK violation | Bad trade_id / job_id | Refresh and retry |
| Storage | MIME/size/policy | Show upload rules |

### 11.2 App-level validation (MUST before write)

| Write | Validate |
|-------|----------|
| Review | rating 1–5; job completed; reviewer is participant |
| Verification reject | non-empty `rejection_reason` |
| Verification more info | non-empty `more_info_message` |
| Job | title present; budget min ≤ max when both set |
| Worker profile | wage min ≤ max when both set |

---

## 12. Versioning & Compatibility

| Rule | Prototype policy |
|------|------------------|
| Schema changes | Additive preferred (new columns/tables) |
| Enum additions | Allowed; clients ignore unknown values where possible |
| Enum removals / renames | Breaking — avoid during prototype |
| Notification types | Additive |
| This document | Bump version when contracts change |

**Version:** `0.3` matches PRD / schema prototype line.

---

## 13. Security Contracts

1. Only the **anon key** is embedded in front ends.  
2. **Service role key** never ships to browsers.  
3. RLS is mandatory on all domain tables.  
4. Admin cannot UPDATE `verification_requests`.  
5. Verifier cannot suspend users or moderate arbitrary content.  
6. Certification objects are private by default.  
7. Auth rate limits rely on Supabase defaults.  

---

## 14. Compliance Checklist for Implementers

- [ ] All domain writes go through documented resources and roles  
- [ ] System-owned fields are never client-authored  
- [ ] Verification re-submit creates a new request row  
- [ ] Reviews are insert-only for end users  
- [ ] Search excludes suspended workers  
- [ ] Verifier queries always constrained by institution membership  
- [ ] Storage paths follow ownership prefix  
- [ ] Errors surfaced without leaking internal policy details  

---

## 15. Related Documents

| Document | Relationship |
|----------|----------------|
| `schema.sql` | Physical types, constraints, RLS, triggers |
| `api.md` | Client call examples |
| `architecture.md` | System structure and trust boundaries |
| `srs.md` | Requirements traceability |
| `coding_standard.md` | How clients structure API modules |

---

*End of Backend API & Contracts Specification (`Contract.md`).*
