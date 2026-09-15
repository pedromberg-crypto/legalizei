---
tipo: verdade
status: vivo
data: 2026-09-14
assunto: suficiencia-motor-fiscal
autoridade: fonte-verdade
tags: [motor, fiscal, auditoria, cobertura, anexos, fator-r]
---

# 🎯 O motor fiscal basta? — auditoria de suficiência

> 🧭 **O que esta nota responde** (provocação do Pedro, 14/09): o que eu consulto pra fechar o motor · se os Anexos III e V estão cobertos · se o Fator R está · se dá pra gerar a guia do mês 1 **em março ou em dezembro, indiferente** · e quais variáveis o motor cobre pro cliente travado — **sem a folha de pagamento, por enquanto**.
>
> 🔒 Cliente travado: ME Simples · Anexos III e V · serviço não regulamentado · BH/MG · 1 a 4 sócios PF no Brasil · sem exterior. Ver [[PERSONA]].

## Veredito em uma linha

🟢 **Não sobrou buraco de CÁLCULO dentro do escopo.** Tudo que é conta, o motor faz e está provado.

🔴 **Mas isso cobre menos funcionalidade do que parece.** O motor resolve **4 das 8** de Impostos e **3 das 7** de Pró-labore (mais 2 que existem, só estão no arquivo errado). As outras **não são cálculo** — são API, persistência, documento ou gateway, e nenhuma quantidade de motor as fecha.

> ⚠️ **Correção de 14/09:** uma versão desta nota dizia *"7 de 8 e 5 de 7"*. Estava **inflado** — eu contei como cobertas as funcionalidades que o motor não precisa tocar, em vez das que ele resolve. O Pedro pegou perguntando *"por que não fechamos todos?"*. Os números certos estão acima, e a §5.1 diz o que falta para fechar de verdade.

## 📋 O que exatamente está fechado — atualizado em 14/09, 2ª rodada

| | Estado | Prova |
|---|---|---|
| **Motor fiscal** (`motor-fiscal/`) | 🟢 fechado como cálculo | **45 conferências** contra recibo do PGDAS-D, nota fiscal real e texto legal |
| **Estado recorrente** (`estado-cnpj/`) | 🟢 fechado como modelo | **9 conferências** — as 3 telas fecham no mesmo número |
| **Ligação com o produto** | 🟡 constantes ligadas, cálculo não | o app lê as tabelas do gerador desde 15/09; nenhuma tela chama o apurador ainda |

### O que a 2ª rodada acrescentou

| Peça | Antes | Agora |
|---|---|---|
| **Vencimento** | ⛔ "é calendário, fora do motor" — eu estava errado | 🟢 `vencimentoDe()`, deslocamento **por tributo** + feriados nacionais 2026-27 |
| **Guia vencida** | ⛔ sem fonte | 🟢 `guiaVencida()` — multa 0,33%/dia travando em 20% no 61º dia, juros Selic +1% |
| **IRRF** | 🟡 tabela de tela de concorrente | 🟢 texto legal, com desconto simplificado e o redutor da Lei 15.270/2025 |
| **CPP no Fator R** | 🔴 **eu tinha errado** | 🟢 **não entra** nos Anexos III e V (art. 26 §2º I "a") |
| **RBT12 = 0** | 💥 lançava erro | 🟢 cai na 1ª faixa, efetiva = nominal |
| **Fator R sem receita** | 💥 caía no Anexo V e **dobrava o imposto** | 🟢 razão infinita → Anexo III |

---

## 1 · O que eu consulto (a matriz reconectada)

Ordem de autoridade. Quando dois discordam, manda o de cima.

