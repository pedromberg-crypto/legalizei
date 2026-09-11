import { test, expect } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P4 · Adicionar um serviço avulso à fatura aberta
 * ═══════════════════════════════════════════════════════════════════════════
 * Este arquivo é o PAR de `execucao/processos/processos-data.mjs` §P4. Cada
 * teste aqui prova (ou nega) um passo do processo, e o nome do teste começa
 * com o id do passo pra que a saída do Playwright seja lida ao lado do board.
 *
 * 🔴 REGRA DE HONESTIDADE DESTE ARQUIVO
 * Só se testa passo 🟢. Passo 🟡 e 🔴 entram como `test.fixme` — eles APARECEM
 * na saída, marcados como pendentes, em vez de sumirem. Um processo com 4
 * vermelhos e uma suíte toda verde seria mentira, e é exatamente o tipo de
 * falso conforto que este trabalho existe pra evitar.
 *
 * ⚠️ As telas ainda são MOCKUP (números de farol, sem backend). Então o que
 * estes testes provam é: "a tela oferece o caminho que o processo descreve".
 * Não provam que o dinheiro anda. Quando o backend existir, os asserts de
 * valor entram aqui — e é bom que eles falhem antes disso.
 * ═══════════════════════════════════════════════════════════════════════════
 */

test.describe("P4 · avulso na fatura", () => {
  // ── 🟢 P4.1 — a loja existe e mostra preço antes do clique ────────────────
  test("P4.1 · a loja de serviços lista o catálogo com preço aberto", async ({ page }) => {
    await page.goto("/mais/servicos");
    await expect(page.getByText("Certidão negativa (CND)").first()).toBeVisible();
    // a doutrina anti-dark-pattern manda o preço aparecer ANTES do toque
    await expect(page.getByText(/R\$\s?\d/).first()).toBeVisible();
  });

  // ── 🟢 P4.2 — o pedido pede dupla confirmação ─────────────────────────────
  test("P4.2 · pedir um serviço exige dupla confirmação", async ({ page }) => {
    await page.goto("/mais/servicos");
    await page.getByText("Certidão negativa (CND)").first().click();

    const pedir = page.getByRole("button", { name: /Solicitar serviço|Solicitar e pagar agora/ });
    await expect(pedir).toBeVisible();
    await pedir.click();

    // o segundo toque é o que torna o pedido irreversível (P4.8): tem que ser
    // deliberado, e tem que estar escrito na tela que é confirmação
    await expect(page.getByText(/Confirmar solicitação/)).toBeVisible();
  });

  // ── 🟢 P4.7 — o item aparece como linha da próxima fatura ─────────────────
  test("P4.7 · o avulso aparece como item da próxima fatura", async ({ page }) => {
    await page.goto("/mais/plano");
    await expect(page.getByText("Próxima fatura")).toBeVisible();
    await expect(page.getByText("Recálculo de guia de imposto")).toBeVisible();
    await expect(page.getByText("Total da próxima fatura")).toBeVisible();
  });

  // ── 🟢 P4.8 — em andamento, e sem como remover ────────────────────────────
  test("P4.8 · o item em andamento NÃO oferece remover", async ({ page }) => {
    await page.goto("/mais/plano");
    const linha = page.getByText("Certidão negativa (CND)").first();
    await expect(linha).toBeVisible();
    await expect(page.getByText(/Em andamento|Recalculando/).first()).toBeVisible();

    // a decisão de 27/07 é mostrar que é irreversível, não fingir carrinho:
    // um X que não remove seria pior que X nenhum
    await expect(page.getByRole("button", { name: /remover|excluir|cancelar item/i })).toHaveCount(0);
  });

  // ── 🟢 P4.2/P4.8 — a promessa da loja e a do billing têm que bater ────────
  test("P4.2↔P4.7 · a promessa 'cai na próxima fatura' é a mesma nas duas telas", async ({ page }) => {
    await page.goto("/mais/plano");
    await expect(page.getByText(/sem cobrança na hora/i)).toBeVisible();
    await expect(page.getByText(/cobrança confirmada/i)).toBeVisible();
  });

  // ══ os passos que o processo marca como NÃO RESOLVIDOS ═══════════════════
  // Aparecem como pendentes de propósito. Quando a decisão sair, troca-se
  // `fixme` por `test` e escreve-se o assert — e é a saída desta suíte que
  // mostra quanto do processo ainda não existe.

  test.fixme("P4.4 🔴 · aceite no ato para serviço acima de R$ 50", async () => {
    // Cláusula 6.3 da nossa minuta OBRIGA aceite específico no ato, com preço
    // exibido antes, para serviço acima de R$ 50. Nenhuma tela cobre isso.
  });

  test.fixme("P4.5 🟡 · o preço congela no pedido, não no fechamento", async () => {
    // Falta decidir se o reajuste que cair entre o pedido e o fechamento
    // altera o valor. O contrato manda exibir o preço antes, o que aponta
    // pro pedido — mas isso precisa ser dito, não deduzido.
  });

  test.fixme("P4.6 🔴 · pedido feito com a competência já fechada", async () => {
    // O buraco central do processo: o item vai pra competência seguinte ou
    // abre cobrança avulsa? Decisão do Pedro + Mauro.
  });

  test.fixme("P4.9 🔴 · serviço que não pôde ser entregue", async () => {
    // Certidão negada, órgão fora do ar. Estorna, vira crédito, ou cobra?
    // Não está no nosso contrato nem no do líder.
  });

  test.fixme("P4.10 🔴 · cancelar o plano com avulso em andamento", async () => {
    // A nossa minuta não trata. A do líder cobra tudo em aberto no aviso prévio.
  });

  test.fixme("P4.11 🟡 · em que dia a competência fecha", async () => {
    // Vencimento é dia 15 (cláusula 3.4). Fechamento é outra coisa, e o dia
    // é decisão nossa.
  });
});
