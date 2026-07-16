---
tipo: historico
status: congelado
data: 2026-07-10
etapa: reporte-tecnico
tags: [reporte, tecnico, dev, arquitetura, seguranca, automacao]
---

# 🏢 Reporte técnico — Pedro Dev (07 a 10/07/2026)

> Reporte que o **Pedro Dev** mandou na sexta (10/07), documentado junto do reporte de sociedade ([[evolucao-para-mauro]]). Visão de fundação técnica do app: stack, segurança, arquitetura de automação e mapa da operação. Linguagem de negócio (não técnica) por escolha do próprio dev.

## ⚙️ Programação do app
- **Stack e linguagens definidas** para o aplicativo.
- **Mobile-first:** app totalmente voltado pro celular + **réplica web** pra usar no navegador.
- App feito **do zero**.
- **Atrito encontrado:** logística de **constituir a empresa sem passar por um humano** — já em solução (ligado a [[2026-07-10-teto-automacao-orgaos-sem-api]], órgãos sem API).

## 🔒 Segurança do app
- Dados em **banco seguro na nuvem**; **isolamento por cliente ponta a ponta** (cada cliente só vê o dele).
- **Certificado digital em banco separado** — mesmo com acesso ao banco principal, os certificados não são visíveis.
- Proteção estrita dos dados sensíveis, **conformidade LGPD**.

## 🤖 Robôs "funcionários" (departamento de legalização)
- Robôs preenchem dados nos portais; cada processo com um robô, guiados por um **robô gerente**.
- É o **departamento de legalização automatizado** do app.

## 🗺️ Mapa da operação
1. **Entrevista de abertura por IA** — cliente descreve o que faz nas palavras dele; IA identifica a atividade oficial: **CNAE, tributação, CNAE secundário**. (Casa com o validador CNAE do protótipo/LP → [[legalize-prototipo-ux]].)
2. **Constituição** — processo até **abertura do CNPJ + emissão do certificado digital**.
3. **Portal do cliente** — pós-constituição, cliente vê todos os dados e acessa serviços: **emissão de nota, verificação de dados, vencimentos**. Notificações por **e-mail e WhatsApp**.

## 🚧 Em andamento / próximo
- Construindo a **infraestrutura** pra rodar e preparar o ambiente dos **assinantes do SaaS**.
- Construindo a **1ª versão do protótipo de backend** pra testar automações: IA, **qualificação de lead**, **onboard** do cliente na primeira vez.
- **Semana que vem:** concluir esses primeiros testes de fundo do app + **alinhar identidade visual + branding com o Pedro (PM)**.

## Links
- [[evolucao-para-mauro]] · [[2026-07-10-teto-automacao-orgaos-sem-api]] · [[2026-07-09-stack-e-mlp-decididos]] · [[legalize-prototipo-ux]] · [[spec-mvp-v0]] · [[HOME]]
