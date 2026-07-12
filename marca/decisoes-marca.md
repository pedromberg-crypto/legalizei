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
| 2026-07-10 | **Domínios selecionados** (legalizei.app + legalizeiapp.com + legalizeiapp.com.br na Hostinger; legalizei.app.br no registro.br) | 🟡 aguarda autorização de compra | Carrinho montado (R$186/ano), mas Pedro **ainda não autorizado** a comprar (provável Mauro/dono do CNPJ). Titular dos .br = CNPJ da **Legalize Digital** (não CPF; registro.br não transfere PF→PJ). Email contato@legalizei.app. Ver memória `legalize-dominios-infra`. |
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

## Links
- [[marca]] · [[naming-defesa]]
