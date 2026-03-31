# Implementation Plan: Countdown - Prelaunch Page

**Frame**: `2268:35127-Countdown-Prelaunch-page`
**Date**: 2026-03-12
**Spec**: `specs/2268-35127-Countdown-Prelaunch-page/spec.md`

---

## Summary

Build a standalone full-screen countdown page at `/countdown` that displays a real-time countdown timer (Days, Hours, Minutes) with glassmorphism digit cards over a dark artistic background. When the countdown reaches zero or the event has already started, the user is automatically redirected to `/login`.

**Key technical insight**: The existing `useCountdown` hook and `Countdown` component (homepage) provide a strong foundation. However, the prelaunch page has a **different visual design** (larger 77x123 digit cards, italic heading, 18deg gradient, full-viewport layout) and **different behavior** (server-driven target time via API, redirect on expiry). We will create new components specific to this page while reusing the core `calcTimeLeft` utility.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, next/font, next/image
**Database**: N/A (event time from API/env var)
**Testing**: Vitest + React Testing Library
**State Management**: Local component state (`useState` + `useEffect`)
**API Style**: N/A (server props via Server Component — no API route)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Next.js RSC + `"use client"` for timer, TailwindCSS)
- [x] Adheres to folder structure guidelines (`src/app/countdown/`, `src/components/countdown-prelaunch/`)
- [x] Meets security requirements (server-side date validation, no secrets exposed)
- [x] Follows testing standards (TDD, co-located `.test.ts` / `.test.tsx` files)

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — all countdown-prelaunch components in `src/components/countdown-prelaunch/`
- **Server/Client split**:
  - `src/app/countdown/page.tsx` — **Server Component** (fetches event time, renders metadata, handles server-side redirect if event already started)
  - `src/components/countdown-prelaunch/countdown-prelaunch-page.tsx` — **Client Component** (`"use client"`) for timer interval and client-side redirect
- **Styling Strategy**: Tailwind utility classes with existing CSS custom properties from `globals.css`
- **Data Fetching**: Server Component calls `calcTimeLeft` on initial render. Client receives `eventStartTime` as a prop and runs `setInterval` locally.

### Reuse Strategy

| Existing Asset | Reuse? | Rationale |
|---------------|--------|-----------|
| `calcTimeLeft()` from `use-countdown.ts` | **Yes — import directly** | Pure function, already tested, computes days/hours/minutes |
| `useCountdown()` hook | **No — create new hook** | Existing hook ticks every 60s (spec requires every 1s), uses hardcoded `EVENT_DATETIME` constant (spec requires server-driven time), lacks `isLoading`/`hasError` states, no redirect logic |
| `DigitBox` / `CountdownTile` components | **No — create new** | Prelaunch design has different dimensions (77x123 vs 51x82), different gaps (21px vs 14px), different font size (73.73px vs 49px), different border-radius (12px vs 8px) |
| `HeroSection` background pattern | **Reference only** | Same z-index layering pattern (Image z-0, gradient z-1, content z-2) but different gradient angle (18deg vs 12deg) |
| CSS variables in `globals.css` | **Extend** | Add prelaunch-specific tokens alongside existing ones |
| Montserrat font | **Yes** | Already loaded in `layout.tsx` with weight 400, 700 and Vietnamese subset |
| `--font-digital-numbers` | **Yes (fallback)** | Currently `monospace` fallback. Will use as-is until font file available |

### Data Flow (Server → Client)

The **Server Component** (`page.tsx`) provides initial data — no API call needed for the initial render:
1. Server Component imports `EVENT_DATETIME` constant from `@/hooks/use-countdown`
2. Computes `serverTime = new Date().toISOString()` at request time
3. Passes both as props to the Client Component
4. Client Component uses the server-provided delta for countdown ticking

> **Why no API route?** The Server Component already runs at request time and can provide fresh `serverTime`. An API route would add an unnecessary client-side fetch hop. The event datetime is a shared constant, read server-side to maintain a single source of truth.

