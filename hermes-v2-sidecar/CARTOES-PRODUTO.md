# CARTOES-PRODUTO.md

As 58 funcionalidades core do ME no Simples, reescritas como **Cartões de Instrução**
no formato **Estado, Ação, Restrição**, prontos para vetorização.

**Fonte:** `produto/me/viver/funcionalidades/funcionalidades-data.mjs`, a lista que o
Pedro mandou ao sócio em 11/09 e ratificou em 12/09 como a lista core oficial. A
numeração é a do PDF e é estável: é por ela que a casa cita.

🔴 **Nunca cite o número sozinho.** `2.6` é "minhas alíquotas" no catálogo antigo e
"recalcular guia vencida" aqui. Escreva sempre o nome junto.

---

## Como estes cartões foram escritos

**1. Cada cartão é auto-suficiente.** Depois da vetorização o chunk viaja sozinho:
quem o recuperar não terá o cabeçalho, nem o cartão vizinho, nem esta introdução. Por
isso nenhum cartão diz "ver o cartão anterior" e todos repetem o contexto de que
precisam, mesmo que isso soe redundante lendo o arquivo inteiro.

**2. Os três campos têm papéis diferentes, e não se misturam:**

* **Estado** é a situação do cliente que faz este cartão ser o certo. É o campo que a
  busca semântica vai casar com a mensagem dele.
* **Ação** é o que o produto faz. Escrito em primeira pessoa quando o Léo pode assumir,
  porque ele fala em nome do app.
* **Restrição** é o limite: o que não prometer, o que não afirmar de cabeça, e o que
  pertence a outra saída do roteador.

**3. O campo `promessa` é o mais importante do cartão.** Ele traduz uma medição do repo
(a funcionalidade tem tela? tem processo desenhado?) para a única pergunta que interessa
ao atendimento: **o Léo pode dizer que isso existe?**

* `promessa: pode` (**18** de 58) tem tela e processo. O Léo fala em primeira pessoa.
* `promessa: parcial` (**28** de 58) tem um dos dois, ou tem os dois com buraco
  declarado. O Léo fala só da parte que existe, e a Restrição nomeia o que falta.
* `promessa: nao` (**12** de 58) não tem nenhum dos dois. **O Léo não promete e não
  descreve como se existisse.**

⚠️ **Uma divergência, declarada.** O semáforo derivado da fonte dá **19 / 27 / 12**, e
aqui está **18 / 28 / 12**. O item que mudou de lado é o **3.3, "Ver, baixar e enviar a
nota"**: ele tem tela e processo, então o semáforo o pinta de verde, mas a própria nota
da fonte diz que **enviar por canal não é passo de processo nenhum**. Para construir, o
verde está certo; para o Léo abrir a boca, não, porque a parte que ele prometeria é
justamente a que falta. Onde a medição e a nota da fonte discordarem, **manda a nota**, e
a divergência fica escrita aqui em vez de virar diferença silenciosa.

🔴 **`promessa: nao` não autoriza negar de cabeça.** "A gente não tem isso" dito sem
consulta é tão inventado quanto prometer, e machuca mais, porque o cliente decide com
base nisso. O certo é dizer que hoje não está no app, oferecer o que existe, e confirmar
com o time se ele insistir.

**4. Nada de bastidor entrou.** Não há nome de rota, de arquivo, de processo interno, de
sócio nem de concorrente. Não há preço, percentual nem data: número sai da base de
conhecimento, lido na hora, nunca de um cartão. Onde a funcionalidade tem lugar no app,
o cartão diz o lugar em português de gente, não o caminho técnico.

**5. Estes cartões não são a régua de escopo.** Eles descrevem o que o produto faz para
quem já é do nicho. Quem não é (comércio, indústria, EPP, Lucro Presumido, fora de BH)
sai pela saída Fora de Escopo do `RULES.md` §5.3, antes de qualquer cartão ser aberto.

---

## 🏠 Home e navegação

### 1.1 · Home "o que fazer hoje", com um foco por vez
`secao: home` · `promessa: parcial` · `onde: tela inicial do app`

**Estado.** A pessoa abriu o app e quer saber o que precisa fazer agora, sem ter que
entender contabilidade para descobrir.
**Ação.** A tela inicial mostra **um** foco por vez, em linguagem de gente, em vez de um
painel com tudo ao mesmo tempo.
**Restrição.** Não prometa que o app avisa de tudo sozinho. A home é leitura do que as
outras partes produzem, e nem todas já produzem. Não descreva o conteúdo exato do foco
do dia, que muda por empresa e por mês.

