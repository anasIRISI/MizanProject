# Design System Document

## 1. Overview & Creative North Star
This design system is built to convey the authority of a century-old law firm with the frictionless intelligence of modern AI. Our Creative North Star is **"The Editorial Authority."** 

Unlike standard SaaS platforms that feel like "software," this system should feel like a high-end legal publication. We move beyond the generic by utilizing massive amounts of white space, intentional asymmetry, and a rigorous adherence to tonal depth. By rejecting the "standard grid" in favor of an editorial layout—where images bleed off-canvas and typography takes center stage—we create an experience that feels curated, premium, and inherently trustworthy.

---

## 2. Colors: Tonal Architecture
The palette is rooted in high-contrast "Legal Black" and "Vibrant Ember," supported by a sophisticated range of warm neutrals.

### Primary Palette
- **Primary (#aa3000):** Our vibrant action color. Used sparingly for high-intent CTAs to ensure they command attention.
- **Surface (#fcf9f5):** The "Paper" of our system. A slightly warm white that reduces eye strain and feels more premium than pure #FFFFFF.
- **On-Surface (#1c1c1a):** Our deep, ink-black for maximum legibility and authority.

### The "No-Line" Rule
Sectioning must never be achieved through 1px solid borders. High-end design relies on background shifts. To separate the Hero from the Features section, transition from `surface` to `surface-container-low`. The change should be felt, not seen as a "line."

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine stationery.
- **Base Layer:** `surface`
- **Secondary Sections:** `surface-container-low` (#f6f3ef)
- **High-Priority Insets:** `surface-container-high` (#ebe8e4)

### The "Glass & Gradient" Rule
Floating AI assistant panels or sticky headers should utilize Glassmorphism. Use `surface` at 80% opacity with a 20px `backdrop-blur`. For primary actions, a subtle linear gradient from `primary` (#aa3000) to `primary_container` (#d2420d) adds a "soulful" dimension that flat colors lack.

---

## 3. Typography: The Editorial Voice
Our typography creates a dialogue between tradition (the Law) and modernity (the AI).

- **Display & Headlines (Noto Serif / Quincy CF):** These carry the brand's weight. Large, serifed headers suggest a legacy of excellence. Always use `headline-lg` or `display-sm` for section titles to create an authoritative presence.
- **Body & Labels (Work Sans):** Our "workhorse." High legibility with a modern, clean feel. Used for all functional text and data.
- **Asymmetric Scale:** Do not feel pressured to center-align. Use left-aligned "Editorial columns" where headlines sit in the top-left, and body text is offset to the right, creating a sophisticated visual rhythm.

---

## 4. Elevation & Depth: Tonal Layering
We reject the heavy "Material Design" shadows of 2014. Elevation in this system is achieved through light and tone.

### The Layering Principle
Depth is created by stacking tiers. A "Card" is simply a `surface-container-lowest` (#ffffff) shape sitting on a `surface-container-low` (#f6f3ef) background. This "soft lift" is more sophisticated than a shadow.

### Ambient Shadows
If a floating element (like a modal or AI chat bubble) requires a shadow, it must be an **Ambient Shadow**:
- **Blur:** 40px - 60px
- **Opacity:** 4% - 6%
- **Color:** A tinted version of our `on-surface` (e.g., #1c1c1a with 0.05 alpha). 

### The "Ghost Border" Fallback
If a container lacks enough contrast from its background, use a **Ghost Border**. Apply `outline-variant` at 15% opacity. Never use a 100% opaque border; it breaks the "Editorial" feel.

---

## 5. Components

### Buttons
- **Primary:** Rounded (`md: 0.375rem`), `primary` background, `on-primary` text. Use substantial horizontal padding (24px+) to create a luxury footprint.
- **Secondary:** Outlined with `primary` at 20% opacity. This feels lighter and more integrated into the page.
- **Tertiary:** Text-only with an underline that appears on hover, utilizing the `primary` color.

### Cards & Layouts
- **The Forbid Rule:** No horizontal dividers. Use the Spacing Scale (64px, 80px, or 120px) to separate items.
- **Asymmetric Cards:** Reference {{DATA:IMAGE:IMAGE_1}}. Images should have a `xl: 0.75rem` corner radius and sit adjacent to clean, left-aligned typography.

### Input Fields
- **State:** Use `surface-container-lowest` for the field background.
- **Focus:** On focus, the `outline` should shift to `primary` at 40% opacity—never a thick, solid line.
- **AI Chat Input:** A pill-shaped (`full`) container with a subtle `backdrop-blur` and a `primary` action icon.

### Signature Component: The "Trust Circle"
Inspired by {{DATA:IMAGE:IMAGE_2}}, use large circular containers for testimonials or AI insights. These should use `secondary_container` (#8af1ed) or `tertiary_fixed` (#e6e1e1) to break the rectangular monotony of the web.

---

## 6. Do's and Don'ts

### Do
- **Do** use massive white space. If a section feels "done," add 20% more padding.
- **Do** mix serif and sans-serif within the same block to create hierarchy.
- **Do** use "Paper" colors (#fcf9f5) for the main background to signal quality.
- **Do** use high-quality, editorial photography that feels candid and human (Reference {{DATA:IMAGE:IMAGE_3}}).

### Don't
- **Don't** use pure #000000. Use our `on-surface` (#1c1c1a) for a softer, premium feel.
- **Don't** use 1px solid borders for layout. Use tonal shifts.
- **Don't** use standard "Blue" for links. Every interactive element must stem from our `primary` orange or `secondary` teal palette.
- **Don't** center-align long blocks of text. Stick to the "Editorial Left" alignment for a professional look.