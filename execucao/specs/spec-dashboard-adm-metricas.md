---
tipo: derivado
status: vivo
data: 2026-07-23
assunto: dashboard-adm
deriva_de: [spec-instrumentacao-flow]
tags: [produto, dados, metricas, dashboard, admin, marketing, funil]
---

# 📊 Spec do Dashboard de Administração — priorização de métricas

> **Por que existe:** o dev jr levantou 2 docs de métricas (`metricas-propostas` das telas de UI + `02 - Indicadores de Performance` do CRM) e construiu **1 dashboard pra cada**. Esta nota corrige o eixo do corte, define **o que entra no START × o que vai pro "ver completo" × o que remove/revê**, e extrai a **tabela de marketing** viva desde o dia 1. Fontes: `metricas-propostas.md` + `02 - Indicadores de Performance.md` (Downloads, 22/07). Instrumentação de coorte: [[spec-instrumentacao-flow]].
>
> **Princípio:** anti-guru. Dashboard cheio de tile mock/zero `[futuro]` é dano ativo — lê como "produto quebrado". START mostra só o que terá fonte de dado real.

## 🎯 Diagnóstico (reframe do corte)

O corte "1 dash por documento" está errado. O `metricas-propostas.md` foi escrito **explicitamente pra NÃO duplicar** o `02-Indicadores` (linha 5: "conversão/abandono/recusa... já registradas lá"). **Não são 2 produtos — é 1 spec por 2 lentes.** Dois dashboards = caçar o mesmo funil em duas telas.

Corte certo não é "doc A × doc B". É **disponibilidade de dado**:
- Quase tudo é `[futuro]`. Só **2 métricas têm fonte real** (`[hoje]`): conversão wizard→dossiê + recusa honesta CNAE. E mesmo essas rodam mock até existir **persistência do wizard (RF-01)**.
- O **dado de ENTRADA do usuário** (gate/dossiê) já é captado agora. Então **segmentação de demanda** fica disponível MUITO antes de churn/MRR/NFS-e (dependem de auth + billing recorrente inexistentes).

## 🟢 START — dash único, seção principal

Tem/terá dado real com a persistência do wizard.

| Métrica | Origem | Por quê |
|---|---|---|
| Conversão início→dossiê completo | doc2 §1 `[hoje]` | único funil que existe |
| Taxa de abandono **por etapa** | doc2 §2 | acha o gargalo — precisa evento por passo |
| Conversão **pós-pagamento** | doc1 §1 | pagou e não terminou = dinheiro na mesa |
| Taxa de recusa honesta (CNAE fora ICP) | doc2 §1 `[hoje]` | tamanho do mercado fora do V1 |
| Taxa de retomada (`/retomar`) | doc1 §1 | onde/quanto volta |
| Distribuição por categoria (17 pills) | doc1 §2 | quem é a base — vira marketing |
| Distribuição por faixa faturamento | doc1 §2 | ICP financeiro |
| Distribuição geográfica (CEP) | doc1 §2 | expansão além BH |
| % coorte (1ª empresa × já abri) | doc1 §2 | muda messaging/suporte — cruza com [[spec-instrumentacao-flow]] |
| Economia estimada agregada | doc1 §3 | headline "economizamos R$X" |

## 🔗 "Ver completo" — link discreto, página própria, placeholder até a feature existir

| Métrica | Origem | Depende de |
|---|---|---|
| Churn · MRR/ARR · LTV | doc2 §3 | billing recorrente |
| NFS-e no mês · adimplentes DAS | doc2 §4 | emissão fiscal |
| Tickets por categoria · escalados p/ contador | doc2 §5 | sistema de ticket |
| Receita por CNAE · inadimplência | doc2 §6 | billing recorrente |
| Tempo até 1ª NFS-e / 1º DAS | doc2 §2 | feature fiscal |
| Rejeição nome JUCEMG · tempo espera órgão · assinatura GOV.BR | doc1 §4 | fluxo pós-pagamento |
| Boleto × cartão + lag boleto | doc1 §1 | secundário, ops |
| Fator R da base · pró-labore escolhido×ótimo · uso do simulador | doc1 §3 | valioso, 2ª onda |
| Campos com mais retrabalho | doc1 §4 | evento por campo (otimização UX) |

