---
tipo: historico
status: vivo
data: 2026-07-19
assunto: construcao-telas
tags: [marco, telas, arquetipo, fiscal, pesquisa, cobaia, ux]
---

# 🏗️ Marco — A2 lapidado, A3 construído, e a pesquisa fiscal que fechou 8 pendências

> ⚠️ **Correção de data:** o marco [[2026-07-17-telas-a1-a2-construidas]] e vários
> comentários de código levam "17/07", mas foram escritos **hoje (19/07)** — eu usei
> a data do último commit em vez da data corrente. O conteúdo vale; a data, não.

## 1. O card do veredito mudou de tese

**Princípio travado: o card do veredito vende RECONHECIMENTO, não economia.**
O ativo de conversão ali é *"eles me entenderam"*. Dinheiro tem dono: o N5.

**A alíquota saiu da face**, por três motivos em ordem de peso:
1. **Estava errada.** Dizia "Anexo III" fixo; o dado real do `6201-5/02` é
   `anexos:[III,V]` + `fator_r:true`. O exemplo-vitrine achatava justo a
   mecânica que o produto existe pra explorar.
2. É jargão.
3. É `nao-ratificado` — cravar número fiscal pré-pagamento é passivo, não poluição.

**Depois do debate com o Pedro, nenhum número ficou na tela.** Qualquer número
ali machuca: **6%** ancora a `promessa-quebrada`; **15,5%** assusta a `cida`
antes de ela saber que existe alavanca; **"6% a 11,2%"** (a régua real do Anexo
III dentro da ME) esconderia o risco — a jogada que a gente acusa o concorrente
de fazer.

## 2. O achado do Pedro que virou correção de produto

Provocação dele: *"o 'não entra' assusta — design gráfico não poderia ser
secundário? Eu sou designer gráfico E web."*

**O dado deu razão a ele.** Os 4 vizinhos do `6201-5/02` — inclusive design
gráfico `7410-2/99` — são **atendidos, mesmo anexo [III,V], mesma abertura
lisa**. A tela dizia "NÃO entra" sobre algo que a gente atende **identicamente**.

Eu tinha colapsado duas coisas: *"isso não é este código"* (fato de
classificação, verdadeiro) com *"a gente não faz isso"* (implicação de produto,
**falsa**).

**Correção:** exclusão virou **roteamento**. A pergunta é *"isso é a sua
principal ou é adicional?"*. Adicional vira **CNAE secundário** (é pro que o N14
existe); só principal errada manda pro refazer. O fecho é derivado do dado
(`mesmo-imposto` / `muda-imposto` / `fora`) — prometer "sem problemas" a quem
tem vizinha de outro anexo mentiria com a `instrutora`.

## 3. Simplificação do card (o Pedro achou poluído, e estava)

Fechado tinha **7 blocos**; com as gavetas abertas, **~26 linhas** numa tela cujo
único trabalho é arrancar um "sim, sou eu". Agora **5 blocos** e **uma gaveta só**.

Morreram: a gaveta fiscal (migrou pro N5/N18), o rótulo *"Isso é mesmo o meu
caso?"* (plantava dúvida na hora de confirmar), a lista de 4 itens com códigos,
e o *"o que essa atividade cobre"* (a linha da face já faz isso).

## 4. Selo dos 3 estados

Selo **64px centralizado**, símbolo desenhado, frase abaixo, respiro de 32px:

| Estado | Símbolo | Cor | Frase |
|---|---|---|---|
| 🟢 | check | success | "Achei o seu encaixe" |
| 🟡 | **relógio** | warning | "Ainda não, por enquanto" |
| 🔴 | **pessoa** | **info (azul)** | "Seu caso pede uma pessoa" |

**O 🔴 é azul, não vermelho, de propósito:** o desfecho é *"nosso time resolve"*,
não "você falhou". X vermelho leria como rejeição e brigaria com a regra do
template de saída graciosa. Danger fica pro que de fato **barra** (exterior,
3+ sócios).

## 5. Captura nas saídas (spec T4 + UX-35, finalmente construída)

🟡 e 🔴 capturam **nome + contato na própria tela** (2 campos, sem conta) e
mostram confirmação. O bloco **"Você não vai repetir nada"** é a UX-35: o lead
vai **com contexto** (atividade + CNAE encontrado). É o que separa isso de um
e-mail solto numa planilha. 🟡 mantém o "enquanto isso" (rota pro escritório).

