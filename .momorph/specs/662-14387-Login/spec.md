# Feature Specification: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/662:14387
**Created**: 2026-03-06
**Status**: Draft

---

## Overview

The Login screen is the entry point of the SAA 2025 (Sun Annual Awards) web application.
It presents a visually immersive hero page with a full-bleed artwork background and a single
call-to-action: signing in with Google OAuth. No username/password form exists — authentication
is delegated entirely to Google via Supabase's OAuth provider.

The page also includes a language selector (Vietnamese/English toggle) in the header.

---

## User Scenarios & Testing

### User Story 1 — Google OAuth Login (Priority: P1)

As an **unauthenticated user**, I want to sign in with my Google account so that I can access
the SAA 2025 platform features.

**Why this priority**: This is the only authentication mechanism on the platform. Without login,
no other feature is accessible. It is the literal gate to the application.

**Independent Test**: Navigate to `/login`, click "LOGIN With Google", complete Google OAuth
(use test credentials), and verify redirect to the homepage (`/`) with a valid session cookie.

**Acceptance Scenarios**:

1. **Given** the user is not authenticated and is on `/login`,
   **When** they click the "LOGIN With Google" button,
   **Then** the browser initiates the Google OAuth flow (redirect or popup).

2. **Given** the user completes Google OAuth successfully,
   **When** they are redirected back to the app's callback URL (`/auth/callback`),
   **Then** a Supabase session is established and the user is redirected to the homepage (`/`).

3. **Given** the Google OAuth flow fails (user cancels or Google returns an error),
   **When** the user is returned to the app,
   **Then** they remain on `/login` and a user-friendly error message is displayed.

4. **Given** the user is already authenticated (valid Supabase session exists),
   **When** they navigate to `/login`,
   **Then** they are immediately redirected to the homepage (`/`) without seeing the login page.

---

### User Story 2 — Language Selection (Priority: P2)

As a **user on the login page**, I want to switch the display language (Vietnamese / English)
so that I can read the interface in my preferred language.

**Why this priority**: Language preference affects usability but does not block access to the app.
Login (P1) must work first; language switching enhances the experience.

**Independent Test**: Click the language toggle in the header, verify the dropdown appears with
language options, select a language, and verify the UI text updates accordingly.

**Acceptance Scenarios**:

1. **Given** the user is on `/login`,
   **When** they click the language selector (VN flag + chevron),
   **Then** a dropdown opens showing available language options.

2. **Given** the dropdown is open,
   **When** the user selects a language option,
   **Then** the dropdown closes and the page language updates to the selected language.

3. **Given** the user selects a language,
   **When** they navigate away and return to `/login`,
   **Then** their selected language preference is retained (stored in cookie or localStorage).

---

### User Story 3 — Authenticated Session Redirect (Priority: P3)

As an **authenticated user**, I want to be automatically redirected from `/login` to the homepage
so that I am not shown a login page I do not need.

**Why this priority**: This is a UX safeguard. The core login flow (P1) must be working before
this redirect guard is relevant.

**Independent Test**: Set up a valid Supabase session in the browser (e.g., via `supabase.auth.setSession`
in a test), navigate to `/login`, and verify automatic redirect to `/`.

**Acceptance Scenarios**:

1. **Given** the user has a valid Supabase session,
   **When** they visit `/login`,
   **Then** the middleware redirects them to `/` before the page renders.

---

### Edge Cases

- What happens when the Google OAuth callback URL is misconfigured? → Show a generic error page with a "Try again" link back to `/login`.
- What happens when the Supabase project is unreachable? → Show an error state on the button with retry messaging.
- What happens when JavaScript is disabled? → The page renders statically with a message indicating JavaScript is required for login.
- What happens on very small screens (< 360px)? → The login button becomes full-width and all content remains accessible.

---

## UI/UX Requirements *(from Figma)*

