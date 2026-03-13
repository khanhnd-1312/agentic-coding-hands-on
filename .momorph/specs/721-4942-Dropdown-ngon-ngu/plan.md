# Implementation Plan: Dropdown-ngon-ngu (Language Dropdown)

**Frame**: `721-4942-Dropdown-ngon-ngu`
**Date**: 2026-03-13
**Spec**: `specs/721-4942-Dropdown-ngon-ngu/spec.md`
**Status**: Reviewed

---

## Summary

Update the existing `LanguageSelector` component to match the Figma design (gold-themed dropdown with flag icons and highlighted selected state). Add the missing `flag-en` icon, fix visual styling divergence, implement full ARIA listbox keyboard navigation, and ensure i18n integration works across all screens.

This is primarily a **refactor + enhancement** of an existing component — not a greenfield build. The core toggle/cookie/callback logic already works; the main effort is visual alignment with Figma and accessibility improvements.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Montserrat font (Google Fonts)
**Database**: N/A — purely client-side component
**Testing**: Vitest + React Testing Library (unit/integration)
**State Management**: Local state (`useState`) + cookie persistence + parent callback
**API Style**: N/A — no API calls

### Component State

| State | Type | Default | Scope | Phase |
|-------|------|---------|-------|-------|
| `isOpen` | `boolean` | `false` | Existing | — |
| `focusedIndex` | `number` | `-1` | New (Phase 3) | Keyboard focus tracking for ArrowUp/Down navigation |

### Props (unchanged)

| Prop | Type | Required |
|------|------|----------|
| `lang` | `LanguagePreference` | Yes |
| `onLangChange` | `(lang: LanguagePreference) => void` | Yes |

### i18n Integration Pattern

The `LanguageSelector` does **NOT** import i18n dictionaries directly. Integration works through the callback chain:
1. User selects language → component sets cookie + calls `onLangChange(newLang)`
2. Parent component (Header/LoginPage) receives callback → updates its own `lang` state
3. Parent passes `lang` to children → children use `dictionary[lang]` from i18n modules
4. No full-page reload needed — React re-renders with new dictionary

This means TR-009 (i18n integration) is satisfied by the existing architecture. No changes needed to i18n files themselves.

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, kebab-case files, PascalCase components)
- [x] Uses approved libraries and patterns (React, TailwindCSS, `@/` imports)
- [x] Adheres to folder structure guidelines (co-located tests, `src/components/`)
- [x] Meets security requirements (no secrets, no raw HTML injection)
- [x] Follows testing standards (TDD: Red-Green-Refactor, co-located `.test.tsx` files)
- [x] Client component justified (`"use client"` — uses `useState`, `useEffect`, `useRef`, `document.cookie`)
- [x] Mobile-first styling: component has fixed dimensions (dropdown overlay), no responsive changes needed — justified per design-style.md responsive section
- [x] WCAG 2.1 AA: ARIA listbox pattern, visible focus rings, keyboard navigation planned

**Violations**: None. All changes use existing approved patterns.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Update existing `LanguageSelector` in-place at `src/components/login/language-selector.tsx`. This component owns both the trigger button and dropdown panel — no need to split since they share state (`isOpen`).
- **Styling Strategy**: Tailwind utility classes with Figma-extracted values (inline arbitrary values like `bg-[#00070C]`). No new CSS files or CSS variables needed.
- **Data Fetching**: None. Language preference is read from cookie on server (page components), passed as prop, and updated on client via `document.cookie`.

### Backend Approach

- N/A — purely client-side. Cookie is read server-side in page components using `cookies()` from `next/headers` (already implemented).

### Integration Points

