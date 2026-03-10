# Tasks: Homepage SAA

**Frame**: `2167-9026-Homepage-SAA`
**Prerequisites**: plan.md ✅ | spec.md ✅ | design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story (US1–US8 from spec.md)
- **|**: Primary file path affected by this task

---

## Phase 1: Setup (Assets & Global Config)

**Purpose**: Download all Figma assets and configure shared infrastructure (fonts, globals). Must complete before any component work.

- [x] T001 Download Homepage keyvisual image from Figma (node `2167:9026`) | public/images/homepage/keyvisual.png
- [x] T002 [P] Download Root Further logo image from Figma (node `2167:9031`) | public/images/homepage/root-further-logo.png
- [x] T003 [P] Download 6 award card images from Figma C2 grid nodes (Top Talent, Top Project, Top Project Leader, Best Manager, Signature Creator, MVP) | public/images/homepage/award-{slug}.png
- [x] T004 [P] Download Sun* Kudos block background image from Figma (node `3390:10349`) | public/images/homepage/kudos-bg.png
- [x] T005 Obtain self-hosted font files (Digital Numbers + SVN-Gotham) and place under public/fonts/ — verify licensing before committing | public/fonts/digital-numbers.woff2, public/fonts/svn-gotham.woff2
- [x] T006 [P] Update layout.tsx: add `"400"` to Montserrat weight array + add `localFont` declarations for `Digital Numbers` (variable `--font-digital-numbers`) and `SVN-Gotham` (variable `--font-svn-gotham`) using `next/font/local`, and add both CSS variables to `<body>` className | src/app/layout.tsx
- [x] T007 [P] Update globals.css: add Homepage design tokens (`--color-primary: #FFEA9E`, `--color-focus-ring: #15D5CA` rename, `--color-badge: #D4271D`, `--color-kudos-bg: #0F0F0F`, `--color-btn-secondary-bg`, `--color-countdown-digit`, all spacing/shadow tokens from design-style.md) | src/app/globals.css

**Checkpoint**: All assets present in public/; font CSS variables available; design tokens in globals.css

---

## Phase 2: Foundation (Types, i18n, Icons)

**Purpose**: Shared building blocks required by ALL user story components. No user story work begins until this phase is complete.

⚠️ **CRITICAL**: These files are imported by every component — finish before any Phase 3+ work.

- [x] T008 [P] Create src/types/homepage.ts: define `AWARD_SLUGS` tuple constant, `AwardSlug` type, `AwardCategorySchema` Zod object, `AwardCategory` type, `NotificationCountSchema`, `NotificationCount` type | src/types/homepage.ts
- [x] T009 [P] Create src/i18n/homepage.ts: VI/EN dictionaries covering countdown labels (DAYS/HOURS/MINUTES/"Coming soon"), event time/venue labels+values, Facebook group note, CTA button text, section titles, Kudos block copy (caption/title/description), footer link labels, error banner text, empty state text | src/i18n/homepage.ts
- [x] T010 [P] Add new icons to icon.tsx: `notification-bell` (24×24px SVG), `user-avatar` (24×24px SVG), `arrow-up` (24×24px SVG), `pen` (24×24px SVG) | src/components/ui/icon.tsx
- [x] T011 [P] Add unit tests for new icons (notification-bell, user-avatar, arrow-up, pen render without errors) | src/components/ui/icon.test.tsx

**Checkpoint**: Types compiled, i18n dictionaries complete, all icons render — user story phases can now proceed

---

## Phase 3: US2 — Real-time Countdown (Priority: P1) 🎯

**Goal**: Countdown timer renders days/hours/minutes with zero-padding, updates every minute, freezes at "00" when event date passes, hides "Coming soon" label after event start.

**Independent Test**: `yarn test src/hooks/use-countdown.test.ts src/components/homepage/countdown.test.tsx` — all pass

- [x] T012 [US2] Write failing tests for useCountdown hook: `calcTimeLeft` returns correct `{days,hours,minutes}` with zero-padding; `isEventStarted` true when `now >= targetDate`; auto-update via `vi.useFakeTimers()`; env var missing → uses `DEFAULT_EVENT_DATE` fallback | src/hooks/use-countdown.test.ts
- [x] T013 [US2] Implement src/hooks/use-countdown.ts: `DEFAULT_EVENT_DATE = "2025-11-15T18:30:00+07:00"`; accepts `targetDate: Date`; uses `Date.now()` at each tick (no cumulative drift); clears interval on unmount | src/hooks/use-countdown.ts
- [x] T014 [US2] Write failing tests for Countdown component: renders 3 tiles (DAYS/HOURS/MINUTES) with correct digit values; "Coming soon" visible when `isEventStarted=false`, hidden when `true`; root element has `aria-live="polite"` and `aria-label` | src/components/homepage/countdown.test.tsx
- [x] T015 [US2] Implement src/components/homepage/countdown.tsx (`"use client"`): reads `process.env.NEXT_PUBLIC_EVENT_DATETIME ?? DEFAULT_EVENT_DATE`; renders `<CountdownTile>` ×3; digit boxes use `Digital Numbers` font 49px; `aria-live="polite"` on root | src/components/homepage/countdown.tsx

