---
tipo: verdade
status: vivo
data: 2026-09-11
assunto: doutrina-processos
autoridade: fonte-verdade
tags: [execucao, processos, doutrina, trava, dev]
---

# 🔗 Doutrina dos PROCESSOS — como a gente desenha antes de desenhar tela

> **De onde veio**, na provocação do Pedro em 11/09: *"talvez valha a pena a gente desenhar definitivamente o flow a nível chamadas, APIs, endpoints, pelo menos pra enxergarmos se tudo está coberto, desde o download de uma fatura até a adição de um produto na fatura."*
>
> E o pedido que veio junto, que é o motivo deste arquivo existir: *"não quero ter que ficar vendo erros básicos sendo repetidos com frequência."*

---

## 0. Por que isto existe (e por que o caminho anterior foi abandonado)

Em 11/09 eu propus inventariar as telas: abrir cada uma, listar o que ela faz, marcar no código e deixar um script vigiando. O Pedro recusou, e estava certo.

🔑 **Inventário de tela só enxerga o que ESTÁ na tela. É cego pro que falta.**

A prova apareceu no primeiro pré-voo: eu achei *"a `/mais/plano` não conhece fatura vencida"* **por acaso**, porque tinha lido o modelo do concorrente duas horas antes. Sem essa coincidência, eu teria marcado 12 capacidades, dado a tela por inventariada, e o buraco continuaria invisível — agora com um selo de "verificado" por cima, que é pior que buraco nenhum.

**A ordem certa é: processo → tela → inventário.**

| Fase | O que responde | Estado |
|:--:|---|:--:|
| 1 · **Processo** | o que precisa acontecer, ponta a ponta, com quem a gente fala | 🔵 agora |
| 2 · **Tela** | o que já está lá, o que é farol, o que falta, o que sobra | 🕓 depois |
| 3 · **Inventário de capacidades** | trava de regressão ([[_doutrina-capacidades]]) | 🕓 por último |

⚠️ **A fase 3 não morreu, foi adiada de propósito.** Congelar hoje uma tela que está com preço errado, vocabulário de assinatura e um botão de download que não baixa seria **congelar o defeito**.

---

## 1. A unidade: PROCESSO, não tela

Um processo é **uma coisa inteira que acontece**, do gatilho ao efeito final, atravessando quantas telas for preciso — inclusive nenhuma.

✅ "Adicionar um serviço avulso à fatura aberta"
✅ "Fechar a competência e emitir a fatura"
❌ "A tela `/mais/plano`" ← isso é tela, não processo

🔑 **Por que a unidade importa tanto:** defeito de coerência **não aparece na unidade errada**. Olhando só a `/mais/plano`, o fato de ela dizer "assinatura" enquanto o modelo diz "fatura por competência" parece escolha de copy. Olhando o processo inteiro, é o modelo de cobrança divergindo. Nenhuma leitura de tela isolada pegaria isso.

---

## 2. A anatomia de um PASSO (as 5 colunas, e nada além)

Todo passo responde exatamente cinco perguntas. **Cinco, sempre as mesmas, nessa ordem.**

| Campo | A pergunta | Regra |
|---|---|---|
| `quem` | **Quem dispara?** | ou uma pessoa, ou "a casa" (automático), ou "o relógio" (agendado) |
| `faz` | **O que a casa faz?** | em português, uma frase. Sem nome de função, sem tabela |
| `fala` | **Com quem a casa fala FORA dela?** | API, órgão, gateway — ou `só a nossa casa` (§2.1) |
| `ve` | **O que a pessoa vê?** | `nada, acontece por baixo` quando é invisível. **Invisível é resposta válida e precisa ser declarada** |
| `luz` | 🚦 | `verde` · `amarelo` · `vermelho` |

🔴 **REGRA DURA — vocabulário.** O Pedro disse, com todas as letras, que não domina o vocabulário profundo de programação. Então:

- **`faz` e `ve` são escritos pra ele.** Português comum. "Guarda o pedido e trava o preço do dia", não "persiste a entidade com snapshot do pricing".
- **`fala` é escrito pro dev.** Ali pode ter nome de endpoint, método e campo. É a única coluna técnica, e é técnica de propósito.
- Se um passo só pode ser explicado com jargão, **ele está grande demais**: quebra em dois.

---

## 2.1 🔴 PALAVRA, NUNCA GLIFO (11/09, pergunta do Pedro)

Ele olhou um cartão e perguntou: *"o que quer dizer mesmo o campo 'Fala com'?"* — e a resposta que o cartão dava era `—`.

🔑 **Glifo não é resposta curta. É resposta ausente com cara de preenchida.**

Pior que isso: o mesmo símbolo carregava **respostas diferentes**. O `—` queria dizer "não fala com ninguém" num passo e "não se aplica" noutro; o `❓` queria dizer "não sabemos" num e "não existe tela" noutro. Quem lê não tem como saber qual — e a segunda distinção é justamente a que decide se há **trabalho de UX pela frente** ou não.

**Vocabulário fechado, escrito em português:**

| Campo | Resposta | Significa | Tom no cartão |
|---|---|---|:--:|
| `fala` | `só a nossa casa` | nada externo: banco nosso, código nosso | cinza, recua |
| `fala` | `ainda não sabemos` | buraco declarado | âmbar |
| `fala` | *texto livre* | o nome do terceiro, curto | normal |
| `ve` | `nada, acontece por baixo` | invisível **de propósito** | cinza, recua |
| `ve` | `nada: a tela não existe` | **deveria** haver tela e não há | âmbar |
| `faz` | `ainda não sabemos` | o passo é a própria pergunta | âmbar |

⚠️ **`nada, acontece por baixo` e `nada: a tela não existe` NÃO são a mesma resposta.** A primeira é decisão; a segunda é pendência. Um traço só, servindo às duas, escondia a pendência.

🔴 **Três travas no código:**
1. `gerar-processos.mjs` **recusa** qualquer `faz`/`fala`/`ve` que comece com `—`, `-`, `?` ou `❓`, e diz qual palavra usar.
2. `fala` acima de **46 caracteres** (duas linhas do cartão) vira aviso: o detalhe técnico vai pro campo `falaNota`, que aparece no painel e na nota do dev, **nunca no cartão** — altura é fixa (§5.1).
3. O **tom** (cinza × âmbar) é derivado no gerador, não escrito no `.tsx`. Repetir a lista nos dois lados é o mesmo defeito das duas alturas do board: duas cópias do mesmo fato sempre divergem.

---

## 2.2 🔴 TRILHA — a decisão de trás que continua valendo (travada 11/09)

> *"uma condicional lá atrás, por exemplo com o título custa mais de 50 ou custa menos de 50, tem interferência em todo o restante do processo… no 4.8 poderia ter uma sessão com a condicional custa menos de 50 e outra custa mais de 50, e dentro delas os sub cards."*

🔑 **O buraco era do MODELO, não do P4.8.** Um grafo de flow sabe dizer de onde o caminho veio agora; não sabe dizer que decisão foi tomada três passos atrás e **ainda está valendo**. Sem isso sobram duas saídas ruins: duplicar o processo inteiro depois da primeira bifurcação, ou escrever condição ambígua. Foi o segundo: no P4.8, *"cancelou o plano"* queria dizer duas coisas — item na fatura (a 12.6 manda quitar) ou serviço já pago (a 12.6 nem alcança).

**A decisão ganha nome e vira trilha:**

| | |
|---|---|
| `abre` | na aresta que toma a decisão. A partir dali, tudo que for alcançado está dentro da trilha |
| `quando` | na aresta lá na frente que **só existe** naquela trilha |
| sem `quando` | vale em todas — e é assim que fica o que não muda |
| `TRILHAS` | a lista, em `processos-data.mjs`, com nome e cor |

🔑 **O que NÃO muda com a trilha continua com uma saída só.** *"Não deu certo"* e *"correu bem"* valem nas duas; duplicá-las seria o erro contrário ao que estamos consertando. A trilha existe para separar **o que de fato se separa**.