> **Important**: `page.tsx` MUST use `export const dynamic = "force-dynamic"` to prevent static generation (otherwise `serverTime` would be stale from build time).

### Integration Points

- **Constant**: `EVENT_DATETIME` from `src/hooks/use-countdown.ts` (shared with homepage countdown)
- **Redirect target**: `/login` route (already exists)
- **i18n**: Create `src/i18n/countdown-prelaunch.ts` (separate file — avoids bloating homepage dictionary with unrelated page content)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2268-35127-Countdown-Prelaunch-page/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma screenshot ✅
```

### Source Code (affected areas)

```text
# New Files
src/
├── app/
│   └── countdown/
│       └── page.tsx                          # Server Component — page entry (force-dynamic)
├── components/
│   └── countdown-prelaunch/
│       ├── countdown-prelaunch-page.tsx       # Client Component — main page layout + redirect
│       ├── countdown-prelaunch-page.test.tsx  # Tests for page layout
│       ├── prelaunch-timer.tsx                # Client Component — timer digit cards UI
│       └── prelaunch-timer.test.tsx           # Tests for timer
├── hooks/
│   ├── use-prelaunch-countdown.ts            # Hook: 1s interval, server-driven time
│   └── use-prelaunch-countdown.test.ts       # Tests for hook
├── i18n/
│   └── countdown-prelaunch.ts                # i18n dictionary (vi/en) for prelaunch page
├── types/
│   └── countdown.ts                          # CountdownProps interface, TimeLeft type re-export

# Modified Files
src/
├── app/
│   └── globals.css                           # Add prelaunch-specific CSS tokens (after homepage section)

# New Assets
public/
└── images/
    └── countdown/
        └── bg-prelaunch.webp                 # Background image (from Figma)
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| — | — | No new dependencies needed |

---

## Implementation Strategy

### Phase 0: Asset Preparation

1. Download the background image from Figma using `get_media_files` tool
2. Optimize as WebP, save to `public/images/countdown/bg-prelaunch.webp`
3. Add prelaunch-specific CSS custom properties to `globals.css`:

```css
/* ─── Countdown Prelaunch design tokens ─────────────────────── */
--prelaunch-bg: #00101A;
--prelaunch-digit-w: 77px;
--prelaunch-digit-h: 123px;
--prelaunch-digit-radius: 12px;
--prelaunch-digit-border: 0.75px solid #FFEA9E;
--prelaunch-digit-font-size: 73.73px;
--prelaunch-digit-gap: 21px;
--prelaunch-unit-gap: 60px;
--prelaunch-heading-gap: 24px;
```

### Phase 1: Foundation — Types, Hook, i18n (TDD)

**Goal**: Core countdown logic with server-driven time and 1s tick interval.

1. **Create types** in `src/types/countdown.ts`:
   ```typescript
   export interface PrelaunchCountdownProps {
     eventStartTime: string;  // ISO 8601
     serverTime: string;      // ISO 8601
   }
   // Re-export TimeLeft from use-countdown for convenience
   ```

2. **Create i18n** in `src/i18n/countdown-prelaunch.ts`:
   ```typescript
   export const countdownPrelaunchDictionary = {
     vi: { heading: "Sự kiện sẽ bắt đầu sau", days: "DAYS", hours: "HOURS", minutes: "MINUTES" },
     en: { heading: "Event starts in", days: "DAYS", hours: "HOURS", minutes: "MINUTES" },
   };
   ```

3. **Write tests** for `use-prelaunch-countdown.ts`:
   - Returns `{ days, hours, minutes, isExpired }` (no loading/error — data comes from server props, not fetch)
   - Ticks every 1 second (not 60s like existing hook)
   - Computes initial delta from `eventStartTime - serverTime`, then ticks locally
   - Sets `isExpired = true` when remaining ≤ 0
   - Handles invalid date strings gracefully (returns `isExpired: true`)

