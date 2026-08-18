# Shram Setu (श्रम सेतु) — System Architecture

**Version:** 0.3 (Prototype — Two-Platform Architecture)  
**Last Updated:** 18 August 2026  
**Status:** Draft — Aligned with PRD, SRS, schema, and API reference  

---

## 1. Purpose

This document describes the technical architecture of the Shram Setu prototype: how the two front ends, shared backend, auth, data, and security boundaries fit together. It is the companion to:

| Document | Focus |
|----------|--------|
| PRD | Product vision, features, flows |
| `srs.md` | Formal requirements |
| `schema.sql` | Database contract |
| `api.md` | Client ↔ Supabase operations |
| `theme.md` | UI design system |
| `coding_standard.md` | Implementation conventions |

---

## 2. High-Level Architecture

Shram Setu is a **two-frontend, one-backend** system:

```
                    ┌──────────────────────────┐
                    │     Supabase Cloud       │
                    │     (shared backend)     │
                    │                          │
                    │  • PostgreSQL + RLS      │
                    │  • Auth (OTP / email)    │
                    │  • Storage (files)       │
                    │  • Realtime (optional)   │
                    │  • DB functions/triggers │
                    └───────────┬──────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
   ┌─────────────────────┐             ┌─────────────────────────┐
   │  Main Platform      │             │  Admin Platform         │
   │  (RBC)              │             │  (Admin + Verifier)     │
   │                     │             │                         │
   │  React + JS + Vite  │             │  React + JS + Vite      │
   │  Workers            │             │  admin role             │
   │  Employers          │             │  verifier role          │
   │  Jobs, reviews,     │             │  Moderation +           │
   │  verification req.  │             │  verification queue     │
   └──────────┬──────────┘             └────────────┬────────────┘
              │                                     │
              ▼                                     ▼
         Vercel                                Vercel
    shramsetu.vercel.app              shramsetu-admin.vercel.app
```

### 2.1 Design intent

| Decision | Rationale |
|----------|-----------|
| Two separate React apps | Independent deploys; different audiences and UX density; smaller blast radius |
| One Supabase project | Single source of truth; shared auth users and schema; simpler prototype ops |
| Role-based split inside Admin app | Admin and verifier share one codebase/deployment but stay isolated via RLS + route guards |
| No custom API server | Supabase BaaS covers auth, DB, storage; less infrastructure for prototype |
| JavaScript (not TypeScript) | Faster prototype setup; lower tooling overhead for two apps |

---

## 3. Applications

### 3.1 Main Platform (RBC)

| Attribute | Value |
|-----------|--------|
| **Audience** | Workers, employers |
| **URL (prototype)** | `shramsetu.vercel.app` |
| **Auth** | Phone OTP; email magic link |
| **Primary capabilities** | Register/onboard, profiles, search, jobs, applications, reviews, bookmarks, verification requests, in-app notifications |
| **Layout** | Mobile-first responsive SPA |
| **Vercel project** | `shramsetu` |

### 3.2 Admin Platform

| Attribute | Value |
|-----------|--------|
| **Audience** | Internal ops (`admin`), institution staff (`verifier`, e.g. CTEVT) |
| **URL (prototype)** | `shramsetu-admin.vercel.app` |
| **Auth** | Email + password (pre-provisioned accounts) |
| **Primary capabilities** | User management, content moderation, job oversight, platform stats; verification queue, approve/reject/request info, audit trail, institution settings |
| **Layout** | Desktop-first SPA with left sidebar |
| **Vercel project** | `shramsetu-admin` |

**Role isolation (same app, different powers):**

- `admin` → moderation, suspend, cancel jobs, stats — **cannot** approve/reject verification  
- `verifier` → institution-scoped verification only — **cannot** suspend users or moderate platform content  
- Enforced by **RLS** (source of truth) and mirrored by **route guards** in the UI  

---

## 4. Backend: Supabase

### 4.1 Services used