**Checkpoint**: Countdown runs independently — `yarn test` passes, component renders correctly at localhost

---

## Phase 4: US1 + US4 — Homepage View, Event Info & CTA Navigation (Priority: P1 / P2)

**Goal**: Hero section renders full-bleed keyvisual, Root Further logo, countdown, event info, CTA buttons, and ROOT FURTHER description. CTA buttons navigate to correct routes.

**Independent Test**: `yarn test src/components/homepage/event-info.test.tsx src/components/homepage/cta-buttons.test.tsx src/components/homepage/content-block.test.tsx src/components/homepage/hero-section.test.tsx`

- [x] T016 [P] [US1] Write failing tests for EventInfo: labels "Thời gian:" / "Địa điểm:" render; values in `#FFEA9E` color; Facebook group note is `<p>` not `<a>`; VI/EN text switches via `lang` prop | src/components/homepage/event-info.test.tsx
- [x] T017 [P] [US1] Implement src/components/homepage/event-info.tsx (RSC): static time "18h30", venue "Nhà hát nghệ thuật quân đội"; Facebook group `<p>` text from i18n; label 16px/700 Montserrat, value 24px/700 `#FFEA9E` | src/components/homepage/event-info.tsx
- [x] T018 [P] [US4] Write failing tests for CTAButtons: "ABOUT AWARDS" has `href="/awards-information"`; "ABOUT KUDOS" has `href="/kudo/live"`; both are Next.js `<Link>` components; aria-labels present | src/components/homepage/cta-buttons.test.tsx
- [x] T019 [P] [US4] Implement src/components/homepage/cta-buttons.tsx (RSC): primary button 276×60px `bg-[#FFEA9E]`; secondary button 254×60px `border border-[#998C5F] bg-[rgba(255,234,158,0.10)]`; hover/active/focus transitions per design-style.md | src/components/homepage/cta-buttons.tsx
- [x] T020 [P] [US1] Write failing tests for ContentBlock: renders VI text by default; renders EN text when `lang="en"`; text sourced from `src/i18n/homepage.ts` | src/components/homepage/content-block.test.tsx
- [x] T021 [P] [US1] Implement src/components/homepage/content-block.tsx (RSC): B4 ROOT FURTHER body text; 24px/700 Montserrat; `text-justify`; text from `i18n/homepage.ts` dictionary based on `lang` prop | src/components/homepage/content-block.tsx
- [x] T022 [US1] Write failing tests for HeroSection: keyvisual `<Image>` renders; gradient cover `<div>` present; Root Further logo renders with `priority`; child components (Countdown, EventInfo, CTAButtons, ContentBlock) are present | src/components/homepage/hero-section.test.tsx
- [x] T023 [US1] Implement src/components/homepage/hero-section.tsx (RSC): `<Image fill>` keyvisual `z-0`; gradient `<div>` `linear-gradient(12deg, #00101A, transparent)` `z-1`; Root Further logo 451×200px `priority`; Bìa column layout `padding 96px 144px gap-[120px]`; assembles `<Countdown>`, `<EventInfo>`, `<CTAButtons>`, `<ContentBlock>` | src/components/homepage/hero-section.tsx

**Checkpoint**: Hero section renders — visible at localhost with correct layout, countdown running, event info showing

---

## Phase 5: US3 — Award Categories (Priority: P1) 🎯

**Goal**: 6 award cards render in a 3-column grid. Each card navigates to `/awards-information#[slug]`. GET /api/awards returns validated award data. Empty state and error state handled.

**Independent Test**: `yarn test src/components/homepage/award-card.test.tsx src/components/homepage/awards-section.test.tsx src/app/api/awards/route.test.ts`

