---
tipo: marco
data: 2026-09-05
assunto: rota-assistida
tags: [execucao, marcos, flow, assinatura, certificado, socios]
---

# 🏁 49º flow — auditoria da rota assistida, a 2ª assinatura e a entrada dos sócios

> Dia inteiro no ramo A3.H → A5.H. Três movimentos: **auditar** o que estava
> construído, **construir** o que faltava, e **ratificar** com o especialista o
> que eu vinha deduzindo. O terceiro foi o mais barato e o que mais mudou coisa.

## 1. A auditoria: 9 defeitos, 3 com uma raiz só

O Pedro pediu Playwright + pente-fino antes de mexer. 21 casos varridos.

**A raiz:** o compromisso viajava entre telas como **frase pronta**
(`?agendado=Hoje às 15:00`), montada a partir do `label` do dia no mock, ao
lado das partes. Três bugs saíram daí:

1. **O cartão da hora sumia.** Desistir de remarcar devolvia a frase sem as
   partes: hero, etapa e CTA seguiam dizendo "Você tem hora marcada" enquanto o
   cartão de apresentação tomava o lugar do cartão do compromisso. O único
   bloco que respondia QUANDO era o que sumia.
2. **O rótulo do mock vazava pra copy pública.** O dia 15 se chamava
   "Segunda 15" (nome inventado pra não se confundir com o dia 8), e o app
   dizia, no botão: *"Confirmar Segunda 15 às 09:00"*.
3. **A frase não carregava a data.** "segunda às 09:30" com duas segundas na
   agenda não escolhe entre elas — e foi por isso que o mock inventou o nome do
   item 2.

Nasceu [[compromisso]] (`app/src/lib/compromisso.ts`): **o compromisso é DADO,
não texto**. Viaja em partes, e toda frase que a interface mostra é derivada num
lugar só. Regra que fica: *dado derivado que viaja é dado que um dia chega
divergente do original*.

**Os outros 6:** o rodapé prometia "o processo segue sozinho" no estado em que
tudo depende de duas pessoas se encontrarem; a 2ª rodada de nomes recobrava a
guia já paga (o progresso é um ponteiro linear e o recuo da viabilidade
arrastava a guia junto — resolvido com `jaFeita`, estado "feito fora de ordem",
novo no `painel`); remarcar não reconhecia o horário atual; a A5.H contava como
tarefa dela o que era conduzido pela casa; faltava guarda por regime
(`?rota=assistida&regime=mei` renderizava a rota inteira); e a auditoria de
"voltar" do gerador acusava 25 telas, das quais 7 eram o mesmo status — auditoria
que acusa tudo não protege nada.

Virou spec: `app/e2e/rota-assistida-auditoria.spec.ts`, 28 casos.

## 2. A 2ª assinatura ganhou o ciclo que faltava

Pedido do Pedro: *"essa exige a mesma complexidade da primeira"*. Até então a
rota assistida tinha passagem/agenda/status só pra 1ª — a volta da primeira caía
num status que ainda mostrava o compromisso **já cumprido** e oferecia remarcar
uma hora que tinha passado.

Nós novos **A3.H3 · A3.H4 · A3.H5**, variantes (`?assinatura=1` no status,
`?rodada=2` na agenda), não telas novas: a mecânica que a pessoa já aprendeu não
pode mudar entre uma assinatura e outra.

## 3. 🔑 A procuração e-CAC saiu do flow

Com o certificado digital ela é **dispensável**. Ratificado pelo Ademar por
telefone — e o registro de 31/08 ([[2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo]],
item 17) já dizia exatamente isso, mas ficou 5 dias sem ratificação e a trilha
manteve a procuração por segurança.

⚠️ **Lição de método, e é a mais cara do dia.** O passo teve **5 versões em 2
dias**: "já feita junto da assinatura" → tarefa do cliente na A5 → conduzida
pelo consultor → 3ª assinatura com hora marcada → inexistente. As quatro
primeiras nasceram de raciocínio meu sobre regra de órgão; a quinta veio de quem
opera. **Regra de órgão não se deduz, se pergunta** — e o Ademar é a porta.

## 4. O certificado é o último passo, e não é recibo

Ele estava na trilha da A5 como "feito · por nossa conta", como se emitir
certificado acontecesse sozinho no fundo. Não acontece: a emissão exige
**videochamada de validação com hora marcada**, feita por uma **certificadora
parceira** que procura o cliente, agenda, conduz, emite e sobe os arquivos numa
plataforma interna nossa.

Marcar como "feito" era a mesma mentira do check verde da viabilidade em 04/09 —
pior aqui, porque este passo **pede a pessoa**: ela precisa atender uma chamada,
e quem lê "por nossa conta" não atende. O que continua verdade e continua dito:
está **incluso no plano**.

## 5. A5.H reformada

- **Trilha usa o cartão de status da casa** (`TimelineEmBlocos`, exportado com
  `gruposProprios`). Ela tinha marcador próprio, contador próprio, barra de
  progresso e pill "Sua vez" — duas linguagens pro mesmo conceito, no mesmo dia,
  a segunda chegando quando a pessoa já aprendeu a primeira.
