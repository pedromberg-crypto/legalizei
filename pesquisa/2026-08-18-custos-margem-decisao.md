---
tipo: derivado
status: vivo
data: 2026-08-18
assunto: custos-margem-decisao
deriva_de: [2026-08-17-margem-x-custo-de-trafego, 2026-08-12-estrategia-mkt-para-validacao, economia-preco-cac]
tags: [economia, margem, trafego, preco, decisao]
---

Três coisas que nunca tinham sido postas na mesma folha: o **preço que o mercado pratica**, a **margem que sobra pra gente** e o **custo de comprar um cliente**. Separadas, cada uma parecia saudável. Juntas, elas dizem exatamente onde a conta fecha e onde ela quebra.

Este documento não traz dado novo. Ele cruza o que já estava travado no vault e transforma em decisão.

---

## 1. O terreno de preço

### A vitrine do mercado

| Player | Entrada | Onde o humano aparece | Conf. |
|---|---:|---|---|
| **Legalizai** | **R$139** ME · R$49,90 MEI | **R$139**, o primeiro plano do Simples | 🟢 travado |
| Contaja | R$137 Simples · R$49,90 MEI | não nomeia | 🟢 |
| Contabilizei | R$195 na vitrine pública | R$395 (Experts) | 🟢 |
| Agilize | R$259 fixo | R$450 | 🟢 |
| Facilite | R$199,90 | R$1.249,90 (Black) | 🟢 |
| Contabilivre | R$209 | R$359 (Enterprise) | 🟢 |

**🆕 Lucro Presumido, quando entrar:** o líder pratica ~30% acima do plano base. No nosso caso isso põe o plano entre **R$179 e R$189**. Adiado por complexidade (mais de uma guia por mês, escrituração completa), não descartado.

**Nós somos o 2º mais barato do mercado e o único que põe contador nomeado no plano de entrada.** Os outros cobram entre R$359 e R$1.249,90 pela mesma camada humana.

### O preço anunciado não é a conta do cliente

O teardown da plataforma logada do líder mostrou que a fatura real é `mensalidade + surcharge + avulsos`:

| Camada | O que é | Valor |
|---|---|---:|
| Mensalidade | o que aparece na vitrine | R$139–395 |
| Surcharge | escala por faturamento e headcount, não anunciada | variável |
| Sair da base | baixa de empresa | R$1.406–1.999 |
| Mexer na empresa | alteração contratual, add sócio | a partir de R$1.299 |
| Provar renda | DECORE | R$713,90 |
| Reajuste | IGP-DI, todo ano, vendido pelo chat | anual |

> ⚠️ **Discrepância de fonte, registrada e não resolvida.** A vitrine pública de 08/07 diz que o Básico R$139 foi **extinto** e a entrada subiu pra R$195. A grade vista **dentro da conta logada** em 21/07 ainda lista R$139. Provável explicação: R$139 é preço legado de quem já é cliente, fora da prateleira. Não confirmado.

> 🎯 **Decisão a tomar**
> Nosso R$139 briga com a vitrine de R$195 do líder ou com o preço legado de R$139 dele? Se for com o legado, nossa vantagem de preço na prateleira é **maior** do que estamos comunicando, e a comunicação está subvendendo o número.

---

## 2. A margem de verdade

### As duas contas do vault não eram a mesma conta

Isto é o achado que motivou o documento. Existiam duas matemáticas de margem, ambas corretas, **usando bases de custo diferentes e complementares**:

| Doc | Custo que inclui | Custo que esquece |
|---|---|---|
| Apresentação ao Mauro (30/07) | certificado digital, uma vez (usava R$200 estimado) | custo técnico mensal |
| Economia, preço e CAC (05/08) | técnico R$15/mês (API R$10 + sistema R$5) | certificado digital |

Nenhuma das duas estava errada. As duas estavam **incompletas**, e cada uma inflava a margem pelo lado que a outra cobria.

### Somando os dois custos pela primeira vez

| | ME R$139 | MEI R$49,90 |
|---|---:|---:|
| Receita 12 meses | R$ 1.668,00 | R$ 598,80 |
| (−) certificado digital | R$ 209,00 | R$ 209,00 |
| (−) técnico (R$15 × 12) | R$ 180,00 | R$ 180,00 |
| **= margem bruta 12m** | **R$ 1.279,00** | **R$ 209,80** |
| % sobre receita | **76,7%** | **35,0%** |

