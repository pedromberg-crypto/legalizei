---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-09
fonte: Contabilizei
acesso: cliente-interno # conta real do Pedro, plano Padrão R$195
assunto: aliquota-e-enquadramento
tags: [produto, evidencia, concorrente, aliquota, fator-r, simples-nacional]
---

# 🔎 Evidência — alíquota e enquadramento na Contabilizei (09/09/2026)

> ⚠️ **Foto com data, não decisão.** O que a Contabilizei mostrava em **09/09/2026**. O nosso desenho vive em [[aliquota-e-enquadramento]] e não envelhece por isso.
>
> **Método:** só leitura ([[_metodo]]). Nenhum salvar, confirmar, pagar, recalcular ou parcelar.
> ⚠️ **O que foi tocado:** (a) alternei o rádio `Mercado interno` → `Mercado externo` em Minhas Alíquotas, que é filtro de exibição; (b) no **simulador**, que a própria tela declara ser inerte (*"Esta é apenas uma simulação, e não gera impostos reais"*), digitei um valor hipotético de R$ 10.000 num campo de nota. O `select` de atividade não respondeu ao teclado via CDP e a simulação **não chegou a calcular**. Nada foi confirmado.
>
> **Rotas visitadas:** `#/minhas-aliquotas` · `#/simulador/impostos-avancado` · `#/impostos` · `#/historico-impostos` · painel "Dados da empresa e banco"
>
> **Ligações:** [[aliquota-e-enquadramento]] (a spec) · [[2026-09-09-contabilizei-pro-labore]] (a outra ponta da mesma conta) · [[_mapa-de-cruzamentos]] · [[_matriz-dependencia]]

---

## 1. `#/minhas-aliquotas` — a tela-título

Cabeçalho: **"Minhas alíquotas · Confira as alíquotas de impostos aplicadas a cada atividade de sua empresa."**

Um rádio no topo, **`Faturamento para: Mercado interno · Mercado externo`**, e uma aba única `Serviço`. A tabela tem 7 colunas:

| CNAE | Item de serviço | Atividades | Total % | ISS % | Alíquota ⓘ | Folha ⓘ |
|---|---|---|:--:|:--:|:--:|:--:|
| 7319-0/04 · Consultoria em publicidade | **17.06** · Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários | Consultoria em publicidade | **6,00%** | **2,01%** | **Variável** | **37,72%** |

### Os dois tooltips, e eles são a chave

| Coluna | Tooltip |
|---|---|
| **Alíquota** | *"Varia conforme folha de pagamento."* |
| **Folha** | *"Percentual da folha no faturamento."* |

🔑 **A coluna "Folha" é o Fator R, sem nunca dizer o nome.** E o valor, **37,72%**, é exatamente o número que eu havia calculado à mão na tela de pró-labore (`16.564 ÷ 43.910`). **As duas telas falam do mesmo número por caminhos diferentes**, e nenhuma delas diz isso ao usuário.

### Mercado externo: a alíquota cai pela metade

| | Total % | ISS % |
|---|:--:|:--:|
| Mercado **interno** | 6,00% | 2,01% |
| Mercado **externo** | **3,05%** | **0,00%** |

✅ **Refiz a conta e ela fecha ao centavo**, o que ratifica a tabela de repartição do Anexo III que já está no vault:

```
ISS      = 6,00% × 33,50% = 2,010%   ✓ bate com a tela
COFINS   = 6,00% × 12,82% = 0,769%
PIS      = 6,00% ×  2,78% = 0,167%
                            -------
exportação = 6,00 − 2,010 − 0,769 − 0,167 = 3,054% ≈ 3,05%   ✓ bate com a tela
```

🔑 **Exportação de serviço é imune a ISS, PIS e COFINS.** Sobram IRPJ, CSLL e CPP. Quem exporta paga **quase metade**. Isso não é detalhe: dev, designer, tradutor e consultor com cliente no exterior são parte relevante do nosso ICP, e o líder resolve isso com **um rádio**.

