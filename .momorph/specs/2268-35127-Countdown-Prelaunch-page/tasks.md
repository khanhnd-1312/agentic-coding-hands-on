# Tasks: Countdown - Prelaunch Page

**Frame**: `2268:35127-Countdown-Prelaunch-page`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 1: Setup (Assets & CSS Tokens)

**Purpose**: Download assets and add prelaunch-specific design tokens to the project.

- [x] T001 Download background image from Figma using `get_media_files` tool, optimize as WebP | public/images/countdown/bg-prelaunch.webp
- [x] T002 [P] Add prelaunch-specific CSS custom properties (--prelaunch-bg, --prelaunch-digit-w, --prelaunch-digit-h, --prelaunch-digit-radius, --prelaunch-digit-border, --prelaunch-digit-font-size, --prelaunch-digit-gap, --prelaunch-unit-gap, --prelaunch-heading-gap) after the existing homepage section | src/app/globals.css

---

## Phase 2: Foundation (Types, Hook, i18n)

**Purpose**: Core countdown logic with server-driven time and 1s tick interval. Blocking prerequisite for all UI work.

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete. TDD is non-negotiable per constitution — tests MUST be written before implementation.

- [x] T003 [P] Create `PrelaunchCountdownProps` interface (eventStartTime: string, serverTime: string) and re-export `TimeLeft` type from use-countdown | src/types/countdown.ts
- [x] T004 [P] Create i18n dictionary for prelaunch page with vi/en translations: heading ("Sự kiện sẽ bắt đầu sau" / "Event starts in"), days/hours/minutes labels ("DAYS"/"HOURS"/"MINUTES") | src/i18n/countdown-prelaunch.ts
- [x] T005 Write failing tests for `usePrelaunchCountdown` hook: returns {days, hours, minutes, isExpired}; ticks every 1s; computes initial delta from eventStartTime - serverTime then ticks locally; sets isExpired=true when remaining ≤ 0; handles invalid date strings gracefully (returns isExpired: true); listens to `visibilitychange` to re-sync on tab focus | src/hooks/use-prelaunch-countdown.test.ts
- [x] T006 Implement `usePrelaunchCountdown` hook: import `calcTimeLeft` from `@/hooks/use-countdown`; accept eventStartTime and serverTime as props; compute clock offset on mount (offset = Date.parse(serverTime) - Date.now()); tick every 1s with calcTimeLeft(new Date(eventStartTime), Date.now() + offset); add `visibilitychange` listener for immediate recalc on tab focus; return {days, hours, minutes, isExpired} — NO redirect logic in hook | src/hooks/use-prelaunch-countdown.ts

**Checkpoint**: Foundation ready — hook passes all tests, types and i18n are in place. UI implementation can begin.

---

## Phase 3: User Story 1 — View Countdown Timer (Priority: P1) 🎯 MVP

**Goal**: Full-screen countdown page with glassmorphism digit cards matching Figma design. User sees heading "Sự kiện sẽ bắt đầu sau" and a countdown timer displaying DD:HH:MM values that update every second.

**Independent Test**: Navigate to `/countdown` and verify the countdown timer displays and updates in real-time.

### Timer UI Component (US1)

- [x] T007 Write failing tests for `PrelaunchTimer`: renders 3 time units (DAYS, HOURS, MINUTES); each unit has 2 digit cards; displays correct digit values from props; has `role="timer"` and `aria-live="polite"` with `aria-atomic="true"`; includes sr-only text "Countdown: X days, Y hours, Z minutes remaining" | src/components/countdown-prelaunch/prelaunch-timer.test.tsx
- [x] T008 Implement `PrelaunchTimer` component with sub-components: `PrelaunchDigitCard` (77x123 glassmorphism card with layered opacity — absolute bg div with opacity-50 + gradient + backdrop-blur + gold border; sibling text span with full opacity, Digital Numbers 73.73px); `PrelaunchTimeUnit` (column: digit pair + label, gap 21px); `PrelaunchTimer` (row of 3 time units, gap 60px). See design-style.md CRITICAL note on opacity layering | src/components/countdown-prelaunch/prelaunch-timer.tsx

### Page Layout Component (US1)