- **Existing Services**: Cookie-based language persistence (already working)
- **Shared Components**: `<Icon>` component (`src/components/ui/icon.tsx`) — needs `flag-en` addition
- **i18n Dictionaries**: `src/i18n/homepage.ts`, `src/i18n/countdown-prelaunch.ts` — consumed by parent components via callback pattern (see i18n Integration Pattern above)
- **Parent Components**: `Header` (`src/components/homepage/header.tsx`), Login page — both already use `<LanguageSelector>`

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721-4942-Dropdown-ngon-ngu/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
└── assets/              # Screenshots
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── page.tsx                         # UPDATE Zod cookie validation (Phase 4)
│   ├── login/page.tsx                   # UPDATE Zod cookie validation (Phase 4)
│   └── awards/page.tsx                  # UPDATE Zod cookie validation (Phase 4)
├── components/
│   ├── ui/
│   │   ├── icon.tsx                    # ADD flag-en SVG (Phase 1)
│   │   └── icon.test.tsx               # ADD flag-en test (Phase 1)
│   └── login/
│       ├── language-selector.tsx        # UPDATE visual + keyboard + ARIA (Phase 2-4)
│       └── language-selector.test.tsx   # UPDATE all tests (Phase 2-4)
└── types/
    └── login.ts                         # NO CHANGE (LanguagePreference already correct)
