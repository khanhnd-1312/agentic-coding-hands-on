# Tasks: Dropdown list hashtag (Write Kudo Hashtag Picker)

**Frame**: `1002-13013-Dropdown-list-hashtag`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 1: Icon Setup (Prerequisite)

**Purpose**: Add `check-circle` icon to the Icon component. This blocks all HashtagField changes.

- [ ] T001 [P] Add `check-circle` icon variant (circle with checkmark SVG, 24×24px) to Icon component | `src/components/ui/icon.tsx`
- [ ] T002 [P] Add test: `<Icon name="check-circle" size={24} />` renders an SVG element | `src/components/ui/icon.test.tsx`

**Checkpoint**: Run `npx vitest run src/components/ui/icon.test.tsx` — new test passes, existing icon tests still pass.

---

## Phase 2: TDD Red — Write Failing Style Tests

**Purpose**: Write tests that assert the Figma dark-theme values before changing HashtagField code. All new tests MUST fail initially.

**File**: `src/components/write-kudo/hashtag-field.test.tsx`

> Note: These tests need `fetch` to return mock hashtag data (not empty). Update the `beforeEach` mock to return items.

- [ ] T003 [US1] Add test setup: update `beforeEach` fetch mock to return 8 hashtag items (matching Figma sample) instead of empty array | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T004 [US1] Add test: dropdown container className contains `bg-[#00070C]` (dark bg, not `bg-white`) | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T005 [US1] Add test: dropdown container className contains `w-[318px]` (not `w-64`) | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T006 [US1] Add test: hashtag item className contains `text-base` and `text-white` (not `text-sm`, not `text-[#00101A]`) | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T007 [US1] Add test: hashtag item className contains `h-10` (40px height) | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T008 [US1] Add test: selected item (passed via `selectedHashtags` prop) has `bg-[rgba(255,234,158,0.2)]` className | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T009 [US1] Add test: selected item shows `check-circle` icon (via `data-testid="icon-check-circle"` from mock) | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T010 [US1] Add test: unselected item does NOT show `check-circle` icon | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T011 [US2] Add test: selected items STAY visible in the dropdown list (not filtered out) | `src/components/write-kudo/hashtag-field.test.tsx`

**Checkpoint**: Run `npx vitest run src/components/write-kudo/hashtag-field.test.tsx` — new tests FAIL, existing 5 tests still PASS.

---

## Phase 3: TDD Green — Apply Style & Behavior Changes (US1 + US2)

**Purpose**: Update HashtagField to pass all tests from Phase 2. 9 style changes + 3 behavior changes.

**File**: `src/components/write-kudo/hashtag-field.tsx`

- [ ] T012 [US2] Change 1: Update dropdown container classes — replace `w-64 rounded border bg-white` with `w-[318px] rounded-lg bg-[#00070C] p-1.5` | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T013 [US2] Change 2: Update search input container — add `bg-[#00070C]` | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T014 [US1] Change 3: Update search input text — replace `text-sm text-[#00101A]` with `text-base font-bold text-white` | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T015 [US1] Change 4: Update loading state — replace `px-3 py-2 text-sm text-[#999]` with `px-4 h-10 flex items-center text-base font-bold text-white/50` | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T016 [US1] Change 5: Update hashtag item button — replace `px-3 py-2 text-sm text-[#00101A] hover:bg-gray-100` with `h-10 px-4 flex items-center justify-between text-base font-bold leading-6 tracking-[0.15px] text-white hover:bg-[rgba(255,234,158,0.1)]` | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T017 [US1] Change 6 (BEHAVIOR): Restructure list — replace `filteredHashtags` (excludes selected) with `visibleHashtags` (shows ALL hashtags). Selected items render with gold bg `bg-[rgba(255,234,158,0.2)] rounded-sm` + `<Icon name="check-circle">`. Click toggles select/deselect via `isSelected ? removeHashtag(id) : selectHashtag(hashtag)`. Disabled state `opacity-50 cursor-not-allowed` when max 5 reached. | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T018 [US1] Change 7: Update "Create new hashtag" button styles — replace `text-sm hover:bg-gray-100` with `h-10 px-4 text-base font-bold hover:bg-[rgba(255,234,158,0.1)]` | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T019 [US1] Change 8: Fix `handleKeyDown` Enter logic — replace `filteredHashtags[0]` with `visibleHashtags.find(h => !selectedIds.has(h.id))` to skip already-selected items | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T020 [US1] Change 9: Update "Create" button conditions — replace `filteredHashtags.length` checks with `visibleHashtags.filter(h => !selectedIds.has(h.id)).length` to only count unselected matches | `src/components/write-kudo/hashtag-field.tsx`

**Checkpoint**: Run `npx vitest run src/components/write-kudo/hashtag-field.test.tsx` — ALL tests (existing 5 + new 9) MUST PASS.

