# Implementation Plan: Hệ Thống Giải (Award System)

**Frame**: `313-8436-He-thong-giai`
**Date**: 2026-03-11
**Spec**: `specs/313-8436-He-thong-giai/spec.md`

---

## Summary

Build the `/awards` page (Hệ Thống Giải) — a detailed award catalogue screen that displays a sticky left-nav menu linking to 6 award sections (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 Creator, MVP), each with a full award info card, plus a Sun* Kudos block at the bottom with a "Chi tiết" CTA that navigates same-tab to `/kudo/live`. The page is a React Server Component with a single client island (`AwardNavMenu`) that uses `IntersectionObserver` for scroll-spy state. All award data is static (already exists in `src/data/awards.ts`); no new API endpoint is required.

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15 App Router
**Primary Dependencies**: React 19 RSC, TailwindCSS 4.x, next/link, next/image
**Database**: N/A (static data)
**Testing**: Vitest + @testing-library/react (unit), Playwright (E2E)
**State Management**: Local React state (`activeSection` string in `AwardNavMenu`)
**API Style**: N/A — reads `AWARDS_SEED` directly in RSC (same pattern as `app/page.tsx`)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (Next.js App Router, TailwindCSS, `next/font/google`)
- [x] Adheres to folder structure guidelines (`src/components/awards/`, `src/app/awards/`, `src/hooks/`)
- [x] Meets security requirements (Supabase auth via existing middleware, no user input on this page)
- [x] Follows testing standards (TDD: write tests first, co-located `.test.tsx` files)

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| `"use client"` in `AwardNavMenu` | IntersectionObserver requires browser API; scroll-spy cannot be done in RSC | Server-side `activeSection` — not possible without JS interactivity |
| Route at `src/app/awards/page.tsx` (no `(protected)/` group) | TR-008 specifies `app/(protected)/` layout group, but the existing codebase uses global `middleware.ts` for auth — no `(protected)` group exists. Creating one now would require migrating the existing `app/page.tsx` homepage too. Middleware already protects `/awards` automatically. | Creating `app/(protected)/` group — rejected to avoid requiring a migration of unrelated pages in this PR |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — all new components under `src/components/awards/`
- **Styling Strategy**: TailwindCSS utility classes (no CSS modules), custom values via `[]` syntax for exact Figma tokens
- **Data Fetching**: RSC reads `AWARDS_SEED` directly (same pattern as `app/page.tsx` L11); no HTTP fetch needed
- **Scroll spy**: `useScrollSpy` hook (client-only) using `IntersectionObserver` — observes each `<section id="{slug}">` element (e.g. `id="top-talent"`, per spec FR-011) and returns the currently-visible section ID

### Backend Approach

- **No backend changes needed** — `/api/awards` route already exists and exposes `AWARDS_SEED`
- **Data extension**: `AWARDS_SEED` items need additional fields (`quantity`, `unit`, `prize`) for the award info cards; add these to the type and seed data

### Integration Points

- **Existing Services**: Supabase auth via `src/middleware.ts` (already protects all non-`/login` routes — `/awards` is automatically protected)
- **Shared Components**: `<Header />` from `src/components/homepage/header.tsx`, `<Footer />` from `src/components/homepage/footer.tsx`
- **Font**: `--font-montserrat` CSS variable already declared in `src/app/layout.tsx` — use via `font-[family-name:var(--font-montserrat)]` Tailwind class
- **API Contracts**: `AwardCategory` type in `src/types/homepage.ts` — will be extended (non-breaking)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/313-8436-He-thong-giai/
├── spec.md              # Feature specification ✅
├── design-style.md      # Visual design specs ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma frame reference
```

### Source Code (affected areas)

```text
src/
├── app/
│   └── awards/
│       └── page.tsx                         # NEW — RSC entry point for /awards
│
├── components/
│   ├── awards/                              # NEW — feature-specific components
│   │   ├── award-system-page.tsx            # NEW — top-level page layout (RSC)
│   │   ├── award-system-page.test.tsx       # NEW — unit tests
│   │   ├── award-nav-menu.tsx               # NEW — sticky left nav + nav items (client)
│   │   ├── award-nav-menu.test.tsx          # NEW — unit tests
│   │   ├── award-info-card.tsx              # NEW — full award detail card (RSC)
│   │   ├── award-info-card.test.tsx         # NEW — unit tests
│   │   ├── sun-kudos-block.tsx              # NEW — Sun* Kudos CTA block (RSC)
│   │   └── sun-kudos-block.test.tsx         # NEW — unit tests
│   │
│   └── ui/
│       └── icon.tsx                         # MODIFIED — add 4 new icons: target, diamond, license, ic-arrow
│
├── hooks/
│   ├── use-scroll-spy.ts                    # NEW — IntersectionObserver hook
│   └── use-scroll-spy.test.ts              # NEW — unit tests
│
├── types/
│   └── homepage.ts                          # MODIFIED — extend AwardCategory schema with optional fields
│
└── data/
    └── awards.ts                            # MODIFIED — add quantity/unit/prize/detailImageUrl fields
