import { test, expect, type Page } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E2E — Constituição ME/Simples: do dossiê (C0) até a ativação (A5)
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro (01/09): passar o Playwright SÓ no flow de constituição de
 * ME, minuciosamente, validando **os campos que a auditoria 1-a-1 mapeou como
 * necessários** (fonte: os 141 prints da gravação real da JUCEMG + a ata da
 * reunião com a Izabela) e **os gates**.
 *
 * A spec irmã (`abrir-me-ate-conta.spec.ts`) já cobre entrada → E6 em 6
 * variáveis. Esta começa onde aquela termina: E7 (a conta) → E9 (pagamento) →
 * dossiê (C0…C7) → aprovação (A1…A5).
 *
 * ─── O que esta spec PROVA, além de "o fluxo anda" ─────────────────────────
 * 1. Cada dado que a JUCEMG/DBE exige tem campo, e é obrigatório quando o
 *    órgão obriga (CPF e endereço do sócio, nacionalidade do titular, IPTU).
 * 2. O que decidimos NÃO perguntar não voltou sozinho (nome da mãe, capital
 *    social, natureza jurídica/C6).
 * 3. Os gates funcionam: a trava de residência em apartamento (a regra que
 *    gerou indeferimento real na Prefeitura), o IPTU travando o Continuar, e
 *    a rota do C6 morta.
 * 4. A taxa da Junta mostrada é a real da guia (R$ 281,08), não a da tabela
 *    velha (R$ 268,51).
 *
 * ⚠️ Estado é MOCK (RF-01: dado pessoal não viaja por querystring). Cada tela
 * do dossiê é rota própria e se sustenta sozinha, então a spec navega direto
 * pra cada uma quando quer isolar um gate, e faz a travessia por CTA quando o
 * que importa é a ORDEM (que é o que prova que o C6 saiu do caminho).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CPF_SOCIO = "04522187630";
const CEP_SOCIO = "30310000";

/**
 * O `Select` do DS NÃO é `<select>` nativo: é um listbox custom (botão com
 * `aria-haspopup="listbox"` + `ul[role=listbox]`), e o `Campo` põe o rótulo
 * num `<p>`, não num `<label>`. Consequência prática: `selectOption` e
 * `getByLabel` não funcionam — a spec precisa dirigir o componente do jeito
 * que uma pessoa dirige (abrir, escolher). Ver o achado A11Y-01 no relatório
 * desta rodada: o botão não tem nome acessível ligado ao rótulo.
 */
async function selecionar(page: Page, rotulo: string, opcao: string | RegExp) {
  const campo = page.getByText(rotulo, { exact: true }).locator("xpath=..");
  await campo.getByRole("button").first().click();
  await page.getByRole("option", { name: opcao }).click();
}

/**
 * C1 exige RG + órgão + nascimento + nacionalidade + endereço pessoal
 * (+ estado civil no ME). O endereço chegou aqui em 01/09, vindo do E6.
 */
async function preencherC1(page: Page) {
  await page.getByPlaceholder("00.000.000").fill("MG-14.892.331");
  await page.getByPlaceholder("SSP/MG").fill("SSP/MG");
  await page.getByPlaceholder("DD/MM/AAAA").fill("14/03/1988");
  await page.getByPlaceholder("00000-000").fill("30140060");
  await page.getByPlaceholder("Nº").fill("500");
  await selecionar(page, "Estado civil", "Solteiro(a)");
}

