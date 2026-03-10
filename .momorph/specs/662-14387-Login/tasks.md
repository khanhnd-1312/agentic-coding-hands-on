# Tasks: Login

**Frame**: `662-14387-Login`
**Prerequisites**: plan.md ✅ spec.md ✅ design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story this belongs to (US1, US2, US3)
- **|**: Primary file path affected

---

## Phase 1: Setup (Assets & Shared Tokens)

**Purpose**: Download Figma assets and establish design foundations shared by all components.
All 3 tasks are fully independent — run in parallel.

- [x] T001 [P] Download all 3 Figma assets via `get_media_files` and save to `public/images/login/`: `keyvisual.png` (C_Keyvisual), `root-further.png` (B.1_KeyVisual), `logo.png` (A.1_Logo 52×56px) | public/images/login/
- [x] T002 [P] Add Montserrat (weight 700, subsets latin+vietnamese) and Montserrat_Alternates (weight 700) via `next/font/google`; apply CSS variables `--font-montserrat` and `--font-montserrat-alt` to `<body>` | src/app/layout.tsx
- [x] T003 [P] Add all design tokens as CSS custom properties: `--color-bg`, `--color-header-overlay`, `--color-accent`, `--color-text-primary`, `--color-button-bg`, `--color-button-text`, `--color-divider`; spacing tokens `--spacing-xs` through `--spacing-footer-x`; radius tokens `--radius-sm`, `--radius-md`; shadow token `--shadow-button-hover` | src/app/globals.css

**Checkpoint**: Assets on disk, fonts loading, design tokens available — foundation ready for component work.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Types, shared Icon component, root middleware, and auth callback route.
**⚠️ CRITICAL**: All user story work depends on this phase being complete.

### Types

- [x] T004 Create `LanguagePreference = 'vi' | 'en'` type and `LoginPageProps` interface (`initialError?: string`, `initialLang?: LanguagePreference`) | src/types/login.ts

### Icon Component (TDD)

- [x] T005 [P] Write **failing** unit tests for `<Icon>`: renders with correct `name` + `size` props; renders `google`, `flag-vn`, `chevron-down` variants; applies optional `className` | src/components/ui/icon.test.tsx
- [x] T006 Create `<Icon>` component (Green): accepts `name: string`, `size: number`, `className?: string`; ships inline SVG for `google` (24×24px, brand colors), `flag-vn` (container 24×24px, image 20×15px), `chevron-down` (16×16px, white); NO raw `<svg>` or `<img>` outside this component | src/components/ui/icon.tsx

### Middleware — Auth Guard (TDD)

- [x] T007 [P] Write **failing** unit tests for middleware: unauthenticated request to protected route → redirect `/login`; authenticated request to `/login` → redirect `/`; requests to `/login`, `/auth/callback`, `/_next/*`, `/images/*`, `/favicon.ico` → pass through | src/middleware.test.ts
- [x] T008 Implement root middleware (Green): configure matcher `['/((?!login|auth/callback|_next/static|_next/image|favicon.ico|images).*)']`; read Supabase session via `@/libs/supabase/middleware.ts`; unauthenticated non-public → redirect `/login`; authenticated `/login` → redirect `/` | src/middleware.ts

### Auth Callback Route (TDD)

- [x] T009 [P] Write **failing** unit tests for `/auth/callback`: success case (valid `code`) → redirects to `/`; error param case → redirects to `/login?error=<encoded>`; invalid/missing `code` → redirects to `/login?error=auth_failed`; Zod rejects unexpected param types; no session data in logs | src/app/auth/callback/route.test.ts
- [x] T010 Implement `GET /auth/callback` Route Handler (Green): Zod schema `{ code?: string, error?: string }`; if `error` param → redirect `/login?error=${encodeURIComponent(error)}`; if `code` → call `supabase.auth.exchangeCodeForSession(code)` via `@/libs/supabase/server.ts`; success → redirect `/`; failure → redirect `/login?error=auth_failed`; no token/session logging (OWASP A02) | src/app/auth/callback/route.ts

