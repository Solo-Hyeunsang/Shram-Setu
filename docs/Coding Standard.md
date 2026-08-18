# Shram Setu (श्रम सेतु) — Coding Standards

**Version:** 0.3 (Prototype)  
**Last Updated:** 18 August 2026  
**Stack:** React (JavaScript), Vite, Tailwind CSS, shadcn/ui, Supabase JS, React Router, React Hook Form  

This document defines conventions for both **Main Platform (RBC)** and **Admin Platform** codebases. Follow it so the two apps stay readable, consistent, and easy to hand off.

---

## 1. Guiding Principles

1. **Clarity over cleverness** — Prefer obvious code. Prototype speed matters, but not at the cost of readability.
2. **Thin UI, clear data layer** — Pages compose components; API modules own Supabase calls.
3. **RLS is the real security** — Never assume the UI alone protects data. Client checks are UX; server policies enforce access.
4. **Duplicate small shared shapes** — No shared npm package in the prototype. Copy small `*.model.js` / constant files between apps when needed.
5. **Mobile-first on Main; desktop-first on Admin** — Layout and interaction patterns differ; shared tokens stay the same (`theme.md`).

---

## 2. Project Structure

### 2.1 Main Platform (`shramsetu/`)

```
src/
├── api/                 # Supabase client + domain API modules
├── context/             # AuthContext, NotificationContext
├── hooks/               # useAuth, useWorkerProfile, useJobs, …
├── routes/              # ProtectedRoute, RoleRoute
├── pages/               # Route-level screens (Landing, Auth, Worker/*, Employer/*, Shared/*)
├── components/          # Reusable UI (WorkerCard, JobCard, …)
├── utils/               # Pure helpers, formatters, constants
├── styles/              # Global CSS if needed beyond Tailwind
├── App.jsx
└── main.jsx
```

### 2.2 Admin Platform (`shramsetu-admin/`)

```
src/
├── api/
├── context/             # AuthContext, RoleContext
├── routes/              # ProtectedRoute, AdminRoute, VerifierRoute
├── pages/
│   ├── Login/
│   ├── RoleRouter/
│   ├── admin/           # Dashboard, UserManagement, …
│   └── verifier/        # Dashboard, VerificationQueue, …
├── components/          # SidebarNav, DataTable, StatCard, …
├── utils/
├── App.jsx
└── main.jsx
```

**Rules:**

- One primary component per page folder (`index.jsx` or `PageName.jsx`).
- Co-locate small page-only subcomponents under the page folder if they are not reused.
- Shared components live in `components/`; do not put route-specific logic there.

---

## 3. Naming Conventions

| Kind | Convention | Examples |
|------|------------|----------|
| Files (components) | PascalCase | `WorkerCard.jsx`, `VerificationBadge.jsx` |
| Files (hooks, utils, api) | camelCase | `useAuth.js`, `jobApi.js`, `formatWage.js` |
| Folders | PascalCase for pages; kebab or camel for others | `Worker/`, `UserManagement/`, `api/` |
| React components | PascalCase | `function WorkerCard() {}` |
| Functions / variables | camelCase | `fetchPendingRequests`, `isVerified` |
| Constants | UPPER_SNAKE or camelCase object | `JOB_STATUS`, `verificationStatusLabels` |
| DB / API field names | snake_case (match PostgreSQL) | `daily_wage_min`, `verification_status` |
| CSS classes | Tailwind utilities; avoid custom class names unless necessary | `className="rounded-xl bg-white p-4"` |
| Event handlers | `handle` + verb | `handleSubmit`, `handleApprove` |
| Boolean props / vars | `is` / `has` / `can` prefix | `isLoading`, `hasBadge`, `canReview` |

**Do not** use TypeScript-style filenames (`.tsx`) — this project is **JavaScript only**.

---

## 4. JavaScript Style

### 4.1 Language

- **ES modules** (`import` / `export`) only.
- Prefer `const` / `let`; never `var`.
- Prefer arrow functions for callbacks and small helpers; `function` declarations for named top-level components and hooks are fine.
- Optional chaining (`?.`) and nullish coalescing (`??`) are encouraged.
- Avoid `any`-style loose patterns; be explicit with defaults and guards.

### 4.2 Formatting

- **Indent:** 2 spaces.
- **Quotes:** single quotes for JS strings; double quotes in JSX attributes when needed.
- **Semicolons:** yes (consistent with typical Vite/React setups).
- **Trailing commas:** yes in multi-line objects/arrays.
- **Line length:** soft limit ~100 characters; break props and arguments rather than ultra-long lines.
- Use Prettier (recommended) with project defaults; do not fight the formatter in review.

### 4.3 Imports Order

