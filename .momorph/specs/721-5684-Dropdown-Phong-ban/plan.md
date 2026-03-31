# Implementation Plan: Dropdown Phòng ban

**Frame**: `721-5684-Dropdown-Phong-ban`
**Date**: 2026-03-31
**Spec**: `specs/721-5684-Dropdown-Phong-ban/spec.md`

---

## Summary

This is a **style-alignment task**, not a greenfield build. A fully functional `FilterDropdown` component already exists at `src/components/kudos-live-board/filter-dropdown.tsx` with complete behavior (open/close, select/deselect, keyboard nav, ARIA). The department API and wiring in `highlight-section.tsx` also already work.

The primary work is to **update the FilterDropdown styles** to match the Figma design (item padding, font size, selected bg opacity, text-shadow glow) and **add tests for the style-specific acceptance criteria** that are currently untested.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Montserrat font
**Database**: Supabase PostgreSQL (`departments` table — already exists)
**Testing**: Vitest + React Testing Library
**State Management**: Local state (`useState`) + parent prop drilling
**API Style**: REST (`GET /api/departments` — already exists)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **TypeScript strict mode** — Existing component is already TypeScript
- [x] **kebab-case files, PascalCase components** — `filter-dropdown.tsx` exports `FilterDropdown` ✓
- [x] **`@/*` path alias** — Used in all existing imports ✓
- [x] **`"use client"` only when needed** — Component requires client state for open/close ✓
- [x] **TDD** — Tests exist at `__tests__/filter-dropdown.test.tsx`; style tests to be added
- [x] **Responsive & Accessible** — ARIA roles, keyboard nav already implemented
- [x] **Zod validation** — API route validates at boundary ✓
- [x] **No new dependencies** — Pure CSS/Tailwind changes only

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Modify the existing `FilterDropdown` component in-place. No new components needed. The component is generic (used for both hashtag and department filters), so all style changes apply to both usages — this is correct per Figma since both dropdowns share the same visual pattern.
- **Styling Strategy**: Tailwind utility classes. Update existing class strings to match Figma tokens from `design-style.md`.
- **Data Fetching**: No changes — departments are already fetched in `kudos-live-board-client.tsx` and passed as props through `highlight-section.tsx`.

### Backend Approach

- **No backend changes required**. `GET /api/departments` already returns `{ data: { id, name }[] }` in correct format.

### Integration Points

- **Existing component**: `src/components/kudos-live-board/filter-dropdown.tsx` (modify)
- **Existing tests**: `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx` (update/extend)
- **Consumer**: `src/components/kudos-live-board/highlight-section.tsx` (no changes needed — props unchanged)

---

## Project Structure

### Documentation

```text
.momorph/specs/721-5684-Dropdown-Phong-ban/
├── spec.md              # Feature specification ✓
├── design-style.md      # Design specifications ✓
├── plan.md              # This file
└── tasks.md             # Task breakdown (next step)
```

### Modified Files

| File | Changes |
|------|---------|
| `src/components/kudos-live-board/filter-dropdown.tsx` | Update item styles: padding, font size, height, selected bg opacity, text-shadow glow, max-height for scroll |
| `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx` | Add tests for Figma-specific styles: selected glow, item dimensions, scroll behavior |

### New Files

None.

### Dependencies

No new dependencies.

---

## Implementation Strategy

### Phase 1: Tests First (TDD Red)

Write failing tests for each style gap identified in the spec (5 gaps + 1 new finding):
1. Selected item has `bg-[rgba(255,234,158,0.1)]` (not 0.2) — **Change 3**
2. Item text uses `text-base` (16px) not `text-sm` (14px) — **Change 2**
3. Selected item has text-shadow glow class — **Change 3**
4. Items have proper padding (`p-4`) and height (`h-14`) — **Change 2**
5. Dropdown list has `max-height` and `overflow-y: auto` for scrolling — **Change 1**
6. Focus ring uses `#15D5CA` (teal) not gold CSS var — **Change 4**

### Phase 2: Style Fixes (TDD Green — US1 + US2)

Update `filter-dropdown.tsx` to match Figma. Specific changes:

**Change 1 — Dropdown list `<ul>` (line ~144):**
Add scroll constraint for ~50 departments.
```diff
- "absolute top-full left-0 mt-1 min-w-full flex flex-col p-1.5 bg-[#00070C] border border-[var(--klb-color-border-gold)] rounded-lg z-50 transition-[opacity,transform] duration-150 ease-out origin-top"
+ "absolute top-full left-0 mt-1 min-w-full flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg z-50 max-h-[348px] overflow-y-auto transition-[opacity,transform] duration-150 ease-out origin-top"
```

**Change 2 — List item `<li>` base classes (line ~157–158):**
Update padding, height, and font size to match Figma item spec (56px height, 16px text).
```diff
- "cursor-pointer px-4 py-2 rounded",
- "font-[family-name:var(--font-montserrat)] text-sm font-bold text-white",
+ "cursor-pointer p-4 h-14 flex items-center rounded",
+ "font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white",
```

**Change 3 — Selected state class (line ~162):**
Fix bg opacity (0.2 → 0.1) and add text-shadow glow.
```diff
- selected === option.id ? "bg-[rgba(255,234,158,0.2)]" : "",
+ selected === option.id ? "bg-[rgba(255,234,158,0.1)] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]" : "",
```

