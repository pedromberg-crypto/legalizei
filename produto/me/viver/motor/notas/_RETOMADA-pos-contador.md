---
tipo: checkpoint
status: encerrado
data: 2026-09-16
assunto: retomada-da-aplicacao-das-decisoes-do-contador
tags: [execucao, checkpoint, retomada, leonan]
---

# ✅ ENCERRADO — a aplicação das decisões do contador terminou

> ✅ **OS 7 PASSOS FECHARAM EM 16/09.** Este arquivo nasceu como checkpoint de pausa e virou registro do que foi feito. **Não há próximo passo aqui.**
>
> 📊 **O que a aplicação mediu** está em [[_ANTES-E-DEPOIS-do-contador]]. **O veredito de cada item** está em [[_duvidas-contador]].
>
> 🔑 **Estado final:** vidas **16 → 17** · competências **156 → 162** · invariantes **32 → 54** · conferências do apurador **45 → 46** · agregação **142 → 154** · **0 falhas**.

---

## ⏳ O QUE SOBROU, e não é passo — é pesquisa

| | O quê | Estado |
|---|---|---|
| **P5** | O **regime de caixa** acaba em 2027 — atinge o Fator R, que **é** regime de caixa? | 🔴 memória do contador, sem norma |
| **P8** | A **janela do Fator R pula um mês** em 2027 | 🔴 idem |
| **P19** | **ISS** no local da prestação a partir de 2027 | 🔴 idem |
| **P3** | Multa da **DEFIS** e do **PGDAS zerado** | 🟡 ele pediu para confirmar |
| **73** | 🔴 **Pejotização** — passou batida na reunião | 🔴 volta à pauta com ele |

⚠️ **Três das quatro mudanças de 2027 vieram só da memória dele.** É frente de pesquisa própria, não item de fila.

🔒 **E o que sobrou de produto é quase todo TELA** — rateio que não se deduz da participação, campo de INSS por fora, pergunta de onboarding, CNAE secundário em 5, LTDA sempre, 10 m². Mais **um item de motor aberto de propósito**: o dia de corte das alterações pagas (10 ou 12).

---

## ✅ O QUE JÁ FOI FEITO — 2 de 7 passos

### Passo 0 · Registro da reunião *(commits `c61bec8` `cf21509` `33ec3a5` `f42d524`)*

Três áudios, **293.345 caracteres lidos 100%**, literais salvos em `reunioes/fontes/`. Atas em `reunioes/2026-09-16-leonan-audio-{1,2,3}-*.md`.

Os **três conflitos** foram decididos pelo Pedro e estão em [[2026-09-16-tres-conflitos-do-contador-resolvidos]]:

| | Decisão |
|---|---|
| **EPP** | 🟡 fica em **standby**. `_persona.mjs` não muda |
| **CPP** | ✅ a manobra existe e **não a faremos**. Travado no `_encerrados.mjs` |
| **1º mês** | ✅ alerta interno + contato. Leitura **conservadora** do áudio 2 |

### Passo 1 · A fila *(commit `a113fd2`)*

`_sistema/PENDENCIAS.md`: **11 itens fechados** (4, 5, 6, 7, 8, 9, 21, 70, 71, 72), **o 36 REABERTO** com o novo status `🔄`, e **o 73 aberto** (pejotização).

### Passo 2 · Vocabulário *(commit `40f81d1`)*

