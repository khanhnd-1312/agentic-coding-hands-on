# Tasks: Like Kudos

**Frame**: `256-5231-like-kudos`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

> **TDD Note**: Constitution §III is NON-NEGOTIABLE. Failing tests MUST be written before implementation in every phase. The Red → Green → Refactor cycle applies to every task pair below.

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US5 per spec.md)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the only new directory/structure needed before any implementation begins.

- [x] T001 Create `src/contexts/` directory and `src/contexts/__tests__/` sub-directory (no new packages needed — React Context API is already available)

---

## Phase 2: Foundation — Types & Schemas (Blocking Prerequisites)

**Purpose**: Update shared type definitions that every subsequent task depends on. No user story implementation can import correct types until this phase is complete.

**⚠️ CRITICAL**: Complete before any Phase 3+ work begins.

- [x] T002 Add `is_my_kudo: z.boolean()` field to `KudosSchema` and corresponding `Kudos` TypeScript type | `src/types/kudos.ts`
- [x] T003 [P] Create `LikeResponseSchema = z.object({ kudo_id: z.string().uuid(), heart_count: z.number().int(), tim_awarded: z.number().int() })` and export `LikeResponse` type | `src/types/kudos.ts`
- [x] T004 [P] Create `UnlikeResponseSchema = z.object({ kudo_id: z.string().uuid(), heart_count: z.number().int(), tim_revoked: z.number().int() })` and export `UnlikeResponse` type | `src/types/kudos.ts`

**Checkpoint**: Types ready — all downstream files can now import correct schemas

---

## Phase 3: US1 + US2 — Like & Unlike with Cross-Surface Sync (Priority: P1) 🎯 MVP

**Goal**: A user can like and unlike any kudo; the heart count and icon update immediately (optimistic) across ALL visible card surfaces in the same session; API failure reverts state and shows a toast.

**Independent Test**:
1. Open Live Board with a kudo visible in both the Highlight carousel and the All Kudos feed
2. Like it on the Highlight card → verify the feed card count also increments (no page reload)
3. Trigger an API error → verify both surfaces revert AND a Vietnamese toast appears

### Tests — Write First (TDD Red) ✅

- [x] T005 [P] Write failing tests for `KudoLikeContext`: `optimisticLike`, `optimisticUnlike`, `reconcile`, `rollback`, `registerKudos` actions | `src/contexts/__tests__/kudo-like-context.test.tsx`
- [x] T005 [P] Write failing tests for `useHeartToggle` additions: `toastMessage` is set on API error; `reconcile` is called with server `heart_count` on success; cross-surface state reflected in context | `src/hooks/__tests__/use-heart-toggle.test.ts`
- [x] T005 [P] Write failing tests for `HeartButton`: renders `<Toast>` when `toastMessage` is truthy; `aria-label` is `"Thích kudo này"` (not liked) and `"Bỏ thích kudo này"` (liked) | `src/components/kudos-live-board/__tests__/heart-button.test.tsx`
- [x] T005 [P] Write failing route tests: POST response shape `{ kudo_id, heart_count, tim_awarded }` with no `liked`/`is_special_day`; DELETE response shape `{ kudo_id, heart_count, tim_revoked }` with no `liked` | `src/app/api/kudos/[id]/like/__tests__/route.test.ts`

### Backend (US1 + US2)

- [x] T005 [US1] Fix `POST /api/kudos/[id]/like` response: after `increment_heart_count` RPC, query `kudos.heart_count`, return `{ kudo_id: kudosId, heart_count: data.heart_count, tim_awarded: timPoints }` with status 201; remove `liked` and `is_special_day` fields | `src/app/api/kudos/[id]/like/route.ts`
- [x] T010 [US2] Fix `DELETE /api/kudos/[id]/like` response: after `decrement_heart_count` RPC, query `kudos.heart_count`, return `{ kudo_id: kudosId, heart_count: data.heart_count, tim_revoked: timToRevoke }`; remove `liked` field | `src/app/api/kudos/[id]/like/route.ts`

### Context (US1 + US2)

