---
name: legalize-doc-do-agente-envelhece-calada
description: 25/09 - o banco do Leo mudou e a doc dele ficou em 04/09; campo inexistente numa regra vira condicao insatisfazivel e o agente improvisa.
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-25T03:18:37.454Z
---

Quando o schema que o Léo consulta muda, a **documentação que ensina a ler o retorno não quebra: ela mente em silêncio.** Medido em 25/09, no pente fino que o Pedro pediu (*"as tabelas estão boas, não quero ajustar CNAE por CNAE"* — ele estava certo nos dois pontos).

O `11-COMO-CONSULTAR-CNAE` descrevia **9 campos de retorno e sobrava um** em comum com o real (`codigo`). E a regra de decisão dele exigia `anexo_fator_r_confianca = alta`, campo que não volta: **condição insatisfazível**. O agente não erra com erro, ele cai no encaminhamento ou improvisa, raciocinando com `III-fixo` e `requer-revisao`, vocabulário morto. Era a raiz do delírio de Fator R.

🔴 **O erro mais caro foi uma contradição entre dois documentos, e ganhou o que fecha a venda.** O `RULES.md` mandava recusar com `[FORA_ESCOPO]` quando `casa_atende_mei` fosse false; o `tools-def.ts` dizia explicitamente o contrário. **36 dos 87 CNAEs atendidos têm `casa_atende_mei: false`** — desenvolvimento de software, web design, produção de vídeo, estúdio de gravação. O miolo do nicho.

E 7 campos novos (`motivo_nao_atende`, `familia`, `achou_por`, `semelhanca`, `anexo_inciso`, `titulo_oficial`, `pode_afirmar_anexo`) existiam em **zero** documentos: `grep` nas 13 notas mais `RULES` e `PERSONA` deu 0. O agente recebia `exige-alvara-previo` no payload e nada dizia o que fazer com ele.

**Why:** a trava de carga confere **quantidade** (55 cartões, 102 trechos) e o parser confere **forma**. Nenhum dos dois confere se o que a nota afirma sobre o banco ainda é verdade. Refatura de schema é mudança de contrato, e o contrato tem dois lados.

**How to apply:** ao renomear coluna ou mudar o retorno de uma função que o agente consulta, o `grep` do nome **velho** em `_origem/vault-v12/` + `RULES.md` + `PERSONA.md` + `tools-def.ts` entra no mesmo commit. E o teste mais barato de doc do agente é procurar, em cada regra condicional, se o campo que ela cita existe no retorno — campo inexistente numa condição não falha, congela.

⚠️ Conferir também a direção contrária: campo novo que **nenhum** documento menciona. Esse não trava nada e simplesmente não é usado. Ver [[legalize-busca-cnae-tres-camadas]] e [[legalize-numero-no-prompt-mata-consulta]].
