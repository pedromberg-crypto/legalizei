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

**Placar:** 🟢 21 sabemos e dá · 🟡 11 falta decidir · 🔴 1 não sabemos

---

## P1 · A competência fecha, a fatura é emitida e cobrada

> O ciclo do cliente vira no dia da assinatura, a fatura soma o que se acumulou e a cobrança sai na forma cadastrada. Daqui em diante o processo trata do dinheiro: pagou, não pagou, o que muda no preço, e o que a casa faz com quem atrasa.
>
> 🔑 **Por que importa:** É pra onde o P4 entrega, e era caixa preta declarada. É onde moram as cláusulas 3.5, 3.6, 3.7, 3.14 e 3.15 da minuta, que hoje não têm desenho nenhum — e onde se decide o que a casa faz com quem atrasa, que é posicionamento, não sistema. ⚠️ NÃO confundir com o pagamento da GUIA (linha 2.4 do catálogo): aqui quem recebe somos nós e o trilho é nosso; lá quem recebe é o governo e a gente nem vê o dinheiro.

🟢 5 · 🟡 7 · 🔴 0

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P4.11** ■ O ciclo vira e a fatura soma tudo | o relógio | No dia do aniversário do contrato, fecha a janela de itens do ciclo que terminou e emite a fatura. Assinou dia 8, o ciclo vira todo dia 8. | só a nossa casa | A fatura muda de “Próxima fatura” para “Fatura de <ciclo>” e para de aceitar item novo. A data do próximo fechamento aparece o tempo todo. |
| 🟢 | **P4.24** O ciclo vira no dia da assinatura | o relógio | Conta a partir do dia da assinatura. Se o mês não tiver esse dia, cobra no último dia dele e volta pro dia original no mês seguinte que tiver. Se a data cair em fim de semana, joga pro próximo dia útil. A âncora nunca muda. | só a nossa casa | A data da próxima cobrança sempre escrita por extenso, nunca “daqui a um mês”. |
| 🟢 | **P1.1** Monta a fatura do ciclo | a casa | Soma a mensalidade do ciclo que começa, os avulsos de até R$ 50 do ciclo que terminou, a folha por colaborador ativo e o endereço fiscal, se tiver. | só a nossa casa | A fatura aberta em /mais/plano, com cada linha nomeada e o total. |
| 🟡 | **P1.2** ◆ O preço mudou neste ciclo? | a casa | Antes de fechar o valor, confere se a faixa de RBT12 mudou, se a oferta de lançamento acabou ou se houve reajuste anual. | só a nossa casa | nada, acontece por baixo |
| 🟡 | **P1.3** Avisa o preço novo, 30 dias antes | a casa | Dispara o aviso da mudança com pelo menos 30 dias de antecedência, dizendo o valor novo, a razão e a partir de qual ciclo vale. | só a nossa casa | Aviso na central, na categoria “precisa de você”, e o valor novo marcado na fatura seguinte. |
| 🟡 | **P1.4** Emite a fatura e cobra na forma cadastrada | a casa | Fecha o valor, emite a fatura e dispara a cobrança recorrente na forma que o cliente cadastrou. | Stone | A fatura muda de “Próxima” para “Em aberto”, com a data de vencimento e a forma de pagamento à vista. |
| 🟡 | **P1.5** ◆ A fatura foi paga? | o gateway | Espera a captura. Mesmo gate do avulso: não vale a autorização, não se espera a liquidação. | Stone (webhook de captura) | A fatura vira “paga” sozinha, sem a pessoa precisar avisar. |
| 🟢 | **P1.6** ■ Dá baixa e o ciclo segue | a casa | Marca a fatura como paga, guarda o comprovante e abre o ciclo seguinte. | só a nossa casa | Histórico de faturas com a paga no topo, e a próxima já anunciada com a data. |
| 🟢 | **P1.7** Venceu: entra multa e juros | o relógio | Passado o vencimento, aplica multa de 2% e juros de 0,033% por dia de atraso, e mostra o valor atualizado. | só a nossa casa | A fatura fica “vencida”, com o valor de hoje e a conta aberta: original, multa e juros separados. |
| 🟡 | **P1.8** Tenta de novo, e avisa sem assustar | a casa | Repete a cobrança em dias combinados e avisa o cliente com o que ele precisa fazer, sem falar em exclusão do Simples nem em multa da Receita. | Stone | Aviso com o valor, a data da próxima tentativa e um botão pra pagar agora ou trocar a forma. |
| 🟡 | **P1.9** Suspende o acesso, sem apagar o dado | a casa | Persistindo a falta de pagamento, suspende os serviços e o acesso ao software. O dado do cliente continua lá e volta assim que ele quitar. | só a nossa casa | Tela dizendo o que está suspenso, o que continua funcionando, e exatamente o que fazer pra voltar. |
| 🟡 | **P1.10** ■ Duas mensalidades: a casa pode encerrar | a casa | Com duas mensalidades consecutivas em aberto, a Legalizai pode encerrar o contrato sem aviso prévio e cobrar o que está em aberto. | só a nossa casa | Aviso formal do encerramento, com o que ainda é devido e como quitar. |

