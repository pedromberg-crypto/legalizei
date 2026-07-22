---
tipo: operacao
status: vivo
data: 2026-07-22
assunto: backlog-produto
tags: [scrum, backlog, sprint, devs, planejamento]
---

# 🗂️ Backlog de produto + Sprint 1 — Legalizei

> Gerado na branch `debate/exploracao` (22/07) cruzando kanban + BASE + spec-mvp + plano-sequencia + blocos-fluxo + mapa-ramificacoes + fila-humana + índice-autoridade + parking-lot + compilado-ux + código `app/`.
> **Conteúdo pra portar pro Trello interno.** Não é o board — é o insumo priorizado.
> **Regra:** rascunho estruturado do PM. Estimativa e escopo técnico de backend = **ratificação dos devs** (ver §Curadoria). Prioridade = decisão do Pedro (PO).

## 🏷️ Legenda de campos
- **Raia:** `TIME-DEV` (os 2 devs) · `PM-PEDRO` (você) · `FILA-HUMANA` (Larissa/Mauro/contadores — não vira card de dev).
- **Dono:** Dev-Pedro (júnior, já no time, `pedro.melodata` — validou boa parte do E2E) · Dev-Novo (júnior, começou 21/07) · Pedro (PM/PO) · humano externo. **Os 2 devs são júnior; não há sênior.**
- **Prio:** MoSCoW ancorado na distância do North Star (abrir 1 empresa real ponta a ponta).
- **Dep:** o que trava a tarefa.
- **DoD:** condição de pronto (herdada do motor/spec quando existe).
- ⚠️ **SECUNDÁRIO** = tarefa de backend derivada do que o vault *afirma*; o estado real mora fora do vault → Dev-Pedro ratifica/reescreve.

## 🧱 Épicos
1. **Re-sync do contrato** (fundação do time) — PM/Dev-Pedro
2. **Backend & automação** (RPA + IACA + infra + portal) — Dev-Pedro
3. **App/telas** (fundação de repo + telas restantes) — híbrido Pedro/Dev-Novo
4. **Dado & CNAE** (correção da lista furada) — Dev + Pedro
5. **Fundação de negócio** (preço, contrato, decisões caras) — Pedro/Mauro
6. **Go-to-market** (tráfego=smoke test, marca/INPI, domínios) — Pedro/gestor novo
7. **Flow #2 — migrar** (não construído) — Pedro/Dev-Pedro

---

## 🔴 GATE 0 — trava o Sprint (fazer antes de dar tarefa nova pro dev)

| Tarefa | Raia | Dono | Por quê trava tudo | DoD |
|---|---|---|---|---|
| **Alinhar o backend do Dev-Pedro ao contrato atual** | PM-PEDRO | Pedro | Ele **já validou boa parte do E2E** — mas contra a spec de 15/07: ordem invertida (cobra no N9), 19 personas ≠ 14, flow #2 nasceu, `cnae-lookup-b1.json` responde "atende" pra DEFESA. Não é resgate, é **conferir o delta** pra não seguir validando o contrato errado | Dev-Pedro recebe motor v0.5.0 + 19 personas + ordem nova + dados corrigidos e aponta o que já cobre × o que mudou |
| **Convidar `pedro.melodata` no `base-flow-legalizei`** | PM-PEDRO | Pedro | Acesso é seu; sem isso o repo-contrato não chega | Convite aceito |
| **Definir qual dev recebeu as páginas do flow** | PM-PEDRO | Pedro | Muda o onboarding do Jr no kanban (pendência aberta) | Dono carimbado |

---

## 🖥️ TIME-DEV — Backend & automação (⚠️ SECUNDÁRIO — Dev-Pedro ratifica)

