# Implementation Plan: Homepage SAA

**Frame**: `2167-9026-Homepage-SAA`
**Date**: 2026-03-10
**Spec**: `specs/2167-9026-Homepage-SAA/spec.md`

---

## Summary

Replace the Next.js boilerplate `src/app/page.tsx` with the full **Homepage SAA** screen: a dark-themed, authenticated landing page featuring a real-time countdown timer, 6 award category cards, a Sun* Kudos promo block, a fixed header with language/profile controls, a floating widget button, and a copyright footer. Awards data is fetched server-side via `GET /api/awards`; all text supports VI/EN language switching via a `lang` cookie. Implementation follows TDD (Red → Green → Refactor) using Vitest + React Testing Library.

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS 4, Zod 4 (already installed)
**Database**: Supabase (PostgreSQL) — via `@/libs/supabase/server.ts`
**Testing**: Vitest 4 + @testing-library/react (already installed)
**State Management**: Local component state only (React `useState`, `useRef`)
**API Style**: REST (Next.js Route Handlers)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] TypeScript strict mode — all new files must compile with `"strict": true`
- [x] File naming: `kebab-case` files, `PascalCase` exports
- [x] Path alias `@/*` for all internal imports — no `../` across feature boundaries
- [x] RSC-first: `"use client"` only where required (Countdown, Header dropdowns, WidgetButton)
- [x] TDD: failing test before every implementation unit
- [x] Zod validation on Route Handlers (`/api/awards`, `/api/notifications`)
- [x] Supabase session via middleware (already implemented in `src/middleware.ts`)
- [x] Mobile-first TailwindCSS: `360px` → `768px` → `1440px+`
- [x] WCAG AA: focus rings `outline: 2px solid #15D5CA`, ARIA labels, skip nav
- [x] `<Image>`, `<Link>` built-ins — no raw `<img>` or `<a>` for internal content
- [x] No `console.log` in production code
- [x] `yarn audit` — no high/critical vulnerabilities (existing deps are clean)
- [x] No `any` TypeScript type without `// eslint-disable` justification — enforce in all new files
- [x] Files ≤ ~200 lines — `homepage.tsx` assembles many sections; split `hero-section.tsx` to stay within limit

**Violations — none.** No new libraries needed; all required packages are already installed.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — `src/components/homepage/` mirrors Login pattern (`src/components/login/`)
- **Styling Strategy**: TailwindCSS 4 utility classes with custom arbitrary values, matching the Login pattern
- **Data Fetching**: Server Components (RSC) for award data; client hooks for countdown timer
- **Language i18n**: Dictionary-based per component (following Login pattern), driven by `lang` cookie read in the RSC page then passed as prop. New shared `src/i18n/homepage.ts` dictionary.
- **Client Islands** (minimal `"use client"` surface):
  - `<Header>` — dropdown state for profile/language selectors + `usePathname()` for active nav link detection
  - `<Countdown>` — `setInterval` every 60 seconds; reads `NEXT_PUBLIC_EVENT_DATETIME` env var
  - `<WidgetButton>` — toggle open/close state for quick-action menu (P3; menu content TBD by product)
- **Notification count**: fetched client-side inside `<Header>` via `useEffect` + `fetch('/api/notifications')` on mount; badge hidden while loading/error (non-critical, per spec)

### Backend Approach

- **API Design**: Next.js Route Handlers (`app/api/`)
- **`GET /api/awards`**: Zod-validated response; static seed data initially (no DB table yet). Seed defines the 6 award slugs: `top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-creator`, `mvp`. These slugs are the canonical anchors used in `/awards-information#[slug]` navigation.
- **`GET /api/notifications`**: Stub — returns `{ count: 0 }` until notification feature is built
- **Validation**: Zod schemas for all Route Handler responses

### Integration Points

