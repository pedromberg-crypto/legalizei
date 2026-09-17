---
tipo: referencia
status: vivo
data: 2026-09-14
assunto: prompt-fechamento-motor-fiscal
tags: [pesquisa, prompt, gemini, fiscal, motor, irrf, fator-r]
---

# 🔎 Prompt de pesquisa — o fechamento do motor fiscal

> 🧭 **Como usar:** colar no **Gemini com Google Search**. O Pedro roda fora e cola o retorno ([[legalize-pesquisa-grande-via-gemini]]).
>
> 🎯 **É a 2ª rodada.** A 1ª ([[prompt-pesquisa-lacunas-motor-fiscal]]) fechou RBT12, ISS retido e sublimite. Esta fecha o que sobrou, e aproveita a rodada pra ratificar o que hoje se apoia em **tela de concorrente**.
>
> 🔴 **Duas perguntas mudam número na tela do cliente:** a **P1** (IRRF) e a **P2** (CPP no numerador). A P2 tem **tensão doutrinária real** e está parada na fila da Larissa desde 15/07.

---

## O prompt

```
Você é um especialista em Simples Nacional e em tributação de pró-labore.
Responda em português do Brasil, com fonte primária e citação literal.

═══════════════════════════════════════════════════════════════════
CONTEXTO TRAVADO — responda SOMENTE dentro deste recorte
═══════════════════════════════════════════════════════════════════

A empresa é sempre:
· Microempresa (ME) optante pelo Simples Nacional
· Anexo III ou Anexo V, NUNCA Anexo I, II ou IV
· Prestadora de SERVIÇO não regulamentado (consultoria, publicidade,
  TI, design, ensino, tradução). Sem conselho de classe
· Sediada em Belo Horizonte / Minas Gerais
· De 1 a 4 sócios, TODOS pessoa física domiciliados no Brasil
· Sem clientes no exterior e sem sócios no exterior
· O caso padrão é SEM FUNCIONÁRIO. Pode ter, mas não é o padrão
· Faturamento até R$ 360.000/ano (teto do ME)

NÃO responda sobre: Lucro Presumido, Lucro Real, MEI, EPP como regime
permanente, comércio, indústria, ICMS, exportação de serviço,
atividades regulamentadas, sócio pessoa jurídica.

Se uma pergunta só fizer sentido fora deste recorte, DIGA ISSO em vez
de responder por analogia.

═══════════════════════════════════════════════════════════════════
FORMATO OBRIGATÓRIO DE CADA RESPOSTA
═══════════════════════════════════════════════════════════════════

1. Resposta direta, em uma frase
2. DISPOSITIVO LEGAL: lei/resolução/IN, artigo, parágrafo, inciso
3. CITAÇÃO LITERAL entre aspas, sem paráfrase
4. VIGÊNCIA em setembro de 2026, e alteração recente se houver
5. CONFIANÇA: alta (texto legal) / média (fonte oficial secundária) /
   baixa (interpretação)
6. EXEMPLO NUMÉRICO com os números que eu der

Não use blog, portal de contabilidade nem material de concorrente como
fonte primária. Se só houver isso, marque confiança BAIXA e diga qual
dispositivo precisaria ser lido.

═══════════════════════════════════════════════════════════════════
P1 — IRRF SOBRE PRÓ-LABORE EM 2026  🔴 BLOQUEIA
═══════════════════════════════════════════════════════════════════

Hoje eu uso esta tabela, capturada da tela de uma plataforma de
contabilidade (ou seja: NÃO é fonte primária):

  até 2.428,80 .... isento
  até 2.826,65 .... 7,5%  · deduzir 182,16
  até 3.751,05 .... 15%   · deduzir 394,16
  até 4.664,68 .... 22,5% · deduzir 675,49
  acima ........... 27,5% · deduzir 908,73

1.1 Esta tabela está VIGENTE para os fatos geradores de 2026? Se não,
    qual é a correta e qual o ato que a fixou?

1.2 🔴 A Lei nº 15.270/2025 alterou o IRPF. Preciso saber exatamente o
    MECANISMO, porque muda o código:
    (a) ela ALTERA as faixas da tabela mensal de retenção na fonte?
    (b) ou cria um REDUTOR / desconto que convive com a tabela?
    (c) ou vale só na DECLARAÇÃO ANUAL, sem efeito na retenção mensal?
    Se for redutor, qual a fórmula exata e até que faixa de renda?

1.3 Um sócio com pró-labore de R$ 3.360,00/mês, sem dependentes e sem
    outras deduções, paga quanto de IRRF retido na competência de
    setembro/2026? Mostre a conta inteira, incluindo a dedução do INSS
    da base.

1.4 A base do IRRF é o pró-labore MENOS o INSS retido do segurado?
    Existe alguma outra dedução obrigatória antes da aplicação da
    alíquota, para um sócio SEM dependentes?

1.5 O "desconto simplificado" mensal se aplica ao pró-labore de sócio,
    ou é exclusivo de rendimento do trabalho assalariado?

═══════════════════════════════════════════════════════════════════
P2 — A CPP EMBUTIDA NO DAS ENTRA NO NUMERADOR DO FATOR R?  🔴
═══════════════════════════════════════════════════════════════════

Esta pergunta está parada há dois meses porque tenho duas leituras
opostas, e ela muda quanto de pró-labore eu RECOMENDO ao cliente.

  Leitura 1: SIM. A CPP patronal compõe a "massa salarial" do Fator R
  mesmo sendo paga embutida no DAS, e citam a Solução de Consulta
  COSIT nº 17/2021.

  Leitura 2: NÃO. O art. 18 §24 da LC 123/2006 fala em encargos
  "efetivamente recolhidos"; numa ME sem funcionário a CPP não é
  recolhida à parte, então o numerador seria só o pró-labore.

2.1 Qual das duas está correta? Cite o dispositivo e, se existir, a
    Solução de Consulta COSIT, com número, ano e ementa literal.

2.2 Se a CPP ENTRA: como se calcula o valor dela? É
    `% de repartição da CPP no anexo × DAS pago`? Para o Anexo III
    faixa 1 esse percentual é 43,40%?

2.3 🔑 O efeito colateral que preciso confirmar: se a CPP entra no
    numerador e ela é proporcional à receita, ela também infla o
    denominador? Ou o denominador é só a receita bruta, sem tocar?

2.4 EXEMPLO: empresa do Anexo III faixa 1, receita de R$ 12.000 no mês
    e pró-labore de R$ 3.360. Qual o Fator R com e sem a CPP no
    numerador? Qual pró-labore mínimo atinge 28% em cada leitura?

═══════════════════════════════════════════════════════════════════
P3 — PRÓ-LABORE: É OBRIGATÓRIO, E QUAL O MÍNIMO?
═══════════════════════════════════════════════════════════════════

3.1 O sócio-administrador que trabalha na empresa é OBRIGADO a receber
    pró-labore? Existe dispositivo que obrigue, ou é decorrência da
    obrigação previdenciária do contribuinte individual?

3.2 Se ele pode ficar SEM pró-labore em um mês, isso é lícito mesmo
    havendo faturamento nesse mês? Muda se houver distribuição de
    lucro no mesmo período?

3.3 🔴 Qual é o VALOR MÍNIMO do pró-labore? É o salário mínimo
    (R$ 1.621,00 em 2026), ou existe piso diferente? Vi um caso real
    de pró-labore de R$ 100,00 declarado — isso é regular?

3.4 A alíquota de INSS do sócio é 11% ou 20%? Em que condição cada uma
    se aplica, e o que muda quando a empresa é optante do Simples?

3.5 Existe 13º salário de pró-labore? Se existir, ele entra no
    numerador do Fator R e em qual competência?

═══════════════════════════════════════════════════════════════════
P4 — DAS PAGO EM ATRASO: JUROS, MULTA E SELIC
═══════════════════════════════════════════════════════════════════

4.1 Qual a fórmula EXATA dos acréscimos do DAS pago após o vencimento?
    Quero multa de mora e juros separados, com percentual, teto e
    termo inicial de cada um.

4.2 A Selic acumulada entra como juros a partir de qual mês? Como se
    trata o mês do pagamento?

4.3 Existe multa MÍNIMA em valor absoluto?

4.4 EXEMPLO: DAS de R$ 474,59 da competência 08/2026, vencido em
    21/09/2026 e pago em 20/11/2026. Quanto se paga, decomposto em
    principal, multa e juros?

═══════════════════════════════════════════════════════════════════
P5 — RECEITA: COMPETÊNCIA OU CAIXA?
═══════════════════════════════════════════════════════════════════

5.1 A receita bruta do Simples é apurada por REGIME DE COMPETÊNCIA
    (nota emitida) por padrão?

5.2 Existe opção formal pelo REGIME DE CAIXA? Se sim: qual o
    dispositivo, quando se opta, é irretratável no ano-calendário, e
    que obrigação acessória extra ela cria?

5.3 🔑 Se a empresa optar pelo caixa, isso muda o RBT12 e o
    denominador do Fator R, ou só o mês de tributação?

═══════════════════════════════════════════════════════════════════
P6 — TRÊS VERIFICAÇÕES (respostas curtas bastam)
═══════════════════════════════════════════════════════════════════

6.1 A **Resolução CGSN nº 190, de 04/08/2026** existe? Ela altera a
    definição de "data de início de atividade" de "data de abertura no
    CNPJ" para "data de inscrição no CNPJ", com efeitos em 01/01/2027?
    Só achei isso em site secundário e preciso confirmar no ato.

6.2 Existe critério objetivo, nos §§ 5º-B a 5º-I do art. 18 da
    LC 123/2006, para separar as atividades de serviço em três grupos:
    (i) SEMPRE Anexo III · (ii) Anexo III ou V conforme o Fator R ·
    (iii) Anexo IV? Se existir, liste o que cai em cada grupo.
    E confirme: existe alguma atividade de serviço que seja SEMPRE
    Anexo V, independentemente do Fator R?

6.3 Para ME de serviço no Simples, em BH, SEM funcionário e com um
    único sócio: quais obrigações acessórias realmente se aplicam?
    Quero um SIM ou NÃO para cada uma, com periodicidade:
    PGDAS-D · DEFIS · eSocial (evento periódico e "sem movimento") ·
    DCTFWeb · EFD-Reinf · DES-BH.
    E confirme se é verdade que, sem a DEFIS do ano anterior, o
    PGDAS-D de março em diante fica bloqueado.

═══════════════════════════════════════════════════════════════════
FECHAMENTO
═══════════════════════════════════════════════════════════════════

Ao final, em seção separada:
· Onde você respondeu por interpretação e não por texto literal
· Alterações legislativas de 2025/2026 que afetem qualquer resposta
· O que NÃO conseguiu confirmar em fonte primária
· Qualquer ponto em que a prática de mercado divirja da letra da lei
  (me interessa saber os dois)
```

