---
name: legalize-agente-whatsapp-vault-isolado
description: "04/09: vault isolado do agente de WhatsApp em execucao/agente-whatsapp-vault/ (12 arquivos); doutrina travada de que os 1332 CNAEs ficam FORA do RAG e viram tool com gate por confiança"
metadata: 
  node_type: memory
  type: project
  originSessionId: 115ac965-35bf-4b2f-9442-7203ca25be16
  modified: 2026-09-04T12:25:18.261Z
---

O agente de WhatsApp (Léo) lê **só** `execucao/agente-whatsapp-vault/` (12 arquivos, `README.md` tem a ordem de leitura). Montado pelo Gemini em 03/09, auditado e corrigido aqui em 04/09.

**Doutrina travada sobre os CNAEs:** os 1332 da `pesquisa/cnae-matriz/cnae-matriz.json` **não entram no vault como CSV**. Viram ferramenta `consultar_cnae(codigo | termo)` com gate por confiança: só `anexo_fator_r_confianca: alta` (118 dos 1332) autoriza o bot a afirmar anexo/elegibilidade; `media` (452), `baixa` (62), vazio (700), `requer-revisao` (62) e `exige_conselho` (39) devolvem `escalar: true` e vão pro contador. Spec em `11-COMO-CONSULTAR-CNAE.md`; **a tool não existe implementada**.

**Why:** dois motivos medidos, não estéticos. (1) código vizinho (`6201-5/01` × `6201-5/02`) é quase idêntico pra busca semântica e muda a resposta fiscal, mesmo bug de um dígito que o `dossie/mock.ts` nasceu pra matar; (2) a matriz carrega grau de confiança por linha, e confiança é regra de decisão, não texto recuperável.

**How to apply:** número que o bot diz precisa existir no vault principal (preço em `financeiro/estado-atual.md` e `app/src/lib/fiscal.ts`). Erros que a auditoria pegou e que voltam fácil: certificado digital é **incluso no ME** e **inexistente no MEI** (28/08), valor do DAS-MEI **não é ratificado** (não citar), a revisão é **pós-pagamento** e a taxa da Junta é paga **depois**, na `/guia`, e "sem letra miúda"/"incondicional" são proibidos como promessa. Lacunas que faltavam e agora estão em `09-ESCOPO-E-LIMITES`: gate BH (CEP 30000-000 a 31999-999), só serviço, até 4 sócios. Personalidade completa NÃO mora aqui, ver [[legalize-leo-personalidade-4-copias]].