**Checkpoint**: Foundation complete — middleware guards routes, auth callback exchanges codes. User story implementation can now begin.

---

## Phase 3: User Story 1 — Google OAuth Login (Priority: P1) 🎯 MVP

**Goal**: Unauthenticated user lands on `/login`, clicks "LOGIN With Google", completes OAuth, and lands on `/` with a valid session. Loading and error states are handled.

**Independent Test**: Navigate to `/login` → click "LOGIN With Google" → complete OAuth with a test Google account → verify redirect to `/` and `supabase.auth.getUser()` returns a non-null user.

### Types & Test Setup (US1)

- [x] T011 [P] [US1] Write **failing** unit tests for `<LoginButton>`: default state renders label + Google icon; click calls `signInWithOAuth` and sets `isLoading = true`; loading state shows `aria-busy="true"`, `aria-disabled="true"`, spinner, label "Đang đăng nhập..."; error prop renders `<div role="alert">` with retry link; `aria-label` switches EN/VI based on `lang` prop | src/components/login/login-button.test.tsx
- [x] T012 [P] [US1] Write **failing** unit tests for `<LoginPage>`: renders `<header>`, `<main>`, `<footer>` landmarks; `initialError` prop sets error state propagated to `<LoginButton>`; `initialLang` prop propagates `lang` to `<LanguageSelector>` and `<LoginButton>`; default lang falls back to `'vi'` | src/components/login/login-page.test.tsx

### Components (US1)

- [x] T013 [US1] Implement `<LoginButton>` (Green): props `{ lang: LanguagePreference; error?: string; onError: (msg: string | null) => void }`; calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback' } })`; runtime guard: throw if `NEXT_PUBLIC_SITE_URL` undefined; button content: label `<span>` (left, `w-[225px]`) + `<Icon name="google" size={24} />` (trailing); loading: `opacity-70 cursor-not-allowed`; focus: `outline-2 outline-[#15D5CA] outline-offset-2`; hover: `bg-[#FFE480] shadow-...` (150ms); active: `scale-[0.98]` (100ms); error: `<div role="alert">` below button | src/components/login/login-button.tsx
- [x] T014 [US1] Implement `<LoginPage>` client component (Green): `"use client"`; props `LoginPageProps`; state `[error, setError]` init from `initialError`; state `[lang, setLang]` init from `initialLang ?? 'vi'`; full-bleed layout: root `div.bg-[#00101A].min-h-screen.relative.overflow-hidden`; `<Image fill alt="" aria-hidden>` (C_Keyvisual, z-0); Rectangle57 `<div aria-hidden z-1 bg-linear-to-r>`; Cover `<div aria-hidden z-1 bg-linear-to-t>`; `<header>` with logo + `<LanguageSelector>`; `<main>` with hero image + hero text + `<LoginButton>`; `<footer>` with Montserrat Alternates copyright text; all responsive Tailwind classes per design-style.md | src/components/login/login-page.tsx
- [x] T015 [US1] Create async Server Component page shell: `await searchParams` (Next.js 15 async); read `lang` cookie via `cookies()` from `next/headers`; pass `initialError` + `initialLang` as props to `<LoginPage>`; name function `Page` (not `LoginPage`) to avoid import name conflict | src/app/login/page.tsx

### E2E Tests (US1)

- [x] T016 [US1] Write Playwright E2E tests — happy path: unauthenticated visit `/login` → page renders (no redirect); click "LOGIN With Google" → button loading state; OAuth complete → `/auth/callback` → redirect `/`; error flow: cancel OAuth → `?error=access_denied` → `/login` error banner visible | tests/e2e/login/login.spec.ts

**Checkpoint**: US1 complete — full Google OAuth login flow works end-to-end.

---

## Phase 4: User Story 2 — Language Selection (Priority: P2)

**Goal**: User can open the language dropdown, select EN or VI, and the preference persists in a cookie so the next visit loads the correct language without flicker.

**Independent Test**: Click language selector → dropdown opens → select "English" → UI label updates to "EN" → verify `document.cookie` contains `lang=en` → navigate away and return → language still shows "EN".

