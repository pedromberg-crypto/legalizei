/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERADOR DOS PROCESSOS — uma fonte, duas saídas.
 * ═══════════════════════════════════════════════════════════════════════════
 *   processos-data.mjs  (única coisa que se edita à mão)
 *        ├── app/src/lib/processos-graph.json  → board /processos, pro Pedro
 *        └── execucao/processos/PROCESSOS.md   → nota literal, pro dev e o Mauro
 *
 * Os dois nunca divergem porque nenhum dos dois é escrito à mão. Mesma
 * disciplina do `flow/gerar-mapa.mjs`.
 *
 * AUDITORIAS que ele roda (falha barulhenta, nunca silenciosa):
 *   1. aresta apontando pra passo que não existe
 *   2. passo que ninguém alcança (órfão) — fora o primeiro de cada processo
 *   3. passo amarelo/vermelho SEM o campo `duvida` preenchido — é a trava
 *      principal: sinalizar buraco sem dizer qual é a pergunta não vale nada
 *   4. passo verde COM `duvida` — ou não é verde, ou a dúvida já foi resolvida
 *   5. `fala` vazio — "com quem a casa fala" é obrigatório, e "—" é resposta
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PROCESSOS, PASSOS, ARESTAS } from "./processos-data.mjs";
import { PROPOSTAS } from "./processos-propostas.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..");
const SAIDA_JSON = resolve(RAIZ, "app/src/lib/processos-graph.json");
const SAIDA_MD = resolve(AQUI, "PROCESSOS.md");

const LUZ = {
  verde: { emoji: "🟢", nome: "sabemos e dá", cor: "#17A06A" },
  amarelo: { emoji: "🟡", nome: "falta decidir", cor: "#D6A400" },
  vermelho: { emoji: "🔴", nome: "não sabemos", cor: "#D64A2D" },
};

/** Duas linhas de ~23 caracteres no cartão de 300px. Acima disso, corta. */
const TETO_FALA = 46;

/**
 * O TOM de cada resposta, derivado aqui e consumido pelo cartão.
 *
 * 🔑 Derivado, não escrito à mão nos dois lados: o vocabulário é decisão da
 * fonte (§5), e repetir a lista dentro do `.tsx` é o mesmo erro que pôs dois
 * números de altura no board em 11/09 — duas cópias do mesmo fato sempre
 * divergem. Quem muda a palavra muda aqui, e o cartão obedece.
 *
 *   neutro → resposta legítima que NÃO pede trabalho ("só a nossa casa")
 *   buraco → resposta que é uma pendência ("ainda não sabemos")
 */
const TOM = {
  "só a nossa casa": "neutro",
  "nada, acontece por baixo": "neutro",
  "ainda não sabemos": "buraco",
  "nada: a tela não existe": "buraco",
};
const tomDe = (v) => TOM[String(v ?? "").trim()] ?? "normal";

// ── auditorias ──────────────────────────────────────────────────────────────
const ids = new Set(PASSOS.map((p) => p.id));
const avisos = [];

for (const a of ARESTAS) {
  if (!ids.has(a.de)) avisos.push(`aresta parte de passo inexistente: ${a.de}`);
  if (!ids.has(a.para)) avisos.push(`aresta chega em passo inexistente: ${a.para}`);
}

