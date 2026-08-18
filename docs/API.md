# Shram Setu (श्रम सेतु) — API Reference

**Version:** 0.3 (Prototype)  
**Last Updated:** 18 August 2026  
**Backend:** Supabase (PostgreSQL + Auth + Storage)  
**Client:** Supabase JS (`@supabase/supabase-js`) from both React apps  

There is **no custom REST/GraphQL server**. The “API” is direct Supabase client calls, secured by **Row-Level Security (RLS)** and Auth. This document describes the operations each platform performs, the underlying tables, and recommended call patterns.

---

## 1. Environment

Both apps use the same Supabase project:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```js
// src/api/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 2. Authentication

### 2.1 Main Platform (RBC) — Workers & Employers

| Operation | Method | Notes |
|-----------|--------|-------|
| Register / login with phone | `supabase.auth.signInWithOtp({ phone })` | Sends OTP via SMS |
| Verify OTP | `supabase.auth.verifyOtp({ phone, token, type: 'sms' })` | Creates session |
| Login with magic link | `supabase.auth.signInWithOtp({ email })` | Email link |
| Get session | `supabase.auth.getSession()` | |
| Sign out | `supabase.auth.signOut()` | |
| Auth state listener | `supabase.auth.onAuthStateChange(...)` | Drive AuthContext |

**Post-auth:** Application inserts into `profiles` (+ `worker_profiles` or `employer_profiles`) during onboarding. Do not rely on auto-profile trigger for role assignment.

### 2.2 Admin Platform — Admin & Verifier

| Operation | Method | Notes |
|-----------|--------|-------|
| Login | `supabase.auth.signInWithPassword({ email, password })` | Accounts pre-provisioned |
| Get session | `supabase.auth.getSession()` | |
| Sign out | `supabase.auth.signOut()` | |

After login, resolve role from `profiles.role` and optional `institution_members` row(s) to route into Admin vs Verifier areas.

---

## 3. Profiles & Workers (Main Platform)

### 3.1 Create profile (onboarding)

```js
// 1. profiles
await supabase.from('profiles').insert({
  id: user.id,
  role: 'worker', // or 'employer'
  full_name,
  phone,
  email,
  district,
  municipality,
  bio,
  avatar_url
})

// 2a. worker_profiles
await supabase.from('worker_profiles').insert({
  id: user.id,
  primary_trade,      // trades.slug
  years_experience,
  daily_wage_min,
  daily_wage_max,
  availability: 'available'
})

// 2b. employer_profiles
await supabase.from('employer_profiles').insert({
  id: user.id,
  employer_type,      // individual | business | government | ngo
  company_name
})
```

### 3.2 Get worker profile (public view)

Join-style via multiple queries or a single select with relationships if configured:

```js
const { data: profile } = await supabase
  .from('profiles')
  .select(`
    *,
    worker_profiles (*),
    worker_skills (*),
    certifications (*),
    portfolio_items (*)
  `)
  .eq('id', workerId)
  .single()
```

### 3.3 Update own profile

```js
await supabase.from('profiles').update({ full_name, bio, district, municipality, avatar_url }).eq('id', user.id)
await supabase.from('worker_profiles').update({ primary_trade, years_experience, daily_wage_min, daily_wage_max, availability }).eq('id', user.id)
```

### 3.4 Search workers

```js
let query = supabase
  .from('worker_profiles')
  .select(`
    *,
    profiles!inner (id, full_name, avatar_url, district, municipality, is_suspended),
    worker_skills (skill_name, trade_id)
  `)
  .eq('profiles.is_suspended', false)

if (trade) query = query.eq('primary_trade', trade)
if (verification) query = query.eq('verification_status', verification)
if (availability) query = query.eq('availability', availability)
if (minExp != null) query = query.gte('years_experience', minExp)
if (maxWage != null) query = query.lte('daily_wage_min', maxWage) // adjust logic as needed
if (minRating != null) query = query.gte('average_rating', minRating)
if (district) query = query.eq('profiles.district', district)