### 1.2 · Home do dia 1, para quem acabou de abrir
`secao: home` · `promessa: parcial` · `onde: tela inicial, no primeiro acesso`

**Estado.** A empresa acabou de ser aberta e a pessoa entra no app pela primeira vez, sem
faturamento, sem nota e sem guia.
**Ação.** O app mostra uma versão de primeiro dia, que explica o que vai acontecer a
seguir em vez de exibir números vazios.
**Restrição.** Não prometa prazo de nada que dependa de órgão. Não diga que o certificado
digital já está pronto sem consultar a situação da empresa.

### 1.3 · Navegação em 4 abas, com emitir nota no centro
`secao: home` · `promessa: parcial` · `onde: barra inferior do app`

**Estado.** A pessoa pergunta como o app é organizado, ou não está achando onde fica
alguma coisa.
**Ação.** A navegação tem quatro abas, e o botão de emitir nota fica no centro, porque
emitir nota é a ação mais frequente do dia a dia.
**Restrição.** Não descreva tela que você não leu na base. Se ela pergunta onde fica algo
específico, confirme antes de apontar caminho.

### 1.4 · Central de avisos
`secao: home` · `promessa: parcial` · `onde: central de avisos`

**Estado.** A pessoa quer saber se perdeu algum aviso, ou pergunta como o app fala com
ela quando acontece alguma coisa na conta.
**Ação.** Os avisos ficam reunidos em um lugar só, separados por natureza: o que precisa
dela, o que aconteceu na conta, o que vale saber.
**Restrição.** 🔴 Não prometa canal. Não diga que ela vai receber WhatsApp, e-mail, SMS
ou push sem ter lido na base que aquele canal existe. Prometer aviso que não chega é a
falha que mais destrói confiança em produto de obrigação.

### 1.5 · Conteúdo e micro-educação
`secao: home` · `promessa: parcial` · `onde: área de conteúdo`

**Estado.** A pessoa quer entender um conceito (imposto, regime, obrigação) sem precisar
perguntar a alguém.
**Ação.** O app traz conteúdo curto explicando os termos que aparecem na própria tela.
**Restrição.** Conteúdo não substitui a resposta. Se ela perguntou, responda você, e só
depois ofereça o material.

---

## 🏛 Impostos

### 2.1 · O DAS do mês: valor, vencimento e composição
`secao: impostos` · `promessa: pode` · `onde: aba de impostos`

**Estado.** A pessoa quer saber quanto vai pagar de imposto neste mês, quando vence, ou
do que o valor é feito.
**Ação.** Eu mostro o valor do DAS do mês, a data de vencimento e a composição do
imposto, aberta por tributo, sem ela precisar pedir.
**Restrição.** 🔴 Valor, alíquota e data nunca saem de memória: leia a nota de cálculo e
de obrigações antes de escrever qualquer número. Estimativa sobre um faturamento que ela
te deu é permitida, desde que você diga que é aproximada e mostre o que sobra na mesma
frase.

### 2.2 · Baixar a guia e copiar o código de barras
`secao: impostos` · `promessa: pode` · `onde: aba de impostos`

**Estado.** A pessoa quer pagar o imposto e precisa da guia em mãos.
**Ação.** Eu emito a guia e entrego pronta, com o código de barras para copiar e pagar no
banco dela.
**Restrição.** 🔴 Pelo WhatsApp você não envia guia, boleto nem documento. A guia
acontece no app. Não diga "já te mando", porque você não volta sozinho na conversa.

### 2.3 · Histórico de guias pagas
`secao: impostos` · `promessa: pode` · `onde: aba de impostos, em guias`

**Estado.** A pessoa quer conferir o que já pagou, ou precisa de um comprovante antigo.
**Ação.** O histórico guarda as guias das competências anteriores, com a situação de cada
uma.
**Restrição.** Não afirme que uma guia específica está paga sem o app dizer. Pagamento
errado, em duplicidade ou multa recebida não é consulta: é escalonamento.

### 2.4 · Saber que foi pago sem perguntar ao cliente
`secao: impostos` · `promessa: parcial` · `onde: nos bastidores, sem tela própria`

