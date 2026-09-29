# Design System Specification: Autonomous Pixel Pong Hero ("IDEAIS ALL YOU NEED")

## 1. Visual & Aesthetic Identity
- **Design Archetype**: Retro-Cyberpunk / Neo-Brutalist Arcade Terminal
- **Mood & Tone**: Minimalist, tactile, nostalgic yet cutting-edge AI developer aesthetic. Evokes high-performance creative computing, low-level engine craftsmanship, and hacker culture.
- **Surface Philosophy**: Deep pitch black OLED background (`#000000`) paired with crisp monochrome pixel glyphs, subtle glassmorphic telemetry cards, and terminal-style phosphor accents.

---

## 2. Color Palette & Token System

### Base & Backgrounds
| Token | Hex / Value | Role & Usage |
|---|---|---|
| `--color-bg-base` | `#000000` | True black canvas background, terminal body |
| `--color-surface-subtle` | `rgba(255, 255, 255, 0.03)` | Overlay backdrop panels, glassy containers |
| `--color-surface-elevated` | `rgba(18, 18, 18, 0.75)` | Floating control cards, status banners |
| `--color-surface-border` | `rgba(255, 255, 255, 0.12)` | Razor-thin structural borders and dividers |
| `--color-surface-border-subtle` | `rgba(255, 255, 255, 0.06)` | Secondary gridlines, card inner dividers |

### Pixel Simulation Tokens
| Token | Hex / Value | Role & Usage |
|---|---|---|
| `--pixel-active` | `#FFFFFF` | Intact text pixels, ping-pong ball, paddle bodies |
| `--pixel-hit` | `#333333` | Destroyed / impacted pixels (faded remnant state) |
| `--pixel-glow` | `rgba(255, 255, 255, 0.18)` | Text raster shadow / retro glow effect |

### Accent & Status Phosphors
| Token | Hex / Value | Role & Usage |
|---|---|---|
| `--color-accent-emerald` | `#10B981` / `#34D399` | Live simulation pulse indicator, terminal prompt `>_` |
| `--color-accent-emerald-dim` | `rgba(16, 185, 129, 0.12)` | Status tag pill background (`components/ui/...`) |
| `--color-accent-amber` | `#F59E0B` | Warning / collision telemetry accents |

### Text & Foregrounds
| Token | Hex / Value | Role & Usage |
|---|---|---|
| `--text-primary` | `#FFFFFF` | Primary headers, active UI labels, pixel glyphs |
| `--text-secondary` | `rgba(255, 255, 255, 0.70)` | Explanatory subtext, technical subtitles |
| `--text-muted` | `rgba(255, 255, 255, 0.40)` | Metadata timestamps, footer specs, key hints |

---

## 3. Typography & Glyph Matrix

### Typefaces
- **Display & Pixel Text**: Custom 5x5 Matrix Bitmapped Glyphs rasterized directly onto HTML5 `<canvas>`.
- **UI & Telemetry Code**: Monospace font family stack:
  ```css
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  ```
- **Primary Interface Body**: Inter, Geist, or system sans-serif (`font-sans`) for crisp legibility on non-code copy.

### Hierarchy & Scale
- **Hero Canvas Pixel Title**: Dynamic responsive scaling (`Math.min(w/1000, h/1000) * 8px` cell size).
- **Hero Subtitle ("IS ALL YOU NEED")**: 50% scale factor relative to primary title (`4px` cell size).
- **Component Card Header**: `1.125rem` (18px) / `font-semibold` / tracking-normal.
- **Code Badges & Tags**: `0.75rem` (12px) / `font-mono` / uppercase / tracking-wider (`tracking-widest`).
- **Telemetry & Status Bar**: `0.75rem` (12px) / `font-mono` / `leading-none`.

---

## 4. Spacing, Geometry & Layout Grid

### Layout Structure
- **Canvas Layer**: Absolute/Fixed fullscreen canvas (`inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none`).
- **UI Chrome Layer**: Flexbox vertical stack (`min-h-screen`, `justify-between`, `z-index: 10`, `pointer-events: auto`).
- **Header**: `padding: 1.5rem` (24px) x-axis, container max-width `80rem` (1280px).
- **Floating Interactive Deck**: Centered overlay positioned below the main visual line-of-sight:
  - Max width: `36rem` (576px) to `42rem` (672px).
  - Border radius: `1rem` (16px) with backdrop blur (`backdrop-blur-md`).
  - Interior padding: `1.5rem` to `2rem`.

### Elevation & Borders
- **Border Width**: Unified `1px` crisp borders with low-opacity white (`border-white/10` or `border-white/15`).
- **Drop Shadows**: Diffuse dark ambient shadows (`shadow-2xl shadow-black/80`).
- **Glassmorphism**: `backdrop-blur-md` or `backdrop-blur-lg` applied to cards to maintain text legibility over ricocheting balls and paddle motion.

---

## 5. Motion & Physics Principles

1. **Simulation Refresh Rate**: Locked to `requestAnimationFrame` at 60 FPS minimum; canvas scales to native display pixel ratio.
2. **Paddle Motion Mechanics**:
   - 4-axis autonomous AI tracking: Left, Right, Top, and Bottom boundary paddles.
   - Interpolated tracking: `paddle.pos += (target - paddle.pos) * 0.1` producing smooth acceleration/deceleration.
3. **Ball Dynamics**:
   - Constant velocity ball with inverted vector reflection upon boundary and paddle edge collision.
   - Real-time bounding box intersection tests against the unhit pixel grid.
4. **Interactive Controls**:
   - `Reset Text Pixels` action triggers instant array re-population with subtle scale pulse.

---

## 6. Component Inventory

- `PromptingIsAllYouNeed`: Core full-bleed HTML5 Canvas simulation component.
- `TelemetryBadge`: Micro-status tag with pulsing green phosphor dot (`Live Canvas Simulation`).
- `CodePill`: Monospace container displaying component import path (`components/ui/animated-hero-section.tsx`).
- `ControlDeck`: Floating translucent card with description, reset button, and live telemetry counter.
- `FooterStatusBar`: Low-profile technical metadata banner detailing renderer pipeline and stack compatibility.