### Por onde o processo caminha

- `P1.1` → `P1.2`
- `P1.2` → `P1.4` — *o preço é o mesmo*
- `P1.2` → `P1.3` — *mudou de faixa, acabou a oferta ou teve reajuste*
- `P1.3` → `P1.4`
- `P1.4` → `P1.5`
- `P1.5` → `P1.6` — *pagou*
- `P1.5` → `P1.7` — *não pagou*
- `P1.7` → `P1.8`
- `P1.8` → `P1.5` — *tentou de novo*
- `P1.8` → `P1.9` — *segue sem pagar*
- `P1.9` → `P1.10` — *2 mensalidades em aberto*

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

**🟡 P1.2 · O preço mudou neste ciclo?**

As três regras exigem aviso prévio de 30 dias e nenhuma tem tela ou disparo hoje. Quem avisa, por qual canal, e o que acontece se o aviso não sair a tempo — a fatura sobe assim mesmo, ou o preço velho vale mais um ciclo? A 3.8 ainda dá ao cliente o direito de encerrar SEM MULTA se não concordar, e esse caminho não existe em lugar nenhum do produto.

**🟡 P1.3 · Avisa o preço novo, 30 dias antes**

O aviso vive só no app, ou também sai por e-mail e WhatsApp? Aviso de preço que a pessoa não vê é o mesmo que aviso nenhum, e a 3.8 dá a ela o direito de sair sem multa. Se ela não soube, a gente perde o direito de cobrar o valor novo.

**🟡 P1.4 · Emite a fatura e cobra na forma cadastrada**

Cobrança RECORRENTE é integração diferente da avulsa do P4.14: exige tokenizar o cartão e guardar o mandato, e isso muda o escopo PCI — exatamente o que derrubou o Asaas em 08/09. Precisa entrar na pauta da reunião com a Stone junto com o avulso, não depois.

**🟡 P1.5 · A fatura foi paga?**

⚠️ CORRIGIDO em 11/09, achado do Pedro: eu tinha escrito aqui o buraco da linha 2.4 do catálogo, e é OUTRO problema. Aqui QUEM RECEBE somos nós — a mensalidade entra pelo nosso trilho, e o webhook da Stone responde. A pergunta que sobra é só de escopo: TODO meio que a gente oferecer passa pela Stone? Boleto emitido por ela compensa de volta por ela, Pix com QR dela também. Se em algum momento a gente aceitar transferência direta pra conta da Legalizai, aí sim nasce um caminho cego — e a recomendação é não aceitar. O buraco da 2.4 é o pagamento da GUIA, onde quem recebe é o governo e a gente nem vê o dinheiro: processo próprio, ainda não desenhado.

**🟡 P1.8 · Tenta de novo, e avisa sem assustar**

Quantas tentativas, em que dias, e por quais canais. O número não é estético: cartão recusado por saldo costuma passar em D+3, mas tentativa demais queima o cartão na antifraude do emissor. Depende da política da Stone.

**🟡 P1.9 · Suspende o acesso, sem apagar o dado**

Depois de quantos dias, e o que EXATAMENTE fica suspenso. Cortar a emissão de nota trava o faturamento do cliente e pode virar dano; cortar a obrigação acessória vira risco fiscal dele e responsabilidade técnica nossa (cláusula 2.3, Res. CFC 1.590/2020). Essa linha precisa do Mauro — não é decisão de produto.

