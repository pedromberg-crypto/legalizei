---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, evidencia, prolabore, folha, esocial, api, sensivel]
---

# 👤 Os recibos de pró-labore e o cadastro do sócio

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Fonte:** aba *Sócios e Pró-labore* da conta logada, 14/09/2026 — o botão **"Visualizar"** de cada competência, mais as abas **RECIBO** e **FICHA FINANCEIRA**. As **9 competências** varridas pelo endpoint.

⚠️ **Por que esta nota existe:** a tela de pró-labore já tinha sido varrida antes, e eu tinha a **série de valores**. Nunca tinha aberto o **"Visualizar"**. O Pedro perguntou, e atrás do botão havia dois achados que valem para ele agora e cinco que mudam o desenho do produto. 🔑 **Ler a listagem não é ler o documento** — mesma família da [[legalize-leitura-integral-documento]].

---

## 1 · 🔌 Cinco namespaces de API, um deles chamado "legado"

| Rota | Namespace | O que faz |
|---|---|---|
| `GET /api/plataforma/prolabore/list?anoCompetencia={a}&mesCompetencia={m}` | `plataforma` | lista a folha da competência |
| `POST /api/fopag/folha/listarMovimentosFolha` — corpo = **só o id da folha** | **`fopag`** | as rubricas do recibo |
| `GET /api/legado/socio/list/` | **`legado`** | cadastro do sócio |

Somados a `relatorios-ms` e `multiusuario` (já mapeados), são **cinco namespaces distintos** costurados pelo mesmo menu — e um deles assume o legado no próprio nome.

🔑 **Para nós é aviso, não curiosidade.** Cada namespace é uma fronteira de time e de contrato; o líder acumulou cinco e já paga o preço (ver §4, onde folha e contabilidade discordam). ⚖️ A decisão de quantas fronteiras a nossa API vai ter é barata agora e cara depois.

🐛 **E o bug dos 2 cliques apareceu numa SEGUNDA tela.** Clicando a seta de competência: o **1º clique refaz a busca do mês ATUAL** (`…mesCompetencia=8`) e só o **2º** anda para o anterior (`…mesCompetencia=7`). Confirma que não é defeito isolado do Balanço, é o padrão de `ng-model` da stack antiga ([[2026-09-14-balanco-patrimonial-serie-mensal]] §1).

---

## 2 · A série das 9 competências

| Comp. | Salário base | INSS (11%) | Base IRRF | Status |
|---|---:|---:|---:|---|
| 12/2025 | 100,00 | 11,00 | **0** | Confirmado |
| 01/2026 | — | — | — | 🔴 **folha inexistente** |
| 02/2026 | 3.260,00 | 358,60 | **0** | Confirmado |
| 03/2026 | 3.360,00 | 369,60 | **0** | Confirmado |
| 04/2026 | 3.360,00 | 369,60 | **0** | Confirmado |
| 05/2026 | 1.621,00 | 178,31 | **0** | Confirmado |
| 06/2026 | 1.621,00 | 178,31 | **0** | Confirmado |
| 07/2026 | 1.621,00 | 178,31 | **0** | Confirmado |
| 08/2026 | 1.621,00 | 178,31 | **0** | Confirmado |

✅ INSS bate **11,00% exato** em todas — **quinta fonte independente** do motor de pró-labore, depois do recibo do PGDAS-D, da DCTFWeb, da API de Fator R e do Diário contábil.

🔴 **Janeiro não tem folha nenhuma** — não é folha zerada, é ausência de registro. Bate com a DRE (pró-labore acumulado de janeiro = 0). ⚠️ Para o produto: *"não houve pró-labore"* e *"não existe folha"* são estados diferentes, e a tela do líder mostra os dois do mesmo jeito.

---

## 3 · O recibo por dentro: sempre duas rubricas

```
cod 042  "Prolabore"        PROVENTO   qtd=30   valor=<bruto>   base=0
cod 043  "INSS Prolabore"   DESCONTO   qtd=11   valor=<inss>    base=<bruto>
```

Idêntico em todas as competências, inclusive nas de R$3.360 e nas de R$100.

🔑 **O campo `quantidade` carrega duas semânticas na mesma tabela:** na rubrica 042 são **30 dias**; na 043 são **11 por cento**. 🔨 É armadilha de modelagem clássica, e é barata de evitar: ou a rubrica declara a **unidade** (o payload até tem `unidadeDeMedida`, e ele diz "Unidade" nos dois casos), ou são dois campos.

⚠️ **E dezembro conta 30 dias** num mês em que a empresa existiu 19 — coerente com a `dataAdmissao` de 01/12 (§5), incoerente com o nascimento real da empresa.

---

## 4 · 🔴 A rubrica declara a conta contábil — e ela NÃO bate com o Diário

Cada rubrica traz a árvore contábil completa embutida no payload:

| Rubrica | Débito **declarado** | Crédito **declarado** |
|---|---|---|
| 042 Prolabore | `3.01.01.07.01.01` **Remuneração a Dirigentes e a Conselho de Administração** | `2.01.01.07.02` Pró-Labore a Pagar |
| 043 INSS | `2.01.01.07.02` Pró-Labore a Pagar | `2.01.01.03.15` Retenções Federais Unificadas |