```

**Modified Files — Change Details:**

| File | What Changes |
|------|-------------|
| `src/types/homepage.ts` | Add optional fields to `AwardCategorySchema`: `quantity` (number), `unit` (string), `prize` (string), `detailImageUrl` (string). All optional to keep non-breaking. |
| `src/data/awards.ts` | Add `quantity`, `unit`, `prize`, `detailImageUrl` to all 6 awards per spec data table (exact values listed in Phase 1). |
| `src/components/ui/icon.tsx` | Add 4 new icon cases: `"target"` (24x24, nav item prefix icon `MM_MEDIA_Target`), `"diamond"` (24x24, quantity row icon `MM_MEDIA_Diamond`), `"license"` (24x24, value row icon `MM_MEDIA_License`), `"ic-arrow"` (24x24, button icon `IC`). SVG shapes to be extracted from Figma media files. |
| `src/components/ui/icon.test.tsx` | Add 4 new `it()` test cases (one per new icon) following the existing pattern: render `<Icon name="target" size={24} />` and assert SVG with `width="24"`, `height="24"`, `aria-hidden="true"`. |
| `src/components/homepage/header.tsx` | Update `NAV_LINKS`: change `href: "/awards-information"` → `href: "/awards"` for "Awards Information" link. |
| `src/components/homepage/footer.tsx` | Update footer nav links: change `href: "/awards-information"` → `href: "/awards"` (same fix as header). |

**No new npm dependencies required.** All packages are already in `package.json`.

---

## Implementation Strategy

### Phase 0: Asset Preparation

Before writing any code, download the required images from Figma and place them in `public/`:

**Important**: The hero area has TWO distinct visual elements — download both separately:

| Asset | Figma Node | Target Path | Notes |
|-------|-----------|-------------|-------|
| Hero background image (Keyvisual) | `313:8437` | `public/images/awards/kv-hero.png` | Full-width 1440x547px hero image with cover crop |
| KV block artwork (ROOT FURTHER logo) | `313:8450` | `public/images/awards/kv-root-further.png` | 338x150px decorative text artwork (separate from hero) |
| Top Talent award detail image | (inside `313:8467`) | `public/images/awards/top-talent.png` | 336x336px |
| Top Project award detail image | (inside `313:8468`) | `public/images/awards/top-project.png` | 336x336px |
| Top Project Leader award detail image | (inside `313:8469`) | `public/images/awards/top-project-leader.png` | 336x336px |
| Best Manager award detail image | (inside `313:8470`) | `public/images/awards/best-manager.png` | 336x336px |
| Signature 2025 Creator award detail image | (inside `313:8471`) | `public/images/awards/signature-creator.png` | 336x336px |
| MVP award detail image | (inside `313:8510`) | `public/images/awards/mvp.png` | 336x336px |
| Sun* Kudos decorative image | `I335:12023;313:8417` | `public/images/awards/sunkudos-deco.png` | 272x219px right-side artwork |

Use `mcp__momorph__get_media_files` with `fileKey: 9ypp4enmFmdK3YAFJLIu6C` and `frameId: 313:8436` to retrieve all images. Verify naming follows kebab-case before committing.

### Phase 1: Foundation — Types & Data (TDD Red → Green)

**Goal**: Extend the existing data model with award-detail fields.

1. **Write tests first** for the extended `AwardCategory` type (type-level tests via `z.parse`)
2. Extend `src/types/homepage.ts`:
   - Add optional fields to `AwardCategorySchema`: `quantity`, `unit`, `prize`, `detailImageUrl`
   - Keep existing fields unchanged (non-breaking extension)
3. Extend `src/data/awards.ts`:
   - Add `quantity`, `unit`, `prize`, `detailImageUrl` to each of the 6 awards
   - Exact data from spec (Award Data Summary table):
     - D.1 Top Talent: quantity=10, unit="Đơn vị", prize="7.000.000 VNĐ/giải", detailImageUrl="/images/awards/top-talent.png"
     - D.2 Top Project: quantity=2, unit="Tập thể", prize="15.000.000 VNĐ/giải", detailImageUrl="/images/awards/top-project.png"
     - D.3 Top Project Leader: quantity=3, unit="Cá nhân", prize="7.000.000 VNĐ/giải", detailImageUrl="/images/awards/top-project-leader.png"
     - D.4 Best Manager: quantity=1, unit="Cá nhân", prize="10.000.000 VNĐ/giải", detailImageUrl="/images/awards/best-manager.png"
     - D.5 Signature 2025 Creator: quantity=1, unit="Cá nhân / Tập thể", prize="5.000.000 / 8.000.000 VNĐ", detailImageUrl="/images/awards/signature-creator.png"
     - D.6 MVP: quantity=1, unit="", prize="15.000.000 VNĐ/giải", detailImageUrl="/images/awards/mvp.png"
4. Write `src/hooks/use-scroll-spy.ts`:
   - Takes `sectionIds: string[]` parameter
   - Uses `IntersectionObserver` with `threshold: 0.5` to detect the most-visible section
   - Returns `activeId: string` (never null) — defaults to `sectionIds[0]` on mount (spec: "Top Talent" is default active)
   - **Edge case (spec)**: When all award sections scroll out of view (user reaches Sun* Kudos block), the hook MUST keep the last active item (`"mvp"`) — do NOT deactivate when no section is intersecting. Use `useState` initialized to `sectionIds[0]` and only update when a new intersection entry fires; never reset to null.
5. **Tests**: `use-scroll-spy.test.ts` using `vi.stubGlobal('IntersectionObserver', ...)`:
   - Test: returns first sectionId on mount (default active)
   - Test: updates activeId when IntersectionObserver fires for a new section
   - Test: does NOT reset to null when observer fires with no intersecting entries (last item stays active)

### Phase 2: Core Components — Award Info Card & Nav Menu (US1, US2)

**Goal**: Implement the main visual components.

1. **Write tests first** for `AwardInfoCard` and `AwardNavMenu` (rendering, props)
2. Implement `src/components/awards/award-info-card.tsx` (RSC):
   - Props: `award: AwardCategory` (extended type)
   - Outer wrapper: `<section id={award.slug} aria-labelledby={`${award.slug}-title`}>` for scroll spy targeting and a11y (spec FR-011: `id="top-talent"` format)
   - Inner row (`I313:8467;214:2803`): `flex-direction: row`, `gap: 40px`, `width: 856px`
   - Left image block (`I313:8467;214:2525`): outer div `w-[336px] h-[336px]` with `border: 1px solid #FFEA9E`, `border-radius: 24px`, `mix-blend-mode: screen`, `box-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`; contains `<Image src={award.detailImageUrl} alt={`Hình ảnh giải thưởng ${award.name}`} width={336} height={336} sizes="336px" />`
   - Right content block (`I313:8467;214:2526`): `width: 480px`, `flex-direction: column`, `gap: 32px`, `border-radius: 16px`, `backdrop-filter: blur(32px)`
     - `<h2 id={`${award.slug}-title`}>` award title: Montserrat 24px 700, `color: #FFEA9E`
     - Description: Montserrat 16px 700, `color: #FFFFFF`, `text-align: justify`
     - Divider `1px solid #2E3940`
     - Quantity metadata row: `<Icon name="diamond" size={24} />` + label "Số lượng giải thưởng:" (24px 700 `#FFEA9E`) + quantity number (36px 700 white) + unit (14px 700 white)
     - Divider `1px solid #2E3940`
     - Prize value row: `<Icon name="license" size={24} />` + label "Giá trị giải thưởng:" (24px 700 `#FFEA9E`) + prize value (36px 700 white) + sub-label "cho mỗi giải thưởng" (14px 700 white)
   - **Bottom divider**: `1px solid #2E3940` after each card (per component hierarchy `313:8467` layout)