- [x] T009 Write failing tests for `CountdownPrelaunchPage`: renders `<main>` landmark; renders `<h1>` heading "Sự kiện sẽ bắt đầu sau" in italic Montserrat Bold; renders background `<Image>` with `alt=""` and `aria-hidden="true"`; renders gradient overlay div (18deg); renders `PrelaunchTimer` component; receives eventStartTime and serverTime as props | src/components/countdown-prelaunch/countdown-prelaunch-page.test.tsx
- [x] T010 Implement `CountdownPrelaunchPage` client component ("use client"): full-viewport container (bg-[#00101A], min-h-screen, relative, overflow-hidden); Next.js `<Image>` for background (z-0, absolute, fill, object-cover, priority); gradient overlay div (z-10, absolute, 18deg linear-gradient per design-style.md); content area (z-20, flex col center); `<h1>` italic Montserrat heading; `<PrelaunchTimer>` with values from `usePrelaunchCountdown` hook. Core a11y built-in: role="timer", aria-live="polite", sr-only label | src/components/countdown-prelaunch/countdown-prelaunch-page.tsx

### Server Component Page (US1)

- [x] T011 Implement Server Component page: `export const dynamic = "force-dynamic"`; `export const metadata` with title "Countdown | Sun Annual Awards 2025"; read `NEXT_PUBLIC_EVENT_DATETIME` env var; validate date is parseable — if missing or invalid → `redirect("/login")` + `console.warn`; if event already started → `redirect("/login")`; otherwise render `<CountdownPrelaunchPage eventStartTime={eventTime} serverTime={new Date().toISOString()} />` | src/app/countdown/page.tsx

**Checkpoint**: User Story 1 complete — countdown page renders with correct timer, glassmorphism cards, background, and heading. All tests pass.

---

## Phase 4: User Story 2 — Redirect When Countdown Reaches Zero (Priority: P1)

**Goal**: Auto-redirect to `/login` when timer expires. Two paths: server-side redirect (event already started) and client-side redirect (countdown reaches zero while viewing).

**Independent Test**: Set event start time to the past and verify redirect to `/login`. Set event start time to near-future, wait, and verify redirect when timer expires.

- [x] T012 [US2] Add redirect tests to `CountdownPrelaunchPage` test file (NOT hook tests): when hook returns isExpired=true, verify `router.push("/login")` is called; verify isExpired transitions from false to true trigger redirect | src/components/countdown-prelaunch/countdown-prelaunch-page.test.tsx
- [x] T013 [US2] Implement client-side redirect in `CountdownPrelaunchPage`: import `useRouter` from `next/navigation`; add `useEffect` watching `isExpired` from hook → call `router.push("/login")`; optional: 300ms fade-out animation before redirect. Note: server-side redirect for already-started events is already handled in T011 (page.tsx) | src/components/countdown-prelaunch/countdown-prelaunch-page.tsx

**Checkpoint**: User Story 2 complete — both server-side and client-side redirect paths work. All tests pass.

---

## Phase 5: User Story 3 — Artistic Background & Responsive (Priority: P2)

**Goal**: Pixel-perfect background with gradient overlay and responsive behavior at all constitution QA checkpoints (360px, 768px, 1440px).

**Independent Test**: Navigate to `/countdown` and verify background image + gradient render correctly. Resize viewport to 360px, 768px, and 1440px and verify layout adapts.

- [x] T014 [P] [US3] Fine-tune gradient overlay: verify 18deg angle with 3 color stops from design-style.md (#00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%); verify background image object-fit and fallback color #00101A | src/components/countdown-prelaunch/countdown-prelaunch-page.tsx
- [x] T015 [US3] Implement responsive breakpoints using desktop-first `max-*` prefixes (matching existing codebase pattern): default = full Figma sizes (desktop ≥1024px); `max-lg:` (<1024px) = digit cards 60x96, gaps 40px, digit font 56px, heading 28px; `max-md:` (<768px) = digit cards 48x77, gaps 24px, digit font 46px, heading 20px, unit label 18px, container padding 24px 16px | src/components/countdown-prelaunch/prelaunch-timer.tsx, src/components/countdown-prelaunch/countdown-prelaunch-page.tsx
- [x] T016 [P] [US3] Add `prefers-reduced-motion` media query check: disable digit flip/fade animations when user prefers reduced motion | src/components/countdown-prelaunch/prelaunch-timer.tsx

**Checkpoint**: User Story 3 complete — background is pixel-perfect, page is responsive at all QA checkpoints. Visual QA passed.

---

## Phase 6: Polish — Accessibility Audit & Edge Case Hardening

**Purpose**: Audit and harden accessibility + edge cases. Core a11y (semantic HTML, role="timer", aria-live, `<h1>`, `<main>`) was already built in Phase 3 — this phase is audit + hardening only.

- [x] T017 [P] Audit all Phase 3 accessibility: verify `role="timer"` + `aria-live="polite"` + `aria-atomic="true"` on timer container; verify sr-only text updates on minute change only (not every second); verify `<main>` landmark, `<h1>` heading, background image has `alt=""` + `aria-hidden="true"`; verify keyboard navigation has no focus traps | src/components/countdown-prelaunch/
- [x] T018 [P] Edge case: >99 days overflow — verify 3-digit days don't break digit card layout (design shows 2 digit cards). Implement truncation at 99 or conditional 3rd card based on design team decision | src/components/countdown-prelaunch/prelaunch-timer.tsx
- [x] T019 [P] Edge case: add test for `visibilitychange` re-sync — when browser tab goes to background and returns, timer recalculates immediately instead of waiting for next setInterval tick | src/hooks/use-prelaunch-countdown.test.ts
- [x] T020 Verify QA checkpoints: 360px (no horizontal scroll, all 3 time units visible), 768px (proper tablet layout), 1440px (matches Figma). Run `yarn lint && yarn build` — MUST pass per constitution | src/components/countdown-prelaunch/

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──→ Phase 2 (Foundation) ──→ Phase 3 (US1: MVP) ──→ Phase 4 (US2: Redirect)
                                                       │
                                                       └──→ Phase 5 (US3: Background & Responsive)
                                                                       │
                                                                       └──→ Phase 6 (Polish)
```

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 (CSS tokens needed for hook tests). BLOCKS all UI work
- **Phase 3 (US1)**: Depends on Phase 2. This is the **MVP** — stop and validate here
- **Phase 4 (US2)**: Depends on Phase 3 (adds redirect to existing page component)
- **Phase 5 (US3)**: Can start after Phase 3 (independent of Phase 4)
- **Phase 6 (Polish)**: Depends on Phases 4 + 5 complete

### Within Each Phase (TDD Cycle)

1. Tests MUST be written and FAIL before implementation (Red)
2. Implement minimum code to pass (Green)
3. Refactor without breaking tests (Refactor)

### Parallel Opportunities

**Phase 1**: T001 and T002 can run in parallel (different files)
**Phase 2**: T003 and T004 can run in parallel (types + i18n are independent). T005 → T006 must be sequential (TDD)
**Phase 3**: T007 → T008 sequential (TDD), T009 → T010 sequential (TDD), but T007/T008 can run in parallel with T009/T010 (different components). T011 depends on T010.
**Phase 5**: T014 and T016 can run in parallel (different concerns)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2
2. Complete Phase 3 (US1 only)
3. **STOP AND VALIDATE**: Timer renders, ticks every second, glassmorphism cards display correctly
4. Continue to Phase 4 (redirect) → Phase 5 (responsive) → Phase 6 (polish)

### Incremental Delivery

1. Setup + Foundation → validates hook logic independently
2. Add US1 (countdown UI) → **first visual milestone**
3. Add US2 (redirect) → **feature-complete for core flow**
4. Add US3 (responsive + polish) → **production-ready**

---

## Notes

- **TDD is non-negotiable** per constitution (Section III). Every test task (T005, T007, T009, T012) MUST produce failing tests before the corresponding implementation task.
- The `calcTimeLeft` pure function from `src/hooks/use-countdown.ts` is the ONLY reused code. Everything else is new.
- The "Digital Numbers" font uses `monospace` fallback until the font file is available. No component changes needed when the font file is added — CSS variable approach handles it.
- Glassmorphism `opacity: 0.5` applies ONLY to the background rectangle — use the layered approach (absolute bg div + sibling text span). See design-style.md CRITICAL note.
- Desktop-first `max-*` responsive prefixes match the existing codebase pattern (known deviation from constitution's mobile-first mandate).
- `export const dynamic = "force-dynamic"` on page.tsx is REQUIRED to prevent stale serverTime from static generation.
