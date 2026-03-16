# Tasks: Sun* Kudos - Live Board

**Frame**: `2940:13431-sun-kudos-live-board`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US10)
- **|**: File path affected by this task

---

## Phase 1: Setup (Project Scaffolding)

**Purpose**: Download assets, create empty shells, add design tokens and icons.

- [x] T001 Download hero banner background image from Figma to public assets | `public/images/kudos-live-board/`
- [x] T002 [P] Add Live Board design tokens (CSS variables) from design-style.md to globals.css | `src/app/globals.css`
- [x] T003 [P] Add new icons (heart, heart-filled, copy, arrow-right, gift, pan-zoom, pen, search, chevron-left, chevron-right, star) to Icon component | `src/components/ui/icon.tsx`
- [x] T004 [P] Create i18n dictionary with Vietnamese + English translations for all Live Board strings | `src/i18n/kudos-live-board.ts`
- [x] T005 [P] Create empty RSC page shell for `/kudo/live` route | `src/app/kudo/live/page.tsx`
- [x] T006 [P] Create Suspense/streaming loading UI | `src/app/kudo/live/loading.tsx`

**Checkpoint**: Project scaffolding ready — foundation phase can begin.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Types, Zod schemas, database migration, and core hooks that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T007 Create all TypeScript types and Zod schemas: Kudos, Heart, Hashtag, Department, SecretBox, User, SpecialDay | `src/types/kudos.ts`
- [x] T008 Create database migration: `kudos`, `kudos_hearts`, `hashtags`, `kudos_hashtags`, `secret_boxes`, `special_days` tables (+ `users`/`departments` if not existing) with RLS policies for authenticated users | `supabase/migrations/20260313000000_create_kudos_tables.sql`
- [x] T009 [P] Create `useInfiniteScroll` hook — Intersection Observer pattern, fetches next page via GET, appends to local state array | `src/hooks/use-infinite-scroll.ts`
- [x] T010 [P] Create `useHeartToggle` hook — debounced, optimistic UI with rollback on error | `src/hooks/use-heart-toggle.ts`
- [x] T011 Add `activePage?: string` prop to existing Header component; render active nav highlight when `activePage` matches | `src/components/homepage/header.tsx`
- [x] T012 Verify `/kudo/live` is covered by middleware protected routes (catch-all or explicit entry) | `src/middleware.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 + 2 — Browse Feed & Like/Unlike (Priority: P1) 🎯 MVP

**Goal**: Display paginated kudos feed with infinite scroll and heart toggle functionality.

**Independent Test**: Load `/kudo/live`, verify kudos cards render with sender/receiver/content/images/hashtags/hearts. Click heart, verify count changes and icon toggles.

### Tests (US1 + US2) — TDD Red

- [x] T013 [P] [US1] Write failing tests for KudoPostCard: renders sender info, receiver info, timestamp (HH:mm - MM/DD/YYYY), content (5-line truncation), hashtags (1-line truncation), heart count | `src/components/kudos-live-board/__tests__/kudo-post-card.test.tsx`
- [x] T014 [P] [US1] Write failing tests for UserInfoBlock + StarCount: renders avatar, name, department, star count with tooltip per BR-001 thresholds (0/1★/2★★/3★★★) | `src/components/kudos-live-board/__tests__/user-info-block.test.tsx`
- [x] T015 [P] [US1] Write failing tests for ImageGallery: renders max 5 thumbnails, click opens full image | `src/components/kudos-live-board/__tests__/image-gallery.test.tsx`
- [x] T016 [P] [US2] Write failing tests for HeartButton: inactive→active toggle, count increment/decrement, disabled for own kudos (opacity: 0.3, cursor: not-allowed), debounce behavior | `src/components/kudos-live-board/__tests__/heart-button.test.tsx`
- [x] T017 [P] [US2] Write failing tests for useHeartToggle hook: optimistic update, API call, revert on error, special day 2x tim | `src/hooks/__tests__/use-heart-toggle.test.ts`
- [x] T018 [P] [US1] Write failing tests for useInfiniteScroll hook: triggers fetch at intersection, appends pages, handles loading/error states | `src/hooks/__tests__/use-infinite-scroll.test.ts`
- [x] T019 [P] [US1] Write failing test for GET /api/kudos Route Handler: pagination (page, limit params), Zod validation, returns kudos with sender/receiver/hashtags/hearts | `src/app/api/kudos/__tests__/route.test.ts`
- [x] T020 [P] [US2] Write failing tests for POST/DELETE /api/kudos/[id]/like Route Handler: like creates heart record + awards tim, unlike removes + revokes tim, unique constraint, sender cannot self-like, special day multiplier | `src/app/api/kudos/[id]/like/__tests__/route.test.ts`
- [x] T021 [P] [US2] Write failing test for GET /api/special-days/today Route Handler: returns is_special_day boolean + multiplier | `src/app/api/special-days/today/__tests__/route.test.ts`

### API (US1 + US2) — TDD Green

- [x] T022 [P] [US1] Implement GET /api/kudos — paginated list with sender/receiver joins, hashtags, heart count, ordered by most recent. Validate `page` and `limit` with Zod. | `src/app/api/kudos/route.ts`
- [x] T023 [P] [US2] Implement POST /api/kudos/[id]/like — create heart record, award tim to sender (1 or 2 if special day), enforce unique constraint, block self-like | `src/app/api/kudos/[id]/like/route.ts`
- [x] T024 [US2] Implement DELETE /api/kudos/[id]/like in same file — remove heart, revoke exact tim points (check `is_special_day` flag on heart record) | `src/app/api/kudos/[id]/like/route.ts`
- [x] T025 [P] [US2] Implement GET /api/special-days/today — check if today's date matches any special_days record | `src/app/api/special-days/today/route.ts`

### Components (US1 + US2) — TDD Green

- [x] T026 [P] [US1] Implement UserInfoBlock — avatar (Next.js `<Image>`, circle, onError→initials placeholder), name, department, StarCount sub-component | `src/components/kudos-live-board/user-info-block.tsx`
- [x] T027 [P] [US1] Implement StarCount — display ★/★★/★★★ based on BR-001 thresholds, hover tooltip with description text | `src/components/kudos-live-board/star-count.tsx`
- [x] T028 [P] [US1] Implement ImageGallery — horizontal row of square thumbnails (max 5), click opens full image via `<a target="_blank">`, onError hides broken thumbnail | `src/components/kudos-live-board/image-gallery.tsx`
- [x] T029 [P] [US2] Implement HeartButton — toggle icon (gray ↔ red #D4271D), count display, disabled state for own kudos, uses `useHeartToggle` hook | `src/components/kudos-live-board/heart-button.tsx`
- [x] T030 [P] [US1] Implement CopyLinkButton shell — renders icon + "Copy Link" text only, clipboard logic deferred to Phase 8 | `src/components/kudos-live-board/copy-link-button.tsx`
- [x] T031 [P] [US1] Implement Toast — fixed bottom-right, auto-dismiss, `role="status"` + `aria-live="polite"` | `src/components/kudos-live-board/toast.tsx`
- [x] T032 [US1] Implement KudoPostCard — compose UserInfoBlock (sender + receiver with arrow), timestamp (HH:mm - MM/DD/YYYY), content (5-line truncation), ImageGallery, hashtag line (1-line truncation, clickable), HeartButton, CopyLinkButton. Card body click navigates to detail page. | `src/components/kudos-live-board/kudo-post-card.tsx`
- [x] T033 [US1] Implement AllKudosSection — renders list of KudoPostCard with `useInfiniteScroll`, spinner at bottom during loading, empty state text "Hiện tại chưa có Kudos nào." | `src/components/kudos-live-board/all-kudos-section.tsx`

**Checkpoint**: US1 + US2 complete — feed displays and hearts work. MVP achieved.

---

## Phase 4: User Story 3 — Highlight Kudos Carousel (Priority: P1)

**Goal**: Center-focus carousel of top 5 most-liked kudos with arrow navigation and pagination.

**Independent Test**: Load page, verify carousel renders with center card prominent + adjacent dimmed. Click arrows, verify slide transitions and "N/M" pagination.

### Tests (US3) — TDD Red

- [x] T034 [P] [US3] Write failing tests for HighlightKudoCard: renders sender/receiver info, 3-line content truncation, hashtags, heart count, "Xem chi tiết" link, card click navigates to detail | `src/components/kudos-live-board/__tests__/highlight-kudo-card.test.tsx`
- [x] T035 [P] [US3] Write failing tests for KudosCarousel: center-focus effect (opacity/scale), arrow navigation (prev disabled at slide 1, next disabled at last), pagination "N/M" updates, keyboard arrow keys, 300ms transition | `src/components/kudos-live-board/__tests__/kudos-carousel.test.tsx`
- [x] T036 [P] [US3] Write failing tests for CarouselButton: enabled/disabled states (opacity 0.3, cursor not-allowed), hover (scale 1.05), focus ring | `src/components/kudos-live-board/__tests__/carousel-button.test.tsx`
- [x] T037 [P] [US3] Write failing test for GET /api/kudos/highlights: returns top 5 by heart count, accepts hashtag/department filter params | `src/app/api/kudos/highlights/__tests__/route.test.ts`

### API (US3) — TDD Green

- [x] T038 [US3] Implement GET /api/kudos/highlights — top 5 by heart count with sender/receiver joins, optional `hashtag` and `department` query params. Zod validation. | `src/app/api/kudos/highlights/route.ts`

### Components (US3) — TDD Green

- [x] T039 [P] [US3] Implement CarouselButton — circle 40x40, chevron icon, disabled state (opacity: 0.3, cursor: not-allowed), hover (opacity: 0.8, scale: 1.05), focus ring (2px #FFEA9E) | `src/components/kudos-live-board/carousel-button.tsx`
- [x] T040 [P] [US3] Implement PaginationIndicator — "N/M" display, Montserrat 32px 700, white | `src/components/kudos-live-board/pagination-indicator.tsx`
- [x] T041 [P] [US3] Implement HighlightKudoCard — sender/receiver with arrow + stars, 3-line content truncation, hashtags (clickable filter shortcut), heart count, "Xem chi tiết" link, card body click → detail page | `src/components/kudos-live-board/highlight-kudo-card.tsx`
- [x] T042 [US3] Implement KudosCarousel — center-focus state machine (currentSlide, totalSlides), transform translateX transitions (300ms ease-in-out), adjacent cards opacity: 0.5 + scale: 0.9, keyboard arrow navigation, prev disabled at 0, next disabled at last | `src/components/kudos-live-board/kudos-carousel.tsx`
- [x] T043 [US3] Implement HighlightSection — section container with "Sun* Annual Awards 2025" subtitle + "HIGHLIGHT KUDOS" title, renders KudosCarousel, empty state text "Hiện tại chưa có Kudos nào." | `src/components/kudos-live-board/highlight-section.tsx`

**Checkpoint**: US3 complete — carousel renders and navigates.

---

## Phase 5: User Story 4 — Filter by Hashtag & Department (Priority: P2)

**Goal**: Dropdown filters that update both Highlight and All Kudos sections.

**Independent Test**: Open Hashtag dropdown, select a tag, verify both carousel and feed update. Click hashtag on a card, verify filter sets. Clear filter, verify reset.

### Tests (US4) — TDD Red

- [x] T044 [P] [US4] Write failing tests for FilterDropdown: opens/closes, ARIA listbox + option roles, aria-expanded, aria-activedescendant, keyboard navigation, selection updates parent, clear action | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T045 [P] [US4] Write failing tests for GET /api/hashtags: returns all hashtags | `src/app/api/hashtags/__tests__/route.test.ts`
- [x] T046 [P] [US4] Write failing tests for GET /api/departments: returns all departments | `src/app/api/departments/__tests__/route.test.ts`

### API (US4) — TDD Green

- [x] T047 [P] [US4] Implement GET /api/hashtags — return all hashtags from DB | `src/app/api/hashtags/route.ts`
- [x] T048 [P] [US4] Implement GET /api/departments — return all departments from DB | `src/app/api/departments/route.ts`

### Components (US4) — TDD Green

- [x] T049 [US4] Implement FilterDropdown — reusable for `type="hashtag"` and `type="department"`, ARIA listbox with `role="listbox"`, `aria-expanded`, `aria-activedescendant`, `role="option"` + `aria-selected` on items, chevron rotation on open, border gold on hover/open/focus, keyboard navigation, clear action on re-click | `src/components/kudos-live-board/filter-dropdown.tsx`

### Integration (US4)

- [x] T050 [US4] Wire filters into HighlightSection — render 2 FilterDropdowns, pass selected values to KudosCarousel, re-fetch highlights with filter params, reset pagination to slide 1 on filter change | `src/components/kudos-live-board/highlight-section.tsx`
- [x] T051 [US4] Wire filters into AllKudosSection — receive filter props from KudosLiveBoardPage, reset accumulated pages on filter change, re-fetch page 1 with filter params | `src/components/kudos-live-board/all-kudos-section.tsx`
- [x] T052 [US4] Wire hashtag click shortcut on KudoPostCard and HighlightKudoCard — clicking a hashtag inside a card lifts filter change to KudosLiveBoardPage via callback | `src/components/kudos-live-board/kudo-post-card.tsx` + `highlight-kudo-card.tsx`

**Checkpoint**: US4 complete — filters work across both sections.

---

## Phase 6: User Story 5 + 6 + 10 — Page Layout, Stats, Sidebar (Priority: P2 + P3)

**Goal**: Hero banner with search trigger, sidebar with personal stats + secret box + top 10 gift recipients.

**Independent Test**: Load page, verify hero renders with search input. Verify sidebar shows 6 stat rows with correct values. Click "Mở Secret Box", verify dialog opens. Verify top 10 list renders.

### Tests (US5 + US6 + US10) — TDD Red

- [x] T053 [P] [US5] Write failing tests for HeroBanner: renders background image with gradient overlay, title text, falls back to solid gradient on image error | `src/components/kudos-live-board/__tests__/hero-banner.test.tsx`
- [x] T054 [P] [US5] Write failing tests for KudosSearchInput: renders pill-shaped input with placeholder "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?", click opens compose dialog | `src/components/kudos-live-board/__tests__/kudos-search-input.test.tsx`
- [x] T055 [P] [US6] Write failing tests for StatsPanel: renders 6 stat rows (Kudos nhận, Kudos gửi, Tim nhận, separator, Secret Box mở, Secret Box chưa) with correct values | `src/components/kudos-live-board/__tests__/stats-panel.test.tsx`
- [x] T056 [P] [US6] Write failing tests for SecretBoxButton: renders "Mở Secret Box 🎁", disabled when 0 unopened boxes (opacity: 0.5, cursor: not-allowed), click opens dialog | `src/components/kudos-live-board/__tests__/secret-box-button.test.tsx`
- [x] T057 [P] [US10] Write failing tests for TopSunnerList + TopSunnerListItem: renders 10 items with avatar (circle 40px), name, gift description, click navigates to profile | `src/components/kudos-live-board/__tests__/top-sunner-list.test.tsx`
- [x] T058 [P] [US6] Write failing tests for GET /api/users/me/stats: returns kudos received/sent, hearts received, secret boxes opened/unopened counts | `src/app/api/users/me/stats/__tests__/route.test.ts`
- [x] T059 [P] [US6] Write failing tests for POST /api/users/me/secret-box: opens a secret box, returns reward content | `src/app/api/users/me/secret-box/__tests__/route.test.ts`
- [x] T060 [P] [US10] Write failing tests for GET /api/sunners/top-gifts: returns 10 most recent gift recipients with avatar, name, gift description | `src/app/api/sunners/top-gifts/__tests__/route.test.ts`

### API (US5 + US6 + US10) — TDD Green

- [x] T061 [P] [US6] Implement GET /api/users/me/stats — aggregate kudos received/sent, hearts received, secret boxes opened/unopened for authenticated user | `src/app/api/users/me/stats/route.ts`
- [x] T062 [P] [US6] Implement POST /api/users/me/secret-box — mark box as opened, return reward content, validate user owns the box | `src/app/api/users/me/secret-box/route.ts`
- [x] T063 [P] [US10] Implement GET /api/sunners/top-gifts — 10 most recent gift recipients with user join for avatar/name | `src/app/api/sunners/top-gifts/route.ts`

### Components (US5 + US6 + US10) — TDD Green

- [x] T064 [P] [US5] Implement HeroBanner — full-width bg image (Next.js `<Image>`), gradient overlay (25deg, #00101A 14.74% → transparent 47.8%), title "Hệ thống ghi nhận và cảm ơn", large "KUDOS" logo (SVN-Gotham 139.78px), onError fallback to solid gradient | `src/components/kudos-live-board/hero-banner.tsx`
- [x] T065 [P] [US5] Implement KudosSearchInput — pill shape (border-radius: 100px, border: #998C5F), placeholder text, click handler to open compose dialog, pen icon prefix | `src/components/kudos-live-board/kudos-search-input.tsx`
- [x] T066 [P] [US5] Implement ProfileSearchButton — pill shape, search icon + text, UI-only (no logic), hover state (border-color: #FFEA9E) | `src/components/kudos-live-board/profile-search-button.tsx`
- [x] T067 [P] [US6] Implement StatsPanel — 6 rows (label: Montserrat 22px 700 white, value: right-aligned), separator line (1px #2E3940) between hearts row and secret box rows | `src/components/kudos-live-board/stats-panel.tsx`
- [x] T068 [P] [US6] Implement SecretBoxButton — border #998C5F, radius 8px, "Mở Secret Box 🎁" text, disabled state (opacity: 0.5) when 0 boxes, click triggers dialog, hover (border-color: #FFEA9E), focus ring | `src/components/kudos-live-board/secret-box-button.tsx`
- [x] T069 [P] [US10] Implement TopSunnerListItem — flex row, circle avatar (40px, onError→initials), name (14px 700 white), description (14px 400 #999), hover (opacity: 0.8), click navigates to profile | `src/components/kudos-live-board/top-sunner-list-item.tsx`
- [x] T070 [P] [US10] Implement TopSunnerList — "10 SUNNER NHẬN QUÀ MỚI NHẤT" title, renders list of TopSunnerListItem, empty state "Chưa có dữ liệu" | `src/components/kudos-live-board/top-sunner-list.tsx`
- [x] T071 [US6] Implement KudosSidebar — sticky container (position: sticky, top: 100px), independent scroll (overflow-y: auto), renders StatsPanel + SecretBoxButton + TopSunnerList | `src/components/kudos-live-board/kudos-sidebar.tsx`

### Integration (US5 + US6 + US10)

- [x] T072 [US5] Update AllKudosSection to render 2-column layout (feed + KudosSidebar), responsive: 2-column on `lg:` → stacked on mobile | `src/components/kudos-live-board/all-kudos-section.tsx`

**Checkpoint**: US5 + US6 + US10 complete — full page layout with sidebar.

---

## Phase 7: User Story 7 — Spotlight Board (Priority: P2)

**Goal**: Interactive word cloud showing kudos recipients, with search, hover tooltips, and pan/zoom.

**Independent Test**: Verify canvas renders names at different sizes. Type a name in search, verify highlight. Toggle pan/zoom, verify behavior. Hover a name, verify tooltip.

### Tests (US7) — TDD Red

- [x] T073 [P] [US7] Write failing tests for SpotlightSection: renders "{N} KUDOS" header from API, contains SpotlightBoard, loading state, empty state | `src/components/kudos-live-board/__tests__/spotlight-section.test.tsx`
- [x] T074 [P] [US7] Write failing tests for SpotlightBoard: renders SVG/canvas with name nodes, search input (max 100 chars) highlights matching name, pan/zoom toggle, hover tooltip (name + kudos time) | `src/components/kudos-live-board/__tests__/spotlight-board.test.tsx`
- [x] T075 [P] [US7] Write failing test for GET /api/spotlight: returns word cloud data (names + kudos counts) + total count | `src/app/api/spotlight/__tests__/route.test.ts`

### API (US7) — TDD Green

- [x] T076 [US7] Implement GET /api/spotlight — aggregate kudos by receiver, return name + count pairs + total, ordered by count desc for sizing | `src/app/api/spotlight/route.ts`

### Components (US7) — TDD Green

- [x] T077 [US7] Implement SpotlightBoard — SVG-based word cloud: name sizing proportional to kudos count (use text-spotlight-name-* tokens), hover tooltip (name + time), click navigates to profile, search input highlights matching name, pan/zoom toggle button with tooltip "Pan/Zoom", `aria-label="Spotlight Board — interactive word cloud of kudos recipients"` | `src/components/kudos-live-board/spotlight-board.tsx`
- [x] T078 [US7] Implement SpotlightSection — section container with "SPOTLIGHT BOARD" title, border #998C5F, "{N} KUDOS" header (Montserrat 32px 700), search + controls bar, renders SpotlightBoard, loading spinner, empty state | `src/components/kudos-live-board/spotlight-section.tsx`

**Checkpoint**: US7 complete — spotlight board renders and is interactive.

---

## Phase 8: User Story 8 + 9 — Copy Link & Profile Navigation (Priority: P3)

**Goal**: Copy kudos URL to clipboard with toast, profile click navigation and hover popover.

**Independent Test**: Click "Copy Link", verify clipboard content and toast "Link copied — ready to share!". Click user name, verify navigation. Hover user name, verify popover.

### Tests (US8 + US9) — TDD Red

- [x] T079 [P] [US8] Write failing tests for CopyLinkButton full behavior: click copies URL to clipboard (mock navigator.clipboard), shows toast | `src/components/kudos-live-board/__tests__/copy-link-button.test.tsx`
- [x] T080 [P] [US9] Write failing tests for profile navigation: click name/avatar navigates to profile page | `src/components/kudos-live-board/__tests__/user-info-block.test.tsx`
- [x] T081 [P] [US9] Write failing test for GET /api/users/[id]/profile-preview: returns profile preview data for hover popover | `src/app/api/users/[id]/profile-preview/__tests__/route.test.ts`

### API (US9) — TDD Green

- [x] T082 [US9] Implement GET /api/users/[id]/profile-preview — return user name, avatar, department, kudos count, title for popover | `src/app/api/users/[id]/profile-preview/route.ts`

### Components (US8 + US9) — TDD Green

- [x] T083 [US8] Wire CopyLinkButton clipboard logic — navigator.clipboard.writeText(kudosUrl), trigger Toast with "Link copied — ready to share!", hover (opacity: 0.8, underline), focus ring | `src/components/kudos-live-board/copy-link-button.tsx`
- [x] T084 [US9] Add profile click navigation to UserInfoBlock — wrap name/avatar in Next.js `<Link>` to profile page | `src/components/kudos-live-board/user-info-block.tsx`
- [x] T085 [US9] Add profile hover popover to UserInfoBlock — fetch preview on hover (GET /api/users/[id]/profile-preview), display popover with name, avatar, dept, kudos count | `src/components/kudos-live-board/user-info-block.tsx`

**Checkpoint**: US8 + US9 complete — copy link and profiles work.

---

## Phase 9: Final Assembly & Polish

**Purpose**: Page composition, Header/Footer integration, accessibility audit, responsive testing, E2E tests.

### Page Assembly

- [x] T086 Implement KudosLiveBoardPage client container — manages `selectedHashtag`, `selectedDepartment`, `lang` state. Receives initialHighlights, initialKudos, spotlight, userStats, topGifts, user as props. Renders HeroBanner, HighlightSection, SpotlightSection, AllKudosSection with filter state flow via callbacks. | `src/components/kudos-live-board/kudos-live-board-client.tsx`
- [x] T087 Implement RSC page — fetch highlights, kudosList (page 1), spotlight, userStats, topGifts via Supabase server client. Read lang cookie + auth session. Render Header (activePage="kudo-live"), KudosLiveBoardPage, Footer. | `src/app/kudo/live/page.tsx`
- [x] T088 [P] Implement loading.tsx — skeleton loaders matching page layout (hero skeleton, carousel skeleton, spotlight skeleton, feed card skeletons, sidebar skeleton) | `src/app/kudo/live/loading.tsx`

### Accessibility Audit

- [x] T089 [P] Verify carousel ARIA: `role="region"`, `aria-roledescription="carousel"`, `aria-label="Highlight Kudos"`, each slide `role="group"` + `aria-roledescription="slide"` + `aria-label="Slide N of M"` | `src/components/kudos-live-board/kudos-carousel.tsx`
- [x] T090 [P] Verify HeartButton ARIA: `aria-pressed` (true/false), `aria-label="Like kudos"` / `"Unlike kudos"` | `src/components/kudos-live-board/heart-button.tsx`
- [x] T091 [P] Verify keyboard navigation: carousel arrows (ArrowLeft/ArrowRight), filter dropdowns (ArrowUp/ArrowDown/Enter/Escape), all interactive elements have visible focus rings | All interactive components
- [x] T092 [P] Verify color contrast WCAG AA: light text on #00101A background, cream cards (#FFF8E1) text contrast, timestamp #999999 contrast check | All components

### Responsive Testing

- [x] T093 [P] Verify responsive layout at 360px (mobile): single-column, carousel 1 card, sidebar stacked below feed, hamburger menu, image gallery max 3 | All components
- [x] T094 [P] Verify responsive layout at 768px (tablet): carousel 2 cards, sidebar stacked or narrow | All components
- [x] T095 [P] Verify responsive layout at 1440px (desktop): carousel 4 cards center-focus, 2-column feed+sidebar, full header nav | All components

### E2E Tests

- [x] T096 Write Playwright E2E test: critical user flow — load page → browse feed (scroll) → like a kudos (heart toggles) → filter by hashtag → carousel navigation → copy link → verify toast | `tests/e2e/kudos-live-board.spec.ts`

**Checkpoint**: All user stories complete, page assembled, accessibility and responsive verified.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──→ Phase 2 (Foundation) ──→ Phase 3 (US1+US2, MVP) ──┐
                                              ├──→ Phase 4 (US3)       │
                                              ├──→ Phase 5 (US4) ──────┤ (needs US3 for carousel filter)
                                              ├──→ Phase 6 (US5+US6+US10)
                                              ├──→ Phase 7 (US7)       │
                                              └──→ Phase 8 (US8+US9) ──┘
                                                                       ↓
                                                              Phase 9 (Polish)
```

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundation (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1+US2)**: Depends on Foundation — **MVP milestone**
- **Phase 4 (US3)**: Depends on Foundation. Can parallel with Phase 3 (different components)
- **Phase 5 (US4)**: Depends on Phase 3 (needs feed) + Phase 4 (needs carousel) for integration
- **Phase 6 (US5+US6+US10)**: Depends on Foundation. Components parallelizable with Phase 3/4
- **Phase 7 (US7)**: Depends on Foundation. Fully independent from other stories
- **Phase 8 (US8+US9)**: Depends on Phase 3 (needs CopyLinkButton shell + UserInfoBlock)
- **Phase 9 (Polish)**: Depends on all previous phases

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD Red)
- API routes before components (components need API data)
- Leaf components before composite components
- Integration wiring after all parts exist

