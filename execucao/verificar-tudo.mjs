/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧷 UM COMANDO SÓ — a porta de entrada da validação de /processos
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/verificar-tudo.mjs`
 *
 * Pedido do Pedro em 16/09, e as palavras dele são a especificação:
 *
 *   *"quero de fato ter 100% de segurança para seguir validando processos…
 *   sinto que estamos delirando demais entre uma varredura e outra, sinto que
 *   você muitas vezes erra e na mesma resposta conserta."*
 *
 * ── 🔴 O PROBLEMA QUE ELE DESCREVEU, dito em mecânica ──────────────────────
 *
 * Não faltavam travas. Faltava **ordem obrigatória**. Em 17/09 existiam 14
 * scripts de verificação e geração espalhados por 6 pastas, e a única coisa
 * que dizia quais rodar e em que ordem era a minha memória da sessão. Uma
 * rodada esquecida não avisa: ela **passa**.
 *
 * 🔑 E a ordem não é estética, é causal:
 *
 *   1. As FONTES (`_persona.mjs`, `processos-data.mjs`, `cru/*.mjs`) mudam.
 *   2. Os GERADORES releem as fontes e reescrevem os docs. As travas de
 *      escopo e de persona rodam DENTRO deles — gerar é verificar.
 *   3. Só então as SUÍTES fazem sentido: elas medem o motor, e o motor é o
 *      que os docs recém-gerados descrevem.
 *   4. E a DEFASAGEM vem por último, porque ela compara o que está escrito
 *      com o que as suítes acabaram de medir. Rodar antes é comparar com
 *      número velho e receber verde falso.
 *
 * ── ⚠️ O QUE ESTE SCRIPT NÃO É ─────────────────────────────────────────────
 *
 * Não é uma trava nova, e não verifica nada por conta própria. É **ordem e
 * cobertura**: garante que todo verificador existente rodou, na sequência
 * certa, e que nenhum foi esquecido. Quem acha defeito continua sendo cada
 * um deles.
 *
 * 🔒 E ele se recusa a ficar desatualizado: o bloco final varre o repositório
 * atrás de `verificar-*.mjs` e `gerar-*.mjs` e **derruba a rodada** se achar
 * um que não esteja nem na lista de execução nem na de dispensa justificada.
 * Sem isso, a próxima trava que eu escrever nasceria órfã — que foi
 * exatamente o que aconteceu com o `verificar-defasagem.mjs` no dia em que
 * ele nasceu.
 *
 * 🔴 FORA DAQUI, e de propósito: Playwright/E2E. Regra travada em 30/08 e
 * reforçada 3×: **só roda quando o Pedro pede**, e um "pode rodar" vale para
 * aquela rodada, não para a sessão.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { execFileSync } from "node:child_process";
import { writeFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · A ORDEM — e a razão de cada etapa estar onde está
 * ═══════════════════════════════════════════════════════════════════════════ */

