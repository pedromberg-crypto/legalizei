---
tipo: verdade
status: vivo
data: 2026-09-19
assunto: agente-whatsapp-vault
tags: [execucao, agente, whatsapp, rag, leo, skills]
---

# Vault do agente de WhatsApp (Léo)

🔴 **Esta pasta é a FONTE-VERDADE do Léo.** O que roda no VPS é cópia disto. Mudou aqui, sobe lá; mudou lá, volta pra cá no mesmo dia. Antes de 19/09 existiam duas cópias divergindo (a do repo estava 3,5x menor e sem o `06`), e foi assim que dado errado sobreviveu.

Base **exclusiva** do agente de atendimento. Fora daqui o vault tem margem, CAC, custo operacional, estratégia de sócio e pesquisa não ratificada, e nada disso pode chegar a um cliente por WhatsApp.

## Estrutura

O agente roda em Ollama (`gemma4:31b`, produção desde 18/09) com carregamento sob demanda via `skill_view`. Só o `SOUL.md` e o `description` de cada skill ficam sempre no contexto; o resto é lido na hora.

```
00-SOUL-personalidade.md        quem o Léo é, como soa, ritmo de fala
skills-legalizai/
  DESCRIPTION.md
  atendimento/SKILL.md          o piso de toda conversa
  vendas/SKILL.md               quem ainda decide se contrata
  escalacao/SKILL.md            passar pra humano
  base-legalizai/
    SKILL.md                    índice das notas
    references/00..12           o conhecimento
```

| Nota | Papel |
|---|---|
| `00-DIRETRIZES-SEGURANCA` | Quem é o Léo, o que ele nunca faz, quando escala |
| `01-PLANOS-E-OFERTAS` | Preços, promoções, endereço fiscal, taxa da Junta, os 3 links |
| `02-PRODUTO-E-USABILIDADE` | A ordem real das etapas do app |
| `03-REGRAS-DOS-ORGAOS` | Prefeitura, JUCEMG, Receita, e o filtro do MEI |
| `04-QUEBRA-OBJECOES` | Q&A de calibragem, os 3 estágios de funil |
| `05-DICIONARIO-CNAE-TRIBUTARIO` | Conceito de CNAE, anexos, Fator R, MEI x ME |
| `06-CALCULO-FISCAL` | Como o imposto da ME é calculado, pró-labore, guias do sócio |
| `07-OBRIGACOES-MENSAIS` | A rotina depois que a empresa nasce, quem faz o quê |
| `08-MAPA-DO-DOSSIE` | Campo a campo do app, com o motivo de cada um |
| `09-ESCOPO-E-LIMITES` | 🔴 Pra quem a gente atende. Fatos, tetos, CNAEs |
| `10-CONTRATO-GARANTIA-CANCELAMENTO` | 🔴 7 dias, fidelidade, multa. Único lugar com esses números |
| `11-COMO-CONSULTAR-CNAE` | Contrato da ferramenta de consulta dos 1332 CNAEs |
| `12-GATE-DE-SAIDA` | 🔴 Como dizer não. Ler antes de recusar qualquer caso |

⚠️ O slot `06` foi reaproveitado: até 04/09 era `06-REGRAS-ORGAOS-PUBLICOS` (fundido no `03`); desde 17/09 é `06-CALCULO-FISCAL`. Referência antiga a "06" significa outra coisa.

## Regras de manutenção

1. **Número aqui dentro precisa existir no vault principal.** Preço vem de `financeiro/estado-atual.md` e de `app/src/lib/fiscal.ts`. Regra de órgão vem de `pesquisa/` e das gravações reais. Mudou lá, muda aqui no mesmo dia.
2. 🔴 **Número mora em UM arquivo só, e o `SOUL` nunca guarda número.** O `SOUL` está sempre no contexto: número escrito nele é número que o agente responde sem abrir a nota, e aí a regra de "nunca de memória" vira letra morta. Foi exatamente assim que o `10-CONTRATO` passou a ser aberto 1 vez em 632 e o agente parou de citar os 7 dias de arrependimento. Exemplo no `SOUL` ensina **forma**, nunca valor.
3. **Nada de instrução de sistema no meio do conhecimento.** Instrução vive no `00`. Num RAG, um parágrafo de instrução perdido num arquivo de conteúdo pode ser recuperado e repetido pro cliente.
4. 🔴 **Bastidor não entra no corpo.** Nome de arquivo interno, caminho de pasta, changelog de merge e nome de ferramenta vão no frontmatter (`historico:`), nunca em prosa. O agente lê o corpo inteiro e o `SOUL` proíbe ele de citar isso pro cliente.
5. **Lista grande não entra.** Os 1332 CNAEs ficam em `pesquisa/cnae-matriz/cnae-matriz.json` e são consultados por ferramenta (`11`). Cópia dentro do vault congela e diverge.
6. **Sem travessão em nenhum arquivo.** Regra dura de marca, e o agente aprende o tom pelo que lê: travessão escrito aqui é few-shot ensinando o contrário da regra.
7. **Duplicata é bug.** Se dois arquivos explicam a mesma regra, funde ou aponta. Aconteceu com `03`+`06`, com o Q&A que vivia fora da pasta, e com o gate de saída que estava no `09` e repetido no `vendas`.
8. ⚠️ **Arquivo acima de ~5.000 chars é podado do histórico** quando a conversa compacta (`_SKILL_VIEW_PRUNE_MIN_CHARS`). 7 das 13 notas passam disso hoje. Enquanto o parâmetro não subir no runtime, nota crítica longa pode sumir no meio de conversa longa.

## Threads abertos

* 🟡 **Limiar de confiança do CNAE.** `11` §3 autoriza afirmar só com `anexo_fator_r_confianca` = `alta` (24 dos 87 atendidos). `09` §4 autoriza os 65 III-fixo. Conflito em 54 códigos, e 54 dos 65 III-fixo são `media`. Decisão do Pedro com a contadora.
* 🟡 **`escalacao` §6** segue pendente: a fila de destino não existe no produto.
* 🟡 **`consultar_cnae`** não está ligada no canal. O `11` já tem o modo degradado escrito.

## Fora de escopo deste vault

Personalidade completa do personagem com origem e dial por persona: `execucao/entregas/handoff-leo-agente-whatsapp.md`. Aquele doc é pro dev configurar; aqui é o que o agente consulta em runtime.
