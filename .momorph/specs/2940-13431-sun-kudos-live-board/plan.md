# Implementation Plan: Sun* Kudos - Live Board

**Frame**: `2940:13431-sun-kudos-live-board`
**Date**: 2026-03-13
**Spec**: `specs/2940-13431-sun-kudos-live-board/spec.md`

---

## Summary

The Sun* Kudos - Live Board is a full-page feature comprising 5 major sections: Hero Banner, Highlight Kudos Carousel, Spotlight Board (word cloud), All Kudos Feed (infinite scroll + sidebar), and Footer. It requires 13 predicted API endpoints, Supabase integration for auth/data, and a center-focus carousel + interactive canvas as the two most complex UI patterns.

**Technical approach**: Feature-based component directory under `src/components/kudos-live-board/`, RSC page with client islands for interactive sections, vertical slice implementation starting from P1 user stories.

---

## Technical Context

**Language/Framework**: TypeScript 5.x (strict) / Next.js 15.x (App Router)
**Primary Dependencies**: React 19.x, TailwindCSS 4.x, Supabase SSR, Zod
**Database**: Supabase PostgreSQL (with RLS)
**Testing**: Vitest + React Testing Library (unit/integration), Playwright (E2E)
**State Management**: React local state + Server Components for initial data fetch
**API Style**: REST (Next.js Route Handlers)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **TypeScript strict mode** — All new files use strict TS, no `any` without justification
- [x] **Kebab-case filenames, PascalCase components** — e.g., `kudos-post-card.tsx` exports `KudosPostCard`
- [x] **Path alias `@/*`** — All imports use `@/` prefix, no cross-boundary `../`
- [x] **RSC-first** — Page is Server Component; `"use client"` only for interactive islands
- [x] **Next.js `<Image>`, `<Link>`** — No raw `<img>`, `<a>` for internal assets/links
- [x] **Supabase client patterns** — Browser: `@/libs/supabase/client.ts`, Server: `@/libs/supabase/server.ts`
- [x] **Zod validation** — All Route Handler inputs validated with Zod
- [x] **TDD (Red-Green-Refactor)** — Tests written before implementation for each story
- [x] **Mobile-first responsive** — Default styles for mobile, `sm:`, `md:`, `lg:`, `xl:` modifiers
- [x] **WCAG 2.1 AA** — Color contrast, keyboard nav, ARIA roles, focus rings
- [x] **Semantic HTML** — `<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<footer>`
- [x] **No `console.log`** — Use structured logging or remove
- [x] **RLS policies** — All new Supabase tables have RLS enabled
- [x] **Edge-safe (Cloudflare Workers)** — No Node.js-only APIs (fs, path, crypto.randomBytes). Use Web Crypto API for random values. All Route Handlers and middleware must run on edge runtime. Supabase SSR client is edge-compatible. Canvas API (Spotlight Board) runs client-side only, so no edge concern.

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — all Live Board components in `src/components/kudos-live-board/`. Shared primitives (Icon) already exist in `src/components/ui/`.
- **Styling Strategy**: TailwindCSS utility classes with CSS variables from `globals.css`. New design tokens (colors, spacing) added to globals.css for this feature.
- **Data Fetching**:
  - **Server Components** fetch initial page data (highlights, kudosList page 1, spotlight, userStats, topGifts) via Supabase server client and pass as props.
  - **Client Components** handle mutations (heart toggle) and interactive state (carousel, filters, spotlight search) via fetch to Route Handlers.
  - **Infinite scroll (All Kudos feed)**: Client-side state accumulation — `useInfiniteScroll` hook fetches next page via `GET /api/kudos?page=N&limit=20`, appends to local `useState<Kudos[]>` array. No SWR/React Query needed. Initial page data comes from RSC props, subsequent pages fetched client-side.
  - **Heart toggle**: Optimistic local state update (immediate UI change), background API call, revert on error. No `router.refresh()` needed.
  - **Filter change**: Resets accumulated feed pages, fetches fresh data for page 1 with filter params. Highlight data re-fetched client-side with filter params.
- **i18n**: Follow existing pattern — dictionary in `src/i18n/kudos-live-board.ts`, language from cookie passed as prop.

