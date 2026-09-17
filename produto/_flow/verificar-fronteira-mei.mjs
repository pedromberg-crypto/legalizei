#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A FRONTEIRA MEI ↔ ME — trava de contato, não de conteúdo.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. Pedido do Pedro, com todas as letras: *"preciso que a gente se
 * certifique desde agora que não vamos alterar em nada as telas de ME"*.
 *
 * Promessa verbal não segura fronteira — a de 28/08 não segurou. O ramo MEI
 * foi construído dentro dos componentes do ME, guardado por uma prop, e mesmo
 * assim herdou 4 defeitos em 8 dias porque o ME mudou embaixo dele. Ninguém
 * errou; o arranjo é que permitia.
 *
 * Esta trava faz 3 perguntas, e cada uma fecha um jeito diferente de o
 * contato voltar a existir:
 *
 *   1️⃣ **IMPORTAÇÃO** — algum arquivo do ramo MEI importa uma tela do ME?
 *      É o vazamento silencioso: importar `SocioView` "só pra reaproveitar"
 *      recria a herança inteira numa linha, sem ninguém perceber.
 *
 *   2️⃣ **REFERÊNCIA REVERSA** — alguma tela do ME importa algo do ramo MEI?
 *      O mesmo estrago na direção contrária: o ME passaria a quebrar quando
 *      o MEI mudasse.
 *
 *   3️⃣ **DIFF** (`--diff`) — esta rodada de trabalho tocou arquivo de tela do
 *      ME? Roda antes do commit. É a pergunta do Pedro, literal.
 *
 * ⚠️ O que ela NÃO faz: julgar conteúdo. Uma tela MEI pode dizer "Junta
 * Comercial" e passar aqui — quem pega isso é `verificar-mei.mjs`, que olha
 * vocabulário. As duas se completam: esta cuida do ACOPLAMENTO, aquela do
 * TEXTO.
 *
 * Uso:
 *   node produto/_flow/verificar-fronteira-mei.mjs          → 1️⃣ e 2️⃣
 *   node produto/_flow/verificar-fronteira-mei.mjs --diff   → + 3️⃣
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { RAIZ } from "../_raiz.mjs";
const SRC = join(RAIZ, "app", "src");

/* ─── O QUE É "RAMO MEI" ────────────────────────────────────────────────── */
const TERRITORIO_MEI = [
  join(SRC, "app", "(mei)"),
  join(SRC, "components", "mei"),
];

/* ─── O QUE É "TELA DE ME" ──────────────────────────────────────────────────
   Componentes que renderizam telas do caminho ME. `ui/` fica de fora de
   propósito: ele é o design system, e herdar layout dele é justamente o que a
   gente QUER (foi o pedido do Pedro: "herde lógica dos layouts"). */
const COMPONENTES_ME = [
  "wizard-dossie",
  "wizard-cauda",
  "wizard-dinheiro",
  "wizard-migrar",
  "gate-telas",
  "entrada-lead",
  "entrada",
  "painel",
  "welcome",
  "splash",
  "veredito",
  "saida",
  "encaixe",
  "consultor",
  "conferencia",
  "login",
  "lista-passos",
  "campo-municipio",
  "enviar-sheet",
  "nota-linha",
  "marcas-sociais",
];

/**
 * O que o ramo MEI PODE importar. Tudo o mais é fronteira violada.
 *
 * ✍️ Dois vizinhos entram na lista por NATUREZA, não por conveniência — os
 * dois são primitivos sem copy própria, então importar não herda conteúdo:
 *   · `splash-mensagem` recebe `titulo`/`sub` de quem o usa; o que ele mostra
 *     continua sendo escrito pela tela MEI que o chama;
 *   · `lottie` é player de animação, sem uma palavra dentro.
 * Se um dia qualquer um dos dois ganhar texto próprio, sai da lista.
 */
const IMPORTS_PERMITIDOS = [
  /^@\/components\/ui\//,
  /^@\/components\/mei\//,
  /^@\/components\/splash-mensagem$/,
  /^@\/components\/lottie$/,
  /^@\/lib\//,
  /^next\//,
  /^react$/,
  /^react\//,
];

/* ─── Varredura ─────────────────────────────────────────────────────────── */

function arquivosDe(dir) {
  let saida = [];
  let entradas;
  try {
    entradas = readdirSync(dir);
  } catch {
    return saida; // território ainda não existe (primeira rodada)
  }
  for (const nome of entradas) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) {
      saida = saida.concat(arquivosDe(caminho));
    } else if (/\.tsx?$/.test(nome)) {
      saida.push(caminho);
    }
  }
  return saida;
}

/** Todo especificador de import de um arquivo. */
function importsDe(caminho) {
  const texto = readFileSync(caminho, "utf8");
  const achados = [];
  const re = /^\s*import\s[^'"]*['"]([^'"]+)['"]/gm;
  let m;
  while ((m = re.exec(texto))) achados.push(m[1]);
  return achados;
}

