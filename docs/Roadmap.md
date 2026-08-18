# Shram Setu (श्रम सेतु) — Roadmap, Brain & Progress Tracker

**Version:** 0.3 (Prototype)  
**Last Updated:** 18 August 2026  
**Status:** Active — single source of truth for *what to build next*  
**Horizon:** Prototype only (Phases 0–7). Post-prototype items are listed, not scheduled.

---

## 0. How to Use This Document (The Brain)

This file is the **control plane** for the prototype. Use it as:

| Role | How |
|------|-----|
| **Brain** | Decisions, scope locks, definition of done, and “what is blocked” live here |
| **Roadmap** | Ordered phases with dependencies — do not skip gates |
| **Progress tracker** | Checkboxes + phase status; update at the end of every work session |
| **Flow controller** | Entry criteria → work items → exit criteria → next phase unlock |

### Rules of engagement

1. **One active phase at a time** (except documented parallel prep).  
2. **No feature from a later phase** until the current phase exit criteria pass.  
3. **Scope lock:** If it is not in this roadmap or the PRD MVP list, it is deferred.  
4. **Docs are law:** Implementation must match `schema.sql`, `Contract.md`, `srs.md`, `architecture.md`.  
5. **Update the tracker** when a checkbox changes — this file is the status report.  
6. **Phase gate review:** Mark the phase `Done` only when *all* exit criteria are met.

### Status legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Done |
| `[!]` | Blocked (note why under Phase Notes) |
| `[D]` | Deferred / dropped |

### Phase status values

`Not started` → `In progress` → `Blocked` → `Done`

---

## 1. North Star (Prototype)

**Goal:** Prove that a worker can register, get CTEVT-style verification, be hired, complete a job, and exchange reviews — on a trusted, two-app architecture.

**Success bar (from PRD / SRS):**

| Metric | Target | Actual | Met? |
|--------|--------|--------|------|
| Worker profiles | 50+ | — | |
| Employer profiles | 15+ | — | |
| Jobs posted | 20+ | — | |
| Jobs completed (full lifecycle) | 5+ | — | |
| Reviews submitted | 10+ | — | |
| Verification requests submitted | 10+ | — | |
| Verification processed | 10+ | — | |
| Profile completion rate | >70% | — | |
| E2E cycles (register→verify→hire→review) | 3+ | — | |
| User feedback score | >4/5 | — | |
| Lighthouse critical pages (3G) | <3s | — | |

Fill **Actual** during Phase 7.

---

## 2. Global Dependencies & Locks

### 2.1 Hard dependencies

```
Phase 0 (Docs & repo hygiene)
    → Phase 1 (Supabase foundation)
        → Phase 2 (Main Platform foundation)
            → Phase 3 (Main core features)
                → Phase 4 (Trust & polish)
                    → Phase 5 (Admin foundation + admin module)
                        → Phase 6 (Verifier module)
                            → Phase 7 (Integration & validation)
```

### 2.2 Scope locks (prototype)

| Locked in | Locked out |
|-----------|------------|
| CTEVT-only verification | Multiple institutions UI |
| English UI | Nepali localization |
| In-app notifications only | Push / SMS / email notify |
| Web responsive | Native apps |
| Manual verifier review | Real government API |
| Supabase client direct | Custom REST server |
| Two Vercel SPAs | Monorepo shared package |
| Phone OTP + magic link (Main); password (Admin) | Social logins |

### 2.3 Document map (always current)

| Artifact | Path | Governs |
|----------|------|---------|
| PRD | source brief | Product intent |
| Schema | `schema.sql` | Database |
| Contracts | `Contract.md` | API / RLS behavior |
| Architecture | `architecture.md` | System shape |
| SRS | `srs.md` | Requirements IDs |
| Theme | `theme.md` | UI tokens |
| API guide | `api.md` | Client call patterns |
| Coding standard | `coding_standard.md` | How to write code |
| **This file** | `Roadmap.md` | Sequence & progress |

---

## 3. Phase Tracker Overview

| Phase | Name | Weeks (plan) | Status | Owner | Exit gate |
|-------|------|--------------|--------|-------|-----------|
| 0 | Docs, repo, toolchains | 0 | Not started | — | Checklist complete |
| 1 | Supabase foundation | 1 | Not started | — | Schema + RLS + seeds live |
| 2 | Main Platform foundation | 2–3 | Not started | — | Auth + landing + deploy |
| 3 | Main core features | 4–6 | Not started | — | Jobs + profiles + verify request |
| 4 | Trust & polish | 7–8 | Not started | — | Reviews + notifications + responsive |
| 5 | Admin foundation + admin module | 9 | Not started | — | Moderation + stats deployed |
| 6 | Verifier module | 10 | Not started | — | Approve/reject path live |
| 7 | Integration & validation | 11–12 | Not started | — | Metrics + E2E sign-off |

