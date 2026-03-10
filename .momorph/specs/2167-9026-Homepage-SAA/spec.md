# Feature Specification: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Reviewed

---

## Overview

The **Homepage SAA** is the main landing page of the Sun Annual Awards (SAA) 2025 web application. It is the first authenticated screen users see after logging in. The page introduces the "ROOT FURTHER" theme, displays a real-time countdown to the event, lists the award categories, promotes the Sun* Kudos initiative, and provides primary navigation.

**Target users**: All authenticated Sunners (Sun* employees)
**Business context**: Drive engagement with the SAA 2025 event — awareness of the event date/venue, discovery of award categories, and activation of the Sun* Kudos recognition feature.

**Navigation target from**: Login screen (frame `662:14387`)
**Navigation out to**:
- Awards Information page (`/awards-information`)
- Sun* Kudos page (`/kudo/live`)
- Profile dropdown (`721:5223`)
- Language dropdown (`721:4942`)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Homepage & Event Info (Priority: P1)

An authenticated user visits the homepage and sees the key event information: the "ROOT FURTHER" theme banner, the event countdown, event time and venue, and navigation links.

**Why this priority**: Core content of the landing page. Without this, users have no context for the event.

**Independent Test**: Navigate to `/` while authenticated → verify hero section, countdown, and event info are visible.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they navigate to `/`, **Then** the page renders with the full-bleed keyvisual background, Root Further logo, and the header navigation.
2. **Given** an authenticated user on the homepage, **When** the page loads, **Then** the event info block shows "Thời gian: 18h30" and "Địa điểm: Nhà hát nghệ thuật quân đội" in `#FFEA9E` text.
3. **Given** an unauthenticated user, **When** they navigate to `/`, **Then** the middleware redirects them to `/login`.

---

### User Story 2 — Real-time Countdown (Priority: P1)

The countdown timer displays days, hours, and minutes remaining until the SAA 2025 event, updating automatically every minute. Once the event starts, the "Coming soon" subtitle is hidden and the timer freezes at 00.

**Why this priority**: The countdown is the central hero interaction — it creates urgency and excitement. A broken countdown significantly degrades the experience.

**Independent Test**: Render the `<Countdown>` component with a future target date → verify digits display correctly. Mock a past date → verify "Coming soon" is hidden and digits show "00".

**Acceptance Scenarios**:

1. **Given** the event date is in the future, **When** the page loads, **Then** countdown displays correct days/hours/minutes with 2-digit zero-padding (e.g., "07", "03", "45").
2. **Given** the event date is in the future, **When** 1 minute passes, **Then** the minutes digit decrements by 1 automatically without a page reload.
3. **Given** the event date has passed, **When** the page loads, **Then** the "Coming soon" label is hidden and all countdown tiles show "00".
4. **Given** the countdown is running, **When** I inspect the DOM, **Then** digits use the `Digital Numbers` font at 49px.

---

### User Story 3 — Navigate to Award Categories (Priority: P1)

The user can browse all award categories (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP) displayed as cards. Clicking any card, title, or "Chi tiết" link opens the Awards Information page scrolled to that specific category.

**Why this priority**: Primary content discovery flow — awards are the core value proposition of the event.

**Independent Test**: Render `<AwardCard>` for each category → verify navigation href includes correct anchor slug.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** I scroll to the awards section, **Then** 6 award cards are visible in a responsive grid (3-col desktop, 2-col tablet, 1-col mobile).
2. **Given** an award card, **When** I click the card image, title, or "Chi tiết" link, **Then** the browser navigates to `/awards-information#[award-slug]` and scrolls to the correct section.
3. **Given** an award card, **When** I hover over it, **Then** the card lifts (`translateY(-4px)`) and the border/glow effect intensifies.
4. **Given** the award card description is longer than 2 lines, **Then** it is truncated with an ellipsis (`…`).

---

### User Story 4 — CTA Navigation: About Awards & About Kudos (Priority: P2)

