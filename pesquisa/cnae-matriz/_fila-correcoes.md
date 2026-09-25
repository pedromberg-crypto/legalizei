---
tipo: operacao
status: vivo
data: 2026-09-24
assunto: fila-correcoes-tabela-cnae
deriva_de: [cnae-liso-servico, lc123-art18-anexos-taxativo]
deriva_de_codigo: [pesquisa/cnae-matriz/cnae-matriz-v2.csv, pesquisa/cnae-matriz/reclassificar-anexo.mjs]
tags: [cnae, fila, correcao, simples-nacional, tabela]
---

# 🧾 Fila de correção da tabela de CNAE

> O que ainda falta arrumar na tabela completa, com o porquê e o critério de pronto de cada item. **Nasceu em 24/09**, quando o Pedro perguntou se a gente estava salvando o que precisa corrigir — e a resposta honesta era *não*: estava espalhado entre o `HOME §Agora`, o ADR e uma resposta de chat, que some quando a janela fecha.

## 🗺️ Onde cada coisa vive, para não se perder de novo

| Arquivo | Papel | Regra |
|---|---|---|
| `cnae-matriz.csv` · `cnae-friendly.csv` | 🔒 **as originais** | **intocadas.** md5 conferido a cada rodada |
| `cnae-matriz-v2.csv` | ✍️ **onde se edita** | 1.332 linhas × **44 colunas** (eram 40; entraram `motivo_nao_atende`, `_fala`, `familia` e `familia_rotulo`). É a fonte de trabalho |
| `cnae-amostra.csv` | 👁️ **onde se olha** | 🤖 **gerada** por `gerar-amostra.mjs`. Editar aqui é trabalho perdido: a próxima rodada reescreve do zero |
| `cnae-atendemos-certeza.csv` | 📤 **o export que o motor lê** | ainda **não regerado** — ver item 1 |
| `marca/decisoes-marca.md` | ⚖️ decisão travada | o *porquê*, datado |
| **este arquivo** | 📋 **o que falta** | o *ainda não*, com critério de pronto |

---

## 🔴 Trava — impede o produto de responder

### 1. O export não foi regerado, e o motor ainda recusa 7 CNAEs
As correções de 24/09 entraram na `cnae-matriz-v2.csv`, mas o `cnae-atendemos-certeza.csv` — que é o que o `apurador.anexoDoCnae()` consome — **é anterior a elas**. Na prática o motor segue em **80/87**, e os contadores `65/15/7` de `produto/me/viver/motor/regra/_tabelas.mjs` seguem valendo.

> **Pronto quando:** o export tiver os 87 com `anexo_fator_r_grupo` preenchido e zero `requer-revisao`, o `_tabelas.mjs` marcar **`71/16/0`** (era `65/15/7`; em 24/09 o `9329-8/04` e o `7312-2/00` saíram do Fator R, e os 2 de P&D entraram), e o apurador calcular DAS para `7410-2/99`.
> ⚠️ Regerar o export **toca a original** — só com o seu ok, e é a última etapa, depois que a tabela estiver definida.

### 2. ~~`motivo_nao_atende`~~ — ✅ **FEITO em 24/09.** Duas colunas novas: `motivo_nao_atende` (vocabulário fechado) e `motivo_nao_atende_fala` (a frase que o Léo diz).

Derivado pelo `derivar-motivo.mjs`, seguindo a **ordem do funil** — o motivo certo é o *primeiro* filtro que barrou, não qualquer um que bata. Comércio que também exigiria alvará tem **um** motivo: comércio.

```
comercio-ou-industria      700     anexo-iv                52
paga-icms                   21     vedado-simples          91
ambiguo-simples             14     exige-alvara-previo    337
exige-conselho              25     exige-registro-setorial  5
atendemos                   87     sem-motivo-derivavel     0  ✅
```

🔑 **A trava achou um degrau que eu não tinha:** `3831-9/99` e `3832-7/00` passavam em todos os filtros e mesmo assim não eram atendidos. Motivo real (18/09): **pagam ICMS**, e o escopo de 12/09 põe ICMS fora. Sem a trava eu teria gravado 2 linhas com motivo vazio — o defeito que a coluna existe pra matar.

