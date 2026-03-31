# Tasks: Dropdown Phòng ban

**Frame**: `721-5684-Dropdown-Phong-ban`
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

## Phase 1: TDD Red — Write Failing Style Tests

**Purpose**: Write tests that assert the Figma design values before changing any code. All tests MUST fail initially (Red phase of TDD).

**File**: `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`

- [x] T001 [US1] Add test: selected item className contains `bg-[rgba(255,234,158,0.1)]` (not 0.2) | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T002 [US1] Add test: item className contains `text-base` (16px) not `text-sm` | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T003 [US1] Add test: selected item className contains text-shadow glow class `[text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T004 [US1] Add test: item className contains `p-4` and `h-14` (padding 16px, height 56px) | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T005 [US2] Add test: dropdown list `<ul>` className contains `max-h-[348px]` and `overflow-y-auto` | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T006 [US3] Add test: item focus ring className contains `outline-[#15D5CA]` (teal, not gold CSS var) | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`

**Checkpoint**: Run `npx vitest run src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx` — new tests MUST FAIL, existing 9 tests MUST still PASS.

---

## Phase 2: TDD Green — Apply Style Fixes (US1 + US2)

**Purpose**: Update FilterDropdown Tailwind classes to match Figma. All new tests from Phase 1 must now pass.

**File**: `src/components/kudos-live-board/filter-dropdown.tsx`

- [x] T007 [US2] Change 1: Update `<ul>` classes — replace `border-[var(--klb-color-border-gold)]` with `border-[#998C5F]`, add `max-h-[348px] overflow-y-auto` | `src/components/kudos-live-board/filter-dropdown.tsx`
- [x] T008 [US1] Change 2: Update `<li>` base classes — replace `px-4 py-2` with `p-4 h-14 flex items-center`, replace `text-sm` with `text-base leading-6 tracking-[0.5px]` | `src/components/kudos-live-board/filter-dropdown.tsx`
- [x] T009 [US1] Change 3: Update selected state class — replace `bg-[rgba(255,234,158,0.2)]` with `bg-[rgba(255,234,158,0.1)] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `src/components/kudos-live-board/filter-dropdown.tsx`
- [x] T010 [US3] Change 4: Update focus ring — replace `focus-visible:outline-[var(--klb-color-border-gold)]` with `focus-visible:outline-[#15D5CA]` | `src/components/kudos-live-board/filter-dropdown.tsx`

**Checkpoint**: Run `npx vitest run src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx` — ALL tests (existing 9 + new 6) MUST PASS.

---

## Phase 3: Keyboard Nav & Accessibility Verification (US3)

**Purpose**: Verify existing keyboard navigation still works correctly after style changes. Add `aria-label` fallback.

- [x] T011 [US3] Verify existing keyboard tests pass (ArrowDown/Up, Enter, Escape) — no code changes expected, just run and confirm | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T012 [US3] Add `aria-label="Chọn phòng ban"` as fallback on `<ul role="listbox">` alongside existing `aria-labelledby` | `src/components/kudos-live-board/filter-dropdown.tsx`

**Checkpoint**: All keyboard and accessibility tests pass. Run full test suite.

---

## Phase 4: Edge Cases & Polish

**Purpose**: Handle scrolling edge cases, empty state, and mobile viewport safety.

- [x] T013 [US1] Add auto-scroll to selected item on open: after `setIsOpen(true)`, use `requestAnimationFrame` + `scrollIntoView({ block: "nearest" })` on the selected `<li>` ref | `src/components/kudos-live-board/filter-dropdown.tsx`
- [x] T014 [US2] Add empty state: if `options.length === 0`, render a disabled `<li>` with "Không có dữ liệu" text instead of empty list | `src/components/kudos-live-board/filter-dropdown.tsx`
- [x] T015 [P] Add test: dropdown with 50 mock items is scrollable (list height constrained) | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T016 [P] Add test: empty options renders fallback message | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- [x] T017 Add `max-w-[calc(100vw-32px)]` to dropdown `<ul>` for mobile viewport overflow safety | `src/components/kudos-live-board/filter-dropdown.tsx`

**Checkpoint**: Run full test suite — ALL tests pass. Visually verify on Live Board at 360px, 768px, 1440px breakpoints.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (TDD Red)
  ↓
Phase 2 (TDD Green) — depends on Phase 1 tests existing
  ↓
Phase 3 (Accessibility) — depends on Phase 2 style changes
  ↓
Phase 4 (Polish) — depends on Phase 2 + Phase 3
```

### Within Each Phase

- Phase 1: All test tasks (T001–T006) are in the same file but should be written sequentially in one pass
- Phase 2: Tasks T007–T010 are all in the same file and MUST be applied sequentially (they modify adjacent lines)
- Phase 3: T011 (verify) before T012 (modify)
- Phase 4: T013–T014 (code) before T015–T016 (tests). T015 and T016 can be parallel [P]. T017 is independent.

### Parallel Opportunities

- T015 and T016 (test tasks in Phase 4) can run in parallel — they test different scenarios
- No cross-phase parallelism — each phase depends on the previous

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2 (T001–T010)
2. **STOP and VALIDATE**: All 15 tests pass (9 existing + 6 new)
3. Visual check on Live Board — dropdown items match Figma

### Incremental Delivery

1. Phase 1 + 2 → Style alignment complete → Deploy
2. Phase 3 → Accessibility verified → Deploy
3. Phase 4 → Edge cases handled → Deploy

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 17 |
| Phase 1 (TDD Red) | 6 tasks |
| Phase 2 (TDD Green) | 4 tasks |
| Phase 3 (Accessibility) | 2 tasks |
| Phase 4 (Polish) | 5 tasks |
| Files modified | 2 (`filter-dropdown.tsx`, `filter-dropdown.test.tsx`) |
| Files created | 0 |
| Parallel opportunities | 2 (T015 ∥ T016) |
| MVP scope | Phase 1 + 2 (10 tasks) |

---

## Notes

- All tasks modify only 2 existing files — no new files needed.
- The `FilterDropdown` is shared between hashtag and department filters. Style changes apply to both — this is intentional and correct per Figma.
- Run existing tests BEFORE making changes to confirm baseline: `npx vitest run src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx`
- Commit after each phase checkpoint.
- Mark tasks complete as you go: `- [x]`
