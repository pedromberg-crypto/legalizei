---

kanban-plugin: board
tipo: hub
status: vivo
data: 2026-07-22
assunto: kanban-time
tags:
  - scrum
  - time
  - devs
  - sprint

---

## 📋 Como usar

- [ ] **Board do TIME** (Dev-Pedro · Dev-Novo · Pedro-PO). Separado do [[kanban-legalizai-story-book]] (pessoal do Pedro). Fonte do raciocínio: [[backlog-e-sprint-1]]
- [ ] **Tags:** `#dev-pedro` `#dev-novo` `#pedro-po` · épico: `#backend` `#telas` `#dado` `#negocio` · `#bloqueador`
- [ ] **Prio:** ⏫ Must · 🔼 Should · 🔽 Could
- [ ] **Cada card leva:** dono + épico + dependência + DoD (definição de pronto)


## 🔴 Gate 0 (antes do Sprint)

- [ ] **Alinhar backend ao contrato atual** #pedro-po #dev-pedro #bloqueador ⏫ — Pedro já validou boa parte do E2E, mas contra a spec velha. Conferir o delta: ordem invertida, 19 personas, `cnae-lookup` furado. DoD: Dev-Pedro recebe motor v0.5.0 + aponta o que já cobre × o que mudou
- [ ] **Convidar `pedro.melodata` no repo base-flow-legalizai-story-book** #pedro-po #bloqueador ⏫ — DoD: convite aceito
- [ ] **Carimbar qual dev recebeu as páginas do flow** #pedro-po ⏫ — muda o onboarding do Dev-Novo


## 🎯 Sprint 1 — a debater (2 sem)

- [ ] **Fechar/endurecer E2E backend RPA (Junta)** #dev-pedro #backend ⏫ — boa parte já validada. Dep: Gate 0. DoD: 1 abertura fim-a-fim cobrindo as 19 personas
- [ ] **Integração gateway Asaas (sandbox)** #dev-pedro #backend ⏫ — Dep: decisão idempotência (Pedro). DoD: cobrança + estorno testados
- [ ] **Setup repo + Vercel do app** #dev-novo #telas ⏫ — Dep: Gate 0. DoD: app versionado + deploy preview
- [ ] **Rodar as 19 personas contra as telas (QA)** #dev-novo #telas 🔼 — ótimo onboarding: aprende o produto testando. DoD: relatório de divergências
- [ ] **Decidir idempotência + providers CPF/cartão CNPJ** #pedro-po #bloqueador ⏫ — destrava E2E + Asaas. DoD: regra + provider escolhidos em `decisoes-abertas.md`
- [ ] **Fechar formulário fiscal com Larissa/Carla** #pedro-po #bloqueador ⏫ — destrava a IACA. DoD: regras fiscais fechadas
- [ ] **Publicar LP + waitlist** #pedro-po #negocio ⏫ — pré-req do smoke test. DoD: LP no ar captando
- [ ] **Kickoff gestor de tráfego = smoke test de demanda** #pedro-po #negocio 🔼 — início agosto. Escopo explícito: validar demanda, não "gerar leads"


## 🔨 Fazendo

- [ ] **E2E backend — validação em curso** #dev-pedro #backend — Pedro já cobriu boa parte; falta alinhar ao contrato novo
- [ ] **Infra própria (banco/nuvem, multi-tenant)** #dev-pedro #backend — em curso
- [ ] **Bitwarden Legalize + credenciais** #dev-pedro #backend — em curso


## 📥 Backlog do time (pós-Sprint 1)

- [ ] **IACA (entrevista → CNAE + 3 sec + alíquota + prolabore)** #dev-pedro #backend ⏫ — Dep: formulário fiscal Larissa
- [ ] **Chave de idempotência (não cobrar/abrir 2×)** #dev-pedro #backend ⏫ — Dep: decisão Pedro
- [ ] **Providers CPF/situação + cartão CNPJ** #dev-pedro #backend ⏫ — Dep: decisão Pedro
- [ ] **Portal mínimo (emitir nota + ver vencimentos)** #dev-pedro #backend ⏫ — Dep: E2E + certificado
- [ ] **Spike NFS-e municipal (maior risco técnico)** #dev-pedro #backend ⏫ — DoD: vai/não-vai documentado
- [ ] **Corrigir `cnae-lookup-b1.json` (diz "atende" pra DEFESA)** #dev-pedro #pedro-po #dado ⏫ — Dep: limpeza 45/91/124
- [ ] **Ligar dado real nas telas (hoje mock)** #dev-novo #telas ⏫ — Dep: backend + repo
- [ ] **Inverter guarda-corpo das pills (toda pill → só 🟢)** #dev-novo #telas 🔼 — DoD: sobram ~6 pills
- [ ] **Especificar UI do N19.5 (consenso 2º sócio)** #pedro-po #telas 🔼 — nasceu no motor, sem tela
- [ ] **Especificar N25 (TFLF, dia ~40)** #pedro-po #telas 🔽
- [ ] **Telas restantes de craft/novas** #pedro-po #telas 🔼
- [ ] **Martelo nos 45 CNAEs impossíveis** #pedro-po #dado 🔼
- [ ] **Decidir cobaia do E2E (a do Pedro já existe)** #pedro-po #negocio ⏫


## 👀 Revisão



## ✅ Feito

- [ ] **26 telas do flow construídas (splash → empresa ativa)** #telas ✅ — `/mockup`, tsc+eslint limpos
- [ ] **Motor de testes v0.5.0 — 19 personas, 2 flows, 19/19 PASS** #backend ✅
- [ ] **2º dev júnior contratado (21/07)** ✅
- [ ] **Gestor de tráfego autorizado (início agosto)** ✅




%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false]}
```
%%