- **Auth middleware**: `src/middleware.ts` already redirects unauthenticated users to `/login` — no changes needed
- **Supabase client**: `src/libs/supabase/server.ts` for any server-side auth checks
- **Reused components**:
  - `<LanguageSelector>` (`src/components/login/language-selector.tsx`) — used directly in Homepage `<Header>`
  - `<Icon>` (`src/components/ui/icon.tsx`) — extended with new icons
- **Reused types**: `LanguagePreference` from `src/types/login.ts`
- **Fonts**: Montserrat + Montserrat Alternates already loaded in `layout.tsx`

### Token Naming Reconciliation

`globals.css` currently has `--color-accent: #15d5ca` (teal focus ring from Login).
Homepage spec also defines `--color-accent` as `#FFEA9E` (yellow). **Resolution**: Homepage will use `--color-primary` for the yellow value; the teal value stays as `--color-focus-ring`. Both are added to globals.css without removing the Login tokens.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2167-9026-Homepage-SAA/
├── spec.md              # Feature specification
├── design-style.md      # Visual specifications
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/frame.png     # Reference screenshot
```

### Source Code (new files)

```text
src/
├── app/
│   ├── page.tsx                                 # REPLACE: RSC entry, reads lang cookie + fetches awards
│   └── api/
│       ├── awards/
│       │   ├── route.ts                         # NEW: GET /api/awards (Zod validated)
│       │   └── route.test.ts                    # NEW: unit tests for route handler
│       └── notifications/
│           ├── route.ts                         # NEW: GET /api/notifications (stub)
│           └── route.test.ts                    # NEW: unit tests for route handler
│
├── components/
│   ├── homepage/
│   │   ├── homepage.tsx                         # NEW: Page layout shell (RSC) - assembles sections
│   │   ├── homepage.test.tsx                    # NEW: landmark + structure, skip nav link
│   │   ├── hero-section.tsx                     # NEW: Bìa wrapper — keyvisual bg + gradient covers + B1-B4 (RSC)
│   │   ├── hero-section.test.tsx                # NEW: keyvisual renders, gradient divs present
│   │   ├── header.tsx                           # NEW: Fixed nav bar (client - dropdowns + usePathname)
│   │   ├── header.test.tsx                      # NEW: nav link states, dropdown toggle
│   │   ├── countdown.tsx                        # NEW: Real-time countdown (client)
│   │   ├── countdown.test.tsx                   # NEW: digit rendering, zero state
│   │   ├── event-info.tsx                       # NEW: Time + venue block (RSC)
│   │   ├── event-info.test.tsx                  # NEW: content rendering
│   │   ├── cta-buttons.tsx                      # NEW: ABOUT AWARDS + ABOUT KUDOS (RSC)
│   │   ├── cta-buttons.test.tsx                 # NEW: link hrefs + labels
│   │   ├── content-block.tsx                    # NEW: B4 ROOT FURTHER description (RSC)
│   │   ├── content-block.test.tsx               # NEW: VI/EN content switch
│   │   ├── awards-section.tsx                   # NEW: Section header + card grid + Suspense (RSC)
│   │   ├── awards-section.test.tsx              # NEW: grid rendering, empty state, error banner
│   │   ├── skeleton-cards.tsx                   # NEW: 6-placeholder loading skeleton for awards grid (RSC)
│   │   ├── award-card.tsx                       # NEW: Individual award card (RSC)
│   │   ├── award-card.test.tsx                  # NEW: card content, navigation href
│   │   ├── kudos-block.tsx                      # NEW: Sun* Kudos promo (RSC)
│   │   ├── kudos-block.test.tsx                 # NEW: content + CTA link
│   │   ├── widget-button.tsx                    # NEW: Floating action button (client)
│   │   ├── widget-button.test.tsx               # NEW: fixed position, visibility
│   │   ├── footer.tsx                           # NEW: Page footer (RSC)
│   │   └── footer.test.tsx                      # NEW: copyright text, nav links
│   └── ui/
│       ├── icon.tsx                             # MODIFY: add notification-bell, user-avatar, arrow-up, pen icons
│       └── icon.test.tsx                        # MODIFY: add tests for new icons
│
├── hooks/
│   ├── use-countdown.ts                         # NEW: countdown logic (pure, testable)
│   └── use-countdown.test.ts                    # NEW: unit tests for hook logic
│
├── i18n/
│   └── homepage.ts                              # NEW: VI/EN translation dictionary
│
├── types/
│   └── homepage.ts                              # NEW: AwardCategory, NotificationCount types + Zod schemas
│
└── app/
    └── globals.css                              # MODIFY: add Homepage design tokens
