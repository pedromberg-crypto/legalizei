---
tipo: derivado
status: vivo
data: 2026-09-15
assunto: processos-do-produto
gerado_por: execucao/processos/gerar-processos.mjs
tags: [execucao, processos, dev, spec]
---

# 🔗 Processos — o que precisa acontecer, ponta a ponta

> ⚠️ **Nota gerada.** Não editar à mão: rode `node execucao/processos/gerar-processos.mjs`. A fonte é `processos-data.mjs`. Regras: [[_doutrina-processos]].
>
> **Pra quem é:** o dev que vai implementar e o Mauro, que decide as regras de negócio. O mesmo arquivo alimenta o board visual em `/processos`, que é onde o Pedro valida.

**Placar:** 🟢 48 sabemos e dá · 🟡 25 falta decidir · 🔴 6 não sabemos

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

- **P4.11** — O fechamento em si é o processo P1, desenhado em 11/09: daqui a fatura segue pro P1.1, que a monta. Este passo é a porta entre os dois — por isso ele é ■ fim no P4 (acaba o escopo do avulso) e continua vivo no P1.

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

## P2 · Emitir a guia do DAS e saber que ela foi paga

> A casa apura e emite a guia todo mês. O cliente pode marcar que pagou, mas quem confirma é a casa: passado o vencimento, ela consulta a arrecadação e descobre sozinha. Não pagou, oferece refazer a guia com o valor de hoje.
>
> 🔑 **Por que importa:** Carrega o diferencial nº 1 do teardown: a linha 2.4 do catálogo, “saber que foi pago SEM perguntar ao cliente”, que era 🔴 sem caminho. 🔑 O desenho do Pedro colapsa o problema: a gente não precisa saber em tempo real, precisa saber UMA VEZ, logo depois do vencimento — e a guia sai sempre no mesmo dia, com o mesmo prazo, então essa data é conhecida desde a emissão.

🟢 4 · 🟡 3 · 🔴 0

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P2.1** Apura e emite a guia do mês | o relógio | No fechamento da competência, apura o DAS com a receita do mês e emite a guia, sempre no mesmo dia e com o mesmo prazo. | Serpro Integra Contador (PGDAS-D) | A guia aparece em /impostos com valor, vencimento e código de barras. |
| 🟢 | **P2.2** Marca “já paguei”, se quiser | cliente | Deixa a pessoa dizer que pagou, e passa a mostrar a guia como quitada na hora. | só a nossa casa | Um toque em “já paguei” na guia, sem formulário e sem anexo. |
| 🟢 | **P2.3** ◆ Passou o vencimento? | o relógio | Espera o vencimento passar. Como a guia sai sempre no mesmo dia e com o mesmo prazo, a data da conferência é conhecida desde a emissão. | só a nossa casa | nada, acontece por baixo |
| 🟡 | **P2.4** Consulta a arrecadação e descobre sozinha | a casa | Consulta se a guia daquela competência foi quitada, sem perguntar nada ao cliente. | Serpro (consulta de arrecadação) | nada, acontece por baixo |
| 🟡 | **P2.5** ◆ A guia foi paga? | a casa | Compara o que a consulta respondeu com o que está na tela, e resolve a divergência. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P2.6** ■ Guia quitada, e o mês fecha | a casa | Marca a guia como paga com a data real do pagamento e guarda no histórico. | só a nossa casa | A guia vira “paga” com a data, e entra no histórico de guias pagas. |
| 🟡 | **P2.7** Venceu sem pagar: oferece refazer a guia | a casa | Avisa que a guia venceu e oferece refazê-la com o valor de hoje, já com multa e juros, por R$ 9,90. | só a nossa casa | Aviso na guia vencida com o CTA “Recalcular por R$ 9,90”, dizendo o que muda e por quê. |

### Por onde o processo caminha

- `P2.1` → `P2.2`
- `P2.2` → `P2.3`
- `P2.3` → `P2.4` — *venceu*
- `P2.4` → `P2.5`
- `P2.5` → `P2.6` — *foi paga*
- `P2.5` → `P2.7` — *não foi paga*
- `P2.7` → `P4.2` — *aceitou recalcular*

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

**🟡 P2.4 · Consulta a arrecadação e descobre sozinha**

🔴 FALTA CONFIRMAR COM O SERPRO se o Integra Contador expõe a consulta de arrecadação por competência, e a que custo por chamada. É a única peça técnica do desenho — o resto é nosso. Se não expuser, os caminhos que sobram são Open Finance read-only (exige consentimento do cliente) ou conciliação manual, que não escala.

**🟡 P2.5 · A guia foi paga?**

O que acontece quando o cliente marcou “já paguei” e a consulta diz que não. O líder tem esse caso e resolve derrubando a marcação com ~30 dias de atraso (evidência de tela, 09/09) — o que é desmentir o cliente, tarde. A gente confere em dias, não em 30, mas a pergunta continua: a casa corrige em silêncio, ou avisa? E se a consulta é que estiver desatualizada?

**🟡 P2.7 · Venceu sem pagar: oferece refazer a guia**

⚠️ A COPY decide se isto é serviço ou chantagem. O §9 do catálogo rejeita o “dunning por medo” do líder, e oferecer um pago no exato momento em que a pessoa está em falta é a hora mais fácil de escorregar pra isso. A regra tem que ser: avisar do vencimento é GRÁTIS e incondicional; o recálculo é conveniência opcional, e a guia velha continua paga­vel com os acréscimos por conta dela. Falta escrever o texto e ratificar com o Pedro.

### Fonte de cada regra