3. Implement `src/components/awards/award-nav-menu.tsx` (`"use client"`):
   - Props: `categories: { slug: string; name: string }[]`
   - Consumes `useScrollSpy(sectionIds)` internally (no external `activeId` prop needed)
   - Sticky: `position: sticky; top: 80px` (header height from `src/components/homepage/header.tsx` h-20)
   - Active item styles: `border-bottom: 1px solid #FFEA9E` (FR-005), text `color: #FFEA9E`, `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`
   - Inactive item styles: text `color: #FFFFFF`, no border
   - Hover styles: `background: rgba(255,234,158,0.1)`, cursor pointer
   - Nav item prefix icon: `<Icon name="target" size={24} />` (24x24, `MM_MEDIA_Target`)
   - Click → `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
   - ARIA: wrapping `<nav aria-label="Danh mục giải thưởng">`, `aria-current="true"` on active `<button>` or `<a>`
   - Each nav item is a `<button>` (keyboard accessible, `Enter`/`Space` to activate)
4. Implement `src/components/awards/sun-kudos-block.tsx` (RSC):
   - Outer wrapper `335:12023`: `width: 100%`, `height: 500px`, `display: flex, flex-direction: column, align-items: center, justify-content: center`
   - Inner card `I335:12023;313:8415`: `background: #0F0F0F`, `border-radius: 16px`, `overflow: hidden`, `display: flex`, **`flex-direction: row`** (left content + right image side by side), `width: 100%`, `height: 500px`
   - Left content block `I335:12023;313:8419`: `width: 470px`, `height: 408px`, `display: flex`, `flex-direction: column`, `justify-content: center`, `gap: 32px`, (padded inside card)
     - "Phong trào ghi nhận" label: 24px 700 `#FFFFFF`, `line-height: 32px`
     - "Sun* Kudos" title: 57px 700 `#FFEA9E`, `line-height: 64px`, `letter-spacing: -0.25px`
     - Description text (exact — see design-style.md for full string): 16px 700 `#FFFFFF`, `letter-spacing: 0.5px`, `text-align: justify`, `line-height: 24px`
   - "Chi tiết" button `I335:12023;313:8426`: `<Link href="/kudo/live">`, `bg-[#FFEA9E] text-[#00101A]`, `width: 127px`, `height: 56px`, `padding: 16px`, `display: flex`, `align-items: center`, `gap: 8px`, **`border-radius: 4px`** (NOT 8px), Montserrat **16px** 700, `letter-spacing: 0.15px`, hover: `bg-[#F5DF8A]`, focus: `outline: 2px solid #FFEA9E outline-offset-2`, `aria-label="Xem Sun* Kudos Live board"`, `<Icon name="ic-arrow" size={24} />` on the right
   - Right column `I335:12023;313:8417`: `<Image src="/images/awards/sunkudos-deco.png" alt="" width={272} height={219} sizes="272px" />` (decorative — `alt=""` per WCAG spec for decorative images)

