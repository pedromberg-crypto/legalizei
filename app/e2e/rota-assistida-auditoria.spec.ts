import { test, expect, type Page } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E2E — auditoria travada da ROTA ASSISTIDA: A3.H → A5.H (caminho ABRIR/ME)
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu da auditoria que o Pedro pediu em 05/09, antes de mexer no ramo. A
 * varredura achou 9 problemas; esta spec existe pra que eles não voltem em
 * silêncio — que é como chegaram, todos passando por `tsc` e `eslint` limpos.
 *
 * ─── O QUE ESTA SPEC PROVA ─────────────────────────────────────────────────
 * 1. O compromisso é DADO, não frase: desistir de remarcar devolve o status
 *    exatamente como estava, com o cartão da hora no lugar (era o bug 1).
 * 2. Nenhum rótulo de mock vaza pra copy pública, e a frase da hora marcada
 *    carrega a data quando não é hoje (bugs 2 e 3).
 * 3. As DUAS assinaturas têm o mesmo ciclo: passagem → agenda → status. A 2ª
 *    diz que é a que gera o CNPJ e que o contador assina junto.
 * 4. A tela nunca afirma hora marcada em um lugar e nega em outro.
 * 5. O rodapé não promete andamento automático onde tudo espera uma pessoa.
 * 6. A trilha de ativação conta como tarefa só o que é tarefa DELA.
 * 7. O ramo é guardado por regime e dorme enquanto a guia não está paga.
 * 8. Nada estoura o iPhone SE (375px) e o console fica calado.
 *
 * ⚠️ Estado é MOCK (RF-01): o compromisso viaja no querystring, em partes
 * (`lib/compromisso`). Cada tela se sustenta sozinha, então a spec navega
 * direto pra isolar cada regra, e só usa o clique quando o que está sob teste
 * é a própria navegação.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const STATUS = "/aguardando?fase=junta&guia=paga&rota=assistida";
/** O compromisso de hoje às 15:00, em partes — é o que a agenda devolve. */
const HOJE_15 = "dia=5&semana=Sex&mes=Set&hora=15%3A00&hoje=1";
/** Um compromisso que NÃO é hoje: é ele que exige a data na frase. */
const SEG_8 = "dia=8&semana=Seg&mes=Set&hora=09%3A30";

/**
 * O CTA PRINCIPAL do rodapé.
 *
 * 🐛 05/09 — era `.last()`, e quebrou quando o "Remarcar horário" virou botão
 * ABAIXO do CTA (pedido do Pedro): o último passou a ser o secundário. O
 * primeiro botão é sempre o principal — o link de WhatsApp acima dele é `<a>`,
 * não entra na conta.
 */
const cta = (p: Page) => p.locator("div.app-footer-cta button").first();
const corpo = (p: Page) => p.locator("main").innerText();

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

const TELAS: { id: string; rota: string; meta?: string }[] = [
  { id: "A3.H", rota: STATUS },
  { id: "A3.H1", rota: "/agendar", meta: "Status da abertura" },
  { id: "A3.H2", rota: `${STATUS}&${HOJE_15}` },
  { id: "A3.H3", rota: `${STATUS}&assinatura=1` },
  { id: "A3.H4", rota: "/agendar?rodada=2", meta: "Status da abertura" },
  { id: "A3.H5", rota: `${STATUS}&assinatura=1&${SEG_8}` },
  { id: "A5.H", rota: "/home-dia1?rota=assistida" },
];