**Current active phase:** `Phase 0`  
**Last progress update:** 18 August 2026  

---

## 4. Phase 0 — Docs, Repo & Toolchains

**Status:** `Not started`  
**Goal:** Everyone builds against the same contracts; repos and tooling exist.

### Entry criteria

- [x] PRD available  
- [x] Engineering docs drafted (`schema.sql`, `srs`, `theme`, `api`, `coding_standard`, `architecture`, `Contract`, this roadmap)

### Work items

- [ ] Create Git repos (or monorepo folders): `shramsetu`, `shramsetu-admin`  
- [ ] Add `.env.example` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) to both  
- [ ] Add Prettier (and optional ESLint) aligned with `coding_standard.md`  
- [ ] Confirm Vercel accounts / project names reserved  
- [ ] Confirm Supabase project created (empty is fine)  
- [ ] Pin doc versions in README pointing to this Roadmap as the brain  

### Exit criteria

- [ ] Both app folders scaffoldable or already `npm create vite` ready  
- [ ] All docs linked from a root README  
- [ ] Team agrees: **no feature work before Phase 1 schema is applied**

### Phase notes

```
(Add blockers, decisions, dates here)
```

---

## 5. Phase 1 — Supabase Foundation

**Status:** `Not started`  
**Goal:** Shared backend is real: schema, RLS, storage, triggers, seeds.

### Entry criteria

- [ ] Phase 0 exit criteria met  
- [ ] Supabase project URL and anon key available to the team  

### Work items

- [ ] Apply `schema.sql` (enums, tables, indexes, triggers, RLS, grants)  
- [ ] Verify RLS enabled on all domain tables  
- [ ] Create Storage buckets: `avatars`, `portfolio`, `certifications`, `institution-logos`  
- [ ] Apply Storage policies (public vs private per `Contract.md`)  
- [ ] Seed `trades` (10 categories)  
- [ ] Seed `institutions` (CTEVT) + `trades_covered`  
- [ ] Configure Auth providers: phone OTP, email (magic link + password for admin)  
- [ ] Manually create at least one `admin` profile and one `verifier` + `institution_members` row for CTEVT  
- [ ] Smoke-test policies with two test users (worker vs verifier) in SQL/Editor  

### Exit criteria

- [ ] Schema matches `schema.sql` / `Contract.md`  
- [ ] CTEVT row exists; trades selectable  
- [ ] Admin and verifier test accounts can sign in at Auth level  
- [ ] Cross-role checks documented (admin cannot update verification_requests)  

### Phase notes

```
```

### Gate decision

- [ ] **GO Phase 2** only if exit criteria checked  

---

## 6. Phase 2 — Main Platform (RBC) Foundation

**Status:** `Not started`  
**Goal:** Deployable Main app shell with auth and landing.

### Entry criteria

- [ ] Phase 1 exit criteria met  
- [ ] `VITE_*` env set locally and in Vercel project `shramsetu`  

### Work items

- [ ] Vite + React (JS) + Tailwind + shadcn/ui init  
- [ ] Theme tokens from `theme.md` in Tailwind config  
- [ ] `supabaseClient.js` + `AuthContext` / `useAuth`  
- [ ] Auth flows: phone OTP, optional email magic link  
- [ ] Onboarding stub: create `profiles` + role selection (worker/employer)  
- [ ] `ProtectedRoute` / `RoleRoute`  
- [ ] Landing page (hero, how it works, CTA, placeholders for featured/jobs)  
- [ ] Header / footer shell  
- [ ] Deploy to Vercel; preview URL works  

### Exit criteria

- [ ] New user can OTP login and land in onboarding  
- [ ] Suspended flag checked post-login (even if no admin UI yet)  
- [ ] Production/preview deploy green  
- [ ] No domain features beyond shell/auth required yet  

### Phase notes

```
```

### Gate decision

- [ ] **GO Phase 3**

---

## 7. Phase 3 — Main Platform Core Features

**Status:** `Not started`  
**Goal:** Full marketplace path except reviews/notifications polish.

### Entry criteria

- [ ] Phase 2 exit criteria met  

### Work items

**Workers**

- [ ] Worker profile create/edit (trade, experience, wages, availability, bio, photo)  
- [ ] Skills taxonomy UI (from `trades` / `worker_skills`)  
- [ ] Certification upload → Storage + `certifications` rows  
- [ ] Portfolio upload  
- [ ] Public worker profile view  
- [ ] Verification request submit (CTEVT auto-selected) + status display on dashboard  

