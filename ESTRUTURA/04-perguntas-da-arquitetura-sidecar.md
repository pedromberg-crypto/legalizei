---
tipo: resposta
status: vivo
data: 2026-09-20
assunto: agente-whatsapp-vault
tags: [estrutura, leo, agente, arquitetura, sidecar, roteador, fallback, memoria]
---

# 04 — Três perguntas sobre a arquitetura Sidecar

**Origem:** segunda rodada de perguntas de fora (20/09), sobre uma arquitetura proposta
de **Roteador + Oráculo Técnico + Sidecar Comercial**. **Respondido em 2026-09-20**,
commit `69f2acb`, medindo o repo.

⚠️ **Nada aqui foi decidido.** São recomendações com a evidência ao lado. As três
decisões — Sidecar condicional, quebra do SOUL e memória por contato — são do Pedro.

Ver [[03-perguntas-de-arquitetura-respondidas]] (a 1ª rodada, sobre o que existe hoje).

---

## 0. A correção de premissa, que muda a resposta 1

A pergunta 1 usa como exemplo *"qual a alíquota de ICMS para transporte de carga no
MEI?"* e trata isso como um caso de **"não sei"**. Não é.

🔒 ICMS está **fora do escopo por decisão travada**: ME no Simples, Anexos III e V,
atividade de serviço. Comércio, indústria e Lucro Presumido ficam de fora, e isso é
**dado + script** no repo, não etiqueta. A resposta certa não é *"não tenho essa
informação no momento"* — é o **gate de saída**: dizer o limite e convidar a acompanhar,
terminando com site e Instagram.

🔴 *"Não tenho essa informação"* implica **"existe e eu vou buscar"**. Abre expectativa
falsa e gera turno de follow-up que não leva a lugar nenhum.

São **três estados de falha diferentes**, e o vault já os separa:

| situação | comportamento | é falha? |
|---|---|---|
| Fora do escopo (ICMS, comércio, Lucro Presumido, EPP, fora de BH) | **gate de saída** (`12-GATE-DE-SAIDA`) | ❌ não — resposta definitiva |
| Dentro do escopo, julgamento que não é nosso (valor fechado, multa, cláusula) | **escalação** (`escalacao`) | ❌ não — é o atendimento funcionando |
| Dentro do escopo, deveria estar na base e não está | *"vou confirmar com o time"*, uma linha | ✅ sim — e é **dado de produto**: falta nota no vault |

Juntar os três num só "não sei" perde as duas saídas boas e fica com a ruim.

---

## 1. Falha técnica cancela o gancho comercial do turno?

> **Pergunta:** Se o Oráculo falhar e não trouxer a resposta técnica, o Agente Comercial
> (Sidecar) ainda deve tentar fazer o gancho de vendas no final, ou a falha técnica
> cancela a tentativa de venda daquele turno?

**Cancela** — e o precedente já está travado no vault, por outro motivo.

