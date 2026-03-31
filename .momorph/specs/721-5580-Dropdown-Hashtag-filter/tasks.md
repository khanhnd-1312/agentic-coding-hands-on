# Tasks: Dropdown Hashtag filter

**Frame**: `721-5580-Dropdown-Hashtag-filter`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Status: NO TASKS NEEDED

Per `plan.md`, this feature is **already fully implemented**. The `FilterDropdown` component at `src/components/kudos-live-board/filter-dropdown.tsx` is a shared generic component used for both hashtag and department filtering. All style updates, behavior, accessibility, and tests were completed during the Department Dropdown implementation (`721-5684-Dropdown-Phong-ban`).

---

## Verification Only

The single action required is to **verify** the existing implementation satisfies all spec requirements:

- [x] T001 Verify `FilterDropdown` renders hashtag options correctly — run `npx vitest run src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx` | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx` — **Result: 17/17 pass**
- [x] T002 Verify `GET /api/hashtags` returns `{ data: { id, name }[] }` | `src/app/api/hashtags/route.ts` — **Exists and working**
- [x] T003 Verify hashtag filter applied to `/api/kudos?hashtag={id}` | `src/app/api/kudos/route.ts` — **Working (line 56-58: `query.eq("kudos_hashtags.hashtag_id", hashtag)`)**
- [x] T004 Verify hashtag filter applied to `/api/kudos/highlights?hashtag={id}` | `src/app/api/kudos/highlights/route.ts` — **Working (line 48-49: same filter)**
- [x] T005 Verify hashtag filter wired in Live Board client for BOTH sections | `src/components/kudos-live-board/kudos-live-board-client.tsx` — **Working (lines 105, 149, 167)**

---

## Why No New Tasks

| Spec Requirement | Already Implemented By | File |
|-----------------|----------------------|------|
| FR-001: Scrollable hashtag list | `FilterDropdown` with `max-h-87 overflow-y-auto` | `filter-dropdown.tsx` |
| FR-002: Gold highlight + glow | `bg-[rgba(255,234,158,0.1)]` + `[text-shadow:...]` | `filter-dropdown.tsx` |
| FR-003: Click to select/filter | `handleSelect` + `onSelect` callback | `filter-dropdown.tsx` |
| FR-004: Close on outside/Escape | `useEffect` outside-click + `handleListboxKeyDown` | `filter-dropdown.tsx` |
| FR-005: Keyboard navigation | ArrowDown/Up/Enter/Escape handlers | `filter-dropdown.tsx` |
| FR-006: Filter both sections | `selectedHashtag` passed to both `HighlightSection` and `AllKudosSection` | `kudos-live-board-client.tsx` |
| TR-001: Fetch from API | `GET /api/hashtags` | `hashtags/route.ts` |
| TR-002: Reuse FilterDropdown | Shared component | `filter-dropdown.tsx` |
| TR-003: Filter both endpoints | Both `/api/kudos` and `/api/kudos/highlights` support `?hashtag=` | `kudos/route.ts`, `highlights/route.ts` |
| TR-004: Styles match Figma | Updated in Dept Dropdown implementation | `filter-dropdown.tsx` |

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 0 (new) / 5 (verification, all complete) |
| New files | 0 |
| Modified files | 0 |
| Tests | 17 existing, all passing |
| Implementation status | **COMPLETE** |

---

## Notes

- This feature was implemented as a side effect of the shared `FilterDropdown` component approach during the Department Dropdown work (`721-5684`).
- Any future changes (multi-select, type-ahead search) would require a new spec → plan → tasks cycle.
- The 17 existing tests at `__tests__/filter-dropdown.test.tsx` cover all behavior and style conformance for both hashtag and department usages.