| Service | Usage |
|---------|--------|
| **PostgreSQL** | All domain data; enums, FKs, constraints |
| **Auth** | Users in `auth.users`; app profile in `public.profiles` |
| **Storage** | `avatars`, `portfolio`, `certifications`, `institution-logos` |
| **RLS** | Row-level authorization for every table |
| **Database functions / triggers** | Ratings, job completion counters, verification status sync, notifications |
| **Realtime** | Optional later; prototype can poll or refetch on focus |

### 4.2 Why one project

- Workers, employers, admins, and verifiers are all rows in the same `auth.users` + `profiles` model  
- Verification status on the Main Platform updates when a verifier acts on the Admin Platform  
- Single migration story for the prototype  

### 4.3 What does *not* live on Vercel

Vercel hosts **static/SPA assets only**. No business logic server is required on Vercel for the prototype. Authorization and integrity live in Postgres policies and triggers.

---

## 5. Logical Layering (Each Frontend)

```
┌─────────────────────────────────────┐
│  Pages (routes / screens)           │
├─────────────────────────────────────┤
│  Components (UI)                    │
├─────────────────────────────────────┤
│  Hooks + Context (state / session)  │
├─────────────────────────────────────┤
│  API modules (Supabase client)      │
├─────────────────────────────────────┤
│  Supabase (Auth, DB, Storage, RLS)  │
└─────────────────────────────────────┘
```

| Layer | Responsibility |
|-------|----------------|
| **Pages** | Route composition, page-level layout, wire hooks to UI |
| **Components** | Presentational and reusable widgets (cards, badges, tables) |
| **Hooks / Context** | Session, role resolution, data fetching lifecycle |
| **API modules** | All `supabase.from` / `auth` / `storage` calls |
| **Supabase** | Persistence, auth, file storage, security |

**Rule:** UI never bypasses the API module layer for domain mutations (see `coding_standard.md`).

---

## 6. Data Architecture

### 6.1 Core domain model (summary)

```
auth.users
    └── profiles (role: worker | employer | admin | verifier)
            ├── worker_profiles
            │       ├── worker_skills → trades
            │       ├── certifications
            │       ├── portfolio_items
            │       └── verification_requests → institutions
            │                                    └── institution_members
            ├── employer_profiles
            │       ├── jobs → job_applications
            │       └── bookmarks
            ├── reviews (job-linked, write-once)
            └── notifications
```

Full definitions: `schema.sql`.

### 6.2 Key invariants

| Invariant | Mechanism |
|-----------|-----------|
| Reviews cannot be edited by users | RLS insert-only; no user UPDATE policy |
| Verification history is auditable | New `verification_requests` row on re-submit; old rows kept |
| Worker badge stays in sync | Trigger `sync_verification_status` on request status change |
| Ratings stay in sync | Triggers on `reviews` insert |
| Jobs completed count | Trigger when job status → `completed` |
| Verifier sees only own institution | RLS on `verification_requests` via `institution_members` |
| Admin cannot verify | No UPDATE policy on verification for `admin` role |

### 6.3 Prototype seed assumptions

- One institution: **CTEVT** (`institutions.slug = 'ctevt'`)  
- Trades taxonomy seeded (electrician, plumber, …)  
- Admin/verifier accounts created manually (email/password) and linked via `profiles` + `institution_members`  

---

## 7. Authentication & Authorization

### 7.1 Auth flows

```
Main Platform                          Admin Platform
─────────────                          ──────────────
Phone → OTP → session                  Email + password → session
Email → magic link → session

Onboarding: insert profiles            Pre-provisioned profiles
  + worker_profiles /                  role = admin | verifier
    employer_profiles                  (+ institution_members for verifiers)
```

### 7.2 Authorization model

```
┌──────────────┐     profiles.role      ┌─────────────────┐
│  auth.uid()  │ ─────────────────────► │ worker/employer │  Main app routes
└──────────────┘                        │ admin           │  Admin module
                                        │ verifier        │  Verifier module
                                        └────────┬────────┘
                                                 │
                     institution_members         │
                     (institution_id, user_id) ◄─┘
                                                 │
                                                 ▼
                                      RLS filters verification
                                      rows by institution_id
```

