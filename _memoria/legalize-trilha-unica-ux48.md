---
name: legalize-trilha-unica-ux48
description: "UX-48 travado 16/07 — trilha ÚNICA, NÃO bifurca UX por perfil. Universais viram default pra todos; profundidade vira expander pra todos; ritmo/layout só se constrói COM DADO. T5 captura a coorte \"É a primeira empresa que você abre?\" como dado puro. Regra dura: densidade muda apresentação, jamais obrigação."
metadata: 
  node_type: memory
  type: project
  originSessionId: 57faa9d4-bdb0-487c-b54b-8d9817cbb333
---

**DECISÃO TRAVADA 2026-07-16** (debate Pedro ↔ Claude). Nota: [[spec-instrumentacao-flow]] · registro: [[mapa-ramificacoes-flow]] + UX-48 no [[compilado-ux-flow]].

**O problema:** as personas não são um espectro — são **2 extremos** (leigo total tipo Cida/reta × avançado tipo knife/monstro) que querem coisas **opostas na mesma tela** (1 decisão por vez × denso · zero jargão × "me mostra a conta").

**A decisão: trilha ÚNICA. NÃO bifurca por perfil.** Três regras:
1. **Universais = default pra todos.** Botão grande com rótulo literal · zero jargão fiscal · recap ao reabrir · fonte ampliável · acessibilidade. **Não é "modo leigo", é design bom** — nenhum experiente é prejudicado por isso, então não vira modo, vira padrão.
2. **Profundidade = expander pra todos** (default fechado): memória de cálculo + "e se?" (UX-47) · base legal + prova exportável (UX-26) · dossiê exportável (UX-34) · detalhe por etapa. **Auto-seleção por comportamento — sem flag, sem chute.**
3. **Ritmo/layout = o único tradeoff genuíno** (1 bloco por vez × agrupado · 1 recomendação × 3 cenários · tutorial × checklist). Expander **não resolve** (é estrutural). **NÃO se constrói até haver dado.**

**Por que não bifurcar agora (chamada do Pedro — anti-guru aplicado a produto):** bifurcar ritmo hoje = construir em cima de **hipótese com zero dado**. E **a cobaia do E2E de 17/07 é o próprio Pedro** (já abriu empresa) — a trilha guiada **nem seria validável**. "Número sem fonte não entra" vale pra UX também.

**Em vez disso — instrumenta:** **T5 (login)** captura `coorte_experiencia` = `primeira_vez` | `ja_abriu` | `nao_respondeu`, via *"É a primeira empresa que você abre?"*. É **DADO PURO: zero mudança de comportamento** — as duas coortes veem as mesmas telas, mesma ordem, mesma lógica. Quem já abriu empresa **também** descreve a atividade no T4. Mede-se performance por coorte e **a bifurcação só nasce se o dado pedir**.

**7 métricas** (em [[spec-instrumentacao-flow]]): drop-off por tela (principal) · tempo por tela · **uso do expander** ⭐ (testa a hipótese de graça: se `primeira_vez` abre muito "ver a conta", a tese cai) · erro/retry por campo · pausas · conclusão B1→ativa · handoff pro humano.

**Gate de decisão — honesto:** **sem p-valor.** Volume de MLP (dezenas, não milhares) **não dá significância estatística tão cedo**. Bifurca só quando: (1) padrão direcional claro numa **tela específica**, (2) **conversa com usuário real** confirmando a causa, (3) a causa **é ritmo** — se for jargão/botão/recap, **conserta pra todos** (é universal). N mínimo 🟡 a travar quando houver tráfego.

**🔒 REGRA DURA:** densidade muda **apresentação, JAMAIS obrigação**. Conteúdo legal (contrato, termo irreversível, política de cancelamento, procuração e-CAC) é **idêntico e integralmente visível pras duas coortes** — nunca atrás de expander, nunca variando por perfil.

**Guarda-corpo por TESTE (não por promessa):** persona **`reta-direto`** = a `reta` byte a byte com `coorte_experiencia: "ja_abriu"`, esperando **trilha IDÊNTICA**. Se um passo fiscal/validação um dia ler a coorte, **o teste quebra e denuncia o vazamento**.

**❌ Descartado — pré-mark por comportamento:** usar o atalho *"já sei meu CNAE"* como proxy de experiência. **Proxy inválido** (caso real do Pedro: chegou na contabilidade digital sabendo o código e **nada mais** — pesquisar 1 número ≠ saber abrir empresa).

**❌ Descartadas também:** 2 trilhas separadas (~2x build, não testável E2E) · adiar tudo (universais + expander são baratos e entram já).

**Consequência estrutural:** a coorte **NÃO é condicional** — zero fork novo, **zero tela nova**. A contagem de 22/23 telas não muda.

**Achado do debate (vale lembrar):** a proposta inicial gatava **profundidade** atrás do flag — errado. E **metade do que estava no "modo leigo" não era modo, era design bom**; chamar de "modo" era um jeito de não construir pra todo mundo.