⚠️ O texto é o que o Léo **fala**: sem sigla, sem "CGSIM", sem "Anexo VI". Quem precisa da norma é a coluna de fonte, não o cliente.

Nasceu porque o Léo respondia *"não atendemos"* e **não sabia por quê** — e quando não sabe, improvisa. É o mesmo mecanismo que fez ele mandar cliente de folha de pagamento procurar outro contador.

### 3. ISS de BH: 524 alíquotas existem no CSV e valem `null` no banco
`Number("5%")` = `NaN` → `null` no `carregar-cnae.ts`. A coluna está na lista do loader, então o defeito é **silencioso**: parece importada. É resposta que ninguém mais dá em BH.

> **Pronto quando:** o parser aceitar `"5%"` e o banco tiver 524 alíquotas — **ou** as 3 colunas de ISS saírem por decisão registrada. Deixar como está é a única opção ruim.
>
> 🕓 **Vigência: NÃO confirmada (24/09).** O Prompt A devolveu `VEREDITO: não localizei fonte específica` com `CONFIANÇA: fonte direta` — contradição no próprio formato. **Ausência de publicação não é fonte.** Segue em aberto se a Lei 8.725/2003 ou a tabela CTISS mudaram depois de 27/08.

---

## 🟡 Decisão — precisa do Pedro, e é barato

### 4. Três CNAEs do §5º-F que a cascata queria mover — **2 aplicados, 1 no contador**

| CNAE | Estado |
|---|---|
| `7210-0/00` P&D em ciências físicas e naturais | ✅ **APLICADO 24/09** → Fator R, **§5º-I VI**. O inciso nomeia *"pesquisa"* entre os serviços técnicos |
| `7220-7/00` P&D em ciências sociais e humanas | ✅ **APLICADO 24/09** → Fator R, **§5º-I XII**. O VI puxa exatas, o XII cobre *"científica"* |
| `6391-7/00` agências de notícias | 🔴 **ABERTO.** *"O acervo da Receita é mudo sobre o 6391-7/00 no Simples"* — o próprio Prompt A chamou de *"zona de altíssimo risco silenciada"*. **Vai pro contador** |

⚠️ **Os dois de P&D têm lastro MENOR que o do grupo 73.1.** Lá existe SC COSIT com ementa; aqui é **leitura da lei + confirmação do Prompt A, sem Solução de Consulta**. O anexo é o mesmo pelos dois caminhos (VI ou XII), o que reduz o risco — mas se o contador discordar, é aqui que se mexe primeiro.

🔑 Efeito: o `piloto-pro-labore` **passa a pilotar mais 2** CNAEs.

### 4b. 🔴 E dois que eu não tinha visto — os mais caros da fila
Achados em 24/09 ao montar o [[prompt-a-incisos-lc123-cnaes-em-disputa]]. **Estão dentro dos 87**, hoje **III fixo por §5º-F**, e a subclasse do IBGE usa a palavra *publicidade* na própria definição — que o **§5º-I X** nomeia:

| CNAE | O que a subclasse diz |
|---|---|
| `7319-0/02` promoção de vendas | *"a promoção de vendas e **a publicidade** no local da venda"* |
| `7319-0/03` marketing direto | *"**a publicidade** por mala direta, por telefone, em visitas de representantes"* |

🔑 Na mesma classe `7319-0`, `7319-0/04` (consultoria em publicidade) e `7319-0/99` (outras de publicidade) **já estão em Fator R**. A classe está partida, e a linha que separa é *"serviço de publicidade"* × *"execução operacional"*.

