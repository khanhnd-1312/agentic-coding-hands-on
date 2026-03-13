# Tasks: Hệ Thống Giải (Award System)

**Frame**: `313-8436-He-thong-giai`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```
- [x] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US6)
- **|**: File path(s) affected by this task

---

## Phase 1: Setup (Assets)

**Purpose**: Download all required UI assets from Figma before any coding begins.

> ⚠️ All images must exist in `public/images/awards/` before Phase 3 components can be implemented.

- [x] T001 Create `public/images/awards/` directory | `public/images/awards/`
- [x] T002 [P] Download hero background image from Figma node `313:8437` → save as `kv-hero.png` | `public/images/awards/kv-hero.png`
- [x] T003 [P] Download ROOT FURTHER artwork from Figma node `313:8450` → save as `kv-root-further.png` | `public/images/awards/kv-root-further.png`
- [x] T004 [P] Download Top Talent award image (inside `313:8467`) → save as `top-talent.png` | `public/images/awards/top-talent.png`
- [x] T005 [P] Download Top Project award image (inside `313:8468`) → save as `top-project.png` | `public/images/awards/top-project.png`
- [x] T006 [P] Download Top Project Leader award image (inside `313:8469`) → save as `top-project-leader.png` | `public/images/awards/top-project-leader.png`
- [x] T007 [P] Download Best Manager award image (inside `313:8470`) → save as `best-manager.png` | `public/images/awards/best-manager.png`
- [x] T008 [P] Download Signature 2025 Creator award image (inside `313:8471`) → save as `signature-creator.png` | `public/images/awards/signature-creator.png`
- [x] T009 [P] Download MVP award image (inside `313:8510`) → save as `mvp.png` | `public/images/awards/mvp.png`
- [x] T010 [P] Download Sun* Kudos decorative image from `I335:12023;313:8417` → save as `sunkudos-deco.png` | `public/images/awards/sunkudos-deco.png`

**Checkpoint**: All 9 images present in `public/images/awards/` ✓

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Shared infrastructure required by ALL user stories. No component work begins until this phase is complete.

> ⚠️ CRITICAL: Phases 3–7 depend on this phase being fully complete.

### Data Model

- [x] T011 [P] Write failing Zod parse tests for extended `AwardCategory` fields (`quantity`, `unit`, `prize`, `detailImageUrl`) — assert `z.parse` fails without them before T012 | `src/types/homepage.ts` (test only)
- [x] T012 Extend `AwardCategorySchema` with 4 optional fields: `quantity: z.number().optional()`, `unit: z.string().optional()`, `prize: z.string().optional()`, `detailImageUrl: z.string().optional()` | `src/types/homepage.ts`
- [x] T013 Populate all 6 entries in `AWARDS_SEED` with exact data from spec: D.1 `quantity:10, unit:"Đơn vị", prize:"7.000.000 VNĐ/giải"`, D.2 `quantity:2, unit:"Tập thể", prize:"15.000.000 VNĐ/giải"`, D.3 `quantity:3, unit:"Cá nhân", prize:"7.000.000 VNĐ/giải"`, D.4 `quantity:1, unit:"Cá nhân", prize:"10.000.000 VNĐ/giải"`, D.5 `quantity:1, unit:"Cá nhân / Tập thể", prize:"5.000.000 / 8.000.000 VNĐ"`, D.6 `quantity:1, unit:"", prize:"15.000.000 VNĐ/giải"` + `detailImageUrl` for all 6 | `src/data/awards.ts`

### Icon Component

- [x] T014 [P] Add 4 failing test cases to `icon.test.tsx` for new icon names (`target`, `diamond`, `license`, `ic-arrow`) — each asserts SVG renders with correct `width`, `height`, `aria-hidden="true"` | `src/components/ui/icon.test.tsx`
- [x] T015 [P] Add 4 new SVG icon cases to `icon.tsx`: `"target"` (24×24, `MM_MEDIA_Target` SVG from Figma), `"diamond"` (24×24, `MM_MEDIA_Diamond` SVG), `"license"` (24×24, `MM_MEDIA_License` SVG), `"ic-arrow"` (24×24, `IC` SVG) | `src/components/ui/icon.tsx`

### Navigation Link Fixes

- [x] T016 [P] Update `header.tsx` `NAV_LINKS`: change `href: "/awards-information"` → `href: "/awards"` for "Awards Information" entry | `src/components/homepage/header.tsx`
- [x] T017 [P] Update `footer.tsx` nav links: change `href: "/awards-information"` → `href: "/awards"` | `src/components/homepage/footer.tsx`

### Scroll Spy Hook

- [x] T018 [P] Write failing unit tests for `useScrollSpy` hook covering 3 scenarios: (1) returns `sectionIds[0]` on mount, (2) updates `activeId` when `IntersectionObserver` fires a new section, (3) keeps last `activeId` when observer fires with zero intersecting entries (MVP stays active) — stub `IntersectionObserver` via `vi.stubGlobal` | `src/hooks/use-scroll-spy.test.ts`
- [x] T019 Implement `useScrollSpy(sectionIds: string[]): string` hook: `useState` initialized to `sectionIds[0]`; `useEffect` creates `IntersectionObserver` with `threshold: 0.5`; only updates state when `entry.isIntersecting === true`; never resets to null when no entries intersect (last active item persists) | `src/hooks/use-scroll-spy.ts`

**Checkpoint**: Types extended, data populated, icons ready, nav links fixed, scroll spy hook passing all tests ✓

---

## Phase 3: US1 — View Award Cards (Priority: P1) 🎯 MVP

**Goal**: Render all 6 award cards with title, description, quantity, unit, and prize value on the `/awards` page.

**Independent Test**: Navigate to `/awards` — verify 6 `<section>` elements render each with correct heading, description text, quantity number, unit, and prize value matching spec Award Data Summary table.

### Tests (TDD — write before implementation)

- [x] T020 [P] [US1] Write failing unit tests for `AwardInfoCard`: (1) renders `<section id="top-talent">`, (2) renders `<h2>` with award name in `#FFEA9E`, (3) renders quantity + unit text, (4) renders prize value text, (5) renders `<Image>` with correct `alt` text format `"Hình ảnh giải thưởng {name}"` | `src/components/awards/award-info-card.test.tsx`
- [x] T021 [P] [US1] Write failing render test for `AwardSystemPage`: asserts 6 `<AwardInfoCard>` sections present, `<h1>` "Hệ thống giải thưởng SAA 2025" present, `<Footer>` present | `src/components/awards/award-system-page.test.tsx`

