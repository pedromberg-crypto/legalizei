# 🗂️ Fila de achados — o que a VPS encontrou e NÃO executou

> Existe por causa da **trava 3 do `CLAUDE.md` §1.3** (Pedro, 22/09/2026):
> achado novo **não vira rodada**, vira linha aqui. A VPS executa o pedido que
> recebeu, escreve o achado nesta fila e **segue** — sem voltar perguntando.
>
> Nasceu de um ciclo que cansou: cada achado no meio da execução virava
> conversa, conversa virava novo desenho, e o pedido original não fechava.

## Como usar

**A VPS escreve.** Uma linha por achado, no fim da tabela, no mesmo commit do
relatório da rodada. Sem pedir permissão para enfileirar.

**O vault lê entre rodadas** — nunca no meio de uma — prioriza com o Pedro, e o
que for aprovado sai daqui e entra no **pacote** seguinte (§1.2).

🔑 **Enfileirar não é reclamar.** O achado precisa dizer **o que quebra** e
**como se vê**, não *"isso podia ser melhor"*. Sem sintoma observável, não entra.

⚠️ **O que NÃO vem para cá:** achado que torna o pedido **impossível ou sem
sentido** (o filtro que mediria zero). Esse para a rodada na hora — é a única
exceção da trava 3. A pergunta que separa os dois: **o pedido ainda produz o
número que foi pedido?** Se sim, executa e enfileira.

## Fila

| # | Data | Achado | Como se vê | Onde | Status |
|---|---|---|---|---|---|
| — | — | *(vazia)* | | | |

## Encerrados

| # | Data | Achado | Virou o quê |
|---|---|---|---|
| — | — | *(nenhum ainda)* | |
