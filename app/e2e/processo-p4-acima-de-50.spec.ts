import { test, expect, type Page } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P4 · O RAMO ACIMA DE R$ 50 — varredura minuciosa (11/09, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * *"pegue o fluxo de 4.3 selecionando acima de 50 reais e passe um E2E apenas
 * ele, minucioso na varredura. Quero ver o que você vai encontrar."*
 *
 * 🔴 O QUE ESTE ARQUIVO PODE E NÃO PODE ACHAR. O ramo acima de R$ 50 é quase
 * todo PROPOSTA: P4.14–P4.17 não têm tela porque o gateway (Stone) ainda não
 * está integrado. Então isto não valida comportamento de pagamento — mede a
 * DISTÂNCIA entre o processo desenhado e o app construído, passo a passo.
 *
 * Passo que a tela cumpre vira teste verde. Passo que a tela não cumpre vira
 * FALHA COM A FRASE DO QUE FALTA, não `fixme` — o Pedro pediu varredura, e
 * pendência escondida atrás de "skipped" é o falso conforto que este trabalho
 * existe pra evitar.
 *
 * Par do processo: `execucao/processos/processos-data.mjs` + as propostas
 * S1, S2, S3, S6, S7, S8 e S9 em `processos-propostas.mjs`. As de 11/09 (S4, S5,
 * S10 e S11) já foram promovidas e viraram os passos P4.12 a P4.19.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** O serviço do ramo: acima de R$ 50, e o mais barato deles (menos ruído). */
const SERVICO = "Relatório contábil formal";
const PRECO = /R\$\s?89/;

/** Um do outro ramo, pra provar que a régua separa de verdade. */
const SERVICO_ATE_50 = "Certidão negativa (CND)";

async function abrirSheet(page: Page, nome: string) {
  await page.goto("/mais/servicos");
  await page.getByText(nome).first().click();
  // a sheet é o P4.2, que o S4 propõe como o nosso ACEITE
  await expect(page.getByRole("button", { name: /Solicitar/ })).toBeVisible();
}

test.describe("P4 · ramo acima de R$ 50 (paga no ato)", () => {
  // ── P4.1 ────────────────────────────────────────────────────────────────
  test("P4.1 · a loja mostra o preço antes do toque", async ({ page }) => {
    await page.goto("/mais/servicos");
    const cartao = page.getByText(SERVICO).first();
    await expect(cartao).toBeVisible();
    await expect(page.getByText(PRECO).first()).toBeVisible();
  });

  // ── P4.3 · a régua do valor ─────────────────────────────────────────────
  test("P4.3 · acima de R$ 50 a tela oferece pagar agora, e até R$ 50 não", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await expect(
      page.getByRole("button", { name: /Solicitar e pagar agora/ }),
      "acima de R$ 50 o botão tem que dizer que cobra agora",
    ).toBeVisible();

    await abrirSheet(page, SERVICO_ATE_50);
    await expect(
      page.getByRole("button", { name: /^Solicitar serviço$/ }),
      "até R$ 50 o botão NÃO pode prometer cobrança agora",
    ).toBeVisible();
  });

  // ── P4.2 / S4 · a sheet como aceite (cláusula 6.3) ──────────────────────
  test("P4.2 · a sheet exibe PREÇO antes do aceite", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await expect(page.getByText(PRECO).first()).toBeVisible();
  });

  test("P4.2 · a sheet exibe o MOMENTO DA COBRANÇA (6.3 exige)", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await expect(
      page.getByText(/cobrado na hora|cobra agora|cobrança agora/i).first(),
      "a 6.3 exige exibição prévia do preço E do momento da cobrança",
    ).toBeVisible();
  });

  test("P4.2 · a sheet exibe o PRAZO ESTIMADO de entrega (6.1)", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await expect(
      page.getByText(/prazo|dias úteis|em até/i),
      "a cláusula 6.1 manda a tabela de adicionais indicar prazo estimado de conclusão",
    ).toBeVisible();
  });

  test("P4.2 · a sheet exibe O QUE ESTÁ SENDO CONTRATADO", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await expect(page.getByText(/O que você recebe|inclui/i).first()).toBeVisible();
  });

  test("P4.2 · o pedido exige um segundo toque deliberado", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await page.getByRole("button", { name: /Solicitar/ }).click();
    await expect(
      page.getByRole("button", { name: /Confirmar solicitação|Confirmar e pagar/i }),
      "o pedido é irreversível a partir do P4.8: o segundo toque tem que estar escrito",
    ).toBeVisible();
  });

  // ── P4.13 · o comprovante do aceite ────────────────────────────────────────
  test("P4.13 · o aceite deixa comprovante consultável", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await page.getByRole("button", { name: /Solicitar/ }).click();
    await page.getByRole("button", { name: /Confirmar/i }).click();
    await expect(
      /* 🐛 a 1ª versão deste teste PASSOU por acidente: `/comprovante/`
         casava com "Comprovante de renda oficial", a descrição do DECORE no
         catálogo ATRÁS da sheet. Verde falso num gap conhecido é pior que
         vermelho. Agora a frase é específica do aceite. */
      page.getByText(/comprovante do aceite|aceite registrado|registrado em \d{2}\/\d{2}/i),
      "6.4 + 1.6 + 16.9: o aceite tem que ficar registrado com data, hora e versão da tabela",
    ).toBeVisible({ timeout: 4000 });
  });

  // ── P4.14 · a tela de pagamento ──────────────────────────────────────────
  test("P4.14 · existe tela de pagamento com Pix, cartão ou boleto", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await page.getByRole("button", { name: /Solicitar/ }).click();
    await page.getByRole("button", { name: /Confirmar/i }).click();
    await expect(
      page.getByText(/Pix|cartão de crédito|boleto/i),
      "sem escolher a forma, o prazo do pedido (72h ou 6 dias) não tem como nascer",
    ).toBeVisible({ timeout: 4000 });
  });

  test("P4.14 · a tela diz até quando o pedido vale", async ({ page }) => {
    await abrirSheet(page, SERVICO);
    await page.getByRole("button", { name: /Solicitar/ }).click();
    await page.getByRole("button", { name: /Confirmar/i }).click();
    await expect(
      page.getByText(/72 horas|6 dias|vale até|expira/i),
      "a validade é decisão do Pedro (11/09) e precisa aparecer ANTES do pagamento",
    ).toBeVisible({ timeout: 4000 });
  });

  // ── P4.16 · o item aguardando ────────────────────────────────────────────
  test("P4.16 · item não pago aparece como aguardando, e não como em andamento", async ({ page }) => {
    await page.goto("/mais/plano");
    const aguardando = page.getByText(/aguardando pagamento/i);
    await expect(
      aguardando,
      "o que separa o P4.16 do P4.8: sem captura, o trabalho NÃO começou",
    ).toBeVisible({ timeout: 4000 });
  });

  // ── P4.8 · o trabalho começou e não dá pra remover ──────────────────────
  test("P4.8 · item em andamento não oferece remover", async ({ page }) => {
    await page.goto("/mais/plano");
    const emAndamento = page.getByText(/em andamento/i).first();
    await expect(emAndamento).toBeVisible();
    const linha = page.locator("li, div").filter({ has: emAndamento }).first();
    await expect(
      linha.getByRole("button", { name: /remover|excluir|cancelar item/i }),
      "27/07: pedir = o trabalho já começou. Mostrar um X que não remove seria pior",
    ).toHaveCount(0);
  });

  // ── P4.19 · entregue e já pago ───────────────────────────────────────────
  test("P4.19 · serviço pago no ato não aparece na próxima fatura", async ({ page }) => {
    await page.goto("/mais/plano");
    const fatura = page.getByText(/Próxima fatura|Fatura de/i).first();
    await expect(fatura).toBeVisible();
    await expect(
      page.getByText(new RegExp(SERVICO, "i")),
      "item pago no ato não entra em fatura: quem paga no S10 termina no P4.19",
    ).toHaveCount(0);
  });
});
