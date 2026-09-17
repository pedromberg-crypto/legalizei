/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ↩️  O PILOTO TRAZ DE VOLTA? — a pergunta do Pedro em 15/09.
 * ═══════════════════════════════════════════════════════════════════════════
 * *"parece que todas as vezes que a gente simulou de no meio do caminho a
 * persona trocar o pró-labore e afetar diretamente levando para o Anexo V,
 * parece que o usuário fica 'o resto da vida' nesse anexo. O nosso recálculo
 * mensal e reajuste de pró-labore não fariam esse usuário voltar para o III?"*
 *
 * 🔴 **A pergunta expõe um viés da simulação anterior, não do motor.** O
 * `avaliarProLaboreEscolhido` projeta com o valor escolhido **fixo** por 24
 * meses, porque a pergunta dele é *"e se você mantiver isso?"*. Quem edita um
 * mês e deixa o piloto seguir vive outra história — e ninguém tinha medido
 * qual.
 *
 * Este arquivo mede as três, lado a lado:
 *
 *   A · piloto sempre ligado ......... o baseline
 *   B · edita 1 mês, piloto retoma ... o caso real de quem mexe e esquece
 *   C · edita e desliga de vez ....... o que o alerta de hoje projeta
 *
 * `node execucao/estado-cnpj/simular-retomada.mjs [P01] [valor] [horizonte]`
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { VIDAS } from "../vidas/vidas.mjs";
import { pilotar } from "../regra/piloto-pro-labore.mjs";
import {
  fatorRDeCompetencias,
  aliquotaEfetiva,
  rbt12De,
  emCentavos,
  emReais,
} from "../regra/apurador.mjs";
import { PREVIDENCIA } from "../regra/_tabelas.mjs";

const [idArg, valorArg, horArg] = process.argv.slice(2);
const id = (idArg || "P01").toUpperCase();
const valorEditado = Number(valorArg ?? PREVIDENCIA.SALARIO_MINIMO);
const HORIZONTE = Number(horArg ?? 18);

const vida = VIDAS.find((v) => v.id === id);
if (!vida) {
  console.log(`Vida ${id} não existe.`);
  process.exit(1);
}

const brl = (r) =>
  r.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Roda a vida mês a mês sob uma política de pró-labore.
 *
 * @param politica  (mes, decisao, indice) => valor em REAIS
 */
function rodar({ receitas, politica }) {
  const serie = [];
  const linhas = [];

  for (let i = 0; i < receitas.length; i++) {
    const receita = receitas[i];

    const rbt = rbt12De({
      serieAnterior: serie.map((c) => c.receita),
      receitaMesCorrente: receita,
    });

    const decisao = pilotar({
      empresa: vida.empresa,
      competenciasAnteriores: [...serie],
      receitaDoMes: receita,
      rbt12DoMes: rbt.rbt12,
    });

    const proLabore = politica(i, decisao);

    serie.push({
      mes: `m${i + 1}`,
      receita,
      proLaboreDeclarado: proLabore,
      proLaborePago: proLabore,
    });

    // O anexo da competência é decidido pelos 12 meses ANTERIORES a ela.
    const janela = serie.slice(0, i).slice(-12);
    const fr = janela.length ? fatorRDeCompetencias({ competencias: janela }) : null;
    const anexo = fr?.anexo ?? "III";

    const efetiva = aliquotaEfetiva(rbt.rbt12, anexo);
    const das = receita > 0 && efetiva != null ? emCentavos(receita * efetiva) : 0;

    linhas.push({
      i: i + 1,
      receita,
      proLabore,
      modo: decisao.atua ? decisao.modo : null,
      minimoLegal: decisao.atua ? decisao.minimoLegal : null,
      fr: fr?.fr ?? null,
      anexo,
      das,
    });
  }

  return linhas;
}

/* ── A série: a vida guardada + projeção com a última receita ─────────────── */
const receitasReais = vida.competencias.map((c) => c.receita);
const ultima = receitasReais[receitasReais.length - 1];
const receitas = [
  ...receitasReais,
  ...Array(Math.max(0, HORIZONTE - receitasReais.length)).fill(ultima),
];