**Estado.** A pessoa pergunta se precisa avisar quando pagar, ou reclama de ter que
mandar comprovante para o contador todo mês.
**Ação.** A baixa do pagamento é nossa. Ela não precisa mandar comprovante nem confirmar
nada.
**Restrição.** Não prometa o tempo que a baixa leva. Se ela diz que pagou e o app ainda
não mostra, não invente explicação técnica: confirme com o time.

### 2.5 · Minhas alíquotas: anexo, ISS e Fator R abertos
`secao: impostos` · `promessa: pode` · `onde: aba de impostos, em alíquotas`

**Estado.** A pessoa quer entender por que paga o que paga, ou desconfia da alíquota.
**Ação.** O app abre o anexo em que ela está, a parte que é ISS e a situação do Fator R,
em vez de mostrar só o total.
**Restrição.** 🔴 Nenhum percentual sai daqui. Leia a nota de cálculo fiscal. Se ela
exige o número oficial fechado do caso dela e recusa a estimativa, é escalonamento. Se
ela insiste no anexo exato de um código de CNAE específico, também.

### 2.6 · Recalcular e reemitir guia vencida
`secao: impostos` · `promessa: pode` · `onde: na aba Mais, em serviços`

**Estado.** A pessoa perdeu o prazo e a guia venceu.
**Ação.** A guia vencida é recalculada com o acréscimo e reemitida, para ela conseguir
pagar.
**Restrição.** 🔴 Multa já recebida é escalonamento, não cálculo seu. Nunca diga o valor
do acréscimo de cabeça. Acolha antes de resolver: prazo vencido desliga o humor.

### 2.7 · Simulador de impostos do mês seguinte
`secao: impostos` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa quer saber quanto pagaria se faturasse um valor diferente no mês que
vem.
**Ação.** Hoje isso não existe como tela do app. O que você pode fazer é a estimativa na
conversa, sobre um faturamento que ela te informar.
**Restrição.** 🔴 Não descreva um simulador como se ele estivesse lá. Faça a estimativa,
diga que é aproximada, e mostre o que sobra junto.

### 2.8 · Débito automático do DAS
`secao: impostos` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa pergunta se o imposto pode ser debitado sozinho da conta dela.
**Ação.** Hoje não. O caminho que existe é a guia pronta, com código de barras, para ela
pagar.
**Restrição.** 🔴 Não prometa débito automático, nem "em breve", nem como benefício de
plano. Não confunda com pagar o imposto dentro do app, que também não existe.

---

## 🧾 Notas fiscais

### 3.1 · Emitir NFS-e pedindo só valor e cliente
`secao: notas` · `promessa: pode` · `onde: botão central do app`

**Estado.** A pessoa precisa emitir uma nota e tem medo de errar, ou está acostumada com
um emissor que pede vinte campos.
**Ação.** Eu peço o valor e o cliente. O resto do preenchimento é meu.
**Restrição.** Não prometa emissão para quem ainda não tem certificado digital válido ou
inscrição municipal: sem isso a nota não sai. Não descreva campo de tela que você não leu
na base.

### 3.2 · Lista e gestão das notas emitidas
`secao: notas` · `promessa: pode` · `onde: aba de notas`

**Estado.** A pessoa quer ver o que já emitiu, conferir o faturamento do mês ou achar uma
nota específica.
**Ação.** Todas as notas emitidas ficam listadas, com a situação de cada uma.
**Restrição.** 🔑 Nota substituída **não some da lista**. As duas ficam, ligadas, com a
antiga marcada. Nunca diga que a nota antiga "sumiu" ou "foi apagada": o histórico
precisa continuar verdadeiro sobre o que foi faturado em cada mês.

### 3.3 · Ver, baixar e enviar a nota
`secao: notas` · `promessa: parcial` · `onde: aba de notas, no detalhe da nota`

**Estado.** A pessoa precisa mandar a nota para o cliente dela, ou guardar o arquivo.
**Ação.** O número, o PDF e o XML ficam guardados e disponíveis no app.
**Restrição.** ⚠️ Envio direto por canal (WhatsApp do cliente dela, e-mail) não é coisa
que você promete. E por este canal aqui você não envia documento nenhum.

### 3.4 · Cancelar, corrigir e reemitir
`secao: notas` · `promessa: pode` · `onde: aba de notas, no detalhe da nota`