const alcancados = new Set(ARESTAS.map((a) => a.para));
const primeiros = new Set(
  PROCESSOS.map((pr) => PASSOS.find((p) => p.processo === pr.id)?.id).filter(Boolean)
);
for (const p of PASSOS) {
  if (!alcancados.has(p.id) && !primeiros.has(p.id)) {
    avisos.push(`passo órfão (ninguém chega nele): ${p.id}`);
  }
  if (!LUZ[p.luz]) avisos.push(`luz inválida em ${p.id}: "${p.luz}"`);
  if ((p.luz === "amarelo" || p.luz === "vermelho") && !p.duvida) {
    avisos.push(`${p.id} está ${p.luz} e não diz QUAL é a dúvida`);
  }
  if (p.luz === "verde" && p.duvida) {
    avisos.push(`${p.id} está verde mas carrega uma dúvida — ou não é verde, ou a dúvida já morreu`);
  }
  if (!p.fala) avisos.push(`${p.id} não declara com quem a casa fala (use "só a nossa casa")`);

  /**
   * 🔴 PALAVRA, NUNCA GLIFO (11/09). O Pedro perguntou o que "fala com"
   * queria dizer olhando um cartão que mostrava "—". Glifo não é resposta
   * curta: é resposta ausente com cara de preenchida, e o mesmo traço
   * escondia duas respostas diferentes. Vocabulário no topo do data.
   */
  for (const campo of ["faz", "fala", "ve"]) {
    const v = String(p[campo] ?? "");
    if (/^[—\-–?❓]/.test(v.trim())) {
      avisos.push(
        `${p.id}.${campo} começa com glifo ("${v.slice(0, 24)}") — escreva a palavra: ` +
          `"só a nossa casa", "ainda não sabemos", "nada, acontece por baixo"`,
      );
    }
  }

  /**
   * O cartão tem altura fixa (doutrina §5.1): rótulo comprido vira reticências
   * e a informação some da vista sem avisar. Detalhe técnico tem campo próprio.
   */
  if (p.fala && p.fala.length > TETO_FALA) {
    avisos.push(
      `${p.id}.fala tem ${p.fala.length} caracteres e não cabe no cartão — ` +
        `deixe o nome do terceiro em "fala" e mande o resto pra "falaNota"`,
    );
  }
}

/**
 * ── AUDITORIAS DA CAMADA DE PROPOSTA ───────────────────────────────────────
 * Proposta mal escrita é pior que proposta nenhuma: ocupa espaço no board e o
 * Pedro gasta atenção decidindo sobre algo que nem está claro.
 */
