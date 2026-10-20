# Decisions (append-only; newest at bottom)

## 2026-10-19 — Project Name & Obsolete Predecessor
- **Decision:** The product is officially named **MYHALF** (slug: `myhalf`). The predecessor working name `DUOVA` is obsolete and forbidden across all code, documentation, UI, and configuration.
- **Why:** Clear brand identity focused on equal partnership ("Two people. One account. Equal ownership").
- **Alternatives rejected:** `DUOVA` (working title, deprecated).
- **Decided by:** Owner directive.
- **Reversal cost:** High.

## 2026-10-19 — Equal Governance and Replay-Safe Dual Approvals
- **Decision:** All sensitive account modifications (handle change, identity edit, duo disbanding, account deletion) require dual independent approvals bound to immutable proposal hashes with cryptographic nonce and expiration.
- **Why:** Prevents unilateral hostile takeover or co-owner disenfranchisement while guaranteeing replay safety.
- **Alternatives rejected:** Simple boolean flag toggles (vulnerable to race conditions and out-of-order execution).
- **Decided by:** Lead Architect & Owner security requirements.
- **Reversal cost:** High.

## 2026-10-19 — Unilateral Emergency Safety and Abuse Reporting
- **Decision:** Individual safety interventions (blocking, abuse reporting, emergency freeze) can be executed unilaterally by either co-owner without notifying or requiring the approval of the other co-owner.
- **Why:** Vital protection against domestic abuse, harassment, coercion, or compromised co-owner credentials.
- **Alternatives rejected:** Requiring dual sign-off for account safety reports (unacceptable safety risk).
- **Decided by:** Lead Architect & Owner security requirements.
- **Reversal cost:** High.

## 2026-10-19 — UI Color Palette & Balanced Dual-Avatar System
- **Decision:** Adopt a warm, gender-neutral, non-romantic palette: Deep Teal (`#247B78`), Terracotta (`#D17B59`), Soft Alabaster (`#F7F5F0`), with Slate/Charcoal dark mode foundation. Duo avatars must present equal visual weight and prominence without hierarchy.
- **Why:** Avoids romantic-only stereotypes; supports friends, siblings, creative and professional duos equally.
- **Alternatives rejected:** Pink/red romantic hearts, primary single avatar with subordinate badge.
- **Decided by:** Senior UX/UI Designer.
- **Reversal cost:** Low-Medium.
