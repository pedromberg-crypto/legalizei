---
tipo: contrato
status: vivo
data: 2026-09-24
assunto: entrega-tabela-cnae-leo
autoridade: contrato
deriva_de: [cnae-liso-servico, lc123-art18-anexos-taxativo]
deriva_de_codigo: [pesquisa/cnae-matriz/cnae-matriz-v2.csv, pesquisa/cnae-matriz/cnae-friendly-v2.csv]
tags: [cnae, leo, entrega, tabela, simples-nacional, fator-r]
---

# 📦 A tabela de CNAE do Léo — entrega de 24/09/2026

> Esta pasta é o **pacote de auditoria** de um dia inteiro de trabalho sobre a tabela de CNAE. Não é onde as coisas se editam: é onde se **confere** antes de subir.
>
> 🔴 **NADA FOI PARA A VPS.** O banco do Léo continua rodando com a tabela de antes de 24/09. Esta entrega existe para ser auditada primeiro.

## O que tem aqui

| Arquivo | O que é |
|---|---|
| `README.md` | este documento — o que mudou, por quê, e o que falta |
| `cnae-leo.csv` | **os 87 que atendemos**, nas 18 colunas finais |
| `cnae-leo-1332.csv` | **a tabela inteira**, mesmas 18 colunas |
| `_medicao-busca.txt` | 35 frases de cliente testadas contra a busca, com o resultado de cada uma |

🤖 Os três primeiros são **gerados** por `../gerar-tabela-leo.mjs`. Editar aqui é trabalho perdido — a próxima rodada reescreve. Onde se edita está na seção *Onde cada coisa mora*, no fim.

---

# 1 · Por que mexemos

O Léo estava, nas palavras do Pedro, **delirando com Fator R e com atividades erradas**. Os dois problemas tinham causa, e ela não era o modelo.

## O delírio do Fator R vinha de uma categoria que não devia existir

O classificador de 27/08 mandava: *"onde não bater nenhum inciso, marcar `requer-revisao`, não chutar"*. Prudente — e **errado na premissa**.

A LC 123, art. 18, tem **dois residuais que se completam e não deixam buraco**:

| | |
|---|---|
| **§5º-F** | *"demais serviços sem previsão expressa"* → **Anexo III fixo** |
| **§5º-I XII** | *"outras atividades de natureza **intelectual**, técnica, científica, artística ou cultural, desde que não sujeitas ao III ou IV"* → **Fator R** |

🔑 **Não achar inciso nominado é a resposta, não a falta dela.** Sobra uma pergunta só: *a atividade é intelectual?*

O preço de não ter feito essa pergunta: o `apurador.anexoDoCnae()` **recusava calcular o DAS de 7 dos 87 CNAEs**. Entre eles o **design de UI/UX**, que o §5º-I VI nomeia em letra. O Pedro pegou perguntando: *"como a gente consegue ter dúvida sobre um CNAE de design? É o mais padrão e simples de todos."*

## O delírio das atividades vinha de a busca olhar para o campo errado

```sql
WHERE p_busca <% coalesce(c.titulo_amigavel, c.descricao)
```

A busca compara a frase do cliente contra **um campo de 29 caracteres**. E ignora o `atividades`, que tem **542 caracteres por CNAE** e é a lista do IBGE com o vocabulário que a pessoa de fato usa: `BARBEARIA`, `COIFFURE`, `SAPATEIRO`, `CRIAÇÃO DE LOGO, LOGOTIPO`.

**Não é o trigrama que é ruim — é o alvo que é curto demais.**

---

# 2 · O que foi feito

## 2.1 · O `requer-revisao` acabou

```
os 87:  7 indefinidos  →  0
tabela: 62 indefinidos →  0
```

**16 CNAEs corrigidos.** Todo o anexo dos 87 hoje tem prova:

```
47  ⚖️  inciso nomeado da LC 123
35  📖  §5º-F lido na subclasse e confirmado em 24/09
 5  ⚖️  Solução de Consulta COSIT, PDF oficial lido na íntegra
 0  🔴  por eliminação, não revisto        ← eram 50
```

**Distribuição final:** 70 Anexo III fixo · 17 Fator R · 51 permitem MEI.

### Três correções com custo real para o cliente

| CNAE | Era | Virou | O que estava acontecendo |
|---|---|---|---|
| `7312-2/00` agenciamento de espaços | Fator R | **III fixo** | o `piloto-pro-labore` forçava pró-labore para bater 28% num CNAE que **não muda de anexo** — INSS e folha a mais, todo mês, sem ganho |
| `7729-2/01` aluguel de fliperama | Fator R | **III fixo** | o matcher viu *"jogos eletrônicos"* no §5º-D IV e ignorou que a subclasse diz *"o **aluguel de aparelhos**"*. Alugar não é elaborar software |
| `9329-8/04` exploração de fliperama | Fator R | **III fixo** | mesmo padrão |

### E uma fonte que corrigiu duas linhas nossas

A **SC COSIT nº 13/2022** foi baixada do Sistema Normas da RFB, o PDF de 4 páginas extraído e **lido na íntegra (7.514 caracteres, 100%)**. Ela parte o grupo 73.1 (Publicidade) por **história, não por semântica**: quem estava na lista de vedados até 2014 entrou no Simples pelo §5º-I X (Fator R); quem nunca esteve nunca foi alcançado por ele.

> *"se as atividades citadas no item 10 não eram vedadas até 2014… tampouco estão sujeitas ao fator 'r' desde 2018… só podia ser o Anexo III, conforme art. 18, §5º-F"*

## 2.2 · Duas colunas que não existiam

### `motivo_nao_atende` — 1.332 linhas
O Léo respondia *"não atendemos"* e **não sabia por quê**. Quando não sabe, improvisa — é o mesmo mecanismo que o fez mandar cliente de folha de pagamento procurar outro contador.

```
700  comercio-ou-industria       52  anexo-iv
337  exige-alvara-previo         25  exige-conselho
 91  vedado-simples              21  paga-icms
 14  ambiguo-simples              5  exige-registro-setorial
 87  atendemos                    0  sem-motivo-derivavel  ✅
```

Derivado na **ordem do funil** — o motivo certo é o *primeiro* filtro que barrou. Comércio que também exigiria alvará tem **um** motivo: comércio. E o texto é o que o Léo **fala**, sem sigla:

> *"Essa atividade é de comércio ou indústria, e a gente cuida só de prestação de serviço."*

🔑 A trava achou um degrau que não estava na lista: `3831-9/99` e `3832-7/00` passavam em **todos** os filtros e mesmo assim ficavam fora. Motivo real: **pagam ICMS**, e o escopo põe ICMS fora. Sem a trava, duas linhas teriam nascido com motivo vazio — o defeito que a coluna existe para matar.

### `familia` — as 14 do app, não uma lista nova
Eu tinha desenhado 14 famílias do zero. O Pedro apontou que o app **já tem 14** no dropdown (`gate-telas.tsx`, `PILLS`): **3 com nome idêntico**, as outras 11 com o mesmo recorte e outro rótulo.

🔴 **Se eu tivesse seguido a minha, o erro seria meu**: duas listas para a mesma coisa é a origem de toda divergência. Adotadas as do app, com o **mesmo `id`** — e o `gravar-familia.mjs` **lê o `.tsx`** e derruba a rodada se id, rótulo ou exemplo divergirem. Não é documentação pedindo sincronia, é trava.

Cobertura: **86 de 87 + 1 órfão declarado** (`9609-2/02` agência matrimonial vai para *"Não encontrei minha categoria"* em vez de ser enfiada em *"Salão e beleza"*).

## 2.3 · 46 títulos amigáveis reescritos

O `titulo_amigavel` é o **único campo que a busca lê**. Então a palavra que a pessoa digita precisa estar **nele**, não na descrição.