- **P2.1** — Matriz de dependência, linha 2.2 (resolvida em 09/09): o Integra Contador tem API REST oficial pro PGDAS-D e não exige procuração e-CAC com o A1 da própria empresa.
- **P2.2** — Decisão do Pedro em 11/09. ⚠️ Isto NÃO reabre o que foi rejeitado em 27/07. Lá, “informe se você pagou” era a ÚNICA fonte — o cliente fazendo o trabalho da casa. Aqui é conveniência: ele ganha a guia quitada na hora se quiser, e a casa confere sozinha depois (P2.4). A marcação não é a verdade; é um atalho.
- **P2.3** — Decisão do Pedro em 11/09: conferir perto do vencimento, não continuamente.
- **P2.4** — Caminho (b) da linha 2.4 da matriz de dependência: consulta de arrecadação no e-CAC via Serpro. 🔑 O contrato do Integra Contador já está previsto para a emissão (2.2), então o custo marginal desta consulta tende a ser baixo.
- **P2.5** — Decisão do Pedro em 11/09.
- **P2.6** — Linha 2.5 do catálogo (histórico de guias pagas), tela já construída em /impostos/guias.
- **P2.7** — Decisão do Pedro em 11/09: R$ 9,90, contra R$ 15,90 do líder. Por estar abaixo de R$ 50, entra na fatura do próximo ciclo pela cláusula 6.3 — não cobra na hora.

---

## P3 · Emitir a nota fiscal

> A pessoa presta o serviço e fatura. A casa pede só o valor e o cliente, transmite ao Emissor Nacional e devolve a nota pronta. A receita que nasce aqui é o que alimenta o resto do produto.
>
> 🔑 **Por que importa:** É o processo que os OUTROS consomem: a receita define o DAS (P2.1), a faixa de RBT12 (P1.2), o Fator R e o teto do Simples. ⏱ E é o único com relógio correndo: a Res. CGSN 191/2026 obriga toda ME/EPP (citacao de norma, FORA DO ESCOPO como porte atendido) do Simples ao Emissor Nacional a partir de 01/11/2026. 🔑 O caminho técnico é o mais resolvido do produto — API nacional RESTful, gratuita, com Swagger público — então o que sobra aqui é desenho, não integração.

🟢 8 · 🟡 2 · 🔴 1

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P3.1** Prestou o serviço e precisa faturar | cliente | Nada ainda: é o fato gerador acontecendo. A casa só entra quando a pessoa vem emitir. | só a nossa casa | O CTA de emitir, fixo no centro da barra de abas. |
| 🟢 | **P3.2** ◆ Emite aqui, ou já emitiu fora? | a casa | Separa os dois caminhos: a nota nasce no app, ou nasceu fora e precisa entrar aqui pra receita fechar. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P3.3** Pede só o valor e o cliente | cliente | Pergunta o valor e para quem é. Os três códigos que o órgão exige já vêm preenchidos do cadastro, e a pessoa não precisa saber que existem. | só a nossa casa | A tela /emitir, com valor, tomador e o resumo do que vai ser emitido. |
| 🟡 | **P3.4** Sugere o código do serviço | a casa | Olha a atividade da empresa e propõe o código municipal do serviço, deixando a pessoa trocar se for outro. | só a nossa casa | O código já escolhido, com uma linha dizendo em português o que ele significa. |
| 🟢 | **P3.5** Transmite ao Emissor Nacional | a casa | Assina com o certificado da empresa e transmite ao Ambiente de Dados Nacional, esperando o número, o PDF e o XML. | Emissor Nacional (ADN, Serpro/RFB) | Um “emitindo…” curto, e a nota pronta em seguida. |
| 🟢 | **P3.6** ◆ O órgão aceitou? | a casa | Lê a resposta do ADN e decide se a nota está autorizada ou se voltou com erro. | Emissor Nacional (ADN) | nada, acontece por baixo |
| 🟢 | **P3.7** ■ Nota emitida, e a receita entra na conta | a casa | Guarda número, PDF e XML, entrega a nota ao cliente e soma o valor à receita do mês e ao acumulado de 12 meses. | só a nossa casa | A nota na lista, pronta pra baixar ou enviar, e o valor já refletido no resumo do mês. |
| 🟡 | **P3.8** Voltou com erro, e a pessoa entende o porquê | a casa | Traduz o erro do órgão pra português comum, diz o que corrigir e deixa tentar de novo sem redigitar tudo. | só a nossa casa | A mensagem do que está errado, no campo que está errado, e o botão de tentar de novo. |
| 🟢 | **P3.9** ◆ O certificado está válido? | a casa | Antes de transmitir, confere se o certificado da empresa está válido. Sem ele não existe emissão. | só a nossa casa | nada, acontece por baixo |
| 🔴 | **P3.10** Emitiu fora: a nota precisa entrar aqui | cliente | Recebe a nota emitida em outro sistema pra que a receita do mês feche. Sem isso, o DAS sai errado. | ainda não sabemos | nada: a tela não existe |
| 🟢 | **P3.11** Emissão parada: falta o certificado | a casa | Segura a emissão e leva pro que resolve: agendar a videochamada, se ele nunca fez, ou renovar, se venceu. | só a nossa casa | Aviso dizendo que a emissão está parada, por quê, e o botão que resolve. |

### Por onde o processo caminha

- `P3.1` → `P3.2`
- `P3.2` → `P3.3` — *emite aqui*
- `P3.2` → `P3.10` — *já emitiu fora*
- `P3.3` → `P3.4`
- `P3.4` → `P3.9`
- `P3.9` → `P3.5` — *válido*
- `P3.9` → `P3.11` — *vencido ou ausente*
- `P3.5` → `P3.6`
- `P3.6` → `P3.7` — *autorizada*
- `P3.6` → `P3.8` — *voltou com erro*
- `P3.8` → `P3.3` — *corrigiu e tenta de novo*
- `P3.10` → `P3.7` — *a nota entrou*
- `P3.11` → `P3.9` — *renovou o certificado*

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