### Implementation

- [x] T022 [US1] Implement `AwardInfoCard` RSC: `<section id={award.slug} aria-labelledby="${award.slug}-title">`; inner row `flex flex-row gap-10`; left image div `w-84 h-84 border border-[#FFEA9E] rounded-3xl mix-blend-screen shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` with `<Image sizes="336px" alt={"Hình ảnh giải thưởng " + award.name} />`; right content block `w-[480px] flex flex-col gap-8 rounded-2xl backdrop-blur-[32px]` with `<h2>`, description, dividers, quantity row (diamond icon + label + number + unit), prize row (license icon + label + value + sub-label); bottom `<hr>` divider | `src/components/awards/award-info-card.tsx`
- [x] T023 [US1] Implement `AwardSystemPage` RSC (without nav — placeholder `<div>` for nav column): `<Header>`; Keyvisual div placeholder; `<main>` landmark; content area `flex flex-col gap-[120px] px-36 py-24`; title section with `<p>` subtitle + `<hr>` + `<h1>`; award row `flex flex-row gap-20` with nav placeholder + right column `flex flex-col gap-20` mapping `awards.map(a => <AwardInfoCard award={a} />)`; `<Footer>` | `src/components/awards/award-system-page.tsx`
- [x] T024 [US1] Implement `src/app/awards/page.tsx`: read `lang` from `cookies()`, return `<AwardSystemPage awards={AWARDS_SEED} lang={lang} />`; export `metadata = { title: "Hệ Thống Giải | Sun Annual Awards 2025" }` | `src/app/awards/page.tsx`

**Checkpoint**: `yarn test src/components/awards/award-info-card` passes; navigate to `/awards` and see 6 cards with correct data ✓

---

## Phase 4: US2 — Left Nav Scroll Spy (Priority: P1)

**Goal**: Sticky left navigation menu highlights the active award section as the user scrolls and allows click-to-scroll navigation.

