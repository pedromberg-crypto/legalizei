---
tipo: indice
status: vivo
data: 2026-09-20
assunto: hermes-v2-sidecar
tags: [sidecar, reports, e2e, custo]
---

# reports/ · o que cada arquivo prova

Relatórios gerados pelas rodadas de teste do roteador Sidecar. Todos saem
automaticamente do `npm run e2e`, junto de um JSON equivalente em
`_testes-saida/` (fora do git, porque guarda a transcrição integral).

🔴 **Se você chegou aqui para auditar, leia primeiro a seção "Antes de ler o
placar" de qualquer relatório de rodada.** Ela não é formalidade: o placar desta
suíte tem ruído medido de até 3 pontos, e lido sem isso produz conclusão errada
com aparência de dado.

## Por onde começar

| quero saber | leia |
|---|---|
| quanto custa e o que o gasto comprou | [analise-custo-2026-09-20](analise-custo-2026-09-20.md) |
| como levar isto para a VPS sem derrubar o WhatsApp | [plano-migracao-vps](plano-migracao-vps.md) |
| o que ja esta pronto para a virada, e o runbook do dia | [preparacao-virada-2026-09-21](preparacao-virada-2026-09-21.md) |
| 🔴 o defeito da fidelidade, achado | [evolucao-2026-09-21-0145](evolucao-2026-09-21-0145.md) |
| ✅ o mesmo defeito, corrigido pela descricao da tool | [evolucao-2026-09-21-0155](evolucao-2026-09-21-0155.md) |
| 🔴 o Leo mandando assinar num produto sem checkout | [evolucao-2026-09-21-whatsapp-manual](evolucao-2026-09-21-whatsapp-manual.md) |
| 🔑 o pareado: as MESMAS perguntas no E2E e no WhatsApp real | [evolucao-2026-09-21-whatsapp-manual-v2](evolucao-2026-09-21-whatsapp-manual-v2.md) |
| ✅ as 4 correcoes sistemicas, e a licao sobre regra x tool | [evolucao-2026-09-21-maratona-v2-r2](evolucao-2026-09-21-maratona-v2-r2.md) |
| o modelo de relatorio de evolucao | [_template-evolucao](_template-evolucao.md) |
| como o agente está respondendo hoje | a rodada mais recente, `e2e-*-2348` |
| se uma mudança quebrou alguma coisa | duas rodadas seguidas, comparando as falhas |

## As rodadas do dia 2026-09-20

Mesma suíte (`curta`, 20 casos), mesmo modelo (`gemini-3.1-flash-lite`).

| rodada | placar | o que mudou antes dela |
|---|---|---|
| [`2314`](e2e-2026-09-20-2314.md) | 14/20 | primeira rodada com vetor real de 768 |
| [`2324`](e2e-2026-09-20-2324.md) | 15/20 | nasceram `buscar_base` e os tetos no escopo |
| [`2330`](e2e-2026-09-20-2330.md) | 16/20 | regras de URL completa e de travessão |
| [`2332`](e2e-2026-09-20-2332.md) | 14/20 | `fatos.link` e a correção do runner que reprovava o link certo |
| [`2338`](e2e-2026-09-20-2338.md) | 16/20 | extreme makeover da `buscar_cartao` |
| [`2345`](e2e-2026-09-20-2345.md) | 14/20 | as quatro rédeas de redação |
| [`2348`](e2e-2026-09-20-2348.md) | 16/20 | correção das chamadas paralelas de tool |
| [`21-0004`](e2e-2026-09-21-0004.md) | **17/20** | 🟢 cache explícito + filtro de tools por trilha: custo −80,3% |

⚠️ **A coluna do placar é a menos informativa da tabela.** Sete rodadas deram
14, 15, 16, 14, 16, 14, 16 sem correlação com o que mudou entre elas. O que se
move de verdade está dentro de cada relatório: turnos sem lastro técnico,
chamadas de RAG, rotas escolhidas e falhas de provedor.

## O que estes relatórios NÃO provam

* **Qualidade.** As checagens são automáticas e medem regra: o que não pode
  aparecer e o que tem que aparecer. Se a resposta ficou boa continua sendo olho
  humano, e o critério de cada caso vem escrito ao lado dele para essa leitura.
* **Cobertura do produto.** Os casos vêm do `casos.yaml` do vault v12, que é
  atendimento comercial e regra. Capacidade do app quase não aparece, então
  nenhuma rodada aqui autoriza conclusão sobre os 58 cartões.
* **Estabilidade.** Rodada única de modelo não determinístico. Caso que falha uma
  vez é flutuação; caso que falha em todas é defeito. Em sete rodadas, só o
  `venda-escada` falhou em todas.

## Como reler sem pagar de novo

O gerador roda sobre um JSON já salvo, sem repetir a rodada:

```bash
node .build/testes/relatorio.js _testes-saida/e2e-2026-09-20.json
```

Rodada nova custa ~R$ 0,75 e chama rede. Por regra do projeto, suíte assim só
roda quando pedida.