⚠️ **Trilha não é para toda bifurcação.** Só para a decisão que continua importando depois de tomada. *"Correu bem ou não"* morre no passo seguinte; *"está na fatura ou já foi pago"* atravessa o processo inteiro. Criar trilha para tudo devolveria a complexidade pela outra porta.

**A trilha faz DUAS coisas, e a segunda não é óbvia:**

| | Exemplo |
|---|---|
| **divide** um passo que parecia um só | o P4.9 ("não entregue") virou três resoluções: cobrança fica de pé (vale nas duas) · tira da fatura (`fatura`) · **estorna pelo gateway** (`pago`) |
| **estreita** um passo, revelando que ele já era de um ramo só | o P4.10 ("cancelou o plano") deixou de ser alcançado pela trilha `pago` no momento em que aquele caso ganhou passo próprio. O texto parou de fingir que valia pros dois |

🔑 **O achado que só o corte por trilha revela:** no ramo `pago`, o P4.9 deixa de ser *"só a nossa casa"* e passa a **falar com o gateway** — devolver dinheiro compensado é operação no provedor, não ajuste de fatura. **O mesmo evento é 🟢 de um lado e 🔴 do outro.** Sem trilha, esse passo teria ficado verde inteiro e o buraco só apareceria na implementação.

**No cartão:** a faixa de saídas ganha seções. O grupo sem cabeçalho vem primeiro (vale para todas), depois um grupo por trilha, com o cabeçalho *"se veio por …"* na cor dela.

🔴 **Quatro travas no gerador:**
1. `quando` que aponta pra trilha que **não alcança** aquele passo é caminho morto — descreve algo que nunca acontece.
2. **Cobertura:** passo alcançado por duas trilhas, com alguma saída condicionada, precisa responder por **todas** elas. É exatamente o buraco do P4.8.
3. **Condição repetida:** a mesma frase não pode sair duas vezes do mesmo passo dentro da mesma trilha. Duas respostas com o mesmo texto não distinguem nada — quem lê não consegue escolher. ⚠️ Enquanto uma proposta está pendente a repetição é legítima (a saída atual e a que vai substituí-la convivem), e aí o CTA carrega um selo `+S9` / `−S9` dizendo de quem ela é. A trava mede o cenário de **tudo aceito**, onde transitório não existe.
4. **Ambiguidade:** a mesma condição não pode existir "para todas" **e** numa trilha específica — dentro daquela trilha valeriam as duas. Foi o defeito que eu mesmo criei ao escrever a versão `pago` sem fechar a original em `fatura`, e a auditoria pegou.

---

## 3. O semáforo — o campo mais importante do arquivo

| | Significa | O que fazer |
|:--:|---|---|
| 🟢 `verde` | **Sabemos e dá.** Decisão travada + caminho técnico conhecido | construir |
| 🟡 `amarelo` | **Sabemos, falta alguém decidir.** O caminho existe; a regra de negócio não | vira pergunta pro Pedro ou pro Mauro |
| 🔴 `vermelho` | **Não sabemos.** Buraco real | vira pergunta pro dev, pro gateway ou pro órgão |

🔑 **O 🔴 é o produto deste trabalho, não o defeito dele.** Um processo que sai todo verde na primeira passada não foi desenhado, foi copiado. A lista de vermelhos É a pauta da próxima reunião.

🔴 **TRAVA: não se pinta de verde por otimismo.** Se a resposta é "acho que dá", é 🟡. Se é "deve existir uma API pra isso", é 🔴. A régua anti-guru do projeto vale aqui inteira: **número sem fonte não entra, e caminho sem endpoint conhecido não é verde.**

---

## 4. De onde vem a informação (precedência)

| Peso | Fonte | Como se usa |
|:--:|---|---|
| 1º | **Nossas decisões travadas** ([[decisoes-marca]], contrato, `fiscal.ts`) | manda |
| 2º | **Lei e obrigação de órgão** | manda, e não se negocia |
| 3º | **Teardown do concorrente** (`produto/evidencias/`) | 📚 evidência do que **o mundo exige** |
| ⛔ | Docs do portal de **22-23/07** | histórico. Não decidem nada ([[_doutrina-capacidades]] §7) |

