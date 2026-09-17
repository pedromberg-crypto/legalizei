---
tipo: referencia
status: vivo
data: 2026-07-21
assunto: reordenacao-cluster-fiscal-encaixe
tags: [produto, flow, cnae, fiscal, reordenacao, decisao, proposta]
---

# 🧭 Reordenação do cluster fiscal — modelo ENCAIXE

> **PROPOSTA APROVADA na direção** (Pedro, 2026-07-21) · implementação **pendente** · N5 = **opção B**.
> Nasceu de um debate no `/mockup`: Pedro não se sentia confortável com a sugestão de troca de CNAE **tarde** (N17), "fica parecendo que a gente foi descuidada no início e já não ofereceu de cara". Trouxe um print de um modelo alternativo (card Recomendado + outras opções). Esta nota é o desenho fechado.

## O problema que resolve
- Hoje o **N17 (swap do CNAE)** vem **tarde**: depois do dossiê inteiro (N10–N16), inclusive do **N16 (nome + consulta prévia na Junta)**. Ordem backwards: decide a atividade-núcleo por último.
- **Confirmado pelo Pedro (não é mais 🕓 pra Larissa):** o CNAE **entra no primeiro preenchimento** e o **nome/objeto social/consulta na Junta dependem dele**. Logo, travar o CNAE cedo **não é estética, é requisito** — senão o swap do N17 invalida o N16 e força retrabalho.
- O N14 (secundários) também escolhia vizinhas de um primário que o N17 ainda ia trocar.

## A decisão
Fundir **a escolha do CNAE + a defesa fiscal** numa tela de **DESCOBERTA (o ENCAIXE)**, logo após o **veredito 🟢**, **ainda pré-pagamento**. É o modelo do print: **1 card Recomendado** (melhor fit + mais barato que serve) **+ "outras opções que também servem"**. A otimização deixa de ser *"quer trocar?"* (correção tardia) e vira *"achei seu encaixe"* (competência, de cara).

## O que muda nas telas
- **N17 (swap tardio) DISSOLVE** → vira o ENCAIXE (escolhe, não corrige).
- **N5 teaser (3 modos swap/fator-r/servico) DISSOLVE** → a prova migra pro ENCAIXE; sobra só um **resumo de valor leve** (ver §N5 = B).
- **N18 (pró-labore / Fator R) FICA** no pós-pago — é a **2ª alavanca** e depende de **N11 (CLT) + N12 (nº sócios)**.

## A ordem nova
**Pré-pago (tudo dentro do N4):**
`descreve → analisa → veredito 🟢 → ENCAIXE (🔒 trava o CNAE) → triagem → faixa → N5' (resumo de valor, opção B) → paga`

**Pós-pago (já usa o CNAE travado):**
`N10 → N11 → N12 → N18 pró-labore → N13 → N14 → N15 → N16 nome+Junta → N19`
(N14 e N16 agora veem o **código final**; N18 fica aqui porque depende de N11+N12.)

## As 4 regras do ENCAIXE (guarda-corpos)
1. **Vem DEPOIS do veredito, não na tela de descrever.** A tela de descrever segue leve (farol "mais simples"); o seletor de CNAEs entra num passo próprio. Protege a `cida`/`reta-direto` — 3 cards com % no ato de descrever assustaria.
2. **O % de adequação é REAL** (resolvido pelo Pedro). Cruza a **pill clicada + o texto do N4 via IA** = fit ao que a pessoa descreveu. É **sugestão não-vinculante**: a escolha continua com ela. ⚠️ `adequação` = fit à descrição, **não** é "% mais barato" — não confundir os dois na copy.
3. **Garante o SETUP, não o resultado.** Copy: "te coloco no código **mais barato que serve**", **nunca** "menor imposto possível" cravado. No caso `fator-r` o número depende da margem (pró-labore) → prometer resultado é a `promessa-quebrada`.
4. **Defesa de legitimidade INLINE e obrigatória.** "emite a mesma nota, não é malandragem" (herda a spec do N17). Sem isso o leigo cheira fraude e **recusa a economia** — some a razão da feature existir. O recomendado ser o mais barato (e não o de maior %-match) só se sustenta com esse argumento.

## N5 = opção B (decidido)
N5 vira um **"resumo de valor" enxuto** pós-faixa, ainda pré-pago:
> "Na sua faixa, ~R$X/mês de imposto, e a gente cuida de tudo."

Número **suave, faixa-based, com carimbo de estimativa** (UX-26). Vende **segurança** sem prometer economia. Dá um respiro de valor antes do dinheiro.
❌ **Opção A (matar o N5 de vez) descartada.**

## Sub-decisões de layout (abertas — NÃO bloqueiam)
- **Veredito 🟢 + ENCAIXE podem virar 1 tela só** (o "atende" positivo já É "achei seu encaixe" + escolher). 🟡 waitlist / 🔴 não-atende seguem sendo saída.
- A **comparação profunda** (atual × ótimo em R$, PDF "por que é legítima") vira **depth-on-demand** dentro do ENCAIXE (expander/link), não tela à parte (UX-48).
- ⚠️ O print trazido tinha **travessão** em 2 lugares → regra dura, some na redação final.

## Ripple de implementação (quando for codar — NÃO agora)
- Novo sub-passo `encaixe` no gate (N4), **entre `veredito` e `triagem`**; escolhe e **persiste o CNAE primário**.
- `N14` (secundários) e `N16` (nome/objeto) passam a **ler o CNAE travado**.
- **Remover rotas:** `/teaser/swap` · `/teaser/fator-r` · `/teaser/servico` · `/dossie/cnae-otimo` (N17).
- Migrar a **defesa de legitimidade + tradeoff** (edital/cliente exige código) do N17 pro ENCAIXE.
- Criar o **N5' (resumo de valor)** pós-faixa.
- `lib/passos.ts`: **reindexar** (o CNAE ótimo sai da contagem pós-pago; a numeração N muda). ⚠️ o número de passos é fonte única — bater com o motor.
- Atualizar o **motor** (`flow-schema.js`) e o **mapa-flow** (`flow-data.mjs` → gerado) — não editar o mermaid à mão.

## Supera
Esta nota **substitui** o mapa anterior de "mover o N17 pra antes do dossiê" (reorder simples): o modelo ENCAIXE é mais forte porque **escolhe** o CNAE na descoberta em vez de **corrigir** depois, e resolve a ordem de brinde.

## Links
[[cnae-fiscalmente-otimo]] · [[legalize-pill-estreita-nao-valida]] · [[reordenacao-flow-cobranca-cedo]] · [[spec-telas-entrada-b1-b2]] · [[fiscal-simples-bh-2026]] · [[HOME]]