test.describe("constituição ME — dossiê C0→C7", () => {
  test("C1 · pede a qualificação do art. 997 e NÃO pede nome da mãe", async ({ page }) => {
    await page.goto("/dossie/socio");
    await expect(page.getByText("Seus dados", { exact: true }).first()).toBeVisible();

    // ✅ o que o contrato social exige (art. 997 CC, print 117)
    await expect(page.getByText("RG", { exact: true })).toBeVisible();
    await expect(page.getByText("Órgão emissor", { exact: true })).toBeVisible();
    await expect(page.getByText("Data de nascimento", { exact: true })).toBeVisible();
    await expect(page.getByText("Nacionalidade", { exact: true })).toBeVisible();
    await expect(page.getByText("Estado civil", { exact: true })).toBeVisible();

    // 🆕 01/09 — nacionalidade nasce preenchida: quem é brasileiro não digita.
    await expect(page.getByPlaceholder("Brasileira")).toHaveValue("Brasileira");

    // 🗑️ 01/09 — removido: não existe em nenhum dos 141 prints.
    await expect(page.getByText("Nome da mãe")).toHaveCount(0);

    // 🆕 01/09 — endereço PESSOAL migrou do E6 pra cá, com rótulo que diz de
    // quem é (no cadastro ele vinha sem moldura, logo depois do endereço da
    // EMPRESA no E3.4, e ninguém sabia se era repetição).
    await expect(page.getByText("Onde você mora", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Seu endereço pessoal, não o da empresa.", { exact: false }),
    ).toBeVisible();
    // E some do card de confirmação, que dizia ter vindo do cadastro.
    await expect(page.getByText("Endereço", { exact: true })).toHaveCount(0);

    // Gate: CTA travado enquanto a qualificação não fecha.
    const cta = page.getByRole("button", { name: "Continuar" });
    await expect(cta).toBeDisabled();
    await preencherC1(page);
    await expect(cta).toBeEnabled();

    // Nacionalidade em branco trava de novo (é obrigatória, não decorativa).
    await page.getByPlaceholder("Brasileira").fill("");
    await expect(cta).toBeDisabled();
    await page.getByPlaceholder("Brasileira").fill("Portuguesa");
    await expect(cta).toBeEnabled();
  });

  test("C1 · regime de bens só aparece pra casado, e trava o CTA", async ({ page }) => {
    await page.goto("/dossie/socio");
    await preencherC1(page);
    const cta = page.getByRole("button", { name: "Continuar" });
    await expect(cta).toBeEnabled();

    await selecionar(page, "Estado civil", "Casado(a)");
    await expect(page.getByText("Regime de bens", { exact: true })).toBeVisible();
    await expect(cta).toBeDisabled();

    // 🔒 01/09 (decisão do Pedro): 4 regimes, sem a Separação Obrigatória.
    const campoRegime = page.getByText("Regime de bens", { exact: true }).locator("xpath=..");
    await campoRegime.getByRole("button").first().click();
    const opcoes = await page.getByRole("option").allTextContents();
    expect(opcoes).toHaveLength(4);
    expect(opcoes.join(" | ")).not.toMatch(/obrigat/i);

    await page.getByRole("option", { name: "Comunhão parcial de bens" }).click();
    await expect(cta).toBeEnabled();
  });

  test("C3 · sócio extra exige CPF e endereço (itens 1 e 2 da auditoria)", async ({ page }) => {
    await page.goto("/dossie/socios");
    await expect(page.getByText("Seu sócio", { exact: true })).toBeVisible();

    const cta = page.getByRole("button", { name: "Continuar" });
    const cpf = page.getByPlaceholder("000.000.000-00");
    const cep = page.getByPlaceholder("00000-000");

    // Os 2 campos novos existem e vêm preenchidos pelo mock de demo.
    await expect(page.getByText("CPF dele", { exact: true })).toBeVisible();
    await expect(page.getByText("CEP dele", { exact: true })).toBeVisible();
    await expect(cta).toBeEnabled();

    // Gate CPF: limpar trava o Continuar (é a CHAVE do sócio no QSA do DBE).
    await cpf.fill("");
    await expect(cta).toBeDisabled();

    // CPF incompleto acusa erro inline e segue travado.
    await cpf.fill("045221876");
    await expect(page.getByText("CPF incompleto.")).toBeVisible();
    await expect(cta).toBeDisabled();
    await cpf.fill(CPF_SOCIO);
    await expect(page.getByText("CPF incompleto.")).toHaveCount(0);
    await expect(cta).toBeEnabled();

    // Gate endereço: sem CEP não anda (qualificação do contrato, art. 997 CC).
    await cep.fill("");
    await expect(cta).toBeDisabled();
    await expect(page.getByPlaceholder("Nº")).toHaveCount(0);

    // CEP resolvido revela número e complemento (mesmo autofill do C4/E6).
    await cep.fill(CEP_SOCIO);
    await expect(page.getByPlaceholder("Nº")).toBeVisible();
    await expect(page.getByPlaceholder("Bloco, apto...")).toBeVisible();

    // Número é obrigatório; complemento não.
    await page.getByPlaceholder("Nº").fill("");
    await expect(cta).toBeDisabled();
    await page.getByPlaceholder("Nº").fill("412");
    await expect(cta).toBeEnabled();
    await page.getByPlaceholder("Bloco, apto...").fill("");
    await expect(cta).toBeEnabled();
  });

  test("C4 · IPTU obrigatório e a trava de apartamento (regra de indeferimento)", async ({
    page,
  }) => {
    await page.goto("/dossie/empresa");
    await expect(page.getByText("Os dados da empresa", { exact: true })).toBeVisible();

    const cta = page.getByRole("button", { name: "Continuar" });
    await page.getByPlaceholder("00000-000").fill("30140060");
    await page.getByPlaceholder("Nº").fill("1000");

    // Gate 1 — IPTU trava o Continuar (sem ele a Junta não aceita).
    await expect(page.getByText("Índice cadastral do IPTU", { exact: true })).toBeVisible();
    await expect(cta).toBeDisabled();
    await page.getByPlaceholder("000.000.000.000").fill("001234567890");

    // Gate 2 — tipo de imóvel e residência só existem no endereço PRÓPRIO:
    // coworking e endereço fiscal não têm a ambiguidade residencial.
    await expect(page.getByText("Esse endereço é casa ou apartamento?")).toHaveCount(0);
    await selecionar(page, "Como é esse endereço?", "Coworking");
    await expect(page.getByText("Esse endereço é casa ou apartamento?")).toHaveCount(0);

    await selecionar(page, "Como é esse endereço?", "Endereço próprio (casa ou ponto)");
    await expect(page.getByText("Esse endereço é casa ou apartamento?")).toBeVisible();
    // Gate 2b — a pergunta de residência vale pra DONO ÚNICO também (o bug de
    // 31/08: só renderizava com 2+ sócios, e é ela que decide o deferimento).
    await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();

    await selecionar(page, "Esse endereço é casa ou apartamento?", "Casa");
    await expect(page.getByText("Você mora nesse endereço?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Não", exact: true })).toBeVisible();

    // Gate 3 — apartamento TRAVA a resposta em "Sim": a Prefeitura de BH
    // indefere se o titular não reside no local (visto ao vivo na gravação).
    await selecionar(page, "Esse endereço é casa ou apartamento?", "Apartamento");
    await expect(page.getByText('Marcado como "Sim" automaticamente')).toBeVisible();
    await expect(page.getByRole("button", { name: "Não", exact: true })).toHaveCount(0);

    // 🔒 31/08 — capital social saiu da tela (travado em R$10.000 no backend).
    await expect(page.getByText(/capital social/i)).toHaveCount(0);
  });

  test("C4 · pra quem usa o endereço fiscal da Legalizai, a tela NÃO EXISTE", async ({ page }) => {
    // 🆕 01/09 — antes esta tela abria só pra "confirmar" uma escolha que a
    // pessoa já tinha feito no E3.4 e já tinha visto somada no preço (E7).
    await page.goto("/dossie/empresa?endereco=fiscal");
    await expect(page).toHaveURL(/\/dossie\/nome/);
  });

  test("C4 · MEI com endereço fiscal CONTINUA vendo a tela (forma de atuação)", async ({
    page,
  }) => {
    await page.goto("/dossie/empresa?endereco=fiscal&regime=mei");
    await expect(page).toHaveURL(/\/dossie\/empresa/);
    await expect(page.getByText("Como você atende?")).toBeVisible();
  });

  test("C3 → C7 direto quando o endereço é o nosso (o C4 nem é navegado)", async ({ page }) => {
    await page.goto("/dossie/socios?endereco=fiscal");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/dossie\/nome/);
  });
});

