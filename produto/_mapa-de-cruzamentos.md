---
tipo: verdade
status: vivo
dominio: cruzamento
data: 2026-09-09
assunto: encadeamento-motor-fiscal
autoridade: fonte-verdade
tags: [produto, cruzamento, fiscal, aliquota, pro-labore, fator-r, motor]
---

# 🔗 Mapa de cruzamentos — como as funcionalidades se puxam

> 🧭 **Autoridade:** esta nota manda em **como as funcionalidades se conectam**. Cada uma tem sua spec própria; aqui mora o que só existe **entre** elas.
>
> 🔴 **Por que existe** (pedido do Pedro, 09/09): *"quero que nessa nossa documentação sejam cruzados as frentes… aonde isso entra na conta, no cálculo, nas obrigações e o que isso gera de resultado"*. Duas frentes destrinchadas separadamente (pró-labore e alíquota) chegaram **no mesmo número por caminhos diferentes** e ninguém tinha notado. Sem esta nota, isso volta a acontecer.
>
> Hub: [[HOME-produto]] · método: [[_metodo]]

---

## 🔒 A regra que esta nota cria

**Nenhuma funcionalidade fiscal se documenta sozinha.** Toda spec em `produto/funcionalidades/` precisa declarar, em seção própria:

| | O que declarar |
|---|---|
| **⬅️ De onde recebe** | que dado de outra funcionalidade entra no cálculo |
| **➡️ Para onde manda** | que outra funcionalidade muda quando esta muda |
| **📅 Que obrigação dispara** | guia, declaração, prazo |
| **👁️ O que o cliente precisa VER** | o resultado, não o mecanismo |

⚠️ **O teste:** se der pra escrever a spec sem citar nenhuma outra funcionalidade, ou a funcionalidade é isolada de verdade (raro), ou o cruzamento passou batido.

---

## 🧮 A cadeia, do começo ao fim

Tudo no ME/Simples serviço sai de **uma cadeia só**. Ela tem 3 entradas e 2 saídas.

```
ENTRADAS                        MOTOR                          SAÍDAS

CNAE  ──────────┐
(atividade)     │        4 códigos em cascata, do menor pro maior detalhe:
                ├──> item LC 116 ──> cód. NACIONAL ──> cód. MUNICIPAL ──> NBS
CNPJ/município ─┘         │              (+ IndOp: onde o serviço foi prestado)
                          │              🔴 o ISS mora no cód. MUNICIPAL, não no CNAE
                          v
Nota fiscal ────> FATURAMENTO ──> RBT12 ──┐
(competência)                             │
                                          ├──> ANEXO (III ou V) ──> ALÍQUOTA ──> DAS
Pró-labore ─────> FOLHA 12m ──> FATOR R ──┘                                       │
     │            (÷ RBT12)                                                       │
     │                                                                            v
     ├──> INSS 11% ──┐                                                    guia mensal
     └──> IRRF ──────┴──> DARF UNIFICADO ──> guia mensal                   dia 20 (prorroga)
                                             dia 20 (antecipa)
     │
     └──> eSocial (S-1200) ──> DCTFWeb ──> obrigação mensal, dia 15 (antecipa)
```

---

## 🔑 Os 7 cruzamentos, um a um

### 1. Pró-labore ⇄ Alíquota — **o cruzamento central, e é um gangorra**

| | |
|---|---|
| **Como se tocam** | O pró-labore é a maior parcela da folha. A folha ÷ faturamento (12m) = **Fator R**. Fator R **≥ 28%** joga a empresa no **Anexo III (6%)**; abaixo, **Anexo V (15,5%)** |
| **O efeito é uma gangorra** | Subir o pró-labore **AUMENTA** o DARF (11% INSS + IRRF) e **DIMINUI** o DAS (6% em vez de 15,5%). O que importa é a **soma** |
| **A prova na tela do líder** | A tela de alíquotas mostra `Folha: 37,72%`, e a tela de pró-labore mostra `16.564 ÷ 43.910`. **É o mesmo número por dois caminhos**, e nenhuma das duas telas diz isso |
| **Onde eles quantificam** | Painel "Cálculo inteligente": compara **pró-labore mínimo × pró-labore ideal** e mostra o total de imposto de cada cenário, quebrado em DAS e DARF |
| 🔴 **A armadilha** | A folha só conta no Fator R **se foi efetivamente PAGA** (caixa), enquanto a receita é competência. Recibo sem trânsito financeiro = glosa + Anexo V + multa |
| **O que o cliente vê** | Hoje, no líder: nada. Ele vê "6,00%" e "37,72%" em colunas vizinhas e nunca soube que uma causa a outra |

### 2. Nota fiscal ⇄ Alíquota