**🟡 P1.10 · Duas mensalidades: a casa pode encerrar**

A 12.3 diz que a casa PODE — falta decidir se a gente faz, e quando. E a 3.15 permite protestar e inscrever em órgão de proteção ao crédito: isso é decisão de POSICIONAMENTO, não de sistema, e bate de frente com o “não punir a saída” que a gente travou em 27/07. Pergunta pro Mauro.

### Detalhe técnico

- **P4.11** — O fechamento em si é o processo P1, que ainda não foi desenhado.

### Fonte de cada regra

- **P4.11** — Decisão do Pedro em 11/09, e ela MANDA: cobrança por aniversário, no dia em que o cliente fechou. ⚠️ A cláusula 3.4 da minuta fixa o pagamento “até o 15º dia de cada mês” e terá que ser ajustada ao produto, não o contrário.
- **P4.24** — Decisão do Pedro em 11/09, e ela é REGRA NOSSA, não régua de mercado: conta do dia da assinatura · fim de semana joga pro próximo dia útil · dia que o mês não tem cobra no último dia, e volta ao original no mês seguinte que tiver. ⚠️ O Código Civil, art. 132 §3º, resolve prazo em mês pelo caminho oposto (“ou no imediato, se faltar exata correspondência”), o que daria 1º/03 — a advogada precisa ver essa diferença, porque a regra vai pro contrato. ⚠️ Ele disse “fim de semana”; eu escrevi “dia útil”, que estende a FERIADO. Se não for isso, muda aqui.
- **P1.1** — Cláusula 6.3 e Anexo A-I.1 (avulso até R$ 50 na competência seguinte), 7.2 e 7.4 (folha R$ 39 por colaborador ATIVO, mesmo sem movimento) e Anexo I (endereço fiscal R$ 49/mês). As duas temporalidades da fatura foram travadas pelo Pedro em 11/09.
- **P1.2** — Cláusula 3.6 (oferta de lançamento: 3 competências, término avisado com 30 dias), 3.7 (RBT12: elevação com aviso de 30 dias, redução automática) e 3.8 (reajuste anual, também com 30 dias).
- **P1.3** — Cláusulas 3.6, 3.7 e 3.8 — as três exigem o mesmo aviso de 30 dias.
- **P1.4** — Decisão do Pedro em 11/09: gateway Stone, ciclo por aniversário, vencimento no dia da assinatura, jogando pro próximo dia útil quando cair em fim de semana.
- **P1.5** — Decisão do Pedro em 11/09: o gate é a captura.
- **P1.6** — Cláusula 3.4 e o histórico de faturas que já existe em /mais/plano.
- **P1.7** — Cláusula 3.5: multa de 2% e juros de mora de 0,033% por dia de atraso.
- **P1.8** — Posicionamento travado: “não vender pânico”. O dunning por medo do líder está na lista do que a gente NÃO faz (§9 do catálogo). A retentativa em si é mecanismo do gateway.
- **P1.9** — Cláusula 3.14 (a ausência de pagamento pode suspender os serviços e o acesso ao software) e 12.7 (a reativação depende de quitação integral).
- **P1.10** — Cláusula 12.3 (ausência de pagamento de 2 mensalidades consecutivas) e 3.15 (protesto, órgãos de proteção ao crédito e cessão do crédito a terceiros).

---

## P4 · Adicionar um serviço avulso à fatura aberta

> A pessoa pede um serviço à-la-carte dentro do app. Ele não cobra na hora: entra como item de linha na fatura da competência. Atravessa /mais/servicos (onde nasce) e /mais/plano (onde aparece).
>
> 🔑 **Por que importa:** É o balde vendável inteiro. O líder fatura ~45 serviços assim, e é receita oculta do modelo dele. É também o processo que mais atravessa tela, então é onde uma incoerência aparece primeiro.

