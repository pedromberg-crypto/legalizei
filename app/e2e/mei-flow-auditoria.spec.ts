import { test, expect } from "@playwright/test";

import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";

/** Quebra de linha. `fromCharCode` porque o repo roda em Windows e o arquivo
 *  chega com CRLF: dividir por um literal escapado dava um regex quebrado. */
const QUEBRA = String.fromCharCode(10);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E2E — auditoria de CONTRADIÇÃO no ramo MEI (M1 → M14⁗)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, pedido do Pedro: *"apenas no flow do MEI, um E2E minucioso pra ver
 * se encontra alguma contradição"*.
 *
 * ─── O QUE ESTA SPEC PROCURA, E POR QUÊ É DIFERENTE DAS OUTRAS ──────────────
 * As specs existentes provam que cada tela funciona sozinha. Esta procura o
 * que só aparece CRUZANDO telas: a promessa que uma faz e outra desmente.
 *
 * É o tipo de defeito que derrubou o ramo entre 30/08 e 05/09 (4 heranças
 * quebradas sem ninguém mexer no MEI) e que a trava de fronteira não pega —
 * ela cuida de acoplamento, não de sentido.
 *
 * As regras verificadas saem de decisões travadas, não de gosto:
 *   1. **Vocabulário proibido.** O MEI não passa por Junta Comercial, não tem
 *      contrato social, não faz consulta de viabilidade (extinta pela Res.
 *      CGSIM 61/2020), não tem sócio, não tem pró-labore e não tem anexo do
 *      Simples. Qualquer um desses numa tela do ramo é contradição com a lei.
 *   2. **Ninguém promete registrar o MEI pelo cliente.** Não existe API nem
 *      procuração que permita, e a senha gov.br é intransferível (regra de
 *      copy dura, `abertura-mei-processo.md`).
 *   3. **Travessão nunca** (regra de 24/07, vale pra todo texto público).
 *   4. **O certificado é coerente nas 4 telas que falam dele.** Depois da
 *      decisão de hoje ele é COBRADO NO APP e é GATE — nenhuma tela pode ter
 *      sobrado dizendo "pago direto na certificadora" ou "dá pra seguir sem".
 *   5. **O boleto diz a mesma coisa em todo lugar.**
 *   6. **Toda tela tem saída** e o `meta` nomeia o DESTINO (regra 6).
 *   7. Nenhum erro de console, nenhum aviso do `TelaHeader`.
 *   8. Nada estoura 375px (iPhone SE).
 *
 * ⚠️ Estado é MOCK (RF-01): cada tela é rota própria e se sustenta sozinha,
 * então a spec navega direto pra isolar cada regra.
 *
 * 📄 Ela também DESPEJA o texto de cada tela em `e2e/.saida/mei-textos.json`,
 * pra leitura humana cruzada — é lá que mora a contradição que nenhuma regra
 * automática prevê.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Tela = {
  id: string;
  rota: string;
  /** O nome que o `meta` do cabeçalho deve trazer (destino do voltar). */
  meta?: string;
  /** Declara que não tem voltar de propósito (splash, status, saída). */
  semVoltar?: true;
};