**Estado.** A pessoa emitiu uma nota errada, ou o cliente dela pediu mudança.
**Ação.** São três caminhos diferentes, e o app separa os três: **cancelar** (a nota
deixa de valer e a receita daquele mês cai), **substituir** (nasce uma nota nova ligada à
antiga) e **corrigir** (muda o que não mexe em imposto).
**Restrição.** 🔴 **Mudar valor não é correção, é substituição.** Tratar as duas como a
mesma coisa faz a receita do mês mentir sem ninguém ver. Não oriente cancelamento como se
fosse um desfazer simples: cancelar tem regra de prazo e de órgão que você lê na base
antes de responder.

### 3.5 · Cadastro de clientes, PJ e pessoa física
`secao: notas` · `promessa: pode` · `onde: no caminho de emitir nota`

**Estado.** A pessoa emite para os mesmos clientes todo mês e não quer redigitar dados.
**Ação.** O cliente fica cadastrado na primeira emissão e é reaproveitado nas próximas,
seja empresa ou pessoa física.
**Restrição.** 🔴 Não peça CPF, CNPJ nem dado de terceiro por este canal. Isso acontece no
app, que é o lugar seguro.

### 3.6 · Sugestão do código do serviço
`secao: notas` · `promessa: parcial` · `onde: no caminho de emitir nota`

**Estado.** A pessoa não sabe qual código de serviço usar na nota e tem medo de escolher
errado.
**Ação.** O app sugere o código a partir da atividade da empresa, em vez de deixar ela
escolher sozinha numa lista enorme.
**Restrição.** 🔴 Você não crava código nem anexo de CNAE na conversa. Pergunte o que ela
faz no dia a dia e oriente por aí. Se ela insiste no código exato, é escalonamento.

### 3.7 · Importar notas emitidas fora do app
`secao: notas` · `promessa: parcial` · `onde: nos bastidores, sem tela própria`

**Estado.** A pessoa já emitia nota por outro sistema, ou pela prefeitura, e tem
faturamento que o app não viu.
**Ação.** Nota emitida fora entra na conta do mês, para o imposto não sair errado.
**Restrição.** Não prometa importação automática de qualquer origem. Não diga que ela
"não precisa fazer nada" sem consultar a base.

### 3.8 · Registrar notas recebidas de fornecedores
`secao: notas` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa quer lançar as notas que ela recebe, de quem presta serviço para
ela.
**Ação.** Hoje isso não está no app.
**Restrição.** 🔴 Não prometa entrada manual nem leitura automática de nota recebida.
Ofereça o que existe e confirme com o time se ela insistir.

### 3.9 · Nota emitida pela nossa equipe
`secao: notas` · `promessa: parcial` · `onde: na aba Mais, em serviços`

**Estado.** A pessoa não quer ou não consegue emitir sozinha e pede que alguém emita por
ela.
**Ação.** É um serviço avulso: ela pede pelo app e nossa equipe emite.
**Restrição.** ⚠️ Serviço avulso tem preço próprio, que você **lê na base**, nunca
estima. Não prometa prazo de execução.

---

## 👥 Pró-labore e sócios

### 4.1 · Pró-labore interativo: mexe e vê o imposto mudar
`secao: prolabore` · `promessa: pode` · `onde: aba de pró-labore`

**Estado.** A pessoa quer saber quanto tirar da empresa por mês, e não entende o efeito
disso no imposto.
**Ação.** Ela mexe no valor do pró-labore e vê o imposto mudar na hora, antes de decidir.
É mostrar a conta em vez de pedir confiança.
**Restrição.** 🔴 Nenhum número sai daqui. O valor mínimo, a alíquota e o efeito no Fator
R saem da base. Se ela pede o valor fechado do caso dela e recusa a estimativa, é
escalonamento.

### 4.2 · Fator R com alerta antes de virar a faixa
`secao: prolabore` · `promessa: pode` · `onde: aba de pró-labore`

**Estado.** A pessoa ouviu falar de Fator R, ou está prestes a pagar imposto mais caro
sem saber.
**Ação.** Eu fico de olho no Fator R e aviso **antes** da virada, não depois. Manter a
empresa do lado bom da régua é trabalho meu, todo mês.
**Restrição.** 🔴 O Fator R olha os últimos doze meses: corrigir hoje não conserta o mês
de hoje. Nunca sugira "cravar" um percentual, o limiar é seco e sem margem. Leia a nota
de cálculo antes de citar qualquer número.

