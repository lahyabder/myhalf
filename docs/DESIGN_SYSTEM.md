# MYHALF — Design System & UI Specifications

> **"Two people. One account. Equal ownership."**

---

## 1. Brand Philosophy & Design Principles

MYHALF's visual language reflects the beauty of partnership without descending into cliché. We represent friends, siblings, creative duos, and couples with equal dignity and aesthetic sophistication.

### Core Principles
1. **Equal Prominence:** The two owners must always be visually represented with equal weight, equal diameter, and symmetric balance. Neither owner is ever styled as a "secondary" or "badge" on the other.
2. **Mobile-First & Clean:** The UI is designed primarily for mobile screens with thumb-friendly zones, safe-area insets, fluid scaling, zero horizontal overflow, and rapid load times.
3. **Official Brand Identity:** Grounded in the official Deep Emerald Teal (`#076867`), conveying stability, maturity, equal partnership, and modern prestige.
4. **Simple, Ubiquitous Arabic Typography:** Standard, ubiquitous system typography (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Arabic", Tahoma`) ensuring instant rendering, crystal clarity, and effortless readability across all mobile operating systems.
5. **Architectural Minimalism:** Generous whitespace, calm surfaces, intentional hierarchy, tactile micro-interactions, and distraction-free layouts.
6. **First-Class Bidirectionality:** Arabic (RTL) and Latin (LTR) are treated as equal design citizens. Layouts, margins, arrows, and animations seamlessly flip according to the active locale.

---

## 2. Color Palette & Token Architecture

```css
:root {
  /* Brand Accents — Official Identity */
  --color-primary: #076867;          /* Official Deep Emerald Teal — stability, depth, prestige */
  --color-primary-hover: #055251;
  --color-primary-light: #E7F3F2;
  --color-primary-dark: #043E3E;
  
  --color-secondary: #D97757;        /* Terracotta Warm Coral — warmth, creativity, balance */
  --color-secondary-hover: #B85F42;
  --color-secondary-light: #FBF0EC;

  /* Surfaces & Backgrounds (Light Mode) */
  --bg-canvas: #F7F5F0;              /* Soft Alabaster / Warm Bone */
  --bg-surface: #FFFFFF;             /* Pure White surface */
  --bg-elevated: #F0EDE5;            /* Subtle card highlight */
  --border-subtle: #E6E2D8;          /* Warm hairline border */
  --border-strong: #CFC9BC;

  /* Text & Typography (Light Mode) */
  --text-primary: #141E20;           /* Deep Slate Charcoal */
  --text-secondary: #586568;         /* Muted Slate */
  --text-tertiary: #899699;
  --text-inverse: #FFFFFF;

  /* Semantic Status */
  --status-success: #25825F;         /* Emerald Sage */
  --status-warning: #D9822B;         /* Amber Ochre */
  --status-danger: #C94A4A;          /* Crimson Brick */
  --status-info: #1F738E;            /* Marine Slate */
}

/* Dark Mode Tokens */
[data-theme="dark"] {
  --bg-canvas: #0E1517;              /* Deep Slate Void */
  --bg-surface: #162124;             /* Elevated Midnight Teal */
  --bg-elevated: #1E2D30;
  --border-subtle: #243539;
  --border-strong: #364C52;

  --text-primary: #F0F4F4;
  --text-secondary: #9DAEB1;
  --text-tertiary: #687B7E;
  --text-inverse: #0E1517;

  --color-primary: #129E9B;          /* Luminous Teal for dark contrast */
  --color-secondary: #DE8866;
  --color-primary-light: #0B2524;
  --color-secondary-light: #2A1E19;
}
```

---

## 3. Typography Hierarchy

### Font Families
- **Arabic Script:** Ubiquitous Standard System Stack (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Arabic", Tahoma, "Helvetica Neue", Arial, sans-serif`). Extremely readable, clean, without stylized embellishments.
- **Latin Script (French & English):** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

---

## 4. Key Component Anatomy

### 4.1. DuoAvatar (The Signature Component)
The `DuoAvatar` component displays the two co-owners of a duo account with equal prominence.

### 4.2. SplitSlider (Two Perspectives Post)
Interactive before/after split slider allowing users to slide between Partner 1's photo and Partner 2's photo.

### 4.3. DailyPromptWidget (Blind Reveal)
Features the Duo Streak Flame and blind answer state until both co-owners participate.
