/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📐 AS EQUAÇÕES — valem para QUALQUER caso, não só para os que alguém contou
 * ═══════════════════════════════════════════════════════════════════════════
 * `node execucao/motor-fiscal/verificar-equacoes.mjs`
 *
 * Pergunta do Pedro em 17/09, e ela é a especificação:
 *
 *   *"muitos dos nossos resultados a gente ancora no que o contador disse, ou
 *   no meu caso que foi estudado. Mas quero saber… a assertividade deles para
 *   qualquer caso, mesmo que distinto de valores, mesmo que não sejam os
 *   valores que o contador falou e a gente acabou travando."*
 *
 * ── 🔴 O BURACO QUE ELE ACHOU, DITO EM MECÂNICA ────────────────────────────
 *
 * O `verificar-apurador.mjs` é **teste dourado**: ele prova que, NAQUELE
 * ponto, o número bate com o recibo do PGDAS-D, com a nota real ou com a
 * palavra do contador. É a prova mais forte que existe — e é **pontual**.
 *
 * 40 pontos certos não provam a curva entre eles. Se a fórmula da alíquota
 * efetiva estivesse errada para um RBT12 que ninguém testou, todo teste
 * dourado continuaria verde: eles só olham onde há documento.
 *
 * 🔑 **Esta suíte inverte a régua.** Ela não pergunta *"quanto dá aqui?"*,
 * pergunta ***"a relação vale em todo o domínio?"***. Nenhuma conferência
 * daqui cita valor de ninguém: as respostas certas saem da **própria lei**
 * (LC 123/2006 art. 18 §1º, Lei 8.212/91 art. 28 §5º, Lei 9.250/1995), ou
 * são **propriedades** que a função tem que ter para não ser absurda —
 * monotonia, ausência de penhasco, saturação no teto.
 *
 * ── ⚖️ O QUE ISTO PROVA, E O QUE NÃO PROVA ────────────────────────────────
 *
 * ✅ Prova: **a equação implementada é a equação escrita na lei**, e se
 *    comporta bem em toda a faixa do ME — não só nos pontos com documento.
 *
 * ❌ Não prova: que a **lei foi lida certo**. Se eu transcrevi a tabela
 *    errada, a varredura confirma a tabela errada com perfeição. Contra isso
 *    valem o teste dourado (documento) e o contador (leitura). As duas
 *    suítes existem porque nenhuma substitui a outra.
 *
 * ── 💰 SOBRE O CENTAVO ─────────────────────────────────────────────────────
 *
 * 🔒 A convenção de arredondamento está **ENCERRADA** (`_encerrados.mjs` ·
 * E-ARREDONDAMENTO), com recibo do PGDAS-D atrás. Aqui ela é **premissa**, e
 * o que se verifica é só que o desvio fica no tamanho previsto pela regra —
 * limitado pelo número de tributos, nunca em reais. Diferença de centavo
 * entre a soma das partes e o produto direto é a regra **funcionando**.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  FAIXAS,
  REPARTICAO,
  TRIBUTOS,
  FATOR_R,
  PREVIDENCIA,
  IRRF,
} from "./_tabelas.mjs";
import { apurarDAS, darfDoProLabore } from "./apurador.mjs";

/**
 * 🔒 A autoria da varredura escreve em REAIS — o domínio do ME é mais legível
 * assim ("de R$1.000 ao teto de R$360 mil"). O motor come CENTAVOS desde
 * 17/09, e `R()` é a fronteira, visível em cada chamada.
 */
const R = (emReaisDaAutoria) => Math.round(emReaisDaAutoria * 100);
import { proLaboreParaManterNoIII } from "./piloto-pro-labore.mjs";

/* ═══════════════════════════════════════════════════════════════════════════
 * O DOMÍNIO — e ele é o do ESCOPO, não um número que eu inventei
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 O ME vai até R$360 mil de RBT12 (LC 123 art. 3º II), então a varredura
 * cobre de zero ao teto. Receita mensal de R$1 a R$30 mil cobre o mesmo teto
 * dividido em doze, com folga.
 */
const TETO_ME = 360000;
const ANEXOS = ["III", "V"];

let passou = 0;
let falhou = 0;
const erros = [];

function afirma(oQue, verdade, evidencia = "") {
  if (verdade) {
    passou++;
    console.log(`   ✅ ${oQue}${evidencia ? `\n        ${evidencia}` : ""}`);
  } else {
    falhou++;
    erros.push(`${oQue} — ${evidencia}`);
    console.log(`   ❌ ${oQue}${evidencia ? `\n        ${evidencia}` : ""}`);
  }
}