**🟡 P3.4 · Sugere o código do serviço**

A matriz cobre o de-para de CNAE para o código municipal de BH, mas quem emite pra fora precisa do código do MUNICÍPIO DO TOMADOR em alguns casos. Falta decidir se a sugestão cobre só BH no MVP e o resto cai em escolha manual, ou se a gente mapeia mais municípios antes de lançar.

**🟡 P3.8 · Voltou com erro, e a pessoa entende o porquê**

Falta a lista de erros que o ADN devolve e o de-para pra português. Sem ela, ou a gente mostra o código cru do órgão (que é o que todo mundo faz e a gente critica) ou inventa um texto genérico que não ajuda. É trabalho de leitura do manual do ADN, não de decisão.

**🔴 P3.10 · Emitiu fora: a nota precisa entrar aqui**

🔑 É O BURACO REAL DESTE PROCESSO, e não é de API: é de RESPONSABILIDADE. Se a pessoa emite fora e não traz, a receita fica menor do que é, o DAS sai a menor, e quem responde pelo imposto é ela (5.4 e 13.8) — mas quem calculou fomos nós. Três caminhos: (a) puxar do ADN as notas do CNPJ, já que a partir de 01/11/2026 TODAS passam por lá, e aí o problema pode sumir sozinho; (b) upload de XML; (c) digitação. O (a) é o que muda o jogo e precisa ser confirmado no manual do ADN.

### Fonte de cada regra

- **P3.1** — Cláusula 5.4: o Cliente se compromete a emitir as notas “imediatamente após o fato gerador”, pela Plataforma, ou nela importá-las quando emitidas por outro sistema.
- **P3.2** — Cláusula 5.4, que prevê os dois casos com todas as letras.
- **P3.3** — Catálogo 3.1 (construída) e 3.5 (cadastro de tomadores). Doutrina: o líder pede 3 códigos (CNAE, LC116, municipal); a gente pede 2 campos.
- **P3.4** — Catálogo 3.6, hoje 🔴 sem tela. A matriz CNAE já tem o de-para, então é engine nossa, sem IA e sem dependência externa.
- **P3.5** — Matriz 3.1, resolvida em 09/09: API RESTful, GRATUITA, com Swagger público, autenticada por token e usando o A1 da empresa. ⚠️ Não comparar mais fornecedores — o caminho é a API nacional.
- **P3.6** — Retorno síncrono da API nacional.
- **P3.7** — Catálogo 3.2 e 3.3 (telas construídas). 🔑 É AQUI que os outros processos se abastecem: a receita do mês vira o DAS no P2.1, e o acumulado de 12 meses decide a faixa de RBT12 no P1.2, o Fator R e o teto do Simples. Não há aresta entre os processos porque não há salto — é DADO que atravessa, não caminho.
- **P3.8** — Doutrina anti-jargão do projeto: erro de órgão não se repassa cru.
- **P3.9** — Cláusula 5.3: é condição essencial que o Cliente mantenha o certificado digital válido.
- **P3.10** — Cláusula 5.4, que obriga o Cliente a importar na Plataforma a nota emitida por outro sistema. Catálogo 3.7, hoje 🔴.
- **P3.11** — Decisão do Pedro em 11/09: o certificado é BRINDE do plano, pagamento único nosso (R$ 209/ano, Anexo I), e vale 1 ano — então não falta certificado durante os 12 meses de fidelidade. ⚠️ Restam DOIS casos, e nenhum é “venceu no meio do caminho”: (a) o titular não compareceu à videochamada e nunca teve certificado — a 8.3 diz que a ausência não devolve valor nem prorroga prazo, e esse caso acontece logo no começo; (b) a partir do 13º mês, quando a renovação entra e a 8.6 a suspende por inadimplência. O caso (b) fica FORA do MVP, e está registrado aqui pra não virar surpresa no ano 2.

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

Três perguntas, e nenhuma tem resposta hoje. (1) A taxa que o gateway reteve volta? Na maioria dos provedores, não — então estorno integral sai do nosso bolso. (2) Estorno ou crédito na próxima fatura? Crédito não custa taxa e é mais rápido, mas prende o cliente. (3) Qual o prazo, e quem avisa quando cai. Tudo isso depende da política da Stone, que é o provedor nomeado nos passos de pagamento (P4.14, P4.15, P4.22). ⚠️ O que segue aberto NÃO é a escolha do provedor, é a condição comercial dele: quanto ele devolve num estorno e em que prazo. Pauta da reunião, junto com o mandato recorrente do P1.4.

### Detalhe técnico

- **P4.7** — 📚 O modelo do líder confirma que fatura suporta itens: `GET /api/pagamentos/faturas/` devolve `itens[]` com `{descricao, valor, tipo}`, e a mensalidade é UM dos tipos, não o objeto.
- **P4.11** — O fechamento em si é o processo P1, desenhado em 11/09: daqui a fatura segue pro P1.1, que a monta. Este passo é a porta entre os dois — por isso ele é ■ fim no P4 (acaba o escopo do avulso) e continua vivo no P1.

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

---

## P5 · Definir e pagar o pró-labore

