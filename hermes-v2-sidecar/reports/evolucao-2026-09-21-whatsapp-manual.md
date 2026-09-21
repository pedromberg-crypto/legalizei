---
tipo: evolucao
status: vivo
data: 2026-09-21
assunto: hermes-v2-sidecar
tags: [whatsapp, producao, manual, custo, ux, pre-lancamento]
---

# Evolução · 2026-09-21 02:02 · maratona manual no WhatsApp real

> 🔴 **O placar é o número menos informativo deste relatório.** Ele tem ruído
> medido de até 3 pontos. Diferença pequena entre rodadas **não é sinal**. O que
> vale olhar é a rota escolhida e o caso que falha sempre.

⚠️ **Esta rodada não tem placar automático.** Foi conversa humana no WhatsApp de
produção, não suíte. Não passou por regex nenhuma: o que está avaliado abaixo
foi lido à mão, mensagem por mensagem, contra o `RULES.md` e o `PERSONA.md`.
É a primeira medição de custo real de produção deste motor.

## 1. Identificação

| | |
|---|---|
| data e hora | 2026-09-21, 02:02:24 a 02:13:04 (10min40s) |
| suíte | **nenhuma** — conversa manual do Pedro pelo WhatsApp |
| origem | sessão `ffa2c70f`, contato `...4955@lid` (553194054307) |
| turnos | 10 · 20 mensagens gravadas |
| modelo | `gemini-3.1-flash-lite` |
| fonte dos dados | `conversa.mensagem` e `conversa.turno_interno` no Supabase |
| log de produção | `journalctl --user -u leo-sidecar`, 02:02:27 a 02:13:06 |
| contexto | sessão aberta do zero: a conversa anterior foi apagada às 02:01 a pedido |

## 2. Placar e custo

### 🔴 Leia isto antes da tabela de custo

**A taxa de cache desta sessão não foi gravada.** O contador de consumo
(`contarLlm`, em `testes/contador.ts`) existe apenas no arnês de E2E. O caminho
de produção usa `criarLlm` direto, e `conversa.turno_interno` guarda
`tokens_entrada` e `tokens_saida`, mas **não** a fatia que veio de cache.

Então o custo exato desta conversa **não é recuperável**. O que está abaixo é um
intervalo honesto: o teto é real e medido; o piso usa a taxa de acerto observada
nas rodadas de E2E do mesmo dia (89,2% a 89,8%), que é estimativa, não medição.

| | |
|---|---|
| turnos | 10 |
| chamadas ao modelo | 10 (uma por turno; `functionCall` interno não some separado) |
| **tokens de entrada** | **184.926** (medido) |
| **tokens de saída** | **2.322** (medido) |
| razão entrada/saída | 79,6 para 1 |
| **custo SE cache = 0%** (teto real) | **US$ 0,049715** |
| custo estimado a 89,5% de cache | US$ 0,012475 |
| **economia estimada do cache** | **US$ 0,03724 · ~74,9%** |
| custo por turno, sem cache | US$ 0,004971 |
| câmbio | **indisponível** — `buscarCambio()` não respondeu, sem valor em reais |

Preço de 0,25/1,5/0,025 por milhão (entrada/saída/cache). Fonte:
`briefing-agente-leo-2026-09-20.md §10`, medido em 2026-09-20.

**Ordem de grandeza que interessa:** uma conversa comercial completa de 10
turnos custa por volta de **um centavo de dólar**. Mesmo no teto absurdo de
cache zero, cinco centavos. O custo não é o gargalo deste produto.

⚠️ **A entrada cresce rápido com o turno.** O histórico é reenviado inteiro a
cada vez: o turno 1 custou 23.670 tokens de entrada e o turno 8 custou 25.595,
com picos e quedas conforme as tools abertas. Conversa de 30 turnos não custa 3
vezes uma de 10.

## 3. Chamadas de RAG

| base | trechos |
|---|---|
| `buscar_cartao` (as 58 capacidades) | 6 |
| `buscar_base` (as notas) | 0 |