🟢 18 · 🟡 4 · 🔴 1

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P4.1** Escolhe o serviço | cliente | Mostra o catálogo à-la-carte com preço aberto e o prazo estimado. Um toque abre o detalhe. | só a nossa casa | A loja em /mais/servicos, com os mais pedidos em destaque. |
| 🟢 | **P4.2** Aceita o serviço, na sheet | cliente | Mostra preço, o que a pessoa recebe, o prazo estimado e quando vai ser cobrado (“entra na fatura de 05/08” ou “paga agora”), e só então libera o botão. O toque no botão É o aceite. | só a nossa casa | A sheet de detalhe do serviço, com valor, a linha do momento da cobrança e “Solicitar serviço”. Falta ali o prazo estimado e o texto do que está sendo contratado. |
| 🟢 | **P4.3** ◆ Custa mais de R$ 50? | a casa | Olha o preço do serviço e decide se ele pode simplesmente cair na fatura ou se precisa de um aceite formal na hora. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P4.5** Guarda o pedido e trava o preço | a casa | Cria o pedido e congela o preço da tabela vigente NA DATA DO PEDIDO, guardando junto a versão da tabela que a pessoa viu. Reajuste posterior não alcança o que já foi pedido. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P4.6** Acha ou abre a fatura do próximo ciclo | a casa | Procura a fatura do próximo ciclo. Se ela ainda não existir, abre uma, e é nela que o item entra. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P4.7** Entra como item de linha | a casa | Soma o serviço à fatura como uma linha própria, ao lado da mensalidade, com descrição, valor e tipo. | só a nossa casa | O item aparece no /mais/plano, dentro de 'Próxima fatura'. |
| 🟢 | **P4.8** O trabalho começa. Não dá pra remover. | a casa | Marca o item como em andamento e coloca na fila de execução. A partir daqui o cliente não pode tirar da fatura. | só a nossa casa | Chip 'Em andamento' ao lado do item, com a data do pedido. Sem X de remover. |
| 🟡 | **P4.9** ◆ O serviço não pôde ser entregue | a casa | Separa por CAUSA: falha nossa ou do órgão de um lado, falta de documento do cliente do outro. O que acontece com o dinheiro depende de como ele entrou. | só a nossa casa | Aviso no item dizendo por que não deu e o que vai acontecer com o valor. |
| 🟢 | **P4.10** ◆ Cancelou com avulso na fatura | cliente | O contrato segue vivo nos 30 dias de aviso prévio, então o avulso continua normalmente. A única pergunta é se o serviço sobrevive ao fim do CNPJ: o que precisa de empresa ativa tem que sair ANTES da baixa. | só a nossa casa | Na tela de cancelamento, a lista do que continua em andamento e o valor que vai na fatura final, antes de confirmar. |
| 🟢 | **P4.11** ■ O ciclo vira e a fatura soma tudo | o relógio | No dia do aniversário do contrato, fecha a janela de itens do ciclo que terminou e emite a fatura. Assinou dia 8, o ciclo vira todo dia 8. | só a nossa casa | A fatura muda de “Próxima fatura” para “Fatura de <ciclo>” e para de aceitar item novo. A data do próximo fechamento aparece o tempo todo. |
| 🟢 | **P4.12** ■ Fechou a sheet, e nada acontece | cliente | Fecha sem pedir nada. Não cria pedido, não guarda aceite, não cobra. | só a nossa casa | Volta pra lista de serviços, no mesmo lugar onde estava. |
| 🟢 | **P4.13** Guarda o comprovante do aceite | a casa | Grava data, hora, o texto exato que foi aceito e a versão da tabela de preços vigente, e deixa isso disponível pra consulta na Plataforma. | só a nossa casa | O aceite fica listado no histórico do serviço, com data e hora, e pode ser reaberto. |
| 🟡 | **P4.14** Paga na hora | cliente | Gera a cobrança do valor travado no aceite e leva a pessoa pro pagamento, sem sair do app. A forma escolhida aqui TRAVA com o pedido: ela define o prazo de validade e não muda depois. | Stone | Tela de pagamento com o valor, o serviço, o prazo estimado de entrega e até quando o pedido vale. Pix, cartão ou boleto. |
| 🟡 | **P4.15** ◆ O pagamento confirmou? | o gateway | Espera a CAPTURA, não a autorização nem a liquidação. Pix confirma no webhook, boleto na compensação, cartão na captura. Só aí o serviço é liberado. | Stone (webhook de captura) | O item mostra “aguardando pagamento” até confirmar, e muda sozinho quando confirma. |
| 🟢 | **P4.16** Fica aguardando dentro do prazo | a casa | Segura o pedido pelo prazo da forma escolhida: 72 horas no Pix e no cartão, 6 dias no boleto, que precisa compensar. Preço e aceite travados, fora da fila de execução. Dentro da janela, a pessoa retoma o pagamento de onde parou, quantas vezes quiser — na MESMA forma, que não se troca. | só a nossa casa | O item aparece como “aguardando pagamento”, com o tempo que resta e o botão pra pagar sempre à mão. Pra trocar de forma de pagamento, pedir de novo. Nada de “em andamento”. |
| 🟢 | **P4.17** ■ Expirou, e vira histórico | o relógio | Vencido o prazo da forma escolhida sem captura, derruba o pedido: preço e aceite perdem validade e o item some da tela. Guarda o registro de que foi solicitado e não pago. | só a nossa casa | O item sai da lista. Pra pedir de novo — ou pra trocar a forma de pagamento — começa do zero, pelo preço do dia. |
| 🟡 | **P4.18** Cancelou com o avulso já pago | a casa | Não há o que cobrar: já foi pago no ato. Entrega dentro do aviso prévio, valendo a mesma régua do P4.10 — o que precisa de CNPJ ativo tem que sair antes da baixa. | só a nossa casa | Na tela de cancelamento, o item aparece como já pago e com a data prevista de entrega, sem valor a quitar. |
| 🟢 | **P4.19** ■ Entregue, e já estava pago | a casa | Encerra o item. Não há nada a lançar em fatura: o dinheiro entrou no ato do pedido. | só a nossa casa | O item vira “concluído” no histórico de serviços, com o comprovante de pagamento junto. |
| 🟢 | **P4.20** ■ A cobrança fica de pé | a casa | Não devolve nada: o trabalho foi feito e a entrega não saiu porque faltou documento do cliente. O item segue cobrado, do jeito que já estava. | só a nossa casa | O item fica com o aviso de por que não deu, e o valor permanece. |
| 🟢 | **P4.21** ■ Tira da fatura, ou credita na seguinte | a casa | Se a fatura ainda não fechou, tira o item dela. Se já fechou, lança um crédito do mesmo valor na fatura seguinte. | só a nossa casa | O item some da próxima fatura, ou aparece um crédito com o motivo escrito. |
| 🔴 | **P4.22** ■ Estorna o que já foi pago | a casa | O dinheiro já entrou, então devolver é uma operação no provedor, não um ajuste de fatura. Pede o estorno e acompanha até cair. | Stone | O item mostra o estorno em andamento e o prazo de devolução. |
| 🟢 | **P4.23** ■ Entrega e cobra na fatura final | a casa | Entrega o serviço dentro do aviso prévio e lança o valor na fatura final, que é quitada até a data do encerramento. | só a nossa casa | O item segue em andamento normalmente, e aparece na fatura final com a data de encerramento junto. |
| 🟢 | **P4.24** O ciclo vira no dia da assinatura | o relógio | Conta a partir do dia da assinatura. Se o mês não tiver esse dia, cobra no último dia dele e volta pro dia original no mês seguinte que tiver. Se a data cair em fim de semana, joga pro próximo dia útil. A âncora nunca muda. | só a nossa casa | A data da próxima cobrança sempre escrita por extenso, nunca “daqui a um mês”. |

