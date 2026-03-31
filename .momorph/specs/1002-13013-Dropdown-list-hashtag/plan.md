# Implementation Plan: Dropdown list hashtag (Write Kudo Hashtag Picker)

**Frame**: `1002-13013-Dropdown-list-hashtag`
**Date**: 2026-03-31
**Spec**: `specs/1002-13013-Dropdown-list-hashtag/spec.md`

---

## Summary

This is a **style-update + icon addition** task. The `HashtagField` component at `src/components/write-kudo/hashtag-field.tsx` already has full multi-select behavior (fetch, select up to 5, deselect, search/filter, create new). The work is to:

1. **Restyle the dropdown** from light theme (white bg, dark text) to dark theme (`#00070C` bg, white text, gold selected bg)
2. **Add a `check-circle` icon** to `src/components/ui/icon.tsx` (currently missing)
3. **Show check icons** on selected items in the dropdown list
4. **Adjust dimensions** (item height 40px, dropdown width 318px, item font 16px)

No backend changes. No new components. Mostly visual changes, but **one behavioral change**: selected items now stay visible in the dropdown list (with gold bg + check icon) instead of being hidden. See Change 6 in Phase 3.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Montserrat font
**Database**: Supabase PostgreSQL (`hashtags` table — already exists)
**Testing**: Vitest + React Testing Library
**State Management**: Local state (`useState`) + parent prop drilling
**API Style**: REST (`GET /api/hashtags`, `POST /api/hashtags` — both exist)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **TypeScript strict mode** — Existing component is TypeScript
- [x] **kebab-case files, PascalCase components** — `hashtag-field.tsx` exports `HashtagField`
- [x] **`@/*` path alias** — Used in all imports
- [x] **`"use client"` only when needed** — Component requires client state
- [x] **TDD** — Tests exist at `hashtag-field.test.tsx`; style tests to be added
- [x] **Responsive & Accessible** — Will add ARIA multiselectable + focus ring
- [x] **Icon component** — New `check-circle` icon must be added to `<Icon>` (constitution requires all icons via Icon component)
- [x] **No new dependencies** — Pure CSS/Tailwind + SVG icon changes

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component**: Modify existing `HashtagField` in-place at `src/components/write-kudo/hashtag-field.tsx`. No new components needed.
- **Styling Strategy**: Replace light-theme Tailwind classes with dark-theme equivalents matching `design-style.md`.
- **Check Icon**: Add new `check-circle` SVG variant to `src/components/ui/icon.tsx`. Use `<Icon name="check-circle" size={24} className="text-white">` in selected items.
- **Data Fetching**: No changes — hashtags already fetched via `fetch("/api/hashtags")` on dropdown open.
- **Search input**: Keep existing search/filter functionality, restyle to dark theme (dark bg, white text, gold-tinted border).

### Backend Approach

- **No changes needed.** Both `GET /api/hashtags` and `POST /api/hashtags` already work correctly.

### Integration Points

| Component | File | Change |
|-----------|------|--------|
| HashtagField | `src/components/write-kudo/hashtag-field.tsx` | Restyle dropdown to dark theme, add check icons |
| Icon component | `src/components/ui/icon.tsx` | Add `check-circle` icon variant |
| HashtagField tests | `src/components/write-kudo/hashtag-field.test.tsx` | Add style conformance tests |
| Icon tests | `src/components/ui/icon.test.tsx` | Add test for new `check-circle` icon |

---

## Project Structure

### New Files

None.

### Modified Files

| File | Changes |
|------|---------|
| `src/components/ui/icon.tsx` | Add `check-circle` icon variant (circle with checkmark SVG, 24×24px) |
| `src/components/write-kudo/hashtag-field.tsx` | 9 style changes: dark bg, white text, font size, item height, dropdown width, selected bg, check icon, search input theme, hover state |
| `src/components/write-kudo/hashtag-field.test.tsx` | Add style conformance tests + check icon test |
| `src/components/ui/icon.test.tsx` | Add test for `check-circle` icon rendering |

### Dependencies

No new dependencies.

---

## Implementation Strategy

### Phase 1: Icon Setup (Prerequisite)

Add the `check-circle` icon to the Icon component. This must be done first because the HashtagField changes depend on it.

**Change in `src/components/ui/icon.tsx`:**
Add a new `check-circle` case (circle with checkmark SVG path) alongside existing `checkbox-checked`:
```tsx
if (name === "check-circle") {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
    );
}
```

**Test in `src/components/ui/icon.test.tsx`:** Verify `<Icon name="check-circle" size={24} />` renders an SVG.

### Phase 2: TDD Red — Write Failing Style Tests

Write failing tests for each style gap in `hashtag-field.test.tsx`:

1. Dropdown container has `bg-[#00070C]` (dark bg, not `bg-white`)
2. Dropdown container has `w-[318px]` (not `w-64`)
3. Item text uses white color (not dark)
4. Item text uses `text-base` (16px, not `text-sm`)
5. Item height is `h-10` (40px)
6. Selected item has `bg-[rgba(255,234,158,0.2)]` (gold tint)
7. Selected item shows `<Icon name="check-circle">` (check icon present)
8. Unselected item does NOT show check icon
9. Search input has dark theme styling

### Phase 3: TDD Green — Apply Style Changes (US1 + US2)

Update `hashtag-field.tsx` to pass all tests. Specific changes:

**Change 1 — Dropdown container (line ~178):**
```diff
- "absolute left-0 top-full z-50 mt-1 w-64 rounded border border-[#998C5F] bg-white shadow-lg"
+ "absolute left-0 top-full z-50 mt-1 w-[318px] rounded-lg border border-[#998C5F] bg-[#00070C] p-1.5 shadow-lg"
```

**Change 2 — Search input container (line ~179):**
```diff
- "border-b border-[#998C5F] p-2"
+ "border-b border-[#998C5F] p-2 bg-[#00070C]"
```

**Change 3 — Search input (line ~186-187):**
```diff
- "w-full border-none bg-transparent px-1 py-1 text-sm text-[#00101A] outline-none placeholder:text-[#999]"
+ "w-full border-none bg-transparent px-1 py-1 text-base font-bold text-white outline-none placeholder:text-[#999]"
```

**Change 4 — Loading state (line ~192):**
```diff
- "px-3 py-2 text-sm text-[#999]"
+ "px-4 h-10 flex items-center text-base font-bold text-white/50"
```

**Change 5 — Hashtag item button (line ~202-203):**
Replace individual `<button>` items with a layout matching Figma: 40px height, 16px padding, white text, check icon for selected.

```diff
- <button type="button" onClick={...} className="w-full px-3 py-2 text-left text-sm text-[#00101A] hover:bg-gray-100">
-   {hashtag.name}
- </button>
+ <button type="button" onClick={...} className="w-full h-10 px-4 flex items-center justify-between rounded-sm text-left text-base font-bold leading-6 tracking-[0.15px] text-white hover:bg-[rgba(255,234,158,0.1)] transition-colors duration-150">
+   <span className="truncate">{hashtag.name}</span>
+ </button>
```

**Change 6 — Selected items rendering:**
Currently, the code filters OUT selected items from the list (`filteredHashtags` excludes `selectedIds`). Per Figma, selected items should REMAIN in the list with gold bg + check icon. This requires restructuring the list to show ALL hashtags (selected + unselected), with selected items styled differently.

```tsx
// Show all hashtags, not just unselected ones
const visibleHashtags = allHashtags.filter(h =>
    h.name.toLowerCase().includes(filter.toLowerCase())
);

// In the render, for each item:
const isSelected = selectedIds.has(hashtag.id);
const isDisabled = !isSelected && selectedHashtags.length >= MAX_HASHTAGS;

<button
    type="button"
    onClick={() => isSelected ? removeHashtag(hashtag.id) : selectHashtag(hashtag)}
    disabled={isDisabled}
    className={[
        "w-full h-10 px-4 flex items-center justify-between text-left text-base font-bold leading-6 tracking-[0.15px] text-white transition-colors duration-150",
        isSelected ? "bg-[rgba(255,234,158,0.2)] rounded-sm" : "hover:bg-[rgba(255,234,158,0.1)]",
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    ].join(" ")}
>
    <span className="truncate">{hashtag.name}</span>
    {isSelected && <Icon name="check-circle" size={24} className="text-white shrink-0" />}
</button>
```

**Change 7 — Create new hashtag button (lines ~218-233):**
```diff
- "w-full px-3 py-2 text-left text-sm text-[#998C5F] hover:bg-gray-100"
+ "w-full h-10 px-4 flex items-center text-left text-base font-bold text-[#998C5F] hover:bg-[rgba(255,234,158,0.1)] transition-colors duration-150"
```

**Change 8 — `handleKeyDown` Enter logic (line ~129):**
After Change 6, `visibleHashtags` includes selected items. Pressing `Enter` should select the first **unselected** visible item, not the first item (which might already be selected):
```diff
- if (filteredHashtags.length > 0) {
-     selectHashtag(filteredHashtags[0]);
+ const firstUnselected = visibleHashtags.find(h => !selectedIds.has(h.id));
+ if (firstUnselected) {
+     selectHashtag(firstUnselected);
```