🔴 **TRAVA — o concorrente é evidência, nunca meta.** O teardown dele prova o que o gateway pede, o que o órgão obriga e que o modelo aguenta. **Não** prova que a gente deve fazer igual. Onde ele resolveu por preguiça ou por dark pattern, a gente resolve diferente — e o passo registra isso como decisão nossa, com a razão do lado.

Foi por olhar pela lista dele que `/mais/relatorios` e `/mais/servicos` ficaram invisíveis por um mês e meio: são tese nossa, ele não tem equivalente, e um inventário montado pela lista dele não as enxerga.

---

## 5. O arquivo é a fonte. O board e a nota são saída.

```
execucao/processos/processos-data.mjs      ← ÚNICA fonte, editada à mão
        │
        └── node gerar-processos.mjs
                ├── app/src/lib/processos-graph.json   → board /processos (Pedro)
                └── execucao/processos/PROCESSOS.md    → nota literal (dev + Mauro)
```

🔴 **TRAVA: nunca editar o `.json`, o `.md` gerado, nem desenhar nó direto no `.tsx`.** Mesma regra do `/mapa` e do `flow-data.mjs`. Quem quebrou essa regra no passado foi o `portal-data.mjs`, que ficou **parado de 03/08 a 11/09** enquanto o produto andava.

Uma fonte, duas saídas: **o board é pro Pedro validar; o Markdown é pro dev implementar.** Os dois nunca divergem porque nenhum dos dois é escrito.

---

## 5.1 🔴 TRAVA DE DESENHO DO BOARD (11/09, dois bugs na mesma tarde)

O board é layout automático. Layout automático **só funciona quando o tamanho declarado é o tamanho real**. Os dois defeitos que o Pedro achou na primeira olhada vieram de eu ter quebrado isso.

### 🐛 Bug 1 — cartões um em cima do outro

Eu escrevi o tamanho do cartão **duas vezes, com números diferentes**: no componente a altura nascia do conteúdo (~286px) e no layout eu informava ao dagre `height: 190`. O dagre empilhava achando que cada cartão ocupava 190, e os 90px de diferença viravam sobreposição. **Quanto mais texto no passo, pior** — por isso os três últimos, que são justamente os de dúvida e os mais escritos, foram os que encavalaram.

🔴 **A regra:** medida do cartão mora em **`app/src/lib/processos-medidas.ts`**, e em lugar nenhum além dele. O componente e o layout importam a **mesma constante**. Número de tamanho escrito solto em `.tsx` é defeito, mesmo que esteja certo hoje.

🔴 **Corolário: o cartão tem altura FIXA, não altura mínima.** O que não couber é cortado por `line-clamp`, e isso é de propósito — o texto inteiro está sempre a um clique, no painel lateral. **Passo que não cabe em quatro linhas provavelmente deveria ser dois passos** (§2).

### 🐛 Bug 2 — linha cinza atravessando o cartão

A aresta que **pula uma fileira** (P4.3 → P4.5, "até R$ 50") era desenhada em linha reta por cima do cartão do meio, cortando o texto. Duas causas, as duas minhas:

1. O **fundo do cartão era translúcido** (`rgba(...,.07)`), e o React Flow pinta aresta numa camada abaixo do nó. A linha aparecia *através* do cartão.
2. O **dagre já calcula um caminho que desvia** — ele insere pontos intermediários exatamente pra isso — e eu estava jogando esse cálculo fora, usando só a posição dos cartões e deixando o React Flow ligar as pontas em reta.

🔴 **A regra:** fundo de cartão é **opaco**, sempre. E **aresta é desenhada pelos pontos do dagre**, nunca ponta a ponta. Os dois consertos estão em `caminho-edge.tsx` e `passo-node.tsx`, comentados na origem.

### As medidas travadas

