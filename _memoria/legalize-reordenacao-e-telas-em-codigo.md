---
name: legalize-reordenacao-e-telas-em-codigo
description: A ordem do flow inverteu (cobra no N9, nao no T16) e as telas nascem DIRETO EM CODIGO (app/ Next 16 + Tailwind 4), sem Figma. As 2 farol (N4 gate, N18 simulador) ja rodam. Review em /mockup.
metadata:
  node_type: memory
  type: project
---

**Decisões estruturais de 2026-07-16 que mudam como se trabalha daqui pra frente.**

## A ordem do flow inverteu
Cobra no **N9** (logo após gate + teaser), não mais no T16 depois de 15 telas. Telas
**N1–N25**. O B2 inteiro virou flow **interno, logado e pago**.
- **N1–N9 = fora do app** (wizard: modo fullscreen, sem nav, **sem pausa** — só anda se o
  usuário andar). **N10+ = a casa.** A fronteira é o pagamento.
- **O T18 rachou:** aceite do contrato (**N8**, reversível, CDC art.49) × termo irreversível
  (**N20**, onde a máquina liga e o dinheiro de governo sai).
- Fonte: [[reordenacao-flow-cobranca-cedo]]. Mapa **T→N** em [[indice-autoridade]] — a numeração
  velha (T1–T23) aparece em ~8 docs e **não vai ser reescrita**; traduza pelo mapa.

## As telas nascem em CÓDIGO, não no Figma
Decisão do Pedro (designer 10+ anos): *"vou fazer por aqui mesmo, me pareceu mais confortável"*.
- App em **`app/`** — Next 16 + Tailwind 4, **local** (repo/Vercel = decisão dele, depois).
- **Já rodam:** `/gate` (N4) e `/simulador` (N18) — as 2 telas-farol, uma de cada shell.
- **Review em `localhost:3000/mockup`** (moldura de iPhone, viewport real 375×812, as telas em
  iframe). Sem prancha, essa rota **é** a ferramenta de review.
- `npm run dev` em `app/`.

**Por que importa:** elimina a ponte Figma→código, onde o DS costuma vazar. O token é a **única**
forma de escrever a tela.

## O atrito mecânico (a peça mais importante do DS)
Em `app/src/app/globals.css`, os **primitivos** de cor ficam em `:root` e **NÃO entram no
`@theme`** — logo o Tailwind **não gera classe** pra eles. **`bg-coral-500` não existe.**
A regra "nenhuma tela toca primitivo" deixou de ser disciplina e virou **física**.
*Governança solo é mecânica, não social: ninguém revisa o Pedro às 23h de uma sexta.*
→ [[design-system]] §4

## Regras de construção travadas
- **Fundação larga, componente estreito.** Critério: *"decidir sem conhecer o portal é aposta?"*
- **Regra dos 3:** só promove ao DS o que aparece nas **2** farol. Aparecendo em 1, fica local e
  espera a 3ª ocorrência. (Hoje: só `Button` e `Card` promovidos.)
- **O protótipo (`ux-ui/prototipo/`) é COLHIDO, não portado.** Migra decisão, não arquivo.
  Achado: **"CTA colado no rodapé" não é gosto, é thumb zone.**
- **`text-body` = 16px** (decisão do Pedro; eu propus 17). Consequência: a acessibilidade do
  UX-12 passa a depender **inteiramente da fonte ampliável**. Se a `cida` reclamar de leitura
  numa rodada futura, **o suspeito é esse número**.

## Próximo passo
Construir **N1–N9** (o funil, que decide o negócio). Depois o B2 (N10–N20).

Ver também: [[legalize-motor-testes-arquitetura]] (v0.4.0, 19 personas) ·
[[legalize-preco-deferido-custo-real]] · [[indice-autoridade]].