**Change 4 — Focus ring color (line ~161):**
Fix item focus ring from gold to teal per design-style.md spec (`2px solid #15D5CA`).
```diff
- "outline-none focus-visible:outline-2 focus-visible:outline-[var(--klb-color-border-gold)] focus-visible:-outline-offset-2",
+ "outline-none focus-visible:outline-2 focus-visible:outline-[#15D5CA] focus-visible:-outline-offset-2",
```

> **CSS var decision**: The dropdown **list** (`<ul>`) and **items** (`<li>`) use hardcoded hex values (`#998C5F`, `#15D5CA`) to match Figma exactly and avoid CSS var fallback issues. The **trigger button** remains unchanged (uses `--klb-color-*` vars) as it is out of scope for this frame — its styling is defined by the Live Board spec (`2940:13431`).

### Phase 3: Keyboard Nav & Accessibility (US3)

Existing keyboard navigation is already complete (ArrowUp/Down, Enter, Escape, Tab). This phase only **verifies** and makes minor fixes:
- Focus ring now uses `#15D5CA` (teal) per constitution (changed in Phase 2, Change 4)
- `focus-visible` outline is `2px solid #15D5CA` with negative offset
- Verify `aria-label="Chọn phòng ban"` is set on listbox (currently uses `aria-labelledby={triggerId}` — acceptable, but add `aria-label` as fallback if trigger text is ambiguous)

### Phase 4: Edge Cases & Polish

1. **Auto-scroll to selected item**: In `handleToggle`, after setting `isOpen(true)`, use a `useEffect` or `requestAnimationFrame` to call `scrollIntoView({ block: "nearest" })` on the selected `<li>` element via its ref. This ensures the selected item is visible when reopening with ~50 items.

2. **Empty state**: If `options.length === 0`, render a disabled `<li>` with text "Không có phòng ban" (no departments) instead of an empty list. This handles the edge case where the API returns empty data.

3. **Viewport overflow on mobile**: The dropdown already uses `absolute top-full left-0` positioning. For mobile safety, add `max-w-[calc(100vw-32px)]` to prevent horizontal overflow on narrow viewports. Verify at 360px breakpoint per constitution.

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: FilterDropdown renders items, handles selection, toggles open/close
- [x] **Data layer**: Verify dropdown works with real department data shape `{ id, name }`
- [ ] **External dependencies**: None (API already tested separately)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Select department → callback fires with correct ID; toggle deselect → callback fires with null |
| App ↔ Data Layer | No | API route already tested in `__tests__/route.test.ts` |

### Test Environment

- **Environment**: Vitest + jsdom
- **Test data**: Mock `FilterOption[]` arrays (already established pattern in existing tests)
- **Isolation**: Fresh render per test

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| Department data | Mock array | Pure UI component, data is passed as props |
| `onSelect` callback | `vi.fn()` spy | Verify selection behavior |

### Test Scenarios Outline

1. **Style Conformance (NEW — Phase 1/2)**
   - [ ] Selected item has correct background opacity (0.1 not 0.2)
   - [ ] Item text uses 16px font size (text-base)
   - [ ] Selected item has text-shadow glow class
   - [ ] Items have `p-4 h-14` (padding 16px, height 56px)
   - [ ] Dropdown list has max-height and overflow-y for scrolling
   - [ ] Focus ring uses `#15D5CA` (teal) not gold

2. **Happy Path (EXISTING — verify still passes)**
   - [x] Open dropdown, see all options
   - [x] Select an option → onSelect called with ID
   - [x] Click selected → onSelect called with null (deselect)
   - [x] Keyboard nav: ArrowDown/Up + Enter

3. **Edge Cases (NEW — Phase 4)**
   - [ ] Dropdown with ~50 items is scrollable
   - [ ] Selected item scrolled into view on open
   - [ ] Empty options shows fallback message

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| FilterDropdown component | 90%+ | High |
| Style conformance assertions | 100% of gaps | High |
| Keyboard navigation | Already covered | Medium (verify) |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Style changes break hashtag dropdown | Low | Medium | Both use same component — all changes apply equally. Run full existing test suite after changes. |
| CSS variable fallback issues | Low | Low | Dropdown list/items use hardcoded hex (`#998C5F`, `#15D5CA`). Trigger button keeps CSS vars (out of scope). |
| Scrolling issues with 50 items | Low | Medium | Add `max-h-[348px] overflow-y-auto` and test with 50-item mock array |
| Focus ring color was gold, spec requires teal | High | Low | Explicit Change 4 in Phase 2 fixes `var(--klb-color-border-gold)` → `#15D5CA` |

### Estimated Complexity

- **Frontend**: Low (CSS class changes in one file)
- **Backend**: None
- **Testing**: Low (extend existing test suite)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` reviewed (2 rounds)
- [x] `design-style.md` reviewed with code gap analysis
- [x] Existing `FilterDropdown` component and tests reviewed

### External Dependencies

None — all code, data, and APIs already exist.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Begin** TDD: write failing style tests → update FilterDropdown styles → verify all tests pass
3. **Visual verify** on Live Board with real department data

---

## Notes

- This is intentionally a **small, focused plan**. The existing component has full functionality — we are only closing the gap between current styles and Figma spec.
- The `FilterDropdown` is a shared component used for both hashtag and department filtering. Both dropdowns use the same Figma visual pattern, so the style update is correct for both.
- No new files, no new dependencies, no new components — just style alignment + test coverage.
