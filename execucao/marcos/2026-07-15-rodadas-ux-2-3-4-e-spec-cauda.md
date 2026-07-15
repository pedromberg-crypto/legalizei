---
tipo: marco
data: 2026-07-15
sessao: 4
tags: [ux, flow, spec, motor, marco, otimizacao]
---

# Marco 2026-07-15 (4ª sessão) — Rodadas de UX #2/#3/#4 + spec da cauda + correção do motor

> Sessão inteira dedicada a **otimizar o flow de abertura via motor de testes**. Quatro rodadas de UX (a #1 foi na sessão anterior), spec nova da cauda, e uma correção de lógica no motor. Fonte-verdade do que foi otimizado: [[compilado-ux-flow]].

## O que aconteceu

### Rodadas de UX (2ª → 4ª ordem)
Método: curar o campo `sugestoes` dos 11 JSONs de persona com o achado da rodada → `node run.js` nas 11 → sintetizar no [[compilado-ux-flow]] → aplicar na spec. Cada rodada só apareceu depois de fechar a anterior:
- **#2 (2ª ordem — confiança/reversibilidade):** 13 itens (UX-19→31). 9 na spec B1/B2 + 4 que ficaram 🟡 (cauda).
- **#3 (3ª ordem — cauda/dia-2):** 7 itens (UX-32→39). Nasceu de **ler os artefatos sem re-rodar**. Criou a spec nova da cauda, que **fechou os 4 🟡 da #2 + 2 🟡 antigos da #1** (UX-17/18).
- **#4 (4ª ordem — recuperação/decisão):** 8 itens (UX-40→47). 7 ✅ (6 spec + 1 motor) + **1 🟡 (UX-42)** que não é spec, é decisão de produto.
- **Acumulado: 45 itens ✅ / 1 🟡 na spec.**

### Spec nova da cauda
[[spec-telas-b3-b4-aterrissagem]] criada — cobre **B3 (cobrança) + B4 (constituição) + aterrissagem (dia-2)**, telas T16–T23. Fecha o buraco onde as personas de jornada longa perdiam pontos: conta da abertura, painel assíncrono com estado/idempotência visível, convite do 2º sócio, e-CAC explicada, failure-state, primeiros passos (1ª nota/1º DAS).

### Correção de lógica no motor (UX-43)
`flow-schema.js` passo `b2.clt`: **CLT-da-própria deixou de ser bloqueio fatal.** Era só confusão conceitual (pessoa confunde pró-labore com salário CLT) — o motor educava e **matava** o flow. Agora educa e **segue**. Persona `bloq-cltpropria` **reconvertida de bloqueio → recuperação** (completa até "ativa"). Única mudança de comportamento do motor na sessão. **11/11 PASS** pós-fix.

### % otimizado por persona (métrica nova, 3 snapshots)
Rubrica de julgamento (✅=cheio · 🟡=0,4 · 🔴=0) aplicada por persona, ponderando a jornada real de cada uma. Rastreado em #2 → #3 → #4:
- Tabuleiro **convergiu pra cima**: spread caiu de **76-92% (#2)** para **88-95% (#4)**.
- As jornadas longas (cida, monstro, sociedade, reta) subiram mais — a cauda specada levantou quem ia fundo.
- 4 personas (camaleao, fronteira, bloq-3socios, bloq-exterior) ficaram **flat na #4** — o único item delas (UX-42) é decisão de produto, não spec.

## Decisões travadas
1. **UX-43 — over-block é bug, não feature.** Bloqueio educacional (CLT-própria) **não deve ser terminal**: educa e destrava. Corrigido no motor. Vale como princípio pra futuros bloqueios "por confusão".
2. **A otimização de UX das 11 personas está esgotada.** Rodada #5 nelas não acha nada novo. Próximo ganho vem de **fora**: construir blind spots (erro recuperável, saas/bpo, MIGRAR), Larissa (fiscal), Mauro (UX-42 produto).
3. **UX-42 sobe pro sócio.** Servir nutri regulada com responsável técnico? Cotar MEI/Lucro Presumido como alternativa modelada nos bloqueios? Não é UX — é decisão de negócio Mauro/Larissa.

## Próximo passo
Escolher a nova frente (Pedro): (a) blind spots · (b) aterrar spec no protótipo/UI · (c) UX-42 pro Mauro + 7 pontos pra Larissa · (d) build backend. Ver §Agora do [[HOME]].

## Links
[[compilado-ux-flow]] · [[spec-telas-entrada-b1-b2]] · [[spec-telas-b3-b4-aterrissagem]] · [[casos-teste-fluxo-cnae]] · [[legalize-motor-testes-arquitetura]] · [[perguntas-larissa-fiscal]] · [[HOME]]