/** O ramo inteiro, na ordem do flow. */
const TELAS: Tela[] = [
  { id: "M1", rota: "/mei/endereco", meta: "MEI ou ME" },
  { id: "M2", rota: "/mei/impedimentos", meta: "Onde você trabalha" },
  /* 🔄 07/09 — os 2 bloqueios deixaram de ser tela e viraram estado da M2.
     Como agora são a MESMA tela, eles têm a seta de voltar dela (antes eram
     terminais e declaravam `semVoltar`). */
  { id: "M2.1", rota: "/mei/impedimentos?bloqueio=ja-tem-cnpj", meta: "Onde você trabalha" },
  { id: "M2.2", rota: "/mei/impedimentos?bloqueio=servidor", meta: "Onde você trabalha" },
  { id: "M3", rota: "/mei/faturamento", meta: "Quem pode ser MEI" },
  { id: "M4", rota: "/mei/conta", meta: "Seu faturamento" },
  { id: "M4.1", rota: "/mei/conta?etapa=codigo", meta: "Sua conta" },
  { id: "M4.2", rota: "/mei/conta?etapa=cpf-divergente", meta: "Sua conta" },
  { id: "M5", rota: "/mei/plano", meta: "Sua conta" },
  { id: "M6", rota: "/mei/pagamento", meta: "Seu plano" },
  { id: "M6.R", rota: "/mei/pagamento?retry=1", meta: "Seu plano" },
  { id: "M6.S", rota: "/mei/splash-pagamento", semVoltar: true },
  { id: "M6.SB", rota: "/mei/splash-boleto", semVoltar: true },
  { id: "M6.SR", rota: "/mei/splash-recusado", semVoltar: true },
  { id: "M6.1", rota: "/mei/aguardando", semVoltar: true },
  { id: "M6.1P", rota: "/mei/aguardando?pago=1", semVoltar: true },
  { id: "M7.0", rota: "/mei/atividade?vazia=1", meta: "Pagamento" },
  { id: "M7", rota: "/mei/atividade", meta: "Pagamento" },
  { id: "M7.S", rota: "/mei/atividade-secundarias", meta: "Sua atividade" },
  { id: "M7.1", rota: "/mei/splash-atividades", semVoltar: true },
  { id: "M8", rota: "/mei/titular", meta: "Atividades secundárias" },
  { id: "M9", rota: "/mei/empresa", meta: "Seus dados" },
  { id: "M10", rota: "/mei/nome", meta: "Seu endereço" },
  { id: "M11", rota: "/mei/revisar", meta: "Nome da empresa" },
  { id: "M12", rota: "/mei/status", semVoltar: true },
  { id: "M13", rota: "/mei/proximos-passos", meta: "Acompanhamento" },
  { id: "M14", rota: "/mei/certificado", meta: "Últimos passos" },
  { id: "M14.P", rota: "/mei/certificado/pagar", meta: "Certificado digital" },
  { id: "M14.R", rota: "/mei/certificado/pagar?retry=1", meta: "Certificado digital" },
  { id: "M14‴", rota: "/mei/status?fase=certificado&certificado=pendente", semVoltar: true },
  { id: "M14″", rota: "/mei/status?fase=certificado&certificado=boleto", semVoltar: true },
  { id: "M14′", rota: "/mei/status?fase=certificado&certificado=pronto", semVoltar: true },
  { id: "M14⁗", rota: "/mei/status?fase=certificado&certificado=liberado", semVoltar: true },
];

/**
 * Vocabulário que NÃO pode aparecer no ramo, com o motivo legal.
 *
 * ⚠️ `permitidoSe` existe pros casos em que a palavra aparece pra NEGAR o
 * fato ("você não vai à Junta"). Negar é justamente o que a gente quer que a
 * tela faça; proibir a palavra sem essa válvula obrigaria a tela a ficar muda
 * sobre a dúvida mais provável de quem já ouviu falar de abertura de empresa.
 */
const PROIBIDOS: { termo: RegExp; porque: string; permitidoSe?: RegExp }[] = [
  {
    termo: /junta comercial|jucemg/i,
    porque: "MEI registra no Portal do Empreendedor, via Redesim — não passa por Junta",
    permitidoSe: /não (vai|passa|precisa)|sem passar|nenhuma junta|não existe/i,
  },
  {
    termo: /contrato social/i,
    porque: "O documento constitutivo do MEI é o CCMEI (Res. CGSIM 48/2018)",
    permitidoSe: /não (tem|existe|precisa)/i,
  },
  {
    termo: /viabilidade/i,
    porque: "Consulta prévia de viabilidade foi EXTINTA pro MEI (Res. CGSIM 61/2020)",
    permitidoSe: /não (tem|existe|precisa|passa)/i,
  },
  {
    termo: /pró-labore|pro-labore/i,
    porque: "MEI não tem pró-labore: a retirada é lucro isento (Lei 9.249/95 art. 15)",
    permitidoSe: /não (tem|existe|precisa)/i,
  },
  {
    termo: /anexo (i{1,3}|iv|v)\b/i,
    porque: "MEI paga DAS fixo: não tem anexo do Simples nem Fator R",
    permitidoSe: /não (tem|existe|se aplica)|sem (fator r|anexo)|nem (fator r|anexo)/i,
  },
  {
    termo: /fator r/i,
    porque: "Idem: não existe Fator R no MEI",
    permitidoSe: /não (tem|existe|se aplica)|sem (fator r|anexo)|nem (fator r|anexo)/i,
  },
  {
    termo: /\bsócios?\b/i,
    porque: "MEI é unipessoal por definição (art. 966 do Código Civil)",
    permitidoSe: /não (tem|pode ter|existe)|outra empresa|de outra|titular de/i,
  },
  {
    termo: /a gente (abre|registra) (o seu|sua) (mei|empresa)|abrimos (o seu|sua)/i,
    porque:
      "REGRA DE COPY DURA: não existe API nem procuração que permita registrar MEI por terceiro, e a senha gov.br é intransferível",
  },
];