- [x] T010 [US1] Create `KudoLikeContext` provider with `kudoLikeMap`, `optimisticLike`, `optimisticUnlike`, `reconcile`, `rollback`, `registerKudos` — memoize context value with `useMemo`; seed from `initialKudos` prop | `src/contexts/kudo-like-context.tsx`

### Hook (US1 + US2)

- [x] T010 [US1] Refactor `useHeartToggle`: replace local `isLiked`/`heartCount` state with reads from `useKudoLikeContext()` (`kudoLikeMap[kudosId] ?? { isLiked: initialIsLiked, heartCount: initialHeartCount }`); keep `isLoading` as local state (per-button) | `src/hooks/use-heart-toggle.ts`
- [x] T010 [US1] In `useHeartToggle.toggle`: call `optimisticLike(kudosId)` / `optimisticUnlike(kudosId)` instead of local `setState`; on API success parse with `LikeResponseSchema`/`UnlikeResponseSchema` and call `reconcile(kudosId, data.heart_count)` | `src/hooks/use-heart-toggle.ts`
- [x] T010 [US2] In `useHeartToggle` error path: call `rollback(kudosId, prevIsLiked, prevCount)` and set `toastMessage` to `"Không thể thực hiện thao tác. Vui lòng thử lại."`; add `toastMessage: string | null` and `dismissToast: () => void` to `UseHeartToggleResult` interface and return values | `src/hooks/use-heart-toggle.ts`

### Component (US1 + US2)

- [x] T010 [US1] Update `HeartButton`: import `Toast` from `@/components/kudos-live-board/toast.tsx`; render `<Toast message={toastMessage} onDismiss={dismissToast} duration={2000} />` using values from hook result | `src/components/kudos-live-board/heart-button.tsx`
- [x] T010 [US1] Fix `HeartButton` `aria-label`: change `"Like kudos"` → `"Thích kudo này"` and `"Unlike kudos"` → `"Bỏ thích kudo này"` | `src/components/kudos-live-board/heart-button.tsx`

### Provider Wiring (US1 + US2)

- [x] T010 [US1] Wrap `<KudosLiveBoardClient>` with `<KudoLikeProvider>` in page.tsx: combine highlights + kudos arrays into a deduplicated `initialKudos` seed array (`[...highlights, ...kudos].filter((k, i, arr) => arr.findIndex(x => x.id === k.id) === i)`) | `src/app/kudo/live/page.tsx`
- [x] T010 [US1] In `AllKudosSection`: call `const { registerKudos } = useKudoLikeContext()` and add `useEffect(() => { registerKudos(items); }, [items, registerKudos])` to register paginated kudos as they load via infinite scroll | `src/components/kudos-live-board/all-kudos-section.tsx`

**Checkpoint**: Run `yarn test` — all Phase 3 tests should now pass. Cross-surface sync working.

---

## Phase 4: US3 — Sender Cannot Like Own Kudo via `is_my_kudo` (Priority: P1)

**Goal**: The `isSender` disabled state on `HeartButton` is computed from the server-provided `is_my_kudo` flag instead of client-side comparison, making it safe for anonymous kudos where `sender_id` is not exposed in the UI.

**Independent Test**:
1. Log in as the sender of an anonymous kudo
2. Navigate to Live Board — the heart button on that kudo must be disabled (not-allowed cursor, greyed out)
3. Verify no API call is made when clicking the disabled button

### Tests — Write First (TDD Red) ✅

- [x] T010 [US3] Write failing test: `GET /api/kudos` response includes `is_my_kudo: true` for kudos where the authenticated user is the sender, `is_my_kudo: false` otherwise | `src/app/api/kudos/__tests__/route.test.ts`

### Backend (US3)

- [x] T020 [US3] Add `is_my_kudo: userId ? k.sender_id === userId : false` to each kudo in the GET `/api/kudos` response transformation | `src/app/api/kudos/route.ts`

### Frontend (US3)

- [x] T020 [P] [US3] Replace `isSender={currentUserId === kudos.sender_id}` with `isSender={kudos.is_my_kudo}` in `KudoPostCard`; verify no other child uses `currentUserId` before removing it from the component's prop interface | `src/components/kudos-live-board/kudo-post-card.tsx`
- [x] T020 [P] [US3] Replace `isSender={currentUserId === kudos.sender_id}` with `isSender={kudos.is_my_kudo}` in `HighlightKudoCard`; remove `currentUserId` prop from interface if no longer needed | `src/components/kudos-live-board/highlight-kudo-card.tsx`

