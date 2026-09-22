---
tipo: indice
status: vivo
data: 2026-09-22
assunto: agente-whatsapp-vault
papel: "Os quatro documentos da cadeia de resposta do Leo, na ordem de leitura"
tags: [leo, sidecar, arquitetura, rastreio, lastro]
---

# 🔗 A cadeia da resposta do Léo — os quatro documentos

> 📌 **Por que esta pasta existe.** O Pedro pediu para **ver** o mecanismo antes
> de começar os testes com a documentação. Quatro documentos responderam isso no
> mesmo dia, de dois lados diferentes, e separados eles não contam a história.
>
> 🔑 **A ordem importa**: o 1 é o mapa, o 2 é a prova, o 3 é a leitura de quem
> executou, o 4 é o dado cru. Ler o 2 sem o 1 é olhar número sem cadeia.

## A ordem de leitura

| # | Arquivo | Quem escreveu | O que é |
|---|---|---|---|
| **1** | `1-a-cadeia-lida-no-codigo.md` | **janela do vault** | As **14 etapas**, do WhatsApp até a resposta, lidas em `server.ts` · `router.ts` · `tools.ts` · `tools-def.ts` · `db.ts`. Mapa, não medição |
| **2** | `2-rastreio-ao-vivo-iptu.md` | **janela da VPS** | O mesmo caminho, **rodado de verdade** com o banco atrás. A sonda: *"pq vcs precisam do numero do meu iptu?"* |
| **3** | `3-resposta-ao-pedido.md` | **janela da VPS** | A leitura dela do que encontrou, como saiu no chat |
| **4** | `4-turno-bruto.json` | gerado | O turno cru, como o `scripts/rastrear-turno.mjs` gravou |

## O que os quatro, juntos, mostram

**O mapa (1) disse onde a cadeia vazava:** das 14 etapas, **uma era opcional** —
justamente a que consulta o que a gente escreveu. O código já marcava
`falhaTipo: 'lacuna_da_base'` quando respondia sem lastro, gravava isso no banco…
e mandava o texto assim mesmo.

**O rastreio (2) mediu depois do conserto.** Na rodada de 18:54 a mesma pergunta
tinha produzido duas trocas — a razão (*"confirmar se a prefeitura **permite**…
**zoneamento**"*) e o sujeito (*"**eu verifico** se o imóvel atende"*). Às 20:00,
com o lastro virando etapa de código:

| a nota `03` §1 diz | o Léo disse |
|---|---|
| valida aquele endereço | valida o seu endereço para a Prefeitura |
| sem ele não localiza o imóvel | sem ele o sistema não localiza o imóvel |
| e o processo para | e o seu processo de abertura para |

🔑 **E nenhuma tool foi chamada nas duas voltas.** É esse o desenho: a consulta
deixou de depender de o modelo querer.

## ⚠️ O que ficou aberto, e está na fila

🔴 **Turno com lastro e resposta certa ainda é gravado como `lacuna_da_base`.**
`tecnica_ok = false`, `tools_chamadas = {}`, e `lastro_ids` com os três trechos
certos dentro. A semântica não está errada por acidente — `tecnica_ok` significa
"o modelo escolheu a tool" — mas a consequência é que o relatório **superestima**
o problema e a trava comercial barra o gancho em turno que teve base. Provável
que precise de um terceiro estado, não de um booleano.

Os outros achados da rodada estão em `hermes-v2-sidecar/reports/_fila.md`.

## 🗂️ Sobre as cópias

⚠️ **Os arquivos 2, 3 e 4 são cópia congelada de uma rodada.** A fonte viva deles
é `hermes-v2-sidecar/reports/`, onde o gerador escreve — pela jurisdição do
`CLAUDE.md` §1.2, quem escreve relatório é a janela da VPS. **Rodada nova não
atualiza esta pasta**: ela é o retrato do dia em que a cadeia foi entendida.

O arquivo 1 **mora aqui** — ele não é relatório, é doutrina, e veio de
`execucao/agente-whatsapp-vault/_cadeia-da-resposta-do-leo.md`.

## Vizinhos

- `../_aceite-lastro-na-resposta.md` — o critério de aceite que originou a rodada
- `../_curadoria-base-2026-09-22.md` — o estado da base que o Léo consulta
- `../../../hermes-v2-sidecar/reports/aceite-2026-09-22-lastro.md` — o relatório
  de aceite, critério a critério