**O ME perde 12,9% da margem que foi apresentada ao Mauro** (era R$1.468,00). São duas causas somadas: o custo técnico de R$180 que faltava, e o certificado, que custa **R$209,00 de verdade** e não os R$200 estimados. O MEI perde bem mais: cai de 69,9% de sobra técnica mensal pra **35,0%** quando o certificado entra.

### 🔴 E agora a mão de obra entra (18/08)

A margem acima ainda era bruta porque **pessoas nunca estiveram na conta**. Os dois números que faltavam chegaram:

| Insumo | Valor | Efeito por cliente/mês |
|---|---|---:|
| **Honorário contábil CRC** | 1 salário mínimo = **R$1.621/mês**, custo fixo | R$5,40 (diluído em 300 clientes) |
| **Atendente contábil** | **R$3.500/mês**, cobrindo **30 a 40 usuários** | **R$87,50 a R$116,67** |

| Plano | Atendente 1:30 | Atendente 1:40 |
|---|---:|---:|
| **ME R$139** | **−R$ 15,49** (−11,1%) | **+R$ 13,68** (+9,8%) |
| **MEI R$49,90** | −R$ 104,59 | −R$ 75,42 |

**O honorário do contador é ruído; o atendente é o negócio inteiro.** R$5,40 contra R$87–117. Diluir o CRC em 500 clientes em vez de 100 muda R$13 por cliente. O atendente muda R$29 só entre 1:30 e 1:40.

> ⚠️ **Assumido que o honorário CRC é custo fixo mensal, não por cliente.** Por cliente seria R$1.621 num plano de R$139, o que é impossível, e bate com a tese de que a Legalize fornece o contador responsável barato. Se a leitura estiver errada, a conta inteira muda.

> ⚠️ **Ainda de fora:** taxa de transação Asaas e imposto sobre faturamento próprio. O número real continua sendo **menor** que este, nunca maior.

### 🔴 O número que decide o negócio: usuários por atendente

| Plano | Sobra pra mão de obra | Breakeven | Pra margem de 33% |
|---|---:|---:|---:|
| **ME R$139** | R$ 101,18 | **1:35** | **1:63** |
| **MEI R$49,90** | R$ 12,08 | **1:290** | impossível |

**O ME opera em cima do breakeven.** A faixa estimada (1:30 a 1:40) atravessa exatamente o ponto de equilíbrio. Não é margem, é fio de navalha.

**O MEI não suporta atendimento humano nenhum.** Só empataria com 1 atendente pra 290 usuários. Isso **valida com aritmética a decisão de 17/08** de dar assistente virtual ao MEI: não era preferência, era a única saída possível.

⚠️ **A razão 1:30–40 foi estimada de cabeça numa reunião e é a variável mais frágil de toda a conta.** Um produto digital bem feito opera muito acima disso. Descobrir a razão real é a tarefa de maior alavancagem que existe hoje: vale mais que negociar preço de certificado, mais que ajustar mensalidade, mais que qualquer canal.

### O que sustenta (e o que ameaça) a margem do MEI

**A favor — o MEI quase não consome.** A NFS-e só é obrigatória quando o tomador é **pessoa jurídica**; pra pessoa física é facultativa. Como estética e beleza, a categoria que mais abre em BH, atende quase só pessoa física, boa parte desses MEIs pode passar o ano **sem emitir nota nenhuma**. O custo de API do plano tende a zero. Somado ao escopo cortado (3 notas/mês, sem acesso ao que o ME tem) e ao assistente virtual no lugar do atendente, o plano se paga por **baixo consumo**, não por receita.

**Contra — o certificado fica.** Ele consome **34,9% da receita anual** do MEI e **não sai**: a dispensa legal (Res. CGSN nº 140/2018, art. 106-A §3º II) vale pro MEI emitir sozinho, não pra nós emitirmos por ele. Como o produto é justamente operar por conta do cliente, precisamos do certificado pra representá-lo.

**Contra — o valor percebido é fino.** Se ele não emite nota, o que o plano entrega é ver a guia do DAS e não precisar entrar em portal de governo. É real, mas é pouco pra sustentar mídia paga.

> 🎯 **Decisão a tomar**
> O certificado fica (já decidido) e come 34,9% da receita anual do MEI. Então o MEI é **produto** ou é **porta de entrada pro ME**? A resposta muda se ele precisa se pagar sozinho ou se pode ser subsidiado pela conversão MEI→ME.

---