**Checkpoint**: Run `yarn test` — all Phase 4 tests pass. Anonymous kudo self-like prevention works.

---

## Phase 5: US4 + US5 — Special Day & Debounce Verification (Priority: P2)

**Goal**: Confirm the already-implemented special day (+2 tim) and debounce (300ms) behaviours are unaffected by the Phase 3–4 refactors.

**Independent Test**:
- US4: Database shows `is_special_day = true` on a like record when a special day is configured; sender's tim balance increases by 2, not 1.
- US5: Clicking heart button 5 times within 200ms triggers exactly 1 API call.

> **Note**: US4 and US5 are already implemented. These tasks verify no regression from the Phase 3 refactor.

- [x] T020 [US4] Run existing special day integration tests; confirm `tim_awarded: 2` in response when special day is active; fix any assertion failures caused by response shape change (removed `is_special_day` field from response) | `src/app/api/kudos/[id]/like/__tests__/route.test.ts`
- [x] T020 [US5] Run existing debounce unit tests; confirm single API call on rapid clicks; update any test mocks that expected old response shape (`liked`, `is_special_day`) | `src/hooks/__tests__/use-heart-toggle.test.ts`

**Checkpoint**: All 5 user stories testable and passing.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification before PR — no new features, only quality gates.

- [x] T020 [P] Run `yarn test` and fix any remaining regressions across all test files
- [x] T020 [P] Run `yarn lint` and resolve all ESLint violations (no `any` types, no `console.log`)
- [x] T020 Run `yarn build` — verify TypeScript strict mode compilation succeeds and no type errors in new context/hook code

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Types/Foundation)  ← BLOCKS all stories
            ├── Phase 3 (US1+US2: Like/Unlike)  ← MVP
            │       └── Phase 4 (US3: is_my_kudo)
            │               └── Phase 5 (US4+US5: verification)
            │                       └── Phase 6 (Polish)
```

### Within Phase 3 (critical path)

```
T005–T008 (failing tests written in parallel)
    └── T009 + T010 (backend route fixes, sequential — same file)
    └── T011 (KudoLikeContext created)
            └── T012 → T013 → T014 (hook refactor, sequential — same file)
                    └── T015 + T016 (HeartButton updates, sequential — same file)
                            └── T017 → T018 (provider wiring)
```

### Parallel Opportunities

| Tasks | Why parallel |
|-------|-------------|
| T003 + T004 | Different schema additions in same file pass — order-independent |
| T005 + T006 + T007 + T008 | All test files are different |
| T015 + T016 | Can be done in one sitting (same file, no conflict) |
| T021 + T022 | Different component files |
| T025 + T026 | Different tools, independent |

---

## Implementation Strategy

### MVP Scope (Recommended — Phase 1–3 only)

1. Complete Phase 1 + 2 (types)
2. Complete Phase 3 (US1+US2: like/unlike + cross-surface sync + toast)
3. **STOP and VALIDATE**: Run tests, manually test cross-surface sync on Live Board
4. Proceed to Phase 4 (US3: is_my_kudo) once MVP is verified

### Full Delivery

1. Phase 1+2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
2. Commit after each phase checkpoint
3. Run `yarn test` before moving to the next phase

---

## Notes

- Mark tasks complete as you go: `[x]`
- Commit after each phase checkpoint (or after logical task groups)
- **Do NOT skip TDD**: Write the failing test for each task group before writing implementation code
- `src/contexts/` directory must be created in Phase 1 before any context code is written
- The `KudoLikeProvider` in page.tsx wraps a `"use client"` component — this is valid in Next.js App Router (Server Components can render Client Context Providers)
- If `currentUserId` prop becomes unused after T021/T022, remove it from both `kudo-post-card.tsx` and `highlight-kudo-card.tsx` prop interfaces; also remove it from `all-kudos-section.tsx` which passes it down
- Response shape changes (removing `liked`/`is_special_day`) are breaking — update ALL existing test assertions before the phase checkpoint
