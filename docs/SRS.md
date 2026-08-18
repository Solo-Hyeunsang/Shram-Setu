# Shram Setu (श्रम सेतु) — Software Requirements Specification (SRS)

**Version:** 0.3 (Prototype — Two-Platform Architecture)  
**Last Updated:** 18 August 2026  
**Status:** Draft — Aligned with Product Requirements Document (PRD)  
**Document Type:** Software Requirements Specification  

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the Shram Setu prototype. It is the authoritative reference for developers, designers, and stakeholders during implementation and validation.

### 1.2 Scope

Shram Setu is a two-application system sharing a single Supabase backend:

| Application | Audience | Purpose |
|-------------|----------|---------|
| **Main Platform (RBC)** | Workers & Employers | Marketplace: registration, profiles, job posting, search, hiring, reviews, verification requests |
| **Admin Platform** | Platform admins (`admin` role) + Institution staff (`verifier` role, e.g. CTEVT) | Moderation, user management, analytics, and credential verification — separated by role-based access |

**In scope (prototype):** Core marketplace flows, worker-initiated verification against CTEVT, ratings/reviews, in-app notifications, admin moderation, verifier queue.

**Out of scope (deferred):** Multiple verification institutions, in-app chat, payments/escrow, push notifications, native mobile apps, Nepali UI localization, AI matching, government API integration, bulk hiring tools.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **RBC** | Internal name for the Main Platform (worker- and employer-facing marketplace) |
| **CTEVT** | Council for Technical Education and Vocational Training — Nepal’s primary vocational certification body |
| **Trade** | Broad occupation category (e.g. Electrician, Plumber) |
| **Skill** | Specific competency within a trade (e.g. Residential Wiring) |
| **Verification** | Confirmation of a worker’s qualifications by a recognized institution |
| **Institution** | Accredited body authorized to verify credentials (prototype: CTEVT only) |
| **RLS** | Row-Level Security (PostgreSQL) |
| **OTP** | One-Time Password (SMS for phone auth) |
| **NPR** | Nepalese Rupee |
| **BaaS** | Backend as a Service (Supabase) |

### 1.4 References

- Product Requirements Document (PRD) v0.3 — 18 August 2026  
- Database schema: `schema.sql`  
- Theme guide: `theme.md`  
- API reference: `api.md`  

### 1.5 Overview

This SRS is organized as follows:

- Section 2: Overall description (product perspective, user classes, constraints)  
- Section 3: System features and functional requirements  
- Section 4: External interface requirements  
- Section 5: Non-functional requirements  
- Section 6: Data requirements summary  
- Section 7: Success metrics and acceptance criteria  

---

## 2. Overall Description

### 2.1 Product Perspective

Shram Setu is a greenfield web product. It consists of:

- Two independent React (JavaScript) SPAs deployed on Vercel  
- One shared Supabase project (PostgreSQL, Auth, Storage, Realtime, RLS)  

```
┌──────────────────────┐
│   Supabase Cloud     │
│  (shared backend)    │
│  PostgreSQL + RLS    │
│  Auth / Storage      │
└───┬──────────────┬───┘
    │              │
    ▼              ▼
 Main Platform   Admin Platform
 (RBC)           (Admin + Verifier)
 Vercel          Vercel
```

### 2.2 Product Functions (Summary)

1. Worker registration, profile, skills, certifications, portfolio, availability, wage range  
2. Employer registration, worker search/filter, bookmarks, job posting  
3. Job lifecycle: post → apply → assign → complete  
4. Mutual ratings and reviews after job completion  
5. Worker-initiated verification request → CTEVT review → badge  
6. In-app notifications for key events  
7. Admin: user suspend/unsuspend, content moderation, job cancellation, platform stats  
8. Verifier: queue, approve/reject/request more info, audit trail, institution settings  

### 2.3 User Classes and Characteristics

| Persona | Characteristics | Platform |
|---------|-----------------|----------|
| **Worker** | Ages 18–55; basic smartphone literacy; Nepali-language preference; needs stable work and professional recognition | Main Platform (RBC) |
| **Employer** | Homeowners, contractors, SMEs, government/NGOs; need verified, available workers quickly | Main Platform (RBC) |
| **Verifier** | CTEVT staff; reviews credentials; scoped to institution | Admin Platform (`verifier` role) |
| **Admin** | Shram Setu internal ops; moderation, user management, analytics | Admin Platform (`admin` role) |

### 2.4 Operating Environment

- **Client:** Modern browsers (Chrome, Firefox, Safari, Edge); mobile-first for Main Platform; desktop-first for Admin Platform  
- **Backend:** Supabase Cloud (PostgreSQL 15+)  
- **Frontend hosting:** Vercel (two separate projects)  
- **Auth:** Supabase Auth — phone OTP / email magic link (Main); email + password (Admin)  

### 2.5 Design and Implementation Constraints