4. **Implement** `use-prelaunch-countdown.ts`:
   - Import `calcTimeLeft` from `@/hooks/use-countdown` (reuse pure function)
   - Accept `eventStartTime: string` and `serverTime: string` as props
   - Compute clock offset on mount: `offset = Date.parse(serverTime) - Date.now()`
   - Tick every 1s: `calcTimeLeft(new Date(eventStartTime), Date.now() + offset)`
   - Return `{ days, hours, minutes, isExpired }` — NO redirect logic in hook (hook is pure state, redirect is a side effect handled by the page component)

### Phase 2: Core UI — Prelaunch Page (US1: View Countdown Timer)

**Goal**: Full-screen countdown page matching Figma design.

1. **Write tests** for `prelaunch-timer.tsx`:
   - Renders 3 time units (DAYS, HOURS, MINUTES)
   - Each unit has 2 digit cards with glassmorphism styling
   - Displays correct digit values from hook
   - Has `role="timer"` and `aria-live="polite"`
   - Shows loading placeholder when `isLoading`

2. **Implement** `prelaunch-timer.tsx`:
   - `PrelaunchDigitCard` — 77x123 glassmorphism card with layered opacity approach:
     - Background div (absolute, opacity-50, gradient, backdrop-blur, gold border)
     - Text span (relative, z-10, Digital Numbers font, full opacity)
   - `PrelaunchTimeUnit` — column: digit pair + label
   - `PrelaunchTimer` — row of 3 time units with 60px gap

3. **Write tests** for `countdown-prelaunch-page.tsx`:
   - Renders heading "Sự kiện sẽ bắt đầu sau" in italic
   - Renders background image and gradient overlay
   - Renders timer component
   - Uses `<main>` landmark and `<h1>` for heading

4. **Implement** `countdown-prelaunch-page.tsx`:
   - Full-viewport container with `bg-[#00101A]`, `<main>` landmark
   - Next.js `<Image>` for background (z-0, `alt=""`, `aria-hidden="true"`)
   - Gradient overlay div (z-10, 18deg gradient)
   - Content area (z-20, centered flex column)
   - `<h1>` italic Montserrat heading: "Sự kiện sẽ bắt đầu sau"
   - `<PrelaunchTimer>` component
   - Accessibility built-in from the start: `role="timer"`, `aria-live="polite"`, `sr-only` label

5. **Implement** `src/app/countdown/page.tsx`:
   ```typescript
   export const dynamic = "force-dynamic"; // prevent static generation
   export const metadata: Metadata = { title: "Countdown | Sun Annual Awards 2025" };
   ```
   - Import `EVENT_DATETIME` constant from `@/hooks/use-countdown`
   - If event already started → `redirect("/login")`
   - Otherwise render `<CountdownPrelaunchPage eventStartTime={EVENT_DATETIME} serverTime={new Date().toISOString()} />`

### Phase 3: Redirect Logic (US2: Redirect When Countdown Reaches Zero)

**Goal**: Auto-redirect to `/login` when timer expires. Two redirect paths:

**Path A — Server-side (already started):** In `page.tsx`, before rendering:
```typescript
import { EVENT_DATETIME } from "@/hooks/use-countdown";
const eventDate = new Date(EVENT_DATETIME);
if (eventDate.getTime() <= Date.now()) {
  redirect("/login");
}
```

**Path B — Client-side (countdown reaches zero while viewing):**

1. **Add redirect tests** to `countdown-prelaunch-page.test.tsx` (NOT hook tests):
   - When hook returns `isExpired: true`, verify `router.push("/login")` is called
   - Verify hook's `isExpired` starts `false` and transitions to `true`

2. **Implement redirect** in `countdown-prelaunch-page.tsx`:
   - Use `useRouter()` from `next/navigation`
   - `useEffect` watching `isExpired` → `router.push("/login")`
   - Optional: fade-out animation (300ms) before redirect