| | Valor | Por quê |
|---|:--:|---|
| Largura do cartão | **300** | cabe ~46 caracteres por linha no corpo |
| Altura do cartão | **286** | fixa; o conteúdo se adapta a ela, nunca o contrário |
| Respiro entre irmãos | 90 (vertical) · 80 (horizontal) | cartões do mesmo nível |
| Respiro entre fileiras | 150 (vertical) · **220** (horizontal) | é aqui que o rótulo da aresta cabe. Maior no horizontal porque o cartão é largo e o rótulo entra **ao lado** dele |
| Folga entre rótulos | 34 | senão rótulos de arestas paralelas empilham |

### 5.1.1 A ordem dos CTAs segue os cartões (11/09)

Num passo que bifurca, a faixa lista as condições **na ordem vertical dos destinos**: quem está em cima no board fica em cima na faixa.

🔑 Nasceu de um achado do Pedro no P4.2: *"a condicional 'aceitou' leva pra um flow longo na parte de cima e a 'fechou a sheet' pra um card de saída; sem necessidade estamos cruzando as duas linhas."* O fio cruzava porque a ordem dos CTAs era a ordem em que eu **declarei as arestas** — que não tem relação com nada. Cruzamento de linha custa atenção e não carrega informação.

⚠️ A ordenação mora no board, e só pode morar lá: a posição de cada cartão só existe **depois** do `dagre.layout`, e o dagre precisa das alturas, que dependem de **quantas** saídas cada passo tem. A contagem vem antes do layout; a ordem, depois.

⚠️ **Passo novo não pede ajuste de medida.** Se alguém sentir vontade de mexer nesses números pra "caber", o problema é o passo, não o board.

---

## 5.2 🎨 As PILLS de "quem dispara" (11/09, pedido do Pedro)

O gatilho é **lista fechada de quatro**, e cada um tem cor e ícone fixos:

| Pill | Quando usar |
|---|---|
| 👤 **Cliente** (azul) | uma pessoa faz alguma coisa |
| ⚙️ **A casa** (roxo) | automático, disparado por outro passo |
| ⏱ **O relógio** (laranja) | agendado: fechamento, vencimento, lembrete |
| 🔌 **O gateway** (verde) | quem dispara é o provedor, com retorno ou webhook |

🔑 **A distinção que carrega peso é CLIENTE × o resto:** só onde há pill azul existe tela pra desenhar. O resto é máquina e não precisa de UX nenhuma. É por isso que o gatilho merece cor e não texto corrido — é a pergunta que mais se faz olhando um board de processo, e agora ela se responde de longe.

Valor fora da lista aparece **em cinza com "?"**. Falhar em silêncio seria pior.

---

## 6. Erros que eu já cometi nesta frente (memória, pra não repetir)

> Esta seção existe porque o Pedro pediu, literalmente, pra não ver erro básico se repetindo. Cada linha aqui é um erro **meu**, com a data.

