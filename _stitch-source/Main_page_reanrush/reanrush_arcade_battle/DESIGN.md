---
name: ReanRush Arcade Battle
colors:
  surface: '#fff8f6'
  surface-dim: '#e9d6cf'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#fdeae3'
  surface-container-high: '#f7e4dd'
  surface-container-highest: '#f1dfd8'
  on-surface: '#231915'
  on-surface-variant: '#44474f'
  inverse-surface: '#392e2a'
  inverse-on-surface: '#ffede7'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#455e91'
  primary: '#00163a'
  on-primary: '#ffffff'
  primary-container: '#0b2a5b'
  on-primary-container: '#7a93ca'
  inverse-primary: '#aec6ff'
  secondary: '#0d4be4'
  on-secondary: '#ffffff'
  secondary-container: '#3966fe'
  on-secondary-container: '#fffbff'
  tertiary: '#221500'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c2800'
  on-tertiary-container: '#be8a1b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#2c4678'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001452'
  on-secondary-fixed-variant: '#0038b7'
  tertiary-fixed: '#ffdeaa'
  tertiary-fixed-dim: '#f8bd4d'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#fff8f6'
  on-background: '#231915'
  surface-variant: '#f1dfd8'
typography:
  display-hero:
    fontFamily: Baloo 2
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
  display-hero-mobile:
    fontFamily: Baloo 2
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
  headline-lg:
    fontFamily: Baloo 2
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Baloo 2
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Baloo 2
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-card:
    fontFamily: Baloo 2
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Kantumruy Pro
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Kantumruy Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Kantumruy Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Kantumruy Pro
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
  badge-arcade:
    fontFamily: Baloo 2
    fontSize: 13px
    fontWeight: '800'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system powers a competitive, collaborative quiz battle platform engineered specifically for high school learners in Cambodia and Southeast Asia. The identity fuses high-octane Japanese arcade games with vibrant Southeast Asian neo-brutalism: chunky, tactile, loud, yet structurally disciplined for split-second classroom readability.

The visual style blends:
- **Neo-Brutalist Arcade:** Chunky 3px solid ink-navy borders, zero-blur solid offset drop shadows, and high-impact structural geometry.
- **Tactile Toy-like Gamification:** High-satisfaction tactile controls featuring physical depression offsets (`translate-x-1 translate-y-1` canceling out the 4px shadow to mimic physical arcade push buttons).
- **Localized Cultural Pride:** Architectural integration of classic Khmer diamond patterns (*Phka Chan*) reinterpreted as razor-sharp vector geometric ribbons framing the canvas header and footer.
- **High-Contrast Projection Legibility:** Engineered specifically to cut through low-lumen classroom projectors, ambient equatorial sunlight, and low-spec mobile displays without losing hierarchy or color integrity.

## Colors

The palette establishes an energetic, arcade-style environment anchored by deep structural navy and a warm canvas tone, avoiding cold clinical whites or fatiguing neon yellows.

- **Primary Navy (`#0B2A5B`):** The structural spine. Powers 100% of component borders, drop shadows, structural chrome (navbar, footer), and display typography.
- **Action Blue (`#3B68FF`):** High-priority interactive triggers, call-to-action surfaces, and hero victory badges.
- **Page Background (`#F6E3DC`):** Warm nude-sand tone providing a calm, non-glare canvas across all screen states. Under no circumstances should yellow be substituted as a background fill.
- **Surface White (`#FFFFFF`):** High-contrast payload containers, quiz card surfaces, question prompt pods, and dialog sheets.
- **Gold Accent (`#E2A93B`):** Reserved strictly for prestige signifiers: win streaks, crowns, XP multipliers, leader podiums, and the traditional Khmer geometric diamond trimming.
- **Team A / Correct Green (`#2FA84F`):** Team 1 player indicator, positive feedback loop, correct answer confirmations, and full-health status meters.
- **Team B / Urgent Red (`#D9382B`):** Team 2 player indicator, critical countdown timers (<5 seconds remaining), penalty states, and buzzer challenges.

### Answer Glyph Color Roles
For multi-choice inputs, shapes pair strictly with specific hues:
- **Triangle:** Red (`#D9382B`)
- **Circle:** Action Blue (`#3B68FF`)
- **Square:** Gold (`#E2A93B`)
- **Star:** Green (`#2FA84F`)

## Typography

The dual-type strategy guarantees playful energy without compromising bilingual English and Khmer linguistic ergonomics:

- **Baloo 2:** Dedicated to game scores, timers, modal headers, podium titles, and answer keys. Its inflated terminal curves deliver arcade punchiness and high-speed scanability.
- **Kantumruy Pro:** Handles all bilingual study prompts, complex Khmer script passages, option descriptions, and instructional UI. Its modern proportions maintain high legibility even when rendered inside dense comparison matrices or on low-resolution smartphones.

## Layout & Spacing

This design system uses a flexible 12-column arena grid for desktop presentation modes (projectors, teacher dashboards) collapsing to a 4-column stack on mobile viewports.

- **Desktop Arena (>= 1024px):** 12 columns, 24px (`1.5rem`) gutters, max-width of 1280px, centered on canvas with 32px (`2rem`) margins. Quiz choices are laid out as a balanced 2x2 quadrant grid for equal-distance physical targeting.
- **Tablet / Split Screen (768px - 1023px):** 8 columns, 16px (`1rem`) gutters, fluid-margin edges. Team battle scorebars dock to top and bottom peripheries.
- **Mobile Handheld (< 768px):** 4 columns, 12px (`0.75rem`) gutters, 16px (`1rem`) margin edges. Answer options switch to a vertically stacked 4-tier list to preserve single-thumb thumb-zone hit rates.

