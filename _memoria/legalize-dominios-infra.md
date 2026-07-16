---
name: legalize-dominios-infra
description: "Domínios comprados, registrador (Hostinger), email e regra de titularidade CNPJ do Legalizei"
metadata: 
  node_type: memory
  type: project
  originSessionId: 297b62de-8dfb-4ee9-afc4-b67714300780
---

Decisão 2026-07-10: comprar 4 domínios centralizados na **Hostinger** (registrador + email num painel só). ✅ **PAGO 2026-07-13** — Mauro autorizou e quitou tudo (Hostinger R$312,11 + Registro.br R$76,00). Próximo passo operacional: registrar de fato os domínios → apontar DNS pra Vercel → configurar email contato@legalizei.app. Titular = CNPJ Legalize Digital.

Domínios SELECIONADOS (carrinho na Hostinger 2026-07-10, total R$186,03/ano c/ email) — aguardando autorização:
- **legalizei.app** — principal (R$51,99; gTLD Google, força HTTPS)
- **legalizeiapp.com** — defensivo global (R$49,99)
- **legalizeiapp.com.br** — defensivo BR (R$39,99)
- Email Business Starter 12m (R$41,88 ≈ R$3,49/mês) → contato@legalizei.app

A COMPRAR no registro.br (decidido, também pendente de autorização):
- **legalizei.app.br** — Hostinger não revende essa subcategoria; comprar no registro.br (~R$40).

Titular de TODOS os `.br` = CNPJ da **Legalize Digital** (empresa existente do Mauro). Pedro solicitou o CNPJ à responsável (2026-07-10).

Dropado: `legalizei.app.com` (inválido). Já tomados por terceiros: `legalizei.com` e `legalizei.com.br`.

Gmail operacional do projeto (criado pelo Pedro 2026-07-10): **legalizeiapp@gmail.com** — conta Google pra serviços/cadastros do Legalizei (distinto do contato@legalizei.app, que será o email de marca no domínio depois da compra).

Regras/decisões:
- **Titular dos `.br` = CNPJ da Legalize (Mauro), NÃO CPF do Pedro.** registro.br não permite transferência de titularidade PF→PJ, então tem que nascer no CNPJ. Domínio = ativo da empresa (sociedade).
- Email: Hostinger Business Email (~R$2,49/mês), caixa principal **contato@legalizei.app** + aliases.
- App hospedado na **Vercel** — registrador (Hostinger) + hosting (Vercel) + email (Hostinger) convivem via DNS.
- Fonte de verdade da marca/domínio no vault: `marca/decisoes-marca.md` (ADR). Naming aprovado, ver [[legalize-objetivo-e-papel-pedro]].