| # | Fonte | O que ela decide | Estado |
|---|---|---|---|
| 1 | **Recibo do PGDAS-D e nota fiscal reais** (persona zero) | O valor da guia ao centavo. **Vence lei e vence pesquisa** | 🟢 5 competências |
| 2 | `pesquisa/fontes/2026-09-14-lacunas-motor-fiscal-LITERAL.md` | RBT12 de empresa nova · ISS retido · sublimite | 🟢 lida 100% |
| 3 | `pesquisa/cnae-matriz/anexos-simples/anexo-{iii,v}-simples.md` | Faixas, parcela a deduzir, **repartição por tributo** | 🟢 estatutário |
| 4 | `pesquisa/fiscal-simples-bh-2026.md` | Fator R determinístico? · obrigações mensais · valores 2026 | 🟢 4 rodadas |
| 5 | `pesquisa/cnae-matriz/cnae-matriz.json` | `anexo_fator_r_grupo` dos 1.332 CNAEs | 🟢 87 certeza |
| 6 | `produto/funcionalidades/aliquota-e-enquadramento.md` | As 7 regras da alíquota, com grau de confiança | 🟢 |
| 7 | `pesquisa/cnae-matriz/equacao-viva-camada-2-vars-cnpj.md` | **Quais variáveis o app já captura** | 🟡 27/08, parcial |
| 8 | `execucao/processos/cru/impostos.mjs` + `prolabore.mjs` | O processo em volta do cálculo | 🟢 fechadas |

### 🔴 Duas coisas que já estavam no vault e eu não tinha ligado ao motor

**(a) O Anexo não é `*` aberto — são TRÊS GRUPOS filtráveis.** O Manual do PGDAS-D separa: *não sujeitas ao Fator R* (sempre III) · *sujeitas ao Fator R* (III ou V por cálculo) · *Anexo IV permanente*. E a nossa matriz **já tem isso mapeado**: `anexo_fator_r_grupo` = `III-fixo` (65 CNAEs) · `fator-r-dinamico` (15) · `requer-revisao` (7).

🔑 **Consequência prática:** o motor só precisa rodar Fator R em **15 dos 87 CNAEs**. Nos outros 65 o anexo é III e pronto — o cálculo é desperdício, e pior, a tela que fala de Fator R pra quem é `III-fixo` confunde. **Não existe CNAE de serviço "sempre Anexo V"**: V é resultado, nunca classificação.

**(b) O salário mínimo tinha ressalva vencida.** Eu escrevi em `_tabelas.mjs` que R$1.621 veio de *"fonte única"*. Não vem: o `fiscal-simples-bh-2026.md` já trazia **Decreto 12.797/2025** + INSS gov.br desde 15/07. Ressalva removida.

---

## 2 · Anexos III e V — cobertura

| | Anexo III | Anexo V |
|---|---|---|
| 6 faixas (nominal + parcela a deduzir) | ✅ | ✅ |
| Repartição por tributo, por faixa | ✅ | ✅ |
| Alíquota efetiva com dedução | ✅ | ✅ |
| **Exercitado por invariância** (faixas 1 e 2) | ✅ P09 | ✅ **P16, 15/09** |
| **Regra fechada por fonte oficial** | ✅ | ✅ LC 123 Anexo V + Res. CGSN 140/2018 |
| **Convenção de arredondamento** | ✅ recibo real | ✅ **herdada do III** (mesmo código) |
| Recibo de PGDAS-D em Anexo V | ✅ n/a | 🟡 não temos — e **não bloqueia** |

### 🔴 RECALIBRADO EM 15/09 — o recibo do Anexo V não era portão

A versão anterior desta seção marcava ⛔ na linha do documento e tratava o recibo de PGDAS-D em Anexo V como bloqueio. **Estava errado, e o Pedro derrubou com a pergunta certa:** *"se veio de fonte de governo é confiável desde que esteja atualizado."*

Destrinchando o que compõe um DAS em Anexo V, e de onde cada peça vem:

| Peça | Fonte | Precisa de recibo do V? |
|---|---|---|
| 6 faixas, nominal + parcela a deduzir | LC 123 Anexo V | não |
| Repartição por tributo, por faixa | LC 123 / Manual PGDAS-D | não |
| RBT12, inclusive empresa nova | Res. CGSN 140/2018 art. 24 | não |
| Fator R, numerador e denominador | Res. CGSN 140/2018 art. 26 | não |
| Convenção de arredondamento | recibo real **de Anexo III** | **já resolvido** |

🔑 **O que derruba a exigência:** o arredondamento **não tem caminho próprio por anexo**. É o mesmo código, e o invariante 7 afirma exatamente isso — o DAS do V é soma de 6 parcelas arredondadas, igual ao III, que tem recibo. A diferença entre somar e multiplicar é de **1 centavo**, nunca de reais.

⚠️ O recibo do V segue **desejável** (fecha a última dúvida sobre a repartição aplicada na prática) e passa a ser 🟡 *nice to have*, com o Mauro. Deixou de ser 🔴 bloqueio.

