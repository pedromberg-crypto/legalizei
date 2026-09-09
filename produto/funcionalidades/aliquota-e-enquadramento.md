---
tipo: verdade
status: vivo
dominio: funcionalidade
data: 2026-09-09
assunto: aliquota-e-enquadramento
autoridade: fonte-verdade
cobertura: parcial
balde: core
dependencia: externa
confianca: alta
bloqueio: motor de cálculo; tabela do IRRF não ratificada; estado de pagamento (2.4)
tags: [produto, funcionalidade, aliquota, fator-r, simples-nacional, enquadramento]
---

# 📊 Alíquota e enquadramento — a nossa funcionalidade

> 🧭 **Autoridade:** manda no **desenho da alíquota no nosso app**. É o que o dev implementa.
> O que o concorrente faz está em [[2026-09-09-contabilizei-aliquotas]], foto com data, que **não manda em nada**.
> Hub: [[HOME-produto]] · catálogo: [[_catalogo]] (§2) · dependências: [[_matriz-dependencia]].

---

## 🔗 Cruzamentos declarados

> Seção obrigatória, criada pela regra do [[_mapa-de-cruzamentos]]. Nenhuma funcionalidade fiscal se documenta sozinha.

| | |
|---|---|
| **⬅️ Recebe de** | **[[pro-labore]]** (a folha, que vira Fator R, que escolhe o Anexo) · **nota fiscal** (CNAE, item LC 116, faturamento, RBT12) · **cadastro** (município, para o ISS) |
| **➡️ Manda em** | **DAS** (valor da guia) · **faturamento líquido** (o que sobra pro dono) · **preço do nosso plano** (alíquota alta = dor maior = disposição a pagar) |
| **📅 Obrigação que dispara** | PGDAS-D (apuração, dia 20, **prorroga**) · DAS (dia 20, **prorroga**) · DEFIS (31/03, extinta em 2027) |
| **👁️ O cliente precisa ver** | quanto sobra · quanta folga tem no Fator R · o que muda se exportar · e **por que** o número é esse |

---

## 🔭 Por que esta funcionalidade

A alíquota é o **preço do produto que o cliente já compra** (o imposto). Ele não escolhe pagar, mas escolhe **quanto**, e quase nunca sabe disso.

O líder mostra o número (`6,00%`) e esconde a alavanca. Nossa tese inteira é transparência: **alíquota é onde a transparência vale dinheiro pro cliente**, não só confiança.

---

## 🧮 O motor, em 7 regras que viram teste unitário

| # | Regra | Fonte | Confiança |
|:--:|---|---|:--:|
| 1 | `alíquota_efetiva = (RBT12 × Aliq_faixa − PD) ÷ RBT12` | LC 123 art. 18 | 🟢 |
| 2 | `Fator R = Σ(folha 12m) ÷ Σ(RB 12m)` · **≥ 28% → Anexo III**, senão **Anexo V** | Res. CGSN 140/2018 art. 26 | 🟢 |
| 3 | `DAS = faturamento do mês ANTERIOR × alíquota efetiva` | tela do líder + LC 123 | 🟢 |
| 4 | `ISS = DAS × 33,50%` (Anexo III, 1ª faixa) | ✅ **ratificado pela aritmética**: 6,00% × 33,5% = 2,01%, exatamente o que a tela mostra | 🟢 |
| 5 | **Exportação de serviço:** subtrai **ISS + PIS + COFINS** | ✅ **ratificado**: 6,00 − 2,010 − 0,769 − 0,167 = **3,05%**, exato na tela | 🟢 |
| 6 | Item da **LC 116** decide o ISS, e um CNAE pode ter **mais de um item** | modal "Especifique a atividade" | 🟡 mapear os itens dos nossos 87 CNAEs |
| 7 | Vencimento **dia 20**, e **PRORROGA** em dia não útil (diferente do DARF, que antecipa) | Res. CGSN 140/2018 art. 40 §3º · ✅ visto na tela (DAS 21/09 × DARF 18/09) | 🟢 |

⚠️ **Regra de arredondamento, pendente e obrigatória.** No líder, `7.910,00 × 6% = 474,60` aparece como **474,59**. Um centavo. A nossa regra tem que estar **escrita antes do motor** e ser idêntica na tela e na guia, senão o cliente encontra a diferença e a confiança vai junto.

---

## 🖥️ As telas