---

## 2. `#/simulador/impostos-avancado`

O texto de abertura declara o cruzamento inteiro, sem rodeio:

> **"O cálculo dos seus impostos depende das notas fiscais emitidas e do salário do sócio (pró-labore). Todo mês, com base no seu faturamento, nós definimos o valor ideal de pró-labore para garantir economia em impostos!"**
>
> *"Esta é apenas uma simulação, e não gera impostos reais."*

### O diagrama "Conheça sua rotina de impostos"

Um ciclo de duas fases:

| Fase | Regra |
|---|---|
| **Emissão** | "As notas fiscais podem ser emitidas do **1º ao último dia** de cada mês" |
| **Impostos** | "As guias dos impostos ficarão disponíveis para pagamento **entre os dias 15 e 20** do próximo mês" |

⚠️ **Divergência entre telas.** A home diz `DARF: Disponível até o dia 15` e `DAS: Disponível até o dia 16`; aqui diz "entre 15 e 20"; e o vencimento real (visto na tela de impostos) é 18 e 21. São **três conceitos diferentes** sendo ditos com a mesma palavra: quando a guia fica **disponível**, quando ela **vence**, e a janela genérica. Não dá pra saber pela tela qual é qual.

### Estrutura do simulador

**Entrada**, por nota, com botão `Adicionar nova nota fiscal na simulação`:
`Atividade Exercida` (select de CNAE) · `Valor da nota` · `Alíquota` (calculada)

Modal auxiliar: **"Especifique a atividade — Selecione a opção mais parecida com o serviço prestado."** ⚠️ Existe porque **um CNAE pode mapear em mais de um item da LC 116**, e o item é quem decide o ISS. Não disparou nesta conta, que tem um CNAE só.

**Saída**, painel `Previsão de impostos (para o próximo mês)`:

| Linha | Tooltip |
|---|---|
| **Faturamento** | "Soma dos valores recebidos dos clientes, por meio de notas fiscais" |
| **Pró-labore** `automático` | "Também conhecido como salário do sócio, é a sua remuneração mensal como sócio da empresa. **Se houver mais de um sócio, os valores são somados.** Garantimos economia ajustando mensalmente seu pró-labore, mesmo se o faturamento mudar." |
| **DAS Simples** | "Gerado com base no seu faturamento. Reúne diversas arrecadações em um imposto único." |
| **DARF** | "O imposto DARF é calculado a partir do pró-labore. Ele reúne o pagamento da previdência social (INSS) com o imposto de renda de pessoa jurídica (IRRF)." |
| **Total estimado de impostos** | — |
| **Faturamento líquido** | — |

🎯 **`Faturamento líquido` é a linha mais honesta do produto deles.** O dono não quer saber quanto paga de imposto; quer saber **quanto sobra**. Uma linha.

⚠️ **Nota de rodapé que limita tudo:** *"(1) Notas fiscais emitidas para clientes no território nacional"*. **O simulador não simula exportação**, mesmo com a tela de alíquotas suportando o cenário.

---

## 3. `#/impostos` — onde a alíquota vira dinheiro

Já visto no [[2026-09-09-contabilizei-pro-labore|teardown de pró-labore]]. O que **não** tinha sido capturado:

### 🔑 O painel "Cálculo inteligente" — o comparativo de dois cenários

> **"Você economizou R$ X"**
> *"Com base no histórico de faturamento, definimos o seu pró-labore deste mês em R$ X para garantir economia de impostos nos próximos meses. Todo mês, nós calculamos e garantimos o cenário mais vantajoso para você. Veja ao lado o detalhamento:"*

| | Sem cálculo inteligente | Com cálculo inteligente |
|---|---|---|
| | **com pró-labore mínimo** | **com pró-labore ideal** |
| Valor total de impostos | R$ … | R$ … |
| dos quais **DAS** | R$ … | R$ … |
| dos quais **DARF Unificado** | R$ … | R$ … |

