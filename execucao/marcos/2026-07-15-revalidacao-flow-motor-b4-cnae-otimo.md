---
tipo: marco
data: 2026-07-15
tags: [marco, fiscal, motor, flow, cnae, feature]
---

# 🏁 Marco 2026-07-15 (2ª sessão) — Consolidação fiscal + revalidação do flow + motor até B4 + CNAE ótimo

> Sessão longa, contínua (Pedro optou por não fechar entre flows). Do consolidado fiscal ao motor rodando o flow inteiro + a feature-âncora do produto rascunhada. **Ainda sem commit até este fecho.**

## O que foi feito
1. **3ª rodada fiscal (deep-research) + cruzamento com 2 docs Gemini** → bloco **CONSOLIDADO** em [[fiscal-simples-bh-2026]] = fonte-verdade (🟢 travado / 🟡 fila-Larissa). Fechou H (Fator R 1º ano), I (migração), D-resíduo (INSS 11% direto — refutação resolvida). Sem contradição dura Gemini×nós.
2. **Tabela de 7 perguntas p/ Larissa** → [[perguntas-larissa-fiscal]].
3. **Flow revalidado contra o consolidado** ([[blocos-fluxo-abertura]] + [[spec-telas-entrada-b1-b2]]): corrigido IRRF (zero ≤R$5k), teto vira **folga** (não binário), **pró-labore ótimo** (3º cenário), valores 2026, limite **2 sócios**.
4. **Personas realinhadas** ([[casos-teste-fluxo-cnae]]): Sociedade (folga teto), Knife-edge (anexos vira borda), Monstro (2 sócios, pipeline até B4), + testes de bloqueio 7–9.
5. **Motor estendido p/ v0.2.2**: cobre **B1→B4→B4.5**; **11 personas rodando PASS**; guard-rails (limite 2, exterior, CLT-própria); 1ª bateria interpretada (10 personas) → otimizações de UX levantadas.
6. **Feature CNAE fiscalmente ótimo** ([[cnae-fiscalmente-otimo]]): shape + exemplo real (treinamento×consultoria) + engine `b2.cnae_otimo` testada (persona `instrutora`). **2 alavancas** (Fator R + CNAE-swap).

## Decisões travadas
- Simulador Fator R = **projeção "estimativa"** até Larissa (pontos A/B/C).
- **CNAE fiscalmente ótimo = feature-âncora** do produto; otimiza **só entre CNAEs que a atividade real permite** (Larissa assina cada família; senão é passivo).
- Sobre janela: `/fechar` persiste estado; `/clear` dá contexto novo na mesma janela (não precisa reabrir app).

## Pendente / próximo (retomar pós /clear)
- **Enriquecer os 260 CNAEs (anexo · Fator R? · ISS BH) + famílias de swap via Gemini** → cruzar → alimentar [[cnae-fiscalmente-otimo]] + motor → Larissa. **Prompt do Gemini entregue no fecho.**
- Otimizações de UX do flow (simulador em R$, bloqueios que capturam/educam, exterior no B1, simulador multi-sócio real).
- Flow #2 MIGRAR (esqueleto no consolidado; verificar CFC/Evento 232).
- 7 pontos fiscais → Larissa.

## Links
- [[fiscal-simples-bh-2026]] · [[cnae-fiscalmente-otimo]] · [[perguntas-larissa-fiscal]] · [[blocos-fluxo-abertura]] · [[casos-teste-fluxo-cnae]] · [[HOME]]
