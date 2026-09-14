---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, evidencia, pgdas, dctfweb, prolabore, sensivel]
---

# 📊 Declarações mensais — a série fiscal completa, 12/2025 a 08/2026

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Fonte:** `app.contabilizei.com.br/sistema/#/declaracoes-mensais`, conta logada do Pedro.
**Método:** baixados e lidos **100%** os recibos oficiais de **PGDAS-D** (9) e **DCTFWeb** (9) de cada competência. Setembro ainda não fechou (confirmado pelo Pedro) — a série termina em agosto.

---

## 1 · 🔴 A TELA ESCONDE TRÊS COMPETÊNCIAS DE PRÓ-LABORE

A **Central de Sócios** mostra o histórico começando em **março/2026**. A DCTFWeb prova outra coisa. Derivando o pró-labore do INSS do segurado (**11%**):

| Competência | INSS segurado | **Pró-labore implícito** | Aparece na tela? |
|---|---:|---:|:--:|
| **12/2025** | **R$ 11,00** | **R$ 100,00** | 🔴 **NÃO** |
| **01/2026** | *Sem Movimento* | **R$ 0,00** | 🔴 **NÃO** |
| **02/2026** | **R$ 358,60** | **R$ 3.260,00** | 🔴 **NÃO** |
| 03/2026 | R$ 369,60 | R$ 3.360,00 | ✅ |
| 04/2026 | R$ 369,60 | R$ 3.360,00 | ✅ |
| 05/2026 | R$ 178,31 | R$ 1.621,00 | ✅ |
| 06/2026 | R$ 178,31 | R$ 1.621,00 | ✅ |
| 07/2026 | R$ 178,31 | R$ 1.621,00 | ✅ |
| 08/2026 | R$ 178,31 | R$ 1.621,00 | ✅ |

🔑 **Isto responde a pergunta do Pedro sobre o pró-labore inicial, e corrige o que eu tinha registrado ontem.** Eu escrevi que *"o pró-labore só começa em março/2026 — quase 3 meses de CNPJ ativo sem pró-labore nenhum"*. **Errado.** Houve pró-labore em **dezembro (R$100)** e em **fevereiro (R$3.260)**; só janeiro foi zerado. O que começa em março é **o que a tela mostra**, não o fato.

🔴 **A lição vale mais que o dado:** eu tinha lido uma **tela de histórico** e tratado como a série completa. A série real está na **declaração transmitida ao órgão**. É a terceira vez no estudo que o recorte da ferramenta virou a conclusão — depois da caixa de e-mail errada e do `has:attachment` cego.

⚠️ **Duas perguntas abertas:** por que **R$100,00** em dezembro (não é piso, não é proporcional óbvio de 20 dias) e por que **R$3.260** em fevereiro, R$100 abaixo dos R$3.360 de março. 🕓 Pergunta pro Mauro.

---

## 2 · 📈 A série de receita e DAS, oficial

| Competência | Receita bruta | **DAS devido** | Alíquota efetiva | Transmissão PGDAS |
|---|---:|---:|---:|---|
| 12/2025 | R$ 0,00 | R$ 0,00 | — | 09/01/2026 11:39 |
| 01/2026 | R$ 0,00 | R$ 0,00 | — | 21/01/2026 16:18 |
| **02/2026** | **R$ 12.000,00** | **R$ 720,00** | **6,00000%** | 01/03/2026 02:21 · 🔄 retificada |
| 03/2026 | R$ 12.000,00 | R$ 720,00 | 6,00000% | 01/04/2026 06:57 |
| 04/2026 | R$ 12.000,00 | R$ 720,00 | 6,00000% | 01/05/2026 03:22 |
| 05/2026 | R$ 0,00 | R$ 0,00 | — | 01/06/2026 03:26 · 🔄 retificada |
| 06/2026 | R$ 0,00 | R$ 0,00 | — | 25/06/2026 02:34 |
| 07/2026 | R$ 0,00 | R$ 0,00 | — | 25/07/2026 05:38 |
| **08/2026** | **R$ 7.910,00** | **R$ 474,59** | **5,99987%** | 01/09/2026 07:35 |

### ✅ O arredondamento por tributo, confirmado por recibo oficial

Esta é a prova que faltava para o achado de 13/09:

- **R$ 12.000 × 6% = R$ 720,00** → e o DAS é **R$ 720,00**. Sem diferença.
- **R$ 7.910 × 6% = R$ 474,60** → e o DAS é **R$ 474,59**. **Um centavo a menos.**

🔑 **Em valor redondo as duas contas coincidem; em valor quebrado, o arredondamento por tributo aparece.** Era exatamente a tese: o DAS é a soma de 6 parcelas arredondadas, não o arredondamento do produto. Antes tínhamos o painel do líder; agora temos o **recibo do PGDAS-D da Receita** em duas competências que se comportam de formas diferentes pelo mesmo motivo.

