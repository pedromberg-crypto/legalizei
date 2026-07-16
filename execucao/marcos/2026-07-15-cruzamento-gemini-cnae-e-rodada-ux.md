---
tipo: historico
status: congelado
data: 2026-07-15
tags: [marco, cnae, fiscal, ux, flow, motor, regra]
---

# 🏁 Marco 2026-07-15 (3ª sessão) — Cruzamento Gemini CNAE + rodada #1 de UX + regra UI-inline

> Continuação do dia. Do dado fiscal do CNAE ótimo à 1ª rodada de lapidação de UX do flow, com regra nova de trabalho.

## O que foi feito
1. **Cruzamento Gemini × nossa base** (método da pesquisa fiscal) → [[cnae-fiscalmente-otimo]] enriquecida. Fonte bruta guardada: [[2026-07-15-gemini-otimizacao-cnae-bh]]. **Zero contradição dura.** Resolvidos:
   - **ISS BH mapeado** por CNAE (2% treino/eng · 2,5% TI · 3% limpeza/saúde · 5% consultoria/publi/design/BPO).
   - **`8599-6/04` = Anexo III SEM Fator R**, definitivo (SC Cosit 205/2014 + SC DISIT/SRRF08 8022/2018) — sustenta a feature-âncora; era nosso 🟡 crítico.
   - **Grupo C / Anexo IV** explícito (construção · limpeza/vigilância · advocacia) — CPP 20% fora do DAS.
   - **5 famílias de swap**: 1 infoproduto→treinamento · 2 SaaS→`6311-9` · 3 agência/BPO→`8219-9` (as 3 entram limpas no MVP) · 4 design (usar `8219-9`, `1821-1` é indústria) · 5 engenharia→instalação (fora do V1).
   - 🔴 correção: código advocacia do Gemini `6910-4/01` não existe → `6911-7/01`.
2. **Rodada #1 de UX do flow** — compilei as sugestões "olhar leigo" das 11 personas (relatórios T0026–T0036) e **apliquei 16 na [[spec-telas-entrada-b1-b2]]**: tela nova do CNAE ótimo, simulador em R$ sem jargão, bloqueios que educam (exterior/CLT-própria/3 sócios/waitlist), acessibilidade Cida, CNAE humano. **2 itens 🟡** (termo B3, pausas B4) esperam spec própria. Log: [[compilado-ux-flow]].
3. **Regressão pós-spec: 11/11 PASS** (T0037–T0047). A spec de UX não toca a lógica do `flow-schema.js`.

## Decisões / regras travadas
- **Log-UX vivo** ([[compilado-ux-flow]]): fonte única do que otimizar + o que já foi feito; item 🔴→✅ com onde+data; atualizado no `/fechar`.
- **Regra UI-inline:** a partir de agora, a UI de cada tela é **registrada** num bloco `🎨 UI (a construir)` colado ao passo — **não construída**. Lapidamos UX/flow agora; UI vira **fase-2** depois do flow robusto.
- CNAE ótimo: dado Gemini vira insumo; **Larissa ainda ratifica** cada família + os swaps de menor confiança.

## Pendente / próximo (retomar pós /clear)
- **RODADA #2 CURADA das personas:** curar `personas/*.json` (campo `sugestoes` — tirar as 16 resolvidas, escrever as de 2ª ordem) → rodar → tabela por persona + compilado → atualizar [[compilado-ux-flow]].
- Personas novas `saas` e `bpo` (famílias 2-3 do CNAE ótimo).
- Re-sincronizar [[mapa-telas-mobile]] com a renumeração (tela 13 CNAE ótimo → simulador 14 → revisão 15).
- 7 pontos fiscais → Larissa; INPI; flow #2 MIGRAR.

## Links
- [[cnae-fiscalmente-otimo]] · [[compilado-ux-flow]] · [[spec-telas-entrada-b1-b2]] · [[casos-teste-fluxo-cnae]] · [[fiscal-simples-bh-2026]] · [[HOME]]