✅ **RESPONDIDO em 24/09, e o risco não se realizou.** O Prompt A devolveu **III fixo, §5º-F** para os dois, com **SC COSIT nº 13/2022** — que é exatamente o que já está na tabela. **Nada a mudar.** E deu nome ao critério que faltava: *publicidade do §5º-I X exige **esforço intelectual/criativo** (estratégia, criação, plano de mídia); promoção é **execução** (entregar panfleto, ligar pro mailing)*. ⚖️ **E o critério TEM fonte** — o Prompt A dizia *"não localizei fonte específica"*, mas ela está **dentro da própria SC 13/2022** (item 7): **SC COSIT nº 99, de 27/01/2017** — *"não se considera que exerce a atividade de publicidade a empresa que **se limita a publicar material de divulgação já elaborado** e apenas repassado para exposição ao público"*. 🔑 Só apareceu porque o documento foi aberto: a resposta que faltava estava dentro da resposta que veio.

### 4c. ~~`7319-0/99`~~ — ✅ **FECHADO em 24/09 no PDF oficial. E não era só ele: `7312-2/00` também estava errado, e está nos 87.**

O PDF da SC COSIT 13/2022 (`pesquisa/fontes/2026-09-24-sc-cosit-13-2022-OFICIAL.md`, 4 páginas, 7.514 caracteres, 100%) parte o grupo 73.1 por **história, não por semântica**:

| CNAE | | Antes | Agora |
|---|---|---|---|
| `7311-4/00` agências de publicidade | vedado até 2014 | Fator R §5º-I X | ✅ já estava certo |
| `7319-0/01` estandes | vedado até 2014 | Fator R §5º-D IX | Fator R **§5º-I X** |
| `7319-0/04` consultoria em publicidade | vedado até 2014 | Fator R §5º-I IX | Fator R **§5º-I X** |
| ⭐ **`7312-2/00`** agenciamento de espaços | **nunca vedado** | **Fator R** | 🔴 **III fixo §5º-F** |
| ⭐ `7319-0/02` promoção de vendas | nunca vedado | III fixo | ✅ + fonte da ementa |
| ⭐ `7319-0/03` marketing direto | nunca vedado | III fixo | ✅ + fonte da ementa |
| `7319-0/99` outras de publicidade | **nunca vedado** | **Fator R** | 🔴 **III fixo §5º-F** |

🔴 **O custo do `7312-2/00`:** estava nos 87 como Fator R. O `piloto-pro-labore` forçava pró-labore pra bater 28% num CNAE que **não muda de anexo** — INSS e folha a mais, sem ganho nenhum.

⚖️ **Declarado:** a ementa e a conclusão nomeiam **só** `/02` e `/03`. O `7312-2/00` e o `/99` vêm do **item 10**, alcançados pela conclusão do item 11 (*"as atividades citadas no item 10"*) — **fundamentação, não ementa**. Se o contador discordar, são essas duas que voltam.

### ~~4d~~ — ✅ **FECHADO.** A viga mestra foi conferida no PDF oficial da RFB, e sustentou: a transcrição do Gemini bateu **palavra por palavra**, inclusive nos 2 pontos que eu tinha marcado como suspeitos — que são do **original**, não da transcrição.

### 4f. 🆕 🔴 A varredura dos 50 achou **3 que mudam de anexo** — e um é incoerência que nós criamos hoje

Li a `subclasse_observacoes` dos 50 que estavam em `§5º-F residual` dentro dos 87. Três a lei **nomeia**, e nenhum deles é III fixo:

| CNAE | O que a lei nomeia | Vira |
|---|---|---|
| ⭐ **`7320-3/00`** pesquisas de mercado e de opinião pública | §5º-I VI nomeia **"pesquisa"**; e a subclasse é *"estudos sobre potencial de mercado… análises estatísticas"* | **Fator R** |
| ⭐ **`8591-1/00`** ensino de esportes | §5º-D **III** nomeia *"academias de atividades físicas, desportivas, natação, **escolas de esportes**"*; a subclasse é *"ensino de esportes em **escolas esportivas**… futebol, natação, artes marciais"* | **Fator R** |
| ⭐ **`8592-9/01`** ensino de dança | §5º-D **II** nomeia *"**academias de dança**, capoeira, ioga, artes marciais"*; a subclasse inclui *"as atividades das **academias** e cursos de danças folclóricas e populares"* | **Fator R** |

