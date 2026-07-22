---
name: legalize-contabilizei-dossie-coverage
description: Dossiê READ-ONLY da plataforma LOGADA da Contabilizei (o líder). ~60% coberto. Base pra montar nosso portal interno. Diz o que já foi lido e ONDE CONTINUAR.
metadata: 
  node_type: memory
  type: project
  originSessionId: 78f8fc8b-c410-4fe7-92a2-0df9ccb4eaff
  modified: 2026-07-22T11:33:45.776Z
---

Dossiê da plataforma **logada** da Contabilizei (conta real do Pedro, READ-ONLY) em `pesquisa/concorrentes/contabilizei/2026-07-21-dossie-plataforma-logada.md`. Base pra montar a **parte interna do nosso app** (o portal pós-abertura). Datado 21–22/07. **Cobertura ~60%.**

**3 achados que mandam:** (1) a conversão do líder é **MEDO** (dunning: exclusão do Simples, multas R$450, "o que você perde") = flanco ético nosso; (2) eles deixam **loops abertos** — o cliente **confirma manual se pagou o imposto**, envia extrato manual = nosso maior espaço pra encantar (pagar pelo app); (3) pró-labore inteligente eles **já têm**, mas é **seletor de 4 presets** (auto/personalizado/mín/teto), **NÃO um simulador** → nosso N18 interativo ganha. **Grade de preço viva:** Básico R$139 · Padrão R$195 · Multi R$225 · Experts R$395 · Manutenção R$79 (+ surcharge oculto de faturamento/funcionários). ⚠️ **atualizar [[legalize-benchmark-padrao-195]]** com isso.

**JÁ LIDO (a fundo):** Home/Central de Rotinas · Sócios→Central de Sócios + Editar pró-labore · Impostos a pagar + Minhas alíquotas + Simulador · Notas (consultar + wizard de emitir) · Mensalidade→Central de planos. **Superfície/menu só:** Relatórios (flyout) · Serviços adicionais (flyout). **17 popups** catalogados (P1–P17).

**ONDE CONTINUAR (~40% restante):** por DENTRO → Relatórios (DRE/Balanço/Declarações) · Folha de Pagamento · Meus Benefícios/Plano de Saúde · Cobrar seu cliente · Conta Digital PJ · Minha conta/Dados. Também: **app mobile** · os **números computados** do Simulador · a **decomposição interna do DARF** (⚠️ clicar na linha da guia TRAVA o renderer — abre PDF/impressão nativa; achar outra rota).

**Notas de método (pra retomar rápido):** nav lateral = **flyouts** (clicar abre menu, sub-item navega; alguns abrem **nova aba**) · `get_page_text` na Home dumpa TODOS os modais do DOM (ganho grátis) · **CSAT popups** aparecem (fechar no X, não responder) · **read-only SAGRADO** (nada de emitir/pagar/confirmar/salvar; sessão expira, o Pedro re-loga — eu NÃO logo por ele).

Ligações: [[legalize-cnae-fiscalmente-otimo]] (nosso N18 vs o preset deles) · [[legalize-benchmark-padrao-195]] (preço) · [[legalize-cobaia-cnpj-pedro]] (o Fator R 37% confere).