### Phase 3: Page Assembly (US1)

**Goal**: Wire everything together into the `/awards` route.

1. **Write tests first** for `AwardSystemPage` (snapshot / render test)
2. Implement `src/components/awards/award-system-page.tsx` (RSC):
   - Props: `{ awards: AwardCategory[]; lang: LanguagePreference }`
   - `<Header initialLang={lang} />` (fixed, z-40)
   - Keyvisual section `313:8437`: `<div className="relative w-full h-136.75 overflow-hidden">` (547px = 136.75 × 4) containing `<Image src="/images/awards/kv-hero.png" alt="Keyvisual Sun* Annual Award 2025" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />` + absolute gradient overlay div `313:8439`
   - **`<main>`** landmark wrapping all content below the header (constitution IV: semantic HTML required)
     - Content area `313:8449`: `flex flex-col gap-[120px] px-[144px] py-24`
       - KV block `313:8450`: `<div className="w-full h-37.5">` (150px = 37.5 × 4) containing `<Image src="/images/awards/kv-root-further.png" alt="" width={338} height={150} sizes="338px" />` (ROOT FURTHER artwork, decorative `alt=""`)
       - Title section `313:8453`: `<p>` subtitle "Sun* annual awards 2025" (24px 700 white center) + `<hr>` divider + `<h1>` main title "Hệ thống giải thưởng SAA 2025" (57px 700 `#FFEA9E`)
       - Award system row `313:8458`: `<div className="flex flex-row gap-20 w-full">`
         - Left: `<AwardNavMenu categories={awards} />` (w-[178px] sticky top-20)
         - Right: `<div className="flex flex-col gap-20 flex-1">` containing `<AwardInfoCard award={a} key={a.id} />` × 6
       - `<SunKudosBlock />`
   - `<Footer />`