| tool | chamadas |
|---|---|
| `escopo` | 2 |
| `teto` | 2 |
| `links` | 1 |
| `estimativa_das` | 1 |
| `plano` | 1 |
| `contrato` | 1 |

🔑 **`buscar_base` = 0, igual à rodada 4 do E2E.** As notas de conhecimento não
foram lidas uma vez sequer em dez turnos de conversa real. Isso corrobora, em
produção, a hipótese de competição entre descrições de tool levantada no
relatório da rodada 4 — e agora não é mais só um sintoma de suíte sintética.

### Rotas escolhidas

| trilha | turnos | E2E rodada 4 |
|---|---|---|
| `tecnico` | 5 | 8 |
| `comercial` | 3 | 0 |
| `fora_escopo` | 1 | 1 |
| `escalonamento` | 1 | 1 |

| | |
|---|---|
| turnos sem lastro técnico | 4 — t3, t6, t9, t10 |

🔑 **A conversa real roteou melhor que a maratona sintética.** Três turnos
comerciais contra zero no E2E, com o mesmo código e os mesmos prompts. Isso é um
aviso sobre a suíte, não um elogio ao agente: o `casos-maratona.yaml` usa frases
mais secas e ambíguas que as do Pedro, e pode estar medindo um cenário mais
difícil que o real.

## 4. Análise de evolução

### 4.1 Comparação com a rodada anterior

Não é comparável linha a linha: rodada sintética contra conversa humana. O que
se compara são os indicadores estruturais.

| | E2E rodada 4 | WhatsApp real | leitura |
|---|---|---|---|
| turnos | 10 | 10 | — |
| rota `comercial` | 0 | 3 | real melhor |
| turnos sem lastro | 5 | 4 | real melhor |
| `buscar_base` | 0 | 0 | **igual, e é o problema** |
| tokens de entrada | 167.903 | 184.926 | +10% no real |

### 4.2 O que a conversa real mostrou, e as três correções que saíram dela

#### 🔴 Defeito 1 — mandou assinar num produto que não lançou. Duas vezes.

Turno 7:

> "Para assinar, é só acessar o nosso site e seguir o passo a passo por lá."

Turno 10, depois de o cliente se acalmar e perguntar onde finaliza:

> "Para ver os detalhes dos planos e seguir com o pedido, é só acessar o nosso
> site."

**Este é o defeito mais grave desta rodada**, e nenhuma checagem automática o
pegaria: o `RULES.md` não proibia. O produto está em pré-lançamento, não existe
checkout, e o Léo mandou a pessoa bater numa porta fechada — duas vezes, na
mesma conversa, justo nos dois momentos em que ela disse sim.

**Corrigido:** nova regra dura no topo da seção 6 do `RULES.md`. A conversão
agora é a Lista de Espera VIP, com previsão de 31/12, e o site continua sendo
canal oficial mas nunca caminho de contratação imediata.

#### 🔴 Defeito 2 — o cliente riu e o Léo ignorou

Turno 3:

> **Pedro:** "Hahaha brincadeira, eu sou Designer Gráfico, presto serviço pra
> agências. Vocês atendem, né?"
>
> **Léo:** "Atendo sim, design é serviço, tá dentro."

A informação está certa e a resposta é curta, que é o que o `PERSONA` pede. Mas
o riso passou em branco. Ignorar o riso do outro é o gesto mais robótico que
existe numa conversa, e denuncia automação mais rápido que qualquer erro de
dado.

**Corrigido:** seções novas de **Espelhamento de humor** e **Descontração
inteligente** no `PERSONA.md`, com a exceção do riso nervoso preservada — quem
escreve "kkk tô ferrado" não quer companhia na piada.

#### ⚠️ Defeito 3 — blocos longos demais para tela de celular

As respostas ficaram entre 125 e 511 caracteres, várias com três parágrafos. O
turno 7 tem valor, escada de preço, o que inclui, o passo a passo e dois links
numa só resposta.

**Corrigido:** seção **Síntese** no `PERSONA.md`, sem limite de caracteres, com
o critério de legibilidade: se precisa de rolagem no celular, está longa.

#### ⚠️ Defeito 4 — a segunda batida chegava colada

