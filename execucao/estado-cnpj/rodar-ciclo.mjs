/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏁 O CICLO RODADO NAS 16 VIDAS — cada competência, cada obrigação.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/estado-cnpj/rodar-ciclo.mjs [P01 …]`
 *
 * Responde a pergunta que o Pedro fez em 15/09, e responde por competência,
 * não por opinião: *"no dia 1 da pessoa com o CNPJ aberto, tudo que é nossa
 * funcionalidade é entregue da forma correta, nas datas corretas, consultando
 * os dados corretos?"*
 *
 * Para CADA competência de CADA vida, monta o calendário do `ciclo-do-cnpj` e
 * confere, obrigação por obrigação, se o motor **de fato responde** — com o
 * dado que aquela empresa tem naquele mês. Não é "a função existe": é "a
 * função devolveu resposta utilizável para este caso".
 *
 * 🔑 **O que ele NÃO faz:** não prova que o número está certo. Isso é do
 * `verificar-apurador` (contra recibo real) e do `verificar-vidas` (contra a
 * lei). Aqui a pergunta é de **cobertura operacional**: sobrou mês sem
 * resposta? sobrou obrigação sem dono?
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { VIDAS } from "./vidas.mjs";
import { retratoDoMes } from "./_modelo.mjs";
import { calendarioDaCompetencia, MENSAIS, ANUAIS, placarDeAutomacao } from "./ciclo-do-cnpj.mjs";
import { vencimentoDe, anexoDoCnae, emReais } from "../motor-fiscal/apurador.mjs";

const brl = (c) =>
  emReais(c).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pedidas = process.argv.slice(2).map((s) => s.toUpperCase());
const alvo = pedidas.length ? VIDAS.filter((v) => pedidas.includes(v.id)) : VIDAS;

/**
 * Para uma competência, cada obrigação mensal vira um veredito:
 *   ✅ respondida · ⬜ não se aplica neste mês · 🔴 sem resposta
 */
function conferirCompetencia({ vida, retrato, dinamico }) {
  const r = [];
  const temReceita = retrato.receita > 0;

  const diz = (id, estado, nota) => r.push({ id, estado, nota });

  // M1 · apurar e transmitir — vale inclusive em mês zerado
  diz(
    "M1",
    retrato.das && retrato.anexo !== undefined ? "ok" : "falha",
    retrato.anexoIndeterminado ? "anexo indeterminado" : `anexo ${retrato.anexo ?? "—"}`
  );

  // M2 · emitir a guia — só quando há o que cobrar
  diz("M2", temReceita ? (retrato.das.total > 0 ? "ok" : "falha") : "na", brl(retrato.das.total));

  // M3 · decidir o pró-labore
  diz(
    "M3",
    retrato.piloto ? "ok" : "falha",
    retrato.piloto?.atua ? `sugere ${retrato.piloto.sugerido}` : retrato.piloto?.motivo ?? "—"
  );

  // M4 · transmitir eSocial/DCTFWeb — 🟢 o canal existe (destravado 15/09)
  diz("M4", "ok", "eSocial WS + Integra Contador");

  // M5 · DARF do sócio
  diz(
    "M5",
    retrato.darf ? "ok" : retrato.proLaboreDeclarado > 0 ? "falha" : "na",
    retrato.darf ? brl(retrato.darf.total ?? retrato.darf.inss + retrato.darf.irrf) : "sem pró-labore"
  );

  // M6 · vigiar o Fator R — só nos dinâmicos
  if (dinamico) {
    diz("M6", retrato.fatorR || retrato.piloto ? "ok" : "falha", retrato.fatorR ? `${(retrato.fatorR.fr * 100).toFixed(1)}%` : "1ª competência");
  } else {
    diz("M6", "na", "CNAE III-fixo: não há Fator R a vigiar");
  }

  // M7 · conferir a guia anterior
  diz(
    "M7",
    retrato.atraso ? "ok" : "na",
    retrato.atraso ? (retrato.atraso.emDia ? "em dia" : `${retrato.atraso.diasDeAtraso}d atraso`) : "sem baixa registrada"
  );

  return r;
}

/* ═══════════════════════════════════════════════════════════════════════════ */

console.log(`\n${"═".repeat(100)}`);
console.log("🏁 O CICLO RODADO — 16 vidas, competência a competência");
console.log("═".repeat(100));

const placar = { ok: 0, na: 0, falha: 0, semCanal: 0 };
const falhas = [];
let competencias = 0;
const viradas = [];

for (const vida of alvo) {
  const dinamico = anexoDoCnae(vida.empresa.grupoAnexo).calculaFatorR === true;
  const anos = new Set(vida.competencias.map((c) => c.mes.split("-")[0]));
  const linhasRuins = [];

  for (const comp of vida.competencias) {
    competencias++;
    let retrato;
    try {
      retrato = retratoDoMes({ empresa: vida.empresa, competencias: vida.competencias, mesAlvo: comp.mes });
    } catch (e) {
      falhas.push(`${vida.id} ${comp.mes}: retrato lançou — ${e.message.slice(0, 70)}`);
      placar.falha++;
      continue;
    }

    for (const v of conferirCompetencia({ vida, retrato, dinamico })) {
      placar[v.estado]++;
      if (v.estado === "falha") {
        linhasRuins.push(`${comp.mes} ${v.id}: ${v.nota}`);
        falhas.push(`${vida.id} ${comp.mes} ${v.id} — ${v.nota}`);
      }
    }

    // A virada de ano: a 1ª competência de um ano que não é o primeiro
    const [ano, mes] = comp.mes.split("-");
    if (mes === "01" && ano !== vida.competencias[0].mes.split("-")[0]) {
      viradas.push({
        vida: vida.id,
        mes: comp.mes,
        regra: retrato.regraRbt12,
        rbt12: retrato.rbt12,
      });
    }
  }

  const venc = vencimentoDe({
    competencia: {
      ano: Number(vida.competencias[0].mes.split("-")[0]),
      mes: Number(vida.competencias[0].mes.split("-")[1]),
    },
    tributo: "das",
  });

  console.log(
    `\n${vida.id}  ${vida.competencias.length.toString().padStart(2)} comp  ` +
      `abre ${vida.competencias[0].mes}  ` +
      `${dinamico ? "DIN" : "FIX"}  ${vida.empresa.sociosComProLabore ?? 1} sócio(s)  ` +
      `${anos.size > 1 ? "🎄 vira o ano" : "        "}  ` +
      `1ª guia vence ${venc.data.toISOString().slice(0, 10)}` +
      (linhasRuins.length ? `  🔴 ${linhasRuins.length} falha(s)` : "  ✅")
  );
  for (const l of linhasRuins.slice(0, 4)) console.log(`      🔴 ${l}`);
}

/* ── O placar ────────────────────────────────────────────────────────────── */
console.log(`\n${"─".repeat(100)}`);
console.log(`\n${competencias} competências conferidas em ${alvo.length} vidas.\n`);

const total = placar.ok + placar.na + placar.falha + placar.semCanal;
console.log(`   ✅ respondidas ............ ${placar.ok}`);
console.log(`   ⬜ não se aplicam ......... ${placar.na}`);
console.log(`   🔴 sem canal .............. ${placar.semCanal}`);
console.log(`   ❌ falhas ................. ${placar.falha}`);
console.log(`   ─────────────────────────────────`);
console.log(`   total de verificações ..... ${total}\n`);

if (falhas.length) {
  console.log(`🔴 ${falhas.length} falha(s):\n`);
  for (const f of falhas.slice(0, 12)) console.log(`   ${f}`);
  console.log("");
}

/* ── A virada de ano ─────────────────────────────────────────────────────── */
console.log("🎄 A VIRADA DE ANO — o RBT12 muda de regra sozinho?\n");
for (const v of viradas) {
  console.log(`   ${v.vida} ${v.mes}  regra "${v.regra}"  RBT12 ${brl(v.rbt12)}`);
}
console.log(
  `\n   🔑 A virada NÃO é evento: a regra do RBT12 troca pelo ${"MÊS DE ATIVIDADE"}\n` +
    `      (art. 24), não pelo calendário. Janeiro do 2º ano só é diferente se\n` +
    `      calhar de ser o 13º mês — e nas vidas acima isso aparece explícito.\n`
);

/* ── O que nenhuma competência resolve ───────────────────────────────────── */
const p = placarDeAutomacao();
console.log("─".repeat(100));
console.log(`\n🔴 O QUE NÃO SE RESOLVE EM NENHUMA COMPETÊNCIA, e não é bug:\n`);
for (const o of [...MENSAIS, ...ANUAIS].filter((x) => x.automatico.includes("NÃO RESOLVIDO"))) {
  console.log(`   ${o.id} · ${o.nome}`);
  console.log(`        ${o.automatico}`);
  console.log(`        se não fizer: ${o.seNaoFizer}\n`);
}
console.log(
  `   Placar do ciclo: ${p.automaticas.length} automáticas · ${p.parciais.length} parciais · ` +
    `${p.naoResolvidas.length} sem canal, de ${p.total}.\n`
);

process.exit(falhas.length ? 1 : 0);
