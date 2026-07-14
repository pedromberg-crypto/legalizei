---
tipo: marca
etapa: geral
status: vivo
data: 2026-07-09
tags: [marca, decisao]
---

# 📋 Log de decisões da marca (ADR)

> Toda escolha travada da marca vira uma linha datada com o porquê. Evita reabrir o que já foi decidido. Status: 🟡 proposto/em-debate · 🟢 travado · 🔴 revertido.

| Data | Decisão | Status | Racional / fonte |
|---|---|---|---|
| 2026-07-09 | **Nome do produto = "Legalizei"** | 🟢 aprovado (nome de trabalho) | Pedro validou a defesa. Espelha padrão do líder, voz do cliente, "-i" diferencia da matriz. Ver [[naming-defesa]] |
| 2026-07-09 | **Domínio principal = legalizei.app** | 🟢 travado | .com.br indisponível; .app sinaliza "app", moderno, força HTTPS. |
| 2026-07-10 | **Domínios selecionados** (legalizei.app + legalizeiapp.com + legalizeiapp.com.br na Hostinger; legalizei.app.br no registro.br) | 🟢 **PAGO 14/07** | Mauro autorizou e quitou tudo (Hostinger R$312,11 + Registro.br R$76,00). Titular dos .br = CNPJ da **Legalize Digital** (não CPF; registro.br não transfere PF→PJ). Email contato@legalizei.app. Próximo = registrar de fato + DNS Vercel + email. Ver memória `legalize-dominios-infra`. |
| 2026-07-09 | INPI (registro de marca) | 🟡 em avaliação | Encaminhado internamente na contabilidade (Legalize) pra avaliar registrabilidade na classe de serviços contábeis |
| 2026-07-09 | **Marca = digital pura** (não "braço do escritório tradicional") | 🟢 travado | Tese estratégica [[BASE-ESTRATEGICA]] §2 |
| 2026-07-09 | **Tom: humano, transparente, anti-cross-sell** | 🟢 travado (princípio) | Oposto do líder ([[_relatorio-auditoria]], [[spec-mvp-v0]]) |
| 2026-07-10 | **Arquétipo = Aliado leve/vitorioso** | 🟢 travado | Cliente é herói, marca é aliado que carrega o chato. Responde à ferida "tem contador de verdade?" e ocupa a ponta quente-humana vazia. Ver [[conceito-marca]] §4 |
| 2026-07-10 | **Cor líder = CORAL (Direção A)** + sistema disciplinado de 2 cores (coral marca + base ink) | 🟢 travado | Decidido vendo lockup materializado. Coral quente = única cor vazia num setor azul-esverdeado frio; craft impecável neutraliza risco de "informal". Ver [[referencias]], [[_sintese-paginas-publicas]] |
| 2026-07-10 | **Tom exato do coral = #F2643C** (opção 2 de 4) | 🟢 travado | Escolhido vendo 4 tons aplicados (terracota→vivo). Equilíbrio otimismo/credibilidade; nem berrante nem wellness. |
| 2026-07-10 | **Paleta de cor v1 validada** (coral 50-900, ink/neutros, semânticos) | 🟢 validado | [[paleta-cores]]. Regras: coral=marca+ação (600 fill AA), coral nunca é erro, fundo papel quente, azul banido como marca. |
| 2026-07-12 | **Logo travado** — símbolo = quadrado coral com check **vazado + sangrado** (canto sup-dir), fundo do check **branco sólido** (robusto sobre foto); wordmark "Legalizei" em **Sora estilizada** ink | 🟢 travado | Pedro (designer). Fusão recorte-negativo + sangrado. Master: [[legalizei-logo-horizontal.svg]]. Ver [[2026-07-12-logo-fechado]] |
| 2026-07-12 | **3 pontos de coral** (ícone + pingo dos 2 "i") | 🟢 travado | Escolha do Pedro sobre "só i-final". Ritmo coral ícone→i→i; funciona com pingos reduzidos (r13,24). Exceção consciente à regra "1 coral por lockup". |
| 2026-07-12 | **Specs do lockup** — ícone 1,4× H, centrado na faixa capitular, gap = 1× haste do L, raio ~0,27× lado | 🟢 travado | Verificadas no SVG (sub-pixel). Régua de proporção em [[2026-07-12-logo-fechado]]. |
| 2026-07-12 | **Fonte Sora = todo o sistema** (display, títulos, corpo, UI) | 🟢 travado | Pedro cravou — não é só o wordmark. Outras sondadas e **descartadas**: Fraunces, Bricolage Grotesque, Space Grotesk, Schibsted Grotesk, Instrument Serif. Handoff pro dev: [[handoff-cores-fonte-dev]]. Ver [[legalize-fonte-sora-sistema]]. |
| 2026-07-12 | **Logo p/ app = versão fundo composto** (quadrado coral sólido + check branco POR CIMA) | 🟢 travado | Sobre fundo claro, o check vazado do master original fica "oco". Quadrado sólido + check por cima = alto contraste, funciona em qualquer fundo. Uso em UI/app-icon. Arquivo `legalizei-logo-app-fundo-solido.svg`. |
| 2026-07-13 | **Copy da marca NUNCA usa travessão** (`—` em/en dash) | 🟢 travado | Regra dura do Pedro (reiterada com ênfase). Vale pra TODO texto público: LinkedIn, IG, LP, gate, wizard, deck, bio. Reescrever com ponto, vírgula, "e" ou frase separada. Já aplicado em gate/LP/entrada/fase-0. Ver [[legalize-prototipo-ux]]. |
| 2026-07-13 | **"Sobre" oficial da marca (Visão geral)** = texto A (contabilidade digital de quem vive de prestar serviço; celular+WhatsApp; nativo digital + escritório 20+ anos BH/MG; "você cuida do negócio, a gente cuida da papelada") | 🟢 travado | Reusar em LinkedIn/IG/site com ajuste de tamanho. Tom de marca (leve, "você/a gente"), zero travessão, sem número/preço (anti-guru), sem citar concorrente. |
| 2026-07-12 | **Regra AA do coral-600 em botão**: branco sobre coral-600 = 4,04:1 → passa AA **só em texto grande** (≥18,66px bold / ≥24px). Botão primário sempre com fonte ≥1,2rem bold; botão pequeno usa **coral-700** de fill; **hover escurece** (coral-700), nunca clareia pra coral-500 | 🟢 travado | Auditoria AA da LP (review multi-agente). Corrige a premissa "600 = fill AA" da paleta: vale, mas condicionada ao tamanho. Aplica também a texto branco sobre coral-500 (3,15:1 — só decorativo/texto grande). Ver [[paleta-cores]] · [[2026-07-12-lp-construida]]. |
| 2026-07-13 | **Claim/hero de posicionamento = "A única contabilidade 100% digital de verdade"** (guerrilha vs concorrentes, com cores dos rivais sem logo) | 🟢 travado | Alinhamento 13/07. Claim de **marketing**, não de operação — internamente sabe-se que ~15-20% exige humano ([[2026-07-10-teto-automacao-orgaos-sem-api]]). Diferencial = ser o único sincero desde a entrada (validador CNAE) + humano quando precisa. Ver [[2026-07-13-alinhamento-pedro-dev-leonam]]. |

## Links
- [[marca]] · [[naming-defesa]]
