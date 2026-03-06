<!--
SYNC IMPACT REPORT
==================
Version change   : none → 1.0.0 (initial ratification)
Added principles : I. Clean Code & Source Organization
                   II. Framework Best Practices
                   III. Test-First (TDD, NON-NEGOTIABLE)
                   IV. Responsive & Accessible UI
                   V. Security First (OWASP)
Added sections   : Tech Stack & Tooling, Development Workflow
Removed sections : none
Templates updated:
  ✅ .momorph/templates/plan-template.md  — constitution check already present, no edits needed
  ✅ .momorph/templates/spec-template.md  — already references constitution, no edits needed
  ✅ .momorph/templates/tasks-template.md — already references constitution, no edits needed
Deferred TODOs   : none
-->

# Agentic Coding Hands-on Constitution

## Core Principles

### I. Clean Code & Source Organization

- All code MUST be written in **TypeScript** with strict mode enabled (`"strict": true`).
- File and folder names MUST use `kebab-case`; React components MUST use `PascalCase` for the component name and `kebab-case` for the filename (e.g., `user-card.tsx` exports `UserCard`).
- Path alias `@/*` (maps to `src/*`) MUST be used for all internal imports; relative `../` imports that cross feature boundaries are FORBIDDEN.
- Each file MUST have a single, clear responsibility. Files exceeding ~200 lines are a signal to split.
- DRY and YAGNI principles MUST be applied: no speculative abstractions, no duplicate logic, no dead code.
- Functions MUST be short and named to express intent. Variables MUST use descriptive names — single-letter names are allowed only in loop indices.
- No commented-out code may be committed. Use `// TODO(ticket):` for deferred work.

**Rationale**: Consistent naming and structure reduce cognitive load and make AI-assisted code generation predictable and reliable.

### II. Framework Best Practices

#### Next.js (App Router)
- Prefer **React Server Components** (RSC) by default. Add `"use client"` only when browser APIs, event handlers, or hooks requiring client state are needed.
- Data fetching MUST happen in Server Components or Route Handlers — never in `useEffect`.
- Route Handlers (`app/api/`) MUST validate all inputs with **Zod** before processing.
- Use Next.js `<Image>`, `<Link>`, and `<Script>` built-ins; raw `<img>`, `<a>`, `<script>` are FORBIDDEN for internal assets/links.

#### Cloudflare Workers
- All runtime code MUST be **edge-safe**: no Node.js-only APIs (`fs`, `path`, `crypto` from Node, etc.). Use Web Crypto API (`crypto.subtle`) instead.
- Use `getCloudflareContext()` from `@opennextjs/cloudflare` to access Cloudflare bindings; never access `process.env` for CF-specific vars at runtime.
- Observability (`wrangler.jsonc` `observability: enabled`) MUST remain enabled in all environments.

#### Supabase
- Browser-side components MUST use the client from `@/libs/supabase/client.ts`.
- Server Components and Route Handlers MUST use the SSR client from `@/libs/supabase/server.ts`.
- Direct instantiation of `createClient` outside `src/libs/supabase/` is FORBIDDEN.
- Auth session MUST be managed via the middleware at `src/libs/supabase/middleware.ts`; never roll a custom session mechanism.
- All database mutations MUST go through Supabase migrations (`supabase/migrations/`); schema changes via the dashboard are FORBIDDEN in production.

**Rationale**: Respecting framework boundaries prevents subtle bugs (e.g., session leaks in RSC, Node API calls crashing the CF Worker) and keeps the codebase maintainable as each tool evolves.

### III. Test-First (TDD, NON-NEGOTIABLE)

- Tests MUST be written **before** implementation code. The Red-Green-Refactor cycle MUST be followed:
  1. Write a failing test (Red)
  2. Write the minimum code to make it pass (Green)
  3. Refactor without breaking tests (Refactor)
- User stories MUST have at least one integration test covering the happy path before the story is considered done.
- Unit tests cover pure functions and isolated components; integration tests cover full request-response cycles and Supabase interactions.
- Test files MUST be co-located with source files using the `.test.ts` / `.test.tsx` suffix, or placed under `tests/` for integration/E2E tests.
- Tests MUST NOT be skipped (`it.skip`, `test.skip`) without a linked issue comment.

**Rationale**: TDD reduces defect density, forces clearer API design, and ensures every task is independently verifiable — critical for the incremental delivery model used in this project.

### IV. Responsive & Accessible UI