| Data | O erro | A lição |
|:--:|---|---|
| 11/09 | Propus inventariar tela antes de desenhar processo | Rede de segurança vem **depois** do que ela protege |
| 11/09 | Inverti a precedência: entendi "ignorar o líder" quando o Pedro disse "ignorar os resíduos de julho" | **Perguntar qual documento**, não deduzir de qual época |
| 11/09 | Li **uma rota** e chamei de "validar o flow de plano" | Declarar **o recorte** antes de entregar leitura |
| 11/09 | Declarei ao dagre um cartão de 190px de altura que na verdade tinha 286 — cartões se sobrepuseram | **Medida mora em um lugar só.** Dois números pro mesmo objeto sempre divergem (§5.1) |
| 11/09 | Deixei o fundo do cartão translúcido e joguei fora o caminho que o dagre calculava — a aresta atravessou o cartão | Aproveitar o que a ferramenta **já calculou** antes de desenhar por cima dela (§5.1) |
| 11/09 | Painel de cobertura tinha 3 créditos errados, todos dizendo que temos o que não temos | Verificação roda nos **dois sentidos**: declarado→tela E tela→declarado |
| 11/09 | Chamei `npx.cmd` via `execFile` — proibido no Windows desde a CVE-2024-27980, e ele **estoura de forma síncrona**. A rota morria sem responder e a tela culpava o JSON | §6.1 |
| 11/09 | Passei o caminho absoluto da spec pro `playwright test`, que espera **regex**, não caminho. `C:\…` como regex não casa nada: *"No tests found"* | §6.1 |
| 11/09 | Entreguei a saída do reporter `line` crua, num `<pre>`, e chamei de resultado. O Pedro teve que pedir pra conseguir ler | §6.2 |
| 11/09 | Preenchi `fala`/`ve` com `—` e `❓`. O Pedro teve que perguntar o que o campo queria dizer | **Glifo não é resposta curta** (§2.1). E o mesmo símbolo escondia duas respostas diferentes |
| 11/09 | **Reescrevi o P4.6 três vezes**, as três corrigido pelo Pedro. Cheguei a propor remover um nó que estava vivo no outro ramo | **§6.4.** Julguei o nó pelo ramo em que eu estava. Todo nó depois de uma bifurcação é potencialmente compartilhado |
| 11/09 | Fatiei o ramo de pagamento em 3 propostas: aceitar a 1ª sem a 2ª deixava um beco | **§6.4.** Unidade de decisão = mudança que deixa o grafo válido |
| 11/09 | Escrevi "trocar rótulo de aresta" como apagar-e-recriar: o board mostrou linha duplicada e o simulador apagou as duas | **§6.4.** Operação ambígua por construção pede primitivo próprio (`rotula`) |
| 11/09 | Pus um fallback `\|\| "segue"` na faixa de saídas: o P4.5 apareceu com dois CTAs iguais, rótulo que eu inventei pra condição que não existe | **Mesma família do glifo (§2.1):** preencher espaço com texto vazio é pior que deixar vazio, porque parece informação. Faixa é sobre ESCOLHA; aresta sem condição é sequência |
| 10/09 | Apresentei um contrato como lido com **12% do texto** | [[legalize-leitura-integral-documento]] |

### 6.1 🔑 A raiz dos dois erros de ferramenta (11/09)

Os dois são **o mesmo erro com roupa diferente**: *presumi como a ferramenta recebe o argumento, em vez de conferir.*

Não são erros de digitação, e é por isso que merecem seção. Nos dois casos o código **parecia certo** — passar o caminho do arquivo que se quer rodar é o gesto óbvio, e `npx` é como se chama o Playwright na linha de comando. O que faltou foi uma pergunta de dez segundos: **"esse argumento é o quê, exatamente?"**

O `playwright test` não recebe caminho, recebe **regex casada contra o caminho**. No Linux o erro teria passado por acaso (`/` é literal em regex) e a gente só descobriria meses depois, no Windows do Pedro. Erro que só aparece num sistema operacional é erro que fica escondido.

🔴 **A trava:** ao chamar uma ferramenta externa pela primeira vez, declarar em uma linha o que cada argumento é (caminho? regex? glob? flag?) e **conferir na documentação dela, não na intuição.** Se não der pra conferir, o comentário diz "presumido" — e aí a próxima pessoa sabe onde olhar quando quebrar.

⚠️ Vale pro `execFile` também: **o que ele aceita mudou por CVE** e continua mudando. Comando que rodava ano passado pode ser recusado hoje, e a recusa nem sempre vem como erro bonito — a do `.cmd` vem como `throw` síncrono que escapa do `await`.

### 6.2 🔑 Saída de ferramenta é DADO, não texto (11/09)

O painel de E2E rodava certo e mostrava o resultado como um bloco de texto de 264px de altura. O Pedro pediu pra ficar legível, e o diagnóstico não era estética: **num dump, o que passou e o que falhou têm o mesmo peso visual.** Pra decidir, ele tinha que ler tudo e rolar — a informação que decide afogada na que não decide.

🔴 **A trava:** quando uma ferramenta oferece saída estruturada (`--reporter=json`, `--format=json`, `--porcelain`), a tela consome a **estrutura**, não o texto humano. E ordena por **atenção**, não por ordem de execução: o que quebrou primeiro, o que passou encolhido.