**Employers**

- [ ] Employer profile create/edit  
- [ ] Worker search + filters (trade, location, verification, availability, experience, wage, rating)  
- [ ] Bookmark workers  
- [ ] Post job  
- [ ] Manage job: list applicants, accept/reject, assign worker, mark complete  

**Jobs (shared)**

- [ ] Worker job browse + apply  
- [ ] Job status flow per `Contract.md`  

**API modules**

- [ ] `workerApi`, `employerApi`, `jobApi`, `verificationApi` per `api.md` / `coding_standard.md`  

### Exit criteria

- [ ] Worker can go: register → complete profile → request verification  
- [ ] Employer can go: register → search → post job → assign → complete  
- [ ] RLS violations surface as friendly errors (spot-check)  
- [ ] No reviews/notifications required yet for gate (those are Phase 4)  

### Phase notes

```
```

### Gate decision

- [ ] **GO Phase 4**

---

## 8. Phase 4 — Trust & Polish (Main)

**Status:** `Not started`  
**Goal:** Trust signals and usable mobile UX on Main Platform.

### Entry criteria

- [ ] Phase 3 exit criteria met  

### Work items

- [ ] Ratings & reviews after job completed (both directions)  
- [ ] Average rating display on cards/profiles  
- [ ] Verification badge component (all statuses) + dashboard status card  
- [ ] In-app notifications bell (list, mark read)  
- [ ] Homepage: featured verified workers, recent jobs, trade grid wired to data  
- [ ] Responsive polish (mobile-first); touch targets  
- [ ] Empty / loading / error states on key pages  
- [ ] Bug bash on Main flows  
- [ ] Lighthouse pass attempt on landing + search + profile  

### Exit criteria

- [ ] Review write-once behavior confirmed  
- [ ] Notification rows appear on apply / review / (verification events once Phase 6 exists — stubs OK)  
- [ ] Mobile usable for register, search, apply  
- [ ] Known P0 bugs closed  

### Phase notes

```
```

### Gate decision

- [ ] **GO Phase 5** (Main is feature-complete for prototype)

---

## 9. Phase 5 — Admin Platform Foundation + Admin Module

**Status:** `Not started`  
**Goal:** Ops can moderate the marketplace.

### Entry criteria

- [ ] Phase 4 exit criteria met  
- [ ] Admin test account works against Supabase Auth  
- [ ] Vercel project `shramsetu-admin` env configured  

### Work items

- [ ] Second Vite app scaffold (JS, Tailwind, shadcn, theme parity)  
- [ ] Email/password login  
- [ ] `RoleContext` + `RoleRouter` (admin vs verifier vs both)  
- [ ] Sidebar shell (admin section only for pure admin)  
- [ ] Dashboard stats (counts: workers, employers, jobs, completed, reviews, verification rates)  
- [ ] User management: list/search workers & employers; suspend/unsuspend  
- [ ] Content moderation: remove portfolio items / reviews (flagged workflow can be manual list)  
- [ ] Job oversight: list jobs; cancel  
- [ ] Deploy Admin app  

### Exit criteria

- [ ] Admin can suspend a user and that user is blocked on Main  
- [ ] Admin can cancel a job  
- [ ] Admin UI does **not** expose approve/reject verification actions  
- [ ] Deploy green  

### Phase notes

```
```

### Gate decision

- [ ] **GO Phase 6**

---

## 10. Phase 6 — Verifier Module (CTEVT)

**Status:** `Not started`  
**Goal:** Close the verification loop end-to-end.

### Entry criteria

- [ ] Phase 5 exit criteria met  
- [ ] CTEVT verifier user + `institution_members` row exists  

### Work items

- [ ] Verifier dashboard (pending / in-review / completed counts)  
- [ ] Queue tabs: pending, in-review, completed  
- [ ] Request detail: worker summary, certification viewer, history  
- [ ] Actions: Approve / Reject / Request More Info (+ mandatory notes/reasons)  
- [ ] Audit / history list  
- [ ] Institution settings (profile + manage reviewers) — should-have  
- [ ] Confirm triggers: worker badge updates on Main; notifications fire  
- [ ] RLS proof: verifier cannot suspend; admin cannot approve  

### Exit criteria

- [ ] E2E: worker requests → verifier approves → green badge on Main public profile  
- [ ] Reject and more-info paths show reasons on worker dashboard  
- [ ] Cross-role isolation tests written down (manual script OK)  

### Phase notes

```
```

### Gate decision

- [ ] **GO Phase 7**

---

## 11. Phase 7 — Integration & Validation

**Status:** `Not started`  
**Goal:** Prove product-market prototype readiness.

