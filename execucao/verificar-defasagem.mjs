/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📉 A TRAVA DA DEFASAGEM — número velho em prosa
 * ═══════════════════════════════════════════════════════════════════════════
 * Pedido do Pedro em 16/09, e a provocação dele é a especificação:
 *
 *   *"sinto que estamos delirando demais entre uma varredura e outra, sinto que
 *   você muitas vezes erra e na mesma resposta conserta. Por isso estou
 *   provocando essa organização."*
 *
 * ── 🔴 O DIAGNÓSTICO QUE FEZ ESTA TRAVA NASCER ─────────────────────────────
 *
 * Numa auditoria de 16/09 eu achei 7 documentos desatualizados, e **nenhuma
 * trava tinha reclamado**. A razão é estrutural, não descuido:
 *
 *   `verificar-encerrados`  pega **contradição** (afirma o que negamos)
 *   `verificar-persona`     pega **vocabulário** (palavra proibida)
 *   `verificar-escopo`      pega **vocabulário** de outro regime
 *   `verificar-etiquetas`   pega **ausência** (linha sem dono)
 *
 * Nenhuma pega **DEFASAGEM**: o doc que diz "45 conferências" quando são 46.
 * Ele não contradiz nada e não omite nada — ele só envelheceu.
 *
 * 🔑 E a evidência de que isto é arquitetura e não disciplina: na mesma
 * auditoria, os docs **gerados** (PROCESSOS, SAIDAS, cru/*, PERSONA) tiveram
 * **zero** deriva, e os escritos à mão tiveram **7 de 7** achados. Número em
 * prosa não recalcula.
 *
 * ── ⚠️ O QUE ELA NÃO PEGA, DECLARADO ───────────────────────────────────────
 *
 * Ela compara **número citado** com **número vivo**. Não sabe se a frase ao
 * redor faz sentido, e não pega afirmação sem número ("o motor está validado").
 * Mesma fronteira das outras: pega forma, não raciocínio.
 *
 * 🔒 E não pega o erro que mais custa: eu afirmando ao Pedro um número que
 * ainda não rodei. Contra isso não existe script — existe a regra de conduta
 * registrada no CLAUDE.md, que manda dizer "vou medir" em vez de citar.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · DE ONDE VEM CADA NÚMERO VIVO
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 🔑 Cada medida é **medida**, nunca escrita aqui. Um valor digitado neste
 * arquivo criaria a própria defasagem que ele existe para pegar.
 */
const MEDIDAS = [
  {
    id: "conferencias-apurador",
    o: "conferências do apurador",
    medir: () => contaDaSuite("motor-fiscal/verificar-apurador.mjs", "conferências"),
    /**
     * O que procurar nos docs. `\d+` é onde o número cai.
     *
     * 🔑 A SEGUNDA FORMA É TABELA, e ela precisou existir por um motivo:
     * o placar que o contador lê no `_duvidas-contador` é
     * `| Conferências no motor | **46** |`, com o número **depois do pipe**.
     * Nenhum padrão de frase alcança isso, e era justamente a tabela mais
     * exposta do vault — a que foi para a reunião.
     */
    citacoes: [
      /(\d+)\s+conferências\s+(?:no\s+)?(?:motor|apurador)/gi,
      /\|[^|]*confer[êe]ncias[^|]*\bmotor\b[^|]*\|\s*([\d.]+)\s*\|/gi,
    ],
  },
  {
    id: "conferencias-piloto",
    o: "conferências do piloto",
    medir: () => contaDaSuite("motor-fiscal/verificar-piloto.mjs", "conferências"),
    /**
     * ⚠️ A forma de tabela é ANCORADA no rótulo exato, e não num `piloto`
     * solto na célula. A 1ª versão era `\|[^|]*piloto[^|]*\|\s*(\d+)\s*\|` e
     * casou com `| A varredura do piloto — pior saldo | 1 |`, gritando que
     * "1 conferência do piloto" estava defasado. Rótulo genérico em padrão de
     * tabela pega qualquer tabela.
     */
    citacoes: [
      /(\d+)\s+conferências\s+(?:no\s+|do\s+)?piloto/gi,
      /\|\s*No piloto de pró-labore\s*\|\s*([\d.]+)\s*\|/gi,
    ],
  },
  {
    id: "conferencias-estado",
    o: "conferências do estado recorrente",
    medir: () => contaDaSuite("estado-cnpj/verificar.mjs", "conferências"),
    citacoes: [
      /(\d+)\s+conferências\s+no\s+estado\s+recorrente/gi,
      /\|[^|]*\bestado\s+do\s+CNPJ\b[^|]*\|\s*([\d.]+)\s*\|/gi,
    ],
  },
  /**
   * ── 💰 A PRIMEIRA MEDIDA EM REAIS ─────────────────────────────────────────
   *
   * Até 17/09 esta trava só conferia **contagens**, e a auditoria daquele dia
   * mostrou o tamanho do buraco: **556 valores em R$** citados nos textos
   * vivos, nenhum conferido por máquina. A aferição manual achou **um**
   * defasado — este.
   *
   * 🔑 Ele é o pior tipo de número para ficar velho: é o que **autoriza o
   * piloto a agir sozinho, sem perguntar ao cliente**. Se um dia deixar de
   * compensar, quem avisa é a varredura; e se o comentário que a descreve
   * mentir, alguém vai ler a garantia errada.
   */
  {
    id: "pior-saldo-do-varrimento",
    o: "pior saldo do varrimento do piloto",
    /**
     * ⚠️ `centavos: true` existe porque a 1ª versão desta medida **não pegou**
     * o valor velho. O padrão aceitava `R$163/mês` e não `R$386,82/mês`: a
     * citação certa passava, a errada escapava — que é o pior dos dois mundos,
     * porque o verde parecia merecido.
     *
     * 🔑 Dinheiro em prosa aparece em duas formas ("R$163" e "R$386,82") e as
     * duas significam a mesma grandeza. Comparar em **centavos** é a única
     * maneira de não depender de como quem escreveu resolveu formatar.
     */
    centavos: true,
    medir: () => {
      const saida = saidaDe("motor-fiscal/verificar-piloto.mjs");
      const m = saida.match(/pior saldo do varrimento:\s*R\$\s*([\d.]+(?:[.,]\d{2})?)/i);
      if (!m) throw new Error("Não achei o pior saldo na saída do verificar-piloto");
      return Math.round(Number(m[1].replace(",", ".")) * 100);
    },
    citacoes: [/pior saldo[^.]{0,24}?R\$\s?(\d[\d.]*(?:,\d{2})?)\s?\/\s?m[êe]s/gi],
  },
  /**
   * ── 💰 OS TRÊS VALORES MAIS EXPOSTOS DO VAULT ─────────────────────────────
   *
   * Escolhidos por **exposição**, não por tamanho: são os que o contador leu
   * na reunião e os que mais se repetem nos textos vivos. A auditoria de 17/09
   * aferiu ~100 valores **à mão** e todos fecharam — mas aferição manual
   * envelhece igual à prosa que ela confere. Estes três param de envelhecer.
   */
  {
    id: "das-total-p16",
    o: "DAS total da P16 no caminho real",
    centavos: true,
    medir: async () => somaDaVida("P16", (r) => r.das?.total ?? 0),
    /**
     * ⚠️ ANCORADO NA P16, e não em "pagou … de DAS".
     *
     * As cinco linhas de total do Bloco D têm **redação idêntica** — *"Faturou
     * R$X · pagou R$Y de DAS"* —, então um padrão pela frase casa com a P01 e
     * acusa o DAS dela de estar errado por não ser o da P16. Foi o que
     * aconteceu na 1ª versão. O que distingue as linhas é a **receita**, então
     * é ela que ancora.
     */
    citacoes: [
      /Faturou\s+R\$551\.000[^|]*?pagou\s+R\$\s?([\d.]+(?:,\d{2})?)\s+de DAS/gi,
      /DAS cairia de\s+R\$\s?([\d.]+(?:,\d{2})?)/gi,
    ],
  },
  {
    id: "saldo-do-cliente-p01",
    o: "saldo do cliente da P01 com o piloto",
    centavos: true,
    medir: async () => {
      const { VIDAS } = await import(url("estado-cnpj/vidas.mjs"));
      const { replayComPiloto } = await import(url("estado-cnpj/replay-piloto.mjs"));
      const v = VIDAS.find((x) => x.id === "P01");
      return replayComPiloto({ empresa: v.empresa, competencias: v.competencias }).resumo.saldo;
    },
    citacoes: [/diferença é de\s+\*{0,2}R\$\s?([\d.]+(?:,\d{2})?)/gi],
  },
  {
    id: "das-da-persona-zero",
    o: "DAS da persona zero (recibo do PGDAS-D)",
    centavos: true,
    /**
     * 🔑 Este é o único do trio com **recibo**: ele não prova só que a conta
     * não mudou, prova que ela continua batendo com documento emitido.
     */
    medir: async () => {
      const { apurarDAS } = await import(url("motor-fiscal/apurador.mjs"));
      return apurarDAS({ receitaMes: 791000, rbt12: 5400000, anexo: "III" }).total; // centavos
    },
    citacoes: [/\|\s*\*{0,2}R\$\s?(47[\d.]+,\d{2})\*{0,2}\s*\|/gi],
  },
  {
    id: "propriedades",
    o: "propriedades das equações",
    medir: () => contaDaSuite("motor-fiscal/verificar-equacoes.mjs", "propriedades"),
    citacoes: [/(\d+)\s+propriedades\b/gi],
  },
  {
    id: "invariantes",
    o: "invariantes das vidas",
    medir: () => contaDaSuite("estado-cnpj/verificar-vidas.mjs", "invariantes"),
    // ⚠️ "8 invariantes NOVOS" é subconjunto, não total. Só casa o total.
    citacoes: [
      /(\d+)\s+invariantes\s*(?:passaram|no total|,|\.|$)/gi,
      /\|[^|]*\binvariantes\b[^|]*\|\s*([\d.]+)\s*\|/gi,
    ],
  },
  {
    id: "vidas",
    o: "vidas de teste",
    medir: async () => (await import(url("estado-cnpj/vidas.mjs"))).VIDAS.length,
    /**
     * ⚠️ "as 8 vidas COM 2+ SÓCIOS" é recorte, não o elenco. O padrão precisa
     * recusar qualquer qualificador depois de "vidas".
     */
    /**
     * 🐛 BUG DA PRÓPRIA TRAVA, achado em 17/09 — e é o mesmo defeito que ela
     * existe para pegar, só que em regex.
     *
     * O recuo dizia `(?!\s+(?:com|que|sem|...))` **sem `\b` no fim**. Então em
     * *"5 das 16 vidas **começam** em 2025"* o `com` casava dentro de
     * `começam`, o recuo disparava, e a linha passava limpa. O `16` errado
     * sobreviveu em **3 arquivos** por causa de uma palavra que começa igual a
     * uma preposição.
     *
     * 🔑 Trava cega é pior que trava ausente: esta rodou verde por duas
     * rodadas afirmando que estava tudo em dia.
     */
    citacoes: [
      /(\d+)\s+vidas\s+de\s+teste\b(?!\s+(?:com|que|sem|de|onde)\b)/gi,
      /as\s+(\d+)\s+vidas\b(?!\s+(?:com|que|sem|de|onde|dinâmicas|fict\w*)\b)/gi,
      /(\d+)\s+vidas\s*[·,]\s*[\d.]+\s+compet/gi,
    ],
  },
  /**
   * ── 🔴 OS RECORTES, e por que eles ganharam medida própria ────────────────
   *
   * Em 17/09 a varredura achou o número **7** dito em quatro arquivos
   * diferentes — `_achados-do-motor`, `_duvidas-contador`, `_modelo.mjs` e o
   * reporte ao Mauro — e nenhum deles estava certo. Eram **8**.
   *
   * 🔑 O detalhe que prova que era erro e não desatualização: dois deles diziam
   * "7" sobre coisas **complementares** (7 com sócio único, 7 atingidas pelo
   * bug dos sócios) num elenco de 16. 7 + 7 = 14, e não fechava com ninguém.
   * Nenhum olho pegou, porque cada linha vivia num arquivo.
   *
   * ⚠️ Recorte só é conferível se a frase disser **de quantos**. Por isso o
   * padrão exige a forma `N das M vidas <predicado>`: o numerador é conferido
   * aqui, e o denominador cai na medida `vidas` logo acima.
   */
  {
    id: "socio-unico",
    o: "vidas com sócio único",
    medir: async () => {
      const { VIDAS } = await import(url("estado-cnpj/vidas.mjs"));
      return VIDAS.filter((v) => (v.empresa.sociosTotal ?? 1) === 1).length;
    },
    citacoes: [/(\d+)\s+das\s+\d+\s+vidas\s+t[êe]m\s+s[óo]cio\s+[úu]nico/gi],
  },
  {
    id: "sem-faturar-no-mes-1",
    o: "vidas que não faturam no mês da abertura",
    /**
     * 🔑 A conta tem DUAS maneiras de não faturar no mês 1, e as duas contam:
     * a competência da abertura existe com receita zero, ou a série só começa
     * meses depois (P10, P12, P13 — a empresa abre e fica parada).
     * A 2ª nunca foi contada antes, e é por isso que este número não bate com
     * o "11" que estava escrito: aquele saiu de critério não registrado.
     */
    medir: async () => {
      const { VIDAS } = await import(url("estado-cnpj/vidas.mjs"));
      return VIDAS.filter((v) => {
        const mes = v.empresa.dataAberturaCnpj.slice(0, 7);
        const cp = v.competencias.find((c) => c.mes === mes);
        return !cp || cp.receita === 0;
      }).length;
    },
    citacoes: [/(\d+)\s+das\s+\d+\s+vidas\s+n[ãa]o\s+faturam\s+no\s+m[êe]s\s+da\s+abertura/gi],
  },
  {
    id: "comecam-em-2025",
    o: "vidas que começam em 2025",
    medir: async () => {
      const { VIDAS } = await import(url("estado-cnpj/vidas.mjs"));
      return VIDAS.filter((v) => v.competencias[0].mes.startsWith("2025")).length;
    },
    citacoes: [/(\d+)\s+das\s+\d+\s+vidas\s+come[çc]am\s+em\s+2025/gi],
  },
  {
    id: "competencias",
    o: "competências rodadas",
    medir: async () => {
      const { VIDAS } = await import(url("estado-cnpj/vidas.mjs"));
      return VIDAS.reduce((s, v) => s + v.competencias.length, 0);
    },
    /**
     * 🔴 AQUI O PADRÃO PRECISA DE CONTEXTO, e a 1ª versão não tinha.
     *
     * `(\d+)\s+competências` casava com *"em 3 competências ela declarou e não
     * pagou"* e *"9 competências já foram transmitidas assim"* — que são casos
     * de persona, não o total rodado. Três falsos positivos na primeira
     * rodada.
     *
     * ⚠️ Trava que grita errado é pior que trava que não existe: ensina a
     * ignorar o vermelho. Por isso só casa quando a frase diz que é TOTAL.
     */
    citacoes: [
      /(?:foram|rodamos|somam|total de|são)\s+(\d+)\s+compet[êe]ncias/gi,
      /(\d+)\s+compet[êe]ncias\s*[·,]\s*[\d.]+\s+(?:verifica|invariantes|decis)/gi,
      /\|[^|]*compet[êe]ncias\s+rodadas[^|]*\|\s*([\d.]+)\s*\|/gi,
      /\d+\s+vidas\s*·\s*([\d.]+)\s+compet[êe]ncias/gi,
    ],
  },
];

const url = (p) => `file:///${resolve(AQUI, p).replace(/\\/g, "/")}`;

/** Soma um campo do retrato ao longo da vida inteira de uma persona. */
async function somaDaVida(id, campo) {
  const { VIDAS } = await import(url("estado-cnpj/vidas.mjs"));
  const { retratoDoMes } = await import(url("estado-cnpj/_modelo.mjs"));
  const v = VIDAS.find((x) => x.id === id);
  return v.competencias.reduce(
    (s, cp) =>
      s + campo(retratoDoMes({ empresa: v.empresa, competencias: v.competencias, mesAlvo: cp.mes })),
    0
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📥 A SAÍDA JÁ MEDIDA — em vez de medir de novo
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 O DESPERDÍCIO QUE ISTO CORTA, medido em 17/09.
 *
 * Esta trava roda **por último** na pipeline, e até aqui ela re-executava
 * `verificar-apurador`, `verificar-piloto`, `verificar-equacoes` e
 * `estado-cnpj/verificar` — as quatro que o `verificar-tudo` **acabou de
 * rodar**. Custava ~650ms de trabalho repetido.
 *
 * 🔑 E o desperdício era o menor dos dois problemas. O grave é que ela
 * comparava a prosa com uma **medição diferente** da que a pipeline tinha
 * acabado de fazer. Duas execuções do mesmo teste deveriam dar o mesmo
 * número — mas "deveria" não é garantia, e a trava existe justamente para
 * não confiar em "deveria".
 *
 * ✅ Então o `verificar-tudo` deposita as saídas que já capturou em
 * `SAIDAS_JA_MEDIDAS` (caminho de um JSON `script → stdout`), e aqui elas
 * são lidas. Rodando sozinha, sem a variável, ela mede como antes.
 */
const SAIDAS_JA_MEDIDAS = process.env.SAIDAS_JA_MEDIDAS;
const jaMedidas = SAIDAS_JA_MEDIDAS
  ? JSON.parse(readFileSync(SAIDAS_JA_MEDIDAS, "utf8"))
  : null;

function saidaDe(script) {
  if (jaMedidas && jaMedidas[script] !== undefined) return jaMedidas[script];
  return execFileSync("node", [resolve(AQUI, script)], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function contaDaSuite(script, palavra) {
  const saida = saidaDe(script);
  const m = [...saida.matchAll(new RegExp(`(\\d[\\d.]*)\\s+${palavra}`, "gi"))].pop();
  if (!m) throw new Error(`Não achei "${palavra}" na saída de ${script}`);
  return Number(m[1].replace(/\./g, ""));
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · ONDE VARRER
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 📝 Só os documentos **VIVOS** — escritos à mão e que precisam acompanhar o
 * código. Gerado não entra (não deriva). Registro datado não entra (era
 * verdade naquele dia, e reescrever seria falsificar histórico).
 */
const DOCS_VIVOS = [
  "execucao/estado-cnpj/_duvidas-contador.md",
  "execucao/estado-cnpj/_achados-do-motor.md",
  "execucao/estado-cnpj/_cobertura-das-vidas.md",
  "execucao/motor-fiscal/_SUFICIENCIA.md",
  "_sistema/PENDENCIAS.md",
  "produto/persona-zero/acionaveis.md",

  /**
   * 🔴 E O CÓDIGO ENTRA AQUI, decidido em 17/09.
   *
   * O "7" errado não morava só em nota: morava num **comentário** do
   * `_modelo.mjs` e num do `piloto-pro-labore.mjs`. Comentário é prosa, não
   * recalcula, e ninguém relê comentário — é o pior lugar para um número.
   *
   * ⚠️ Fonte de dado (`vidas.mjs`) entra também, e as narrativas históricas
   * dela levam o selo. Isso é de propósito: um comentário que conta o que era
   * verdade antes é legítimo, e tem que declarar que é.
   */
  "execucao/estado-cnpj/_modelo.mjs",
  "execucao/estado-cnpj/vidas.mjs",
  "execucao/estado-cnpj/rodar-ciclo.mjs",
  "execucao/estado-cnpj/verificar-vidas.mjs",
  "execucao/motor-fiscal/piloto-pro-labore.mjs",
  "execucao/processos/cru/prolabore.mjs",
];

/**
 * 🔑 O selo que autoriza um número velho numa linha viva. Serve para o caso
 * legítimo: comparar antes × depois, ou citar o que era verdade numa data.
 */
export const SELO = "[HISTÓRICO]";

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · A VARREDURA
 * ═══════════════════════════════════════════════════════════════════════════ */

console.log(`\n${"═".repeat(84)}`);
console.log("📉 TRAVA DA DEFASAGEM — número citado × número vivo");
console.log("═".repeat(84));

const vivos = [];
for (const m of MEDIDAS) {
  const valor = await m.medir();
  // `presos` conta quantas citações esta medida de fato prendeu na varredura.
  vivos.push({ ...m, valor, presos: 0 });
  console.log(`   ${String(valor).padStart(5)}  ${m.o}`);
}

console.log(`\n${DOCS_VIVOS.length} documento(s) vivo(s) varrido(s).\n`);
console.log("─".repeat(84));

const defasados = [];

for (const arquivo of DOCS_VIVOS) {
  let texto;
  try {
    texto = readFileSync(resolve(RAIZ, arquivo), "utf8");
  } catch {
    continue;
  }

  texto.split(/\r?\n/).forEach((linha, i) => {
    // Linha marcada como histórica é citação legítima do que já foi verdade.
    if (linha.includes(SELO)) return;
    // Tabela de antes × depois: a coluna "antes" tem que poder ser velha.
    if (/antes\s*(×|x|\|)\s*depois/i.test(linha)) return;

    /**
     * 🔴 O SEGUNDO FURO DA TRAVA, achado em 17/09 — e por ela mesma não ter
     * reclamado do `_SUFICIENCIA.md`.
     *
     * O doc dizia `**45 conferências** no motor`, e o padrão procurava
     * `conferências` seguido de espaço e `motor`. Entre os dois havia `**`.
     * A trava passou limpo por um número errado por **22 conferências**.
     *
     * 🔑 A lição não é "melhorar o regex": é que o padrão precisa varrer o
     * **texto**, não a marcação. Por isso a busca roda numa linha sem ênfase.
     * O número da coluna e do texto exibido é o mesmo; só o `**` sai.
     */
    const limpa = linha.replace(/\*\*/g, "").replace(/(?<=\S)\*(?=\s)|(?<=\s)\*(?=\S)/g, "");

    for (const m of vivos) {
      for (const re of m.citacoes) {
        for (const achado of limpa.matchAll(new RegExp(re.source, re.flags))) {
          /**
           * 🔑 Medida em dinheiro compara em CENTAVOS, porque "R$163" e
           * "R$386,82" são a mesma grandeza escrita de dois jeitos.
           *
           * 🔴 E PROSA ARREDONDA, de propósito. O documento que foi ao contador
           * diz *"pagou **R$87.083** de DAS"*, e o motor devolve
           * **R$87.083,18** — o texto está certo, só não carrega centavos que
           * ninguém leria. Exigir igualdade ao centavo transformaria toda
           * redação boa em achado, e trava que grita errado ensina a ignorar o
           * vermelho.
           *
           * Então a régua é a do próprio texto: **citação sem centavos é
           * conferida em reais inteiros; citação com centavos, ao centavo.**
           */
          const cru = achado[1].replace(/\./g, "");
          const temCentavos = cru.includes(",");
          const citado = m.centavos
            ? Math.round(Number(cru.replace(",", ".")) * 100)
            : Number(cru);
          m.presos++;
          const bate =
            m.centavos && !temCentavos
              ? Math.round(citado / 100) === Math.round(m.valor / 100)
              : citado === m.valor;
          if (!bate) {
            defasados.push({
              arquivo,
              linha: i + 1,
              medida: m.o,
              citado,
              vivo: m.valor,
              centavos: m.centavos ?? false,
              texto: linha.trim(),
            });
          }
        }
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 3.1 · A COBERTURA — contra o verde vazio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 Nasceu em 17/09, e nasceu porque esta trava já enganou o autor dela.
 *
 * Duas vezes no mesmo dia ela passou **verde** sem estar olhando para nada: o
 * recuo `(?!…com…)` casava dentro de `começam`, e o padrão varria a marcação
 * em vez do texto. Verde de trava que não prendeu nada é indistinguível de
 * verde de doc em dia — e é a mesma armadilha do "teste que passa a vazio"
 * registrada em 15/09 (M-002).
 *
 * 🔑 Por isso ela agora **declara quantas citações prendeu**, e uma medida que
 * prende ZERO é defeito: ou o padrão está errado, ou o número deixou de ser
 * citado em lugar nenhum e a medida não tem mais razão de existir.
 */
const mudas = vivos.filter((m) => m.presos === 0);
const totalPresos = vivos.reduce((s, m) => s + m.presos, 0);

console.log("\n📌 COBERTURA — quantas citações cada medida prendeu:\n");
for (const m of vivos) {
  console.log(
    `   ${m.presos === 0 ? "🔴" : "  "} ${String(m.presos).padStart(3)} × ${m.o}`
  );
}
console.log(`\n   ${totalPresos} citação(ões) conferida(s) em ${DOCS_VIVOS.length} textos vivos.`);

if (mudas.length) {
  console.log(`\n🔴 ${mudas.length} MEDIDA(S) MUDA(S) — não prenderam nada:\n`);
  for (const m of mudas) console.log(`   ${m.o}`);
  console.log(
    "\n   ↳ Verde de medida muda é verde VAZIO. Ou o padrão não casa com a\n" +
      "     redação usada, ou o número saiu dos docs e a medida sobra.\n"
  );
  process.exit(1);
}

if (!defasados.length) {
  console.log("\n✅ Nenhum documento vivo cita número defasado.\n");
  console.log("⚠️  Ela compara NÚMERO, não raciocínio. Afirmação sem número");
  console.log("   passa limpo aqui — contra isso vale a regra de conduta:");
  console.log("   número que não acabou de rodar sai como \"vou medir\".\n");
  process.exit(0);
}

console.log(`\n🔴 ${defasados.length} NÚMERO(S) DEFASADO(S):\n`);
for (const d of defasados) {
  console.log(`   ${d.arquivo}:${d.linha}`);
  // Medida em dinheiro volta a REAIS para a leitura humana: quem lê o aviso
  // precisa reconhecer o número como ele está escrito no documento.
  const mostra = (n) =>
    d.centavos ? "R$ " + (n / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : n;
  console.log(`      diz ${mostra(d.citado)} ${d.medida}, e o vivo é ${mostra(d.vivo)}`);
  console.log(`      ${d.texto.slice(0, 100)}`);
  console.log(
    `      ↳ Atualize, ou marque a linha com ${SELO} se for citação do que já foi verdade.\n`
  );
}
process.exit(1);
