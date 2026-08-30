import { test, expect } from "@playwright/test";

/**
 * Smoke test — só confirma que a infra de E2E está de pé (servidor sobe,
 * Playwright navega, faz assert). Os testes de fluxo de verdade entram
 * conforme o Pedro for pedindo, 1 flow por vez.
 */
test("splash carrega e mostra a marca", async ({ page }) => {
  await page.goto("/splash");
  await expect(page.locator("#splash-frame")).toBeVisible();
});