❌ **"Oferta especial" não entrou** — preço está deferido; prometer desconto
sobre número inexistente é criar obrigação. Usamos "em primeira mão" + "na
frente da fila", mesmo incentivo sem dívida.

## 6. A3 construído

**N5 · Teaser, 3 modos** (`components/teaser.tsx`, rotas em `(wizard)/teaser/`):
- **swap** → número fechado (R$ 1.425/mês): economia vem do código, já conhecido no N4
- **fator-r** → **faixa começando em R$ 0**: como inclui zero, não há piso a violar
- **servico** → **sem número** (UX-49): já está na tabela mais barata

Valores **derivados** de `lib/fiscal` (`ANEXO_V − ANEXO_III` × faixa), não digitados.
A pill *"A conta inteira, sem asterisco"* vive no modo `fator-r` — é onde ela se
**prova**, mostrando o R$0 que um concorrente esconderia.

**N17 · CNAE ótimo** (`(app)/dossie/cnae-otimo`): atual × ótimo com imposto de
cada um, *"não é malandragem"* (obrigatório), as 2 alavancas, tradeoff honesto,
prova exportável em PDF, opt-in explícito sem punir quem mantém.

## 7. 🔬 Pesquisa fiscal em fonte primária — 8 pendências fechadas

| Item | Antes | Agora |
|---|---|---|
| **Taxa JUCEMG** | 🔴 divergência aberta desde 09/07 (R$288 × R$268,51) | ✅ **R$ 268,51 (ME)** · EPP R$275,24 · demais R$280,61 · personalizado R$429,61. **R$288 morreu** |
| **CPP entra no Fator R?** | 🟡 fila-Larissa | ✅ **SIM** — SC COSIT 17/2021 (sijut2, oficial) |
| **FS12 caixa × RBT12 competência** | 🟡 "verificar" | ✅ confirmado, mesma fonte |
| **Fator R em empresa nova** | não tínhamos | ✅ 1º mês ×12; depois média aritmética ×12 |
| **Anexo III faixa 2** | não ratificado | ✅ 11,20%, deduzir R$ 9.360 |
| **Anexo V faixa 2** | não tínhamos | ✅ 18,00%, deduzir R$ 4.500 |
| **Teto ME R$360k** | "menção não confirmada" | ✅ LC 123 art. 3º |
| **Prazo do Simples** | não tínhamos | ✅ 30 dias da última inscrição, teto 60 do CNPJ |

**Impacto direto no produto:** com a CPP contando no numerador, o **pró-labore
ótimo fica MENOR** e mais alcançável. Muda o número que o N18 recomenda.

### 🆕 Dois achados novos
- **Lei 15.270/2025** — acabou a isenção total de lucros: **10% retidos acima de
  R$ 50 mil/mês** por PF. **Não atinge nosso ICP** (teto R$30k/mês), mas vira
  guarda-corpo no motor. ⚠️ os artigos citados ("3º-A", "6º-A") **não foram
  verificados** — formato suspeito.
- **Portaria SMFA 75/2025 (PBH)** — BHISS/DES-BH extinto, NFS-e só pelo Emissor
  Nacional, que exigiria certificado digital. 🟡 **fonte secundária** — se
  confirmar, **derruba** o que a Izabela nos passou e muda o custo de entrada.

### ⚠️ Crítica ao relatório
Ele **quebrou a própria regra de confiança**: deu **100%** a linhas citando blog
de contabilidade (tabelas dos anexos, IRRF R$5k, lucros 10%, TFLF). O conteúdo
pode estar certo; a **nota de confiança está mentindo**, que era justamente o
mecanismo pedido. Tratar esses itens como 🟡 até fonte primária.

### 🔴 Conflito com fato datado
**TFLF.** Pesquisa: edital em **abril**, vence **10/05**, R$168,48, sem pro-rata.
Caso real do Pedro: chegou por volta do **dia 40** (≈ janeiro), 4 dias pra pagar,
~R$161. **Não fecham.** Provável que sejam **dois eventos** (lançamento inicial ×
edital anual) e a pesquisa só viu o segundo. Documento ganha de fonte secundária.

**Custo de governo atualizado:** ~R$ 268,51 + ~R$ 168,48 = **~R$ 437** (era R$288
+ R$209–229). Certificado segue em conflito (R$115 × R$209–229).