const { data } = await query.order('average_rating', { ascending: false })
```

Text search over names/skills can use `ilike` or a generated `tsvector` column in a later iteration.

### 3.5 Upload avatar

```js
const path = `${user.id}/${Date.now()}.jpg`
const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
```

---

## 4. Skills, Certifications, Portfolio

### 4.1 Worker skills

```js
// Add
await supabase.from('worker_skills').insert({ worker_id: user.id, skill_name, trade_id })

// List
await supabase.from('worker_skills').select('*').eq('worker_id', workerId)

// Remove
await supabase.from('worker_skills').delete().eq('id', skillId).eq('worker_id', user.id)
```

### 4.2 Certifications

```js
// Upload file
const path = `${user.id}/${Date.now()}-${file.name}`
await supabase.storage.from('certifications').upload(path, file)
const { data } = supabase.storage.from('certifications').getPublicUrl(path) // or signed URL for private bucket

// Insert row
await supabase.from('certifications').insert({
  worker_id: user.id,
  title,
  issuing_body,
  issue_date,
  expiry_date,
  document_url: path // store path; serve via signed URL for private bucket
})
```

**Access:** Owner + institution reviewers + admin (RLS + Storage policies). Prefer **private** bucket + signed URLs for certifications.

### 4.3 Portfolio

```js
await supabase.storage.from('portfolio').upload(path, file)
await supabase.from('portfolio_items').insert({
  worker_id: user.id,
  image_url: publicUrl,
  caption
})
```

---

## 5. Jobs (Main Platform)

### 5.1 Post job (employer)

```js
await supabase.from('jobs').insert({
  employer_id: user.id,
  title,
  trade_id,
  description,
  district,
  municipality,
  duration_days,
  budget_min,
  budget_max,
  status: 'open'
})
```

### 5.2 Browse jobs

```js
let q = supabase
  .from('jobs')
  .select(`*, trades (slug, name_en, icon), employer_profiles (company_name, profiles (full_name))`)
  .in('status', ['open', 'applications_received'])

if (tradeId) q = q.eq('trade_id', tradeId)
if (district) q = q.eq('district', district)
// budget filters as needed

const { data } = await q.order('created_at', { ascending: false })
```

### 5.3 Apply to job (worker)

```js
await supabase.from('job_applications').insert({
  job_id,
  worker_id: user.id,
  message,
  status: 'pending'
})
// Trigger sets job status to applications_received if was open; creates notification for employer
```

### 5.4 View applicants (employer)

```js
await supabase
  .from('job_applications')
  .select(`*, worker_profiles (*, profiles (*))`)
  .eq('job_id', jobId)
```

### 5.5 Accept / reject application

```js
await supabase
  .from('job_applications')
  .update({ status: 'accepted' }) // or 'rejected'
  .eq('id', applicationId)
// Notification trigger fires for worker
```

### 5.6 Assign worker & complete job

```js
// Assign
await supabase.from('jobs').update({
  assigned_worker_id: workerId,
  status: 'assigned'
}).eq('id', jobId).eq('employer_id', user.id)

// Complete
await supabase.from('jobs').update({
  status: 'completed'
  // completed_at set by trigger if desired
}).eq('id', jobId).eq('employer_id', user.id)
// Trigger increments worker total_jobs_completed
```

### 5.7 Cancel job (employer or admin)

```js
await supabase.from('jobs').update({ status: 'cancelled' }).eq('id', jobId)
```

---

## 6. Reviews (Main Platform)

### 6.1 Submit review (write-once)

```js
await supabase.from('reviews').insert({
  job_id,
  reviewer_id: user.id,
  reviewee_id,
  rating,   // 1–5
  comment
})
// Triggers update average_rating / total_reviews and notify reviewee
```

RLS requires job `status = 'completed'` and reviewer is employer or assigned worker.

### 6.2 Get reviews for a user

```js
await supabase
  .from('reviews')
  .select(`*, profiles!reviewer_id (full_name, avatar_url)`)
  .eq('reviewee_id', userId)
  .order('created_at', { ascending: false })