test.describe("estrutura de todas as telas do ramo", () => {
  for (const tela of TELAS) {
    test(`${tela.id} cabe em 375px, não fala no console e tem a saída certa`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const console_ = vigiaConsole(page);
      await page.goto(tela.rota);
      await page.waitForLoadState("networkidle");

      /* Só a agenda é passo com volta. O status é a HOME da jornada (destino de
         todo voltar do ramo) e a A5.H é fim de linha: seta ali não teria pra
         onde levar. A auditoria do `gerar-mapa` cobre o outro lado desta regra. */
      const voltar = page.locator('[aria-label="Voltar"]');
      if (tela.meta) {
        await expect(voltar).toHaveCount(1);
        // Regra 6 do CLAUDE.md: o `meta` nomeia o DESTINO, não a própria tela.
        await expect(page.locator("header p").first()).toHaveText(tela.meta);
      } else {
        expect(await voltar.count()).toBe(0);
      }

      const estouro = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        return [...document.querySelectorAll("*")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > vw + 1 && r.height > 0;
        }).length;
      });
      expect(estouro, "elementos mais largos que a viewport").toBe(0);
      expect(console_, "avisos/erros de console").toEqual([]);

      // Regras duras de copy da casa e da rota (CLAUDE.md + `consultor.tsx`).
      const texto = await page.locator("body").innerText();
      expect(texto, "travessão em texto público").not.toContain("—");
      expect(texto).not.toMatch(/ao vivo/i);
      expect(texto, "consultor designado não existe desde 05/09").not.toMatch(/larissa/i);
      expect(texto).not.toMatch(/nossa equipe entra em contato/i);
      expect(texto, "o app não coleta gênero").not.toMatch(/bem-vinda|sozinha|única dona/i);
    });
  }
});

test.describe("o compromisso é dado, não frase", () => {
  /**
   * 🐛 O BUG 1, o mais caro dos três: hero, etapa e CTA liam uma frase e só o
   * cartão lia as partes. Remarcar levava só a frase, então desistir devolvia
   * um status que afirmava a hora marcada em três lugares e mostrava o cartão
   * de APRESENTAÇÃO no quarto.
   */
  test("desistir de remarcar devolve o status inteiro, com o cartão da hora", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    /* 🔄 05/09 — `&socios=1` explícito: sem ele a tela cai no mock
       (`TEM_SOCIO = true`) e mostra a variante COM sócio, cuja copy é outra.
       Este caso é o solo, e o solo agora precisa ser dito. */
    await page.goto(`${STATUS}&socios=1&${HOJE_15}`);
    await expect(page.getByText("Sua assinatura, feita junto com você")).toBeVisible();

    await page.getByRole("button", { name: "Remarcar horário" }).click();
    await page.waitForURL(/\/agendar/);
    await page.locator('[aria-label="Voltar"]').click();
    await page.waitForURL(/\/aguardando/);

    // O cartão da hora continua lá: é ele que responde QUANDO.
    await expect(page.getByText("Sua assinatura, feita junto com você")).toBeVisible();
    // E o cartão de apresentação NÃO toma o lugar dele.
    await expect(page.getByText("O GOV.BR manda um código")).toHaveCount(0);
    // Hero, CTA e etapa seguem afirmando a mesma coisa que o cartão.
    const t = await corpo(page);
    expect(t).toContain("Você tem hora marcada");
    // A etapa da timeline é frase, não botão: lá a hora continua.
    expect(t).toContain("Marcado pra hoje às 15:00");
    expect(t).toContain("Marcado pra hoje");
    await expect(cta(page)).toBeDisabled();
  });

  test("remarcar abre no dia e na hora que já estão marcados", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/agendar?${SEG_8}`);
    // Dia 8 e 09:30 já vêm selecionados: é isso que diz "é ESTE que você mexe".
    await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(2);
    await expect(page.getByText("Remarcar sua assinatura")).toBeVisible();
    await expect(page.getByText(/está marcada pra segunda, dia 8, às 09:30/)).toBeVisible();
    // Confirmar sem mexer é MANTER, não "confirmar" uma mudança que não houve.
    await expect(cta(page)).toHaveText("Manter segunda, dia 8, às 09:30");
  });

  /**
   * 🐛 Os bugs 2 e 3. O dia 15 se chamava "Segunda 15" no mock — nome inventado
   * pra ele não se confundir com o dia 8 — e esse nome ia parar no botão do
   * cliente. A frase agora sai das partes e carrega o dia do mês.
   */
  test("a frase da hora sai das partes: sem rótulo de mock, com a data", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/agendar");
    await page.getByRole("button", { name: /segunda, dia 15/ }).click();
    await page.locator("main .grid button").first().click();

    const rotulo = await cta(page).textContent();
    expect(rotulo, "o rótulo do mock não pode chegar no cliente").not.toContain("Segunda 15");
    expect(rotulo).toBe("Confirmar segunda, dia 15, às 09:00");

    await cta(page).click();
    await page.waitForURL(/dia=15/);
    // Com duas segundas na agenda, a frase precisa dizer QUAL.
    /* 🔄 05/09 (pedido do Pedro) — o CTA travado NÃO repete a hora: ela está no
       maior tamanho da tela, no cartão logo acima, e o botão virava duas
       linhas. Ele fica com o dia. */
    await expect(cta(page)).toHaveText("Marcado pra segunda, dia 15");
  });

  test("hoje é a única exceção: dispensa a data porque já é único", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${STATUS}&${HOJE_15}`);
    await expect(cta(page)).toHaveText("Marcado pra hoje");
  });
});

