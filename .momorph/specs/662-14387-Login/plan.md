# Implementation Plan: Login

**Frame**: `662-14387-Login`
**Date**: 2026-03-06
**Spec**: `specs/662-14387-Login/spec.md`

---

## Summary

Implement the Login screen for SAA 2025 — the sole entry point for unauthenticated users.
Authentication is delegated entirely to Google OAuth via Supabase (`signInWithOAuth`).
The page is a full-bleed hero with a background artwork, gradient overlays, a language selector
in the header, and a single "LOGIN With Google" CTA button. After successful OAuth, the
`/auth/callback` route handler exchanges the code for a Supabase session and redirects to `/`.
A root Next.js middleware guards all protected routes and redirects unauthenticated users to `/login`.

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15 (App Router, RSC)
**Primary Dependencies**: React 19, TailwindCSS 4, `@supabase/ssr`, `next/font/google`, Zod
**Database**: N/A (auth only — Supabase manages session storage in HTTP-only cookies)
**Testing**: Vitest (unit, co-located with source), Playwright (E2E under `tests/e2e/`)
**State Management**: React local state (`useState`) — no global store needed for this screen
**API Style**: Supabase SDK (no custom REST endpoints except `/auth/callback` Route Handler)
**Edge Runtime**: Cloudflare Workers via `@opennextjs/cloudflare` — all code MUST be edge-safe

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, no `any`, named exports, **kebab-case filenames**)
- [x] Uses approved libraries (`@supabase/ssr`, `next/font/google`, TailwindCSS 4)
- [x] Adheres to folder structure (`src/app/`, `src/components/`, `src/libs/`, `src/types/`)
- [x] Meets security requirements (PKCE flow, no token logging, HTTP-only cookies, Zod on callback params)
- [x] Follows testing standards (TDD — tests written before implementation; Vitest unit co-located + Playwright E2E)
- [x] RSC-first: `login-page.tsx` is `"use client"` only because it uses `useState`/event handlers; `page.tsx` is a Server Component shell
- [x] `next/image` used for all images; raw `<img>` tags are FORBIDDEN
- [x] Supabase clients accessed only via `@/libs/supabase/{client,server,middleware}.ts` — no direct instantiation
- [x] All icons rendered via `<Icon>` component — no raw `<svg>` or `<img>` for icons
- [x] `NEXT_PUBLIC_SITE_URL` is a Next.js public env var (inlined at build time by Next.js bundler, not a CF runtime binding); `getCloudflareContext()` is NOT needed for it — only for CF-specific bindings (KV, R2, D1)

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| None | — | — |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/login/` — each Figma logical unit gets its own file (kebab-case filename, PascalCase export)
- **Styling Strategy**: TailwindCSS 4 utility classes; CSS custom properties for design tokens in `globals.css`
- **Data Fetching**: No data fetching on this screen; Supabase OAuth redirect is a browser-side action
- **Font Loading**: `next/font/google` for Montserrat + Montserrat Alternates; injected via root `layout.tsx`
- **Internationalization**: Language preference stored in `lang` cookie. `page.tsx` (Server Component) reads the `lang` cookie via `cookies()` and passes `initialLang` to `<LoginPage>` as a prop — this prevents hydration mismatch. `<LanguageSelector>` updates the cookie client-side on selection. All i18n-aware text is driven by the `lang` prop/state in `<LoginPage>`.
- **Icons**: Shared `<Icon>` component at `src/components/ui/icon.tsx` — wraps SVG sprites or inline SVGs, accepts `name` + `size` props
- **Error surfacing**: `/auth/callback` redirects to `/login?error=<encoded_message>` on failure. `page.tsx` (Server Component) reads `searchParams.error` (async, Next.js 15) and passes it as `initialError` prop to `<LoginPage>`. **`useSearchParams()` is NOT used** — prop drilling from the server component avoids it entirely and eliminates the Suspense requirement.

### Backend Approach

- **Auth callback**: New Route Handler at `src/app/auth/callback/route.ts` — uses `@/libs/supabase/server.ts`
  to call `exchangeCodeForSession(code)`, then redirects to `/`. On error: redirects to `/login?error=<encoded_message>`
- **Middleware guard**: New `src/middleware.ts` (root) — calls `@/libs/supabase/middleware.ts` helper,
  checks session, redirects unauthenticated users to `/login` and authenticated users away from `/login`
- **Validation**: Zod validates URL search params on `/auth/callback` (`code`, `error` params)
- **No database changes**: Auth entities are managed entirely by Supabase

### Integration Points

- **Existing Services**: `src/libs/supabase/client.ts` (browser OAuth), `src/libs/supabase/server.ts`
  (callback session exchange), `src/libs/supabase/middleware.ts` (session check helper)
- **Shared Components**: `src/components/ui/icon.tsx` — created in this feature, reused by future screens
- **API Contracts**: No custom API contract; Supabase SDK types are sufficient

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/662-14387-Login/
├── spec.md              # Feature specification
├── design-style.md      # Design tokens + component styles
├── plan.md              # This file
└── tasks.md             # Task breakdown (next step)
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── login/
│   │   └── page.tsx                      # NEW — async Server Component; reads searchParams + lang cookie; passes props to LoginPage
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts                  # NEW — OAuth callback Route Handler (Zod + exchangeCodeForSession)
│   ├── globals.css                       # MODIFY — add design tokens (CSS custom properties)
│   └── layout.tsx                        # MODIFY — add Montserrat + Montserrat Alternates via next/font/google
│
├── components/
│   ├── ui/
│   │   └── icon.tsx                      # NEW — shared Icon component (name, size props; no raw <svg>/<img>)
│   └── login/
│       ├── login-page.tsx                # NEW — "use client"; orchestrates full-screen layout; receives initialError + initialLang props
│       ├── login-button.tsx              # NEW — "use client"; CTA button (OAuth + loading + error states)
│       └── language-selector.tsx         # NEW — "use client"; language toggle + dropdown + cookie write
│
├── types/
│   └── login.ts                          # NEW — LanguagePreference type + LoginPageProps interface
│
├── libs/
│   └── supabase/
│       ├── client.ts                     # EXISTING — no changes
│       ├── server.ts                     # EXISTING — no changes
│       └── middleware.ts                 # EXISTING — no changes
│
└── middleware.ts                         # NEW — root Next.js middleware (auth guard + matcher config)

public/
└── images/
    └── login/
        ├── keyvisual.png                 # Figma asset — full-bleed background artwork (C_Keyvisual)
        ├── root-further.png              # Figma asset — "ROOT FURTHER" hero logo (B.1_KeyVisual)
        └── logo.png                      # Figma asset — SAA 2025 header logo (A.1_Logo, 52×56px)

# Co-located unit tests (constitution §III — test files co-located with source using .test.tsx suffix)
src/
├── components/
│   ├── ui/
│   │   └── icon.test.tsx                 # NEW
│   └── login/
│       ├── login-page.test.tsx           # NEW — renders with initialError prop; renders with initialLang prop; passes lang to children
│       ├── login-button.test.tsx         # NEW — default, loading, error states
│       └── language-selector.test.tsx    # NEW — open/close, keyboard nav, cookie write
├── app/
│   └── auth/
│       └── callback/
│           └── route.test.ts             # NEW — success redirect, error redirect, Zod validation
└── middleware.test.ts                    # NEW — auth guard redirect logic

# E2E tests (placed under tests/ per constitution §III)
tests/
└── e2e/
    └── login/
        └── login.spec.ts                 # NEW — Playwright: full OAuth flow, error flow, language toggle
```

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0: Asset Preparation & Foundation Setup
- Download Figma media assets via `get_media_files`:
  - Background keyvisual → `public/images/login/keyvisual.png`
  - "ROOT FURTHER" hero image → `public/images/login/root-further.png`
  - SAA 2025 header logo → `public/images/login/logo.png` (52×56px)
