---
tipo: spec
data: 2026-07-15
status: cruzado-gemini-validar-larissa
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
| **7020-4/00** | Consultoria em gestão empresarial | **Sim** | III se folha≥28%, senão **V** | **15,5%** (se V) | **5,0%** (item 17.01) | sim, se o foco é aconselhar gestão | 🟢 (Fator R confirmado) |
| **8599-6/04** | Treinamento em desenvolvimento profissional e gerencial | **Não** (§5º-B) | **III fixo** | **6,0%** | **2,0%** (item 8.02) | sim, se o foco é capacitar/dar curso | 🟢 (SC Cosit 205/14 + SRRF08 8022/18) |

**A jogada:** um profissional **solo** que dá treinamento + orienta, se registrado como **7020-4 (consultoria)** e sem folha, cai no **Anexo V (15,5%)**. A **mesma entrega** (NF de capacitação/orientação) sob **8599-6/04 (treinamento)** é **Anexo III (6%) sem precisar de Fator R**.

**Delta (1ª faixa, receita R$15.000/mês):** (15,5% − 6%) × 15.000 = **~R$1.425/mês (~R$17k/ano)**, *supondo* o cenário V no lado consultoria. Valores de alíquota = [[fiscal-simples-bh-2026]] CONSOLIDADO (🟢). **Ganho DUPLO** (confirmado no cruzamento Gemini 15/07): além do anexo (V→III), o **ISS BH cai de 5% → 2%**. Mapeamento 8599→Anexo III sem Fator R = **🟢 resolvido** (SC Cosit 205/2014 + SC DISIT/SRRF08 8022/2018); Larissa só ratifica.

**Guardrail:** só vale se a pessoa **realmente dá treinamento** (não consultoria pura relabelada). A NF descreve o serviço prestado; o fisco cruza atividade × CNAE × NF. Larissa assina a equivalência.

**Por que é o exemplo certo pro nosso ICP:** o ganho aparece **sem exigir pró-labore alto** — exatamente onde o Fator R não salva o solo de baixa folha.

---

## 🔀 Cruzamento Gemini (2026-07-15) — método pesquisa fiscal
> Doc Gemini "Otimização Fiscal CNAE Belo Horizonte" batido contra nossa matriz + [[fiscal-simples-bh-2026]] CONSOLIDADO. **Veredito: converge, zero contradição dura de números.** O Gemini **preenche o `*`** (anexo por serviço) que a matriz deixava aberto de propósito + resolve nosso 🟡 mais crítico (8599). Mesmo desfecho do cruzamento da pesquisa fiscal.

### 🧭 As 3 regras de classificação (árvore de decisão, art. 18 LC 123)
| Grupo | Regra | Anexo | Alíq. inicial | Base legal | Atividades-âncora |
|---|---|---|---|---|---|
| **A** | III fixo, **sem** Fator R | **III** | **6,0%** | §5º-B · §5º-D · **§5º-F residual** (serviço sem previsão IV/V → III) | ensino/treinamento, reparo/manutenção/instalação, suporte TI, contabilidade, agência turismo, locação bens móveis |
| **B** | Fator R (V↔III) | **V** (III se folha≥28%) | 15,5% / 6,0% | §5º-I | engenharia, arquitetura, software sob encomenda, medicina, odonto, psicologia, consultoria, design, publicidade |
| **C** | IV, **CPP 20% fora do DAS** | **IV** | 4,5% **+ CPP** | §5º-C | construção, limpeza/conservação/vigilância, **advocacia** |

> **§5º-F é a alavanca-chave do swap:** todo serviço sem previsão em IV/V cai em III fixo (6%). É o que permite fugir do Fator R via troca de código.
> **Grupo C é uma armadilha:** 4,5% parece o menor, mas com CPP 20% fora do DAS o custo real supera o Anexo III. O simulador precisa mostrar a **carga real**, não a alíquota de tabela.

