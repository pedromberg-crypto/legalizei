---
tipo: relatorio-aceite
status: gerado
data: 2026-09-22
assunto: hermes-v2-sidecar
tags: [leo, lastro, buscar_base, aceite]
---

# ✅ Aceite · a resposta passa a ter lastro

Responde a `_aceite-lastro-na-resposta.md`. Rodada final:
`reports/e2e-2026-09-22-193242-curta.md`.

## O desenho escolhido, e por que não foi o óbvio

A consulta deixou de ser decisão do modelo e virou **etapa do roteador** — mas
**só onde faltava**. O lastro entra quando a volta termina com o modelo **sem
ter chamado ferramenta nenhuma**: aí a base é consultada com a pergunta crua, o
texto entra junto da mensagem e o modelo responde de novo.

🔴 **A primeira versão injetava sempre, e foi medida como pior.** Três rodadas:

| | 18:54 (sem lastro) | 19:23 (lastro sempre) | 19:32 (segunda chance) |
|---|---:|---:|---:|
| Placar | 18/20 | **14/20** | 16/20 |
| Tools chamadas | 12 | **0** | 14 |
| Cache | 96,4% | 88,4% | **94,4%** |

Com texto pronto no contexto o modelo **para de procurar**. As oito tools foram
a zero, inclusive `consultar_preco`, que é a única fonte de valor.

🔑 **E o sintoma foi literal.** `seed/carregar-conhecimento.ts` troca todo valor
em dinheiro por `«valor em fatos»` antes de vetorizar, de propósito, para que
número só venha da tabela. O modelo leu o marcador no lastro e **escreveu ao
cliente**: *"o valor mensal é «valor em fatos»"*. O rótulo do bloco passou a
declarar o que a base **não** tem e a mandar chamar a ferramenta para cada
classe de dado. Vazamentos do marcador nas rodadas seguintes: **0**.

## Os seis critérios

| # | Critério | Hoje | Agora | |
|---|---|---|---|:--:|
| **A1** | Nenhuma resposta sai sem lastro | `buscar_base` 0 de 28 | **0 turnos sem lastro E sem tool**, de 28 | ✅ |
| **A2** | Os dois casos param de errar | 2 erros | **0** | ✅ |
| **A3** | Turnos sem tool caem | 15 de 28 | **0 sem nada** (20 com lastro, 8 com tool) | ✅ |
| **A4** | Custo e cache | 96,4% · US$ 0,00136 | **94,4%** · **US$ 0,00217** | ✅ |
| **A5** | Placar não cai | 18/20 | **16/20** | ⚠️ |
| **A6** | Chamada sem efeito visível | já existia | preservado, 0 divergências | ✅ |

### A1 — como ler o número

`buscar_base` **chamada pelo modelo** continua **0 de 28**, e isso é honesto:
ele não passou a escolher a ferramenta. O que mudou é que a base chega de
qualquer forma. As duas coisas são colunas separadas de propósito —
`tools_chamadas` e `lastro_ids` — porque somá-las apagaria justamente a
distinção que o dia inteiro existiu para tornar visível.

### A2 — os dois casos, literais

| caso | antes | agora |
|---|---|---|
| `campo-dossie-iptu` | *"com o número **eu verifico** se o imóvel atende ao **zoneamento**"* | *"quem analisa o endereço é a **Prefeitura**, e o índice do IPTU é o que **valida aquele imóvel na constituição**: sem ele a Prefeitura não localiza o endereço e o processo para"* |
| `venda-insistencia` | *"no plano ME o processo é o mesmo, eu cuido de tudo"* (omitia o certificado do MEI) | chamou `consultar_preco` e deu os valores da tabela; o turno seguinte fala do DAS sem a afirmação errada |

⚠️ O `campo-dossie-iptu` **ainda reprova na suíte**, e não por conteúdo: a
checagem `proibido:/[eé] o processo/` casa com o *"e o processo"* da frase
correta. Achado de teste, enfileirado em `_fila.md`.

### A5 — o que não foi cumprido

16/20 contra 18/20. O critério diz para ler com o ruído de ±3 declarado, e 16
está dentro da banda — mas **não vou chamar isso de cumprido**. Três das quatro
falhas são o mesmo defeito, e ele não é do lastro:

```
aceite-epp           faltou link
comercio-gate-saida  faltou link e Instagram
venda-escada         faltou a validade 31/12
campo-dossie-iptu    falso positivo do regex
```

O gate de saída não fecha com os canais de forma estável, e `consultar_links`
segue entre 0 e 3 chamadas de 28. O filtro de endereços garante que o link
**escrito** esteja certo; não garante que ele **seja escrito**. É o mesmo
degrau do lastro, uma camada acima — está na fila.

### A4 — a queda do cache não é quebra de prefixo

96,4% → 88,4% com quatro trechos sempre, → **94,4%** com o desenho final. O
prefixo nunca quebrou: `systemInstruction` e `tools` não mudaram. O lastro
entra em `contents`, que **não é cacheado**, então mais texto ali dilui a
proporção. Reduzir de 4 para 3 trechos e injetar só onde falta devolveu a taxa.

## O que mudou no código

| arquivo | |
|---|---|
| `tools.ts` | `montarLastro()` — a mesma busca da `buscar_base`, sem pedir licença ao modelo |
| `router.ts` | `Deps.buscarLastro` opcional, aplicado quando a volta fecha sem tool |
| `tipos.ts` | `Resolucao.lastroInjetado`, separado de `fatosLidos` |
| `db.ts` · `seed/11-lastro.sql` | coluna `lastro_ids text[]`, aditiva |
| `testes/e2e.ts` · `relatorio.ts` | a suíte injeta a mesma dep e a rodada reporta |

🔴 **`fatosLidos` e `tecnicaOk` não contam o lastro.** Somá-los deixaria
`tecnica_ok` verdadeiro em todo turno, inclusive numa saudação, e a constraint
`comercial_exige_tecnica_ok` pararia de barrar o que existe para barrar.

## Sobre o CLAUDE.md §3

A ordem do §3 — descrição da tool, depois `RULES.md`, depois RAG, e só então
código — **foi percorrida e esgotada antes desta rodada**, e está medida: a
descrição do `consultar_links` foi reescrita no molde da tool mais chamada e
deu 0 de 27, inclusive nos quatro turnos com o gatilho nomeado; quatro tools
dizem "OBRIGATÓRIA" e estão em zero absoluto. O critério de aceite autoriza a
mudança de código por esse motivo explícito.

## Custo

Quatro rodadas de E2E: US$ 0,0285 + 0,0405 + 0,0396 + 0,0434 = **US$ 0,152**.
A rodada final custa US$ 0,00217 por caso, contra o teto de US$ 0,004.
