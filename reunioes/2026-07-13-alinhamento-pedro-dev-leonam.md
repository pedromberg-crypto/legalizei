---
tipo: historico
status: congelado
data: 2026-07-13
fonte: Plaud (2 transcrições + 2 summaries)
tags: [reuniao, produto, backend, escopo, fiscal, ux, decisao]
---

# 🤝 Alinhamento Pedro Dev + Léo — 13/07/2026

> Reunião de segunda, gravada em 2 partes. **Parte 1:** recurso/time + infra + Pedro mostra o protótipo. **Parte 2:** regras de negócio contábil (Léo despejando dor do escritório digital antigo) + produto fino. Juntas fecham um modelo operacional inteiro. Plano de sequência derivado em [[2026-07-13-plano-sequencia-pm]].

## 🧵 Síntese cruzada
1. **Escopo travado de propósito:** só **serviço**; comércio trava a operação (avaliar N produtos) e vai pro tradicional. Dentro de serviço, só **CNAE atendido "passa liso"** — condicionais (médico) ficam fora do 1º momento. Estreita a matriz [[cnae-atendidos-e-nao-atendidos]] (o "68 condicional" sai do MVP). ⚠️ Números divergiram: vault 460/68/804 × reunião 412/68/de-1300 — reconciliar.
2. **A dor do escritório antigo virou requisito:** nota externa some da apuração → exigir upload XML + estudar API refresh + extensão navegador. Multa de obrigação acessória → rotina automática via API. Prolabore alto assusta → padronizar salário mínimo. Cliente liga estressado → status em tempo real + WhatsApp.
3. **WhatsApp no centro:** SuperBase tem relação nativa; API oficial Business, número simbólico p/ treino → oficial. Email só backup. Casa com captação (site = LP p/ baixar app / validar CNAE / fechar plano).
4. **Entra um operador:** Pedro Dev não escala sozinho (consenso dos 3). Amigo do Pedro (CC + IA + especialista em assistentes WhatsApp). Código: branch → review → merge.
5. **Monetização desenhada:** cards de notícia por CNAE (SSR grátis) → depois vender espaço/patrocínio, comissão de empréstimo, troca de lista com CRMs de conselhos.
6. **Posicionamento de guerrilha:** hero "A única contabilidade 100% digital de verdade" + cores dos concorrentes. ⚠️ Interno sabe-se que não é 100% automático ([[2026-07-10-teto-automacao-orgaos-sem-api]]) — é claim de marketing.

## ✅ Decisões travadas (19)
| # | Decisão | Frente |
|---|---------|--------|
| 1 | Só serviço; comércio → tradicional | Escopo |
| 2 | MVP só CNAE atendido "passa liso"; condicionais (médico) depois | Escopo |
| 3 | Wizard dividido em blocos; Bloco 1 flui sem o time até a assinatura | Produto |
| 4 | Nota externa: exigir upload de XML na plataforma (contrato) | Fiscal |
| 5 | Pedir faturamento previsto → estimar alíquota (a partir de 6%) | Produto |
| 6 | Prolabore padronizado (salário mínimo) + i-info | Produto |
| 7 | Double check final + reforço positivo + resumo PDF (não passo a passo) c/ código de serviço | UX |
| 8 | WhatsApp central (API Business); email backup | Comms |
| 9 | legalizai-story-book.app oficial + 3 correlatos redirect | Infra |
| 10 | Onboard antes do pagamento (só cobra após validar CNAE) | Produto |
| 11 | Cancelamento mensal sem parcial; começar semestral (evitar anual/estorno); 30 dias sem multa | Pagamento |
| 12 | Dashboard CRM/Kanban c/ automação condicional (card pula → WhatsApp) | Produto |
| 13 | Leghub só p/ leads não atendidos (não reaproveitar tudo) | Produto |
| 14 | Cliente vê status/pendência em tempo real | UX |
| 15 | Meta 100 contas/mês por operador | Ops |
| 16 | Hero "A única contabilidade 100% digital de verdade" (guerrilha) | Marca |
| 17 | Handoff via Git público (pacotão LP+telas) → traduz React Native | Dev |
| 18 | Mobile-first React Native; adaptação desktop natural | Dev |
| 19 | Contratar operador (branch→review→merge) | Time |

## 📋 Tarefas geradas
Ver macro completo (abertas/criadas/finalizadas) no [[kanban-legalizai-story-book]] e a priorização espinha×enfeite no [[2026-07-13-plano-sequencia-pm]].

> ✏️ **Nota de normalização (2026-07-14):** o termo "KINAE" (que aparecia nesta ata via transcrição Plaud) foi padronizado como **CNAE** em todo o vault — não era conceito distinto, era o CNAE atendido / CNAE principal. Termo aposentado.

## Links
- [[2026-07-13-plano-sequencia-pm]] · [[kanban-legalizai-story-book]] · [[2026-07-10-reporte-tecnico-pedro-dev]] · [[2026-07-10-teto-automacao-orgaos-sem-api]] · [[cnae-atendidos-e-nao-atendidos]] · [[evolucao-para-mauro]] · [[HOME]]