### 4.3 · Sem pró-labore em mês sem faturamento
`secao: prolabore` · `promessa: pode` · `onde: aba de pró-labore`

**Estado.** A empresa passou um mês sem faturar e a pessoa teme pagar imposto sobre
salário que não tirou.
**Ação.** Mês sem faturamento não obriga pró-labore, e o app trata isso sem ela precisar
pedir.
**Restrição.** Não generalize para outras obrigações: não faturar não significa não
declarar. Confirme na base antes de dizer que "não precisa fazer nada".

### 4.4 · Recibo de pró-labore e informe de rendimentos
`secao: prolabore` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa precisa do recibo do pró-labore, ou do informe anual para declarar
imposto de renda.
**Ação.** Hoje esses documentos não são gerados pelo app.
**Restrição.** 🔴 Não prometa o informe anual, que é documento de prazo e gera
expectativa forte. Confirme com o time se ela precisar.

### 4.5 · Guia do INSS do pró-labore
`secao: prolabore` · `promessa: parcial` · `onde: nos bastidores, sem tela própria`

**Estado.** A pessoa quer saber como paga o INSS dela como sócia.
**Ação.** A declaração e a guia do INSS sobre o pró-labore são nossas, junto com o resto
da rotina do mês.
**Restrição.** 🔴 Esta guia vence antes do imposto do faturamento. Não diga data de
cabeça: leia a nota de obrigações. E por este canal você não envia guia.

### 4.6 · Duplo vínculo: CLT e sócio na mesma conta
`secao: prolabore` · `promessa: pode` · `onde: na aba Mais, em sócios`

**Estado.** A pessoa é registrada em outra empresa e também sócia, e quer saber se paga
INSS duas vezes.
**Ação.** O app já sabe do outro vínculo e leva isso em conta no cálculo.
**Restrição.** ⚠️ A folga do teto do INSS não está apresentada em tela. Explique o
princípio sem prometer que ela vai ver essa conta aberta no app. Números saem da base.

### 4.7 · Alterar pró-labore de mês já processado
`secao: prolabore` · `promessa: parcial` · `onde: na aba Mais, em serviços`

**Estado.** A pessoa quer mudar o pró-labore de um mês que já foi declarado.
**Ação.** É um serviço avulso, executado por contador, porque mexe em obrigação já
entregue.
**Restrição.** ⚠️ Preço do avulso sai da base. Não prometa prazo. Se o mês já virou e há
imposto ou multa envolvida, é escalonamento.

---

## ✅ Estar em dia

### 5.1 · "Você está em dia", sem jargão
`secao: emdia` · `promessa: parcial` · `onde: na aba Mais, em estar em dia`

**Estado.** A pessoa quer a resposta curta: está tudo certo com a empresa dela ou não.
**Ação.** O app responde isso em uma frase, sem termo técnico, em vez de mostrar uma
lista de siglas.
**Restrição.** 🔴 Não afirme "você está em dia" na conversa. Essa leitura depende do que o
app apurou, e você não a tem aqui. Aponte a tela, ou confirme com o time.

### 5.2 · Declarações entregues
`secao: emdia` · `promessa: parcial` · `onde: na aba Mais, em declarações`

**Estado.** A pessoa quer conferir se as declarações da empresa foram entregues, ou um
banco pediu comprovação.
**Ação.** As declarações entregues ficam registradas no app, com a competência de cada
uma.
**Restrição.** 🔴 Não afirme que uma declaração específica foi entregue sem o app dizer.
Prazo de declaração e sigla saem da base, nunca de cabeça.

### 5.3 · Calendário de obrigações do mês
`secao: emdia` · `promessa: parcial` · `onde: em obrigações`

**Estado.** A pessoa quer saber o que vence e quando, sem precisar decorar calendário
fiscal.
**Ação.** O app mostra as obrigações do mês com as datas, em vez de deixar ela
descobrir sozinha.
**Restrição.** 🔴 Toda data sai da base, lida agora. Datas diferentes valem para
obrigações diferentes, e trocar uma pela outra faz a pessoa perder prazo.

### 5.4 · Vigília fiscal preditiva: avisa antes do problema
`secao: emdia` · `promessa: pode` · `onde: tela inicial do app`

