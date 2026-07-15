---
tipo: marco
data: 2026-07-15
tags: [produto, ux, spec, testes, arquitetura, onboarding]
---

# 🏁 Marco 2026-07-15 — Spec de telas (Entrada+B1+B2) + arquitetura do motor de testes

> Flow de lapidação: mapa de telas, 6 personas de teste, spec campo a campo das telas de entrada/B1/B2, e a arquitetura de como rodar testes de fluxo rápido e barato (só motor). Continuação de [[blocos-fluxo-abertura]].

## O que ficou travado

### 1. Mapa de telas mobile ([[mapa-telas-mobile]])
- Protótipo cobre **telas 1–6** (entrada + B1 + começo do B2, `fase-0-dados-socio`).
- Faltam **8 do B2** (2.2→2.9) + **6 do B3** (checkout). B4+ nem specado.

### 2. Seis personas de teste ([[casos-teste-fluxo-cnae]])
- 1 liso ("Reta") + 4 clusters isolados (unitário) + 1 "Monstro" (integração + bordas de escopo).
- CNAEs aterrados em [[cnae-atendidos-e-nao-atendidos]] (🟢 = confirmado na matriz; 🟡 = média, confirmar).
- Regra: um caso não liga condicionais mutuamente exclusivas; o Monstro empilha só o que coexiste.

### 3. Spec campo a campo ([[spec-telas-entrada-b1-b2]])
- Todas as telas de Entrada + B1 + B2 com input / validação / margem de erro / IA-microdetalhe.
- **3 adições desta rodada:**
  - **Limite de sócios: 3 no total** (1 + 2 adicionais), espelha Contabilizei. 🟡 confirmar se é 3 ou 2.
  - **Upsell endereço fiscal** (add-on ~R$60/mês, 🟡 preço nosso): não bloqueia, salva flag no dossiê, injeta automático no plano do B3. Resolve gargalo "sem endereço comercial".
  - **CPF valida existência/situação cadastral** (não só dígito verificador). 🟡 provider (Serpro/InfoSimples/CNPJá, mesmo pool do cartão CNPJ).

### 4. Arquitetura do motor de testes (decisão de engenharia)
- **Separar motor (lógica headless) da tela (UI fina).** Persona = **dado (fixture JSON)**, não clique.
- **3 camadas, mesma fixture:** (1) fixtures de persona; (2) runner headless valida a lógica agora, em ms, sem UI e **sem gastar token** (IA de mapeamento CNAE vem "dublada" pela persona); (3) piloto-automático + deep-link (`?persona=x&step=2.8`) reusa a fixture pra QA visual depois.
- **Pausas de órgão/contador/usuário = eventos roteirizados na persona** ("JUCEMG aprovou em 5 dias"). O motor testa parar/esperar/retomar idempotente, não o órgão. Mapeado p/ B1/B2/B3; pausas pesadas são B4+ (identificadas, não specadas).
- **Persona = entidade durável cross-flow.** Abertura = flow #1; depois portal (nota, vencimentos...). Motor genérico; **adicionar flow futuro = adicionar arquivo, não reescrever**. Livro-caixa ganha coluna `flow`.
- **Livro-caixa de testes (append-only, o runner grava sozinho):**
  - **Log de corridas:** `test_id` (global, pra sempre) · `persona` · `persona_seq` · `flow` · `data` · `versao_flow` · `resultado` · `trilha`.
  - **Log de ajustes:** `ajuste_id` · `test_id` · `passo` · `frase curta` · **`fonte`** ([[link]] concorrente/reunião/lei = ponte pro cruzamento de dados).
- **Diretriz pro Dev (travar antes de codar telas):** motor-primeiro (núcleo headless) + UI fina. Senão retrabalho.

## Próximo passo
- **Janela nova:** construir o mínimo do motor em `execucao/motor-testes/` — engine + persona "Reta" + livro-caixa rodando via `node run.js reta` — validar formato, depois escalar pras 6 personas.

## 🟡 Pendências herdadas
- Limite sócios 3 ou 2? · preço endereço fiscal · provider CPF/CNPJ · valores fiscais vigentes · política de senha · **especificar B4+** (constituição, pausas de órgão).

## Links
- [[blocos-fluxo-abertura]] · [[mapa-telas-mobile]] · [[casos-teste-fluxo-cnae]] · [[spec-telas-entrada-b1-b2]] · [[HOME]]