// O mês da edição: a última competência que a vida guardada de fato tem.
const MES_EDICAO = receitasReais.length - 1; // índice 0-based

const politicaPiloto = (i, d) =>
  d.atua ? d.sugerido : vida.competencias[i]?.proLaborePago ?? PREVIDENCIA.SALARIO_MINIMO;

const cenarios = {
  A: {
    rotulo: "piloto sempre ligado",
    linhas: rodar({ receitas, politica: politicaPiloto }),
  },
  B: {
    rotulo: `edita SÓ o mês ${MES_EDICAO + 1} para ${brl(valorEditado)}, piloto retoma`,
    linhas: rodar({
      receitas,
      politica: (i, d) => (i === MES_EDICAO ? valorEditado : politicaPiloto(i, d)),
    }),
  },
  C: {
    rotulo: `edita no mês ${MES_EDICAO + 1} e DESLIGA o piloto de vez`,
    linhas: rodar({
      receitas,
      politica: (i, d) => (i >= MES_EDICAO ? valorEditado : politicaPiloto(i, d)),
    }),
  },
};

/* ── Saída ─────────────────────────────────────────────────────────────────── */
console.log(`\n${"═".repeat(112)}`);
console.log(`↩️  ${vida.id} · ${vida.nome}`);
console.log(
  `O piloto conduz até o mês ${MES_EDICAO}, e no mês ${MES_EDICAO + 1} o cliente digita ${brl(valorEditado)}.`
);
console.log(`Horizonte de ${HORIZONTE} competências.`);
console.log("═".repeat(112));

console.log(
  "\n" +
    "mês".padStart(4) +
    "receita".padStart(13) +
    " │" +
    "  A · sempre ligado".padEnd(30) +
    "│" +
    "  B · edita 1 mês, piloto retoma".padEnd(32) +
    "│" +
    "  C · desliga de vez".padEnd(26)
);
console.log("─".repeat(112));

for (let i = 0; i < receitas.length; i++) {
  const cel = (l) =>
    `${l.anexo} ${l.fr == null ? "—" : Number.isFinite(l.fr) ? (l.fr * 100).toFixed(1) + "%" : "∞"}` +
    ` ${brl(l.proLabore)}`;

  const marca = i === MES_EDICAO ? "✏️ " : "  ";
  console.log(
    `${marca}${String(i + 1).padStart(2)}` +
      brl(receitas[i]).padStart(13) +
      " │ " +
      cel(cenarios.A.linhas[i]).padEnd(29) +
      "│ " +
      cel(cenarios.B.linhas[i]).padEnd(31) +
      "│ " +
      cel(cenarios.C.linhas[i]).padEnd(25)
  );
}

console.log("─".repeat(112));

for (const [k, c] of Object.entries(cenarios)) {
  const emV = c.linhas.filter((l) => l.anexo === "V");
  const dasTotal = c.linhas.reduce((s, l) => s + l.das, 0);
  const plTotal = c.linhas.reduce((s, l) => s + l.proLabore, 0);

  // A primeira competência em V, e a primeira em III DEPOIS dela.
  const primeiroV = c.linhas.findIndex((l) => l.anexo === "V");
  const voltou =
    primeiroV < 0
      ? null
      : c.linhas.findIndex((l, idx) => idx > primeiroV && l.anexo === "III");

  console.log(
    `\n${k} · ${c.rotulo}` +
      `\n   meses no Anexo V: ${emV.length}` +
      (primeiroV >= 0
        ? ` · cai no mês ${primeiroV + 1} · ${
            voltou > 0 ? `VOLTA ao III no mês ${voltou + 1}` : "não volta no horizonte"
          }`
        : "") +
      `\n   DAS do período: ${emReais(dasTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}` +
      ` · pró-labore pago: ${brl(plTotal)}`
  );
}

console.log("");