- [x] T024 [US3] Write failing tests for AwardCard: title renders in `#FFEA9E`; description has `line-clamp-2` class; "Chi tiết" `<Link>` href is `/awards-information#[slug]`; image has `mix-blend-screen` class | src/components/homepage/award-card.test.tsx
- [x] T025 [US3] Implement src/components/homepage/award-card.tsx (RSC): 336×504px flex-col; image 336×336px `border-[0.955px] border-[#FFEA9E] rounded-3xl mix-blend-screen`; title 24px/400 `#FFEA9E`; description 16px/400 white `line-clamp-2`; "Chi tiết" button with hover/focus states per design-style.md | src/components/homepage/award-card.tsx
- [x] T026 [P] [US3] Implement src/components/homepage/skeleton-cards.tsx (RSC): 6 placeholder cards 336×504px with Tailwind `animate-pulse bg-[#2E3940] rounded-3xl` | src/components/homepage/skeleton-cards.tsx
- [x] T027 [P] [US3] Write failing tests for GET /api/awards route: returns 200 with array matching `AwardCategorySchema.array()`; each item has correct fields; returns empty array when no data | src/app/api/awards/route.test.ts
- [x] T028 [P] [US3] Implement src/app/api/awards/route.ts: static seed array of 6 AwardCategory objects (slugs: top-talent, top-project, top-project-leader, best-manager, signature-creator, mvp); Zod-validates response before returning; `NextResponse.json()` | src/app/api/awards/route.ts
- [x] T029 [US3] Write failing tests for AwardsSection: renders 6 `<AwardCard>` components; shows "Dữ liệu đang được cập nhật" when awards is empty array; shows error banner "Không thể tải dữ liệu giải thưởng. Thử lại" on error; section header "Hệ thống giải thưởng" 57px `#FFEA9E` renders | src/components/homepage/awards-section.test.tsx
- [x] T030 [US3] Implement src/components/homepage/awards-section.tsx (RSC): C1 section header (caption + divider + title 57px `#FFEA9E`); C2 grid `flex-wrap gap-[80px]` 3-col desktop; `<Suspense fallback={<SkeletonCards />}>`; error boundary → error banner with retry button | src/components/homepage/awards-section.tsx

**Checkpoint**: Awards section independently functional — `GET /api/awards` returns data; grid renders 6 cards; all navigation hrefs correct

---

## Phase 6: US5 + US7 — Sun* Kudos Block & Widget Button (Priority: P2 / P3)

**Goal**: Kudos promo block renders with "Chi tiết" CTA navigating to `/kudo/live`. Widget button fixed in bottom-right.

**Independent Test**: `yarn test src/components/homepage/kudos-block.test.tsx src/components/homepage/widget-button.test.tsx`

- [x] T031 [P] [US5] Write failing tests for KudosBlock: caption "Phong trào ghi nhận" renders; title "Sun* Kudos" in `#FFEA9E` renders; "Chi tiết" CTA `<Link>` href is `/kudo/live`; background is `#0F0F0F` | src/components/homepage/kudos-block.test.tsx
- [x] T032 [P] [US5] Implement src/components/homepage/kudos-block.tsx (RSC): 1120×500px `bg-[#0F0F0F] rounded-2xl`; left content 457px flex-col gap-32px; KUDOS wordmark + decorative bg-image; "Chi tiết" 127×56px `bg-[#FFEA9E] rounded-sm` with hover/focus states | src/components/homepage/kudos-block.tsx
- [x] T033 [P] [US7] Write failing tests for WidgetButton: renders with `position: fixed`; has `aria-label="Hành động nhanh"`; 106×64px `bg-[#FFEA9E] rounded-full`; pen icon and SAA logo icon present | src/components/homepage/widget-button.test.tsx
- [x] T034 [P] [US7] Implement src/components/homepage/widget-button.tsx (`"use client"`): `fixed right-[19px] bottom-[130px] z-50`; 106×64px `bg-[#FFEA9E] rounded-full`; contains `<Icon name="pen">` + `<Icon name="saa-logo">`; `// TODO(product): define quick-action menu items` comment | src/components/homepage/widget-button.tsx

**Checkpoint**: Kudos block and widget button render correctly on page

---

## Phase 7: US6 — Header Navigation (Priority: P1)

**Goal**: Fixed header with active nav link detection, language selector, notification badge, and avatar dropdown. Active "About SAA 2025" link when on `/`.

**Independent Test**: `yarn test src/components/homepage/header.test.tsx src/app/api/notifications/route.test.ts`