const brl = (c) =>
  "R$ " + (c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

console.log(`\n${"═".repeat(84)}`);
console.log("📐 AS EQUAÇÕES — propriedade, não ponto");
console.log("═".repeat(84));
console.log("   Nenhuma conferência aqui cita valor de recibo, de contador ou de");
console.log("   persona. As respostas certas saem da lei e da forma da função.\n");

/* ═══════════════════════════════════════════════════════════════════════════
 * E1 · A FÓRMULA DA ALÍQUOTA EFETIVA É A DA LEI
 * ═══════════════════════════════════════════════════════════════════════════
 * LC 123/2006 art. 18 §1º: `(RBT12 × Aliq − PD) / RBT12`.
 *
 * 🔑 Ela compara o motor com a **fórmula**, ponto a ponto, em todo o domínio —
 * e não com um resultado que alguém contou.
 *
 * ⚠️ E a fronteira dela está medida, não suposta. No teste de mutação de
 * 17/09 eu troquei a parcela a deduzir da 2ª faixa de **9.360 para 9.000**:
 * quem pegou foi o **E5** (o degrau na borda), e o E1 passou **verde**.
 *
 * Isso é correto e é o desenho: o E1 lê a mesma tabela que o motor lê, então
 * ele prova que **a conta é a do art. 18 §1º**, não que **o número da tabela
 * está certo**. Tabela errada é trabalho de outra régua — o teste dourado,
 * que compara com recibo emitido, e a leitura do contador.
 */
console.log("── E1 · a efetiva é (RBT12 × nominal − PD) / RBT12, em TODO o domínio\n");
{
  let divergiu = null;
  let testados = 0;

  for (const anexo of ANEXOS) {
    for (let rbt12 = 1000; rbt12 <= TETO_ME; rbt12 += 1000) {
      const faixa = FAIXAS[anexo].find((f) => rbt12 <= f.ate);
      const pelaLei = (rbt12 * faixa.nominal - faixa.deduzir) / rbt12;
      const doMotor = apurarDAS({ receitaMes: R(1000), rbt12: R(rbt12), anexo }).efetiva;
      testados++;
      // Tolerância de ponto flutuante, não de regra: 1e-12.
      if (Math.abs(pelaLei - doMotor) > 1e-12) {
        divergiu = `anexo ${anexo} · RBT12 ${rbt12} · lei ${pelaLei} × motor ${doMotor}`;
        break;
      }
    }
    if (divergiu) break;
  }

  afirma(
    "a alíquota efetiva do motor É a fórmula do art. 18 §1º",
    !divergiu,
    divergiu ?? `${testados} pontos de RBT12 × 2 anexos, do primeiro real ao teto do ME`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E2 · A REPARTIÇÃO FECHA EM 100%
 * ═══════════════════════════════════════════════════════════════════════════
 * Se a soma dos percentuais não der 1, o DAS ou cobra a mais ou some com
 * tributo — e nenhum teste de valor único pegaria, porque o erro apareceria
 * só na faixa não testada.
 */
console.log("\n── E2 · a repartição entre os 6 tributos soma 100% em TODA faixa\n");
{
  let quebrou = null;
  let faixasConferidas = 0;

  for (const anexo of ANEXOS) {
    for (const [faixa, reparticao] of Object.entries(REPARTICAO[anexo])) {
      const soma = TRIBUTOS.reduce((s, t) => s + (reparticao[t] ?? 0), 0);
      faixasConferidas++;
      if (Math.abs(soma - 1) > 1e-9) {
        quebrou = `anexo ${anexo} faixa ${faixa}: soma ${soma}`;
        break;
      }
    }
  }

  afirma(
    "nenhum tributo some nem é cobrado em dobro",
    !quebrou,
    quebrou ?? `${faixasConferidas} repartições conferidas (6 faixas × 2 anexos)`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E3 · O DESVIO DO ARREDONDAMENTO É DO TAMANHO QUE A REGRA PREVÊ
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 A convenção está ENCERRADA (E-ARREDONDAMENTO). Aqui não se discute se
 * ela está certa — se mede se o desvio tem o tamanho previsto por ela.
 *
 * 🔑 Seis parcelas, cada uma arredondada meio-pra-cima, desviam no máximo
 * meio centavo cada. O limite estrutural é 3 centavos; **se um dia passar
 * disso, não é arredondamento, é bug**. É isso que esta linha vigia — e é a
 * razão de ela existir sem ser "achado de centavo".
 */
console.log("\n── E3 · a soma das 6 parcelas desvia do produto em CENTAVOS, nunca em reais\n");
{
  let pior = 0;
  let onde = "";
  let amostras = 0;

  for (const anexo of ANEXOS) {
    for (let receita = 500; receita <= 30000; receita += 500) {
      for (let rbt12 = 12000; rbt12 <= TETO_ME; rbt12 += 12000) {
        const r = apurarDAS({ receitaMes: R(receita), rbt12: R(rbt12), anexo });
        const produtoDireto = Math.round(R(receita) * r.efetiva);
        const desvio = Math.abs(r.total - produtoDireto);
        amostras++;
        if (desvio > pior) {
          pior = desvio;
          onde = `anexo ${anexo} · receita ${receita} · RBT12 ${rbt12}`;
        }
      }
    }
  }

  afirma(
    "o desvio nunca passa de 3 centavos — o limite estrutural de 6 arredondamentos",
    pior <= 3,
    `pior desvio: ${pior} centavo(s), em ${onde} · ${amostras.toLocaleString("pt-BR")} apurações`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E4 · MONOTONIA — pagar mais imposto por faturar menos seria absurdo
 * ═══════════════════════════════════════════════════════════════════════════ */
console.log("\n── E4 · o DAS nunca CAI quando a receita sobe, nem quando o RBT12 sobe\n");
{
  let quebrouReceita = null;
  let quebrouRbt = null;

  for (const anexo of ANEXOS) {
    for (let rbt12 = 12000; rbt12 <= TETO_ME && !quebrouReceita; rbt12 += 12000) {
      let anterior = -1;
      for (let receita = 0; receita <= 30000; receita += 250) {
        const das = apurarDAS({ receitaMes: R(receita), rbt12: R(rbt12), anexo }).total;
        if (das < anterior) {
          quebrouReceita = `anexo ${anexo} · RBT12 ${rbt12} · receita ${receita}: ${brl(das)} < ${brl(anterior)}`;
          break;
        }
        anterior = das;
      }
    }

    for (let receita = 1000; receita <= 30000 && !quebrouRbt; receita += 1000) {
      let anterior = -1;
      for (let rbt12 = 1000; rbt12 <= TETO_ME; rbt12 += 1000) {
        const das = apurarDAS({ receitaMes: R(receita), rbt12: R(rbt12), anexo }).total;
        if (das < anterior) {
          quebrouRbt = `anexo ${anexo} · receita ${receita} · RBT12 ${rbt12}: ${brl(das)} < ${brl(anterior)}`;
          break;
        }
        anterior = das;
      }
    }
  }

  afirma("faturar mais nunca faz o DAS cair", !quebrouReceita, quebrouReceita ?? "monotônico em receita, nos 2 anexos");
  afirma("acumular mais nunca faz o DAS cair", !quebrouRbt, quebrouRbt ?? "monotônico em RBT12, nos 2 anexos");
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E5 · A BORDA DA FAIXA NÃO É PENHASCO
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 A parcela a deduzir existe exatamente para isto: sem ela, cruzar
 * R$180.000 de RBT12 saltaria de 6% para 11,2% de uma vez. É a mesma forma
 * do redutor do IRRF (art. 3º-A) — e foi esse raciocínio que, em 16/09,
 * provou que a leitura "seca" do contador não podia estar certa.
 */
console.log("\n── E5 · cruzar a borda de uma faixa não cria degrau\n");
{
  let pior = 0;
  let onde = "";

  for (const anexo of ANEXOS) {
    for (const f of FAIXAS[anexo]) {
      if (f.ate >= TETO_ME) continue;
      const antes = apurarDAS({ receitaMes: R(10000), rbt12: R(f.ate), anexo }).total;
      const depois = apurarDAS({ receitaMes: R(10000), rbt12: R(f.ate) + 1, anexo }).total;
      const degrau = depois - antes;
      if (degrau > pior) {
        pior = degrau;
        onde = `anexo ${anexo} · faixa ${f.faixa} → ${f.faixa + 1} em RBT12 ${f.ate}`;
      }
    }
  }

  afirma(
    "um real a mais de acumulado nunca custa mais de 1 centavo de DAS",
    pior <= 1,
    `pior degrau: ${pior} centavo(s), em ${onde}`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E6 · O ANEXO V É SEMPRE MAIS CARO QUE O III
 * ═══════════════════════════════════════════════════════════════════════════
 * É o que transforma o Fator R em decisão de produto. Se existisse um ponto
 * do domínio onde o V fosse mais barato, o piloto estaria empurrando o
 * cliente para o lado errado exatamente ali.
 */
console.log("\n── E6 · o Anexo V é mais caro que o III em TODO o domínio do ME\n");
{
  let inverteu = null;
  let menorFolga = Infinity;
  let ondeMenor = "";

  for (let rbt12 = 1000; rbt12 <= TETO_ME; rbt12 += 1000) {
    const iii = apurarDAS({ receitaMes: R(10000), rbt12: R(rbt12), anexo: "III" }).total;
    const v = apurarDAS({ receitaMes: R(10000), rbt12: R(rbt12), anexo: "V" }).total;
    if (v <= iii) {
      inverteu = `RBT12 ${rbt12}: V ${brl(v)} ≤ III ${brl(iii)}`;
      break;
    }
    if (v - iii < menorFolga) {
      menorFolga = v - iii;
      ondeMenor = `RBT12 ${rbt12}`;
    }
  }

  afirma(
    "nunca compensa estar no V — o Fator R aponta sempre para o mesmo lado",
    !inverteu,
    inverteu ?? `menor diferença: ${brl(menorFolga)} sobre R$10.000 de receita, em ${ondeMenor}`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E7 · O INSS DO SÓCIO É 11% ATÉ O TETO, E SATURA
 * ═══════════════════════════════════════════════════════════════════════════
 * Lei 8.212/91 art. 28 §5º. O teto é **da pessoa**, e o CLT do sócio consome
 * a folga antes do pró-labore — é a regra que o M-012 tinha quebrado.
 */
console.log("\n── E7 · INSS = 11% × min(pró-labore, teto − CLT), em toda combinação\n");
{
  let divergiu = null;
  let amostras = 0;

  for (let clt = 0; clt <= 12000; clt += 250) {
    for (let pl = 0; pl <= 20000; pl += 250) {
      const folga = Math.max(0, R(PREVIDENCIA.TETO_INSS) - R(clt));
      const pelaLei = Math.round(0.11 * Math.min(R(pl), folga));
      const doMotor = darfDoProLabore(R(pl), R(clt)).inss;
      amostras++;
      if (pelaLei !== doMotor) {
        divergiu = `pró-labore ${pl} · CLT ${clt}: lei ${brl(pelaLei)} × motor ${brl(doMotor)}`;
        break;
      }
    }
    if (divergiu) break;
  }

  afirma(
    "o INSS satura no teto DA PESSOA, e o CLT consome a folga antes",
    !divergiu,
    divergiu ?? `${amostras.toLocaleString("pt-BR")} combinações de pró-labore × CLT`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E8 · O LÍQUIDO DO SÓCIO NUNCA INVERTE — agora em TODA a faixa
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 Generaliza o **G10b**, que varria só R$4.900–7.500 porque era a vizinhança
 * do penhasco que se investigava em 16/09. A propriedade, porém, não é sobre
 * aquela vizinhança: ganhar mais bruto nunca pode devolver menos líquido, em
 * ponto nenhum. Aqui a varredura é de R$0 a R$30.000, de um real em um real.
 */
console.log("\n── E8 · ganhar mais bruto nunca devolve menos líquido — R$0 a R$30.000\n");
{
  let inverteu = null;
  let anterior = -1;
  let passos = 0;

  for (let bruto = 0; bruto <= 30000; bruto += 1) {
    const g = darfDoProLabore(R(bruto), 0);
    const liquido = R(bruto) - g.inss - g.irrf;
    passos++;
    if (liquido < anterior) {
      inverteu = `em R$${bruto}: líquido cai ${brl(anterior - liquido)} ganhando R$1 a mais`;
      break;
    }
    anterior = liquido;
  }

  afirma(
    "o líquido é monotônico em todo o domínio, não só perto do redutor",
    !inverteu,
    inverteu ?? `${passos.toLocaleString("pt-BR")} brutos testados, de um real em um real`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E9 · A DEDUÇÃO ESCOLHIDA É SEMPRE A MELHOR PARA O SÓCIO
 * ═══════════════════════════════════════════════════════════════════════════
 * Lei 9.250/1995: o contribuinte usa o desconto simplificado OU as deduções
 * legais — a que lhe for mais favorável. Escolher a pior é cobrar imposto a
 * mais de quem confiou no app.
 */
console.log("\n── E9 · a dedução é sempre max(INSS, desconto simplificado)\n");
{
  let errou = null;

  for (let pl = 0; pl <= 20000; pl += 50) {
    const g = darfDoProLabore(R(pl), 0);
    const esperado = Math.max(g.inss, R(IRRF.descontoSimplificado));
    if (g.deducaoAplicada !== esperado) {
      errou = `pró-labore ${pl}: aplicou ${brl(g.deducaoAplicada)}, o melhor era ${brl(esperado)}`;
      break;
    }
  }

  afirma(
    "nunca se aplica a dedução pior — o sócio não paga imposto a mais por escolha nossa",
    !errou,
    errou ?? "401 pontos de pró-labore, de R$0 a R$20.000"
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * E10 · A FUNÇÃO INVERSA DO PILOTO RESOLVE O QUE PROMETE
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔑 A conferência mais forte da suíte, e a que responde a pergunta do Pedro
 * de forma mais direta.
 *
 * O piloto não lê uma tabela: ele **inverte a equação do Fator R** para achar
 * quanto pagar. Aqui isso é verificado do jeito que uma inversa se verifica —
 * aplicando o resultado de volta na função original e conferindo se o alvo
 * foi atingido, para combinações que ninguém nunca contou a ninguém.
 */
console.log("\n── E10 · o pró-labore que o piloto calcula ENTREGA o Fator R prometido\n");
{
  let naoEntregou = null;
  let casos = 0;
  let piorFolga = Infinity;

  for (let receita = 1000; receita <= 30000; receita += 500) {
    for (let mesesPagos = 0; mesesPagos <= 11; mesesPagos += 1) {
      for (const pagoPorMes of [0, 1621, 5000]) {
        const anteriores = Array.from({ length: 11 }, (_, i) => ({
          receita: i < mesesPagos ? R(receita) : 0,
          proLaborePago: i < mesesPagos ? R(pagoPorMes) : 0,
        }));

        const r = proLaboreParaManterNoIII({
          competenciasAnteriores: anteriores,
          receitaDoMes: R(receita),
          alvo: FATOR_R.LIMIAR,
        });
        casos++;

        // Sem receita na janela o Fator R é infinito e já entrega o III:
        // exigir pró-labore ali seria custo puro, e o motor devolve `semReceita`.
        if (r.semReceita) continue;

        const receitaDaJanela = anteriores.reduce((s, c) => s + c.receita, 0) + R(receita);
        const folhaFinal =
          anteriores.reduce((s, c) => s + c.proLaborePago, 0) + r.minimo;
        const fatorRResultante = folhaFinal / receitaDaJanela;
        const folga = fatorRResultante - FATOR_R.LIMIAR;

        if (folga < -1e-9) {
          naoEntregou = `receita ${receita} · ${mesesPagos}m pagos a ${pagoPorMes}: pagar ${brl(r.minimo)} dá Fator R ${(fatorRResultante * 100).toFixed(4)}%`;
          break;
        }
        if (folga < piorFolga) piorFolga = folga;
      }
      if (naoEntregou) break;
    }
    if (naoEntregou) break;
  }

  afirma(
    "aplicar o valor calculado sempre atinge o limiar — a inversa fecha",
    !naoEntregou,
    naoEntregou ??
      `${casos.toLocaleString("pt-BR")} combinações de receita × histórico × folha já paga · pior folga ${(piorFolga * 100).toFixed(6)} pp acima do limiar`
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * O PLACAR
 * ═══════════════════════════════════════════════════════════════════════════ */

console.log(`\n${"─".repeat(84)}`);

if (falhou) {
  console.log(`\n🔴 ${falhou} propriedade(s) QUEBRARAM · ${passou} valem\n`);
  for (const e of erros) console.log(`   · ${e}`);
  console.log("");
  process.exit(1);
}

console.log(`\n✅ ${passou} propriedades valem em todo o domínio do ME\n`);
console.log("⚠️  O que isto NÃO prova: que a LEI foi lida certo. Tabela transcrita");
console.log("   errada passa aqui com perfeição — a varredura confirmaria o erro em");
console.log("   todo ponto. Contra isso valem o teste dourado, que compara com");
console.log("   documento emitido, e o contador, que compara com a leitura dele.\n");
