/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔎 RASTRO DO PILOTO — onde o fio ativou, com que dado, e devolvendo o quê.
 * ═══════════════════════════════════════════════════════════════════════════
 * Uso:  node execucao/estado-cnpj/rastrear-piloto.mjs [P01 P16 …]
 *       sem argumento, roda TODAS as vidas `fator-r-dinamico`.
 *
 * Não é teste (quem afirma é o `verificar.mjs`). É a vista de auditoria que o
 * Pedro pediu: seguir um lead do mês 1 ao último e ver, competência a
 * competência, se o piloto entrou, o que leu e o que respondeu.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { VIDAS } from "./vidas.mjs";
import { replayComPiloto, reais } from "./replay-piloto.mjs";

const pedidas = process.argv.slice(2).map((s) => s.toUpperCase());
const alvo = VIDAS.filter((v) =>
  pedidas.length
    ? pedidas.includes(v.id)
    : v.empresa.grupoAnexo.startsWith("fator-r")
);

if (!alvo.length) {
  console.log("Nenhuma vida corresponde. Ids:", VIDAS.map((v) => v.id).join(" "));
  process.exit(1);
}

const pct = (x) =>
  x == null ? "—" : Number.isFinite(x) ? `${(x * 100).toFixed(1)}%` : "∞";

for (const vida of alvo) {
  const { linhas, resumo } = replayComPiloto({
    empresa: vida.empresa,
    competencias: vida.competencias,
  });

  console.log(`\n${"═".repeat(128)}`);
  console.log(`${vida.id} · ${vida.nome}`);
  console.log(
    `CNAE ${vida.empresa.cnaePrincipal} · ${vida.empresa.grupoAnexo}` +
      (vida.empresa.cltDoSocio ? ` · CLT do sócio ${reais(vida.empresa.cltDoSocio * 100)}` : "")
  );
  console.log("═".repeat(128));

  const C = { mes: 9, dinheiro: 14, fio: 16, jan: 8, anexo: 13 };

  console.log(
    "\n" +
      "mês".padEnd(C.mes) +
      "receita".padStart(C.dinheiro) +
      " │ " +
      "fio".padEnd(C.fio) +
      "janela".padEnd(C.jan) +
      "leu receita".padStart(C.dinheiro) +
      "leu folha".padStart(C.dinheiro) +
      " │ " +
      "mínimo".padStart(C.dinheiro) +
      "sugeriu".padStart(C.dinheiro) +
      " │ " +
      "REAL".padStart(C.anexo) +
      "PILOTADO".padStart(C.anexo)
  );
  console.log("─".repeat(128));

  for (const l of linhas) {
    const fio = l.ativou ? `✅ ${l.modo}` : `⬜ ${l.motivoDoSilencio ?? "—"}`;
    const jan = l.entrada
      ? `${l.entrada.mesesNaJanela}m${l.entrada.anualiza ? "·an" : ""}`
      : "—";
    console.log(
      l.mes.padEnd(C.mes) +
        reais(l.receita * 100).padStart(C.dinheiro) +
        " │ " +
        fio.padEnd(C.fio) +
        jan.padEnd(C.jan) +
        (l.entrada ? reais(l.entrada.receitaDaJanela * 100) : "—").padStart(C.dinheiro) +
        (l.entrada ? reais(l.entrada.folhaJaPagaNaJanela * 100) : "—").padStart(C.dinheiro) +
        " │ " +
        (l.minimoLegal != null ? reais(l.minimoLegal * 100) : "—").padStart(C.dinheiro) +
        (l.sugerido != null ? reais(l.sugerido * 100) : "—").padStart(C.dinheiro) +
        " │ " +
        `${l.real?.anexo ?? "—"} ${pct(l.real?.fatorR)}`.padStart(C.anexo) +
        `${l.pilotado?.anexo ?? "—"} ${pct(l.pilotado?.fatorR)}`.padStart(C.anexo)
    );

    if (l.alerta) console.log(`${" ".repeat(11)}⚠️  ${l.alerta}`);
    if (l.paraVirarJa != null)
      console.log(
        `${" ".repeat(11)}↳ para virar já: ${reais(l.paraVirarJa * 100)} ` +
          `(sustentável ${reais(l.sugerido * 100)})`
      );
  }

  console.log("─".repeat(128));
  console.log(
    `fio ativou em ${resumo.fioAtivou}/${resumo.competencias} competências` +
      (resumo.fioSilenciou
        ? ` · silenciou em ${resumo.fioSilenciou} (${resumo.motivosDoSilencio.join(", ")})`
        : "")
  );
  console.log(
    `meses em Anexo V — real ${resumo.mesesEmV.real} · pilotado ${resumo.mesesEmV.pilotado}`
  );
  console.log(
    `DAS   real ${reais(resumo.dasReal)} · pilotado ${reais(resumo.dasPilotado)}`
  );
  console.log(
    `DARF  real ${reais(resumo.darfReal)} · pilotado ${reais(resumo.darfPilotado)}`
  );
  console.log(
    `pró-labore  real ${reais(resumo.proLaboreReal * 100)} · pilotado ${reais(
      resumo.proLaborePilotado * 100
    )}`
  );
  console.log(`🔑 SALDO DO CLIENTE: ${reais(resumo.saldo)}`);
}

console.log("");
