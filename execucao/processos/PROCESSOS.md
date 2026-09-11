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

**Placar:** 🟢 10 sabemos e dá · 🟡 5 falta decidir · 🔴 3 não sabemos

---

## P4 · Adicionar um serviço avulso à fatura aberta

> A pessoa pede um serviço à-la-carte dentro do app. Ele não cobra na hora: entra como item de linha na fatura da competência. Atravessa /mais/servicos (onde nasce) e /mais/plano (onde aparece).
>
> 🔑 **Por que importa:** É o balde vendável inteiro. O líder fatura ~45 serviços assim, e é receita oculta do modelo dele. É também o processo que mais atravessa tela, então é onde uma incoerência aparece primeiro.

🟢 10 · 🟡 5 · 🔴 3

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P4.1** Escolhe o serviço | cliente | Mostra o catálogo à-la-carte com preço aberto e o prazo estimado. Um toque abre o detalhe. | só a nossa casa | A loja em /mais/servicos, com os mais pedidos em destaque. |
| 🟢 | **P4.2** Aceita o serviço, na sheet | cliente | Mostra preço, o que a pessoa recebe, o prazo estimado e quando vai ser cobrado (“entra na fatura de 05/08” ou “paga agora”), e só então libera o botão. O toque no botão É o aceite. | só a nossa casa | A sheet de detalhe do serviço, com valor, a linha do momento da cobrança e “Solicitar serviço”. Falta ali o prazo estimado e o texto do que está sendo contratado. |
| 🟢 | **P4.3** ◆ Custa mais de R$ 50? | a casa | Olha o preço do serviço e decide se ele pode simplesmente cair na fatura ou se precisa de um aceite formal na hora. | só a nossa casa | nada, acontece por baixo |
| 🟡 | **P4.5** Guarda o pedido e trava o preço | a casa | Cria o pedido com o preço do dia congelado, para que reajuste posterior não mude o que já foi contratado. | só a nossa casa | nada, acontece por baixo |
| 🔴 | **P4.6** ◆ Existe fatura ABERTA na competência? | a casa | Procura a fatura do mês corrente que ainda não fechou. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P4.7** Entra como item de linha | a casa | Soma o serviço à fatura como uma linha própria, ao lado da mensalidade, com descrição, valor e tipo. | só a nossa casa | O item aparece no /mais/plano, dentro de 'Próxima fatura'. |
| 🟢 | **P4.8** O trabalho começa. Não dá pra remover. | a casa | Marca o item como em andamento e coloca na fila de execução. A partir daqui o cliente não pode tirar da fatura. | só a nossa casa | Chip 'Em andamento' ao lado do item, com a data do pedido. Sem X de remover. |
| 🔴 | **P4.9** ◆ E se o serviço não puder ser entregue? | a casa | ainda não sabemos | ainda não sabemos | ainda não sabemos |
| 🔴 | **P4.10** ◆ E se cancelar o plano com avulso em andamento? | cliente | ainda não sabemos | só a nossa casa | ainda não sabemos |
| 🟡 | **P4.11** ■ A competência fecha e a fatura soma tudo | o relógio | No fechamento, a fatura para de aceitar item novo e vira o total que será cobrado. | só a nossa casa | O total no /mais/plano deixa de mudar. |
| 🟢 | **P4.12** ■ Fechou a sheet, e nada acontece | cliente | Fecha sem pedir nada. Não cria pedido, não guarda aceite, não cobra. | só a nossa casa | Volta pra lista de serviços, no mesmo lugar onde estava. |
| 🟢 | **P4.13** Guarda o comprovante do aceite | a casa | Grava data, hora, o texto exato que foi aceito e a versão da tabela de preços vigente, e deixa isso disponível pra consulta na Plataforma. | só a nossa casa | O aceite fica listado no histórico do serviço, com data e hora, e pode ser reaberto. |
| 🟡 | **P4.14** Paga na hora | cliente | Gera a cobrança do valor travado no aceite e leva a pessoa pro pagamento, sem sair do app. A forma escolhida aqui TRAVA com o pedido: ela define o prazo de validade e não muda depois. | Stone | Tela de pagamento com o valor, o serviço, o prazo estimado de entrega e até quando o pedido vale. Pix, cartão ou boleto. |
| 🟡 | **P4.15** ◆ O pagamento confirmou? | o gateway | Espera a CAPTURA, não a autorização nem a liquidação. Pix confirma no webhook, boleto na compensação, cartão na captura. Só aí o serviço é liberado. | Stone (webhook de captura) | O item mostra “aguardando pagamento” até confirmar, e muda sozinho quando confirma. |
| 🟢 | **P4.16** Fica aguardando dentro do prazo | a casa | Segura o pedido pelo prazo da forma escolhida: 72 horas no Pix e no cartão, 6 dias no boleto, que precisa compensar. Preço e aceite travados, fora da fila de execução. Dentro da janela, a pessoa retoma o pagamento de onde parou, quantas vezes quiser — na MESMA forma, que não se troca. | só a nossa casa | O item aparece como “aguardando pagamento”, com o tempo que resta e o botão pra pagar sempre à mão. Pra trocar de forma de pagamento, pedir de novo. Nada de “em andamento”. |
| 🟢 | **P4.17** ■ Expirou, e vira histórico | o relógio | Vencido o prazo da forma escolhida sem captura, derruba o pedido: preço e aceite perdem validade e o item some da tela. Guarda o registro de que foi solicitado e não pago. | só a nossa casa | O item sai da lista. Pra pedir de novo — ou pra trocar a forma de pagamento — começa do zero, pelo preço do dia. |
| 🟡 | **P4.18** Cancelou com o avulso já pago | a casa | Não há o que cobrar: já foi pago no ato. Entrega dentro do aviso prévio, valendo a mesma régua do P4.10 — o que precisa de CNPJ ativo tem que sair antes da baixa. | só a nossa casa | Na tela de cancelamento, o item aparece como já pago e com a data prevista de entrega, sem valor a quitar. |
| 🟢 | **P4.19** ■ Entregue, e já estava pago | a casa | Encerra o item. Não há nada a lançar em fatura: o dinheiro entrou no ato do pedido. | só a nossa casa | O item vira “concluído” no histórico de serviços, com o comprovante de pagamento junto. |