🔴 **Mas o Diário lança o pró-labore em `3.01.01.03.05.02 — (−) Custo com Pró-labore aos Sócios`**, não em *Remuneração a Dirigentes*. A rubrica declara uma conta, o razão recebe outra ([[2026-09-14-dre-balancete-razao-diario]] §5.4).

🔑 **Isto é exatamente a ponte folha → contabilidade que vamos ter que construir.** O desenho deles é bom na intenção — **a rubrica carrega o mapeamento contábil**, então quem cria uma rubrica nova já diz onde ela cai. Mas o que chega no livro é outra conta: ou existe reclassificação no meio do caminho, ou a rubrica envelheceu sem ninguém notar.

⚠️ **A lição vale independente da causa:** **a rubrica não é fonte confiável do lançamento final.** Se copiarmos o desenho, precisamos de verificação — a rubrica diz onde deveria cair, e alguém confere onde caiu. 🔗 É a mesma doutrina das [[legalize-vocabulario-tipo-derivou]] e das travas de anatomia: declarar é metade, verificar é a outra.

---

## 5 · 🔴🔴 Dois achados que são do Pedro, não do produto

### 5.1 · Qualificação cadastral PENDENTE, e nenhuma tela avisa

No cadastro do sócio (`/api/legado/socio/list/`), literal:

```json
"statusQualifCadastral": "FALTA DADOS",
"msgQualifCadastral": "PIS não informado(s) na plataforma da Contabilizei",
"orientacaoQualifCadastral": "Preencha os dados para que possamos realizar a sua qualificação cadastral."
```

🔴 **A qualificação cadastral é a pré-validação do eSocial** — é ela que confere se CPF, nome, data de nascimento e PIS batem nas bases oficiais antes de o evento ser transmitido. Está **pendente**, o campo `pisPasep` está **vazio**, e **isso não apareceu em nenhuma tela** do painel: só no JSON.

⚠️ **E o pró-labore vem sendo transmitido mês a mês assim** — o eSocial alimenta a DCTFWeb ([[2026-09-14-declaracoes-mensais-serie-completa]]), que constitui confissão de dívida irretratável. Não sei qual o risco concreto de transmitir com qualificação pendente; **não deduzo regra de órgão** ([[legalize-regra-de-orgao-nao-se-deduz]]). Mas o fato é que existe pendência aberta e o cliente não sabe.

🔨 **Para o produto:** é exatamente o tipo de estado que o app tem que mostrar. A empresa tem um campo obrigatório vazio e uma validação oficial pendurada, e a única forma de descobrir foi ler o JSON.

### 5.2 · Uma TERCEIRA data de nascimento

`"dataAdmissao": 2025-12-01` — o sócio foi admitido no eSocial em **01/12/2025**.

Mas o contrato foi assinado em **11/12/2025** e a Junta registrou em **12/12/2025**. **A admissão é onze dias anterior à existência da empresa.**

🔑 **Já são três datas circulando, e nenhuma tela mostra as três juntas:**

| Data | O que é | Onde vive |
|---|---|---|
| **01/12/2025** | admissão do sócio (eSocial/folha) | `/api/legado/socio/list/` |
| **11/12/2025** | assinatura do contrato · efeitos do registro | Contrato Social, Cláusula Quarta |
| **12/12/2025** | registro na Junta · abertura do CNPJ | Cartão CNPJ |

🔗 Amarra direto com os acionáveis **D1/D2** ([[acionaveis]]): eu tinha mapeado **duas** datas e pedido que virassem campos distintos. São **três**, e a terceira é a que alimenta a folha e o eSocial — ou seja, a que decide a competência do primeiro pró-labore.

---

## 6 · 🟡 A Ficha Financeira é tela de EDIÇÃO

A aba *FICHA FINANCEIRA* (`#/ficha-financeira`) abre **"Atualizar Ficha Financeira de Pró-labore"** com um seletor de sócio. Não é relatório: é formulário de escrita.

⚠️ **Selecionei o sócio apenas para carregar os dados. Não salvei nada** — alterar ficha financeira de pró-labore mexe em base que alimenta eSocial e DCTFWeb, e não é ação de varredura.

E a aba **RECIBO** não é tela própria: é a mesma `#/prolabore`.

---

## 7 · ❌ O que isto NÃO prova

| Não prova | Por quê |
|---|---|
| que a qualificação cadastral pendente causou algum problema | as 9 folhas estão **Confirmado** e as DCTFWeb foram transmitidas; não sei o risco concreto |
| que `Remuneração a Dirigentes` está errado | pode haver reclassificação contábil entre a rubrica e o livro; não vi o passo do meio |
| que `salarioBaseIRRF = 0` é defeito | pode ser isenção aplicada na origem; **pergunta aberta pro Mauro** |
| que a `dataAdmissao` de 01/12 é erro | pode ser escolha deliberada para fechar a competência de dezembro; não sei a regra |
| o que a Ficha Financeira contém por sócio | é tela de escrita e **não foi explorada além de carregar** |

## Links
[[constituicao]] · [[acionaveis]] · [[2026-09-14-dre-balancete-razao-diario]] · [[2026-09-14-balanco-patrimonial-serie-mensal]] · [[2026-09-14-declaracoes-mensais-serie-completa]] · [[fila-validacao-humana]] · [[HOME]]