> Todo mês a casa calcula quanto de pró-labore mantém a empresa no anexo mais barato, a pessoa mexe e vê o imposto mudar, e o valor é declarado. Só entra no Fator R o que foi efetivamente pago.
>
> 🔑 **Por que importa:** Fecha o loop mensal: a receita nasce no P3, o imposto sai no P2, e a ALÍQUOTA daquele imposto se decide aqui — Fator R ≥ 28% é Anexo III (6%), senão Anexo V (15,5%). É também o diferencial-âncora do produto (o líder tem 4 presets e esconde a conta) e carrega a armadilha mais cara que a gente mapeou: pró-labore lançado e NÃO pago vira glosa, reclassificação e multa.

🟢 7 · 🟡 3 · 🔴 1

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P5.1** Chega o mês, e o pró-labore precisa ser decidido | o relógio | Abre a decisão do mês com o valor sugerido já calculado, em vez de esperar a pessoa lembrar. | só a nossa casa | A tarefa do mês aparece na home, com o valor proposto e o prazo. |
| 🟢 | **P5.2** Calcula o que mantém o Anexo III | a casa | Calcula o mínimo que segura o Fator R em 28%: folha dos últimos 12 meses dividida pela receita dos últimos 12 meses, respeitando o piso do salário mínimo. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P5.3** Mexe e vê o imposto mudar | cliente | Deixa a pessoa mover o valor e mostra na hora o que muda: INSS, IRRF, Fator R e a alíquota do DAS. | só a nossa casa | A tela /pro-labore, com o controle e o efeito ao vivo. Sem preset, sem “confie na gente”. |
| 🟢 | **P5.4** ◆ Faturou neste mês? | a casa | Sem faturamento no mês, oferece não pagar pró-labore — e explica o efeito disso no Fator R dos 12 meses. | só a nossa casa | nada, acontece por baixo |
| 🟡 | **P5.5** ■ Sem faturamento, sem pró-labore | a casa | Registra o mês sem pró-labore e mantém a obrigação acessória em dia, porque ela não pausa. | só a nossa casa | O mês fica marcado como sem pró-labore, com o efeito no Fator R à vista. |
| 🟢 | **P5.6** Confirma o valor do mês | cliente | Trava o valor do mês e o manda pra transmissão. | só a nossa casa | Resumo do que vai ser declarado e quanto sai de INSS e IRRF. |
| 🟢 | **P5.7** Declara e gera a guia do INSS | a casa | Transmite o evento do pró-labore ao eSocial, consolida na DCTFWeb e devolve o DARF numerado. | Integra Contador (eSocial S-1200 → DCTFWeb) | A guia do INSS aparece em /impostos, junto com o DAS. |
| 🔴 | **P5.8** ◆ O dinheiro saiu da conta pro sócio? | a casa | Confere se o pró-labore foi EFETIVAMENTE PAGO. Enquanto não houver trânsito financeiro, ele não pode entrar no Fator R. | ainda não sabemos | nada: a tela não existe |
| 🟢 | **P5.9** ■ Entra no Fator R, e a alíquota se sustenta | a casa | Soma o pró-labore pago à folha dos 12 meses, recalcula o Fator R e confirma o anexo que vale no mês. | só a nossa casa | O Fator R atualizado em /impostos/aliquotas, com quanto falta pros 28%. |
| 🟡 | **P5.10** ■ Lançado e não pago: avisa antes de virar multa | a casa | Marca o pró-labore como pendente de pagamento, deixa ele FORA do Fator R e avisa o que acontece se ficar assim. | só a nossa casa | Aviso dizendo que o valor foi declarado mas não pago, o que isso faz com a alíquota, e até quando dá pra resolver. |
| 🟡 | **P5.11** Avisa ANTES de virar a faixa | a casa | Acompanha o Fator R dos 12 meses e avisa quando a empresa está perto de cair pro Anexo V, com quanto falta de pró-labore pra evitar. | só a nossa casa | Aviso com a distância pros 28% e o valor exato que resolve. |

### Por onde o processo caminha

- `P5.1` → `P5.2`
- `P5.2` → `P5.4`
- `P5.4` → `P5.3` — *faturou*
- `P5.4` → `P5.5` — *não faturou*
- `P5.3` → `P5.6`
- `P5.6` → `P5.7`
- `P5.7` → `P5.8`
- `P5.8` → `P5.9` — *o dinheiro saiu*
- `P5.8` → `P5.10` — *declarado e não pago*
- `P5.9` → `P5.11`
- `P5.11` → `P5.1` — *perto de virar a faixa*

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

**🟡 P5.5 · Sem faturamento, sem pró-labore**

Mês sem pró-labore derruba a média do Fator R nos 12 meses seguintes, e o efeito só aparece lá na frente. A tela precisa dizer QUANTO isso custa antes do toque — e falta decidir se a gente chega a desaconselhar, ou só informa.

**🔴 P5.8 · O dinheiro saiu da conta pro sócio?**

🔴 A ARMADILHA MAIS CARA DO PRODUTO, e ela é diferente do P2.4. Lá era saber que a GUIA foi paga, e existe consulta de arrecadação. Aqui é uma transferência da empresa PRO SÓCIO — o dinheiro não passa por nós nem pelo governo, e não há API nenhuma. O único rastro é o EXTRATO que o cliente envia até o 5º dia útil (cláusula 5.4). Se a gente considerar pago o que só foi lançado, o Fator R é glosado, a empresa cai pro Anexo V (6% → 15,5%) e leva multa. Três caminhos: (a) só contar depois de casar com o extrato, atrasando o Fator R; (b) contar na hora e corrigir se o extrato desmentir; (c) Open Finance read-only. Nenhum está decidido.

**🟡 P5.10 · Lançado e não pago: avisa antes de virar multa**