---

## Phase 4: Accessibility (US3 + US4)

**Purpose**: Add ARIA attributes and verify keyboard navigation.

- [ ] T021 [US4] Add `role="listbox"`, `aria-multiselectable="true"`, `aria-label="Chọn hashtag"` to the `<ul>` element | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T022 [US4] Add `role="option"` and `aria-selected={isSelected}` to each hashtag item `<li>` or `<button>` | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T023 [US4] Add focus ring `focus-visible:outline-2 focus-visible:outline-[#15D5CA] focus-visible:-outline-offset-2` to hashtag items | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T024 [US4] Verify existing keyboard tests: Enter selects first unselected item, Escape closes dropdown — run and confirm | `src/components/write-kudo/hashtag-field.test.tsx`

**Checkpoint**: All tests pass. ARIA attributes rendered correctly.

---

## Phase 5: Edge Cases & Polish

**Purpose**: Handle boundary conditions, responsive, and visual polish.

- [ ] T025 [US1] Add disabled visual state: when 5 hashtags selected, unselected items get `opacity-50 cursor-not-allowed` and `disabled` attribute | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T026 [US1] Add `truncate` class to hashtag text `<span>` for ellipsis on long names within 306px item width | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T027 [US2] Add `max-md:w-full` to dropdown container for mobile responsive (100% width on mobile, 318px on tablet+) | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T028 [US1] Add empty state: if `allHashtags.length === 0 && !isLoading`, render "Không có dữ liệu" in `text-white/50` inside dropdown | `src/components/write-kudo/hashtag-field.tsx`
- [ ] T029 [P] Add test: when 5 hashtags selected, unselected items have `opacity-50` and are disabled | `src/components/write-kudo/hashtag-field.test.tsx`
- [ ] T030 [P] Add test: empty hashtag list renders "Không có dữ liệu" fallback | `src/components/write-kudo/hashtag-field.test.tsx`

**Checkpoint**: Run full test suite — ALL tests pass. Visually verify on Write Kudo screen at 360px, 768px, 1440px breakpoints.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Icon Setup)
  ↓
Phase 2 (TDD Red) — depends on check-circle icon existing
  ↓
Phase 3 (TDD Green) — depends on Phase 2 tests existing
  ↓
Phase 4 (Accessibility) — depends on Phase 3 styles
  ↓
Phase 5 (Polish) — depends on Phase 3 + Phase 4
```

### Within Each Phase

- Phase 1: T001 and T002 can run in parallel [P] (different files)
- Phase 2: T003 must come first (mock setup), then T004–T011 sequentially (same file)
- Phase 3: T012–T020 are all in the same file — MUST be sequential. T017 (Change 6) is the critical behavior change that T019-T020 depend on.
- Phase 4: T021–T023 are sequential (same file). T024 is verify-only.
- Phase 5: T025–T028 are sequential (same file). T029 and T030 can be parallel [P] (tests in separate test blocks).

### Parallel Opportunities

- T001 ∥ T002 (Phase 1: different files)
- T029 ∥ T030 (Phase 5: independent test scenarios)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (icon) + Phase 2 (tests) + Phase 3 (changes)
2. **STOP and VALIDATE**: All tests pass (5 existing + 9 new = 14)
3. Visual check on Write Kudo screen — dropdown matches dark theme Figma

### Incremental Delivery

1. Phase 1 → Icon available
2. Phase 2 + 3 → Style + behavior aligned with Figma → Deploy
3. Phase 4 → Accessibility complete → Deploy
4. Phase 5 → Edge cases polished → Deploy

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 30 |
| Phase 1 (Icon Setup) | 2 tasks |
| Phase 2 (TDD Red) | 9 tasks |
| Phase 3 (TDD Green) | 9 tasks |
| Phase 4 (Accessibility) | 4 tasks |
| Phase 5 (Polish) | 6 tasks |
| Files modified | 4 (`icon.tsx`, `icon.test.tsx`, `hashtag-field.tsx`, `hashtag-field.test.tsx`) |
| Files created | 0 |
| Parallel opportunities | 2 (T001∥T002, T029∥T030) |
| MVP scope | Phase 1 + 2 + 3 (20 tasks) |
| Critical task | T017 (Change 6 — behavior restructuring) |

---

## Notes

- **T017 is the highest-risk task** — it restructures how selected items display in the list (hidden → visible with toggle). Write tests T008-T011 BEFORE implementing T017.
- Run `npx vitest run src/components/write-kudo/hashtag-field.test.tsx` as baseline before starting. Expected: 5/5 pass.
- The Icon mock in existing tests (`vi.mock("@/components/ui/icon")`) renders `<span data-testid="icon-{name}" />` — the new `check-circle` icon tests (T009-T010) rely on this mock pattern.
- Commit after each phase checkpoint.
- Mark tasks complete as you go: `- [x]`