The hero section contains two CTA buttons: "ABOUT AWARDS" (primary, yellow) and "ABOUT KUDOS" (secondary, outlined). Clicking them navigates to the corresponding pages.

**Why this priority**: Key conversion action from hero section. Important but the page is functional without it (users can use the header nav).

**Independent Test**: Click each CTA button → verify correct route navigation.

**Acceptance Scenarios**:

1. **Given** the homepage hero, **When** I click "ABOUT AWARDS", **Then** the browser navigates to the Awards Information page.
2. **Given** the homepage hero, **When** I click "ABOUT KUDOS", **Then** the browser navigates to the Sun* Kudos page.
3. **Given** hovering over "ABOUT AWARDS", **Then** background lightens from `#FFEA9E` to `#FFE480` and a glow shadow appears.
4. **Given** hovering over "ABOUT KUDOS", **Then** background transitions from transparent to `#FFEA9E` (matches hover state of primary button).

---

### User Story 5 — Sun* Kudos Promotion Block (Priority: P2)

The homepage features a dedicated block promoting "Sun* Kudos" — the peer recognition initiative. It has a title, description, and a "Chi tiết" CTA button navigating to the Kudos page.

**Why this priority**: Secondary conversion goal. Kudos is a new feature for SAA 2025 that needs active promotion.

**Independent Test**: Render `<KudosBlock>` → verify content and CTA navigation.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** I scroll to the Sun* Kudos section, **Then** I see the title "Sun* Kudos" in `#FFEA9E`, a description paragraph, and the "Chi tiết" button.
2. **Given** the Kudos block, **When** I click "Chi tiết", **Then** the browser navigates to the Sun* Kudos page.

---

### User Story 6 — Header Navigation (Priority: P1)

The sticky/fixed header contains the SAA logo, nav links (About SAA 2025, Awards Information, Sun* Kudos), notification bell, language switcher, and user avatar dropdown.

**Why this priority**: Global navigation is required on every page. The header must be accessible and functional.

**Independent Test**: Verify header is visible at scroll position 0 and after scrolling. Verify active link highlights correctly.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** the page loads, **Then** the header is fixed at the top with backdrop blur and shows "About SAA 2025" as the active link (yellow text + bottom border).
2. **Given** the user is on the homepage, **When** they click "About SAA 2025" in the header, **Then** no navigation occurs (the link is already active; page does not reload or scroll).
3. **Given** the user is on a different page, **When** they click "About SAA 2025" in the header, **Then** the browser navigates to `/` (Homepage).
4. **Given** the header nav links, **When** I hover over a non-active link, **Then** it shows a subtle background highlight.
5. **Given** the header, **When** I click the logo, **Then** the page scrolls to the top.
6. **Given** the header, **When** I click the notification bell icon, **Then** a notification panel opens.
7. **Given** the header, **When** I click the user avatar, **Then** the profile dropdown (frame `721:5223`) opens.

---

### User Story 7 — Widget Floating Action Button (Priority: P3)

A pill-shaped floating button is fixed in the bottom-right corner. It contains a pencil icon and SAA logo icon, allowing quick access to writing a Kudo or other quick actions.

**Why this priority**: Nice-to-have shortcut. The same actions are accessible via navigation.

**Independent Test**: Render page → verify widget button is visible at bottom-right. Click → verify action menu opens.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** I view any scroll position, **Then** the floating widget button (106×64px, `#FFEA9E`, pill-shaped) is visible at bottom-right.
2. **Given** the widget button, **When** I click it, **Then** a quick-action menu opens (e.g., write a Kudo).

---

### User Story 8 — Responsive Layout (Priority: P2)

The homepage adapts to mobile (360px), tablet (768px), and desktop (1440px) viewports without horizontal overflow.

**Why this priority**: Multi-device access is expected for a company-wide event.

**Acceptance Scenarios**:

