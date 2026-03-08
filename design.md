# Design - Ms. Pac-Man Dynamic Maze Shapes

## Core Loop
- Fixed-step (`200ms`) grid simulation.
- Player movement uses desired direction then current direction fallback.
- Ghosts use deterministic priority routing derived from tick count and ghost id.

## Twist
- Maze phase switches every `15s` between two static layouts.
- Phase change is deterministic and included in text render output.
- Both player and ghosts obey active-phase walls.

## State + Hooks
- Seeded PRNG keeps path selection deterministic.
- Exposed hooks:
  - `window.advanceTime(ms)` for scripted simulation.
  - `window.render_game_to_text()` for deterministic verification output.

## Win/Lose + Controls
- Win: all pellets consumed.
- Lose: all lives consumed by ghost collisions.
- Controls: arrows move, `P` pause, `R` reset, `Enter` restart after terminal state.