| # | Tela | O que faz | Cobertura hoje |
|:--:|---|---|:--:|
| **A1** | **Minha alíquota** | por atividade: CNAE, item LC 116, alíquota total, ISS, e a **folga do Fator R** | 🔴 |
| **A2** | **Por que pago isso** | a conta aberta do mês: faturamento → alíquota → DAS · pró-labore → INSS/IRRF → DARF · **total e líquido** | 🔴 |
| **A3** | **Simulador** | "e se eu faturar X?" e **"e se eu exportar?"** | 🔴 (a engine existe, falta superfície) |
| **A4** | **Alerta de virada** | avisa **antes** de o Fator R cair abaixo de 28% | 🟡 o bloco existe, falta o gatilho (5.4 / 4.2) |

---

## ✅ O que copiamos sem vergonha

1. **Uma linha por atividade**, com CNAE, item de serviço, alíquota e ISS separados. A anatomia deles está certa.
2. **O rádio mercado interno × externo.** Resolve com um toque um caso que muda o imposto pela metade.
3. **A linha `Faturamento líquido`.** O dono não quer saber quanto paga; quer saber **quanto sobra**.
4. **O comparativo de dois cenários** ("com pró-labore mínimo" × "com pró-labore ideal", quebrado em DAS e DARF). É a melhor peça do produto deles.
5. **Os 10 status da guia** (`Calculando · Pendente · Prorrogada · Postergada · Pagamento agendado · Verificando pagamento · Paga · Paga via parcelamento · Vencida · Recalculando`). Especificação pronta, não precisamos inventar.

---

## ✍️ O que fazemos diferente, e por quê

| # | Eles | Nós | Por quê |
|:--:|---|---|---|
| 1 | `Folha: 37,72%` numa coluna, sem explicar | **"Sua folha está em 37,7% do faturamento. O mínimo pra manter 6% é 28%. Você tem R$4.269 de folga."** | Eles têm o número e não dizem o que ele faz. É a informação mais acionável da tela |
| 2 | Alíquota e pró-labore em **telas diferentes**, sem link | **Mesma tela, ou link explícito nas duas pontas** | São o mesmo número por dois caminhos. Separar é esconder a alavanca |
| 3 | Simulador **só mercado interno** | Simulador **com exportação** | Quem fatura fora paga quase metade e no líder nunca vê |
| 4 | O **Anexo nunca aparece** em lugar nenhum | Também não aparece. **Mas o efeito aparece** | Concordamos em esconder o jargão; discordamos em esconder a consequência |
| 5 | "IRRF = imposto de renda de **pessoa jurídica**" (2 telas) | IRRF é **pessoa física**, retido na fonte sobre o pró-labore | Erro conceitual deles. Não repetir |
| 6 | CNAE em dois formatos (`7319-0/04` × `7319-00/4`) | Formato único, derivado de `lib/cnae.ts` | Já é regra da casa desde 04/09 |
| 7 | Só diz a alíquota **depois** que a empresa existe | Dizemos **na escolha do CNAE**, antes de abrir | É o [[cnae-fiscalmente-otimo]], que já está construído e testado. **O líder não tem isso** |

---

## 🔴 O que trava

| | O quê | Onde resolve |
|:--:|---|---|
| 🔴 | **Tabela do IRRF não ratificada.** A que temos veio da tela do concorrente, e o app deles carrega banner de reforma tributária | fonte primária |
| 🔴 | **Motor de cálculo** não existe. Sem ele a tela é mock | trilha própria |
| 🔴 | **Estado de pagamento por competência** (2.4) — sem ele o Fator R não sabe o que foi pago | [[_matriz-dependencia]] |
| 🟡 | **Item da LC 116 por CNAE**: falta mapear para os nossos 87 | [[cnae-liso-servico]] |
| 🟡 | **Regra de arredondamento** não escrita | antes do motor |
| 🟡 | **ISS por município**: temos BH; o resto de MG não | [[fiscal-simples-bh-2026]] |

---

## Links
[[_mapa-de-cruzamentos]] · [[pro-labore]] · [[2026-09-09-contabilizei-aliquotas]] · [[HOME-produto]] · [[_catalogo]] · [[_matriz-dependencia]] · [[cnae-fiscalmente-otimo]] · [[fiscal-simples-bh-2026]] · [[anexo-iii-simples]] · [[lc123-art18-anexos-taxativo]]
