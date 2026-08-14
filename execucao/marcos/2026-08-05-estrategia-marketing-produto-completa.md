---
tipo: marco
status: vivo
data: 2026-08-05
assunto: estrategia-marketing
tags: [marco, marketing, estrategia]
---

# 🏁 Marco — Estratégia de marketing/produto completa (14/14 slots)

> 26º flow. Instanciado o template `pessoal/_templates/estrategia-digital` (14 documentos, 4 fases) inteiro dentro do vault Legalizai Story Book, primeiro fazendo gap-analysis do que já existia, depois preenchendo os 7 slots que faltavam e corrigindo 3 slots que existiam mas continham erro.

## O que foi feito

**Gap-analysis inicial:** comparação de 14 slots do template contra o vault existente — 4 sólidos (benchmarking, matriz, insights, posicionamento), 3 esqueleto/fraco (metodologia, go/no-go, personas), 7 buracos reais (economia/preço, metodologia+individual de persona de marketing, orgânico inteiro, tráfego pago estruturado inteiro).

**Fase 0 — Mercado:**
- `pesquisa/metodologia-descoberta.md` — remontagem do framework já existente (2 lentes)
- 5 concorrentes remontados (`contaja.md`, `agilize.md`, `facilite.md`, `marvee.md`, `contabilivre.md`) + `matriz-comparativa.md` + `insights-estrategicos.md`
- `pesquisa/economia-preco-cac.md` — **preço ME travado em R$139,00** (era R$195,00), custo técnico simbólico (API R$10 + sistema R$5), CAC-alvo calculado
- `pesquisa/validacao-ideia.md` — gate go/no-go 7 critérios

**Fase 1 — Público:**
- `pesquisa/posicionamento.md` — remontagem do conceito de marca já travado
- `pesquisa/metodologia-personas.md` — sistema dorsal/volante
- 3 personas dorsais (`pesquisa/personas/`) + 9 volantes (`pesquisa/personas/volantes/`)

**Fase 2 — Orgânico:**
- `pesquisa/estrategia-organica.md` — Instagram como canal primário, pilares por bloco de funil
- `pesquisa/mecanicas-engajamento.md` — mecânica "Pergunta que ninguém explica"

**Fase 3 — Tráfego pago:**
- `pesquisa/estrutura-funil-trafego.md`, `pesquisa/funil-conversao.md`, `pesquisa/frente-1-captacao-meta-bh.md`

**2 pesquisas de mercado novas** (Gemini/Google Search, sob demanda — nova regra de trabalho): `pesquisa/perfil-microempreendedor-mercado.md` (demografia/comportamento) e `pesquisa/trafego-pago-contabilidade-mercado.md` (CPL/CAC específico do nicho contábil).

## Achados que mudaram decisão real

1. **CAC-alvo original estava matematicamente errado.** Calculado sobre margem de 1 mês em vez de LTV — corrigido pra R$982 (ME) / R$276 (MEI) em horizonte de 24 meses. Ver `pesquisa/economia-preco-cac.md` §9.
2. **MEI é oferta frágil pra tráfego pago frio — confirmado por 2 fontes independentes.** Precisaria de ~30% de conversão lead→cliente, "irreal" nas palavras da própria pesquisa externa. Decisão: MEI não recebe campanha paga dedicada, só upsell orgânico/indicação.
3. **Canal de aquisição pago concentra em Meta, não Google, no V0** — budget insuficiente pra rodar os dois acima do mínimo de aprendizado do algoritmo; Meta converte melhor no nicho (4,68% vs 3,46%).
4. **Momento decisivo da venda é a conversa humana no WhatsApp**, não uma landing page com formulário — ad deve levar direto pra conversa, não pra form pesado.
5. **Veredito do gate de validação rebaixou** de 🟡 GO com ressalva (5/7 verde) pra 🟡 GO com ressalva forte (4/7 verde, 1 vermelho) após o achado do CAC.

## Pendências que seguem abertas

- Honorário contábil real (Mauro) — maior custo do negócio, ainda não entra no cálculo de margem
- Thresholds numéricos do gate empírico do V0 (X/Y/Z/M/K, `BASE-ESTRATEGICA.md` §13) — seguem sem travar
- Base de copy/tom-de-voz (achado do 25º flow) — não foi tocada nesta sessão
- Reorganização de docs (pergunta do Pedro, 31/07) — segue aberta
- Contas de anúncio Google/Meta — setup técnico ainda pendente

## Regra de trabalho nova (registrar pra próximas sessões)

Pesquisa de mercado de escopo grande passou a rodar via prompt otimizado pro Google Search do Gemini, executado fora pelo Pedro, resultado colado de volta pra análise — em vez de tentar pesquisar diretamente na sessão. Usado 2x nesta sessão com sucesso.

## Links
- [[posicionamento]] · [[metodologia-personas]] · [[economia-preco-cac]] · [[validacao-ideia]] · [[estrategia-organica]] · [[estrutura-funil-trafego]]
