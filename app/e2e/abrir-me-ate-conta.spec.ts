import { test, expect, type Page } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E2E — Abrir empresa (ME) até a E6 · Criar conta, TODAS as variáveis
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro: não é só "completou o fluxo", é achar inconsistência —
 * então cada tela ganha asserts do que já foi TRAVADO em sessão (copy exata,
 * rótulo do voltar, obrigatoriedade, ordem visual dos cards), e o flow inteiro
 * é testado em TODAS as variáveis do caminho abrir→ME até a E6:
 *
 *   1. Categoria normal · endereço próprio em BH (cenário base)
 *   2. Categoria normal · endereço fiscal da Legalizai (sem CEP)
 *   3. Categoria normal · CEP fora de BH → entra na fila da cidade
 *   4. Categoria normal · CEP fora de BH → troca pra endereço Legalizai
 *   5. "Não encontrei minha categoria" · atividade da lista · CEP é de BH
 *   6. "Não encontrei minha categoria" · "É outra atividade" (texto livre) ·
 *      CEP fora de BH
 *
 * CEP "fora de BH" usa 39560000 (Salinas-MG), já reservado no mock de CEP
 * pra teste (`buscarCep`, `wizard-dinheiro.tsx`) — qualquer outro CEP de 8
 * dígitos cai no mock genérico de BH.
 *
 * ⚠️ Fora de escopo aqui, de propósito: ramo MEI (regime diferente, mereceria
 * o próprio arquivo) e o gate de teto do MEI (não existe no ME).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CEP_BH = "30140060";
const CEP_FORA_BH = "39560000"; // Salinas-MG, reservado no mock pra teste

