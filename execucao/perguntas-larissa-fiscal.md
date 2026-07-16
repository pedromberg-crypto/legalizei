---
tipo: operacao
status: fila-humana
data: 2026-07-15
tags: [fiscal, larissa, double-check, simples-nacional, fator-r, pendencia]
---

# 📋 Perguntas pra Larissa (fiscal) — double-check do consolidado

> 7 pontos que sobraram da pesquisa fiscal ([[fiscal-simples-bh-2026]] bloco CONSOLIDADO) + cruzamento com 2 relatórios Gemini. **Não são dúvidas do zero** — cada um tem uma hipótese nossa com fonte; a Larissa **confirma, corrige ou completa**. Ordenados por impacto no produto. Os 3 primeiros (A·B·C) travam a EXATIDÃO do simulador Fator R do B2. Contexto: **Simples · ME serviço · BH/MG · 2026**.

## Como responder
Coluna "Resposta Larissa" + "Confirma?" (✅ nossa hipótese certa / ⚠️ corrigir / ➕ completar). Onde citar norma, melhor ainda.

| # | Pergunta | Nossa hipótese (com fonte) | Por que importa no app | Resposta Larissa | Confirma? |
|---|---|---|---|---|---|
| **A** | Como se calcula o Fator R nos **meses 2 a 12** de uma empresa recém-aberta (sem 12m de folha)? | Anualização (art. 26 §4º CGSN 140/18). Uma pesquisa diz "média aritmética acumulada × 12"; a outra, razão direta folha÷receita do período. **Matematicamente o ×12 cancela → mesmo número.** | Toda empresa nova (cobaia inclusa) começa <12m. O simulador precisa projetar o Anexo certo desde o mês 1 | | |
| **B** | A **CPP patronal (20%) embutida no DAS** (Anexos III/V) **entra no numerador** do Fator R, mesmo sem ser recolhida à parte? | Gemini diz que **sim** ("compõe a memória de cálculo"). Leitura estrita do §24 LC 123 = só "CPP **efetivamente recolhida**" → numa ME sem funcionário a CPP não é recolhida separada → **numerador ≈ só o pró-labore** | **Muda quanto de pró-labore o sócio precisa pra bater 28%** → muda o "pró-labore ótimo" que o app recomenda. Pode errar o conselho pra mais/menos | | |
| **C** | A **folha (FS12) do Fator R** é apurada por **regime de caixa** (só o que foi efetivamente PAGO no mês)? | Sim — Solução de Consulta **COSIT 17/2021** (via Gemini). Pró-labore atrasado sairia do numerador do mês | Se confirmado, o app precisa **alertar**: "pague o pró-labore em dia ou cai pro Anexo V". Feature de proteção do cliente | | |
| **D** | Na **troca de contador**, o passo cadastral oficial é o **DBE "Evento 232 – Alteração do Contabilista"** via Redesim? E qual a **resolução CFC** que rege a responsabilidade (distrato, obrigações do período anterior)? | Gemini cita **Evento 232** + **Resolução CFC 1.590/2020** — mas a própria lista de fontes dele mostra CFC 987/2003 e 1493/2015 → **possível citação trocada** | É o esqueleto do **flow #2 (MIGRAR)**. Não dá pra codar com nº de norma/evento errado | | |
| **E** | Dá pra **pré-classificar por CNAE** quais são "sempre Anexo III", "sujeitos a Fator R (III×V)" e "Anexo IV"? Tem uma lista/critério objetivo (§5º-B / §5º-C art. 18 LC 123)? | Confirmado que existem os 3 grupos; **falta mapear a lista exata** contra nossa `cnae-matriz.csv` (hipótese fácil do §5º-D já foi refutada) | Define o que o B1 filtra e o que o B2 calcula em runtime. Tarefa de cruzamento que a gente faz, mas quer o critério dela | | |
| **F** | Pra **ME serviço no Simples SEM funcionário**, quais **obrigações acessórias** realmente se aplicam (DEFIS anual, eSocial "sem movimento", DCTFWeb, DES-BH) — periodicidade e quem transmite? | DEFIS anual (31/03); eSocial/DCTFWeb mensais pelo contador; DES-BH mensal. Não plenamente verificado pro caso sem empregado | Define o que o portal automatiza vs. o que o contador transmite (as 3 camadas U/S/C) | | |
| **G** | Valores **municipais de BH** exatos: **TFLF** (Taxa de Fiscalização/Localização) anual e faixa de **certificado digital A1** em 2026? | TFLF ~R$85–95 (<50m²) 🟡; JUCEMG LTDA padrão R$268,51 (Izabela citou ~R$288); cert A1 R$209–229/ano | Compõem o "repasse de taxas de governo" do B3 (guia à parte, não reembolsável) | | |

## Impacto se A/B/C não fecharem antes de codar
- O simulador Fator R do **B2.8** roda com a **mecânica** pronta, mas marcado **"estimativa"**. O número fino (principalmente o **pró-labore ótimo**) só trava com **B**.
- **D** trava o flow #2 (MIGRAR) — não bloqueia o flow #1 (abertura).
- E/F/G são refinamento, não bloqueadores do happy path.

## Links
- [[fiscal-simples-bh-2026]] (fonte-verdade, bloco CONSOLIDADO) · [[blocos-fluxo-abertura]] · [[spec-telas-entrada-b1-b2]] · [[briefing-carla-larissa]] · [[HOME]]
