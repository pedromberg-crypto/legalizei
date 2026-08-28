#!/usr/bin/env node
/**
 * cnae-verifica-atende.js — dado um CNAE, deriva o veredito DO ZERO a partir
 * dos critérios validados (não lê `atende_me_certeza` como atalho, recalcula
 * pra poder CONFERIR contra ele).
 *
 * uso:
 *   node pesquisa/cnae-matriz/cnae-verifica-atende.js 6201502        (1 CNAE)
 *   node pesquisa/cnae-matriz/cnae-verifica-atende.js 6201-5/02      (aceita com ou sem pontuação)
 *   node pesquisa/cnae-matriz/cnae-verifica-atende.js --auditoria    (roda os 1332, compara com o precomputado)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * POR QUE RECALCULA EM VEZ DE SÓ LER `atende_me_certeza`
 * ═══════════════════════════════════════════════════════════════════════════
 * `cnae-matriz.json` já tem a coluna `atende_me_certeza` pronta pros 1332. Ler
 * ela seria mais rápido, mas repetiria o problema de sempre: confiar num
 * campo sem saber COMO ele foi calculado, e sem jeito de pegar se ele
 * divergir da lógica documentada. Este script reconstrói o veredito criterio
 * por critério (pesquisa/cnae-matriz/cnae-liso-servico.md, fonte primária) e
 * só DEPOIS compara com o campo pronto — `--auditoria` reporta toda
 * divergência como problema real, não como ruído.
 *
 * ─── OS CRITÉRIOS, NA ORDEM (pipeline validado, 27/08) ─────────────────────
 * 1. É serviço, não comércio/indústria — `anexo_base` (I=comércio·II=indústria
 *    eliminam; decisão de escopo MVP-só-serviço, 15/07)
 * 2. Não vedado ao Simples Nacional — CGSN140 Anexo VI
 * 3. Não ambíguo dentro do Simples — CGSN140 Anexo VII (se ambíguo, não
 *    classifica sozinho — vira REVISAR, nunca um "não" nem um "sim" forçado)
 * 4. Baixo risco, dispensa vistoria prévia — CGSIM Resolução 51/2019 Anexo I
 *    (se não é baixo risco, cai em `verificar-licenciamento`: NÃO é "não
 *    atende", é um balde que o produto ainda não constrói)
 * 5. Não exige registro em conselho profissional — Lei 6.839/1980 + lei de
 *    cada conselho
 * 6. Não exige registro setorial federal — CADASTUR/Polícia Federal/
 *    Bacen-CVM-SUSEP/ANATEL/ANTT/IBAMA/MEC. ⚠️ **Só foi verificado pra 387 dos
 *    1332** (footprint do concorrente) — fora disso o campo é
 *    `nao-verificado`, e o script trata isso como INCERTO, nunca como "passa".
 *
 * Sobrevive 1-6 com todo campo resolvido (não `nao-verificado`, não
 * `duvida`) → ATENDE. MEI é filtro SEPARADO (Art. 966 CC, CGSN140 Anexo XI),
 * só avaliado se o ME já atende — não existe atalho de MEI sem passar pelo ME.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const norm = (c) => c.replace(/\D/g, "");

const matriz = JSON.parse(fs.readFileSync(path.join(DIR, "cnae-matriz.json"), "utf8"));
const porCodigo = new Map(matriz.map((r) => [norm(r.cnae), r]));

/**
 * Deriva o veredito de UM registro, do zero. Retorna:
 *   { veredito: "atende" | "nao-atende" | "incerto", motivo, detalhe }
 * "incerto" cobre TODOS os casos onde o dado não permite afirmar nem sim nem
 * não com segurança — nunca vira "atende" por omissão.
 */
function classificar(r) {
  if (r.anexo_base === "I") {
    return { veredito: "nao-atende", motivo: "comercio", detalhe: "Anexo I do IBGE = comércio. MVP atende só serviço (decisão 15/07)." };
  }
  if (r.anexo_base === "II") {
    return { veredito: "nao-atende", motivo: "industria", detalhe: "Anexo II do IBGE = indústria. MVP atende só serviço (decisão 15/07)." };
  }
  if (r.vedado_simples_cgsn_anexo_vi === "sim") {
    return { veredito: "nao-atende", motivo: "vedado-simples", detalhe: "CGSN140 Anexo VI: vedação expressa ao Simples Nacional." };
  }
  if (r.ambiguo_simples_cgsn_anexo_vii === "sim") {
    return { veredito: "incerto", motivo: "ambiguo-simples", detalhe: "CGSN140 Anexo VII: ambíguo, não classifica sozinho — precisa humano." };
  }
  if (r.risco_baixo_cgsim !== "sim") {
    return { veredito: "nao-atende", motivo: "risco-nao-liso", detalhe: "CGSIM Res.51/2019 Anexo I: fora do baixo risco → cai em verificar-licenciamento, não construído no V1 (não é recusa definitiva)." };
  }
  if (r.exige_conselho === "duvida") {
    return { veredito: "incerto", motivo: "duvida-conselho", detalhe: "Exigência de conselho profissional em dúvida — precisa checagem humana antes de decidir." };
  }
  if (r.exige_conselho === "sim") {
    return { veredito: "nao-atende", motivo: "exige-conselho", detalhe: `Exige registro em conselho profissional (${r.conselho_qual || "não especificado"}) — precisa RT terceirizado/humano.` };
  }
  if (r.exige_registro_setorial === "sim") {
    return { veredito: "nao-atende", motivo: "exige-registro-setorial", detalhe: `Exige registro setorial federal (${r.registro_setorial_qual || "não especificado"}).` };
  }
  if (r.exige_registro_setorial === "nao-verificado") {
    return { veredito: "incerto", motivo: "registro-setorial-nao-verificado", detalhe: "Eixo de registro setorial só foi cruzado pra 387/1332 CNAEs (footprint do concorrente). Este CNAE está fora — 'não exige' NÃO é garantido, é lacuna de pesquisa aberta." };
  }
  return { veredito: "atende", motivo: "passou-nos-7-criterios", detalhe: "Sobreviveu aos 7 critérios com todo campo resolvido (nenhum nao-verificado, nenhuma dúvida)." };
}

