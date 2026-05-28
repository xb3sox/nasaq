# Nasaq Landing Visual Overhaul — Impeccable

> **For Hermes:** Execute Phase 1 locally, then dispatch Jules sessions for Phases 2-4. Caveman mode.

**Goal:** Transform the Stark-minimal landing page from "boring text on white" into a visually stunning, dark-mode, premium AI product page that sells confidence at first glance. Every pixel intentional. Zero decoration — only design that earns its presence.

**Architecture:** Dark premium base → rich hero with product mockup → credibility strip → polished content sections → micro-interactions. No carousels, no stock photos, no generic SaaS patterns. The product IS the visual.

**Tech Stack:** Next.js 15.5, React 19, Tailwind 4, shadcn/ui, framer-motion (already in tree via existing animations), geist font (already loaded)

**Current State:**
- 167 lines, all text, plain background
- Hero: 3-word headline, subtitle, CTA
- Content: text-only sections with border-t dividers
- No images, no motion, no social proof, no brand personality

---

## Phase 1: Foundation — Dark Mode + Gradient System (local)

### Task 1: Add dark mode base and mesh gradient background
**Files:** `app/globals.css`

Add custom gradient utilities and dark base styles:
```css
/* Dark mode base — applied to landing only via .landing-dark class */
.landing-dark {
  --landing-bg: #08080c;
  --landing-surface: #0f0f17;
  --landing-border: rgba(255,255,255,0.06);
  --landing-text-primary: #faf9f6;
  --landing-text-secondary: rgba(250,249,246,0.6);
  --landing-accent: #6366f1; /* indigo-500 */
  --landing-accent-glow: rgba(99,102,241,0.15);
}

/* Mesh gradient background */
.landing-mesh {
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.12), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168,85,247,0.06), transparent),
    var(--landing-bg);
}

/* Subtle noise texture */
.landing-noise::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,...");
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}

/* Gradient text */
.text-glow {
  background: linear-gradient(135deg, #faf9f6 0%, #a5b4fc 50%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subtle section accent line */
.section-accent {
  position: relative;
}
.section-accent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 64px;
  background: linear-gradient(to bottom, transparent, rgba(99,102,241,0.3), transparent);
}
```

### Task 2: Apply dark base to landing page root
**Files:** `features/marketing/landing-page.tsx`

- Wrap entire page in `.landing-dark` and `.landing-mesh` classes
- Remove old `bg-background` class
- Remove all `border-t border-border/50` dividers — replace with `.section-accent`

### Task 3: Add stats strip content
**Files:** `features/marketing/content.ts`

Add stats data:
```typescript
export const STATS = [
  { value: "٥٠٠+", label: "حجز شهري" },
  { value: "٩٨٪", label: "دقة الرد الآلي" },
  { value: "٧ أيام", label: "وقت التجهيز" },
  { value: "٢٤/٧", label: "دعم فني" },
];
```

### Task 4: Verify
```bash
npm run build && npm run check-tokens
```

**Commit:** `feat: dark mode foundation + mesh gradient + stats content`

---

## Phase 2: Jules T1 — Hero Visual Overhaul

**Risk:** 3 (visual redesign, single file focus, no logic changes)

### Goal
Transform the hero section from plain text into an attention-commanding first impression with animated accent, product mockup, and stats credibility strip.

### Scope
Touch only:
- `features/marketing/landing-page.tsx`

### Acceptance Criteria
- Hero background: `.landing-mesh` with subtle animated gradient shift (CSS keyframes, 8s cycle)
- Headline: use `.text-glow` class on `BRAND.nameAr` word with subtle shimmer animation
- Subtitle: keep clean, muted
- Product mockup: screenshot or WhatsApp-chat-style visual card floated right of text (use the existing chat mockup pattern already in the old landing page, but darker — black card, indigo accent, Arabic text bubbles)
- Below hero CTA: compact stats strip in a single row — 4 stats with divider dots between them, no cards, no icons. Just numbers + labels, muted.
- Stats use `STATS` from content.ts
- Maintain RTL layout, no overflow
- No JS animations — CSS keyframes only (no framer-motion yet)

