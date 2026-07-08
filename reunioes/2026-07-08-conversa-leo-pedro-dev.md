---
tipo: reuniao
data: 2026-07-08
participantes:
  - Pedro Maia
  - Pedro Dev
  - Léo (Leonan)
tags: [decisao, insight]
---

# Reunião — Conversa com Léo + Pedro Dev (dia 1 da imersão, 14:11)

## Contexto
Apresentações + descoberta do sistema interno + alinhamento de visão do app. **Pedro Dev = o "júnior cedido"**: 2,5 anos em segurança da informação/infra, no-code + IA desde 2025, ~3 meses na empresa, usa Claude Code.

## 🟢 Decisões tomadas
- **MLP (Minimum Lovable Product) em 3 meses**, 25–30 usuários de validação; até 20–30% manual no lançamento é aceitável
- **Mês 1 do Pedro Maia = imersão**: mapa de PROCESSOS (Pedro Maia) × mapa de TECNOLOGIAS (Pedro Dev) → cruzamento vira o **primeiro PRD**
- **Mobile first** (com desktop)
- Independência de terceiros (Domínio/Omie) como princípio de arquitetura
- Reuniões marcadas: **sexta 10/07** (debate de tecnologias) e **15/07** (definição de tarefas)
- Contratação de novo membro no mês 2 (necessidade mapeada pelo Pedro Dev, alinhamento com Mauro)
- Comunicação aberta sem restrição de horário; reuniões pontuais pra não sobrecarregar Pedro Dev

## 💡 Descoberta GRANDE: o Leghub
- #insight **Sistema interno já construído pelo Pedro Dev em 3 meses** — em produção desde 06/07 com 37 usuários: dashboards de clientes, diário do cliente, kanban de processos, controle de alvarás/certificados (alerta 30 dias), automação de tarefas recorrentes
- **~50% dos dados/processos já centralizados** — a "automação interna com ROI nos 1000 clientes" da [[BASE-ESTRATEGICA]] §10.4 JÁ COMEÇOU sem a gente saber
- Integrações: **InfoSimples** (Receita/ECAC, ~90% das consultas, R$0,16–0,20/consulta) · Domínio via Power Automate (sem API) · scrapper JUCEMG (Playwright/Python) · Google Meet planejado · chat IA Gemini embutido
- Hospedagem: servidor físico local → plano de VPS. OCR (Cloud Vision) desativado

## ⚠️ Dores/atenções
- #dor Pedro Dev divide atenção com demandas urgentes da operação (Léo) — proteger a banda dele
- #dor Servidor físico local com dado de cliente → migração/segurança na pauta (antivírus como ação imediata = band-aid)
- Segurança tratada como requisito central (caso citado: empresa de 20 anos parou por hack; WordPress com plugin crackeado)

## ✅ Ações
- [ ] Pedro Dev: propor stack (React/Node etc.) pro app → debate sexta 10/07
- [ ] Pedro Dev: analisar app da Contabilizei (Pedro Maia compartilha acesso) → mapear features e falhas de UX
- [ ] Pedro Maia: mapa de processos (mês 1) → PRD
- [ ] Validar primeiros wireframes
- [ ] Avaliar reformulação da identidade visual
- [ ] Trocar telefone com Léo

## ⚠️ CONFLITOS/CORREÇÕES vs BASE
1. **"Alvo inicial: autônomos e MEIs"** dito na reunião — 🟢 RESOLVIDO com Pedro (08/07): seguimos o líder, ICP = ME serviço/Simples, MEI fora do foco. Alinhar discurso da equipe na sexta 10/07
2. **Correção factual pro time:** falaram "Contabilizei vendeu 25% por R$230 milhões" — o dado verificado ([[PESQUISA-MERCADO]] §G) é **Warburg Pincus ~R$700 mi por fatia minoritária (out/2024)** + SoftBank R$320 mi (2021). Ninguém repete o número errado na frente do Mauro
3. **Infra "500–600 mil clientes, Azure/AWS"** = superdimensionado pro MLP (base/mercado: infra inicial R$250–800/mês). Escala se compra depois
4. **Marca:** reunião usou "Legalize Digital"; decisão do Pedro (07/07) = **Legalizei**. Comunicar
5. MLP 3 meses ≈ nosso V1, mas **sem mencionar o GATE do mês 2** — o gate é acordo com o Mauro, manter explícito com o time

## Relatório bruto (Plaud)
> Ver arquivo original: `C:\Users\pedro\Downloads\Conversa com o Leo e com o Pedro Dev - 08_07_26-Summary.md` — pontos além do extraído: gamificação sutil (Duolingo) no onboarding · onboarding da Contabilizei criticado (5–6 dias, CNPJ a vários cliques) · "Contabilizei detém ~1,5% do mercado" · saúde financeira da Legalize financia o desenvolvimento · sugestão de especialista em Obsidian pra treinar a equipe · Open Interpreter e Ultracode citados · 20 pendências listadas pela IA do Plaud (escopo do MVP vago, métricas de UX indefinidas, orçamento não falado, certificado digital sem decisão, risco de confusão de marca).

## Links
- [[HOME]] · [[BASE-ESTRATEGICA]] · [[2026-07-08-conversa-leo]] · [[contabilizei]] · [[obsidian-estado-da-arte]]