- Verify filenames and dimensions match design spec
- Modify `src/app/layout.tsx` — add Montserrat + Montserrat Alternates via `next/font/google`:
  ```ts
  import { Montserrat, Montserrat_Alternates } from 'next/font/google'
  const montserrat = Montserrat({ subsets: ['latin', 'vietnamese'], weight: ['700'] })
  const montserratAlternates = Montserrat_Alternates({ subsets: ['latin', 'vietnamese'], weight: ['700'] })
  ```
- Add design tokens to `src/app/globals.css` as CSS custom properties:
  `--color-bg`, `--color-header-overlay`, `--color-accent`, `--color-text-primary`,
  `--color-button-bg`, `--color-button-text`, `--color-divider`, and all spacing/radius tokens from `design-style.md`

#### Phase 1: Types & Shared UI — Icon Component
- Create `src/types/login.ts`:
  ```ts
  export type LanguagePreference = 'vi' | 'en'

  export interface LoginPageProps {
    initialError?: string
    initialLang?: LanguagePreference
  }
  ```
- **TDD first**: Write `src/components/ui/icon.test.tsx` (renders with correct size, name, className)
- Create `src/components/ui/icon.tsx` — accepts `name: string`, `size: number`, `className?: string`
  - Ships with: `google` (24×24px, brand colors), `flag-vn` (container 24×24px, image 20×15px), `chevron-down` (16×16px, white)
  - All icons rendered as inline SVG — NO `<img>` or standalone `<svg>` used outside this component

