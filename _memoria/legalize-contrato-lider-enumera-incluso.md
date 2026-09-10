---
name: legalize-contrato-lider-enumera-incluso
description: "Contrato integral da Contabilizei lido 10/09 — enumera o incluso em listas fechadas, joga o avulso pra fora do instrumento, e a ECD aparece nos dois lados."
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-10T12:00:00.292Z
---

10/09/2026. O contrato da Contabilizei foi lido **inteiro** na conta paga do Pedro: `sistema/#/configuracao/contrato`, 74.700 caracteres, **11 clausulas + 3 anexos**, assinado 14/07/2026. Evidencia completa em `produto/evidencias/2026-09-10-contabilizei-contrato-integral.md`.

**A resposta da pergunta que abriu o flow:**
- **Enumera o incluso**, em listas fechadas: `4.1` (abertura) · **`4.2` "NAO ESTAO INCLUSOS"** (lista de exclusao nominal, 6 alineas) · `5.2` (software, 9 alineas) · `5.3` (contabil, 3 alineas).
- **Nao enumera o avulso**: `1.8` e `5.4` remetem "a plataforma". 🔴 E a remissao da `5.4` esta **quebrada** — manda pro "Anexo I", que e *Termos dos Planos Experts* e nao tem tabela de servico nem de preco.
- 🔥 **A ECD esta nos dois lados**: incluida por contrato na `5.3-a` e vendida na loja a-la-carte por R$197,90.

**Why:** eu tinha registrado em 09/09 que "a fronteira entre o incluso e o cobrado nao esta dita em lugar nenhum". Estava errado por metade — ela **esta dita**, com nome e letra; e a loja que a contraria. E a captura de 27/08, feita por print de funil, nao tinha a clausula 1, que era exatamente onde a resposta morava.

**How to apply:** regra que nasce pro NOSSO contrato — **item que aparece na lista de incluso nao pode existir na loja**, e isso e checavel por teste contra `produto/_catalogo.md`. 🟢 Copiar a tecnica da `4.2` (exclusao nominal) e o **"Ver resumo do contrato"** deles, que e produto e nao juridico. 🔴 A `7.6` (desconto promocional recuperavel no cancelamento) morde a promo de R$79 e pede decisao.

⚠️ **Ponto cego confessado:** o contrato estava a dois cliques dentro da conta, em aba dedicada, o tempo todo. A varredura de **§7 Plano e cobranca**, parada em 38%, teria achado — e continua sendo o item 1 da fila.

Correcoes de registro que sairam junto: a tabela de faixas do **Padrao** e 195/344/522/818 (**4 faixas**); a de 6 faixas (139/228/406/584/673/762) e do **Basico**. O plano R$195 **exclui funcionarios por design**, e a `11.5-c` recusa cliente com +20 empregados. O cancelamento tem **aviso previo de 30 dias**, alem da multa de 30%.

Relacionado: [[legalize-contrato-lider-achados]] · [[legalize-entidades-duas-empresas]] · [[legalize-portal-lista-consolidada]] · [[legalize-metodo-teardown-funcionalidade]]
