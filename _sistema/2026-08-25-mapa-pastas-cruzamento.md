---
tipo: hub
status: vivo
data: 2026-08-25
assunto: mapa-pastas-cruzamento
tags: [reorganizacao, meta, validacao]
---

# Mapa de pastas — o que cada uma é e onde eu acho que cruza

Isso é validação humana pasta a pasta. **Não é veredito, é ponto de partida.** Cada linha é minha opinião sobre conteúdo real (li os arquivos, não só o nome), onde vejo sobreposição, e **que tipo de ação isso pede**:

- **mover** — mecânico, `git mv`, baixo risco. Sempre digo de-onde-pra-onde.
- **fundir** — edição de conteúdo de verdade (2+ docs com autoridade sobreposta viram 1, ou um passa a mandar sobre o outro). Não é mecânico, exige leitura/reescrita.
- **linkar** — os 2 ficam onde estão, só ganham referência cruzada. Não muda conteúdo nem local.
- **decisão aberta** — não é sobre organizar arquivo, é mérito que só você (ou você+Mauro) resolve. Eu só sinalizo.
- **nenhuma** — achei o cruzamento digno de nota, mas não acho que pede ação nenhuma agora.

Fora de escopo: `app/` (código do produto, não é doc de vault).

## Arquivos-mestre da raiz

- `HOME.md` — torre de controle, `§ Agora` é o estado corrente (log de 34 flows encadeados, hoje 109KB).
- `BASE-ESTRATEGICA.md` — teses, custo, equity, roadmap. Fonte da verdade estratégica.
- `CLAUDE.md` — constituição da janela (regras de boot/fecho/trabalho).
- `obsidian-estado-da-arte.md` — stack do vault verificada (Bases, CLI, backup).
- `.gitignore` — config git.

---

## `_arquivo/` ✅ validado (Pedro, 25/08)

Pastas mortas/congeladas, guardadas por valor histórico, tiradas da raiz ativa nesta sessão.

| Subpasta | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `diario/` | Diário da imersão, 1 nota/dia. Congelado 16/07, só 1 entrada real (08/07). | `execucao/marcos/` | nenhuma | Os marcos datados viraram o registro real de progresso; o diário foi abandonado em favor deles, mas não tem conteúdo pra fundir — é só contexto de por que morreu. |
| `reorganizacao-flow-design/` | Reorg travada de 30/07 sobre flow/telas/design system, nunca fechou veredito. | `_sistema/indice-autoridade.md` | decisão aberta → depois fundir | É literalmente a mesma pergunta que o índice de autoridade tenta responder. Precisa primeiro você fechar o veredito (mérito), só depois eu incorporo o resultado dentro do `indice-autoridade.md`. |

---

## `_memoria/` ✅ validado (Pedro, 25/08)

| Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `_memoria/*.md` (65 arquivos) + `MEMORY.md` | Mirror git-tracked do auto-memory real da sessão (fora do repo). Fatos duráveis cross-sessão. | `execucao/marcos/` | nenhuma | Overlap de propósito ("o que aconteceu e por quê"), não de conteúdo linha a linha — marco é mais formal, memória é mais granular. Fundir juntaria coisas de granularidade incompatível. |

---

## `_sistema/` ✅ validado (Pedro, 25/08)

| Subpasta/Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `indice-autoridade.md` | Árbitro de "quem manda em cada assunto" no vault. Desatualizado desde 16/07 (já era 🔴 em 28/07). | `_arquivo/reorganizacao-flow-design/` | decisão aberta → depois fundir | Ver acima. |
| `fila-validacao-humana.md` | Fila de valores/decisões que esperam confirmação do Pedro, não bloqueia trabalho. | `execucao/tarefas/` | linkar | Propósitos parecidos ("coisas pendentes") mas naturezas diferentes — fila é validação de dado, tarefas é trabalho a fazer. Fundir misturaria 2 tipos de pendência; um link cruzado no topo de cada já resolve o "esqueci que isso existia". |
| `pdf/` | Pipeline nota→PDF (gerar-html.py, gerar-pdf.mjs, validar-pdf.py) + fontes Sora. | `pesquisa/` raiz, `mkt/estrategia/` (outputs) | linkar | Os PDFs gerados por esse pipeline vivem no assunto de negócio deles (pesquisa/mkt), não no `_sistema/`. Certo ficarem separados — só falta o README do pipeline linkar pra onde os outputs moram. |

---

## `_templates/` ✅ validado (Pedro, 25/08)

| Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `_templates/*.md` (7) | Modelos de nota: reunião, teardown-concorrente, artefato-concorrente, diário, entrevista-shadowing, marco, tarefa. | `pesquisa/concorrentes/`, `reunioes/`, `execucao/marcos/`, `execucao/tarefas/` | nenhuma | Dependência 1:1 normal (o template define a estrutura que a pasta usa), não é sobreposição de conteúdo. |

---

## `apresentacao/` ✅ validado (Pedro, 25/08) — decisão aberta fica como está, não converge por ora

| Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `apresentacao/*` (3 arquivos) | Deck de apoio a reunião + gerador (`build-deck.js`) + proposta `.pptx` da Legalize Digital. | `_sistema/pdf/` | decisão aberta (não executar agora) | Os dois são "pipeline que transforma nota em material apresentável" com geradores diferentes. Convergir num só pipeline é call de arquitetura, não de pasta — sinalizado, sem ação por ora. |

---

## `execucao/` ✅ validado (Pedro, 25/08) — ações executadas em `17b366d`

| Subpasta/Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `flow/` | `flow-data.mjs` (fonte única do flow de onboarding) + geradores + `versoes/` (25 snapshots). Autoridade #1 do flow. | `execucao/portal/` | nenhuma | São pares intencionais (mesma gramática, mesmo mecanismo) declarados assim no reorg de 30/07 — a separação é a decisão certa, não um problema. |
| `portal/` | `portal-data.mjs` + gerador do mapa do portal (dia-2). Autoridade #2 do flow. Ganhou 4 arquivos ✅ 25/08. | `execucao/flow/` | ✅ feito (mover) | `cruzamento-portal-interno.md`, `matriz-portal-interno.md`, `backlog-telas-portal.md`, `home-candidatos-modulos.md` vieram da raiz solta. |
| `marcos/` (40) | Descobertas datadas, 1 marco por achado relevante desde 07/07. | `_memoria/` | nenhuma | Ver seção `_memoria/`. |
| `motor-testes/` (406, maioria em `relatorios/`) | Motor Node de teste de lógica do flow (sem UI). `relatorios/` = 382 outputs de teste. | `execucao/flow/` | decisão aberta (não executada) | Dívida técnica (motor desatualizado), não reorg de pasta. Fica pendente. |
| `specs/` (ampliada 25/08) | Specs de tela por bloco + `blocos-fluxo-abertura.md`, `compilado-ux-flow.md`, `casos-teste-fluxo-cnae.md`, `mapa-ramificacoes-flow.md`, `mapa-telas-mobile.md` (co-localizados). | (interno, entre os arquivos da própria pasta) | fundir (não executado) | Co-locação já feita. Mérito de conteúdo (numeração T velha) segue pendente — pede leitura linha a linha. |
| `handoffs/` (novo) | Handoffs técnicos pro dev. Ganhou o de marca ✅ 25/08. | `marca/handoff-dna-marca-sistema-ads.md` | ✅ feito (mover) | Mesmo gênero de documento, só estava em `marca/` por acidente de onde foi escrito. |
| `operacional/` (novo) | Kanban (2), parking-lot, checklist, pipeline de leads, setup GWS + agora os 4 antigos `tarefas/*` ✅ 25/08. | — | ✅ feito (fundir = co-locação de pasta) | `execucao/tarefas/` deixou de existir. **Achado no processo:** `parking-lot.md` já se declara explicitamente diferente do kanban ("tarefas concretas em execução" vs "adiado de propósito") — por isso a fusão foi só de pasta, não reescrita de conteúdo do kanban/parking-lot. |
| `pitch-investidor/` (novo) | Roteiro de pitch pra aceleradora + mapa mental do mockup. | `marca/copy/roteiro-escalada-mercado.md`, `marca/copy/roteiro-teaser-investidor.md` | linkar (não executado) | Gêneros diferentes (estratégia vs copy final), mesma audiência. |
| raiz solta (✅ 25/08: 18 → 14 arquivos) | `mapa-flow-mermaid.md`+`mapa-portal-mermaid.md` (gerados, ficam), `marcos.base` (fica; ⚠️ `tarefas.base` foi REMOVIDA em 09/09 — filtrava `tipo == "tarefa"` e havia 1 nota assim no vault inteiro, um template), e 10 sem categoria ainda: `achados-apresentacao`, `apresentacao-mauro.html`, `backlog-e-sprint-1`, `cnae-fiscalmente-otimo`, `evolucao-para-mauro`, `fluxo-abertura-portais-pedro-dev`, `orgaos-sistemas-abertura-bh`, `processo-abertura-empresa-bh`, `reordenacao-cluster-fiscal-encaixe`, `reordenacao-flow-cobranca-cedo`. | — | decisão aberta, item a item | Os 4 de portal já saíram (✅). O resto não tem lar óbvio — prefiro perguntar depois do que forçar categoria errada. |