*"Cai para o Anexo V"* → *"perde o benefício do Anexo III"*. **Zero verbos de movimento** restantes nas fontes. Virou doutrina em `_doutrina-processos` §2.0. Os 3 geradores rodaram; PROCESSOS, SAIDAS, cru/* e PERSONA estão regenerados.

🔑 **Duas decisões tomadas no caminho, que a retomada não deve desfazer:**
- A chave `fator-r-dinamico(III<->V, limiar 28%)` **não foi renomeada** de propósito — é dado em 8 arquivos e o sentido não está errado.
- A trava de persona barrou a palavra `benefício` em `prolabore.mjs` (homônimo com "benefício do sócio"). **Resolvido por redação** — *"perde a tributação pelo Anexo III"* —, **sem afrouxar a trava**. Documentado no `_persona.mjs`.

---

### Passo 3 · MOTOR ✅ *(commits `9315869` `9e1b9d6` `89a4001` `ce076d6`)*

**Invariantes: 32 → 50.** Os quatro subpassos entregues:

| | O que ficou | O que isso pegou |
|---|---|---|
| **3.1** | recebe quem **administra** | P04 e P14 pagavam a todos. 🔑 E achamos que **concentrar a folha pode custar mais IRRF** — nasceu `ganhoDeIncluirSocio()`, decisão (c) do Pedro |
| **3.2** | janela vazia → **Anexo V** | o motor **gritava** num caso real. A razão infinita → III segue intocada, com invariante próprio |
| **3.3** | **alerta interno A1** | `alertas-internos.mjs`. Prazo 15/10, folha R$3.600, valor em jogo R$1.860 |
| **3.4** | piso **por vigência** | 🔴 bug latente: R$1.518 em dez/2025 **era o mínimo legal e o motor bloqueava** |

🔒 **Três decisões do passo 3 que a retomada não deve desfazer:**
- `sociosComProLabore` responde *"quantos recebem"*; `sociosTotal` responde *"de quantos"*. Os dois existem de propósito.
- O limiar do `ganhoDeIncluirSocio` é **semântico** (só sinaliza quando o rateio derruba IRRF), não um valor em reais. A 1ª versão disparava com 1 centavo.
- `PREVIDENCIA.SALARIO_MINIMO` ficou como *"o vigente hoje"*, e quem apura competência histórica usa `salarioMinimoDe(mes)`.

⚠️ **Sempre `.toISOString()` numa data de prazo, nunca `String()`.** O motor guarda vencimento em UTC à meia-noite e o fuso local mostra o dia anterior. Se vazar para tela, o cliente lê um prazo a menos.

---

## ⏳ O QUE FALTA — 4 de 7 passos

### 🔧 Passo 4 · Fontes de `/processos` *(o próximo)*

Levar para o desenho de processo o que o motor já aplica. **Os docs são gerados; edite as fontes.**

| Fonte | O que precisa entrar |
|---|---|
| `_persona.mjs` | recebe quem administra *(hoje ainda diz "todo sócio recebe")* |
| `processos-data.mjs` | o alerta interno do mês da abertura · o passo do rateio |
| `cru/prolabore.mjs` | a pergunta de onboarding · quem recebe · a conta da concentração |
| `cru/impostos.mjs` | janela vazia → V · DEFIS com multa · as 2 janelas de regularização |
| `cru/notas.mjs` | dia 5 · cancelar/substituir, nunca alterar |

⚠️ **A trava de persona barra a palavra `benefício` na categoria `prolabore`** — homônimo com "benefício do sócio". Usar *"tributação pelo Anexo III"*. Já documentado no `_persona.mjs`.

### 🔧 Passo 5 · Rodar os 3 geradores + as travas

```bash
node produto/me/viver/processos/gerar-processos.mjs
node produto/me/viver/processos/gerar-persona.mjs
node produto/me/viver/processos/cru/gerar-cru.mjs
```

⚠️ **PROCESSOS.md, SAIDAS.md, cru/*.md e produto/me/viver/processos/PERSONA.md são GERADOS.** Não editar à mão.

### 🔧 Passo 6 · Bloco D do `_duvidas-contador`

Três contradições conhecidas, já levantadas e **ainda não corrigidas**:

| Linha aprox. | O que corrigir |
|---|---|
| **P01, dia 1** | ainda diz *"definimos o pró-labore já na 1ª competência"* marcado 🏢. **Essa decisão mudou** |
| **bloco 🏢** | ainda intitulado *"precisa da sua decisão"*, coluna *"A nossa dúvida"* — os 4 já têm veredito, e o 🏢3 fechou a nosso favor |
| **3 ocorrências** | *"cai para o Anexo V"* nas personas |

### 🔧 Passo 7 · Vida nova + rodar as 16 + relatório

A vida que falta: **constitui e fatura no mesmo mês**, com CNAE de Fator R. Nenhuma das 16 exercita isso. Depois, rodar todas e gerar o relatório **antes × depois** que o Pedro pediu.

🔑 **Já existe invariante esperando por ela**, no bloco 8 do `verificar-vidas`:

> ⏳ *"NENHUMA das 16 vidas exercita o caso — falta a vida nova"*

Ele **passa hoje** e vai **falhar** quando a vida entrar. É o sinal de que o passo 7 aconteceu — e é preciso trocá-lo por um que afirme o contrário.

---

## 🔴 O QUE NÃO PODE SER FEITO SEM FONTE

> ⚠️ **Se a retomada mexer nisto sem a fonte, troca número certo por memória de terceiro.**

| | O quê | Por que está parado |
|---|---|---|
| ~~P1~~ | ✅ **Redutor do IRRF — RESOLVIDO em 16/09.** Consulta externa confirmou **7 de 7 pontos** contra o motor. O **R$3.500** que o contador repetiu 6× **não existe** (lembrança de projeto de lei antigo). E o corte seco que ele descreveu criaria **penhasco**: um centavo a mais de bruto tiraria **R$312,88** do líquido. Virou a conferência **G10b** | 🟡 O texto do art. 3º-A segue sem fonte primária, e é a única peça do motor assim. **Não bloqueia**: a persona inteira zera IRRF nas duas leituras |
| **P5** | 🔴 O **regime de caixa** acaba em 2027 — atinge o Fator R, que **é** regime de caixa? | citação de memória, sem norma |
| **P8** | 🔴 A **janela do Fator R pula um mês** em 2027 | idem |
| **P19** | **ISS** no local da prestação a partir de 2027 | idem |
| **P3** | Multa da **DEFIS** e do **PGDAS zerado** | ele pediu para confirmar |

🔑 **Três das quatro mudanças de 2027 vieram só da memória do contador.** É frente de pesquisa própria, não item de fila.

---

## 📍 Onde está cada coisa

| | |
|---|---|
| **As regras validadas** | [[_duvidas-contador]] — 32 itens com veredito |
| **As atas** | [[2026-09-16-leonan-audio-1-bloco-a-e-c]] · [[2026-09-16-leonan-audio-2-bloco-d]] · [[2026-09-16-leonan-audio-3-bloco-d-e-e]] |
| **Os literais** | `reunioes/fontes/2026-09-16-rua-satelite-{49,50,51}-*` |
| **As decisões dos conflitos** | [[2026-09-16-tres-conflitos-do-contador-resolvidos]] |
| **O status de cada item** | [[PENDENCIAS]] |
| **Os achados do motor** | [[_achados-do-motor]] — M-001 a M-014 |

## Links
[[_duvidas-contador]] · [[PENDENCIAS]] · [[2026-09-16-tres-conflitos-do-contador-resolvidos]] · [[ciclo-do-cnpj]] · [[_encerrados]]
