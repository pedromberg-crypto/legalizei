---
name: legalize-primeira-campanha-fechada
description: "Primeira campanha de tráfego (lista de espera) criada ponta a ponta 20-21/08 — estrutura, preço fechado com Mauro, 24 peças auditadas, handoff de LP"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9fefe0d5-5e62-409a-86d0-2cf2aee81a20
  modified: 2026-08-21T12:46:17.570Z
---

Primeira campanha de tráfego pago (Meta/Instagram) da Legalizai construída de ponta a ponta em 20-21/08/2026. Estrutura nova em `mkt/campanhas/` (índice `campanhas.md` + esqueleto por campanha: brief · copy · guardian-log · prompts-imagem · resultados) — encaixa no que `mkt/README.md` já previa.

**Objetivo real:** captação de lista de espera pro lançamento do app (o app ainda não existe), não venda direta — pegada teaser "algo vem aí", herdada de `marca/copy/roteiro-teaser-investidor.md`. Público duplo nomeado explicitamente: quem abre o 1º CNPJ (leigo) e quem migra de outra plataforma/contador (já tem noção) — nenhuma copy pode presumir só um dos dois.

**Preço FECHADO com o Mauro por telefone (20/08), 2 ADRs em `marca/decisoes-marca.md`:**
- MEI trava em **R$49 redondo** (substitui placeholder R$49,90 de 04/08, que já nascia marcado "preço FAKE")
- Preço de LANÇAMENTO oficial: MEI R$19→R$49, ME R$99→R$139 (3 primeiros meses)
- Preço da CAMPANHA (só esta peça, exclusivo de quem entra antes): **ME R$79→R$139** — não confundir os dois R$'s do ME
- Validade de toda promoção: **até 31/12/2026** (gatilho de escassez real, usado na copy)

**Fluxo de trabalho estabelecido e validado:** `legalizai-copywriter` (agente) escreve → `legalizai-guardian` (agente) audita → correções aplicadas por mim direto no arquivo (os 2 agentes não têm ferramenta de escrita neste ambiente, só Read/Grep/Glob). Rodou 5 vezes nesta campanha (texto base, mecânica de reserva, prazo 31/12, 3 peças "dial alto" a pedido do Pedro, roteiros de vídeo). Resultado: **24 peças auditadas, 0 reprovações** (12 estáticas em `copy.md`, 12 roteiros de vídeo 15s/30s sóbrio+cômico em `roteiros-video.md`).

**Simulação financeira** em `pesquisa/2026-08-20-simulacao-oferta-lancamento.md` — Pedro foi lapidando os parâmetros ao vivo (LTV 12m fixo, custo técnico ME R$15/MEI R$5, certificado só ME, atendente recalculado de R$87-117/usuário pra R$3,63/usuário com nova premissa de capacidade, CAC como 10% da receita bruta). 5 cenários testados, os 3 finais (MEI A, ME A pro lançamento, ME C pra campanha) fecham positivo mesmo no pior caso de cancelamento com multa.

**Handoff de LP** (`mkt/campanhas/2026-08-primeira-campanha/handoff-lp-copy.md`): a LP em produção tinha oferta divergente ("1º mês grátis") e promessa sem qualificador ("contador de verdade desde o início" — falso pro MEI). Pedro levou pra outra sessão de Claude aplicar direto no site, com instrução de não mexer em layout.

**Pendências que atravessam a próxima janela:**
1. Validar se "Vai, legaliza aí." entra falado nos roteiros de vídeo — colide com ADR de 13/08 que trava frase+visual como par indivisível pra peça audiovisual (guardian recomendou validação humana explícita, não resolveu sozinho)
2. Conferir resultado da LP editada
3. Orçamento, período e métrica de sucesso da campanha ainda "a definir" no brief
4. MCP do Illustrator registrado (`claude mcp add illustrator ...`, servidor local `http://localhost:18412/v1/mcp`) mas precisa janela nova pra esta sessão carregar as ferramentas — servidor adicionado no meio da sessão não é pego sem restart

Ver [[legalize-objetivo-e-papel-pedro]] pro contexto geral do negócio.
