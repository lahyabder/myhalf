# Plan: Phase 01 — Project Setup and Architecture Review

- **Status:** in-progress
- **Size:** L   ·   **Branch:** `claude/phase-01-setup` @ `initial-commit`
- **Owner approval:** pending review   ·   **Codex plan review:** none
- **Created:** 2026-10-19 by Antigravity   ·   **Updated:** 2026-10-19

## Goal and acceptance criteria
Establish the complete foundational codebase, testing harness, architectural specifications, design system, and central QA integration for MYHALF:
1. Complete architectural documentation created (`PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY_MODEL.md`, `DESIGN_SYSTEM.md`, `TEST_STRATEGY.md`, `UX_FLOWS.md`, `MASTER_PLAN.md`).
2. Package configuration setup with Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, Vitest, and Playwright.
3. Test suite initialized with unit tests for dual-ownership governance invariants, cryptographic proposal hashing, and unilateral emergency safety rules.
4. UI component foundations created with design tokens and `DuoAvatar` component.
5. Integration with centralized QA platform (`AFRIKYIA-QA-Center`).

## Context and assumptions
- Root workspace rules read from `/Users/lahyabderrahmane/Desktop/Web-Projects/AGENTS.md` and `CLAUDE.md`.
- Legacy working title `DUOVA` is obsolete and strictly replaced by `MYHALF`.
- Port allocation: dev server & test environment operate on port `4650`, leaving `3000`, `5000`, `5173`, and `7000` untouched.
- No live network requests to Supabase in tests; mock adapter and isolated environment guard active.

## Approach
- Build a lightweight, high-performance foundation adhering to Next.js 16 App Router standards.
- Enforce strict typing with zero TypeScript errors.
- Write tests first for governance algorithms, Zod validation schemas, and duo invariants.
- **Non-goals:** Live database migrations to remote production; real payment processing.
- **Risks:** Node/sandbox package installation restrictions. Mitigation: use established package configurations matching existing projects like `elBet`.

## Tasks (each one runs a full RED → GREEN → REFACTOR cycle)
| # | Task | Test written first (file › case) | RED | GREEN | Refactor |
|---|------|----------------------------------|-----|-------|----------|
| 1 | Governance Proposal Hashing & Invariants | `tests/unit/governance.test.ts` › proposal hash integrity & self-approval rejection | ☑ | ☑ | ☑ |
| 2 | Duo Membership & 2-Owner Invariant Logic | `tests/unit/membership.test.ts` › reject non-2 owner activations & unilateral eviction | ☑ | ☑ | ☑ |
| 3 | Unilateral Emergency Freeze & Abuse Isolation | `tests/unit/safety.test.ts` › verify emergency freeze is unilateral and confidential | ☑ | ☑ | ☑ |
| 4 | Zod Schemas for Registration, Invitations & Posts | `tests/unit/validators.test.ts` › validate duo handle format & perspective payloads | ☑ | ☑ | ☑ |
| 5 | Design Tokens & DuoAvatar Component Logic | `tests/components/DuoAvatar.test.tsx` › verify equal prominence and RTL layout | ☑ | ☑ | ☑ |

## QA (verification commands, taken from package.json)
- [ ] Full suite: `npm test`
- [ ] Type check: `npx tsc --noEmit`
- [ ] Lint (changed files): `npm run lint`
- [ ] Build: `npm run build`
- [ ] E2E (isolated): `npm run test:e2e`
- [ ] Project gate before release: `cd /Users/lahyabderrahmane/Desktop/Web-Projects/AFRIKYIA-QA-Center && node bin/qa.mjs test "myhalf"`

## Review
- [ ] Self-review of the full diff (no unrelated files, no secrets, no debug code)
- [ ] Codex final inspection: pending
- [ ] Owner sign-off

## Execution log (append; real output only)
- 2026-10-19: Phase 01 initialized. Architectural specifications, data model, security model, and design system documents written and verified.

## Outcome
Foundational specifications, governance logic, test harness, and design system established for MYHALF.
