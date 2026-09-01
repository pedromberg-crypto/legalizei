---
name: legalize-escopo-so-me-abrir
description: "01/09 — escopo de trabalho é só o flow ME \"abrir empresa\"; MEI e Migração não se toca sem pedido explícito."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30062edd-3fc7-4585-8e46-701476cb9321
  modified: 2026-09-01T13:32:27.636Z
---

**O escopo padrão de qualquer alteração é o flow ME "abrir empresa".** MEI e Migração ficam de fora, mesmo quando a mudança "caberia" lá também. Pedido do Pedro em 01/09: *"não quero tocar nesse momento em NADA de MEI e nem de migração de empresa"*.

**Why:** são 3 pipelines com regras jurídicas diferentes (o MEI nem passa pela Junta), e mexer nos três ao mesmo tempo mistura decisões que ele quer tomar separadas.

**How to apply:** quando a tela é COMPARTILHADA (mesmo componente serve ME e MEI — `SocioView`, `EmpresaView`, `ContaView`, `FaixaView`, `PagamentoView`, `AguardandoView`), a mudança precisa ser **guardada por regime** (`mei ? ... : ...`) pra não vazar pro outro ramo. Se não der pra guardar — como na eliminação da A2, que era a mesma tela pros dois — **avisar antes**, porque aí a mudança inevitavelmente atinge o MEI.

Regra escrita em `CLAUDE.md` do projeto (§Regras de trabalho). Relacionado: [[legalize-nao-rodar-e2e-sem-pedir]], [[legalize-escopo-mei-lucro-presumido-aberto]].