- **Barra de abas travada à vista** (antes não havia barra): a última linha da
  trilha promete que "tudo se abre", e sem barra a promessa não tinha objeto.
- **Título** virou "Último passo: Certificado Digital".
- **Saíram:** a tarefa "Conferir os dados da empresa" (a conferência já
  aconteceu no A1), o cartão "Sem pressa com imposto", os blocos de home em
  regime (Aprenda / Quem cuida), o sino e o avatar.
- **DS:** variante `travado` (cinza) nasceu aqui. Não é `disabled` coral —
  coral apagado é "espera curta, a ação volta" ("Aguardando compensação");
  cinza é "trancado até outra coisa acontecer, e não é esta tela que destranca".

🐛 Achado no caminho: a nota *"A guia não espera a análise"* era **fixa no
render** do cartão de ação e apareceu embaixo de "Conferir agora" assim que a
trilha passou a usar o componente. Virou dado da etapa (`acaoCliente.nota`).

🐛 E um bug de layout que só apareceu **medindo**: o bloco fixo da agenda
(título + cartão + fila de dias) comia a viewport e deixava a grade de horários
com **21px na 1ª rodada e ZERO na 2ª**. O último horário nascia debaixo do
rodapé; o teste só clicava nele porque o Playwright rola sozinho. Corrigido
colocando cartão e fila na mesma rolagem dos horários (285px / 253px), na ordem
que o Pedro pediu.

## 6. 🤝 A variante com sócio

O ramo inteiro assumia **uma pessoa**. Ademar, por áudio, resolveu as duas:

> *"Na primeira assinatura no contrato, independente se a pessoa é
> sócio-administrativo, sócio-administrador ou sócio comum, **todos os sócios
> devem assinar**. Se você cadastrou um, um assina; se cadastrou dois, dois
> assinam; se cadastrou dez, dez assinam."*
>
> *"Já para gerar o CNPJ, sempre vai ser o **sócio-administrador perante a
> Receita Federal, mais o contador**."*

⚠️ Isso desfez uma leitura errada que estava a um passo de virar decisão: a ata
de 01/09 diz que o sócio de código 22 *"não assina pela empresa"* — e isso é
**representação** (agir em nome da sociedade depois de aberta), não a assinatura
da constituição, que é o acordo **entre** os sócios (art. 997/999 CC). Duas
camadas; ler uma como a outra é o erro que só aparece no cartório.

Nós **A3.H′ · A3.H1′ · A3.H2′**. Escala pra N (`lib/socios`): com 1 sócio a
frase usa o nome, com 2+ usa a contagem e a lista "Quem assina" traz os nomes
completos — nome de assinante em documento não se abrevia, mas no meio de uma
frase corrida a lista inteira vira ruído e cresce sem teto.

## 7. O pente-fino final

12 estados varridos. **Estrutura limpa**: zero estouro em 375px, console mudo,
nenhum alvo de toque abaixo de 40px, nenhuma menção órfã à procuração.

**5 defeitos de copy, todos criados por mim no mesmo dia:** travessão (regra
dura da casa), nome próprio em minúscula (`toLowerCase()` no sujeito inteiro),
plural fixo com um sócio só, e **dois ecos** — um deles triplo, com
*"Carlos não precisa estar"* no hero, no cartão e na etapa.

Reapliquei a regra que o Pedro travou em 05/09 na A3.H: **cada bloco diz só o
que só ele pode dizer**. Hero afirma QUEM assina, cartão carrega POR QUE tem
que ser junto, etapa entrega QUANTO TEMPO. A dispensa do sócio mora num lugar
só — a agenda, que é onde ela muda o comportamento.

## Estado

Mapa **v112** · `tsc` e `eslint` limpos · 28 casos verdes na spec do ramo ·
espelho mapa × apresentação sem pendência.

## Falta

- 🔴 A **plataforma interna** que recebe o certificado da parceira não existe —
  spec de dashboard interno.
- 🔴 O **convite ao sócio** é só promessa de copy: não há envio, não existe
  estado de "sócio não confirmou" e não há tela do lado dele. É o caso mais
  provável de travar a esteira no dia da chamada.
- 🔴 A agenda casa **uma** disponibilidade quando o ato pode ter até 4 pessoas.
- 🔴 Qual parceira, prazo de contato e o que fazer se o cliente não atende são
  decisão de operação — Mauro.
- 🟡 A quantidade de sócios ainda não vem do C3; o status demonstra o caso de 2.
- 🟡 Grafia **"Legalizai" × "Legalizaí"** em aberto. Mudou só a cor: o "ai" vai
  em `--color-brand` (#F2643C), o coral que a paleta reserva pro wordmark.
- 🟡 Na A5.H o contador diz "1 de 3" incluindo o desfecho — consistente com o
  componente, impreciso com a realidade (há uma pendência, não duas).