### Por onde o processo caminha

- `P4.1` → `P4.2`
- `P4.2` → `P4.13` — *aceitou*
- `P4.2` → `P4.12` — *fechou a sheet*
- `P4.13` → `P4.5`
- `P4.5` → `P4.3`
- `P4.3` → `P4.6` — *até R$ 50 · vai pra fatura*
- `P4.3` → `P4.14` — *acima de R$ 50 · paga agora*
- `P4.6` → `P4.7`
- `P4.7` → `P4.8`
- `P4.14` → `P4.15`
- `P4.15` → `P4.8` — *pago*
- `P4.15` → `P4.16` — *não pagou*
- `P4.16` → `P4.17` — *venceu o prazo do pedido*
- `P4.8` → `P4.9` — *não deu certo*
- `P4.8` → `P4.10` — *cancelou o plano*
- `P4.8` → `P4.18` — *cancelou o plano*
- `P4.8` → `P4.24` — *correu bem*
- `P4.8` → `P4.19` — *correu bem*
- `P4.24` → `P4.11`
- `P4.18` → `P4.9` — *não deu pra entregar*
- `P4.9` → `P4.20` — *o cliente deu causa*
- `P4.9` → `P4.21` — *falha nossa ou do órgão*
- `P4.9` → `P4.22` — *falha nossa ou do órgão*
- `P4.10` → `P4.23` — *o serviço sobrevive ao fim do CNPJ*
- `P4.10` → `P4.9` — *o serviço morre com a baixa do CNPJ*
- `P4.11` → `P1.1`

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