## 3. O teto de aquisição

### 🟢 A régua travada (18/08)

> **CAC-alvo = R$30 a R$100 por cliente. Custo ÚNICO, medido contra o LTV de 12 meses** (o prazo da fidelidade contratual).

Duas coisas que essa definição resolve e que estavam confusas antes:

1. **CAC não é gasto recorrente.** Paga-se uma vez, na entrada do cliente. Comparar CAC contra a margem de **um mês** foi o erro original de 05/08, já corrigido. A régua certa é sempre contra os 12 meses.
2. **R$30–100 é o teto de gasto por cliente adquirido**, não o custo por lead nem por clique.

### Como o CAC-alvo se comporta contra o LTV de 12 meses

| Plano | LTV 12m | CAC R$30 | CAC R$100 | Payback a R$100 |
|---|---:|---:|---:|---:|
| **ME R$139** (sem mão de obra) | R$ 1.279,00 | **2,3%** | **7,8%** | **0,9 mês** |
| **MEI R$49,90** (sem atendente, só assistente virtual) | R$ 209,80 | **14,3%** | **47,7%** | **5,7 meses** |
| ME com atendente 1:40 | R$ 164,16 | 18,3% | 60,9% | 7,3 meses |
| ME com atendente 1:63 | R$ 547,49 | 5,5% | **18,3%** | 2,2 meses |
| MEI com atendente | negativo | — | — | nunca |

**As 3 leituras:**

1. 🟢 **O ME fecha com folga larga.** Mesmo no teto de R$100 e com o atendente em 1:63, o CAC come 18,3% do LTV, abaixo da régua de 33%. Payback de 2,2 meses contra os 6–12 que o mercado aceita.
2. 🟢 **O MEI também fecha, desde que não tenha atendente humano.** A R$100 de CAC ele consome 47,7% do LTV e paga em 5,7 meses, dentro da fidelidade de 12. **Isso só é verdade porque o MEI tem assistente virtual em vez de atendente** (decisão de 17/08). Com atendente, nunca fecha.
3. 🔴 **Quem decide não é o CAC, é a razão de atendimento.** A diferença entre 1:40 e 1:63 muda o CAC-alvo do ME de 60,9% para 18,3% do LTV. Nenhuma otimização de mídia chega perto desse impacto.

### ⚠️ O que essa régua pressupõe

CAC de R$30–100 com o CPC de mercado (R$2–8) exige que **2% a 8% dos cliques virem cliente pagante**:

| CAC | com CPC R$2 | com CPC R$8 |
|---|---:|---:|
| R$30 | 6,7% dos cliques pagam | 26,7% |
| R$100 | 2,0% | 8,0% |

**Isso é meta, não medição.** O V0 existe pra descobrir se o número real cabe nessa faixa.

### 🔄 Correção de leitura anterior

Uma versão anterior deste bloco apresentava um "CAC real de R$500 a R$1.666". **Aquele número não é do nosso funil.** Ele vem de um funil **consultivo** de contabilidade (lead → contato → qualificação → proposta → fechamento, com 6% de conversão ponta a ponta), onde existe equipe comercial trabalhando o lead.

**O nosso funil não tem etapa de lead:** o anúncio leva ao app e o pagamento acontece dentro dele. São arquiteturas diferentes, e o 6% do funil consultivo não transfere. O que se aproveita da pesquisa é o **CPL de R$30–100** e o **CPC de R$2–8**; a taxa de conversão tem que ser a nossa, medida no V0.

> 🎯 **Decisão a tomar**
> A régua de R$30–100 está travada. O que falta é decidir **o gatilho de parada**: se depois de 30 dias o CAC real do V0 estabilizar acima de R$100, o que muda primeiro — o criativo, o canal, ou a meta de 25–30 fundadores?

---

## 4. O custo de comprar atenção

O Pedro Puntel levantou o custo por clique das duas plataformas:

| Plataforma | CPC | Foco proposto | Veredito dele |
|---|---|---|---|
| Meta Ads (IG/FB) | R$1,00 – R$5,00 | venda direta, vídeo na dor da burocracia | ✅ Alta |
| Google Ads (Search) | R$3,00 – R$10,00 | intenção ativa, "contabilidade online MEI" | ✅ Alta |

### Clique não é cliente

CPC sozinho não fecha conta nenhuma. Falta o passo clique → lead. Aplicando a conversão por origem de tráfego já registrada no vault (Leadster Panorama 2026):

