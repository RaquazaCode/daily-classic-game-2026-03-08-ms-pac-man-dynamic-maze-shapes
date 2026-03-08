const WIDTH = 17;
const HEIGHT = 19;
const STEP_MS = 200;
const PHASE_MS = 15000;
const POWER_MS = 6000;

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const PHASE_A = [
  "#################",
  "#...............#",
  "#.###.#####.###.#",
  "#o#.........#..o#",
  "#.#.###.#.###.#.#",
  "#...#...#...#...#",
  "###.#.#####.#.###",
  "#...#...#...#...#",
  "#.#####.#.#####.#",
  "#...............#",
  "#.#####.###.###.#",
  "#.#.....#.....#.#",
  "#.#.###.#.###.#.#",
  "#...#...P...#...#",
  "###.#.#####.#.###",
  "#o..#..G..#...#o#",
  "#.###.#####.###.#",
  "#......G........#",
  "#################"
];

const PHASE_B = [
  "#################",
  "#...............#",
  "#.###.##.##.###.#",
  "#o#...#...#.#..o#",
  "#.#.###.#.###.#.#",
  "#...#...#...#...#",
  "###.#.#####.#.###",
  "#.....#.#.#.....#",
  "#.###.#.#.#.###.#",
  "#...............#",
  "#.###.#####.###.#",
  "#.#...#...#...#.#",
  "#.#.###.#.###.#.#",
  "#...#...P...#...#",
  "###.#.##.##.#.###",
  "#o..#..G..#...#o#",
  "#.###.#####.###.#",
  "#......G........#",
  "#################"
];

function makeRng(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let v = Math.imul(t ^ (t >>> 15), t | 1);
    v ^= v + Math.imul(v ^ (v >>> 7), v | 61);
    return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
  };
}

function parseLayout(layout) {
  const rows = layout.map((line) => line.split(""));
  let playerStart = { x: 1, y: 1 };
  const ghostStarts = [];

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      if (rows[y][x] === "P") {
        playerStart = { x, y };
        rows[y][x] = ".";
      }
      if (rows[y][x] === "G") {
        ghostStarts.push({ x, y });
        rows[y][x] = ".";
      }
    }
  }

  return { rows, playerStart, ghostStarts };
}

const parsedA = parseLayout(PHASE_A);
const parsedB = parseLayout(PHASE_B);

function clonePellets() {
  const pellets = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(" "));
  let remaining = 0;
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const tile = parsedA.rows[y][x];
      if (tile === "." || tile === "o") {
        pellets[y][x] = tile;
        remaining += 1;
      }
    }
  }
  return { pellets, remaining };
}

function isWall(phase, x, y) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
    return true;
  }
  const layout = phase === 0 ? parsedA.rows : parsedB.rows;
  return layout[y][x] === "#";
}

function phaseLabel(phase) {
  return phase === 0 ? "A" : "B";
}

function createGhosts(ghostStarts) {
  return ghostStarts.map((pos, index) => ({
    id: index,
    x: pos.x,
    y: pos.y,
    dir: index % 2 === 0 ? "left" : "right",
    home: { x: pos.x, y: pos.y }
  }));
}

function buildInitialState(seed) {
  const rng = makeRng(seed);
  const { pellets, remaining } = clonePellets();
  const player = {
    x: parsedA.playerStart.x,
    y: parsedA.playerStart.y,
    dir: "left",
    desiredDir: "left"
  };

  return {
    seed,
    rng,
    tick: 0,
    accumulator: 0,
    elapsedMs: 0,
    phaseElapsedMs: 0,
    mazePhase: 0,
    player,
    ghosts: createGhosts(parsedA.ghostStarts),
    pellets,
    pelletsRemaining: remaining,
    score: 0,
    lives: 3,
    powerTimer: 0,
    paused: false,
    gameOver: false,
    won: false,
    status: "running"
  };
}

export function createGame(seed = 1) {
  return buildInitialState(seed);
}

function canMove(game, x, y) {
  return !isWall(game.mazePhase, x, y);
}

function tryMoveEntity(game, entity, dir) {
  const vector = DIRS[dir];
  if (!vector) {
    return false;
  }
  const nx = entity.x + vector.x;
  const ny = entity.y + vector.y;
  if (!canMove(game, nx, ny)) {
    return false;
  }
  entity.x = nx;
  entity.y = ny;
  entity.dir = dir;
  return true;
}

function eatPellet(game) {
  const tile = game.pellets[game.player.y][game.player.x];
  if (tile === ".") {
    game.pellets[game.player.y][game.player.x] = " ";
    game.pelletsRemaining -= 1;
    game.score += 10;
  } else if (tile === "o") {
    game.pellets[game.player.y][game.player.x] = " ";
    game.pelletsRemaining -= 1;
    game.score += 50;
    game.powerTimer = POWER_MS;
  }
}