---

## `marca/` ✅ validado (Pedro, 25/08) — `marca.md` movido em `38475e8`

| Subpasta/Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `conceito/` | `conceito-marca.md` — arquétipo, essência, territórios de marca. | `marca/naming/` | nenhuma | Dependência natural (naming deriva do conceito), não sobreposição. |
| `copy/` | Roteiros de vídeo, exemplos de copy por tela, glossário técnico→humano, narração ElevenLabs. | `execucao/pitch-investidor/` | linkar | Ver seção `execucao/pitch-investidor/`. |
| `identidade-visual/` | Design system (html+md), paleta de cores, logos (svg), símbolo de exploração. | `ux-ui/` | linkar | Design system é a fonte de token visual que `ux-ui/` deveria consumir — não faz sentido mover (públicos diferentes: marca define, ux-ui prototipa), mas falta o link de dependência explícito. |
| `naming/` | ✅ 25/08: `naming-defesa.md` ganhou banner de desatualizado, apontando pro ADR de 03/08. | `marca/decisoes-marca.md` | ✅ feito (linkar) | Mérito -ai/-ei segue em aberto — decisão de sócio, não resolvida aqui. |
| `referencias/` | Benchmarks de marca/visual de fora. | `pesquisa/concorrentes/` | linkar | Mesmo tipo de insumo (olhar pra fora), focos diferentes (visual/posicionamento vs produto/preço) — não fundir, só cruzar referência. |
| raiz solta (`marca.md`, `decisoes-marca.md`, `personagem-leo.md`) | Hub geral + ADR de decisões + personagem Léo. `handoff-dna-marca-sistema-ads.md` saiu ✅ 25/08 pra `execucao/handoffs/`. | `marca/conceito/` | decisão aberta: mover `marca.md` → `marca/conceito/` OU virar hub-índice que aponta pras subpastas | `marca.md` hoje é hub genérico solto no mesmo nível das subpastas que deveria organizar — 2 caminhos possíveis, prefiro você escolher qual em vez de forçar um. |

---

## `mkt/` ✅ validado (Pedro, 25/08)

| Subpasta/Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `campanhas/2026-08-primeira-campanha/` | Brief, copy, guardian-log, prompts de imagem, roteiros de vídeo, handoff de LP, resultados, artefatos visuais. | `marca/copy/` | linkar | Copy de campanha nasce da voz do Léo definida em `marca/` — pastas certas de ficarem separadas (produto final vs fonte de voz), falta só o link. |
| `redes-sociais/instagram/`, `redes-sociais/linkedin/` | Perfil/posicionamento de cada rede. | `mkt/campanhas/` | nenhuma | Mesma frente, granularidade diferente, sem conflito. |
| `estrategia/` (novo, ✅ 25/08) | 17 arquivos vindos de `pesquisa/` raiz: funil, CAC/LTV, posicionamento, custos de tráfego, simulação de oferta. | `pesquisa/` | ✅ feito (mover) | Ver seção `pesquisa/`. |

---

## `pesquisa/` ✅ validado (Pedro, 25/08) — anexos-simples movido em `31a7a2a`

| Subpasta/Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `cnae-matriz/anexos-simples/` (✅ movida) | Anexos III/IV/V do Simples Nacional (tabela fiscal, fonte LC 123). | `pesquisa/cnae-matriz/` | ✅ feito | Agora é subpasta de dentro da matriz, não irmã separada. |
| `cnae-matriz/` (23) | Matriz completa de CNAE (atendidos/não atendidos, complexidade, dados Contabilizei, taxonomia). | `pesquisa/anexos-simples/` | (destino do move acima) | — |
| `concorrentes/` (129, Contabilizei = 91) | Teardown por concorrente (emails, social, funcionalidades, pricing). | `marca/referencias/` | linkar | Ver seção `marca/referencias/`. |
| `integracoes-apis/` (4) | O que uma API de órgão de fato entrega — regra dura antes de criar autofill. | `execucao/` (specs com autofill) | linkar | Dependência de leitura, não de local — specs deviam citar essa pasta, não morar perto dela. |
| `personas/` (13, + `volantes/`) | 3 personas dorsais + 9 volantes + template. | `pesquisa/PESQUISA-MERCADO.md`, `mkt/` | nenhuma | Insumo compartilhado por natureza, não duplicação — fundir quebraria a separação pesquisa-de-base vs uso-tático. |
| raiz solta (✅ 25/08: 27 → 11 arquivos) | `fiscal-simples-bh-2026.md` (fonte-verdade fiscal), `PESQUISA-MERCADO.md`, `mercado-bh-regional.md`, `metodologia-descoberta.md`, `metodologia-personas.md`, `perfil-microempreendedor-mercado.md`, `validacao-ideia.md`, `cruzamento-gemini-fluxo-*.md` (2), `pesquisa-inpi-marca-legalizei.md`+`.pdf`. | `mkt/estrategia/` | ✅ feito (mover) | Cruzamento #1 executado. O que sobrou é pesquisa de base coerente. |

