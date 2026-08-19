---
tipo: historico
status: congelado
data: 2026-07-13
etapa: plano-sequencia
tags: [plano, produto, priorizacao, caminho-critico, mvp]
---

# 🧭 Plano de sequência — próximos passos otimizados (PM Sênior)

> Derivado do alinhamento [[2026-07-13-alinhamento-pedro-dev-leonam]]. Objetivo: cortar o ruído das ~40 ideias e travar o caminho crítico de UMA transação real de abertura de empresa.

## 🎯 North Star (~3 semanas)
**1 empresa real aberta de ponta a ponta pelo app** — do "me descreve o que você faz" até o certificado digital emitido e o cliente vendo o portal.
Cobaia = **CNPJ do próprio Pedro** (Mauro já autorizou dar baixa). Esse é o teste que vale, não o mock.

## 🦴 Espinha × 🎀 Enfeite
**ESPINHA (só isto importa agora):**
```
entrevista IA (CNAE) → valida atende? → cobra (gateway) →
constitui CNPJ (RPA + ponto humano) → certificado digital →
portal: emitir nota + ver vencimentos
```
Maior risco da espinha = o pedaço que ninguém controla: JUCEMG/Gov.br sem API ([[2026-07-10-teto-automacao-orgaos-sem-api]]) + certificado. Provar viabilidade aí ANTES de polir qualquer coisa.

**ENFEITE (validado, mas DEFERIR):** extensão navegador (Melius-style), cards de notícia/monetização, parceria com conselhos, anti-scraping fino, blog automatizado, Leghub. Receita/escala vêm depois da espinha respirar.

## 📌 Sequência por alavancagem

### Esta semana (até 17/07) — provar viabilidade + destravar o dev
1. **[Pedro Dev] Teste E2E do backend rodar** — milestone real da semana; sucesso/falha redefine tudo.
2. **[Pedro] Especificar os BLOCOS do fluxo** (não só "Etapa 1"): quais blocos, **onde o fluxo PAUSA** (assinatura, ação externa, passo humano) e o que retoma. Contrato de interface Pedro↔Dev; mata o "vai-e-volta".
3. **[Pedro] Fechar formulário com Carla/Larissa** — última ponta solta da regra de negócio; bloqueia a IACA.
4. **[Pedro] Handoff Git (pacotão LP+telas)** — barato, desbloqueia o dev na hora.

### Semana 2 — decisão vira spec + fechar o que trava dinheiro
5. **Redigir cláusulas de contrato + copy de onboarding** (nota retroativa, prolabore padrão, obrigação acessória, cancelamento). O contrato É a mitigação de risco (Léo) e é input da UX (double-check, PDF).
6. **Fechar as 3 decisões caras** (abaixo).
7. **Especificar a IACA** (entrevista → CNAE principal + 3 secundários + projeção de alíquota + prolabore) com regras validadas.

### Semana 3 — primeiro cliente real + demo Mauro
8. **Abrir o CNPJ do Pedro pelo app** (baixa o atual) — teste de fogo do North Star.
9. **Portal mínimo:** emitir nota + vencimentos. Nada além.

## ⚖️ 3 decisões a forçar (custo/lock-in) — recomendação
1. **Certificado digital → começar TERCEIRO** (Sete Minas, mesmo dia). Velocidade > controle enquanto são 2,5 pessoas; internalizar quando o volume pedir. Reversível barato.
2. **Gateway → Asaas.** Mais citado, estorno bom, padrão BR. Não gastar 2 semanas comparando.
3. **Plano → semestral** (não anual). Evita pesadelo de estorno; escrever política de cancelamento (30 dias, sem multa) junto do contrato.

## ⚠️ Riscos no radar
- **Bus factor = 1,5.** Pedro Dev é o único que constrói. Operador = mitigação, mas **fora do caminho crítico** por ora (curva de aprendizado).
- **Scope creep da reunião.** Ideia nova → parking-lot, não construção.
- **Dependência do Mauro** (domínio, presença). Demo de sexta = stakeholder management, não teatro.
- **Demo bonita × validação real.** O valor de sexta é o E2E funcionando, mesmo feio no backend.

## 🧠 Uma linha
Corte tudo que não seja abrir 1 empresa real. Semana 1: prove o backend E2E + entregue o spec de blocos. Semana 2: contrato-como-produto + 3 decisões caras. Semana 3: abra o CNPJ do Pedro pelo app. O resto é backlog.

## Links
- [[2026-07-13-alinhamento-pedro-dev-leonam]] · [[kanban-legalizai-story-book]] · [[2026-07-10-teto-automacao-orgaos-sem-api]] · [[spec-mvp-v0]] · [[HOME]]
