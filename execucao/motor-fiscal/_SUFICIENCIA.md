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

🟢 **O motor basta para 6 das 8 funcionalidades de Impostos e para 4 das 7 de Pró-labore.** O que falta nas outras **não é cálculo** — é API, persistência, documento ou calendário. E há **um débito nosso**: existem dois motores no repo, e eles não se falam.

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
| CPP dentro do DAS no numerador | ✅ SC COSIT 17/2021 |
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

### §2 Impostos — 6 de 8

| # | Funcionalidade | Motor basta? |
|---|---|---|
| 2.1 | DAS do mês: valor e composição | 🟢 sim · ⚠️ **vencimento não** (dia 20, prorroga em dia não útil — é calendário, não cálculo) |
| 2.2 | Baixar guia e código de barras | ⛔ não é motor — Serpro/Integra Contador |
| 2.3 | Histórico de guias pagas | ⛔ persistência |
| 2.4 | Saber que foi pago sem perguntar | ⛔ consulta de arrecadação |
| 2.5 | Alíquotas: anexo, ISS e Fator R abertos | 🟢 **100% do motor** |
| 2.6 | Recalcular e reemitir guia vencida | 🟡 recalcula ✅, mas **falta juros, multa e Selic** |
| 2.7 | Simulador do mês seguinte | 🟢 é só rodar com receita hipotética |
| 2.8 | Débito automático | ⛔ gateway |

### §3 Notas — o motor entra como consumidor

O motor não emite nota. Ele **dá o ISS da nota** (provado no G2, R$198,89) e **consome a receita** pro RBT12 e pro Fator R. Suficiente para o que lhe cabe.

### §4 Pró-labore — 4 de 7

| # | Funcionalidade | Motor basta? |
|---|---|---|
| 4.1 | Pró-labore interativo | 🟡 a função existe **no outro motor** (ver §6) |
| 4.2 | Fator R com alerta antes de virar a faixa | 🟢 sim |
| 4.3 | Sem pró-labore em mês sem faturamento | 🟢 sim |
| 4.4 | Recibo e informe de rendimentos | ⛔ documento |
| 4.5 | Guia do INSS do pró-labore | 🟡 tem a alíquota e o teto; **não gera guia** |
| 4.6 | Duplo vínculo CLT | 🟡 existe **no outro motor** (ver §6) |
| 4.7 | Alterar pró-labore de mês processado | ⛔ retificação, exige contador |

🔑 **Padrão:** tudo que falta é **integração, persistência, documento ou calendário**. Nenhum buraco de cálculo restante dentro do escopo, exceto juros/multa (2.6).

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

⚠️ **Duas fontes da mesma verdade é como nasce divergência de centavo em produção.** Decidir: portar as três pro apurador e deixar o `fiscal.ts` só com custo de abertura, ou o contrário. **Não fazer as duas coisas.**

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

## O que fecha o motor de vez

1. 🔴 **Resolver os dois motores** (§6) — é débito ativo, não melhoria.
2. 🟡 **Ler o `anexo_fator_r_grupo`** e só rodar Fator R nos 15 CNAEs dinâmicos.
3. 🟡 **Juros, multa e Selic** da guia vencida (funcionalidade 2.6).
4. 🟡 **Calendário de vencimento** — dia 20, **prorroga** em dia não útil (ao contrário do DARF, que antecipa).
5. ⛔ **Anexo V e faixas 2-6 continuam sem prova real.** Só sai com uma segunda empresa.
6. ⏳ **L4** (Res. CGSN 190/2026) e **L5** (LC 214/2025, CBS/IBS) seguem abertas.

## Links
[[PERSONA]] · [[PENDENCIAS]] · [[2026-09-14-lacunas-motor-fiscal-lidas]] · [[anexo-iii-simples]] · [[anexo-v-simples]] · [[fiscal-simples-bh-2026]] · [[aliquota-e-enquadramento]] · [[equacao-viva-camada-2-vars-cnpj]] · [[FUNCIONALIDADES]]