#### Phase 2: Foundation — Middleware & Auth Callback (US3 + US1 backend)
- **TDD first**: Write `src/middleware.test.ts` — test redirect: unauth→`/login`, authed→`/` from `/login`, static paths pass through
- Create `src/middleware.ts`:
  - Matcher: `['/((?!login|auth/callback|_next/static|_next/image|favicon.ico|images).*)']`
  - Reads Supabase session via `@/libs/supabase/middleware.ts` helper
  - Unauthenticated → non-public route: redirect to `/login`
  - Authenticated → `/login`: redirect to `/`
- **TDD first**: Write `src/app/auth/callback/route.test.ts` — success redirect, error redirect, missing `code` param, Zod rejects unexpected types
- Create `src/app/auth/callback/route.ts`:
  - Zod schema: `z.object({ code: z.string().optional(), error: z.string().optional() })`
  - If `error` param present: redirect to `/login?error=${encodeURIComponent(error)}`
  - If `code` present: call `supabase.auth.exchangeCodeForSession(code)` via `@/libs/supabase/server.ts`
    - Success → `NextResponse.redirect('/')` with session cookie set by Supabase
    - Failure → `NextResponse.redirect('/login?error=auth_failed')`
  - No token or session data logged (OWASP A02)

#### Phase 3: Core Login UI (US1 — P1)
- **TDD first**: Write `src/components/login/login-button.test.tsx`:
  - Default state: renders "LOGIN With Google" label + Google icon
  - Click: calls `signInWithOAuth`, sets `isLoading = true`, button disabled
  - Loading: `aria-busy="true"`, `aria-disabled="true"`, `cursor-not-allowed`, spinner visible, text → "Đang đăng nhập..."
  - Error prop: error banner displayed below button with "Thử lại" retry link
- Create `src/components/login/login-button.tsx` (`"use client"`):
  - Props: `{ lang: LanguagePreference; error?: string; onError: (msg: string | null) => void }`
  - Calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback' } })`
  - Button content (left → right): label `<span>` (`w-[225px]`) + `<Icon name="google" size={24} />` (trailing)
  - `aria-label`: `lang === 'en' ? 'Sign in with Google' : 'Đăng nhập bằng Google'`
  - `aria-busy="true"` + `aria-disabled="true"` when `isLoading === true`
  - Hover: `bg-[#FFE480] shadow-[0_4px_12px_rgba(255,234,158,0.4)]` (150ms ease-in-out transition)
  - Active: `bg-[#FFD740] scale-[0.98]` (100ms ease-in transition)
  - Focus: `outline-2 outline-[#15D5CA] outline-offset-2`
  - Error banner: `<div role="alert">` below button with localized message + "Thử lại" / "Try again" retry link
