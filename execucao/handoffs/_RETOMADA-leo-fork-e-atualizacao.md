---
tipo: checkpoint
status: em-andamento
data: 2026-09-16
assunto: retomada-do-vault-e-skills-do-leo
tags: [execucao, checkpoint, retomada, leo, agente, whatsapp]
---

# ⏸️ RETOMADA — o vault do Léo, o fork e o que está desatualizado

> 🔴 **PARADO EM 16/09, antes de escrever qualquer coisa.** O Pedro trouxe a pasta `Downloads/Docs Léo/Leo-Agente` para atualizar e a leitura achou um problema estrutural que precisa de decisão dele antes de qualquer edição.
>
> 🧭 **Estado:** **nada foi alterado.** Nenhum arquivo do Léo foi tocado, nem no projeto nem em Downloads. Este documento é só o levantamento.
>
> ⚠️ **Por que está aqui e não dentro do vault do agente:** o Léo lê **só** `execucao/agente-whatsapp-vault/`, e a regra 2 do README daquela pasta proíbe instrução de processo no meio do conhecimento — num RAG, um parágrafo destes pode ser recuperado e repetido pro cliente.

---

## 📖 O que já foi feito: leitura integral

**18 arquivos, ~62 KB, lidos 100%.** Nada foi lido por amostra.

| | |
|---|---|
| `SOUL.md` | a personalidade |
| `skills/` | `atendimento` · `vendas` · `escalacao` · `follow-up` |
| `agente-whatsapp-vault/` | 12 notas: `00` a `11` + README *(não existe `06`, foi fundido no `03` em 04/09)* |

🔒 **O Pedro excluiu `follow-up` do escopo desta rodada.** As outras três entram.

---

## 🔴 O ACHADO QUE TRAVA TUDO — o vault do Léo existe em DOIS lugares

Não é cópia velha. São **duas linhagens que receberam melhorias diferentes**, e nenhuma está completa.

```
03/09  vault nasce em execucao/agente-whatsapp-vault/
         │
         ├──► alguém tira uma cópia (hoje em Downloads/Docs Léo)
         │      + frontmatter em todos os arquivos
         │      + wikilinks [[...]] no lugar de crase
         │      + .obsidian/ (vault fechado, grafo, favoritos)
         │      + SOUL.md        ← NÃO existe no projeto
         │      + skills/ (4)    ← NÃO existem no projeto
         │
         └──► 11/09, no projeto: endereço fiscal R$60 → R$49
                + aviso de desambiguação com o plano MEI
                (a correção tocou 13 arquivos; a cópia não estava lá)
```

### A prova de que o fork é bidirecional

| | Downloads | Projeto |
|---|:---:|:---:|
| Frontmatter, wikilinks, `.obsidian/` | ✅ | ❌ |
| `SOUL.md` e as 4 skills | ✅ | ❌ |
| **Endereço fiscal R$49** | ❌ *(diz R$60)* | ✅ |

🔑 **O README da cópia de Downloads EXIGE frontmatter** (*"arquivo novo entra com as propriedades tipo, status, data, assunto, ordem, papel e tags"*) — e **o vault do projeto não tem frontmatter em nenhum arquivo**. Ele viola a regra que ele mesmo escreveu, porque quem cumpre a regra é a outra cópia.

### Por que o R$60 não é um número velho qualquer

🔴 **Ele nunca foi conta nossa.** Era o preço do Escritório Virtual do **concorrente**, adotado como benchmark em 04/09 e revogado em 11/09. Aparece em **4 arquivos** da cópia de Downloads (`01`, `03`, `04`, `09`), inclusive em **falas prontas**:

> *"o nosso escritório em BH vira a sede da sua empresa, por R$ 60 por mês"*

**Se for essa a cópia que o Hermes carrega, o Léo está cobrando o preço do concorrente.**

### ✅ A recomendação, aguardando o Pedro

**Fusão, não escolha.** Trazer para o projeto o que só existe em Downloads — frontmatter, wikilinks, `.obsidian/`, `SOUL.md` e as 4 skills — preservando o preço certo que já está lá. Passa a existir **um** vault, e a pasta de Downloads volta a ser **exportação**, não segunda vida.

⚠️ Corrigir só a cópia de Downloads **não fecha o fork, repete ele**: na próxima propagação de preço pelo projeto, diverge de novo. É o defeito que o Pedro já viveu com a personalidade do Léo morando em 4 lugares.

---

## 📋 O QUE ESTÁ DESATUALIZADO — levantamento completo

### 💰 Preço e produto

| | Está | Deveria ser | Desde |
|---|---|---|---|
| Endereço fiscal | R$60 | **R$49** | 11/09 |
| Promoção MEI | só R$19 | **R$19 e R$29** *(as duas validadas)* | — |
| **Folha de pagamento** | 🔴 **não existe no vault** | **R$39/colaborador, teto 10** | 10/09 |
| Migração de contabilidade | *"tem caminho próprio no app"* | 🔴 **removida da minuta** | 10/09 |