test.describe("as duas assinaturas têm o mesmo ciclo", () => {
  test("ida completa da 1ª: passagem → agenda → status", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(STATUS);
    await expect(cta(page)).toHaveText("Escolher um horário");
    await cta(page).click();
    await page.waitForURL(/\/agendar/);
    await expect(page.getByText("Marque sua assinatura")).toBeVisible();
    await page.getByRole("button", { name: "15:00", exact: true }).click();
    await cta(page).click();
    await page.waitForURL(/hora=15/);
    await expect(page.getByText("Você tem hora marcada")).toBeVisible();
  });

  /**
   * 🆕 05/09 (pedido do Pedro) — a 2ª assinatura não tinha ciclo nenhum: a
   * volta da 1ª caía num status que ainda mostrava o compromisso já cumprido e
   * oferecia remarcar uma hora que tinha passado.
   */
  test("ida completa da 2ª: nomeia o CNPJ e o contador em todos os pontos", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${STATUS}&assinatura=1`);
    // A passagem da 2ª é um estado próprio, não o genérico "Agora é com a gente".
    await expect(page.getByText("Falta a assinatura do CNPJ")).toBeVisible();
    /* 🔄 05/09 — com sócio (o mock tem um), o hero da 2ª diz que o contrato já
       foi assinado por todos e que esta é só dela e do contador. */
    await expect(page.getByText(/só sua e do contador/)).toBeVisible();
    // O PORQUÊ mora aqui, no cartão da passagem, como na 1ª rodada.
    await expect(page.getByText(/o contador assina do nosso lado na mesma hora/)).toBeVisible();
    await expect(cta(page)).toHaveText("Marcar a última assinatura");

    await cta(page).click();
    await page.waitForURL(/rodada=2/);
    await expect(page.getByText("Marque a assinatura do CNPJ")).toBeVisible();
    /* 🔄 05/09 (pedido do Pedro) — na AGENDA o cartão do consultor é o pequeno,
       igual ao da 1ª rodada: o porquê já foi dado na tela anterior. Aqui quem
       diz quem está no ato é o subtítulo. */
    /* 🔄 05/09 — com sócio (o mock tem um), a agenda da 2ª não fala em "três no
       ato": ela diz que o sócio NÃO precisa estar, que é a informação que muda
       o comportamento de quem acabou de alinhar dois horários pra 1ª. */
    await expect(page.getByText(/não precisa estar/)).toBeVisible();
    await expect(page.getByText(/o contador assina do nosso lado na mesma hora/)).toHaveCount(0);

    await page.getByRole("button", { name: "15:00", exact: true }).click();
    await cta(page).click();
    await page.waitForURL(/assinatura=1.*dia=/); // `socios` agora viaja sempre e entra no meio
    // O cartão diz QUAL assinatura está marcada: sem isso a 2ª lê como engano.
    await expect(page.getByText("A assinatura que gera seu CNPJ")).toBeVisible();
    /* 🔄 05/09 — com sócio, a linha do canal vira "Só você e o contador, sem o
       sócio": é a mesma informação (quem está no ato) dita pelo lado que
       importa quando existe um sócio esperando ser chamado. */
    await expect(page.getByText(/Só você e o contador, sem o sócio/)).toBeVisible();
    await expect(cta(page)).toBeDisabled();
  });

  test("a 2ª não herda o compromisso da 1ª", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${STATUS}&assinatura=1`);
    // Sem hora marcada não existe cartão de compromisso nem "Remarcar".
    await expect(page.getByText("A assinatura que gera seu CNPJ")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Remarcar horário" })).toHaveCount(0);
  });
});

