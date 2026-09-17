/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 TRAVA DE PERSONA — irmã da trava de escopo, e pega o que ela não pega.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * A de escopo pergunta *"isso é de outro REGIME?"*. Esta pergunta
 * *"isso é legal no nosso regime e mesmo assim NÃO EXISTE no nosso produto?"*.
 *
 * Nasceu em 13/09, do plano de saúde do sócio que eu escrevi em `prolabore.mjs`
 * copiando a plataforma do líder. Perfeitamente legal num ME Anexo III, e por
 * isso invisível pra trava de escopo.
 *
 * Faz duas coisas:
 *
 *  1. **Derruba** o gerador se vocabulário de fora da persona aparecer num
 *     arquivo de processo sem o marcador de exclusão na mesma linha. O
 *     vocabulário é POR CATEGORIA (ver `_persona.mjs`), porque "rescisão" é
 *     legítimo em folha e proibido em pró-labore.
 *
 *  2. **Avisa, sem derrubar**, quantas perguntas de persona seguem sem
 *     resposta — e nomeia as marcadas como críticas. Pergunta aberta não é
 *     defeito de código, é decisão pendente: derrubar o build por causa dela
 *     seria trava que atrapalha em vez de proteger. Mas ficar calada foi
 *     exatamente o que deixou a pergunta do dependente dormir de 12/09 pra
 *     13/09 sem ninguém ver.
 *
 * ⚠️ Pega VOCABULÁRIO, não raciocínio — mesma fronteira das outras duas travas
 * da casa. Contra o raciocínio existe a PERSONA_ZERO: *isso acontece com a
 * empresa do Pedro?*
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve, relative, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PROIBIDO_POR_CATEGORIA, MARCADOR_EXCLUSAO, ABERTO } from "./_persona.mjs";
import { RAIZ } from "../_raiz.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Os mesmos alvos da trava de escopo, mas cada um carregando QUAL CATEGORIA
 * ele é — porque a lista proibida depende disso. Arquivo fora de `cru/` não
 * tem categoria e responde só pela lista `_todas`.
 */
function alvos() {
  const lista = [];
  for (const f of ["processos-data.mjs", "processos-propostas.mjs"]) {
    const p = resolve(AQUI, f);
    if (existsSync(p)) lista.push({ caminho: p, categoria: null });
  }
  const cru = resolve(AQUI, "cru");
  if (existsSync(cru)) {
    for (const f of readdirSync(cru)) {
      if (!f.endsWith(".mjs") || f.startsWith("gerar-") || f.startsWith("_")) continue;
      lista.push({ caminho: resolve(cru, f), categoria: basename(f, ".mjs") });
    }
  }
  const func = resolve(RAIZ, "produto/funcionalidades-data.mjs");
  if (existsSync(func)) lista.push({ caminho: func, categoria: null });
  return lista;
}

const escapar = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function verificarPersona({ silencioso = false } = {}) {
  const achados = [];

  for (const { caminho, categoria } of alvos()) {
    const termos = [
      ...PROIBIDO_POR_CATEGORIA._todas,
      ...(categoria ? (PROIBIDO_POR_CATEGORIA[categoria] ?? []) : []),
    ];
    if (!termos.length) continue;

    const linhas = readFileSync(caminho, "utf8").split(/\r?\n/);
    linhas.forEach((linha, i) => {
      if (linha.includes(MARCADOR_EXCLUSAO)) return;
      for (const termo of termos) {
        /* `\b` não funciona antes de "1" em "13º" nem depois de "º": a borda de
           palavra do JS é ASCII e não enxerga acentuação nem ordinal. Termo que
           começa ou termina fora de [A-Za-z0-9_] casa sem borda daquele lado. */
        const inicioEhPalavra = /^[\wÀ-ÿ]/.test(termo);
        const fimEhPalavra = /[\wÀ-ÿ]$/.test(termo);
        const re = new RegExp(
          `${inicioEhPalavra ? "(?<![\\wÀ-ÿ])" : ""}${escapar(termo)}${fimEhPalavra ? "(?![\\wÀ-ÿ])" : ""}`,
          "i",
        );
        if (re.test(linha)) {
          achados.push({
            arquivo: relative(RAIZ, caminho).replace(/\\/g, "/"),
            linha: i + 1,
            termo,
            categoria: categoria ?? "—",
            trecho: linha.trim().slice(0, 110),
          });
        }
      }
    });
  }

  /* ── 1 · o que derruba ──────────────────────────────────────────────────── */
  if (achados.length) {
    console.error(`\n👤 PERSONA VIOLADA — ${achados.length} ocorrência(s) fora do nosso cliente:\n`);
    for (const a of achados) {
      console.error(`  · ${a.arquivo}:${a.linha} — "${a.termo}"  [categoria: ${a.categoria}]`);
      console.error(`    ${a.trecho}`);
    }
    console.error(
      `\n  A persona é ME do Simples, Anexos III/V, serviço, BH, sócio PF sem benefício (ver _persona.mjs).`,
    );
    console.error(`  Se a citação for legítima, escreva "${MARCADOR_EXCLUSAO}" na MESMA linha.\n`);
    return false;
  }

  /* ── 2 · o que só avisa ─────────────────────────────────────────────────── */
  const abertas = ABERTO.filter((p) => p.resposta === null);
  const criticas = abertas.filter((p) => p.critico);

  if (!silencioso) {
    console.log("👤 persona: vocabulário limpo");
    if (abertas.length) {
      console.log(
        `   ⏳ ${abertas.length} pergunta(s) de persona sem resposta${criticas.length ? `, ${criticas.length} crítica(s):` : "."}`,
      );
      for (const p of criticas) console.log(`      🔴 ${p.id} — ${p.pergunta}`);
      if (abertas.length > criticas.length) {
        console.log(`      (as demais em produto/me/viver/processos/_persona.mjs, bloco ABERTO)`);
      }
    } else {
      console.log("   ✅ persona inteira respondida");
    }
  }
  return true;
}

/* rodar direto: `node produto/me/viver/processos/verificar-persona.mjs`
   `pathToFileURL` e não `file://${caminho}` — no Windows a URL real tem três
   barras e a comparação ingênua nunca bate, deixando o script sair calado com
   exit 0. Trava que não roda é pior que trava nenhuma (lição de 12/09). */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(verificarPersona() ? 0 : 1);
}
