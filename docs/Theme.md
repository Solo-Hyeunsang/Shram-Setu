# Shram Setu (श्रम सेतु) — Theme & Design System

**Version:** 0.3 (Prototype)  
**Last Updated:** 18 August 2026  
**Applies to:** Main Platform (RBC) and Admin Platform  

---

## 1. Design Principles

1. **Trust First** — Verification badges, ratings, and certification signals are always visible and primary.
2. **Simplicity** — Minimalist cards, generous whitespace, clear hierarchy. No feature that doesn’t serve hiring or verification.
3. **Nepali Context** — Mobile-first for Main Platform; design for mid-range Android phones and variable connectivity.
4. **Action-Oriented** — Every page has one clear primary action.
5. **Accessible** — Target WCAG 2.1 AA: contrast, readable sizes, focus states.
6. **Consistent Across Platforms** — Same palette, typography, and component language so users recognize the brand on both apps.

---

## 2. Platform Layout Guidance

| Platform | Layout priority | Notes |
|----------|-----------------|-------|
| **Main Platform (RBC)** | Mobile-first responsive | Primary use on smartphones; touch targets ≥ 44px |
| **Admin Platform** | Desktop-first | Left sidebar; tables and dense data; verifier pages should still work on tablets |

---

## 3. Color Palette

Use these tokens consistently. Prefer CSS variables / Tailwind theme extension.

| Token | Hex | Tailwind-ish | Usage |
|-------|-----|--------------|--------|
| **Primary** | `#1E40AF` | blue-800 | Buttons, links, primary actions — trust & professionalism |
| **Primary Light** | `#3B82F6` | blue-500 | Hover states, accents |
| **Secondary** | `#059669` | emerald-600 | Success, verification badges, positive indicators |
| **Accent** | `#F59E0B` | amber-500 | Star ratings, highlights, attention |
| **Background** | `#F8FAFC` | slate-50 | Page background |
| **Surface** | `#FFFFFF` | white | Cards, modals, panels |
| **Text Primary** | `#0F172A` | slate-900 | Headings, body |
| **Text Secondary** | `#64748B` | slate-500 | Captions, metadata |
| **Danger** | `#DC2626` | red-600 | Errors, destructive actions, rejections |
| **Warning** | `#D97706` | amber-600 | Pending, “more info needed” |
| **Border** | `#E2E8F0` | slate-200 | Card borders, dividers |

### Semantic status colors

| Status | Color | Example |
|--------|-------|---------|
| Verified / Success / Approved | Secondary `#059669` | Green shield badge |
| Pending / In Review | Warning `#D97706` | Amber “Pending” pill |
| Rejected / Error | Danger `#DC2626` | Red reject button / badge |
| Unverified / Neutral | Text Secondary `#64748B` | Grey “Unverified” |
| Available (dot) | Secondary | Green availability indicator |
| Busy / Not Taking Work | Warning / Text Secondary | Amber or grey |

---

## 4. Typography

**Font family:** Inter (system fallback: system-ui, sans-serif)

| Element | Size | Weight | Line height guidance |
|---------|------|--------|----------------------|
| Display / Hero | 36–48px | 700 | Tight |
| Heading H1 | 28–32px | 700 | 1.2 |
| Heading H2 | 22–24px | 600 | 1.25 |
| Heading H3 | 18–20px | 600 | 1.3 |
| Body | 15–16px | 400 | 1.5 |
| Caption / Meta | 13–14px | 400 | 1.4 |
| Button | 15px | 500 | — |

**Rules:**

- Prefer sentence case for UI labels; Title Case for section titles if needed.
- Avoid pure black on pure white for long body text; use Text Primary on Surface/Background.
- Minimum body size on mobile: 15px.

---

## 5. Spacing & Layout

- **Base unit:** 4px (Tailwind default scale).
- **Card padding:** 16–24px.
- **Section gaps:** 24–48px.
- **Max content width (Main):** ~1120–1280px centered.
- **Admin content:** Full width beside sidebar (sidebar ~240–280px).

Border radius:

| Element | Radius |
|---------|--------|
| Cards, modals | 12px (`rounded-xl`) |
| Buttons, inputs | 8px (`rounded-lg`) |
| Pills / badges | Full (`rounded-full`) |
| Avatars | Full |

Shadows: soft, low elevation for cards (`shadow-sm` / `shadow-md`); avoid heavy drop shadows.

---

## 6. Component Inventory

### 6.1 Main Platform (RBC)