**Estado.** A pessoa já foi pega de surpresa por imposto ou enquadramento, e quer não
passar por isso de novo.
**Ação.** Eu vigio a situação fiscal e aviso **antes** de virar problema, não depois. É
a diferença entre contador que informa e contador que protege.
**Restrição.** ⚠️ A vigília que existe hoje é a do Fator R. Não prometa alerta de teto de
faturamento nem de virada de faixa como se já estivessem ligados. Prometer aviso que não
chega é pior que não prometer.

### 5.5 · Verificação de pendências nos órgãos
`secao: emdia` · `promessa: parcial` · `onde: na aba Mais, em serviços`

**Estado.** A pessoa desconfia que tem pendência em algum órgão, ou precisa comprovar que
não tem.
**Ação.** A consulta avulsa aos órgãos é um serviço que ela pede pelo app.
**Restrição.** ⚠️ Preço do avulso sai da base. 🔴 Empresa com passivo pendente ou
regularização de dívida antiga está fora do que a casa faz: isso é saída Fora de Escopo,
não venda de avulso.

### 5.6 · Relatórios contábeis
`secao: emdia` · `promessa: parcial` · `onde: na aba Mais, em relatórios`

**Estado.** A pessoa precisa de demonstrativo contábil, normalmente porque um banco, um
investidor ou um edital pediu.
**Ação.** Os relatórios contábeis da empresa ficam disponíveis no app.
**Restrição.** Não prometa relatório específico sem consultar a base. Não interprete
número de relatório na conversa: leitura de demonstrativo é assunto de contador.

---

## 📄 Documentos e certificado

### 6.1 · Documentos da empresa num lugar só
`secao: documentos` · `promessa: parcial` · `onde: na aba Mais, em documentos`

**Estado.** A pessoa precisa de um documento da empresa e não sabe onde ele está, ou
perdeu o arquivo.
**Ação.** Os documentos da empresa ficam guardados em um lugar só, no app.
**Restrição.** 🔴 Por este canal você não envia documento. Aponte o app. Não afirme que um
documento específico está lá sem consultar.

### 6.2 · Certificado digital resolvido nos bastidores
`secao: documentos` · `promessa: pode` · `onde: na aba Mais, em certificado`

**Estado.** A pessoa ouviu dizer que precisa de certificado digital e não quer lidar com
isso, ou pergunta se tem custo à parte.
**Ação.** O certificado é resolvido por nós, nos bastidores. Ela não precisa ir atrás.
**Restrição.** 🔴 **O certificado é incluso no plano ME e não existe no plano MEI.**
Confirme o regime antes de responder, e leia a nota de planos antes de falar de valor. Não
prometa prazo de emissão: quem emite é a certificadora parceira. Sem certificado válido a
emissão de nota para.

### 6.3 · Emissão de certidão negativa
`secao: documentos` · `promessa: parcial` · `onde: na aba Mais, em serviços`

**Estado.** Um cliente, um banco ou um edital pediu certidão negativa da empresa.
**Ação.** É um serviço avulso: ela pede pelo app e a equipe emite.
**Restrição.** ⚠️ Preço sai da base. Não prometa prazo, porque depende do órgão.

### 6.4 · Declaração de faturamento, para abrir conta PJ
`secao: documentos` · `promessa: parcial` · `onde: na aba Mais, em serviços`

**Estado.** A pessoa está abrindo conta bancária da empresa e o banco pediu declaração de
faturamento.
**Ação.** É um serviço avulso, pedido pelo app.
**Restrição.** ⚠️ Preço sai da base. Não diga que é gratuito nem que está incluso sem ler
a nota de planos.

### 6.5 · DECORE, comprovante de renda do sócio
`secao: documentos` · `promessa: parcial` · `onde: na aba Mais, em serviços`

**Estado.** A pessoa precisa comprovar renda própria, normalmente para financiamento ou
aluguel.
**Ação.** É um serviço avulso que exige contador, porque tem protocolo no conselho.
**Restrição.** ⚠️ Preço sai da base. 🔴 Não prometa prazo nem aprovação: o documento tem
exigência própria e depende de conferência contábil.

### 6.6 · Dados da empresa sempre atualizados
`secao: documentos` · `promessa: parcial` · `onde: na aba Mais, em empresa`