| Plataforma | CPC | Conversão clique→lead | **CPL derivado** |
|---|---|---:|---:|
| Meta Ads | R$1,00 – R$5,00 | 4,68% | **R$ 21,37 – R$ 106,84** |
| Google Search | R$3,00 – R$10,00 | 3,46% | **R$ 86,71 – R$ 289,02** |

Confrontando com o CPL que já tínhamos (Meta R$40–150, Google R$50–200): **o Meta dele cabe na nossa faixa e estica pra baixo**, o que é boa notícia. **O Google dele estoura o teto** (R$289 contra R$200).

> ⚠️ **A conversão de 4,68% é proxy, não é o nosso funil.** Ela mede landing page por origem de tráfego. Nosso desenho é **anúncio → WhatsApp → humano**, justamente porque converte melhor nesse nicho. O número real só sai do teste do V0.

> 🎯 **Decisão a tomar**
> O CPC de Google dele (R$3–10) é menos da metade do nosso teto de fonte (R$4–22, Webcer). Antes de qualquer plano de Search, pedir a ele o **recorte** do dado: nicho, geografia, termos.

---

## 5. O cruzamento

Com a régua travada (CAC de R$30–100, custo único, contra LTV de 12 meses), a pergunta deixa de ser *"quanta conversão seria preciso pra fechar"* e passa a ser **"quanto de cada clique precisa virar pagante pra o CAC cair na faixa"**.

### Quantos cliques cabem em cada CAC

| CPC | CAC R$30 | CAC R$100 |
|---:|---:|---:|
| **R$2,00** | 15 cliques | 50 cliques |
| **R$5,00** | 6 cliques | 20 cliques |
| **R$8,00** | 3,8 cliques | 12,5 cliques |

Traduzindo em taxa de conversão clique → pagante: a faixa exigida vai de **2% (cenário folgado)** a **26,7% (cenário apertado)**. O meio da faixa, que é onde a operação realmente vive, pede **entre 5% e 8%**.

### O que fecha e o que não fecha

| Cenário | CAC | % do LTV 12m | Veredito |
|---|---:|---:|---|
| **ME, sem mão de obra** | R$30–100 | 2,3% – 7,8% | 🟢 fecha com folga larga |
| **ME, atendente 1:63** | R$30–100 | 5,5% – 18,3% | 🟢 fecha dentro da régua de 33% |
| **ME, atendente 1:40** | R$30–100 | 18,3% – 60,9% | 🟡 fecha só na ponta barata |
| **MEI, assistente virtual** | R$30–100 | 14,3% – 47,7% | 🟢 fecha, payback de 1,7 a 5,7 meses |
| **MEI, com atendente humano** | qualquer | — | 🔴 nunca fecha, margem é negativa |

**O tabuleiro virou.** Na versão anterior deste documento havia **uma única célula verde**; com a régua correta, quase tudo fecha. O que mudou não foi o mercado: foi parar de comparar o nosso funil self-service contra o benchmark de um funil consultivo.

**E o gargalo mudou de lugar.** Não é mais o custo de mídia: é a **razão de atendimento**. Entre 1:40 e 1:63, o mesmo CAC de R$100 sai de 60,9% do LTV para 18,3%.

> 🎯 **Decisão a tomar**
> Se o CAC cabe em R$30–100 nos dois planos, **o MEI deixa de estar barrado do tráfego pago por aritmética**. O que sobra é decidir se ele entra como produto que se paga (payback de 5,7 meses no teto) ou como porta de entrada pro ME. A resposta muda o split de budget e a métrica que persegue.

---

## 6. O cenário de lançamento a R$99

Levantado na reunião de 18/08: primeira anuidade a **R$99/mês** em vez de R$139, como campanha agressiva de entrada.

| | Valor |
|---|---:|
| Receita 12 meses | R$ 1.188,00 |
| (−) certificado digital | R$ 209,00 |
| (−) técnico (R$15 × 12) | R$ 180,00 |
| **= margem bruta 12m** | **R$ 799,00** (67,3%) |

**No pior caso (paga 1 mês e cancela):** saldo devedor de 11 × R$99 = R$1.089, multa de 30% = R$326,70. Receita total R$425,70, menos certificado e técnico do mês: **sobra R$201,70 positivos**.