test.describe("constituição ME — carry-forward do endereço (E3.4 → C4)", () => {
  test("o que a pessoa respondeu no gate chega preenchido no C4", async ({ page }) => {
    // Percorre o gate de verdade: é ele quem grava o rascunho.
    await page.goto("/endereco");
    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Tecnologia e software" }).click();
    await page.getByRole("button", { name: "Tenho um endereço em Belo Horizonte" }).click();
    await page.getByPlaceholder("00000-000").fill("30140060");
    await page.getByPlaceholder("123").fill("1000");
    await page.getByPlaceholder("Complemento").fill("Sala 302");
    await selecionar(page, "Esse endereço é casa ou apartamento?", "Apartamento");
    await page.getByRole("button", { name: "Sim", exact: true }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/gate/);

    // Pula a travessia do dinheiro (mock) e vai direto pro C4, como o flow faz.
    await page.goto("/dossie/empresa");

    // 🔄 01/09 (decisão do Pedro) — o endereço que veio do gate aparece
    // TRAVADO, não editável: redigitar convidaria divergência entre o que foi
    // pra viabilidade e o que vai pro DBE.
    await expect(page.getByText("Endereço da empresa, informado no começo")).toBeVisible();
    await expect(page.getByText(/Rua dos Timbiras, 1000 · Sala 302/)).toBeVisible();
    await expect(page.getByText("🔒 travado")).toBeVisible();
    await expect(page.getByPlaceholder("00000-000")).toHaveCount(0);
    await expect(page.getByPlaceholder("Bloco, sala...")).toHaveCount(0);

    // E o upsell do endereço fiscal não existe mais nesta tela.
    await expect(page.getByText(/Quero um endereço fiscal da Legalizai/)).toHaveCount(0);

    // 🆕 01/09 — a resposta sobre o imóvel também atravessa, e vira CONFIRMAÇÃO
    // read-only: quem já respondeu não responde de novo depois de pagar.
    await expect(page.getByText("Sobre o imóvel, você já respondeu")).toBeVisible();
    await expect(page.getByText(/Apartamento · você mora nele/)).toBeVisible();
    await expect(page.getByText("Esse endereço é casa ou apartamento?")).toHaveCount(0);

    // E o que ainda falta continua faltando: o IPTU trava o CTA.
    await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  test("apartamento sem residência oferece a saída ANTES do pagamento", async ({ page }) => {
    await page.goto("/endereco");
    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Tecnologia e software" }).click();
    await page.getByRole("button", { name: "Tenho um endereço em Belo Horizonte" }).click();
    await page.getByPlaceholder("00000-000").fill("30140060");
    await page.getByPlaceholder("123").fill("1000");
    await selecionar(page, "Esse endereço é casa ou apartamento?", "Apartamento");
    await page.getByRole("button", { name: "Não", exact: true }).click();

    // 🔴 Este era o buraco: no C4 (pós-pagamento) o app travava a resposta em
    // "Sim" e não havia caminho honesto pra quem não mora no imóvel.
    await expect(page.getByText("Apartamento só serve se você morar nele")).toBeVisible();
    // `\s` (e não espaço literal): `toLocaleString` põe NBSP depois do "R$".
    await expect(page.getByText(/endereço da Legalizai por R\$\s*60/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();

    // Trocar pro nosso endereço destrava, e o custo já aparece antes de pagar.
    await page.getByRole("button", { name: /Quero um endereço da Legalizai/ }).click();
    await expect(page.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });

  test("casa não trava: pode dizer que NÃO mora no endereço da empresa", async ({ page }) => {
    await page.goto("/endereco");
    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Tecnologia e software" }).click();
    await page.getByRole("button", { name: "Tenho um endereço em Belo Horizonte" }).click();
    await page.getByPlaceholder("00000-000").fill("30140060");
    await page.getByPlaceholder("123").fill("1000");
    await selecionar(page, "Esse endereço é casa ou apartamento?", "Casa");
    await page.getByRole("button", { name: "Não", exact: true }).click();
    await expect(page.getByText("Apartamento só serve se você morar nele")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });

  test("trocar pro endereço fiscal apaga o rascunho do endereço próprio", async ({ page }) => {
    await page.goto("/endereco");
    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Tecnologia e software" }).click();
    await page.getByRole("button", { name: "Tenho um endereço em Belo Horizonte" }).click();
    await page.getByPlaceholder("00000-000").fill("30140060");
    await page.getByPlaceholder("123").fill("1000");
    await selecionar(page, "Esse endereço é casa ou apartamento?", "Casa");
    await page.getByRole("button", { name: "Sim", exact: true }).click();
    await page.getByRole("button", { name: "Continuar" }).click();

    // Volta e troca pra "usar o endereço da Legalizai".
    await page.goto("/endereco");
    await page.getByRole("button", { name: "Escolhe uma categoria" }).click();
    await page.getByRole("option", { name: "Tecnologia e software" }).click();
    await page.getByRole("button", { name: /Quero um endereço da Legalizai/ }).click();
    await page.getByRole("button", { name: "Continuar" }).click();

    // Um endereço velho não pode reaparecer numa tela de outro caminho.
    await page.goto("/dossie/empresa");
    await expect(page.getByPlaceholder("00000-000")).toHaveValue("");
  });
});

test.describe("constituição ME — gates de rota e ordem", () => {
  test("C6 (natureza jurídica) está morta: rota não existe mais", async ({ page }) => {
    const resposta = await page.goto("/dossie/natureza");
    expect(resposta?.status()).toBe(404);
  });

  test("ordem do dossiê pula o C6: C4 → C7 direto", async ({ page }) => {
    await page.goto("/dossie/empresa");
    await page.getByPlaceholder("00000-000").fill("30140060");
    await page.getByPlaceholder("Nº").fill("1000");
    await page.getByPlaceholder("000.000.000.000").fill("001234567890");
    await selecionar(page, "Como é esse endereço?", "Endereço próprio (casa ou ponto)");
    await selecionar(page, "Esse endereço é casa ou apartamento?", "Casa");
    await page.getByRole("button", { name: "Sim", exact: true }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/dossie\/nome/);
  });

  test("C7 → A1: 3 opções de razão social, objeto social e fantasia opcional", async ({ page }) => {
    await page.goto("/dossie/nome");
    // 3 sugestões da IA, cada uma com lápis de edição (24/08).
    await expect(page.getByRole("button", { name: /Editar sugestão/ })).toHaveCount(3);
    await expect(page.getByText("Objeto social", { exact: true })).toBeVisible();
    await expect(page.getByText("Nome fantasia", { exact: true })).toBeVisible();
    await expect(page.getByText("Opcional. É a marca que aparece pro cliente.")).toBeVisible();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/revisar/);
  });
});

test.describe("constituição ME — aprovação A1→A5", () => {
  test("A1 · recap + aceite na MESMA tela, com o CTA travado até marcar", async ({ page }) => {
    await page.goto("/revisar");
    // Os 3 blocos do recap: quem é, qual empresa, o que ela faz.
    await expect(page.getByText("Você", { exact: true })).toBeVisible();
    await expect(page.getByText("Nome", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("CPF", { exact: true }).first()).toBeVisible();

    // 🆕 01/09 — o aceite que era a tela A2 inteira vive aqui, no fim.
    const cta = page.getByRole("button", { name: "Autorizo, pode abrir" });
    await expect(cta).toBeDisabled();
    await page.getByText(/Autorizo o início da abertura/).click();
    await expect(cta).toBeEnabled();

    await cta.click();
    await expect(page).toHaveURL(/\/aguardando\?fase=junta/);
  });

  test("A1 · 'não é reembolsável' abre popup e NÃO marca o aceite sem querer", async ({ page }) => {
    await page.goto("/revisar");
    const cta = page.getByRole("button", { name: "Autorizo, pode abrir" });

    await page.getByRole("button", { name: "não é reembolsável" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Por que a taxa da Junta não volta")).toBeVisible();
    // O link vive DENTRO do label do checkbox: clicar nele não pode autorizar.
    await expect(cta).toBeDisabled();

    await page.getByRole("button", { name: "Entendi" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(cta).toBeDisabled();
  });

  test("A2 · a tela do termo não existe mais", async ({ page }) => {
    const resposta = await page.goto("/termo");
    expect(resposta?.status()).toBe(404);
  });

  test("A3 · fusão A3+E9: /painel (ME) redireciona pra tela de status única", async ({ page }) => {
    await page.goto("/painel");
    await expect(page).toHaveURL(/\/aguardando\?fase=junta/);

    // A jornada única: passos do dossiê + os 3 da Junta, na MESMA lista.
    await expect(page.getByText("Analisando viabilidade")).toBeVisible();
    await expect(page.getByText("Pague a guia da Junta (DAE)")).toBeVisible();
    await expect(page.getByText("Agora é só assinar")).toBeVisible();

    // A DAE é ação do cliente e tem CTA próprio (26/08: sai do checkout).
    await expect(page.getByRole("button", { name: "Pagar a guia agora" })).toBeVisible();
  });

  test("A3.2 · gate de certificado NÃO existe mais no caminho ME", async ({ page }) => {
    // 🗑️ 01/09 (decisão do Pedro) — o certificado é incluso no plano e emitido
    // pela Legalizai; e a justificativa original ("a procuração exige
    // certificado validado") era impossível: certificado é e-CNPJ e o CNPJ
    // ainda não existe neste ponto.
    await page.goto("/aguardando?fase=junta");
    await page.getByRole("button", { name: "Pagar a guia agora" }).click();
    await expect(page).toHaveURL(/\/assinatura/);
    await expect(page).not.toHaveURL(/\/certificado/);
  });

  test("A3.2 · a tela segue viva pro MEI, onde a empresa já existe", async ({ page }) => {
    await page.goto("/certificado?regime=mei");
    await expect(page.getByText("Você já tem certificado digital (e-CNPJ)?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Já tenho certificado" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Não tenho, preciso de um" })).toBeVisible();
    // No MEI o certificado NÃO vem incluso — a tela precisa dizer isso.
    await expect(page.getByText("O certificado não vem no plano MEI")).toBeVisible();
  });

  test("A5 · trilha diz que o certificado é por nossa conta, não tarefa do cliente", async ({
    page,
  }) => {
    // A home dia-1 vive no shell do PORTAL, que é a rota mais pesada do app
    // (dashboard inteiro). No `next dev` ela compila sob demanda e estoura os
    // 30s padrão na primeira visita — daí o `slow` (triplica o limite).
    test.slow();
    await page.goto("/home-dia1");
    await expect(page.getByText("Certificado digital por nossa conta")).toBeVisible();
    await expect(page.getByText(/você já resolveu isso antes de assinar/i)).toHaveCount(0);
  });

  test("A4 · consenso multi-sócio usa o MESMO nome do dossiê (fonte única)", async ({ page }) => {
    await page.goto("/assinatura");
    await expect(page.getByText(/GOV\.BR/).first()).toBeVisible();

    // 🐛→🔒 01/09 — o mock local desta tela chamava o 2º sócio de "Bruno
    // Costa"; o dossiê inteiro chama de "Carlos Eduardo Silva". Este assert
    // existe pra impedir que um 2º mock volte a divergir da fonte única.
    await expect(page.getByText("Carlos Eduardo Silva")).toBeVisible();
    await expect(page.getByText("Bruno")).toHaveCount(0);

    // Com sociedade, o CTA convida o sócio (ninguém assina pelo outro, UX-44).
    await expect(
      page.getByRole("button", { name: /Enviar convite pro Carlos/ }),
    ).toBeEnabled();
  });
});

test.describe("constituição ME — E5 faixa e E6 conta", () => {
  test("E5 · faixas terminam no teto do ME (R$30 mil/mês), sem '+30k'", async ({ page }) => {
    await page.goto("/gate?etapa=faixa");
    for (const faixa of ["Não sei ainda", "R$ 5 a 10 mil", "R$ 10 a 20 mil", "R$ 20 a 30 mil"]) {
      await expect(page.getByRole("button", { name: faixa })).toBeVisible();
    }
    // 🔄 01/09 — a faixa "+ R$ 30 mil" saiu: acima disso é EPP, fora do escopo,
    // e a gente decidiu não barrar por faturamento (acompanha e propõe depois).
    await expect(page.getByRole("button", { name: /\+ R\$ 30 mil/ })).toHaveCount(0);
  });

  test("E5 · o gate do MEI acompanhou a grade nova", async ({ page }) => {
    await page.goto("/gate?etapa=faixa&regime=mei");
    // Teto do MEI (R$6.750) cai DENTRO de "R$ 5 a 10 mil": avisa, não bloqueia.
    await page.getByRole("button", { name: "R$ 5 a 10 mil" }).click();
    await expect(page.getByText("Fica de olho no teto do MEI")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuar" })).toBeEnabled();

    // Faixa acima do teto: bloqueia e oferece o ME, sem beco.
    await page.getByRole("button", { name: "R$ 20 a 30 mil" }).click();
    await expect(page.getByText("Com esse faturamento, o MEI não serve")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuar como ME" })).toBeVisible();
  });

  test("E6 · sem login social, e o código tem 8 dígitos", async ({ page }) => {
    await page.goto("/conta");
    // 🗑️ 01/09 — Google/Apple saíram: não teremos por enquanto.
    await expect(page.getByText("Google")).toHaveCount(0);
    await expect(page.getByText("Apple")).toHaveCount(0);
    await expect(page.getByText(/ou crie com|ou com e-mail/)).toHaveCount(0);

    // Placeholders do layout "painel", que é o de produção em `/conta`.
    await page.getByPlaceholder("Nome completo").fill("Ana Beatriz Ramos");
    await page.getByPlaceholder("CPF").fill("12345678900");
    await page.getByPlaceholder("Telefone").fill("31988887766");
    await page.getByPlaceholder("E-mail").fill("ana@email.com");
    await page.getByPlaceholder("Senha (mín. 8 caracteres)").fill("Legalizai2026");
    await page.getByPlaceholder("Confirmar senha").fill("Legalizai2026");
    await page.getByRole("button", { name: "Criar conta e ver plano" }).click();

    // 🔄 01/09 — era 6; agora são 8, e os 4 lugares que citam o número batem.
    await expect(page.getByText(/código de 8 dígitos/)).toBeVisible();
    const campo = page.getByPlaceholder("00000000");
    await expect(campo).toBeVisible();
    const cta = page.getByRole("button", { name: "Confirmar" });
    await campo.fill("482913");
    await expect(cta).toBeDisabled();
    await campo.fill("48291374");
    await expect(cta).toBeEnabled();
  });
});

test.describe("constituição ME — dinheiro", () => {
  test("E7 mostra a taxa REAL da guia (R$ 281,08), não a da tabela velha", async ({ page }) => {
    await page.goto("/plano");
    await expect(page.getByText("Taxa da Junta Comercial")).toBeVisible();
    await expect(page.getByText("R$ 281,08")).toBeVisible();
    await expect(page.getByText("R$ 268,51")).toHaveCount(0);
  });
});