const idsPropostas = new Set();
for (const s of PROPOSTAS) {
  if (!s.id || !/^S\d+$/.test(s.id)) avisos.push(`proposta com id inválido: ${s.id} (use "S<n>")`);
  // 🔴 id reusado ressuscitaria um "não" que o Pedro já deu, com outra cara
  if (idsPropostas.has(s.id)) avisos.push(`proposta com id repetido: ${s.id}`);
  idsPropostas.add(s.id);
  if (ids.has(s.id)) avisos.push(`proposta ${s.id} colide com um passo real`);
  if (!s.porque) avisos.push(`proposta ${s.id} não diz POR QUE — é o que o Pedro lê pra decidir`);

  /**
   * 🔴 UMA PROPOSTA É UM PATCH, não um tipo (refeito em 11/09).
   *
   * Antes cada proposta tinha UM tipo — "passo", "aresta", "campo" ou
   * "remover" — e podia fazer só aquilo. O Pedro então pediu uma mudança que
   * era, ao mesmo tempo, mexer num passo, criar outro, tirar um terceiro e
   * religar o desenho. Com tipo único, isso vira quatro propostas, e aceitar
   * três delas quebra o processo — exatamente o que a §6.4 acabou de proibir.
   *
   * Agora uma proposta pode trazer todas as partes de uma vez. `tipo` continua
   * existindo só como etiqueta de leitura. A trava real é o simulador, que
   * confere se ela deixa o grafo válido quando aceita sozinha.
   */
  const vazia =
    !s.passos?.length && !s.mudancas?.length && !s.remove?.length && !s.arestas?.length && !s.rotula?.length;
  if (vazia) avisos.push(`proposta ${s.id} não faz nada`);

  for (const p of s.passos ?? []) {
    if (!p.id || !/^S\d+[a-z]?$/.test(p.id)) avisos.push(`proposta ${s.id} tem passo com id inválido: ${p.id}`);
    if (ids.has(p.id)) avisos.push(`proposta ${s.id} usa id de passo real: ${p.id}`);
    idsPropostas.add(p.id);
  }
  for (const m of s.mudancas ?? []) {
    if (!ids.has(m.passo)) avisos.push(`proposta ${s.id} muda passo que não existe: ${m.passo}`);
    if (!m.campo || m.valor === undefined) avisos.push(`proposta ${s.id} tem mudança sem campo ou sem valor`);
  }
  for (const r of s.remove ?? []) {
    if (!ids.has(r)) avisos.push(`proposta ${s.id} quer remover passo que não existe: ${r}`);
  }
  for (const a of [...(s.arestas ?? []), ...(s.substitui ?? [])]) {
    for (const ponta of [a.de, a.para]) {
      if (!ids.has(ponta) && !idsPropostas.has(ponta)) {
        avisos.push(`proposta ${s.id} usa ponta inexistente: ${ponta}`);
      }
    }
  }
  if (s.passos?.length && !s.arestas?.length) {
    avisos.push(`proposta ${s.id} traz passo novo e nenhuma aresta: ele nasceria solto`);
  }

  for (const d of s.depende ?? []) {
    if (!PROPOSTAS.some((o) => o.id === d)) avisos.push(`proposta ${s.id} depende de ${d}, que não existe`);
  }

  /**
   * 🔴 TRAVA DA LINHA DUPLICADA (11/09, print do Pedro).
   *
   * Eu escrevi "mudar o rótulo de uma aresta" como `substitui` + `arestas`
   * com as MESMAS pontas. Ambíguo por construção, e quebrou nos dois lados:
   * no board apareceram duas linhas idênticas entre P4.5 e P4.6 (a velha, que
   * só morre com o ✓, e a nova), e no simulador o `substitui` apagou as duas,
   * porque ele casa por (de, para) e não sabe distinguir uma da outra.
   *
   * Aresta que só troca de nome usa `rotula`. Criar outra com as mesmas
   * pontas é defeito, e o gerador passa a dizer isso.
   */
  for (const a of s.arestas ?? []) {
    const jaExiste = ARESTAS.some((x) => x.de === a.de && x.para === a.para);
    if (jaExiste) {
      avisos.push(
        `proposta ${s.id} cria uma aresta que já existe (${a.de} → ${a.para}) — ` +
          `se é só o rótulo que muda, use "rotula"`,
      );
    }
  }
  for (const r of s.rotula ?? []) {
    if (!ARESTAS.some((x) => x.de === r.de && x.para === r.para)) {
      avisos.push(`proposta ${s.id} quer renomear aresta que não existe: ${r.de} → ${r.para}`);
    }
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 SIMULADOR DE CAMINHOS — não matar um caminho consertando outro.
 * ═══════════════════════════════════════════════════════════════════════════
 * Travado em 11/09, a pedido do Pedro: *"parece que você não está sabendo
 * lidar com múltiplos caminhos, e nesse trabalho isso será o mais comum de
 * todos. Preciso que a gente não mate um caminho corrigindo outro."*
 *
 * Ele está certo, e o placar do dia prova: o P4.6 foi reescrito TRÊS vezes,
 * e as três correções foram dele, não minhas. Sempre o mesmo erro — eu olhava
 * o nó pelo ramo em que estava trabalhando (o de acima de R$ 50) e esquecia
 * que ele também servia o outro (o de até R$ 50). Na 3ª eu propus REMOVER um
 * nó que estava vivo pro ramo da fatura.
 *
 * 🔑 Regra escrita não resolve isso sozinha: a doutrina já tinha o §5
 * ("sintoma repetido = bug de raiz") e eu errei três vezes no mesmo nó. O que
 * resolve é a máquina conferir.
 *
 * COMO FUNCIONA. O simulador monta o grafo em três cenários e compara:
 *   · BASE          — nenhuma proposta aceita (o processo como está hoje)
 *   · TODAS         — todas as propostas aceitas
 *   · UMA A UMA     — cada proposta com as suas dependências, sozinha
 *
 * E reporta só o que PIOROU em relação à base: nó que ficou inalcançável, sem
 * entrada ou sem saída. Comparar com a base, e não com o ideal, é o que faz o
 * aviso ser preciso — o P4.9 já não tem saída hoje, e ninguém precisa ouvir
 * isso toda vez que roda o gerador.
 *
 * O cenário UMA A UMA é o que pega o erro do dia: o Pedro pode aceitar S10 e
 * descartar S3, e é aí que caminho morre sem ninguém ver.
 * ═══════════════════════════════════════════════════════════════════════════
 */
function grafoCom(aceitas) {
  const nos = new Set(PASSOS.map((p) => p.id));
  let arestas = ARESTAS.map((a) => ({ de: a.de, para: a.para }));

  for (const s of PROPOSTAS) {
    if (!aceitas.has(s.id)) continue;
    for (const p of s.passos ?? []) nos.add(p.id);
    for (const r of s.remove ?? []) nos.delete(r);
    arestas.push(...(s.arestas ?? []).map((a) => ({ de: a.de, para: a.para })));
    // aresta aposentada só morre quando a proposta que a aposenta é aceita
    for (const x of s.substitui ?? []) {
      arestas = arestas.filter((a) => !(a.de === x.de && a.para === x.para));
    }
  }

  // ponta solta não conta como ligação: nó removido leva as arestas dele junto
  arestas = arestas.filter((a) => nos.has(a.de) && nos.has(a.para));
  return { nos, arestas };
}

/** O mesmo cenário do `grafoCom`, mas guardando o rótulo de cada aresta. */
function grafoRotulado(aceitas) {
  const nos = new Set(PASSOS.map((p) => p.id));
  let ar = ARESTAS.map((a) => ({ de: a.de, para: a.para, label: a.label ?? "" }));
  for (const s of PROPOSTAS) {
    if (!aceitas.has(s.id)) continue;
    for (const p of s.passos ?? []) nos.add(p.id);
    for (const r of s.remove ?? []) nos.delete(r);
    ar.push(...(s.arestas ?? []).map((a) => ({ de: a.de, para: a.para, label: a.label ?? "" })));
    for (const x of s.substitui ?? []) ar = ar.filter((a) => !(a.de === x.de && a.para === x.para));
    for (const r of s.rotula ?? []) {
      for (const a of ar) if (a.de === r.de && a.para === r.para) a.label = r.label ?? "";
    }
  }
  return ar.filter((a) => nos.has(a.de) && nos.has(a.para));
}

function defeitos({ nos, arestas }) {
  const entradas = new Set(
    PROCESSOS.map((pr) => PASSOS.find((p) => p.processo === pr.id)?.id).filter((id) => nos.has(id)),
  );
  const saiDe = new Map();
  const chegaEm = new Set();
  for (const a of arestas) {
    if (!saiDe.has(a.de)) saiDe.set(a.de, []);
    saiDe.get(a.de).push(a.para);
    chegaEm.add(a.para);
  }

  const visto = new Set(entradas);
  const fila = [...entradas];
  while (fila.length) {
    for (const proximo of saiDe.get(fila.shift()) ?? []) {
      if (!visto.has(proximo)) {
        visto.add(proximo);
        fila.push(proximo);
      }
    }
  }

  /**
   * Passo com `forma: "fim"` é terminal POR DECLARAÇÃO: ele não tem saída de
   * propósito, e cobrar uma seria ruído. Quem não declara e mesmo assim não
   * sai continua sendo avisado — a diferença entre "acabou aqui" e "esqueci
   * de ligar" é justamente essa declaração.
   */
  const formaDe = new Map([
    ...PASSOS.map((p) => [p.id, p.forma]),
    ...PROPOSTAS.flatMap((s) => (s.passos ?? []).map((p) => [p.id, p.forma])),
  ]);

  const fora = new Set();
  for (const id of nos) {
    if (!visto.has(id)) fora.add(`${id} virou inalcançável`);
    if (!chegaEm.has(id) && !entradas.has(id)) fora.add(`${id} ficou sem entrada`);
    if (!(saiDe.get(id) ?? []).length && formaDe.get(id) !== "fim") {
      fora.add(`${id} ficou sem saída`);
    }
  }
  return fora;
}

if (PROPOSTAS.length) {
  const base = defeitos(grafoCom(new Set()));
  const piorou = (cenario) => [...defeitos(grafoCom(cenario))].filter((d) => !base.has(d));

  for (const d of piorou(new Set(PROPOSTAS.map((s) => s.id)))) {
    avisos.push(`com TODAS as propostas aceitas: ${d}`);
  }

  /**
   * 🔴 BIFURCAÇÃO PELA METADE (11/09, achado do Pedro).
   *
   * Ele viu o P4.5 com dois CTAs escritos "segue" — rótulo que EU inventei
   * num fallback, pra duas arestas que não tinham condição nenhuma. O board
   * já não inventa mais. Aqui fica a outra metade: se um passo tem saídas
   * condicionais E saídas sem condição, o desenho está pela metade, e é o
   * dado que está errado, não a tela.
   */
  {
    const tudo = new Set(PROPOSTAS.map((s) => s.id));
    const g = grafoRotulado(tudo);
    const porNo = new Map();
    for (const a of g) {
      if (!porNo.has(a.de)) porNo.set(a.de, []);
      porNo.get(a.de).push(a.label ?? "");
    }
    for (const [id, labels] of porNo) {
      if (labels.length < 2) continue;
      const comCondicao = labels.filter(Boolean).length;
      if (comCondicao > 0 && comCondicao < labels.length) {
        avisos.push(
          `${id} bifurca pela metade: ${comCondicao} de ${labels.length} saídas têm condição escrita`,
        );
      }
    }
  }

  for (const s of PROPOSTAS) {
    // a proposta vem com as dependências que ela mesma declara, e só elas:
    // é exatamente assim que o Pedro pode aceitá-la no board
    const comDeps = new Set([s.id]);
    for (let mudou = true; mudou; ) {
      mudou = false;
      for (const o of PROPOSTAS) {
        if (!comDeps.has(o.id)) continue;
        for (const d of o.depende ?? []) if (!comDeps.has(d)) (comDeps.add(d), (mudou = true));
      }
    }
    for (const d of piorou(comDeps)) {
      avisos.push(`aceitando ${s.id} sozinha (+ dependências): ${d}`);
    }
  }
}

// ── saída 1: o grafo do board ───────────────────────────────────────────────
/**
 * 🔑 O grafo carrega TODAS as propostas, inclusive as já descartadas. Quem
 * decide o que aparece é o board, em tempo de execução, lendo as decisões pela
 * `/api/propostas`. Filtrar aqui obrigaria a regenerar o arquivo a cada clique
 * — e aí o ✓ dependeria de alguém rodar um script, que é o oposto do combinado.
 */
const passoDeProposta = PROPOSTAS.flatMap((s) =>
  (s.passos ?? []).map((p) => ({
    ...p,
    proposta: true,
    /** 🔑 o CARTÃO tem id próprio, a DECISÃO é da proposta inteira. Uma
     *  proposta com três passos se aceita de uma vez — ver a trava lá em cima. */
    propostaId: s.id,
    porque: s.porque,
    depende: s.depende ?? [],
    // a cor do SEMÁFORO, não o cinza: cinza é estado de vista (ainda não
    // decidida) e quem aplica é o board. Aceita, o cartão já nasce com a cor
    // certa sem precisar regenerar nada.
    cor: LUZ[p.luz]?.cor ?? "#999",
    tons: { faz: tomDe(p.faz), fala: tomDe(p.fala), ve: tomDe(p.ve) },
  })),
);

/**
 * Arestas de proposta: QUALQUER tipo pode trazer as suas. Não é só o passo
 * novo que rewira o processo — uma mudança de campo que aposenta uma pergunta
 * precisa refazer as ligações dela no MESMO pacote, senão aceitar a mudança
 * sozinha deixa o ramo sem entrada. Foi o que o simulador pegou no S3.
 */
const arestaDeProposta = PROPOSTAS.flatMap((s) =>
  (s.arestas ?? []).map((a) => ({
    de: a.de,
    para: a.para,
    label: a.label ?? "",
    proposta: s.id,
  })),
);

const grafo = {
  gerado: new Date().toISOString().slice(0, 10),
  processos: PROCESSOS,
  nodes: [
    ...PASSOS.map((p) => ({
      ...p,
      cor: LUZ[p.luz]?.cor ?? "#999",
      tons: { faz: tomDe(p.faz), fala: tomDe(p.fala), ve: tomDe(p.ve) },
      // sugestões de CAMPO não viram cartão: viajam junto do passo que miram
      /**
       * Proposta de REMOÇÃO não apaga nada aqui: marca o passo. O board tira
       * da vista só depois do ✓, e as arestas que tocavam nele caem sozinhas
       * porque ele já filtra aresta com ponta faltando. O ✕ devolve tudo.
       */
      removidoPor: PROPOSTAS.find((s) => (s.remove ?? []).includes(p.id))?.id,
      porqueRemover: PROPOSTAS.find((s) => (s.remove ?? []).includes(p.id))?.porque,
      sugestoes: PROPOSTAS.filter((s) => (s.mudancas ?? []).some((m) => m.passo === p.id)).map((s) => ({
        id: s.id,
        titulo: s.titulo ?? "",
        mudancas: (s.mudancas ?? []).filter((m) => m.passo === p.id),
        porque: s.porque,
        depende: s.depende ?? [],
      })),
    })),
    ...passoDeProposta,
  ],
  edges: [
    ...ARESTAS.map((a) => {
      /**
       * Proposta que entra NO MEIO de um caminho aposenta o fio que existia.
       * A aresta velha não some do arquivo: ela carrega o id da proposta que a
       * substitui, e o board a apaga só quando aquela proposta é aceita. Assim
       * o ✕ devolve o desenho anterior inteiro, sem regenerar nada.
       */
      const morta = PROPOSTAS.find((s) =>
        (s.substitui ?? []).some((x) => x.de === a.de && x.para === a.para),
      );
      // renomear é diferente de trocar: a aresta é a MESMA, só muda o que se lê
      const renome = PROPOSTAS.flatMap((s) =>
        (s.rotula ?? [])
          .filter((r) => r.de === a.de && r.para === a.para)
          .map((r) => ({ id: s.id, label: r.label ?? "" })),
      )[0];
      return {
        de: a.de,
        para: a.para,
        label: a.label ?? "",
        tracejado: !!a.tracejado,
        substituidaPor: morta?.id,
        rotuloNovo: renome?.label,
        rotuladaPor: renome?.id,
      };
    }),
    ...arestaDeProposta.map((a) => ({
      de: a.de,
      para: a.para,
      label: a.label ?? "",
      tracejado: false,
      proposta: a.proposta,
    })),
  ],
};
writeFileSync(SAIDA_JSON, JSON.stringify(grafo, null, 2) + "\n", "utf8");

// ── saída 2: a nota pro dev ─────────────────────────────────────────────────
const contar = (luz, proc) =>
  PASSOS.filter((p) => p.luz === luz && (!proc || p.processo === proc)).length;

const L = [];
L.push("---");
L.push("tipo: derivado");
L.push("status: vivo");
L.push(`data: ${grafo.gerado}`);
L.push("assunto: processos-do-produto");
L.push("gerado_por: execucao/processos/gerar-processos.mjs");
L.push("tags: [execucao, processos, dev, spec]");
L.push("---");
L.push("");
L.push("# 🔗 Processos — o que precisa acontecer, ponta a ponta");
L.push("");
L.push("> ⚠️ **Nota gerada.** Não editar à mão: rode `node execucao/processos/gerar-processos.mjs`. A fonte é `processos-data.mjs`. Regras: [[_doutrina-processos]].");
L.push(">");
L.push("> **Pra quem é:** o dev que vai implementar e o Mauro, que decide as regras de negócio. O mesmo arquivo alimenta o board visual em `/processos`, que é onde o Pedro valida.");
L.push("");
L.push(`**Placar:** ${LUZ.verde.emoji} ${contar("verde")} sabemos e dá · ${LUZ.amarelo.emoji} ${contar("amarelo")} falta decidir · ${LUZ.vermelho.emoji} ${contar("vermelho")} não sabemos`);
L.push("");

for (const pr of PROCESSOS) {
  const meus = PASSOS.filter((p) => p.processo === pr.id);
  L.push("---");
  L.push("");
  L.push(`## ${pr.id} · ${pr.titulo}`);
  L.push("");
  L.push(`> ${pr.resumo}`);
  L.push(">");
  L.push(`> 🔑 **Por que importa:** ${pr.porqueImporta}`);
  L.push("");
  L.push(`${LUZ.verde.emoji} ${contar("verde", pr.id)} · ${LUZ.amarelo.emoji} ${contar("amarelo", pr.id)} · ${LUZ.vermelho.emoji} ${contar("vermelho", pr.id)}`);
  L.push("");
  L.push("| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |");
  L.push("|:--:|---|---|---|---|---|");
  for (const p of meus) {
    const marca = p.forma === "decisao" ? "◆ " : p.forma === "fim" ? "■ " : "";
    L.push(
      `| ${LUZ[p.luz].emoji} | **${p.id}** ${marca}${p.titulo} | ${p.quem} | ${p.faz} | ${p.fala} | ${p.ve} |`
    );
  }
  L.push("");
  L.push("### Por onde o processo caminha");
  L.push("");
  for (const a of ARESTAS.filter((x) => x.de.startsWith(pr.id + "."))) {
    const rot = a.label ? ` — *${a.label}*` : "";
    L.push(`- \`${a.de}\` → \`${a.para}\`${rot}`);
  }
  L.push("");
  const abertos = meus.filter((p) => p.duvida);
  if (abertos.length) {
    L.push("### 🔴 O que precisa ser respondido");
    L.push("");
    L.push("> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.");
    L.push("");
    for (const p of abertos) {
      L.push(`**${LUZ[p.luz].emoji} ${p.id} · ${p.titulo}**`);
      L.push("");
      L.push(p.duvida);
      L.push("");
    }
  }
  // o detalhe técnico não cabe no cartão (§5.1) mas não pode sumir: é o que o
  // dev precisa pra integrar, e é evidência datada
  const comNota = meus.filter((p) => p.falaNota);
  if (comNota.length) {
    L.push("### Detalhe técnico");
    L.push("");
    for (const p of comNota) L.push(`- **${p.id}** — ${p.falaNota}`);
    L.push("");
  }

  L.push("### Fonte de cada regra");
  L.push("");
  for (const p of meus.filter((x) => x.fonte && x.fonte !== "—")) {
    L.push(`- **${p.id}** — ${p.fonte}`);
  }
  L.push("");
}

writeFileSync(SAIDA_MD, L.join("\n"), "utf8");

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VIGIA DA DOUTRINA — 11/09, pedido do Pedro.
 * ═══════════════════════════════════════════════════════════════════════════
 * *"eu já te preparei com arquivos base pra salvar mudanças e não repetirmos
 * erros, quero saber se isso está se atualizando sozinho"* — e a resposta
 * honesta era **não**. A §6 da doutrina (a tabela de erros que eu já cometi)
 * é prosa: só enche se alguém lembrar de escrever. No mesmo dia em que ela
 * nasceu, dois erros meus ficaram de fora dela.
 *
 * Isto não conserta o problema de verdade — nenhum script escreve a lição no
 * lugar de quem errou. O que ele faz é tirar a lembrança do caminho crítico:
 * o gerador passa a CONTAR quantas mexidas em `/processos` aconteceram desde
 * a última vez que a doutrina mudou, e a falar alto quando a conta passa do
 * limite.
 *
 * 🔑 Por que AVISO e não erro: doutrina não é dado, e código que falha por
 * motivo subjetivo ensina a ignorar o exit code — aí as cinco auditorias de
 * cima, que pegam defeito de verdade, morrem junto. O barulho é de propósito;
 * a barreira seria contraproducente.
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * A unidade é a LEVA (um commit, ou a árvore suja de agora), nunca o arquivo:
 * um commit que toca seis arquivos é uma leva, não seis. Somar arquivo com
 * commit faria o vigia gritar por refatoração grande e calar por três levas
 * pequenas — exatamente ao contrário do que interessa.
 * `PROCESSOS_LIMITE=1` força o aviso, pra conferir que ele ainda aparece.
 */
const LIMITE = Number(process.env.PROCESSOS_LIMITE ?? 3);
const DOUTRINA = "execucao/processos/_doutrina-processos.md";
const TERRITORIO = [
  "execucao/processos/processos-data.mjs",
  "app/src/app/processos",
  "app/src/components/processos",
  "app/src/lib/processos-medidas.ts",
  "app/src/app/api/e2e",
  "app/e2e",
];

function git(args) {
  return execFileSync("git", args, { cwd: RAIZ, encoding: "utf8" }).trim();
}

let vigia = null;
try {
  const ultimo = git(["log", "--format=%H", "-n", "1", "--", DOUTRINA]);
  // sem commit na doutrina ainda: nada pra comparar, e avisar seria ruído
  if (ultimo) {
    const desde = Number(git(["rev-list", "--count", `${ultimo}..HEAD`, "--", ...TERRITORIO]));
    // a leva ainda NÃO commitada conta como uma: é justamente a hora de
    // escrever a lição com o erro fresco, antes de ele virar história
    const emCurso = git(["status", "--porcelain", "--", ...TERRITORIO]) !== "" ? 1 : 0;
    // doutrina já sendo editada agora = a lição está sendo escrita. Calar.
    const doutrinaSuja = git(["status", "--porcelain", "--", DOUTRINA]) !== "";
    if (!doutrinaSuja && desde + emCurso >= LIMITE) {
      vigia = {
        levas: desde + emCurso,
        emCurso,
        desde: git(["log", "--format=%cd", "--date=short", "-n", "1", "--", DOUTRINA]),
      };
    }
  }
} catch {
  /* fora de repo git, ou git ausente: o gerador continua sendo o gerador */
}

// ── relatório ───────────────────────────────────────────────────────────────
const nSugestoes = PROPOSTAS.length;
console.log(
  `✓ grafo:  ${SAIDA_JSON.replace(RAIZ, ".")}  (${PASSOS.length} passos, ${ARESTAS.length} arestas` +
    (nSugestoes ? ` + ${nSugestoes} sugestões aguardando o Pedro` : "") +
    ")",
);
console.log(`✓ nota:   ${SAIDA_MD.replace(RAIZ, ".")}`);
console.log(`  placar: ${LUZ.verde.emoji} ${contar("verde")} · ${LUZ.amarelo.emoji} ${contar("amarelo")} · ${LUZ.vermelho.emoji} ${contar("vermelho")}`);
if (avisos.length) {
  console.log(`\n⚠️  ${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`   · ${a}`);
  process.exitCode = 1;
} else {
  console.log("✓ auditorias limpas");
}

if (vigia) {
  console.log("");
  console.log("┌─────────────────────────────────────────────────────────────────────┐");
  console.log("│ 📓 A DOUTRINA NÃO MUDA, MAS O TERRITÓRIO SIM                        │");
  console.log("└─────────────────────────────────────────────────────────────────────┘");
  console.log(`   ${vigia.levas} leva(s) em /processos desde a última edição da doutrina`);
  console.log(
    `   (parada desde ${vigia.desde}${vigia.emCurso ? " · uma delas é a que está na árvore agora" : ""})`,
  );
  console.log("");
  console.log("   A §6 só enche se alguém escrever. A pergunta que ela responde:");
  console.log("   → nessa leva, o que quebrou por um motivo que vai voltar?");
  console.log("");
  console.log(`   Se nada quebrou, ignore. Se quebrou: ${DOUTRINA} §6`);
}
