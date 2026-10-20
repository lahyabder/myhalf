# MYHALF — Frontend Status & Design System Review

**Status:** Phase 01 Complete & Live Interactive Preview Active  
**Local URL:** `http://localhost:4650`  
**Brand:** MYHALF (`myhalf`)  
**Design Direction:** Warm Architectural Minimalism, Gender-Neutral, Balanced Dual Prominence  

---

## 1. Visual Token Matrix

| Token Name | Light Mode Value | Dark Mode Value | Usage |
|---|---|---|---|
| `--color-primary` | `#247B78` (Deep Teal) | `#2F9B97` | Primary brand accent, verified badges, action buttons |
| `--color-secondary` | `#D17B59` (Terracotta) | `#DE8866` | Partner 2 accent, invitations, creative tags |
| `--bg-canvas` | `#F7F5F0` (Soft Alabaster) | `#12181A` (Charcoal Slate) | Page background |
| `--bg-surface` | `#FFFFFF` | `#1A2225` | Cards, modals, navigation bars |
| `--border-subtle` | `#E6E2D8` | `#2A363A` | Hairline dividers, card outlines |
| `--text-primary` | `#182225` | `#F2F5F5` | Headings, post text, primary labels |
| `--text-secondary` | `#5F6C6F` | `#A2ADB0` | Subtitles, timestamps, meta info |

---

## 2. Interactive Screens Implementation Matrix

| # | Screen Name | Route / View ID | Features & Interactivity |
|---|---|---|---|
| **01** | Welcome | `screen-welcome` | Hero slogan, duo archetype explanation, dual avatar preview, onboarding CTAs. |
| **02** | Login & Registration | `screen-auth` | Independent private authentication form for Person 1. |
| **03** | Invite Second Owner | `screen-invite` | Partner email input, proposed handle reservation, cryptographic invite link generator. |
| **04** | Accept Compact | `screen-accept` | Handshake card with immutable 4-point Equal Ownership Compact. |
| **05** | Setup Duo Identity | `screen-identity` | Shared `@handle`, duo display name, duo archetype selector, shared bio. |
| **06** | Home Feed | `screen-feed` | Chronological stream, duo avatars stories tray, interactive likes & comments. |
| **07** | Duo Profile | `screen-profile` | Duo banner, equal-prominence dual avatars, stats bar, posts grid. |
| **08** | Create Standard Post | `screen-create-post` | Text composer with attribution toggle and photo drag-and-drop preview. |
| **09** | Two Perspectives Post | `screen-create-tp` | Split-screen co-authoring composer with dual sign-off action buttons. |
| **10** | Discover Duos | `screen-explore` | Curated spotlights across creative, sibling, friend, and founder duos. |
| **11** | Search Results | `screen-search` | Instant debounced live filter search. |
| **12** | Notifications | `screen-notifications` | Priority filter: Dual approvals, Partner activity, and Social interactions. |
| **13** | Dual Approvals | `screen-approvals` | Pending proposal card, visual diff, SHA-256 hash check, [Sign & Execute] button. |
| **14** | Account Settings | `screen-settings` | Partitioned private credentials vs shared duo governance. |
| **15** | Safety & Freeze | `screen-safety` | Unilateral Emergency Freeze button and confidential abuse reporting form. |
| **16** | Admin Dashboard | `screen-admin` | Platform oversight, emergency freeze incident queue, governance integrity check. |

---

## 3. Multilingual & Bidirectional Support
- **Arabic (RTL):** Typography powered by Google Font `Cairo`. Full mirror of flex alignments, margin logic (`margin-inline-start`), and icon directions.
- **Français (LTR):** Typography powered by `Inter`.
- **English (LTR):** Typography powered by `Inter`.
- Dynamic switcher in header updates `document.documentElement.lang` and `dir="rtl"|"ltr"` instantly without page refresh.