### Por onde o processo caminha

- `P4.1` → `P4.2`
- `P4.2` → `P4.13` — *aceitou*
- `P4.2` → `P4.12` — *fechou a sheet*
- `P4.13` → `P4.5`
- `P4.5` → `P4.3`
- `P4.3` → `P4.6` — *até R$ 50 · vai pra fatura*
- `P4.3` → `P4.14` — *acima de R$ 50 · paga agora*
- `P4.6` → `P4.7` — *fatura aberta*
- `P4.6` → `P4.11` — *já fechou · ❓*
- `P4.7` → `P4.8`
- `P4.14` → `P4.15`
- `P4.15` → `P4.8` — *pago*
- `P4.15` → `P4.16` — *não pagou*
- `P4.16` → `P4.17` — *venceu o prazo do pedido*
- `P4.8` → `P4.9` — *não deu certo*
- `P4.8` → `P4.10` — *cancelou o plano*
- `P4.8` → `P4.18` — *cancelou o plano*
- `P4.8` → `P4.11` — *correu bem*
- `P4.8` → `P4.19` — *correu bem*
- `P4.18` → `P4.9` — *não deu pra entregar*

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

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

**🟡 P4.14 · Paga na hora**

O provedor está decidido (Stone, 11/09), mas o caminho técnico não: falta saber por qual produto da casa a integração entra (a Pagar.me é do grupo Stone) e, principalmente, se o formato nos mantém FORA do escopo PCI — foi exatamente isso que derrubou o Asaas em 08/09. Enquanto isso não estiver confirmado por escrito com eles, não é verde.

**🟡 P4.15 · O pagamento confirmou?**

