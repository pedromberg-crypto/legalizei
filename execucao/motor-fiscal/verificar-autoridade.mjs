/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧭 TRAVA DE AUTORIDADE — arquivo que manda tem que estar no índice.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/motor-fiscal/verificar-autoridade.mjs`
 *
 * Nasceu de uma observação do Pedro em 15/09:
 *
 *   *"às vezes sinto que você está buscando fontes de verdade em diversos
 *   lugares e se contradizendo com essas buscas, que cada vez acontecem em um
 *   lugar diferente."*
 *
 * 🔑 **A causa, medida:** o `_sistema/indice-autoridade.md` existe desde 16/07
 * e responde a pergunta *"qual documento manda neste assunto?"*. Ele estava
 * atualizado até **12/09**. O motor fiscal nasceu em **14/09**, o estado do
 * CNPJ em 14/09, o piloto e os encerrados em 15/09 — **nenhum deles estava no
 * índice**. Sem linha dizendo onde olhar, eu procurava. Procurando em lugares
 * diferentes, achava respostas diferentes.
 *
 * Não era falta de documentação: era **documentação sem dono declarado**.
 *
 * ── O QUE ELA FAZ ──────────────────────────────────────────────────────────
 *
 * Toda fonte-verdade desta área precisa estar citada no índice. Arquivo novo
 * que manda em algum assunto e não entrou lá derruba a rodada — porque é
 * exatamente nesse intervalo que a caça a fontes recomeça.
 *
 * ── ⚠️ O QUE ELA NÃO FAZ ───────────────────────────────────────────────────
 *
 * · Não verifica se a linha do índice está **correta**, só se existe.
 * · Não sabe de arquivos fora desta lista. Área nova precisa ser acrescentada
 *   aqui à mão — e isso é deliberado: a lista ser curta e escrita é o que a
 *   torna confiável.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..");
const INDICE = resolve(RAIZ, "_sistema", "indice-autoridade.md");

/**
 * As fontes-verdade da área fiscal. Cada uma precisa aparecer no índice.
 *
 * 🔑 A lista é escrita à mão de propósito: gerada automaticamente ela pegaria
 * todo arquivo do diretório, inclusive os que não mandam em nada, e o índice
 * viraria inventário — que é outra coisa, e inútil para decidir.
 */
export const FONTES_QUE_MANDAM = [
  { arquivo: "execucao/motor-fiscal/apurador.mjs", assunto: "o cálculo fiscal que roda" },
  { arquivo: "execucao/motor-fiscal/_tabelas.mjs", assunto: "as tabelas e constantes da lei" },
  { arquivo: "execucao/motor-fiscal/piloto-pro-labore.mjs", assunto: "o ajuste automático de pró-labore" },
  { arquivo: "execucao/motor-fiscal/_encerrados.mjs", assunto: "o que não se reabre" },
  { arquivo: "execucao/motor-fiscal/_SUFICIENCIA.md", assunto: "o que está provado, e por qual prova" },
  { arquivo: "execucao/estado-cnpj/_modelo.mjs", assunto: "o estado de um CNPJ" },
  { arquivo: "execucao/estado-cnpj/ciclo-do-cnpj.mjs", assunto: "o calendário de obrigações" },
  { arquivo: "execucao/estado-cnpj/vidas.mjs", assunto: "as personas como empresas vivas" },
  { arquivo: "execucao/estado-cnpj/_achados-do-motor.md", assunto: "os defeitos achados rodando persona" },
  { arquivo: "execucao/estado-cnpj/_cobertura-das-vidas.md", assunto: "o que o elenco não exercita" },
  { arquivo: "execucao/estado-cnpj/_duvidas-contador.md", assunto: "o que sobra para o contador" },
];

if (!existsSync(INDICE)) {
  console.log(`\n🔴 O índice de autoridade não existe em ${INDICE}\n`);
  process.exit(1);
}

const texto = readFileSync(INDICE, "utf8");

const ausentes = FONTES_QUE_MANDAM.filter((f) => {
  // Basta o caminho aparecer — o índice cita por caminho ou por [[wikilink]].
  const nome = f.arquivo.split("/").pop().replace(/\.(mjs|md)$/, "");
  return !texto.includes(f.arquivo) && !texto.includes(`[[${nome}]]`);
});

console.log(`\n${"═".repeat(84)}`);
console.log("🧭 TRAVA DE AUTORIDADE — quem manda está declarado?");
console.log("═".repeat(84));
console.log(`\n${FONTES_QUE_MANDAM.length} fontes-verdade da área fiscal conferidas contra o índice.\n`);

if (!ausentes.length) {
  console.log("✅ Todas estão no `_sistema/indice-autoridade.md`.");
  console.log(
    "   🔑 Antes de procurar fonte para qualquer assunto desta área, a resposta\n" +
      "      está lá. Se não estiver, é porque falta linha — não porque falta doc.\n"
  );
  process.exit(0);
}

console.log(`🔴 ${ausentes.length} fonte(s) que mandam e NÃO estão no índice:\n`);
for (const f of ausentes) {
  console.log(`   ${f.arquivo}`);
  console.log(`      manda em: ${f.assunto}`);
  console.log(`      ↳ acrescente a linha em _sistema/indice-autoridade.md § Tabela de autoridade\n`);
}
console.log(
  "🔑 Este intervalo — fonte existindo sem dono declarado — é onde a caça a\n" +
    "   fontes recomeça, e com ela as respostas contraditórias.\n"
);
process.exit(1);