**🟡 P4.9 · O serviço não pôde ser entregue**

A régua de CAUSA é analogia minha entre a cláusula 9.5 (taxa pública não realizada volta, salvo a que o órgão reteve) e serviço adicional, que a minuta não trata. O desenho está travado; falta o Mauro ou a advogada RATIFICAREM, e provavelmente vira cláusula. As três perguntas caras moram no P4.22 (estorno).

**🟡 P4.14 · Paga na hora**

O provedor está decidido (Stone, 11/09), mas o caminho técnico não: falta saber por qual produto da casa a integração entra (a Pagar.me é do grupo Stone) e, principalmente, se o formato nos mantém FORA do escopo PCI — foi exatamente isso que derrubou o Asaas em 08/09. Enquanto isso não estiver confirmado por escrito com eles, não é verde.

**🟡 P4.15 · O pagamento confirmou?**

O gate está decidido (captura). O que segura este passo é o mesmo do S10a: até a integração com a Stone estar confirmada, não sabemos o formato do retorno nem se ele nos mantém fora do escopo PCI. Segue aberta uma pergunta de experiência: a pessoa espera na tela até confirmar, ou o app deixa ela sair e avisa depois? Com boleto, que leva de 1 a 3 dias úteis pra compensar, esperar na tela não é opção — e é por isso que o prazo dele é o dobro (S10c).

**🟡 P4.18 · Cancelou com o avulso já pago**

Se o serviço já pago NÃO couber nos 30 dias do aviso prévio, o dinheiro volta? A 12.6 não alcança (não há valor em aberto) e a 9.5 só fala de taxa pública. Cai na régua do S6 (quem deu causa), mas com dinheiro já compensado, que é situação diferente de item na fatura.

**🔴 P4.22 · Estorna o que já foi pago**

Três perguntas, e nenhuma tem resposta hoje. (1) A taxa que o gateway reteve volta? Na maioria dos provedores, não — então estorno integral sai do nosso bolso. (2) Estorno ou crédito na próxima fatura? Crédito não custa taxa e é mais rápido, mas prende o cliente. (3) Qual o prazo, e quem avisa quando cai. Tudo isso depende do provedor, que ainda não foi escolhido.

### Detalhe técnico

- **P4.7** — 📚 O modelo do líder confirma que fatura suporta itens: `GET /api/pagamentos/faturas/` devolve `itens[]` com `{descricao, valor, tipo}`, e a mensalidade é UM dos tipos, não o objeto.
- **P4.11** — O fechamento em si é o processo P1, que ainda não foi desenhado.

### Fonte de cada regra

