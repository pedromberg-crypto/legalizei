---
tipo: operacao
status: vivo
data: 2026-07-09
tags: [gestao]
---

# 🅿️ Parking Lot — decisões e frentes adiadas

> Onde mora o que "está ficando pra trás": decisões, direções e ideias que surgiram mas foram adiadas de propósito. Diferente do [[kanban-legalizei]] (tarefas concretas em execução) e da §5 da [[BASE-ESTRATEGICA]] (dúvidas estratégicas travadas).
> **Peça a qualquer momento: "o que está ficando pra trás?"** que eu consolido isto + Triagem do kanban + §5 da base.

## Frentes adiadas (ativas)

| # | Frente | Por que surgiu | Adiada em | Retomar quando |
|---|---|---|---|---|
| A | **Pauta técnica de sexta com o Pedro Dev** — cruzar nossa auditoria UX com a análise tech dele = teardown 360° | Reunião marcada 10/07 9h | 2026-07-09 | Antes de sexta — montar o doc de pauta |
| B | **Auditar a Agilize** (2º concorrente) — preço FIXO transparente, o oposto do líder; dá contraste | Só auditamos a Contabilizei até agora | 2026-07-09 | Após consolidar o líder; +1 coluna na [[cnae-matriz-governo]] |
| C | **Fechar pendências da imersão** — diário diário, term sheet 1 pág, NDA/acessos | Maratona técnica consumiu os dias; §13 da base pede | 2026-07-09 | Dias correntes da imersão (S1) |
| D | **Versão limpa do deck** (sem notas internas) — já existe flag SHOW_NOTES no build-deck.js | Deck já cumpriu com o Mauro; slide 5 desatualizado (preço R$195→210) | 2026-07-08 | Se houver reapresentação |
| I | **Atender Lucro Presumido no MVP? (provocação)** — diferença Contabilizei R$195 (Simples) → R$239 (LP) é pequena (~22%), o que sugere complexidade **incremental**, não gigante. Vale medir esforço de suporte a LP já no V1. MVP segue **só Simples** por ora | Provocação do Pedro no flow de pesquisa fiscal 15/07 | 2026-07-15 | Depois do cruzamento das pesquisas fiscais (minha + Gemini) |
| J | **Passo "ativação fiscal / emissão de DAS" no flow** — Contabilizei emite as guias pro cliente; precisamos do passo que liga certificado digital → procuração e-CAC → emissão automática de DAS/PGDAS-D (provável "B4.5", pós-constituição). Onde exatamente encaixa = definir | Pedro validou na pele (recebe guia da Contabilizei); bloco K/G da pesquisa | 2026-07-15 | Após cruzar as pesquisas (blocos D/H/I/K + Gemini) — voltar só pra posicionar o passo |
| K | **Base de tom-de-voz/copy insuficiente pra validar telas** — hoje só existe `conceito-marca.md` §5 (arquétipo+traços+poucos exemplos do/don't) + regras pontuais soltas + rubrica mecânica de auditoria. Falta glossário técnico→humano (CNAE/DAS/Fator R/pró-labore/TTRT) + exemplos de copy por tipo de tela. Personas do motor-testes NÃO cobrem isso (são QA de fluxo, não copy) | Pedro pediu validação de copy E1-E4.5 contra "o produto como um todo" (05/08) | 2026-08-05 | Antes de validar copy das telas E1-E4.5 (ou qualquer flow) sob essa lente |

## Pendências fiscais encaminhadas (pós-Izabela 09/07)
| Frente | Com quem | O que perguntar |
|---|---|---|
| E | **Carla** (Depto Pessoal) | Sócio pode ser CLT? · eSocial sem movimento transmite sem funcionário? |
| F | **Larissa** (Depto Fiscal) | Tributação por anexos diferentes (pela maior) · quais obrigações acessórias se aplicam (DES-BH, DCTFWeb, DEFIS, EFD-Reinf, SPED), prazos e risco de multa · acessória estadual MG p/ serviço |
| G | **Leonão** | O que o software prepara × o que só o contador transmite/assina |
| H | **Jessica** | Abrir empresa do Mauro em 4 concorrentes (mapear onboarding — só temos o da Contabilizei) |

## Como isto se conecta
- Tarefas concretas dessas frentes → viram cards no [[kanban-legalizei]] quando a gente pega.
- Dúvidas estratégicas travadas (preço, aporte do Mauro, banda do sênior) → [[BASE-ESTRATEGICA]] §5.
- Ideias de produto adiadas → [[spec-mvp-v0]] §6.

## Concluídas (histórico, pra não reabrir)
- ✅ Spec-cunha do MVP (decisão 1 das 4) → [[spec-mvp-v0]] (2026-07-09)
- ✅ Matriz CNAE base → [[cnae-matriz-governo]] (2026-07-09)
- ✅ Auditoria UX completa do líder → [[_relatorio-auditoria]] (2026-07-09)
