// AUDITORIA DE CONTRADIÇÕES — o que o Léo lê, tema a tema.
//
// 🔴 POR QUE ESTE SCRIPT EXISTE (24/09/2026, pedido do Pedro). O Léo vinha
// dizendo que a Legalizai NÃO cuida de folha de pagamento. A correção foi
// tentada TRÊS vezes, sempre no mesmo lugar (os cartões), e o comportamento não
// mudou — sinal de que o problema não estava onde se procurava.
//
// 🔑 A SUSPEITA CERTA DO PEDRO: "a chance é enorme de isso estar se
// contradizendo em múltiplos documentos". Ele estava certo sobre o sintoma, e o
// diagnóstico acabou sendo mais incômodo: em alguns temas não há CONTRADIÇÃO,
// há AUSÊNCIA — a fonte que o modelo consulta primeiro simplesmente não fala do
// assunto, e ele preenche o silêncio por analogia com o vizinho mais próximo.
//
// O que este script faz: pra cada tema, mostra o que CADA fonte diz, lado a
// lado, separando afirmação positiva de negativa. Não decide quem está certo —
// mostra onde as fontes divergem e onde alguma se cala.
//
//   node scripts/auditar-contradicoes.mjs            (só o resumo)
//   node scripts/auditar-contradicoes.mjs --tudo     (com as linhas)

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
const REFS = join(RAIZ, "_origem/vault-v12/skills-legalizai/base-legalizai/references");
const DETALHE = process.argv.includes("--tudo");

/**
 * As fontes, na ORDEM DE PESO que elas têm na resposta.
 *
 * ⚠️ A ordem não é decorativa. `RULES`, `PERSONA` e `CARTOES` vão no prompt
 * TODO turno; as notas só chegam se a busca trouxer; a tabela do banco só chega
 * se o modelo chamar a tool. Uma verdade escrita só na camada que ninguém abre
 * é uma verdade que não existe.
 */
const FONTES = [
  { arquivo: "RULES.md", camada: "prompt (todo turno)" },
  { arquivo: "PERSONA.md", camada: "prompt (todo turno)" },
  { arquivo: "CARTOES-PRODUTO.md", camada: "prompt (todo turno)" },
];
for (const f of readdirSync(REFS).filter((x) => x.endsWith(".md")).sort()) {
  FONTES.push({ arquivo: `references/${f}`, camada: "RAG (só se a busca trouxer)" });
}

const TEMAS = [
  {
    nome: "Folha de pagamento / colaborador",
    termos: /folha de pagamento|colaborador|funcion[áa]ri|eSocial|departamento pessoal|rescis[ãa]o|admiss[ãa]o|FGTS/i,
  },
  { nome: "Lista de espera / pré-lançamento", termos: /lista de espera|pr[ée].?lan[çc]amento|em breve|coorte fundador|waitlist/i },
  { nome: "Certificado digital", termos: /certificado digital|certificado A1|e-?CNPJ/i },
  { nome: "Preço e planos", termos: /R\$ ?\d|mensalidade|plano (ME|MEI)|pre[çc]o/i },
  { nome: "Endereço fiscal", termos: /endere[çc]o fiscal/i },
  { nome: "Prazo de abertura", termos: /prazo|quantos dias|em \d+ dias|72 ?h|r[áa]pido/i },
  { nome: "Fator R", termos: /fator r\b/i },
  { nome: "Garantia e cancelamento", termos: /garantia|7 dias|cancelar|fidelidade|multa/i },
  { nome: "Comércio / fora de escopo", termos: /com[ée]rcio|e-?commerce|revenda|ind[úu]stria|loja/i },
];

/** Marcas de afirmação NEGATIVA — o que dizemos que não fazemos. */
const NEGATIVO =
  /\bn[ãa]o (faz|fazemos|atende|atendemos|cuida|cuidamos|inclu|oferec|tem|temos|existe|est[áa]|entra|vem|mande|diga|prometa|invente)|fora do escopo|est[ãa]o fora|nunca (diga|prometa|mencione|afirme)|proibido|`?promessa: ?nao`?/i;
