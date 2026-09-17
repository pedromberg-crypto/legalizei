---
tipo: fato
status: vivo
data: 2026-09-13
assunto: teardown-prolabore-pgdas-conta-real
autoridade: fonte-verdade
tags: [evidencia, contabilizei, fator-r, pro-labore, pgdas, simples-nacional]
---

# Teardown 13/09 — pró-labore e PGDAS na conta real

> 🧭 **O que é:** leitura da conta logada do Pedro na Contabilizei, em 13/09/2026, depois da
> pesquisa fiscal do mesmo dia. **Só leitura**, nada foi escrito na plataforma.
>
> 🔑 Objetivo: responder a P2.4 do [[PERSONA]] (como o líder recalcula o pró-labore em mês
> sem faturamento) e conferir os números da pesquisa contra dado real.

**Rendeu 5 achados, e dois deles corrigem coisas que eu tinha afirmado antes.**

---

## 1. 🔴 O 5,99987% RESOLVIDO — e não era o que eu supunha

O recibo oficial do PGDAS-D de **agosto/2026**, emitido pela Receita Federal:

```
Receita Bruta Auferida ....... R$ 7.910,00
Total do Débito Declarado .... R$   474,59
Transmissão .................. 01/09/2026 07:35:17
Número do Recibo ............. 01.07.26244.0049312-9
```

`474,59 ÷ 7.910,00 = 5,99987%`. **É exatamente o número que estava pendurado como hipótese
desde 12/09.** E ele não vem de proporcionalização de RBT12, como eu tinha proposto — vem de
**arredondamento por tributo**.

A conta, refeita e batendo ao centavo:

| Tributo | Repartição Anexo III faixa 1 | Bruto | Arredondado |
|---|---:|---:|---:|
| IRPJ | 4,00% | 18,9840 | **18,98** |
| CSLL | 3,50% | 16,6110 | **16,61** |
| COFINS | 12,82% | 60,84372 | **60,84** |
| PIS/PASEP | 2,78% | 13,19388 | **13,19** |
| CPP | 43,40% | 205,9764 | **205,98** |
| ISS | 33,50% | 158,9910 | **158,99** |
| | | 474,60 | **474,59** |

🔑 **O DAS é a SOMA DE SEIS PARCELAS ARREDONDADAS, não o arredondamento do produto.**
`7.910 × 6% = 474,60`, mas a guia sai **R$ 474,59**. O centavo some no arredondamento das
partes.

🔴 **Requisito direto pro nosso motor:** calcular por tributo, arredondar cada um, somar.
Quem calcula `receita × alíquota` erra centavos em toda guia — e guia com valor diferente do
PGDAS é divergência com a Receita, não detalhe cosmético.

✅ **Segunda confirmação, independente:** o ISS da nota 6 (setembro) é R$ 198,89.
`9.895 × 6% = 593,70` · `593,70 × 33,50% = 198,8895` → **198,89**. Mesmo comportamento.

---

## 2. 🔴 A empresa está no ANEXO III, não no V — eu tinha afirmado errado

Em 12/09 eu li `anexoEscolhido: 5` no payload e escrevi "Anexo V" na evidência e na persona.
**O 5 é id interno do líder, não o número do anexo.** Três provas:

1. O recibo oficial da Receita fecha em **6,00%** de alíquota efetiva
2. A própria nota fiscal escreve: *"Conforme Lei 12.741/2012, o percentual total de impostos
   incidentes neste serviço prestado é de aproximadamente 6,00%"*
3. A repartição do ISS só fecha no Anexo III: `6% × 33,50% = 2,010%`, que é o ISS real da
   nota. No Anexo V daria `15,5% × 14,00% = 2,17%`, que não bate

---

## 3. 🔑 O motor do líder mudou o pró-labore sozinho, e dá pra ver o mês exato

`GET /api/plataforma/prolabore/central/historico/{idSocio}`

| Competência | Pró-labore | Desconto (INSS 11%) |
|---|---:|---:|
| Março/2026 | R$ 3.360,00 | R$ 369,60 |
| Abril/2026 | R$ 3.360,00 | R$ 369,60 |
| **Maio/2026** | **R$ 1.621,00** | R$ 178,31 |
| Junho a Agosto/2026 | R$ 1.621,00 | R$ 178,31 |

`dataUltimaAtualizacao: 01/06/2026` · `tipoGerenciamento: "INTELIGENTE"` · `elegivelNoMotor: true`

- **R$ 3.360,00 = 0,28 × 12.000 EXATO** — enquanto a receita era regular, ele pagava o **alvo
  exato do Fator R**. Não é preset de radio button, é conta.
- **R$ 1.621,00 = salário mínimo de 2026** — o piso legal, e o mesmo número que a pesquisa
  do mesmo dia trouxe de fonte única. **Confirmado em produção.**

