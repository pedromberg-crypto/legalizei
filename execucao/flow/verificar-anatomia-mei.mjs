#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A TRAVA DE ANATOMIA — a tela do MEI tem o mesmo ESQUELETO da do ME?
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. Pedido do Pedro depois de ele pegar, num único dia, quatro telas
 * do ramo MEI que deviam ser réplicas de telas do ME e não eram:
 *
 *   · a M7 chegou com `Rolagem`+`Rodape` no lugar do esqueleto da C0, e o
 *     resultado veio comprimido;
 *   · o cartão de ocupação pôs a pill à esquerda e "Ver detalhes" em linha
 *     própria, quando na C0 a pill é a coluna da direita e o link entra na
 *     linha do código;
 *   · a M6.1 usou uma `<ol>` plana onde o E9.1 usa um acordeão de blocos;
 *   · a M7.S deixou a busca no topo do corpo, e na C5 ela é fixa no rodapé.
 *
 * Nenhum foi descuido pontual. A raiz era sempre a mesma: a tela foi
 * remontada "no espírito" da original em vez de ter a ANATOMIA portada. E o
 * jeito de descobrir era o Pedro abrir as duas lado a lado — trabalho de
 * pessoa pra achar o que um script acha em 1 segundo.
 *
 * ─── O QUE ELA OLHA, E O QUE ELA NÃO OLHA ───────────────────────────────────
 * Ela extrai o ESQUELETO de cada tela: a sequência dos wrappers estruturais
 * (`app-main`, `Titulo`, `Corpo`, `Rolagem`, `Rodape`, `app-footer-cta`,
 * `Campo`, `SheetInfo`…), ignorando comentários e prosa. Duas telas que devem
 * ser réplicas têm que usar o mesmo CONJUNTO de peças.
 *
 * ⚠️ Ela NÃO julga: espaçamento (`pb-4` × `pb-5`), token de cor, ordem interna
 * de um bloco, nem copy. Isso continua sendo olho humano no print. A trava
 * pega o que é estrutural e barato de errar — que foi 4 dos 4 defeitos.
 *
 * ─── A DIFERENÇA ENTRE DIVERGÊNCIA E DEFEITO ────────────────────────────────
 * Nem toda diferença é erro. O MEI não tem "Já sei o número do meu CNAE"
 * porque no MEI não existe código pra digitar. Mas isso precisa estar
 * DECLARADO com motivo, em `DIVERGENCIAS_OK` — igual ao `TITULO_HERDADO_OK`
 * da apresentação. Diferença não declarada é defeito até prova em contrário;
 * declarada, é decisão com dono.
 *
 * Uso:
 *   node execucao/flow/verificar-anatomia-mei.mjs
 *   node execucao/flow/verificar-anatomia-mei.mjs --verbose   (mostra o esqueleto)
 *
 * Sai com código ≠ 0 se houver divergência não declarada.
 *
 * 🔗 Irmãs: `verificar-fronteira-mei.mjs` (acoplamento) e `verificar-mei.mjs`
 * (vocabulário). Esta cuida da FORMA. As três não se sobrepõem.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(fileURLToPath(new URL("../../", import.meta.url)));
const SRC = join(RAIZ, "app", "src");
const verbose = process.argv.includes("--verbose");

/* ─── AS PEÇAS QUE CONTAM COMO ANATOMIA ─────────────────────────────────────
   Só wrapper estrutural e primitivo do DS. Nada de `div`/`p`/`span`: eles
   aparecem às centenas e afogariam o sinal. */
const ESTRUTURAIS = [
  "TelaHeader", "BotaoInfo", "Titulo", "Corpo", "Rolagem", "Rodape",
  "app-main", "app-footer-cta", "SheetInfo", "Campo", "Select", "Texto",
  "textarea", "Checkbox", "Aviso", "CardNota", "Card", "Button",
  "sr-only", "StatusIcon", "SplashMensagemView",
];

/* ─── OS PARES ──────────────────────────────────────────────────────────────
   `fn` é o nome da função exportada; o recorte vai dela até a PRÓXIMA
   declaração de topo do arquivo. Recorte largo demais gera falso positivo
   (foi o que aconteceu na 1ª rodada, quando o script pegou 3 funções juntas e
   acusou um `Aviso` que era da vizinha). */
