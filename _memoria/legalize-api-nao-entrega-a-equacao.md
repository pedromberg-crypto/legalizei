---
name: legalize-api-nao-entrega-a-equacao
description: "14/09 - a tela de Relatorios do lider e leitor de resultado, nao motor. A API da arquitetura, nunca a conta. Equacao vem do recibo + lei + Mauro."
metadata: 
  node_type: memory
  type: project
  originSessionId: 87dc1fb6-b901-4b6e-bcf0-54565a6c2bc6
  modified: 2026-09-14T15:27:35.487Z
---

Varri a camada HTTP inteira das abas Declaracoes Mensais, Anuais e Informe de Rendimentos da conta real do Pedro (14/09/2026). **Nao existe endpoint de calculo do DAS/PGDAS, nem de memoria de calculo, nem de serie multi-mes.** Selecionar socio no dropdown e clicar "Pre-visualizar" nao disparam chamada nenhuma: tudo vem no load. O calculo e lote server-side, o que bate com as transmissoes de madrugada.

**Why:** o Pedro travou a regra de sempre capturar endpoints (*"e nessa varredura mais profunda que extraimos os formatos dos calculos e equacoes e quando sao feitos, isso e ouro"*) — e esta varredura mostra ate onde o ouro vai. A API entrega **arquitetura** (as 21 feature flags por CNPJ, o caminho deterministico do recibo no bucket `contabilizei-obrigacoes-prod`, o `{ano}` que e exercicio e nao ano-calendario). Ela **nao entrega a conta**.

**How to apply:** parar de procurar a equacao fiscal em engenharia reversa de API do lider. Ela sai de tres lugares: o **PDF do recibo oficial** (foi assim que o arredondamento por tributo apareceu, ver [[legalize-motor-fiscal-arredonda-por-tributo]]), a **lei**, e o **Mauro**. Varredura de API continua valendo para descobrir como o produto deles e **montado** — nunca para descobrir como o imposto e **calculado**. Rota parametrizada (`/declaracao/mensal/declaracoes/{mes}/{ano}`) se chama direto por competencia em vez de navegar a UI.

⚠️ Mesma rodada teve a **4a vez** que li modal escondido no DOM como estado de tela (achei que o Informe estava bloqueado; nao estava). Ver [[legalize-metodo-teardown-funcionalidade]] — medir o que a TELA mostra, nao o que o DOM contem.