3. Implement `src/app/awards/page.tsx` (RSC):
   - Reads `AWARDS_SEED` directly (no HTTP fetch)
   - Reads `lang` from cookies — **same pattern as `app/page.tsx`** (no `force-static`; awards page is server-rendered per-request just like the homepage)
   - **Do NOT add `export const dynamic = 'force-static'`** — this conflicts with `cookies()` which requires dynamic rendering. The page is already fast because `AWARDS_SEED` is an in-memory constant, not a DB call.
   - Returns `<AwardSystemPage awards={AWARDS_SEED} lang={lang} />`
   - Add metadata via `export const metadata`: `{ title: "Hệ Thống Giải | Sun Annual Awards 2025" }`

### Phase 4: Responsive & Accessibility Polish (US3, US4)

**Goal**: Ensure WCAG 2.1 AA compliance and responsive layout at 360px/768px/1440px.

1. Mobile (360px): stack layout — nav collapses to horizontal scroll row at top, cards go full-width, image hidden or below text
2. Tablet (768px): single column with nav as top scrollable row
3. Desktop (1440px): full two-column layout per Figma spec
4. Keyboard navigation: tab through nav items, Enter/Space to jump to section
5. `aria-current` updates on scroll (driven by `useScrollSpy`)
6. All images have meaningful `alt` text

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: `AwardNavMenu` ↔ `useScrollSpy` (IntersectionObserver → active item highlight)
- [x] **User workflows**: Scroll to section → nav highlights; click nav item → smooth scroll; click "Chi tiết" → navigate to `/kudo/live`
- [ ] **External dependencies**: N/A (static data, no API calls on this page)
- [ ] **Data layer**: N/A

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Scroll spy updates active nav item; click nav scrolls to section |
| Service ↔ Service | No | — |
| App ↔ External API | No | Awards data is static |
| App ↔ Data Layer | No | — |
| Cross-platform | Yes | Responsive at 360px / 768px / 1440px |

### Test Environment

- **Environment type**: Local (Vitest + jsdom for unit; Playwright for E2E)
- **Test data strategy**: Static `AWARDS_SEED` fixture (already in codebase)
- **Isolation approach**: Fresh React tree per test, `IntersectionObserver` stubbed via `vi.stubGlobal`

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| IntersectionObserver | `vi.stubGlobal` stub | jsdom does not implement IntersectionObserver |
| `document.getElementById().scrollIntoView` | `vi.fn()` mock | jsdom scroll is no-op |
| `next/navigation` (usePathname) | `vi.mock` | Prevent router errors in unit tests |
| `next/image` | Real (renders `<img>`) | next/image works in Vitest with `@/test-setup.ts` |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Page renders all 6 award sections with correct titles and correct data (quantity/unit/prize per spec table)
   - [ ] Nav menu shows 6 items in correct order (Top Talent → MVP)
   - [ ] "Chi tiết" button renders as `<a>` pointing to `/kudo/live` (not `target="_blank"`)
   - [ ] Active nav item shows `border-bottom: 1px solid #FFEA9E` AND text `#FFEA9E` when section is intersecting (FR-005)
   - [ ] Clicking a nav item calls `scrollIntoView({ behavior: 'smooth' })` on the correct section element
   - [ ] `useScrollSpy` returns first sectionId (`"top-talent"`) as default on mount (US2 scenario 4)

2. **Accessibility**
   - [ ] `<nav aria-label="Danh mục giải thưởng">` wraps the nav menu
   - [ ] Active nav item has `aria-current="true"` attribute
   - [ ] Each award section has `<section aria-labelledby="{slug}-title">` and `<h2 id="{slug}-title">`
   - [ ] "Chi tiết" button has `aria-label="Xem Sun* Kudos Live board"`
   - [ ] Keyvisual image has `alt="Keyvisual Sun* Annual Award 2025"`

