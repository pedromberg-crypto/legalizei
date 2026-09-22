---
tipo: relatorio-rastreio
status: gerado
data: 2026-09-22
assunto: hermes-v2-sidecar
tags: [leo, rastreio, router, tools, lastro, iptu]
---

# 🔬 Rastreio ao vivo de UM turno · a sonda do IPTU

Responde a `_cadeia-da-resposta-do-leo.md`, que mapeou as 14 etapas **lendo o
código** no vault. Este é o mesmo caminho, **rodado**, com o banco atrás.

| | |
|---|---|
| Sonda | `"pq vcs precisam do numero do meu iptu?"` |
| Quando | 2026-09-22 20:00 UTC · commit `cd32368` |
| Sessão | `sonda-rastreio-*`, história vazia, criada só para isto |
| Latência | **4.557 ms** |
| Bruto | `reports/_rastreio-2026-09-22200026.json` |

🔑 **Rodou com as deps REAIS, não com `depsDeTeste`.** O item 4 pede os valores
lidos do turno gravado, e o `depsDeTeste` do E2E grava em memória de propósito.
A sonda grava de verdade, numa sessão própria, e relê de lá. Não fala com a
ponte: `responder()` não conhece `127.0.0.1:3000`.

## 1 · Classificador e trilha

Chamada 1 ao modelo, **sem tool na mesa**, 324 tokens de entrada, 71 de saída,
**zero de cache**. O JSON literal que voltou:

```json
{
  "gatilho_escalonamento": false,
  "fora_do_escopo": false,
  "pergunta_tecnica": true,
  "interesse_comercial": false,
  "tensao": false,
  "resumo": "O cliente questiona a necessidade de informar o número do IPTU para o serviço de contabilidade.",
  "revelou": {}
}
```

`decidirSaida()` → **`tecnico`**, no primeiro `if` que acende. Bate com o mapa
do vault, inclusive o sinal que acendeu.

## 2 · A mesa

Trilha `tecnico` recebe **as 8**:

`consultar_cnae` · `consultar_preco` · `estimar_das` · `buscar_cartao` ·
`consultar_links` · `buscar_base` · `consultar_contrato` · `consultar_escopo`

## 3 · O laço — duas voltas, nenhuma tool

| volta | tools na mesa | chamou | entrada | saída | cache |
|---|---:|---|---:|---:|---:|
| 1 | 8 | **nada** | 13.152 | 64 | 13.140 |
| 2 | 8 | **nada** | 14.472 | 58 | 13.140 |

🔴 **Zero tools executadas.** `diario.tools` veio vazio — nenhuma chegou ao
banco. A sonda confirma ao vivo o que a suíte vinha medindo.

**O que aconteceu entre as duas voltas** é a etapa que o mapa do vault não tem,
porque ela nasceu depois dele: a volta 1 fechou sem tool, o lastro disparou,
**uma** chamada de embedding rodou e três trechos entraram no texto da mensagem:

```
04-QUEBRA-OBJECOES#por-que-voces-pedem-o-iptu-e-o-endereco-da-minha-casa
03-REGRAS-DOS-ORGAOS#1-prefeitura-de-belo-horizonte-endereco-iptu-e-a-regra-do-ap
08-MAPA-DO-DOSSIE#1-o-que-o-app-pede-campo-a-campo-e-por-que
```

Bloco de 4.589 caracteres. A volta 2 respondeu a partir dele. **O `03` §1 — a
nota que responde a pergunta — veio em segundo lugar.**

⚠️ O delta de entrada entre as voltas (13.152 → 14.472) com o cache parado em
13.140 mostra o custo do lastro em números: **~1.320 tokens fora do cache**.

## 4 · O turno, lido do banco

```sql
SELECT saida, tecnica_ok, falha_tipo, cartoes_usados, fatos_lidos,
       tools_chamadas, lastro_ids FROM conversa.turno_interno ...
```