| Role | App | Capabilities |
|------|-----|----------------|
| `worker` | Main | Own profile, apply to jobs, request verification, review employers |
| `employer` | Main | Own profile, post jobs, manage applicants, bookmark, review workers |
| `admin` | Admin | Suspend users, moderate content, cancel jobs, view stats; **read** verification for oversight only |
| `verifier` | Admin | Act on verification requests for **their** institution only |

### 7.3 Defense in depth

1. **RLS policies** — authoritative  
2. **Route guards** — UX and accidental navigation  
3. **UI module visibility** — sidebar only shows allowed sections  
4. **Storage policies** — certifications not publicly readable  

---

## 8. Storage Architecture

| Bucket | Public | Writers | Readers |
|--------|--------|---------|---------|
| `avatars` | Yes | Authenticated owner | Anyone |
| `portfolio` | Yes | Owner worker | Anyone |
| `certifications` | No | Owner worker | Owner, institution reviewers, admin (signed URLs / policies) |
| `institution-logos` | Yes | Admin | Anyone |

**Pattern:** Store path (or public URL for public buckets) in Postgres; generate signed URLs for private objects at read time.

---

## 9. Key Runtime Flows

### 9.1 Worker verification (end-to-end)

```
Worker (Main)                    Supabase                     Verifier (Admin)
     │                              │                               │
     │  insert verification_requests│                               │
     │  status=pending              │                               │
     │─────────────────────────────►│                               │
     │                              │  sync → worker pending        │
     │                              │  (optional notify institution)│
     │                              │◄──────────────────────────────│
     │                              │  list queue (RLS scoped)      │
     │                              │  update status=approved       │
     │                              │◄──────────────────────────────│
     │                              │  sync → worker verified       │
     │                              │  notify worker                │
     │  badge on public profile     │                               │
     │◄─────────────────────────────│                               │
```

### 9.2 Job lifecycle

```
Employer posts job (open)
    → Worker applies (applications_received)
        → Employer accepts + assigns (assigned)
            → Offline work
                → Employer marks completed
                    → Both parties leave reviews
                    → Triggers update ratings + jobs_completed
```

### 9.3 Notification generation

Domain events (application created, application decision, verification decision, review created) fire **SECURITY DEFINER** triggers that insert into `notifications`. Clients read the table filtered by `user_id = auth.uid()`.

---

## 10. Deployment Architecture

### 10.1 Build & host

| Component | Host | Notes |
|-----------|------|--------|
| Main Platform SPA | Vercel project `shramsetu` | Vite build → static |
| Admin Platform SPA | Vercel project `shramsetu-admin` | Vite build → static |
| Database / Auth / Storage | Supabase Cloud | Single project |

### 10.2 Environment configuration

