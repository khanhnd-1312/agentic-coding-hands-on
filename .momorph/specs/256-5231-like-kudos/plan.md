# Implementation Plan: Like Kudos

**Frame**: `256-5231-like-kudos`
**Date**: 2026-03-24
**Spec**: `specs/256-5231-like-kudos/spec.md`

---

## Summary

The Like Kudos feature is **~65% already implemented**. Core infrastructure (API routes, `HeartButton` component, `useHeartToggle` hook, DB schema with RLS, tests) exists and works. The remaining work covers **4 spec gaps** identified during planning:

1. **Cross-surface sync** (FR-009) — `HeartButton` instances share no state; liking on highlight carousel does not update feed card count
2. **Error toast on API failure** (FR-007) — current hook silently reverts with no user feedback
3. **`kudo_id` + `heart_count` in POST/DELETE like response** (TR-009 reconciliation) — server response does not include either field; spec requires both for client reconciliation
4. **`is_my_kudo` field in `GET /api/kudos`** (TR-009) — currently client computes this from `sender_id`; server-side flag is required for anonymous kudo safety (anonymous kudos hide sender identity in UI, making client-side computation unreliable)

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15.x (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Supabase (PostgreSQL + RLS + RPC)
**Database**: PostgreSQL via Supabase — `kudos_hearts` table + RPC functions already exist
**Testing**: Vitest (unit/integration), Playwright (E2E)
**State Management**: React hooks + new `KudoLikeContext` (React Context API — no Zustand)
**API Style**: REST (Next.js Route Handlers)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] TypeScript strict mode — all new code must use strict types
- [x] `"use client"` on `KudoLikeContext` provider and `HeartButton` (browser state)
- [x] Supabase RLS — `kudos_hearts` table already has RLS in migration `20260313000000_create_kudos_tables.sql`
- [x] Zod validation — like route already uses `KudosIdParamSchema`; no new input validation needed
- [x] Mobile-first Tailwind — existing component uses utility classes
- [x] No `console.log` in production paths
- [x] Test-first (TDD) — new tests written before code changes
- [x] Path alias `@/*` — already used throughout

**Violations**: None. All constitution rules are satisfied by existing patterns.

---

## Current State vs Spec — Gap Analysis

| Spec Requirement | File | Status | Gap |
|-----------------|------|--------|-----|
| Heart toggle UI (grey ↔ red) | `heart-button.tsx` | ✅ Implemented | — |
| Optimistic UI update | `use-heart-toggle.ts` | ✅ Implemented | — |
| Debounce 300ms | `use-heart-toggle.ts` | ✅ Implemented | — |
| Sender disabled state | `heart-button.tsx` + `kudo-post-card.tsx` | ✅ Implemented | — |
| API POST like | `api/kudos/[id]/like/route.ts` | ✅ Implemented | Missing `kudo_id` + `heart_count` in response; returns extra `liked`/`is_special_day` not in spec |
| API DELETE unlike | `api/kudos/[id]/like/route.ts` | ✅ Implemented | Missing `kudo_id` + `heart_count` in response; returns extra `liked` not in spec |
| Self-like server enforcement (BR-002) | `api/kudos/[id]/like/route.ts` | ✅ Implemented | — |
| Special day +2 tim (backend-only) | `api/kudos/[id]/like/route.ts` | ✅ Implemented | — |
| RLS on kudos_hearts | `supabase/migrations/` | ✅ Implemented | — |
| DB schema (kudos_hearts, RPC functions) | `supabase/migrations/` | ✅ Implemented | — |
| is_liked_by_me in GET /api/kudos | `api/kudos/route.ts` | ✅ Implemented | — |
| **Cross-surface sync (FR-009)** | — | ❌ Missing | Need `KudoLikeContext` |
| **Error toast on failure (FR-007)** | `use-heart-toggle.ts` | ❌ Missing | No toast on catch/rollback |
| **Server reconciliation after like** | `use-heart-toggle.ts` | ⚠️ Partial | Reverts on error, but doesn't sync `heart_count` from server response |
| **`is_my_kudo` field in GET response** | `api/kudos/route.ts` | ⚠️ Partial | Computed client-side from `sender_id`; server flag needed for anonymous safety |
| Unit tests: HeartButton | `__tests__/heart-button.test.tsx` | ✅ Exists | Needs cross-surface sync tests |
| Unit tests: useHeartToggle | `__tests__/use-heart-toggle.test.ts` | ✅ Exists | Needs toast + reconcile tests |
| Integration tests: like route | `__tests__/route.test.ts` | ✅ Exists | — |