---

## `reunioes/` ✅ validado (Pedro, 25/08)

| Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `reunioes/*.md` (10) | 1 nota por reunião (Plaud), relatório bruto sempre na seção final. Ativa até 19/08. | — | — | — |
| `preparacao/` (novo, ✅ 25/08) | 8 arquivos vindos de `execucao/` raiz: pautas, briefings, playbook, PDFs pré-reunião. | `reunioes/` raiz | ✅ feito (mover) | Mesmo evento, split antes/depois resolvido pela co-locação. |

---

## `ux-ui/` ✅ validado (Pedro, 25/08) — prototipo movido em `5d08789`

| Subpasta/Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `prototipo/` (✅ movida) | Protótipo HTML standalone, virou `_arquivo/prototipo-pre-codigo/`. | `app/` (fora de escopo) | ✅ feito (mover) | Já substituído pelo app real, virou histórico. |
| `lotties-originais/` (+ `.zip`) | Assets de animação Lottie fonte (confetti, loading, steps etc). Fica em `ux-ui/`. | — | nenhuma (decidido) | Pedro confirmou que pretende reutilizar — fica como asset reaproveitável, não vai junto pro arquivo morto. |

---

## Os 4 cruzamentos já executados (fase A+B, 25/08)

Registrados como histórico — `75a860d`, `18f5072`. #2 e #3 resolveram só localização/aviso, ainda pedem rodada de mérito.

1. ✅ **`pesquisa/` raiz ↔ `mkt/`** — virou `mkt/estrategia/` (mover).
2. 🟡 **`execucao/specs/` ↔ conteúdo interno** — co-localizado (mover), mérito de conteúdo ainda por fundir.
3. 🟡 **`marca/naming/` ↔ `marca/decisoes-marca.md`** — flag posto (linkar), mérito -ai/-ei segue decisão aberta.
4. ✅ **`execucao/` raiz (pautas/PDFs) ↔ `reunioes/`** — virou `reunioes/preparacao/` (mover).

## `financeiro/` (NOVO, ✅ 25/08 — pasta de domínio, não estava no mapa original)

Criada a partir de um gap achado testando o próprio mapa: `mkt/estrategia/` misturava análise financeira (CAC, margem, custo) com tática de marketing (funil, posicionamento) — 2 assuntos, não 1.

| Área | Conteúdo geral | Cruza com | Ação sugerida | Justificativa |
|---|---|---|---|---|
| `estado-atual.md` | Arquivo MÃE — TL;DR de preço/CAC/margem, editado no lugar (não é log). Fonte para `indice-autoridade.md`. | `marca/decisoes-marca.md` | linkar (feito) | ADR é cronológico (log), este é o snapshot do estado corrente — os 2 se complementam, não competem. |
| `pesquisa/` | 6 arquivos vindos de `mkt/estrategia/`: economia-preço-CAC, custos-margem, simulação de oferta, rascunho de apresentação. | `mkt/estrategia/` (o que ficou) | ✅ feito (mover) | Análise financeira separada de tática de marketing. |

## Rodada pasta a pasta — FECHADA (25/08)

Todas as 11 pastas validadas com o Pedro. Commits: `17b366d` (execucao/), `38475e8` (marca/), `31a7a2a` (pesquisa/), `5d08789` (ux-ui/).

**Fica em aberto pra depois** (mérito de conteúdo, não mecânico):
- `_arquivo/reorganizacao-flow-design/` ↔ `_sistema/indice-autoridade.md` — fechar veredito e fundir.
- `execucao/motor-testes/` — dívida técnica, motor desatualizado.
- `execucao/specs/` — mérito de conteúdo (numeração T velha).
- `execucao/operacional/` ↔ `execucao/tarefas/` — já fundido por pasta; avaliar se kanban vira 1 sistema só com parking-lot é outro assunto, não decidido.
- `execucao/` raiz — 10 arquivos ainda sem categoria (`achados-apresentacao`, `apresentacao-mauro.html`, etc).
- `marca/marca.md` raiz — decisão entre virar hub-índice ou ficar como está dentro de `conceito/`.
- `apresentacao/` ↔ `_sistema/pdf/` — convergência de pipeline, recusada por ora.
- Vários `linkar` sugeridos ao longo do doc — nenhum foi executado como edição de arquivo ainda, só sinalizados.