| | |
|---|---|
| **Como se tocam** | Cada nota carrega um **CNAE**, que mapeia num **item da LC 116**, que define o **ISS do município**. A soma das notas do mês é o faturamento; a soma de 12 meses é o **RBT12**, que define a faixa |
| **O detalhe que escapa** | Um CNAE pode mapear em **mais de um item da LC 116**. O líder resolve com o modal *"Especifique a atividade — selecione a opção mais parecida"*. **Quem escolhe o item escolhe o ISS** |
| **Exportação** | Nota pra cliente no exterior é **imune a ISS, PIS e COFINS**. No caso medido: 6,00% vira **3,05%**. Quase metade |
| **Obrigação disparada** | Emissão pelo Emissor Nacional (obrigatório 01/11/2026), que exige **Inscrição Municipal regular** |
| 🔴 **Lei 12.741/2012** | A nota é obrigada a informar a carga tributária do serviço (*"o percentual total de impostos incidentes neste serviço prestado é de aproximadamente 6,00%"*). **A alíquota tem que estar resolvida NO MOMENTO DA EMISSÃO**, não só no fechamento. Achado em 09/09 numa nota real |
| 📅 🔑 **O DIA 5 fecha o mês contábil, e vale pra TUDO** | **Importar, alterar e cancelar** nota de mês anterior: **grátis até o dia 5** do mês seguinte, **com custo depois** (reabertura, R$21,90 no líder). O flag que decide é **`mesFechado`**, vindo do servidor. E o limite **legal** do cancelamento é **730 dias** (Portaria SMFA 075/2025), coisa diferente da janela sem custo |
| 🔑 **`anexoEscolhido` por nota** | o Anexo fica gravado **na nota**, não só na empresa. Se o Fator R virar no meio do ano, cada nota carrega o que valeu na hora |
| ✅ **O ISS da nota É a parcela do DAS** | `7.910 × 2,01% = 158,99` e `474,59 × 33,5% = 158,99`. Dois caminhos independentes, mesmo número. Empresa do Simples **não recolhe ISS à parte**: o valor na nota é a fatia que já vai no DAS. Ratifica a repartição do Anexo III pela 3ª vez |
| 🔴 **Exibição × cálculo, 3ª ocorrência** | `aliquota: 0.02` no XML da nota, contra 2,01% real. Depois de `6%`×5,99987% no DAS e `932,31`×932,3105 no teto do INSS. **Campo de exibição nunca é fonte de recálculo** |
| 🔴 **O que a API do líder revelou (09/09)** | O **ISS municipal pertence ao CÓDIGO MUNICIPAL, não ao CNAE**: 11 combinações sob um único CNAE, com ISS de **2,5% a 5%**. E a emissão precisa de **4 códigos em cascata** (CNAE → nacional → municipal → NBS) mais o **IndOp**, que diz onde o serviço foi prestado. Ver [[2026-09-09-contabilizei-nota-fiscal]] |
| 🔴 **Onde o líder DESISTE** | Quando o ISS é devido a **outro município**, ele não emite: manda o cliente pro portal da prefeitura, porque *"as prefeituras não têm uma base de dados unificada de códigos municipais"*. Para o nosso ICP em BH isso não morde; para quem atende fora, morde igual |

### 3. Alíquota ⇄ DAS

| | |
|---|---|
| **Como se tocam** | `DAS = faturamento do mês anterior × alíquota efetiva`. A alíquota efetiva sai da faixa do RBT12 dentro do Anexo definido pelo Fator R |
| **Vencimento** | dia **20**, e **PRORROGA** se cair em dia não útil |
| ✅ **Arredondamento, resolvido em 09/09** | Não era arredondamento: **a alíquota efetiva real é 5,99987%** (`474,59 ÷ 7.910`), e a tela exibe `6,00%` por um campo `aliquotaApresentacao` separado. Regra que fica: **ou exibe a efetiva, ou o valor bate com a exibida. Nunca as duas** |

### 4. Pró-labore ⇄ DARF Unificado

| | |
|---|---|
| **Como se tocam** | `DARF = INSS + IRRF`, ambos sobre o pró-labore |
| **INSS** | `min(11% × pró-labore; 932,31)`. O teto de R$932,31 = 11% do teto do INSS (R$8.475,55) |
| **IRRF** | `base = pró-labore − INSS`, depois `(base × alíquota) − dedução`. Isento até R$2.428,80 🔴 tabela **não ratificada** |
| **Vencimento** | dia **20**, e **ANTECIPA** se cair em dia não útil |
| 🔴 **A armadilha do calendário** | DAS **prorroga** e DARF **antecipa**, ambos no dia 20. Visto na tela do líder: mesma competência Ago/2026, DARF **18/09** e DAS **21/09**, porque 20/09 caiu num domingo |

### 5. Pró-labore ⇄ obrigações acessórias

