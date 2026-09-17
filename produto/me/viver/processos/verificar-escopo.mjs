/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 TRAVA DE ESCOPO — roda dentro de todo gerador de processo.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Pedido do Pedro em 12/09: *"trave de alguma forma que não passe batido que
 * estamos lidando apenas com os enquadramentos e características que eu te
 * disse"*.
 *
 * O que ela faz, e só isso: varre os arquivos de PROCESSO atrás de vocabulário
 * que só existe fora do nosso escopo. Achou e não está declarado como exclusão
 * na mesma linha → derruba o gerador com o arquivo, a linha e o termo.
 *
 * ⚠️ ONDE ESTA TRAVA NÃO CHEGA, e é importante dizer:
 *   · ela pega VOCABULÁRIO, não raciocínio. Um passo pode estar inteiro no
 *     vocabulário certo e mesmo assim descrever um processo de comércio
 *   · "Anexo I" e "MEI" ficaram fora da lista por ambiguidade real no vault
 *     (o Anexo I do nosso contrato, o ANEXO_I do leiaute da NFS-e, o ramo MEI
 *     do app). Esses dois seguem sendo olho humano
 *   · ela não sabe se a REGRA aplicada é a do enquadramento certo. Foi
 *     exatamente esse o erro de 12/09 (a E0061, que só vale pro Simples), e
 *     nenhum grep pegaria
 *
 * Mesma família da trava de anatomia do MEI: protege contra o deslize, não
 * contra o engano.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FORA_DO_VOCABULARIO, MARCADOR_EXCLUSAO } from "./_escopo.mjs";
import { RAIZ } from "../../../_raiz.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Os arquivos onde o DESENHO mora. Evidência e pesquisa ficam de fora: lá o
 *  vocabulário de outro regime é legítimo, é o objeto de estudo. */
function arquivosDeProcesso() {
  const alvos = [resolve(AQUI, "processos-data.mjs"), resolve(AQUI, "processos-propostas.mjs")];
  const cru = resolve(AQUI, "cru");
  if (existsSync(cru)) {
    for (const f of readdirSync(cru)) {
      if (f.endsWith(".mjs") && !f.startsWith("gerar-")) alvos.push(resolve(cru, f));
    }
  }
  const func = resolve(RAIZ, "produto/funcionalidades-data.mjs");
  if (existsSync(func)) alvos.push(func);
  return alvos.filter((a) => existsSync(a));
}

export function verificarEscopo({ silencioso = false } = {}) {
  const achados = [];
  for (const caminho of arquivosDeProcesso()) {
    const linhas = readFileSync(caminho, "utf8").split(/\r?\n/);
    linhas.forEach((linha, i) => {
      if (linha.includes(MARCADOR_EXCLUSAO)) return;
      for (const termo of FORA_DO_VOCABULARIO) {
        const re = new RegExp(`\\b${termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (re.test(linha)) {
          achados.push({
            arquivo: relative(RAIZ, caminho).replace(/\\/g, "/"),
            linha: i + 1,
            termo,
            trecho: linha.trim().slice(0, 110),
          });
        }
      }
    });
  }

  if (achados.length) {
    console.error(`\n🔒 ESCOPO VIOLADO — ${achados.length} ocorrência(s) de vocabulário de fora:\n`);
    for (const a of achados) {
      console.error(`  · ${a.arquivo}:${a.linha} — "${a.termo}"`);
      console.error(`    ${a.trecho}`);
    }
    console.error(
      `\n  O escopo é ME do Simples, Anexos III e V, NFS-e de serviço (ver _escopo.mjs).`,
    );
    console.error(
      `  Se a citação for legítima, escreva "${MARCADOR_EXCLUSAO}" na MESMA linha.\n`,
    );
    return false;
  }
  if (!silencioso) console.log("🔒 escopo: ME/Simples, Anexos III e V — vocabulário limpo");
  return true;
}

/* rodar direto: `node produto/me/viver/processos/verificar-escopo.mjs`
   ⚠️ `file://${caminho}` NÃO funciona no Windows: o caminho vem como
   `C:\...` e a URL real tem três barras (`file:///C:/...`), então a
   comparação nunca batia e o script saía calado com exit 0 — trava que não
   roda é pior que trava nenhuma. `pathToFileURL` resolve nos dois sistemas. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(verificarEscopo() ? 0 : 1);
}
