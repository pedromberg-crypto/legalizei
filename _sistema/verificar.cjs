#!/usr/bin/env node
/**
 * verificar.js — o vault se auditando sozinho.
 *
 * uso:  node _sistema/verificar.cjs
 *
 * Por que existe: em 16/07 nove problemas foram achados POR ACASO, enquanto eu fazia outra
 * coisa. Sete deles eram do mesmo tipo — "X dependia de Y e ninguém sabia". O caso mais caro:
 * o UX-44 dizia "pagamento e registro só liberam com os dois de acordo", a reordenação mudou a
 * ordem, e o UX-44 foi revogado EM SILÊNCIO, porque a dependência não estava escrita.
 *
 * Este script troca "achar por sorte" por "achar por sistema". Ele checa 4 coisas:
 *   1. DERIVADO DESATUALIZADO — nota `derivado` cuja fonte (`deriva_de`) mudou depois dela
 *   2. LINK QUEBRADO — [[alvo]] que não existe
 *   3. VOCABULÁRIO — tipo/status fora do fechado em _sistema/indice-autoridade.md
 *   4. ÓRFÃ — nota que ninguém referencia
 *
 * Exit 1 se houver derivado desatualizado (o único que é erro de verdade; o resto é aviso).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
// `.claude` entrou em 09/09: `.claude/worktrees/` guarda uma COPIA inteira do vault
// (637 .md, ignorada pelo git). Sem excluir, toda contagem dobrava e a lista de orfas
// enchia de arquivo que nem e do vault.
const SKIP = /node_modules|[\\/]\.next|[\\/]\.obsidian|[\\/]\.git|[\\/]\.claude|[\\/]\.agents|[\\/]relatorios|_templates|playwright-report|test-results/;

// Vocabulario fechado. Fonte-verdade: _sistema/indice-autoridade.md.
// 09/09: passou de 6 para 8 tipos. `marco` e `referencia` foram PROMOVIDOS porque
// eram categorias reais e usadas (19 e 17 notas), e porque `execucao/marcos.base`
// filtra por `tipo == "marco"` — a doutrina proibia o que a ferramenta exigia.
const TIPOS = [
  "hub", "verdade", "derivado", "fato", "historico", "operacao",
  "marco", "referencia",
];
const STATUS = ["vivo", "superado", "rascunho", "congelado", "fila-humana"];

// [[link]] usado como EXEMPLO dentro de doc de processo (CLAUDE.md, README do motor).
// Nao e alvo real, nao conta como quebrado.
const EXEMPLOS = new Set([
  "link", "links", "cliente", "feature", "nota-de-feature", "dor observada",
  "concorrente / reuniao / lei", "concorrente / reunião / lei", "their-name", "name",
  // 09/09: placeholders de template/exemplo. Nao sao alvo real.
  "nota-linha",   // exemplo de formato em marco e HOME
  "persona-X",    // _template-volante.md, a dorsal e preenchida ao criar o volante
  "wikilinks",    // citado como conceito no handoff do dev
]);

// ── coleta ──────────────────────────────────────────────────────────────────
const notas = new Map(); // slug -> {rel, fm, mtime, txt}
const alias = new Map(); // nome.ext | caminho -> slug
const existe = (a) => notas.has(a) || alias.has(a);
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) walk(p);
    // 09/09: png/jpg/webp entraram. As notas de pricing-snapshot linkam
    // [[img-2026-07-08/contab_pricing_0.png]], que EXISTE — mas o verificador so
    // indexava md/svg e reportava como quebrado. Falso positivo, nao erro de nota.
    else if (/\.(md|svg|png|jpe?g|webp|gif|pdf)$/i.test(e.name)) {
      const slug = e.name.replace(/\.(md|svg|png|jpe?g|webp|gif|pdf)$/i, "");
      const rel = path.relative(ROOT, p).split(path.sep).join("/");
      // resolve tambem por nome-com-extensao ([[logo.svg]]) e por caminho ([[mkt/README]])
      alias.set(e.name, slug);
      alias.set(rel, slug);
      alias.set(rel.replace(/\.md$/, ""), slug);
      // o Obsidian resolve caminho PARCIAL ([[contabilizei/paginas-publicas]]).
      // sem isto, links validos apareciam como quebrados.
      const segs = rel.replace(/\.md$/, "").split("/");
      for (let i = 1; i < segs.length; i++) alias.set(segs.slice(i).join("/"), slug);
      let fm = {}, txt = "";
      if (e.name.endsWith(".md")) {
        txt = fs.readFileSync(p, "utf8");
        // ⚠️ `\r?` NAO e detalhe. Ate 09/09 esta regex era /^---\n/, so LF, e o vault
        // e Windows: 523 das 663 notas com frontmatter (79%) eram INVISIVEIS pro
        // verificador. Ele reportava 44 violacoes de vocabulario porque so conseguia
        // ler 140 notas. Nunca trocar por \n seco.
        const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (m) {
          for (const line of m[1].split(/\r?\n/)) {
            const kv = line.match(/^(\w+):\s*(.*)$/);
            if (!kv) continue;
            const v = kv[2].trim();
            fm[kv[1]] = v.startsWith("[")
              ? v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean)
              : v;
          }
        }
      }
      // ⚠️ usa a `data:` do FRONTMATTER, nao o mtime do filesystem.
      // Motivo (achado na 1a rodada): qualquer edicao em massa (migracao, lint,
      // find&replace) reseta o mtime de tudo e o verificador fica cego. A data do
      // frontmatter e SEMANTICA: diz quando o conteudo foi decidido, nao quando o
      // arquivo foi tocado.
      const dt = fm.data && /^\d{4}-\d{2}-\d{2}$/.test(fm.data) ? Date.parse(fm.data) : null;
      notas.set(slug, { rel, fm, txt, data: dt, mtime: fs.statSync(p).mtimeMs });
    }
  }
})(ROOT);

const problemas = { derivado: [], link: [], vocab: [], orfa: [] };

// ── 1. DERIVADO DESATUALIZADO (o que o UX-44 teria pego) ────────────────────
for (const [slug, n] of notas) {
  const fontes = [].concat(n.fm.deriva_de || []);
  for (const f of fontes) {
    const fonte = notas.get(f) || notas.get(alias.get(f));
    if (!fonte) {
      problemas.link.push({ de: n.rel, para: f, ctx: "deriva_de" });
      continue;
    }
    // sem data em algum dos dois, nao da pra comparar: nao inventa alarme
    if (n.data == null || fonte.data == null) continue;
    // fonte GERADA por script carrega `data: hoje` a cada rodada. Comparar contra ela
    // acusaria todo mundo que dela deriva, todo dia, pra sempre — alarme que sempre toca
    // e alarme que ninguem olha. A data dela e carimbo de build, nao data semantica.
    if (fonte.fm.gerado_por) continue;
    // `revisado_em: AAAA-MM-DD` e a saida HONESTA do alarme: alguem olhou a nota
    // contra a fonte nesta data e disse que continua valendo. Nao mexe na `data:`
    // (que e semantica: quando o CONTEUDO foi decidido). Se a fonte mudar de novo
    // depois dessa revisao, o alarme volta sozinho.
    const revisto = n.fm.revisado_em && /^\d{4}-\d{2}-\d{2}$/.test(n.fm.revisado_em)
      ? Date.parse(n.fm.revisado_em) : null;
    if (revisto != null && revisto >= fonte.data) continue;
    if (fonte.data > n.data) {
      const dias = Math.round((fonte.data - n.data) / 86400000);
      problemas.derivado.push({
        nota: n.rel, fonte: fonte.rel, dias,
        dNota: n.fm.data, dFonte: fonte.fm.data,
      });
    }
  }
}

// ── 2. LINKS QUEBRADOS ──────────────────────────────────────────────────────
for (const [, n] of notas) {
  if (!n.txt) continue;
  for (const m of n.txt.matchAll(/\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]/g)) {
    const alvo = m[1].trim();
    if (!alvo || EXEMPLOS.has(alvo)) continue;
    if (!existe(alvo)) problemas.link.push({ de: n.rel, para: alvo, ctx: "[[link]]" });
  }
}

// ── 3. VOCABULÁRIO ──────────────────────────────────────────────────────────
for (const [, n] of notas) {
  if (!n.txt) continue;
  if (n.fm.tipo && !TIPOS.includes(n.fm.tipo))
    problemas.vocab.push({ nota: n.rel, campo: "tipo", valor: n.fm.tipo });
  if (n.fm.status && !STATUS.includes(n.fm.status))
    problemas.vocab.push({ nota: n.rel, campo: "status", valor: n.fm.status });
  if (n.fm.status === "superado" && !n.fm.superado_por)
    problemas.vocab.push({ nota: n.rel, campo: "superado_por", valor: "(faltando)" });
}

// ── 4. ÓRFÃS ────────────────────────────────────────────────────────────────
const temBacklink = new Set();
for (const [, n] of notas) {
  if (!n.txt) continue;
  for (const m of n.txt.matchAll(/\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]/g)) {
    const a = m[1].trim();
    temBacklink.add(a);
    if (alias.has(a)) temBacklink.add(alias.get(a));
  }
}
for (const [slug, n] of notas) {
  if (!n.txt || temBacklink.has(slug)) continue;
  if (/^(CLAUDE|README|HOME|AGENTS)$/.test(slug)) continue; // lidos por convenção
  problemas.orfa.push(n.rel);
}

// ── relatório ───────────────────────────────────────────────────────────────
const L = console.log;
L("");
L("═══ VERIFICAÇÃO DO VAULT ═══  " + notas.size + " arquivos");
L("");

if (problemas.derivado.length) {
  L("🔴 DERIVADO DESATUALIZADO (" + problemas.derivado.length + ") — a fonte mudou depois dele");
  for (const p of problemas.derivado)
    L("   " + p.nota + "\n      └─ deriva de " + p.fonte + " · fonte é " + p.dias + " dias mais nova");
  L("");
} else L("✅ nenhum derivado desatualizado");

if (problemas.vocab.length) {
  L("🟡 VOCABULÁRIO fora do fechado (" + problemas.vocab.length + ")");
  for (const p of problemas.vocab.slice(0, 12))
    L("   " + p.campo + ": '" + p.valor + "'  ← " + p.nota);
  if (problemas.vocab.length > 12) L("   ... +" + (problemas.vocab.length - 12));
  L("");
} else L("✅ vocabulário limpo");

if (problemas.link.length) {
  const porAlvo = {};
  for (const p of problemas.link) (porAlvo[p.para] = porAlvo[p.para] || []).push(p.de);
  L("🟡 LINKS QUEBRADOS (" + problemas.link.length + " · " + Object.keys(porAlvo).length + " alvos)");
  for (const [alvo, de] of Object.entries(porAlvo).sort((a, b) => b[1].length - a[1].length).slice(0, 10))
    L("   " + String(de.length).padStart(2) + "× [[" + alvo + "]]");
  L("");
} else L("✅ nenhum link quebrado");

L("🔵 ÓRFÃS: " + problemas.orfa.length + " (ninguém referencia)");
for (const o of problemas.orfa.slice(0, 8)) L("   " + o);
if (problemas.orfa.length > 8) L("   ... +" + (problemas.orfa.length - 8));
L("");

process.exit(problemas.derivado.length ? 1 : 0);