```

### Modified Existing Files

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Replace Next.js boilerplate with `<HomePage>` RSC |
| `src/app/layout.tsx` | (1) Add `"400"` to Montserrat `weight` array; (2) Add `localFont` declarations for `Digital Numbers` (`--font-digital-numbers`) and `SVN-Gotham` (`--font-svn-gotham`) using `next/font/local` pointing to `public/fonts/`; (3) Add both CSS variables to `<body>` className |
| `src/app/globals.css` | Add Homepage design tokens (`--color-primary`, `--color-focus-ring`, `--color-badge`, etc.) |
| `src/components/ui/icon.tsx` | Add notification-bell, user-avatar, arrow-up, pen SVG icons |
| `src/components/ui/icon.test.tsx` | Add render tests for new icons |

### New Public Assets

```text
public/
├── fonts/
│   ├── digital-numbers.woff2                    # NEW: self-hosted (obtain from licensed source)
│   └── svn-gotham.woff2                         # NEW: self-hosted (obtain from licensed source)
└── images/
    └── homepage/
        ├── keyvisual.png                        # NEW: full-bleed background
        ├── root-further-logo.png               # NEW: ROOT FURTHER word mark image
        ├── award-top-talent.png                 # NEW: award card image
        ├── award-top-project.png                # NEW: award card image
        ├── award-top-project-leader.png         # NEW: award card image
        ├── award-best-manager.png               # NEW: award card image
        ├── award-signature-creator.png          # NEW: award card image
        ├── award-mvp.png                        # NEW: award card image
        └── kudos-bg.png                         # NEW: Sun* Kudos card background image