⚠️ **Mas nunca joga o texto cru fora.** Ele é a única pista exatamente quando a estrutura não existe: ferramenta que morre no boot não escreve relatório nenhum. Guardar os dois custa uma flag; escolher um custa a depuração do dia ruim.

---

## 6.3 🤝 A CAMADA DE SUGESTÃO (dinâmica travada 11/09)

> *"quando eu te pedisse sugestão de como você resolveria os gargalos… quero que você de fato valide e dê opiniões de como resolveria. Se no seu cruzamento de dados vir a necessidade de resolver criando uma tela, coloque a sugestão no card; se achar pertinente adicionar mais uma ramificação, crie essa ramificação. Mas TODAS em cinza claro, com um X e um check pra eu clicar."*

Quando o Pedro pede sugestão, a resposta **não é um parágrafo no chat**: é objeto no board, e ele decide clicando.

### Como funciona

| | |
|---|---|
| **Onde a sugestão mora** | `processos-propostas.mjs` — arquivo SEPARADO do `processos-data.mjs` |
| **Uma proposta é um PATCH** | pode trazer `passos` novos, `mudancas` em passos existentes, `remove`, `arestas`, `substitui` e `rotula` — tudo junto, porque uma ideia costuma ser as quatro coisas (§6.4) |
| **Como aparece** | cinza claro, borda tracejada, faixa "sugestão", ✕ e ✓ discretos no cartão |
| **Onde ele lê o porquê** | painel lateral, com ✕/✓ em tamanho de leitura |
| **Onde a decisão fica** | `decisoes-propostas.json`, escrito pela rota dev-only `/api/propostas` |
| **✓ aceita** | perde o cinza na hora e passa a valer. **Eu** escrevo no `processos-data.mjs` no fecho, com linha no ADR |
| **✕ descarta** | some do board na hora. Continua nos arquivos: some da vista, não da história |

🔴 **Por que arquivo separado.** Proposta minha não é decisão da casa. Junto no mesmo arquivo, descartar deixaria cicatriz no diff, o placar 🟢🟡🔴 passaria a contar opinião minha como estado do produto (a mentira que o §3 existe pra evitar), e o arquivo reservado à edição humana viraria pasto de texto gerado.

🔴 **Por que a decisão é lida em tempo de execução**, e não embutida no JSON gerado: se viesse do arquivo gerado, cada clique exigiria rodar o gerador pra aparecer — e aí o ✓ não seria um clique, seria uma tarefa.

🔴 **Aceitar não promove sozinho.** O código não escreve no `processos-data.mjs`. Decisão travada passa por registro (ADR), e foi assim que o Pedro escolheu quando montamos a dinâmica.

### A parte que não é técnica

> *"não quero que você sofra caso eu descarte uma opção que quebraria seu raciocínio. Se eu fizer isso é porque vou trabalhar melhor em cima da sua sugestão. Eu irei justificar minhas decisões."*

🔑 **Descarte é dado, não contrariedade.** A regra pra mim:

1. **Não defender a versão morta.** Descartou, morreu.
2. **Dizer o que ficou solto, em uma linha e factual** — "com o S3 fora, o S5 passa a não ter de onde vir" — usando o campo `depende`. É informação, não argumento.
3. **Propor de novo em cima da razão dele**, não da minha ideia anterior.
4. A justificativa vem **no chat** (escolha dele em 11/09): o ✕ só descarta, sem campo de texto.

---

## 6.4 🔴 NÃO MATAR UM CAMINHO CONSERTANDO OUTRO (travado 11/09)

> *"parece que você não está sabendo lidar com múltiplos caminhos, e nesse trabalho isso será o mais comum de todos. Preciso que a gente não mate um caminho corrigindo outro. Anote e trave isso, para não errarmos mais — em uma dessas a gente mata um caminho inteiro de forma errada."*

O placar que gerou a regra: **o P4.6 foi reescrito três vezes em um dia, e as três correções foram do Pedro.** Sempre o mesmo erro meu — eu olhava o nó pelo ramo em que estava trabalhando e esquecia que ele servia o outro. Na terceira eu propus **remover** um nó que estava vivo pro ramo da fatura.