/** E3 (fork) → E3.1 (dados) → E3.2 (MEI×ME, escolhe ME) → cai na E3.4. */
async function chegarNoEndereco(page: Page) {
  await page.goto("/entrada");
  await page.getByText("Quero abrir minha empresa", { exact: true }).click();
  await expect(page).toHaveURL(/\/dados/);

  await page.getByPlaceholder("Primeiro nome").fill("Ana");
  await page.getByPlaceholder("Sobrenome").fill("Ramos");
  await page.getByPlaceholder("voce@email.com.br").fill("ana.ramos@email.com");
  await page.getByPlaceholder("(31) 90000-0000").fill("31999990000");
  await page.getByRole("button", { name: "Concordo, continuar" }).click();
  await expect(page).toHaveURL(/\/entrada\?intencao=abrir/);

  await page.getByRole("button", { name: /^ME$/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(/\/endereco/);
}

/** Da E5T (triagem) até a E6 (conta) — igual em todos os cenários. */
async function terminarAteConta(page: Page) {
  await expect(page.getByText("Sobre sua empresa", { exact: true })).toBeVisible();
  const ctaTriagem = page.getByRole("button", {
    name: /^(Continuar|Me inscrever e garantir condição)$/,
  });
  // Sócios já vem pré-selecionado ("Só eu"); coorte é obrigatória.
  await expect(ctaTriagem).toBeDisabled();
  await page.getByRole("button", { name: "É a primeira" }).click();
  await expect(ctaTriagem).toBeEnabled();
  await ctaTriagem.click();

  await expect(page.getByText("Perguntas rápidas", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "R$ 10 a 20 mil" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page).toHaveURL(/\/conta/);
  await expect(
    page.getByRole("button", { name: "Criar conta e ver plano" }),
  ).toBeVisible();
}

test.describe("abrir ME — todas as variáveis até a E6", () => {
  test("1. categoria normal + endereço próprio em BH", async ({ page }) => {
    await chegarNoEndereco(page);

    await expect(page.getByText("Enquadramento", { exact: true })).toBeVisible();
    await expect(page.getByText("Duas perguntas rápidas", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Tecnologia e software" }).click();

    // Ordem travada: Legalizai ANTES (mais acima) do card "Tenho endereço BH".
    const cardLegalizai = page.getByRole("button", { name: /Quero um endereço da Legalizai/ });
    const cardBH = page.getByRole("button", { name: "Tenho um endereço em Belo Horizonte" });
    const boxLegalizai = await cardLegalizai.boundingBox();
    const boxBH = await cardBH.boundingBox();
    expect(boxLegalizai!.y).toBeLessThan(boxBH!.y);

    await expect(page.getByText("A prefeitura confirma na viabilidade")).toHaveCount(0);

    await cardBH.click();
    await page.getByPlaceholder("00000-000").fill(CEP_BH);
    await page.getByPlaceholder("123").fill("100");
    await expect(page.getByPlaceholder("Complemento")).toBeVisible();
    // Endereço de verdade (BH) tem que aparecer, confirmando que o CEP resolveu.
    await expect(page.getByText("Belo Horizonte · MG", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/gate/);

    await terminarAteConta(page);
  });

  test("2. categoria normal + endereço fiscal da Legalizai (sem CEP)", async ({ page }) => {
    await chegarNoEndereco(page);

    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Design" }).click();

    await page.getByRole("button", { name: /Quero um endereço da Legalizai/ }).click();
    // Reforço da cobrança recorrente, no estilo card amigável (não o alerta
    // laranja antigo).
    await expect(
      page.getByText("Essa será uma cobrança recorrente junto da sua mensalidade"),
    ).toBeVisible();
    // Sem endereço próprio escolhido, não pede CEP nenhum.
    await expect(page.getByPlaceholder("00000-000")).toHaveCount(0);

    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/gate/);

    await terminarAteConta(page);
  });

  test("3. categoria normal + CEP fora de BH → entra na fila da cidade", async ({ page }) => {
    await chegarNoEndereco(page);

    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Consultoria, pesquisa e tradução" }).click();

    await page.getByRole("button", { name: "Tenho um endereço em Belo Horizonte" }).click();
    await page.getByPlaceholder("00000-000").fill(CEP_FORA_BH);

    await expect(page.getByText("Ainda não chegamos na sua cidade")).toBeVisible();
    const ctaAntes = page.getByRole("button", { name: "Continuar" });
    await expect(ctaAntes).toBeVisible();

    await page.getByRole("button", { name: "Quero abrir na minha cidade mesmo assim" }).click();
    await expect(page.getByText("Falta só confirmar aqui embaixo")).toBeVisible();

    // CTA muda de rótulo assim que entra em "modo espera".
    const ctaFila = page.getByRole("button", { name: "Me inscrever e garantir condição" });
    await expect(ctaFila).toBeVisible();
    await ctaFila.click();
    await expect(page).toHaveURL(/\/gate/);

    await terminarAteConta(page);
  });

  test("4. categoria normal + CEP fora de BH → troca pra endereço Legalizai", async ({ page }) => {
    await chegarNoEndereco(page);

    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Ensino e cursos" }).click();

    await page.getByRole("button", { name: "Tenho um endereço em Belo Horizonte" }).click();
    await page.getByPlaceholder("00000-000").fill(CEP_FORA_BH);
    await expect(page.getByText("Ainda não chegamos na sua cidade")).toBeVisible();

    // Em vez de entrar na fila, troca pro endereço fiscal — a mensagem indica
    // exatamente esse card, que precisa continuar existindo com esse nome.
    await page.getByRole("button", { name: /Quero um endereço da Legalizai/ }).click();
    await expect(page.getByText("Ainda não chegamos na sua cidade")).toHaveCount(0);
    await expect(
      page.getByText("Essa será uma cobrança recorrente junto da sua mensalidade"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/gate/);

    await terminarAteConta(page);
  });

  test("5. não encontrei minha categoria + atividade da lista + CEP é de BH", async ({ page }) => {
    await chegarNoEndereco(page);

    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Não encontrei minha categoria" }).click();

    // A partir daqui a tela simplifica: CEP some da seção de endereço normal e
    // entra junto do bloco de categoria (mudança pedida pelo Pedro, 29/08).
    await page.getByRole("button", { name: "Qual é a sua atividade?" }).click();
    await page.getByRole("option", { name: "Engenharia" }).click();

    await page.getByPlaceholder("00000-000").fill(CEP_BH);
    await expect(page.getByText("Ainda não atendemos essa categoria")).toBeVisible();
    await expect(page.getByText("Ainda não atendemos sua categoria e cidade")).toHaveCount(0);
    await expect(page.getByText("Te avisaremos!")).toBeVisible();

    const cta = page.getByRole("button", { name: "Me inscrever e garantir condição" });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/gate/);

    await terminarAteConta(page);
  });

  test("6. não encontrei minha categoria + \"É outra atividade\" (texto livre) + CEP fora de BH", async ({
    page,
  }) => {
    await chegarNoEndereco(page);

    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Não encontrei minha categoria" }).click();

    await page.getByRole("button", { name: "Qual é a sua atividade?" }).click();
    await page.getByRole("option", { name: "É outra atividade" }).click();

    // Campo de texto livre só aparece depois de escolher "É outra atividade".
    const campoLivre = page.getByPlaceholder("Descreve com suas palavras");
    await expect(campoLivre).toBeVisible();
    await campoLivre.fill("Conserto instrumentos musicais");

    await page.getByPlaceholder("00000-000").fill(CEP_FORA_BH);
    await expect(page.getByText("Ainda não atendemos sua categoria e cidade")).toBeVisible();

    await page.getByRole("button", { name: "Me inscrever e garantir condição" }).click();
    await expect(page).toHaveURL(/\/gate/);

    await terminarAteConta(page);
  });
});
