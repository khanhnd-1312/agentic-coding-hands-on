# Implementation Plan: Dropdown Hashtag filter

**Frame**: `721-5580-Dropdown-Hashtag-filter`
**Date**: 2026-03-31
**Spec**: `specs/721-5580-Dropdown-Hashtag-filter/spec.md`

---

## Summary

**No implementation work is required.** This feature is already fully implemented and styled.

The `FilterDropdown` component at `src/components/kudos-live-board/filter-dropdown.tsx` is a **shared generic component** used for both hashtag and department filtering. The style updates applied during the Department Dropdown implementation (`721-5684-Dropdown-Phong-ban`) **already apply** to the hashtag filter. The hashtag API (`GET /api/hashtags`), wiring in `highlight-section.tsx`, and all 17 component tests are already in place.

This plan exists for **documentation completeness and traceability** only.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Montserrat font
**Database**: Supabase PostgreSQL (`hashtags` table — already exists)
**Testing**: Vitest + React Testing Library
**State Management**: Local state (`useState`) + parent prop drilling
**API Style**: REST (`GET /api/hashtags` — already exists)

---

## Constitution Compliance Check

*GATE: All items already compliant — no new code needed.*

- [x] **TypeScript strict mode** — Existing component is TypeScript
- [x] **kebab-case files, PascalCase components** — `filter-dropdown.tsx` exports `FilterDropdown`
- [x] **`@/*` path alias** — Used in all imports
- [x] **`"use client"` only when needed** — Component requires client state
- [x] **TDD** — 17 tests exist and pass at `__tests__/filter-dropdown.test.tsx`
- [x] **Responsive & Accessible** — ARIA roles, keyboard nav, focus ring `#15D5CA`
- [x] **Zod validation** — API route validates input
- [x] **No new dependencies** — No changes at all

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component**: Reuses existing `FilterDropdown` at `src/components/kudos-live-board/filter-dropdown.tsx`. No modifications needed — the Department Dropdown implementation (`721-5684`) already updated all styles to match Figma.
- **Data Flow**: Hashtags fetched in `kudos-live-board-client.tsx` → passed as `hashtags` prop to `highlight-section.tsx` → rendered by `<FilterDropdown label="Hashtag" options={hashtags} ...>`.
- **Styling**: Already matches Figma — `p-4 h-14`, `text-base`, `bg-[rgba(255,234,158,0.1)]`, text-shadow glow, focus ring `#15D5CA`.

### Backend Approach

- **No changes needed.** `GET /api/hashtags` returns `{ data: { id, name }[] }`.
- **Hashtag filter** already works on both `/api/kudos?hashtag={id}` and `/api/kudos/highlights?hashtag={id}`.

### Integration Points

All integration is already complete:

| Component | File | Status |
|-----------|------|--------|
| FilterDropdown | `src/components/kudos-live-board/filter-dropdown.tsx` | Styled ✅ |
| HighlightSection (consumer) | `src/components/kudos-live-board/highlight-section.tsx` | Wired ✅ |
| Hashtag API | `src/app/api/hashtags/route.ts` | Working ✅ |
| Kudos filter (hashtag) | `src/app/api/kudos/route.ts` | Working ✅ |
| Highlights filter (hashtag) | `src/app/api/kudos/highlights/route.ts` | Working ✅ |
| Tests (17) | `src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx` | Passing ✅ |

---

## Project Structure

### New Files

None.

### Modified Files

None.

### Dependencies

No new dependencies.

---

## Implementation Strategy

### Status: COMPLETE

All phases below have already been completed as part of the Department Dropdown implementation (`721-5684`), since both dropdowns share the same `FilterDropdown` component.

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 (TDD Red) | 6 style tests written | Done ✅ |
| Phase 2 (TDD Green) | 4 style fixes applied | Done ✅ |
| Phase 3 (Accessibility) | Keyboard nav verified, focus ring fixed to `#15D5CA` | Done ✅ |
| Phase 4 (Edge cases) | Auto-scroll, empty state, mobile overflow | Done ✅ |

### Verification

To confirm everything works for the hashtag use case specifically:

```bash
# Run existing tests
npx vitest run src/components/kudos-live-board/__tests__/filter-dropdown.test.tsx

# Expected: 17/17 pass
```

---

## Testing Strategy

Already complete — 17 tests covering:

| Category | Tests | Status |
|----------|-------|--------|
| Basic behavior (open/close, select, deselect, keyboard) | 9 tests | Passing ✅ |
| Style conformance (bg opacity, font size, glow, padding, scroll, focus ring) | 6 tests | Passing ✅ |
| Edge cases (50-item scroll, empty state) | 2 tests | Passing ✅ |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| None identified | — | — | Feature is already implemented and tested |

### Estimated Complexity

- **Frontend**: None (already done)
- **Backend**: None (already done)
- **Testing**: None (already done)

---

## Next Steps

No tasks needed. If future requirements change (e.g., multi-select, search/type-ahead), a new spec and plan should be created.

---

## Notes

- This plan confirms that the Dropdown Hashtag filter is **fully implemented** as a side effect of the shared `FilterDropdown` component approach.
- The Department Dropdown (`721-5684`) and Hashtag Dropdown (`721-5580`) are intentionally the same component with different data sources — this is correct per Figma design.
- Any future style changes to `FilterDropdown` will automatically apply to both dropdown usages.
