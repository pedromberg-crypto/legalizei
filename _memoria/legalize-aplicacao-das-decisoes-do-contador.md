---
name: legalize-aplicacao-das-decisoes-do-contador
description: 16/09 — os 7 passos que levaram a reunião até o código; a 3ª cópia da CPP errada; e a trava que ganhou um segundo olho
metadata: 
  node_type: memory
  type: project
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-17T02:28:02.592Z
---

Depois da reunião ([[legalize-contador-valida-o-motor]]), 7 passos em ordem revalidada. **Invariantes 32 → 54 · competências 156 → 162 · agregação 142 → 154 · 0 falhas.**

## 🔑 A ordem importou, e a minha primeira estava errada

Eu ia começar pelo motor. **A fila (`PENDENCIAS.md`) tinha que vir antes** — ela é a autoridade de status, e mexer no código antes faria a fila mentir sobre o próprio código. Fechou **11 itens**, abriu o **73**, e **reabriu o 36** com o status novo `🔄`.

🔴 **Item fechado com decisão errada é pior que item aberto**: ninguém volta para conferir um riscado.

E o **vocabulário** tinha que vir antes do comportamento, senão eu regeneraria os docs duas vezes.

## 🔴 A CPP errada tinha uma TERCEIRA cópia

Refutada em 14/09, e viva em `cru/prolabore.mjs` e `processos-data.mjs` — afirmada como **fato**, na fonte que **gera** o desenho de processo.

🔑 **Sobreviveu por motivo estrutural:** o `verificar-encerrados` varria só os 4 docs de pendência, porque nasceu para pegar assunto voltando como **dúvida**. A CPP **nunca saiu**, afirmada como **verdade**.

✅ A trava ganhou **segunda varredura** (`FONTES_DE_DESENHO` + `CONTRADICOES`), com regra própria e **prova negativa**.

**Regra que fica:** assunto encerrado morre em **lista de pendência** *e* em **fonte de desenho**.

## O que o motor ganhou

`sociosTotal` · `ganhoDeIncluirSocio()` · janela vazia → **Anexo V** (antes **gritava**) · `alertas-internos.mjs` com o **A1** · `salarioMinimoDe(mes)`.

🔴 **O piso por vigência não era manutenção, era bug:** R$1.518 em dez/2025 **era o mínimo legal** e o motor bloqueava. 5 das 16 vidas começam em 2025.

## 🆕 A P21 nasceu porque um invariante cobrava

As 16 vidas abriam **todas** sem faturar no mês 1. ⚠️ E a 1ª versão dela tinha folha zero no mês da abertura — **modelava o cliente recusando a oferta do alerta**, e provava o oposto.

## 🔴 Cinco erros meus, todos pegos por algo que FALHA

Folhas totais diferentes na medição · `emCentavos` numa soma já em centavos · limiar disparando com **R$0,01** · prazo do alerta **15/09 em vez de 15/10** · P21 com folha zero.

**Nenhum foi pego por releitura de código.**

⚠️ **Sempre `.toISOString()` numa data de prazo, nunca `String()`** — o motor guarda vencimento em UTC à meia-noite e o fuso local mostra o dia anterior.

**How to apply:** o relatório antes × depois é `_ANTES-E-DEPOIS-do-contador`, e ele declara onde **não** mudou nada — mostrar só o que mexeu seria mentir por seleção.

Relacionado: [[legalize-contador-valida-o-motor]] · [[legalize-travas-de-metodo-15-09]] · [[legalize-piloto-pro-labore-automatico]].
