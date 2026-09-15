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
| **Motor fiscal** (`motor-fiscal/`) | 🟢 fechado como cálculo | **41 conferências** contra recibo do PGDAS-D, nota fiscal real e texto legal |
| **Estado recorrente** (`estado-cnpj/`) | 🟢 fechado como modelo | **9 conferências** — as 3 telas fecham no mesmo número |
| **Ligação com o produto** | 🔴 **não existe** | nenhuma tela chama nenhum dos dois |

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
| Testado contra documento real | ✅ faixa 1 | ⛔ **nenhum** |

🟡 **O Anexo V está implementado e não está provado.** A tabela é estatutária (conferida contra a LC 123 em 17/07), mas a persona zero é Anexo III faixa 1 — **nenhuma competência real exercita o V**, nem faixas 2 a 6 de qualquer anexo.

Não é bug: é o limite do único caso real que temos. Entra na lista do que a persona zero não prova, e só sai com uma segunda empresa.

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

## 6 · 🔴 O débito: existem DOIS motores, e eles não se falam

| | `app/src/lib/fiscal.ts` | `execucao/motor-fiscal/` |
|---|---|---|
| Papel | **estimador de abertura** | **apurador de competência** |
| Linguagem | TypeScript, consumido pelo app | `.mjs`, rodável e testado |
| Testes | nenhum | 24 conferências |

Três funções vivem **só** no `fiscal.ts` e são exatamente as que faltam nas funcionalidades 4.1 e 4.6:

- `proLaboreOtimo(fat)` — a sugestão que mira 30%
- `naBorda(folhaPct)` — o aviso de 28-30%
- `custoProLabore(proLabore, cltRemun)` — INSS do sócio **consumindo a folga do teto por CLT**

### 📏 A duplicação, medida em 14/09

**7 de 7 constantes fiscais existem nos dois arquivos, com o mesmo valor:**

| `fiscal.ts` | `motor-fiscal/` |
|---|---|
| `SALARIO_MIN: 1621` | `PREVIDENCIA.SALARIO_MINIMO` |
| `TETO_INSS: 8475.55` | `PREVIDENCIA.TETO_INSS` |
| `INSS_ALIQ: 0.11` | `PREVIDENCIA.ALIQUOTA_SOCIO` |
| `FATOR_R_LIMIAR: 0.28` | `FATOR_R.LIMIAR` |
| `FATOR_R_MARGEM: 0.3` | `FATOR_R.MARGEM` |
| `ANEXO_III: 0.06` | `FAIXAS.III[0].nominal` |
| `ANEXO_V: 0.155` | `FAIXAS.V[0].nominal` |

🔑 **Ainda não quebrou porque os valores coincidem.** Basta a lei mudar um deles — e o salário mínimo muda **todo janeiro** — para os dois lados divergirem em silêncio.

### 🔴 E tem uma armadilha pior que duplicação: `brl()`

As duas existem, com o mesmo nome e a mesma finalidade, e **unidades diferentes**:

| chamada | `fiscal.ts` | `motor-fiscal/` |
|---|---|---|
| `brl(474.59)` | **"R$ 475"** ← reais, e sem centavos por padrão | "R$ 4,75" |
| `brl(47459)` | "R$ 47.459" | **"R$ 474,59"** ← centavos |

Importar a errada erra por **100×**, e o TypeScript não acusa: as duas assinaturas aceitam `number`. É o tipo de bug que passa em revisão e aparece na fatura do cliente.

### 🏷️ E uma constante com nome errado

`fiscal.ts` tem `IRRF_ISENCAO: 5000 // isenção efetiva/mês (Lei 15.270/2025)`.

Depois da pesquisa de 14/09 sabemos que **não é isenção**: R$5.000 é o **teto do rendimento que o redutor zera**, e acima disso há uma rampa até R$7.350. O nome descreve um mecanismo que não existe — e quem ler vai implementar uma faixa isenta que a lei não criou.

### O que decidir na volta

Portar as três funções órfãs (`proLaboreOtimo`, `naBorda`, `custoProLabore`) pro apurador e deixar o `fiscal.ts` só com **custo de abertura** — que é papel legítimo e não conflita. Ou o inverso. **Não fazer as duas coisas.**

---

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
3. ⛔ **Anexo V e faixas 2-6 sem prova real.** A tabela está implementada e conferida contra a lei; falta uma **segunda empresa** que exercite.
4. ⏳ **4 lacunas**, e só uma incomoda:

| | Lacuna | Peso |
|---|---|---|
| **L10** | 🔴 O pró-labore **não é obrigatório por lei** — é 🏢 decisão nossa, não ⚖️ obrigação | **A copy não pode dizer "a lei exige".** Sustenta a decisão 36 e merece o olho da Larissa |
| **L7b** | Feriado **municipal** de BH desloca guia **federal**? | pergunta pro Ademar |
| **L9b** | De onde buscar a Selic (a fórmula está fechada) | é fonte, não regra |
| **L5** | CBS/IBS no Simples (LC 214/2025) | horizonte 2027 |

## Links
[[PERSONA]] · [[PENDENCIAS]] · [[2026-09-14-lacunas-motor-fiscal-lidas]] · [[anexo-iii-simples]] · [[anexo-v-simples]] · [[fiscal-simples-bh-2026]] · [[aliquota-e-enquadramento]] · [[equacao-viva-camada-2-vars-cnpj]] · [[FUNCIONALIDADES]]
