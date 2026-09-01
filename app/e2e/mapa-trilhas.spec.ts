import { test, expect } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E2E — /mapa · filtro por fluxo (trilhas)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro), 2 regras:
 *   1. clicar num fluxo ESCONDE as telas de fora dele (antes ficavam cinzas,
 *      e o cinza continuava confundindo);
 *   2. o fluxo só desliga clicando DE NOVO no mesmo botão — clique no canvas
 *      vazio não desliga mais (desligar sem querer, com o mapa filtrado,
 *      fazia tudo voltar no meio de uma leitura).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const FLUXO_ME = "Abrir empresa · ME";
const botaoFluxo = (p: import("@playwright/test").Page) =>
  p.getByRole("button", { name: FLUXO_ME, exact: true });

test.describe("/mapa · filtro por fluxo", () => {
  test("clicar num fluxo ESCONDE as telas de fora (não deixa cinza)", async ({ page }) => {
    test.slow(); // o mapa monta o grafo inteiro; no `next dev` a 1ª visita compila
    await page.goto("/mapa");

    const nos = page.locator(".react-flow__node");
    await expect(nos.first()).toBeVisible();
    const total = await nos.count();
    expect(total).toBeGreaterThan(40);

    await botaoFluxo(page).click();

    // Some, não fica cinza: o React Flow tira o nó do DOM quando `hidden`.
    await expect.poll(async () => nos.count(), { timeout: 5000 }).toBeLessThan(total);
    const filtrados = await nos.count();
    expect(filtrados).toBeGreaterThan(0);

    // As arestas seguem a mesma regra.
    const arestas = page.locator(".react-flow__edge");
    expect(await arestas.count()).toBeGreaterThan(0);
  });

  test("clique no canvas vazio NÃO desliga o fluxo; o mesmo botão sim", async ({ page }) => {
    test.slow();
    await page.goto("/mapa");
    const nos = page.locator(".react-flow__node");
    await expect(nos.first()).toBeVisible();
    const total = await nos.count();

    const botao = botaoFluxo(page);
    await botao.click();
    await expect.poll(async () => nos.count(), { timeout: 5000 }).toBeLessThan(total);
    const filtrados = await nos.count();

    // Clica no vazio do canvas (canto superior esquerdo, longe dos cards).
    await page.locator(".react-flow__pane").click({ position: { x: 12, y: 12 } });
    await page.waitForTimeout(400);
    expect(await nos.count()).toBe(filtrados); // continua filtrado

    // O mesmo botão desliga e o mapa inteiro volta.
    await botao.click();
    await expect.poll(async () => nos.count(), { timeout: 5000 }).toBe(total);
  });
});
