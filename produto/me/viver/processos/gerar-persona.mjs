/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GERA `produto/me/viver/processos/PERSONA.md` a partir de `_persona.mjs`.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 POR QUE GERADO E NÃO ESCRITO À MÃO. A casa tem uma regra dura de 11/09:
 * *"não criar um segundo inventário"*. Uma nota de persona escrita à mão viraria
 * a segunda cópia da verdade, e cópia envelhece longe do script — foi
 * exatamente assim que o `portal-data.mjs` congelou por 39 dias.
 *
 * Então a fonte é uma só: o `.mjs` que a trava lê. Esta nota é a mesma coisa em
 * PT-BR, pro Mauro, pro dev e pra advogada, que não abrem arquivo de código.
 *
 * ⚠️ Não editar o `.md` — a próxima rodada sobrescreve.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { TRAVADO, ABERTO, PERSONA_ZERO, PROIBIDO_POR_CATEGORIA } from "./_persona.mjs";
import { RAIZ } from "../../../_raiz.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
/**
 * 🔑 A nota gerada mora COM O GERADOR desde 17/09 (decisão do Pedro).
 * Era `produto/PERSONA.md`, na raiz; a regra que vale é a mesma do
 * `_cobertura-das-vidas.md`: doc gerado fica na pasta de quem o escreve.
 */
const SAIDA = resolve(AQUI, "PERSONA.md");

const hoje = () => new Date().toISOString().slice(0, 10);