function mei(r, veredito) {
  if (veredito !== "atende") {
    return { elegivel: false, motivo: "MEI depende do ME atender primeiro — não existe atalho." };
  }
  if (r.mei_permitido !== "sim") {
    return { elegivel: false, motivo: "Ocupação fora da lista MEI (CGSN140 Anexo XI) — filtro jurídico próprio (Art. 966 CC), não é o mesmo filtro do ME com teto menor." };
  }
  return { elegivel: true, motivo: "Passa no ME e está na lista de ocupações MEI (CGSN140 Anexo XI)." };
}

// ── modo 1: lookup de 1 CNAE ─────────────────────────────────────────────
function lookup(codigoBruto) {
  const cod = norm(codigoBruto);
  const r = porCodigo.get(cod);
  if (!r) {
    console.log(`🔴 CNAE "${codigoBruto}" não existe no mestre (1332 subclasses de serviço mapeadas). Confere o código — pode ser CNAE fora do universo de serviço, ou erro de digitação.`);
    process.exit(1);
  }

  const c = classificar(r);
  const m = mei(r, c.veredito);

  const icone = c.veredito === "atende" ? "✅" : c.veredito === "incerto" ? "🟡" : "🔴";
  console.log(`${icone} ${r.cnae} — ${r.descricao}`);
  console.log(`   Veredito: ${c.veredito.toUpperCase()} (${c.motivo})`);
  console.log(`   ${c.detalhe}`);
  console.log(`   MEI: ${m.elegivel ? "✅ elegível" : "❌ não elegível"} — ${m.motivo}`);

  // Compara com o campo precomputado — qualquer divergência é achado real.
  const precomputadoAtende = r.atende_me_certeza === "sim";
  const meuAtende = c.veredito === "atende";
  if (precomputadoAtende !== meuAtende) {
    console.log(`   ⚠️  DIVERGE do campo atende_me_certeza (matriz diz "${r.atende_me_certeza}", cálculo independente diz "${c.veredito}") — investigar antes de confiar em qualquer um dos dois.`);
  }
  if (c.veredito === "atende") {
    console.log(`   Anexo/Fator R: ${r.anexo_fator_r_grupo || "não classificado"} (${r.anexo_fator_r_fonte || "sem fonte"})`);
    console.log(`   ISS BH: ${r.iss_bh_aliquota || "não mapeado"}${r.iss_bh_varia === "sim" ? " (varia por sub-atividade — ver iss_bh_detalhe)" : ""}`);
  }
}

// ── modo 2: auditoria — recalcula os 1332 e compara com o precomputado ────
function auditoria() {
  console.log(`═══ AUDITORIA CNAE — recalculando ${matriz.length} registros do zero ═══\n`);
  let divergencias = 0;
  const porMotivo = {};
  for (const r of matriz) {
    const c = classificar(r);
    porMotivo[c.motivo] = (porMotivo[c.motivo] || 0) + 1;
    const precomputadoAtende = r.atende_me_certeza === "sim";
    const meuAtende = c.veredito === "atende";
    if (precomputadoAtende !== meuAtende) {
      console.log(`🔴 ${r.cnae} (${r.descricao}): matriz diz atende_me_certeza="${r.atende_me_certeza}", cálculo independente diz "${c.veredito}" (${c.motivo})`);
      divergencias++;
    }
  }

  console.log(`\nDistribuição do cálculo independente:`);
  for (const [motivo, n] of Object.entries(porMotivo).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${n.toString().padStart(4)} · ${motivo}`);
  }

  console.log(`\n${divergencias === 0 ? "✅ ZERO divergência entre cálculo independente e o campo precomputado" : `🔴 ${divergencias} DIVERGÊNCIA(S) — ver acima. Cada uma é um CNAE onde "atende_me_certeza" foi decidido sem uma checagem que hoje travaria o veredito. Não são bug de script — são pendência real de pesquisa (registro setorial não verificado nesses códigos específicos).`}`);
  process.exit(divergencias === 0 ? 0 : 1);
}

// ── entrada ───────────────────────────────────────────────────────────────
const arg = process.argv[2];
if (!arg) {
  console.log("uso: node cnae-verifica-atende.js <cnae>  ou  node cnae-verifica-atende.js --auditoria");
  process.exit(1);
}
if (arg === "--auditoria") auditoria();
else lookup(arg);
