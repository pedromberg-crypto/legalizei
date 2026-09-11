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
| `fala` | **Com quem fala?** | API, órgão, gateway — ou `—` quando é só banco nosso |
| `ve` | **O que a pessoa vê?** | `—` quando é invisível. **Invisível é resposta válida e precisa ser declarada** |
| `luz` | 🚦 | `verde` · `amarelo` · `vermelho` |

🔴 **REGRA DURA — vocabulário.** O Pedro disse, com todas as letras, que não domina o vocabulário profundo de programação. Então:

- **`faz` e `ve` são escritos pra ele.** Português comum. "Guarda o pedido e trava o preço do dia", não "persiste a entidade com snapshot do pricing".
- **`fala` é escrito pro dev.** Ali pode ter nome de endpoint, método e campo. É a única coluna técnica, e é técnica de propósito.
- Se um passo só pode ser explicado com jargão, **ele está grande demais**: quebra em dois.

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

## 7. ⚠️ Onde este método NÃO chega

- **Não desenha tela.** Ele diz o que precisa acontecer, não como fica bonito.
- **Não valida número.** Preço, prazo e alíquota continuam vindo das fontes de sempre.
- **Não substitui o E2E.** O processo diz o que deveria acontecer; o E2E prova que acontece. O board tem o botão, e **só o Pedro aperta** — a regra de 30/08 continua valendo: *E2E só quando o Pedro pedir, e um "pode rodar" vale só pra aquela rodada.*

## Links
- [[_doutrina-capacidades]] — a fase 3, adiada de propósito
- [[HOME-produto]] — o painel de 51 funcionalidades
- [[decisoes-marca]] — o ADR, 1ª precedência