**Independent Test**: (1) Click "Top Project" nav item → page smooth-scrolls to `#top-project` section, nav item gains `border-bottom: 1px solid #FFEA9E`; (2) Scroll past all awards → "MVP" nav item stays active.

### Tests (TDD — write before implementation)

- [x] T025 [P] [US2] Write failing unit tests for `AwardNavMenu`: (1) renders 6 nav items in correct order, (2) active item (first by default) has `aria-current="true"`, (3) clicking a nav item calls `scrollIntoView` on the matching section element, (4) each item has `<Icon name="target">` prefix — stub `document.getElementById` and `IntersectionObserver` | `src/components/awards/award-nav-menu.test.tsx`

### Implementation

- [x] T026 [US2] Implement `AwardNavMenu` client component (`"use client"`): takes `categories: { slug: string; name: string }[]`; calls `useScrollSpy(categories.map(c => c.slug))`; renders `<nav aria-label="Danh mục giải thưởng">` with `<div className="flex flex-col gap-4 w-[178px] sticky top-20">`; each item is `<button>` with `<Icon name="target" size={24} />` + name text; active item gets `border-b border-[#FFEA9E] text-[#FFEA9E] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` + `aria-current="true"`; inactive gets `text-white`; hover gets `bg-[rgba(255,234,158,0.1)]`; click handler calls `document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })` | `src/components/awards/award-nav-menu.tsx`
- [x] T027 [US2] Replace nav placeholder in `AwardSystemPage` with `<AwardNavMenu categories={awards} />` | `src/components/awards/award-system-page.tsx`

**Checkpoint**: `yarn test src/components/awards/award-nav-menu` passes; scroll spy highlights nav items correctly in browser ✓

---

## Phase 5: US3 + US4 — Award Data Accuracy (Priority: P2)

**Goal**: Verify each award card displays precisely the correct quantity, unit, and prize value from the spec data table.

**Independent Test**: Check each of the 6 award sections: Top Talent shows "10 Đơn vị / 7.000.000 VNĐ"; Top Project shows "02 Tập thể / 15.000.000 VNĐ"; Signature 2025 shows "01 Cá nhân / Tập thể / 5.000.000 / 8.000.000 VNĐ"; MVP shows "01 / 15.000.000 VNĐ".

### Tests (TDD — extend existing test file)

- [x] T028 [P] [US3] Add test case to `award-info-card.test.tsx`: render with Top Talent data, assert text "10", "Đơn vị", "7.000.000 VNĐ" all present | `src/components/awards/award-info-card.test.tsx`
- [x] T029 [P] [US4] Add test cases for D.2–D.4 (Top Project, Top Project Leader, Best Manager): assert correct quantity + unit + prize text for each | `src/components/awards/award-info-card.test.tsx`
- [x] T030 [P] [US4] Add test cases for D.5 Signature 2025 (dual prize "5.000.000 / 8.000.000 VNĐ") and D.6 MVP (empty unit): assert both prize values present, empty unit renders gracefully | `src/components/awards/award-info-card.test.tsx`

**Checkpoint**: All 6 award data accuracy tests pass; no data rendering errors in browser ✓

---

## Phase 6: US5 — Sun* Kudos Block (Priority: P2)

**Goal**: Render the Sun* Kudos promotional block at the bottom of the page with a solid gold "Chi tiết" button that navigates same-tab to `/kudo/live`.

**Independent Test**: (1) Sun* Kudos block renders with "Phong trào ghi nhận" label, "Sun* Kudos" title, description text; (2) "Chi tiết" button is a `<Link>` pointing to `/kudo/live` (not `target="_blank"`); (3) button has `aria-label="Xem Sun* Kudos Live board"`.

### Tests (TDD — write before implementation)

- [x] T031 [P] [US5] Write failing unit tests for `SunKudosBlock`: (1) renders "Phong trào ghi nhận" label, (2) renders "Sun* Kudos" title, (3) "Chi tiết" renders as `<a href="/kudo/live">` (no `target="_blank"`), (4) has `aria-label="Xem Sun* Kudos Live board"`, (5) renders `<Icon name="ic-arrow">` inside button | `src/components/awards/sun-kudos-block.test.tsx`

### Implementation