- Create `src/components/login/login-page.tsx` (`"use client"`):
  - Props: `LoginPageProps` (`initialError?: string`, `initialLang?: LanguagePreference`)
  - State: `const [error, setError] = useState(initialError ?? null)`, `const [lang, setLang] = useState(initialLang ?? 'vi')`
  - Layout: `<div className="bg-[#00101A] min-h-screen relative overflow-hidden">`
    - `<Image fill style={{ objectFit: 'cover' }} alt="" aria-hidden />` — C_Keyvisual (z-0)
    - `<div aria-hidden className="absolute inset-0 z-1 bg-linear-to-r from-[#00101A] to-transparent pointer-events-none" />` — Rectangle57
    - `<div aria-hidden className="absolute bottom-0 left-0 w-full h-full z-1 bg-linear-to-t from-[#00101A] to-transparent pointer-events-none" />` — Cover
    - `<header className="w-full h-20 flex justify-between items-center py-3 px-4 md:px-12 lg:px-36 bg-[rgba(11,15,18,0.8)] backdrop-blur-sm sticky top-0 z-10">`
      - `<Image src="/images/login/logo.png" width={52} height={56} alt="SAA 2025 logo" />`
      - `<LanguageSelector lang={lang} onLangChange={setLang} />`
    - `<main className="w-full flex flex-col items-start py-10 px-4 md:py-16 md:px-12 lg:py-24 lg:px-36 gap-10 md:gap-20 lg:gap-30 absolute top-20">`
      - B.1_KeyVisual: `<Image src="/images/login/root-further.png" width={451} height={200} alt="Root Further" />`
      - Frame550 (`flex flex-col gap-6 pl-4`):
        - B.2_content: `<p>` — hero text driven by `lang` state (see Open Questions for English copy)
        - `<LoginButton lang={lang} error={error} onError={setError} />`
    - `<footer className="w-full flex justify-between items-center py-6 px-4 md:py-8 md:px-12 lg:py-10 lg:px-22.5 border-t border-[#2E3940] text-white font-bold absolute bottom-0">`
      - `<p className="font-['Montserrat_Alternates'] text-sm md:text-base">Bản quyền thuộc về Sun* © 2025</p>`
- **TDD first**: Write `src/components/login/login-page.test.tsx`:
  - Renders header, main, footer landmarks
  - `initialError` prop → error state propagated to `<LoginButton>`
  - `initialLang` prop → `lang` state propagated to `<LanguageSelector>` and `<LoginButton>`
  - Default lang falls back to `'vi'` when no prop provided
- Create `src/app/login/page.tsx` (async Server Component, Next.js 15):
  ```ts
  import { cookies } from 'next/headers'
  import type { LanguagePreference } from '@/types/login'

  import { LoginPage } from '@/components/login/login-page'

  type Props = { searchParams: Promise<{ error?: string }> }

  // Named `Page` (Next.js convention) to avoid conflict with the imported LoginPage component
  export default async function Page({ searchParams }: Props) {
    const { error } = await searchParams
    const cookieStore = await cookies()
    const lang = (cookieStore.get('lang')?.value ?? 'vi') as LanguagePreference
    return <LoginPage initialError={error} initialLang={lang} />
  }
  ```

#### Phase 4: Language Selector (US2 — P2)
- **TDD first**: Write `src/components/login/language-selector.test.tsx`:
  - Default: renders VN flag + "VN" text + chevron-down icon
  - Click: `isLangDropdownOpen` toggles true; `aria-expanded` updates
  - Select "EN": calls `onLangChange('en')`, writes `lang=en` cookie, closes dropdown
  - Backdrop click: closes dropdown
  - Keyboard: Escape closes; Enter/Space opens; Arrow keys navigate options (VI/EN)