### 💰 ISS BH por CNAE (a camada de dado que faltava — Lei Municipal 8.725/2003, LC 116)
| ISS | CNAEs |
|---|---|
| **2,0%** | treinamento `8599-6/04` (8.02) · engenharia `7112-0/00` · arquitetura `7111-1/00` (7.01) |
| **2,5%** | TI: `6201`·`6202`·`6203`·`6204`·`6209`·`6311-9/00`·`6319-4/00` (1.xx) |
| **3,0%** | limpeza `8121-4/00` · monitoramento `8020-0/01` · médico `8630-5/03` · odonto `8630-5/04` |
| **5,0%** | consultoria `7020-4/00` (17.01) · publicidade `7311-4/00` · promoção/mkt `7319-0/02·03` (17.06) · design `7410-2/xx` (32.01) · BPO `8219-9/99` (17.02) · feiras `8230-0/01` (17.10) · contabilidade `6920-6/01` (17.19) · advocacia (17.14) |

### 🧬 Famílias de swap (viram os dados de `cnae_equivalentes` do motor)
| # | Família | Caro (origem) | Ótimo (swap) | Delta | Conf | Entra no MVP só-serviço? |
|---|---|---|---|---|---|---|
| **1** | Infoproduto/mentoria/educação | `7020-4` · V · ISS 5% | **`8599-6/04`** · III · ISS 2% | ~R$950/mês @10k (~R$11,4k/ano) | 99% | ✅ ambos atendidos — **= exemplo #1, confirmado** |
| **2** | SaaS/tech | `6201-5` / `6203-1` · Fator R · V | **`6311-9/00`** · III (§5º-F) | ~R$2.850/mês @30k | 95% | ✅ ambos atendidos — **novo, ouro** |
| **3** | Agência digital/BPO | `7311-4` / `7020-4` · V | **`8219-9/99`** apoio admin · III | ~R$475/mês @5k | 90% | ✅ ambos atendidos — **novo** |
| **4** | Design/pré-impressão | `7410-2/01` · V | `1821-1/00` **OU** `8219-9/99` | 9,5 p.p. | 85% | ⚠️ `1821-1/00` é **Anexo II/indústria = cortado**; usar **só `8219-9/99`** |
| **5** | Engenharia→instalação | `7112-0/00` · V | `3329-5/99` instalação · III | 15,5→6% | 95% | ⚠️ `7112` é **condicional (RT/CREA)** + `3329-5/99` **Anexo II = cortado**. Família **fora do V1** |

> **Famílias 1, 2 e 3 entram limpas** (os dois lados são serviço atendido). A 4 salva usando `8219-9/99`; a 5 fica pra depois (esbarra no corte só-serviço + regulamentada).

### 🛡️ Guard-rails do Gemini → viram os "bloqueios que educam" no flow
- **Tráfego pago** (conf 90%): mercado usa `7319-0/03` marketing direto (III), mas BH tende a reenquadrar como publicidade `7311-4` (V/Fator R) se houver **fee/comissão sobre mídia**. → Pergunta no flow: *"você cobra % sobre a verba de mídia do cliente?"* Sim → publicidade.
- **SaaS white-label** (conf 95%, SC Cosit 271/2024): `6311-9/00` (III) só vale pra plataforma padronizada. Se exige **customização técnica cliente a cliente** → `6203-1/00` (V). → Pergunta: *"sua plataforma exige customização cliente a cliente?"*
- **Design "rebranding/UX-UI"** (conf 85%): descrição de pesquisa comportamental profunda blinda o fisco pra reenquadrar em Design (V). Escopo da NF deve enfatizar tratamento/editoração/produção final.
- **Promoção de vendas `7319-0/02` ISS BH** (conf baixa): 5% é o conservador; pode cair a 2–2,5% em contratos B2B de mero apoio. Manter 5% e revisar.