const rel = (p) => relative(RAIZ, p).split(sep).join("/");

const problemas = [];

/* 1️⃣ O ramo MEI importa tela de ME? */
const arquivosMei = TERRITORIO_MEI.flatMap(arquivosDe);
for (const arq of arquivosMei) {
  for (const imp of importsDe(arq)) {
    if (imp.startsWith(".")) continue; // relativo dentro do próprio ramo
    if (IMPORTS_PERMITIDOS.some((re) => re.test(imp))) continue;
    problemas.push({
      tipo: "IMPORT PROIBIDO",
      arquivo: rel(arq),
      detalhe: `importa "${imp}", que está fora da lista permitida`,
      porque:
        "o ramo MEI só herda o design system (@/components/ui), o domínio (@/lib) e ele mesmo",
    });
  }
}

/**
 * As 3 superfícies de REVISÃO ficam de fora da checagem reversa, e a exceção é
 * estrutural: `/apresentacao`, `/mapa` e `/mockup` existem justamente pra
 * mostrar TODAS as telas do produto lado a lado. Elas importam dos dois ramos
 * por definição — é o espelho da regra 1 do CLAUDE.md ("mapa é espelho da
 * apresentação"). Não são telas de cliente, e nada que acontece nelas chega no
 * app real.
 */
const SUPERFICIES_DE_REVISAO = [
  "app/apresentacao",
  "app/mapa",
  "app/mockup",
  "components/mapa",
];

/* 2️⃣ Alguma tela de ME importa o ramo MEI? */
const arquivosApp = arquivosDe(join(SRC, "app")).concat(
  arquivosDe(join(SRC, "components")),
);
for (const arq of arquivosApp) {
  if (TERRITORIO_MEI.some((t) => arq.startsWith(t))) continue;
  const relativo = relative(SRC, arq).split(sep).join("/");
  if (SUPERFICIES_DE_REVISAO.some((s) => relativo.startsWith(s))) continue;
  for (const imp of importsDe(arq)) {
    if (/^@\/components\/mei\//.test(imp)) {
      problemas.push({
        tipo: "REFERÊNCIA REVERSA",
        arquivo: rel(arq),
        detalhe: `importa "${imp}"`,
        porque:
          "tela de ME não pode depender do ramo MEI: mudar o MEI passaria a quebrar o ME",
      });
    }
  }
}

/* 3️⃣ Esta rodada tocou tela de ME? */
const querDiff = process.argv.includes("--diff");
let tocados = [];
if (querDiff) {
  let saida = "";
  try {
    saida = execSync("git status --porcelain", { cwd: RAIZ, encoding: "utf8" });
  } catch {
    console.error("⚠️  não deu pra ler o git status; pulando a checagem de diff");
  }
  const mudados = saida
    .split("\n")
    .map((l) => l.slice(3).trim())
    .filter(Boolean)
    .map((l) => (l.includes(" -> ") ? l.split(" -> ")[1] : l))
    .map((l) => l.replace(/^"|"$/g, ""));

  for (const arquivo of mudados) {
    const ehTelaMe =
      COMPONENTES_ME.some((c) => arquivo === `app/src/components/${c}.tsx`) ||
      /^app\/src\/app\/\((app|wizard)\)\//.test(arquivo);
    if (ehTelaMe) tocados.push(arquivo);
  }
}

/* ─── Relatório ─────────────────────────────────────────────────────────── */

console.log("═══ FRONTEIRA MEI ↔ ME ═══\n");
console.log(`Arquivos no ramo MEI: ${arquivosMei.length}`);
console.log(`Telas de ME sob guarda: ${COMPONENTES_ME.length} componentes + rotas (app)/(wizard)\n`);

if (problemas.length === 0) {
  console.log("✅ Fronteira intacta: nenhum contato entre os dois ramos.\n");
} else {
  console.log(`🔴 ${problemas.length} violação(ões) de fronteira:\n`);
  for (const p of problemas) {
    console.log(`  ${p.tipo} — ${p.arquivo}`);
    console.log(`     ${p.detalhe}`);
    console.log(`     → ${p.porque}\n`);
  }
}

if (querDiff) {
  if (tocados.length === 0) {
    console.log("✅ Diff limpo: nenhuma tela de ME foi tocada nesta rodada.\n");
  } else {
    console.log(`🔴 ${tocados.length} tela(s) de ME tocada(s) nesta rodada:\n`);
    for (const t of tocados) console.log(`  · ${t}`);
    console.log(
      "\n  → Se foi de propósito (ex: o ponto de fork no E3.2), tudo bem;\n" +
        "    mas tem que ser DECISÃO, não efeito colateral. Confira o diff.\n",
    );
  }
}

const falhou = problemas.length > 0 || (querDiff && tocados.length > 0);
process.exit(falhou ? 1 : 0);
