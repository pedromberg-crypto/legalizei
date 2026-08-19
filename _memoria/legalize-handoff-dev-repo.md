---
name: legalize-handoff-dev-repo
description: Repo privado base-flow-legalizai-story-book = contrato entregue ao dev em 15/07 com 14 personas. 🔴 DESATUALIZADO desde 16/07: hoje sao 19 personas, a ORDEM inverteu (cobranca subiu) e existe um flow #2. O dev esta em E2E contra um contrato que nao existe mais e PRECISA SER AVISADO.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 57faa9d4-bdb0-487c-b54b-8d9817cbb333
---

> 🔴 **ESTE CONTRATO ESTÁ DESATUALIZADO DESDE 16/07 E O DEV NÃO SABE.**
> O que mudou depois da entrega: **14 → 19 personas** · a **ordem inverteu** (a cobrança subiu
> do T16 para o N9; T1–T23 → N1–N25) · nasceu um **flow #2 (migrar)** · e **5 promessas da spec
> se revelaram não implementadas** (auditoria 16/07).
> **Ele está em E2E construindo contra isto.** É o único 🔴 real do projeto hoje
> → [[fila-validacao-humana]]. O resto abaixo descreve o snapshot de 15/07, que continua
> historicamente correto.

**Criado 2026-07-16.** **https://github.com/pedromberg-crypto/base-flow-legalizai-story-book** — **privado**, conta pessoal do Pedro, 33 arquivos. É o handoff pro **Pedro Dev (`pedro.melodata`)** construir o backend de entrada→B4.

**Estrutura:**
- `motor/` — **fonte viva** (flow-schema.js + run.js + 14 personas). Testado **14/14 PASS standalone** no repo.
- `spec/` — **snapshot v1 CONGELADO** (10 docs: blocos, telas B1/B2, telas B3/B4, mapa de telas, ramificações, instrumentação, portais/APIs, processo BH, fiscal só-consolidado, personas).
- `contrato/` — **derivação nova pro dev**: `estados-e-transicoes.md` · `dicionario-de-dados.md` · **`decisoes-abertas.md`** (o dev deve ler primeiro).
- `dados/cnae-lookup-b1.json` — CNAE → veredito → rota, **1332 subclasses** (260 🟢 verde / 68 🟡 amarelo / 1004 🔴 vermelho), **gerado por regra no build** a partir de `cnae-matriz.json` do vault, não transcrito à mão.

**A tese (o que faz o repo valer):** **as 14 personas são o critério de aceite do backend.** Backend que roda as 14 e produz a mesma trilha está correto **por construção**. Por isso é repo com código, não PDF.

**⚠️ Aviso duro que vive no README (não remover):** `flow-schema.js` é **contrato de comportamento, NÃO arquitetura pra copiar** — é linear, sem persistência, sem async real, devolve string pra humano ler, e a IA de CNAE não roda (vem dublada pela persona). Contrato = "mesmos inputs → mesmas decisões", não "porte este código".

**Curadoria (regra do CLAUDE.md: debater antes de compartilhar).** **Barrados:** BASE-ESTRATEGICA (equity/custo), atas/reuniões, marca, INPI, evolucao-para-mauro, log de UX, as 3 rodadas de pesquisa fiscal (foi só o bloco CONSOLIDADO). Verificado: **zero wikilink vazado, zero termo sensível**.
- **Nomes internos genericizados:** Larissa → "contadora" · Karla → "DP" · Izabela → "levantamento BH" · Plaud removido.
- **"Mauro" MANTIDO de propósito:** `comercial-mauro` é identificador no `flow-schema.js` — mudar quebraria as personas.

**Anti-drift (decisão de arquitetura do handoff):** **motor = fonte no repo compartilhado** (código vivo, PR/issue). **Spec = fonte no vault**, repo recebe **snapshot versionado** — congelar é *feature*: o dev não quer spec mudando no meio da sprint. **Contradição motor × spec → o motor ganha.**

**Build reproduzível:** o repo foi gerado por script (curadoria + strip de frontmatter + conversão de `[[wikilinks]]` + geração do lookup). Regerar = re-rodar, não refazer à mão.

**Pendente:** **convidar `pedro.melodata`** — acesso é do Pedro (Claude não mexe em permissão).

**2 decisões do Pedro que viraram capítulo explícito em `contrato/decisoes-abertas.md`** (não bloqueiam o esqueleto, mas não podiam ficar implícitas): 🔴 **chave de idempotência** (a regra está travada, a chave não — o dev propõe, o Pedro aprova) · 🔴 **providers** (CPF/situação cadastral, cartão CNPJ, analytics — construir atrás de interface e stubar).

Ver [[legalize-motor-testes-arquitetura]] · [[legalize-trilha-unica-ux48]] · [[legalize-blocos-fluxo-abertura]].