🎯 **É este o cruzamento que a gente procurava, e eles já o quantificam.** O comparativo mostra que mexer no pró-labore **sobe o DARF e desce o DAS**, e que o que importa é a **soma**. Está zerado na conta do Pedro porque o mês não teve faturamento, mas a estrutura é o que vale.

### 🔴 O modal "Auditoria Contabilizei" — e ele explica o atraso de 30 dias

> *"Para manter sua empresa regular, fazemos **no fim de cada mês** uma verificação de pagamento das guias."*
> *"Se alguma guia marcada como paga estiver vencida, ela será movida para a aba Em atraso."*
> *"Pagou nos últimos 30 dias e a guia reapareceu? Sem preocupação! Marque como paga e na próxima auditoria ela deve sair da lista sem gerar multas ou juros."*

E o painel "Entenda a Confirmação de pagamento":

> *"A confirmação de pagamento **não é válida como comprovante**. A Contabilizei faz auditorias periódicas nos seus impostos e pode atualizar esta informação para refletir **os dados oficiais do Governo Federal**."*
> *"As opções de pagamento, recálculo e/ou parcelamento serão habilitadas **após você confirmar que o pagamento não foi feito**."*
> *"Os impostos marcados como pago são movidos para o Histórico **no dia 1º do mês seguinte**."*
> *"Os impostos em **Débito automático** possuem o selo `Automática` e o pagamento deles **será confirmado pela Contabilizei entre os dias 20 e 23**."*

🔴 **Isso muda a leitura da linha 2.4 outra vez, e para melhor.** Ontem eu registrei "auditoria com ~30 dias de atraso". Agora sei **por quê** e **como**:

| | O que a tela diz |
|---|---|
| **Fonte** | "dados oficiais do Governo Federal" → é consulta de arrecadação, não Open Finance |
| **Cadência** | **lote no fim de cada mês** → o atraso de 30 dias é **cadência, não limite técnico** |
| **A exceção** | no **débito automático**, a confirmação sai **entre os dias 20 e 23**, no mês corrente |

🔑 **A conclusão estratégica:** eles só sabem do pagamento **em tempo hábil quando o pagamento passa pelo trilho deles** (Contabilizei.bank, banco 301, + débito automático). Fora dele, é lote mensal. **Não é que o problema seja insolúvel: é que a solução deles é possuir o trilho.**

---

## 4. `#/historico-impostos` — a máquina de estado da guia

Filtros: `Status` · `Competência` (mês) · ano (2010 a 2026).

🔑 **Os 10 status são o ciclo de vida completo de uma guia**, e valem como especificação pronta:

```
Calculando · Pendente · Prorrogada · Postergada · Pagamento agendado ·
Verificando pagamento · Paga · Paga via parcelamento · Vencida · Recalculando
```

Colunas: `Imposto · Vencimento · Valor · Status · Já foi pago? · Valor pago · Ações`.

Modais de confirmação:
> **"Você quer mesmo marcar como não pago?"** — *"Este imposto já passou da data de vencimento. Ao confirmar, ele será marcado como Vencido e, para fazer o pagamento, você deverá solicitar o recálculo."*

---

## 5. Enquadramento, no painel "Dados da empresa e banco"

```
Regime tributário: Simples
Inscrição Municipal: 17240640017
Certificado Digital: Ativo · Validade 22/12/2026
```

🔴 **O Anexo NUNCA aparece.** Em nenhuma das telas visitadas o usuário lê "Anexo III" ou "Anexo V". O regime é dito ("Simples"), a alíquota é dita ("6,00%"), a folha é dita ("37,72%"), e a peça que liga as três é omitida.

⚠️ **A Inscrição Municipal aparece aqui**, e é exatamente a pré-condição da nossa linha **8.8**: sem ela regular, o Emissor Nacional rejeita a nota.

