---
tipo: marco
data: 2026-07-12
tags: [produto, ux, prototipo, fluxo, decisao]
---

# 🚪 Fluxo de entrada travado + arranque do protótipo UI

> Flow de design: definimos a arquitetura da porta de entrada do app e arrancamos o protótipo visual das telas.

## Método do protótipo (travado)
- **Página-primeiro, DS emerge dela** (não Design System antes). Constrói 1 página rica → valida → extrai tokens/componentes → replica. DS = consolidação no fim, não largada. Escolha do Pedro (vem de design; DS-first já falhou pra ele — projetar token no vácuo rende retrabalho na hora de criar).
- **Throwaway HTML + Tailwind** em `ux-ui/prototipo/` — prancha viva de design, **NÃO o app**. Dev recria no Expo/RN (stack real). Serve pra validar cor/tipografia/espaçamento de verdade (código real, não Figma).
- **Loop:** `python -m http.server 4599` na pasta + Chrome com F5. Cores + Sora já plugados. `prefers-reduced-motion` respeitado.
- Regra: zero hex/px cru — tokens desde a 1ª linha.

## Régua: MLP, não MVP
Corrigido pelo Pedro: é **Mínimo LOVABLE Product**, não Viável. Craft e encanto (animações, micro-interações) entram no escopo, não são luxo. O diferencial vs Contabilizei é experiência. ⚠️ `spec-mvp-v0.md` ainda diz "MVP" em vários pontos — corrigir. Ver [[legalize-mlp-nao-mvp]].

## Fluxo de entrada (travado)
Sequência: **Splash → Fork → Gate CNAE → Login → Wizard Fase 0/1**.

1. **Splash unificada** — não é tela estática separada. Logo se monta no centro (ícone aparece → check faz wipe → desliza p/ esquerda → wordmark completa), **sobe pro header** e os CTAs entram em cascata. Uma tela só.
2. **Fork (obrigatório):** "Abrir minha empresa" (do zero) vs "Migrar de contador" (já tem CNPJ). Os dois têm **estados de dado opostos**:
   - **Migrar:** digita CNPJ → API puxa **cartão CNPJ** → autofilla razão/CNAE/natureza/capital/endereço + sócios (nomes); **valida o gate na hora**; wizard encolhe a uma confirmação. Momento "uau". ⚠️ CPF dos sócios vem **mascarado** pela Receita → PII do sócio (CPF completo, RG, estado civil) ainda precisa ser digitada. Provider da API a confirmar c/ dev (InfoSimples/CNPJá). Viável: federal é consultável (ver [[spec-mvp-v0]] §4).
   - **Abrir:** não tem CNPJ → cai no concierge de CNAE.
3. **Gate de CNAE cedo — concierge, não porteiro.** Campo livre "o que você faz?" + **IA** sugere CNAE(s) da whitelist (460 atendidos) com descrição/anexo em linguagem humana. Filtra ANTES de investir esforço (anti-frustração), disfarçado de ajuda. IA sugere **só da whitelist**. Não-atendidos (804) e condicionais (68 — médico/adv/arq) = **waitlist/futuro** (captura o lead, não beco). Escolha: IA que entende linguagem natural, não busca por palavra-chave (é MLP). Base: [[cnae-atendidos-e-nao-atendidos]].
4. **Login = deferido (deferred signup).** Valor antes do compromisso. Sem login na entrada; cadastro entra só DEPOIS do gate (usuário qualificado = motivado) e ANTES da coleta de PII pesada. **Mito corrigido:** baixar o app NÃO dá nenhum dado cadastral — só CNPJ digitado (via API) ou digitação. Consentimento LGPD encaixa no cadastro.

## Entregas do flow
- `execucao/handoff-cores-fonte-dev.md` — cores (3 escalas) + **Sora (sistema inteiro)** em CSS vars + Tailwind, pro dev iniciar Fases 0/1.
- `ux-ui/prototipo/fluxo-entrada.html` — splash animada + fork (logo real, montagem centro→header).
- `ux-ui/prototipo/fase-0-dados-socio.html` — 1ª tela do wizard (dados do sócio).
- `ux-ui/prototipo/entrada.html` — welcome/landing v1.
- `ux-ui/prototipo/legalizei-simbolo.svg` + logo horizontal (versão fundo composto).

## Links
- [[spec-mvp-v0]] · [[fluxo-abertura-portais-pedro-dev]] · [[cnae-atendidos-e-nao-atendidos]] · [[decisoes-marca]] · [[2026-07-12-logo-fechado]] · [[legalize-prototipo-ux]] · [[HOME]]
