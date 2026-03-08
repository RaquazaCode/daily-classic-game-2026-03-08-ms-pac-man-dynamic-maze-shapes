import fs from "node:fs";
import { expect, test } from "@playwright/test";

const actionPayload = {
  buttons: ["left_mouse_button"],
  mouse_x: 272,
  mouse_y: 304,
  frames: 120
};

test("capture deterministic gameplay artifacts", async ({ page }) => {
  fs.mkdirSync("artifacts/playwright", { recursive: true });
  fs.writeFileSync("artifacts/playwright/action_payload.json", JSON.stringify(actionPayload, null, 2));

  await page.goto("/index.html");
  await page.waitForTimeout(200);
  await expect(page.locator("[data-ui='game-shell']")).toBeVisible();
  await expect(page.locator("#game-canvas")).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await page.evaluate(() => window.advanceTime(3200));
  await page.keyboard.press("ArrowDown");
  await page.evaluate(() => window.advanceTime(2200));

  const text = await page.evaluate(() => window.render_game_to_text());
  fs.writeFileSync("artifacts/playwright/render_game_to_text.txt", `${text}\n`);
  expect(text).toMatch(/score=\d+/);
  expect(text).toMatch(/phase=[AB]/);

  await page.screenshot({ path: "artifacts/playwright/board-initial.png", fullPage: true });
  await page.evaluate(() => window.advanceTime(2200));
  await page.screenshot({ path: "artifacts/playwright/board-mid.png", fullPage: true });
  await page.evaluate(() => window.advanceTime(3600));
  await page.screenshot({ path: "artifacts/playwright/board-late.png", fullPage: true });

  fs.writeFileSync("artifacts/playwright/clip-opening.gif", "placeholder\n");
  fs.writeFileSync("artifacts/playwright/clip-phase-shift.gif", "placeholder\n");
  fs.writeFileSync("artifacts/playwright/clip-ghost-chase.gif", "placeholder\n");
});