```

---

## Implementation Strategy

### Phase 0: Asset Preparation (prerequisite)

- Download Figma assets using `mcp__momorph__get_media_files` and `mcp__momorph__get_frame_image`:
  - Frame image: node `2167:9026` → `public/images/homepage/keyvisual.png`
  - Root Further logo: node `2167:9031` → `public/images/homepage/root-further-logo.png`
  - 6 award card images: nodes from C2 grid → `public/images/homepage/award-{slug}.png`
  - Kudos block bg: node `3390:10349` background → `public/images/homepage/kudos-bg.png`
- Obtain and save self-hosted font files to `public/fonts/` (verify licensing before use)
- Do **not** add raw `@font-face` to `globals.css`; instead use `next/font/local` in `layout.tsx` (see Modified Files)
- Add Montserrat `weight: ["400"]` to `layout.tsx` font loading

### Phase 1: Foundation — Types + Tokens + Icons

**Goal**: Shared infrastructure ready for all components.

1. `src/types/homepage.ts` — `AwardCategory` interface + Zod schema; `NotificationCount` type
2. `src/i18n/homepage.ts` — VI/EN dictionaries for all static text (countdown labels, section titles, CTA text, event info, Kudos copy, footer links)
3. `src/app/globals.css` — Add Homepage design tokens
4. `src/app/layout.tsx` — Add Montserrat 400 weight; add Digital Numbers + SVN-Gotham `@font-face` declarations + CSS variable
5. `src/components/ui/icon.tsx` — Add `notification-bell`, `user-avatar`, `arrow-up`, `pen` icons

### Phase 2: Countdown Hook + Component — US2 (P1, TDD)

**Goal**: Real-time countdown renders correctly, including env var fallback.

1. **Red**: Write `use-countdown.test.ts`:
   - `calcTimeLeft(targetDate, now)` returns correct `{ days, hours, minutes }` with zero-padding
   - When `now >= targetDate`, returns `{ days: "00", hours: "00", minutes: "00" }` and `isEventStarted: true`
   - Auto-update fires every 60s (`vi.useFakeTimers()`)
2. **Green**: Implement `src/hooks/use-countdown.ts`
   - Accepts `targetDate: Date` — caller passes parsed `new Date(process.env.NEXT_PUBLIC_EVENT_DATETIME ?? DEFAULT_EVENT_DATE)`
   - `DEFAULT_EVENT_DATE = "2025-11-15T18:30:00+07:00"` — hardcoded fallback constant
3. **Red**: Write `countdown.test.tsx` — digit rendering, "Coming soon" hidden/visible, zero state, `aria-live` present
4. **Green**: Implement `src/components/homepage/countdown.tsx` (client component)
   - Reads `NEXT_PUBLIC_EVENT_DATETIME` env var; falls back to `DEFAULT_EVENT_DATE` when undefined

### Phase 3: Static Layout Sections — US1 (P1, TDD)

**Goal**: Hero section renders with correct content and layout.

1. `event-info.tsx` + `event-info.test.tsx` — static time/venue block; Facebook group text is `<p>` (not `<a>`)
2. `cta-buttons.tsx` + `cta-buttons.test.tsx` — ABOUT AWARDS (`href="/awards-information"`) + ABOUT KUDOS (`href="/kudo/live"`)
3. `content-block.tsx` + `content-block.test.tsx` — B4 ROOT FURTHER description; text sourced from `src/i18n/homepage.ts`; VI by default, EN when `lang="en"`
4. `hero-section.tsx` + `hero-section.test.tsx` — Bìa wrapper:
   - Full-bleed `<Image>` keyvisual (`public/images/homepage/keyvisual.png`, `fill`, `z-0`)
   - Gradient cover `<div>` (`linear-gradient(12deg, #00101A, transparent)`, `z-1`)
   - Root Further logo `<Image>` (451×200px, `priority`)
   - Assembles Countdown, EventInfo, CTAButtons, ContentBlock in a column layout

### Phase 4: Awards Section — US3 (P1, TDD)

**Goal**: 6 award cards render and navigate correctly.

1. `src/types/homepage.ts` — define `AWARD_SLUGS` constant and `AwardCategory` Zod schema:
   ```ts
   export const AWARD_SLUGS = ["top-talent","top-project","top-project-leader","best-manager","signature-creator","mvp"] as const;
   export type AwardSlug = typeof AWARD_SLUGS[number];
   export const AwardCategorySchema = z.object({ id: z.string(), slug: z.enum(AWARD_SLUGS), name: z.string(), description: z.string(), thumbnailUrl: z.string().url() });
   ```
2. **Red**: Write `award-card.test.tsx` — card title, description truncated at 2 lines (`line-clamp-2`), "Chi tiết" `<Link>` href is `/awards-information#[slug]`
3. **Green**: Implement `src/components/homepage/award-card.tsx` — description uses `className="line-clamp-2"`; image uses `mix-blend-mode: screen` Tailwind class `mix-blend-screen`
4. **Red**: Write `awards-section.test.tsx` — renders 6 cards, shows empty state message "Dữ liệu đang được cập nhật" when 0 awards, shows error banner on fetch failure
5. **Green**: Implement `src/components/homepage/awards-section.tsx` — wraps `<AwardsGrid>` in `<Suspense fallback={<SkeletonCards />}>`; handles error boundary
6. **Green**: Implement `src/components/homepage/skeleton-cards.tsx` — 6 skeleton placeholders (336×504px grey pulse)
7. **Red**: Write `src/app/api/awards/route.test.ts` — 200 response with Zod-validated array; empty array acceptable
8. **Green**: Implement `src/app/api/awards/route.ts` — returns static seed array of 6 `AwardCategory` objects; validates output with `AwardCategorySchema.array()`

### Phase 5: Kudos Block + Widget — US5, US7 (P2/P3, TDD)

**Goal**: Kudos promo and floating button render correctly.

1. `kudos-block.tsx` + `kudos-block.test.tsx` — content, "Chi tiết" button link
2. `widget-button.tsx` + `widget-button.test.tsx` — fixed position, aria-label

### Phase 6: Header — US6 (P1, TDD)

**Goal**: Sticky header with nav links, controls, and language/profile dropdowns.

1. **Red**: Write `header.test.tsx`:
   - Active link styling: link whose `href === pathname` gets `text-[#FFEA9E] border-b border-[#FFEA9E]`
   - Clicking language selector opens/closes `<LanguageSelector>` dropdown
   - Notification badge renders when `notificationCount > 0`; hidden at `0`
   - `aria-label` present on bell, avatar, and widget button
2. **Green**: Implement `src/components/homepage/header.tsx`:
   - `"use client"` — uses `usePathname()` from `next/navigation` for active link detection
   - Props: `initialLang: LanguagePreference` (from RSC page cookie read)
   - `useEffect` on mount: `fetch('/api/notifications')` → set `notificationCount`; badge hidden on error
   - Reuses `<LanguageSelector>` component as-is
3. **Green**: Implement `src/app/api/notifications/route.ts` — stub returning `{ count: 0 }`

### Phase 7: Footer — US1 (P1, TDD)

1. `footer.tsx` + `footer.test.tsx` — copyright text (Montserrat Alternates), all 4 nav links, "About SAA 2025" → `/`

### Phase 8: Page Assembly

1. `src/components/homepage/homepage.tsx` + `homepage.test.tsx`:
   - `<a href="#main-content">Skip to main content</a>` as first focusable element (visually hidden, visible on focus)
   - `<Header>`, `<HeroSection>`, `<main id="main-content">`, `<AwardsSection>`, `<KudosBlock>`, `<Footer>`, `<WidgetButton>`
   - Landmark structure: `<header>`, `<main>`, `<footer>` for WCAG 2.4.1
2. `src/app/page.tsx` — RSC entry:
   ```ts
   const cookieStore = await cookies();
   const lang = (cookieStore.get("lang")?.value ?? "vi") as LanguagePreference;  // pattern from login page
   const awards = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/awards`).then(r => r.json()).catch(() => []);
   return <HomePage awards={awards} lang={lang} />;
   ```
   - `<AwardsSection>` wrapped in `<Suspense fallback={<SkeletonCards />}>` for streaming

### Phase 9: Polish — US8 (P2)

1. Responsive breakpoints: verify 360px, 768px, 1440px (no horizontal scroll)
2. Loading states: award card skeletons
3. Error state: awards fetch failure banner
4. Accessibility: skip-nav visible on focus, tab order, ARIA live region on countdown
5. `yarn lint && yarn build` — must pass with zero errors

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Font licensing (Digital Numbers, SVN-Gotham) | Medium | High | Verify commercial license before Phase 0; fall back to system fonts with CSS variable swap |
| Award data source undefined (API vs DB vs static) | High | Medium | Implement as static seed data in Phase 4; design API contract to accept either source |
| `mix-blend-mode: screen` visual regression | Low | Low | Verify against Figma reference during implementation; requires dark `#00101A` background |
| Montserrat 400 not loaded → fallback fonts on award cards | Low | Medium | Add weight `"400"` to layout.tsx in Phase 1 before any component is rendered |
| Countdown drift > 5s over 1 hour | Low | Low | Use `Date.now()` at each tick rather than subtracting fixed 60s intervals |
| `NEXT_PUBLIC_EVENT_DATETIME` not set in env | Medium | Medium | `DEFAULT_EVENT_DATE = "2025-11-15T18:30:00+07:00"` constant fallback in `use-countdown.ts`; test both paths |
| Widget button quick-action menu content undefined | High | Low | P3 story — render pill button with correct styling; menu items left as placeholder (`// TODO(product): define menu actions`) |

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Header dropdowns ↔ LanguageSelector; Countdown ↔ useCountdown hook
- [x] **External dependencies**: Supabase auth (session read in middleware — already tested)
- [x] **API layer**: `GET /api/awards` round-trip with Zod validation
- [x] **User workflows**: Homepage load → award card click → navigate to `/awards-information#slug`