---

## O que cada resposta destrava

| | Onde entra | Efeito |
|---|---|---|
| **P1** | `IRRF` em `_tabelas.mjs` · `darfDoProLabore()` | Tira o 🟡 de tela de concorrente do único número que ainda depende dele |
| **P2** | `fatorR()` · `cppDentroDoDas()` | 🔴 **Muda o pró-labore que o app RECOMENDA.** Errar aqui é aconselhar mal |
| **P3** | decisão **36** (forçar pró-labore no mês 1) · item **21** da Larissa | Resolve o caso real de pró-labore de R$100 |
| **P4** | funcionalidade **2.6** (recalcular guia vencida) | Último buraco de cálculo do motor |
| **P5** | `rbt12De()` · `fatorRDeCompetencias()` | Se houver opção de caixa, muda de onde a receita entra |
| **P6** | `GRUPOS_ANEXO` · `VENCIMENTOS` · lacuna **L4** | Ratifica os 3 grupos e o calendário |

## 🎯 E isto encolhe a pauta da Larissa

Das 8 perguntas de [[perguntas-larissa-fiscal]] (paradas desde 15/07), a rodada de hoje já respondeu:

- ✅ **A** · Fator R nos meses 2-12 → Res. CGSN 140/2018 art. 26 §4º, com citação literal
- ✅ **C** · FS12 em regime de caixa → art. 26 §6º + SC COSIT 17/2021 e 251/2024
- 🟡 **F** · obrigações sem funcionário → parcial; a **P6.3** fecha

E a **B** virou a **P2** deste prompt, porque é doutrinária e não de opinião.

🔑 **Se a P2 e a P6.3 voltarem boas, a conversa com a Larissa encolhe de 8 pontos para 4** — e vira ratificação, não descoberta.

## Links
[[prompt-pesquisa-lacunas-motor-fiscal]] · [[2026-09-14-lacunas-motor-fiscal-lidas]] · [[perguntas-larissa-fiscal]] · [[PERSONA]] · [[PENDENCIAS]] · [[anexo-iii-simples]] · [[anexo-v-simples]]