| | |
|---|---|
| **eSocial** | evento **S-1200** de remuneração do sócio, mensal, dia **15**, **antecipa** |
| **DCTFWeb** | consome o eSocial e é quem **gera o DARF numerado**, dia 15, antecipa |
| **Cruzamento fiscal** | A Receita cruza **EFD-Reinf × DCTFWeb** para achar pró-labore declarado e não pago |
| 🔑 **EFD-Reinf R-2099 e R-4099** | São **dois eventos distintos**, ambos dia 15. R-2099: retenção de **INSS em notas fiscais**. R-4099: retenção de **IRRF em notas TOMADAS**, aluguel PF, auto retenção em publicidade e **distribuição de lucro**. 🔑 **Nota que o cliente RECEBE também gera obrigação** |
| 🔑 **4 de 5 obrigações mensais exigem certificado ou procuração** | O A1 não é pré-condição só da emissão: é **infraestrutura da operação mensal inteira**. Ver [[2026-09-09-contabilizei-central-rotinas]] §8 |
| **Informe de rendimentos** | O pró-labore do ano vira o informe do sócio, que alimenta o **IRPF** dele |
| 🔴 **O informe é BLOQUEÁVEL** | Pendência documental ou débito federal **impedem a emissão do informe** (`informerendimento/…/restricoes`), e no líder a regularização é **serviço pago**. É trava de fim de ano com efeito em abril, e não estava na nossa lista |
| 🔑 **ISS retido abate o DAS** | `deducaoRetencao` no cálculo da competência, alimentado pelo `valorPendenteRetencao` de cada cliente. **Emitir nota para tomador que retém muda o DAS do mês** |

### 6. Alíquota ⇄ enquadramento (e a saída dele)

| | |
|---|---|
| **Como se tocam** | Perder o Simples faz a alíquota **explodir** (vai pro Lucro Presumido) |
| **O gatilho** | Pendência federal, municipal ou estadual → **Termo de Exclusão** no **DTE-SN** |
| **Os prazos** | Ciência **presumida em 45 dias** mesmo sem ninguém abrir · **30 dias** para regularizar depois |
| **O que o líder faz** | Tela pronta pro Termo de Exclusão, e **vende** a verificação de pendências. Sair do Simples ainda **acrescenta R$95 à mensalidade** deles |
| 🔴 **Nossa lacuna** | Linha **5.7**, sem caminho. É o único ponto do produto onde **o silêncio custa a empresa do cliente** |
| 🔑 **A taxonomia do que dá errado (09/09)** | O líder cataloga **21 pendências críticas + 7 outras**, e a frase de abertura da tela deles liga a corrente inteira: *"podem afetar seu informe de rendimentos e gerar desenquadramento tributário e inativação do CNPJ"*. Ver [[2026-09-09-contabilizei-central-rotinas]] |
| ⚠️ **7 das 21 não se aplicam ao nosso ICP** | estoque · ativo imobilizado · empréstimo · financiamento · aplicação financeira · AFAC · investimento anjo. A lista deles não é filtrada por perfil, e o cliente precisa **negar ativamente**. Nosso recorte estreito nos poupa isso |
| 🔴 **O DTE-SN NÃO está na Central de Rotinas deles** | Eles têm tela pro Termo de Exclusão, mas ela dispara **depois** que ele chegou. Trazer o monitoramento pra dentro do compliance é onde a nossa 5.7 vira produto |

### 7. Pagamento ⇄ tudo

