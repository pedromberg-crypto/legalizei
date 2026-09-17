# Lotties originais (antes de recolorir)

Os `.json` **originais baixados do LottieFiles**, renomeados limpo. Fonte de verdade das animações. As versões coral (`*-legalizai-story-book.json`) em `ux-ui/prototipo/` e `ux-ui/lp/assets/` derivam destes.

Rastreados de `~/Downloads` em 2026-07-14.

## Mapa

| arquivo aqui | nome original baixado | onde usa | var global | fps |
|---|---|---|---|---|
| `customer-need.json` | Customer need.json | welcome tela 1 | `CUSTOMER_NEED` | 30 |
| `content-mod.json` | Content Moderation Website Design Animations.json | welcome tela 2 | `CONTENT_MOD` | 30 |
| `marketing-mgmt.json` | Marketing management.json | welcome tela 3 | `MARKETING_MGMT` | 25 |
| `loading.json` | loading.json | gate-cnae (arquivos + lupa) | `LOADING` | — |
| `paperplane.json` | Loading 40 _ Paperplane.json | fluxo-entrada (avião) | `PAPERPLANE` | 50 |
| `steps.json` | 4 Steps.json | stepper (testado, revertido pra barra) | `STEPS_BAR` | 60 |
| `success-confetti.json` | success confetti.json | gate-cnae (confete de aceite) | `CONFETTI` | 60 |
| `confetti-effects.json` | Confetti Effects Lottie Animation.json | **alternativa não usada** (perdeu pro success-confetti) | — | 60 |

## Nota

7 em uso + 1 confete alternativo descartado = 8. Recolorir = trocar fills/Color Control da marca por coral no `.json`; ver [[legalize-prototipo-ux]] e marco `execucao/marcos/2026-07-12-fluxo-entrada-completo-prototipo.md`.
