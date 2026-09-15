/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎚️ SIMULAÇÃO — o cliente decide editar o pró-labore dele.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/estado-cnpj/simular-edicao-prolabore.mjs [P01] [valores...]`
 *
 * Pedido do Pedro em 15/09: *"coloque que a P01 resolve por conta própria
 * querer editar o valor do pró-labore dele dentro do nosso app e me devolva
 * como nosso motor e configurações respondem a uma solicitação desse tipo,
 * para vermos se continuamos coerentes com os cálculos e obrigações."*
 *
 * O cenário: a empresa vem pilotada, o cliente abre a tela, **desliga o
 * automático** e digita um valor. Para cada valor, o motor responde com os
 * alertas do caso DELE — não com aviso genérico.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { VIDAS } from "./vidas.mjs";
import { replayComPiloto, reais } from "./replay-piloto.mjs";
import { avaliarProLaboreEscolhido } from "../motor-fiscal/piloto-pro-labore.mjs";
import { rbt12De } from "../motor-fiscal/apurador.mjs";
import { competencia } from "./_modelo.mjs";

const [idArg, ...valoresArg] = process.argv.slice(2);
const id = (idArg || "P01").toUpperCase();
const vida = VIDAS.find((v) => v.id === id);
if (!vida) {
  console.log(`Vida ${id} não existe. Ids: ${VIDAS.map((v) => v.id).join(" ")}`);
  process.exit(1);
}

/* ── Reconstrói a empresa como ela estaria HOJE, já pilotada ────────────────
 * 🔑 É o estado que a tela teria: o cliente não está editando sobre a vida
 * ruim, está editando sobre a vida que o piloto vinha conduzindo. Editar
 * sobre o histórico errado daria alerta errado.                            */
const { linhas } = replayComPiloto({
  empresa: vida.empresa,
  competencias: vida.competencias,
});

const historicoPilotado = linhas.slice(0, -1).map((l, i) =>
  competencia({
    mes: l.mes,
    receita: vida.competencias[i].receita,
    proLaboreDeclarado: l.pilotado?.proLabore ?? 0,
    proLaborePago: l.pilotado?.proLabore ?? 0,
  })
);

const mesAtual = linhas[linhas.length - 1];
const receitaDoMes = mesAtual.receita;
const rbt = rbt12De({
  serieAnterior: historicoPilotado.map((c) => c.receita),
  receitaMesCorrente: receitaDoMes,
});

const valores = valoresArg.length
  ? valoresArg.map(Number)
  : [800, 1621, 4000, mesAtual.sugerido ?? 5400, 15000];

console.log(`\n${"═".repeat(96)}`);
console.log(`🎚️  ${vida.id} · ${vida.nome}`);
console.log(`${"═".repeat(96)}`);
console.log(`\nO cliente abre a tela em ${mesAtual.mes}, com o histórico já pilotado atrás.`);
console.log(`Faturou ${reais(receitaDoMes * 100)} este mês · RBT12 ${reais(rbt.rbt12 * 100)}`);
console.log(
  `O piloto vinha pagando ${reais((mesAtual.sugerido ?? 0) * 100)} ` +
    `(mínimo legal ${reais((mesAtual.minimoLegal ?? 0) * 100)}).`
);
console.log(`\nEle desliga o automático e digita:\n`);

const SIMBOLO = {
  impeditivo: "⛔",
  "risco-alto": "🔴",
  atencao: "🟡",
  informacao: "ℹ️ ",
};

for (const escolhido of valores) {
  const r = avaliarProLaboreEscolhido({
    empresa: vida.empresa,
    competenciasAnteriores: historicoPilotado,
    receitaDoMes,
    rbt12DoMes: rbt.rbt12,
    escolhido,
  });

  console.log("─".repeat(96));
  console.log(
    `▶  ${reais(escolhido * 100)}` +
      `   ${r.aceito ? "✅ o app aceita" : "⛔ o app NÃO pode aceitar"}` +
      `   · DARF do mês ${reais(r.custo.total)}` +
      (r.custo.contraSugerido !== null
        ? ` (${r.custo.contraSugerido >= 0 ? "+" : ""}${reais(r.custo.contraSugerido)} vs. a sugestão)`
        : "")
  );

  if (!r.alertas.length) {
    console.log(`   ✅ Nenhum alerta. O valor cobre o mínimo legal e a margem.`);
    continue;
  }

  for (const a of r.alertas) {
    console.log(`\n   ${SIMBOLO[a.gravidade] ?? "·"} ${a.titulo}`);
    console.log(`      ${quebrar(a.texto, 86, "      ")}`);
    if (a.caiEm != null)
      console.log(
        `      ⏳ E não se desfaz voltando atrás: mantendo esse valor, a queda ` +
          `começa na\n         ${a.caiEm}ª competência e são ${a.mesesEmV} dos ` +
          `próximos ${a.horizonte} meses no Anexo V` +
          (a.custoMensalEstimado
            ? `, cerca de ${reais(a.custoMensalEstimado * a.mesesEmV)} no total.`
            : ".")
      );
    if (a.fonte) console.log(`      ⚖️  ${a.fonte}`);
    if (a.confianca) console.log(`      ${a.confianca}`);
  }
  console.log("");
}

console.log("─".repeat(96));
console.log("");

function quebrar(texto, largura, recuo) {
  const palavras = texto.split(" ");
  const linhas = [];
  let atual = "";
  for (const p of palavras) {
    if ((atual + " " + p).trim().length > largura) {
      linhas.push(atual.trim());
      atual = p;
    } else atual += " " + p;
  }
  if (atual.trim()) linhas.push(atual.trim());
  return linhas.join("\n" + recuo);
}