3. **Error Handling**
   - [ ] Page renders without errors when `detailImageUrl` is missing (optional field — shows placeholder or empty image)
   - [ ] Nav renders correctly when `IntersectionObserver` fires no entries (first item stays active)

4. **Edge Cases**
   - [ ] All 6 awards render even if `quantity`/`unit`/`prize` are undefined (optional fields)
   - [ ] `useScrollSpy` keeps last active item ("mvp") when user scrolls past all awards into Sun* Kudos (does NOT reset to null or first item)

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react
- **Supporting tools**: `vi.stubGlobal`, `@testing-library/user-event`
- **CI integration**: `yarn test` runs all unit tests; Playwright runs in CI on push

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `useScrollSpy` hook | 90%+ | High |
| `AwardNavMenu` component | 85%+ | High |
| `AwardInfoCard` component | 80%+ | Medium |
| `SunKudosBlock` component | 80%+ | Medium |
| `AwardSystemPage` integration | 80%+ | High |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| IntersectionObserver inconsistency in tests | Medium | Medium | Use `vi.stubGlobal` pattern from `src/hooks/use-countdown.test.ts` as reference |
| `mix-blend-mode: screen` not rendering as expected | Low | Low | Test visually in browser; no automated test for blend modes |
| `AWARDS_SEED` data extension breaks existing Homepage tests | Low | Medium | All new fields are optional in Zod schema; existing tests pass unchanged |
| Smooth scroll not working in Playwright E2E | Low | Low | Use `page.waitForSelector` on visible target element instead of scroll event |
| `position: sticky` nav broken on iOS Safari | Medium | Medium | Add `sticky` (no vendor prefix needed in Safari 14+); test in Safari DevTools |
| `backdrop-filter: blur` parent has `overflow: hidden` | Medium | Medium | Do not set `overflow: hidden` on scroll container — keep it on hero image only |
| New icons (`target`, `diamond`, `license`, `ic-arrow`) not yet in `icon.tsx` | High | High | Must be added to `icon.tsx` before `AwardNavMenu`/`AwardInfoCard` can render; schedule as first task in Phase 2 |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (fully reviewed — see review passes 1 & 2)
- [x] `design-style.md` accurate (critical fixes applied in review)
- [ ] Phase 0 assets downloaded from Figma to `public/images/awards/`
- [ ] `AWARDS_SEED` data extended with `quantity`, `unit`, `prize`, `detailImageUrl`

### External Dependencies

- None — all libraries already installed; Montserrat font already loaded in root layout

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** `tasks.md` for parallelization opportunities (Phase 1 foundation can be parallelized with Phase 0 assets)
3. **Begin** implementation following TDD: write failing tests → implement → refactor

---

## Notes

- **Hero area has two distinct elements**: `313:8437` is the 547px hero background image (`kv-hero.png`); `313:8450` is the 150px KV block with the ROOT FURTHER artwork (`kv-root-further.png`). They must be downloaded separately and implemented as separate elements in the page layout.
- **`header.tsx` nav link fix is in scope**: The `NAV_LINKS` in both `src/components/homepage/header.tsx` and `src/components/homepage/footer.tsx` currently point to `/awards-information`. After implementing this screen, both files must be updated to `href: "/awards"`. This is listed in the Modified Files table.
- **Footer also needs href update**: `src/components/homepage/footer.tsx` has the same `"/awards-information"` link — update it too.
- `AWARDS_SEED` in `src/data/awards.ts` was designed for the Homepage awards carousel (thumbnail only). The detail-page fields (`quantity`, `unit`, `prize`, `detailImageUrl`) are additive and all optional — no existing tests or API contracts are affected.
- The existing `/api/awards` route returns `AwardCategory` objects — its response shape will also include the new optional fields once the type is extended (non-breaking addition).
- Glassmorphism (`backdrop-filter: blur(32px)`) requires no `overflow: hidden` on the scroll container — only use `overflow: hidden` on the hero image container (`313:8437`).
- `export const dynamic = 'force-static'` is intentionally **NOT used** — it would conflict with `cookies()` which makes the page dynamic. The page is fast enough without static generation since `AWARDS_SEED` is an in-memory constant (no I/O). Follow the same pattern as `app/page.tsx`.
- The `<AwardNavItem>` is rendered inline inside `AwardNavMenu` — no separate file needed. The nav items are `<button>` elements (keyboard navigable) that call `scrollIntoView` on click.