const PARES = [
  {
    /* Recorte por marcador, não por função: `ContaView`/`ContaMeiView`
       abrigam 3 telas (formulário, código e divergência de CPF). */
    rotulo: "M4.1 · Confirmar código",
    me: {
      arquivo: "components/wizard-dinheiro.tsx",
      de: 'if (etapa === "codigo") {',
      ate: '<TelaHeader meta="Sua conta"',
    },
    mei: {
      arquivo: "components/mei/conta.tsx",
      de: 'if (etapa === "codigo") {',
      ate: "M4 · O FORMULÁRIO",
    },
  },
  {
    rotulo: "M7 · Atividade principal",
    me: { arquivo: "components/gate-telas.tsx", fn: "PerguntaView" },
    mei: { arquivo: "components/mei/atividade.tsx", fn: "AtividadeMeiView" },
  },
  {
    rotulo: "M7.S · Atividades secundárias",
    me: { arquivo: "components/wizard-dossie.tsx", fn: "CnaeSecundariosView" },
    mei: {
      arquivo: "components/mei/atividade-secundarias.tsx",
      fn: "AtividadeSecundariasMeiView",
    },
  },
  {
    rotulo: "M6 / M14.P · Pagamento",
    me: { arquivo: "components/wizard-dinheiro.tsx", fn: "PagamentoView" },
    mei: { arquivo: "components/mei/pagamento.tsx", fn: "PagamentoMeiView" },
  },
  {
    rotulo: "M6.1 · Status pós-pagamento",
    me: { arquivo: "components/painel.tsx", fn: "PainelView" },
    mei: { arquivo: "components/mei/aguardando.tsx", fn: "AguardandoMeiView" },
  },
  {
    rotulo: "M12 · Status da conferência",
    me: { arquivo: "components/painel.tsx", fn: "PainelView" },
    mei: { arquivo: "components/mei/status.tsx", fn: "StatusMeiView" },
  },
];

/* ─── AS DIVERGÊNCIAS COM DONO ──────────────────────────────────────────────
   Cada linha é uma decisão, não uma desculpa. Se você está prestes a
   acrescentar uma só pra calar a trava, o lugar certo é a tela, não aqui. */
const DIVERGENCIAS_OK = {
  "M7 · Atividade principal": {
    Aviso:
      "A C0 do ME não tem `Aviso` na tela; o que o script vê vem do recorte. Mantido na lista por segurança: se um dia a C0 ganhar um, a M7 precisa decidir se ganha também.",
  },
  "M6 / M14.P · Pagamento": {
    Campo:
      "O ME extraiu os campos de cobrança num `DadosAsaasForm`; no MEI eles são inline no mesmo arquivo. Decomposição diferente, tela renderizada igual. 🟡 Dívida menor: extrair alinharia, mas é refactor sem ganho visual — se um dia o `DadosAsaasForm` mudar, esta linha é o lembrete de conferir aqui também.",
    Texto: "Idem `Campo`.",
    Card: "Idem `Campo` — os cards de bloco (cartão · titular · endereço da fatura) moram no `DadosAsaasForm` do lado do ME.",
    Checkbox:
      "No modo `certificado` (M14.P) o aceite é um card com link + sheet (`AceiteCertificado`), espelhando o `AceiteIrreversivelGuia` do A3.P. O `Checkbox` corrido segue no modo `plano` (M6).",
  },
  "M6.1 · Status pós-pagamento": {
    StatusIcon:
      "Os ícones de estado vivem na peça EXTRAÍDA (`components/mei/_timeline-blocos.tsx`), não no arquivo da tela. Foi de propósito, e é a correção da raiz que originou esta trava: as 2 telas de status do ramo consomem a MESMA timeline, então elas não têm como divergir uma da outra.",
    Card: "O card 'Quanto tempo leva' do `PainelView` só existe no modo CLARO (`!escuro`). A M6.1 é escura, como o E9.1 — lá o hero absorve o prazo.",
    Titulo: "O hero escuro substitui `Titulo`/`Corpo` nas duas telas.",
    Corpo: "Idem: no modo escuro o conteúdo vive no hero e na `Rolagem`.",
    Aviso: "O `Aviso` do `PainelView` pertence aos estados de recusa de órgão, que não existem neste ponto do MEI.",
    Campo: "Sem formulário nesta tela.",
    Texto: "Sem formulário nesta tela.",
    Checkbox: "Sem formulário nesta tela.",
    CardNota: "Sem formulário nesta tela.",
    Select: "Sem formulário nesta tela.",
    textarea: "Sem formulário nesta tela.",
    SheetInfo: "O `PainelView` abre sheets ligados à recusa e ao consultor; nenhum dos dois existe aqui.",
    SplashMensagemView: "Peça de outra tela dentro do mesmo arquivo do ME.",
    BotaoInfo: "O 'i' do cabeçalho não existe nesta tela em nenhum dos dois ramos.",
    "sr-only": "O hero escuro já é o `h1` visível; não há título escondido a esconder.",
  },
  "M12 · Status da conferência": {
    StatusIcon:
      "Mesmo caso da M6.1: os ícones vivem na peça extraída (`_timeline-blocos.tsx`). 🔄 07/09 — a timeline desta tela era PLANA, com a justificativa de 28/08 ('4 etapas não pedem agrupamento'). O Pedro derrubou a exceção: *\"todas são padrão, corrija todas\"* — e ele está certo, a justificativa é anterior ao acordeão virar o padrão do status no ME. As 3 telas de status do ramo consomem a mesma peça agora.",
    Card: "Mesmo caso da M6.1: card de prazo é só do modo claro.",
    Titulo: "O hero escuro substitui `Titulo`.",
    Corpo: "Idem.",
    Aviso: "Não existe recusa de órgão neste pipeline: no MEI ninguém protocolou nada nesta fase.",
    Campo: "Sem formulário nesta tela.",
    Texto: "Sem formulário nesta tela.",
    Checkbox: "Sem formulário nesta tela.",
    CardNota: "Sem formulário nesta tela.",
    Select: "Sem formulário nesta tela.",
    textarea: "Sem formulário nesta tela.",
    SheetInfo: "Idem M6.1.",
    SplashMensagemView: "Peça de outra tela dentro do mesmo arquivo do ME.",
    BotaoInfo: "Sem 'i' de cabeçalho nesta tela.",
    "sr-only": "Idem M6.1.",
  },
};

