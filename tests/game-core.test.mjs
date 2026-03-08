import assert from "node:assert/strict";
import { createGame, input, renderGameToText, step } from "../src/game-core.js";

const gameA = createGame(11);
const gameB = createGame(11);
assert.equal(renderGameToText(gameA), renderGameToText(gameB), "same seed should create deterministic initial state");

const startScore = gameA.score;
input(gameA, "right");
step(gameA, 240);
assert.ok(gameA.score > startScore, "collecting first pellet should increase score");

const phaseBefore = gameA.mazePhase;
step(gameA, 16_000);
assert.notEqual(gameA.mazePhase, phaseBefore, "maze phase should toggle over time");

input(gameA, "togglePause");
const frozen = renderGameToText(gameA);
step(gameA, 1000);
assert.equal(renderGameToText(gameA), frozen, "paused game should not advance");

input(gameA, "reset");
assert.equal(renderGameToText(gameA), renderGameToText(createGame(11)), "reset should return to deterministic initial state");

console.log("game-core tests passed");