1. **Given** a 360px viewport, **When** the page loads, **Then** there is no horizontal scroll and all content is readable.
2. **Given** a 360px viewport, **Then** the award grid shows 1 column; CTA buttons are full-width and stacked.
3. **Given** a 768px viewport, **Then** the award grid shows 2 columns.
4. **Given** a 1440px viewport, **Then** the award grid shows 3 columns and the full desktop layout renders.

---

### Edge Cases

- **Countdown reaches zero while user is on the page**: "Coming soon" label disappears in real-time; digits freeze at "00" without a page reload.
- **Event target date not configured**: Countdown env var `NEXT_PUBLIC_EVENT_DATETIME` is missing → fall back to a default date or show a placeholder.
- **Award images fail to load**: Show a placeholder/skeleton so layout doesn't break.
- **Long award descriptions**: Truncate at 2 lines with `line-clamp-2` and ellipsis.
- **Unauthenticated access**: Middleware (`src/middleware.ts`) redirects to `/login` before the page renders.
- **Language preference (VI/EN)**: All static text must support both Vietnamese and English based on the user's `lang` cookie.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| No. | Component | Node ID | Description | Interactions |
|-----|-----------|---------|-------------|--------------|
| A1 | Header | `2167:9091` | Sticky nav bar with logo, links, controls | Click logo → top; click nav links → navigate; click avatar → profile dropdown |
| 3.5 | Keyvisual BG | `2167:9027` | Full-bleed background artwork with gradient cover | Static |
| B1 | Countdown | `2167:9035` | Real-time days/hours/minutes countdown | Auto-updates every minute |
| B1.2 | Coming soon label | `2167:9036` | Subtitle hidden when event starts | Conditional display |
| B2 | Event Info | `2167:9053` | Event time (18h30) and venue in `#FFEA9E` | Static |
| B3 | CTA Buttons | `2167:9062` | "ABOUT AWARDS" + "ABOUT KUDOS" | Click → navigate |
| B4 | Content | `5001:14827` | "ROOT FURTHER" description paragraph | Static |
| C1 | Awards Header | `2167:9069` | Section header with divider | Static |
| C2 | Award List | `5005:14974` | 6-card grid of award categories | Click → Awards page + anchor |
| D1 | Sun* Kudos | `3390:10349` | Kudos promo block with CTA | Click "Chi tiết" → Kudos page |
| 6 | Widget Button | `5022:15169` | Fixed floating pill button | Click → quick action menu |
| 7 | Footer | `5001:14800` | Logo, nav links, copyright | Click links → navigate |

### Navigation Flow

| From | Trigger | To |
|------|---------|-----|
| Any screen | Middleware auth check | `/login` (if unauthenticated) |
| Login page | Successful OAuth | Homepage `/` |
| Homepage hero | Click "ABOUT AWARDS" | Awards Information page |
| Homepage hero | Click "ABOUT KUDOS" | Sun* Kudos page |
| Homepage header | Click "About SAA 2025" nav (already on `/`) | No action (active state, current page) |
| Any other page header | Click "About SAA 2025" nav | Navigate to `/` (Homepage) |
| Homepage header | Click "Awards Information" nav | Awards Information page |
| Homepage header | Click "Sun* Kudos" nav | Sun* Kudos page |
| Homepage C2 | Click award card / "Chi tiết" | Awards Information `/awards-information#[slug]` |
| Homepage D1 | Click "Chi tiết" | Sun* Kudos page |
| Homepage header | Click avatar | Profile dropdown (`721:5223`) |
| Homepage footer | Click "Tiêu chuẩn chung" | Standards/criteria page (route TBD) |

### Visual Requirements

See `design-style.md` for full visual specifications.