> **Separation of concerns**: The hook only exposes `isExpired: boolean`. The page component decides what to do with it (redirect). This keeps the hook testable without mocking `next/navigation`.

### Phase 4: Visual Polish & Responsive (US3: Artistic Background)

**Goal**: Pixel-perfect background with gradient overlay and responsive behavior.

1. Fine-tune gradient overlay angle and color stops (18deg, 3 color stops from design-style.md)
2. Implement responsive breakpoints using **desktop-first `max-*` prefixes** (matching existing codebase pattern in `hero-section.tsx`):
   - Default: full Figma sizes (desktop ≥ 1024px)
   - `max-md:` (< 768px): smaller digit cards (48x77), reduced gaps (24px), smaller font (46px), heading 20px
   - `max-lg:` (< 1024px): medium cards (60x96), medium gaps (40px), medium font (56px), heading 28px

   > **Constitution note**: Constitution mandates mobile-first (`sm:` / `md:` / `lg:`), but the entire existing codebase uses desktop-first `max-*` prefixes. For consistency within the project, this plan follows the existing pattern. A separate refactoring ticket should address the mobile-first migration globally.

3. Add `prefers-reduced-motion` check for digit transition animations
4. Verify at constitution QA checkpoints: 360px, 768px, 1440px

### Phase 5: Accessibility Audit & Edge Case Hardening

> **Note**: Core accessibility (semantic HTML, `role="timer"`, `aria-live`, `<h1>`, `<main>`, `alt=""`) MUST be implemented during Phase 2 — not deferred. This phase is for **audit and hardening** only.

1. **Audit**: Verify all Phase 2 accessibility is working:
   - `role="timer"` + `aria-live="polite"` + `aria-atomic="true"` on timer container
   - `sr-only` text "Countdown: X days, Y hours, Z minutes remaining" (updates on minute change only, not every second)
   - `<main>` landmark, `<h1>` for heading, `<time>` for countdown values
   - Background image: `alt=""` + `aria-hidden="true"`
2. **Keyboard navigation**: Ensure page is navigable with Tab (nothing interactive beyond browser chrome, but verify no focus traps)
3. **Edge case hardening**:
   - Invalid `EVENT_DATETIME` format: Server Component catches `Invalid Date` and redirects to `/login`
   - Extremely large countdown (>99 days): Verify 3-digit days don't overflow digit card layout (design shows 2 digit cards — need to truncate at 99 or add a third card)
   - Browser tab goes to sleep: When tab becomes visible again (`visibilitychange` event), recalculate immediately instead of waiting for next `setInterval` tick

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| "Digital Numbers" font not available | High | Medium | CSS fallback `monospace` already in place. Visual fidelity degrades gracefully. TODO in `layout.tsx` tracks resolution. |
| Background image too large (slow load) | Medium | Medium | Optimize to WebP, use `priority` on `<Image>`, ensure `#00101A` fallback renders immediately |
| Timer drift over long sessions | Low | Low | 1s `setInterval` drift is negligible for minute-level display. `visibilitychange` listener re-syncs when tab returns to foreground. |
| `EVENT_DATETIME` constant has past date in prod | Medium | High | Server Component redirects to `/login` immediately when event date has passed. |
| Page statically generated (stale serverTime) | Medium | High | `export const dynamic = "force-dynamic"` on page.tsx ensures fresh render on every request. |
| Countdown > 99 days (3-digit overflow) | Low | Medium | Design has 2 digit cards. Cap display at 99 days, or add conditional 3rd card. Clarify with design team. |

### Estimated Complexity