> Visual specs, exact CSS values, and component dimensions are documented in `design-style.md`.

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| C_Keyvisual | `662:14388` | Full-bleed background artwork (absolute layer, z-0) | None — decorative |
| Rectangle 57 | `662:14392` | Left-to-right gradient overlay (dark→transparent, z-1) | None — decorative |
| Cover | `662:14390` | Bottom vignette gradient (dark→transparent upward, z-1) | None — decorative |
| A_Header | `662:14391` | Navigation bar at top (absolute, z-10) | Contains interactive children |
| A.1_Logo | `I662:14391;186:2166` | SAA 2025 logo, 52×56px (top-left) | None — non-interactive |
| A.2_Language | `I662:14391;186:1601` | Language selector toggle, 108×56px | Click → opens dropdown (frame `721:4942`) |
| B_Bìa | `662:14393` | Hero section with visual and CTA (absolute, below header) | Contains login button |
| B.1_KeyVisual | `662:14395` | "ROOT FURTHER" logo image frame, 1152×200px | None — decorative |
| B.2_content | `662:14753` | Two-line hero text, 480×80px | None — static |
| B.3_Login | `662:14425` / `662:14426` | "LOGIN With Google" CTA button, 305×60px | Click → Google OAuth flow; shows loading/disabled state during OAuth redirect |
| D_Footer | `662:14447` | Copyright notice with top border | None — static |

### Navigation Flow

- **From**: None (this is the entry point for unauthenticated users)
- **To (success)**: `/` (Homepage — frame `2167:9026`)
- **To (language dropdown)**: Dropdown overlay (frame `721:4942`)
- **Triggers**:
  - Click B.3_Login → Google OAuth → `/auth/callback` → `/`
  - Click A.2_Language → language dropdown overlay

### Visual Requirements

- **Responsive breakpoints**: 360px (mobile), 768px (tablet), 1440px (desktop) — see `design-style.md`
- **Animations**: Button hover glow (150ms), language dropdown slide-in (150ms)

### Accessibility Requirements

- **Standard**: WCAG 2.1 AA minimum
- **Keyboard navigation**: All interactive elements (A.2_Language, B.3_Login) MUST be reachable and operable via Tab/Enter/Space
- **Focus rings**: All focusable elements MUST show a visible focus ring (`outline: 2px solid #15D5CA`)
- **ARIA — Login button** (`B.3_Login`):
  - `aria-label="Sign in with Google"` (English) / `"Đăng nhập bằng Google"` (Vietnamese)
  - `aria-busy="true"` + `aria-disabled="true"` when `isLoading === true`
- **ARIA — Language selector** (`A.2_Language`):
  - `aria-haspopup="listbox"`
  - `aria-expanded={isLangDropdownOpen}`
  - `aria-label="Select language"`
- **ARIA — Page landmarks**: `<header>` for A_Header, `<main>` for B_Bìa, `<footer>` for D_Footer
- **Images**: logo and key visual MUST have descriptive `alt` text; background artwork MUST have `alt=""`

---

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display the Login page at route `/login` for unauthenticated users.
- **FR-002**: The system MUST initiate Google OAuth when the user clicks "LOGIN With Google".
- **FR-003**: The system MUST handle the OAuth callback at `/auth/callback`, establish a Supabase session, and redirect to `/`.
- **FR-004**: The system MUST redirect authenticated users away from `/login` to `/` (enforced in middleware).
- **FR-005**: The system MUST display a user-friendly error message if Google OAuth fails or is cancelled.
- **FR-006**: The system MUST support language switching between Vietnamese and English via the header selector.
- **FR-007**: The system MUST persist the user's language preference across page navigations.
- **FR-008**: The login button MUST show a loading/disabled state while the OAuth redirect is in progress.

### Technical Requirements

- **TR-001**: OAuth MUST be implemented using `supabase.auth.signInWithOAuth({ provider: 'google' })` from `@/libs/supabase/client.ts` — no custom OAuth implementation.
- **TR-002**: The `/auth/callback` route handler MUST use `@/libs/supabase/server.ts` to exchange the code for a session (PKCE flow).
- **TR-003**: Auth state check on `/login` MUST be performed in `src/libs/supabase/middleware.ts` — no client-side redirect logic.
- **TR-004**: The OAuth callback redirect URL MUST be configured in Supabase Dashboard and match the environment (`NEXT_PUBLIC_SITE_URL`).
- **TR-005**: No sensitive auth tokens or session data MUST be logged (OWASP A02 compliance).
- **TR-006**: The page MUST be fully responsive: verified at 360px, 768px, and 1440px viewports.
- **TR-007**: Images (background, logo, key visual) MUST use `next/image` for automatic optimization.
- **TR-008**: Fonts (Montserrat, Montserrat Alternates) MUST be loaded via `next/font/google`.

### Key Entities

