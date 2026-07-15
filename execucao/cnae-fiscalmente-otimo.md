---
tipo: spec
data: 2026-07-15
status: hipotese-validar-larissa
tags: [produto, fiscal, cnae, planejamento-tributario, moat, motor]
---

# 🎯 CNAE fiscalmente ótimo — famílias de CNAEs equivalentes

> **A feature-âncora do produto:** depois que a IA acerta o CNAE que descreve a atividade, o app recomenda, **entre os CNAEs que também emitem NF válida pra mesma atividade**, o que faz pagar **menos imposto**. É o segredo do contador bom, self-service. Irmão do **pró-labore ótimo** (mesma alma: mínimo imposto legal). Companheiro de [[blocos-fluxo-abertura]] · [[fiscal-simples-bh-2026]] · [[perguntas-larissa-fiscal]].
>
> 🚧 **A linha dura (anti-passivo):** só é planejamento (legal) se **os dois CNAEs realmente cobrem a atividade real** da pessoa. Recomendar código que não bate com o que ela faz = evasão → NF inválida, exclusão do Simples, responsabilidade nossa. Motor otimiza **dentro do que a atividade permite**; **Larissa assina cada família**.

## As DUAS alavancas (complementares)
| Alavanca | O que faz | Melhor pra quem | Estado |
|---|---|---|---|
| **1. Fator R** (mesmo CNAE, ajusta pró-labore) | folha ≥28% → Anexo III | quem **pode** pagar pró-labore alto | ✅ construída (pró-labore ótimo, B2.8) |
| **2. CNAE-swap** (troca pra código de menor carga que cobre a mesma atividade) | fugir do Fator R pra um CNAE **sempre Anexo III** (§5º-B), ou menor ISS | quem **não** pode inflar pró-labore (**solo/baixa folha = nosso ICP!**) | 🆕 esta nota |

> **Insight-chave:** a alavanca 2 vale MAIS justamente pro ICP solo/baixa-folha, onde o Fator R não ajuda (folha nunca chega a 28%). As duas se completam: Fator R pra quem tem folga de caixa; CNAE-swap pra quem não tem.

---

## 🧱 SHAPE — família de CNAEs equivalentes
Uma família = um cluster de atividade real + os CNAEs que a cobrem, cada um com seu custo fiscal.

```
familia:
  id: string                     # slug do cluster (ex: "treinamento-vs-consultoria")
  atividade_real: string         # o que a pessoa faz, linguagem humana
  gatilho: string[]              # frases/descrições que caem nessa família (liga ao B1)
  cnaes:
    - cnae: "0000-0/00"
      descricao_oficial: string
      fator_r: bool              # sujeito ao Fator R?
      anexo: "III" | "IV" | "V" | "III|V (Fator R)"
      aliquota_inicial: number   # 1ª faixa (III=6% · V=15,5%) — de fiscal-simples-bh-2026
      iss_bh: number             # alíquota ISS municipal BH (🟡 mapear LC 116 → BH)
      cobre_atividade: string    # POR QUE emite NF válida pra essa atividade (justificativa)
      confianca: "alta"|"media"|"baixa"
      fonte: "url / lei"
  otimo:                         # COMPUTADO pelo motor, não hardcoded
    cnae: string                 # menor carga entre os que cobrem a atividade
    economia_vs_pior: string     # delta em R$/% (depende do faturamento)
  guardrail: string              # condição de validade (a atividade real tem que casar)
  assinado_larissa: bool         # nenhuma família entra em produção sem isso
```

---

## 🔬 Exemplo real #1 (aterrado + honestamente marcado)
**Família:** `treinamento-vs-consultoria` · **Atividade real:** "dou treinamentos corporativos e oriento gestão de equipes" (capacitação + orientação — muito comum).

