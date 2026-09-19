---
name: legalize-agente-whatsapp-vault-isolado
description: "Vault do Leo em execucao/agente-whatsapp-vault/ e FONTE-VERDADE (19/09): SOUL + 4 skills + 13 notas + _testes/. Os 1332 CNAEs ficam FORA do RAG e viram tool com gate por confianca"
metadata:
  node_type: memory
  type: project
  originSessionId: 115ac965-35bf-4b2f-9442-7203ca25be16
  modified: 2026-09-19T15:06:34.072Z
---

O agente de WhatsApp (Léo) roda em **Ollama** (`gemma4:31b` em produção desde 18/09) com carregamento sob demanda via `skill_view` — que **existe e funciona**, 1.525 chamadas medidas. Só o `SOUL.md` e o `description` de cada skill ficam sempre no contexto.

🔴 **Desde 19/09 a fonte-verdade é `execucao/agente-whatsapp-vault/` no repo**, e o que roda no VPS é cópia. Antes disso eram **duas cópias divergindo**: a do repo estava 3,5× menor e sem o `06-CALCULO-FISCAL`, que nem existia lá.

Estrutura: `00-SOUL-personalidade.md` + `skills-legalizai/` (`atendimento` · `vendas` · `escalacao` · `base-legalizai/references/00..12`) + `_testes/casos.yaml`. **⬆ só `SOUL` e `skills-legalizai/` sobem pro VPS; ⬇ `_testes/` e os README ficam no repo** — a bateria mede o agente, não é lida por ele. ⚠️ O slot `06` foi reciclado: era `REGRAS-ORGAOS-PUBLICOS` (fundido no `03` em 04/09), é `CALCULO-FISCAL` desde 17/09.

**Doutrina dos CNAEs (mantida):** os 1332 da `pesquisa/cnae-matriz/cnae-matriz.json` **não entram no vault como lista**. Viram ferramenta `consultar_cnae(codigo | termo)` com gate por confiança. 🔴 **A tool segue não implementada**, e o `11` já tem o modo degradado escrito. Motivo original, que continua valendo: código vizinho (`6201-5/01` × `6201-5/02`) é quase idêntico para busca semântica e muda a resposta fiscal; e confiança é regra de decisão, não texto recuperável.

**How to apply:** número que o bot diz precisa existir no vault principal (preço em `financeiro/estado-atual.md`, fiscal em `app/src/lib/fiscal.ts`) e **em uma nota só** — ver [[legalize-numero-no-prompt-mata-consulta]], que é a regra mais importante daqui. Erros que voltam fácil: certificado digital é **incluso no ME e inexistente no MEI** (e por isso não entra na justificativa da fidelidade do MEI, defeito corrigido em 19/09), valor do DAS-MEI **não é ratificado** (não citar), a revisão é **pós-pagamento** e a taxa da Junta é paga depois, e "sem letra miúda"/"incondicional" são proibidos como promessa. Regra nova **nasce com caso de teste no mesmo commit**: a bateria tinha 51 casos e nenhum de fidelidade/cancelamento/garantia, e foi por isso que o defeito só apareceu quando um humano perguntou no WhatsApp (58 casos desde 19/09).

🔴 **Quatro pendências de runtime, do dev, que documento nenhum resolve:** `USER.md` injeta o perfil do Pedro em toda conversa de cliente (vazamento entre conversas); `_SKILL_VIEW_PRUNE_MIN_CHARS` em 5.000 com 7 das 13 notas acima disso (nota longa some do histórico em conversa longa); falta roteador determinístico que force a nota certa; e há **4.859 chars de diretivas do Google** no prompt de um modelo Ollama. A **cota free do Ollama estourou em 19/09** e self-host morreu nas duas máquinas (VPS sem GPU; notebook com RTX 3050 de 6 GB não comporta os candidatos). Personalidade completa não mora aqui, ver [[legalize-leo-personalidade-4-copias]].