### E a receita, mês a mês

`GET /api/plataforma/notafiscal/consultar/list/{mes}/{ano}`

```
dez/25   0   ·  jan  0   ·  fev 12.000  ·  mar 12.000  ·  abr 12.000
mai/26   0   ·  jun 12.000 · jul  0     ·  ago  7.910  ·  set  9.895
```

🔑 **Maio foi o primeiro mês com receita zero, e é exatamente o mês da queda.** O motor
recalculou no fechamento de maio, desceu do alvo do Fator R para o piso, e **não voltou a
subir** quando o faturamento retornou em junho.

**A regra dele não é "manter o Fator R em 28%". É pagar o MENOR valor que ainda segura o
anexo barato.**

---

## 4. 🔴 Mês sem faturamento AJUDA o Fator R — eu tinha invertido no mapa

O `L3` do mapa de pró-labore dizia que não pagar "derruba o Fator R". Estava juntando duas
coisas opostas:

- **não PAGAR** derruba (o numerador para)
- **não FATURAR**, com pró-labore pago, **empurra pra cima** (o denominador para, o numerador
  anda)

Foi isso que deu folga ao motor em maio.

### A anualização, provada nesta empresa

Empresa com 9 meses de vida, então os dois lados anualizam (Res. CGSN 140/2018 art. 26 §4º):

| | Valor | Fator R | Anexo |
|---|---:|---:|---|
| Folha **anualizada** | ≈ R$ 22.085 | **29,6%** | **III · 6%** ✅ |
| Folha **crua** | R$ 16.564 | 22,2% | V · 15,5% ❌ |

**O erro que a pesquisa chama de "falha comum de sistema" custaria, nesta empresa real, mais
que o dobro de imposto.**

⚠️ A conta assume pró-labore de fevereiro = R$ 3.360 e dezembro/janeiro = 0, porque o
histórico da plataforma só devolve 6 meses. A direção não muda; o número exato, sim.

---

## 5. Obrigação acessória não pausa, e quem transmite é o contador

`GET /api/plataforma/declaracao/mensal/declaracoes/{mes}/{ano}`

**Maio/2026, receita zero: PGDAS TRANSMITIDO e DCTFWeb TRANSMITIDO**, igual a todos os outros
meses. Confirma o §3.3 da pesquisa em produção.

⚠️ **Mas não testa o caso "sem movimento"**: em maio o pró-labore de R$ 1.621 foi pago, então
houve fato gerador. O mês verdadeiramente sem movimento continua sem evidência nossa.

🔑 **E o recibo mostra quem assina:** o CPF do responsável pela transmissão **não é o do
Pedro**, e o IP é de servidor em nuvem. O contador transmite em nome do cliente, da
infraestrutura dele. Junto com o `MEUCNPJ@CONTABILIZEI.COM.BR` que está no Cartão CNPJ, forma
um padrão: **o líder se coloca como o interlocutor oficial da empresa perante o governo.**
É decisão nossa se replicamos.

---

## 6. Campos do payload que ainda não sabemos o que fazem

`GET /api/plataforma/prolabore/central/init`

| Campo | Valor | Nota |
|---|---|---|
| `deveExibirAlertaDividendos` | `false` | 🔑 o alerta de dividendos EXISTE no produto deles. O Pedro disse que nunca viu o assunto — é porque não acendeu, não porque não há. Pista pra P2.3 |
| `nomesDependentes` | `null` | o campo existe lá; nós decidimos não captar dependente de sócio |
| `baseCalculoIrrf` | `5000` | não sabemos de onde sai |
| `valorProlaboreMinimo` | `null` | vazio mesmo com o piso sendo aplicado na prática |
| `zerarProlabore` | `false` | existe uma ação de zerar |
| `fluxoAssessorPendente` | `false` | a gestão automática tem humano no meio quando é `true` |

---

## O que isto muda no nosso lado

| | Onde |
|---|---|
| DAS = soma de 6 parcelas arredondadas | 🏛 Impostos, ainda não aplicado |
| Anexo III, não V | [[PERSONA]] · corrigido |
| Mês sem faturar ajuda o Fator R | `cru/prolabore.mjs` `L3` · corrigido |
| Anualização dos dois lados | `cru/prolabore.mjs` `L4b` · corrigido |
| Piso R$ 1.621 e teto R$ 8.475,55 | `cru/prolabore.mjs` `L9` · aplicado |

## Links
- [[PERSONA]] · `execucao/processos/cru/prolabore.mjs`
- Pesquisa que originou: `pesquisa/prompts/2026-09-13-motor-fiscal-fator-r-rbt12-prolabore.md`
- Retorno literal: `produto/me/_evidencias/fontes/pesquisa-motor-fiscal-2026-09-13/`
- Teardown anterior: [[2026-09-12-contabilizei-emissao-nf-fluxo-completo]]
