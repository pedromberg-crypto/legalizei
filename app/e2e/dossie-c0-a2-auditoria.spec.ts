import { test, expect, type Page } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E2E — auditoria travada do dossiê: C0.0 → A2 (caminho ABRIR/ME)
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu da auditoria pedida pelo Pedro em 04/09, antes de liberar mais uma
 * leva de telas pro dev. A varredura rodou como script solto e achou 6 bugs;
 * virou spec pra que os 6 não voltem em silêncio — que é como eles chegaram
 * (o furo do voltar, por exemplo, é o mesmo desde 29/08, na 5ª tela diferente).
 *
 * ─── O QUE ESTA SPEC PROVA ─────────────────────────────────────────────────
 * 1. Toda tela do trecho tem saída (seta de voltar), e o `meta` dela nomeia o
 *    DESTINO, nunca a própria tela (regra 6 do CLAUDE.md).
 * 2. Nenhuma tela loga aviso do `TelaHeader` nem erro de console.
 * 3. Os gates travam e destravam pelo motivo certo, e o CTA DIZ o que falta em
 *    vez de ficar apagado e mudo.
 * 4. Os estados dinâmicos que a auditoria pegou quebrados seguem de pé:
 *    o card do sócio novo abre, o resumo da administração não responde pela
 *    pessoa, e o subtítulo da C7 não promete edição que não existe.
 * 5. Nada estoura a largura do iPhone SE (375px), que é onde o layout aperta.
 *
 * ⚠️ Estado é MOCK (RF-01). Cada tela é rota própria e se sustenta sozinha,
 * então a spec navega direto pra isolar cada regra.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** As telas do trecho, com o destino que o `meta` do cabeçalho deve nomear. */
const TELAS: { id: string; rota: string; meta?: string; semVoltar?: true }[] = [
  { id: "C0.0", rota: "/dossie/atividade?vazia=1", meta: "Status" },
  { id: "C0", rota: "/dossie/atividade", meta: "Sua atividade" },
  { id: "C5", rota: "/dossie/cnae-secundarios", meta: "Sua atividade" },
  // Splash: some sozinho, não é passo com volta.
  { id: "C5.S", rota: "/splash-atividades", semVoltar: true },
  { id: "C1", rota: "/dossie/socio", meta: "Atividades secundárias" },
  { id: "C2", rota: "/dossie/vinculo", meta: "Seus dados pessoais" },
  { id: "C3", rota: "/dossie/socios", meta: "Vínculo com o INSS" },
  { id: "C3.1", rota: "/dossie/socios?socios=4", meta: "Vínculo com o INSS" },
  { id: "C3.2", rota: "/dossie/socios?socios=1", meta: "Vínculo com o INSS" },
  { id: "C4", rota: "/dossie/empresa", meta: "Sócios" },
  { id: "C7", rota: "/dossie/nome", meta: "Dados do dossiê" },
  { id: "C7'", rota: "/dossie/nome/rodada-2", meta: "O que a Junta pediu" },
  { id: "A1", rota: "/revisar", meta: "Nome da empresa" },
  { id: "A1 fiscal", rota: "/revisar?endereco=fiscal", meta: "Nome da empresa" },
  // A2 é o ponto sem volta: não ter saída é a decisão, não o furo.
  { id: "A2", rota: "/iniciar-viabilidade", semVoltar: true },
];

const cta = (page: Page) => page.locator("div.app-footer-cta button").last();

/** Coleta avisos/erros de console pra provar que o guarda-corpo está calado. */
function vigiaConsole(page: Page) {
  const achados: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") achados.push(`error: ${m.text()}`);
    if (m.type() === "warning" && m.text().includes("[TelaHeader]")) achados.push(m.text());
  });
  page.on("pageerror", (e) => achados.push(`pageerror: ${String(e)}`));
  return achados;
}

test.describe("estrutura de todas as telas do trecho", () => {
  for (const tela of TELAS) {
    test(`${tela.id} tem saída, cabeçalho honesto e não estoura a tela`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const console_ = vigiaConsole(page);
      await page.goto(tela.rota);
      await page.waitForLoadState("networkidle");

      // 1 · saída
      const voltar = page.locator('[aria-label="Voltar"]');
      if (tela.semVoltar) {
        expect(await voltar.count()).toBe(0);
      } else {
        await expect(voltar).toHaveCount(1);
        // 2 · o `meta` nomeia o DESTINO, não a própria tela
        await expect(page.locator("header p").first()).toHaveText(tela.meta!);
      }

      // 3 · nada estoura a largura no aparelho mais estreito
      const estouro = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        return [...document.querySelectorAll("*")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > vw + 1 && r.height > 0;
        }).length;
      });
      expect(estouro, "elementos mais largos que a viewport").toBe(0);

      // 4 · console limpo (o aviso do TelaHeader é o guarda-corpo da regra 6)
      expect(console_, "avisos/erros de console").toEqual([]);
    });
  }
});