⚠️ **A conta feita na reunião tinha 3 erros, os três a favor:** 99 × 12 foi lido como R$1.200 (é **R$1.188**), a multa como R$330 (é **R$326,70**) e a sobra do pior caso como ~R$120 (é **R$201,70**). A conclusão sobrevive e fica mais forte: **a campanha é positiva mesmo se todo mundo cancelar no primeiro mês.**

⚠️ **Mas isso é margem antes de mão de obra.** Com o atendente na conta (bloco 2), R$99/mês fica **abaixo do breakeven do ME em qualquer razão de atendimento**. A campanha só se justifica como investimento de aquisição declarado, não como preço sustentável.

---

## 7. O que o budget do V0 produz

Budget travado: **R$3.500/mês, 100% Meta**. Líquido do repasse tributário Meta de 12,15% = **R$3.074,75 de mídia efetiva**.

| CPC | Cliques/mês | Leads/mês | Clientes a 5% | Clientes a 10% |
|---:|---:|---:|---:|---:|
| **R$ 1,00** | 3.075 | 144 | **7,2** | **14,4** |
| R$ 3,00 | 1.025 | 48 | 2,4 | 4,8 |
| R$ 5,00 | 615 | 29 | 1,4 | 2,9 |

Meta do MVP: **25–30 clientes fundadores em 3 meses**, ou seja ~8–10/mês.

**A meta só é batida na linha de cima da tabela.** No meio da faixa do Puntel (CPC R$3), o V0 entrega **menos de metade** da meta mesmo com conversão de 10%, que já é o dobro da média do setor.

> 🎯 **Decisão a tomar**
> O V0 tem uma única rota de sucesso: CPC perto de R$1 **e** conversão perto de 10%. Se depois de 30 dias o CPC real estabilizar acima de R$2, a meta de 25–30 fundadores não sai com R$3.500/mês. Nesse caso, o que muda: o budget, a meta, ou o canal?

---

## 8. As decisões que os números já sustentam

Nada aqui depende de dado novo. São escolhas que a tabela do bloco 5 já autoriza.

| # | Decisão | Sustentação |
|---|---|---|
| 1 | 🔄 **MEI deixa de estar barrado por aritmética** | com CAC de R$30–100 contra LTV de 12m, o MEI consome 14,3%–47,7% e paga em 1,7 a 5,7 meses. **Só vale porque ele tem assistente virtual, não atendente humano.** A decisão de 05/08 caía por um cálculo que comparava nosso funil com um funil consultivo |
| 2 | 🔄 **V0 em Meta segue, mas por budget, não por aritmética** | o argumento de que o Google era inviável caía do mesmo cálculo errado. O que sustenta a concentração agora é só o mínimo de aprendizado: R$3.500/mês não alimenta os dois canais |
| 3 | **Preço do ME não desce** | a R$139 o teto de CAC em 12m (R$422) já está abaixo do piso do mercado (R$500). Cortar preço fecha a última célula verde |
| 4 | **Canal barato vira estrutura, não plano B** | indicação, orgânico e Search de alta intenção são os únicos que cabem sob R$422 com folga |
| 5 | 🔄 **A métrica-farol do V0 é a conversão clique→pagante, não o CPC** | o CPC de mercado já é conhecido (R$2–8). O que ninguém sabe é quantos por cento pagam. É esse número que decide se o CAC cai em R$30–100 |
| 6 | 🆕 **A razão usuários por atendente é a variável nº1 do negócio** | move o CAC-alvo do ME de 60,9% para 18,3% do LTV. Nenhuma otimização de mídia chega perto |

> 🎯 **Decisão a tomar**
> Destas 5, as de nº 3 e 5 ainda não estão registradas em lugar nenhum. Travar as duas no ADR de marca ou deixar em aberto?

---

## 9. O que ainda falta

Três números seguram tudo o que está acima. Nenhum deles é difícil de conseguir, e cada um move a conta numa direção conhecida.

| Pendência | Quem destrava | Efeito esperado |
|---|---|---|
| 🔴 **Honorário contábil real** | Mauro | **derruba** toda margem acima. É o maior custo variável e nunca entrou na conta |
| 🟡 **Custo do assistente virtual do MEI** | teste técnico | define se o MEI tem economia própria ou se o preço precisa mudar |
| 🟡 **Negociar o certificado digital** (certificadora do primo do Mauro; hoje R$209 na do Madeira) | Mauro | cada real entra direto na margem. No MEI o certificado pesa **34,9% da receita anual** |
| 🔴 **Razão real usuários por atendente** | Pedro + Mauro | decide se o ME dá 9,8% ou prejuízo. Maior alavanca do negócio |
| 🟡 **Recorte do CPC do Puntel** | pergunta direta a ele | resolve o conflito R$3–10 × R$4–22 no Google |