**13 profissões devolviam NADA e agora acham em 1º:**

```
sapateiro · estofador · relojoeiro · cantor · banda · ator · modelo
fantasia · tradutor · branding · estilista · consultoria de imagem · análise de crédito
```

**7 devolviam coisa absurda:**

```
"cuido de redes sociais"  →  Pesquisa em ciências sociais
"help desk"               →  Design de produto
"filmo casamento"         →  Pensão e casa de cômodos      ← "casamento" casava com "casa"
"tiro xerox"              →  Consultoria em TI (0.04)
"edito e-book"            →  Conserto de computador
"conserto notebook"       →  Conserto de JOIAS
"serviço de digitação"    →  Microfilmagem
```

🔴 **E um erro fiscal:** *"sou consultor de marketing"* devolvia `7319-0/03` **Marketing direto**, que é **Anexo III fixo**, quando o certo é `7319-0/04` **Consultoria em publicidade**, que é **Fator R**. Não é UX — é a diferença entre **6% e 15,5%**.

**41 títulos ficaram como estavam, de propósito** — os que já achavam em 1º e onde mexer só diluiria a nota (`Chaveiro` com 1.00, `Fotografia` com 0.47).

### A regra que saiu de uma provocação do Pedro

*"No conserto de relógios e no de joias, não poderíamos colocar por precaução 'conserto **e reparo** de xxx'?"*

Medi antes de responder, e a intuição estava invertida:

```
"reparo de joias"   já achava Conserto de joias em 1º com  0.67
"conserto de joias"                            com         1.00
com "e reparo" no título, o segundo cairia para            0.67   🔴 −33%
```

🔑 O `pg_trgm` casa **trigrama, não palavra** — `repar` e `conserto` já compartilham pedaço com o resto da frase. E o Jaccard divide pela união, então **palavra a mais baixa a nota de todo mundo**.

> **Regra travada:** acrescenta **substantivo ou profissão** que a busca não alcança. **Nunca** sinônimo de verbo.

---

# 3 · O que ainda precisa melhorar

## 🔴 3.1 · A busca continua sendo o gargalo, e agora com um risco novo

Os **1.245 que não atendemos não têm título amigável** — por desenho, a voz amigável foi escrita só para os 87. A busca cai no **título oficial**, que é linguagem de IBGE e não fala como ninguém.

```
"sou advogado"          →  🔴 nada          (e SERVIÇOS ADVOCATÍCIOS existe)
"sou engenheiro"        →  🔴 nada
"sou dentista"          →  Agenciamento de atletas e artistas
"tenho um restaurante"  →  Restauração de obras de arte   ⭐ é NOSSO
"vendo roupa"           →  Aluguel de roupas, joias       ⭐ é NOSSO
"faço obra"             →  Restauração de obras de arte   ⭐ é NOSSO
```

🔴 **3 de 6 devolveram um CNAE que a gente ATENDE para quem a gente NÃO atende.** O `motivo_nao_atende` que acabamos de construir **nunca é acionado**: o CNAE certo não aparece, o Léo lê `atende_me = sim` no topo e diz que atende. No pior caso, abre empresa com o CNAE errado.

> **Errar para o lado de "não atendemos" é barato. Errar para o lado de "atendemos" abre empresa errada.**

⚠️ E a solução óbvia tem furo, **medido antes de propor**: pôr o `atividades` na busca traz **referência cruzada para outros CNAEs**. `"dentista"` acha 4 e o 1º é `FABRICAÇÃO DE PRODUTOS QUÍMICOS`; `"restaurante"` acha 9 e o 1º é `FABRICAÇÃO DE ARTIGOS DE VIDRO`.

**Critério de aceite escrito, com 6 itens:** [[_aceite-busca-de-cnae]]. 🪟 A mudança é jurisdição do VPS; o critério sai do vault e não vira desenho.