- [x] T032 [US5] Implement `SunKudosBlock` RSC: outer `<div className="w-full h-[500px] flex flex-col items-center justify-center">`; inner card `<div className="w-full h-[500px] rounded-2xl bg-[#0F0F0F] overflow-hidden flex flex-row">`; left content block `<div className="w-[470px] h-[408px] flex flex-col justify-center gap-8 px-12">`; "Phong trào ghi nhận" `<p>` (24px 700 white); "Sun* Kudos" `<h2>` (57px 700 `#FFEA9E`); description text from design-style.md (16px 700 white justify); `<Link href="/kudo/live" aria-label="Xem Sun* Kudos Live board" className="...gold button styles...">Chi tiết <Icon name="ic-arrow" size={24} /></Link>`; right column `<Image src="/images/awards/sunkudos-deco.png" alt="" width={272} height={219} sizes="272px" />` | `src/components/awards/sun-kudos-block.tsx`
- [x] T033 [US5] Integrate `<SunKudosBlock />` into `AwardSystemPage` content area (after award cards, before Footer) | `src/components/awards/award-system-page.tsx`

**Checkpoint**: `yarn test src/components/awards/sun-kudos-block` passes; "Chi tiết" navigates to `/kudo/live` in same tab in browser ✓

---

## Phase 7: US6 — Hero Banner (Priority: P3)

**Goal**: Display the full-width Keyvisual hero banner (547px) with gradient overlay and the ROOT FURTHER artwork block (150px) at the top of the page.

**Independent Test**: (1) Hero `<Image>` renders with `alt="Keyvisual Sun* Annual Award 2025"`, (2) image fills full width with `object-fit: cover`, (3) gradient overlay is visually present, (4) ROOT FURTHER `<Image>` has `alt=""` (decorative).

### Tests (TDD — extend existing test file)

- [x] T034 [P] [US6] Add test cases to `award-system-page.test.tsx`: (1) `<Image alt="Keyvisual Sun* Annual Award 2025">` is present, (2) ROOT FURTHER image has `alt=""`, (3) hero section has `overflow-hidden` class | `src/components/awards/award-system-page.test.tsx`

### Implementation

- [x] T035 [US6] Add Keyvisual section to `AwardSystemPage`: `<div className="relative w-full h-136.75 overflow-hidden">` (547px) containing `<Image src="/images/awards/kv-hero.png" alt="Keyvisual Sun* Annual Award 2025" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />`; absolute-positioned gradient overlay `<div className="absolute inset-0 bg-gradient-to-t from-[#00101A] to-transparent" />` | `src/components/awards/award-system-page.tsx`
- [x] T036 [US6] Add KV block section to `AwardSystemPage` content area (before title section): `<div className="w-full h-37.5">` (150px) with `<Image src="/images/awards/kv-root-further.png" alt="" width={338} height={150} sizes="338px" />` | `src/components/awards/award-system-page.tsx`

**Checkpoint**: `yarn test src/components/awards/award-system-page` all US6 cases pass; hero banner renders correctly in browser at 1440px ✓

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, full accessibility verification, and CI-clean build.

- [x] T037 [P] Apply mobile responsive styles (360px) to `AwardSystemPage` and `AwardInfoCard`: nav collapses to horizontal scroll row (`flex flex-row overflow-x-auto`); award row becomes `flex-col`; card image `w-full max-w-[280px]`; hero stays full-width; title font-size `text-[32px]` | `src/components/awards/award-system-page.tsx`, `src/components/awards/award-info-card.tsx`
- [x] T038 [P] Apply tablet responsive styles (768px): content area `px-8 py-12`; award gap `gap-10`; nav width `w-[140px]`; card image `w-[240px] h-[240px]`; title font-size `text-[40px]` | `src/components/awards/award-system-page.tsx`, `src/components/awards/award-info-card.tsx`
- [x] T039 [P] Verify and fix all ARIA attributes: `<nav aria-label>` on nav, `aria-current` on active nav item, `<section aria-labelledby>` on cards, `<h2 id>` on card titles, `aria-label` on Chi tiết button, alt texts on all images | `src/components/awards/`
- [x] T040 [P] Add focus ring styles to all interactive elements (nav `<button>` items, "Chi tiết" `<Link>`): `focus:outline-2 focus:outline-[#15D5CA] focus:outline-offset-2` (matches existing project pattern from `header.tsx`) | `src/components/awards/award-nav-menu.tsx`, `src/components/awards/sun-kudos-block.tsx`
- [x] T041 Run `yarn lint` — fix any ESLint errors; ensure no `any` types, no `console.log` | All `src/components/awards/` files
- [x] T042 Run `yarn build` — verify TypeScript compiles with zero type errors | All files
- [x] T043 Run `yarn test` — verify all tests pass (unit + existing tests unaffected) | All test files

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Assets)
    ↓