⚠️ A folha é a mais grave: **entrou no escopo do produto e o Léo não sabe vender nem explicar.**

### 🧮 Fiscal — o que a reunião com o Leonan (16/09) mudou

| | O que falta |
|---|---|
| **A margem de 30%** | O `05-DICIONARIO` diz *"a Legalizai trabalha com folga em cima do limiar"* **sem número**. Hoje temos o número, ratificado com caso real |
| **O piloto de pró-labore** | O Léo **não sabe que existe**. É o maior diferencial do produto e não está em lugar nenhum do vault dele |
| **Pró-labore só para sócio-administrador** | decisão nova; o `08-MAPA-DO-DOSSIE` ainda descreve o modelo antigo |
| **A pergunta de onboarding** | gerar pró-labore agora ou esperar a 1ª nota |
| **DEFIS morre em 2027** | `07-OBRIGACOES-MENSAIS` ainda a descreve como permanente |
| **MEI passa a ser obrigado a emitir nota em 2027** | dito pelo Leonan |
| **Duas janelas de regularização** | setembro **e** março. O vault não cita nenhuma |

### 🗣️ Vocabulário — corrigido no projeto em 16/09, ausente aqui

O `05-DICIONARIO` diz *"leva pro Anexo III… abaixo disso, Anexo V"*. É o movimento que **não existe**.

> ❌ "cai para o Anexo V" → ✅ "**perde o benefício** do Anexo III"

Regra completa em `_doutrina-processos` §2.0.

### 🔢 Um número que pode enganar

O `11-COMO-CONSULTAR-CNAE` lista `fator-r-dinamico (47)`. Nosso motor trabalha com **15 de 87**. São denominadores diferentes (1332 × 87), mas do jeito que está **o Léo pode citar o 47 como se fosse a nossa cobertura**.

---

## 🚪 A ESCALAÇÃO — o pedido específico do Pedro

> *"senti falta de ler lá tags ou gatilhos do estilo se a pessoa escrever direto 'falar com humano' ou só 'humano'"*

✅ **Ele tem razão, e conferi.** A skill tem **11 gatilhos de assunto** e **zero gatilho de pedido explícito**. Não reconhece *"falar com humano"*, *"humano"*, *"atendente"*, *"quero falar com alguém"*, *"me passa pra uma pessoa"*.

### 🔴 E tem um agravante que contradiz a própria skill

O `04-QUEBRA-OBJECOES` trata *"Vocês não têm atendimento humano? É um absurdo falar com robô!"* como **objeção a contornar**, com o Léo respondendo *"pode mandar a bronca"* — ou seja, **segurando a pessoa**.

A skill de escalação prega o oposto: *"não existe 'primeiro eu tento'"*. **Os dois arquivos se contradizem.**

### ⏳ Decisão pendente do Pedro

**Pedido explícito de humano escala direto, ou tenta uma vez entender o assunto antes?**

🔑 **Minha recomendação: direto.** É coerente com a regra que a skill já tem, e segurar quem pediu humano é o comportamento que mais gera raiva em atendimento automatizado.

---

## ▶️ QUANDO RETOMAR — a ordem proposta

| | Passo | Depende de |
|---|---|---|
| **1** | 🔴 **Decidir a fusão** | Pedro |
| **2** | Consolidar: SOUL + skills + estrutura para dentro do projeto | passo 1 |
| **3** | Corrigir preço e produto *(endereço fiscal, promo MEI, folha, migração)* | passo 2 |
| **4** | Aplicar o fiscal da reunião *(margem 30%, piloto, DEFIS, 2027, vocabulário)* | passo 3 |
| **5** | Reescrever a `escalacao` com gatilhos de **pedido explícito** | Pedro decidir §direto ou não |
| **6** | Corrigir a contradição do `04-QUEBRA-OBJECOES` | passo 5 |
| **7** | Revisar `atendimento` e `vendas` contra tudo acima | — |

🔒 **`follow-up` fica de fora** desta rodada, por decisão do Pedro.

---

## 📍 Onde estão as coisas

| | |
|---|---|
| **Vault do projeto** *(preço certo, sem estrutura)* | `execucao/agente-whatsapp-vault/` |
| **Cópia do dev** *(estrutura + skills, preço errado)* | `C:\Users\pedro\Downloads\Docs Léo\Leo-Agente` |
| **Personalidade completa, dial por persona** | [[handoff-leo-agente-whatsapp]] |
| **Fonte da personalidade** | `marca/personagem-leo.md` |
| **As regras fiscais validadas** | [[_duvidas-contador]] |

## Links
[[handoff-leo-agente-whatsapp]] · [[_duvidas-contador]] · [[_RETOMADA-pos-contador]] · [[PENDENCIAS]]