---

## 6. Achados de passagem, que não são de alíquota mas são caros

### 🔴 O Termo de Exclusão do Simples, e como eles monetizam

Modal encontrado no DOM da home (a nossa linha **5.7**):

> *"Sua empresa será excluída do regime do Simples Nacional e isto poderá aumentar consideravelmente seus impostos. A Receita Federal notificou sua empresa com o **TERMO DE EXCLUSÃO DO SIMPLES NACIONAL**. Isso ocorre com empresas que possuem pendências federais, municipais e/ou estaduais."*
> *"Caso tenha interesse, a Contabilizei fará o **serviço de verificação de pendências**."*
> *"Importante: a não regularização irá desenquadrar sua empresa (…) e também **acrescenta o valor de R$95 à sua mensalidade**."*
> Botões: `Estou ciente, não quero regularizar` · `Solicitar verificação de pendências`

⚠️ Três leituras:
1. **Confirma que a exclusão é evento de produto**, não teoria. Eles têm tela pronta pra isso.
2. **Sair do Simples encarece a mensalidade deles em R$95** — o desenquadramento é repassado ao cliente.
3. A copy é medo puro, e o botão de recusa (`Estou ciente, não quero regularizar`) faz o cliente **assinar a própria negligência**.

### 🔴 O modal de inadimplência

> *"Sua mensalidade está atrasada. **Aqui está o que você perde**"* — com 5 itens riscados, entre eles *"Distribuição de lucro ilimitada sem tributação"* e *"Geração de impostos"*.
> *"Conheça os **riscos** de ficar sem contador: **multas federais superiores a R$450,00/mês**, aplicáveis ao CNPJ com ou sem movimentação."*

E um plano de retenção: **Plano Manutenção R$79/mês**, "enquanto não estiver faturando", sem emissão de nota e sem WhatsApp.

### Pendências que a home cobra do cliente

`Confirmar ausência de estoque no período` · `Confirmar envio do contrato` · `Confirmar que não fez intermediações?` · `Alterar lançamento bancário`

⚠️ Duas delas (**estoque** e **intermediações**) não fazem sentido para prestador de serviço puro. É formulário genérico cobrando confirmação de coisa que não se aplica.

### Menu `Relatórios`, mapeado

`Declarações mensais · Declarações anuais · Balanço patrimonial · DRE · Balancete · Razão · Diário`

---

## 7. Defeitos deles, anotados

| | O quê |
|:--:|---|
| 🐛 | **IRRF chamado de "imposto de renda de pessoa jurídica"**, em *duas* telas (simulador e "como foi calculado"). IRRF sobre pró-labore é **pessoa física**, retido na fonte. Erro conceitual repetido, não typo |
| 🐛 | **O mesmo CNAE escrito de duas formas**: `7319-0/04` em Minhas Alíquotas, `7319-00/4` no simulador. A segunda é inválida |
| 🐛 | O simulador **não cobre exportação**, embora a tela de alíquotas cubra |
| ⚠️ | "Disponível até o dia 15/16" (home) × "entre 15 e 20" (simulador) × vencimento 18/21 (impostos): três conceitos, uma palavra |

---

## ➡️ O que fazemos com isso

Esta nota **para aqui de propósito**. O desenho, o que copiamos, o que fazemos diferente e as fórmulas estão em **[[aliquota-e-enquadramento]]**. O encadeamento com pró-labore, nota fiscal e obrigações está em **[[_mapa-de-cruzamentos]]**.

## Links
[[aliquota-e-enquadramento]] · [[_mapa-de-cruzamentos]] · [[HOME-produto]] · [[_metodo]] · [[2026-09-09-contabilizei-pro-labore]] · [[_matriz-dependencia]] · [[anexo-iii-simples]] · [[lc123-art18-anexos-taxativo]] · [[fiscal-simples-bh-2026]]
