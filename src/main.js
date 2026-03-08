import { createGame, input, renderGameToText, step } from "./game-core.js";

const TILE = 32;
const game = createGame(20260308);
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("[data-field='score']");
const livesEl = document.querySelector("[data-field='lives']");
const pelletsEl = document.querySelector("[data-field='pellets']");
const phaseEl = document.querySelector("[data-field='phase']");
const statusEl = document.querySelector("[data-field='status']");
const overlay = document.querySelector("[data-overlay='state']");

const palette = {
  wall: "#1f3d7a",
  pellet: "#ffdf70",
  power: "#fff4b0",
  empty: "#080e1d",
  player: "#ffd24a",
  ghost: "#ff5a76",
  frightened: "#63f3ff"
};

function drawCell(x, y, char) {
  const px = x * TILE;
  const py = y * TILE;

  if (char === "#") {
    ctx.fillStyle = palette.wall;
    ctx.fillRect(px, py, TILE, TILE);
    return;
  }

  ctx.fillStyle = palette.empty;
  ctx.fillRect(px, py, TILE, TILE);

  if (char === ".") {
    ctx.fillStyle = palette.pellet;
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (char === "o") {
    ctx.fillStyle = palette.power;
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  if (char === "P") {
    ctx.fillStyle = palette.player;
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, TILE * 0.42, Math.PI * 0.15, Math.PI * 1.85);
    ctx.lineTo(px + TILE / 2, py + TILE / 2);
    ctx.fill();
  }

  if (char === "G" || char === "g") {
    ctx.fillStyle = char === "g" ? palette.frightened : palette.ghost;
    ctx.fillRect(px + 6, py + 8, TILE - 12, TILE - 10);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + 10, py + 14, 4, 4);
    ctx.fillRect(px + TILE - 14, py + 14, 4, 4);
  }
}

function render() {
  const text = renderGameToText(game);
  const [header, ...rows] = text.split("\n");

  for (let y = 0; y < rows.length; y += 1) {
    for (let x = 0; x < rows[y].length; x += 1) {
      drawCell(x, y, rows[y][x]);
    }
  }

  const fields = Object.fromEntries(header.split(" ").map((part) => part.split("=")));
  scoreEl.textContent = fields.score;
  livesEl.textContent = fields.lives;
  pelletsEl.textContent = fields.pellets;
  phaseEl.textContent = fields.phase;
  statusEl.textContent = fields.status;

  if (fields.status === "paused") {
    overlay.hidden = false;
    overlay.textContent = "Paused";
  } else if (fields.status === "game_over") {
    overlay.hidden = false;
    overlay.textContent = "Game Over - Press Enter";
  } else if (fields.status === "won") {
    overlay.hidden = false;
    overlay.textContent = "You Win - Press Enter";
  } else {
    overlay.hidden = true;
    overlay.textContent = "";
  }
}

window.advanceTime = (ms) => {
  step(game, ms);
  render();
};

window.render_game_to_text = () => renderGameToText(game);
window.__game = game;

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp") input(game, "up");
  if (event.code === "ArrowDown") input(game, "down");
  if (event.code === "ArrowLeft") input(game, "left");
  if (event.code === "ArrowRight") input(game, "right");
  if (event.code === "KeyP") input(game, "togglePause");
  if (event.code === "KeyR") input(game, "reset");
  if (event.code === "Enter") input(game, "restart");
  render();
});

let previous = performance.now();
function frame(now) {
  const delta = Math.min(250, now - previous);
  previous = now;
  step(game, delta);
  render();
  requestAnimationFrame(frame);
}

render();
requestAnimationFrame(frame);