All structural spacers are multiples of 4px. Component internal padding maintains a minimum of `1rem` on buttons and cards to preserve the visual weight of neo-brutalist borders.

## Elevation & Depth

Depth in this system rejects blurred raster drop-shadows. Elevation is expressed entirely through **hard-edge 0-blur directional shadows and physical mechanical compression**:

- **Ground Level (Flat):** Utility inputs, inactive tracks, and background strips sit directly on the `#F6E3DC` substrate with a standard `3px solid #0B2A5B` boundary line and zero offset.
- **Level 1 (Cards, Static Panels, Inactive Answer Tiles):**
  - Border: `3px solid #0B2A5B`
  - Shadow: `4px 4px 0px #0B2A5B`
- **Level 2 (Interactive Buttons, Active Questions, Floating Snackbars):**
  - Border: `3px solid #0B2A5B`
  - Shadow: `6px 6px 0px #0B2A5B`
  - Hover Transition: Elevates to `8px 8px 0px #0B2A5B` with a `-2px -2px` translation.
  - Active / Pressed State: Collapses to `0px 0px 0px #0B2A5B` with an immediate `translate-x-[6px] translate-y-[6px]` shift, visually slamming the element into the surface.
- **Level 3 (Modal Battle Dialogs, Victory Popups):**
  - Border: `4px solid #0B2A5B`
  - Shadow: `10px 10px 0px #0B2A5B`

## Shapes

The shape architecture harmonizes aggressive industrial borders with friendly, safe geometry. Base elements utilize `rounded-2xl` (16px), while parent cards and focal display pods employ `rounded-3xl` (24px).

Pill roundness (`rounded-full`) is reserved strictly for game meta tokens: streak counts, player live-status badges, round tags, and answer symbol enclosures.

### Khmer Diamond Accent Strip
Directly beneath the `#0B2A5B` top navigation bar and directly above the footer bar sits an unbroken 8px high decorative border strip:
- Background: `#0B2A5B`
- Pattern: Repeating vector rhomboid / diamond chain (*Phka Chan* geometry) filled with `#E2A93B` Gold at 14px step intervals.

## Components

### Buttons
- **Primary Arcade Action:** `#3B68FF` background, text `#FFFFFF`, border `3px solid #0B2A5B`, shadow `6px 6px 0px #0B2A5B`, rounded `1rem`. Active state: `translate-x-[6px] translate-y-[6px]`, shadow becomes `0px 0px 0px`.
- **Gold Booster Action:** `#E2A93B` background, text `#0B2A5B`, font `Baloo 2 700`, same border and hard-shadow mechanics.
- **Secondary Neutral Action:** `#FFFFFF` background, text `#0B2A5B`, border `3px solid #0B2A5B`, shadow `4px 4px 0px #0B2A5B`.

### Quiz Answer Cards
Quad-layout interactive panels designed for high tension:
- Surface `#FFFFFF`, border `3px solid #0B2A5B`, shadow `6px 6px 0px #0B2A5B`, rounded `1.5rem`, padding `1.25rem`.
- Each card hosts a dedicated leading shape avatar container (44x44px, rounded-xl, bordered 2px solid `#0B2A5B`):
  - **Option 1:** Red background `#D9382B` with central white equilateral Triangle.
  - **Option 2:** Blue background `#3B68FF` with central white Circle.
  - **Option 3:** Gold background `#E2A93B` with central white Square.
  - **Option 4:** Green background `#2FA84F` with central white 5-point Star.
- Selection State: Surrounding card border thickens to 4px `#0B2A5B` and card surface tints to 10% tint of the glyph color.

### Team Battle Headers & Status Bars
- **Team A Pod:** Styled in `#2FA84F` with white typography, hard drop shadow `4px 4px 0px #0B2A5B`.
- **Team B Pod:** Styled in `#D9382B` with white typography, hard drop shadow `4px 4px 0px #0B2A5B`.
- **Split Health/Score Meter:** Horizontal duel gauge encased in a `3px solid #0B2A5B` rounded-full housing with dual filling tracks (`#2FA84F` from left, `#D9382B` from right).

### Cards & Question Surfaces
- Main question container features `#FFFFFF` ground, `3px solid #0B2A5B` frame, `8px 8px 0px #0B2A5B` offset, and `1.5rem` internal padding.
- Category tag pinned to the top-left outer border with an overlapping negative top margin, styled as a pill badge in `#E2A93B` with `2px solid #0B2A5B`.

### Text Input Fields
- Ground `#FFFFFF`, border `3px solid #0B2A5B`, rounded `1rem`, inner shadow inset `2px 2px 0px rgba(11,42,91,0.08)`.
- Focused state: Outline suppressed, shadow converts to external `4px 4px 0px #0B2A5B`, border color holds `#0B2A5B`.

### Selection Controls (Checkboxes & Radios)
- Square (checkbox) or circle (radio) with `3px solid #0B2A5B`, 24x24px dimensions, `#FFFFFF` idle background.
- Checked state: `#2FA84F` fill with thick white checkmark glyph or `#3B68FF` fill with solid center navy dot. Shadow: `2px 2px 0px #0B2A5B`.