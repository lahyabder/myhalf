# Plan: Standout International Duo Features & Interactive Enhancements

- **Status:** done
- **Size:** M   ·   **Branch:** `claude/standout-duo-features` @ `HEAD`
- **Owner approval:** 2026-10-20 by user request ("نعم")   ·   **Codex plan review:** skipped
- **Created:** 2026-10-20 by Antigravity   ·   **Updated:** 2026-10-20

## Goal and acceptance criteria
Elevate MYHALF with standout international-grade duo features:
1. **Interactive Two-Perspectives Split Slider:** Draggable visual comparison slider between Perspective 1 and Perspective 2 with touch/mouse support and flip-card narrative toggle.
2. **2x2 Duo Messaging Hub:** Duo-to-Duo chat architecture supporting both individual co-owner voice pills and unified duo voice, plus a private Co-Owner Scratchpad.
3. **VIP Dynamic Share Card Generator:** Exportable social card with dual avatars, customized background, and share triggers.
4. **Duo Milestones Timeline:** Shared historical milestone tracker celebrating duo achievements.
5. All backend utility logic backed by failing-then-passing TDD test suite (33/33 passed).

## Tasks (each one runs a full RED → GREEN → REFACTOR cycle)
| # | Task | Test written first (file › case) | RED | GREEN | Refactor |
|---|------|----------------------------------|-----|-------|----------|
| 1 | Duo Chat Voice Attribution Logic | `tests/social-features.test.mjs` › validates message voice attribution | ☑ | ☑ | ☑ |
| 2 | Milestone Calculation & Eligibility | `tests/social-features.test.mjs` › computes anniversary milestones & badge eligibility | ☑ | ☑ | ☑ |
| 3 | Split Slider & Share Card Data Model | `tests/social-features.test.mjs` › formats share card payload & slider bounds | ☑ | ☑ | ☑ |
| 4 | Interactive UI Integration in Browser | Browser verification on port `4650` › verify slider drag, 2x2 chat modal, and share card | ☑ | ☑ | ☑ |

## QA
- [x] Full test suite: `npm test` (33/33 passed)
- [x] Lint check: `npm run lint` (0 errors)
- [x] Build verification: `npm run build` (success)
- [x] Browser live preview active on port `4650`
