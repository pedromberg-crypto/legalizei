---
tipo: derivado
status: vivo
data: 2026-09-11
assunto: processos-do-produto
gerado_por: execucao/processos/gerar-processos.mjs
tags: [execucao, processos, dev, spec]
---

# 🔗 Processos — o que precisa acontecer, ponta a ponta

> ⚠️ **Nota gerada.** Não editar à mão: rode `node execucao/processos/gerar-processos.mjs`. A fonte é `processos-data.mjs`. Regras: [[_doutrina-processos]].
>
> **Pra quem é:** o dev que vai implementar e o Mauro, que decide as regras de negócio. O mesmo arquivo alimenta o board visual em `/processos`, que é onde o Pedro valida.

**Placar:** 🟢 5 sabemos e dá · 🟡 2 falta decidir · 🔴 4 não sabemos

---

## P4 · Adicionar um serviço avulso à fatura aberta

> A pessoa pede um serviço à-la-carte dentro do app. Ele não cobra na hora: entra como item de linha na fatura da competência. Atravessa /mais/servicos (onde nasce) e /mais/plano (onde aparece).
>
> 🔑 **Por que importa:** É o balde vendável inteiro. O líder fatura ~45 serviços assim, e é receita oculta do modelo dele. É também o processo que mais atravessa tela, então é onde uma incoerência aparece primeiro.

🟢 5 · 🟡 2 · 🔴 4

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P4.1** Escolhe o serviço | cliente | Mostra o catálogo à-la-carte com preço aberto e o prazo estimado. Um toque abre o detalhe. | só a nossa casa | A loja em /mais/servicos, com os mais pedidos em destaque. |
| 🟢 | **P4.2** Confirma, com dupla checagem | cliente | Antes de aceitar, diz o preço, quando será cobrado e avisa que o trabalho começa na hora. Só então libera o botão. | só a nossa casa | Sheet de detalhe com 'Solicitar serviço' e um segundo toque de confirmação. |
| 🟢 | **P4.3** ◆ Custa mais de R$ 50? | a casa | Olha o preço do serviço e decide se ele pode simplesmente cair na fatura ou se precisa de um aceite formal na hora. | só a nossa casa | nada, acontece por baixo |
| 🔴 | **P4.4** Aceite no ato (acima de R$ 50) | cliente | Registra um aceite com data e hora, guardando o preço exibido e o texto que a pessoa leu. | só a nossa casa | nada: a tela não existe |
| 🟡 | **P4.5** Guarda o pedido e trava o preço | a casa | Cria o pedido com o preço do dia congelado, para que reajuste posterior não mude o que já foi contratado. | só a nossa casa | nada, acontece por baixo |
| 🔴 | **P4.6** ◆ Existe fatura ABERTA na competência? | a casa | Procura a fatura do mês corrente que ainda não fechou. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P4.7** Entra como item de linha | a casa | Soma o serviço à fatura como uma linha própria, ao lado da mensalidade, com descrição, valor e tipo. | só a nossa casa | O item aparece no /mais/plano, dentro de 'Próxima fatura'. |
| 🟢 | **P4.8** O trabalho começa. Não dá pra remover. | a casa | Marca o item como em andamento e coloca na fila de execução. A partir daqui o cliente não pode tirar da fatura. | só a nossa casa | Chip 'Em andamento' ao lado do item, com a data do pedido. Sem X de remover. |
| 🔴 | **P4.9** ◆ E se o serviço não puder ser entregue? | a casa | ainda não sabemos | ainda não sabemos | ainda não sabemos |
| 🔴 | **P4.10** ◆ E se cancelar o plano com avulso em andamento? | cliente | ainda não sabemos | só a nossa casa | ainda não sabemos |
| 🟡 | **P4.11** ■ A competência fecha e a fatura soma tudo | o relógio | No fechamento, a fatura para de aceitar item novo e vira o total que será cobrado. | só a nossa casa | O total no /mais/plano deixa de mudar. |

### Por onde o processo caminha

