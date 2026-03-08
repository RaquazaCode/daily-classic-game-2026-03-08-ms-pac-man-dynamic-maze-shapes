# Design - Ms. Pac-Man Dynamic Maze Shapes

- Base loop: collect pellets while avoiding deterministic ghosts on a grid.
- Twist: every fixed interval, maze walls switch between phase A and phase B.
- Determinism: fixed seed, fixed-step simulation, no wall-clock dependency.
- Automation hooks: `window.advanceTime(ms)` and `window.render_game_to_text()`.
