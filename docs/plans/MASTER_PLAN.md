# MYHALF — Master Implementation Roadmap (Phases 01 - 10)

> **"Two people. One account. Equal ownership."**

This master plan lays out the sequential engineering milestones for the MYHALF social network MVP. Every phase adheres strictly to the **PLAN → RED → GREEN → REFACTOR → QA → REVIEW** test-driven development workflow.

---

## Phase Overview & Progress Summary

| Phase | Description | Key Deliverables | Status |
|---|---|---|---|
| **Phase 01** | Project Setup & Architecture | Repository init, Next.js 16, Tailwind v4, Vitest, Playwright, Design System, Specs | **In Progress** |
| **Phase 02** | Auth & Duo Invitations | Supabase Auth, private users, invitation tokens, handshake flow, compact acceptance | Planned |
| **Phase 03** | Duo Profiles & Equal Ownership | Shared `@handle`, dual avatars, bio, dual-membership verification, invariant triggers | Planned |
| **Phase 04** | Posts & Media | Standard single posts, image uploader, feed component, chronological queries | Planned |
| **Phase 05** | Two Perspectives | Collaborative co-drafting, invitation to co-author, split preview, dual sign-off | Planned |
| **Phase 06** | Social Interactions | Duo-level likes, comments, nested threads, duo follows & followers | Planned |
| **Phase 07** | Search & Discovery | Duo search by handle/name/tags, category explore, featured spotlights | Planned |
| **Phase 08** | Security, Governance & Moderation | Dual-approval ledger, cryptographic replay protection, unilateral emergency freeze, admin | Planned |
| **Phase 09** | Full QA & System Integration | End-to-end user journeys, AFRIKYIA-QA-Center audit, WCAG AA, RTL validation | Planned |
| **Phase 10** | Release Readiness & Controlled Beta | PWA manifest, Vercel deployment readiness, smoke testing, beta rollout | Planned |

---

## Detailed Phase Breakdown

### Phase 01: Project Setup and Architecture (Current)
- Initialize Next.js 16 (App Router), TypeScript Strict, Tailwind CSS v4.
- Setup Vitest, React Testing Library, and Playwright on isolated port `4650`.
- Design tokens, CSS variables, typography, and RTL/LTR bidirectional support.
- Core architectural documentation (`PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY_MODEL.md`, `DESIGN_SYSTEM.md`, `TEST_STRATEGY.md`, `UX_FLOWS.md`).
- Integration adapter for `AFRIKYIA-QA-Center`.

### Phase 02: Authentication and Duo Invitations
- Private authentication for User A and User B (`public.users`).
- Partner invitation link generation with cryptographic HMAC tokens.
- Acceptance landing screen (`/invite/[token]`) with Equal Ownership Compact agreement.
- Transactional activation: Duo account transitions from `PENDING_PARTNER` to `ACTIVE` only upon second owner acceptance.
- Unit and integration tests for invitation expiration, revocation, and token verification.

### Phase 03: Duo Profiles and Equal Ownership
- Duo profile schema (`public.duo_accounts` and `public.duo_members`).
- `DuoAvatar` component with symmetric dual portraits and verification indicators.
- Duo header, bio, archetype tags, and member pills.
- Database invariants: enforce `COUNT(members) == 2` and disallow unilateral eviction.
- Responsive profile route `/[locale]/[handle]`.

### Phase 04: Posts and Media
- Single-voice post creation (`public.posts`).
- Client-side WebP image processing and multi-image carousel (up to 4 images).
- Chronological feed component `/[locale]/feed`.
- Post cards with duo attribution, timestamps, and engagement counters.

### Phase 05: Two Perspectives Collaborative Posts
- Co-authoring state machine: Draft -> Contributed -> Dual Review -> Published.
- Split-screen / tabbed comparative composer.
- Dual cryptographic sign-off verification before publication.
- Two Perspectives feed card rendering side-by-side viewpoints.

### Phase 06: Social Interactions
- Duo-level following mechanism (`public.follows`).
- Likes system attributing engagements to the interacting duo.
- Threaded comments with duo badges and moderation controls.
- Activity feed and notification dispatch.

### Phase 07: Search and Discovery
- Debounced search across handles, duo names, bios, and categories.
- Explore page with categorized duo discovery (Creative, Friends, Siblings, Partners).
- Featured duos spotlight.

### Phase 08: Security, Dual-Approvals & Moderation
- `public.governance_proposals` ledger with HMAC-SHA256 proposal hashes and nonce.
- Proposal review UI with 72-hour countdown and visual diffs.
- Unilateral Emergency Freeze button and confidential abuse reporting (`public.emergency_actions`).
- Admin moderation dashboard with incident escalation and content quarantine.

### Phase 09: Full QA and System Integration
- Comprehensive Vitest test suite execution.
- Playwright E2E suites testing all 16 screen flows in isolated environment.
- Run `AFRIKYIA-QA-Center` project audit: static checks, accessibility WCAG 2.1 AA, TTFB benchmarks.
- Full RTL and multilingual verification (AR, FR, EN).

### Phase 10: Release Readiness and Controlled Beta
- PWA manifest, service worker offline shell, and mobile install prompts.
- Production build validation (`npm run build`).
- Deliver `FINAL_AUDIT.md` and `RELEASE_READINESS.md`.