---

## Architecture Decisions

### Frontend

- **Cross-surface sync**: Implement `KudoLikeContext` using React Context API (no Zustand — no new dependency)
  - Store: `Record<string, { isLiked: boolean; heartCount: number }>`
  - Actions: `optimisticLike`, `optimisticUnlike`, `reconcile`, `rollback`
  - Provider wraps the Live Board page; seeded from server-fetched kudo data on mount
  - `useHeartToggle` reads/writes from context instead of local state

- **Error toast**: `src/components/kudos-live-board/toast.tsx` **already exists** — use it directly. It accepts `message: string | null`, `onDismiss`, and optional `duration` (default 3000ms). Show on API failure with `duration={2000}` per spec.

- **Server reconciliation**: After `POST/DELETE /api/kudos/{id}/like` succeeds, call `reconcile(kudosId, data.heart_count)` to sync context with authoritative server count.

### Backend

- **Fix POST /api/kudos/[id]/like response**: Align with spec `{ kudo_id, heart_count, tim_awarded }`. After `increment_heart_count` RPC, query `kudos.heart_count`, then return `{ kudo_id: kudosId, heart_count: data.heart_count, tim_awarded: timPoints }`. Remove non-spec fields (`liked`, `is_special_day`). Status stays 201.
- **Fix DELETE /api/kudos/[id]/like response**: Align with spec `{ kudo_id, heart_count, tim_revoked }`. After `decrement_heart_count` RPC, query `kudos.heart_count`, then return `{ kudo_id: kudosId, heart_count: data.heart_count, tim_revoked: timToRevoke }`. Remove non-spec `liked` field. Status stays 200.
- **Add `is_my_kudo` to GET /api/kudos**: Add `is_my_kudo: userId ? k.sender_id === userId : false` to the response transformation in `api/kudos/route.ts`.

> **Note on response alignment**: The current POST response includes `is_special_day` which is not in the spec. Removing it is a breaking change only if tests or clients read this field. Update any existing test assertions when making this change.

### Integration Points

- **Existing**: `HeartButton` → `useHeartToggle` → `fetch /api/kudos/[id]/like`
- **New**: `KudoLikeProvider` wraps `KudosLiveBoardClient` in `src/app/kudo/live/page.tsx` → `HeartButton` reads context instead of isolated local state
- **Supabase RPC**: `increment_heart_count`, `decrement_heart_count`, `award_tim_points`, `revoke_tim_points` — already exist, no changes needed
- **Stats sidebar (US1 Scenario 4 — DEFERRED)**: The spec requires the "Tim nhận" sidebar counter to update after a like. This requires expanding the context to track tim balance, which is out of scope for this PR. Track in a follow-up issue.

---

## Project Structure

### Documentation

```text
.momorph/specs/256-5231-like-kudos/
├── spec.md            ✅ Feature specification (Reviewed)
├── plan.md            ✅ This file
└── design-style.md    ✅ Design specifications (Reviewed)
```

### Source Code — New Files

| File | Purpose |
|------|---------|
| `src/contexts/kudo-like-context.tsx` | React context + provider for cross-surface heart state sync |
| `src/contexts/__tests__/kudo-like-context.test.tsx` | Unit tests for context actions |

### Source Code — Modified Files