test.describe("gates: travam e DIZEM o que falta", () => {
  test("A1 · o CTA conta a conferência e só abre com as 4 seções", async ({ page }) => {
    await page.goto("/revisar");
    await expect(cta(page)).toHaveText("0 de 4 seções");
    await expect(cta(page)).toBeDisabled();

    const conferir = page.getByRole("button", { name: "Conferi", exact: true });
    const total = await conferir.count();
    expect(total).toBe(4);
    for (let i = 1; i <= total; i++) {
      await page.getByRole("button", { name: "Conferi", exact: true }).first().click();
      if (i < total) await expect(cta(page)).toHaveText(`${i} de 4 seções`);
    }
    await expect(cta(page)).toHaveText("Tudo certo, seguir");
    await expect(cta(page)).toBeEnabled();

    // desfazer uma seção volta a travar: o gate não é decorativo
    await page.getByRole("button", { name: "Conferido", exact: true }).first().click();
    await expect(cta(page)).toHaveText("3 de 4 seções");
    await expect(cta(page)).toBeDisabled();
  });

  test("A1 · 'Ajustar' entra no modo ajuste da seção certa", async ({ page }) => {
    await page.goto("/revisar");
    await page.getByRole("button", { name: /Ajustar Atividades/ }).click();
    await expect(page).toHaveURL(/\/dossie\/atividade\?ajuste=2/);
  });

  test("C0.0 · sem categoria, o CTA DIZ o que falta (não fica mudo)", async ({ page }) => {
    await page.goto("/dossie/atividade?vazia=1");
    await expect(cta(page)).toHaveText("Escolha uma categoria");
    await expect(cta(page)).toBeDisabled();
    // escrever a descrição não basta: a categoria é o que a busca exige
    await page.locator("main textarea").first().fill("faço sites para clientes");
    await expect(cta(page)).toBeDisabled();
  });

  test("C4 · o IPTU trava o Continuar, e a tela tem só esse campo", async ({ page }) => {
    await page.goto("/dossie/empresa");
    await expect(cta(page)).toBeDisabled();
    await expect(page.locator("main input")).toHaveCount(1);
    await page.locator("main input").first().fill("001234567890");
    await expect(cta(page)).toBeEnabled();
  });

  test("C7 · sem razão social não passa", async ({ page }) => {
    await page.goto("/dossie/nome");
    await expect(cta(page)).toBeEnabled();
    await page.locator("main textarea").first().fill("");
    await expect(cta(page)).toBeDisabled();
  });

  test("C5 · o CTA nomeia o que vai acontecer", async ({ page }) => {
    await page.goto("/dossie/cnae-secundarios");
    await expect(cta(page)).toHaveText("Continuar sem secundárias");
    const cards = page.locator("main button").filter({ hasText: "CNAE" });
    await cards.nth(1).click();
    await expect(cta(page)).toHaveText("Incluir 1 atividade secundária");
    await cards.nth(2).click();
    await expect(cta(page)).toHaveText("Incluir 2 atividades secundárias");
  });

  test("C5 · a busca SUBSTITUI a curadoria e aceita o número do CNAE", async ({ page }) => {
    await page.goto("/dossie/cnae-secundarios");
    /* 🔄 04/09 — o rótulo da lista virou a pergunta da tela; quem descreve a
       origem só aparece na busca. Por isso o teste passou a ancorar em
       "Resultados da busca", que é o rótulo que só existe buscando. */
    await expect(page.getByText("Resultados da busca")).toBeHidden();

    const campo = page.locator("div.app-footer-cta input").first();
    // 🐛 04/09: resultados e sugestões apareciam JUNTOS, e com nomes parecidos
    // ("Consultoria em gestão" × "Consultoria em tecnologia") lia como lista
    // duplicada. Um termo, uma lista.
    await campo.fill("consultoria");
    await expect(page.getByText("Resultados da busca")).toBeVisible();
    // a curadoria some: um termo, uma lista
    await expect(page.getByText("Comum como secundário de quem faz site.")).toBeHidden();

    // 🆕 04/09: busca pelo código, nos 3 formatos que a pessoa pode digitar.
    for (const termo of ["6202-3/00", "6202300", "6202"]) {
      await campo.fill(termo);
      /* `.first()` de propósito: a curadoria continua no DOM, só escondida
         (`hidden`), então o mesmo nome existe duas vezes — o que importa é o
         resultado da busca estar VISÍVEL. */
      await expect(
        page
          .getByText("Desenvolvimento e licenciamento de programas de computador customizáveis")
          .first(),
      ).toBeVisible();
    }

    // apagar devolve a curadoria
    await campo.fill("");
    await expect(page.getByText("Resultados da busca")).toBeHidden();
  });

  test("C3.1 · no teto some o adicionar e o aviso aponta quem falta", async ({ page }) => {
    await page.goto("/dossie/socios?socios=4");
    await expect(page.getByRole("button", { name: /Adicionar sócio/ })).toHaveCount(0);
    await expect(page.getByText(/limite de 3 sócios além de você/)).toBeVisible();
    /* 🔄 04/09 — o aviso "Falta preencher os dados de X" saiu do rodapé: quem
       conta agora é o próprio CTA, e quem identifica é a pill "Incompleto" no
       cartão de cada sócio. */
    await expect(cta(page)).toHaveText("Faltam 3 sócios");
    await expect(cta(page)).toBeDisabled();
    await expect(page.getByText("Incompleto").first()).toBeVisible();
  });
});

