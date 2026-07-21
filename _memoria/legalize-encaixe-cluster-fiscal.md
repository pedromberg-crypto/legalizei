---
name: legalize-encaixe-cluster-fiscal
description: "Cluster fiscal reordenado (21/07) — CNAE se escolhe pré-pago no ENCAIXE; teaser+N17 removidos; N5' resumo; motor ficou 1 passo atrás"
metadata: 
  node_type: memory
  type: project
  originSessionId: 78f8fc8b-c410-4fe7-92a2-0df9ccb4eaff
  modified: 2026-07-21T21:07:02.138Z
---

Em 2026-07-21 o cluster fiscal foi **reordenado** (stage 1+2 construído, `tsc`+eslint limpo). O CNAE deixou de ser um **swap tardio** (N17, depois do dossiê) e passou a ser escolhido na **DESCOBERTA**, pré-pagamento, numa tela nova: o **ENCAIXE** (`veredito 🟢 → ENCAIXE → triagem`). Motivo travado pelo Pedro: **o CNAE entra no 1º preenchimento e o nome/objeto/Junta dependem dele** → travar cedo é requisito, não estética. Modelo = o print do Pedro (card Recomendado + alternativas, com % de adequação que é fit real da IA cruzando pill+texto, não vinculante).

**O que mudou no código:** criado `components/encaixe.tsx` + rota `/encaixe`; **removidos os 3 teasers + `teaser.tsx` + o N17** (`/dossie/cnae-otimo`); criado o **N5' resumo de valor** (`components/resumo-valor.tsx` + `/resumo`, opção B: vende segurança, número suave por faixa, NÃO promete economia); `lib/passos` caiu 1 passo e perdeu o `temCnaeOtimo` (4 arquivos); `flow-data` → **mapa v4 sem drift** (mermaid do Obsidian atualizado).

**As 4 regras do ENCAIXE:** (1) vem depois do veredito, não na tela de descrever; (2) o % é fit à descrição, sugestão não-vinculante; (3) garante o SETUP ("o código mais barato que serve"), nunca o resultado (fator-r depende da margem); (4) defesa de legitimidade inline obrigatória ("emite a mesma nota, não é malandragem").

**⚠️ ABERTO — 1º item da próxima janela:** o **motor** (`execucao/motor-testes/flow-schema.js`) ainda modela o flow VELHO (b2.cnae_otimo/N17) → drift interno até atualizar. E N14/N16 lendo o "CNAE travado" está deferido até existir store de estado real (hoje tudo é mock por tela).

Fonte completa: [[reordenacao-cluster-fiscal-encaixe]]. Supera parte de [[legalize-cnae-fiscalmente-otimo]] (a entrega migrou pro ENCAIXE) e [[legalize-pill-estreita-nao-valida]]. Ver [[legalize-mapa-flow-vivo]] (v4).