| File | Change |
|------|--------|
| `src/hooks/use-heart-toggle.ts` | Replace local `isLiked`/`heartCount` state with context reads; call `reconcile` on API success; call `rollback` + expose `toastMessage`/`dismissToast` on error |
| `src/hooks/__tests__/use-heart-toggle.test.ts` | Add tests: toast on error, server reconciliation, cross-surface sync via context |
| `src/components/kudos-live-board/heart-button.tsx` | Render `<Toast message={toastMessage} onDismiss={dismissToast} duration={2000} />` from hook; fix `aria-label` from `"Like kudos"/"Unlike kudos"` → `"Thích kudo này"/"Bỏ thích kudo này"` |
| `src/components/kudos-live-board/__tests__/heart-button.test.tsx` | Add tests: Toast renders when `toastMessage` is set; `aria-label` is Vietnamese in both liked/unliked states |
| `src/app/api/kudos/[id]/like/route.ts` | Fix POST response to `{ kudo_id, heart_count, tim_awarded }`; fix DELETE response to `{ kudo_id, heart_count, tim_revoked }`; add `heart_count` query after each RPC |
| `src/app/api/kudos/[id]/like/__tests__/route.test.ts` | Add test: POST response includes `kudo_id` + `heart_count`; DELETE response includes `kudo_id` + `heart_count`; update existing assertions that check `liked`/`is_special_day` |
| `src/app/api/kudos/route.ts` | Add `is_my_kudo: boolean` field to each kudo in GET response |
| `src/app/kudo/live/page.tsx` | Wrap `<KudosLiveBoardClient>` with `<KudoLikeProvider initialKudos={[...highlights, ...kudos]}>` (deduplicated by id) |
| `src/components/kudos-live-board/all-kudos-section.tsx` | Add `useEffect(() => { registerKudos(items) }, [items, registerKudos])` to register paginated kudos into context as they load |
| `src/components/kudos-live-board/kudo-post-card.tsx` | Pass `isSender={kudos.is_my_kudo}` instead of computing `currentUserId === kudos.sender_id` |
| `src/components/kudos-live-board/highlight-kudo-card.tsx` | Pass `isSender={kudos.is_my_kudo}` instead of computing `currentUserId === kudos.sender_id` |
| `src/types/kudos.ts` | Add `is_my_kudo: z.boolean()` to `KudosSchema`; update like response types: POST → `{ kudo_id, heart_count, tim_awarded }`, DELETE → `{ kudo_id, heart_count, tim_revoked }` |

### Dependencies — None New

No new packages required. React Context API is sufficient for cross-surface sync.

---

## Implementation Strategy

### Phase 0: TDD Setup (write tests first — constitution §III)

Write failing tests for all gaps **before** writing implementation code.

1. `kudo-like-context.test.tsx` — tests for `optimisticLike`, `optimisticUnlike`, `reconcile`, `rollback`, `registerKudos`
2. `use-heart-toggle.test.ts` additions — test: `toastMessage` set on API error, `reconcile` called with server `heart_count` on success, cross-surface sync reflected in context after optimistic update
3. `heart-button.test.tsx` additions — test: renders `<Toast>` when `toastMessage` is set; `aria-label` is Vietnamese "Thích kudo này" when not liked, "Bỏ thích kudo này" when liked
4. `route.test.ts` additions — test: POST response shape `{ kudo_id, heart_count, tim_awarded }` with no `liked`/`is_special_day`; DELETE response shape `{ kudo_id, heart_count, tim_revoked }` with no `liked`

### Phase 1: Backend — Fix like response shape + add `is_my_kudo`

**Files**: `src/app/api/kudos/[id]/like/route.ts`, `src/app/api/kudos/route.ts`, `src/types/kudos.ts`

1. In POST handler: after `increment_heart_count` RPC, query `kudos.heart_count` (`.select('heart_count').eq('id', kudosId).single()`). Return `NextResponse.json({ kudo_id: kudosId, heart_count: data.heart_count, tim_awarded: timPoints }, { status: 201 })`. Remove old `liked` and `is_special_day` fields.
2. In DELETE handler: after `decrement_heart_count` RPC, query `kudos.heart_count`. Return `NextResponse.json({ kudo_id: kudosId, heart_count: data.heart_count, tim_revoked: timToRevoke })`. Remove old `liked` field.
3. Add `is_my_kudo: userId ? k.sender_id === userId : false` to GET `/api/kudos` response transform.
4. In `src/types/kudos.ts`: add `is_my_kudo: z.boolean()` to `KudosSchema`; create `LikeResponseSchema = z.object({ kudo_id: z.string().uuid(), heart_count: z.number().int(), tim_awarded: z.number().int() })`; create `UnlikeResponseSchema = z.object({ kudo_id: z.string().uuid(), heart_count: z.number().int(), tim_revoked: z.number().int() })`.

### Phase 2: `KudoLikeContext` — Cross-surface sync

**Files**: `src/contexts/kudo-like-context.tsx`

