---
tipo: marco
status: vivo
data: 2026-08-27
area: produto
impacto: alto
tempo-gasto: 1 dia
tags: [mei, obrigacoes, funcionalidades, portal, api, infosimples, drift]
---

# MEI: obrigações operacionais fechadas + 1º mapeamento de funcionalidades + drift do portal

Sessão em 3 blocos encadeados: (1) pesquisar o que o MEI tem de obrigação depois de aberto; (2) transformar isso em mapa de funcionalidade do app, com dependência de API explícita; (3) checar se o portal (telas internas) já dá conta — não dá.

## Bloco 1 — obrigações operacionais do MEI (pesquisa fechada)

Duas rodadas independentes cruzadas: pesquisa própria (WebSearch/WebFetch, 3 frentes em paralelo) + pesquisa Gemini rodada pelo Pedro (doutrina padrão do vault pra pesquisa grande). Resultado em [[mei-obrigacoes-operacionais]] (`tipo: verdade`), 7 seções, cada fato com fonte e confiança marcada.

**Os 2 achados que mais mexem com produto:**

1. 🎯 **NFS-e Nacional é obrigatória pro MEI desde 01/09/2023**, via API federal única (gov.br/nfse), sem certificado digital, municípios **proibidos** de manter emissão local. BH confirmado (Portaria SMFA 042/2023 bloqueou o BHISS). Isso simplifica MUITO o emissor: não precisa integração por prefeitura, é uma API só.
2. 🎯 **Não existe nenhuma ferramenta oficial de monitoramento do teto de faturamento do MEI.** É manual, sem alerta de proximidade. Confirmado nas duas rodadas. Vira o diferencial mais forte do portal MEI.

Coberto também: DAS-MEI (composição/vencimento/atraso), Relatório Mensal de Receitas Brutas, DASN-SIMEI (prazo/multa/inaptidão em 90 dias), regra dos 20% de excesso com as faixas exatas, MEI-empregador completo (CPP 3%, eSocial Web MEI, FGTS Digital, DAE dia 20, SST), e uma seção 7 de base compartilhada pro ME (reaproveitada quando entrarmos nessa fase, sem pesquisar do zero).

**Investigação extra do bloco anterior (CNAE):** os 5 CNAEs com `exige_registro_setorial` não-verificado foram investigados em fonte primária. Certeza caiu de **90 → 87 ME** (53 → 51 MEI). Taxonomia de pills caiu de 15 → 14 categorias.

## Bloco 2 — 1º mapeamento oficial de funcionalidades do app pro MEI

[[mei-mapeamento-funcionalidades]] deixou de ser rascunho e virou o mapeamento formal: **14 funcionalidades**, cada uma classificada 🔴 imprescindível × 🟡 sugestão, com justificativa e — o eixo que o Pedro pediu — **dependência explícita: órgão externo (qual?) × só ajuste interno nosso**.