### Entry criteria

- [ ] Phase 6 exit criteria met  

### Work items

- [ ] E2E script runbook (register → verify → hire → review) executed ≥3 times  
- [ ] Seed realistic sample data (50+ workers, 20+ jobs) if organic low  
- [ ] User testing: 10–15 workers, 5–10 employers  
- [ ] Collect feedback scores; log issues  
- [ ] Fix P0/P1 from testing  
- [ ] Fill success metrics table in §1  
- [ ] Demo script + pitch materials  
- [ ] Retrospective: what moves to v2 backlog  

### Exit criteria

- [ ] Success metrics met or consciously waived with note  
- [ ] At least 3 full E2E cycles documented  
- [ ] Stakeholder demo completed  
- [ ] Prototype **Declared Complete** in §13  

### Phase notes

```
```

---

## 12. Flow Controller (Daily / Weekly)

### Daily standup prompts

1. What phase are we in?  
2. Which checkboxes moved since yesterday?  
3. Any `[!]` blockers?  
4. Are we sneaking in out-of-scope work? (If yes → stop or log under Deferred)

### Weekly gate review

1. Re-read current phase **exit criteria**  
2. Update Overview table status  
3. If exit met → check **GO next phase** and change **Current active phase** in §3  
4. If not met → list remaining items only (avoid starting next phase)

### Change control

| Change type | Action |
|-------------|--------|
| New MVP feature request | Add to Deferred unless it unblocks a metric; do not insert into active phase without rewriting exit criteria |
| Schema change | Update `schema.sql` + `Contract.md` first; migrate; then code |
| Role/permission change | Update `Contract.md` + RLS; add isolation test to Phase 6/7 notes |
| Skip phase | **Not allowed** without written exception in §13 |

---

## 13. Decisions Log & Exceptions

Record standing decisions and any approved deviations.

| Date | Decision | Rationale | Approved by |
|------|----------|-----------|-------------|
| 2026-08-18 | Two SPAs, one Supabase | PRD ADR | — |
| 2026-08-18 | Admin+Verifier single Admin app | Role isolation via RLS | — |
| 2026-08-18 | JS not TS for prototype | Speed | — |
| | | | |

**Exceptions to phase order**

| Date | Exception | Expires | Notes |
|------|-----------|---------|-------|
| — | — | — | — |

**Prototype complete declaration**

- [ ] Date: __________  
- [ ] Sign-off: __________  

---

## 14. Deferred Backlog (Not in prototype flow)

Pull from here **only after** Phase 7 or explicit exception.

- [ ] Multiple verification institutions UI  
- [ ] Nepali language UI  
- [ ] In-app messaging  
- [ ] Payments / escrow (eSewa, Khalti)  
- [ ] Push notifications (FCM)  
- [ ] Native Android / iOS  
- [ ] Government API integration  
- [ ] AI matching  
- [ ] Bulk / enterprise hiring  
- [ ] Training marketplace  
- [ ] Shared npm package across apps  
- [ ] Admin VPN / IP restriction  
- [ ] PWA offline support  
- [ ] Standalone Verifier Portal split  

---

## 15. Risk Watchlist (Brain)

| Risk | Phase most exposed | Mitigation | Status |
|------|--------------------|------------|--------|
| Empty marketplace | 3–7 | Seed data; institute recruitment | Open |
| Low smartphone literacy | 2–4 | Short forms; large targets | Open |
| Trust without verified workers | 4–6 | Prioritize verification E2E | Open |
| RLS leak admin↔verifier | 5–6 | Explicit isolation tests | Open |
| Scope creep | All | This roadmap gate rules | Open |
| Supabase free tier limits | 7 | Monitor; upgrade if needed | Open |
| CTEVT partnership delay | 6–7 | Simulated CTEVT accounts | Open |

Update **Status** to `Mitigated` / `Accepted` as you go.

---

## 16. Session Log (Progress Journal)

Append short entries; newest first.

```
### 2026-08-18
- Docs pack created: schema, SRS, theme, API, coding standard, architecture, Contract, Roadmap
- Active phase set to Phase 0
- Next: repo scaffold + Supabase project (Phase 0 → 1)
```

---

## 17. Quick Start — “What Do I Do Right Now?”

1. Open §3 — note **Current active phase**.  
2. Jump to that phase section.  
3. Pick the first unchecked work item that is not blocked.  
4. Implement against `Contract.md` + `coding_standard.md`.  
5. Check the box; add a Session Log line.  
6. If all exit criteria are `[x]`, run Gate decision and advance §3.

---

*This roadmap is the brain. If it is not checked off here, it is not done. If it is not in an active phase, it is not being built.*
