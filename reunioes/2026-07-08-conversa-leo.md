---
tipo: reuniao
data: 2026-07-08
participantes:
  - Pedro Maia
  - Léo (Leonan)
tags: [decisao, dor]
---

# Reunião — Conversa com o Léo (dia 1 da imersão, 13:52)

## Contexto
Primeira conversa de imersão dentro da Legalize. Léo/Leonan = consultor/novo colaborador com bagagem de operação contábil em alta escala (carteiras de 2.000 clientes, equipes enxutas por núcleo). Raio-x da operação + visão do produto.

## 🟢 Decisões/direcionamentos que surgiram
- Nicho inicial sugerido: **prestadores de serviço, ESPECIALMENTE ADVOGADOS**, com parceria institucional (Caixa dos Advogados / dados OAB) como canal
- Preço de MVP falado: **R$99,00** + serviços avulsos (recálculo ~R$16, reunião R$250)
- Regionalização inicial (municípios/UF 100% digitais) pra reduzir risco de legalização
- Meta operacional: **25–30 clientes em 3 meses com ~80% de automação**
- Contratar **sênior (arquitetura/segurança/documentação) até ~08/08** pra liderar e mentorar o Pedro Dev

## ⚠️ Dores mapeadas (10 — resumo)
- #dor Dependência de atendimento humano: sem autosserviço (guias, declarações, 2ª via) → custo alto
- #dor Legalização multi-município: exigências presenciais, correspondentes, **multa mínima R$500 inviabiliza ticket R$99–199 se der erro**
- #dor Dados inválidos sem validação dura no cadastro (CEP etc.) → fila e SLA estourado
- #dor Custos de API sem governança: **R$0,50–0,96 por guia**; sem tarifação de excedente
- #dor UX fraca: achar CNPJ/contrato social é caçada; helpdesk desconectado; dashboard confuso
- #dor Comunicação reativa: sem lembrete de vencimento → cliente paga juros e culpa a contabilidade
- #dor ERP Domínio SEM API → RPA frágil por cliques
- #dor Pedro Dev sobrecarregado, sem mentoria sênior; 35 projetos em 3 meses
- #dor Marketing: sem CRM, agência passiva sem métrica, dependência de indicação
- #dor Cultura: lideranças passivas, comunicação fraca, desalinhamento com Mauro em investimento tech

## 💡 Insights-chave
- #insight A "sangria" que vendemos no deck EXISTE DENTRO da própria Legalize (juros por falta de lembrete = feature de proatividade é cunha real)
- #insight Portal nacional NFS-e cobre ~70% — bate com nossa pesquisa (geo-niche mitiga o resto)
- #insight Fluxo de cancelamento com oferta condicional (50% por 12m) → meta reter 30–50%
- #insight CEPRO (parceira da Receita) como alternativa de API pra guias

## ✅ Ações prioritárias (lista completa no bruto)
- [ ] Sessão de mapeamento ponta a ponta com o Léo (1h–1h15) até 15/07
- [ ] Documentar fluxo de legalização c/ validações duras + SLA 2–3 dias úteis até 22/07
- [ ] Escopo MVP + backlog de autosserviço até 22/07
- [ ] Mapear custos unitários de APIs (CEPRO e alternativas) até 22/07
- [ ] Pricing inicial + tabela de avulsos até 19/07

## ⚠️ CONFLITOS COM A BASE (decidir com Pedro)
1. **Preço R$99** vs base R$139–195 (north star = plano R$195 da Contabilizei) — e a própria reunião admite que multa de R$500 inviabiliza ticket baixo
2. **Nicho advogados + parceria OAB** vs base "ME serviço genérico, mercado frio via tráfego" — advogado é atividade REGULADA (alto LTV, base dizia "fase posterior")
3. **Canal parceria institucional** vs funil de tráfego pago do mês 2

## Relatório bruto (Plaud)
> Ver arquivo original: `C:\Users\pedro\Downloads\Conversa com o Leo - 08_07_26-Summary.md` — resumo integral abaixo.

(Visão geral) Serviço contábil digital com tecnologia, automação e UX superior, inspirado na Contabilizei, foco inicial em prestadores de serviço (especialmente advogados), regionalizado em municípios 100% digitais. MVP a R$99 com autosserviço robusto. Funil via parcerias institucionais (Caixa dos Advogados). Operação atual tem sistemas e robôs subutilizados, processos manuais dispersos, desafios culturais. App centralizado; plataforma interna robusta independente de terceiros (ERP sem API), com LGPD, logs e documentação, servindo de base pro produto externo e extensões futuras (RH/folha, financeiro). Benchmark Contabilizei: ticket médio ~R$230. Léo: experiência com carteiras de 2.000 clientes, legalização em volume (3–4 pessoas). 10 dores e 10 expectativas detalhadas + 30 tarefas com prazos e stakeholders (jul–set/2026) — íntegra no arquivo original.

## Links
- [[HOME]] · [[BASE-ESTRATEGICA]] · [[2026-07-08-conversa-leo-pedro-dev]] · [[contabilizei]]