- Create `src/components/login/language-selector.tsx` (`"use client"`):
  - Props: `{ lang: LanguagePreference; onLangChange: (lang: LanguagePreference) => void }`
  - Outer: `w-[108px] h-14 flex items-center gap-4 relative`
  - Inner `<button>`: `flex items-center justify-between p-4 rounded-sm`; keyboard activated
  - `aria-haspopup="listbox"`, `aria-expanded={isLangDropdownOpen}`, `aria-label="Select language"`
  - Content: `<Icon name="flag-vn" size={20} />` + label (`lang === 'en' ? 'EN' : 'VN'`) + `<Icon name="chevron-down" size={16} />`
  - Hover: `bg-[rgba(255,255,255,0.08)]` (150ms); Active/Open: `bg-[rgba(255,255,255,0.12)]`; Focus: `outline-2 outline-[#15D5CA]`
  - Dropdown `<ul role="listbox">`: absolute below button, slide-in (opacity + translateY, 150ms ease-out)
    - Stub options: `<li role="option" value="vi">Tiếng Việt</li>` + `<li role="option" value="en">English</li>`
  - On select: `document.cookie = 'lang=${value}; path=/; max-age=31536000'`, call `onLangChange(value)`
  - Backdrop: `<div className="fixed inset-0 z-[99]" aria-hidden onClick={() => setIsOpen(false)} />` when open

#### Phase 5: Animations & Polish
- Verify all 4 animation specs from `design-style.md` are in place (added inline in Phases 3/4):
  - B.3_Login hover: `transition-[background-color,box-shadow] duration-150 ease-in-out`
  - B.3_Login active: `transition-transform duration-100 ease-in`
  - A.2_Language hover: `transition-colors duration-150 ease-in-out`
  - Language dropdown: `transition-[opacity,transform] duration-150 ease-out`
- Verify focus rings: `outline-2 outline-[#15D5CA] outline-offset-2` on ALL interactive elements
- Verify `alt=""` on all decorative images; `aria-hidden="true"` on gradient overlays
- Add `<noscript>` message: `<noscript><p>JavaScript is required to sign in.</p></noscript>`
- Validate OWASP A02: no session data logged in `/auth/callback` route handler

#### Phase 6: Responsive & QA
- Confirm mobile-first Tailwind classes are in place (applied during Phase 3):
  - Mobile (default, ≤767px): header `h-[60px] px-4`, logo `w-9 h-10`, hero `py-10 px-4 gap-10`, button `w-full`, footer `py-6 px-4 text-sm text-center`
  - Tablet (`md:`, 768–1023px): header `px-12`, hero `py-16 px-12 gap-20`, button `w-[280px]`, footer `py-8 px-12`
  - Desktop (`lg:`, ≥1024px): header `px-36`, hero `py-24 px-36 gap-30`, button `w-[305px]`, footer `py-10 px-22.5`
- Verify no horizontal overflow at 360px, 768px, 1440px (Playwright responsive tests)
- Run Lighthouse: a11y score ≥ 90 on both desktop and mobile

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OAuth callback URL misconfiguration (local vs production) | Medium | High | Runtime guard in `login-button.tsx`: throw if `NEXT_PUBLIC_SITE_URL` is undefined before calling `signInWithOAuth`; document Supabase Dashboard whitelisting in prerequisites |
| Cloudflare Workers edge runtime incompatibility | Low | High | `@supabase/ssr` is edge-compatible; use Web Crypto API; no `node:*` imports |
| Middleware redirect loop (matcher too broad) | Low | High | Strict negative-lookahead matcher excludes `/login`, `/auth/callback`, `/_next`, `/images`, `/favicon.ico` |
| Font CLS from Montserrat loading | Medium | Low | `next/font/google` with `display: 'swap'` + `subsets: ['latin', 'vietnamese']` |
| Language cookie mismatch causing hydration error | Low | Medium | Server Component (`page.tsx`) reads `lang` cookie and passes as `initialLang` prop — client starts with correct value |
| Hero text requires English translations (content gap) | High | Medium | See Open Questions — implement VI text only until English copy is confirmed; log console.warn in dev |