1. **Stack:** React (JS, not TypeScript), Vite, Tailwind CSS, shadcn/ui, Supabase JS client, React Router, React Hook Form  
2. **Two separate codebases** — no shared npm package in prototype (duplicate small model/shape files)  
3. **CTEVT-only** verification institution for prototype  
4. **English-first UI** (Nepali localization deferred)  
5. **No native apps** — responsive web only  
6. **No payments, chat, or push notifications** in prototype  

### 2.6 Assumptions and Dependencies

- Supabase free tier sufficient for prototype traffic  
- CTEVT reviews simulated by internal/institution accounts provisioned by system admin  
- Users have smartphone or desktop access and can complete OTP/email flows  
- Sample data will be seeded for validation  

---

## 3. System Features and Functional Requirements

### 3.1 Main Platform (RBC) — Workers & Employers

#### 3.1.1 Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | Workers and employers shall register and log in with phone number + OTP | Must |
| FR-AUTH-02 | Employers may alternatively use email + magic link | Must |
| FR-AUTH-03 | Session shall be managed via Supabase Auth; sign-out shall clear session | Must |
| FR-AUTH-04 | Suspended accounts shall be denied access after authentication | Must |

#### 3.1.2 Worker Profile

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-WP-01 | Worker shall create profile: name, photo, district, municipality, primary trade, years of experience, bio | Must |
| FR-WP-02 | Worker shall add skills from predefined taxonomy linked to trades | Must |
| FR-WP-03 | Worker shall upload certification documents (image/PDF) to Storage | Must |
| FR-WP-04 | Worker shall upload portfolio photos with captions | Should |
| FR-WP-05 | Worker shall set availability: Available / Busy / Not Taking Work | Must |
| FR-WP-06 | Worker shall set expected daily wage range (NPR) | Must |
| FR-WP-07 | Public profile shall display verification badge, ratings, skills, portfolio, experience | Must |
| FR-WP-08 | Worker shall edit own profile; cannot change role or verification_status directly | Must |

#### 3.1.3 Employer Profile & Search

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EP-01 | Employer shall create profile: name, type (individual/business/government/ngo), location, contact | Must |
| FR-EP-02 | Employer shall search workers by trade, location, verification status, availability, experience, wage range, rating | Must |
| FR-EP-03 | Employer shall view full worker profiles | Must |
| FR-EP-04 | Employer shall bookmark/save workers | Should |
| FR-EP-05 | Full-text search shall cover worker names, skills, and locations | Should |

#### 3.1.4 Jobs

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-JOB-01 | Employer shall post job: title, trade, location, duration, budget range, description | Must |
| FR-JOB-02 | Workers shall browse jobs filtered by trade, location, budget | Must |
| FR-JOB-03 | Worker shall apply to a job with optional message | Must |
| FR-JOB-04 | Employer shall view applicants and accept or reject | Must |
| FR-JOB-05 | Job status flow: Open → Applications Received → Worker Assigned → Completed (or Cancelled) | Must |
| FR-JOB-06 | Employer shall mark job complete after offline work | Must |

#### 3.1.5 Ratings & Reviews

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-REV-01 | After job completed, employer shall rate worker (1–5) and leave text review | Must |
| FR-REV-02 | Worker shall rate employer (1–5) with text review | Must |
| FR-REV-03 | Average rating and review count shall display on both profiles | Must |
| FR-REV-04 | Reviews shall be public and non-editable after submission | Must |

#### 3.1.6 Verification Request (Worker Side)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-VER-01 | Worker shall request verification; institution auto-selected as CTEVT | Must |
| FR-VER-02 | Worker shall submit uploaded certifications with the request | Must |
| FR-VER-03 | Worker shall see status: Pending → In Review → Verified / Rejected / More Info Needed | Must |
| FR-VER-04 | On rejection or more-info, worker shall see reason/message and may re-submit | Must |
| FR-VER-05 | On approval, green “Government Verified” badge shall appear on public profile | Must |

#### 3.1.7 Discovery & Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DIS-01 | Landing page shall show hero, how-it-works, featured verified workers, trade categories, recent jobs, CTA | Must |
| FR-DIS-02 | Trade category grid with icons shall be available | Must |
| FR-NOT-01 | In-app notification bell shall show: applications, accept/reject, reviews, verification status changes | Must |
| FR-NOT-02 | Notifications shall be markable as read; no push/email/SMS in prototype | Must |

---

### 3.2 Admin Platform — Operations & Verification

#### 3.2.1 Auth & Role Routing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ADM-01 | Login with email + password | Must |
| FR-ADM-02 | Post-login routing based on `profiles.role` and `institution_members` | Must |
| FR-ADM-03 | Sidebar shall show only modules permitted by role(s) | Must |

#### 3.2.2 Admin Module (`admin` role)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ADM-10 | View platform statistics: workers, employers, jobs posted/completed, verification rates, reviews | Must |
| FR-ADM-11 | List/search/filter workers and employers; suspend/unsuspend accounts | Must |
| FR-ADM-12 | Flag or remove inappropriate profiles, portfolio images, reviews | Must |
| FR-ADM-13 | View all jobs; cancel fraudulent postings | Must |
| FR-ADM-14 | Admin **shall not** approve or reject verification requests | Must |