- **Frontend**: Medium (custom glassmorphism cards, responsive scaling, timer logic)
- **Backend**: N/A (no API route — server props only)
- **Testing**: Medium (timer mocking, redirect verification, loading states)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Timer hook → Timer UI → Page layout → Redirect
- [ ] **External dependencies**: N/A (no API route — data from server props)
- [ ] **Data layer**: N/A (no database)
- [x] **User workflows**: Land on page → see countdown → (wait) → redirect to login

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Timer hook drives digit display, expiry triggers redirect |
| App ↔ External API | No | Data passed as server props — no client-side fetch |
| Cross-platform | Yes | Responsive at 360px / 768px / 1440px |

### Test Environment

- **Environment type**: Local (Vitest jsdom for unit/integration, Playwright for E2E)
- **Test data strategy**: Fake timers (`vi.useFakeTimers`), direct prop injection
- **Isolation approach**: Fresh state per test, mock `next/navigation` router

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `next/navigation` (`useRouter`) | Mock | Verify `router.push("/login")` calls without real navigation |
| `Date.now()` / timers | Fake timers | Control time progression for countdown testing |
| Server props | Direct prop injection | Pass `eventStartTime` and `serverTime` as props in tests |
| `next/image` | Pass-through | No need to mock, renders as `<img>` in jsdom |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Page renders heading, background, and 3 time units with correct values
   - [x] Timer updates digit display every second
   - [x] Page redirects to `/login` when countdown reaches zero
   - [x] Server-side redirect when event already started

2. **Error Handling**
   - [x] Server-side redirect when event time not configured (env var missing)
   - [x] Server-side redirect when event time is invalid (unparseable date)

3. **Edge Cases**
   - [x] Countdown rolls over correctly (59 min → 00 min, hour decrements)
   - [x] Background renders fallback color when image fails
   - [x] Responsive layout at 360px doesn't overflow horizontally

### Tooling & Framework

- **Test framework**: Vitest + React Testing Library
- **Supporting tools**: `vi.useFakeTimers()`, `vi.mock()`
- **CI integration**: `yarn test` in pre-commit hook and CI pipeline

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Timer hook (`use-prelaunch-countdown`) | 95%+ | High |
| Timer UI (`prelaunch-timer`) | 90%+ | High |
| Page layout + redirect (`countdown-prelaunch-page`) | 85%+ | Medium |
| Responsive/A11y | Manual QA | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (reviewed twice)
- [x] `design-style.md` approved (reviewed twice)
- [ ] Background image downloaded from Figma
- [ ] Digital Numbers font file (optional — fallback in place)

### External Dependencies

- `EVENT_DATETIME` constant in `src/hooks/use-countdown.ts` must be set to the correct event date
- Background image asset from Figma design

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following TDD: Red → Green → Refactor

---

## Notes

- The existing homepage `Countdown` component and `useCountdown` hook serve a **different context** (embedded in hero section, smaller design, 60s tick). The prelaunch page is a standalone full-viewport experience with a distinct visual language. Creating separate components avoids coupling and allows each to evolve independently.
- The `calcTimeLeft` pure function is the only shared code — it's well-tested and stable.
- The "Digital Numbers" font is currently a `monospace` fallback. When the font file becomes available, it only needs to be added to `public/fonts/` and registered in `layout.tsx` — no component changes needed thanks to the CSS variable approach.
- The glassmorphism digit cards require careful implementation: the `opacity: 0.5` from Figma applies ONLY to the background rectangle, not the digit text. Use the layered approach documented in `design-style.md`.
- **No API route needed** — Server Component provides `eventStartTime` and `serverTime` as props at request time. This is simpler, faster (no client-side fetch), and testable (props are easy to mock). The `export const dynamic = "force-dynamic"` ensures fresh server time on every request.
- The hook should listen to `document.visibilitychange` event to immediately recalculate when the browser tab returns to foreground (browsers throttle `setInterval` in background tabs).
- **Responsive approach**: Uses desktop-first `max-*` prefixes for consistency with existing codebase, despite constitution mandating mobile-first. This is a known project-wide deviation to be addressed separately.
