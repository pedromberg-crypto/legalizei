---
tipo: artefato
data: 2026-07-08
concorrente: Contabilizei
fonte: email
gatilho: onboarding
tags: [concorrente, insight, ux]
---

# 🗺️ Onboarding Contabilizei — jornada ponta a ponta (vivida pelo Pedro, dez/2025–jan/2026)

> Reconstruída dos 26 emails da janela 10/12/2025 → 08/01/2026 (conteúdo completo lido). Perfil: abertura de ME serviço (consultoria marketing), BH. **Do cadastro ao CNPJ + dispensas: ~23 dias.** Originais no Gmail, marcador `Contabilizei`.

## A linha do tempo

| Dia | Data | O que chega | Canal | Leitura |
|---|---|---|---|---|
| **D0** | 10/12 | **"Pagamento disponível"** — boleto ANTES de qualquer entrega + instrução: *"crie sua senha clicando em Esqueci minha senha"* | email automático | 💰 Cobram no D0 · 🔴 **senha nasce por fluxo de RESET** |
| D0 | 10/12 | Boas-vindas humanas (Zendesk, time "Cadastro"): manual de preenchimento; definir razão social, capital, natureza, enquadramento | chamado + humano | Humano cedo ✓ · mas joga formulário denso no colo |
| D0 | 10/12 | **Pedido de avaliação do atendimento** (survey) | Zendesk | 🔴 Pedem nota no D0, antes de entregar valor |
| D+1 | 11/12 | Resets de senha ×5 · "[Abertura] Sua empresa está sendo criada" (confere razão social ajustada por especialistas, nome fantasia, regime) · "[Abertura] Criação da assinatura digital" → **exige conta GOV.BR nível Ouro** | email | ✓ Especialistas ajustam razão social (bom) · 🔴 atrito GOV.BR terceirizado ao cliente |
| D+2 | 12/12 | Resets ×2 · **"Hora de assinar os documentos" — "Passo 3 de 6"** com trilha visual das etapas · time chama no **WhatsApp** pra assinatura · alerta anti-fraude (canais oficiais) | email + WhatsApp | ✓ **Progress bar por email (copiar)** · ✓ anti-golpe no D+2 · ✓ multicanal |
| D+5 | 15/12 | Zendesk BH (time "Prefeitura e Resolutivo"): IM emitida ✓ · licenciamento **exige cliente anexar E-CNPJ na plataforma** · aviso de taxas municipais BH | chamado | 🔴 Mais ação manual empurrada ao cliente · times INTERNOS especializados por etapa (vaza a estrutura deles) |
| D+12 | 22/12 | Operacional fim de ano: suporte fecha 24–25/31–01 · **emissor de NF indisponível 31/12→02/01 (migração emissor nacional/Reforma Tributária)** | email | Transparência operacional ✓ |
| D+13 | 23/12 | **"Ação necessária: ative o certificado digital"** (sem ele: multas, juros, bloqueios — grátis no plano) · **upsell "Cobre Seu Cliente"** desbloqueado pelo certificado (link de pagamento, taxas por transação) | email | Medo como motor · 🎯 **cross-sell fintech no D+13** — certificado vira isca de produto financeiro |
| D+15 | **25/12 (Natal)** | Educativo denso: pró-labore, Fator R, duplo vínculo | email | 🔴 **Automação cega de calendário** — email de imposto no Natal |
| D+22 | **01/01 (Ano Novo)** | "Primeiras NFs: como funciona e o que evitar" | email | 🔴 De novo — régua ignora feriado |
| D+23 | 02/01 | Zendesk (time "Alvará e taxas"): dispensas Sanitária + Bombeiros emitidas ✓ + survey | chamado | Fim da abertura burocrática |
| D+25 | 04/01 | Playlist de vídeos (1 min) sobre NF + convite pra Live + **"agende sua reunião de boas-vindas"** | email | ✓ Educação em micro-formato · jornada de boas-vindas formal continua |
| D+29 | 08/01 | **1ª fatura mensal** + push forte de débito automático | email | Ciclo de billing assume |

## As 6 etapas internas deles (reveladas na trilha dos emails)
1. Análise das informações → 2. Criação da assinatura digital (GOV.BR) → 3. Assinatura dos documentos (WhatsApp) → 4. Organização financeira (regime + conta PJ) → 5. Emissão do CNPJ e regularização → 6. (pós: certificado + licenciamento municipal)

## 🥇 Os 10 achados

1. **Senha por fluxo de reset** — o onboarding INSTRUI "Esqueci minha senha" pra criar conta → os 7 emails de reset do Pedro. Não é bug, é preguiça de produto institucionalizada.
2. **Cobrança no D0**, entrega depois. O boleto é o primeiro email da relação.
3. **"Passo X de 6" com trilha visual** em cada email de abertura — a melhor coisa do fluxo deles. Copiar e melhorar (in-app + email).
4. **Atrito terceirizado:** GOV.BR nível Ouro + anexar E-CNPJ na plataforma = os 2 prováveis pontos de abandono/lentidão. Nosso back-end Legalize pode absorver/acompanhar por WhatsApp com gente.
5. **Survey de avaliação em TODO chamado, começando no D0** — pedem nota antes do valor. Irritante e mede errado.
6. **Automação cega de calendário:** emails densos em 25/12 e 01/01. Régua sem consciência de contexto — nosso produto nasce com calendário humano.
7. **Times internos especializados por etapa** (Cadastro · Prefeitura e Resolutivo · Alvará e taxas) — a "linha de produção" deles vaza nos remetentes. Insumo pro nosso desenho de ops.
8. **Cross-sell fintech no D+13:** certificado (grátis, obrigatório) desbloqueia "Cobre Seu Cliente" (receita transacional). O certificado é isca de produto financeiro — roadmap deles às claras.
9. **Multicanal com humano nos momentos críticos** (WhatsApp pra assinatura) — validam nossa tese: humano onde dói, software no resto.
10. **~23 dias do cadastro ao CNPJ+dispensas em BH** (com feriados no meio) — **este é o benchmark a bater.** Contajá promete 72h pra partes do fluxo; a régua real do líder é semanas.

## O que o Legalizei copia × corrige

| Copiar | Corrigir |
|---|---|
| Progress bar "passo X de N" em tudo | Senha criada NATIVAMENTE no primeiro acesso (nunca via reset) |
| Anti-fraude cedo na relação | Cobrar com contexto (junto do 1º valor entregue, não como 1º contato) |
| Humano via WhatsApp na assinatura | Absorver GOV.BR/E-CNPJ com acompanhamento assistido (back-end Legalize) |
| Micro-vídeos de 1 min | Survey só DEPOIS de valor entregue (CNPJ na mão) |
| Transparência operacional (manutenções) | Régua com consciência de feriado |

## Links
- [[playbook-crm-contabilizei]] · [[emails-onboarding]] · [[emails-acesso-seguranca]] · [[contabilizei]] · [[2026-07-08-mapeamento-emails-contabilizei]] · [[HOME]]
