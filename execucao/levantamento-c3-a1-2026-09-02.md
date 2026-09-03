---
tipo: levantamento
status: em-execucao
data: 2026-09-02
assunto: dossie-c3-a1
etapa: constituicao
tags: [flow, copy, design, dossie]
---

# 🔍 Levantamento C3 → A1 (para validação do Pedro)

> **O que é:** varredura das 6 telas entre a C3 e a A1. Cada achado foi conferido na tela renderizada antes de entrar aqui.
>
> **✅ 03/09 — o Pedro aprovou as prioridades 1, 2 e 3, e elas já estão aplicadas.** Os itens feitos estão marcados ✅ nas tabelas. O que sobrou é o enxugamento tela a tela (prioridade 4), que vai como as outras: uma tela por vez, com validação dele no meio.
>
> 🐛 **03/09 — os achados foram RENUMERADOS.** Eu tinha usado "C3.2", "C4.1"… como id de achado, e isso colidiu com a nomenclatura de TELA do projeto (C3.1 é uma tela de verdade): o Pedro foi procurar telas que não existem. Agora cada tela tem seu prefixo — **S** sócios · **E** empresa · **N** nome · **R** rodada 2 · **V** revisar.
>
> **Método:** mesmo pente das telas já validadas hoje (C0.0, C0, C5, C1, C2) — copy que narra mecânica, promessa que a tela não cumpre, vocabulário nosso, e as duas regras duras do projeto (sem travessão · toda tela de wizard tem voltar com `meta` = destino).

## 📌 O que vale pras 6 telas de uma vez

Três coisas se repetem em **todas**. Se você aprovar aqui, valem para o lote inteiro e eu não repito nas tabelas.

| # | Achado | Por quê |
|---|---|---|
| G1 | ✅ **FEITO.** ~~Nenhuma das 6 tem seta de voltar.~~ ⚠️ Correção do levantamento: a **C7′ já tinha** — eu generalizei sem conferir uma a uma, e a auditoria do gerador (que não a listava) estava certa. As outras 5 ganharam. | Quem entra em qualquer tela do dossiê não consegue voltar pra anterior. Mesma família corrigida hoje na C0, C5 e C2 (regra 6 do `CLAUDE.md`). |
| G2 | ✅ **FEITO** nas 4 que erravam. `meta` agora nomeia o destino: C3→"Vínculo com o INSS", C4→"Sócios", C7→"Dados do dossiê", A1→"Nome da empresa". Na C7′ virou "O que a Junta pediu". | `meta` é o nome de **pra onde o voltar leva**. Da C3 volta pra C2, da C4 pra C3, e assim por diante. |
| G3 | 🟡 **Todas têm subtítulo**, contrariando o padrão que fixamos hoje (C0, C5, C1 e C2 ficaram só com título). | Em algumas o subtítulo carrega o *porquê* e vale manter (C4, A1); em outras ele narra a mecânica que a tela já mostra. Marquei caso a caso. |

---

## C3 · Sócios `/dossie/socios`

**O que a tela faz:** confirma o sócio extra e coleta os dados dele (nome, CPF, participação, nascimento, nacionalidade, RG, órgão, estado civil, regime de bens, endereço completo), mais a pergunta de quem administra.

| # | Achado | Tipo | Sugestão |
|---|---|---|---|
| S1 | ✅ **FEITO.** 🔴 **"Os outros dados de cada sócio a gente coleta igual aos seus, na sequência."** A frase é **falsa**: todos os dados do sócio estão nesta mesma tela. Nada vem depois. | copy | Remover. É promessa de um passo que não existe. |
| S2 | Subtítulo "Você disse que teria sócio. Complete os dados dele." narra a mecânica. | copy | Remover (padrão G3). O título já pergunta e os campos já mostram. |
| S3 | **"CPF dele" · "Participação dele" · "CEP dele"** — três rótulos com "dele", e o app não sabe o gênero do sócio. | copy | "CPF do sócio" / "Participação" / "CEP". Os campos já estão dentro do card do sócio. |
| S4 | h1 diz **"Seu sócio"** (singular) e o header diz **"Sócios"** (plural). | copy | Alinhar. Com o G2 resolvido o header vira o destino e o conflito some sozinho. |
| S5 | O bloco "Quem vai administrar a empresa?" tem 3 linhas de explicação, e na variante 3+ sócios ainda ganha "Do jeito que está: só você administra" + 2 linhas. | copy | Encurtar. A explicação do que é administrar é a parte que salva; o resto repete. |
| S6 | ~14 campos numa tela só, sem agrupamento (dados do sócio · divisão · administração). | design | Mesma questão da C1. Separar em blocos ou seções. |
| S7 | `C3 → C7` quando a pessoa escolheu endereço fiscal (pula a C4). | flow | ✅ **Correto e intencional** (decisão 01/09). Só registrando pra você saber que é de propósito. |