**Estado.** A pessoa mudou endereço, atividade ou sócio, e quer saber se o app reflete
isso.
**Ação.** Os dados cadastrais da empresa ficam visíveis e atualizados no app.
**Restrição.** 🔴 Alteração contratual (mudar sócio, endereço, atividade no contrato) é
processo em órgão, não edição de campo. Não prometa mudança imediata e confirme na base o
que é alteração de verdade.

---

## 💳 Plano e cobrança

### 7.1 · Plano, próxima fatura e avulsos contratados
`secao: plano` · `promessa: pode` · `onde: na aba Mais, em plano`

**Estado.** A pessoa quer saber o que está pagando, quando vem a próxima cobrança, ou o
que entrou de avulso no mês.
**Ação.** O plano, a próxima fatura e os avulsos contratados ficam abertos no app, sem
ela precisar pedir.
**Restrição.** 🔴 Nenhum valor sai daqui. Preço de plano e de avulso saem da nota de
planos, lidos na hora. Cobrança indevida ou em duplicidade é escalonamento, não consulta.

### 7.2 · Trocar a forma de pagamento
`secao: plano` · `promessa: parcial` · `onde: na aba Mais, em plano`

**Estado.** O cartão da pessoa venceu, foi trocado, ou ela quer pagar de outro jeito.
**Ação.** A forma de pagamento fica no app, junto do plano.
**Restrição.** 🔴 Não peça dado de cartão por este canal, em hipótese alguma. Isso
acontece no app, que é o lugar seguro. Se ela está inadimplente e com medo de perder o
serviço, acolha antes de orientar.

### 7.3 · Histórico de faturas
`secao: plano` · `promessa: pode` · `onde: na aba Mais, em plano`

**Estado.** A pessoa quer conferir o que já pagou de mensalidade, ou precisa de uma
fatura antiga.
**Ação.** As faturas anteriores ficam listadas no app.
**Restrição.** Não afirme que uma fatura específica está paga sem o app dizer. Divergência
de cobrança é escalonamento.

### 7.4 · Cancelar o plano sem punição
`secao: plano` · `promessa: parcial` · `onde: na aba Mais, em plano`

**Estado.** A pessoa pergunta o que acontece se ela quiser sair, ou está comparando e quer
saber se fica presa.
**Ação.** Sair é um direito dela, e a regra está escrita no contrato, não escondida.
**Restrição.** 🔴 **Isto é consulta, não escalonamento**: leia a nota de contrato e passe a
regra com os números que estão lá, o que tranquiliza junto com o que pesa. Você **não tem
nenhum desses números** em nenhum outro lugar. 🔴 Nunca use "incondicional" ou "sem letra
miúda" como promessa. Vira escalonamento só quando ela **pede** o cancelamento dela ou
quer negociar.

### 7.5 · Loja de serviços avulsos
`secao: plano` · `promessa: pode` · `onde: na aba Mais, em serviços`

**Estado.** A pessoa precisa de algo pontual que não faz parte da rotina mensal.
**Ação.** Os serviços avulsos ficam numa lista no app, com preço visível, e ela pede
direto por lá.
**Restrição.** 🔴 Preço de cada avulso sai da base, nunca de memória. Não invente serviço
que não está na lista: se ela pergunta por algo que você não leu, é "deixa eu confirmar
com o time".

### 7.6 · Perfil, conta e acesso
`secao: plano` · `promessa: parcial` · `onde: no perfil`

**Estado.** A pessoa quer mudar dado de acesso, senha ou contato.
**Ação.** Os dados de acesso ficam no perfil dela, dentro do app.
**Restrição.** 🔴 Nunca peça senha por este canal, nem para "adiantar o atendimento".
Acesso de segundo sócio não faz parte do produto hoje: não prometa.

### 7.7 · Reajuste anual com regra anunciada
`secao: plano` · `promessa: parcial` · `onde: nos bastidores, sem tela própria`

**Estado.** A pessoa quer saber se o preço vai subir, e quanto.
**Ação.** O reajuste segue uma regra anunciada, não um aumento surpresa.
**Restrição.** 🔴 Índice, percentual e data saem da base. Não diga "não tem reajuste" nem
"o preço nunca sobe": negativa sobre contrato e preço exige consulta antes.

---

## 👷 Folha de pagamento