Depois disso, o catálogo do InfoSimples foi checado ponto a ponto (https://infosimples.com/consultas/), porque o Pedro lembrou que já usamos eles. **Achado central: quase tudo lá é CONSULTA (read-only), não emissão/transmissão.**

| O que resolve | O que NÃO resolve |
|---|---|
| Consulta de CNPJ/situação fiscal, MEI/Simples cadastral, status da DASN-SIMEI, DAS-MEI (RPA que puxa boleto), guia de parcelamento, FGTS/Guia de Arrecadação, NFS-e por chave de acesso | **Emissão de NFS-e nova** (só consulta — emitir exige API oficial gov.br/nfse direta, com mTLS+ICP-Brasil, ou parceiro tipo Focus NFe) · **eSocial** (zero cobertura, Dataprev descontinuou a consulta) · **Transmitir** DASN-SIMEI (nem InfoSimples nem API oficial) |

Detalhe operacional importante: boa parte das consultas InfoSimples que envolvem RPA (DAS-MEI, FGTS) **exige credencial do próprio cliente** (CPF+senha gov.br ou certificado pkcs12). Não é "puxar de graça sem o cliente" — ele precisa autorizar/ceder acesso. URLs e parâmetros de cada endpoint ficaram salvos no doc pra não repesquisar.

## Bloco 3 — o portal (telas internas) tem flow salvo, mas está defasado

Pergunta do Pedro: temos o flow das telas internas igual ao flow de entrada? **Temos, e é simétrico** — `execucao/portal/portal-data.mjs` + `gerar-mapa-portal.mjs` → `execucao/mapa-portal-mermaid.md`, 36 nós, nomenclatura P do ADR de 03/08. Diferença de natureza: entrada é linear, portal é grafo de navegação (4 abas + CTA central + drill-downs).

**Mas 3 problemas achados:**

1. **O mapa do portal congelou em 28/07** (o flow de entrada é de 27/08). Um mês de defasagem.
2. **A variante Plano MEI existe no CÓDIGO desde 04/08 e não está no mapa.** No código já tem: `layout.tsx` esconde a aba Impostos pro MEI · `inicio` tem `FOCO_MEI` (DAS fixo, sem Fator R) · `mais` troca o PlanoCard · `/mais/colaborador` (tela exclusiva MEI). `portal-data.mjs` tem **zero menção a MEI**. O próprio gerador acusou o drift de `/mais/colaborador` ao rodar.
3. **O portal foi desenhado pra ME/Simples e a pesquisa MEI não entrou em nada.** Choque direto: P-MAIS11 Declarações = PGDAS-D + DEFIS (MEI não tem nenhuma das duas, tem DASN-SIMEI) · P-IMP3 Alíquota efetiva + Fator R (não existe pro MEI, DAS é fixo) · P-GER2 Pró-labore (MEI não tem pró-labore, tem retirada de lucro 8%/32%). E das 14 funcionalidades mapeadas, **4 imprescindíveis não têm tela nenhuma**: Relatório Mensal, Monitor de teto, assistente DASN-SIMEI, calculadora de retirada.

## O que fica aberto

**Decisões de produto (4, esperando o Pedro):**
1. Monitor de teto — V1 ou fase 2?
2. Módulo de folha MEI-empregador — vale UI se, sem API de eSocial, tudo vira orientação manual?
3. Emissor de NF — credenciamento direto nosso no gov.br/nfse, ou parceiro pronto (Focus NFe/Nota Gateway)? Decide custo e prazo do V1.
4. DASN-SIMEI — aceita transmissão manual (cliente faz no portal, confirma no app), ou investigar procuração eletrônica e-CAC?

**Dívida técnica de documentação:**
- `portal-data.mjs` precisa absorver a variante MEI de 04/08 + a tela `/mais/colaborador`.
- Depois disso, as funcionalidades MEI novas precisam entrar como nós planejados.

**Frente seguinte já nomeada pelo Pedro:** pesquisa sobre **abertura de MEI** (tem API? se não tem, qual o flow de constituição validado por órgão?) pra depois cruzar com o flow de entrada atual e adaptá-lo pra atender quem quer abrir MEI do mesmo jeito que hoje abre ME.

**Pendências menores parqueadas** (já registradas em [[mei-obrigacoes-operacionais]]): tabela exata NR-05 (CIPA por headcount × grau de risco, só relevante na fase ME) · teto de custo do exame periódico do MEI-empregador · mecanismo exato do cruzamento e-Financeira × NFS-e que dispara desenquadramento de ofício.

## Links
- [[mei-obrigacoes-operacionais]] · [[mei-mapeamento-funcionalidades]] · [[resultado-pesquisa-mei-obrigacoes-28-08]] · [[estado-atual-obrigacoes-operacionais]]
- `execucao/portal/portal-data.mjs` · `execucao/mapa-portal-mermaid.md`
- Commits: `322b424` (pesquisa) · `1484f2a` (mapeamento + InfoSimples) · `730f20b` (URLs dos endpoints) · `36c4ca7` (drift do portal)