const ETAPAS = [
  {
    fase: "1 · GERAR — as fontes viram doc, e as travas rodam dentro",
    porque:
      "PROCESSOS.md, SAIDAS.md, cru/*.md e PERSONA.md são GERADOS. " +
      "verificar-escopo e verificar-persona vivem dentro destes três.",
    scripts: [
      "execucao/processos/gerar-processos.mjs",
      "execucao/processos/gerar-persona.mjs",
      "execucao/processos/cru/gerar-cru.mjs",
    ],
  },
  {
    fase: "2 · O MOTOR — ponto contra recibo, propriedade contra a lei",
    porque:
      "O apurador afirma VALOR num ponto (há recibo do PGDAS-D). As equações " +
      "afirmam PROPRIEDADE em todo o domínio (40 pontos certos não provam a " +
      "curva entre eles). As vidas afirmam RELAÇÃO ao longo de uma história.",
    scripts: [
      "produto/me/viver/motor/provar/verificar-apurador.mjs",
      "produto/me/viver/motor/provar/verificar-equacoes.mjs",
      "produto/me/viver/motor/provar/verificar-piloto.mjs",
      "produto/me/viver/motor/provar/verificar-encerrados.mjs",
      "produto/me/viver/motor/provar/verificar-retrato.mjs",
      "produto/me/viver/motor/provar/verificar-vidas.mjs",
      "produto/me/viver/motor/provar/verificar-etiquetas.mjs",
      "produto/me/viver/motor/provar/auditar-agregacao.mjs",
      // 🔑 Não é do motor: audita a etiqueta `autoridade:` do vault inteiro.
      "execucao/verificar-autoridade.mjs",
    ],
  },
  {
    fase: "3 · O CICLO — as obrigações, competência a competência",
    porque: "Não é teste de cálculo: é cobertura de CANAL. O que o app faz sozinho e o que não faz.",
    scripts: ["produto/me/viver/motor/rodar/rodar-ciclo.mjs"],
  },
  {
    fase: "4 · A DEFASAGEM — por último, e só por último",
    porque:
      "Ela compara número escrito com número MEDIDO. Rodar antes das suítes " +
      "é comparar com a medição anterior e receber verde falso.",
    scripts: ["execucao/verificar-defasagem.mjs"],
  },
  {
    fase: "5 · PUBLICAR — a entrega, e só depois de tudo verde",
    porque:
      "O que sai daqui é o motor VALIDADO virando arquivo que outro consome: " +
      "as constantes que o app lê e as fixtures que o dev roda. Publicar antes " +
      "das travas seria publicar o que ainda não passou — e as duas conferem a " +
      "si mesmas, contra o arquivo anterior e contra o congelado dos legíveis.",
    scripts: [
      "produto/me/viver/motor/publicar/gerar-tabelas-app.mjs",
      "produto/me/viver/motor/publicar/gerar-entrega.mjs",
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · O QUE FICA DE FORA, com o motivo escrito
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Dispensa é DECISÃO, não esquecimento — mesma regra da doutrina de
 * capacidades. Quem sai daqui sai com linha de justificativa.
 */
const DISPENSADOS = {
  "execucao/flow/gerar-mapa.mjs": "flow de telas, não /processos — roda no fluxo de tela",
  "execucao/flow/gerar-indice-telas.mjs": "derivado do gerar-mapa, roda junto com ele",
  "execucao/flow/verificar-anatomia-mei.mjs": "roda DENTRO do gerar-mapa.mjs",
  "execucao/flow/verificar-fronteira-mei.mjs": "roda DENTRO do gerar-mapa.mjs",
  "execucao/flow/verificar-mei.mjs": "ramo MEI — fora do escopo padrão (ME abrir empresa)",
  "execucao/processos/verificar-escopo.mjs": "roda DENTRO dos 3 geradores da fase 1",
  "execucao/processos/verificar-persona.mjs": "roda DENTRO dos 3 geradores da fase 1",
  "execucao/portal/gerar-mapa-portal.mjs": "portal do cliente, outra frente",
  "execucao/handoff/gerar-handoff.mjs": "pacote para o dev, sob demanda",
  "execucao/gerar-placar-mauro.mjs": "reporte ao sócio — roda no /fechar, não aqui",
  "produto/gerar-funcionalidades.mjs": "inventário de produto, outra frente",
  "_sistema/pdf/gerar-pdf.mjs": "utilitário de exportação",
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · RODAR
 * ═══════════════════════════════════════════════════════════════════════════ */

const soLista = process.argv.includes("--lista");

console.log(`\n${"═".repeat(84)}`);
console.log("🧷 VERIFICAR TUDO — a ordem que a validação de /processos exige");
console.log("═".repeat(84));

const resultados = [];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📥 MEDIR UMA VEZ — e passar adiante
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 Até 17/09 a trava de defasagem, que roda por último, **re-executava
 * quatro suítes** que esta pipeline tinha acabado de rodar. Custava ~650ms.
 *
 * 🔑 E o desperdício era o menor dos dois problemas. O grave é que ela
 * comparava a prosa com uma **medição diferente** da que acabara de
 * acontecer. Duas execuções do mesmo teste deveriam dar o mesmo número — e
 * "deveria" é exatamente o tipo de premissa que estas travas existem para
 * não aceitar.
 *
 * Cada etapa deposita a saída aqui, e quem vier depois lê em vez de medir.
 * O arquivo vive fora do repositório, na pasta temporária do sistema: é
 * cache de uma rodada, não artefato.
 */
const saidas = {};
const ARQUIVO_DAS_SAIDAS = join(tmpdir(), `legalizai-saidas-${process.pid}.json`);
writeFileSync(ARQUIVO_DAS_SAIDAS, "{}", "utf8");

for (const etapa of ETAPAS) {
  console.log(`\n▸ ${etapa.fase}`);
  console.log(`  ${etapa.porque}\n`);

  for (const s of etapa.scripts) {
    if (soLista) {
      console.log(`     ⏭  ${s}`);
      continue;
    }
    const rotulo = s.padEnd(42);
    try {
      const saida = execFileSync("node", [resolve(RAIZ, s)], {
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        env: { ...process.env, SAIDAS_JA_MEDIDAS: ARQUIVO_DAS_SAIDAS },
      });
      // 🔑 Guarda a saída para quem vier depois não precisar rodar de novo.
      saidas[s] = saida;
      writeFileSync(ARQUIVO_DAS_SAIDAS, JSON.stringify(saidas), "utf8");
      // 🔑 Só a última linha com conteúdo: o placar de cada script já é a
      // frase que ele escolheu para se resumir. Repetir a saída inteira aqui
      // transformaria o verde num muro de texto que ninguém lê.
      const resumo = saida.trim().split(/\r?\n/).filter(Boolean).pop() ?? "";
      console.log(`     ✅ ${rotulo} ${resumo.slice(0, 70)}`);
      resultados.push({ s, ok: true });
    } catch (e) {
      const saida = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();
      console.log(`     🔴 ${rotulo} FALHOU`);
      resultados.push({ s, ok: false, saida });
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 4 · A AUDITORIA DE COBERTURA — o script se recusa a envelhecer
 * ═══════════════════════════════════════════════════════════════════════════ */

function varrer(dir, achados = []) {
  for (const nome of readdirSync(dir)) {
    if (nome === "node_modules" || nome === ".git" || nome === ".claude") continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) varrer(caminho, achados);
    else if (/^(verificar|gerar|auditar)-.*\.mjs$/.test(nome)) achados.push(caminho);
  }
  return achados;
}

/**
 * 🔑 Desde 17/09 todo caminho aqui é contado da RAIZ do vault, não de
 * `execucao/`. Antes era relativo a esta pasta, e funcionou enquanto tudo que
 * a pipeline rodava morava dentro dela — dois já precisavam de `../produto`.
 * Com o motor em `produto/me/viver/`, metade da fila viraria `../`, e caminho
 * que sobe é caminho que ninguém confere de bater o olho.
 */
const conhecidos = new Set([
  ...ETAPAS.flatMap((e) => e.scripts),
  ...Object.keys(DISPENSADOS),
  "execucao/verificar-tudo.mjs",
]);

const orfas = varrer(RAIZ)
  .map((c) => relative(RAIZ, c).split(sep).join("/"))
  .filter((c) => !conhecidos.has(c));

console.log(`\n${"─".repeat(84)}`);

if (orfas.length) {
  console.log("\n🔴 VERIFICADOR ÓRFÃO — existe e ninguém manda rodar:\n");
  for (const o of orfas) console.log(`   ${o}`);
  console.log(
    "\n   ↳ Ponha em ETAPAS (para rodar) ou em DISPENSADOS (com o motivo escrito).\n" +
      "     🔑 Trava que ninguém roda é trava que não existe — e foi assim que\n" +
      "     o verificar-defasagem.mjs passou o dia do nascimento sem dono.\n"
  );
  process.exit(1);
}

const falhas = resultados.filter((r) => !r.ok);

if (falhas.length) {
  console.log(`\n🔴 ${falhas.length} ETAPA(S) FALHARAM:\n`);
  for (const f of falhas) {
    console.log(`   ── ${f.s}`);
    console.log(
      f.saida
        .split(/\r?\n/)
        .slice(-14)
        .map((l) => `      ${l}`)
        .join("\n")
    );
    console.log("");
  }
  process.exit(1);
}

if (soLista) {
  console.log("\n📋 Lista só. Nada rodou.\n");
  process.exit(0);
}

console.log(`\n✅ ${resultados.length} etapas passaram, na ordem, e nenhum verificador ficou órfão.\n`);
console.log("⚠️  O que isto NÃO prova: que o raciocínio está certo. As travas");
console.log("   pegam número, vocabulário, contradição e ausência — não pegam");
console.log("   uma regra bem escrita e errada. Isso ainda é o contador.\n");