### Test (US2)

- [x] T017 [US2] Write **failing** unit tests for `<LanguageSelector>`: default renders VN flag + "VN" text + chevron; click → `aria-expanded="true"` + dropdown visible; select "EN" → calls `onLangChange('en')`, writes `lang=en` cookie, closes dropdown; backdrop click → closes dropdown; keyboard: Escape closes, Enter/Space opens, Arrow keys navigate options | src/components/login/language-selector.test.tsx

### Component (US2)

- [x] T018 [US2] Implement `<LanguageSelector>` (Green): props `{ lang: LanguagePreference; onLangChange: (lang: LanguagePreference) => void }`; outer `w-[108px] h-14 flex items-center gap-4 relative`; inner `<button>` `p-4 rounded-sm` with hover `bg-[rgba(255,255,255,0.08)]` + focus `outline-2 outline-[#15D5CA]`; `aria-haspopup="listbox"`, `aria-expanded`, `aria-label="Select language"`; content: `<Icon name="flag-vn" size={20} />` + label + `<Icon name="chevron-down" size={16} />`; dropdown `<ul role="listbox">` with stub `<li role="option">` for VI + EN; on select: write `document.cookie = 'lang=...; path=/; max-age=31536000'`, call `onLangChange`; backdrop `<div className="fixed inset-0 z-[99]" aria-hidden>` when open; slide-in animation `transition-[opacity,transform] duration-150 ease-out` | src/components/login/language-selector.tsx

### E2E Tests (US2)

- [x] T019 [US2] Add language toggle E2E scenarios to existing test file: open dropdown → select EN → verify `lang=en` cookie; navigate away and return → label still shows "EN" (cookie persists); verify `lang` cookie passed server-side → page loads without language flicker | tests/e2e/login/login.spec.ts

**Checkpoint**: US1 + US2 complete — language preference persists and page loads with correct language.

---

## Phase 5: User Story 3 — Authenticated Session Redirect (Priority: P3)

**Goal**: An already-authenticated user who navigates to `/login` is redirected to `/` by middleware before the page renders — no login screen is shown.

**Independent Test**: Set up a valid Supabase session cookie → navigate to `/login` → verify redirect to `/` occurs at middleware level (HTTP 307/308, no page render) in < 200ms (SC-003).

### E2E Tests (US3)

- [x] T020 [US3] Add auth redirect E2E scenario: set valid session cookie before navigating → visit `/login` → assert redirect to `/` without rendering login page; verify redirect latency < 200ms | tests/e2e/login/login.spec.ts

**Checkpoint**: All 3 user stories complete and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Animations, accessibility, edge cases, responsive QA, Lighthouse audit.

- [x] T021 [P] Verify all 4 animation transitions are in place: B.3_Login hover `transition-[background-color,box-shadow] duration-150 ease-in-out`; B.3_Login active `transition-transform duration-100 ease-in`; A.2_Language hover `transition-colors duration-150 ease-in-out`; language dropdown open/close `transition-[opacity,transform] duration-150 ease-out` | src/components/login/login-button.tsx, src/components/login/language-selector.tsx
- [x] T022 [P] Add `<noscript>` fallback message "JavaScript is required to sign in." inside `<LoginPage>`; verify `alt=""` on all decorative images (C_Keyvisual, gradient divs `aria-hidden`); verify `alt="SAA 2025 logo"` on logo; verify `alt="Root Further"` on hero image | src/components/login/login-page.tsx
- [x] T023 Add responsive E2E scenarios to test file: verify no horizontal overflow at 360px, 768px, 1440px viewports; verify B.3_Login is `w-full` at mobile, `w-[280px]` at tablet, `w-[305px]` at desktop | tests/e2e/login/login.spec.ts
- [ ] T024 Run Lighthouse accessibility audit on `/login` at desktop and mobile; fix any issues blocking score ≥ 90; verify WCAG 2.1 AA contrast ratios (button label `#00101A` on `#FFEA9E` ≈ 12.5:1; body text `#FFFFFF` on `#00101A` ≈ 19.5:1) | (audit tool — no source file)
- [x] T025 Run `yarn lint && yarn build` and fix any TypeScript or lint errors introduced during implementation | (CI gate — no source file)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)          → No dependencies — start immediately
  T001, T002, T003 fully parallel

