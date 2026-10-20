# Plan: Phase 02 — Authentication and Duo Invitations

- **Status:** done
- **Size:** M   ·   **Branch:** `claude/phase-02-auth-invitations` @ `HEAD`
- **Owner approval:** 2026-10-20 by user request ("الموالي")   ·   **Codex plan review:** skipped
- **Created:** 2026-10-20 by Antigravity   ·   **Updated:** 2026-10-20

## Goal and acceptance criteria
Implement the complete private authentication, partner invitation lifecycle, cryptographic token handshake, atomic duo activation, and populate rich social demonstration content:
1. Zod schemas enforcing strict validation for user registration, partner invitations, and compact acceptance.
2. Cryptographic partner invitation workflow with token hashing (`HMAC-SHA256`) and 7-day expiration.
3. Handshake execution: Duo account transitions from `PENDING_PARTNER` to `ACTIVE` only upon second verified owner acceptance with explicit agreement to the Equal Ownership Compact.
4. Revocation and expiration protection: Expired or revoked invitations cannot be accepted.
5. All logic backed by full TDD cycles (RED → GREEN → REFACTOR) with 100% passing tests (28/28 passed).
6. Rich social statuses/stories, multi-duo feed, threaded comments, and live interactions populated for realistic demonstration.

## Tasks (each one runs a full RED → GREEN → REFACTOR cycle)
| # | Task | Test written first (file › case) | RED | GREEN | Refactor |
|---|------|----------------------------------|-----|-------|----------|
| 1 | Validation Schemas (Zod) | `tests/validators.test.mjs` › validates registration & invitation payloads | ☑ | ☑ | ☑ |
| 2 | Cryptographic Invitation Generation & Hash | `tests/invitations.test.mjs` › generates high-entropy token & deterministic hash | ☑ | ☑ | ☑ |
| 3 | Token Verification & Expiry Guard | `tests/invitations.test.mjs` › rejects expired & invalid tokens | ☑ | ☑ | ☑ |
| 4 | Atomic Acceptance & Compact Enforcement | `tests/invitations.test.mjs` › enforces Compact agreement & activates duo | ☑ | ☑ | ☑ |
| 5 | Invitation Revocation & Anti-Replay | `tests/invitations.test.mjs` › prevents re-use of accepted or revoked tokens | ☑ | ☑ | ☑ |

## QA (verification commands, taken from package.json)
- [x] Full suite: `npm test` (28/28 passing)
- [x] Type check / lint: `npm run lint` (0 violations)
- [x] Build: `npm run build` (success)
- [x] Live preview: `http://localhost:4650` (stories, rich feed, interactive comments, like counters)

## Execution log (append; real output only)
- 2026-10-20: Tests written in RED state for validators and invitations. Implemented `src/lib/validators.mjs` and `src/lib/invitations.mjs`. All 28 tests passing.
- 2026-10-20: Populated interactive Stories bar (8 duos), multiple Two Perspectives and single posts, live threaded comments, interactive likes, and follow actions.

## Outcome
Phase 02 fully delivered and verified.