🔴 **O `7320-3/00` é incoerência nossa, de hoje.** Aplicamos *"pesquisa" → Fator R* em `7210-0/00` e `7220-7/00` (P&D) **na mesma sessão**, e deixamos pesquisa de mercado em III fixo. Ou os três são Fator R, ou os três não são.

⚠️ **Tensão real nos dois de ensino:** o §5º-B I põe *"escolas livres"* em III fixo **"exceto as do §5º-D II-III (= academias)"*. A subclasse do IBGE cobre os dois casos — professor independente de dança e academia de dança estão no mesmo código. A lei separa por **forma de organização**, o CNAE não.

> **Pronto quando:** os 3 tiverem anexo gravado e linha no ADR. **Não apliquei** — mudam de III para Fator R dentro dos 87 e ligam o `piloto-pro-labore` neles.

### 4g. 🆕 🟡 E **3 conflitos** que a varredura expôs

| CNAE | O conflito |
|---|---|
| ⭐ **`6209-1/00`** suporte técnico, **manutenção** e outros serviços em TI | 🔑 o título tem os dois lados: §5º-I VI nomeia *"**suporte** e análises técnicas e **tecnológicas**"* (Fator R) e §5º-B IX nomeia *"reparos e **manutenção em geral**"* (III fixo). A subclasse é *help-desk* e *"assessoramento ao usuário"* — puxa pro VI |
| ⭐ **`9002-7/01`** artistas plásticos, **jornalistas** independentes e escritores | colisão **tripla**: §5º-B XV (artístico → III) × §5º-I X (jornalismo → Fator R) × §5º-I XII (intelectual artística → Fator R). Um código, três profissões, dois regimes |
| ⭐ **`6391-7/00`** agências de notícias | já estava na fila: *"o acervo da Receita é mudo"*. **Contador** |

> **Pronto quando:** cada um tiver inciso escolhido com razão no ADR.

### 4h. 🆕 🟡 Cinco confirmados em III, **com ressalva anotada**
`5811-5/00`, `5812-3/01`, `5812-3/02`, `5813-1/00`, `5819-1/00` (**edição** de livros, jornais, revistas, cadastros) — nenhum inciso nomeia "edição", e três deles dizem na subclasse que *"a receita inclui também a **venda de espaços para publicidade**"*. Não os torna publicidade (a atividade é editorial), mas é o tipo de linha que um fiscal olha duas vezes. Também `8230-0/01` (organização de feiras × §5º-I IX *"organização"*), `9002-7/02` (restauração de obras de arte), `9319-1/01` (produção de eventos esportivos × §5º-I XII *"desportiva"*) e `7420-0/01` (fotografia comercial × §5º-B XV).

### 4e. 🆕 🔴 Cessão de mão de obra veda o Simples, e a tabela não tem onde guardar isso
Item 12 da SC COSIT 13/2022: *"a análise acima foi da permissão das atividades citadas considerando sua **natureza, não o modo de exercício**. Como elas são tributadas pelo Anexo III, caso sejam prestadas **mediante cessão de mão de obra, são vedadas**"*.

🔑 A nossa tabela classifica **atividade**. Isto é **modo de exercício** — não existe coluna pra ele, e **vale para qualquer CNAE de serviço**, não só os de publicidade. Provavelmente não é coluna de CNAE: é pergunta de onboarding.

⚠️ A SC cita `art. 17, XI`, mas o inciso de cessão/locação de mão de obra é o **XII** — e o próprio item 8 diz que o XI foi revogado pela LC 147/2014. **Contradição interna do documento da RFB.** Conferir antes de virar regra.

> **Pronto quando:** existir decisão sobre onde essa pergunta mora (tabela, onboarding ou contrato), com o inciso conferido.

> **Pronto quando (o bloco 4 inteiro):** cada CNAE com anexo gravado e linha no ADR — inclusive se a decisão for *fica como está*.