| Tarefa | Dono | Prio | Dep | DoD |
|---|---|---|---|---|
| Fechar/endurecer E2E backend RPA (busca→clica→protocolo + cancelamento na Junta) — **boa parte já validada** | Dev-Pedro | Must | Gate 0 | 1 abertura roda fim-a-fim + cobre as 19 personas |
| IACA (entrevista → CNAE principal + 3 sec + alíquota + prolabore) | Dev-Pedro | Must | **formulário fiscal Larissa/Carla fechado** | Bate com as 19 personas |
| Integração gateway **Asaas** (cartão/Pix/boleto) | Dev-Pedro | Must | decisão idempotência (Pedro) | Cobrança + estorno testados sandbox |
| Chave de idempotência (não cobrar/abrir 2×) | Dev-Pedro | Must | **decisão do Pedro** (`contrato/decisoes-abertas.md`) | Regra definida + implementada |
| Providers CPF/situação + cartão CNPJ | Dev-Pedro | Must | **decisão do Pedro** | Provider escolhido + integrado |
| Infra própria (banco/nuvem, isolamento por cliente) | Dev-Pedro | Must | — | Multi-tenant de pé |
| Bitwarden "Legalize" + centralizar credenciais | Dev-Pedro | Should | — | Vault criado, credenciais migradas |
| Portal mínimo (emitir nota + ver vencimentos) | Dev-Pedro | Must | E2E + certificado | Cliente emite 1 nota real |
| Spike NFS-e municipal (maior risco técnico do V0) | Dev-Pedro | Must | — | Vai/não-vai documentado |

## 🎨 TIME-DEV / PM — App & telas (híbrido)

| Tarefa | Dono | Prio | Dep | DoD |
|---|---|---|---|---|
| Setup repo + Vercel do `app/` | Dev-Novo | Must | Gate 0 | App versionado + deploy preview |
| Ligar dado real nas telas já construídas (hoje mock) | Dev-Novo | Must | backend + repo | Telas consomem API, não mock |
| Rodar as telas contra as 19 personas (QA) | Dev-Novo | Should | telas + motor | Relatório de divergências (ótimo onboarding) |
| Inverter guarda-corpo das pills (toda pill → só 🟢) | Dev-Novo | Should | — | Sobram ~6 pills; guard testado |
| Telas restantes de craft/novas | Pedro | Should | spec | Revisadas no `/mockup` |
| Especificar UI do **N19.5** (consenso 2º sócio) — nasceu no motor, sem tela | Pedro | Should | — | Spec de tela existe |
| Especificar **N25** (TFLF, dia ~40) — sem rota | Pedro | Could | — | Spec de tela existe |

## 🧮 TIME-DEV / PM — Dado & CNAE

| Tarefa | Dono | Prio | Dep | DoD |
|---|---|---|---|---|
| **Corrigir `cnae-lookup-b1.json`** (hoje diz "atende" pra DEFESA/Bingo) | Dev-Pedro + Pedro | Must | limpeza 45/91/124 | Lista alinhada ao motor; DEFESA não passa |
| Martelo nos 45 CNAEs impossíveis | Pedro | Should | — | 45 marcados |
| Mapa de Confusão CNAE (pares traiçoeiros) | Pedro/Dev | Could | matriz | Deferido de propósito |

---

## 🧑‍💼 PM-PEDRO — Fundação de negócio & GTM

| Tarefa | Prio | Dep | Nota |
|---|---|---|---|
| Decidir idempotência + providers (destrava E2E) | Must | — | Bloqueia o dev |
| Fechar formulário fiscal Larissa/Carla (destrava IACA) | Must | Larissa | Bloqueia o dev |
| Kickoff gestor de tráfego = **smoke test de demanda** (agosto) | Must | LP publicada | O V0 da BASE §4 chegando; escopo explícito, não "leads" |
| Publicar a LP + waitlist funcionando | Must | review visual + Sora + links lojas | Pré-req do smoke test |
| Preço do plano (com Mauro) | Should | custo unitário real | Placeholder ~R$195 FAKE; muda N7/N9 |
| Contrato + termo de início (Mauro/Larissa) | Should | — | 4 camadas de cancelamento |
| Prazo de fidelidade (ref. líder = 12m) | Could | — | Sua decisão |
| Certificado digital: terceiro (Sete Minas)? | Should | Mauro | Reversível barato |
| Decidir cobaia do E2E (a do Pedro já existe) | Must | — | 2ª empresa / outra pessoa / flow #2 |
| DNS Vercel + email contato@legalizei.app | Should | domínios (pagos) | — |
| INPI — busca de anterioridade → consultor do Mauro | Could | — | Doc pronto |
| Rename brand-level (domínios/IG/INPI) Legalizei→Legalizai | Could | Mauro | Decisão de sócio; hoje só o app renomeou |