1. External packages (`react`, `react-router-dom`, `@supabase/supabase-js`, …)
2. Internal aliases / absolute (`@/components/...` if configured)
3. Relative (`../api/jobApi`, `./WorkerCard`)
4. Styles (if any)

Group with a blank line between external and internal.

```js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../api/supabaseClient';
import { fetchJobs } from '../api/jobApi';
import { WorkerCard } from '../components/WorkerCard';
```

---

## 5. React Conventions

### 5.1 Components

- **Function components only** (no class components).
- One exported component per file for reusable UI; default export for page-level screens is acceptable.
- Keep components focused: if a file exceeds ~200–250 lines, split presentational pieces or extract hooks.
- Prefer **composition** over deep prop drilling; use context sparingly (auth, role, notifications).

```jsx
// Good: clear props, early return
export function VerificationBadge({ status }) {
  if (!status) return null;

  const label = STATUS_LABELS[status] ?? status;
  const colorClass = STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
```

### 5.2 Hooks

- Custom hooks start with `use` and live in `hooks/`.
- Hooks own data fetching and derived state; components own presentation and local UI state.
- Do not call hooks conditionally.

```js
// hooks/useWorkerProfile.js
export function useWorkerProfile(workerId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await getWorkerProfile(workerId);
      if (cancelled) return;
      if (err) setError(err);
      else setProfile(data);
      setLoading(false);
    }

    if (workerId) load();
    return () => { cancelled = true; };
  }, [workerId]);

  return { profile, loading, error };
}
```

### 5.3 State

- Local UI state: `useState` / `useReducer`.
- Auth and cross-page concerns: Context.
- Optional light global store (e.g. Zustand) only if Context becomes noisy — do not introduce heavy state libraries for the prototype.
- Server state: fetch in hooks/API modules; consider TanStack Query later if caching/duplication becomes painful.

### 5.4 Lists & Keys

- Use stable unique ids (`id` from database) as `key`, never array index for dynamic lists.

### 5.5 Effects

- Every `useEffect` should document dependency intent.
- Clean up subscriptions, timers, and in-flight flags (`cancelled` pattern above).
- Prefer deriving values during render over syncing state in effects when possible.

---

## 6. Routing & Access Control

### 6.1 Route guards

- **Main Platform:** `ProtectedRoute` (must be logged in), `RoleRoute` (worker vs employer).
- **Admin Platform:** `ProtectedRoute`, `AdminRoute`, `VerifierRoute`.
- Guards read `profiles.role` / `institution_members`; **never** trust client-only checks for security.

```jsx
// Pseudocode pattern
if (!session) return <Navigate to="/login" replace />;
if (profile?.is_suspended) return <SuspendedScreen />;
if (requiredRole && profile.role !== requiredRole) return <Navigate to="/" replace />;
```

### 6.2 Navigation

- Use React Router (`Link`, `NavLink`, `useNavigate`).
- After mutations that change list membership (e.g. suspend user, approve verification), navigate or invalidate local state deliberately.

---

## 7. API & Supabase Layer

### 7.1 Module boundaries

- All Supabase access goes through `src/api/*`.
- Pages and components **do not** import `supabase` directly except rare cases (e.g. auth listener in context).
- Each function returns a consistent shape when practical:

```js
// Prefer
return { data, error };

// Call site
const { data, error } = await jobApi.listOpenJobs(filters);
if (error) {
  // show toast / set error state
  return;
}
```

### 7.2 Naming API functions

- Verbs: `get`, `list`, `create`, `update`, `remove` (or `delete`), `search`.
- Examples: `getWorkerProfile`, `listPendingVerificationRequests`, `createJobApplication`, `updateVerificationStatus`.

### 7.3 Errors

- Always check `error` from Supabase.
- Map known failures to user-facing messages; log the raw error for debugging.
- Do not swallow errors silently.

### 7.4 Field names

- Keep **snake_case** at the API/DB boundary.
- Map to camelCase in the UI layer only if it improves readability — if you map, do it in one place (api module or a small mapper), not scattered in components.

### 7.5 Security reminders

- Do not put service-role keys in the frontend.
- Assume RLS will reject unauthorized writes; handle those errors gracefully.
- Certification files: prefer private bucket + signed URLs.

---

## 8. Forms

- Use **React Hook Form** for multi-field forms (registration, job post, verification actions).
- Validate required fields client-side; still rely on DB constraints and RLS.
- Disable submit while `isSubmitting`; show field-level and form-level errors.
- Primary action label should match the task (“Request Verification”, “Post Job”, “Approve”).

```jsx
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  defaultValues: { title: '', budget_min: '' },
});

const onSubmit = async (values) => {
  const { error } = await createJob(values);
  if (error) { /* toast */ return; }
  navigate('/employer/jobs');
};
```

---

## 9. Styling

### 9.1 Tailwind + shadcn/ui