#### 3.2.3 Verifier Module (`verifier` role)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-VER-10 | Dashboard: pending, in-review, recently completed counts | Must |
| FR-VER-11 | Verification queue filterable by trade, date, status | Must |
| FR-VER-12 | Request detail: worker summary, certifications (view/download), previous attempts | Must |
| FR-VER-13 | Actions: Approve / Reject / Request More Info — each with mandatory notes | Must |
| FR-VER-14 | Full audit trail of institution decisions | Must |
| FR-VER-15 | Institution profile settings; manage reviewer accounts (`institution_admin`) | Should |
| FR-VER-16 | Verifier **shall not** suspend users, moderate content, or view platform-wide stats | Must |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

- **Main Platform:** Mobile-first responsive; clean cards; prominent verification badges and ratings  
- **Admin Platform:** Desktop-first; left sidebar navigation; data tables; document viewer  
- Shared brand: color palette, typography, and component patterns per `theme.md`  

### 4.2 Hardware Interfaces

None. Browser-based only.

### 4.3 Software Interfaces

| Interface | Description |
|-----------|-------------|
| Supabase Auth | Phone OTP, email magic link, email/password |
| Supabase PostgreSQL | All persistent data via JS client + RLS |
| Supabase Storage | avatars, certifications, portfolio, institution-logos |
| Vercel | Hosting for both React SPAs |

### 4.4 Communications Interfaces

- HTTPS only  
- Supabase Realtime optional for future; prototype uses polling or client refresh for notifications  

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-PERF-01 | Page load (Lighthouse) < 3 seconds on simulated 3G for critical Main Platform pages |
| NFR-PERF-02 | Search and list queries shall return within 2 seconds under prototype data volumes |

### 5.2 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-01 | All tables protected by RLS; policies enforce role and ownership |
| NFR-SEC-02 | Certification documents readable only by owner, relevant institution reviewers, and admins |
| NFR-SEC-03 | Admin cannot perform verification actions; verifier cannot perform admin moderation actions |
| NFR-SEC-04 | File uploads restricted to image/PDF MIME types; size limits via Storage policies |
| NFR-SEC-05 | Auth rate limiting provided by Supabase |

### 5.3 Reliability & Availability

| ID | Requirement |
|----|-------------|
| NFR-REL-01 | Prototype depends on Supabase and Vercel free-tier SLAs |
| NFR-REL-02 | Schema changes shall be additive during prototype to avoid breaking both apps |

### 5.4 Usability

| ID | Requirement |
|----|-------------|
| NFR-USE-01 | Forms short; large touch targets for Main Platform |
| NFR-USE-02 | WCAG 2.1 AA target: sufficient contrast, readable font sizes |
| NFR-USE-03 | Clear primary action on every page |

### 5.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-MAIN-01 | Two separate React projects; model/shape files duplicated for prototype simplicity |
| NFR-MAIN-02 | Admin and Verifier modules separated by folders and route guards inside one Admin app |

### 5.6 Localization

| ID | Requirement |
|----|-------------|
| NFR-LOC-01 | Prototype UI in English; `name_ne` on trades prepared for future Nepali support |

---

## 6. Data Requirements Summary

Primary entities (see `schema.sql` for full definition):

- `profiles`, `worker_profiles`, `employer_profiles`  
- `trades`, `worker_skills`  
- `certifications`, `portfolio_items`  
- `institutions`, `institution_members`, `verification_requests`  
- `jobs`, `job_applications`, `reviews`, `bookmarks`, `notifications`  

Key invariants:

- Reviews are write-once  
- Verification decisions form an immutable audit trail (new request row on re-submit)  
- `worker_profiles.verification_status` is synced from `verification_requests` via trigger  

---

## 7. Success Metrics & Acceptance Criteria (Prototype)

| Metric | Target |
|--------|--------|
| Worker registrations | 50+ |
| Employer registrations | 15+ |
| Jobs posted | 20+ |
| Jobs completed (full lifecycle) | 5+ |
| Reviews submitted | 10+ |
| Verification requests submitted | 10+ |
| Verification requests processed | 10+ |
| Average worker profile completion | >70% of fields |
| End-to-end cycles (register → verify → hire → review) | 3+ |
| User feedback score | >4/5 |
| Page load (Lighthouse, 3G) | <3 s |

**Acceptance:** All Must-priority FRs implemented and validated against the above metrics in user testing with 10–15 workers and 5–10 employers.

---

## 8. Traceability

| Area | PRD Section | SRS Section |
|------|-------------|-------------|
| Vision & problem | 1–2 | 1–2 |
| Personas | 3 | 2.3 |
| Architecture | 5 | 2.1, 4 |
| Features | 6 | 3 |
| IA & flows | 7–8 | 3, 4.1 |
| Data model | 9 | 6 + schema.sql |
| Tech stack | 10 | 2.5 |
| UI guidelines | 11 | theme.md |
| API | 12 | api.md |
| Security | 13 | 5.2 |
| Roadmap & metrics | 14–15 | 7 |

---

*This SRS is a living document and will be updated as the prototype is validated.*
