---
tipo: original
status: vivo
data: 2026-09-22
assunto: agente-whatsapp-vault
papel: "A cadeia completa, do WhatsApp ate a resposta, lida no codigo"
tags: [leo, sidecar, arquitetura, rastreio, router, tools]
---

# 🔗 A cadeia do Léo, do WhatsApp até a resposta

> 🧭 **O que é.** O caminho inteiro de uma mensagem, etapa por etapa, **lido no
> código** em 22/09/2026 — `server.ts`, `router.ts`, `tools.ts`, `tools-def.ts`,
> `db.ts`. Não é o desenho de como deveria ser: é o que roda.
>
> 📌 **Por que existe.** O Pedro pediu para **ver** o mecanismo antes de começar
> os testes com a documentação: *"desde como é o gatilho até o que ele acessa e
> leva como verdade para produzir a resposta"*. Sem esse mapa, relatório de
> rodada é placar sem causa.

**A frase usada como sonda:** *"pq vcs precisam do numero do meu iptu?"*

Escolhida de propósito: é o caso `campo-dossie-iptu`, **um dos 4 que erraram**
na rodada `e2e-2026-09-22-185426-curta`. Serve para mostrar a cadeia inteira e,
no fim dela, exatamente onde ela vaza.

---

## As 14 etapas

```
┌─ 1. CHEGADA ──────────────────────────────────────────────────┐
│  bridge.js (Baileys, sessão pareada) ← WhatsApp               │
│  server.ts faz polling: GET /messages a cada INTERVALO_MS      │
│  ⚠️ leitura DESTRUTIVA + trava de reentrância (`lendo`)        │
└───────────────────────────────┬───────────────────────────────┘
                                ▼
┌─ 2. PORTEIRO ─────────────────────────────────────────────────┐
│  grupo? descarta (RESPONDER_GRUPO)                             │
│  mídia sem legenda? descarta (`!evento.body?.trim()`)          │
└───────────────────────────────┬───────────────────────────────┘
                                ▼
┌─ 3. FILA POR CHAT ────────────────────────────────────────────┐
│  `filaPorChat` — uma fila por pessoa, não global               │
│  🔑 duas mensagens seguidas dela = ordem garantida             │
│     chats diferentes não esperam um pelo outro                 │
└───────────────────────────────┬───────────────────────────────┘
                                ▼
┌─ 4. SESSÃO + "digitando" ─────────────────────────────────────┐
│  garantirContatoESessao(chatId, OCIOSIDADE_MIN)                │
│  POST /typing ANTES de pensar (silêncio faz repetir a msg)     │
└───────────────────────────────┬───────────────────────────────┘
                                ▼
┌─ 5. HISTÓRICO ────────────────────────────────────────────────┐
│  carregarHistorico(sessaoId) → `conversa.mensagem`             │
│  🔴 SÓ o que a pessoa VIU entra aqui. Texto já filtrado.       │
└───────────────────────────────┬───────────────────────────────┘
                                ▼
```

### 🧠 Etapa 6 · Chamada 1 ao modelo — **o classificador**

Ele **não vê a base**. Nenhuma tool na mesa. Lê os **últimos 6 turnos** + a frase.

```
entra:  PROMPT_ROTEADOR (fixo) + 6 turnos + "pq vcs precisam do numero do meu iptu?"
sai:    { gatilho_escalonamento: false,
          fora_do_escopo:        false,
          pergunta_tecnica:      TRUE,   ← acendeu aqui
          interesse_comercial:   false,
          tensao:                false,
          resumo: "quer saber por que o IPTU é pedido" }
```

### ⚙️ Etapa 7 · `decidirSaida()` — **código, não modelo**

```
escalonamento?  não
fora_escopo?    não
tecnico?        SIM  ──►  trilha = `tecnico`
```

🔑 **O modelo dá os sinais, o código ordena.** É de propósito: foi por ordem
errada que o agente já respondeu preço para quem tinha acabado de contar um
prejuízo (`RULES.md` §5.1).

### 🧰 Etapa 8 · `toolsDaTrilha('tecnico')` — o que vai para a mesa

A trilha `tecnico` recebe **as 8**:

`consultar_cnae` · `consultar_preco` · `estimar_das` · `buscar_cartao` ·
`consultar_links` · `buscar_base` · `consultar_contrato` · `consultar_escopo`

⚠️ As trilhas `fora_escopo` e `escalonamento` recebem só 4 cada — e `buscar_base`
está **nas quatro trilhas**, sempre.

### 🧠 Etapas 9–12 · O resolvedor (laço de até 4 voltas)