## C3.1 · 3+ sócios `/dossie/socios?socios=3`

Mesma tela, variante. Só o que muda:

| # | Achado | Tipo | Sugestão |
|---|---|---|---|
| S8 | O bloco de administração vira lista de nomes com check (correto, pedido de 01/09), mas ganha junto **"Do jeito que está: só você administra"** e mais 2 linhas explicando. | copy | Manter a lista, cortar o parágrafo. |
| S9 | O nó não tem saída no grafo. | flow | ✅ Correto: é estado inline da C3, não tela separada. |

## C4 · Dados da empresa `/dossie/empresa`

**O que a tela faz:** mostra travado o endereço que veio do E3.4 e pede **um** campo: o índice cadastral do IPTU.

| # | Achado | Tipo | Sugestão |
|---|---|---|---|
| E1 | ✅ **FEITO.** Travessão em "Obrigatório — sem ele a documentação não passa na Junta." | copy | Regra dura desde 24/07. Trocar por ponto ou dois-pontos. |
| E2 | ✅ **FEITO** (nos 2 pontos do arquivo). Travessão na concatenação do endereço travado: "Funcionários — 30140-060". | copy | Mesmo caso que corrigi na C1: escapa porque não é frase, é montagem. Vírgula. |
| E3 | ✅ **FEITO** (ficou só "travado"). **"🔒 travado"** — emoji de cadeado **mais** a palavra "travado". | design | Um dos dois. O `Texto travado` que criei hoje na C1 já resolve isso visualmente (fundo cinza), sem precisar dizer. |
| E4 | "Endereço da empresa, **informado no começo**" — "no começo" é a nossa visão do flow, não a dela. | copy | "Endereço que você já informou", ou nada: o estado travado já diz. |
| E5 | Título "**Os** dados da empresa" com artigo; os outros títulos do dossiê não usam. | copy | "Dados da empresa". |
| E6 | Subtítulo "O endereço vai no CNPJ, e é ele que a Prefeitura analisa pra liberar a empresa." | copy | ✅ **Manter.** É o único lugar que justifica por que pedimos o IPTU, e a pergunta é intrusiva. Mesma lógica que manteve o subtítulo da C2. |
| E7 | "Sobre o imóvel, você já respondeu | Apartamento | · | você mora nele" — bullets soltos entre pedaços. | design | A montagem está frágil. Vale reescrever como frase. |
| E8 | A tela tem **um campo** e três blocos de leitura. | design | Candidata natural a receber ícone 3D, como a C2. |

## C7 · Nome / razão social `/dossie/nome`

**O que a tela faz:** 3 sugestões de razão social editáveis e reordenáveis, objeto social gerado (travado) e nome fantasia opcional.

| # | Achado | Tipo | Sugestão |
|---|---|---|---|
| N1 | ✅ **FEITO.** Travessão em "já seguimos pra 2ª, e depois a 3ª — sem te avisar toda vez nem travar o processo." | copy | Regra dura. |
| N2 | ✅ **FEITO.** Travessão em "Não dá pra editar aqui — assim evitamos erro de grafia indo pro contrato." | copy | Regra dura. |
| N3 | **"ORDEM" em caixa alta** no subtítulo. O app não usa caixa alta pra ênfase em nenhum outro lugar. | copy | Minúscula. Se precisar de ênfase, negrito. |
| N4 | O subtítulo e o rótulo "Suas 3 opções, na ordem que a gente vai tentar" dizem a mesma coisa. | copy | Um dos dois. |
| N5 | Bloco "Nenhuma tentativa atrasa a sua abertura" com 2 linhas + explicação do objeto social com mais 2. | copy | A primeira tranquiliza de verdade (a pessoa teme que nome negado atrase). A do objeto social explica uma trava que o campo cinza já comunica. |
| N6 | Reordenar é por setas ▲▼ pequenas. | design | Conferir alvo de toque no aparelho. |
| N7 | O objeto social travado usa o mesmo cinza do campo travado. | design | ✅ Coerente com o padrão que criamos na C1 (CPF). |