```

---

## 7. Bookmarks (Main Platform)

```js
// Save
await supabase.from('bookmarks').insert({ employer_id: user.id, worker_id })

// List
await supabase
  .from('bookmarks')
  .select(`*, worker_profiles (*, profiles (*))`)
  .eq('employer_id', user.id)

// Remove
await supabase.from('bookmarks').delete().eq('employer_id', user.id).eq('worker_id', workerId)
```

---

## 8. Verification (Worker Side — Main Platform)

### 8.1 Submit verification request

```js
// Resolve CTEVT institution_id (prototype: single active institution)
const { data: ctevt } = await supabase
  .from('institutions')
  .select('id')
  .eq('slug', 'ctevt')
  .eq('is_active', true)
  .single()

await supabase.from('verification_requests').insert({
  worker_id: user.id,
  institution_id: ctevt.id,
  status: 'pending'
})
// Trigger syncs worker_profiles.verification_status → pending
```

### 8.2 View my verification status / history

```js
await supabase
  .from('verification_requests')
  .select('*')
  .eq('worker_id', user.id)
  .order('created_at', { ascending: false })
```

### 8.3 Re-submit after rejection

Insert a **new** `verification_requests` row (previous rows remain for audit). Update certifications as needed first.

---

## 9. Verification (Verifier Role — Admin Platform)

### 9.1 Pending queue (scoped to institution)

```js
// institution_id from institution_members for current user
const { data } = await supabase
  .from('verification_requests')
  .select(`
    *,
    worker_profiles (*, profiles (*), certifications (*))
  `)
  .eq('institution_id', myInstitutionId)
  .eq('status', 'pending')
  .order('submitted_at', { ascending: true })
```

Filter by trade/date via additional `.eq` / `.gte` as needed.

### 9.2 Claim for review

```js
await supabase
  .from('verification_requests')
  .update({
    status: 'in_review',
    reviewer_id: myMemberId
  })
  .eq('id', requestId)
  .eq('institution_id', myInstitutionId)
```

### 9.3 Approve

```js
await supabase
  .from('verification_requests')
  .update({
    status: 'approved',
    reviewer_notes,
    reviewed_at: new Date().toISOString()
  })
  .eq('id', requestId)
// Trigger: worker_profiles → verified; certifications.is_institution_verified → true; notification
```

### 9.4 Reject

```js
await supabase
  .from('verification_requests')
  .update({
    status: 'rejected',
    rejection_reason,  // shown to worker
    reviewer_notes,
    reviewed_at: new Date().toISOString()
  })
  .eq('id', requestId)
```

### 9.5 Request more info

```js
await supabase
  .from('verification_requests')
  .update({
    status: 'more_info_needed',
    more_info_message,
    reviewer_notes,
    reviewed_at: new Date().toISOString()
  })
  .eq('id', requestId)
```

### 9.6 Verification history

```js
await supabase
  .from('verification_requests')
  .select('*')
  .eq('institution_id', myInstitutionId)
  .order('reviewed_at', { ascending: false })
```

**Important:** Admin role has SELECT on verification requests but **no UPDATE** policy — only `verifier` members of the institution can act.

---

## 10. Admin Operations (Admin Role — Admin Platform)

### 10.1 List workers / employers

```js
await supabase
  .from('profiles')
  .select(`*, worker_profiles (*)`)
  .eq('role', 'worker')
  // search: .ilike('full_name', `%${q}%`)
```

### 10.2 Suspend / unsuspend

```js
await supabase
  .from('profiles')
  .update({ is_suspended: true })
  .eq('id', userId)
```

### 10.3 Content moderation

```js
// Remove portfolio item
await supabase.from('portfolio_items').delete().eq('id', itemId)