```

### Modified Files

| File | Changes |
|------|---------|
| `src/components/ui/icon.tsx` | Add `flag-en` SVG icon (Union Jack, 20x15 in 24x24 viewBox) |
| `src/components/ui/icon.test.tsx` | Add test for `flag-en` icon rendering |
| `src/components/login/language-selector.tsx` | Update dropdown styling to Figma gold theme; update `LANG_OPTIONS` labels to short codes ("VN"/"EN"); add ARIA listbox pattern with i18n-aware `aria-label`; add full keyboard navigation (ArrowUp/Down with wrapping, focusedIndex state); add scroll-close; add focus ring styling; add animation with pointer-events guard |
| `src/components/login/language-selector.test.tsx` | Update tests for new visual classes; add keyboard navigation tests; add ARIA attribute tests; add scroll-close test; add label display tests |
| `src/app/page.tsx` | Add Zod validation for `lang` cookie: `z.enum(["vi", "en"]).catch("vi").parse(value)` replacing raw `as LanguagePreference` cast |
| `src/app/login/page.tsx` | Same Zod cookie validation |
| `src/app/awards/page.tsx` | Same Zod cookie validation |

### New Files

None. All changes are to existing files.

### Dependencies

None. No new packages needed. (Zod is already in project deps per constitution.)

---

## Implementation Strategy

### Phase 0: Asset Preparation

- **flag-en icon**: Create Union Jack SVG inline in `icon.tsx`, following the same pattern as `flag-vn`. The flag is 20x15px centered in a 24x24 viewBox.
- No other assets needed (no images, no downloads from Figma).

### Phase 1: Foundation — Icon + Tests (US prerequisite)

**Goal**: Add `flag-en` icon so the dropdown can render both flags.

1. **RED**: Write failing test in `icon.test.tsx` for `<Icon name="flag-en" size={24} />`
   - Assert: renders `<svg>` with `width="24"` and `height="24"`
   - Assert: has `aria-hidden="true"`
2. **GREEN**: Add `flag-en` SVG case in `icon.tsx` (Union Jack design at 20x15px in 24x24 viewBox)
3. **REFACTOR**: Verify test passes, no regressions in existing icon tests

### Phase 2: Core Features — Visual Update + Toggle (US1 + US2)

**Goal**: Update dropdown styling to match Figma and ensure toggle behavior works.

1. **RED**: Update `language-selector.test.tsx`:
   - Assert: dropdown container has classes matching Figma (`bg-[#00070C]`, `border-[#998C5F]`, `rounded-lg`)
   - Assert: selected option has `bg-[rgba(255,234,158,0.2)]` highlight
   - Assert: unselected option has transparent background
   - Assert: option items render flag icon + short code label ("VN" not "Tiếng Việt (VI)")
   - Assert: trigger button renders `flag-vn` icon when `lang="vi"` and `flag-en` icon when `lang="en"` (existing code hard-codes `flag-vn` — must fix)
   - Assert: clicking option changes language and closes dropdown (update existing test — option accessible name changes from "English (EN)" to just "EN")
   - Assert: clicking outside closes dropdown (existing)
   - Assert: Escape closes dropdown (existing)
   - Assert: scroll closes dropdown (NEW)

2. **GREEN**: Update `language-selector.tsx`:
   - **`LANG_OPTIONS` labels**: Change from `{ value: "vi", label: "Tiếng Việt (VI)" }` → `{ value: "vi" as const, label: "VN", flag: "flag-vn" }` and `{ value: "en" as const, label: "EN", flag: "flag-en" }`. Each option renders `<Icon name={option.flag} size={24} />` + `<span>{option.label}</span>`
   - **Trigger button flag (BUG FIX)**: The trigger currently **hard-codes** `<Icon name="flag-vn" />` (line 48). Must update to dynamically render the correct flag: derive `currentOption = LANG_OPTIONS.find(o => o.value === lang)!` and render `<Icon name={currentOption.flag} size={24} />`. The label already works correctly via `const label = lang === "vi" ? "VN" : "EN"`.
   - **Trigger button scope**: Visual styling of the trigger itself is defined in Login/Homepage specs — this task only updates the flag icon + label content to be dynamic
   - **Dropdown container**: Replace `bg-[rgba(11,15,18,0.95)]` → `bg-[#00070C]`, `border-[#2E3940]` → `border-[#998C5F]`, `rounded-md` → `rounded-lg`. Remove `min-w-[140px]` and `overflow-hidden` (not in Figma). Add `p-1.5 z-[100]`. Keep `absolute top-full right-0 mt-1`
   - **Selected option**: Replace teal text indicator (`text-[#15D5CA]`) → gold background highlight (`bg-[rgba(255,234,158,0.2)] rounded-sm`)
   - **Option items**: `w-[110px] h-14 cursor-pointer`, inner button: `flex items-center justify-between p-4 rounded gap-0.5`, content group: `flex items-center gap-1` (Figma has 3 nesting levels: option → inner button → content group; flatten inner+content into one `flex` if only flag+text are children — use `gap-1` between flag and text, `p-4` for padding)
   - **Hover state**: `hover:bg-[rgba(255,234,158,0.1)]`
   - **Text**: `font-montserrat text-base font-bold text-white tracking-[0.15px]`
   - **Animation**: `transition-all duration-150 ease-out` on dropdown, `opacity` + `scale-y-95` → `scale-y-100`, `transform-origin: top`
   - **Scroll close**: Add `useEffect` with `window.addEventListener("scroll", close)` when open, cleanup on close/unmount

3. **REFACTOR**: Clean up any leftover old styles, remove old `LANG_OPTIONS` format, verify all tests pass

### Phase 3: Accessibility — ARIA + Keyboard (US4)

**Goal**: Implement full ARIA listbox pattern and keyboard navigation.

1. **RED**: Add keyboard navigation tests in `language-selector.test.tsx`:
   - **⚠️ BREAKING CHANGE**: Changing `aria-label` to i18n-aware means all existing test queries using `getByRole("button", { name: "Select language" })` with `lang="vi"` will break. Update these queries FIRST: for `lang="vi"` use `{ name: "Chọn ngôn ngữ" }`, for `lang="en"` use `{ name: "Select language" }`.
   - Assert: trigger has `aria-haspopup="listbox"`, `aria-expanded="false"` when closed / `"true"` when open
   - Assert: trigger has `aria-label="Chọn ngôn ngữ"` when `lang="vi"` / `aria-label="Select language"` when `lang="en"`
   - Assert: dropdown has `role="listbox"`, `aria-labelledby={triggerId}`
   - Assert: each option has `role="option"`, `aria-selected="true"` for selected / `"false"` for unselected
   - Assert: Enter/Space on trigger opens dropdown, focus moves to selected option
   - Assert: ArrowDown moves focus to next option (wraps from EN → VN)
   - Assert: ArrowUp moves focus to previous option (wraps from VN → EN)
   - Assert: Enter/Space on focused option selects it and closes dropdown
   - Assert: Escape closes dropdown and returns focus to trigger
   - Assert: Tab closes dropdown
   - Assert: focused option has visible focus ring (`outline: 2px solid #998C5F, outline-offset: -2px`)

2. **GREEN**: Implement in `language-selector.tsx`:
   - **ARIA on trigger**: `aria-haspopup="listbox"`, `aria-expanded={isOpen}`, `aria-label={lang === "vi" ? "Chọn ngôn ngữ" : "Select language"}`
   - **Trigger ID**: Add `const triggerId = useId()` and set `id={triggerId}` on the trigger `<button>` element
   - **ARIA on dropdown**: `role="listbox"`, `aria-labelledby={triggerId}`
   - **ARIA on options**: `role="option"`, `aria-selected={option.value === lang}`, `tabIndex={isFocused ? 0 : -1}`
   - **New state**: `focusedIndex: number` (default -1, set to selected option index on open)
   - **Element type decision**: Keep existing `<ul>/<li>` semantic elements with ARIA roles (valid per WAI-ARIA). No need to switch to `<div>`.
   - **Refs**: `triggerRef = useRef<HTMLButtonElement>(null)`, `optionRefs = useRef<(HTMLLIElement | null)[]>([])`
   - **`onKeyDown` on trigger**: Enter/Space → open + set focusedIndex to selected
   - **`onKeyDown` on listbox**: ArrowDown → focusedIndex = (current + 1) % 2; ArrowUp → focusedIndex = (current - 1 + 2) % 2; Enter/Space → select + close; Escape → close + focus trigger; Tab → close
   - **`useEffect`**: when `focusedIndex` changes and >= 0, call `optionRefs.current[focusedIndex]?.focus()`
   - **Focus ring**: `focus-visible:outline-2 focus-visible:outline-[#998C5F] focus-visible:outline-offset-[-2px]` on option elements

3. **REFACTOR**: Ensure all keyboard paths work smoothly, no regressions

### Phase 4: Persistence & Edge Cases (US3 + Edge Cases)

**Goal**: Ensure cookie persistence is robust, viewport overflow is handled, and edge cases work.

1. **RED**: Add tests:
   - Assert: corrupted/invalid cookie value falls back to "vi" (test at page component level if applicable, or verify guard logic)
   - Assert: rapid toggle doesn't break animation (`pointer-events: none` during transition)
   - Assert: dropdown renders flag-en when `lang="en"` is passed
   - Assert: clicking already-selected option closes dropdown without calling `onLangChange`

2. **GREEN**: Implement:
   - **Cookie validation**: All 3 page components that read the `lang` cookie currently use unsafe `as LanguagePreference` cast. Add Zod validation to each: `z.enum(["vi", "en"]).catch("vi").parse(cookieValue)`. Files: `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/awards/page.tsx`. Constitution requires Zod for all I/O boundaries.
   - **Already-selected guard**: Update `handleSelect` to check `if (value === lang) { setIsOpen(false); return; }` — close dropdown without calling `onLangChange` or writing cookie when clicking the already-active language (spec US1.3)
   - **Animation guard**: Add `pointer-events-none` class during 150ms transition to prevent rapid toggle glitches
   - **Viewport overflow**: Use simple CSS `right: 0` positioning on the dropdown to anchor to the right edge of the trigger (since the trigger is in the header's right group). This prevents right-edge overflow on narrow viewports (360px). Full upward-opening logic is deferred as P3 enhancement — the dropdown is small (124px tall) and the trigger is at the top of the page, so bottom-overflow is unlikely.
   - **Trigger button label**: Verify "VN"/"EN" displays correctly with corresponding flag for both `lang` values

3. **REFACTOR**: Final cleanup, remove any dead code from old styling

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: LanguageSelector ↔ Icon component, LanguageSelector ↔ parent Header
- [ ] **External dependencies**: None (no APIs)
- [x] **Data layer**: Cookie read/write (client-side `document.cookie`)
- [x] **User workflows**: Open dropdown → select language → UI updates → cookie persists

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Toggle open/close, language selection, cookie write, label display |
| Service ↔ Service | No | N/A |
| App ↔ External API | No | N/A |
| App ↔ Data Layer | Yes | Cookie read on server, cookie write on client |
| Cross-platform | Yes | Verify at 360px, 768px, 1440px (manual/Playwright) |

### Test Environment

- **Environment type**: Local (Vitest + jsdom)
- **Test data strategy**: Props-based (pass `lang` and `onLangChange` directly)
- **Isolation approach**: Fresh component render per test, mock `document.cookie`

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Icon component | Real | Small, fast, no external deps |
| document.cookie | Spy/Mock | Need to verify cookie writes without real browser |
| window.scroll | Mock | Need to trigger scroll event in tests |
| useRef/focus | Real | Test actual DOM focus management |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Renders trigger with `flag-vn` icon and label "VN" for `lang="vi"`
   - [x] Renders trigger with `flag-en` icon and label "EN" for `lang="en"`
   - [x] Opens dropdown on trigger click
   - [x] Selects EN, calls `onLangChange("en")`, sets cookie, closes dropdown
   - [x] Selected option shows gold highlight background
   - [x] Unselected option shows transparent background
   - [x] Fixed order: VN always first, EN always second regardless of selection

2. **Keyboard Navigation**
   - [x] Enter/Space opens dropdown from trigger, focus moves to selected option
   - [x] ArrowDown/Up navigates options with wrapping
   - [x] Enter/Space selects focused option
   - [x] Escape closes and returns focus to trigger
   - [x] Tab closes dropdown
   - [x] Focused option has visible focus ring

3. **ARIA Attributes**
   - [x] Trigger: `aria-haspopup="listbox"`, `aria-expanded`, i18n-aware `aria-label`
   - [x] Dropdown: `role="listbox"`, `aria-labelledby`
   - [x] Options: `role="option"`, `aria-selected`

4. **Edge Cases**
   - [x] Clicking outside closes dropdown
   - [x] Scroll closes dropdown
   - [x] Clicking already-selected option closes without change
   - [x] Rapid toggle doesn't break animation
   - [x] Dropdown does not overflow viewport right edge at 360px

### Tooling & Framework

- **Test framework**: Vitest + React Testing Library
- **Supporting tools**: `@testing-library/user-event` for keyboard simulation
- **CI integration**: `yarn test` in pre-commit hook and CI pipeline

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| LanguageSelector component | 90%+ | High |
| Icon (flag-en) | 100% | High |
| Keyboard navigation paths | 100% | High |
| ARIA attributes | 100% | Medium |
| Edge cases (scroll, rapid toggle) | 80%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| flag-en SVG complexity (Union Jack has many paths) | Medium | Low | Use simplified SVG; match the style of the existing flag-vn (minimal detail at 20x15px) |
| Keyboard focus management across open/close | Medium | Medium | Use `useRef` array + `useEffect` to manage focus; test thoroughly with RTL; use `useId()` for stable ARIA IDs |
| Animation glitch on rapid toggle | Low | Low | Add `pointer-events: none` during transition; 150ms is short enough that debounce is unnecessary |
| Header test regressions (mocks LanguageSelector) | Low | Low | Header tests mock the component — internal changes won't break them |
| Existing Login page test regressions | Low | Medium | Run full test suite after each phase; tests already cover core behavior |
| Viewport overflow at 360px | Low | Low | Use `right: 0` positioning to anchor dropdown to right edge; dropdown is narrow (~122px) |

### Estimated Complexity

- **Frontend**: Low-Medium (refactor existing component, not building from scratch)
- **Backend**: None
- **Testing**: Medium (keyboard navigation has many paths to cover)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (status: Reviewed)
- [x] `design-style.md` complete with implementation mapping
- [ ] N/A — API contracts (no APIs needed)
- [ ] N/A — Database migrations (no DB changes)

### External Dependencies

- None. All work is self-contained within the existing codebase.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown from this plan
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following TDD Red-Green-Refactor cycle

---

## Notes

- The component lives at `src/components/login/language-selector.tsx` but is used by **both** Login and Homepage headers. Consider renaming/relocating to `src/components/ui/language-selector.tsx` in a future refactor — but NOT in this task (avoid scope creep).
- The `LANG_OPTIONS` array in the existing component uses `{ value: "vi", label: "Tiếng Việt (VI)" }` format with full language names. **Must update** to `{ value: "vi", label: "VN", flag: "flag-vn" }` format to match Figma. This is covered in Phase 2.
- Montserrat Bold is already loaded via Google Fonts in `layout.tsx` with Vietnamese subset — no font setup needed.
- The existing component has no scroll-close behavior — this is new functionality to add in Phase 2.
- Header component's NAV_LINKS are currently hard-coded in English — i18n integration for the header is **out of scope** for this task (belongs to Homepage spec implementation).
- Upward-opening dropdown (when trigger is near bottom) is deferred — the trigger lives in a fixed header at the top of the page, making bottom overflow extremely unlikely.