- [x] T035 [US6] Write failing tests for Header: "About SAA 2025" link has `href="/"` + active styles when `pathname="/"` via mocked `usePathname`; hover state on non-active links; notification badge hidden when count is 0, visible when > 0; language selector renders `<LanguageSelector>`; avatar button has `aria-label="Tài khoản"` | src/components/homepage/header.test.tsx
- [x] T036 [US6] Implement src/components/homepage/header.tsx (`"use client"`): `fixed top-0 z-40 w-full h-20`; `usePathname()` from `next/navigation` for active link; `useEffect` fetches `/api/notifications` on mount → `setNotificationCount`; reuses `<LanguageSelector>`; notification dot `8×8px bg-[#D4271D]`; avatar `40×40px border-[#998C5F]`; props: `initialLang: LanguagePreference` | src/components/homepage/header.tsx
- [x] T037 [P] [US6] Write failing tests for GET /api/notifications: returns 200 with `{ count: 0 }` matching schema | src/app/api/notifications/route.test.ts
- [x] T038 [P] [US6] Implement src/app/api/notifications/route.ts: stub returning `NextResponse.json({ count: 0 })`; Zod-validated `NotificationCountSchema` | src/app/api/notifications/route.ts

**Checkpoint**: Header fully functional — active link highlights at `/`, language switching persists cookie, notification badge responds to API

---

## Phase 8: US1 — Footer (Priority: P1)

**Goal**: Footer renders copyright text in Montserrat Alternates, 4 nav links (incl. "Tiêu chuẩn chung"), and "About SAA 2025" → `/`.

**Independent Test**: `yarn test src/components/homepage/footer.test.tsx`

- [x] T039 [US1] Write failing tests for Footer: copyright text "Bản quyền thuộc về Sun* © 2025" uses `font-[var(--font-montserrat-alt)]`; 4 nav links render ("About SAA 2025", "Awards Information", "Sun* Kudos", "Tiêu chuẩn chung"); "About SAA 2025" `<Link>` has `href="/"` | src/components/homepage/footer.test.tsx
- [x] T040 [US1] Implement src/components/homepage/footer.tsx (RSC): `border-t border-[#2E3940] py-10 px-[90px]`; logo 69×64px; 4 nav `<Link>` components with gap-48px; copyright `<span>` `font-[var(--font-montserrat-alt)] text-base font-bold` | src/components/homepage/footer.tsx

**Checkpoint**: Footer renders with correct copyright font and navigation links

---

## Phase 9: Page Assembly

**Goal**: Assemble all components into the full Homepage page. Replace boilerplate `src/app/page.tsx` with the RSC entry point.

**Independent Test**: `yarn test src/components/homepage/homepage.test.tsx && yarn build` succeeds

- [x] T041 Write failing tests for HomePage layout: skip nav `<a href="#main-content">` is first focusable element; `<header>`, `<main id="main-content">`, `<footer>` landmarks present; `<Header>`, `<HeroSection>`, `<AwardsSection>`, `<KudosBlock>`, `<Footer>`, `<WidgetButton>` all render | src/components/homepage/homepage.test.tsx
- [x] T042 Implement src/components/homepage/homepage.tsx (RSC): skip nav link (visually hidden, visible on focus via `sr-only focus:not-sr-only`); assembles all section components; `<main id="main-content">` wraps AwardsSection + KudosBlock; `<AwardsSection>` in `<Suspense fallback={<SkeletonCards />}>`; passes `lang` and `awards` props down | src/components/homepage/homepage.tsx
- [x] T043 Replace src/app/page.tsx with RSC entry: `await cookies()` → `lang` cookie (pattern: `(store.get("lang")?.value ?? "vi") as LanguagePreference`); `fetch(${NEXT_PUBLIC_SITE_URL}/api/awards)` → `awards` (catch → `[]`); return `<HomePage awards={awards} lang={lang} />` | src/app/page.tsx

**Checkpoint**: Full homepage visible at `localhost:3000/` when authenticated — all sections render end-to-end

---

## Phase 10: US8 — Polish & Responsive Layout (Priority: P2)

**Purpose**: Responsive breakpoints, accessibility audit, error/loading states, final lint + build.

- [x] T044 [P] [US8] Verify and fix responsive layout at 360px — no horizontal scroll; awards grid 1-column; CTA buttons full-width stacked; countdown tiles scale down; header collapses to hamburger (or scrollable) | src/components/homepage/
- [x] T045 [P] [US8] Verify and fix responsive layout at 768px — awards grid 2-column; page padding-x 48px; CTA buttons inline | src/components/homepage/
- [x] T046 [P] [US8] Verify and fix responsive layout at 1440px — awards grid 3-column; page padding-x 144px; full desktop layout per design-style.md | src/components/homepage/
- [x] T047 [P] Add error state banner to AwardsSection: show "Không thể tải dữ liệu giải thưởng. Thử lại" `<button>` when `/api/awards` returns non-2xx; retry re-fetches on click | src/components/homepage/awards-section.tsx
- [x] T048 [P] Accessibility audit: confirm skip nav link visible on keyboard focus; countdown `aria-live="polite"` present; all icon buttons have `aria-label`; award cards keyboard-navigable; tab order: skip-nav → logo → nav links → controls → main → awards → kudos → footer → widget | src/components/homepage/
- [x] T049 Run `yarn lint && yarn build` — fix all TypeScript type errors and ESLint violations to zero | (project root)

