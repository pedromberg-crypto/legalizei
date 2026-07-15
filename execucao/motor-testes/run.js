#!/usr/bin/env node
// run.js — motor headless de testes de fluxo. Node puro, zero dependência.
//
// uso:
//   node run.js <persona>                        roda a persona e compara com o esperado
//   node run.js ajuste <passo> "<frase>" "<fonte>"   grava um ajuste no livro-caixa
//
// O motor percorre flow-schema.js alimentado por personas/<id>.json, imprime a
// trilha (com pausas simuladas), compara com o esperado (✅/❌) e grava a corrida
// sozinho no livro-caixa append-only historico-testes.jsonl.

const fs = require('fs');
const path = require('path');
const schema = require('./flow-schema.js');

const DIR = __dirname;
const LEDGER = path.join(DIR, 'historico-testes.jsonl');

// ── livro-caixa (append-only) ─────────────────────────────────────────────
function hoje() { return new Date().toISOString().slice(0, 10); }

function lerLedger() {
  if (!fs.existsSync(LEDGER)) return [];
  return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

function proximoId(prefixo, tipo) {
  const n = lerLedger().filter((r) => r.tipo === tipo).length;
  return prefixo + String(n + 1).padStart(4, '0');
}

function append(obj) {
  fs.appendFileSync(LEDGER, JSON.stringify(obj) + '\n', 'utf8');
}

// ── motor ─────────────────────────────────────────────────────────────────
function carregarPersona(id) {
  const p = path.join(DIR, 'personas', id + '.json');
  if (!fs.existsSync(p)) { console.error(`persona não encontrada: ${p}`); process.exit(2); }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function rodar(persona) {
  const ctx = { respostas: persona.respostas, dados: {}, veredito_b1: null };
  const trilha = [];
  let status = 'segue';
  let parouEm = null;

  for (const passo of schema.passos) {
    // condicional mutuamente exclusiva não roda
    if (passo.pula_se && passo.pula_se(ctx)) {
      trilha.push({ passo: passo.id, resultado: '(pulado)' });
      continue;
    }
    // validação barra o fluxo
    if (passo.valida) {
      const erro = passo.valida(ctx);
      if (erro) {
        trilha.push({ passo: passo.id, resultado: 'ERRO: ' + erro });
        status = 'bloqueado';
        parouEm = passo.id;
        break;
      }
    }
    // lógica de negócio (IA de CNAE vem dublada pela persona)
    const d = passo.deriva ? passo.deriva(ctx) : { resultado: '(ação)' };
    if (d.dados) Object.assign(ctx.dados, d.dados);
    if (d.veredito_b1) ctx.veredito_b1 = d.veredito_b1;
    trilha.push({ passo: passo.id, resultado: d.resultado });
    parouEm = passo.id;
    if (d.termina) { status = d.termina; break; }

    // pausa de órgão/usuário roteirizada na persona → parar/esperar/retomar idempotente
    const ev = persona.eventos && persona.eventos[passo.id];
    if (ev && ev.tipo === 'pausa') {
      trilha.push({
        passo: passo.id + '::pausa',
        resultado: `⏸ ${ev.motivo} · espera ${ev.espera} · ▶ retomada ${ev.retomada}`,
      });
    }
  }
  return { trilha, status, parouEm, veredito_b1: ctx.veredito_b1 };
}

function comparar(atual, esperado) {
  const esp = (esperado && esperado.trilha) || [];
  const max = Math.max(atual.length, esp.length);
  const linhas = [];
  let ok = atual.length === esp.length;
  for (let i = 0; i < max; i++) {
    const a = atual[i];
    const e = esp[i];
    const linhaOk = !!(a && e && a.passo === e.passo && a.resultado === e.resultado);
    if (!linhaOk) ok = false;
    linhas.push({ a, e, ok: linhaOk });
  }
  return { ok, linhas };
}

// ── render de tabela (Markdown, alinhado — legível cru no terminal e renderizado no chat) ──
function metaPasso(id) {
  const base = id.replace('::pausa', '');
  const p = schema.passos.find((x) => x.id === base);
  return p ? { bloco: p.bloco, tela: p.tela } : { bloco: '·', tela: '·' };
}

function tabela(headers, rows) {
  const larg = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i] || '').length)));
  const linha = (cells) => '| ' + cells.map((c, i) => String(c || '').padEnd(larg[i])).join(' | ') + ' |';
  const sep = '|' + larg.map((w) => '-'.repeat(w + 2)).join('|') + '|';
  return [linha(headers), sep, ...rows.map(linha)].join('\n');
}