```tsx
// KudoLikeContext shape
interface KudoLikeState {
  kudoLikeMap: Record<string, { isLiked: boolean; heartCount: number }>;
  optimisticLike: (kudoId: string) => void;
  optimisticUnlike: (kudoId: string) => void;
  reconcile: (kudoId: string, serverCount: number) => void;
  rollback: (kudoId: string, prevIsLiked: boolean, prevCount: number) => void;
  /** Register newly loaded kudos (e.g., from pagination) that aren't in the initial seed */
  registerKudos: (kudos: Array<{ id: string; is_liked_by_me: boolean; heart_count: number }>) => void;
}
```

- Initial state seeded from array of `{ id, is_liked_by_me, heart_count }` props passed from Server Component
- `registerKudos` is called by `AllKudosSection` when it loads additional pages via pagination — ensures newly loaded kudos are in the shared context
- No persistence (session-only state; page reload re-seeds from server)

### Phase 3: Update `useHeartToggle` + `HeartButton`

**File 3a**: `src/hooks/use-heart-toggle.ts`

1. Replace local `useState(initialIsLiked)` / `useState(initialHeartCount)` with reads from `useKudoLikeContext()`: `const { kudoLikeMap, optimisticLike, optimisticUnlike, reconcile, rollback } = useKudoLikeContext(); const { isLiked, heartCount } = kudoLikeMap[kudosId] ?? { isLiked: initialIsLiked, heartCount: initialHeartCount };`
2. In `toggle`: call `optimisticLike(kudosId)` / `optimisticUnlike(kudosId)` on context instead of local setState; preserve local `isLoading` state (loading is per-button, not global)
3. On API success: parse response with `LikeResponseSchema` / `UnlikeResponseSchema`; call `reconcile(kudosId, data.heart_count)`
4. On API error: call `rollback(kudosId, prevIsLiked, prevCount)` + set local `toastMessage` state to `"Không thể thực hiện thao tác. Vui lòng thử lại."` (2s)
5. Add `toastMessage: string | null` and `dismissToast: () => void` to `UseHeartToggleResult` interface and return values

**File 3b**: `src/components/kudos-live-board/heart-button.tsx`

6. Import `Toast` from `@/components/kudos-live-board/toast.tsx`; render `<Toast message={toastMessage} onDismiss={dismissToast} duration={2000} />` below the button (both come from the hook result)
7. Fix `aria-label`: change `"Like kudos"` → `"Thích kudo này"` and `"Unlike kudos"` → `"Bỏ thích kudo này"` (Vietnamese UI, spec FR-008)

### Phase 4: Wire `KudoLikeProvider` into Live Board page

**Files**: `src/app/kudo/live/page.tsx`, `src/components/kudos-live-board/all-kudos-section.tsx`, `src/components/kudos-live-board/kudo-post-card.tsx`, `src/components/kudos-live-board/highlight-kudo-card.tsx`

1. In `src/app/kudo/live/page.tsx`, wrap `<KudosLiveBoardClient>` with `<KudoLikeProvider>`. Seed from combined highlights + kudos arrays (deduplicated by id):
   ```tsx
   const initialKudos = [...highlights, ...kudos].filter(
     (k, i, arr) => arr.findIndex(x => x.id === k.id) === i
   );
   // <KudoLikeProvider initialKudos={initialKudos}>
   //   <KudosLiveBoardClient ... />
   // </KudoLikeProvider>
   ```
2. In `AllKudosSection` (`src/components/kudos-live-board/all-kudos-section.tsx`): the component uses `useInfiniteScroll` which exposes an `items` array that grows with each page load. Add:
   ```tsx
   const { registerKudos } = useKudoLikeContext();
   useEffect(() => { registerKudos(items); }, [items, registerKudos]);
   ```
   This ensures every kudo loaded via infinite scroll is registered in the shared context.
3. In `kudo-post-card.tsx` and `highlight-kudo-card.tsx`, replace `isSender={currentUserId === kudos.sender_id}` with `isSender={kudos.is_my_kudo}` (server-provided flag, safe for anonymous kudos). Verify no other child uses `currentUserId` prop before removing it from the component interface.
4. `HeartButton` components automatically read state from `KudoLikeContext` via `useHeartToggle`.

### Phase 5: Run all tests, verify no regressions

```bash
yarn test
yarn lint
yarn build
```

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: `KudoLikeContext` ↔ `HeartButton` ↔ `useHeartToggle` cross-surface update
- [x] **App ↔ Data Layer**: POST/DELETE like API hit real Supabase test DB (integration tests already exist in `route.test.ts`)
- [x] **User workflows**: Like on highlight card → verify feed card count updates