Phase 2 (Foundation) ← BLOCKS all phases below
    ↓
Phase 3 (US1 — Award Cards)
    ↓
Phase 4 (US2 — Left Nav) ← depends on US1 AwardSystemPage scaffold
    ↓
Phase 5 (US3+US4 — Data Accuracy) ← depends on AwardInfoCard from US1
    ↓ ↓
Phase 6 (US5)  Phase 7 (US6) ← both can run in parallel after US4
    ↓ ↓
Phase 8 (Polish) ← depends on all user stories complete
```

### Within Each Phase

- **TDD order**: Write failing test → implement → run test → refactor
- **Foundation (Phase 2)**: T011–T013 (types+data) must complete before T018–T019 (hook uses slug from AwardCategory)
- **Phase 3**: T020–T021 (tests) must be written and failing before T022–T024 (implementation)
- **Phase 4**: Depends on Phase 3 `AwardSystemPage` scaffold (T023) being present
- **Phase 6 + Phase 7**: Independent of each other — can be done in parallel by two developers

### Parallel Opportunities

| Parallelizable Group | Tasks |
|---------------------|-------|
| Asset downloads (Phase 1) | T002–T010 all run in parallel |
| Foundation sub-tasks | T011+T014+T016+T017+T018 (different files, all parallel) |
| US3+US4 test cases | T028, T029, T030 (all in same file but independent `it()` blocks) |
| US5 + US6 | Phase 6 and Phase 7 are independent |
| Polish tasks | T037, T038, T039, T040 all parallel (different concerns) |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2
2. Complete Phase 3 (US1 only — award cards visible on `/awards`)
3. **STOP and VALIDATE**: `yarn test`, open `/awards` in browser, verify 6 cards
4. Proceed to Phase 4 (add nav) → deploy

### Incremental Delivery

1. Phases 1+2 (Setup + Foundation)
2. Phase 3 (US1) → Test → `/awards` shows award cards ✓
3. Phase 4 (US2) → Test → Nav scroll spy works ✓
4. Phase 5 (US3+US4) → Test → Data accuracy verified ✓
5. Phase 6 (US5) → Test → Sun* Kudos + Chi tiết button ✓
6. Phase 7 (US6) → Test → Hero banner ✓
7. Phase 8 → Lint + Build + All tests ✓ → Deploy

---

## Task Count Summary

| Phase | Tasks | Notes |
|-------|-------|-------|
| Phase 1: Setup | T001–T010 (10 tasks) | 9 parallel asset downloads |
| Phase 2: Foundation | T011–T019 (9 tasks) | 6 parallel |
| Phase 3: US1 | T020–T024 (5 tasks) | 2 parallel (tests) |
| Phase 4: US2 | T025–T027 (3 tasks) | 1 parallel |
| Phase 5: US3+US4 | T028–T030 (3 tasks) | 3 parallel (all tests) |
| Phase 6: US5 | T031–T033 (3 tasks) | 1 parallel |
| Phase 7: US6 | T034–T036 (3 tasks) | 1 parallel |
| Phase 8: Polish | T037–T043 (7 tasks) | 4 parallel |
| **Total** | **43 tasks** | |

---

## Notes

- Mark tasks complete as you go: change `[ ]` → `[x]`
- Commit after each phase checkpoint (or per logical group)
- Run `yarn test` before moving to the next phase
- Reference `design-style.md` for exact Tailwind classes and pixel values during implementation
- Reference `spec.md` Award Data Summary table for exact quantity/unit/prize strings
- The `use-scroll-spy.ts` hook file extension is `.ts` (not `.tsx`) — it contains no JSX
- `icon.tsx` SVG paths for the 4 new icons must be extracted from Figma using `mcp__momorph__get_media_files`