A regra existente chama-se **"o gatilho vem antes da venda"**: quando a mensagem traz
uma dor e uma pergunta comercial juntas ("tomei multa do meu contador, quanto custa
aí?"), o gatilho manda. Acolhe, avisa, e só depois fala de preço, se a pessoa ainda
quiser. A justificativa escrita é: *"responder o preço primeiro transforma a dor dela em
gancho de venda, que é exatamente o que ela acabou de sentir do contador antigo."*

Falha técnica tem o mesmo formato. O agente acabou de dizer "não sei"; emendar oferta no
mesmo turno converte frustração em pitch. É o movimento que mais parece script.

**A exceção que não é exceção:** no caso *fora do escopo*, o gate de saída **termina com
o site e o Instagram por regra**. Parece gancho e não é — é encerramento com porta
aberta, e a copy é de despedida, não de conversão. Não confundir as duas coisas na
implementação do Sidecar, senão uma recusa honesta vira funil.

⚠️ **Alerta de custo sobre o Sidecar em si:** rodando em todo turno, ele adiciona uma
chamada por turno. Hoje o `"oi"` custa **1 chamada e 8.987 tokens** — foi assim que
ficou depois de cair 46%. Sidecar incondicional **dobra o piso**, que é onde está quase
todo o custo: a diferença entre a pergunta mais fácil e a mais difícil é de só **27%**.

🔑 **Recomendação: Sidecar condicional** — roda quando a resposta técnica foi
bem-sucedida **e** o assunto é comercial. Preserva o ganho de 20/09.

---

## 2. Quebrar o SOUL em RULES.md + PERSONA.md

> **Pergunta:** O seu SOUL.md atual possui regras de restrição de escopo ("Não atendemos
> Lucro Presumido") misturadas com regras de tom de voz ("Seja amigável e use emojis")?
> Como você avalia o esforço de quebrar esse arquivo em dois: um RULES.md (regras duras
> de negócio) e um PERSONA.md (tom de voz e persuasão)?

### A medição

`00-SOUL-personalidade.md` — **23.297 chars, 14 seções:**

| bloco | chars | % |
|---|---|---|
| **Tom, ritmo, humor, banco de falas, formato** | 11.488 | 49% |
| **Verdade, limites, erro, regras duras** | 6.643 | 29% |
| **Roteamento (skills + tabela de gatilho)** | 3.835 | 16% |
| Cabeçalho e preâmbulo | 1.331 | 6% |

### A resposta

**Menos misturado do que a pergunta supõe, e por design.** Não existe regra de escopo
*decidida* no SOUL. "Não atendemos Lucro Presumido" **não mora lá** — mora em
`09-ESCOPO-E-LIMITES` e `12-GATE-DE-SAIDA`. O SOUL tem o **ponteiro** pra elas.

Isso não é sorte, é a correção de 19/09: o SOUL guardava os números que mandava
consultar, e o efeito medido foi brutal — a nota de contrato foi aberta **1 vez em 632
chamadas**, porque o prompt já entregava a resposta. O arquivo caiu de 32.675 para
21.805 chars e ficou com **zero número da Legalizai**. A regra que sobrou: *o SOUL não
guarda regra, guarda para onde ir.*

**Duas exceções reais, medidas:**
* Linha 247 — *"Comércio está fora. Vender produto a Legalizai não atende, nem como
  atividade secundária, nem no MEI."* Regra de escopo dura, escrita no SOUL.
* `## Limites` (595 chars) — declara o produto e traz a regra do MEI sem contador humano.

**Sobre emoji**, já que a pergunta cita: o SOUL **não** manda ser amigável com emoji.
Manda o oposto condicional — *"emoji só se o cliente usar, no máximo um"*. É regra de
canal, não de simpatia.

### O esforço: baixo na mecânica, alto no risco

**Mecânica:** trivial. As seções já são blocos limpos e o corte é quase por linha.
~6.600 chars vão pro `RULES.md`, ~11.500 ficam no `PERSONA.md`, e os ~3.800 de
roteamento pedem um terceiro arquivo (ou sobem pro `description` da categoria, que já
passa inteiro).

🔴 **Risco, e é o que decide: o few-shot é o que sustenta modelo pequeno.** O banco de
falas (3.018 chars) e os pares ❌/✅ espalhados são o que faz o `flash-lite` acertar tom.
Separar regra de exemplo tende a produzir um `RULES.md` que o modelo **lê e não aplica**
— que é exatamente o único defeito de qualidade já medido: ele abriu a nota que proíbe
especular sobre a lista do MEI e especulou mesmo assim. **Aderência, não recuperação.**

🔑 **Recomendação:** quebrar em três, **mas cada regra dura viaja com o par ❌/✅ dela
dentro do `RULES.md`**. Não deixar os exemplos todos no PERSONA. Medir antes e depois
com as duas suítes, lembrando que **diferença de até 3 pontos é ruído** (amplitude de 3,
σ 1,07 em 9 rodadas do mesmo pacote).

🔴 **A pergunta que a fragmentação abre, e que precisa de resposta antes do corte:** se
o Oráculo Técnico não lê o SOUL, ele também não lê "sem travessão", "sem tabela", "nunca
número de memória", "nunca prometer prazo". Ou o Oráculo devolve **dado estruturado** e
quem redige é o Sidecar, ou ele precisa de um RULES mínimo próprio. Se escrever direto
pro cliente sem isso, volta o bug de 20/09 — **três camadas discordando sobre formato**,
com o plugin desfazendo depois.

---

## 3. O que salvar no `messages` do SQLite

> **Pergunta:** O que exatamente você vai salvar no histórico da `messages` do SQLite
> para a próxima interação? Apenas o que o usuário viu (a resposta final consolidada),
> ou o raciocínio interno do Roteador (para que a IA se lembre no futuro que aquele
> usuário já foi classificado como "prospect interessado em abertura de MEI")?

**Os dois, em canais separados, e só um volta pro prompt.**

**Em `messages`: apenas o que o usuário viu.** A razão é medida, não estética — o
histórico é reenviado inteiro a cada turno, e numa conversa de 8 turnos o **turno 8
custou mais que o turno 1 sem abrir documento nenhum**. Raciocínio interno ali
multiplica o custo por turno e, pior, entra no contexto como texto do assistente: o
modelo passa a **imitar o próprio raciocínio como se fosse fala**.

**A classificação do roteador não é mensagem, é fato sobre a pessoa.** Vai em tabela
própria (o Hermes já tem `gateway_routing`), com chave por contato, e volta pro prompt
como **uma linha curta injetada** — nunca como turno de histórico.

🔑 **O critério já é doutrina no projeto: derivado não se guarda como mensagem.**
Classificação é derivada da conversa. Reenviada como texto histórico, vira **verdade
congelada** e o agente para de reclassificar quando a pessoa muda de assunto — e muda,
porque metade das conversas começa em "MEI ou ME?" e termina em outro lugar.

⚠️ **Dois avisos antes de implementar:**

* **Isso é ligar memória por outro nome.** O toolset `memory` foi tirado da configuração
  de propósito no v12. "Lembrar que o usuário é prospect de MEI" é memória persistente
  entre conversas, com todas as consequências dela. É decisão de produto, não detalhe
  técnico.
* 🔴 **O precedente de vazamento já existe.** Hoje o `USER.md` injeta o perfil do Pedro
  em **toda** conversa de cliente. Qualquer mecanismo de "lembrar quem é essa pessoa"
  precisa nascer com escopo por contato **e teste que prove o isolamento** — senão é o
  mesmo bug, em escala maior e com dado de terceiro.

---

## O fio que liga as três

As três perguntas são sobre **camadas de estado**, e as três respostas caem no mesmo
lugar: o gargalo do Léo hoje não é o que ele consegue buscar, é o que ele **obedece
depois de ter buscado**.

* A 1 se resolve com uma **precedência** que já existe escrita (gatilho antes da venda).
* A 2 é a mais arriscada justamente porque mexe em aderência, não em conteúdo.
* A 3 escolhe **onde** o estado mora para que ele não vire fala.

🔴 Nenhuma é urgente: o agente não está com cliente — ver
[[legalize-agente-whatsapp-vault-isolado]].
