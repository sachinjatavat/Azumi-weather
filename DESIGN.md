---
name: Vibrant Joy
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5a4046'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8e6f76'
  outline-variant: '#e2bdc5'
  surface-tint: '#ba005d'
  primary: '#a40051'
  on-primary: '#ffffff'
  primary-container: '#d10069'
  on-primary-container: '#ffe6eb'
  inverse-primary: '#ffb1c5'
  secondary: '#854d69'
  on-secondary: '#ffffff'
  secondary-container: '#ffb8d9'
  on-secondary-container: '#7b4561'
  tertiary: '#595054'
  on-tertiary: '#ffffff'
  tertiary-container: '#72686c'
  on-tertiary-container: '#f7e9ee'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e1'
  primary-fixed-dim: '#ffb1c5'
  on-primary-fixed: '#3f001b'
  on-primary-fixed-variant: '#8f0046'
  secondary-fixed: '#ffd8e8'
  secondary-fixed-dim: '#f9b2d3'
  on-secondary-fixed: '#360a24'
  on-secondary-fixed-variant: '#6a3651'
  tertiary-fixed: '#eddfe4'
  tertiary-fixed-dim: '#d0c3c8'
  on-tertiary-fixed: '#201a1d'
  on-tertiary-fixed-variant: '#4d4448'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system is built on a foundation of optimism, celebration, and clarity. It targets a modern audience seeking a delightful and friction-less experience. The aesthetic is a hybrid of **Modern Minimalism** and **Soft-Glassmorphism**, characterized by expansive white space, hyper-rounded "pill" geometry, and a sophisticated use of vibrant magenta accents. 

The emotional response should be one of "effortless joy." Surfaces are clean and light, using subtle mesh gradients to add depth without clutter. The interface feels tactile yet ethereal, utilizing soft shadows and translucent layers to guide the user's focus toward key actions and celebratory data points.

## Colors

The palette is anchored by a high-energy **Magenta Primary**, used strategically for call-to-actions, active states, and brand-defining moments. 

- **Primary (#D10069):** Used for main buttons, primary icons, and active navigation indicators.
- **Secondary (#FFB8D9):** A soft pink used for secondary backgrounds, hover states on light surfaces, and decorative accents.
- **Tertiary (#FDEFF4):** A near-white blush used for large container backgrounds and subtle section separators.
- **Neutral (#1A1A1A):** A soft black reserved for high-contrast typography and iconography on light backgrounds.
- **Surface:** Always defaulted to pure white (#FFFFFF) to maintain the clean, airy atmosphere.

## Typography

The typography system utilizes **DM Sans** exclusively to ensure a friendly, modern, and approachable feel. The hierarchy relies on substantial weight differences (Bold vs. Regular) rather than just size to create a clear scan pattern.

- **Headlines:** Use Bold (700) or SemiBold (600) weights. Display sizes should feature tight letter spacing for a "designed" feel.
- **Body:** Kept at Regular (400) weight for maximum readability. Line heights are generous to prevent visual fatigue.
- **Labels:** Use Medium or SemiBold weights for functional UI elements like button text and table headers.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high internal padding to maintain the "airy" brand personality. 

- **Grid:** A 12-column system for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** All spacing is based on an 8px baseline. Use `lg` and `xl` spacing for section vertical gaps to emphasize the "clean surface" aesthetic.
- **Weather Specifics:** For the weather dashboard, group related data (hourly forecast) into horizontal scrolling containers with `md` padding between items.

## Elevation & Depth

Depth is achieved through **Soft Tonal Layers** and **Ambient Shadows** rather than hard borders.

- **Surfaces:** Main content cards use a subtle "floating" effect with a very soft, large-radius shadow: `0px 20px 40px rgba(209, 0, 105, 0.08)`. Note the slight magenta tint in the shadow to keep the palette cohesive.
- **Glassmorphism:** Use background blurs (16px - 24px) for overlaying elements like navigation bars or pop-over weather details to maintain context of the background.
- **Separators:** Use color-fills (Tertiary) instead of lines wherever possible.

## Shapes

The shape language is strictly **Pill-shaped (3)**. This is the most critical visual identifier of the design system.

- **Buttons & Inputs:** Must always use full-round caps (pill shape).
- **Cards:** Use `rounded-xl` (1.5rem / 24px) or larger for main containers to evoke a friendly, non-threatening feel.
- **Icons:** Should be encased in circular or pill-shaped "housing" containers when used as primary navigational elements.

## Components

### Buttons
- **Primary:** Pill-shaped, Magenta background, White text. Elevation increases on hover.
- **Secondary:** Pill-shaped, Light Grey/Silver background, Neutral text.
- **Tertiary:** Text-only with a Magenta underline or icon.

### Cards (Weather Widgets)
- Feature a white base with `rounded-xl` corners.
- Use the Secondary (#FFB8D9) color for internal data grouping (e.g., a pill-shaped background behind the current UV index).

### Input Fields
- High-contrast pill-shaped containers.
- 2px Magenta border only on focus state.

### Chips & Badges
- Used for weather alerts or "Now" indicators. 
- Always pill-shaped with `label-sm` typography.

### Progress Bars (Humidity/Rain Chance)
- Thick, pill-shaped tracks. 
- The "filled" portion uses a gradient from Magenta to a lighter pink.