## 🔴 3.2 · Profissões que não existem em campo nenhum

```
"sou psicólogo"          →  🔴 NADA      a palavra não existe na tabela inteira
"sou personal trainer"   →  🔴 NADA      existe em 1 CNAE, e é um que não atendemos
```

🔑 **Isto não é falha de busca — é ausência de dado**, e é trabalho do vault, não do VPS. Nenhuma mudança de índice, peso ou embedding acha uma palavra que não foi escrita.

**Sugestão:** uma camada de sinônimos nossa, separada do dado do IBGE — `psicólogo → 8650-0/03`, `personal trainer → 9313-1/00` — com a ressalva de que os dois são CNAEs que **não atendemos**, então a resposta certa é a recusa com motivo.

## 🟡 3.3 · Dois casos que título nenhum resolve

```
"faço sites"           →  Hospedagem (III) e Portal (III); Web design (FATOR R) em 3º
"aluguel de pula pula" →  2º, perdendo por 0.02 para Aluguel de material médico
```

O primeiro é **fiscal**. Os dois são a prova do teto: **um campo de 36 caracteres não cabe o vocabulário de uma profissão**.

## 🕓 3.4 · Seis CNAEs esperando o contador

Todos com a mesma forma: **o CNAE agrega o que a lei separa**. Documento pronto em `../../2026-09-24-cinco-cnaes-para-o-contador.md` (mais o `7410-2/02`, incluído depois).

| CNAE | O conflito |
|---|---|
| `8591-1/00` ensino de esportes | §5º-D III manda **academia** pro Fator R, §5º-B I manda **escola livre** pro III — e a subclasse descreve os dois |
| `8592-9/01` ensino de dança | idem |
| `6209-1/00` suporte técnico em TI | o título carrega §5º-I VI (*"suporte… tecnológicas"*) e §5º-B IX (*"manutenção em geral"*) |
| `9002-7/01` artista, jornalista, escritor | três profissões, três tratamentos legais, um código |
| `6391-7/00` agência de notícias | sem Solução de Consulta no acervo da Receita |
| `7410-2/02` design de interiores | está como Fator R, mas o §5º-C I (**Anexo IV, fora do escopo**) nomeia *"paisagismo e **decoração de interiores**"* — pode não pertencer aos 87 |

## 🟠 3.5 · A refatura da forma não começou

A tabela de trabalho ainda tem **44 colunas com nomes herdados de três pesquisas**. O `cnae-leo.csv` desta pasta é uma **projeção** das 18 finais, gerada sem tocar na fonte.

Falta, e está bloqueado por duas decisões: renomear 6 colunas · transformar `fator_r`, `mei_permitido`, `familia_rotulo` e `motivo_nao_atende_fala` em **colunas geradas** · mover 26 para curadoria · `NOT NULL` com vocabulário de ausência · e migrar os **3 leitores** (`carregar-cnae.ts`, `apurador.mjs`, `cnae-verifica-atende.cjs`) **no mesmo commit**.

🔴 **As duas decisões que travam:** o **ISS de BH** (524 alíquotas viram `null` por `Number("5%") = NaN`; conserta ou remove 3 colunas) e o **DAS-MEI** (351 linhas nunca importadas; o valor de 2026 já fechou em **R$86,05**).

## ⚠️ 3.6 · E o motor ainda não sabe de nada disso

O `cnae-atendemos-certeza.csv`, que é o que o `apurador` consome, **é anterior a tudo isto**. Na prática o motor segue em **80/87**, e os contadores `65/15/7` do `_tabelas.mjs` seguem valendo. Regerar o export **toca a original** — última etapa, depois que a tabela estiver definida.

---

# 4 · A ordem certa para subir

```
1. fechar os 6 CNAEs do contador          ← humano
2. decidir ISS de BH e DAS-MEI            ← Pedro, define quantas colunas a tabela tem
3. camada de sinônimos (psicólogo etc.)   ← vault
4. refatura da forma + migrar os 3 leitores   ← vault, num commit só
5. mudar a busca contra o aceite de 6 itens   ← VPS
6. regerar o export e o motor vira 87/87      ← vault
```