🔑 **A raiz não é desatenção, é enquadramento.** Eu tratava o nó como *espaço a preencher* dentro do caminho que estava na minha cabeça, em vez de perguntar **quantos caminhos passam por ele**. Num processo com bifurcação, todo nó depois da primeira decisão é potencialmente compartilhado.

⚠️ **Regra escrita não resolve isto sozinha.** A §5 ("sintoma repetido = bug de raiz") já existia e eu errei três vezes no mesmo nó, no mesmo dia. O que resolve é a máquina conferir.

### A trava humana: o pré-voo ganha uma pergunta

Antes de mexer em qualquer nó ou aresta, responder **por escrito**:

1. **Quantos ramos passam por aqui?** Listar cada um pelo rótulo da aresta que o traz.
2. **O que este nó faz para CADA ramo?** Se a resposta for diferente por ramo, ele é compartilhado e não pode ser julgado por um só.
3. **Se eu tirar/mudar isto, o outro ramo continua chegando ao fim?**

🔑 **"A pergunta morreu" ≠ "o trabalho morreu".** No P4.6, a pergunta (*"existe fatura aberta?"*) morreu quando o ciclo virou determinístico. O trabalho (*achar a fatura do próximo ciclo, e abrir se não existir*) continuou vivo. Nó que perde a pergunta vira **passo**; só some quando perde também o trabalho.

### A trava mecânica: o simulador de caminhos

`gerar-processos.mjs` monta o grafo em três cenários e compara com o estado atual, reportando **só o que piorou**:

| Cenário | Pega o quê |
|---|---|
| **base** | o processo como está hoje — é a régua, não um cenário |
| **todas as propostas aceitas** | incoerência entre propostas que convivem |
| **cada proposta sozinha, com as dependências que ela declara** | 🔑 o caso real: o Pedro aceita uma e descarta outra |

Ele reporta `virou inalcançável`, `ficou sem entrada` e `ficou sem saída`. Comparar com a **base** e não com o ideal é o que mantém o aviso preciso: o P4.9 já não tem saída hoje, e ninguém precisa ouvir isso a cada rodada.

**Na estreia ele achou 45 avisos**, todos reais.

### As duas regras que o simulador impôs

🔴 **1. A unidade de decisão é uma mudança que deixa o grafo VÁLIDO.** Não se fatia uma mudança em pedaços que, aceitos sozinhos, matam um caminho. O ramo do pagamento no ato eram três propostas (S10, S11, S12); aceitar a primeira sem a segunda deixava um beco — paga e nada acontece. Viraram **uma proposta com três passos**. Pelo mesmo motivo, **a religação anda no mesmo pacote da mudança que a exige**: quando as arestas de reposição moravam em propostas separadas, aceitar o S3 sozinho deixava 7 nós órfãos.

🔴 **2. Renomear aresta é primitivo próprio (`rotula`), não apagar-e-recriar.** Escrever troca de rótulo como `substitui` + `arestas` com as mesmas pontas é ambíguo por construção, e quebrou nos dois lados no mesmo dia: o board desenhou **duas linhas pontilhadas idênticas** entre P4.5 e P4.6 (print do Pedro), e o simulador apagou as duas, porque casa por `(de, para)` e não distingue a velha da nova. Hoje o gerador **recusa** proposta que cria aresta já existente e manda usar `rotula`.

---

## 7. ⚠️ Onde este método NÃO chega

- **Não desenha tela.** Ele diz o que precisa acontecer, não como fica bonito.
- **Não valida número.** Preço, prazo e alíquota continuam vindo das fontes de sempre.
- **Não substitui o E2E.** O processo diz o que deveria acontecer; o E2E prova que acontece. O board tem o botão, e **só o Pedro aperta** — a regra de 30/08 continua valendo: *E2E só quando o Pedro pedir, e um "pode rodar" vale só pra aquela rodada.*

## Links
- [[_doutrina-capacidades]] — a fase 3, adiada de propósito
- [[HOME-produto]] — o painel de 51 funcionalidades
- [[decisoes-marca]] — o ADR, 1ª precedência