## 🕓 FILA-HUMANA (não bloqueia sprint; constrói com placeholder) → [[fila-validacao-humana]]
- **Larissa:** 7 pontos fiscais · 91 CNAEs duvidosos (10 de conselho urgentes) · SLU×LTDA · anexos diferentes · ratificar CNAE ótimo
- **Mauro:** preço · UX-42 (nutri com RT? cotar MEI/LP?) · certificado · passivo herdado (flow #2)
- **Contadores:** crivo dos 124 CNAEs sobreviventes (não-refutados ≠ validados)

## 🌱 Flow #2 — migrar (backlog, decisões abertas)
- Cobrar antes do TTRT? · SLA + reembolso? · passivo herdado = upsell ou fora? → Pedro/Mauro (UX-57/UX-58)
- Telas não construídas · motor `flow-migrar.js` v0.1.0 (3 personas PASS)

---

## 🔗 Mapa de dependências (o que desbloqueia o quê)
```
Gate 0 (re-sync dev) ──► toda tarefa de backend
Formulário fiscal (Larissa) ──► IACA ──► telas de enquadramento
Decisão idempotência/providers (Pedro) ──► E2E + Asaas
Preço (Mauro) ──► telas N7/N9 (pagamento)
LP publicada ──► smoke test (gestor tráfego)
Certificado ──► portal mínimo (emitir nota)
```

## 🏃 Sprint 1 sugerido (2 semanas) — recorte pro Planning
- **Gate 0 (dia 1):** re-sync Dev-Pedro + convite repo + carimbar dono das páginas.
- **Dev-Pedro:** conferir o delta do contrato + fechar/endurecer o E2E (já validou boa parte) cobrindo as 19 personas + Asaas sandbox.
- **Dev-Novo (onboarding):** setup repo/Vercel + rodar 19 personas contra as telas (QA = aprende o produto) + ligar 1 tela a dado real.
- **Pedro (PM):** decidir idempotência/providers + fechar formulário fiscal com Larissa + kickoff gestor de tráfego (escopo smoke test) + publicar LP.
- **Fila (paralelo):** Larissa 7 pontos — não bloqueia se seguirmos com placeholder.

**Meta do Sprint 1:** 1 abertura roda E2E no ambiente do dev (mesmo feio) + LP no ar captando waitlist. É a espinha respirando + o smoke test começando.

## ✅ Curadoria — o que validar antes de virar card oficial
| Item gerado | Quem ratifica | O que checar |
|---|---|---|
| Épico Backend inteiro (⚠️ SECUNDÁRIO) | **Dev-Pedro** | Bate com o estado real da infra dele? Reescrever o que estiver errado |
| Todas as estimativas | **Os 2 devs** | Esforço real (P/M/G) |
| Prioridade / o que corta | **Pedro (PO)** | Decisão de produto |
| Fronteira Dev vs PM (telas híbridas) | **Pedro + Dev-Pedro** | O que o Jr aguenta com supervisão |
| Tarefas com dep fiscal | **Larissa** | Não liberar tela sobre regra não-ratificada |
| Preço/contrato/certificado | **Pedro + Mauro** | Trava a cobrança |

## Links
- [[kanban-legalizei]] · [[fila-validacao-humana]] · [[indice-autoridade]] · [[2026-07-13-plano-sequencia-pm]] · [[HOME]]
