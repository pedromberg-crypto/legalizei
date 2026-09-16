---
tipo: checkpoint
status: em-andamento
data: 2026-09-16
assunto: retomada-da-aplicacao-das-decisoes-do-contador
tags: [execucao, checkpoint, retomada, leonan]
---

# ⏸️ RETOMADA — onde paramos na aplicação das decisões do contador

> 🔴 **PARADO POR PEDIDO DO PEDRO EM 16/09**, no meio de uma sequência de 7 passos. Ele foi fazer outra tarefa (o agente do Léo) e vai voltar.
>
> 🧭 **Como usar este arquivo.** Ele diz **o que já está feito**, **o que é o próximo comando exato**, e **o que NÃO pode ser feito sem fonte**. Não precisa reler os 3 áudios nem a conversa: tudo que a retomada precisa está aqui ou linkado daqui.
>
> 🔑 **Estado do repo na parada:** limpo, sem alteração pendente. Último commit **`40f81d1`**.

---

## ▶️ O PRÓXIMO COMANDO, se você só quer continuar

**Passo 3 — o motor.** Quatro alterações, nesta ordem:

```
1. sócio-administrador          ← única que muda guia de cliente
2. janela vazia → Anexo V
3. alerta do mês da abertura
4. salário mínimo com vigência
```

⚠️ **Antes de tocar em qualquer uma**, rodar a linha de base e guardar o resultado:

```bash
node execucao/motor-fiscal/verificar-apurador.mjs    # 45
node execucao/motor-fiscal/verificar-piloto.mjs      # 67
node execucao/estado-cnpj/verificar.mjs              # 14
node execucao/estado-cnpj/verificar-vidas.mjs        # 32
node execucao/estado-cnpj/auditar-agregacao.mjs      # 142
node execucao/estado-cnpj/rodar-ciclo.mjs            # 1.092
```

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

## ⏳ O QUE FALTA — 5 de 7 passos

### 🔧 Passo 3 · MOTOR *(o próximo)*

| | O quê | Onde | Hoje |
|---|---|---|---|
| **3.1** | 🔴 Pró-labore só para **sócio-administrador** | `_modelo.mjs` · `apurador.mjs` | `sociosComProLabore` é só contagem; não distingue administrador de cotista |
| **3.2** | Janela vazia → decidir **Anexo V** | `apurador.mjs` · `piloto-pro-labore.mjs` | `fatorR` devolve `anexo: null` e **ninguém trata** |
| **3.3** | **Alerta interno**: constituiu e faturou no mesmo mês | `estado-cnpj/` | **não existe**, zero ocorrências |
| **3.4** | **Salário mínimo** com vigência anual | `_tabelas.mjs` | `SALARIO_MINIMO: 1621` constante |

🔑 **Só o 3.1 muda guia de cliente.** Os outros três são ausência de funcionalidade, que é mais barato.

**Contexto do 3.2, para não redecidir:** o contador se contradisse entre os áudios 2 e 3. Adotamos a leitura **conservadora** (competência anterior → o 1º mês paga 15,5%) porque errar para o lado estrito **nunca cobra a menos**. A ação do produto é a mesma nas duas leituras.

### 🔧 Passo 4 · Fontes de `/processos`

`_persona.mjs` · `processos-data.mjs` · `cru/*.mjs`. Dependem do passo 3.

### 🔧 Passo 5 · Rodar os 3 geradores + as travas

```bash
node execucao/processos/gerar-processos.mjs
node execucao/processos/gerar-persona.mjs
node execucao/processos/cru/gerar-cru.mjs
```

⚠️ **PROCESSOS.md, SAIDAS.md, cru/*.md e produto/PERSONA.md são GERADOS.** Não editar à mão.

### 🔧 Passo 6 · Bloco D do `_duvidas-contador`

Três contradições conhecidas, já levantadas e **ainda não corrigidas**:

| Linha aprox. | O que corrigir |
|---|---|
| **P01, dia 1** | ainda diz *"definimos o pró-labore já na 1ª competência"* marcado 🏢. **Essa decisão mudou** |
| **bloco 🏢** | ainda intitulado *"precisa da sua decisão"*, coluna *"A nossa dúvida"* — os 4 já têm veredito, e o 🏢3 fechou a nosso favor |
| **3 ocorrências** | *"cai para o Anexo V"* nas personas |

### 🔧 Passo 7 · Vida nova + rodar as 16 + relatório

A vida que falta: **constitui e fatura no mesmo mês**, com CNAE de Fator R. Nenhuma das 16 exercita isso. Depois, rodar todas e gerar o relatório **antes × depois** que o Pedro pediu.

---

## 🔴 O QUE NÃO PODE SER FEITO SEM FONTE

> ⚠️ **Se a retomada mexer nisto sem a fonte, troca número certo por memória de terceiro.**

| | O quê | Por que está parado |
|---|---|---|
| **P1** | 🔴 **Redutor do IRRF** — o Leonan descreveu faixas (até 3.500 zera · 3.500–5.000 redutor · **acima de 5.000 sem redutor**) que **divergem do motor** (`tetoIsencao: 5000`, `tetoRampa: 7350`) | Ele mesmo hesitou: *"aí eu não vou lembrar o certo"*. **Exige a Lei 15.270/2025 literal.** Muda a guia de todo cliente acima de R$5.000 |
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