🔴 **Subir na ordem errada quebra calado.** Em 24/09 eu mesmo escrevi `III` numa coluna que o `apurador` lê como `III-fixo` — quatro valores para dois conceitos, e o motor teria parado. Foi revertido por md5 antes de gravar, e virou regra: **correção de dado e refatura de schema não andam no mesmo commit.**

---

# 5 · Onde cada coisa mora

| Papel | Arquivo |
|---|---|
| 🔒 **originais, intocadas** | `../cnae-matriz.csv` · `../cnae-friendly.csv` — md5 conferido a cada rodada |
| ✍️ **onde se edita o dado** | `../cnae-matriz-v2.csv` (44 colunas, via os scripts) |
| ✍️ **onde se edita a voz** | `../cnae-friendly-v2.csv` — título e descrição amigáveis, **editável à mão** |
| ✍️ **onde se edita a família** | `../familias.mjs` — espelho do `PILLS` do app |
| 👁️ **onde se olha** | esta pasta, e `../cnae-amostra.csv` |
| 📋 **o que falta** | `../_fila-correcoes.md` |
| ⚖️ **por que cada coisa é assim** | `../../../marca/decisoes-marca.md`, 24/09 — 20 decisões |

## Os scripts, e o que cada um faz

| Script | Papel |
|---|---|
| `../reclassificar-anexo.mjs` | aplica a cascata da LC 123 e as correções declaradas, com o motivo de cada uma |
| `../derivar-motivo.mjs` | deriva o `motivo_nao_atende` na ordem do funil, e **derruba a rodada** se sobrar órfão |
| `../familias.mjs` | o mapa das 14 famílias, com `ex` e pergunta de desambiguação |
| `../gravar-familia.mjs` | grava a família e **confere contra o `.tsx` do app** |
| `../editar-amigavel.mjs` | aplica os títulos amigáveis, com o motivo medido de cada troca |
| `../gerar-tabela-leo.mjs` | projeta as 18 colunas — gera os CSVs desta pasta |
| `../testar-busca.mjs` | reproduz o `pg_trgm` localmente. *"Esse título está bom?"* virou pergunta de medida |

## As fontes que sustentam as decisões fiscais

| | |
|---|---|
| `../../fontes/2026-09-24-sc-cosit-13-2022.pdf` | o PDF oficial da RFB |
| `../../fontes/2026-09-24-sc-cosit-13-2022-OFICIAL.md` | o texto extraído, 7.514 caracteres, **100%** |
| `../../fontes/2026-09-24-sc-cosit-13-2022-LITERAL.md` | a transcrição do Gemini, que bateu palavra por palavra |
| `../../fontes/2026-09-24-retorno-prompt-a-incisos-LITERAL.md` | o retorno do Prompt A, íntegro |
| `../lc123-art18-anexos-taxativo.md` | os 5 grupos da LC 123, extraídos do Planalto |

---

## ⚠️ Três ressalvas honestas sobre esta entrega

1. **O `testar-busca.mjs` é aproximação, não é o Postgres.** Reproduz o acolchoamento, o Jaccard e o limiar do `pg_trgm`, e serve para escolher entre dois títulos. **Quem mede de verdade é o VPS**, contra o banco.
2. **35 das correções de anexo têm lastro em leitura, não em Solução de Consulta.** São os `§5º-F` conferidos na subclasse. É o melhor lastro disponível sem consulta formal, e está marcado como tal na coluna de fonte — não confundir com os 5 que têm COSIT.
3. **Os dois de P&D (`7210-0/00` e `7220-7/00`) têm lastro menor que o resto.** É leitura da lei mais confirmação de pesquisa externa, **sem Solução de Consulta**. Se o contador discordar de algo do dia, é aí que se mexe primeiro.
