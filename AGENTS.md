# AGENTS.md — MYHALF

Canonical instructions for every coding agent (Claude Code, Antigravity, Codex, others).
Tools that do not load this file automatically: read it first, then `PROJECT_STATUS.md` and the tail of `docs/DECISIONS.md`, before doing anything.

## Project
MYHALF is a multilingual social network designed exclusively for two-person shared social accounts ("Two people. One account. Equal ownership").
Stack: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4, Supabase (Auth, PostgreSQL RLS, Storage), Zod, Vitest, Playwright, Arabic/French/English with full RTL/LTR support.

## Commands
- Test (Unit): `npm test`
- Test (Watch): `npm run test:watch`
- Test (E2E): `npm run test:e2e` (Port 4650)
- Lint: `npm run lint`
- Type Check: `npx tsc --noEmit`
- Build: `npm run build`
- Dev Server: `npm run dev` (Port 4650)
- Central QA Gate: `cd /Users/lahyabderrahmane/Desktop/Web-Projects/AFRIKYIA-QA-Center && node bin/qa.mjs test "myhalf"`

## Roles
- Claude Code & Antigravity: primary developers; plan and implement using Writing Plans and TDD.
- Codex: independent reviewer/inspector, read-only (`--sandbox read-only`). Never edits files.
- The user gives final sign-off.

## Rules
- Work on a dedicated branch `claude/<task>`. Never commit or push to main/master/production without explicit approval.
- Present a plan and wait for approval before modifying project files.
- Explicit approval is required for: destructive operations, database migrations or resets, commits, pushes, deployments. Approval does not carry over to the next action.
- Run tests/lint/build yourself and report real output before claiming completion.
- Never read, print or send secrets: `.env*`, keys, tokens, credentials, auth files.
- Do not add dependencies or change structure beyond the task.
- Dual-ownership invariants must never be bypassed: equal ownership, dual approval for sensitive actions, atomic proposal execution, unilateral emergency safety reporting.

## Development cycle: PLAN → RED → GREEN → REFACTOR → QA → REVIEW
- S tasks: 3–5 line plan in chat. M/L tasks: plan file in `docs/plans/YYYY-MM-DD-<slug>.md` (template `~/.agent-templates/PLAN.md`), indexed in `docs/plans/README.md`, kept up to date with status, tests and review verdicts. Full rules: `~/Desktop/Web-Projects/AGENTS.md`.

## Test-driven development (mandatory)
- New functions/features and testable bug fixes follow RED → GREEN → REFACTOR: test first and shown failing, minimal code to pass, refactor while green, then full suite + type check + lint (+ build when relevant). Report real output.
- Unit/component: Vitest + React Testing Library, `x.test.ts(x)` next to the source.
  E2E: Playwright in `e2e/`, dev server on dedicated port `4650` (isolated env, never 3000, 5000, 5173, 7000).
- Exceptions (copy, pure styling, config, docs) are stated explicitly.
- Full protocol: `~/Desktop/Web-Projects/AGENTS.md`.

## Codex review protocol
- Use for non-trivial plans and the final diff only; skip for trivial changes.
- Max 2 review rounds per task in total: 1 plan review + 1 final code review. More needs the user's explicit authorization. No automatic retries; on error stop and report.
- Review packet = plan or diff + PROJECT_STATUS.md + relevant DECISIONS.md entries.

## Protected paths
- `supabase/migrations/` (destructive changes prohibited without approval)
- `.env*` (never read, never commit)

## Handoff
Update `PROJECT_STATUS.md` and `docs/STATUS.md` at the end of every session; append to `docs/DECISIONS.md` for each decision. Keep both short and free of secrets.