### 5. ~~`8020002`~~ — ✅ **FECHADO em 24/09.** III fixo, §5º-B IX, aplicado e confirmado pelo Prompt A. Era o último `requer-revisao` da tabela: agora são **zero**.
`OUTRAS ATIVIDADES DE SERVIÇOS DE SEGURANÇA`: a cascata dizia **IV** (§5º-C VI, *vigilância*) casando no título, e o irmão `8020001` dizia **III**. A subclasse do IBGE desempata: ela compreende *"a **instalação, reparação, reconstrução e ajuste mecânico de cofres, trancas e travas de segurança**"* — é **serralheria/chaveiro, não guarda patrimonial**. O §5º-B IX nomeia *"instalação, reparos e manutenção em geral"*.

🔑 **Lição de método:** casar só na `descricao` evita o ruído do `atividades`, mas o **título mente** em CNAE guarda-chuva. A subclasse não serve pra regex — serve pra **ler**.

> Veredito: **III fixo, §5º-B IX**. É o último `requer-revisao` da tabela inteira. Está no bloco B do [[prompt-a-incisos-lc123-cnaes-em-disputa]] para 2ª opinião.
> **Pronto quando:** gravado + linha no ADR.

### 6. ~~`9329-8/04`~~ — ✅ **FECHADO em 24/09.** III fixo, §5º-F, aplicado. ⚠️ Estava nos 87 como Fator R: o `piloto-pro-labore` deixa de pilotar esse CNAE.
`EXPLORAÇÃO DE JOGOS ELETRÔNICOS RECREATIVOS` está como Fator R pelo §5º-D IV, que trata de *"elaboração de programas de computador, inclusive jogos eletrônicos"*. A subclasse diz *"a **exploração de estabelecimentos** de jogos eletrônicos recreativos"* — **operar fliperama, não desenvolver software**. Todos os irmãos da classe (sinuca, boliche, discoteca, recreação n.e.) são III.

> Veredito: **III fixo, §5º-F**. ⚠️ Está **dentro dos 87**: muda de Fator R para III fixo, então o `piloto-pro-labore` para de pilotar esse CNAE.
> **Pronto quando:** gravado + linha no ADR.

---

## 🟠 Estrutura — a tabela nova, acordada em 24/09

### 6b. 🔴 A busca do Léo ignora os 542 caracteres onde estão as palavras reais — **e devolve CNAE nosso pra quem não atendemos**

Aberto em 24/09 ao responder o que se pode editar; **agravado no mesmo dia** ao medir os 1.245.

A `fatos.consultar_cnae` compara contra **um campo de 36 caracteres em média** (`titulo_amigavel`, com o oficial de reserva) e ignora o `atividades`, que tem **542 de média** e é a lista do IBGE com o vocabulário real.

🔴 **O agravante:** os 1.245 que não atendemos **não têm título amigável** — por desenho. A busca cai no título oficial, que é linguagem de IBGE e não fala como ninguém. Medido:

```
"sou advogado"          →  🔴 nada           (e SERVIÇOS ADVOCATÍCIOS existe)
"sou engenheiro"        →  🔴 nada
"sou dentista"          →  Agenciamento de atletas e artistas
"tenho um restaurante"  →  Restauração de obras de arte   ⭐ NOSSO
"vendo roupa"           →  Aluguel de roupas, joias       ⭐ NOSSO
"faço obra"             →  Restauração de obras de arte   ⭐ NOSSO
```

🔑 **3 de 6 devolveram um CNAE que a gente ATENDE para quem a gente NÃO atende.** O `motivo_nao_atende` construído hoje **nunca é acionado**: o CNAE certo não aparece, o Léo lê `atende_me = sim` no topo e diz que atende. No pior caso a empresa abre com o CNAE errado.

⚠️ **E a solução óbvia tem furo, medido antes de propor.** Pôr o `atividades` na busca traz **referência cruzada para outros CNAEs**: `"dentista"` acha 4 CNAEs e o 1º é `FABRICAÇÃO DE PRODUTOS QUÍMICOS`; `"restaurante"` acha 9 e o 1º é `FABRICAÇÃO DE ARTIGOS DE VIDRO`. É o mesmo erro do regex de lei contra o `atividades` nesta manhã — 101 mudanças, quase todas lixo.