> ⚠️ **A decisão de 17/08 não resolve o MEI.** Tirar o contador dedicado do MEI evita que a margem dele **piore** quando o honorário do Mauro entrar. Não cria folga nova: o honorário nunca esteve dentro da sobra de R$34,90/mês, porque o custo técnico de R$15 é só API e sistema. O MEI segue com CAC-alvo de R$69,23.

> 🎯 **Decisão a tomar**
> O honorário do Mauro é a única pendência que pode inverter conclusões deste documento, não só ajustá-las. Pedir com prazo, ou seguir tratando toda margem daqui como teto inflado?

---

## 📌 O que ainda precisa ser decidido

> Os nove blocos anteriores estão fechados: cada número tem origem, e as duas correções grandes (o certificado real de R$209 e a régua de CAC) já estão aplicadas. O que resta são as decisões que dependem de dado que ainda não temos ou de gente de fora.

### 🔴 As 3 que travam a conta

| # | Decisão | Quem | Por que trava |
|---|---|---|---|
| **1** | **Razão de usuários por atendente** | Pedro + Mauro | Estimada de cabeça em 1:30–40. O breakeven do ME é **1:35** e a margem de 33% exige **1:63**. Move o CAC-alvo do ME de 60,9% para 18,3% do LTV. **Nenhuma otimização de mídia chega perto desse impacto** |
| **2** | **O conflito do CPL de Google** | Puntel | R$15,50 (dele) × R$80–200 (pesquisa de nicho) × R$15–50 (vault). Três números, duas ordens de grandeza. Sem resolver, o bloco 4 não fecha |
| **3** | **Conversão clique → pagante** | V0 | A régua de R$30–100 pressupõe 2% a 8%. É meta, não medição. É a primeira coisa que o V0 precisa instrumentar |

### 🟡 As 4 que ajustam

| # | Decisão | Quem |
|---|---|---|
| **4** | **Preço final do ME**: R$139,00, R$139,50 ou R$139,90 | Mauro |
| **5** | **Negociação do certificado** (hoje R$209; pesa 34,9% da receita anual do MEI) | Mauro |
| **6** | **O MEI é produto ou porta de entrada?** Ele se paga em 1,7 a 5,7 meses, mas só sem atendimento humano. A resposta muda o split de budget e a métrica que se persegue | Pedro + Mauro |
| **7** | **Gatilho de parada do V0:** se o CAC estabilizar acima de R$100 em 30 dias, muda o criativo, o canal ou a meta? | Pedro + Puntel |

### ⚠️ As 2 suposições que sustentam tudo

Se qualquer uma cair, a conta inteira se refaz.

1. **O honorário contábil de 1 salário mínimo é custo FIXO mensal, não por cliente.** Por cliente seria R$1.621 num plano de R$139, o que é impossível. Bate com a tese de que a Legalize fornece o contador responsável barato, mas nunca foi confirmado nessas palavras.
2. **A margem continua sendo BRUTA.** Ficaram de fora a taxa de transação do meio de pagamento e o imposto sobre o nosso próprio faturamento. O número real é menor que o deste documento, nunca maior.

### 🟢 Fechado neste ciclo

Certificado digital em **R$209** (valor real) e **permanece nos dois planos** — a dispensa legal vale pro MEI emitir sozinho, não pra nós emitirmos por ele · **CAC-alvo de R$30–100**, custo único, contra LTV de 12 meses · **mão de obra entrou no modelo** (atendente R$3.500/mês, honorário 1 salário mínimo) · **MEI deixa de estar barrado do tráfego pago por aritmética**, com split de 30/70 · **Anexo IV entra** no escopo · **Lucro Presumido é adiado, não descartado** (~R$179–189) · **guia do Simples junto da mensalidade: não fazer** (risco regulatório de instituição de pagamento).

---

## Cross-refs

[[2026-08-17-margem-x-custo-de-trafego]] · [[economia-preco-cac]] · [[trafego-pago-contabilidade-mercado]] · [[estrutura-funil-trafego]] · [[2026-07-30-flow-2-construido-e-pente-fino]] · [[2026-07-21-dossie-plataforma-logada]] · [[matriz-comparativa]] · [[decisoes-marca]] · [[HOME]]
