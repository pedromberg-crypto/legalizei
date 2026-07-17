---
name: legalize-telas-padrao-layout
description: padrão de layout travado do app (título fixo/corpo rola/CTA fixo) + shell height:100dvh + 17 pills N4 + mockup por arquétipo; telas destravadas pra construir
metadata: 
  node_type: memory
  type: project
  originSessionId: 601a6913-bbd4-4193-878a-0bfa86ca2923
---

Padrão de layout do app travado 2026-07-17. Regra dura pra TODA tela do wizard/app:

**3 partes: título+subtítulo FIXOS / corpo ROLA / CTA FIXO.** Toda tela alta precisa de `overflow-y-auto` no corpo (scrollbar escondida no mobile). Aplicado no `/gate` (todas etapas) e `/simulador`.

**Fix de raiz:** `.app-page` (globals.css) virou `height:100dvh` (era `min-height`, que deixava a página crescer e rolar tudo — quebrava o single-scroll no iPhone SE). Com teto real, `flex-1 min-h-0` obriga a região interna a rolar sozinha e o CTA fica na thumb zone.

**N4 (`/gate`):** **17 pills** de reconhecimento (derivadas dos 103 serviço-liso, [[legalize-cnae-complexidade-abertura]]) acima do input; **pill estreita não valida** (afunila pra IA, pessoa ainda descreve). As pills são a região rolável, com **fade-mask dinâmico** (só desbota a ponta com mais) + **input de altura fixa** (não estica; pills absorvem a variação de tela). Decisão do Pedro: granular (17) > enxuto (~6), pra achabilidade.

**`/mockup` = esteira por arquétipo** (A1 Pergunta · A2 Veredito · A3 Número · A7 Espera · A9 Saída); cada um horizontal com clicar-segurar-arrastar (o iframe engole arrasto que começa no vidro → arrasta pela moldura/legenda). N4 em A1, N18 em A3; resto aguardando.

**Estado:** as 2 farol (N4, N18) provadas → **construção das telas destravada**. Próxima janela constrói **por arquétipo, começando pelo A1** (coleta N10–N16, mesmo esqueleto do N4), como mock de alta fidelidade (IA dublada) testável contra as 19 personas. Ver Pedro-confere-UI-sozinho em [[legalize-pedro-confere-ui-sozinho]].