Até quando o pagamento ainda conta pro mês de competência, e o que acontece se ele sair depois. Isso muda o Fator R retroativamente e pode obrigar retificação (catálogo 4.8, serviço à-la-carte). Pergunta pro Mauro: a régua é a data do pagamento ou a competência do recibo?

**🟡 P5.11 · Avisa ANTES de virar a faixa**

Com quanta antecedência avisar, e quantas vezes. Avisar cedo demais em janeiro não ajuda; avisar em dezembro não dá tempo de corrigir, porque o Fator R é média de 12 meses. Falta a régua — e ela é a mesma do 5.4.

### Fonte de cada regra

- **P5.1** — Aferição do Fator R é MENSAL, no PGDAS-D (Res. CGSN 140/2018, art. 26). Não é decisão anual.
- **P5.2** — Fórmula da matriz: folha 12m ÷ receita 12m; ≥ 28% → Anexo III (6%), senão Anexo V (15,5%). Entram salário CLT, pró-labore, 13º, férias + 1/3, FGTS e a CPP mesmo embutida no DAS. Não entram distribuição de lucros, autônomo, prestador PJ, PAT e estagiário. Evidência do líder (09/09): pró-labore do mês = max(piso; 0,28 × Σfaturamento 12m − Σpró-labore dos 11 meses anteriores).
- **P5.3** — Catálogo 4.1, construída. É o diferencial-âncora: o líder tem 4 presets em radio button e esconde a conta. A engine é nossa e roda 100% local, sem API.
- **P5.4** — Catálogo 4.3, construída: o toggle existe e vem explicado, ao contrário do switch cru do líder.
- **P5.5** — Catálogo 4.3. A obrigação mensal continua existindo mesmo sem valor — mesmo princípio do “eSocial sem movimento” da folha (7.4).
- **P5.6** — Decorre do P5.3: o valor é escolha da pessoa, e a casa só sugere.
- **P5.7** — Matriz 4.5, resolvida em 09/09: o caminho é eSocial (S-1200) → DCTFWeb → DARF numerado, coberto pelo Integra Contador com o A1 da empresa. Mesmo contrato do P2.1 e do P3.5. Evidência do líder (09/09): o “DARF Unificado” é essa guia — R$ 178,31 = 11% de R$ 1.621.
- **P5.8** — Matriz, seção do Fator R: a folha só conta em REGIME DE CAIXA, enquanto a receita é competência. A Receita cruza EFD-Reinf com DCTFWeb pra pegar isso.
- **P5.9** — 🔑 É daqui que o P2.1 tira a alíquota: Fator R ≥ 28% → Anexo III (6%), senão Anexo V (15,5%). Não há aresta entre os processos porque não há salto — é DADO que atravessa.
- **P5.10** — Decorre do regime de caixa do Fator R. O app NÃO PODE considerar pró-labore lançado e não pago.
- **P5.11** — Catálogo 4.2, hoje 🟡: o cálculo existe, falta o gatilho do alerta. É o mesmo motor da vigília preditiva (5.4), o diferencial nº 2. O líder tem o cálculo e NÃO tem o alerta.

---

## P6 · Cancelar, corrigir ou substituir uma nota já emitida

> A pessoa achou um erro numa nota que já saiu. A casa diz o que dá pra fazer, quanto custa e até quando, pede ao município, e depois acerta o que aquela nota tinha mexido: a receita da competência, o imposto e a alíquota.
>
> 🔑 **Por que importa:** É o único caminho do produto que anda PRA TRÁS. Todo o resto soma; aqui a receita da competência DIMINUI depois de já ter virado DAS, RBT12 e Fator R — e nenhum dos processos que consomem receita foi desenhado pra receber um número menor. 🔑 O P3.7 diz “soma o valor à receita do mês e ao acumulado de 12 meses”, e ninguém escreveu quem subtrai. É também o caso mais completo de evidência que a casa tem: o teardown de 09/09 entregou o modelo fiscal inteiro (75 campos), os dois caminhos de cancelamento e a regra de prazo fechada, com o Pedro conduzindo a navegação até a tela de confirmação.

🟢 8 · 🟡 6 · 🔴 3