### Key Test Scenarios

1. **Happy Path**
   - [ ] Like on highlight card → feed card for same kudo shows incremented count
   - [ ] Unlike on feed card → highlight card for same kudo shows decremented count
   - [ ] API success → `heart_count` reconciled from server response

2. **Error Handling**
   - [ ] API failure on like → count reverts on ALL surfaces + toast shown
   - [ ] API failure on unlike → count reverts on ALL surfaces + toast shown

3. **Edge Cases**
   - [ ] Sender's card on all surfaces: disabled on all
   - [ ] Debounce: rapid clicks trigger single API call
   - [ ] Like/unlike net no-change: no API call made

### Test Environment

- **Unit tests**: Vitest with mocked fetch, mocked context
- **Integration tests**: Vitest + Supabase local instance (via `make up`)
- **Test data**: Existing fixtures/seed patterns in `route.test.ts`

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `KudoLikeContext` actions | 100% | High |
| `useHeartToggle` with context | 90% | High |
| API route responses (`heart_count`) | 100% | High |
| Cross-surface sync integration | Key flows | High |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Context re-renders cause performance issue on large feed | Low | Medium | Memoize context value with `useMemo`; `HeartButton` subscribes only to its kudo's slice |
| `heart_count` query adds latency to like/unlike API | Low | Low | Single `.select('heart_count').eq('id', kudosId).single()` — <5ms |
| `useHeartToggle` refactor breaks existing tests | Medium | High | Run existing tests first; keep same hook interface, just change state source |
| POST response shape change (`liked`/`is_special_day` removed) | Medium | Medium | Update all existing route.test.ts assertions that check for these fields |
| `currentUserId` prop removal from card components | Low | Low | Verify no other child uses this prop before removing; keep if still needed elsewhere |

### Estimated Complexity

- **Frontend**: Low–Medium (new context + hook refactor)
- **Backend**: Low (small additions to existing routes)
- **Testing**: Low (patterns already established)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed ✅
- [x] `spec.md` approved (Status: Reviewed) ✅
- [x] Codebase research completed (this document) ✅
- [x] DB schema and RPC functions exist ✅
- [x] API routes exist ✅

### External Dependencies

- None — all required Supabase tables, RPC functions, and base components already exist

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Begin Phase 0 (TDD)**: Write failing tests first
3. Implement phases 1→4 in order
4. Run `yarn test && yarn lint && yarn build` before PR

---

## Notes

- The existing `HeartButton` focus color uses `var(--klb-color-accent-gold)` (gold outline) — this differs from the spec's `#D4271D`. The existing implementation follows the Live Board color scheme. **Do not change this** — it is intentional per the existing design tokens.
- `isSender` is currently computed client-side (`currentUserId === kudos.sender_id`). Phase 4 replaces this with `kudos.is_my_kudo` (server flag) in both `kudo-post-card.tsx` and `highlight-kudo-card.tsx`. The `currentUserId` prop on these components can be removed once `is_my_kudo` is the sole source.
- The `KudoLikeContext` should live in `src/contexts/` (create directory if needed), not in `src/hooks/` — it is a React context provider, not a hook.
- `specialDay.multiplier` is already read dynamically from the `special_days` table (not hardcoded to 2) — this is better than the spec assumes.
- Toast component **confirmed at** `src/components/kudos-live-board/toast.tsx` — no new component needed.
- Live Board page is at `src/app/kudo/live/page.tsx` (no `(protected)` route group). The `KudoLikeProvider` wraps `KudosLiveBoardClient` inside this file.
- Stats sidebar "Tim nhận" update (US1 Scenario 4) is explicitly **deferred** — out of scope for this PR. Would require tracking tim balance in context, which adds significant complexity.
- Scale animation on like (spec: `1 → 1.3 → 1` over 300ms) is **deferred** — the existing implementation has `hover:scale-105` which is close but not spec-exact. A follow-up CSS animation pass can address this without blocking core functionality.
- `GET /api/kudos/{id}` (single kudo endpoint) — confirmed to **not exist** in the codebase (`src/app/api/kudos/[id]/route.ts` does not exist). The detail view (modal) uses data passed from the already-fetched kudo list, so no change is needed for this feature. The spec's API dependency list marks it as "Exists (extend response)" — this is inaccurate; no action required.