### Test Categories

| Category | Applicable | Key Scenarios |
|----------|------------|---------------|
| UI ↔ Logic | Yes | Countdown renders digits from hook; language switch updates all text |
| App ↔ External API | Yes | `/api/awards` returns correct shape; 500 shows error banner |
| App ↔ Data Layer | No (static seed data initially) | — |
| Cross-platform | Yes | Responsive layout at 360px, 768px, 1440px |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `next/image` | Mock (stub) | Avoid Next.js internals in JSDOM |
| `next/navigation` (`usePathname`) | Mock | `vi.mock('next/navigation', () => ({ usePathname: () => '/' }))` — Header tests use this to assert active link |
| `/api/awards` fetch | Mock response | Test UI error/loading states in isolation |
| Supabase auth | Not mocked in unit tests | Middleware handles auth; unit tests don't hit routes |

### Coverage Goals

| Area | Target |
|------|--------|
| Pure hooks (`use-countdown`) | 100% |
| Presentational RSC components | 80% |
| Client components (Header, Countdown, Widget) | 80% |
| Route Handlers (`/api/awards`, `/api/notifications`) | 90% |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved (reviewed 3 passes)
- [x] `design-style.md` complete
- [ ] Font files obtained (Digital Numbers, SVN-Gotham) — **BLOCKER for Phase 0**
- [ ] Figma assets downloaded (`public/images/homepage/`)
- [ ] Award category data source confirmed (static seed vs backend API)