| | Passo | Quem dispara | O que a casa faz | Com quem fala | O que a pessoa vê |
|:--:|---|---|---|---|---|
| 🟢 | **P6.1** Achou um erro numa nota que já saiu | cliente | Nada ainda: é o problema aparecendo. A casa só entra quando a pessoa abre a nota e pede pra mexer. | só a nossa casa | O botão de mexer na nota, dentro dela. 🔑 Não é item de menu: nasce da nota, igual no líder. |
| 🟢 | **P6.2** ◆ ◆ A nota nasceu aqui ou veio de fora? | a casa | Separa os dois mundos. Nota emitida por nós, nós cancelamos no órgão. Nota importada, quem cancelou foi o portal do município e a casa só REGISTRA o que já aconteceu. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P6.3** ◆ ◆ Ainda está dentro do prazo legal? | a casa | Confere os 730 dias desde a emissão. É limite do município, não regra nossa, e não tem exceção que a gente possa dar. | só a nossa casa | nada, acontece por baixo |
| 🟢 | **P6.4** ■ ■ Passou de 2 anos: não dá mais | a casa | Diz que o prazo legal do município acabou e que nem a casa nem o cliente podem reabrir isso, e oferece o caminho que existe: conversar com a contabilidade sobre o efeito daquela nota. | só a nossa casa | A nota com o motivo em português, a data em que o prazo venceu, e a saída pelo WhatsApp. Sem botão que não leva a nada. |
| 🟢 | **P6.5** ◆ ◆ A competência está fechada? | a casa | Pergunta ao servidor se aquele mês contábil já fechou. 🔑 É estado da competência, não conta de data feita na tela. | só a nossa casa | nada, acontece por baixo |
| 🟡 | **P6.6** Mês fechado: diz o custo ANTES de deixar seguir | a casa | Mostra, numa frase só, a janela sem custo, o valor da reabertura do mês contábil e o limite legal. Só então libera a ação. | só a nossa casa | Uma linha no lugar da decisão: “Cancelar até 5/10 não tem custo. Depois disso são R$ X de reabertura do mês. O limite legal é 2 anos.” Não três telas com um terço da informação cada. |
| 🟢 | **P6.7** ◆ ◆ Cancelar, substituir ou corrigir? | cliente | Pergunta o que precisa acontecer com a nota, em português, e não em nome de sistema. 🔴 Mudar VALOR não é correção, é substituição: a casa decide o caminho pelo que mudou, não pelo botão que a pessoa apertou. | só a nossa casa | Três saídas nomeadas pelo efeito: “essa nota não deveria existir”, “o valor ou o serviço está errado”, “só o texto está errado”. |
| 🟢 | **P6.8** Confirma com a nota inteira na tela | cliente | Mostra número, código de verificação, data, cliente, o serviço e o MUNICÍPIO, e só então aceita o cancelamento. | só a nossa casa | A nota inteira relida antes do irreversível. 🔑 O município aparece porque é ele que cancela, e é ele que decide prazo e demora — não é decoração. |
| 🟡 | **P6.9** Pede o cancelamento e espera o município | a casa | Assina com o certificado e manda o pedido de cancelamento, sem prometer que resolve na hora: quem cancela é a prefeitura. | Sefin Nacional NFS-e | Estado “cancelamento pedido”, com a data do pedido e a frase honesta: em algumas prefeituras isso demora. |
| 🟡 | **P6.10** ◆ ◆ O município aceitou? | a casa | Lê a resposta do órgão e decide se a nota morreu de fato ou continua valendo. | Sefin Nacional NFS-e | nada, acontece por baixo |
| 🟡 | **P6.11** ■ ■ Recusou: a nota continua valendo | a casa | Diz que a nota segue de pé, por quê, e o que fazer. Nada muda na receita nem no imposto. | só a nossa casa | O motivo em português, e o caminho: resolver a pendência e tentar de novo, ou falar com a contabilidade. |
| 🟢 | **P6.12** Substitui: nasce a nota nova, ligada à velha | a casa | Emite a nota correta e amarra as duas nos dois sentidos, pra que o histórico conte a verdade: a velha aponta pra substituta, a nova aponta pra substituída. | Sefin Nacional NFS-e | As duas notas na lista, ligadas, com a velha marcada como substituída. Nenhuma some. |
| 🟡 | **P6.13** ■ ■ Corrige o que não mexe em imposto, e guarda no log | a casa | Altera só o que não muda a apuração, e registra quem mudou, o quê e quando, por nota. | só a nossa casa | A nota atualizada e o histórico de alterações dentro dela, legível. |
| 🟡 | **P6.14** Registra o cancelamento que o portal já fez | cliente | Recebe a informação de que uma nota importada foi cancelada lá fora, pra que a receita da competência pare de contar com ela. | só a nossa casa | Campo pra informar o cancelamento da nota que veio de fora, dizendo com todas as letras que quem cancelou foi a prefeitura, não a gente. |
| 🔴 | **P6.15** ◆ ◆ Aquela competência já virou imposto? | a casa | Antes de mexer na receita, olha em que pé está a competência daquela nota: se o DAS já foi apurado e emitido, mexer no número exige desfazer o que já foi declarado. | só a nossa casa | nada, acontece por baixo |
| 🔴 | **P6.16** Refaz a apuração da competência que já tinha fechado | a casa | Recalcula o DAS daquele mês com a receita corrigida e retifica a declaração já entregue. | ainda não sabemos | nada: a tela não existe |
| 🔴 | **P6.17** ■ ■ A receita da competência cai, e tudo que dependia dela se move | a casa | Tira o valor da receita do mês e do acumulado de 12 meses, e recalcula o que dependia disso: a faixa de RBT12, o Fator R e o anexo que vale. | só a nossa casa | nada: a tela não existe |

### Por onde o processo caminha

- `P6.1` → `P6.2`
- `P6.2` → `P6.3` — *a nota nasceu aqui*
- `P6.2` → `P6.14` — *veio de fora, importada*
- `P6.3` → `P6.5` — *dentro dos 2 anos*
- `P6.3` → `P6.4` — *passou de 730 dias*
- `P6.5` → `P6.7` — *mês ainda aberto*
- `P6.5` → `P6.6` — *mês já fechado*
- `P6.6` → `P6.7`
- `P6.7` → `P6.8` — *essa nota não deveria existir*
- `P6.7` → `P6.12` — *o valor ou o serviço está errado*
- `P6.7` → `P6.13` — *só o texto está errado*
- `P6.8` → `P6.9`
- `P6.9` → `P6.10`
- `P6.10` → `P6.15` — *o município cancelou*
- `P6.10` → `P6.11` — *o município recusou*
- `P6.12` → `P6.15`
- `P6.14` → `P6.15`
- `P6.15` → `P6.16` — *o DAS daquele mês já saiu*
- `P6.15` → `P6.17` — *a competência ainda não apurou*
- `P6.16` → `P6.17`

### 🔴 O que precisa ser respondido

> Esta lista é o produto do desenho, não o defeito dele. Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado.

**🟡 P6.6 · Mês fechado: diz o custo ANTES de deixar seguir**

