---
name: legalize-contabilizei-dossie-coverage
description: Dossiê READ-ONLY da plataforma LOGADA da Contabilizei (o líder). ~60% coberto. Base pra montar nosso portal interno. Diz o que já foi lido e ONDE CONTINUAR.
metadata: 
  node_type: memory
  type: project
  originSessionId: 78f8fc8b-c410-4fe7-92a2-0df9ccb4eaff
  modified: 2026-07-22T11:53:44.155Z
---

Dossiê da plataforma **logada** da Contabilizei (conta real do Pedro, READ-ONLY) em `pesquisa/concorrentes/contabilizei/2026-07-21-dossie-plataforma-logada.md`. Base pra montar a **parte interna do nosso app** (o portal pós-abertura). Datado 21–22/07, **3 passadas. Cobertura ~85%.**

**4 achados que mandam:** (1) a conversão do líder é **MEDO** (dunning: exclusão do Simples, multas R$450, "o que você perde") = flanco ético nosso; (2) eles deixam **loops abertos** — o cliente **confirma manual se pagou o imposto**, envia extrato manual = nosso maior espaço pra encantar (pagar pelo app); (3) pró-labore inteligente eles **já têm**, mas é **seletor de 4 presets** (auto/personalizado/mín/teto), **NÃO um simulador** → nosso N18 interativo ganha; (4) 🆕 **o preço anunciado é só o piso** — há uma **camada à-la-carte de ~45 serviços avulsos** (§F) onde todo evento sensível é paywall: **sair R$1.406–1.999 · alterar empresa/add sócio a partir de R$1.299 (confirma com número o "add sócio depois é caro") · DECORE R$713,90 · declaração p/ abrir conta PJ R$68,90 · CND R$35,90 · alvará R$416 · verificação de pendências R$24,90 = isca de funil**; e a mensalidade **reajusta todo ano por IGP-DI** (P18, vendido pelo chat como conversa calorosa). **Grade de preço viva:** Básico R$139 · Padrão R$195 · Multi R$225 · Experts R$395 · Manutenção R$79 (+ surcharge oculto de faturamento/funcionários + camada à-la-carte). ⚠️ **atualizar [[legalize-benchmark-padrao-195]]** com isso.

**JÁ LIDO (a fundo):** Home/Central de Rotinas · Sócios→Central de Sócios + Editar pró-labore · Impostos a pagar + Minhas alíquotas + Simulador · Notas (consultar + wizard de emitir) · Mensalidade→Central de planos · **Relatórios por dentro (DRE renderizado + shell legacy dos 5 contábeis + Declarações mensais) · Serviços adicionais por dentro (CATÁLOGO à-la-carte inteiro c/ preços) · Cobrar seu cliente (gateway cartão+pix, SEM boleto) · Folha (Colaboradores) · Meus Benefícios (landing upsell, 2 de 7) · Minha conta (drawer) + painel Dados da empresa**. **18 popups** catalogados (P1–P18). Novos sinais: **referral "Indique um amigo"+pontos** · **sistema de chamados FORA DO AR** · **upsell "experts" fixo no topbar**.

**ONDE CONTINUAR (~15% restante, tudo marginal):** **Conta Digital PJ por dentro** (⚠️ NÃO acessado de propósito — banco real, read-only sagrado) · **app mobile** (sem device; App Store id1622060253 · Play br.com.contabilizei.app) · números concretos do Simulador (mecânica já documentada) · 7 benefícios do Multibenefícios · Plano de Saúde por dentro · decomposição interna do DARF (⚠️ clicar na linha da guia TRAVA o renderer — composição já veio de *Minhas alíquotas*).

**Notas de método (pra retomar rápido):** nav lateral = **flyouts** (clicar abre menu, sub-item navega; alguns abrem **nova aba**) · `get_page_text` na Home dumpa TODOS os modais do DOM (ganho grátis) · **CSAT popups** aparecem (fechar no X, não responder) · **read-only SAGRADO** (nada de emitir/pagar/confirmar/salvar; sessão expira, o Pedro re-loga — eu NÃO logo por ele).

Ligações: [[legalize-cnae-fiscalmente-otimo]] (nosso N18 vs o preset deles) · [[legalize-benchmark-padrao-195]] (preço) · [[legalize-cobaia-cnpj-pedro]] (o Fator R 37% confere).