- **User**: Supabase Auth user object (`id`, `email`, `user_metadata.full_name`, `user_metadata.avatar_url`)
- **Session**: Supabase session with `access_token`, `refresh_token`, managed by middleware
- **LanguagePreference**: `'vi' | 'en'` stored in cookie or localStorage (`lang` key)

---

## State Management

### Local Component State

| State Variable | Type | Default | Usage |
|---------------|------|---------|-------|
| `isLoading` | `boolean` | `false` | `true` while Google OAuth redirect is in progress; disables login button and shows spinner |
| `error` | `string \| null` | `null` | OAuth error message (set when callback returns an error param) |
| `isLangDropdownOpen` | `boolean` | `false` | Controls language selector dropdown visibility |

### Global / Persistent State

| State | Storage | Managed By |
|-------|---------|-----------|
| Auth session (`access_token`, `refresh_token`) | HTTP-only cookie (set by Supabase) | `src/libs/supabase/middleware.ts` |
| Language preference (`'vi' \| 'en'`) | Cookie key: `lang`; fallback to `localStorage` | `<LanguageSelector>` component |

### Loading & Error States

| Scenario | UI Behavior |
|----------|-------------|
| OAuth redirect in progress | Button: `opacity-70, cursor-not-allowed`, spinner replaces Google icon, text changes to "Đang đăng nhập..." |
| OAuth callback error (e.g. `?error=access_denied`) | Error banner shown below button with localized message and "Thử lại" retry link |
| Supabase unreachable | Button shows error state, retry option displayed |
| Language dropdown open | Dropdown rendered as overlay below language selector; backdrop click closes it |

---

## API Dependencies

| Endpoint / Method | Purpose | Status |
|-------------------|---------|--------|
| `supabase.auth.signInWithOAuth({ provider: 'google' })` | Initiate Google OAuth redirect | Exists (Supabase SDK) |
| `supabase.auth.exchangeCodeForSession(code)` | Exchange OAuth code for session on callback | Exists (Supabase SDK) |
| `GET /auth/callback` (Next.js Route Handler) | Handle OAuth callback, set session cookie, redirect | **New** |
| `supabase.auth.getUser()` | Check session validity in middleware | Exists (Supabase SDK) |

> All Supabase calls go through `@/libs/supabase/client.ts` (browser) or `@/libs/supabase/server.ts` (server).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: A user with a valid Google account can complete the full login flow in < 5 seconds (excluding Google's own OAuth page load time).
- **SC-002**: The `/auth/callback` route successfully exchanges the code and redirects to `/` with a valid session — verified by `supabase.auth.getUser()` returning a non-null user.
- **SC-003**: An already-authenticated user visiting `/login` is redirected to `/` in < 200ms (middleware-level redirect, no page render).
- **SC-004**: All UI passes Lighthouse accessibility score ≥ 90 on desktop and mobile.
- **SC-005**: The page renders correctly at 360px, 768px, and 1440px viewports with no horizontal overflow.

---

## Out of Scope

- Email/password authentication — not present in Figma design
- Other OAuth providers (GitHub, Facebook, etc.) — Google only for this screen
- User registration flow — Google account handles identity creation
- Password reset / forgot password — not applicable (OAuth-only)
- Admin login — handled by a different route/flow

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — not yet created
- [ ] Database design completed (`.momorph/database.sql`) — not yet created
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Supabase Google OAuth provider enabled (confirmed in codebase: `feat(auth): enable Google OAuth provider`)
- [x] Design style documented (`design-style.md` in this directory)

---

## Notes

- The OAuth `redirectTo` URL must be set to `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`.
  For local dev: `http://localhost:3000/auth/callback`.
  This URL must also be whitelisted in the Supabase Dashboard → Authentication → URL Configuration.
- The language selector links to frame `721:4942` (Dropdown-ngôn ngữ) — spec for that dropdown
  should be created separately.
- The "Countdown - Prelaunch page" frame (`2268:35127`) suggests the app may have a pre-launch
  state where the login page shows a countdown instead — this behavior is out of scope for this spec.
- B.3_Login button loading state (from design items spec): when OAuth is in progress, the button
  MUST be disabled (`opacity: 0.7, cursor: not-allowed`) and display a spinner icon. This is
  covered by FR-008 and the Loading state in `design-style.md`.
- There are two gradient overlay layers on the page: `Rectangle 57` (left-to-right, darkens the
  left side) and `Cover` (bottom-up vignette). Both are purely decorative `<div>` elements and
  MUST NOT capture pointer events (`pointer-events: none`).