Phase 2 (Foundation)     → Depends on Phase 1 completion
  T004                   → No deps (types only)
  T005, T007, T009       → Parallel (write failing tests for 3 different modules)
  T006                   → After T005 (Icon: Red → Green)
  T008                   → After T007 (Middleware: Red → Green)
  T010                   → After T009 (Callback: Red → Green)
  T006, T008, T010       → Parallel to each other (different files)

Phase 3 (US1)            → Depends on Phase 2 completion (T004, T006, T008, T010)
  T011, T012             → Parallel (write failing tests for Button + Page)
  T013                   → After T011 (LoginButton: Red → Green)
  T014                   → After T012 AND T013 (LoginPage needs Button)
  T015                   → After T014 (page.tsx needs LoginPage)
  T016                   → After T015 (E2E needs full page ready)

Phase 4 (US2)            → Depends on Phase 3 (T014 — LoginPage must exist to integrate)
  T017                   → Write failing LanguageSelector tests
  T018                   → After T017 (Green phase)
  T019                   → After T018 (E2E scenarios)

Phase 5 (US3)            → Depends on Phase 2 T008 (middleware exists)
  T020                   → Can start as soon as T008 is done (middleware ready)
                           Note: can run in parallel with Phase 4 (US2)

Phase 6 (Polish)         → Depends on Phase 3 + 4 + 5 all complete
  T021, T022             → Parallel (different files)
  T023                   → After T021, T022 (needs all components stable)
  T024                   → After T023 (Lighthouse needs final implementation)
  T025                   → After T024 (final CI gate)
```

### Parallel Opportunities Within Phases

| Phase | Parallelizable Tasks |
|-------|---------------------|
| Phase 1 | T001 + T002 + T003 (all 3 simultaneous) |
| Phase 2 | T005 + T007 + T009 (write 3 test files simultaneously); then T006 + T008 + T010 |
| Phase 3 | T011 + T012 (write 2 test files simultaneously) |
| Phase 4 (US2) | Sequential only: T017 → T018 → T019 (all depend on prior step) |
| Phase 5 (US3) | Can overlap with Phase 4 (middleware already built in Phase 2) |
| Phase 6 | T021 + T022 simultaneous |

---

## Implementation Strategy

### MVP First (Recommended for single developer)

1. Complete **Phase 1** (assets + tokens)
2. Complete **Phase 2** (types, icon, middleware, callback)
3. Complete **Phase 3** (US1 — Google OAuth login, full flow)
4. **STOP and VALIDATE**: Run `yarn test`, run E2E, verify login flow works end-to-end
5. Deploy MVP if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready
2. Phase 3 (US1) → Login works → Deploy
3. Phase 4 (US2) → Language toggle → Deploy
4. Phase 5 (US3) → Auth redirect confirmed → Deploy
5. Phase 6 → Polish → Final deploy

### Open Prerequisite

- **Q1** (from plan.md): English hero text for B.2_content must be confirmed before Phase 3 T014.
  Placeholder: "Begin your journey with SAA 2025." / "Sign in to explore!"
  Implement VI text first; add English when confirmed.

---

## Notes

- Mark tasks complete as you go: change `- [ ]` to `- [x]`
- Commit after each phase checkpoint (or each logical task group)
- Run `yarn test` before moving to the next phase
- **TDD is non-negotiable** (constitution §III): test files MUST be written and failing before implementation
- All new files use `kebab-case` filename, `PascalCase` export (e.g., `login-button.tsx` → `export function LoginButton`)
- `useSearchParams()` is NOT used — error and lang are passed as props from the async Server Component (`page.tsx`)
- Language dropdown (frame `721:4942`) is a stub in T018 — full dropdown spec is a future task