/* ─── EXTRAÇÃO ──────────────────────────────────────────────────────────── */

/**
 * O trecho a comparar.
 *
 * · `fn` — a função exportada, dela até a próxima declaração de topo;
 * · `de`/`ate` — recorte por marcador de texto, pra quando a função abriga
 *   VÁRIAS telas. É o caso das etapas do `ContaView`: comparar a função
 *   inteira acusaria os campos do formulário como se fossem da tela do código.
 *
 * ⚠️ Recorte largo demais gera falso positivo. Na 1ª rodada deste script ele
 * pegou 3 funções juntas e acusou um `Aviso` que era da vizinha.
 */
function recorte(alvo) {
  const texto = readFileSync(join(SRC, alvo.arquivo), "utf8");
  if (alvo.de) {
    const i = texto.indexOf(alvo.de);
    if (i < 0) return null;
    const j = alvo.ate ? texto.indexOf(alvo.ate, i + alvo.de.length) : -1;
    return j > 0 ? texto.slice(i, j) : texto.slice(i);
  }
  const abre = new RegExp(`^(export )?function ${alvo.fn}\\b`, "m");
  const m = abre.exec(texto);
  if (!m) return null;
  const daqui = texto.slice(m.index);
  /* A próxima declaração de topo (coluna 0). O `slice(1)` evita casar com a
     própria abertura. */
  const proxima = /^(export )?(function|const|interface|type|class) /m.exec(
    daqui.slice(1),
  );
  return proxima ? daqui.slice(0, proxima.index + 1) : daqui;
}

/** A sequência de peças estruturais, sem comentários e sem repetição colada. */
function esqueleto(texto) {
  const limpo = texto
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const fora = [];
  for (const m of limpo.matchAll(/[A-Za-z][A-Za-z0-9-]*/g)) {
    const p = m[0];
    if (!ESTRUTURAIS.includes(p)) continue;
    if (fora[fora.length - 1] !== p) fora.push(p);
  }
  return fora;
}

/* ─── A RODADA ──────────────────────────────────────────────────────────── */

console.log("\n═══ ANATOMIA MEI ↔ ME ═══\n");

let defeitos = 0;
let naoEncontrados = 0;

for (const par of PARES) {
  const tMe = recorte(par.me);
  const tMei = recorte(par.mei);

  if (!tMe || !tMei) {
    console.log(`  ⚠️  ${par.rotulo}`);
    console.log(
      `     função não encontrada: ${!tMe ? par.me.fn : par.mei.fn}. Renomearam a tela? Atualize PARES.`,
    );
    naoEncontrados++;
    continue;
  }

  const eMe = esqueleto(tMe);
  const eMei = esqueleto(tMei);
  const setMe = new Set(eMe);
  const setMei = new Set(eMei);
  const declaradas = DIVERGENCIAS_OK[par.rotulo] ?? {};

  const faltam = [...setMe].filter((x) => !setMei.has(x) && !declaradas[x]);
  const sobram = [...setMei].filter((x) => !setMe.has(x) && !declaradas[x]);
  const caladas = [...setMe].filter((x) => !setMei.has(x) && declaradas[x]);

  if (verbose) {
    console.log(`  ${par.rotulo}`);
    console.log(`     ME  : ${eMe.join(" > ")}`);
    console.log(`     MEI : ${eMei.join(" > ")}`);
  }

  if (faltam.length === 0 && sobram.length === 0) {
    if (!verbose) console.log(`  ✅ ${par.rotulo}`);
    if (caladas.length && verbose) {
      console.log(`     (divergências declaradas: ${caladas.join(", ")})`);
    }
    continue;
  }

  defeitos++;
  console.log(`  🔴 ${par.rotulo}`);
  if (faltam.length) {
    console.log(`     no ME e NÃO no MEI: ${faltam.sort().join(", ")}`);
  }
  if (sobram.length) {
    console.log(`     no MEI e NÃO no ME: ${sobram.sort().join(", ")}`);
  }
  console.log(
    "     → ou a tela perdeu uma peça da anatomia, ou a diferença é decisão:",
  );
  console.log("       declare em DIVERGENCIAS_OK, com o motivo escrito.");
}

console.log("");
if (naoEncontrados) {
  console.log(`⚠️  ${naoEncontrados} par(es) com função não encontrada.\n`);
}
if (defeitos === 0 && naoEncontrados === 0) {
  console.log("✅ Anatomia batendo: nenhuma divergência não declarada.\n");
  process.exit(0);
}
console.log(
  `🔴 ${defeitos} tela(s) com divergência de anatomia não declarada.\n`,
);
process.exit(1);