| CNAE | Descrição | Fator R? | Anexo | Alíq. inicial | ISS BH | Cobre a atividade? | Conf. |
|---|---|---|---|---|---|---|---|
| **7020-4/00** | Consultoria em gestão empresarial | **Sim** | III se folha≥28%, senão **V** | **15,5%** (se V) | 🟡 mapear | sim, se o foco é aconselhar gestão | 🟢 (Fator R confirmado) |
| **8599-6/04** | Treinamento em desenvolvimento profissional e gerencial | **Não** (§5º-B) | **III fixo** | **6,0%** | 🟡 mapear | sim, se o foco é capacitar/dar curso | 🟡 (§5º-B = ensino Anexo III; **confirmar que NÃO cai em Fator R** via §5º-D/M) |

**A jogada:** um profissional **solo** que dá treinamento + orienta, se registrado como **7020-4 (consultoria)** e sem folha, cai no **Anexo V (15,5%)**. A **mesma entrega** (NF de capacitação/orientação) sob **8599-6/04 (treinamento)** é **Anexo III (6%) sem precisar de Fator R**.

**Delta (1ª faixa, receita R$15.000/mês):** (15,5% − 6%) × 15.000 = **~R$1.425/mês (~R$17k/ano)**, *supondo* o cenário V no lado consultoria. Valores de alíquota = [[fiscal-simples-bh-2026]] CONSOLIDADO (🟢); o mapeamento CNAE→anexo do lado 8599 = 🟡 pendente Larissa.

**Guardrail:** só vale se a pessoa **realmente dá treinamento** (não consultoria pura relabelada). A NF descreve o serviço prestado; o fisco cruza atividade × CNAE × NF. Larissa assina a equivalência.

**Por que é o exemplo certo pro nosso ICP:** o ganho aparece **sem exigir pró-labore alto** — exatamente onde o Fator R não salva o solo de baixa folha.

---

## ⚠️ O que a busca de hoje travou (anti-guru)
- 🟢 Confirmado: Anexo III começa 6% · Anexo V 15,5% · §5º-B lista **ensino/treinamento** e **reparo/manutenção** como **Anexo III**.
- 🔴 Derrubado: hipótese de que "agência de publicidade `7311-4/00` é sempre III" — **é Fator R** (III ou V). Não usar.
- 🟡 A verificar (vira pergunta H+ pra Larissa): `8599-6/04` é Anexo III **sem** Fator R de fato? (a fonte alerta que alguns §5º-B ainda pegam Fator R via §5º-D). **Esse é o claim que sustenta o exemplo.**

Fontes: [contabilidade.com 7319-0/04](https://contabilidade.com/blog/cnae7319004-consultoria-em-publicidade-e-propaganda-simples-nacional-fator-r-e-abertura-de-empresa/) · [contabilizei Anexo III](https://www.contabilizei.com.br/contabilidade-online/anexo-3-simples-nacional/) · [Planalto LC 123 §5º-B](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm)

---

## 🛠️ Como entra no motor (próximo passo)
1. Entrada dublada `cnae_equivalentes` na persona (a família acima).
2. Passo novo **`b2.cnae_otimo`** (entre b1.mapeamento e o simulador): recebe a família, calcula a carga de cada CNAE (anexo + ISS), ranqueia, retorna o ótimo + delta.
3. Guarda-corpos no flow: mostrar **por que** o alternativo é válido + **confirmar com o usuário** + trilha de auditoria. Nunca trocar em silêncio.
4. Persona de teste: reaproveita o exemplo #1 (treinamento vs consultoria).

## 🔴 Dependências (crescem com a feature)
- **Larissa** assina cada família (equivalência jurídica) + confirma o claim 🟡 do 8599.
- **Mapa ISS BH** (LC 116 → alíquota municipal por código de serviço) — nova camada de dado.
- **Matriz CNAE** + **Mapa de Confusão** (já pendentes) são a base sobre a qual as famílias se montam.
- **Contrato** cobre a responsabilidade do conselho fiscal (Mauro/Larissa).

## Links
- [[blocos-fluxo-abertura]] · [[fiscal-simples-bh-2026]] · [[perguntas-larissa-fiscal]] · [[cnae-atendidos-e-nao-atendidos]] · [[spec-telas-entrada-b1-b2]] · [[HOME]]