`PAUSA_ENTRE_BATIDAS_MS` era 1200ms fixos. Além de rápido demais, **intervalo
constante é assinatura de automação**: duas mensagens sempre a exatamente 1,2s
uma da outra não acontece com gente.

**Corrigido:** faixa aleatória de 2.500ms a 4.000ms em `server.ts`, com o
`/typing` reenviado antes da pausa — enviar uma mensagem limpa o indicador no
aparelho, então sem isso a pessoa veria "digitando" sumir e a segunda batida
cair do nada.

#### O que funcionou bem, e vale registrar

* **Turno 8, fidelidade.** "A fidelidade é de 12 meses, contados a partir da
  abertura do CNPJ. Se você cancelar antes disso, a multa é de 30% sobre o saldo
  restante." Com `fatos=[contrato]`, rota `comercial`. A correção da rodada 3 se
  sustenta em produção, não só no E2E.
* **Turno 2, gate de saída.** Recusou comércio com o motivo, sem cotar nada.
* **Turno 5, Fator R.** Usou `estimativa_das`, deu ~R$ 900 sobre 15 mil e se
  declarou estimativa.
* **Turno 9, passivo.** Não ofereceu regularizar nada e escalou para humano.

### 4.3 Achados que ainda NÃO têm correção

| turno | achado | por que importa |
|---|---|---|
| t9 | "eu te **garanto**: aqui a gente trabalha com transparência total" | o `RULES.md` §9 proíbe fingir certeza; "garanto" é a palavra que a régua do E2E pega |
| t9 | "te mostro nosso CNPJ, o CRC do contador e o nosso contrato antes de qualquer passo" | ele **não pode mostrar documento**. Só fala no turno. É a mesma família de "prometer enviar depois", numa forma que a regex atual não alcança |
| t8 | fecha com "Fica esperto que eu já fiquei" | fecho de marca logo após explicar multa de 30%; o tom não acompanha o assunto |
| — | `buscar_base` = 0 em produção | as notas não estão sendo consultadas por ninguém, em lugar nenhum |

### 4.4 O que esta rodada NÃO prova

**Não prova que as quatro correções funcionam.** Elas foram escritas *a partir*
desta conversa e entraram em produção às 02:20, depois dela. Nada aqui as testou.

**Não prova o custo exato.** A taxa de cache de produção não é gravada. O teto é
medido; o piso é estimativa emprestada do E2E.

**Não é amostra.** Uma conversa, um interlocutor, que conhece o produto e sabia
que estava testando. Cliente real erra mais, escreve pior e muda de assunto sem
avisar.

**Não mede o que não aconteceu.** A conversa não teve áudio, imagem, grupo, nem
duas pessoas falando ao mesmo tempo.

## 5. Decisão

| | |
|---|---|
| esta rodada autorizou mudança em produção? | **sim, quatro**, com autorização expressa registrada |
| o que foi aplicado | `server.ts` (pausa 2,5–4s + typing), `PERSONA.md` (espelhamento, descontração, síntese), `RULES.md` (pré-lançamento e Lista VIP) |
| estado | build limpo, `leo-sidecar` reiniciado às 02:20:51, ponte intacta |
| precisa de outra rodada? | **sim** — nenhuma das quatro foi testada |

### Próximos passos, em ordem de valor

1. **Repetir a maratona manual no WhatsApp**, com as mesmas dez perguntas. É o
   único jeito de medir espelhamento de humor e ritmo das batidas, que nenhuma
   regex captura. Rir de propósito em um dos turnos.
2. **Gravar a taxa de cache em produção.** Sem isso, custo real nunca sai de
   estimativa. É acrescentar duas colunas em `conversa.turno_interno` e passar o
   `usageMetadata` adiante — mudança de schema e de `server.ts`, precisa de
   autorização.
3. **Acrescentar ao `casos-maratona.yaml`** as checagens que faltaram: mandar
   assinar agora, "garanto", e prometer mostrar documento.
4. **Testar a hipótese de competição entre tools.** `buscar_base` = 0 agora em
   produção *e* no E2E. Deixou de ser suspeita de suíte.