/** Marcas de afirmação POSITIVA — o que dizemos que fazemos. */
const POSITIVO =
  /\b(a gente|n[óo]s|eu) (faz|fazemos|cuido|cuidamos|atende|atendemos|emito|emitimos|entrego)|`?promessa: ?pode`?|[ée] (nosso|nossa)|responsabilidade do nosso time|est[áa] incluso|vem incluso/i;

function linhasDe(caminho) {
  const p = caminho.startsWith("references/") ? join(REFS, caminho.slice(11)) : join(RAIZ, caminho);
  if (!existsSync(p)) return [];
  return readFileSync(p, "utf8")
    .split("\n")
    .map((texto, i) => ({ n: i + 1, texto }))
    .filter((l) => l.texto.trim());
}

const cache = new Map();
const ler = (f) => {
  if (!cache.has(f)) cache.set(f, linhasDe(f));
  return cache.get(f);
};

console.log("═".repeat(78));
console.log(" AUDITORIA DE CONTRADIÇÕES · o que o Léo lê, tema a tema");
console.log("═".repeat(78));
console.log(` ${FONTES.length} fontes · ${TEMAS.length} temas`);
console.log(" ⚠️  prompt = lido TODO turno · RAG = só se a busca trouxer\n");

const alertas = [];

for (const tema of TEMAS) {
  const achados = [];
  for (const fonte of FONTES) {
    const hits = ler(fonte.arquivo).filter((l) => tema.termos.test(l.texto));
    if (!hits.length) continue;
    const neg = hits.filter((l) => NEGATIVO.test(l.texto));
    const pos = hits.filter((l) => POSITIVO.test(l.texto));
    achados.push({ fonte, hits, neg, pos });
  }

  const totalPos = achados.reduce((a, x) => a + x.pos.length, 0);
  const totalNeg = achados.reduce((a, x) => a + x.neg.length, 0);
  const noPrompt = achados.filter((a) => a.fonte.camada.startsWith("prompt"));
  const noRag = achados.filter((a) => a.fonte.camada.startsWith("RAG"));

  // 🔴 Os dois padrões que interessam:
  //    CONFLITO — a mesma coisa afirmada e negada
  //    SILÊNCIO — o tema existe no prompt e some do RAG (ou o contrário)
  let marca = "  ";
  if (totalPos > 0 && totalNeg > 0) {
    marca = "🔴";
    alertas.push({ tema: tema.nome, tipo: "conflito", pos: totalPos, neg: totalNeg, achados });
  } else if (noPrompt.length > 0 && noRag.length === 0) {
    marca = "🟡";
    alertas.push({ tema: tema.nome, tipo: "só no prompt", achados });
  } else if (noRag.length > 0 && noPrompt.length === 0) {
    marca = "🟡";
    alertas.push({ tema: tema.nome, tipo: "só no RAG", achados });
  }

  console.log(`${marca} ${tema.nome}`);
  console.log(
    `     ${achados.length} fonte(s) · ${totalPos} afirmação(ões) positiva(s) · ${totalNeg} negativa(s)`,
  );
  for (const a of achados) {
    const sinal = a.pos.length && a.neg.length ? "⚠️ " : a.neg.length ? "não" : a.pos.length ? "sim" : "—  ";
    console.log(
      `       ${sinal}  ${a.fonte.arquivo.padEnd(46)} ${String(a.hits.length).padStart(3)} linha(s)  [${a.fonte.camada}]`,
    );
    if (DETALHE) {
      for (const l of [...a.neg, ...a.pos].slice(0, 4)) {
        console.log(`             L${l.n}: ${l.texto.trim().slice(0, 110)}`);
      }
    }
  }
  console.log("");
}

console.log("═".repeat(78));
console.log(` ${alertas.length} tema(s) com sinal de alerta`);
console.log("═".repeat(78));
for (const a of alertas) {
  console.log(` ${a.tipo === "conflito" ? "🔴" : "🟡"} ${a.tema} — ${a.tipo}`);
}
console.log("\nRode com --tudo para ver as linhas.");