### Backend Approach

- **API Design**: RESTful Route Handlers in `src/app/api/`. Each endpoint validates input with Zod.
- **Data Access**: Supabase query builders via server client (no raw SQL).
- **Validation**: Zod schemas for all request params/bodies. Shared schemas in `src/types/kudos.ts`.
- **Database**: New tables: `kudos`, `kudos_hearts`, `hashtags`, `kudos_hashtags`, `secret_boxes`, `special_days`. All with RLS policies. **Assumed existing tables**: `users` (profiles, managed by Supabase Auth + a `profiles` view/table) and `departments`. The migration will reference these via foreign keys — if they don't exist yet, create them as part of this migration with minimal columns (id, name, avatar_url for users; id, name for departments).
  - **RLS policy strategy (protected page — all users authenticated)**:
    - All tables: `SELECT` allowed for authenticated users. `INSERT/UPDATE/DELETE` scoped by `auth.uid()` where applicable.
    - `kudos_hearts`: `INSERT/DELETE` requires `auth.uid()` matching `user_id`.
    - `secret_boxes`: `SELECT/INSERT/UPDATE` requires `auth.uid()` matching `user_id`.

### Integration Points

- **Existing: Header component** (`src/components/homepage/header.tsx`) — **Decision**: Add an optional `activePage?: string` prop to the existing Header. The Live Board page passes `activePage="kudo-live"` to highlight the correct nav item. No extraction to shared folder needed — the component already lives in `homepage/` but is generic enough to reuse.
- **Existing: Footer component** (`src/components/homepage/footer.tsx`) — **Decision**: Reuse as-is. The footer has no page-specific state. Import directly from `@/components/homepage/footer`.
- **Existing: Icon component** (`src/components/ui/icon.tsx`) — Add new icons (heart, copy, arrow-right, gift, pan-zoom, pen, search) to existing component.
- **Existing: Language selector** (`src/components/login/language-selector.tsx`) — Used in header, already functional.
- **Existing: Supabase auth** — Middleware handles session; Route Handlers use `createServerClient`. Page is protected — unauthenticated users are redirected to login by middleware.
- **Existing: CSS variables** in `globals.css` — Extend with Live Board design tokens.
- **Existing: Montserrat + SVN-Gotham fonts** — Already loaded in `layout.tsx`.

### Key Architecture Diagram

```
src/app/kudo/live/page.tsx (RSC — protected, requires auth)
├── Fetches: highlights, kudosList, spotlight, userStats, topGifts
├── Reads: lang cookie, auth session (guaranteed by middleware)
└── Renders:
    ├── <Header activePage="kudo-live" /> (server)
    ├── <KudosLiveBoardPage                (client — manages filter + lang state)
    │     initialHighlights, initialKudos, spotlight, userStats, topGifts, user>
    │   ├── <HeroBanner>                   (passed as children to preserve RSC)
    │   │   ├── <KudosSearchInput />       (client — click opens dialog)
    │   │   └── <ProfileSearchButton />    (client — UI-only)
    │   ├── <HighlightSection              (receives filter state + initialHighlights)
    │   │     selectedHashtag, selectedDepartment>
    │   │   ├── <FilterDropdown /> × 2     (lifts filter changes to parent)
    │   │   └── <KudosCarousel />
    │   │       ├── <HighlightKudoCard /> × 5
    │   │       ├── <CarouselButton /> × 2
    │   │       └── <PaginationIndicator />
    │   ├── <SpotlightSection />
    │   │   └── <SpotlightBoard />         (client — canvas/SVG)
    │   └── <AllKudosSection               (receives filter state + initialKudos)
    │         selectedHashtag, selectedDepartment>
    │       ├── <KudoPostCard /> × N       (client — heart interaction)
    │       │   ├── <UserInfoBlock /> (with <StarCount />)
    │       │   ├── <ImageGallery />
    │       │   ├── <HeartButton />
    │       │   └── <CopyLinkButton />
    │       └── <KudosSidebar />           (independent scroll)
    │           ├── <StatsPanel />
    │           ├── <SecretBoxButton />
    │           └── <TopSunnerList />
    └── <Footer /> (server)
```

