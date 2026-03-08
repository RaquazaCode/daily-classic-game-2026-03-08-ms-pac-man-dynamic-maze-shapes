# daily-classic-game-2026-03-08-ms-pac-man-dynamic-maze-shapes

<div align="center">
  <p>Deterministic Ms. Pac-Man-inspired maze chase with dynamic maze-shape phase shifts and automation-safe browser hooks.</p>
</div>

<div align="center">
  <p><strong>Media</strong>: Playwright screenshots and text captures are stored in <code>artifacts/playwright/</code>.</p>
</div>

## GIF Captures
- Clip 1 - Opening Route: `artifacts/playwright/clip-opening.gif`
- Clip 2 - Phase Shift Escape: `artifacts/playwright/clip-phase-shift.gif`
- Clip 3 - Ghost Chase: `artifacts/playwright/clip-ghost-chase.gif`

## Quick Start
1. `pnpm install`
2. `pnpm test`
3. `pnpm build`
4. `pnpm dev` and open `http://127.0.0.1:4173/index.html`

## How To Play
- Move with Arrow keys.
- Pause with `P`.
- Reset with `R`.
- Restart after game over with `Enter`.

## Rules
- Eat pellets for points.
- Avoid ghosts unless power mode is active.
- Maze phase toggles open and close different lanes.

## Scoring
- Pellet: +10
- Power pellet: +50
- Ghost while powered: +200

## Twist
Dynamic maze shapes: the same map alternates between two lane configurations on a deterministic timer.

## Verification
- Deterministic core checks: `pnpm test`
- Build artifact generation: `pnpm build`
- Browser capture + hook proof: `pnpm capture`

## Project Layout
- `src/` game loop, rules, renderer, browser hooks
- `tests/` unit tests and Playwright capture spec
- `scripts/` build utility
- `assets/` static assets
- `docs/plans/` implementation plan
- `artifacts/playwright/` capture outputs
