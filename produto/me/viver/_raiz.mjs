/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📍 A RAIZ DO VAULT, ACHADA — nunca contada à mão.
 * ═══════════════════════════════════════════════════════════════════════════
 * Decidido pelo Pedro em 17/09, na mudança do motor para `produto/me/viver/`.
 *
 * ── POR QUE ISTO EXISTE ────────────────────────────────────────────────────
 *
 * Três scripts do motor precisam alcançar arquivos FORA dele:
 *   · `provar/verificar-encerrados.mjs` ..... lê 5 fontes de `produto/me/viver/processos/`
 *   · `publicar/gerar-tabelas-app.mjs` ...... escreve `app/src/lib/fiscal-tabelas.ts`
 *   · `publicar/gerar-entrega.mjs` .......... lê o congelado em `produto/me/devs/`
 *
 * Até 17/09 cada um contava os níveis na mão: `resolve(AQUI, "..", "..")`.
 * Funcionava porque o motor estava a 2 níveis da raiz. Nesta mudança ele foi
 * para 5, e um `..` a menos não dá erro — dá um caminho que **não existe**, e
 * o script decide sozinho que não há nada para conferir.
 *
 * 🔑 É a mesma família de defeito da trava cega de 16/09: o script roda
 * **verde** afirmando que está tudo em dia, quando na verdade não olhou nada.
 * Caminho contado à mão é um número em prosa dentro do código — e número em
 * prosa não recalcula.
 *
 * ── COMO ELE ACHA ──────────────────────────────────────────────────────────
 *
 * Sobe diretório por diretório até encontrar o `CLAUDE.md` da raiz. Se chegar
 * no topo do disco sem achar, **estoura** — que é o comportamento certo: falta
 * de raiz é erro de instalação, não caso a tratar em silêncio.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = (() => {
  let dir = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(dir, "CLAUDE.md"))) {
    const acima = dirname(dir);
    if (acima === dir) {
      throw new Error(
        "Raiz do vault não encontrada: subi até o topo sem achar um CLAUDE.md.",
      );
    }
    dir = acima;
  }
  return dir;
})();