### 📏 A RÉGUA DE PROVA, generalizada

Cada pergunta tem um tipo de fonte que a fecha — e **só ela**:

| Pergunta | Quem fecha | Quem NÃO fecha |
|---|---|---|
| **Qual é a regra?** | fonte oficial vigente (lei, resolução, manual) | documento de um caso; conta do líder |
| **Como o órgão executa na prática?** | documento emitido (recibo, guia, protocolo) | a lei, que é silenciosa sobre arredondamento |
| **O que o concorrente faz?** | evidência — **nunca** autoridade | — |

🔴 **Regra provada por fonte oficial não vira 🟡 por falta de documento daquele caso específico.** Foi o erro de 14/09 no ISS retido (corrigido pelo Pedro; assunto encerrado, ver `_encerrados.mjs` E-ISS [ENCERRADO]) e o de 15/09 aqui. Duas vezes a mesma confusão entre *"não temos recibo deste caso"* e *"não sabemos a regra"*.

✅ **O que fechou em 15/09 foi a outra coluna: o comportamento.** Até então o Anexo V só tinha rodado na **1ª faixa** (pelo P01), e a 1ª faixa é justamente onde a parcela a deduzir é **zero** — a efetiva é igual à nominal, e metade da tabela nunca era tocada. A vida do **P16** (consultoria em TI, RBT12 de R$0 a R$359 mil em 22 competências) atravessa os R$180 mil e faz a parcela de R$4.500 morder.

8 invariantes novos, todos deriváveis da LC 123 sem documento nenhum:

| # | o que afirma | por que importa |
|---|---|---|
| 1 | o V passa da faixa 1 — 14 competências na 2ª | é a lacuna literal; o P01 morria na 1ª |
| 2 | e aí `efetiva < nominal`, sempre | na 1ª faixa elas são iguais, então a 1ª faixa **não prova a tabela** |
| 3 | a efetiva do V só sobe com o RBT12 | 6,00% → 16,75% na vida do P16 |
| 4 | 🔑 a efetiva é **contínua nas bordas** de faixa, nos 2 anexos | em R$180.000 exatos a faixa 1 e a faixa 2 dão o **mesmo** número. Prova que a parcela a deduzir é **calibrada**, e que ler a faixa errada por um centavo não muda a conta |
| 5 | 🔴 **e quebra em f5→f6**, nos dois anexos, no mesmo ponto | ver achado abaixo |
| 6 | a repartição do V soma 1,0000 nas 6 faixas | é o que faz os 6 tributos fecharem com o total |
| 7 | o DAS do V é a **soma das 6 parcelas**, não o produto | mesmo código do III, que tem recibo — o anexo não tem caminho próprio de arredondamento. Diferença pro produto direto: **1 centavo**, nunca reais |
| 8 | a CPP está **dentro** do DAS no V, nas 6 faixas | só o Anexo IV a tira (Res. CGSN 140/2018 art. 2º V), e ele está fora do escopo |

Mais dois de fronteira: o V é **mais caro que o III em todo RBT12 do escopo ME** (R$1 mil a R$360 mil, testado de mil em mil) — é o que torna o Fator R uma decisão e não um detalhe; e o P16 **encosta no teto do ME sem passar** (RBT12 final R$359.000), que é a porta de saída pra EPP.

### 🔴 Achado de 15/09 — a 6ª faixa quebra a continuidade, nas duas tabelas

| | borda | efetiva abaixo | efetiva acima | queda |
|---|---|---|---|---|
| Anexo III | f5→f6, R$3,6 mi | 17,5100% | 15,0000% | **−2,51 pp** |
| Anexo V | f5→f6, R$3,6 mi | 21,2750% | 15,5000% | **−5,7750 pp** |

Nas outras 8 bordas (f1→f2 até f4→f5, nos dois anexos) a efetiva é contínua **ao 12º decimal**. Só a 6ª quebra, e quebra **para baixo** — quem atravessa R$3,6 milhões paga alíquota efetiva **menor** do que quem fica logo abaixo.