🔴 **E um terceiro buraco que campo nenhum resolve:** a palavra **`psicólogo` não existe em lugar nenhum da tabela**. Nem título oficial, nem amigável, nem nos 542 caracteres. Profissão inteira invisível **por ausência de dado**, não por peso de busca — e isso é trabalho daqui, não do VPS.

> **Pronto quando:** os 6 critérios de [[_aceite-busca-de-cnae]] passarem, medidos no VPS contra o banco. 🪟 A mudança é **jurisdição do VPS**; o critério sai daqui e não vira desenho.

### 7. Campo vazio tem que ser alguma coisa
Hoje "vazio" significa **quatro coisas diferentes** e não dá para distinguir olhando: *não se aplica* (dependente cujo pai disse não) · *não verificado* · *existe na fonte e nunca foi importado* · *coluna morta*. Foi assim que `registro_setorial` pareceu resolvido em **942 linhas onde ninguém olhou**.

Desenho fechado: `NOT NULL` + vocabulário de ausência (`nao-se-aplica` · `nao-verificado` · `sem-previsao-na-fonte`), dependente **gerado** por `CHECK`, contador de `nao-verificado` que só pode cair, e proibição de `nao-verificado` dentro dos 87.

> **Pronto quando:** o schema recusar nulo em toda coluna e o contador existir.

### 8. Das 44 colunas para 18
Curadoria fechada em 24/09: 18 sobem para o Léo, o resto vira **curadoria** (fica no repo, não sobe). Inclui renomear (`descricao` → `titulo_oficial`, `subclasse_observacoes` → `descricao_oficial`, `atividades` → `termos_de_busca`), colapsar as 4 colunas de Fator R em 3, e transformar `fator_r` e `mei_permitido` em **colunas geradas**.

> ⚠️ **Não anda no mesmo commit que correção de dado.** Em 24/09 escrevi `III`/`III-ou-V` (vocabulário novo) numa coluna que o apurador lê como `III-fixo` — 4 valores para 2 conceitos, motor teria parado. Revertido por md5.
> **Pronto quando:** a tabela nova existir com as 18, e o `apurador` ler o vocabulário novo na mesma leva.

### 9. ~~`familia`~~ — ✅ **FEITO em 24/09. E não era "nossa": são as 14 do dropdown do app.**

Eu tinha desenhado 14 famílias do zero **antes de ver a tela**. O Pedro apontou o `PILLS` do `gate-telas.tsx`: **3 com nome idêntico**, as outras 11 com o mesmo recorte e outro rótulo. Adotadas as do app, com o **mesmo `id`** — e o `gravar-familia.mjs` **lê o `.tsx`** e derruba a rodada se id, rótulo ou exemplo divergirem.

```
 8 Tecnologia e software      3 Design                   7 Foto, vídeo e áudio
 7 Marketing e publicidade    6 Edição e mídia           5 Consultoria/pesquisa/tradução
 9 Ensino e cursos            8 Arte, cultura e patrimônio   5 Eventos e entretenimento
 7 Apoio administrativo       8 Aluguel de equipamentos  10 Reparos e manutenção
 1 Salão e beleza             2 Hospedagem                1 órfão declarado
```

🔑 **O ganho não é o que eu tinha vendido.** Só 6 de 14 respondem anexo E MEI sem abrir a linha. O ganho real é a **busca**: a tela pergunta a categoria *antes* de achar o código, e isso leva o espaço de busca de **1.332 para ~6 linhas** — o buraco que faz "dentista" devolver `SISAL` hoje no Léo.

❓ **As 2 categorias que carregam a fronteira 6% × 15,5%** (`tech` e `mkt`) ganharam **pergunta de desambiguação declarada** no campo `desambiguar`. A do marketing tem fonte: **SC COSIT 13/2022 + 99/2017**.