```
sistema = SISTEMA['tecnico']            ← PERSONA + RULES da trilha
        + "se nenhuma tool devolveu, escreva ⟦LACUNA⟧ e diga que vai confirmar.
           NÃO preencha o buraco com conhecimento geral."

     ┌──────────────────────────────────────────┐
     │  modelo decide: chamo tool ou respondo?  │
     └──────────────┬───────────────┬───────────┘
                    │               │
          chamou ───┘               └─── NÃO chamou
             │                              │
             ▼                              ▼
   executarTool() → BANCO            🔴 semLastro = true
   resultado volta como              falhaTipo = 'lacuna_da_base'
   `papel: 'ferramenta'`             ok = false
   e o laço roda de novo             ⚠️ E O TEXTO SAI ASSIM MESMO
```

---

## 🎯 O que ele leva como verdade — três camadas, e só uma se consulta

| Camada | O que é | Entra quando |
|---|---|---|
| **1 · Sempre** | `PERSONA.md` + `RULES.md` + `SISTEMA[trilha]` | **todo turno**, sem pedir |
| **2 · Sob demanda** | as 8 tools → banco: **100 trechos** · **58 cartões** · `fatos.link` · `parametro_fiscal` · escopo · teto · contrato · preço | **só se ele chamar** |
| **3 · Fábrica** | o treino do Gemini | **o que preenche quando a 2 não é chamada** |

### 🔴 No caso medido, a camada 2 não foi acionada

O que saiu para a pessoa:

> *"Preciso do número do IPTU para confirmar se a prefeitura de BH permite que
> a sua empresa seja aberta no endereço residencial. (…) com o número, **eu
> verifico** se o seu imóvel atende às exigências de **zoneamento**."*

O que o `03-REGRAS-DOS-ORGAOS` §1 diz, e estava no banco o tempo todo:

> o índice cadastral **localiza o imóvel** — sem ele a Prefeitura não acha o
> endereço e o processo para. Zoneamento é **imóvel comercial**.
> *"O que a Prefeitura analisa é o endereço, não você."*

**Duas trocas:** a razão (localizar → verificar permissão) e o sujeito (a
Prefeitura → *"eu verifico"*). A nota tem instrução literal contra isso. Ele
respondeu da **camada 3**.

---

## 🔚 Etapas 13–14 · Depois do texto pronto

```
  ▼ trava comercial — podeInjetarGancho(): 3 condições
    (técnica fechou? interesse? sem tensão?) → aqui: NÃO injeta
  ▼ conferirEnderecos(texto)  🔑 ANTES de gravar, nunca depois
  ▼ gravarTurno() — 2 tabelas, 1 transação
      · conversa.mensagem  → só o que ela viu
      · o turno            → saida, tecnicaOk, falhaTipo,
                             cartoesUsados, fatosLidos, toolsChamadas
  ▼ limparSaida()  — tira travessão e markdown
  ▼ emBatidas()    — teto de 2 mensagens
  ▼ POST /send  ·  /typing entre batidas  ·  /read por último
```

---

## ⚠️ O que este desenho revela, e é o ponto

🔴 **O código já sabe quando respondeu sem lastro.** Ele marca
`falhaTipo: 'lacuna_da_base'`, grava isso no banco, rebaixa a saída de
`comercial` para `tecnico`… **e manda o texto assim mesmo.**

A única coisa que a falta de lastro bloqueia hoje é o **gancho comercial**. A
afirmação errada sobre o IPTU passou inteira, para a pessoa.

🔑 **Por isso o critério de aceite pede lastro, não texto novo**
(`_aceite-lastro-na-resposta.md`). A base já tinha a resposta certa. **A cadeia
tem 14 etapas e uma única delas é opcional** — justamente a que consulta o que
a gente escreveu.

### A medição que sustenta isto

Rodada `e2e-2026-09-22-185426-curta`, 28 turnos com medição por chamada:

| tool | oferecida | **chamada** |
|---|---:|---:|
| `buscar_base` | 28 | **0** |
| `consultar_cnae` | 24 | **0** |
| `estimar_das` | 22 | **0** |
| `consultar_links` | 28 | **1** |

**15 turnos sem tool alguma.** 4 erraram sem base; **9 acertaram de memória** —
mesmo mecanismo, com sorte no lugar do erro.

## O que este documento NÃO é

- **Não é rastreio ao vivo.** Foi lido no código, no vault. O rastreio de um
  turno real, com o que o banco gravou, só se faz na VPS.
- **Não descreve `bridge.js`** além da fronteira: a ponte é sessão pareada e
  não se toca (`CLAUDE.md` §1).
- **Não mede qualidade.** Mostra o caminho e onde ele vaza, não se a resposta
  ficou boa.