**Checkpoint**: `yarn lint` zero errors; `yarn build` succeeds; all 3 breakpoints verified; accessibility requirements met

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────────────────┐
Phase 2 (Foundation) ─────────────────────────────────────────────────┤
                    ↓ BLOCKS all phases below                          │
Phase 3 (US2 Countdown) ──→ Phase 4 (US1/US4 Hero) ──→ Phase 9 (Assembly)
Phase 5 (US3 Awards)    ──→ Phase 9 (Assembly)       ↗
Phase 6 (US5/US7)       ──→ Phase 9 (Assembly)       │
Phase 7 (US6 Header)    ──→ Phase 9 (Assembly)       │
Phase 8 (US1 Footer)    ──→ Phase 9 (Assembly)       │
                                                      │
Phase 9 (Assembly) ──→ Phase 10 (Polish)              │
```

### Within Each Phase (TDD Order)

1. **Write failing test first** (Red) → verify it fails
2. **Implement minimum code** to pass test (Green)
3. **Refactor** without breaking tests
4. Mark task `[x]` and move to next

### Parallel Opportunities

| When | What can run in parallel |
|------|--------------------------|
| Phase 1 | T002, T003, T004 (different asset files) |
| Phase 2 | T008, T009, T010, T011 (different files) |
| Phase 4 | T016+T017, T018+T019, T020+T021 (3 parallel pairs) |
| Phase 5 | T026, T027+T028 (skeleton-cards + API route independent of card) |
| Phase 6 | T031+T032, T033+T034 (kudos pair and widget pair) |
| Phase 7 | T037+T038 (notifications API independent of header component) |
| Phase 10 | T044, T045, T046, T047, T048 (all in different files/viewports) |

---

## Implementation Strategy

### MVP Scope (Phases 1–3 + Partial Phase 4)

1. Complete Phase 1 + Phase 2
2. Complete Phase 3 (US2 Countdown — fully working)
3. Complete Phase 4 steps T016–T021 (event-info, cta-buttons, content-block)
4. **STOP and VALIDATE** at a page that shows countdown + event info at `/`
5. Continue with Phase 5 → 10

### Recommended Delivery Order

| Step | Phases | Deliverable |
|------|--------|-------------|
| 1 | 1 + 2 | All assets in place, types/tokens/icons ready |
| 2 | 3 | Countdown component works independently |
| 3 | 4 | Hero section complete with event info + CTA |
| 4 | 5 | Awards grid + API route working |
| 5 | 6 + 7 | Kudos + Widget in place |
| 6 | 7 (Header) + 8 (Footer) | Full page structure |
| 7 | 9 | Full page assembled at `localhost:3000/` |
| 8 | 10 | Responsive + accessible + lint clean |

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 49 |
| Phase 1 (Setup) | 7 tasks |
| Phase 2 (Foundation) | 4 tasks |
| Phase 3 (US2 Countdown) | 4 tasks |
| Phase 4 (US1/US4 Hero) | 8 tasks |
| Phase 5 (US3 Awards) | 7 tasks |
| Phase 6 (US5/US7) | 4 tasks |
| Phase 7 (US6 Header) | 4 tasks |
| Phase 8 (US1 Footer) | 2 tasks |
| Phase 9 (Assembly) | 3 tasks |
| Phase 10 (US8 Polish) | 6 tasks |
| Tasks marked [P] (parallelizable) | 24 |
| New files created | 22 |
| Files modified | 5 |

---

## Notes

- Mark each task `[x]` immediately upon completion
- Run `yarn test` after each phase checkpoint before proceeding
- `src/app/page.tsx` is currently Next.js boilerplate — T043 replaces it completely
- The `useCountdown` hook is a regular `.ts` module but **must only be imported by `"use client"` components**
- T005 (font licensing) is a potential blocker — if fonts cannot be licensed, implement with CSS variable fallback to system font and mark with `// TODO(fonts): replace with licensed font`
- Widget button menu actions (T034) left as placeholder per product decision — `// TODO(product): define menu actions`