O gate está decidido (captura). O que segura este passo é o mesmo do S10a: até a integração com a Stone estar confirmada, não sabemos o formato do retorno nem se ele nos mantém fora do escopo PCI. Segue aberta uma pergunta de experiência: a pessoa espera na tela até confirmar, ou o app deixa ela sair e avisa depois? Com boleto, que leva de 1 a 3 dias úteis pra compensar, esperar na tela não é opção — e é por isso que o prazo dele é o dobro (S10c).

**🟡 P4.18 · Cancelou com o avulso já pago**

Se o serviço já pago NÃO couber nos 30 dias do aviso prévio, o dinheiro volta? A 12.6 não alcança (não há valor em aberto) e a 9.5 só fala de taxa pública. Cai na régua do S6 (quem deu causa), mas com dinheiro já compensado, que é situação diferente de item na fatura.

### Detalhe técnico

- **P4.7** — 📚 O modelo do líder confirma que fatura suporta itens: `GET /api/pagamentos/faturas/` devolve `itens[]` com `{descricao, valor, tipo}`, e a mensalidade é UM dos tipos, não o objeto.
- **P4.11** — O fechamento em si é o processo P1, que ainda não foi desenhado.

### Fonte de cada regra

- **P4.1** — Tela construída em 24/07. Doutrina anti-dark-pattern: preço aparece ANTES do clique.
- **P4.2** — Cláusula 6.3 (preço e momento da cobrança exibidos antes, aceite no ato), 6.1 (prazo estimado) e 1.6 (a confirmação na Plataforma integra o contrato). Decisão do Pedro em 11/09: a sheet que já existe é o nosso aceite, e o aceite vale para qualquer valor.
- **P4.3** — Cláusula 6.3 da nossa minuta: serviço de até R$ 50 é lançado na fatura da competência seguinte; acima disso exige aceite específico no ato, com exibição prévia do preço e do momento da cobrança.
- **P4.5** — Decorre da cláusula 6.3, que manda exibir o preço antes. Preço exibido e preço cobrado têm que ser o mesmo.
- **P4.6** — Modelo de fatura por competência, travado em 11/09.
- **P4.7** — Modelo de fatura por competência (ADR 11/09). Evidência: 2026-09-11-contabilizei-modelo-de-cobranca.
- **P4.8** — Decisão de 27/07: 'pedir = o trabalho já começou'. Transparência sem fingir carrinho — mostrar um X que não remove seria pior.
- **P4.11** — Modelo de fatura por competência (ADR 11/09).
- **P4.12** — Decisão do Pedro em 11/09. Sem aceite não há contratação (cláusula 6.3).
- **P4.13** — Cláusula 6.4 (“que ficará registrada na Plataforma”), 1.6 (a confirmação integra o contrato) e 16.9 (registro de data e hora do aceite).
- **P4.14** — Decisão do Pedro em 11/09: acima de R$ 50, o pagamento acontece no ato da solicitação. Compatível com a cláusula 6.3, que exige exibir “o momento da cobrança” — aqui o momento é agora. O Anexo I já usa “no ato” para todos os itens acima de R$ 50.
- **P4.15** — Decisão do Pedro em 11/09: “só será iniciado/liberado após efetuação do pagamento” e o gate é a CAPTURA — não a autorização, que só reserva limite, nem a liquidação, que no cartão é D+30.
- **P4.16** — Decisão do Pedro em 11/09: 72 horas no Pix e no cartão, 6 dias no boleto (o dobro, pela compensação), e a forma de pagamento não se altera num pedido já gerado. Decorre da 6.4, que trava o preço na data da contratação — prazo aberto seria preço que nunca reajusta.
- **P4.17** — Decisão do Pedro em 11/09: vencido o prazo (72 horas no Pix e no cartão, 6 dias no boleto), some da tela, e a ocorrência fica registrada em banco pra termos histórico de quem solicitou e não pagou.
- **P4.18** — Cláusula 12.1 (aviso prévio de 30 dias). A 12.6 trata de valor em aberto, e aqui não há — o pagamento no ato tirou este caso do alcance dela.
- **P4.19** — Decorre do pagamento no ato (decisão do Pedro, 11/09): item pago não entra em fatura.
