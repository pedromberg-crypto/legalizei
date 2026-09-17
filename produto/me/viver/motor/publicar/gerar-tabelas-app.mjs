/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 O GERADOR QUE MATA A DUPLICAÇÃO — `_tabelas.mjs` → `app/src/lib/`
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/motor-fiscal/gerar-tabelas-app.mjs`
 *
 * 🔴 **O PROBLEMA QUE ELE RESOLVE.** Até 14/09 existiam DUAS fontes das mesmas
 * constantes fiscais: `app/src/lib/fiscal.ts` e `execucao/motor-fiscal/
 * _tabelas.mjs`. **7 de 7 valores duplicados**, e só não tinham divergido
 * porque coincidiam. O salário mínimo muda **todo janeiro**: bastava alguém
 * atualizar um lado.
 *
 * 🔑 **A saída é o padrão que o vault já usa** para `dados-constituicao.ts`,
 * `processos-graph.json` e `cru-graph.json`: o dado mora num `.mjs` do
 * `execucao/`, um gerador emite o que o app consome, e **o arquivo gerado não
 * se edita**. Divergir deixa de ser possível — não por disciplina, por
 * construção.
 *
 * ⚠️ Só constantes atravessam. **Lógica não se gera** — quem calcula é o
 * `apurador.mjs`, e quem precisa dele importa dele.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from "node:fs";
import path from "node:path";
import { PREVIDENCIA, FATOR_R, FAIXAS, IRRF } from "../regra/_tabelas.mjs";
import { RAIZ } from "../_raiz.mjs";

const DESTINO = path.join(RAIZ, "app", "src", "lib", "fiscal-tabelas.ts");

const linhas = [
  "/**",
  " * ═══════════════════════════════════════════════════════════════════════════",
  " * 🤖 ARQUIVO GERADO — NÃO EDITAR À MÃO.",
  " * ═══════════════════════════════════════════════════════════════════════════",
  " * Fonte: `execucao/motor-fiscal/_tabelas.mjs`",
  " * Gerador: `node execucao/motor-fiscal/gerar-tabelas-app.mjs`",
  " *",
  " * Editar aqui não muda o cálculo — o motor lê a fonte, não este arquivo — e",
  " * some na próxima rodada do gerador. Mexa em `_tabelas.mjs`.",
  " *",
  " * 🔑 Só CONSTANTES atravessam. Lógica fiscal mora no `apurador.mjs`.",
  ` * Gerado em ${new Date().toISOString().slice(0, 10)}.`,
  " * ═══════════════════════════════════════════════════════════════════════════",
  " */",
  "",
  "export const FISCAL = {",
  `  /** Piso do pró-labore. Decreto 12.797/2025 + tabela do INSS. **Muda todo janeiro.** */`,
  `  SALARIO_MIN: ${PREVIDENCIA.SALARIO_MINIMO},`,
  `  /** Portaria Interministerial MPS/MF nº 13 de 09/01/2026, art. 2º. */`,
  `  TETO_INSS: ${PREVIDENCIA.TETO_INSS},`,
  `  /** Retenção do sócio contribuinte individual no Simples III/V (IN RFB 2.110/2022 art. 43 I). */`,
  `  INSS_ALIQ: ${PREVIDENCIA.ALIQUOTA_SOCIO},`,
  `  /** A LEI: folha ÷ receita ≥ 28% puxa do Anexo V pro III (LC 123 art. 18 §5º-J). */`,
  `  FATOR_R_LIMIAR: ${FATOR_R.LIMIAR},`,
  `  /** RECOMENDAÇÃO NOSSA (UX-39), não lei: cravar 28% deixa a empresa a um mês ruim de cair. */`,
  `  FATOR_R_MARGEM: ${FATOR_R.MARGEM},`,
  `  /** Alíquota de entrada, 1ª faixa. */`,
  `  ANEXO_III: ${FAIXAS.III[0].nominal},`,
  `  ANEXO_V: ${FAIXAS.V[0].nominal},`,
  "",
  "  /**",
  "   * 🔴 O REDUTOR DO IRRF — e o nome antigo estava errado.",
  "   *",
  "   * Até 14/09 este número vivia aqui como `IRRF_ISENCAO: 5000`, descrito como",
  '   * "isenção efetiva/mês". **Não é isenção.** A Lei 15.270/2025 não criou',
  "   * faixa isenta: ela criou um REDUTOR (Lei 9.250/1995 art. 3º-A) aplicado",
  "   * depois da tabela. Até este teto ele zera o imposto; acima, decai em rampa",
  `   * até R$ ${IRRF.redutor.tetoRampa}. Quem lesse o nome antigo implementaria uma faixa`,
  "   * isenta que a lei não criou.",
  "   */",
  `  IRRF_REDUTOR_TETO: ${IRRF.redutor.tetoIsencao},`,
  `  IRRF_REDUTOR_RAMPA: ${IRRF.redutor.tetoRampa},`,
  "} as const;",
  "",
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 PUBLICAR VIRA VERIFICAR — travado em 17/09
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 O BURACO QUE ISTO FECHA.
 *
 * Este gerador existia desde 14/09 e **nunca rodava na pipeline** — estava na
 * lista de dispensados como *"escreve dentro do app/, é publicação, não
 * verificação"*. Consequência: o `fiscal-tabelas.ts` que o app consome podia
 * estar velho em relação ao motor por tempo indefinido, e **nada avisaria**.
 *
 * Em 17/09 eu conferi e ele estava em dia. Por disciplina, não por trava — e
 * disciplina é exatamente o que a auditoria daquele dia provou não bastar: os
 * docs gerados tiveram zero deriva, os mantidos à mão tiveram 7 de 7.
 *
 * ✅ Agora ele **compara antes de escrever**. Se o conteúdo mudou, o app
 * estava defasado do motor: o arquivo é atualizado e a rodada **cai**, para
 * que alguém olhe e commite em vez de descobrir meses depois.
 *
 * 🔑 Publicar sem conferir não é publicar — é torcer.
 */
const anterior = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, "utf8") : null;
const novo = linhas.join("\n");

console.log("🔗 tabelas fiscais → app");
console.log(`   ${path.relative(RAIZ, DESTINO)}`);
console.log(`   ${Object.keys(PREVIDENCIA).length + 2 + 2 + 2} constantes, fonte única em _tabelas.mjs`);

if (anterior === novo) {
  console.log("✓ o app já estava EM DIA com o motor — nada a publicar\n");
  process.exit(0);
}

fs.writeFileSync(DESTINO, novo, "utf8");

if (anterior === null) {
  console.log("✓ arquivo criado pela primeira vez\n");
  process.exit(0);
}

console.log("\n🔴 O APP ESTAVA DEFASADO DO MOTOR — e agora foi atualizado.\n");
console.log("   As constantes do `_tabelas.mjs` mudaram e o arquivo publicado");
console.log("   no app não tinha acompanhado. Ele acabou de ser reescrito.\n");
console.log("   ↳ Confira o diff e commite. A rodada cai de propósito: publicação");
console.log("     que ninguém percebe é a mesma coisa que publicação que não houve.\n");
process.exit(1);