test.describe("C3 · a lista de sócios é editável", () => {
  test("adicionar abre o card novo (senão a pessoa não acha onde digitar)", async ({ page }) => {
    await page.goto("/dossie/socios");
    expect(await page.locator('main button[aria-expanded="true"]').count()).toBe(0);
    await page.getByRole("button", { name: /Adicionar sócio/ }).click();
    // 🐛 04/09: nascia fechado — `setSocioAberto` morava dentro do updater do
    // `setExtras`, que precisa ser puro. É o que este teste segura.
    await expect(page.locator('main button[aria-expanded="true"]')).toHaveCount(1);
  });

  test("remover todos leva ao estado 'só você', com volta e CTA próprio", async ({ page }) => {
    await page.goto("/dossie/socios");
    await page.locator("main button[aria-expanded]").first().click();
    await page.getByRole("button", { name: /^Remover/ }).first().click();
    await expect(page.getByRole("heading", { name: "Empresa só sua" })).toBeVisible();
    await expect(cta(page)).toHaveText("Abrir só no meu nome");
    await expect(cta(page)).toBeEnabled();
    // o caminho de volta existe: remover o último não pode virar beco
    await expect(page.getByRole("button", { name: /Vou ter sócio, sim/ })).toBeVisible();
  });

  test("o resumo da administração não responde pela pessoa", async ({ page }) => {
    await page.goto("/dossie/socios");
    // 🐛 04/09: afirmava "Só você administra" antes de a pergunta ser
    // respondida — default virando resposta, que é o que o contrato não pode.
    await expect(page.getByText(/Ainda não definido/)).toBeVisible();
  });

  test("quem administra é obrigatório: nasce sem resposta e trava o CTA", async ({ page }) => {
    await page.goto("/dossie/socios");
    // 🐛 04/09: o gate tinha um curto-circuito que dispensava a resposta com
    // 2+ sócios, e a opção "Não" nascia acesa — default virando dado do DBE.
    await page.locator("main button[aria-expanded]").first().click();
    expect(
      await page.locator('main button[aria-pressed="true"]').count(),
      "nenhuma opção pode nascer marcada",
    ).toBe(0);
    await expect(cta(page)).toBeDisabled();
    await expect(page.getByText(/Ainda não definido/)).toBeVisible();

    await page.getByRole("button", { name: "Não", exact: true }).first().click();
    await expect(page.getByText("Só você administra.")).toBeVisible();
  });
});

test.describe("acessibilidade", () => {
  test("todo campo do trecho tem NOME acessível", async ({ page }) => {
    /* 🐛 04/09 (auditoria) — os 8 campos da C1 tinham `labels: 0` e nenhum
       `aria-label`: um leitor de tela anunciava "campo de edição" oito vezes
       seguidas. O conserto foi no `Campo` do DS (rótulo virou `<label>` e
       entrega o id por contexto); este teste é o que impede a volta, inclusive
       em tela nova que não use o `Campo`. */
    const semNome: string[] = [];
    for (const tela of TELAS) {
      await page.goto(tela.rota);
      await page.waitForLoadState("networkidle");
      const achados = await page
        .locator(
          "main input:visible, main textarea:visible, main button[aria-haspopup=listbox]:visible",
        )
        .evaluateAll((els) =>
          els
            .filter((e) => {
              const el = e as HTMLInputElement;
              const temLabel = el.labels && el.labels.length > 0;
              return !temLabel && !el.getAttribute("aria-labelledby") && !el.getAttribute("aria-label");
            })
            .map((e) => `${e.tagName}[${(e as HTMLInputElement).placeholder ?? ""}]`),
        );
      semNome.push(...achados.map((a) => `${tela.id} · ${a}`));
    }
    expect(semNome, "campos sem nome acessível").toEqual([]);
  });
});

test.describe("copy que a auditoria travou", () => {
  test("C7 não promete editar nem ordenar o que está travado", async ({ page }) => {
    await page.goto("/dossie/nome");
    const sub = page.locator("main p").first();
    await expect(sub).not.toContainText("deixe na ordem");
    await expect(sub).not.toContainText("Edite o que quiser");
  });

  test("nenhuma tela do trecho usa travessão em texto público", async ({ page }) => {
    for (const tela of TELAS) {
      await page.goto(tela.rota);
      await page.waitForLoadState("networkidle");
      const texto = await page.locator("body").innerText();
      expect(texto, `${tela.id} tem travessão (regra dura da copy)`).not.toContain("—");
    }
  });
});