⚠️ **Divergência a conferir:** o `PERSONA_ZERO.receitaReal` registra *"jun 12.000"*, mas o PGDAS de **06/2026 declara R$ 0,00**. A série oficial vale mais que a nota do vault. 🕓 Conferir de onde veio o 12.000 de junho.

---

## 3 · 🤖 Quem declara, quando e de onde

**Todas as 18 transmissões** (9 PGDAS + 9 DCTFWeb) saíram do mesmo lugar:

| | |
|---|---|
| **CPF do responsável** | **003.918.339-44** |
| **IP do usuário** | **35.224.52.8** (faixa do Google Cloud) |

🔴 **003.918.339-44 é o CPF completo do Charles Davyd Gularte** — o mesmo que assinou o Termo de Compromisso do Alvará como *"REPRESENTANTE LEGAL, sob responsabilidade penal, civil e administrativa"* ([[2026-09-13-documentos-municipais-da-abertura]]). 🔑 **Um único CPF humano assina o alvará e transmite todas as declarações fiscais do cliente**, de um IP de servidor. É a procuração de *"todos os serviços… inclusive confissão de débitos"* sendo exercida na prática, todo mês, em lote de madrugada.

**A cadência da transmissão:**
- **DCTFWeb:** dia **1º do mês seguinte**, quase sempre — 07:24, 07:25, 07:48, 08:18. Automático.
- **PGDAS:** dia **1º de madrugada** (02:21, 03:22, 03:26) na maioria. ⚠️ **Mas não sempre:** 12/2025 saiu em 09/01, 01/2026 em 21/01, e junho e julho no **dia 25 do próprio mês**, antes do fim da competência.

🔑 **Declarar antes do mês acabar só é possível porque a receita já era zero.** É otimização de lote deles, e é comportamento que o nosso motor precisa decidir se copia.

---

## 4 · 🔄 Quatro retificações em nove meses

| Documento | Competência | Evidência |
|---|---|---|
| PGDAS | **02/2026** | recibo com sufixo **002** |
| PGDAS | **05/2026** | recibo com sufixo **002** |
| DCTFWeb | **01/2026** | `Declaração Retificadora: **Sim**` — retificada em **08/03/2026**, virou *"Sem Movimento"* |
| DCTFWeb | **04/2026** | `Declaração Retificadora: **Sim**` |

🔑 **Retificar é rotina, não exceção — 4 em 9 competências.** Nosso mapa de Impostos tem o nó `I28` (*"retifica a declaração de uma competência já paga"*) tratado como caso de borda. **Não é borda: é ~44% das competências do primeiro ano.** ⚠️ E a DCTFWeb de janeiro foi retificada **para zerar** — alguém declarou movimento que não existia.

---

## 5 · 🔗 A DCTFWeb bebe de DUAS fontes

Campo `Identificação da apuração de débitos`:

- **12/2025:** `36856462658 / **eSocial**`
- **08/2026:** `43149746148 / **eSocial**`
- **01/2026:** `37499613382 / **eSocial**` + `143338951 / **Reinf RET**`

🔑 **A EFD-Reinf aparece na série**, e não está em nenhuma das nossas 8 categorias — assim como a DEFIS. A DCTFWeb é **declaração derivada**: ela não tem dado próprio, ela consolida o que o eSocial e o Reinf mandaram. 🔑 Quem constrói o motor precisa saber que **o pró-labore não vira imposto direto: vira evento no eSocial, que vira débito na DCTFWeb, que vira DARF**.

---

## 6 · ⚠️ O que a DCTFWeb declara sobre si mesma

> *"O presente Recibo […] **constitui confissão de dívida, de forma irretratável**, dos tributos declarados. Fica o declarante ciente de que os tributos declarados na DCTFWeb e **não pagos serão enviados para inscrição em Dívida Ativa da União**."*

E enumera as consequências: multa e juros (Lei 9.430/96 art. 61 + Lei 8.212/91 art. 35) · **inclusão no CADIN** · **representação fiscal para fins penais ao Ministério Público** nos casos de crime contra a ordem tributária ou a previdência.

🔑 **Declarar e não pagar é pior que não declarar**, porque a declaração já é confissão. Isso muda o peso do nosso aviso de vencimento: não é lembrete de comodidade, é o que separa "devo" de "confessei e não paguei".

⚠️ E a retificação tem limite: *"não surtirão efeitos as retificações que pretendam excluir ou reduzir débitos **enviados para inscrição em Dívida Ativa**"*. Depois que inscreveu, não dá pra corrigir declarando de novo.

## Links
[[constituicao]] · [[acionaveis]] · [[2026-09-13-documentos-municipais-da-abertura]] · [[legalize-motor-fiscal-arredonda-por-tributo]] · [[HOME]]
