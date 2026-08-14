---
tipo: historico
status: congelado
data: 2026-07-12
tags: [produto, ux, prototipo, lottie, landing, decisao]
---

# 🧩 Fluxo de entrada completo no protótipo + prompt da LP

> Flow longo: fechamos o **fluxo de entrada inteiro** do app em HTML+Tailwind (throwaway) e geramos o **prompt da landing page**. Segue [[2026-07-12-fluxo-entrada-prototipo]] (que travou a arquitetura); aqui é a execução visual.

## Telas montadas (`ux-ui/prototipo/`)
- **`splash.html`** — tela coral cheia, logo **negativa** (símbolo branco + check knockout + wordmark branca) monta rápido (pop + wipe do check), segura ~0,65s e o painel coral **desliza pra cima** revelando o welcome. `reduced-motion` corta seco. Handoff com craft.
- **`welcome.html`** — 3 telas em swipe (scroll-snap) + dots. Cada uma com **Lottie próprio recolorido pra coral** (ícones viraram animação). Copy: "Contador de verdade. Não robô." · "A parte chata é com a gente." · "Sem contabilês. Sem susto no boleto." **Pular removido** (obriga passar). Sem aba Register (cadastro é deferido).
- **`fluxo-entrada.html`** (fork) — headline "Como a gente pode te ajudar? A parte chata fica com a gente." + selo "22 anos de escritório por trás do app." + Abrir/Migrar. Avião (paperplane) preenche o meio. **Logo estático** (decisão A: a marca já anima na splash → não repete a montagem no fork). Botão Abrir → gate.
- **`gate-cnae.html`** — **concierge validador de CNAE**: campo livre "o que você faz?" + chips → IA simulada (dots) → **atendido ✅** (nome humano grande, código discreto) ou **waitlist ⚠️** (regulamentado/fora do foco, captura e-mail). Match por linguagem natural (regex), não busca exata. **CTA secundário "Já sei meu CNAE exato"** → input de código direto. CNAEs reais da whitelist (web 6201-5/02, software 6201-5/01, design 7410, foto 7420, mkt 7319, consultoria 7020, restaurante 5611; waitlist médico 8630/advogado 6911/transporte). Base: [[cnae-atendidos-e-nao-atendidos]].
- **`login.html`** — retorno. Topo escuro com **gradiente ink-900 + glow radial coral** (assinatura visual) + logo negativa + "Bem-vindo de volta.". Card branco arredondado subindo com inputs (e-mail/senha + toggle), lembrar/esqueci, Entrar (coral), social Google/Apple. "Criar conta" → fork (pula o welcome — decisão do Pedro).
- **`fase-0-dados-socio.html`** — wizard etapa 1, barra simples de 4 traços (Lottie stepper testado e **revertido pra barra** por escolha do Pedro).

## Decisões travadas neste flow
- **Splash é o único momento de marca animado; fork entra com logo estático** (opção A — evita animar o logo 2x na mesma sessão).
- **Arquitetura de acesso separada:** primeiro acesso = splash → welcome → fork; retorno = login (nunca vê o welcome). "Criar conta" no login **pula o welcome** e vai direto pro fork (quem clicou já decidiu).
- **Foto real fica pro welcome/prova ("contador de verdade"), não pro login** (login = sóbrio, alta frequência, velocidade > hero).
- **Régua de layout sem scroll:** moldura `h-[100dvh]` + `overflow-hidden`; **`min-h-0` em TODA a cadeia flex**; um elemento `flex-1` absorve a sobra (o Lottie/avião encolhe — rubber-band). `dvh`, nunca `vh`.
- **Lottie recolorido = trivial** quando se tem o `.json`: trocar as cores de marca (fills + effects Color Control) por coral; servir `lottie.min.js` + `*-legalizai-story-book.json` locais. Na pane do Claude o tab roda offscreen e congela o rAF → **driver manual** (`setInterval`+`goToAndStop`); no app real (RN, `lottie-react-native`) autoplay nativo. Ver [[legalize-prototipo-ux]].

## Landing page — prompt gerado
Prompt sênior de **LP de alta conversão** pronto pra colar no **Fable** (janela limpa): validador de CNAE interativo (mesma lógica do app, dados reais), diferenciais reais, tom de voz travado, paleta+Sora+logo+gradiente, 4 Lottie por dobra, conversão pra **download App Store/Google Play**, **tudo local** (sem backend, lógica client-side). LP ainda **não construída**.

## Aberto
- Nomear as **4 etapas do wizard Fase 0** (só "Etapa 1 · Seus dados" está travada; 2-4 sem rótulo).
- Construir a LP no Fable.
- Provider da API de cartão CNPJ (dev — InfoSimples/CNPJá).

## Links
- [[2026-07-12-fluxo-entrada-prototipo]] · [[legalize-prototipo-ux]] · [[cnae-atendidos-e-nao-atendidos]] · [[paleta-cores]] · [[decisoes-marca]] · [[HOME]]
