import { createGame, input, renderGameToText, step } from "./game-core.js";

const game = createGame(20260308);
window.advanceTime = (ms) => step(game, ms);
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
});