### Parallel Opportunities

**Within Phase 1**: T002, T003, T004, T005, T006 all parallel (different files)
**Within Phase 2**: T009, T010 parallel (different hooks)
**Within Phase 3**: T013–T021 all parallel (test files); T022–T025 parallel (API files); T026–T031 parallel (leaf components)
**Across Phases**: Phase 4 (US3) and Phase 6 component tasks (US5+US6+US10) can start after Foundation, in parallel with Phase 3
**Phase 7 (US7)**: Fully independent — can execute in parallel with any other story phase

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1 + US2 — feed + hearts)
3. **STOP and VALIDATE**: Load page, browse feed, like/unlike → all working
4. Deploy MVP if ready

### Incremental Delivery

1. Setup + Foundation
2. US1 + US2 (Feed + Hearts) → Test → Deploy
3. US3 (Carousel) → Test → Deploy
4. US4 (Filters) → Test → Deploy
5. US5 + US6 + US10 (Layout + Sidebar) → Test → Deploy
6. US7 (Spotlight) → Test → Deploy
7. US8 + US9 (Copy Link + Profiles) → Test → Deploy
8. Polish + E2E → Final Deploy

---

## Notes

- TDD is **NON-NEGOTIABLE** per constitution — every component/API has failing tests before implementation
- Commit after each task or logical group (e.g., all tests for a story, then all implementations)
- Run `yarn lint && yarn build` before each commit
- Update spec.md if requirements change during implementation
- Mark tasks complete as you go: `[x]`
- Total acceptance scenarios to cover: 41+ (from spec.md)
- The Spotlight Board (Phase 7) is the most technically complex — consider time-boxing SVG implementation and falling back to `d3-cloud` if needed
