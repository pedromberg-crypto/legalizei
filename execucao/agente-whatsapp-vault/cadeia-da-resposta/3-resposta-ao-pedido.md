---
tipo: resposta-de-sessao
status: gerado
data: 2026-09-22
assunto: hermes-v2-sidecar
papel: "A resposta da janela da VPS ao pedido de rastreio ao vivo, como ela saiu no chat"
tags: [leo, rastreio, router, tools, lastro, iptu]
---

# Rastreio ao vivo · a resposta da janela da VPS

> 🧭 Este arquivo é a **resposta do chat**, transcrita. O relatório técnico
> completo é `reports/rastreio-2026-09-22-iptu.md`; o bruto é
> `reports/_rastreio-2026-09-22200026.json`.

Rastreio ao vivo feito, commitado (`a2eb7b2`). Rebaseei sobre o `1082306` antes
— zero sobreposição.

Rodei com as **deps reais**, não `depsDeTeste`: o item 4 pede valores lidos do
turno gravado, e o `depsDeTeste` grava em memória de propósito. Sessão própria,
histórico vazio, sem falar com a ponte.

## O rastreio · `"pq vcs precisam do numero do meu iptu?"` · 4.557 ms

**1 · Classificador** — 324 tokens, zero cache, sem tool na mesa:

```json
{ "gatilho_escalonamento": false, "fora_do_escopo": false,
  "pergunta_tecnica": true, "interesse_comercial": false, "tensao": false,
  "resumo": "O cliente questiona a necessidade de informar o número do IPTU para o serviço de contabilidade.",
  "revelou": {} }
```

`decidirSaida()` → **`tecnico`**. Bate com o mapa do vault, inclusive o sinal
que acendeu.

**2 · Mesa** — as 8, como previsto:

`consultar_cnae` · `consultar_preco` · `estimar_das` · `buscar_cartao` ·
`consultar_links` · `buscar_base` · `consultar_contrato` · `consultar_escopo`

**3 · Laço — duas voltas, ZERO tools executadas**

| volta | chamou | entrada | saída | cache |
|---|---|---:|---:|---:|
| 1 | nada | 13.152 | 64 | 13.140 |
| 2 | nada | 14.472 | 58 | 13.140 |

`diario.tools` veio **vazio** — nenhuma tocou o banco. Entre as voltas entrou a
etapa que o mapa do vault não tem porque nasceu depois dele: a volta 1 fechou
sem tool, o lastro disparou, 1 embedding, três trechos no texto da mensagem — e
o **`03-REGRAS-DOS-ORGAOS#1` veio em segundo**. Bloco de 4.589 caracteres; o
delta de entrada com o cache parado mostra o preço: **~1.320 tokens fora do
cache**.

Os três ids entregues pelo lastro:

```
04-QUEBRA-OBJECOES#por-que-voces-pedem-o-iptu-e-o-endereco-da-minha-casa
03-REGRAS-DOS-ORGAOS#1-prefeitura-de-belo-horizonte-endereco-iptu-e-a-regra-do-ap
08-MAPA-DO-DOSSIE#1-o-que-o-app-pede-campo-a-campo-e-por-que
```

**4 · O turno no banco**

```
saida=tecnico · tecnica_ok=FALSE · falha_tipo=lacuna_da_base
cartoes_usados={} · fatos_lidos={} · tools_chamadas={}
lastro_ids={04-QUEBRA-OBJECOES#..., 03-REGRAS-DOS-ORGAOS#1..., 08-MAPA-DO-DOSSIE#1...}
tokens: 27.948 entrada · 193 saída · 26.280 cache
```

**5 · Filtro** — agiu e não achou nada: 0 trocas, 0 remoções. A resposta não tem
endereço.

**6 · Texto — duas batidas**

> **[1]** O índice do IPTU é o que valida o seu endereço para a Prefeitura. Sem
> ele, o sistema não localiza o imóvel e o seu processo de abertura para.
>
> **[2]** Fica na sua guia de IPTU, e o app te mostra exatamente onde encontrar
> na hora de preencher.

Trava comercial: não injetou gancho — `tecnica_ok` false barra, e barrou.

## Contra a nota: **bate**

`03` §1: *"É o dado que **valida aquele endereço na constituição** — sem ele a
Prefeitura não localiza o imóvel, e o processo para. Fica na guia do IPTU, e o
app mostra onde achar."*

As duas trocas documentadas no vault sumiram: a razão voltou a ser
**validar/localizar** (não "permitir/zoneamento") e o sujeito voltou a ser **a
Prefeitura** (não "eu verifico"). Zoneamento sumiu, e é correto que suma — a
nota o reserva para imóvel comercial.

⚠️ Uma imprecisão residual: a nota diz *"a **Prefeitura** não localiza"*, ele
disse *"o **sistema** não localiza"*. "Sistema" é ambíguo e pode ser lido como o
app. A oração anterior nomeia a Prefeitura, então o parágrafo se sustenta.
Enfileirado.

## 🔴 O achado da rodada

**O banco gravou este turno como `lacuna_da_base`, com a resposta certa e o
lastro presente.** A semântica está correta por construção — `tecnica_ok`
significa "o modelo escolheu a tool", e somar o lastro ali faria a constraint
`comercial_exige_tecnica_ok` parar de barrar. Mas a consequência é dupla: a
linha "turnos sem lastro técnico" superestima o problema, e a trava comercial
barra o gancho em turno que teve base. Provavelmente pede um terceiro estado,
não um booleano.

Nada consertado — cinco achados em `reports/_fila.md`, incluindo que
`limparSaida()` e `emBatidas()` não são exportadas, então o script carrega uma
**cópia** delas (importar `server.js` subiria o polling) e cópia diverge com o
tempo.

**O que o rastreio não prova:** que o modelo passou a escolher ferramenta.
`tools_chamadas` é `{}`. A camada 2 do mapa do vault continua não sendo acionada
por decisão dele — o que mudou é que a camada 3 deixou de ser a única
alternativa. E é um turno: sonda não mede estabilidade.