É propriedade da **tabela da LC 123**, não do motor: os números de `_tabelas.mjs` estão conferidos contra a lei, e a quebra aparece idêntica nos dois anexos. Fica **registrado e não vira regra** — está a 10× do teto do ME (R$360 mil) e ainda acima do teto do EPP na prática do nosso produto. O invariante afirma exatamente isso: a quebra é **só** na 6ª faixa. Se um dia aparecesse numa borda de baixo, seria erro de digitação na tabela, e o teste derruba a rodada.

### O que ainda falta — e o que só parecia faltar

🟡 **Um recibo de PGDAS-D de empresa em Anexo V.** Desejável, não bloqueante (ver a recalibragem acima). Fonte provável: o Mauro.

🔴 **O que de fato faltava não era prova, era CAMADA.** O motor sabia apurar o Anexo V e não sabia **evitá-lo**. Isso virou o `piloto-pro-labore.mjs` em 15/09 — ver §9.

---

## 3 · Fator R — cobertura

| Regra | Estado |
|---|---|
| Limiar 28% (LC 123 art. 18 §5º-J) | ✅ |
| Margem recomendada 30% (UX-39, **decisão nossa**, não lei) | ✅ separada do limiar |
| **Regime de CAIXA** — declarado ≠ pago | ✅ `fatorRDeCompetencias()` |
| Alerta de competência em risco de glosa | ✅ |
| Anualização da folha em empresa < 13 meses | ✅ art. 26 §4º |
| CPP dentro do DAS no numerador | 🔴 **NÃO entra** nos Anexos III e V (art. 26 §2º I "a") — corrigido em 14/09 |
| Recálculo mês a mês (janela móvel) | ✅ |

🔴 **O regime de caixa muda o anexo, e o teste prova:** a persona zero com tudo pago dá **37,7% → Anexo III**. Se as 4 últimas competências tivessem sido declaradas e não pagas, cai pra **23,0% → Anexo V** — de 6% para 15,5%. O motor avisa **antes** da Receita avisar.

⚠️ **O que ele não faz:** saber se foi pago. Sem conciliação (decisão **31**) e sem Open Finance (09/09), a via é o cliente declarar, com a Carta CFC 1.590/2020 carregando. Mesma doutrina do lucro (item **30**).

---

## 4 · A guia do mês 1 — março ou dezembro, indiferente ✅

**Sim, e está testado** (caso **G6**).

O motor **não tem noção de ano-calendário**. Ele recebe uma série de meses anteriores; quantos são decide a regra:

```
0 meses anteriores  → 1º mês: receita do próprio mês × 12
1 a 11 anteriores   → média × 12
12 ou mais          → soma simples
```

Empresa aberta em **março** e empresa aberta em **dezembro** percorrem o mesmo código. A virada 31/12 → 01/01 é um não-evento: janeiro é só *"o 2º mês"*.

🔑 Era exatamente o medo do item **47** (*"Fator R não pode zerar em 1º de janeiro"*). Não zera, por construção.

✅ **E o mês 1 sem receita devolve R$ 0,00** — provado contra o PGDAS-D de 12/2025 e 01/2026 da persona zero, os dois declarados R$0,00. Não é caso de borda: é o mês 1 da maioria dos nossos clientes, que nascem da constituição e faturam depois.

---

## 5 · Basta para o app, sem folha?

### §2 Impostos — o motor resolve 4 de 8

| # | Funcionalidade | Motor basta? |
|---|---|---|
| 2.1 | DAS do mês: valor e composição | 🟢 **completo** — valor, composição E vencimento com feriados |
| 2.2 | Baixar guia e código de barras | ⛔ não é motor — Serpro/Integra Contador |
| 2.3 | Histórico de guias pagas | ⛔ persistência |
| 2.4 | Saber que foi pago sem perguntar | ⛔ consulta de arrecadação |
| 2.5 | Alíquotas: anexo, ISS e Fator R abertos | 🟢 **100% do motor** |
| 2.6 | Recalcular e reemitir guia vencida | 🟢 `guiaVencida()` · ⏳ falta só **plugar a fonte** da Selic |
| 2.7 | Simulador do mês seguinte | 🟢 é só rodar com receita hipotética |
| 2.8 | Débito automático | ⛔ gateway |

### §3 Notas — o motor entra como consumidor

O motor não emite nota. Ele **dá o ISS da nota** (provado no G2, R$198,89) e **consome a receita** pro RBT12 e pro Fator R. Suficiente para o que lhe cabe.

