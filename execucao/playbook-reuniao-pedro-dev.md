---
tipo: playbook
data: 2026-07-09
status: pronto
tags: [tech, produto, imersao]
---

# 🎯 Playbook — Reunião Pedro Dev (condução PM)

> Reunião conduzida como PM: fluxo cronológico onde cada decisão destrava a próxima, com árvore de "resposta → tarefa gerada". Fecha em decisão onde dá; em "investigar" onde não dá. Substitui a tabela plana da [[pauta-reuniao-pedro-dev]].

## 🎬 Resultado esperado (o que tem que SAIR da reunião)
1. **Direção travada:** App reaproveita o Leghub OU é produto novo (a decisão-mãe).
2. **Stack candidata** alinhada (ele apresenta) + abordagem mobile.
3. **Princípios de arquitetura** de dados/segurança combinados (multi-tenant, A1, LGPD).
4. **Lista de tarefas do Pedro Dev** saindo pronta (definidas + as condicionais que as respostas acionarem).

## 📎 Compartilhar com ele antes/no início
[[_relatorio-auditoria]] (UX do líder) · [[cnae-matriz-governo]] (dado pronto) · [[orgaos-sistemas-abertura-bh]] (portais por passo) · [[spec-mvp-v0]] (direção de produto).

---

## FLUXO DA REUNIÃO (na ordem)

### Bloco 0 — Abertura (5 min)
Alinhar objetivo: MVP tipo Contabilizei, ICP ME serviço Simples BH. Mostrar rápido o que já mapeamos (auditoria + fluxo Izabela + matriz).

### Bloco 1 — FUNDAÇÃO: App × Leghub 🔑 (a decisão-mãe, destrava tudo)
**Decisão:** o app do cliente **reaproveita o Leghub** (que ele já construiu, ~50% automação) como back-office/motor, ou é **produto novo separado**?
**Ramificações:**
- 🌿 **Reusa Leghub** → gera tarefa *"mapear o que do Leghub vira base + gaps"*; stack tende a seguir a do Leghub (economiza meses); integração é interna.
- 🌿 **Novo separado** → gera tarefa *"definir integração app↔Leghub (API entre eles)"*; stack livre pra escolher a ideal cliente-facing; cap table de código limpo, mais trabalho inicial.
**Quem lidera:** Pedro Dev (conhece o Leghub por dentro). **Esta resposta condiciona o Bloco 2.**

### Bloco 2 — Stack (depende do Bloco 1)
**Decisão:** stack do app (ele apresenta — React/Node?) + **abordagem mobile** (nossa auditoria provou que mobile-first é a cunha; ele já falou "mobile first").
**Ramificações:**
- Stack = a do Leghub → reuso de conhecimento, velocidade.
- Stack nova → justificar por quê melhor pro cliente-facing + mobile.
- Mobile: PWA? React Native? web responsivo de verdade? → gera *"definir abordagem mobile"*.
**Gera tarefa (já definida):** ele documenta stack + justificativa. **Valida:** passar pelo sênior guardrail (arquitetura).

### Bloco 3 — ARQUITETURA de dados + segurança (o forte dele) 🔐
**Decisão:** modelo multi-tenant + LGPD + **guarda da chave privada do certificado A1**.
**Ramificações:**
- A1 (chave privada do CNPJ do cliente) → gera *"desenhar arquitetura de guarda/uso do A1"* (CRÍTICA — o moat de segurança dele).
- Multi-tenant: schema por cliente × compartilhado com isolamento → gera *"definir modelo multi-tenant"*.
- LGPD: mapear dado sensível → gera *"checklist LGPD do MVP"*.
**Valida:** ele (segurança) + sênior guardrail. **Posicionar: "essa é a parte que só você resolve."**

### Bloco 4 — INTEGRAÇÃO: portais gov + build-vs-buy
**Decisão:** o que integra por API oficial × RPA × parceiro.
**Ramificações:**
- Portais (JUCEMG, Redesim, ALF, BHISS/DES-BH, SISDRAM, SIARE) → gera *"mapear API×RPA por portal"* (definida). Ele já faz scraper JUCEMG.
- NFS-e: Focus NFe cobre BH + suporta **NFS-e Nacional** (Reforma Tributária)? → gera *"PoC Focus NFe + padrão nacional"*.
- Certificado A1: certificadora parceira comissionada da Legalize (Izabela) → gera *"avaliar API/fluxo da certificadora parceira"*.
- Gateway de assinatura + conta PJ → gera *"avaliar parceiros de pagamento"*.
**Valida:** ele + spike sênior (fim do V0).

### Bloco 5 — PRODUTO / dados: filtro CNAE
**Decisão:** usar a matriz CNAE (1332, pronta) pro filtro **regime→CNAE** no onboarding (feature validada pela Izabela).
**Gera tarefa (definida):** implementar o filtro com a matriz.
**Condicional:** overlay tributário (anexo/Fator R) depende da Larissa → tarefa nasce depois.

### Bloco 6 — UX
**Decisão:** princípios de UX do MVP (mobile-first real, emissão 1-toque, sem cross-sell, dados-empresa 1ª classe, linguagem humana).
**Gera tarefa (definida):** cruzar nossa auditoria UX × a análise tech dele da Contabilizei → base dos wireframes.

### Bloco 7 — Fechamento
Recapitular decisões travadas · consolidar tarefas (baldes A+B) · combinar cadência (reuniões pontuais, não sobrecarregar) · listar pendências externas.

---

## 🗂️ BALDE A — Tarefas JÁ definidas (acontecem independente da conversa)
1. Pedro Dev: documentar **stack proposta + justificativa**.
2. **Mapear API×RPA** por portal gov.
3. **PoC Focus NFe** (NFS-e BH + padrão nacional).
4. **Implementar filtro CNAE** por regime (matriz pronta).
5. **Cruzar auditoria UX × teardown tech** da Contabilizei → base wireframes.
6. **Analisar app Contabilizei** (tech) — tarefa herdada da 1ª reunião dele.

## 🌿 BALDE B — Tarefas CONDICIONAIS (nascem da decisão de cada bloco)
- **Bloco 1:** [reusa] mapear Leghub base+gaps · [novo] definir integração app↔Leghub.
- **Bloco 2:** definir abordagem mobile (PWA/RN/web).
- **Bloco 3:** desenhar guarda do A1 · definir multi-tenant · checklist LGPD.
- **Bloco 4:** avaliar certificadora parceira · avaliar gateways/conta PJ.
- **Bloco 5:** [pós-Larissa] preencher overlay tributário na matriz.

## ⏳ Pendências externas (NÃO fecham hoje)
- **Larissa** (fiscal): acessórias reais → alimenta o **motor de compliance** (arquitetura futura).
- **Carla** (DP) · **Jessica** (abrir em 4 concorrentes) · **sênior guardrail** (validar arquitetura/segurança).

## Links
- [[pauta-reuniao-pedro-dev]] · [[spec-mvp-v0]] · [[_relatorio-auditoria]] · [[cnae-matriz-governo]] · [[2026-07-09-conversa-izabela]] · [[kanban-legalizei]] · [[HOME]]
