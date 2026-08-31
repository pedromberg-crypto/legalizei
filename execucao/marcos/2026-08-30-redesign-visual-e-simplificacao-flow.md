---
tipo: marco
data: 2026-08-30
status: registrado-retroativamente
---
# 2026-08-30 — Redesign visual (mockup-v2 → produção) + simplificação do flow (E8 morre, estados escondidos revelados)

> ⚠️ Registro retroativo (31/08): o trabalho aconteceu em sessões de código de 28-30/08 (8 commits, `d323b81`→`6afe33e`) que não passaram por `/fechar`. Este marco reconstrói decisões e entregas a partir dos commits.

## 1. Frente de redesign visual — `/mockup-v2` como laboratório

- **`/mockup-v2` ganhou a seção "Aplicação da referência"**: a mesma bateria de 4-5 telas reais (N7, C0.1, E3, C1…) reconstruída do zero sob **10 linguagens visuais diferentes** — v1 interior design (`referencia-interior-v1.tsx`, fundo creme, listas agrupadas, anel percentual, nav flutuante) e depois v2-v12: social, petcare, eventos, fintech (2×), analytics (2×), ia, ticketing, callcenter, wallet. Sempre em par claro+escuro, paleta local (não token global). `versao-board.tsx` ganhou `BoardSecaoSolta`/`VersaoSolta` — renderiza view desconectada (sem router) via `MolduraAparelho`, sem duplicar rota real. (`d323b81`, `2f7a177`)
- **`validados.tsx` criado**: galeria dos assets aprovados pelo Pedro que saem do laboratório pra produção.
- **Promovido pra produção** (`2f7a177`, `490b055`):
  - **"Atalhos rápidos (formato pasta)"** — geometria traçada a partir de exports do Illustrator do Pedro (chanfro reto + filete trigonométrico correto, não aproximado) → `ref11-blocks.tsx` (Home Campeã).
  - **Card de vigília fiscal** (alíquota/Fator R) — ícone-em-círculo + fundo cinza neutro + percentuais em destaque.
  - **Fundo branco global**: token `--color-surface-page` de creme → **branco** (app inteiro, incl. previews via iframe do `/mapa`); `--color-surface-alt` vira cinza neutro `F4F4F4`.
  - **Tratamento "escuro com brilho coral"** (radial-gradient sutil sobre `--color-surface-dark`): cartão do DAS (Home Campeã), cards do carrossel de impostos e os 2 heróis da cauda (Retomar/Aguardando boleto) — que fundiram saudação + resumo de progresso num cartão só.
- Fixes menores de E7 no caminho: sombra do card escuro removida (corte persistia sem ganho visual), fade de scroll topo/rodapé herdado do Corpo do DS. (`7865f53`→`fc7cb00`)

## 2. `/mapa` — trilhas por regime + estados escondidos revelados

- **Trilhas por regime** (`d323b81`): 4 CTAs novos na legenda (Abrir/Já tenho empresa × ME/MEI) — clicar acende a trilha em cor e apaga (grayscale+opacity) os NÓS fora dela, não só as linhas. Corte ME×MEI por palavra-inteira no rótulo da aresta (`\bME\b` vs `\bMEI\b` — "ME" é prefixo de "MEI"). Poda por alcançabilidade reversa removida: becos de saída graciosa ficam DENTRO da trilha (são variáveis reais do fluxo).
- **3 estados já existentes mas invisíveis ganharam nó próprio** (`6afe33e`, mapa v50→v51): E3.4.1 (CEP fora de BH), E5T.1 (sócio não se encaixa), E7.1 (endereço fiscal no plano). Na `/apresentacao`: pills novos, atalho "Simular CEP fora de BH", e `enderecoFiscal` finalmente atravessa do E3.4 até o E7 na demo (gap real fechado).
- **2 telas novas**: E5F.1 (splash pós-faixa) e **E9.S (splash pós-pagamento)** + E9.1P (variante paga do E9.1). `SplashMensagemView` novo (`splash-mensagem.tsx`): transitório, auto-avança sozinho; `AguardandoView` ganha prop `pago`. Fix: auto-avanço desligado dentro de iframe (`window.self !== window.top`) — a prévia do `/mapa` mostrava a tela seguinte com rótulo da splash.
- **Mapa foi de v41 → v51** no período (v48/v49 em `9e09e5c`, v50/v51 em `6afe33e`).