export function gerarPersona({ silencioso = false } = {}) {
  const abertas = ABERTO.filter((p) => p.resposta === null);
  const criticas = abertas.filter((p) => p.critico);

  const L = [];
  L.push("---");
  L.push("tipo: verdade");
  L.push("status: vivo");
  L.push(`data: ${hoje()}`);
  L.push("assunto: persona-e-cliente-travado");
  L.push("autoridade: fonte-verdade");
  L.push("tags: [produto, persona, escopo, trava]");
  L.push("---");
  L.push("");
  L.push("# 👤 A persona — quem é o cliente, e por consequência o que existe no produto");
  L.push("");
  L.push(
    "> ⚠️ **NOTA GERADA.** A fonte é `produto/me/viver/processos/_persona.mjs`, que é o arquivo que a trava lê. Editar aqui não muda nada e some na próxima rodada.",
  );
  L.push(">");
  L.push(
    "> 🧭 **Autoridade:** manda em *quem é o cliente*. O `_escopo.mjs` manda em *qual é o regime*. São coisas diferentes, e a segunda não pega a primeira.",
  );
  L.push("");
  L.push(
    `**${Object.keys(TRAVADO).length} travas · ${abertas.length} perguntas abertas${criticas.length ? ` · 🔴 ${criticas.length} crítica(s)` : ""}**`,
  );
  L.push("");
  L.push("---");
  L.push("");
  L.push("## Por que este documento existe");
  L.push("");
  L.push(
    "Travado pelo Pedro em 13/09: *\"nem sempre a gente está alinhado ao nosso produto de fato e à nossa persona. (…) igual vi em pró-labore do sócio com benefícios, a gente não tem essa opção do sócio ter benefício. (…) Precisamos desenhar MUITO bem o nosso usuário padrão pois ele é fixo.\"*",
  );
  L.push("");
  L.push("São **dois filtros diferentes**, e até 13/09 só um estava travado:");
  L.push("");
  L.push("| Filtro | Pergunta que ele faz | Pega |");
  L.push("|---|---|---|");
  L.push("| **Escopo** (`_escopo.mjs`, 12/09) | isso é de outro **regime**? | ICMS, CFOP, SEFAZ, Lucro Presumido |");
  L.push("| **Persona** (este, 13/09) | isso é legal no nosso regime e mesmo assim **não existe no nosso produto**? | benefício de sócio, estoque, 13º de sócio |");
  L.push("");
  L.push(
    "🔴 **O caso que fez isto nascer.** Na varredura de pró-labore de 13/09 ficou escrito *\"plano de saúde do sócio sai do pró-labore como desconto\"*, copiado da plataforma do líder. É **perfeitamente legal** num ME Anexo III, e por isso a trava de escopo jamais ia pegar. Só que o nosso sócio não tem benefício. O nó `L26` inteiro existia por imitação.",
  );
  L.push("");
  L.push("---");
  L.push("");
  L.push("## 🔒 O que está travado");
  L.push("");
  L.push("| | Travado | Fonte |");
  L.push("|---|---|---|");
  for (const [chave, v] of Object.entries(TRAVADO)) {
    L.push(`| **${chave}** | ${v.valor} | ${v.fonte} |`);
  }
  L.push("");
  for (const [chave, v] of Object.entries(TRAVADO)) {
    if (v.nota) L.push(`- **${chave}** · ${v.nota}`);
  }
  L.push("");
  L.push("---");
  L.push("");
  L.push("## ⏳ O que ainda não está travado");
  L.push("");
  if (!abertas.length) {
    L.push("✅ Nenhuma. A persona está inteira respondida.");
  } else {
    L.push(
      "🔑 Estas perguntas moram como **dado** no `_persona.mjs`, não em prosa, porque o gerador conta quantas seguem abertas a cada rodada. Pergunta que mora em prosa envelhece sem ninguém notar.",
    );
    L.push("");
    let blocoAtual = null;
    const NOME_BLOCO = { empresa: "1 · A empresa", socio: "2 · O sócio, pessoa", servico: "3 · O serviço" };
    for (const p of ABERTO) {
      if (p.bloco !== blocoAtual) {
        blocoAtual = p.bloco;
        L.push("");
        L.push(`### ${NOME_BLOCO[blocoAtual] ?? blocoAtual}`);
        L.push("");
      }
      const marca = p.resposta !== null ? "✅" : p.critico ? "🔴" : "⏳";
      L.push(`**${marca} ${p.id} — ${p.pergunta}**`);
      L.push("");
      if (p.resposta !== null) {
        L.push(`> **Resposta:** ${p.resposta}`);
        L.push("");
      }
      L.push(`- *Por que importa:* ${p.porque}`);
      L.push(`- *O que muda:* ${p.muda}`);
      L.push("");
    }
  }
  L.push("---");
  L.push("");
  L.push(`## 🧪 Persona zero — ${PERSONA_ZERO.nome}`);
  L.push("");
  L.push(
    "Pedido do Pedro em 13/09: *\"eu sou uma das personas e perfil fixo de cliente. Podemos inclusive me usar como uma dessas personas validadoras dos processos de funcionalidades.\"*",
  );
  L.push("");
  L.push(`**CNPJ ${PERSONA_ZERO.cnpj}** · fonte: ${PERSONA_ZERO.fonte}`);
  L.push("");
  L.push("⚠️ Só entra aqui o que foi **medido**. Perfil imaginado não vale.");
  L.push("");
  L.push("| Dado | Valor |");
  L.push("|---|---|");
  for (const [k, v] of Object.entries(PERSONA_ZERO.medido)) L.push(`| ${k} | ${v} |`);
  L.push("");
  L.push("**O que ainda não se sabe dela:**");
  L.push("");
  for (const x of PERSONA_ZERO.naoSeSabeAinda) L.push(`- ${x}`);
  L.push("");
  L.push(`🔑 **Como usar:** ${PERSONA_ZERO.comoUsar}`);
  L.push("");
  L.push("---");
  L.push("");
  L.push("## 🚫 Vocabulário proibido, por categoria");
  L.push("");
  L.push(
    "🔑 **Por categoria, e não global, de propósito.** \"Rescisão\", \"13º\" e \"férias\" são legítimos em `folha.mjs` e proibidos em `prolabore.mjs`, porque funcionário tem e sócio não tem. O `benefício` de `impostos.mjs` prova o ponto pelo outro lado: lá ele quer dizer *benefício de plano comercial*, e é legítimo.",
  );
  L.push("");
  L.push("| Onde vale | Termos |");
  L.push("|---|---|");
  for (const [cat, termos] of Object.entries(PROIBIDO_POR_CATEGORIA)) {
    const onde = cat === "_todas" ? "**todo arquivo de processo**" : `\`cru/${cat}.mjs\``;
    L.push(`| ${onde} | ${termos.length ? termos.map((t) => `\`${t}\``).join(" · ") : "*(nenhum declarado ainda)*"} |`);
  }
  L.push("");
  L.push(
    'Citação legítima se libera escrevendo `FORA DO ESCOPO` na **mesma linha** — mesmo mecanismo do `_escopo.mjs`, de propósito: um jeito só de destravar, e ele obriga um humano a olhar cada caso.',
  );
  L.push("");
  L.push("---");
  L.push("");
  L.push("## ⚠️ Onde esta trava não chega");
  L.push("");
  L.push(
    "Ela pega **vocabulário, não raciocínio** — mesma fronteira da trava de escopo e da de anatomia do MEI. Dá pra descrever uma empresa que não é a nossa usando só palavras permitidas. Contra isso existe a persona zero: *isso acontece com a empresa do Pedro?*",
  );
  L.push("");
  L.push("## Links");
  L.push("- [[FUNCIONALIDADES]] · [[PROCESSOS]] · [[HANDOFF-DADOS]] · [[decisoes-marca]]");
  L.push("- Fonte: `produto/me/viver/processos/_persona.mjs` · Trava: `produto/me/viver/processos/verificar-persona.mjs`");
  L.push("- Irmão: `produto/me/viver/processos/_escopo.mjs` (regime, não persona)");
  L.push("");

  writeFileSync(SAIDA, L.join("\r\n"), "utf8");
  if (!silencioso) {
    console.log(`✓ persona: produto/me/viver/processos/PERSONA.md · ${Object.keys(TRAVADO).length} travas · ${abertas.length} abertas`);
  }
  return true;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  gerarPersona();
}