function montarTabela(linhas, persona) {
  const sug = persona.sugestoes || {};
  const rows = linhas.map((l, i) => {
    const passo = (l.a && l.a.passo) || (l.e && l.e.passo) || '(?)';
    const m = metaPasso(passo);
    return [
      String(i + 1).padStart(2, '0'),
      `${m.bloco}·${m.tela}`,
      passo,
      l.a ? l.a.resultado : '(faltou)',
      l.ok ? '✅' : '❌',
      sug[passo] || '',
    ];
  });
  return tabela(['#', 'Tela', 'Passo', 'Resultado', 'OK', 'Sugestão (olhar leigo)'], rows);
}

// ── CLI ─────────────────────────────────────────────────────────────────
const [, , cmd, ...rest] = process.argv;

if (cmd === 'ajuste') {
  const [passo, frase, fonte] = rest;
  if (!passo || !frase) {
    console.error('uso: node run.js ajuste <passo> "<frase>" "<fonte>"');
    process.exit(2);
  }
  const ultima = [...lerLedger()].reverse().find((r) => r.tipo === 'corrida');
  const rec = {
    tipo: 'ajuste',
    ajuste_id: proximoId('A', 'ajuste'),
    test_id: ultima ? ultima.test_id : null,
    passo,
    frase,
    fonte: fonte || null,
    data: hoje(),
  };
  append(rec);
  console.log('📒 ajuste gravado:', JSON.stringify(rec));
  process.exit(0);
}

if (!cmd) {
  console.error('uso: node run.js <persona> | node run.js ajuste <passo> "<frase>" "<fonte>"');
  process.exit(2);
}

const persona = carregarPersona(cmd);
const { trilha, status, parouEm, veredito_b1 } = rodar(persona);
const { linhas } = comparar(trilha, persona.esperado);

const esp = persona.esperado || {};
const vOk = !esp.veredito_b1 || esp.veredito_b1 === veredito_b1;
const sOk = !esp.status || esp.status === status;
const pOk = !esp.parou_em || esp.parou_em === parouEm;
const passou = linhas.every((l) => l.ok) && vOk && sOk && pOk;

const testId = proximoId('T', 'corrida');
const perfil = persona.perfil || {};
const tab = montarTabela(linhas, persona);

// ── relatório visual (sempre em tabela) ──
const cab = `🏁 ${testId} · FLOW ${schema.flow_num} "${schema.id}" v${schema.versao} · persona "${persona.meta.id}" (${persona.meta.nome})`;
const resumo =
  `veredito B1: ${veredito_b1} ${vOk ? '✅' : '❌'}  ·  status: ${status} ${sOk ? '✅' : '❌'}  ·  ` +
  `parou em: ${parouEm} ${pOk ? '✅' : '❌'}  ·  RESULTADO: ${passou ? '✅ PASS' : '❌ FAIL'}`;

console.log(`\n${cab}`);
console.log(`   perfil: ${perfil.nivel || '—'} · cobertura: ${schema.cobertura}\n`);
console.log(tab);
console.log(`\n   ${resumo}\n`);

// grava relatório md (enriquece a doc — persistido por corrida)
const relDir = path.join(DIR, 'relatorios');
if (!fs.existsSync(relDir)) fs.mkdirSync(relDir, { recursive: true });
const md =
  `# Relatório ${testId} — persona "${persona.meta.id}" (${persona.meta.nome})\n\n` +
  `> flow **${schema.id}** v${schema.versao} · ${hoje()} · **${passou ? 'PASS ✅' : 'FAIL ❌'}**\n\n` +
  `**Perfil (${perfil.nivel || '—'}):** ${perfil.personalidade || '—'}\n\n` +
  `**Cobertura:** ${schema.cobertura}\n\n` +
  `${tab}\n\n` +
  `**Resumo:** ${resumo}\n\n` +
  `Fonte da persona: ${persona.meta.fonte || '—'}\n`;
fs.writeFileSync(path.join(relDir, `${testId}-${persona.meta.id}.md`), md, 'utf8');

// livro-caixa: grava a corrida sozinho
const rec = {
  tipo: 'corrida',
  test_id: testId,
  persona: persona.meta.id,
  persona_seq: persona.meta.persona_seq,
  perfil: perfil.nivel || null,
  flow: schema.id,
  data: hoje(),
  versao_flow: schema.versao,
  resultado: passou ? 'PASS' : 'FAIL',
  trilha,
};
append(rec);
console.log(`   📒 livro-caixa += ${rec.test_id} (${rec.resultado}) · relatório → relatorios/${testId}-${persona.meta.id}.md\n`);

process.exit(passou ? 0 : 1);
