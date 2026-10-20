# MYHALF — UX Flows & Screen Specifications

This document outlines the detailed user experience, wireframe structure, interactive states, and invariant validations across all 16 MVP screens for MYHALF.

---

## Screen 01: Welcome & Landing
- **Route:** `/[locale]`
- **Goal:** Introduce the revolutionary concept of MYHALF ("Two people. One account. Equal ownership.") and guide users to onboard.
- **Components:**
  - Hero Header with bilingual tagline and brand mark.
  - Interactive Duo Showcase previewing archetypes (creators, siblings, friends, founders).
  - Primary CTA: `[Start Your Duo Account]`
  - Secondary CTA: `[Sign In to Existing Duo]` or `[Accept Partner Invite]`
  - Language switcher (العربية, Français, English).

---

## Screen 02: Login and Registration
- **Route:** `/[locale]/auth/register` and `/[locale]/auth/login`
- **Goal:** Secure, independent private authentication for each human owner.
- **Components:**
  - Email/password or Magic Link input.
  - Full Name & Private Display Name.
  - Password strength validator (minimum 8 characters, numbers, symbols).
  - Explanatory banner: *"Your personal account is completely private. You will invite your partner next to create your shared public duo."*
  - Validation: Form checks via Zod; rate limiting on auth attempts.

---

## Screen 03: Invite Your Second Owner
- **Route:** `/[locale]/onboarding/invite-partner`
- **Goal:** Enable Owner 1 to initiate the duo creation by inviting Owner 2.
- **Components:**
  - Invitee Email field or `[Copy One-Time Invite Link]`.
  - Personal invitation message.
  - Proposed Duo Name and preliminary handle reservation.
  - Expiry notice: *"Invitations expire after 7 days for security."*
  - Real-time status badge: `Waiting for partner...`

---

## Screen 04: Accept Partner Invitation
- **Route:** `/[locale]/invite/[token]`
- **Goal:** Allow Owner 2 to verify their identity and accept the co-ownership pact.
- **Components:**
  - Handshake card displaying Inviter's name and proposed Duo name.
  - The MYHALF Equal Ownership Compact:
    - *"Both owners hold 50% equal governance."*
    - *"Sensitive changes require both signatures."*
    - *"Neither owner can kick out the other."*
  - Actions: `[Accept & Join Duo]` or `[Decline Invitation]`.

---

## Screen 05: Create Shared Duo Identity
- **Route:** `/[locale]/onboarding/setup-duo`
- **Goal:** Configure public profile metadata once both owners have accepted.
- **Components:**
  - Duo Handle input (`@handle`) with real-time uniqueness validation.
  - Duo Display Name (e.g. "Maya & Tariq" or "The Design Tandem").
  - Duo Archetype selector (Creative, Siblings, Friends, Professional, Life Partners).
  - Dual Avatar uploader: Upload Owner 1 portrait + Owner 2 portrait.
  - Shared Bio input (up to 300 characters).
  - Preview card demonstrating how the duo appears on the feed.

---

