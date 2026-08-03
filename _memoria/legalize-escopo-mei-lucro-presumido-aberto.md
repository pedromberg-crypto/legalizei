---
name: legalize-escopo-mei-lucro-presumido-aberto
description: Pergunta em aberto (não confirmada) — MEI entra no MVP? Lucro Presumido vira feature confirmada?
metadata:
  node_type: memory
  type: project
  modified: 2026-08-03T00:00:00.000Z
---

03/08: Pedro pediu lista do que o app atende na área contábil e disse de passagem "atenderemos MEI e ME no Simples no início, com feature pra Lucro Presumido" — mas **não confirmou** quando eu apontei que isso mexe em 2 decisões já documentadas. Ficou em aberto, ele não respondeu (perguntou sobre permission modes do Claude Code em vez disso). **Não presumir a resposta na próxima janela — perguntar de novo.**

**MEI:** há decisão TRAVADA 🟢 em 08/07 (`BASE-ESTRATEGICA.md`, log de sessão): "ICP mantido = seguir o líder: ME serviço/Simples, MEI fora do foco". O §1 do mesmo doc (definição de produto, não atualizada) ainda diz "MEI/ME" — resíduo textual, não decisão viva. Se Pedro confirmar que MEI entra, isso REVERTE a decisão de 08/07 e precisa de ADR novo em [[decisoes-marca]].

**Lucro Presumido:** não é ideia nova — já estava em `execucao/parking-lot.md` (item I, 15/07) como "provocação, vale medir esforço de suporte, MVP segue só Simples por ora". Também aparece em `compilado-ux-flow.md`/`kanban-legalizei.md` (UX-42, cotar LP como alternativa pra bloqueados). Se Pedro confirmar, isso PROMOVE o item de parking-lot pra feature roadmap confirmada, não mais "considerar".

Lista do que o app atende hoje na área contábil (levantada nessa mesma pergunta, sem contradição): abertura de CNPJ · enquadramento tributário/Fator R · monitoramento de alíquota · cálculo+emissão de guia DAS · emissão de NFS-e · certificado A1 (via parceiro) · pró-labore (cálculo+otimização) · declarações/obrigações acessórias · "você está em dia" · migração de contador · contador responsável/CRC por trás.

Relacionado: [[legalize-mvp-so-servico-cnae]] · [[legalize-objetivo-e-papel-pedro]].