test.describe("a tela não se contradiz", () => {
  /**
   * 🐛 Com hora marcada, o rodapé prometia "o processo segue sozinho" — falso
   * justamente no estado em que tudo depende de duas pessoas se encontrarem.
   */
  test("com a Junta resolvida, o rodapé não promete andamento automático", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    for (const rota of [STATUS, `${STATUS}&${HOJE_15}`, `${STATUS}&assinatura=1`]) {
      await page.goto(rota);
      const t = await corpo(page);
      expect(t, rota).toContain("Seu progresso está guardado");
      expect(t, rota).not.toContain("o processo segue sozinho");
    }
  });

  test("a rota automática continua prometendo o que ela cumpre", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/aguardando?fase=junta&guia=paga");
    expect(await corpo(page)).toContain("o processo segue sozinho");
  });

  /**
   * 🐛 Recuar a viabilidade zerava a guia junto (o progresso é um ponteiro
   * linear), e a tela voltava a cobrar "Pagar a guia agora" de quem já pagou.
   * O A2 diz à pessoa que a guia não espera a análise, então o app incentiva
   * exatamente o caso que quebrava.
   */
  test("a 2ª rodada de nomes não cobra de novo a guia já paga", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/aguardando?fase=junta&guia=paga&viabilidade=1");
    await expect(cta(page)).not.toHaveText("Pagar a guia agora");
    await expect(cta(page)).toHaveText("Aguardando viabilidade");
    await expect(cta(page)).toBeDisabled();
    // E a timeline concorda com o rodapé: a guia segue paga.
    await expect(page.getByRole("button", { name: /Pagar a guia agora/ })).toHaveCount(0);
  });
});

test.describe("a trilha de ativação", () => {
  /* 🗑️ 05/09 (Pedro, confirmado com o Ademar) — a PROCURAÇÃO saiu do flow: com
     o certificado digital ela é dispensável. O certificado virou o último
     passo antes do acesso completo, e ele não é recibo — é videochamada
     marcada por uma certificadora parceira. */
  for (const [id, rota] of [
    ["A5.H", "/home-dia1?rota=assistida"],
    ["A5", "/home-dia1"],
  ]) {
    test(`${id}: o certificado é o último passo, e a procuração não existe`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(rota);
      await page.waitForLoadState("networkidle");

      await expect(page.getByText("Sua ativação")).toBeVisible();
      await expect(page.getByText("Certificado digital", { exact: true })).toBeVisible();
      // A promessa que sobreviveu: continua incluso, na linha sempre visível.
      await expect(page.getByText("Incluso no seu plano")).toBeVisible();
      // Quem conduz é a parceira, e a pessoa precisa atender a chamada.
      await expect(page.getByText(/certificadora parceira entra em contato/)).toBeVisible();
      /* O desfecho e o que ele entrega ficam VISÍVEIS: no cartão de status o
         `detalhe` só aparece na etapa da vez, e o desfecho nunca é a vez —
         por isso a promessa mora na linha fixa. */
      await expect(page.getByText("Acesso completo ao app")).toBeVisible();
      await expect(page.getByText("Emitir nota, impostos, relatórios e mais")).toBeVisible();

      await expect(page.getByText(/procuração/i)).toHaveCount(0);
      /* 🗑️ 05/09 — a "conferência dos dados" era tarefa inventada pela tela (a
         pessoa já conferiu tudo no A1), e o cartão "Sem pressa com imposto"
         respondia pergunta que ninguém fez. */
      await expect(page.getByText("Conferir os dados da empresa")).toHaveCount(0);
      await expect(page.getByText("Sem pressa com imposto agora")).toHaveCount(0);
    });
  }

  test("o CTA nomeia o destino, em cinza, e não briga com a barra de abas", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/home-dia1?rota=assistida");
    await page.waitForLoadState("networkidle");

    const cta = page.locator("div.app-footer-cta button");
    await expect(cta).toHaveText("Acessar app completo");
    await expect(cta).toBeDisabled();
    /* `travado` (cinza), não `disabled` coral: coral apagado significa "espera
       curta, a ação volta"; cinza significa "trancado até outra coisa
       acontecer". Ver a variante em `ui/button.tsx`. */
    await expect(cta).toHaveCSS("background-color", "rgb(244, 244, 244)");

    /* 📐 O CTA fica no RODAPÉ DE VERDADE, encostado no pé da tela, na mesma
       altura do CTA de todas as outras telas — anatomia fixa é o que faz a
       pessoa não procurar o botão. Quem cede é a barra de abas, que sobe pra
       cima dele: aqui ela está travada e não pode disputar a thumb zone. */
    const geo = await page.evaluate(() => {
      const r = document.querySelector("div.app-footer-cta")!.getBoundingClientRect();
      const n = document.querySelector("nav")!.getBoundingClientRect();
      return {
        colado: Math.abs(r.bottom - window.innerHeight) <= 1,
        barraAcima: n.bottom <= r.top,
      };
    });
    expect(geo.colado, "o rodapé não está encostado no pé da tela").toBe(true);
    expect(geo.barraAcima, "a barra de abas está por cima do CTA").toBe(true);
  });

  test("a frase que cobra a pessoa vem em negrito", async ({ page }) => {
    /* É a única parte do detalhe do certificado que exige algo dela: alguém VAI
       LIGAR. No meio de um parágrafo de peso único, passava batido. */
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/home-dia1?rota=assistida");
    await expect(page.locator("main strong").first()).toHaveText(
      "Uma certificadora parceira entra em contato",
    );
  });

  test("as duas rotas chegam na MESMA tela", async ({ page }) => {
    /* O único passo que divergia entre assistida e automática era a procuração.
       Sem ela, `?rota=assistida` não muda mais nada aqui — e é isso que o prop
       morto deixou de fingir. */
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/home-dia1");
    const automatica = await page.locator("main").innerText();
    await page.goto("/home-dia1?rota=assistida");
    expect(await page.locator("main").innerText()).toBe(automatica);
  });
});