- All UI MUST be built **mobile-first**: default styles target mobile, then `sm:` (640px), `md:` (768px), `lg:` (1024px), and `xl:` (1280px) modifiers override for larger viewports.
- Every interactive element MUST be keyboard-navigable and have a visible focus ring (never `outline: none` without a replacement).
- Color contrast MUST meet **WCAG 2.1 AA** (4.5:1 for normal text, 3:1 for large text and UI components).
- Images MUST have meaningful `alt` text; decorative images MUST have `alt=""`.
- Semantic HTML MUST be used: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>` for landmarks.
- Breakpoints to verify in QA: **360px** (mobile), **768px** (tablet), **1440px** (desktop).

**Rationale**: Responsive + accessible design is a baseline expectation, not a bonus. The training project targets a broad audience across device types.

### V. Security First (OWASP)

- **Input Validation (A03)**: All user-supplied data MUST be validated with **Zod** schemas before use. Never trust client-provided values on the server.
- **Authentication & Authorization (A01/A07)**: Every protected route/API MUST check the Supabase session. Row-Level Security (RLS) policies MUST be enabled on all Supabase tables.
- **Injection Prevention (A03)**: Use Supabase query builders exclusively; never concatenate raw SQL strings. Escape any user content rendered as HTML.
- **XSS Prevention (A03)**: Avoid `dangerouslySetInnerHTML`; if required, sanitize with a trusted library. Do not store unsanitized HTML in the database.
- **Sensitive Data (A02)**: Secrets MUST live in environment variables, never hard-coded. The `.env` file MUST NOT be committed (already in `.gitignore`). Log MUST NOT contain PII or tokens.
- **CSRF (A01)**: Route Handlers that mutate state MUST verify the request origin or use Supabase's built-in token mechanism.
- **Dependency Security**: `yarn audit` MUST pass (no high/critical vulnerabilities) before any production deployment.

**Rationale**: OWASP Top 10 violations are the most common cause of security incidents. Enforcing these rules at the constitution level makes them non-negotiable for every PR.

---

## Tech Stack & Tooling

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Language | TypeScript | 5.x | strict mode required |
| Framework | Next.js | 15.x | App Router only |
| UI Library | React | 19.x | RSC-first |
| Styling | TailwindCSS | 4.x | utility-first, mobile-first |
| Backend/BaaS | Supabase | 2.x | PostgreSQL + Auth + RLS |
| Edge Runtime | Cloudflare Workers | via wrangler 4.x | via @opennextjs/cloudflare |
| Validation | Zod | latest | MUST use for all I/O boundaries |
| Package Manager | Yarn | 1.22.22 | do not switch to npm/pnpm |
| Linting | ESLint | 9.x | enforced in CI |

**Banned patterns**:
- `any` TypeScript type without an explicit `// eslint-disable` justification comment
- `console.log` in production code (use structured logging or remove before merge)
- `eval()`, `new Function()`, or dynamic `require()` calls
- Importing from `node:*` APIs in edge-deployed code

---

## Development Workflow

### Daily Dev Loop
1. `make up` — start Supabase local + dev server
2. Write failing tests for the feature (TDD Red)
3. Implement code (TDD Green → Refactor)
4. `yarn lint && yarn build` — MUST pass before commit
5. `make down` — stop containers when done

### Pull Request Checklist
- [ ] All new code has tests (unit + integration where applicable)
- [ ] `yarn lint` passes with zero errors
- [ ] `yarn build` succeeds (TypeScript compiles, no type errors)
- [ ] No new `any` types without justification
- [ ] Responsive breakpoints verified at 360px / 768px / 1440px
- [ ] No secrets or PII in code or logs
- [ ] Supabase RLS policies updated if schema changed
- [ ] `yarn audit` shows no high/critical vulnerabilities

### Database Changes
- ALL schema changes MUST be done via `supabase/migrations/` SQL files
- Run `supabase db push` locally before committing migrations
- RLS policies MUST be included in the same migration file as table creation

### Deployment
- **Preview**: `make preview` (Cloudflare preview deployment)
- **Production**: `make deploy` — requires passing CI and senior review

---

## Governance

This constitution supersedes all other practices, style guides, or informal conventions.
Any amendment MUST:
1. Increment the version following semantic versioning (MAJOR for breaking principle changes, MINOR for additions, PATCH for clarifications)
2. Update `LAST_AMENDED_DATE` to the amendment date
3. Add an entry to the Sync Impact Report HTML comment at the top of this file
4. Be reviewed and approved before merging

All PRs MUST be checked against this constitution. Violations require explicit justification
documented in the PR description. Unexplained violations MUST be rejected.

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
