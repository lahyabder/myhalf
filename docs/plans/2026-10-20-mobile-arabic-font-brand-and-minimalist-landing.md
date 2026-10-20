# Implementation Plan: Mobile Compatibility, Ubiquitous Arabic Font, Official Brand Identity & Minimalist Landing Page

**Date:** 2026-10-20  
**Author:** Antigravity  
**Task Size:** M  
**Status:** done  
**Scope:** `public/index.html`, `public/icon.svg`, `docs/DESIGN_SYSTEM.md`, brand assets

---

## 1. Problem Statement & User Requirements
1. **Mobile Incompatibility (`التطبيق غير متوافق مع الهواتف`):**
   - The current CSS completely lacked `@media` queries.
   - Header controls overflowed on narrow screens (320px–480px).
   - Missing iOS safe area support (`env(safe-area-inset-bottom)`).
   - Fixed heights, rigid grids, and sticky bar collision at top.
   - Touch targets and split-slider handle needed mobile-first thumb calibration.
2. **Arabic Typography (`الخط المستخدم بالعربية ينبغي ان يكون بسيطا جدا وشائعا جدا`):**
   - Previous font was `Cairo`, which is stylized, heavy, and non-standard for users seeking a clean, standard look.
   - Requirement: Ultra-simple, universally common/standard Arabic font stack (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Arabic", Tahoma, "Helvetica Neue", Arial, sans-serif`).
   - Clean, lightweight, instant rendering with zero external font delay.
3. **Official Brand Logo & Color Palette (`الشعار المرفق هو الشعار الرسمي اعتمد لونه كهوية بصرية للتطبيق`):**
   - Adopt the uploaded logo's exact Deep Emerald Teal color (`#076867` / `#056968`) as the central brand token (`--color-primary`).
   - Replace old `#247B78` with `#076867` and adapt `--color-primary-hover` (`#055251`) and `--color-primary-light` (`#E7F3F2`).
   - Feature the official `myhalf` wordmark styling in the header, landing hero, and app icon.
4. **Professional & Minimalist Landing Page (`صمم صفحة هبوط احترافية حقيقة ومينيماليست للتطبيق`):**
   - Minimalist, distraction-free aesthetic with generous whitespace, elegant hierarchy, and subtle micro-interactions.
   - Compelling value proposition: "شخصان. حساب واحد. ملكية متساوية."
   - Dual Call to Action: "ابدأ حسابك الثنائي مجاناً" and "جرّب واجهة التطبيق الحية".
   - Live tactile interactive preview: embedded split-slider demo & Daily Half prompt right on the landing page.
   - 4 minimalist innovation pillars (المناصفة المطلقة 50/50، منشور الزاويتين، سؤال اليوم بحجاب الخصوصية، الحلول الإنسانية وميثاق الملكية).
   - Who it is for: Couples & Spouses, Best Friends & Soul Duos, Creative & Startup Co-Founders.
   - Minimalist footer with legal agreements and switcher.

---

## 2. Test & Verification Strategy (TDD)
- Logic Invariants: All 47 existing unit & integration tests remain 100% passing (`npm test`).
- Lint check: Zero lint violations (`npm run lint`), zero obsolete terms.
- Frontend DOM & CSS Verification:
  - Verified `--color-primary: #076867`.
  - Verified font stack contains standard system fonts and removes Cairo.
  - Verified comprehensive mobile media queries (`@media (max-width: 640px)` and `@media (max-width: 400px)`).
  - Verified responsive viewport meta `viewport-fit=cover`.
  - Verified seamless app-mode switching (`toggleAppMode()`, `landing-mode`).

---

## 3. Tasks Breakdown

- [x] Task 1: Sample exact brand color from uploaded logo (`#076867`) and extract transparent wordmark asset.
- [x] Task 2: Update Design System tokens in `public/index.html` & `docs/DESIGN_SYSTEM.md`:
  - `--color-primary: #076867;`
  - Standard Arabic font stack.
  - Update `public/icon.svg` with official Teal `#076867`.
- [x] Task 3: Implement Mobile-First Responsive CSS:
  - Header responsiveness: collapse icon labels on mobile, compact layout.
  - Safe area padding for iOS (`env(safe-area-inset-bottom)`).
  - Fluid cards, responsive sliders, touch-friendly handles.
  - Zero horizontal overflow (`overflow-x: hidden`).
- [x] Task 4: Design the Professional Minimalist Landing Page:
  - Seamless navigation between landing page (`screen-welcome`) and live interactive app (`screen-feed`).
  - Sleek Hero with official wordmark, high-impact typography, and live interactive split-slider preview card.
  - 4 clean pillars with minimalist icons.
  - Target duos segment (أزواج، أصدقاء، شركاء).
  - High-converting conversion footer and legal links.
- [x] Task 5: Verify on mobile and desktop viewports, run test suite (47/47) and lint.
- [x] Task 6: Document and prepare production release.