## 3. Simplificação estrutural do flow de entrada

- **E8 (`/contrato`) ELIMINADO** (`9e09e5c`): aceite do contrato acontece no ato do pagamento (E9, `PagamentoView`), igual à concorrente. Rota removida, `ContratoView` apagado. → ADR 30/08.
- **"Voltar de onde parei" virou 4ª rota real do fork** (`EntradaView`): fecha o C0_1 (`/retomar`), órfão no mapa até aqui. Nova porta de CPF (`RetomarCpfView`, mock RF-01) decide entre C0_1 (já pago) e E9.1 (aguardando boleto). CTAs do fork restilizados (teste, reversível).
- **Revogado "cartão/Pix pulam direto pro C0"**: todo método de pagamento (ME) passa por splash+status antes de seguir. MEI ficou de fora desta rodada. → ADR 30/08.
- **Saída graciosa sem recaptura** (`931a9db`): nome/e-mail/telefone removidos das 11 telas de saída (`SaidaView` 8 rotas + `VereditoView` waitlist/não-atende) — o lead já veio do E3.1 (`/dados`). Só sobra a pergunta específica de cada saída (`extra`). Estado morto da `/apresentacao` limpo junto. Mesma doutrina do E6 de 27/08 ("dado já digitado se confirma, não se repergunta").

## 4. Telas do wizard — E3.2, welcome, faixa, E6, E7

(`d0eb2b2`)
- **Nova tela E3.2 "MEI ou ME"** (`gate-telas.tsx`), com card ícone-seleção genérico reutilizado em coorte/faixa/regime (ícones próprios coral/creme em `public/icones/`).
- **Welcome (N2) reescrito**: 3 cards foto full-bleed com o Léo — doutrina de render 3D documentada em `marca/identidade-visual/leo-render-3d-doutrina.md`.
- **FaixaView virou grid 2×2 ilustrado** com ícones próprios.
- **E6 (criar conta)**: confirmar senha + força de senha, ícone de celular, timer de reenvio de código (60s) com CTA real.
- **E7 (plano)**: textos soltos removidos, pill verde mais explícita, certificado digital com **comparativo de economia (R$209/ano)** — preço fechado com o Pedro, `CUSTOS.CERTIFICADO_PRECO` sai de `null` → `209` em `fiscal.ts` (→ ADR 30/08); card "O que você adicionou" pro endereço fiscal (ícone 3D glossy azul); colaboradores removidos do bloco de custo de abertura; ícones 3D glossy de teste nos itens de "O que está incluso".

## 5. Infra de teste e mobile

- **PWA real no iPhone**: `manifest.ts`, `allowedDevOrigins`, splash com `onContinuar` real (antes nunca navegava em produção), `apple-touch-icon`.
- **Bateria de fixes de UX achados testando no aparelho**: `TelaHeader.meta` corrigido em várias telas, endereço/categoria reordenado, back-nav no `/gate` (E5) que não existia.
- **Suíte Playwright E2E** (`e2e/abrir-me-ate-conta.spec.ts` + smoke): cobre as 6 variantes do flow abrir-ME até E6. ⚠️ Regra na auto-memória: **não rodar E2E sem pedir** (`_memoria/legalize-nao-rodar-e2e-sem-pedir.md`).

## O que ficou aberto

- 🔴 `next build` **segue quebrado** desde 04/08 (`(portal)/layout.tsx` com `useSearchParams` sem Suspense) — nenhum dos 8 commits tocou nisso.
- 🟡 Splash+status pós-pagamento só cobre ME — decidir se/quando MEI ganha o mesmo tratamento.
- 🟡 CTAs do fork restilizados marcados como "teste, reversível" — validar com o Pedro.
- 🟡 Ícones 3D glossy do E7 são "de teste" (8 variantes de certificado em `public/icones/certificado-*-teste.png`) — escolher o definitivo.
- 🟡 As 10 referências visuais do `/mockup-v2` são exploração — o que mais sobe pra `validados.tsx`/produção é decisão por asset.

## Links
- [[decisoes-marca]] · [[2026-08-28-ramo-mei-construido]] · [[mapa-flow-mermaid]] · [[leo-render-3d-doutrina]] · [[HOME]]