- `P4.1` → `P4.2`
- `P4.2` → `P4.3`
- `P4.3` → `P4.4` — *acima de R$ 50*
- `P4.3` → `P4.5` — *até R$ 50*
- `P4.4` → `P4.5`
- `P4.5` → `P4.6`
- `P4.6` → `P4.7` — *fatura aberta*
- `P4.6` → `P4.11` — *já fechou · ❓*
- `P4.7` → `P4.8`
- `P4.8` → `P4.9` — *não deu certo*
- `P4.8` → `P4.10` — *cancelou o plano*
- `P4.8` → `P4.11` — *correu bem*

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

**🔴 P4.4 · Aceite no ato (acima de R$ 50)**

O aceite acima de R$ 50 é EXIGÊNCIA DO NOSSO CONTRATO e não existe em lugar nenhum do app. Como ele se parece? É o mesmo double-check do P4.2 com texto diferente, ou é uma tela de aceite com trilha própria (data, IP, navegador), como a do contrato? A minuta trata aceite de serviço como coisa formal, então provavelmente é a segunda.

**🟡 P4.5 · Guarda o pedido e trava o preço**

O preço congela no PEDIDO ou no FECHAMENTO da competência? Se o reajuste anual cair entre os dois, a pessoa paga o que viu ou o novo? O contrato manda exibir antes, o que aponta pro pedido — mas isso precisa ser dito, não deduzido.

**🔴 P4.6 · Existe fatura ABERTA na competência?**

🔑 O BURACO CENTRAL DESTE PROCESSO. Se a competência já fechou (pedido no dia 30, fatura fechou no dia 28), o item vai pra competência SEGUINTE, ou abre uma cobrança avulsa? A cláusula 6.3 diz 'fatura da competência seguinte', o que sugere a primeira. Mas aí um pedido feito no dia 1º espera quase 60 dias pra ser cobrado, e o trabalho já foi entregue. Precisa de decisão do Pedro + Mauro.

**🔴 P4.9 · E se o serviço não puder ser entregue?**

Certidão que volta negada, órgão fora do ar, documento que o cliente não mandou. O item já está na fatura e o trabalho já começou. Estorna, vira crédito na fatura seguinte, ou cobra assim mesmo porque o trabalho foi feito? Isso NÃO está no nosso contrato, e o do líder também não responde.

**🔴 P4.10 · E se cancelar o plano com avulso em andamento?**

A cláusula 7.4 do líder cobra tudo que está em aberto no aviso prévio. A nossa minuta não trata de avulso em andamento no cancelamento. Cobra, entrega mesmo assim, ou cancela o serviço junto?

**🟡 P4.11 · A competência fecha e a fatura soma tudo**

Em que DIA a competência fecha? A cláusula 3.4 fixa o vencimento no dia 15, mas vencimento e fechamento são coisas diferentes. O líder tem `jaFechada` e `fechada` no objeto da fatura, então o conceito existe do lado dele — mas o dia é decisão nossa.

### Detalhe técnico

- **P4.7** — 📚 O modelo do líder confirma que fatura suporta itens: `GET /api/pagamentos/faturas/` devolve `itens[]` com `{descricao, valor, tipo}`, e a mensalidade é UM dos tipos, não o objeto.
- **P4.11** — O fechamento em si é o processo P1, que ainda não foi desenhado.

### Fonte de cada regra

- **P4.1** — Tela construída em 24/07. Doutrina anti-dark-pattern: preço aparece ANTES do clique.
- **P4.2** — Balde vendável, ADR 22/07. O double-check existe porque o pedido é IRREVERSÍVEL (ver P4.7).
- **P4.3** — Cláusula 6.3 da nossa minuta: serviço de até R$ 50 é lançado na fatura da competência seguinte; acima disso exige aceite específico no ato, com exibição prévia do preço e do momento da cobrança.
- **P4.4** — Cláusula 6.3 obriga. Nenhuma tela cobre.
- **P4.5** — Decorre da cláusula 6.3, que manda exibir o preço antes. Preço exibido e preço cobrado têm que ser o mesmo.
- **P4.6** — Modelo de fatura por competência, travado em 11/09.
- **P4.7** — Modelo de fatura por competência (ADR 11/09). Evidência: 2026-09-11-contabilizei-modelo-de-cobranca.
- **P4.8** — Decisão de 27/07: 'pedir = o trabalho já começou'. Transparência sem fingir carrinho — mostrar um X que não remove seria pior.
- **P4.11** — Modelo de fatura por competência (ADR 11/09).
