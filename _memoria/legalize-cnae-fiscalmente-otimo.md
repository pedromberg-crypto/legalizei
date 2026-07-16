---
name: legalize-cnae-fiscalmente-otimo
description: "Feature-âncora: depois de acertar o CNAE, o app recomenda o mais barato ENTRE os que cobrem a mesma atividade real. Engine b2.cnae_otimo pronta; DADO Gemini CRUZADO 15/07 (ISS BH mapeado + 5 famílias + 8599 resolvido); falta Larissa ratificar. Spec em execucao/cnae-fiscalmente-otimo.md."
metadata:
  node_type: memory
  type: project
  originSessionId: 0fb901c3-c0b1-4dc1-b0e0-800217e02864
---

Decisão 2026-07-15 (Pedro): o produto não só **acerta** o CNAE — recomenda o **fiscalmente ótimo** entre os que emitem NF válida pra mesma atividade. Spec + shape + exemplo em [[cnae-fiscalmente-otimo]] (execucao/).

**2 alavancas complementares:**
- **Fator R** (mesmo CNAE, sobe pró-labore até folha≥28% → Anexo III) — só serve pra quem PODE pagar pró-labore alto. Já construída (pró-labore ótimo, B2.8).
- **CNAE-swap** (troca pra código de menor carga que cobre a mesma atividade — ex: fugir de Fator R pra um §5º-B "sempre Anexo III") — serve pra quem NÃO pode inflar folha = **ICP solo/baixa-folha**. A feature nova.
Insight: a alavanca 2 cobre exatamente o cliente que a 1 deixa de fora.

**Exemplo real #1 (RESOLVIDO 15/07):** atividade "treinamento + orientação de gestão" → `7020-4/00` consultoria (Fator R → V 15,5% + ISS 5%) × `8599-6/04` treinamento (§5º-B → III fixo 6% + ISS 2%). **Ganho DUPLO** (anexo + ISS). Delta ~R$1.425/mês @R$15k. **Claim antes 🟡, agora 🟢:** 8599-6/04 = Anexo III SEM Fator R, definitivo (SC Cosit 205/2014 + SC DISIT/SRRF08 8022/2018, citação literal). Larissa só ratifica.

**LINHA DURA (anti-passivo):** só é legal ENTRE CNAEs que a atividade REAL permite. Recomendar código que não bate = evasão (NF inválida, exclusão do Simples, responsabilidade nossa). Larissa assina cada família; contrato cobre o conselho.

**Estado (15/07):** engine `b2.cnae_otimo` testada (persona `instrutora`, 11/11 PASS) + **DADO Gemini cruzado** (fonte bruta em pesquisa/cnae-matriz/2026-07-15-gemini-otimizacao-cnae-bh.md). **ISS BH mapeado.** **5 famílias de swap** — as 3 primeiras entram limpas no MVP: (1) infoproduto/mentoria `7020-4`→`8599-6/04` · (2) SaaS `6201/6203`→`6311-9/00` (§5º-F) · (3) agência/BPO `7311-4/7020-4`→`8219-9/99`. Famílias 4-5 esbarram no corte só-serviço. Correção: código advocacia do Gemini `6910-4/01`→`6911-7/01`.

**Próximo:** Larissa ratifica cada família + os swaps de menor confiança (tráfego pago, SaaS white-label). Personas novas `saas`/`bpo` no motor. Deriva de [[legalize-pesquisa-fiscal-bh-2026]] · [[legalize-motor-testes-arquitetura]] · [[legalize-blocos-fluxo-abertura]].