## 🔴 Remover / rever

| Métrica | Ação | Motivo |
|---|---|---|
| **DAU/MAU** | **remover** | o próprio doc2 admite: wizard é pré-login, não se aplica |
| **CAC por canal** | rever/adiar | precisa leads+spend, nenhum existe; só depois de UTM |
| Conclusão onboarding × conversão wizard→dossiê | **fundir** | quase-duplicata, uma métrica só |
| Capital social médio · % SLU×LTDA · % CLT no teto INSS | parkear | sinal baixo no início, curiosidade > decisão |
| CNAEs secundários (média) | parkear | analytics, não move agulha agora |

## 💰 Tabela MARKETING extraída (aba "Demanda & Mercado")

Só dado de **entrada do usuário** = disponível imediato + diz QUEM é o mercado e QUAL mensagem funciona. Não espera billing.

| Métrica | O que responde pro marketing | Veredito |
|---|---|---|
| **Categoria de atividade (17 pills)** | quais atividades dominam → alvo de anúncio + copy por nicho | 🟢 aprova, topo |
| **Texto livre SEM pill** | demanda fora das categorias → novo CNAE / SEO / landing nova | 🟢 aprova — sinal de produto |
| **Faixa de faturamento** | ICP financeiro → mira criativo | 🟢 aprova |
| **Recusa honesta por CNAE** | mercado que bate e é barrado → prioriza expansão de ICP | 🟢 aprova |
| **Geografia (CEP)** | onde concentra → geo-targeting + próxima praça | 🟢 aprova |
| **Coorte 1ª empresa × já abri** | dois públicos, duas mensagens (educar × migrar) | 🟢 aprova |
| **Economia estimada agregada** | headline: "clientes economizaram R$X" | 🟢 aprova — prova social |
| **% barrado por sócio no exterior** | demanda reprimida quantificada → roadmap | 🟡 revê — nicho, grátis de captar |
| **% endereço próprio × comercial** | tamanho do upsell "endereço fiscal" | 🟡 revê — mais produto que mkt |

## 🏗️ Estrutura final recomendada

**1 dashboard, 3 abas** (não 2 dashboards, não tile mock no START):
1. **Funil** — as 🟢 de conversão/abandono/retomada/pós-pagamento/recusa
2. **Demanda & Mercado** — as 9 de marketing
3. **Ver completo** — tudo `[futuro]` de billing/fiscal/suporte, com selo "requer feature X"

## 🛠️ Flags de engenharia (os docs subestimam)

1. **RF-01 persistência do wizard = trava tudo.** Sem ela até as 2 `[hoje]` são mock. Pré-requisito #0 do dash ter valor.
2. **UTM/origem no wizard: adicionar JÁ.** Única forma de "leads por canal / CAC" existir um dia. Barato de colocar, **impossível de backfill** — cada dia sem isso é dado perdido pra sempre. Docs marcam `[futuro]` e passam batido; call sênior = subir prioridade.

## 🟡 Pendências
- Eventos de telemetria que o backend precisa emitir (por tela, por campo, por método de pagamento) — cruzar com as "Implicações pro Dev" de [[spec-instrumentacao-flow]] pra virar 1 lista única de eventos.
- Definir stack de analytics (aberto na spec de instrumentação).
- Confirmar overlap CRM × fila de homologação CRC × Leghub (pendência do doc2).

## Links
- [[spec-instrumentacao-flow]] (coorte + eventos por tela) · [[spec-telas-entrada-b1-b2]] · [[compilado-ux-flow]] · [[kanban-legalizai-story-book]] · [[HOME]]
