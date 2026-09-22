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

## 22/09/2026 · achados da rodada do lastro

- 🔴 **Checagem `proibido:/[eé] o processo/` é falso positivo.** O caso
  `campo-dossie-iptu` reprova com ela, mas a frase do Léo é *"sem ele a
  Prefeitura não localiza o endereço **e o processo** para"* — que é exatamente
  o que a nota `03` §1 manda dizer. O regex quer pegar o jargão *"é o
  processo"* e pega também o *"e o processo"* de qualquer frase. Achado de
  **teste**, não de agente: o conteúdo está certo e a suíte o reprova.
  Consertar o regex para `\bé o processo\b`.

- ⚠️ **O gate de saída não fecha com os canais de forma confiável.**
  `comercio-gate-saida` e `aceite-epp` reprovam por link ausente em 2 de 4
  rodadas, e `consultar_links` segue entre 0 e 3 chamadas de 28. O filtro de
  endereços garante que o link **escrito** esteja certo, mas não que ele
  **seja escrito**. Isso é o mesmo degrau do lastro, uma camada acima: a
  conclusão do gate poderia ser montada por código a partir de `fatos.link`,
  como o filtro faz.

- ⚠️ **`buscar_cartao` em zero absoluto nas seis rodadas do dia.** Os 58
  cartões nunca foram exercitados por esta suíte. Ou a descrição não compete,
  ou os casos do v12 não perguntam o que um cartão responde. Enquanto não se
  medir, **nada autoriza conclusão sobre a qualidade dos cartões**.

- ⚠️ **`venda-escada` não cita a validade 31/12 de forma estável.** Reprova em
  3 de 4 rodadas por `faltou:/31/12/`, mesmo com `consultar_preco` chamada. O
  dado existe na tabela e na nota; o que falha é ele chegar à fala.
