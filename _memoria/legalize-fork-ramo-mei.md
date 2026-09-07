---
name: legalize-fork-ramo-mei
description: "07/09 — MEI virou caminho próprio (/mei/*, components/mei/, lib/mei-flow.ts) com trava de fronteira; herança por prop `mei` tinha causado 4 defeitos em 8 dias."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6cedebf8-360c-4764-9714-bcae0a36d009
  modified: 2026-09-07T04:45:23.053Z
---

O ramo MEI deixou de morar dentro das telas do ME. Rotas próprias sob `/mei/*` (route group `(mei)`), componentes em `app/src/components/mei/`, espinha declarada em `app/src/lib/mei-flow.ts`. Ponto de contato único: o fork no E3.2 (`(wizard)/entrada/page.tsx`), de mão única.

**Why:** o arranjo antigo (uma prop `mei` dentro dos componentes do ME) fez o MEI herdar 4 defeitos entre 30/08 e 05/09 **sem ninguém mexer nele** — o contrato morreu junto com o E8; o termo morreu junto com a A2 e o MEI passou a cair numa tela de viabilidade extinta pro MEI; o status virou "fase Junta"; e os splashes de pagamento nunca chegaram. Nenhum foi erro de quem mexeu no ME.

**How to apply:**
- Mudança de conteúdo do MEI vai em `components/mei/`. `components/mei-telas.tsx` está aposentado (header diz isso) e espera remoção junto com 3 rotas órfãs — o que exige tocar em `(wizard)/gate`, e por isso ficou como decisão isolada.
- `node execucao/flow/verificar-fronteira-mei.mjs [--diff]` responde se os ramos se tocaram. Allowlist de import: só `@/components/ui/`, `@/components/mei/`, `@/lib/`, `splash-mensagem` e `lottie`. `/apresentacao`, `/mapa`, `/mockup` são exceção declarada (superfícies de revisão).
- Voltar e `meta` NÃO se escrevem à mão: `anterior()` e `metaDoVoltar()` derivam da espinha. Sobrescrita só explícita e escrita (a M7 não volta pra tela de pagamento já paga).
- ⚠️ Na `/apresentacao` o prefixo de momento `m-` é do **MIGRAR** (`m-cnpj`, `m-plano`, `m-contrato`). O ramo MEI usa `mei-`, e o teste de pertencimento é `etapa.startsWith("mei-")` — tela nova entra sozinha. A colisão já aconteceu uma vez (07/09, `m-plano`/`m-pagamento` duplicados). Ver [[legalize-metodo-alteracao-tela-travado]] e [[legalize-espelho-mapa-apresentacao]].
- Removidas em 07/09: `mei-telas.tsx`, `(app)/dossie/ocupacao`, `(wizard)/saida/mei-*`, o ramo MEI do `(wizard)/gate` e o `(app)/painel` inteiro (era só redirect + pipeline MEI). `PainelView` segue vivo pro migrar e pra `/painel/recusa`.
- Aberto de negócio: a fidelidade de 12 meses do MEI segue sem contrapartida escrita desde que o certificado saiu do plano (28/08). Decisão Pedro/Mauro.
