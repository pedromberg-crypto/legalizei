---
name: legalize-lp-construida
description: "LP v1 construída em ux-ui/lp/ (HTML/CSS/JS puros, local); regra AA coral travada; pendências antes de publicar"
metadata: 
  node_type: memory
  type: project
  originSessionId: 98ee247a-6c37-4e9f-8a6b-ea2646eed978
---

LP do Legalizei **construída 2026-07-12** em `ux-ui/lp/` (index.html + styles.css + script.js + assets/) — 100% client-side, zero backend. 9 dobras; validador CNAE concierge com whitelist real. Servir com `npx serve ux-ui/lp -l 4173` (config `lp` em `.claude/launch.json`).

Decisões que valem além da LP:
- **Regra AA do coral (ADR):** branco+coral-600 = 4,04:1 → AA só texto grande (≥1,2rem bold). Botão pequeno = coral-700. Hover escurece, nunca clareia. ink-400 proibido como texto sobre fundo claro (mín. ink-500).
- **Validador: regulamentada vence verde** (advogado+consultoria → waitlist). Word boundaries: `\bapp\b`, `\bbar\b`, `marcas?\b`.

Pendências pré-publicação: Sora local (woff2, hoje Google Fonts) · links reais das lojas · backend waitlist · páginas Termos/Privacidade · review visual do Pedro. Ver [[legalize-prototipo-ux]].