🟡 **`Salão e beleza` com 1 CNAE é sinal de escopo, não de rótulo:** o irmão `9602-5/02` (estética, depilação, limpeza de pele) está fora por `exige-alvara-previo`. Só deu pra ver porque o `motivo_nao_atende` nasceu no mesmo dia.

### 10. `mei_iss_fixo_das` e `mei_icms_fixo_das` nunca foram importados
351 linhas no CSV, zero no banco. É quanto o MEI paga por mês — a pergunta nº 1 de quem quer ser MEI.

> ✅ **O valor de 2026 fechou (24/09):** **R$86,05/mês** para serviço — 5% de **R$1.621,00** (salário mínimo, Decreto 12.797/2025) = R$81,05, mais **R$5,00** de ISS. 🔑 O R$1.621 **bate com a persona zero**, medida na conta real em 12/09: duas origens independentes. ⚠️ Muda todo ano: quem recalcula é o mesmo código do piso de pró-labore.
>
> **Pronto quando:** as duas colunas estiverem no loader, ou saírem por decisão registrada.

---

## ⚪ Adiável — não muda resposta a cliente hoje

### 11. Os 395 `§5º-F` que não atendemos
Dos 449 residuais, **54 estão dentro dos 87** (51 confirmados em III, 3 no item 4). Os outros **395 são de CNAE que não atendemos** — revisar o anexo deles não responde nada enquanto o veredito for "não".

### 12. `registro_setorial`: 942 em `nao-verificado` — ⚫ **e isso não vale nada, medido em 24/09**
O eixo só foi cruzado para os 387 do footprint do líder, e 942 linhas ficaram sem checar. Parecia a maior lacuna da tabela. **Não é.**

Exigindo que a linha passe em **todos os outros filtros** e só trave neste, sobram **69** — e os 69 são:

```
36  C · INDÚSTRIAS DE TRANSFORMAÇÃO
31  G · COMÉRCIO
 2  E · ÁGUA, ESGOTO E RESÍDUOS
 0  serviço
```

🔑 **Zero serviço.** Os CNAEs de serviço que importam já foram verificados (os 87 estão 100% `nao`); o resto está fora por comércio/indústria, que é decisão de escopo, não lacuna. **Verificar os 942 compraria nenhum CNAE novo** enquanto o escopo for serviço.

> **Pronto quando:** nada. Fica declarado como lacuna conhecida e sem prêmio. Só reabre se o escopo passar a incluir comércio ou indústria — e aí o item volta valendo 69.

### 13. As 15 classes onde os irmãos divergem
Medido em 24/09: 106 concordam × 15 divergem (12%), e as 15 parecem ser **a lei dividindo mesmo** (`6911-7/01` advocacia é IV, `6911-7/02` auxiliares da justiça é III, porque o §5º-C VII nomeia só advocacia). Vale uma passada de olho, sem pressa.

---

## 🔒 Fora daqui — não se resolve com tabela nem com pesquisa

Os dois documentos de BH, que o doc de 18/09 já enfileirou pro contador:

| Documento | O que classifica | Situação |
|---|---|---|
| Decreto Municipal 17.245/2019, Anexo I | atividades dispensadas de Alvará | **111 de 276 itens**, por cópia de terceiro (LegisWeb, não o DOM) |
| Portaria SMSA/SUS-BH 0221/2022, Anexos I-VII | risco sanitário em BH | **não obtido** — PDF sem OCR |

🔑 **A norma que usamos (`risco_baixo_cgsim`, Res. CGSIM 51/2019) é a federal subsidiária** — vale *na ausência* de lei municipal, e BH tem a sua. Não está provado que erramos; está provado que **não sabemos**. **62 dos 80 são inconclusivos**, e é obtenção de fonte, não pesquisa.

---

## Links
[[cnae-liso-servico]] · [[lc123-art18-anexos-taxativo]] · [[fundamentos-cnae]] · [[2026-09-18-validacoes-cnae-para-contador]] · [[decisoes-marca]] (24/09, 5 linhas) · [[fila-validacao-humana]]