### No New Package Dependencies

All required packages are already installed: `zod`, `vitest`, `@testing-library/react`, `@playwright/test`. No `yarn add` commands needed.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate the ordered task breakdown
2. **Unblock** font licensing before implementation starts
3. **Begin** with Phase 0 (assets) and Phase 1 (foundation) in parallel where possible

---

## Notes

- `src/app/page.tsx` is currently the Next.js boilerplate. It will be **replaced completely** — no existing logic to preserve.
- The `<Header>` component will be shared across multiple pages (Homepage, Awards, Kudos). Plan its props to be generic (active route passed as prop).
- Language selector in Homepage header must persist the `lang` cookie (same logic as Login `<LanguageSelector>`); the existing `<LanguageSelector>` component handles this already.
- The `useCountdown` hook must use `Date.now()` at each tick — not cumulative subtraction — to prevent drift beyond the 5-second tolerance in SC-002. The hook file (`use-countdown.ts`) is a regular TypeScript module but **must only be imported by `"use client"` components**; importing it from an RSC will cause a build error.
- `src/i18n/homepage.ts` translations must cover: countdown labels (DAYS/HOURS/MINUTES), "Coming soon", event time label + value, event venue label + value, CTA button text, section titles ("Hệ thống giải thưởng"), Kudos block caption/title/description, footer link labels, error/empty state messages.
- Award cards use `mix-blend-mode: screen`; the card background **must** be `#00101A` (or the parent background) for the blend to render correctly. Pure white backgrounds will break the effect.
- `layout.tsx` loads Montserrat at `weight: ["700"]` only. The plan adds `"400"` to support the award card title and description typography.
- No new Supabase tables or RLS policies are required for the Homepage (awards data initially from static seed; notifications is a stub).