| | |
|---|---|
| **Por que cruza com tudo** | Guia não paga vira juros, multa, pendência, e pendência vira Termo de Exclusão, que vira alíquota de Lucro Presumido. **É a corrente inteira puxada por um elo** |
| **Como o líder resolve** | Lote **no fim de cada mês**, contra "dados oficiais do Governo Federal". Por isso os 30 dias |
| 🔑 **A exceção que ensina** | No **débito automático**, a confirmação sai **entre os dias 20 e 23**, no mês corrente. Eles sabem em tempo hábil **só quando o pagamento passa pelo trilho deles** (Contabilizei.bank) |
| 🔴🔴 **O elo que faltava: guia não paga PROÍBE distribuição de lucro** | *"A retirada de lucros por sócio de empresa que possui **débitos federais não é permitida**. A Receita Federal impõe **multa de 50% sobre o valor distribuído**, limitado a 50% do imposto devido."* **Guia não paga → débito federal → sócio não pode tirar dinheiro da empresa.** É a consequência mais afiada da cadeia inteira, e eleva a 2.4 de higiene contábil para **o que libera o dono a receber**. Ver [[2026-09-09-contabilizei-pro-labore]] §10 |
| 🔑 **"Distribuição de lucro" é INFERIDA do extrato** | Definição deles: *"qualquer retirada em espécie/bancária que **não seja pró-labore nem devolução de empréstimo**"*. Não é ato formal que o sócio declara: **é saque identificado no extrato**. Explica por que o extrato é central pra eles |
| 🔴 **Nossa linha 2.4, agora com uma porta a menos** | ⚪ **Escopo travado em 09/09 (Pedro): não seremos financeira e não teremos conta PJ.** O caminho do "trilho próprio" (Contabilizei.bank) **sai da mesa**. Sobra a consulta de arrecadação, e a pergunta vira: **dá pra fazer melhor que o lote mensal deles sem possuir o pagamento?** |
| 🔑 **O que a API revelou (09/09)** | `verificacaoPagamentoAutomatica` é flag **por guia**, não global — nem toda guia é auditada. E `acaoBotao` vem do servidor: `PAGAR` → `RECALCULAR` → `BAIXAR_GUIA`, um botão com três significados conforme o estado. Ver [[2026-09-09-contabilizei-guia-imposto]] |
| 🔴 **Dois impostos fora do radar** | **TFE** (Taxa de Fiscalização de Estabelecimentos, municipal de BH, R$168,48/ano) e **`DARF_UNIFICADO_ATIVACAO_FATOR_R`** (R$11, pró-labore simbólico pra abrir a contagem do Fator R). 🕓 o 2º **não ratificado** |
| ⚠️ **O custo do atraso é invisível** | Juros e multa aparecem só como `valorPago > valorPrincipal`, sem linha própria. Medido: DAS de R$720 pago a R$774,72 |

---

## 📅 O calendário que sai de tudo isso

| Dia | O quê | Se cair em dia não útil |
|:--:|---|---|
| **1º ao último** | janela de emissão de nota | — |
| **5** | 🆕 **fecho do mês contábil**: importar, alterar ou cancelar nota do mês anterior sem custo (regra do líder, não da lei) | — |
| **15** | eSocial + DCTFWeb · 🆕 **e o envio das MOVIMENTAÇÕES financeiras** (extrato, investimentos, empréstimos) para a EFD-Reinf | **antecipa** |
| **20** | **DAS** | **PRORROGA** |
| **20** | DARF (INSS/IRRF) + FGTS Digital | **ANTECIPA** |
| **25** | 🆕 último dia pra escolher o pró-labore do mês (regra do líder, não da lei) | — |
| **31/03** | DEFIS (anual) · ⚠️ extinta a partir de 2027 | — |

⚠️ **Dia 20 aparece duas vezes com regras opostas.** É a armadilha nº 1 do calendário e já foi vista funcionando na tela do líder.

---

## 🎯 O que este mapa exige do nosso produto

### As 3 telas que o cruzamento obriga

| # | Tela | Por que o cruzamento a exige |
|:--:|---|---|
| 1 | **"Por que pago isso"** | O cliente vê DAS e DARF separados e não sabe que são a mesma gangorra. Uma tela que mostre os dois juntos e o efeito de mexer no pró-labore |
| 2 | **Folga do Fator R** | "Sua folha está em 37,7%; o mínimo é 28%; você tem R$4.269 de folga." O líder tem o número e **esconde** |
| 3 | **Simulador com exportação** | O líder simula só mercado interno. Pra quem fatura fora, a alíquota cai à metade e ele nunca vê |

### As 4 travas de motor

| # | Trava |
|:--:|---|
| 1 | **Pró-labore lançado e não pago não entra no Fator R.** Exige estado de pagamento por competência (reencontra a 2.4) |
| 2 | **Regra de arredondamento escrita antes do motor**, igual na tela e na guia |
| 3 | **Deslocamento por tributo, não global:** DAS prorroga, DARF antecipa |
| 4 | **Item da LC 116 é dado do cliente, não dedução nossa.** Um CNAE pode ter vários; quem escolhe o item escolhe o ISS |

### O vocabulário que o cliente NUNCA lê

🔒 Travado aqui: **"Fator R", "Anexo III", "Anexo V", "RBT12" e "LC 116" não aparecem na interface.** O líder já não usa (nem "Anexo" ele mostra), e não é por falta de coragem: é porque **o nome não ajuda quem não é contador**.

O que aparece no lugar é o **efeito**:
> "Sua folha está em **37,7%** do faturamento. Acima de 28%, sua alíquota fica em **6%**; abaixo, sobe pra **15,5%**. Você tem **R$4.269** de folga."

---

## Links
[[HOME-produto]] · [[_metodo]] · [[_catalogo]] · [[_matriz-dependencia]] · [[pro-labore]] · [[aliquota-e-enquadramento]] · [[2026-09-09-contabilizei-aliquotas]] · [[2026-09-09-contabilizei-pro-labore]] · [[fiscal-simples-bh-2026]] · [[anexo-iii-simples]] · [[lc123-art18-anexos-taxativo]] · [[cnae-fiscalmente-otimo]]