- **P4.1** — Tela construída em 24/07. Doutrina anti-dark-pattern: preço aparece ANTES do clique.
- **P4.2** — Cláusula 6.3 (preço e momento da cobrança exibidos antes, aceite no ato), 6.1 (prazo estimado) e 1.6 (a confirmação na Plataforma integra o contrato). Decisão do Pedro em 11/09: a sheet que já existe é o nosso aceite, e o aceite vale para qualquer valor.
- **P4.3** — Cláusula 6.3 da nossa minuta: serviço de até R$ 50 é lançado na fatura da competência seguinte; acima disso exige aceite específico no ato, com exibição prévia do preço e do momento da cobrança.
- **P4.5** — Cláusula 6.4: aplica-se “a versão vigente na data da contratação de cada serviço, que ficará registrada na Plataforma”. A 6.3 reforça, exigindo exibição prévia do preço.
- **P4.6** — Cláusula 6.3 e Anexo A-I.1: item de até R$ 50 é lançado na fatura da competência seguinte. Com o ciclo por aniversário, qual fatura recebe o item deixa de ser pergunta e vira consequência.
- **P4.7** — Modelo de fatura por competência (ADR 11/09). Evidência: 2026-09-11-contabilizei-modelo-de-cobranca.
- **P4.8** — Decisão de 27/07: 'pedir = o trabalho já começou'. Transparência sem fingir carrinho — mostrar um X que não remove seria pior.
- **P4.9** — Espelha a cláusula 9.5 (não realizado o ato, o valor volta, salvo taxa já retida pelo órgão) e a 1.4 (a Legalizai não responde por documentação não apresentada pelo Cliente). Regra nova: a 9.5 trata de taxa pública, não de serviço adicional.
- **P4.10** — Cláusula 12.6: quitar todos os valores em aberto até a data do encerramento, incluindo serviços adicionais. Cláusula 12.1: aviso prévio de 30 dias.
- **P4.11** — Decisão do Pedro em 11/09, e ela MANDA: cobrança por aniversário, no dia em que o cliente fechou. ⚠️ A cláusula 3.4 da minuta fixa o pagamento “até o 15º dia de cada mês” e terá que ser ajustada ao produto, não o contrário.
- **P4.12** — Decisão do Pedro em 11/09. Sem aceite não há contratação (cláusula 6.3).
- **P4.13** — Cláusula 6.4 (“que ficará registrada na Plataforma”), 1.6 (a confirmação integra o contrato) e 16.9 (registro de data e hora do aceite).
- **P4.14** — Decisão do Pedro em 11/09: acima de R$ 50, o pagamento acontece no ato da solicitação. Compatível com a cláusula 6.3, que exige exibir “o momento da cobrança” — aqui o momento é agora. O Anexo I já usa “no ato” para todos os itens acima de R$ 50.
- **P4.15** — Decisão do Pedro em 11/09: “só será iniciado/liberado após efetuação do pagamento” e o gate é a CAPTURA — não a autorização, que só reserva limite, nem a liquidação, que no cartão é D+30.
- **P4.16** — Decisão do Pedro em 11/09: 72 horas no Pix e no cartão, 6 dias no boleto (o dobro, pela compensação), e a forma de pagamento não se altera num pedido já gerado. Decorre da 6.4, que trava o preço na data da contratação — prazo aberto seria preço que nunca reajusta.
- **P4.17** — Decisão do Pedro em 11/09: vencido o prazo (72 horas no Pix e no cartão, 6 dias no boleto), some da tela, e a ocorrência fica registrada em banco pra termos histórico de quem solicitou e não pagou.
- **P4.18** — Cláusula 12.1 (aviso prévio de 30 dias). A 12.6 trata de valor em aberto, e aqui não há — o pagamento no ato tirou este caso do alcance dela.
- **P4.19** — Decorre do pagamento no ato (decisão do Pedro, 11/09): item pago não entra em fatura.
- **P4.20** — Cláusula 1.4: a Legalizai não responde pelas consequências de documentação não apresentada pelo Cliente.
- **P4.21** — Princípio da cláusula 9.5 aplicado ao avulso: o que não foi realizado não é devido.
- **P4.22** — Mesmo princípio da 9.5, mas com dinheiro já compensado — situação que a minuta não trata.
- **P4.23** — Cláusula 12.6 (quitar tudo em aberto até o encerramento, incluindo serviços adicionais) e 12.1 (aviso prévio de 30 dias).
- **P4.24** — Decisão do Pedro em 11/09, e ela é REGRA NOSSA, não régua de mercado: conta do dia da assinatura · fim de semana joga pro próximo dia útil · dia que o mês não tem cobra no último dia, e volta ao original no mês seguinte que tiver. ⚠️ O Código Civil, art. 132 §3º, resolve prazo em mês pelo caminho oposto (“ou no imediato, se faltar exata correspondência”), o que daria 1º/03 — a advogada precisa ver essa diferença, porque a regra vai pro contrato. ⚠️ Ele disse “fim de semana”; eu escrevi “dia útil”, que estende a FERIADO. Se não for isso, muda aqui.
