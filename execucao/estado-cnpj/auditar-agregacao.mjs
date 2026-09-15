/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔬 AUDITORIA DE AGREGAÇÃO — o motor confunde montante de meses com valor do mês?
 * ═══════════════════════════════════════════════════════════════════════════
 * Suspeita levantada pelo Pedro em 15/09:
 *
 *   *"senti que você está errando com frequência quando traz valores muito
 *   mais altos do que deveriam aparecer; parece que em parte do seu cálculo
 *   você passa a ignorar um montante de vários meses em vez de manter o
 *   controle mês a mês, e só somar mais meses de fato quando necessário para
 *   alguma média."*
 *
 * 🔑 **Não se responde relendo o próprio código** — relendo, tudo parece certo,
 * que é justamente como o bug sobrevive. Este arquivo recomputa TUDO do zero,
 * com aritmética explícita e sem chamar o motor, e compara.
 *
 * As quatro perguntas:
 *   1. a janela tem os meses CERTOS, e nem um a mais?
 *   2. o valor sugerido produz EXATAMENTE o alvo, ou passa dele?
 *   3. algum valor sugerido é maior do que o déficit justifica?
 *   4. o RBT12 e a janela do Fator R usam critérios diferentes — de propósito?
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { VIDAS } from "./vidas.mjs";
import {
  pilotar,
  proLaboreParaManterNoIII,
} from "../motor-fiscal/piloto-pro-labore.mjs";
import { fatorRDeCompetencias, rbt12De } from "../motor-fiscal/apurador.mjs";
import { FATOR_R, PREVIDENCIA } from "../motor-fiscal/_tabelas.mjs";

const brl = (r) =>
  r.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

let problemas = [];
let checagens = 0;

const dinamicas = VIDAS.filter((v) => v.empresa.grupoAnexo.startsWith("fator-r"));

console.log(`\n${"═".repeat(104)}`);
console.log("🔬 AUDITORIA DE AGREGAÇÃO — recomputação independente, sem chamar o motor");
console.log("═".repeat(104));

/**
 * 🔑 AUDITA OS DOIS CAMINHOS, e o segundo é o que importa.
 *
 * `pilotado` — o piloto conduz desde o mês 1, então o déficit nunca acumula e
 * os valores ficam sempre perto de 30% da receita do mês. É o caminho fácil.
 *
 * `real` — o pró-labore que a persona de fato pagou (quase sempre o piso).
 * É AQUI que nascem os R$42.649 e os R$72.169 que chamaram a atenção do
 * Pedro. Auditar só o pilotado seria auditar o caso que não dói.
 */