| campo | valor |
|---|---|
| `saida` | `tecnico` |
| `tecnica_ok` | **false** |
| `falha_tipo` | **`lacuna_da_base`** |
| `cartoes_usados` | `{}` |
| `fatos_lidos` | `{}` |
| `tools_chamadas` | `{}` |
| `lastro_ids` | os 3 acima |
| tokens | 27.948 entrada · 193 saída · 26.280 cache |

🔴 **O banco diz que este turno foi uma lacuna, e a resposta está certa.** É o
achado desta rodada, e está na fila: `tecnica_ok` significa "o modelo escolheu
uma tool", e o lastro não conta ali de propósito — senão a constraint
`comercial_exige_tecnica_ok` pararia de barrar. Mas a consequência é que o
turno com lastro e resposta correta é gravado como falha, e a linha "turnos sem
lastro técnico" do relatório passa a superestimar o problema.

## 5 · Filtro de endereços

Agiu: **sim, e não encontrou nada.** `0` trocas, `0` remoções — a resposta não
tem endereço. O filtro rodou antes da gravação, como deve.

## 6 · O texto, e em quantas batidas

**Duas batidas**, teto do `emBatidas()`:

> **[1]** O índice do IPTU é o que valida o seu endereço para a Prefeitura. Sem ele, o sistema não localiza o imóvel e o seu processo de abertura para.
>
> **[2]** Fica na sua guia de IPTU, e o app te mostra exatamente onde encontrar na hora de preencher.

Trava comercial: não injetou gancho — `tecnica_ok` false barra, e barrou.

## 🎯 A comparação com a base

`03-REGRAS-DOS-ORGAOS` §1, literal:

> **Índice cadastral do IPTU:** obrigatório. É o dado que **valida aquele
> endereço na constituição** — sem ele a Prefeitura não localiza o imóvel, e o
> processo para. Fica na guia do IPTU, e o app mostra onde achar.

**O texto BATE com a nota.** Ponto a ponto:

| a nota diz | o Léo disse | |
|---|---|:--:|
| valida aquele endereço | valida o seu endereço para a Prefeitura | ✅ |
| sem ele não localiza o imóvel | sem ele o sistema não localiza o imóvel | ✅ |
| e o processo para | e o seu processo de abertura para | ✅ |
| fica na guia do IPTU, e o app mostra onde achar | fica na sua guia de IPTU, e o app te mostra onde encontrar | ✅ |

**E as duas trocas de 18:54 desapareceram:**

| | antes (18:54) | agora |
|---|---|---|
| a razão | *"confirmar se a prefeitura **permite**… **zoneamento**"* | **valida/localiza o endereço** |
| o sujeito | *"**eu verifico** se o imóvel atende"* | **a Prefeitura** |

Zoneamento sumiu — e é correto que suma: a nota o reserva para **imóvel
comercial**, e a pergunta era sobre a casa.

⚠️ **Uma imprecisão residual, pequena e vale registro:** a nota diz *"a
**Prefeitura** não localiza o imóvel"* e o Léo disse *"o **sistema** não
localiza"*. "Sistema" é ambíguo — pode ser lido como o app da Legalizai, o que
reintroduziria em miniatura a troca de sujeito que a nota proíbe. A primeira
oração já nomeia a Prefeitura, então o parágrafo se sustenta. Enfileirado.

## O que este rastreio prova, e o que não prova

**Prova:** a cadeia mapeada no vault confere com a que roda, etapa por etapa; o
lastro dispara na volta 2 quando a volta 1 fecha sem tool; o trecho certo chega;
e o texto passou a refletir a nota no caso que era o exemplo do vazamento.

**Não prova:** que o modelo passou a escolher ferramenta — `tools_chamadas` é
`{}`. A camada 2 do mapa do vault continua não sendo acionada por decisão dele.
O que mudou é que a camada 3 (o treino do Gemini) deixou de ser a única
alternativa quando ele não chama nada.

**É um turno.** Uma sonda não mede estabilidade.