### Estimated Complexity

- **Frontend**: Medium (hero layout, gradient overlays, loading/error states, a11y, animations, i18n)
- **Backend**: Low (one Route Handler, one middleware — both follow existing patterns)
- **Testing**: Medium (OAuth mocking in unit tests; E2E requires test Google credentials)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: `LoginButton` → `signInWithOAuth` → loading state; `LanguageSelector` → cookie → label update
- [x] **External dependencies**: Supabase Auth (mocked in unit, real in E2E staging)
- [ ] **Data layer**: N/A — no database reads/writes on login screen
- [x] **User workflows**: Full OAuth flow (E2E): `/login` → Google OAuth → `/auth/callback` → `/`

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Button click → loading state; error display; language toggle → label/cookie |
| Service ↔ Service | Yes | `middleware.ts` ↔ Supabase session check; `/auth/callback` ↔ `server.ts` |
| App ↔ External API | Yes | Supabase `signInWithOAuth`, `exchangeCodeForSession` |
| App ↔ Data Layer | No | N/A |
| Cross-platform | Yes | Responsive: 360px / 768px / 1440px viewport rendering |

### Test Environment

- **Environment type**: Local Vitest (unit, co-located); Playwright local dev (E2E with Supabase local)
- **Test data strategy**: `vi.mock('@/libs/supabase/client')` in unit tests; test Google OAuth credentials for E2E
- **Isolation approach**: Fresh component mount per unit test; fresh browser context per E2E test

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `@/libs/supabase/client.ts` | `vi.mock` — stub client object | Avoid real network in unit tests |
| `supabase.auth.signInWithOAuth` | `vi.fn()` — resolve/reject | Test both success and failure paths |
| `next/navigation` (`useRouter`) | `vi.mock('next/navigation')` | Prevent actual navigation in unit tests |
| `document.cookie` (LanguageSelector) | Direct assertion post-render | Verify cookie string is written correctly |
| Google OAuth (E2E) | Real test account | Full integration verification |
| Supabase session (middleware test) | Stub `Request` with cookie headers | Test redirect logic without real session |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Unauthenticated user visits `/login` → page renders without redirect
   - [ ] User clicks "LOGIN With Google" → button enters loading state immediately (`aria-busy="true"`)
   - [ ] OAuth completes → `/auth/callback` exchanges code → redirects to `/` with session
   - [ ] Already-authenticated user visits `/login` → middleware redirects to `/` (no page render)

2. **Error Handling**
   - [ ] User cancels OAuth → `/auth/callback?error=access_denied` → redirect to `/login?error=access_denied` → error banner visible
   - [ ] `signInWithOAuth` throws (Supabase unreachable) → `onError` called → error state on button, retry visible
   - [ ] `/auth/callback` receives invalid `code` → `exchangeCodeForSession` fails → redirect to `/login?error=auth_failed`
   - [ ] `/auth/callback` receives both `error` and `code` params → `error` takes priority

3. **Edge Cases**
   - [ ] Language toggle opens dropdown; selecting EN writes `lang=en` cookie and updates button label
   - [ ] Keyboard: Tab reaches login button and language selector; Enter/Space activates; Escape closes dropdown
   - [ ] Viewport 360px: button is `w-full`, no horizontal overflow
   - [ ] JS disabled: `<noscript>` message rendered
   - [ ] `lang` cookie set to `en` on server → `initialLang='en'` → page loads with English labels (no flicker)

### Tooling & Framework

- **Test framework**: Vitest (unit, co-located), Playwright (E2E under `tests/e2e/`)
- **Supporting tools**: `@testing-library/react`, `vi.mock`, `@testing-library/user-event`
- **CI integration**: Vitest runs on every PR; Playwright E2E runs on staging deploy

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `login-button.tsx` | 90%+ | High |
| `language-selector.tsx` | 80%+ | Medium |
| `/auth/callback/route.ts` | 90%+ | High |
| `src/middleware.ts` redirect logic | 90%+ | High |
| `icon.tsx` | 80%+ | Low |
| Responsive layout (E2E) | All 3 key viewports | Medium |

