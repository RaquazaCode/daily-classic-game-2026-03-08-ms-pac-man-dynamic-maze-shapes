# daily-classic-game-2026-03-08-ms-pac-man-dynamic-maze-shapes

<div align="center">
  <p>Deterministic Ms. Pac-Man-inspired maze chase with phase-shifting corridors and reproducible ghost behavior.</p>
</div>

<div align="center">
  <p><strong>Media</strong>: Playwright screenshots, action payload, and render text output are in <code>artifacts/playwright/</code>.</p>
</div>

## Quick Start
1. `pnpm install`
2. `pnpm test`
3. `pnpm build`
4. `pnpm dev` and open `http://127.0.0.1:4173/index.html`

## How To Play
- Move with Arrow keys.
- Collect pellets while avoiding ghosts.
- Press `P` to pause and resume.
- Press `R` to reset instantly.
- Press `Enter` to restart after win or game over.

## Rules
- The maze alternates between Phase A and Phase B every 15 seconds.
- Walls from the active phase block movement for player and ghosts.
- Ghost collisions cost one life unless power mode is active.
- Clearing every pellet wins the run.

## Scoring
- Pellet: +10
- Power pellet: +50
- Ghost while powered: +200

## Twist
Dynamic maze shapes: the board shifts between two deterministic layouts so lanes open and close on a known timer.

## Verification
- Deterministic loop checks: `pnpm test`
- Build output generation: `pnpm build`
- Browser hook and capture proof: `pnpm capture`

## Project Layout
- `src/` deterministic rules, rendering, browser hooks
- `tests/` unit tests and Playwright artifact capture
- `scripts/` static build utility
- `assets/` static assets
- `docs/plans/` run plan
- `artifacts/playwright/` screenshots, GIF placeholders, action payload, render text

## GIF Captures
- Clip 1 - Opening Route: `artifacts/playwright/clip-opening.gif`
- Clip 2 - Phase Shift Escape: `artifacts/playwright/clip-phase-shift.gif`
- Clip 3 - Ghost Chase: `artifacts/playwright/clip-ghost-chase.gif`