## C7′ · Sugerir mais 3 nomes `/dossie/nome/rodada-2`

**Quando aparece:** só quando a Junta recusa as 3 primeiras (vem da A3.1, não da sequência normal).

| # | Achado | Tipo | Sugestão |
|---|---|---|---|
| R1 | ✅ **FEITO** (virou "Escreva um nome", no cinza de placeholder). Travessão usado como placeholder de opção vazia (as posições 2 e 3 mostram "—"). | copy/design | Trocar por campo vazio com placeholder de texto, ou por um traço simples. |
| R2 | "ORDEM" em caixa alta, de novo. | copy | Mesmo caso da C7.3 — as duas telas compartilham a copy. |
| R3 | "As 3 primeiras não passaram na Junta." | copy | ✅ **Manter.** Direto, sem rodeio, e explica por que ela está aqui. |
| R4 | Não está na sequência C3→A1: entra pela A3.1 e sai pra A3.V. | flow | ✅ Correto. É ramo de exceção. |

## A1 · Revisar + autorizar `/revisar`

**O que a tela faz:** recapitula tudo (você, empresa, atividades, enquadramento, pró-labore) e é o último ponto antes do irreversível.

| # | Achado | Tipo | Sugestão |
|---|---|---|---|
| V1 | Subtítulo "Confira com calma. Depois que você autoriza, a gente já começa a registrar isso na Junta com o seu nome." | copy | ✅ **Manter.** É o aviso mais importante do flow e o peso está calibrado. |
| V2 | **"✨ Sugestão"** — emoji dentro da UI. | design | O app usa emoji em comentário de código, não em interface. Trocar por pill, que é o padrão. |
| V3 | "Esse número é uma estimativa. Depois que a empresa nascer, a gente lapida ele com você de verdade (é o Pró-labore, na aba Impostos)." | copy | Encurtar. O parêntese ensina navegação de uma tela que ela ainda não tem. |
| V4 | "Já escolhemos o melhor enquadramento pra você, com base no que você preencheu." | copy | "com base no que você preencheu" é a mecânica; o valor está em "escolhemos pra você". |
| V5 | Cada bloco tem "Ajustar" próprio. | flow | ✅ Correto aqui (é pré-protocolo). Diferente do status, onde tiramos do bloco pago. |

---

## 🔗 Espelho mapa × apresentação × flow

Rodei a auditoria do gerador. **As 6 telas estão íntegras nos três lugares:**

| Nó | No mapa | Pill na demo |
|---|---|---|
| C3 | ✅ | `socios` |
| S1 | ✅ | `socios` (com preparo que força 3 sócios) |
| C4 | ✅ | `empresa` |
| C7 | ✅ | `nome` |
| C7′ | ✅ | `nome-rodada2` |
| A1 | ✅ | `revisar` |

**Sem divergência de nome, sem nó órfão, sem pill sem destino.** O mapa segue na v89 e a auditoria não acusou nada novo além do que já é conhecido:

- 3 telas declaradas e ainda sem construir na demo: `E3_2_M` (E3.2 variante Migrar), `E5T_1` (gate inline do sócio) e `A3_PSB` (splash do boleto da guia).
- 30 telas do flow sem voltar declarado — as 6 deste levantamento estão nessa conta (G1).

## ✅ Status da execução (03/09)

| Prioridade | O que era | Status |
|---|---|---|
| 1 | Voltar + `meta` nas 6 telas | ✅ feito — a auditoria do gerador caiu de **30 para 25** telas sem voltar |
| 2 | Os 5 travessões | ✅ feito — varredura nas 6 telas renderizadas devolve **zero** |
| 3 | A frase falsa da C3 | ✅ feito |
| 4 | Enxugamento tela a tela | 🔜 pendente, uma tela por vez |

**O que ficou pendente, por tela:** C3 → S2, S3, S5, S6, S8 · C4 → E4, E5, E7, E8 · C7 → N3, N4, N5, N6 · C7′ → R2 · A1 → V2, V3, V4.

## ⚖️ Como eu priorizaria

1. **G1 + G2** (voltar e `meta` nas 6). São bug de navegação, não estética, e o conserto é uma linha por tela.
2. **Os 5 travessões** (C4.1, C4.2, C7.1, C7.2, C7′.1). Regra dura violada, correção mecânica.
3. **C3.1** — a frase falsa. É a única coisa aqui que faz a pessoa esperar algo que não vem.
4. O resto é enxugamento, e pode ir tela a tela como fizemos hoje.