**State flow**: `KudosLiveBoardPage` owns `selectedHashtag` and `selectedDepartment` state. `FilterDropdown` (inside `HighlightSection`) lifts changes up via `onFilterChange` callback. Both `HighlightSection` and `AllKudosSection` receive filter values as props and re-fetch data when they change.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2940-13431-sun-kudos-live-board/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design style document ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma screenshot ✅
```

### Source Code — New Files

| File | Purpose |
|------|---------|
| **Page & Layout** | |
| `src/app/kudo/live/page.tsx` | RSC page — fetches data, renders layout |
| `src/app/kudo/live/loading.tsx` | Streaming/Suspense loading UI |
| **Components** | |
| `src/components/kudos-live-board/kudos-live-board-page.tsx` | Main client container (lang state, filter state, user prop) |
| `src/components/kudos-live-board/hero-banner.tsx` | Hero section with background image + gradient |
| `src/components/kudos-live-board/kudos-search-input.tsx` | Pill-shaped input (click opens compose dialog) |
| `src/components/kudos-live-board/profile-search-button.tsx` | Search button (UI-only, no logic) |
| `src/components/kudos-live-board/highlight-section.tsx` | Highlight section container (title + filters + carousel) |
| `src/components/kudos-live-board/kudos-carousel.tsx` | Center-focus carousel with arrow nav + pagination |
| `src/components/kudos-live-board/highlight-kudo-card.tsx` | Individual highlight card |
| `src/components/kudos-live-board/carousel-button.tsx` | Prev/Next circle button |
| `src/components/kudos-live-board/pagination-indicator.tsx` | "2/5" display |
| `src/components/kudos-live-board/filter-dropdown.tsx` | Hashtag/Department filter dropdown (ARIA listbox) |
| `src/components/kudos-live-board/spotlight-section.tsx` | Spotlight section container |
| `src/components/kudos-live-board/spotlight-board.tsx` | Interactive word cloud (canvas/SVG) |
| `src/components/kudos-live-board/all-kudos-section.tsx` | All Kudos + Sidebar layout container |
| `src/components/kudos-live-board/kudo-post-card.tsx` | Individual kudos card in feed |
| `src/components/kudos-live-board/user-info-block.tsx` | Avatar + Name + Dept + Stars (reused in highlight + feed) |
| `src/components/kudos-live-board/star-count.tsx` | Star display with tooltip |
| `src/components/kudos-live-board/image-gallery.tsx` | Horizontal thumbnail row (max 5). Click opens full-size image in browser (native `window.open` or `<a target="_blank">`). No lightbox library needed — simple approach per YAGNI. |
| `src/components/kudos-live-board/heart-button.tsx` | Like/unlike toggle with count |
| `src/components/kudos-live-board/copy-link-button.tsx` | Copy URL + toast |
| `src/components/kudos-live-board/kudos-sidebar.tsx` | Sidebar container (sticky, independent scroll) |
| `src/components/kudos-live-board/stats-panel.tsx` | 6-row stats display |
| `src/components/kudos-live-board/secret-box-button.tsx` | "Mở Secret Box" CTA |
| `src/components/kudos-live-board/top-sunner-list.tsx` | Top 10 gift recipients list |
| `src/components/kudos-live-board/top-sunner-list-item.tsx` | Individual list item |
| `src/components/kudos-live-board/toast.tsx` | Toast notification component |
| **Types** | |
| `src/types/kudos.ts` | Kudos, Heart, Hashtag, Department, SecretBox, User, SpecialDay types + Zod schemas |
| **API Routes** | |
| `src/app/api/kudos/route.ts` | GET (paginated list + filters). Note: POST (create kudos) handler is scaffolded in this file but fully implemented when the Send Kudos dialog feature is built (out of scope for this spec). |
| `src/app/api/kudos/highlights/route.ts` | GET (top 5 by hearts + filters) |
| `src/app/api/kudos/[id]/like/route.ts` | POST (like), DELETE (unlike) |
| `src/app/api/hashtags/route.ts` | GET (all hashtags) |
| `src/app/api/departments/route.ts` | GET (all departments) |
| `src/app/api/spotlight/route.ts` | GET (word cloud data + total count) |
| `src/app/api/users/me/stats/route.ts` | GET (user kudos/heart/secret-box stats) |
| `src/app/api/users/me/secret-box/route.ts` | POST (open secret box) |
| `src/app/api/users/[id]/profile-preview/route.ts` | GET (profile preview data) |
| `src/app/api/sunners/top-gifts/route.ts` | GET (10 recent gift recipients) |
| `src/app/api/special-days/today/route.ts` | GET (is today special?) |
| **i18n** | |
| `src/i18n/kudos-live-board.ts` | Vietnamese + English dictionary |
| **Database** | |
| `supabase/migrations/YYYYMMDDHHMMSS_create_kudos_tables.sql` | Kudos, hearts, hashtags, secret_boxes, special_days tables + RLS |
| **Hooks** | |
| `src/hooks/use-heart-toggle.ts` | Debounced heart toggle with optimistic UI |
| `src/hooks/use-infinite-scroll.ts` | Intersection Observer for feed pagination |

### Modified Files

| File | Changes |
|------|---------|
| `src/components/ui/icon.tsx` | Add icons: heart, heart-filled, copy, arrow-right, gift, pan-zoom, pen, search, chevron-left, chevron-right, star |
| `src/app/globals.css` | Add Live Board design tokens (CSS variables) from design-style.md |
| `src/middleware.ts` | Add `/kudo/live` to protected routes (should already be covered by catch-all). Unauthenticated users are redirected to login. |
| `src/components/homepage/header.tsx` | Add optional `activePage?: string` prop; Live Board passes `"kudo-live"` to highlight nav item |
| `src/components/homepage/footer.tsx` | No changes needed — reuse as-is via direct import |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| — | — | No new dependencies needed. Spotlight Board will be implemented with native Canvas API or SVG (no d3/react-wordcloud) to avoid dependency bloat. If performance requires it, `d3-cloud` can be added later. |

---

## Implementation Strategy

### Phase 0: Asset Preparation & Foundation

**Goal**: Set up project scaffolding, types, design tokens, database, icons.

1. Download Figma assets (hero background image, any static images) to `public/images/kudos-live-board/`
2. Add design tokens to `globals.css` from design-style.md
3. Create `src/types/kudos.ts` with all Zod schemas and TypeScript types
4. Create database migration with all tables + RLS policies
5. Add new icons to `src/components/ui/icon.tsx`
6. Create `src/i18n/kudos-live-board.ts` dictionary
7. Create page route `src/app/kudo/live/page.tsx` (empty shell)

### Phase 1: Core Feed — US1 (P1) + US2 (P1)

**Goal**: Display kudos feed with like/unlike functionality. This is the MVP.

1. **API**: `GET /api/kudos` (paginated), `POST /api/kudos/:id/like`, `DELETE /api/kudos/:id/like`, `GET /api/special-days/today`
2. **Components**: `KudoPostCard`, `UserInfoBlock`, `StarCount`, `ImageGallery`, `HeartButton`, `CopyLinkButton` (shell only — renders icon + "Copy Link" text, clipboard logic wired in Phase 6), `Toast`
3. **Hook**: `useHeartToggle` (debounced, optimistic UI)
4. **Hook**: `useInfiniteScroll` (Intersection Observer)
5. **Test**: All acceptance scenarios for US1 (4) + US2 (6)

### Phase 2: Highlight Carousel — US3 (P1)

**Goal**: Center-focus carousel with navigation and pagination.

1. **API**: `GET /api/kudos/highlights`
2. **Components**: `HighlightSection`, `KudosCarousel`, `HighlightKudoCard`, `CarouselButton`, `PaginationIndicator`
3. **Behavior**: Center-focus effect (opacity + scale transitions), keyboard arrow navigation, disabled state at boundaries
4. **Test**: All acceptance scenarios for US3 (8)

### Phase 3: Filters — US4 (P2)

**Goal**: Hashtag + Department dropdown filters affecting both Highlight and All Kudos.

1. **API**: `GET /api/hashtags`, `GET /api/departments`
2. **Components**: `FilterDropdown` (reusable for both types, ARIA listbox)
3. **Integration**: Connect filters to `GET /api/kudos` and `GET /api/kudos/highlights` query params
4. **Behavior**: Hashtag click shortcut from cards, filter reset, carousel pagination reset
5. **Test**: All acceptance scenarios for US4 (7)

### Phase 4: Page Layout — US5 (P2) + US6 (P2) + US10 (P3)

**Goal**: Hero banner, search input trigger, sidebar stats, secret box, top sunner gift list.

1. **API**: `GET /api/users/me/stats`, `POST /api/users/me/secret-box`, `GET /api/sunners/top-gifts`
2. **Components**: `HeroBanner`, `KudosSearchInput`, `ProfileSearchButton` (UI-only), `KudosSidebar`, `StatsPanel`, `SecretBoxButton`, `TopSunnerList`, `TopSunnerListItem`
3. **Layout**: Sidebar sticky + independent scroll, responsive 2-column → stacked
4. **Test**: Acceptance scenarios for US5 (2) + US6 (3) + US10 (2)

### Phase 5: Spotlight Board — US7 (P2)

**Goal**: Interactive word cloud with search, pan/zoom.

1. **API**: `GET /api/spotlight`
2. **Components**: `SpotlightSection`, `SpotlightBoard` (canvas/SVG rendering)
3. **Behavior**: Name sizing by kudos count, hover tooltip, click navigation, search highlight, pan/zoom toggle
4. **Test**: Acceptance scenarios for US7 (6)
5. **Note**: Most technically complex component — isolate in own phase for focused development

### Phase 6: Polish — US8 (P3) + US9 (P3)

**Goal**: Copy link, profile navigation/hover, accessibility, responsive polish.

1. **Components**: Wire up `CopyLinkButton` (clipboard API + toast), profile click navigation, profile hover popover
2. **API**: `GET /api/users/:id/profile-preview`
3. **Accessibility audit**: ARIA roles, keyboard nav, focus management, screen reader testing
4. **Responsive testing**: Verify at 360px, 768px, 1440px breakpoints
5. **Test**: Acceptance scenarios for US8 (1) + US9 (2) + edge cases

### Phase 7: Header/Footer Integration & Final Assembly

**Goal**: Integrate shared header/footer, final page assembly, E2E tests.

1. Add `activePage` prop to Header component, pass `"kudo-live"` from Live Board page
2. Import Footer directly into Live Board page layout
3. Full page loading states (Suspense boundaries, skeleton loaders)
4. E2E test: Critical user flow (load page → browse → like → filter → carousel → copy link)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Carousel + Filters, HeartButton + Feed revalidation, Sidebar + Stats API
- [x] **External dependencies**: Supabase (auth session, database queries)
- [x] **Data layer**: Kudos CRUD, heart toggle with tim points, special day logic
- [x] **User workflows**: Browse → Like → Filter → Navigate

### Test Categories

| Category | Applicable | Key Scenarios |
|----------|-----------|---------------|
| UI ↔ Logic | Yes | Heart toggle updates count + sender tim; Filter updates carousel + feed; Carousel nav + pagination sync |
| App ↔ External API | Yes | Supabase auth session check; All Route Handler → Supabase queries |
| App ↔ Data Layer | Yes | Kudos pagination; Heart unique constraint; Special day multiplier; RLS policy enforcement |
| Cross-platform | Yes | Responsive layout at 360/768/1440; Touch swipe on mobile carousel |

### Test Environment

- **Environment**: Local (Supabase local via `make up` + Next.js dev server)
- **Test data**: Seed data fixtures in test setup (create test kudos, users, hashtags)
- **Isolation**: Transaction rollback per test, fresh Supabase state

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| Supabase DB | Real (local) | Constitution mandates integration tests hit real DB |
| Supabase Auth | Mock (test user session) | Simplify auth flow in tests; use fixed test session |
| Clipboard API | Mock | Not available in jsdom |
| Canvas/SVG (Spotlight) | Shallow render | Canvas rendering tested visually in E2E only |

### Test Scenarios Outline

**1. Happy Path**
- [x] Page loads with kudos feed, highlights, spotlight, sidebar stats
- [x] User likes a kudos → heart count increments, icon turns red
- [x] User unlikes → count decrements, icon turns gray
- [x] Carousel navigates forward/backward, pagination updates
- [x] Filter by hashtag → both sections update
- [x] Copy link → clipboard updated, toast appears
- [x] Infinite scroll loads next page of kudos

**2. Error Handling**
- [x] API error on kudos fetch → toast with retry
- [x] Heart toggle fails → optimistic UI reverts
- [x] Network offline → appropriate error states

**3. Edge Cases**
- [x] Empty feed → "Hiện tại chưa có Kudos nào." text
- [x] Fewer than 5 highlights → carousel adapts
- [x] Sender cannot like own kudos → button disabled
- [x] Special day heart gives 2x tim points
- [x] Clear filter resets to unfiltered state

### Tooling & Framework

- **Unit/Integration**: Vitest + React Testing Library (existing setup)
- **E2E**: Playwright (existing setup)
- **CI**: Tests run via `npm run test` (unit) and `npm run test:e2e` (E2E)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core components (Card, Heart, Carousel) | 90%+ | High |
| API Route Handlers | 85%+ | High |
| Hooks (useHeartToggle, useInfiniteScroll) | 90%+ | High |
| Spotlight Board | 60%+ | Medium (canvas hard to unit test) |
| Responsive layout | E2E visual | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Spotlight Board performance with 500+ names | Medium | High | Start with SVG; benchmark at 500 names; fall back to Canvas API or `d3-cloud` if < 60fps |
| Center-focus carousel complexity | Medium | Medium | Build carousel as isolated component with clear state machine (currentSlide, totalSlides); test all boundary states first |
| Infinite scroll + filter interaction | Low | Medium | Reset scroll position and pagination cursor when filter changes; clear cached pages |
| Heart toggle race conditions | Low | High | Debounce + optimistic UI with rollback; store `is_special_day` flag at write time |
| Header/Footer integration | Low | Low | Add `activePage` prop to existing Header; Footer reused as-is — no extraction or relocation needed |
| Database migration complexity (7 tables + RLS) | Low | Medium | Single migration file; test RLS policies with different user roles locally |

### Estimated Complexity

- **Frontend**: **High** — 25+ components, center-focus carousel, canvas word cloud, infinite scroll, optimistic mutations
- **Backend**: **Medium** — 11 Route Handlers, standard CRUD + pagination + aggregation
- **Testing**: **High** — 41+ acceptance scenarios, TDD required by constitution

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (status: Reviewed)
- [x] `design-style.md` complete
- [ ] Database migration planned (included in Phase 0)
- [ ] API contracts defined (predicted endpoints in spec — will finalize during implementation)

### External Dependencies

- Supabase local environment (`make up`)
- Hero banner background image (download from Figma)
- SVN-Gotham font (already available at `/public/fonts/svn-gotham.woff2`)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown from this plan
2. **Review** tasks.md for parallelization opportunities
3. **Begin** Phase 0 (asset prep + foundation)

---

## Notes

- The existing Header component in `src/components/homepage/header.tsx` will receive a new optional `activePage` prop — no extraction or relocation needed. Footer is reused as-is.
- No new npm packages are planned. The Spotlight Board will use native Canvas/SVG APIs. If this proves insufficient for performance, `d3-cloud` (ISC license, ~3KB gzipped) can be added as a dependency with constitution justification.
- The i18n pattern follows the existing cookie + props approach (no Context Provider needed). Language change on Live Board will follow the same pattern as Homepage/Awards pages.
- All 13 API endpoints are "predicted" — exact request/response schemas will be finalized during Phase 0 when types are created.
- The `TopSunnerList` component no longer has a `variant` prop — there is only ONE list ("10 SUNNER NHẬN QUÀ MỚI NHẤT") per user clarification.
- Profile Search Button is UI-only — rendered but non-functional (out of scope).
- **Image error handling**: All `<Image>` components (avatar, kudos images, hero background) must use `onError` fallback. Avatars fall back to initials placeholder. Kudos images hide the broken thumbnail. Hero banner falls back to solid gradient background. This is implemented in Phase 1 (ImageGallery, UserInfoBlock) and Phase 4 (HeroBanner).
