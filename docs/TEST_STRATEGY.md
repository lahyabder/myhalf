# MYHALF — Test Strategy, TDD Protocol & Central QA Integration

## 1. Quality Engineering Principles & Invariants

At MYHALF, software quality and data security are existential. We enforce strict Test-Driven Development (TDD) across all modules:
$$\text{PLAN} \longrightarrow \text{RED} \longrightarrow \text{GREEN} \longrightarrow \text{REFACTOR} \longrightarrow \text{QA} \longrightarrow \text{REVIEW}$$

### Invariant Testing Rules
1. **Never claim a test passed without genuine execution output.**
2. **Every bug fix and new feature must start with a failing test (RED) proving the gap.**
3. **No test may ever write to production databases or send real external communications.**
4. **All test servers run on dedicated ports `4600+` (specifically port `4650` for MYHALF). Never occupy or terminate processes on ports `3000`, `5000`, `5173`, or `7000`.**
5. **No secret leakage:** Never read `.env*` for tests. Use `.env.example` with isolated dummy credentials.

---

## 2. Test Architecture & Tooling Stack

| Testing Layer | Framework / Library | Target Scope | Execution Command |
|---|---|---|---|
| **Unit Tests** | Vitest | Zod schemas, governance hash algorithms, utilities, i18n helpers. | `npm test` |
| **Component Tests** | Vitest + React Testing Library | UI components, duo avatars, cards, accessible forms, RTL layout logic. | `npm test` |
| **Invariants & RLS** | Vitest + Mock / Local Supabase | Equal ownership constraints, 2-member limit, proposal replay prevention. | `npm test` |
| **E2E Tests** | Playwright (Port 4650) | Full user journeys, invite acceptance, two perspectives co-authoring. | `npm run test:e2e` |
| **Static Analysis** | TypeScript (`tsc`) & ESLint | Strict type safety, lint rules, zero any types. | `npx tsc --noEmit && npm run lint` |
| **Central QA Gate** | AFRIKYIA-QA-Center | Local audit runner, security scan, accessibility, TTFB benchmark. | `node bin/qa.mjs test "myhalf"` |

---

## 3. Dedicated Test Suites & Coverage Matrix

### 3.1. Governance & Invariant Test Suite (`tests/unit/governance.test.ts`)
- **Test G-01:** Proposal hash generation produces deterministic HMAC-SHA256 from payload and nonce.
- **Test G-02:** Proposal rejects self-approval (proposer cannot be approver).
- **Test G-03:** Proposal cannot be approved after `expires_at` timestamp.
- **Test G-04:** Attempting to alter proposal payload invalidates cryptographic hash.
- **Test G-05:** Active duo account requires exactly 2 verified members; rejects 1 or 3 members.
- **Test G-06:** Neither owner can unilaterally delete or remove the other owner.

### 3.2. Two Perspectives Co-Authoring Suite (`tests/unit/two-perspectives.test.ts`)
- **Test TP-01:** Post creation in `TWO_PERSPECTIVES` mode requires both Perspective 1 and Perspective 2.
- **Test TP-02:** Post status remains `PENDING_CO_OWNER` until both `signed_off_by_1` and `signed_off_by_2` exist.
- **Test TP-03:** Once published, post payload is locked against unilateral edits.

### 3.3. Unilateral Safety Suite (`tests/unit/safety.test.ts`)
- **Test S-01:** Emergency freeze can be triggered by either owner unilaterally.
- **Test S-02:** Emergency freeze immediately transitions duo status to `FROZEN`.
- **Test S-03:** Confidential abuse report record is invisible to the other co-owner via RLS logic.

### 3.4. Component & Accessibility Suite (`tests/components/*.test.tsx`)
- **Test UI-01:** `DuoAvatar` renders both owner avatars with identical diameter and equal CSS prominence.
- **Test UI-02:** Bidirectional components correctly mirror flex directions when locale is `ar` (RTL).
- **Test UI-03:** Form inputs have associated aria labels and accessible error announcements.

### 3.5. E2E Isolated Environment (`e2e/isolated-env.ts`)
- Configured with `isolatedEnv()` reading from `.env.example`.
- Intercepts and aborts any outbound HTTP request attempting to contact `*.supabase.co` during test execution to guarantee zero data leakage.

---

## 4. Central QA Integration (AFRIKYIA-QA-Center)

MYHALF is automatically discovered by `AFRIKYIA-QA-Center` through its `package.json` in `/Users/lahyabderrahmane/Desktop/Web-Projects/myhalf`.
- Dedicated dev port: `4650`
- To run project audit:
```bash
cd /Users/lahyabderrahmane/Desktop/Web-Projects/AFRIKYIA-QA-Center
node bin/qa.mjs test "myhalf"
```
- The QA Center tests:
  - Package integrity and lockfile consistency.
  - TypeScript compilation (`tsc --noEmit`).
  - Route reachability and health probes on port 4650.
  - Security check (no leaked private keys or hardcoded API secrets).
  - WCAG 2.1 AA accessibility score.
  - Performance TTFB latency benchmark.