const textos: Record<string, string> = {};
const achados: string[] = [];

test.describe("Ramo MEI · auditoria de contradição", () => {
  for (const tela of TELAS) {
    test(`${tela.id} · ${tela.rota}`, async ({ page }) => {
      const erros: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.text().includes("[TelaHeader]")) {
          erros.push(m.text());
        }
      });
      page.on("pageerror", (e) => erros.push(String(e)));

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(tela.rota, { waitUntil: "networkidle" });

      const corpo = page.locator("body");
      await expect(corpo).toBeVisible();
      /* Dois recortes do mesmo texto: o BRUTO guarda as quebras de linha (é
         o que separa "travessão de copy" de "campo vazio", ver abaixo) e o
         normalizado serve pro resto das regras. */
      const bruto = await corpo.innerText();
      const texto = bruto.replace(/\s+/g, " ").trim();
      textos[tela.id] = texto;

      /* ── 1. VOCABULÁRIO ─────────────────────────────────────────────────── */
      for (const p of PROIBIDOS) {
        const m = texto.match(p.termo);
        if (!m) continue;
        // Janela em volta da ocorrência, pra ver se a tela está NEGANDO o fato.
        const i = texto.search(p.termo);
        const volta = texto.slice(Math.max(0, i - 90), i + 90);
        if (p.permitidoSe && p.permitidoSe.test(volta)) continue;
        achados.push(
          `${tela.id}: termo proibido "${m[0]}" — ${p.porque}\n      contexto: …${volta}…`,
        );
      }

      /* ── 2. TRAVESSÃO (regra dura de 24/07) ─────────────────────────────
         ⚠️ O "—" sozinho é o marcador de CAMPO VAZIO (`{valor || "—"}`), e
         aparece em 3 telas do dossiê. A regra proíbe o travessão como
         PONTUAÇÃO, então ele só conta quando tem texto dos dois lados NA
         MESMA LINHA — por isso a checagem roda no texto bruto, com as quebras
         preservadas. No normalizado, "Nome fantasia
—
Opcional." vira
         "Nome fantasia — Opcional." e lê como travessão sem ser. */
      const travessao = /[^\s—][ 	]—[ 	][^\s—]/.exec(bruto);
      if (travessao) {
        const i = bruto.indexOf(travessao[0]);
        achados.push(
          `${tela.id}: travessão em texto público — proibido desde 24/07\n      contexto: …${texto.slice(Math.max(0, i - 60), i + 60)}…`,
        );
      }

      /* ── 3. SAÍDA E `meta` ──────────────────────────────────────────────── */
      /* ⚠️ A seta NEM SEMPRE mora num `<header>`: nas telas de layout painel
         (M4, herdada do `ContaPainel` do E6) ela vive dentro do painel coral,
         e o ME faz igual. Procurar só no header acusaria essas telas de não
         ter saída — falso positivo que a 1ª rodada desta spec produziu. */
      const setas = page.locator('button[aria-label="Voltar"]');
      if (tela.semVoltar) {
        expect(
          await setas.count(),
          `${tela.id} declara semVoltar mas tem seta`,
        ).toBe(0);
      } else {
        expect(
          await setas.count(),
          `${tela.id} sem seta de voltar`,
        ).toBeGreaterThanOrEqual(1);
        /* O `meta` só existe onde há `TelaHeader`. Layout painel não tem, e
           isso é fiel ao ME. */
        if (tela.meta && (await page.locator("header").count()) > 0) {
          await expect(
            page.locator("header").first(),
            `${tela.id}: meta errado`,
          ).toContainText(tela.meta);
        }
      }

      /* ── 4. LARGURA ─────────────────────────────────────────────────────── */
      const estouro = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(estouro, `${tela.id} estoura a largura do SE`).toBeLessThanOrEqual(1);

      /* ── 5. CONSOLE ─────────────────────────────────────────────────────── */
      expect(erros, `${tela.id} logou erro/aviso`).toEqual([]);
    });
  }

  /**
   * 🐛→🔒 07/09 — A COPY QUE SÓ APARECE DEPOIS DE UM CLIQUE.
   *
   * A varredura por tela só enxerga o que está renderizado na chegada. O
   * travessão do impedimento de benefício (M2) passou batido por isso: ele
   * mora num aviso que só existe depois de a pessoa responder "sim", e a
   * regra de 24/07 vale pra todo texto público, visível de saída ou não.
   *
   * A saída é ler a FONTE: as strings de copy do ramo, incluindo as que vivem
   * em `lib/mei.ts` (perguntas, motivos, saídas) e nunca renderizam juntas.
   */
  test("copy do ramo, incluindo o que só aparece por interação", () => {
    const arquivos = [
      ...readdirSync("src/components/mei").map((f) => `src/components/mei/${f}`),
      "src/lib/mei.ts",
      "src/lib/mei-flow.ts",
    ].filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));

    const problemas: string[] = [];
    for (const arq of arquivos) {
      /* Comentários fora primeiro: o travessão é livre neles (ninguém os lê
         no app).
         ⚠️ Trocados por ESPAÇOS do mesmo tamanho, não removidos — as quebras
         de linha preservadas. Sem isso os offsets deixam de bater com o
         arquivo real e o número de linha do relatório aponta pra outro lugar:
         na 1ª rodada ele me mandou 70 linhas acima do defeito. */
      const emBranco = (t: string) => t.replace(/[^\n]/g, " ");
      const fonte = readFileSync(arq, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, emBranco)
        .replace(/^[ \t]*\/\/.*$/gm, emBranco);

      for (const m of fonte.matchAll(/"([^"\n]*—[^"\n]*)"/g)) {
        const txt = m[1];
        /* O "—" sozinho é o marcador de campo vazio (`{valor || "—"}`), não
           travessão de pontuação. */
        if (txt.trim() === "—") continue;
        const linha = fonte.slice(0, m.index).split(QUEBRA).length;
        problemas.push(`${arq}:${linha} → "${txt.slice(0, 90)}"`);
      }
    }
    expect(
      problemas,
      ["travessão em copy do ramo (proibido desde 24/07):", ...problemas].join(
        QUEBRA,
      ),
    ).toEqual([]);
  });

  test.afterAll(() => {
    mkdirSync("e2e/.saida", { recursive: true });
    writeFileSync("e2e/.saida/mei-textos.json", JSON.stringify(textos, null, 2), "utf8");

    /* ── 6. CRUZAMENTOS: a promessa de uma tela contra a de outra ────────── */
    const cruzados: string[] = [];
    const tem = (id: string, re: RegExp) => re.test(textos[id] ?? "");

    /* O certificado virou GATE e virou COBRANÇA NO APP em 07/09. Se alguma
       tela sobrou dizendo o contrário, a pessoa lê as duas e não sabe qual
       vale — e a que ela vai lembrar é a que prometeu menos trabalho. */
    for (const id of ["M5", "M6", "M14", "M14.P"]) {
      if (tem(id, /pagos? direto (l[áa]|na certificadora)/i)) {
        cruzados.push(
          `${id}: ainda diz que o certificado é "pago direto na certificadora", mas 07/09 travou que ele é cobrado NO APP (M14.P).`,
        );
      }
      if (tem(id, /não é gate|d[áa] pra seguir sem|segue tudo funcionando/i)) {
        cruzados.push(
          `${id}: ainda diz que dá pra seguir sem o certificado, mas 07/09 travou que sem ele o app NÃO libera (M14‴ para a jornada).`,
        );
      }
    }

    /* 🐛 07/09 (achado da 1ª rodada desta spec) — A FRASE DO ÓRGÃO NA VEZ DO
       CLIENTE. A M6.1 dizia "Em andamento agora. Te avisaremos quando
       terminar." embaixo de "Atividade principal" — que é a vez da PESSOA —
       com o CTA "Continuar preenchendo" logo abaixo. A tela afirmava que a
       gente estava fazendo e mandava ela fazer, na mesma dobra. */
    for (const id of ["M6.1", "M6.1P"]) {
      const t = textos[id] ?? "";
      if (/Te avisaremos quando terminar/i.test(t) && /Continuar preenchendo/i.test(t)) {
        cruzados.push(
          `${id}: diz "te avisaremos quando terminar" (frase de quem espera um órgão) na mesma tela em que manda "Continuar preenchendo". Um item da vez do CLIENTE precisa de \`deQuem: "cliente"\`.`,
        );
      }
    }

    /* 🐛 07/09 (mesma rodada) — O DETALHE DO BOLETO ESCONDIDO. O hero da M6.1
       fala do boleto compensando; se o bloco que carrega essa linha nascer
       fechado, a tela anuncia uma espera e esconde a explicação dela. */
    if (
      /boleto está a caminho/i.test(textos["M6.1"] ?? "") &&
      !/Aguardando o banco confirmar/i.test(textos["M6.1"] ?? "")
    ) {
      cruzados.push(
        "M6.1: o hero fala do boleto compensando, mas o item que explica isso está num bloco fechado. Bloco com item `emCurso` tem que nascer aberto (é o que o E9.1 faz com 'Conta e plano').",
      );
    }

    /* 🐛 07/09 (achado da 1ª rodada) — A ETAPA PAGA AINDA MANDANDO PAGAR.
       "Etapa concluída se descreve no passado: é recibo, não instrução."
       (lição do A3′/A3″ do ME, 04/09.) */
    for (const id of ["M14″", "M14′", "M14⁗"]) {
      if (/É o que falta pra gente agir/i.test(textos[id] ?? "")) {
        cruzados.push(
          `${id}: a pessoa já pagou o certificado, mas a timeline ainda diz "é o que falta". Etapa concluída se descreve no passado.`,
        );
      }
    }

    /* O boleto: a M6.SB promete que dá pra seguir; a M6.1 tem que sustentar. */
    if (
      tem("M6.SB", /pode seguir|segue montando/i) &&
      tem("M6.1", /aguardando compensar|travad/i)
    ) {
      cruzados.push(
        "M6.SB × M6.1: o splash promete que dá pra seguir com o boleto pendente, mas o status trava o CTA.",
      );
    }

    /* Preço: o valor do plano não pode divergir entre plano, pagamento e status. */
    const precos = ["M5", "M6", "M6.1"].map((id) => ({
      id,
      valores: [...(textos[id] ?? "").matchAll(/R\$\s?([\d.,]+)/g)].map((m) => m[1]),
    }));
    const doPlano = precos.find((p) => p.id === "M5")?.valores ?? [];
    for (const p of precos.slice(1)) {
      for (const v of p.valores) {
        if (v.length > 2 && doPlano.length && !doPlano.includes(v)) {
          cruzados.push(
            `${p.id}: mostra R$ ${v}, que não aparece no plano (M5: ${doPlano.join(", ")}). Confira se é o mesmo dinheiro.`,
          );
        }
      }
    }

    const todos = [...achados, ...cruzados];
    if (todos.length) {
      console.log("\n🔴 CONTRADIÇÕES ENCONTRADAS:\n");
      for (const a of todos) console.log("  · " + a + "\n");
    } else {
      console.log("\n✅ Nenhuma contradição pelas regras verificadas.\n");
    }
    writeFileSync("e2e/.saida/mei-contradicoes.txt", todos.join("\n\n"), "utf8");
  });
});
