# Design System Strategy: The Artisanal Sanctuary

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Artisanal Sanctuary."** 

We are moving away from the "template" look of modern SaaS and toward a high-end editorial experience. This system avoids rigid, boxed-in layouts in favor of intentional asymmetry, overlapping elements, and vast planes of cream space. By treating the screen like a gallery wall rather than a spreadsheet, we create an atmosphere of quiet confidence and premium craftsmanship. We don't just "bridge" connections; we curate them with warmth and precision.

## 2. Colors: Tonal Depth & Warmth
The palette is rooted in a sophisticated interplay between warm light and organic shadow.

*   **Primary Roles:** The honey-yellow (`primary_container`: #EAB308) is our "sunlight." It is used sparingly for high-intent actions. The deep brown (`primary`: #785a00) provides the structural authority for typography.
*   **The "No-Line" Rule:** To maintain a premium, seamless aesthetic, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background color shifts. For example, a content section using `surface_container_low` (#f5f4ec) should sit adjacent to the main `surface` (#fbf9f1). This creates a "soft edge" that feels architectural rather than digital.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. Use the surface-container tiers to create depth.
    *   *Base:* `surface` (#fbf9f1)
    *   *Nesting:* A `surface_container_lowest` (#ffffff) card sitting on a `surface_container` (#f0eee6) section creates a natural, breathable lift.
*   **The "Glass & Gradient" Rule:** Floating elements (like navigation bars or hovering modals) should utilize a "Frosted Honey" effect: use `surface_container_lowest` at 70% opacity with a `16px` to `24px` backdrop blur. 
*   **Signature Textures:** For primary CTAs, do not use a flat hex. Apply a subtle linear gradient from `primary_container` (#EAB308) to `primary_fixed_dim` (#f7be1d) at a 135-degree angle. This adds a "soul" to the button that mimics the way light hits a jar of honey.

## 3. Typography: Editorial Authority
Our typography is a conversation between heritage and modernity.

*   **Display & Headlines (Noto Serif):** These are our "Statement" pieces. Use `display-lg` and `headline-lg` with generous leading (1.2–1.4) to anchor the page. The dark brown serif conveys a sense of established trust and editorial intent.
*   **Titles & Body (Plus Jakarta Sans):** The clean sans-serif ensures the interface feels contemporary and functional. It acts as the "white space" within the text itself.
*   **Hierarchy Strategy:** To achieve a high-end look, use extreme contrast in scale. A `display-lg` headline should often be paired with a much smaller `body-md` description to create a sense of vastness and luxury.

## 4. Elevation & Depth: The Layering Principle
We reject the "drop shadow" defaults of the early web. Depth here is atmospheric.

*   **Tonal Layering:** Hierarchy is achieved by "stacking" surface tokens. Place `surface_container_highest` (#e4e3db) elements behind `surface_container_low` (#f5f4ec) elements to pull the eye toward the "lighter" (higher) surface.
*   **Ambient Shadows:** When a physical lift is required, use "Long Shadows." The shadow color must be a tinted version of `on_surface` (#1b1c17) at an opacity between 4% and 6%. Blur values should be high (30px–60px) to mimic soft, ambient light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, it must be a "Ghost Border." Use `outline_variant` (#d3c5ac) at 15% opacity. It should be barely visible—a suggestion of a boundary, not a cage.
*   **Glassmorphism:** Use backdrop blurs on `surface_container_lowest` for elements that float over imagery or complex backgrounds. This ensures the warm cream tones of the brand bleed through the UI, softening the overall composition.

## 5. Components

### Buttons
*   **Primary:** Roundedness `full` (9999px) or `xl` (1.5rem). Background is the Honey Gradient. Text is `on_primary_fixed` (#251a00). 
*   **Secondary:** No background. Use a `title-sm` font with a "Ghost Border" and a subtle `surface_container_low` hover state.
*   **Tertiary:** Text-only with a slightly heavier weight. No underline unless hovered.

### Cards & Content Groups
*   **Rule:** Forbid the use of divider lines. 
*   **Implementation:** Separate content blocks using vertical white space (use the top end of the spacing scale, e.g., 64px or 80px) or by alternating background tiers (e.g., `surface` to `surface_container_low`).

### Input Fields
*   **Style:** Minimalist. No four-sided box. Use a 1px "Ghost Border" only on the bottom edge. On focus, the bottom border transitions to `primary` (#785a00) and the background shifts slightly to `surface_container_lowest`.

### Chips & Tags
*   **Style:** Use `surface_container_high` (#eae8e0) with `label-md` text. Roundedness should be `md` (0.75rem) to differentiate from the `full` roundedness of primary buttons.

### Additional Component: The "Editorial Pull-Quote"
*   **Purpose:** To break up long-form body text.
*   **Style:** Use `headline-sm` in `notoSerif`, italicized, with a `primary_fixed` (#ffdf9a) vertical accent bar on the left. This brings the "Bee" warmth into the middle of text-heavy pages.

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Place an image off-center and let the `headline-lg` overlap the edge of the image container slightly.
*   **Use Generous Leading:** Ensure body text has enough line height (1.6+) to feel relaxed and readable.
*   **Tonal Transitions:** Use background shifts to guide the user from one "story" to the next on the page.

### Don't:
*   **Don't use pure black:** Always use `on_surface` (#1b1c17) for text to maintain the warm, organic feel.
*   **Don't use 1px dividers:** If you think you need a line, use 32px of white space instead.
*   **Don't crowd the honey:** The yellow (#EAB308) is a spotlight. If everything is yellow, nothing is important. Keep it to one or two key actions per screen.
*   **Don't use standard "Drop Shadows":** Avoid the "floating card" look of Material Design 1.0. If it doesn't look like light hitting paper, it's too heavy.