**Change 9 — `exactMatch` and "Create" button references (lines ~80, ~208-235):**
After renaming `filteredHashtags` → `visibleHashtags`, update all dependent references:
- `exactMatch` check (line ~80): still uses `allHashtags` — no change needed ✓
- "Create" button condition (line ~208): `filteredHashtags.length === 0` → `visibleHashtags.filter(h => !selectedIds.has(h.id)).length === 0` (only show "Create" when no unselected matches remain)
- "Create" button (line ~222): `filteredHashtags.length > 0` → `visibleHashtags.filter(h => !selectedIds.has(h.id)).length > 0`

### Phase 4: Accessibility (US3 + US4)

1. Add `role="listbox"` and `aria-multiselectable="true"` and `aria-label="Chon hashtag"` to the `<ul>` list
2. Add `role="option"` and `aria-selected={isSelected}` to each item
3. Add focus ring: `focus-visible:outline-2 focus-visible:outline-[#15D5CA] focus-visible:-outline-offset-2` to items
4. Verify `Escape` closes dropdown (already implemented)
5. Verify `Enter` selects first filtered item (already implemented)

### Phase 5: Edge Cases & Polish

1. **Disabled state at max**: When 5 selected, unselected items get `opacity-50 cursor-not-allowed` (per design-style disabled state)
2. **Long names**: Add `truncate` class to hashtag text span for ellipsis within 306px width
3. **Mobile responsive**: Add `max-md:w-full` to dropdown container for mobile viewports
4. **Empty state**: If `allHashtags.length === 0 && !isLoading`, show "Không có dữ liệu" in dark theme (`text-white/50`)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: HashtagField renders items, handles multi-select, shows check icons
- [x] **Style conformance**: Dark theme, gold selected bg, white text, 40px items
- [ ] **External dependencies**: None (API already tested separately)

### Test Scenarios

1. **Style Conformance (NEW)**
   - [ ] Dropdown has dark bg `#00070C`
   - [ ] Dropdown width is `318px`
   - [ ] Item text is white and `text-base`
   - [ ] Item height is `h-10` (40px)
   - [ ] Selected item has gold bg + check-circle icon
   - [ ] Unselected item has no check icon

2. **Behavior (EXISTING — verify still passes)**
   - [x] Open/close dropdown
   - [x] Select hashtag adds to selected list
   - [x] Max 5 limit enforced
   - [x] Search filters list
   - [x] Create new hashtag

3. **Edge Cases (NEW)**
   - [ ] Max 5 reached → unselected items disabled
   - [ ] Selected items STAY in list (not hidden)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| HashtagField component | 90%+ | High |
| Style conformance | 100% of 9 gaps | High |
| Icon check-circle | 100% | High |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Behavior regression (selected items list restructuring) | Low | Medium | Existing 5 tests mock `fetch` to return empty data — they never test dropdown list rendering. Change 6 won't break them. Write NEW tests for toggle behavior before changing. |
| `handleKeyDown` Enter selects already-selected item | Medium | Medium | Change 8 fixes this: find first unselected item instead of first item in list. |
| "Create" button logic breaks with `visibleHashtags` | Medium | Low | Change 9 updates dependent references. `exactMatch` uses `allHashtags` (unchanged). "Create" button condition must check only unselected items. |
| Check-circle icon SVG path incorrect | Low | Low | Use Material Design "check_circle" path, test rendering |
| Search input dark theme contrast | Low | Low | Placeholder `text-[#999]` on `#00070C` is 6.3:1 (passes AA for bold text) |

### Estimated Complexity

- **Frontend**: Medium (9 style changes + 3 behavior changes: selected items stay in list, Enter key logic, Create button logic)
- **Backend**: None
- **Testing**: Medium (9 style tests + behavior tests for toggle, Enter key, Create button)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` reviewed (3 rounds)
- [x] `design-style.md` reviewed with code gap analysis
- [x] Existing `HashtagField` component and tests reviewed
- [x] Confirmed `check-circle` icon is missing from Icon component

### External Dependencies

None.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Begin** Phase 1 (add check-circle icon) → Phase 2 (TDD Red) → Phase 3 (style fixes) → Phase 4 (a11y) → Phase 5 (polish)
3. **Visual verify** on Write Kudo screen with real hashtag data

---

## Notes

- **Critical behavioral change**: Change 6 (Phase 3) changes how the hashtag list works — currently selected items are HIDDEN from the dropdown list. Figma shows selected items REMAINING in the list with gold bg + check icon. This is a behavior change, not just a style change. It must be tested carefully.
- The search input is kept (not in Figma but valuable UX) — styled to match dark theme.
- The trigger button style (white bg) is intentionally different from the dropdown (dark bg) — mixed theme per Figma.
- Selected item bg is 0.2 opacity (not 0.1 like Live Board filter) — intentional per Figma.
