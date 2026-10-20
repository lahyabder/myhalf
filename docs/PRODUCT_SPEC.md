# MYHALF — Product Specification

> **"Two people. One account. Equal ownership."**

---

## 1. Vision & Core Philosophy

MYHALF is a multilingual social network designed exclusively for two-person shared social accounts. Unlike legacy platforms where social accounts represent single individuals or brands with subordinate managers, MYHALF treats the duo as the fundamental, atomic social unit.

### Key Pillars
1. **True Equal Co-Ownership:** Every public account belongs equally to two distinct human beings. Neither owner outranks or can unilaterally disenfranchise the other.
2. **Dual-Perspective Social Content:** Content can represent the unified voice of the duo or capture side-by-side perspectives on shared moments.
3. **Plural Duo Archetypes:** MYHALF is built for all duos: creative collaborators, co-founders, siblings, friends, life partners, and artistic duos. It deliberately avoids romantic-only or wedding-only tropes.
4. **Private Identity Separation:** Each owner maintains their own independent credentials, private settings, and individual safety controls. Individual profiles are never public.
5. **Safety First:** Unilateral emergency freeze and abuse reporting ensure that no partner can be trapped or abused behind a dual-approval barrier.

---

## 2. Duo Archetypes
- **Creative Collaborators:** Designers & writers, musicians, directors & cinematographers.
- **Founders & Partners:** Co-founders, business partners, podcast hosts.
- **Siblings & Family:** Twins, brothers/sisters sharing family memories or joint creative projects.
- **Lifelong Friends:** Travel duos, study companions, best friends.
- **Couples & Partners:** Relationship milestones, shared lifestyle, mutual journeys.

---

## 3. Scope & MVP Feature Matrix

### Feature 01: Independent Registration
- Two separate individuals sign up with separate emails/passwords or OAuth.
- Each person receives their own private `user_id` and private identity profile.
- Individual profiles are strictly private and never listed on public search.

### Feature 02: Partner Invitation & Activation
- User A initiates an invitation by generating a secure, time-limited cryptographic invite link or sending an in-app invite to User B.
- User B accepts the invitation.
- A cryptographic handshake binds User A and User B to a newly spawned `duo_account`.
- An account is only activated when exactly two distinct, verified individuals have completed onboarding.

### Feature 03: Shared Duo Public Profile
- Public handle: `@handle` (e.g. `@sara_and_omar`, `@pixel_craft`).
- Duo Display Name, shared bio, duo avatar (balanced visual presentation of both owners), duo header banner, and join date.
- Verification badge confirming two active verified human owners.
- Follower count, following count, and published post grid.

### Feature 04: Standard Posts (Text & Media)
- Either co-owner may publish a standard single-voice post on behalf of the duo.
- Media support: optimized images (WebP/AVIF), multi-image carousel (up to 4 images), text up to 1,000 characters.
- Attribute badge optionally reveals which co-owner composed the post, or renders as unified duo voice based on duo preferences.

### Feature 05: Chronological Social Feed
- Clean, chronological stream of posts from followed duos.
- No manipulative black-box algorithmic engagement traps.
- Filter toggle: All Posts vs. Two Perspectives only.

### Feature 06: "Two Perspectives" Collaborative Posts
- The signature MYHALF post format: A single post containing two complementary perspectives (texts and/or photos) on the exact same event or theme.
- **Workflow:**
  1. Owner A initiates the Two Perspectives draft with their side (Perspective 1).
  2. Owner B receives a co-creation notification and contributes their side (Perspective 2).
  3. Both owners review the combined preview and supply explicit sign-off.
  4. Post goes live simultaneously once dual sign-off is completed.

### Feature 07: Follow & Unfollow
- Follow actions occur strictly at the Duo level (Duo X follows Duo Y).
- Either co-owner can trigger follow/unfollow for their shared account, recorded in the duo audit log.

### Feature 08: Social Interactions (Likes & Comments)
- Likes and comments are attributed to the interacting Duo (or displaying the specific authoring partner tag if configured).
- Comment threads support threaded replies, moderation, and co-owner moderation actions.

### Feature 09: Duo Discovery & Search
- Global search for duos by `@handle`, duo display name, categories/tags, and shared interests.
- Featured Duo Spotlight highlighting diverse duo archetypes across languages.

### Feature 10: Equal Ownership Governance
- Mathematical and schema-level invariant: `COUNT(owners) == 2`.
- Neither owner can evict, substitute, or demote the other.
- Shared asset custody (posts, comments, media, followers).

### Feature 11: Dual Approval for Sensitive Changes
- Sensitive operations require explicit confirmation from both owners within 72 hours:
  - Changing duo handle (`@handle`).
  - Changing duo email/recovery destination.
  - Modifying privacy tier (Public <-> Private).
  - Deactivating or deleting the duo account.
- Handled via an immutable `governance_proposals` ledger with cryptographic versioning.

### Feature 12: Notifications
- Dual-channel notifications:
  - Partner notifications: Co-creation requests, approval requests, partner posts.
  - Social notifications: Likes, comments, new followers.
  - System/Security notifications: Login alerts, password resets, governance proposals.

### Feature 13: Safety, Reporting & Account Protection
- **Unilateral Abuse Reporting:** Either owner can report harassment, threats, or platform violations without the other owner's knowledge or consent.
- **Emergency Safety Freeze:** Either owner can unilaterally freeze the duo account in situations of domestic abuse, coercion, or account compromise.
- Block duo feature: Completely severs interaction between duos.

### Feature 14: Admin & Moderation Dashboard
- Dedicated moderation interface for flagged content, copyright claims, and abuse reports.
- Immutable audit logs for compliance and safety investigations.

### Feature 15: Trilingual Localization (AR / FR / EN)
- Complete native translation in Arabic, French, and English.
- First-class Right-to-Left (RTL) layout switching with Arabic typography (Cairo/IBM Plex Sans Arabic) and Latin typography (Inter).

---

## 4. Non-Functional Requirements
- **Performance:** Initial TTFB < 200ms; LCP < 1.8s; mobile payload < 150KB gzip.
- **Accessibility:** WCAG 2.1 AA compliance; full keyboard navigation, screen-reader aria labels in all 3 languages.
- **Security:** PostgreSQL Row Level Security (RLS) on all tables; zero secret leakage; CSRF/XSS defense.
- **PWA Readiness:** Manifest, service worker caching, mobile add-to-home screen support.