- Prefer Tailwind utility classes; follow `theme.md` tokens (primary, secondary, danger, etc.).
- Use shadcn/ui primitives (Button, Input, Dialog, Table, …) customized to the palette — do not invent parallel component systems.
- Avoid inline `style={{}}` except for dynamic values that utilities cannot express (e.g. width from data).

### 9.2 Responsive

- **Main Platform:** mobile-first (`sm:`, `md:`, `lg:`). Touch targets ≥ 44px for primary actions.
- **Admin Platform:** comfortable desktop density; tables may horizontal-scroll on smaller screens rather than breaking usability.

### 9.3 Status & trust UI

- Verification badge, stars, and availability must remain visible and consistent (`theme.md` semantic colors).
- Never convey status by color alone — include text or icon.

---

## 10. Comments & Documentation

- Prefer self-explanatory names over comments.
- Comment **why**, not **what**, when the reason is non-obvious (e.g. RLS quirk, CTEVT-only prototype constraint).
- Public API modules may include a one-line JSDoc description for non-obvious functions.
- Do not leave large blocks of commented-out code in main branches.

```js
// Prototype: only CTEVT exists; institution is auto-selected for workers.
const institutionId = ctevt.id;
```

---

## 11. Async, Loading, and Empty States

Every data-dependent view should handle:

1. **Loading** — skeleton or spinner (avoid layout jump when possible).
2. **Error** — short message + retry if useful.
3. **Empty** — explanation + primary CTA (“Post a job”, “Complete your profile”).

Do not leave screens blank while fetching.

---

## 12. Notifications & Toasts

- Use a single toast/notification pattern for success and failure of mutations.
- In-app notification bell reads from `notifications` table; mark read via API module.
- Do not spam toasts on every background refetch.

---

## 13. File Uploads

- Restrict accept types in the input (`image/*`, `application/pdf`) to match Storage policies.
- Show upload progress or disabled state while uploading.
- Store **storage path** (or public URL for public buckets) in the database; do not embed binary in Postgres.
- Max size: enforce in UI and Storage policies (recommend documenting a limit, e.g. 5 MB images / 10 MB PDFs).

---

## 14. Environment & Config

- Only `VITE_*` variables in client code.
- Never commit `.env` with real keys; provide `.env.example` with placeholders.
- Feature flags: simple constants in `utils/constants.js` if needed for prototype toggles.

---

## 15. Git & Commits (Recommended)

- Branch names: `feat/worker-search`, `fix/verification-badge`, `chore/seed-trades`.
- Commits: imperative, focused (“Add job application API module”, not “updates”).
- Do not commit `node_modules`, build output, or secrets.
- Keep PR/diff scope aligned with one feature or fix when possible.

---

## 16. Testing Expectations (Prototype)

Automated test suite is not mandatory for the prototype, but:

- Manually verify critical paths in PRD success metrics (register → verify → hire → review).
- Before merging verification or admin changes, confirm **role isolation** (admin cannot approve; verifier cannot suspend).
- Smoke-test on a mid-size mobile viewport for Main Platform flows.

If tests are added later: prefer testing api modules and pure utils first; component tests second.

---

## 17. Anti-Patterns (Avoid)

| Avoid | Prefer |
|-------|--------|
| Supabase calls inside random components | `api/` modules + hooks |
| Prop drilling auth through 5 levels | `AuthContext` / `useAuth` |
| Index as React `key` for dynamic lists | Database `id` |
| Editing reviews or verification history in place | Write-once inserts; new request rows on re-submit |
| Trusting only UI hide for admin tools | Route guards **and** RLS |
| TypeScript syntax in `.js` files | Plain JavaScript |
| Giant page components (500+ lines) | Split UI + hooks |
| Hard-coded CTEVT UUID in many files | One helper: `getCtevtInstitution()` |
| `console.log` left in production paths | Remove or gate behind dev flag |

---

## 18. Checklist Before Opening a PR

- [ ] Follows folder and naming conventions  
- [ ] No direct `supabase` usage outside `api/` / auth context  
- [ ] Loading, error, and empty states handled  
- [ ] Forms validate required fields; submit disabled while in flight  
- [ ] Colors/typography align with `theme.md`  
- [ ] Role-sensitive actions respect admin vs verifier separation  
- [ ] No secrets committed; env vars use `VITE_` prefix  
- [ ] Manual smoke test of the touched user flow  

---

## 19. Related Documents

| Document | Role |
|----------|------|
| `PRD` / product brief | What to build |
| `srs.md` | Formal requirements |
| `theme.md` | Visual design tokens |
| `api.md` | Supabase operation reference |
| `schema.sql` | Database contract |
| **coding_standard.md** | How to write the code |

---

*Keep this document short and enforceable. Update it when the team adopts shared tooling (ESLint/Prettier configs, TanStack Query, or a shared package post-prototype).*