| Component | Description | Key visual cues |
|-----------|-------------|-----------------|
| **Worker Card** | Avatar, name, primary trade, district, verification badge, star rating, availability dot, wage range | Badge + stars always visible |
| **Job Card** | Title, trade icon, location, budget range, duration, status badge, employer name | Status pill |
| **Verification Badge** | Green shield + “Verified”; grey “Unverified”; amber “Pending” / “In Review” | Icon + short label |
| **Rating Stars** | Filled/unfilled stars + numeric average + review count | Accent amber for filled stars |
| **Trade Category Tile** | Icon + trade name in grid | Consistent icon set |
| **Filter Sidebar / Sheet** | Trade, location, experience, wage, rating, availability, verification | Collapsible on mobile (sheet) |
| **Status Badge** | Colored pill: Open, Assigned, Completed, Cancelled, etc. | Semantic colors above |
| **Notification Bell** | Header icon + unread count badge | Primary or danger for count |
| **Verification Status Card** | Current status, progress, primary CTA (“Request Verification” / “Update Documents”) | Dashboard prominence |

### 6.2 Admin Platform

| Component | Description |
|-----------|-------------|
| **Sidebar Navigation** | Persistent left nav; Admin section and/or Verification section by role |
| **Data Table** | Sortable, filterable, paginated lists (users, jobs, requests) |
| **Stat Card** | Metric label, value, optional trend |
| **Action Buttons** | Approve (green), Reject (red), Request Info (amber) — always with confirmation modal |
| **Document Viewer** | Inline image/PDF view with zoom and download |
| **Status Badge** | Same semantic pills as Main Platform |
| **Request Card** | Compact queue item: worker name, trade, submitted date, status |

### 6.3 Shared Patterns

- **Primary button:** Primary background, white text, hover Primary Light  
- **Secondary / outline button:** Border Border, text Text Primary  
- **Destructive button:** Danger background  
- **Form inputs:** Border Border, focus ring Primary Light, error state Danger  
- **Empty states:** Short message + illustration or icon + primary action  
- **Loading:** Skeleton or subtle spinner; avoid layout shift  

---

## 7. Iconography

- Prefer a single consistent set (e.g. Lucide or similar used by shadcn/ui).  
- Trade icons: map to `trades.icon` field (e.g. `zap`, `droplet`, `hammer`, `brick`, `flame`, `wrench`, `paintbrush`, `hard-hat`, `leaf`, `cog`).  
- Verification: shield / badge-check style in Secondary green.  
- Availability: small filled circle (green / amber / grey).

---

## 8. Imagery & Media

| Asset | Guidance |
|-------|----------|
| Avatars | Circular; fallback initials on Primary/Secondary background |
| Portfolio | 4:3 or 1:1 cards; lazy load; captions under or on hover |
| Certifications | Thumbnail + open in Document Viewer |
| Institution logos | Contained, max-height constrained |

Storage buckets (reference): `avatars`, `portfolio` (public read); `certifications` (restricted); `institution-logos` (public read).

---

## 9. Motion & Feedback

- Prefer subtle transitions (150–250ms) for hover and expand.  
- Success/error toasts for form submits and verification actions.  
- Confirmation modals for Approve / Reject / Suspend / Cancel job.  
- No heavy animation on data tables or lists.

---

## 10. Accessibility Checklist

- [ ] Color contrast ≥ 4.5:1 for body text; ≥ 3:1 for large text/UI  
- [ ] Focus visible on all interactive elements  
- [ ] Form labels associated with inputs  
- [ ] Icon-only buttons have accessible names  
- [ ] Status not conveyed by color alone (text or icon + color)  
- [ ] Touch targets ≥ 44×44px on Main Platform mobile  

---

## 11. Tailwind / Implementation Notes

Suggested CSS variables (example):

```css
:root {
  --color-primary: #1E40AF;
  --color-primary-light: #3B82F6;
  --color-secondary: #059669;
  --color-accent: #F59E0B;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-danger: #DC2626;
  --color-warning: #D97706;
  --color-border: #E2E8F0;
}
```

Extend Tailwind theme with these tokens; use shadcn/ui components customized to the palette so both apps stay aligned.

---

## 12. Brand Voice (UI Copy)

- Clear, respectful, professional.  
- Prefer short labels: “Get Verified”, “Apply”, “Mark Complete”.  
- Verification and rejection messages should be factual and actionable (always show reason when rejecting).  
- Avoid jargon; workers and employers may have basic digital literacy.

---

*Align all new UI work with this theme document and the PRD UI/UX section (PRD §11).*
