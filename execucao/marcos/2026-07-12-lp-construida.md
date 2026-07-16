---
tipo: historico
status: congelado
data: 2026-07-12
tags: [marco, mkt, ux, feature]
---

# 🏁 Marco — Landing page construída (v1 local)

> LP de conversão do Legalizei construída do zero em `ux-ui/lp/` (HTML+CSS+JS puros, 100% client-side, zero backend). Objetivo único: download do app. Passou por review multi-agente (5 dimensões, 59 agentes) — 51 achados confirmados e **todos aplicados**.

## O que existe
- `ux-ui/lp/index.html` + `styles.css` + `script.js` + `assets/` (lottie local, 4 animações recoloridas do protótipo).
- **9 dobras:** hero (headline + traço coral animado + mockup do app com gradiente assinatura + avião Lottie) · marquee escuro de burocracias ("tudo isso deixa de ser problema seu") · **validador de CNAE concierge** (peça-chave) · 4 diferenciais c/ Lottie · 3 passos · prova 22 anos + chat WhatsApp mockado · tabela nós vs. outros · FAQ 5 perguntas · CTA final no gradiente ink+glow coral.
- Validador usa a whitelist real ([[cnae-atendidos-e-nao-atendidos]]): 7 atendidos ✅ + 3 lista de espera ⚠️ (médico/advogado/transporte) + caminho "já sei meu CNAE" com máscara `0000-0/00`.

## Decisões técnicas do validador (valem pro app também)
- **Atividade regulamentada SEMPRE vence match verde** ("faço consultoria jurídica" → advocacia/waitlist, não consultoria). Racional: falso "não" vira lead na waitlist; falso "sim" vira promessa quebrada. Tradeoff aceito: "software para clínicas" cai em waitlist.
- Word boundaries nos gatilhos curtos: `\bapp\b` (não casa "WhatsApp"), `\bbar\b` (não casa "barbearia"), `marcas?\b` (não casa "marcenaria").
- "Não entendi" = mensagem persistente + texto do usuário preservado (nunca apagar o que ele escreveu).

## A11y (aprendizados pro Design System)
- Regra AA do coral em botão → registrada no ADR [[decisoes-marca]].
- ink-400 nunca como cor de texto sobre fundo claro (2,8:1) — mínimo ink-500.
- Validador: live region única `role="status"` + foco gerenciado (`tabindex="-1"` + `.focus()`) a cada troca de estado; erro com `role="alert"` + `aria-describedby`.
- Marquee: botão pausar visível (WCAG 2.2.2), duplicação com `aria-hidden`, reduced-motion vira wrap estático.
- Inputs ≥16px (zoom automático do iOS Safari).

## Pendências
- **Fonte Sora ainda via Google Fonts** (fallback de sistema) — bundle woff2 local antes de publicar.
- Links reais das lojas (App Store / Google Play) quando existirem; páginas Termos/Privacidade.
- Waitlist de e-mail é fake client-side — ligar num backend/planilha quando publicar.
- Visual review humano (screenshot do painel travou na sessão; testes foram estruturais/funcionais).

Links: [[legalize-prototipo-ux]] · [[2026-07-12-fluxo-entrada-completo-prototipo]] · [[paleta-cores]]