Três perguntas, nenhuma respondida. (1) A gente cobra reabertura? Cobrar é honesto (tem custo de execução real), mas a régua de posicionamento diz pra não punir o erro do cliente, e o líder já é caro. (2) Se cobra, quanto? Abaixo de R$ 50 a cláusula 6.3 manda pra fatura da competência seguinte, o que casa com o P4; acima, o P4.3 exige aceite formal na hora. (3) O erro é NOSSO em parte dos casos (nota emitida com dado que a gente pré-preencheu) — nesses, cobrar é indefensável, e não existe regra separando culpa. Pergunta pro Mauro, e é de posicionamento antes de ser de preço.

**🟡 P6.9 · Pede o cancelamento e espera o município**

O que sobra é de município, não de API: o síncrono vale nas Sefins que seguem o padrão nacional, e BH tem sistema próprio (BHISS). O líder avisa “pode demorar em certas prefeituras”, e isso deixou de ser contradição — é a diferença entre padrão nacional e Sefin municipal. Uma chamada resolve: `GET /parametros_municipais/3106200/convenio` diz se BH é conveniada.

**🟡 P6.10 · ◆ O município aceitou?**

O que sobra não é “quais recusas existem”, é “quais delas BH ligou”. O E0823 (teto de valor pra cancelar) não aparecia em nenhuma fonte nossa e pode travar justamente a nota grande, que é a que dói. E o E0824 parecia contradizer a nossa matriz, que registra a revogação da exigência de tomador identificado pela Portaria SMFA 088/2025 — não contradiz: a regra nacional permite o município exigir, e BH desligou a dele. Os parâmetros se leem por API, não se perguntam.

**🟡 P6.11 · ■ Recusou: a nota continua valendo**

Se a recusa for por pendência que a CASA resolve (inscrição municipal irregular), a gente retoma o cancelamento sozinho depois, ou a pessoa precisa pedir de novo? Retomar sozinho é melhor produto e cria uma fila que ninguém desenhou.

**🟡 P6.13 · ■ Corrige o que não mexe em imposto, e guarda no log**

Quais campos são de fato neutros. O líder afirma que certas alterações não mexem no imposto, mas não lista quais — e errar pra menos aqui é pior que errar pra mais: uma “correção” que muda a base vira receita falsa sem ninguém perceber, porque este caminho não passa pelo acerto da competência. Precisa da lista, e ela sai do Swagger do ADN mais a leitura fiscal.

**🟡 P6.14 · Registra o cancelamento que o portal já fez**

O prazo desse caminho continua sem resposta — foi anotado como lacuna na 2ª rodada do teardown e não fechou. E tem uma pergunta nossa por cima: a gente aceita a palavra do cliente, ou confere no portal antes de tirar a receita da competência? Aceitar sem conferir deixa a apuração na mão de quem não responde por ela.

**🔴 P6.15 · ◆ Aquela competência já virou imposto?**

🔴 O estado que esta decisão precisa ler não existe DO NOSSO LADO: o P2 sabe emitir a guia e sabe se ela foi paga, mas nenhum passo guarda “esta competência foi apurada com estes valores”. É trabalho no P2, não aqui. 🔑 E são TRÊS janelas, não duas — antes do fecho contábil (nada acontece), entre o fecho e a apuração (custa reabertura mas a guia ainda não saiu, então basta recalcular antes de disponibilizar) e depois da apuração (aí sim é retificação). O desenho de hoje só conhece a primeira e a terceira. ⚠️ Vem de fora uma pista forte: a recusa **E0827** do Sistema Nacional bloqueia o cancelamento de nota que tenha “Evento de Tributos Recolhidos” vinculado — o órgão modela esse momento, e talvez a gente não precise inventar o nosso.

**🔴 P6.16 · Refaz a apuração da competência que já tinha fechado**

🔴 Quatro perguntas abertas, e a primeira é técnica. (1) O PGDAS-D aceita retificação por API no Integra Contador, ou é trabalho humano no e-CAC? (2) Se o DAS já foi PAGO a maior, vira crédito ou pedido de restituição — e quem conduz? (3) Retificação é serviço avulso (o líder cobra alteração de obrigação acessória) ou entra no plano? (4) Quem assina: é responsabilidade técnica do contador, e a Carta do CFC 1.590/2020 encosta aqui. As três primeiras são do Mauro; a primeira, do Swagger.

**🔴 P6.17 · ■ A receita da competência cai, e tudo que dependia dela se move**

🔴 O efeito dominó não tem dono. Três coisas se movem e nenhuma foi desenhada pra se mover pra baixo: (1) o RBT12 muda a faixa, e a faixa muda a MENSALIDADE do cliente (P1.2) — a gente devolve a diferença de um mês já cobrado? (2) o Fator R cai e pode reclassificar do Anexo III pro V, com efeito retroativo (P5.9); (3) a nota carrega o `anexoEscolhido` da época, então o histórico precisa continuar contando a verdade do que valia naquele dia, não a de hoje. ⚠️ O caso mais barato de resolver e o mais fácil de esquecer: nota cancelada no MESMO mês, antes de qualquer apuração, não deveria disparar nada disso — e hoje o desenho não distingue.

### Detalhe técnico

- **P6.9** — `POST /nfse/{chaveAcesso}/eventos` — a API de eventos é genérica: o cancelamento é o tipo e101101, com assinatura digital obrigatória no pedido de registro. Só o sistema que GEROU a nota recebe o evento.
- **P6.12** — `POST /nfse` levando a chave de acesso da nota a substituir. Não é endpoint separado: é a MESMA emissão do P3.5, e é a presença da chave que faz a API cancelar a velha por substituição e emitir a nova numa transação só.

### Fonte de cada regra

