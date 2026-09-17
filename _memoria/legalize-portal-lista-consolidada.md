---
name: legalize-portal-lista-consolidada
description: "08/09: produto/me/viver/_catalogo.md (movida em 09/09) é a lista única do portal ME/Simples — 51 funcionalidades, 31 construídas; consolida dossiê + baldes + telas"
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-09T11:44:57.691Z
---

`produto/me/viver/_catalogo.md` (movida em 09/09; o caminho antigo virou redirecionador) é a **lista única** do que o app
entrega no dia-2 (portal pós-abertura), escopo **ME no Simples**. MEI fica de
fora de propósito e entra em rodada própria.

Ela **consolida, não substitui**: o teardown da Contabilizei
(`2026-07-21-dossie-plataforma-logada`, ~85% de cobertura), os 3 baldes de
monetização (`cruzamento-portal-interno`, 22/07), as telas P0–P14
(`matriz-portal-interno`) e o que virou tela (`2026-07-27-portal-completo`).

**Placar: 51 funcionalidades — 31 construídas, 5 parciais, 10 inexistentes.**
(⚠️ o primeiro placar dizia 47, por erro meu de contagem. Conferir com script,
não no olho.)

**O que a consolidação revelou, e é o mais importante:**
- Duas decisões de 27/07 **contradizem** a spec de 22/07 e ninguém tinha
  reconciliado. A maior: **"pagar o DAS pelo app" era o diferencial nº 1** do
  dossiê e deixou de existir quando decidimos não intermediar pagamento. O gap
  que a gente ataca virou **"saber que foi pago sem perguntar"** (item 2.4), e
  esse item **não tem caminho decidido** — é o buraco nº 1.
- **§2, 3, 4 e 5 concentram 32 das 51** e 9 dos 11 buracos. Dentro deles: §4
  (pró-labore) é o diferencial-âncora e já está pronto; §2 tem o maior buraco;
  §3 é o mais dependente de terceiro; §5 sai quase de graça se o motor existir.
- O item **6.4 (declaração de faturamento pra abrir conta PJ)** está como
  vendável copiando o R$68,90 do líder. É dor do dia-1 do nosso ICP, e cobrar
  por isso é o que a gente critica neles. **Candidato a virar core.**

**How to apply:** ler antes de discutir escopo do portal, e ler junto a matriz
de dependência externa que vive no mesmo arquivo
([[legalize-api-antes-de-funcionalidade]]). Tudo que está "construído" é
**mockup**: nenhuma tela tem backend.