### §4 Pró-labore — o motor resolve 3 de 7 (mais 2 que estão no arquivo errado)

| # | Funcionalidade | Motor basta? |
|---|---|---|
| 4.1 | Pró-labore interativo | 🟡 a função existe **no outro motor** (ver §6) |
| 4.2 | Fator R com alerta antes de virar a faixa | 🟢 sim |
| 4.3 | Sem pró-labore em mês sem faturamento | 🟢 sim |
| 4.4 | Recibo e informe de rendimentos | ⛔ documento |
| 4.5 | Guia do INSS do pró-labore | 🟢 `darfDoProLabore()` dá INSS + IRRF · ⛔ **emitir** a guia é API |
| 4.6 | Duplo vínculo CLT | 🟡 existe **no outro motor** (ver §6) |
| 4.7 | Alterar pró-labore de mês processado | ⛔ retificação, exige contador |

---

## 5.1 · 🎯 O que falta pra fechar as 15, de verdade

Pergunta do Pedro em 14/09: *"por que não fechamos todos? precisamos correr atrás."*

As 8 que o motor não resolve **não estão pela metade** — elas nunca foram trabalho de cálculo. E o bom da notícia é que **não são 8 frentes: são 3.**

### Frente 1 · Serpro Integra Contador — fecha 4 de uma vez

| Fecha | Funcionalidade |
|---|---|
| **2.2** | Baixar a guia e o código de barras |
| **2.4** | Saber que foi pago sem perguntar ao cliente |
| **4.5** | Emitir a guia do INSS do pró-labore |
| **5.8** | A trava da DEFIS (sem ela o PGDAS-D de março não transmite) |

Uma integração cobre **PGDAS-D, DEFIS, eSocial e DCTFWeb**, e **não exige procuração e-CAC** quando se usa o certificado A1 da própria empresa. Custo relatado: ~R$300/mês por escritório no pacote inicial.

🔑 **É o maior desbloqueio isolado que existe na lista**, e o `_matriz-dependencia.md` já diz que o risco técnico caiu: a API existe e é documentada.

### Frente 2 · Persistência — fecha 1, e habilita tudo

| Fecha | Funcionalidade |
|---|---|
| **2.3** | Histórico de guias pagas |

Parece pequeno e não é: **é o estado recorrente ganhando lugar para morar**. Hoje o modelo existe (`estado-cnpj/`) e não há onde guardar. Sem isso nenhuma tela lembra de nada entre sessões.

### Frente 3 · Documento e gateway — 3 que são decisão, não engenharia

| | Funcionalidade | O que realmente é |
|---|---|---|
| **2.8** | Débito automático do DAS | 🏢 decisão comercial — *"pagar o DAS pelo app" já morreu em 27/07*; débito automático é outra coisa e não foi decidido |
| **4.4** | Recibo e informe de rendimentos | geração de documento. ⚠️ E carrega a regra dura de 14/09: **documento que o órgão obriga a empresa a entregar ao sócio nunca fica atrás de pendência comercial** |
| **4.7** | Alterar pró-labore de mês processado | retificação de obrigação acessória — **exige contador**, e o P4 cobre pedir e cobrar, não executar |

### E 2 que já estão prontas, no arquivo errado

**4.1** (pró-labore interativo) e **4.6** (duplo vínculo CLT) dependem de `proLaboreOtimo`, `naBorda` e `custoProLabore` — que **existem**, só vivem no `fiscal.ts`. Resolver os dois motores (§6) fecha as duas **sem escrever regra nova**.

### 📊 O placar honesto de "fechar tudo"

| | Quantas | Custo |
|---|---:|---|
| 🟢 Já resolvidas pelo motor | **7** | feito |
| 🔧 Resolver os dois motores | **+2** | horas |
| 🔌 Serpro Integra Contador | **+4** | contratar e integrar |
| 💾 Persistência | **+1** | infra |
| 🏢 Decisão sua, não engenharia | **3** | 2.8 · 4.4 · 4.7 |

🔑 **Fechar as 15 não é "correr atrás do que ficou pela metade".** É: consertar a duplicação (barato), contratar o Serpro (a maior alavanca), dar casa ao estado, e tomar 3 decisões.

---