Each Vercel project and local `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Both front ends point at the **same** Supabase project.

### 10.3 Deploy order (from PRD)

1. Supabase schema, RLS, storage, seeds  
2. Main Platform  
3. Admin Platform  

### 10.4 Prototype cost posture

- Vercel free tier: two projects acceptable  
- Supabase free tier: sufficient for prototype volume  
- Production note: Admin Platform should later move behind VPN / IP restriction because it hosts internal and institutional logins  

---

## 11. Cross-Cutting Concerns

### 11.1 Observability

- Prototype: browser console + Supabase logs + Vercel deployment logs  
- No dedicated APM required for prototype  

### 11.2 Error handling

- API modules return `{ data, error }`  
- UI shows toasts / inline errors; does not expose raw Postgres messages to end users  

### 11.3 Performance

- Indexed filters (trade, status, district, ratings) — see `schema.sql`  
- Target: critical Main Platform pages &lt; 3s on simulated 3G (Lighthouse)  
- Avoid over-fetching: select only needed columns/relations in list views  

### 11.4 Internationalization

- Prototype UI: English  
- Schema prepares `trades.name_ne` for future Nepali UI  

### 11.5 Offline / PWA

- Out of scope for prototype; responsive web only  

---

## 12. Security Architecture Summary

| Threat / concern | Mitigation |
|------------------|------------|
| Unauthorized data access | RLS on all tables |
| Admin acting as verifier | No verification UPDATE policy for admin |
| Verifier acting as admin | No suspend/moderation policies for verifier |
| Cross-institution leakage | `institution_id` filters in RLS |
| Certificate leakage | Private bucket + restricted read policies |
| Privilege escalation via client | Anon key only; service role never in browser |
| Suspended users | `profiles.is_suspended` checked post-auth; access denied |
| Abuse of auth endpoints | Supabase rate limits |
| XSS / injection | React escaping; parameterized Supabase queries; Storage MIME limits |

---

## 13. Technology Stack (Pinned Intent)

| Layer | Choice |
|-------|--------|
| UI library | React 18+ (JavaScript) |
| Bundler | Vite |
| Routing | React Router |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Hosting (FE) | Vercel (2 projects) |
| Hosting (BE) | Supabase Cloud |
| State | Context + hooks; optional light store if needed |

---

## 14. Evolution Paths (Post-Prototype)

Documented for awareness; **not** in prototype scope:

| Change | Architectural impact |
|--------|----------------------|
| Multiple institutions | Already modeled; seed more `institutions` + members |
| Nepali UI | i18n layer; use `name_ne` |
| Native mobile | New clients against same Supabase project |
| Real CTEVT API | Replace manual verifier actions with webhook/API sync; keep audit table |
| Shared package | Extract model/constants npm package used by both apps |
| Standalone Verifier Portal | Split Admin app if institution count/ops demand separate access control |
| Custom backend | Only if workflow outgrows RLS + edge functions |

---

## 15. Architecture Decision Records (Lightweight)

| ID | Decision | Status |
|----|----------|--------|
| ADR-01 | Two SPAs, one Supabase project | Accepted |
| ADR-02 | Admin + Verifier in one Admin app, split by role | Accepted |
| ADR-03 | No custom REST server; Supabase client direct | Accepted |
| ADR-04 | JavaScript only (no TypeScript) for prototype | Accepted |
| ADR-05 | CTEVT-only institution for prototype | Accepted |
| ADR-06 | Write-once reviews; append-only verification requests | Accepted |
| ADR-07 | Duplicate small model files instead of monorepo package | Accepted (prototype) |

---

## 16. Diagram: Trust Boundary

```
                    ┌─ Public internet ─────────────────────────┐
                    │                                           │
   Workers/Employers│         Admins/Verifiers                  │
          │         │                │                          │
          ▼         │                ▼                          │
   ┌────────────┐   │         ┌──────────────┐                  │
   │ Main SPA   │   │         │ Admin SPA    │                  │
   │ (Vercel)   │   │         │ (Vercel)     │                  │
   └─────┬──────┘   │         └──────┬───────┘                  │
         │          │                │                          │
         └──────────┼────────────────┘                          │
                    │  HTTPS + anon key                         │
                    ▼                                           │
           ┌─────────────────┐                                  │
           │ Supabase        │  ◄── RLS / Auth / Storage        │
           │ (trust boundary │      policies enforce roles      │
           │  for data)      │                                  │
           └─────────────────┘                                  │
                    └───────────────────────────────────────────┘
```

The **browser is untrusted**. All sensitive authorization is evaluated inside Supabase.

---

## 17. Related Artifacts

| Artifact | Location / name |
|----------|------------------|
| Schema | `schema.sql` |
| API operations | `api.md` |
| Requirements | `srs.md` |
| UI system | `theme.md` |
| Code conventions | `coding_standard.md` |
| Product definition | PRD v0.3 |

---

*This architecture document should be updated when deployment topology, auth providers, or the admin/verifier split changes.*