- **P6.1** — Evidência §10: o caminho real de cancelamento do líder não está no menu, nasce do botão dentro da nota. A varredura de menu não achou por isso. Lição registrada: menu dá as portas, ação dá os corredores.
- **P6.2** — Evidência §10: o líder tem DOIS caminhos distintos, `cancelamento-nota-emitida` (novo) e `sistema/informarCancelamento` (legado). Copiar essa separação está na lista do que a gente copia sem vergonha (item 11).
- **P6.3** — Portaria SMFA 075/2025 art. 5º, com a redação da 088/2025 (matriz de dependência, linha 3.4). A mesma redação REVOGOU a exigência de CPF/CNPJ do tomador: dá pra cancelar nota de tomador não identificado. 🔑 12/09, fonte primária: o prazo é **parâmetro do município emissor**, não número nacional (recusa E0822 do Sistema Nacional). Os 730 dias são o número de BH; a API do município conhece o dele, então a casa não precisa guardar a data na mão — precisa ler o parâmetro.
- **P6.4** — 730 dias da Portaria SMFA 075/2025. É saída terminal de propósito: caminho sem saída declarado é melhor que botão que falha no órgão.
- **P6.5** — O flag `mesFechado` vem no payload da nota no líder (modelo fiscal de 75 campos) e é ele que governa custo de cancelar, alterar e importar. O fecho é o dia 5 do mês seguinte, e vale para as três ações. ⚠️ O rodapé de emissão do líder diz “dentro do mesmo mês” e está IMPRECISO: a janela real é até o dia 5 do mês seguinte.
- **P6.6** — Regra fechada na 3ª rodada do teardown: até o dia 5 grátis · depois, custo de reabertura (R$ 21,90 no líder) · 730 dias é o limite legal. 🔴 No líder a cobrança é disparada pela AÇÃO, automaticamente (`disponivelParaCliente: false`); a nossa doutrina é a oposta — preço e momento da cobrança aparecem ANTES do aceite (mesma regra do P4.2).
- **P6.7** — Decisão nossa de 12/09. A funcionalidade 3.4 do catálogo junta as três num nome só (“cancelar, corrigir e reemitir”), e o teardown mostra que elas têm caminhos, custos e consequências fiscais diferentes.
- **P6.8** — Tela 2 do líder (`cancelamento-nota-emitida/detalhes/{codVerificacao}`), lida na 3ª rodada. Mesma doutrina da A1 do flow de abertura: a última tela antes do irreversível mostra tudo o que vai embora.
- **P6.9** — ✅ RESOLVIDO em 12/09 com fonte primária (`2026-09-12-nfse-nacional-eventos-cancelamento`): cancelar é REGISTRAR UM EVENTO contra a chave de acesso, e o processamento é **síncrono** — a documentação diz com estas palavras, e a transação termina em “o sistema envia comunicação de aceite ou rejeição ao solicitante”. No caminho normal NÃO nasce vigia. ⚠️ Corrigido junto: o ADN é o ambiente de COMPARTILHAMENTO e só aceita GET do contribuinte; quem recebe evento é a Sefin geradora.
- **P6.10** — ✅ A LISTA DE RECUSAS EXISTE, e veio da fonte primária em 12/09 (Anexo II, aba de regras de negócio). São quatro, todas com código: **E0822** prazo expirado · **E0823** valor da nota acima do permitido · **E0824** nota sem tomador identificado · **E0827** a nota tem Evento de Tributos Recolhidos vinculado. 🔑 As quatro dependem de PARAMETRIZAÇÃO DO MUNICÍPIO — não são regra nacional fixa. Par do P3.6, do outro lado do ciclo: lá se lê se a nota foi autorizada, aqui se foi cancelada.
- **P6.11** — Saída obrigatória do P6.10 — decisão sem porta de recusa esconde o caso que mais assusta o cliente.
- **P6.12** — ✅ RESOLVIDO em 12/09 com fonte primária: é UMA operação. Um `POST /nfse` carregando a chave de acesso da nota velha faz a API gerar o **Evento de Cancelamento por Substituição** (e105102) vinculado à original, cancelá-la e emitir a substituta, devolvendo o XML da nova. Não existe o instante em que a velha morreu e a nova ainda não nasceu — que era a dúvida. 🔑 O `anexoEscolhido` grava NA NOTA: se o Fator R virou no meio do ano, cada nota carrega o Anexo que valia na hora, e o histórico depende disso pra não mentir.
- **P6.13** — O `logAlteracoes` por nota está na lista do que a gente copia sem vergonha (item 10). O líder ainda diz ao usuário quais escolhas são fiscalmente neutras (“alterar não impacta nos impostos”), o que destrava quem tem medo de errar.
- **P6.14** — É o `sistema/informarCancelamento` do líder, o caminho legado, e ele existe separado por um motivo real: em nota importada a casa não tem poder nenhum sobre o órgão. Copiar a separação está no item 11 do que a gente copia.
- **P6.15** — Cruzamento com o P2.1, que apura o DAS com a receita do mês no fechamento da competência. Ninguém tinha escrito o que acontece quando essa receita muda DEPOIS. 🔑 12/09, achado do Pedro: o estado tem DATA CONHECIDA, não é imponderável — no líder a guia fica disponível entre os dias 15 e 16 do mês seguinte, e existe o status próprio `AGUARDANDO_DISPONIBILIZACAO` com `valor.status: CALCULANDO`, ou seja, a guia existe antes de estar disponível. São 10 status no histórico dele.
- **P6.16** — Consequência direta do P6.15. Não há decisão nem evidência sobre isso em lugar nenhum do vault.
- **P6.17** — Espelho do P3.7, que soma a receita quando a nota nasce. É o fecho do único caminho do produto que anda pra trás.