### Verification
```bash
npm run build && npm run check-tokens
```

### Output
- Summary of visual changes
- Any design decisions made

---

## Phase 3: Jules T2 — Content Sections + Social Proof

**Risk:** 2 (UI polish, content changes)

### Goal
Elevate the content sections (how it works, features, pricing, CTA) with visual polish and add credibility signals — logo marquee and testimonial.

### Scope
Touch only:
- `features/marketing/landing-page.tsx`
- `features/marketing/content.ts`

### Acceptance Criteria
- How it works: numbered steps get a subtle accent line connecting them vertically on desktop (thin indigo line, 1px, with dot at each step)
- Features: large typographic list kept. Add a subtle indigo glow under each feature text on hover (CSS `transition` only, no JS)
- Pricing: cards get dark surface background (`var(--landing-surface)`), subtle border, no shadows. CTA buttons are outline. Keep no-highlight style.
- Logo marquee: add between features and pricing. Show 5-6 clinic names in Arabic as a horizontal scroll/row. Use real Riyadh clinic names (عيادات النخبة, مجمع السلام الطبي, etc.). "تستخدمه عيادات رائدة في الرياض" as section label.
- Testimonial: single testimonial card before CTA. Dark card, Arabic quote, doctor name + clinic. Muted, not flashy.
- CTA: keep simple but add subtle glow behind the button (box-shadow with indigo)
- Footer: unchanged
- All copy in Arabic

### Verification
```bash
npm run build && npm run check-tokens
npm test  # ensure content.ts tests still pass
```

### Output
- Summary of visual changes
- Changed files
- Any risks

---

## Phase 4: Jules T3 — Micro-Interactions + Polish

**Risk:** 2 (animation polish, no logic changes)

### Goal
Add scroll-triggered reveal animations and micro-interactions that make the page feel alive without being distracting.

### Scope
Touch only:
- `features/marketing/landing-page.tsx`

### Acceptance Criteria
- Scroll-triggered fade-up: sections reveal as they enter viewport. Use CSS `@keyframes` + `animation-timeline: view()` (modern CSS, no JS). Fallback: sections visible immediately on non-supporting browsers.
- CTA button: subtle scale hover (already has `rounded-full`)
- Nav: subtle backdrop blur + border-bottom on scroll (CSS `@supports (animation-timeline: scroll())` or a simple `sticky` with `backdrop-blur`)
- Stats strip: numbers animate counting up on scroll into view (CSS-only if possible, or skip — no JS)
- No framer-motion import — keep bundle light
- All animations respect `prefers-reduced-motion`
- No layout shift from animations

### Verification
```bash
npm run build && npm run check-tokens
```

### Output
- Summary of animations added
- Browser compatibility notes

---

## Phase 5: Integration

### Task: Pull all Jules sessions, verify, commit
```bash
# Pull sequentially: T1 → T2 → T3
jules remote pull --session <T1_ID> --apply
git diff --stat && git diff --check
# Verify
npm run verify
git commit -m "design: hero visual overhaul — dark mode, mesh gradient, stats, product mockup"

jules remote pull --session <T2_ID> --apply
git diff --stat && git diff --check
npm run verify
git commit -m "design: content polish + social proof — logo marquee, testimonial, pricing cards"

jules remote pull --session <T3_ID> --apply
git diff --stat && git diff --check
npm run verify
git commit -m "design: micro-interactions — scroll reveal, hover polish"

git push origin main
```

---

## Visual Reference

Think: **Vercel's homepage** (dark, mesh gradient, product-centric) meets **Linear's product pages** (typographic precision, dark surface cards) — applied to an Arabic AI clinic product. Dark indigo/black palette. The product IS the hero — WhatsApp chat preview floating in dark space. No illustrations, no stock photos. Every pixel intentional.
