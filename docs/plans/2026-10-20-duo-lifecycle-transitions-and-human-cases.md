# Implementation Plan: Duo Lifecycle Transitions & Compassionate Human Cases

> **Task Type:** Logic, Edge-case Safety Architecture, TDD & UI Controls  
> **Size:** Medium (M)  
> **Status:** Done  
> **Created:** 2026-10-20 by Antigravity  

---

## 1. Context & Human Realities
Human partnerships are dynamic. In real life:
- Married couples may divorce or separate.
- Lovers or life partners may part ways before marriage.
- One partner may pass away (bereavement).
- Creative or startup co-founders may conclude their project successfully or sell it.
- A partner may go missing, be imprisoned, kidnapped, or become medically incapacitated (coma, stroke).
- A toxic or abusive partner may attempt extortion, revenge deletions, or account hijacking.

A naive app breaks down or locks users out when these events happen.  
**MYHALF must handle every one of these transitions with legal rigor, cryptographic safety, and deep emotional compassion.**

---

## 2. Transition Protocols & Invariant Matrix

| Scenario | State Transition | Trigger Mechanism | Governance Rule | Content Safeguard |
| :--- | :--- | :--- | :--- | :--- |
| **Amicable Separation / Divorce** | `ACTIVE` → `ARCHIVED_SUNSET` | Dual Approval | Both sign off; or separate with mutual data export | Read-only vault; both receive full export; @handle retired or transferred |
| **Hostile Split / Coercion / Revenge** | `ACTIVE` → `EMERGENCY_FROZEN` | Unilateral Instant | Single owner unilateral safety exit | Instant isolation; zero deletions permitted for 90 days; anti-tamper lock |
| **Bereavement / Death of Partner** | `ACTIVE` → `MEMORIALIZED` | Verified Proof or Steward claim | Surviving partner becomes Memorial Steward | Deceased posts locked cryptographically; memorial badge 🕊️; no impersonation |
| **Project / Startup Completion** | `ACTIVE` → `PROJECT_COMPLETED` | Dual Approval | Both co-owners sign completion | Portfolio archive badge 🏆; credits preserved; forward links to new ventures |
| **Long-Term Inactivity / Disappearance** | `ACTIVE` → `SUSPENDED_CUSTODY` | Inactivity Timer (180d) + Human Review | Dead-man switch with verified fallback | Protects trapped account without compromising missing partner |

---

## 3. Implementation Tasks

### 3.1. Plan & Documentation
- [x] Create Implementation Plan: `docs/plans/2026-10-20-duo-lifecycle-transitions-and-human-cases.md`
- [x] Update `docs/plans/README.md` index
- [x] Write detailed specification: `docs/DUO_LIFECYCLE_SPEC.md`
- [x] Document architectural decisions in `docs/DECISIONS.md`

### 3.2. TDD Unit Tests (RED)
- [x] Write `tests/lifecycle-transitions.test.mjs`:
  1. Transition to `MEMORIALIZED` with cryptographic deceased lock.
  2. Prevent surviving partner from editing/tampering with deceased partner's history.
  3. Transition to `ARCHIVED_SUNSET` with mutual dual approval.
  4. Block unilateral deletion of joint assets during dispute.
  5. Generate dual-vault data export package for both parties.
  6. Transition to `PROJECT_COMPLETED` for creative ventures with dual signatures.
  7. Enforce duress shield / anti-coercion lockout when emergency frozen.

### 3.3. Core Implementation (GREEN)
- [x] Implement `src/lib/lifecycle.mjs`:
  - `transitionToMemorialized(account, deceasedUserId, survivingUserId)`
  - `transitionToAmicableSunset(account, dualApprovalPayload)`
  - `transitionToProjectCompleted(account, completionNotes, dualApprovalPayload)`
  - `generateEqualVaultExport(account, requestingUserId)`
  - `assertAntiRevengeProtection(account, action, actorUserId)`
  - `activateDuressShield(account, actorUserId)`

### 3.4. Refactor & Verification (REFACTOR + QA)
- [x] Run full test suite (`npm test`) -> 47/47 passed in 76ms.
- [x] Run linter (`npm run lint`) -> 0 errors.

### 3.5. UI Controls & Compassionate Modal
- [x] Add interactive "Duo Lifecycle & Compassionate Transitions" controls in `public/index.html` under Settings/Safety screen.
- [x] Deploy to Vercel and push to GitHub.

---

## 4. Verification Record
- Tests: 47/47 unit tests passed across 8 test suites.
- Linter: Zero errors via `scripts/lint.mjs`.
- Work executed via Antigravity.