- **Viewport baseline**: 1512px desktop (content max-width 1224px)
- **Responsive breakpoints**: 360px (mobile), 768px (tablet), 1440px+ (desktop)
- **Animations**: Button hover/active transitions (150ms ease-in-out), card lift on hover (200ms ease-out)
- **Accessibility**: WCAG AA — all interactive elements have focus states (`outline: 2px solid #15D5CA`); semantic HTML (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- **`aria-label` values for icon-only controls**:
  - Notification bell: `aria-label="Thông báo"` / `"Notifications"`
  - Language selector: `aria-label="Chọn ngôn ngữ"` / `"Select language"`
  - User avatar: `aria-label="Tài khoản"` / `"Account menu"`
  - Widget button: `aria-label="Hành động nhanh"` / `"Quick actions"`
- **Countdown live region**: `<Countdown>` root element MUST have `aria-live="polite"` and `aria-label="Đồng hồ đếm ngược"` so screen readers announce digit changes
- **Tab order**: The logical tab order MUST be: Logo → Nav links (About SAA 2025 → Awards Information → Sun* Kudos) → Notification bell → Language selector → Avatar → (main content) → Award cards → Kudos "Chi tiết" → Footer links → Widget button
- **Skip navigation**: A visually hidden `<a href="#main-content">Skip to main content</a>` link MUST be the first focusable element on the page (WCAG 2.4.1 Bypass Blocks)

---

## State Management

### Local Component State

| Component | State | Type | Initial Value | Description |
|-----------|-------|------|---------------|-------------|
| `<Countdown>` | `timeLeft` | `{ days, hours, minutes }` | computed from `NEXT_PUBLIC_EVENT_DATETIME` | Updated every 60s via `setInterval` |
| `<Countdown>` | `isEventStarted` | `boolean` | `false` | True when target datetime has passed; hides "Coming soon" |
| `<Header>` | `isProfileOpen` | `boolean` | `false` | Controls profile dropdown visibility |
| `<Header>` | `isLangOpen` | `boolean` | `false` | Controls language dropdown visibility |
| `<WidgetButton>` | `isMenuOpen` | `boolean` | `false` | Controls quick-action menu |

### Server State (RSC)

| Data | Source | Loaded At | Fallback |
|------|--------|-----------|---------|
| Award categories (6 items) | `GET /api/awards` | Server render (RSC) | Empty array → show empty state |
| Notification count | `GET /api/notifications` | Client (header) | Badge hidden |

### Loading States

| Component | Loading UI |
|-----------|-----------|
| Award cards | Skeleton cards (336×504px grey pulse animation) — 6 placeholders |
| Notification count | Badge hidden until loaded |
| Award images | `next/image` placeholder blur while loading |

### Error States

| Scenario | UI Behaviour |
|----------|-------------|
| `GET /api/awards` fails | Show error banner "Không thể tải dữ liệu giải thưởng. Thử lại" with retry button |
| `GET /api/notifications` fails | Silently hide badge (non-critical) |
| Countdown env var missing | Render countdown at "00 00 00", hide "Coming soon" label |

### Empty States

| Scenario | UI Behaviour |
|----------|-------------|
| 0 award categories returned | Show placeholder message "Dữ liệu đang được cập nhật" in the awards grid |

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a real-time countdown to the SAA event date configured via environment variable `NEXT_PUBLIC_EVENT_DATETIME` (ISO-8601 format).
- **FR-002**: System MUST hide the "Coming soon" subtitle and freeze countdown at "00" when the event datetime has passed.
- **FR-003**: System MUST display all 6 award categories as clickable cards that navigate to `/awards-information#[slug]`.
- **FR-004**: System MUST restrict the homepage to authenticated users — unauthenticated users are redirected to `/login`.
- **FR-005**: System MUST render the homepage in both Vietnamese (default) and English based on the `lang` cookie. This applies to ALL visible text including static sections (B2 event info, B4 ROOT FURTHER description, C1 section header, D1 Kudos block copy, footer links) — not just navigation labels.
- **FR-006**: Users MUST be able to open the profile dropdown from the header avatar button.
- **FR-007**: System MUST display event time and venue information statically.
- **FR-008**: The Widget floating button MUST remain fixed in the bottom-right corner at all scroll positions.
- **FR-009**: The footer MUST display the copyright text "Bản quyền thuộc về Sun* © 2025" in `Montserrat Alternates` font.
- **FR-010**: Award category data returned from `/api/awards` MUST be validated with a Zod schema before rendering.

### Technical Requirements

- **TR-001**: Countdown MUST update every 60 seconds using `setInterval` on the client. No server re-rendering required for tick updates.
- **TR-002**: The event target datetime MUST be read from `NEXT_PUBLIC_EVENT_DATETIME` env var. Missing var → fall back to a hardcoded default.
- **TR-003**: Award category data MUST be fetched from backend API (`GET /api/awards`) on the server side (RSC) for SEO.
- **TR-004**: The `Digital Numbers` and `SVN-Gotham` fonts MUST be self-hosted under `public/fonts/` (neither is available on Google Fonts).
- **TR-005**: Performance — Largest Contentful Paint (LCP) < 2.5s on 3G. Hero images use `priority` prop with `next/image`.
- **TR-006**: Security — All navigation uses Next.js `<Link>` (no `window.location` manipulation). No sensitive data in client-side code.

### Key Entities

- **Award Category**: `{ id, slug, name, description, thumbnailUrl }` — 6 predefined categories
- **Event Config**: `{ targetDatetime: ISO-8601 }` — from env var
- **User Session**: Supabase session — required for page access

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/awards` | GET | Fetch all award categories (id, slug, name, description, thumbnail) | Predicted |
| `/api/notifications` | GET | Fetch unread notification count for bell badge | Predicted |
| Supabase Auth | — | Session validation via middleware | Exists |

---

## Success Criteria *(mandatory)*

- **SC-001**: Homepage renders within 2.5s LCP on simulated 3G (Lighthouse performance ≥ 90).
- **SC-002**: Countdown correctly reflects real time with < 5s drift after 1 hour of running.
- **SC-003**: All 6 award card navigation targets are correct (verified by automated E2E test).
- **SC-004**: No horizontal scroll at 360px, 768px, 1440px viewports.
- **SC-005**: All interactive elements are keyboard-navigable and have visible focus rings.
- **SC-006**: WCAG AA contrast ratio ≥ 4.5:1 for all text on dark background.

---

## Out of Scope

- Actual award winner data (TBD — homepage shows category info only)
- Notification panel content (separate feature)
- Profile dropdown implementation (reuses frame `721:5223`)
- Admin-specific widget menu options (separate role-based feature)
- Live-streaming integration (mentioned in event info, not in this screen)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/contexts/api-docs.yaml`)
- [ ] Database design completed (`.momorph/contexts/database-schema.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Login screen implemented (`src/app/login/`, frame `662:14387`)
- [ ] Award category data source confirmed (API or static config)

---

## Notes

- The event target datetime for the countdown should be configurable via `NEXT_PUBLIC_EVENT_DATETIME` (e.g., `2025-11-15T18:30:00+07:00`).
- **"About SAA 2025" nav link**: The "About SAA 2025" entry in both header and footer nav links to `/` (Homepage). If the user is **already on the Homepage**, clicking the link has no action (the link is in active/selected state and no navigation occurs — Next.js `<Link href="/">` on the current route is a no-op). If the user is on **any other page**, clicking navigates them back to `/`.
- **Facebook group sub-note in B2**: The text "Tường thuật trực tiếp tại Group Facebook Sun* Family" is a **static `<p>` tag** — not a clickable link. No `href` required.
- **B4 ROOT FURTHER description**: This long-form body text **MUST support both Vietnamese and English** — it switches language when the user selects VI/EN from the language selector in the header (same as all other page text). Translations must be provided for both locales.
- "ROOT FURTHER" is the theme name — displayed as an image asset (not plain text) for custom typography.
- The `Digital Numbers` and `SVN-Gotham` fonts must be self-hosted under `public/fonts/`.
- The page uses `"use client"` only for the countdown and interactive header — the award list and static sections should be Server Components (RSC).
- Award image `mix-blend-mode: screen` requires the card to have a dark background (`#00101A`) to render correctly.
- For the anchor scroll navigation (`/awards-information#top-talent`), the Awards Information page must implement `id` anchors matching the slugs.