---

## Open Questions

> These MUST be resolved before Phase 3 (hero text) and Phase 4 (language label) are implemented.

**Content / i18n:**
- **Q1**: What is the English version of the two-line B.2_content hero text?
  - Current Vietnamese: "Bắt đầu hành trình của bạn cùng SAA 2025." / "Đăng nhập để khám phá!"
  - Pending English copy from content owner. Placeholder: "Begin your journey with SAA 2025." / "Sign in to explore!"

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (3× review passes completed)
- [x] `design-style.md` verified (Figma data cross-checked)
- [ ] Supabase project Google OAuth provider confirmed enabled in Dashboard
- [ ] `NEXT_PUBLIC_SITE_URL` env var set (local: `http://localhost:3000`; fail-fast if missing at build)
- [ ] `/auth/callback` URL whitelisted in Supabase Dashboard → Authentication → URL Configuration
- [ ] Test Google OAuth credentials available for E2E tests
- [ ] English hero text confirmed (Q1 above)
- [ ] No `BACKEND_API_TESTCASES.md` needed — this screen has no custom API endpoints

### External Dependencies

- **Supabase Auth**: Google OAuth provider enabled (confirmed: `feat(auth): enable Google OAuth provider`)
- **Google Cloud Console**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — present in `.env.example`
- **Figma assets**: 3 images to export — background keyvisual, "ROOT FURTHER" hero image, SAA 2025 logo

---

## Next Steps

After plan approval:

1. **Resolve Q1** — confirm English hero text copy before implementation
2. **Run** `/momorph.tasks` to generate granular task breakdown with phase/dependencies
3. **Review** `tasks.md` — identify tasks that can be parallelized (e.g., asset download + Icon component + types)
4. **Begin** implementation in phase order: Assets+Tokens → Types+Icon → Middleware+Callback → Core UI → Language → Animations → Responsive QA

---

## Notes

- **Middleware matcher** MUST exclude: `/login`, `/auth/callback`, `/_next/static`, `/_next/image`,
  `/favicon.ico`, `/images/*` — otherwise the auth redirect creates an infinite loop.
- **`redirectTo` URL**: `process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback'` — inlined at build time
  by Next.js bundler; no need for `getCloudflareContext()`. **Validate at runtime** inside `login-button.tsx`
  before calling `signInWithOAuth`: `if (!process.env.NEXT_PUBLIC_SITE_URL) throw new Error('NEXT_PUBLIC_SITE_URL is not set')`
  — `NEXT_PUBLIC_*` vars are inlined as `undefined` (not rejected) by the bundler if missing, so build succeeds silently.
- **Next.js 15 `searchParams`**: In `page.tsx`, `searchParams` is `Promise<{...}>` and MUST be awaited.
  The `async` keyword is required on the page function.
- **Error surfacing via prop drilling**: `page.tsx` (Server Component) reads `searchParams.error` and
  passes it as `initialError` to `<LoginPage>`. **`useSearchParams()` is NOT used** — no Suspense wrapper needed.
- **`lang` cookie hydration**: `page.tsx` reads the `lang` cookie server-side and passes `initialLang` to
  `<LoginPage>`, ensuring the client starts with the correct language value and avoids hydration mismatch.
- **B.3_Login content order**: text label (left, `w-[225px]`) first, then Google icon (trailing, 24×24px).
  Intentional per SAA 2025 Figma — unlike the standard Google Sign-In button.
- **Rectangle 57 + Cover** MUST have `pointer-events-none` + `aria-hidden="true"` — purely decorative.
- **Montserrat Alternates** used ONLY for D_Footer copyright text. Montserrat covers all other text.
- **Language dropdown (frame `721:4942`)**: implement a minimal stub (VI/EN `<li>` options) pending the full spec.
- **File naming**: kebab-case files (e.g., `login-button.tsx`), PascalCase exports (`export function LoginButton`).
