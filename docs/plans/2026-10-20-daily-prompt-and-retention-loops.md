# Plan: Daily Prompt Blind Reveal & Duo Streak Retention Loop

- **Status:** done
- **Size:** M   ·   **Branch:** `claude/retention-daily-prompt` @ `HEAD`
- **Owner approval:** 2026-10-20 by user request ("نعم")   ·   **Codex plan review:** skipped
- **Created:** 2026-10-20 by Antigravity   ·   **Updated:** 2026-10-20

## Goal and acceptance criteria
Implement the Daily Prompt with Blind Reveal mechanism and Duo Streak habit loop:
1. **Daily Prompt Engine:** Daily rotating question for co-owners.
2. **Blind Reveal Protocol:** Partner 1 cannot see Partner 2's answer, and Partner 2 cannot see Partner 1's answer, until both have submitted.
3. **Simultaneous Unlocking:** When both have submitted, both answers are revealed side-by-side.
4. **Duo Streak / Flame:** Streak counter increments upon completing the daily prompt.
5. All logic verified with TDD (RED → GREEN → REFACTOR) with 37/37 passing tests.
6. Live interactive UI widget on Home Feed.

## Tasks (each one runs a full RED → GREEN → REFACTOR cycle)
| # | Task | Test written first (file › case) | RED | GREEN | Refactor |
|---|------|----------------------------------|-----|-------|----------|
| 1 | Daily Prompt Initialization & State | `tests/daily-prompts.test.mjs` › initializes daily prompt with PENDING state | ☑ | ☑ | ☑ |
| 2 | Blind Privacy Guard | `tests/daily-prompts.test.mjs` › hides answers from co-owner until both have answered | ☑ | ☑ | ☑ |
| 3 | Simultaneous Reveal & Streak Increment | `tests/daily-prompts.test.mjs` › reveals answers and increments streak on second answer | ☑ | ☑ | ☑ |
| 4 | Interactive UI in Browser | Browser verification on port `4650` › verify blind submit, reveal animation, streak counter | ☑ | ☑ | ☑ |

## QA
- [x] Full test suite: `npm test` (37/37 passed)
- [x] Lint check: `npm run lint` (0 errors)
- [x] Build verification: `npm run build` (success)
- [x] Live browser verification on `http://localhost:4650`