## Screen 06: Home Feed
- **Route:** `/[locale]/feed`
- **Goal:** Chronological feed displaying updates from followed duos.
- **Components:**
  - Feed toggle: `[All Posts]` | `[Two Perspectives]`
  - Story / Highlight duo avatars tray at top.
  - Stream of Post Cards (Standard single posts and Two Perspectives split cards).
  - Quick action bar: Like (attributed to viewer's duo), Comment, Share.
  - Pull-to-refresh and infinite scroll pagination.

---

## Screen 07: Duo Public Profile
- **Route:** `/[locale]/[handle]`
- **Goal:** Public showcase of the co-owned duo account.
- **Components:**
  - Duo Cover banner and equal-weight dual avatars.
  - Duo display name, `@handle`, verification badge, and duo archetype tag.
  - Co-owner profile pills: e.g. "Managed equally by Sarah M. & Omar K."
  - Metrics bar: Posts count, Followers count, Following count.
  - Follow / Unfollow CTA (active only for authenticated duos).
  - Tabbed content grid: `[Posts]`, `[Two Perspectives]`, `[About Duo]`.

---

## Screen 08: Create Standard Post
- **Route:** `/[locale]/create/post`
- **Goal:** Either co-owner publishes a single-voice text or media post.
- **Components:**
  - Text area (up to 1,000 characters) with rich mentions and hashtag support.
  - Media uploader (up to 4 images, drag-and-drop, client-side WebP compression).
  - Attribution toggle: `[Post as Duo]` or `[Include my personal author pill]`.
  - Preview modal.
  - Action: `[Publish Post]`.

---

## Screen 09: Create Two Perspectives Post
- **Route:** `/[locale]/create/two-perspectives`
- **Goal:** Signature collaborative creation where both owners contribute side-by-side perspectives.
- **Components:**
  - Step 1: Initiator adds Perspective 1 (Title, Text, Media).
  - Step 2: System notifies Co-owner: *"Your partner invited you to contribute your perspective on: [Topic]"*.
  - Step 3: Co-owner opens co-draft and inputs Perspective 2.
  - Step 4: Split-screen comparative preview showing both sides.
  - Step 5: Dual sign-off buttons:
    - Owner 1 Sign-off: `[Signed by Partner A]`
    - Owner 2 Sign-off: `[Signed by Partner B]`
  - Step 6: Instant publication once both signatures are verified.

---

## Screen 10: Discover Duos
- **Route:** `/[locale]/explore`
- **Goal:** Algorithmic-free exploration of public duos by category and interests.
- **Components:**
  - Featured Duo of the Day banner.
  - Category filters (Art & Design, Music, Travel, Tech, Life).
  - Grid of recommended duo cards with quick bio preview and dual avatars.

---

## Screen 11: Search Results
- **Route:** `/[locale]/search?q=...`
- **Goal:** Fast, debounced search across handles, duo names, tags, and posts.
- **Components:**
  - Search input with clear button and recent search history.
  - Filter tabs: `[Duos]`, `[Posts]`, `[Tags]`.
  - Empty state with suggestions if no matches are found.

---

## Screen 12: Notifications
- **Route:** `/[locale]/notifications`
- **Goal:** Consolidated notifications categorized by urgency.
- **Components:**
  - Priority filter: `[All]`, `[Governance & Approvals]`, `[Partner Activity]`, `[Social]`.
  - Notification items with distinct iconography:
    - Dual approval pending (High priority amber badge).
    - Partner contributed to Two Perspectives draft.
    - Social like / comment from another duo.

---

## Screen 13: Dual Approval Governance Requests
- **Route:** `/[locale]/settings/governance`
- **Goal:** Review, sign, or reject sensitive proposed account modifications.
- **Components:**
  - Active Proposals list:
    - Target: e.g. "Change handle from `@old` to `@new`".
    - Initiated by: Co-owner name and avatar.
    - Expiration countdown timer (`72h remaining`).
    - Visual diff display.
    - Actions: `[Sign & Execute Approval]` or `[Decline Proposal]`.
  - Governance History & Immutable Audit Log.

---

## Screen 14: Account Settings
- **Route:** `/[locale]/settings`
- **Goal:** Manage both personal private settings and co-owned duo configuration.
- **Components:**
  - Section A: Private Settings (My Email, My Password, My Locale, Notifications).
  - Section B: Shared Duo Settings (Bio, Links, Categories, Privacy Tier).
  - Section C: Danger Zone (Requires dual approval: Disband Duo, Delete Account).

---

## Screen 15: Safety, Reporting & Emergency Freeze
- **Route:** `/[locale]/safety`
- **Goal:** Protect users in emergencies, domestic abuse situations, or harassment.
- **Components:**
  - Unilateral Emergency Freeze button: *"Instantly lock this duo account. Invisible to partner until executed."*
  - Confidential Abuse Report form (submitted straight to Safety Operations).
  - Blocked Duos manager.
  - Direct links to regional safety hotlines and domestic crisis resources.

---

## Screen 16: Admin Moderation Dashboard
- **Route:** `/[locale]/admin/moderation`
- **Goal:** Staff oversight of reports, flagged posts, and emergency interventions.
- **Components:**
  - Incident queue sorted by severity (Emergency Safety Freeze, Harassment, Spam).
  - Content preview modal with action buttons: `[Quarantine Post]`, `[Suspend Duo]`, `[Dismiss]`.
  - Audit trail viewer.