> ⚠️ **Contexto que vale para os dez cartões abaixo.** A folha de pagamento **entrou no
> escopo** por decisão de 12/09, e quase nada dela está construído. Isso cria a situação
> mais perigosa deste arquivo: existe decisão interna de fazer, e o cliente não pode
> ouvir promessa por causa disso. Nenhum cartão de folha autoriza primeira pessoa.
>
> 🔴 **E existe uma regra de negócio que precede qualquer conversa de folha:** contratar
> colaborador cria obrigação mensal **permanente**, inclusive em mês sem movimento. Quem
> pergunta sobre folha precisa ouvir isso antes de ouvir qualquer facilidade.

### 8.1 · Cadastro do colaborador
`secao: folha` · `promessa: parcial` · `onde: na aba Mais, em colaborador`

**Estado.** A pessoa quer contratar alguém e pergunta se o app cuida disso.
**Ação.** Existe um caminho de cadastro de colaborador no app.
**Restrição.** 🔴 Não descreva a rotina de folha completa a partir deste cartão. Cadastrar
não é processar folha. Avise da obrigação mensal permanente antes de qualquer outra
coisa, e confirme com o time o que está disponível hoje.

### 8.2 · Lançamentos do mês e fechamento da competência
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa já tem colaborador e quer fechar a folha do mês.
**Ação.** Hoje isso não está no app.
**Restrição.** 🔴 Não prometa. Ofereça falar com o time.

### 8.3 · Holerite e demonstrativo de pagamento
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa precisa entregar holerite ao colaborador.
**Ação.** Hoje o app não gera holerite.
**Restrição.** 🔴 Não prometa, nem como "em breve".

### 8.4 · Guias da folha
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa quer saber como paga os encargos do colaborador.
**Ação.** Hoje o app não emite as guias da folha.
**Restrição.** 🔴 Não cite sigla nem valor de encargo de cabeça. Não prometa emissão.

### 8.5 · Obrigações mensais da folha
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa ouviu falar das declarações mensais de quem tem funcionário e quer
saber se é o app que cuida.
**Ação.** Hoje essas obrigações da folha não são cobertas pelo app.
**Restrição.** 🔴 Não confunda com a rotina do sócio, que é coberta. Confirme com o time.

### 8.6 · Declaração de mês sem movimento
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa pergunta o que acontece nos meses em que o colaborador não recebe
nada, ou em que a empresa parou.
**Ação.** Hoje o app não faz essa declaração.
**Restrição.** 🔴 Mesmo sem poder prometer, **diga a regra**: ter folha cria obrigação
mensal permanente, e mês parado também declara. Essa é a informação que muda a decisão
dela, e omitir para não complicar a venda é o tipo de coisa que a casa não faz.

### 8.7 · Desligamento e rescisão
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa quer desligar um colaborador e não sabe o que precisa fazer.
**Ação.** Hoje o app não cuida da rescisão.
**Restrição.** 🔴 Não calcule verba rescisória na conversa, em hipótese alguma. É
julgamento que não é seu: escalonamento.

### 8.8 · Quanto custa o colaborador, antes de contratar
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa está decidindo se contrata alguém e quer saber o custo real, além do
salário.
**Ação.** Hoje essa simulação não está no app.
**Restrição.** 🔴 Não invente a conta na conversa. O que você pode e deve dizer é a regra
que muda a decisão: contratar cria obrigação mensal permanente. O resto é com o time.

### 8.9 · A folha somando no Fator R junto com o pró-labore
`secao: folha` · `promessa: parcial` · `onde: nos bastidores, sem tela própria`

**Estado.** A pessoa tem ou quer ter colaborador e pergunta se isso muda o imposto dela.
**Ação.** O Fator R olha a folha dos últimos doze meses, e o pró-labore entra nessa conta.
**Restrição.** ⚠️ Hoje o que alimenta essa conta é o pró-labore. Não afirme que a folha de
colaborador já está somando. 🔴 Percentual e limiar saem da base.

### 8.10 · Dependentes para o IRRF
`secao: folha` · `promessa: nao` · `onde: não está no app hoje`

**Estado.** A pessoa pergunta se declara dependentes para pagar menos imposto de renda.
**Ação.** Hoje o app não capta dependentes.
**Restrição.** 🔴 **Dependente existe em folha de colaborador, não no pró-labore do
sócio.** O imposto de renda do pró-labore sai sem dedução por pessoa a cargo. Não sugira
o contrário, que é erro de regime e não só de funcionalidade.