// Remove review
await supabase.from('reviews').delete().eq('id', reviewId)
```

### 10.4 Cancel job

```js
await supabase.from('jobs').update({ status: 'cancelled' }).eq('id', jobId)
```

### 10.5 Platform statistics (example aggregates)

```js
const [{ count: workers }, { count: employers }, { count: jobs }, { count: completed }] = await Promise.all([
  supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'worker'),
  supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
  supabase.from('jobs').select('*', { count: 'exact', head: true }),
  supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed')
])
```

Further stats (verification rates, reviews) via similar count queries or database views/RPCs added later.

---

## 11. Notifications

### 11.1 List for current user

```js
await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(50)
```

### 11.2 Mark read

```js
await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('id', notificationId)
  .eq('user_id', user.id)
```

### 11.3 Create (system / RPC)

Notifications are primarily created by **SECURITY DEFINER** triggers (`create_notification`). Optional RPC:

```js
await supabase.rpc('create_notification', {
  p_user_id: userId,
  p_type: 'custom',
  p_title: 'Title',
  p_message: 'Body',
  p_metadata: { job_id: '...' }
})
```

**Types (examples):**  
`new_application`, `application_accepted`, `application_rejected`, `new_review`, `verification_approved`, `verification_rejected`, `verification_more_info`, `new_verification_request`

---

## 12. Trades & Institutions (Shared Reads)

```js
// Trades (public)
await supabase.from('trades').select('*').order('name_en')

// Institutions (active)
await supabase.from('institutions').select('*').eq('is_active', true)
```

---

## 13. Storage Buckets

| Bucket | Public read | Write | Notes |
|--------|-------------|-------|-------|
| `avatars` | Yes | Owner path | Profile photos |
| `portfolio` | Yes | Owner | Work photos |
| `certifications` | No (signed URLs) | Owner | PDFs/images; readable by owner, institution reviewers, admin via policies |
| `institution-logos` | Yes | Admin | Logos |

Always store **paths** in DB; generate public or signed URLs at read time.

---

## 14. Database Functions (Triggers / RPC)

| Function | Purpose |
|----------|---------|
| `set_updated_at()` | Maintains `updated_at` on key tables |
| `update_worker_rating()` | After review insert → worker average/total |
| `update_employer_rating()` | After review insert → employer average/total |
| `increment_jobs_completed()` | On job → completed |
| `sync_verification_status()` | Maps request status → `worker_profiles.verification_status` |
| `create_notification(...)` | Insert notification row |
| Notification helpers | Verification decision, new application, application decision, new review |

These run as **SECURITY DEFINER** where needed so RLS does not block system updates.

---

## 15. Error Handling Guidance

- Check `error` from every Supabase response.  
- Map Postgres/RLS failures to user-friendly messages (e.g. “You cannot review this job yet”).  
- For Storage: handle size/MIME rejection from policies.  
- Suspended users: after `getSession()`, load `profiles.is_suspended` and force sign-out + message if true.

---

## 16. Security Summary

| Concern | Mechanism |
|---------|-----------|
| Auth | Supabase Auth (OTP / magic link / password) |
| Authorization | RLS on all tables; `profiles.role` + `institution_members` |
| Admin ≠ Verifier | No UPDATE policy on `verification_requests` for `admin`; no suspend/moderation for pure `verifier` |
| Multi-tenant verification | Verifier policies filter by `institution_id` |
| Certifications privacy | Private bucket + RLS + signed URLs |
| Reviews | Write-once; insert only when job completed and participant |

---

## 17. Suggested Client Module Layout

**Main Platform**

```
src/api/
  supabaseClient.js
  authApi.js
  workerApi.js
  employerApi.js
  jobApi.js
  reviewApi.js
  verificationApi.js
  notificationApi.js
```

**Admin Platform**

```
src/api/
  supabaseClient.js
  authApi.js
  adminApi.js
  verificationApi.js
```

Keep query logic in these modules; pages/hooks call them so both apps stay consistent with this reference.

---

*This API reference mirrors PRD §12 and the schema in `schema.sql`. Update it when new RPCs or views are added.*
