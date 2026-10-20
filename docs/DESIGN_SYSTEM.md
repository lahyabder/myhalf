# MYHALF — Design System & UI Specifications

> **"Two people. One account. Equal ownership."**

---

## 1. Brand Philosophy & Design Principles

MYHALF's visual language reflects the beauty of partnership without descending into cliché. We represent friends, siblings, creative duos, and couples with equal dignity and aesthetic sophistication.

### Core Principles
1. **Equal Prominence:** The two owners must always be visually represented with equal weight, equal diameter, and symmetric balance. Neither owner is ever styled as a "secondary" or "badge" on the other.
2. **Mobile-First & Clean:** The UI is designed primarily for mobile screens with thumb-friendly zones, clean margins, and rapid load times.
3. **Warm, Architectural Minimalism:** A warm editorial feel inspired by modern magazines, clean typography, and tactile surfaces rather than plastic gradients.
4. **First-Class Bidirectionality:** Arabic (RTL) and Latin (LTR) are treated as equal design citizens. Layouts, margins, arrows, and animations seamlessly flip according to the active locale.
5. **No Clutter, High Contrast:** High accessibility (WCAG 2.1 AA) with readable contrast ratios on both light and dark themes.

---

## 2. Color Palette & Token Architecture

```css
:root {
  /* Brand Accents */
  --color-primary: #247B78;          /* Deep Teal — balance, depth, trustworthiness */
  --color-primary-hover: #1D6360;
  --color-primary-light: #E9F4F3;
  
  --color-secondary: #D17B59;        /* Terracotta — warmth, earthiness, creativity */
  --color-secondary-hover: #B86544;
  --color-secondary-light: #FAECE6;

  /* Surfaces & Backgrounds (Light Mode) */
  --bg-canvas: #F7F5F0;              /* Soft Alabaster */
  --bg-surface: #FFFFFF;             /* Pure White surface */
  --bg-elevated: #F0EDE5;            /* Subtle card highlight */
  --border-subtle: #E6E2D8;          /* Warm hairline border */
  --border-strong: #CFC9BC;

  /* Text & Typography (Light Mode) */
  --text-primary: #182225;           /* Slate Charcoal */
  --text-secondary: #5F6C6F;         /* Muted Slate */
  --text-tertiary: #8E999B;
  --text-inverse: #FFFFFF;

  /* Semantic Status */
  --status-success: #2A8C68;         /* Mint Sage */
  --status-warning: #D9822B;         /* Amber Ochre */
  --status-danger: #C94A4A;          /* Crimson Brick */
  --status-info: #2B7EA1;            /* Marine Slate */
}

/* Dark Mode Tokens */
[data-theme="dark"] {
  --bg-canvas: #12181A;              /* Charcoal Slate */
  --bg-surface: #1A2225;             /* Elevated Surface */
  --bg-elevated: #242E32;
  --border-subtle: #2A363A;
  --border-strong: #3D4C51;

  --text-primary: #F2F5F5;
  --text-secondary: #A2ADB0;
  --text-tertiary: #6E7B7E;
  --text-inverse: #12181A;

  --color-primary: #2F9B97;
  --color-secondary: #DE8866;
  --color-primary-light: #182B2A;
  --color-secondary-light: #2D221D;
}
```

---

## 3. Typography Hierarchy

### Font Families
- **Arabic Script:** `IBM Plex Sans Arabic`, `Cairo`, system Arabic fallback.
- **Latin Script (French & English):** `Inter`, `Plus Jakarta Sans`, system sans-serif.

### Type Scale
| Token | Size (rem / px) | Line Height | Weight | Usage |
|---|---|---|---|---|
| `text-display` | 2.25rem (36px) | 1.2 | Bold (700) | Hero slogans, Duo name on profiles |
| `text-h1` | 1.75rem (28px) | 1.25 | SemiBold (600) | Screen titles, Section headers |
| `text-h2` | 1.375rem (22px) | 1.3 | SemiBold (600) | Modal headers, Post section titles |
| `text-h3` | 1.125rem (18px) | 1.4 | Medium (500) | Card headings, Duo handles |
| `text-body` | 0.9375rem (15px) | 1.5 | Regular (400) | Post content, Bio, Form descriptions |
| `text-callout` | 0.875rem (14px) | 1.4 | Medium (500) | Button labels, Navigation labels |
| `text-caption` | 0.75rem (12px) | 1.4 | Regular (400) | Timestamps, Invariant alerts, Footnotes |

---

## 4. Key Component Anatomy

### 4.1. DuoAvatar (The Signature Component)
The `DuoAvatar` component displays the two co-owners of a duo account with equal prominence.
```text
┌─────────────────────────┐
│     DUO AVATAR BOX      │
│  ╭──────╮     ╭──────╮  │
│  │Owner1│  &  │Owner2│  │
│  ╰──────╯     ╰──────╯  │
│  Partner A    Partner B │
└─────────────────────────┘
```
- **Modes:**
  - `overlap`: Two overlapping circular avatars with a subtle canvas-colored separation ring. Both avatars have identical width/height.
  - `side-by-side`: Twin avatars connected by an elegant ampersand (`&`) or duo connector icon.
  - `split-circle`: A single circle divided in half by a crisp diagonal or vertical hairline separator showing both portrait photos.
- **Status Indicator:** Dual verification dot indicating both owners have completed email and identity confirmation.

### 4.2. Two Perspectives Post Card
A unified post container presenting two viewpoints on one shared event:
```text
┌──────────────────────────────────────────────┐
│  @sarah_and_omar • Two Perspectives • 2h ago │
│  "Our First Marathon in Nouakchott"          │
├──────────────────────┬───────────────────────┤
│ PERSPECTIVE 1: SARAH │ PERSPECTIVE 2: OMAR   │
│ [Image: The start]   │ [Image: The finish]   │
│ "Toughest 42km of my │ "Sarah pushed me at   │
│ life, but Omar's     │ km 35 when my legs    │
│ pacing saved us!"    │ completely gave up!"  │
├──────────────────────┴───────────────────────┤
│  ❤️ 142 Likes   💬 18 Comments   🔄 Share    │
└──────────────────────────────────────────────┘
```
- On mobile: Horizontal tabbed view or vertical stacked comparison with dual author pills.
- On desktop: Harmonious side-by-side split view.

### 4.3. Dual Approval Governance Card
Displays pending proposals requiring second co-owner sign-off:
- Proposal title and timestamp.
- Initiating co-owner profile pill.
- Countdown timer (e.g. `Expires in 46h 12m`).
- Clear visual diff (e.g. `Old Handle: @travel_duo` -> `New Handle: @desert_nomads`).
- Action buttons: `[Approve & Execute]` and `[Reject Proposal]`.

---

## 5. Accessibility & Invariant Rules
- **No Hidden Actions:** Contrast ratio exceeds 4.5:1 for normal text and 3:1 for large display text.
- **RTL Logical Properties:** Use `ms-*` (margin-start), `me-*` (margin-end), `ps-*`, `pe-*`, `border-s`, `border-e`, ensuring zero manual layout inversion bugs.
- **Focus Rings:** High-visibility 2px focus ring (`--color-primary`) on all interactive buttons, inputs, and links for keyboard users.