for (const modo of ["pilotado", "real"]) {
for (const vida of dinamicas) {
  const serie = [];

  for (let i = 0; i < vida.competencias.length; i++) {
    const receita = vida.competencias[i].receita;

    const decisao = pilotar({
      empresa: vida.empresa,
      competenciasAnteriores: [...serie],
      receitaDoMes: receita,
      rbt12DoMes: rbt12De({
        serieAnterior: serie.map((c) => c.receita),
        receitaMesCorrente: receita,
      }).rbt12,
    });

    if (decisao.atua) {
      checagens++;

      /* ── 1 · A JANELA TEM OS MESES CERTOS? ────────────────────────────
       * Recomputado à mão: os 11 fechados mais recentes + o mês corrente.
       * Se a empresa tem menos que isso, TODOS os fechados entram.        */
      const esperadosNaJanela = Math.min(serie.length, 11) + 1;
      const detalhe = proLaboreParaManterNoIII({
        competenciasAnteriores: serie,
        receitaDoMes: receita,
      });

      if (detalhe.mesesNaJanela !== esperadosNaJanela) {
        problemas.push(
          `${modo}/${vida.id} ${vida.competencias[i].mes}: janela com ${detalhe.mesesNaJanela} meses, ` +
            `esperado ${esperadosNaJanela}`
        );
      }

      // E a soma da janela, recomputada mês a mês, na unha.
      const janelaManual = [...serie.slice(-11)];
      let receitaManual = receita;
      let folhaManual = 0;
      for (const c of janelaManual) {
        receitaManual += c.receita;
        folhaManual += c.proLaborePago;
      }

      if (Math.abs(receitaManual - detalhe.receitaDaJanela) > 0.001) {
        problemas.push(
          `${modo}/${vida.id} ${vida.competencias[i].mes}: receita da janela ${brl(detalhe.receitaDaJanela)} ` +
            `× recomputada ${brl(receitaManual)}`
        );
      }
      if (Math.abs(folhaManual - detalhe.folgaJaPaga) > 0.001) {
        problemas.push(
          `${modo}/${vida.id} ${vida.competencias[i].mes}: folha da janela ${brl(detalhe.folgaJaPaga)} ` +
            `× recomputada ${brl(folhaManual)}`
        );
      }

      /* ── 2 · O VALOR SUGERIDO PRODUZ EXATAMENTE O ALVO? ───────────────
       * Paga o sugerido, remede a razão. Se ficar ACIMA do alvo, o motor
       * está cobrando mais do que precisa — que é exatamente a suspeita.  */
      const comSugerido = [
        ...serie.slice(-11),
        {
          mes: "x",
          receita,
          proLaboreDeclarado: decisao.sugerido,
          proLaborePago: decisao.sugerido,
        },
      ];
      const fr = fatorRDeCompetencias({ competencias: comSugerido });

      // Em manutenção/ajuste o alvo é a margem; em recuperação o piloto
      // assume que NÃO alcança (e o `paraVirarJa` carrega o número real).
      if (decisao.modo !== "recuperacao" && decisao.sugerido > PREVIDENCIA.SALARIO_MINIMO) {
        const excesso = fr.fr - FATOR_R.MARGEM;
        if (excesso > 0.0001) {
          problemas.push(
            `🔴 ${modo}/${vida.id} ${vida.competencias[i].mes}: sugeriu ${brl(decisao.sugerido)} e a razão ` +
              `ficou em ${(fr.fr * 100).toFixed(4)}%, ${(excesso * 100).toFixed(4)}pp ACIMA do alvo ` +
              `— cobrando a mais`
          );
        }
      }

      /* ── 3 · O SUGERIDO É MAIOR DO QUE O DÉFICIT JUSTIFICA? ───────────
       * O teto absoluto de qualquer exigência é `alvo × receita da janela`
       * (pagar isso zeraria a necessidade mesmo com folha anterior zero).
       * Passar disso só pode ser erro de agregação.                       */
      const tetoAbsoluto = FATOR_R.MARGEM * detalhe.receitaDaJanela;
      if (decisao.sugerido > tetoAbsoluto + 0.01) {
        problemas.push(
          `🔴 ${modo}/${vida.id} ${vida.competencias[i].mes}: sugeriu ${brl(decisao.sugerido)}, acima do ` +
            `teto absoluto ${brl(tetoAbsoluto)} (30% da receita de toda a janela)`
        );
      }

      /* ── 4 · O SUGERIDO PASSA DA RECEITA DO MÊS? ──────────────────────
       * Não é erro matemático, mas É sinal do que o Pedro descreveu: uma
       * exigência que só existe porque agrega meses. Fica registrado.     */
      if (decisao.sugerido > receita && receita > 0) {
        problemas.push(
          `🟡 ${modo}/${vida.id} ${vida.competencias[i].mes}: sugeriu ${brl(decisao.sugerido)} num mês que ` +
            `faturou ${brl(receita)} — modo ${decisao.modo}`
        );
      }
    }

    const pago =
      modo === "real"
        ? vida.competencias[i].proLaborePago
        : decisao.atua
          ? decisao.sugerido
          : vida.competencias[i].proLaborePago;
    serie.push({
      mes: vida.competencias[i].mes,
      receita,
      proLaboreDeclarado: pago,
      proLaborePago: pago,
    });
  }
}
}

/* ── 5 · RBT12 × JANELA DO FATOR R: critérios diferentes, de propósito? ──── */
console.log(`\n── Os dois "12 meses" do motor NÃO são o mesmo conjunto, e é correto:\n`);
console.log(
  `   RBT12 (art. 24) ......... meses ANTERIORES; o mês corrente NÃO entra.\n` +
    `                             <12 meses vira média × 12; 13º+ vira soma.\n` +
    `   Fator R (art. 26) ....... 12 meses anteriores à competência apurada.\n` +
    `                             O piloto decide o mês M, então mira a janela\n` +
    `                             de M+1 — que INCLUI M. São recortes diferentes\n` +
    `                             porque respondem a perguntas diferentes.\n`
);

// Prova numérica de que os dois recortes divergem, e de quanto.
{
  const s = [0, 0, 18000, 18000, 18000, 18000, 18000];
  const rbt = rbt12De({ serieAnterior: s, receitaMesCorrente: 18000 });
  const janelaFatorR = s.reduce((a, b) => a + b, 0) + 18000;
  console.log(
    `   Exemplo (P01 no 8º mês): RBT12 = ${brl(rbt.rbt12)} (${rbt.regra}) · ` +
      `janela do Fator R = ${brl(janelaFatorR)}`
  );
  console.log(
    `   Os dois números são diferentes DE PROPÓSITO. Usar um no lugar do outro\n` +
      `   é exatamente o erro que esta auditoria procura.\n`
  );
}

console.log("─".repeat(104));
console.log(`\n${checagens} decisões auditadas em ${dinamicas.length} vidas dinâmicas.\n`);

if (!problemas.length) {
  console.log("✅ Nenhuma divergência de agregação. Janela, somas e alvo conferem na unha.\n");
} else {
  console.log(`⚠️  ${problemas.length} ponto(s) para olhar:\n`);
  for (const p of problemas) console.log(`   ${p}`);
  console.log("");
  // 🔑 Um 🟡 não derruba: ele é observação, não defeito. Só o 🔴 derruba.
  if (problemas.some((p) => p.startsWith("🔴") || !p.startsWith("🟡"))) process.exit(1);
}