test.describe("o menu na home dia-1", () => {
  /* 🆕 05/09 (pedido do Pedro: "trave o menu como nas outras telas") — a barra
     APARECE, travada. Escondê-la deixava a última linha da trilha ("tudo se
     abre") sem objeto: a pessoa não via o que estava esperando. */
  for (const [id, rota] of [
    ["A5.H", "/home-dia1?rota=assistida"],
    ["A5", "/home-dia1"],
  ]) {
    test(`${id}: a barra está à vista e não navega`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(rota);
      await page.waitForLoadState("networkidle");

      const barra = page.locator("nav").first();
      await expect(barra).toBeVisible();
      // As 4 abas existem e nenhuma clica.
      const abas = page.locator("nav button");
      await expect(abas).toHaveCount(4);
      for (let i = 0; i < 4; i++) await expect(abas.nth(i)).toBeDisabled();
      // O CTA de emitir nota deixa de ser link: emitir é o que a ativação abre.
      await expect(page.locator("nav a[aria-label='Emitir nota fiscal']")).toHaveCount(0);
    });
  }

  test("num tab de verdade a barra continua navegando", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/inicio");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("nav button").first()).toBeEnabled();
    await expect(page.locator("nav a[aria-label='Emitir nota fiscal']")).toHaveCount(1);
  });
});

test.describe("os limites do ramo", () => {
  test("MEI não entra na rota assistida, nem forçando pela URL", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${STATUS}&regime=mei`);
    await expect(page.getByText("Consultor oficial Legalizai")).toHaveCount(0);
    await expect(cta(page)).not.toHaveText("Escolher um horário");
  });

  test("o ramo dorme enquanto a guia não está paga", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/aguardando?fase=junta&rota=assistida");
    await expect(cta(page)).toHaveText("Pagar a guia agora");
    await expect(page.getByText("Consultor oficial Legalizai")).toHaveCount(0);
  });

  test("a agenda tira de jogo o dia lotado e o dia fechado", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/agendar");
    await expect(page.getByRole("button", { name: /sem horários livres/ })).toBeDisabled();
    await expect(page.getByRole("button", { name: /não atendemos neste dia/ })).toBeDisabled();
    // Trocar de dia zera a hora: confirmar 15:00 num dia sem 15:00 seria mentira.
    await page.getByRole("button", { name: "15:00", exact: true }).click();
    await page.getByRole("button", { name: /segunda, dia 8/ }).click();
    await expect(cta(page)).toHaveText("Escolha um horário");
    await expect(cta(page)).toBeDisabled();
  });
});