## 6 · ✅ O débito dos dois motores — PAGO em 15/09

> O Pedro mandou: *"vamos resolver os dois motores"*. Resolvido, e o diagnóstico virou conserto.

### O que era, e o que virou

| | Antes | Agora |
|---|---|---|
| **7 constantes fiscais** | duplicadas nos dois arquivos | 🟢 **fonte única** em `_tabelas.mjs`, geradas para `app/src/lib/fiscal-tabelas.ts` |
| **`brl()`** | mesmo nome, **unidades diferentes** (reais × centavos) | 🟢 `brl(reais)` no app, `brlDeCentavos(centavos)` no motor |
| **`IRRF_ISENCAO: 5000`** | nome descrevia mecanismo que não existe | 🟢 `IRRF_REDUTOR_TETO` + `IRRF_REDUTOR_RAMPA` |
| **INSS com folga de CLT** | só no `fiscal.ts`; o apurador ignorava | 🟢 portado para `darfDoProLabore()` — **fecha a 4.6** |

🔑 **A duplicação morreu por construção, não por disciplina.** O gerador `gerar-tabelas-app.mjs` emite o arquivo que o app consome, e o arquivo gerado **não se edita**. É o mesmo padrão de `dados-constituicao.ts` e `processos-graph.json`.

### Como cada arquivo ficou

**`app/src/lib/fiscal.ts`** tem agora **um papel só**: o **custo de abrir** (`CUSTOS`, usado por 25 arquivos) e a formatação da UI (`brl`, usada por 21). Mais `MEI_TETO_MENSAL`, que fica lá de propósito — **MEI está fora do escopo do apurador**, e é dado de gate de entrada, não de apuração.

**`execucao/motor-fiscal/`** é a fonte de tudo que é regra fiscal.

⚠️ **`proLaboreOtimo` e `naBorda` continuam no `fiscal.ts`, e isso é deliberado:** os dois miram a **margem de 30%**, que é 🏢 recomendação nossa (UX-39), não a lei dos 28%. São conselho de interface, não apuração — e o limiar legal que eles usam vem do mesmo gerador.

### Verificação

`tsc --noEmit` limpo · lint sem nenhum apontamento nos arquivos tocados · **45 conferências** no motor e **9** no estado recorrente.

## 7 · As variáveis cobertas, pro cliente travado

| Variável | Motor usa? | O app captura? |
|---|---|---|
| Receita do mês | ✅ | ✅ `/emitir`, `/notas` — 🔴 **mock isolado** |
| Série de receita (RBT12) | ✅ | 🔴 não há estado recorrente |
| Anexo (III × V) | ✅ | ✅ derivado do CNAE + Fator R |
| Grupo do CNAE (`III-fixo` × `dinâmico`) | 🟡 **não lido ainda** | ✅ está na `cnae-matriz.json` |
| Pró-labore **declarado** | ✅ | ✅ `/pro-labore` — 🔴 mock |
| Pró-labore **pago** (caixa) | ✅ | ⛔ **não existe estado** — é o `P5.8` |
| Meses de atividade | ✅ | 🟡 depende da data de abertura no CNPJ |
| ISS retido | ✅ | ⛔ sem tela |
| Município do tomador | ✅ `retencaoLegitima()` | 🟡 capturado na nota |
| CLT do sócio | 🟡 no outro motor | ✅ 1× na abertura, **não revalidado** |
| Folha de colaborador | ⛔ fora por ora | ⛔ |

🔴 **O gargalo não é o motor, é o dado.** O motor calcula certo sobre o que recebe; o app ainda não tem **estado recorrente de CNPJ** — `/pro-labore` roda com `FAT = 6000` fixo e `/notas` tem o próprio mock, e as duas não se leem (achado de 27/08 que segue aberto).

---

## O que AINDA falta — depois da 2ª rodada

Os itens 2, 3 e 4 da lista original **fecharam**. Sobrou isto:

1. 🔴 **Resolver os dois motores** (§6) — segue sendo o débito ativo. `proLaboreOtimo`, `naBorda` e `custoProLabore` só existem no `fiscal.ts`.
2. 🔴 **Plugar em um cliente.** O modelo é agnóstico de propósito, mas enquanto ninguém o chama, as três telas continuam com mocks contraditórios.
3. ✅ **Anexo V além da faixa 1 — FECHADO em 15/09** pela vida do P16, e a exigência de recibo foi **recalibrada** no mesmo dia (§2): a regra fecha por fonte oficial, e a convenção de arredondamento é herdada do III. O recibo virou 🟡, não ⛔.
4. ⏳ **4 lacunas**, e só uma incomoda:

| | Lacuna | Peso |
|---|---|---|
| **L10** | 🔴 O pró-labore **não é obrigatório por lei** — é 🏢 decisão nossa, não ⚖️ obrigação | **A copy não pode dizer "a lei exige".** Sustenta a decisão 36 e merece o olho da Larissa |
| **L7b** | Feriado **municipal** de BH desloca guia **federal**? | pergunta pro Ademar |
| **L9b** | De onde buscar a Selic (a fórmula está fechada) | é fonte, não regra |
| **L5** | CBS/IBS no Simples (LC 214/2025) | horizonte 2027 |

## 9 · 🛩️ O PILOTO DE PRÓ-LABORE — nasceu em 15/09

> Decisão do Pedro: *"não é sobre avisar cedo ou tarde, é sobre também aplicar a regra de ajuste automático de pró-labore desde o início para os usuários, eles não precisam saber sobre isso."*

`piloto-pro-labore.mjs` + `verificar-piloto.mjs`, **41 conferências**. O apurador olha pra trás; o piloto olha pra frente e decide **quanto pagar agora** pra empresa seguir no Anexo III depois.

**Por que tinha que ser ação e não alerta:** o Fator R lê os 12 meses **anteriores**, então o pró-labore de hoje só produz efeito em `m+1 … m+12`. Medido no P01: quem corrige em set/2026 só volta ao III em **ago/2027**, 11 meses pagando 15,5% com a folha já certa. Alerta chega tarde **por construção**.

**Em quem encosta:** só nos **15** CNAEs `fator-r-dinamico`. Nos **65** `III-fixo` devolve `atua: false` e **proíbe a tela de falar em 28%**. Nos **7** `requer-revisao`, se recusa.

### 🔴 Os dois achados que os testes produziram

**(1) Manutenção ≠ recuperação.** A 1ª versão mandou pagar **R$72.169 num mês** — matematicamente certo, e insano: tentava consertar um ano de atraso numa competência. Agora separa `sugerido` (o sustentável, `alvo × receita do mês`) de `paraVirarJa` (quitar o déficit), e **nunca funde os dois num número só**.

**(2) Pagar o sustentável compensa em 100% da faixa do ME.** Varredura de receita R$2 mil-30 mil × RBT12 R$24 mil-360 mil: pior saldo **+R$163/mês**. 🔑 **É isso que autoriza pilotar no automático sem perguntar** — dentro do nosso escopo a resposta nunca é "não". O teste falha se um dia deixar de ser verdade. O que pode não valer é o **salto** da recuperação, e aí o alerta é de revisão humana.

### ⚠️ A fronteira com a trava de persona

A trava diz **INFORMAR, nunca TUTELAR**. Ajustar sozinho não é tutela: tutelar é reter decisão que é do cliente; isto é executar o serviço contratado. O número é sempre explicável na tela e o cliente pode sobrepor — o que não fazemos é **exigir que ele decida** pra conta sair certa.

### Os 5 limites declarados (`LIMITES_DO_PILOTO`)

| | O quê | Dono |
|---|---|---|
| **PP1** | Decide o valor; não sabe se foi **pago** (regime de caixa) | produto |
| **PP2** | Usa a receita **já emitida**, não a esperada — a margem de 30% compra essa folga | produto |
| **PP3** | Não compara pró-labore contra distribuição de lucro (Lei 15.270/2025) | Mauro |
| **PP4** | Os 7 CNAEs `requer-revisao` não são pilotáveis | Larissa |
| **PP5** | Folha de colaborador não entra (nenhuma persona tem funcionário) | produto |

## Links
[[PERSONA]] · [[PENDENCIAS]] · [[2026-09-14-lacunas-motor-fiscal-lidas]] · [[anexo-iii-simples]] · [[anexo-v-simples]] · [[fiscal-simples-bh-2026]] · [[aliquota-e-enquadramento]] · [[equacao-viva-camada-2-vars-cnpj]] · [[FUNCIONALIDADES]]
