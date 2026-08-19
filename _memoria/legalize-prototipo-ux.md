---
name: legalize-prototipo-ux
description: Protótipo UI do Legalizai Story Book = HTML+Tailwind throwaway em ux-ui/prototipo/ (método página-primeiro); fluxo de entrada completo (splash→welcome→fork→gate→login) + wizard; padrões de layout sem scroll e Lottie local.
metadata: 
  node_type: memory
  type: project
  originSessionId: a44ea9fe-9148-456b-af9d-df7f5fd17ae1
---

Protótipo visual das telas do app vive em `ux-ui/prototipo/` — **HTML + Tailwind throwaway** (prancha viva de design, NÃO o app; dev recria no Expo/React Native). Cores + Sora plugados. Loop = `python -m http.server 4599` na pasta + Chrome F5.

**Método (travado):** página-primeiro — constrói 1 página rica → valida → extrai tokens/componentes → replica; Design System = consolidação no fim, não largada (DS-first já falhou pro Pedro).

Arquivos (fluxo de entrada COMPLETO, 2026-07-12): `splash.html` (coral, logo negativa, handoff slide-up → welcome) · `welcome.html` (3 telas swipe + Lottie coral cada) · `fluxo-entrada.html` (fork abrir/migrar, logo estático) · `gate-cnae.html` (concierge validador de CNAE + waitlist + código direto) · `login.html` (gradiente ink+coral, social) · `fase-0-dados-socio.html` (wizard etapa 1, barra simples). Detalhes no marco [[2026-07-12-fluxo-entrada-completo-prototipo]] (arquitetura no [[2026-07-12-fluxo-entrada-prototipo]]).

**Padrões travados:**
- **Layout sem scroll:** moldura `h-[100dvh]` + `overflow-hidden`; `min-h-0` em TODA a cadeia flex; um elemento `flex-1` absorve a sobra (encolhe = rubber-band). `dvh`, nunca `vh`.
- **Splash = único momento de marca animado; fork entra com logo estático** (não repete montagem).
- **Lottie local:** servir `lottie.min.js` + `*-legalizai-story-book.json` da pasta; recolorir cor de marca → coral (fills + effects). Na pane do Claude o tab roda offscreen e congela o `requestAnimationFrame` → **driver manual** (`setInterval`+`goToAndStop`); no app real (RN) autoplay nativo. Screenshot da pane trava com o loop (não é bug do código) — Pedro valida no Chrome dele por F5.

**gate-cnae — micro-interações (2026-07-12):**
- **Loading = lottie arquivos+lupa** (`loading-legalizai-story-book.json` / `window.LOADING`) no lugar dos 3 dots; toca no estado "pensando", pausa no resultado.
- **Confirmação de CNAE = confete** (`success-confetti-legalizai-story-book.json` / `window.CONFETTI`): botão "É isso mesmo" encolhe (scale .18) e explode círculo coral + check branco (eco do logo) → navega `login.html`.
- **Placeholder animado (typewriter):** ghost overlay digita 15 atividades CNAE populares letra por letra (~42ms), segura nos "...", troca random; cor ink-400; some ao digitar (classe `.gh-hide`); reduced-motion = 1 exemplo estático.
- **CTA no rodapé:** na tela de resultado o CTA primário cola no rodapé (`mt-auto`, padrão da 1ª aba), secundário "refazer" acima. Princípio "CTA em baixo" pra boa parte do app.
- **Validador:** atividade regulamentada SEMPRE vence match verde (advogado/consultoria → waitlist); word boundaries `\bapp\b`/`\bbar\b`/`marcas?\b`; "não entendi" preserva o texto.
- **Sem travessões (—) na copy** (regra do Pedro): vírgula/ponto/dois-pontos; tabela vs- usa ✕.
- Recolor de lottie via script Python (mapeia cor origem→paleta por nome de layer ou tupla RGB) + wrapper `window.VAR`.

Régua = [[legalize-mlp-nao-mvp]]. Fonte = [[legalize-fonte-sora-sistema]]. Assets = [[legalize-assets-marca-local-vault]]. LP = [[legalize-lp-construida]].
