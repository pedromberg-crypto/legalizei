---
name: legalize-dashboard-adm-priorizacao
description: dashboard de gestão interna do app — 3 abas priorizadas + tabela de marketing + 2 bloqueadores; frente nova aberta 23/07
metadata: 
  node_type: memory
  type: project
  originSessionId: b8216530-8fb5-43da-a7bf-40e46a9a0119
  modified: 2026-07-23T11:53:14.880Z
---

Frente NOVA aberta 23/07: **dashboard de administração** (gestão interna do app, mede funil + demanda). O dev jr levantou 2 `.md` de métricas (`metricas-propostas` das telas UI + `02-Indicadores` do CRM) e fez 1 dash pra cada; **corrigido pra 1 dashboard único**, porque o corte certo não é por documento (o 1º foi escrito pra NÃO duplicar o 2º, linha 5) e sim por **disponibilidade de dado**.

**3 abas:** Funil (conversão/abandono/pós-pagamento/recusa) · Demanda & Mercado (dado de INPUT do gate/dossiê, vivo desde o dia-1) · Ver completo (placeholder até billing recorrente / NFS-e / ticket existirem).

**Cortes:** DAU/MAU removido (wizard é pré-login, não se aplica) · CAC adiado (sem UTM) · conclusão-onboarding funde com conversão-wizard→dossiê · capital social / SLU×LTDA / CLT-teto parkeados. **Tabela de marketing extraída** = 9 métricas de input (categoria 17-pills, texto-livre-sem-pill, faixa faturamento, recusa CNAE, geo CEP, coorte, economia agregada, sócio-exterior, endereço).

**2 bloqueadores que os docs subestimam:** (1) **persistência RF-01 trava tudo** — sem ela até as 2 métricas `[hoje]` (conversão wizard→dossiê + recusa honesta) rodam mock; (2) **UTM/origem no wizard: adicionar JÁ** — única forma de leads-por-canal/CAC existir, barato de pôr, **impossível backfill**.

Entregáveis (branch `dash-adm`, commit `5c1db97`): `execucao/spec-dashboard-adm-metricas.md` (vault) + `execucao/handoff-dashboard-adm-dev.md` (self-contained, contrato de eventos de telemetria — **já enviado ao dev**). Eventos cruzam com a coorte de [[spec-instrumentacao-flow]] → juntar numa lista só.

**Próximo:** Pedro quer **debater o kanban de leads NA MAIN** (gestão interna por entrada de leads, dividida por pausas) pelo volume de info. Ver [[legalize-worktree-reorg-branches]] pro estado das pastas.