### 🔴 Correções antes de importar o Gemini
- **Advocacia — código errado no Gemini:** ele escreveu `6910-4/01` (**não existe** na CNAE 2.3). Correto = **`6911-7/01`** (nossa matriz). Regra dele (Anexo IV via §5º-C) está certa.
- **Refinar nossa matriz (o `*`):** advocacia `6911-7/01`, limpeza `8121-4/00`, monitoramento `8020-0/01` = **Anexo IV** (§5º-C), não o genérico "III/IV/V*".

### ⚠️ Divergência de anexo (baixa prioridade — ambos fora do MVP)
- `3329-5/99` e `1821-1/00`: **nós = Anexo II** (regra por seção C, confiança MÉDIA) vs **Gemini = Anexo III** (§5º-F, é serviço). Cortados hoje; se reencaixar, o Gemini provavelmente está certo (instalação/pré-impressão = serviço).

---

## ⚠️ O que a busca de hoje travou (anti-guru)
- 🟢 Confirmado: Anexo III começa 6% · Anexo V 15,5% · §5º-B lista **ensino/treinamento** e **reparo/manutenção** como **Anexo III**.
- 🔴 Derrubado: hipótese de que "agência de publicidade `7311-4/00` é sempre III" — **é Fator R** (III ou V). Não usar.
- ✅ **RESOLVIDO** (cruzamento Gemini 15/07): `8599-6/04` = Anexo III **sem** Fator R, definitivo. Fonte dura: **SC Cosit 205/2014** + **SC DISIT/SRRF08 8022/2018** (citação literal *"tributadas pelo Anexo III... independentemente do fator r"*). Era o claim que sustentava o exemplo — Larissa só ratifica.

Fontes: [contabilidade.com 7319-0/04](https://contabilidade.com/blog/cnae7319004-consultoria-em-publicidade-e-propaganda-simples-nacional-fator-r-e-abertura-de-empresa/) · [contabilizei Anexo III](https://www.contabilizei.com.br/contabilidade-online/anexo-3-simples-nacional/) · [Planalto LC 123 §5º-B](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm)

---

## 🛠️ Como entra no motor (próximo passo)
1. Entrada dublada `cnae_equivalentes` na persona (a família acima).
2. Passo novo **`b2.cnae_otimo`** (entre b1.mapeamento e o simulador): recebe a família, calcula a carga de cada CNAE (anexo + ISS), ranqueia, retorna o ótimo + delta.
3. Guarda-corpos no flow: mostrar **por que** o alternativo é válido + **confirmar com o usuário** + trilha de auditoria. Nunca trocar em silêncio.
4. Personas de teste: `instrutora` (exemplo #1, já rodando PASS) + **novas: `saas` (família 2) e `bpo` (família 3)** — ambos dentro do MVP, delta grande, guard-rail de confirmação (white-label / fee de mídia).

## 🔴 Dependências (crescem com a feature)
- **Larissa** ratifica cada família (equivalência jurídica). 8599 = ✅ já com fonte dura, só formalidade.
- ~~**Mapa ISS BH**~~ ✅ **mapeado** (cruzamento Gemini 15/07 — tabela acima); Larissa confere os itens LC 116.
- **Matriz CNAE** + **Mapa de Confusão** (já pendentes) são a base sobre a qual as famílias se montam.
- **Contrato** cobre a responsabilidade do conselho fiscal (Mauro/Larissa).

## Links
- [[blocos-fluxo-abertura]] · [[fiscal-simples-bh-2026]] · [[perguntas-larissa-fiscal]] · [[cnae-atendidos-e-nao-atendidos]] · [[spec-telas-entrada-b1-b2]] · [[HOME]]
- **Fonte bruta do cruzamento:** [[2026-07-15-gemini-otimizacao-cnae-bh]] (doc Gemini completo, com árvore de decisão, tabela CNAE, 5 clusters e referências oficiais).