function loseLife(game) {
  game.lives -= 1;
  if (game.lives <= 0) {
    game.lives = 0;
    game.gameOver = true;
    game.status = "game_over";
    return;
  }
  game.player.x = parsedA.playerStart.x;
  game.player.y = parsedA.playerStart.y;
  game.player.dir = "left";
  game.player.desiredDir = "left";
  for (const ghost of game.ghosts) {
    ghost.x = ghost.home.x;
    ghost.y = ghost.home.y;
    ghost.dir = "left";
  }
}

function checkCollisions(game) {
  for (const ghost of game.ghosts) {
    if (ghost.x === game.player.x && ghost.y === game.player.y) {
      if (game.powerTimer > 0) {
        game.score += 200;
        ghost.x = ghost.home.x;
        ghost.y = ghost.home.y;
      } else {
        loseLife(game);
        return;
      }
    }
  }
}

function chooseGhostDirection(game, ghost) {
  const options = [];
  for (const dir of ["up", "left", "down", "right"]) {
    const d = DIRS[dir];
    const nx = ghost.x + d.x;
    const ny = ghost.y + d.y;
    if (!canMove(game, nx, ny)) {
      continue;
    }
    options.push(dir);
  }

  if (options.length === 0) {
    return ghost.dir;
  }

  const chaseOrders = [
    ["left", "up", "right", "down"],
    ["up", "right", "down", "left"],
    ["down", "left", "up", "right"]
  ];

  const base = chaseOrders[(ghost.id + game.tick) % chaseOrders.length];
  const order = game.powerTimer > 0 ? [...base].reverse() : base;

  for (const dir of order) {
    if (options.includes(dir)) {
      return dir;
    }
  }

  return options[Math.floor(game.rng() * options.length)];
}

function updateTick(game) {
  if (game.gameOver || game.won) {
    return;
  }

  game.tick += 1;
  game.elapsedMs += STEP_MS;
  game.phaseElapsedMs += STEP_MS;

  if (game.phaseElapsedMs >= PHASE_MS) {
    game.phaseElapsedMs %= PHASE_MS;
    game.mazePhase = game.mazePhase === 0 ? 1 : 0;
  }

  if (game.powerTimer > 0) {
    game.powerTimer = Math.max(0, game.powerTimer - STEP_MS);
  }

  if (!tryMoveEntity(game, game.player, game.player.desiredDir)) {
    tryMoveEntity(game, game.player, game.player.dir);
  }

  eatPellet(game);
  checkCollisions(game);

  for (const ghost of game.ghosts) {
    const next = chooseGhostDirection(game, ghost);
    tryMoveEntity(game, ghost, next);
  }

  checkCollisions(game);

  if (game.pelletsRemaining <= 0) {
    game.won = true;
    game.status = "won";
  } else if (!game.gameOver) {
    game.status = game.powerTimer > 0 ? "powered" : "running";
  }
}

export function input(game, action) {
  if (["up", "down", "left", "right"].includes(action)) {
    game.player.desiredDir = action;
    return;
  }

  if (action === "togglePause") {
    if (!game.gameOver && !game.won) {
      game.paused = !game.paused;
      game.status = game.paused ? "paused" : "running";
    }
    return;
  }

  if (action === "reset") {
    const next = buildInitialState(game.seed);
    Object.assign(game, next);
    return;
  }

  if (action === "restart" && (game.gameOver || game.won)) {
    const next = buildInitialState(game.seed);
    Object.assign(game, next);
  }
}

export function step(game, deltaMs) {
  if (game.paused || game.gameOver || game.won) {
    return;
  }
  game.accumulator += deltaMs;
  while (game.accumulator >= STEP_MS) {
    game.accumulator -= STEP_MS;
    updateTick(game);
  }
}

export function renderGameToText(game) {
  const overlay = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x) => (isWall(game.mazePhase, x, y) ? "#" : game.pellets[y][x] === " " ? " " : game.pellets[y][x]))
  );

  for (const ghost of game.ghosts) {
    overlay[ghost.y][ghost.x] = game.powerTimer > 0 ? "g" : "G";
  }
  overlay[game.player.y][game.player.x] = "P";

  const header = `score=${game.score} lives=${game.lives} pellets=${game.pelletsRemaining} phase=${phaseLabel(game.mazePhase)} paused=${game.paused} status=${game.status}`;
  const grid = overlay.map((row) => row.join("")).join("\n");
  return `${header}\n${grid}`;
}