## 8. 🧪 A cobaia analisada — e eu errei antes de acertar

Do cartão CNPJ + demonstrativo + DAS + DARF do Pedro:
- CNAE **7319-0/04** (consultoria em publicidade), **Anexo III/V com Fator R**,
  ME, **LTDA com sócio único**, **zero CNAE secundário**, baixo risco A
- **Está pagando 6%** — DAS fev/2026: **R$ 720,00 sobre R$ 12.000** = exatos 6,00%

**Minha primeira conclusão estava ERRADA.** Afirmei que ele perdia ~R$11k/ano por
mau enquadramento. Usei o pró-labore de **um mês** (junho, R$1.621) contra o
faturamento e calculei 13,5%. Dois furos: o Fator R roda sobre **12 meses**, e em
**fevereiro o pró-labore era R$ 3.260** (DARF R$358,60 ÷ 11%).

**O achado verdadeiro é melhor:** o pró-labore **caiu pela metade** (3.260 → 1.621)
porque houve um mês sem NF. E aí a inversão contraintuitiva: **mês sem faturar
AUMENTA o Fator R** (tira R$12k do denominador e só R$1,6k do numerador) — é isso
que sustenta os 37% que o portal mostra. **A armadilha aparece quando as coisas
melhoram:** voltando a faturar cheio com pró-labore no mínimo, a razão despenca
pra ~16% → Anexo V → **+R$1.140/mês**. O gatilho é a boa notícia.

E mesmo os R$3.260 eram apertados: 27,2% sozinho, **só passa dos 28% porque a CPP
conta** — a interpretação que a pesquisa acabou de confirmar.

**Lição de produto (a que vale):** não é *"eles enquadraram errado"*. É
**"o Fator R é um número vivo e ninguém está olhando"**. Acertaram na largada e
não têm a outra metade — subir de volta quando o faturamento voltar. Isso não é
feature de onboarding, é **produto de monitoramento contínuo**. Reforça a tese do
vault: **a cauda é o produto**.

**Efeito colateral no plano:** o North Star diz *"cobaia = CNPJ do próprio
Pedro"* — mas **o CNPJ dele já existe** (aberto pela Contabilizei em 12/12/2025).
A cobaia foi gasta. O E2E precisa de decisão: 2ª empresa, outra pessoa, ou usar o
caso dele pro **flow #2 (migrar)**, pro qual ele é a persona perfeita.

## 9. Decisões travadas neste flow
1. Card do veredito vende **reconhecimento**, não economia
2. **Nenhum número fiscal no veredito** — todos machucam ali
3. **"Grande parte das pessoas paga X%" VETADO** — sem base de clientes
4. **Teto de 33% não se cita** (decisão do Pedro): assusta e não é o caso do ICP
5. Pill **"A conta inteira, sem asterisco"** em vez de cutucar concorrente
6. **NÃO reordenar o N4** — pedir faturamento antes do veredito inverteria a troca
   (pedir 2× antes de entregar 1×) e mudaria o sentido da pergunta. Fica como
   hipótese a testar com dado, coerente com o UX-48
7. **🔴 usa info, não danger**
8. Componentes de form/saída seguem **locais** (regra dos 3)

## 10. ✅ Deixou de ser 🔴
**O dev está alinhado.** O Pedro falou com ele pessoalmente; ele está em
**validação de APIs** aguardando algo mais definitivo. O item *"avisar o dev"*,
que era o **único 🔴 real do projeto**, sai do vermelho.

## Próximo
- **Rodar a pesquisa 2** (prompt cirúrgico pronto): Portaria SMFA 75/2025 ·
  texto da Lei 15.270/2025 no Planalto · mecânica dupla da TFLF
- **A7 Espera** e **A9 Saída** (esta já 80% pronta dentro do A2 — fatorar na 3ª ocorrência)
- **N18:** entregar o ótimo como **default** e esconder o slider atrás de
  *"e se eu me pagar diferente?"* (insight vindo da experiência real do Pedro)
- Rodar A1/A2/A3 contra as 19 personas

Ver [[legalize-telas-padrao-layout]] · [[fiscal-simples-bh-2026]] · [[cnae-fiscalmente-otimo]] · [[reordenacao-flow-cobranca-cedo]].
