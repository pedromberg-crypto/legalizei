# Handoff — Dashboard de Administração (priorização + eventos)

**De:** Pedro (PM) · **Data:** 2026-07-23 · **Para:** dev
**Contexto:** você levantou 2 docs de métricas (`metricas-propostas` das telas + `02 - Indicadores de Performance` do CRM) e montou 1 dashboard pra cada. Este handoff consolida os dois num **dashboard único de 3 abas** e lista os **eventos de telemetria** que o backend precisa emitir.

---

## 1. Decisão: 1 dashboard, não 2

Os dois docs **não são produtos separados** — o `metricas-propostas` foi escrito pra **complementar** o `02-Indicadores` (não repetir). Juntar em **1 dashboard com 3 abas**:

1. **Funil** — conversão e onde o usuário desiste
2. **Demanda & Mercado** — perfil de quem entra (dado de input, vivo desde o dia 1)
3. **Ver completo** — métricas que dependem de features ainda não construídas (billing recorrente, NFS-e, ticket)

**Regra:** não colocar tile com dado mock/zero na aba principal. Métrica sem fonte de dado real vai pra aba "Ver completo" com selo *"requer feature X"*. Dashboard cheio de zero lê como produto quebrado.

---

## 2. Aba FUNIL (principal)

| Tile | Fonte de dado | Pré-requisito |
|---|---|---|
| Conversão início→dossiê completo | estado do wizard | persistência (ver §5) |
| Abandono **por etapa** | evento entra/sai por passo | evento por passo (ver §4) |
| Conversão pós-pagamento (pagou, não terminou) | status Asaas + progresso dossiê | persistência |
| Taxa de recusa honesta (CNAE fora do ICP) | resultado do gate | já capturável |
| Taxa de retomada (`/retomar`) | estado do wizard + qual passo | persistência |

## 3. Aba DEMANDA & MERCADO (dado de input, disponível cedo)

| Tile | Fonte de dado |
|---|---|
| Distribuição por categoria (17 pills) | gate — pill selecionada |
| Texto livre SEM pill (demanda fora das categorias) | gate — campo texto sem match |
| Distribuição por faixa de faturamento | gate — faixa/valor exato |
| Distribuição geográfica (CEP pessoal + empresa) | dossiê |
| % coorte (1ª empresa × já abri) | campo `coorte_experiencia` no cadastro |
| Economia estimada agregada (Anexo V − III dos convertidos) | cálculo fiscal por cliente |
| % barrado por sócio no exterior | gate/dossiê — flag de bloqueio |
| % endereço próprio × comercial | dossiê |

## 4. Aba VER COMPLETO (placeholder até a feature existir)

Cada tile aqui mostra selo *"requer: <feature>"* enquanto não há dado.

| Tile | Requer |
|---|---|
| Churn · MRR/ARR · LTV | billing recorrente |
| NFS-e no mês · adimplentes DAS | emissão fiscal |
| Receita por CNAE · inadimplência | billing recorrente |
| Tempo até 1ª NFS-e / 1º DAS | feature fiscal |
| Tickets por categoria · escalados p/ contador | sistema de ticket |
| Rejeição nome JUCEMG · tempo espera órgão · assinatura GOV.BR | fluxo pós-pagamento |
| Boleto × cartão + lag de compensação | evento de pagamento (secundário) |
| Fator R da base · pró-labore escolhido×ótimo · uso do simulador | cálculo + eventos do simulador |
| Campos com mais retrabalho | evento de edição por campo |

## 5. Removido / revisado (NÃO construir)

- **DAU/MAU** — remover. Wizard é pré-login, não existe sessão recorrente. Não se aplica.
- **CAC por canal** — adiar. Precisa de leads-por-canal + custo de mídia; nenhum existe. Só depois do UTM (§7).
- **Conclusão do onboarding × conversão wizard→dossiê** — são a mesma coisa, **fundir num tile só**.
- **Capital social médio · % SLU×LTDA · % CLT no teto INSS · média de CNAEs secundários** — parkear. Sinal baixo agora, não priorizar.

---

## 6. Eventos de telemetria a emitir (contrato pro backend)

Todo evento carrega: `timestamp`, `session_id`, `coorte_experiencia` (quando existir).

1. **Passo do wizard** — `entrou` / `saiu`, `passo_id`, `tempo_ms`, `resultado` (avancou | voltou | abandonou).
2. **Pagamento** — `metodo` (boleto | cartao), `status`, `timestamp_pago`, `timestamp_liberou_passos`.
3. **Gate** — `pill_selecionada` (ou null), `texto_livre`, `faixa_faturamento`, `resultado` (aprovado | recusado | waitlist), `cnae_recusado` se houver.
4. **Dossiê** — `cep_pessoal`, `cep_empresa`, `tem_socio`, `socio_exterior` (bool), `endereco` (proprio | comercial), `natureza` (SLU | LTDA), `capital_social`.
5. **Fiscal** — `anexo` (III | V), `fator_r`, `pro_labore_escolhido`, `pro_labore_otimo`, `economia_estimada`.
6. **Edição de campo** (retrabalho) — `campo`, `qtd_edicoes`.
7. **Retomada** — `passo_pausou`, `voltou` (bool), `tempo_ate_voltar`.

> Cruzar com a spec de instrumentação de coorte já existente (eventos de expander, erro/retry por campo) pra não duplicar — a intenção é **uma lista de eventos só**.

---

## 7. Dois bloqueadores que os docs subestimam

1. **Persistência do wizard (RF-01) trava tudo.** Sem persistir o estado, até as métricas marcadas `[hoje]` rodam mock. É o pré-requisito #0 pro dashboard ter qualquer valor real.
2. **UTM/origem no wizard: adicionar JÁ.** É a única forma de "leads por canal / CAC" existir um dia. É barato de colocar e **impossível de recuperar depois** — cada dia sem captura de origem é dado perdido pra sempre. Colocar captura de `utm_source/medium/campaign` + `referrer` na entrada do wizard agora, mesmo antes de ter o tile pronto.

---

## Dúvidas abertas
- Stack de analytics (a definir — não pode atrasar o E2E).
- O CRM absorve a fila de homologação do CRC, ou é separado do Leghub?
