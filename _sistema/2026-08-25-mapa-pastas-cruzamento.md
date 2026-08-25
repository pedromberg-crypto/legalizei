---
tipo: hub
status: vivo
data: 2026-08-25
assunto: mapa-pastas-cruzamento
tags: [reorganizacao, meta, validacao]
---

# Mapa de pastas — o que cada uma é e onde eu acho que cruza

Isso é validação humana pasta a pasta. **Não é veredito, é ponto de partida.** Cada linha da tabela é minha opinião sobre conteúdo real (li os arquivos, não só o nome) e onde vejo sobreposição com outra pasta. Concorde, discorde, ou peça ajuste linha a linha.

Fora de escopo: `app/` (código do produto, não é doc de vault).

## Arquivos-mestre da raiz

- `HOME.md` — torre de controle, `§ Agora` é o estado corrente (log de 34 flows encadeados, hoje 109KB).
- `BASE-ESTRATEGICA.md` — teses, custo, equity, roadmap. Fonte da verdade estratégica.
- `CLAUDE.md` — constituição da janela (regras de boot/fecho/trabalho).
- `obsidian-estado-da-arte.md` — stack do vault verificada (Bases, CLI, backup).
- `.gitignore` — config git.

---

## `_arquivo/`

Pastas mortas/congeladas, guardadas por valor histórico, tiradas da raiz ativa nesta sessão.

| Subpasta | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `diario/` | Diário da imersão, 1 nota/dia. Congelado 16/07, só 1 entrada real (08/07). | `execucao/marcos/` | Os marcos datados viraram o registro real de progresso diário; o diário foi abandonado em favor deles. |
| `reorganizacao-flow-design/` | Reorg travada de 30/07 sobre flow/telas/design system, nunca fechou veredito. | `_sistema/indice-autoridade.md` | É literalmente a mesma pergunta que o índice de autoridade tenta responder; o veredito dela devia ter virado atualização do índice e não virou. |

---

## `_memoria/`

| Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `_memoria/*.md` (65 arquivos) + `MEMORY.md` | Mirror git-tracked do auto-memory real da sessão (fora do repo). Fatos duráveis cross-sessão. | `execucao/marcos/` | Os dois registram "o que aconteceu e por quê" de forma datada; marco é mais formal/estruturado, memória é mais granular e operacional. Overlap de propósito, não de conteúdo linha a linha. |

---

## `_sistema/`

| Subpasta/Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `indice-autoridade.md` | Árbitro de "quem manda em cada assunto" no vault. Desatualizado desde 16/07 (já era 🔴 em 28/07). | `_arquivo/reorganizacao-flow-design/` | Ver acima. |
| `fila-validacao-humana.md` | Fila de valores/decisões que esperam confirmação do Pedro, não bloqueia trabalho. | `execucao/tarefas/` | Ambas são "coisas pendentes"; a fila é validação de dado, tarefas é trabalho a fazer. Cruzam em propósito de tracking, vale unificar visão. |
| `pdf/` | Pipeline nota→PDF (gerar-html.py, gerar-pdf.mjs, validar-pdf.py) + fontes Sora. | `pesquisa/` (raiz) | Os PDFs gerados por esse pipeline vivem soltos na raiz de `pesquisa/` hoje; o pipeline e o output que ele produz estão em pastas diferentes. |

---

## `_templates/`

| Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `_templates/*.md` (7) | Modelos de nota: reunião, teardown-concorrente, artefato-concorrente, diário, entrevista-shadowing, marco, tarefa. | `pesquisa/concorrentes/`, `reunioes/`, `execucao/marcos/`, `execucao/tarefas/` | Cada template alimenta uma pasta específica 1:1 — não é sobreposição de conteúdo, é dependência direta (o template define a estrutura que a pasta usa). |

---

## `apresentacao/`

| Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `apresentacao/*` (3 arquivos) | Deck de apoio a reunião + gerador (`build-deck.js`) + proposta `.pptx` da Legalize Digital. | `_sistema/pdf/` | Os dois são "pipeline que transforma nota em material apresentável" — gerador diferente, mesmo propósito. Vale avaliar se convergem num só pipeline de output. |

---

## `execucao/`

| Subpasta/Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `flow/` | `flow-data.mjs` (fonte única do flow de onboarding) + geradores + `versoes/` (25 snapshots datados). Autoridade #1 do flow. | `execucao/portal/` | Mesma gramática (nó/rota/status), mesmo mecanismo gerador+versionamento; são as 2 autoridades irmãs declaradas no reorg travado de 30/07. |
| `portal/` | `portal-data.mjs` + gerador do mapa do portal (dia-2, pós-ativação). Autoridade #2 do flow. | `execucao/flow/` | Ver acima. |
| `marcos/` (40) | Descobertas datadas, 1 marco por achado relevante desde 07/07. | `_memoria/` | Ver seção `_memoria/`. |
| `motor-testes/` (406, maioria em `relatorios/`) | Motor Node de teste de lógica do flow (sem UI). `relatorios/` = 382 outputs de rodadas de teste, provável artefato regenerável. | `execucao/flow/` | O motor testa exatamente a lógica que `flow-data.mjs` declara; hoje desatualizado (regra dura: ordem mudou, motor não acompanhou). |
| `tarefas/` (4) | To-dos pontuais (NDA, framework de sociedade, raio-x de fluxo). | `_sistema/fila-validacao-humana.md` | Ver seção `_sistema/`. |
| `specs/` (NOVO) | Specs de tela por bloco (`spec-mvp-v0`, `spec-telas-entrada-b1-b2`, `spec-telas-b3-b4-aterrissagem`, `spec-dashboard-adm-metricas`, `spec-instrumentacao-flow`, `spec-kanban-leads`). | `execucao/` raiz (`blocos-fluxo-abertura.md`, `mapa-ramificacoes-flow.md`, `mapa-telas-mobile.md`) | São a mesma camada de conteúdo (conteúdo/campo/condicional das telas) fragmentada em vários arquivos com autoridade sobreposta e parcialmente morta (numeração T velha). Candidato forte a fusão, não só a categorização. |
| `handoffs/` (NOVO) | Handoffs técnicos pro dev (cores/fonte, dashboard adm, sistema de gestão). | `marca/handoff-dna-marca-sistema-ads.md` | Mesmo gênero de documento (handoff pra outra sessão/pessoa executar), hoje em pastas diferentes por acidente de onde foi escrito, não por categoria. |
| `operacional/` (NOVO) | Kanban (2 versões), parking-lot, checklist de imersão 30 dias, pipeline de leads, setup GWS. | `execucao/tarefas/` | Ambos são gestão de trabalho/estado operacional do projeto; kanban e tarefas fazem perguntas parecidas ("o que falta fazer"). |
| `pitch-investidor/` (NOVO) | Roteiro de pitch pra aceleradora + mapa mental do mockup pro pitch. | `marca/copy/roteiro-escalada-mercado.md`, `marca/copy/roteiro-teaser-investidor.md` | Todo o material voltado a investidor/aceleradora está fragmentado entre `execucao/` (estratégia do pitch) e `marca/copy/` (o roteiro em si) — mesma audiência final, mesmo momento de uso. |
| raiz solta (30 arquivos, não categorizados nesta Fase A) | Mistura de: mapas gerados (`mapa-portal-mermaid`, `mapa-ramificacoes-flow`, `mapa-telas-mobile`), specs de flow ainda soltas (`blocos-fluxo-abertura`, `compilado-ux-flow`, `casos-teste-fluxo-cnae`), PDFs de reunião (`ABERTURA-EMPRESA-BH`, `BRIEFING-CARLA-LARISSA`, `PLAYBOOK-REUNIAO-PEDRO-DEV`), pautas/perguntas de reunião com Larissa/Carla/Pedro-dev, achados de reordenação fiscal. | `reunioes/`, `execucao/specs/` | Os PDFs+pautas de reunião deviam estar perto de `reunioes/` (mesmo gênero, hoje separado); os mapas/specs deviam juntar com `execucao/specs/` (mesma autoridade fragmentada citada acima). |

---

## `marca/`

| Subpasta/Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `conceito/` | `conceito-marca.md` — arquétipo, essência, territórios de marca. | `marca/naming/` | Naming deriva direto do conceito (defesa do nome parte da essência definida aqui). |
| `copy/` | Roteiros de vídeo (escalada-mercado, teaser-investidor, marca-e-visão), exemplos de copy por tela, glossário técnico→humano, narração ElevenLabs. | `execucao/pitch-investidor/` | Ver seção `execucao/pitch-investidor/`. |
| `identidade-visual/` | Design system (html+md), paleta de cores, logos (svg), símbolo de exploração. | `ux-ui/` | O design system é a fonte de token visual que `ux-ui/` deveria consumir pra prototipar; hoje são pastas irmãs sem link explícito de dependência. |
| `naming/` | `naming-defesa.md` — defende "Legalizei" (pretérito), desatualizado desde o rebrand de 03/08 pra "Legalizai" sem racional escrito (achado aberto em `HOME.md §Agora`). | `marca/decisoes-marca.md` | O ADR do rebrand devia ter atualizado esse doc e não atualizou; é o mesmo tipo de "autoridade que ficou pra trás" do achado #1/#2 do inventário geral. |
| `referencias/` | Benchmarks de marca/visual de fora. | `pesquisa/concorrentes/` | Referências de marca e teardown de concorrente são o mesmo tipo de insumo (olhar pra fora), só que um foca em posicionamento/visual e outro em produto/preço. |
| raiz solta (`marca.md`, `decisoes-marca.md`, `personagem-leo.md`, `handoff-dna-marca-sistema-ads.md`) | Hub geral + ADR de decisões + personagem Léo (voz da marca) + handoff de sistema de ads. | `marca/conceito/` | `marca.md` é hub genérico que provavelmente devia estar dentro de `conceito/` ou ser o índice que aponta pras subpastas, não ficar solto no mesmo nível delas. |

---

## `mkt/`

| Subpasta/Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `campanhas/2026-08-primeira-campanha/` | Brief, copy, guardian-log, prompts de imagem, roteiros de vídeo, handoff de LP, resultados, mais os artefatos visuais (.ai/.psd/.png) da campanha. | `marca/copy/` | Copy de campanha e roteiros de vídeo institucionais nascem do mesmo personagem/voz (Léo) definido em `marca/`; hoje uma pasta é "produto final publicável" e a outra é "fonte de voz", separação faz sentido mas falta link explícito. |
| `redes-sociais/instagram/`, `redes-sociais/linkedin/` | Perfil/posicionamento de cada rede (1 arquivo cada). | `mkt/campanhas/` | Mesma frente de marketing, granularidade diferente (canal vs campanha específica); praticamente vazio hoje, pode crescer junto com `campanhas/`. |

---

## `pesquisa/`

| Subpasta/Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `anexos-simples/` | Anexos III/IV/V do Simples Nacional (tabela fiscal, fonte LC 123). | `pesquisa/cnae-matriz/` | CNAE determina qual anexo se aplica; são duas metades do mesmo cálculo fiscal, hoje em pastas separadas sem link cruzado explícito. |
| `cnae-matriz/` (23) | Matriz completa de CNAE (atendidos/não atendidos, complexidade de abertura, dados extraídos da Contabilizei, taxonomia de pills). | `pesquisa/anexos-simples/` | Ver acima. |
| `concorrentes/` (129, Contabilizei = 91) | Teardown por concorrente (emails, social, funcionalidades, pricing). Contabilizei tem estrutura de domínio própria por ser o líder. | `marca/referencias/` | Ver seção `marca/referencias/`. |
| `integracoes-apis/` (4) | O que uma API de órgão (Infosimples etc) de fato entrega — regra dura antes de criar campo de autofill. | `execucao/` (specs de tela que usam autofill) | Toda spec de tela com campo de autofill depende diretamente desse doc pra não assumir dado que a API não entrega; hoje a dependência é só de memória, não linkada. |
| `personas/` (13, + `volantes/`) | 3 personas dorsais (A/B/C por tipo de serviço) + 9 personas volantes (casos concretos por dorsal) + template. | `pesquisa/PESQUISA-MERCADO.md`, `mkt/` | Personas alimentam tanto a pesquisa de mercado quanto a segmentação de copy/campanha de `mkt/`; é insumo compartilhado, não duplicação. |
| raiz solta (27 arquivos) | Mistura pesada: estratégia de mkt/tráfego (`economia-preco-cac`, `estrutura-funil-trafego`, `posicionamento`, `mercado-bh-regional`, `funil-conversao`, `mecanicas-engajamento`, `frente-1-captacao-meta-bh`), decisões de custo/margem, PDFs gerados, INPI, fiscal consolidado. | `mkt/` | **Este é o cruzamento mais forte que achei no vault inteiro.** Pelo menos 8-10 desses arquivos são estratégia de marketing/produto pronta pra decisão, não "pesquisa" no sentido de desk research bruto — deviam estar em `mkt/` ou pelo menos numa subpasta `pesquisa/estrategia-mkt/` separada do resto. |

---

## `reunioes/`

| Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `reunioes/*.md` (10) | 1 nota por reunião (Plaud), regra de ouro: relatório bruto sempre na seção final, decisões extraídas pro topo. Ativa até 19/08 (README diz "congelado" mas é só o processo, não a pasta). | `execucao/` raiz (pautas soltas: `pauta-reuniao-pedro-dev.md`, `perguntas-larissa-fiscal.md`, `briefing-carla-larissa.md` + PDFs) | Pautas e briefings pré-reunião estão em `execucao/`, atas pós-reunião estão aqui — mesmo evento, split artificial entre antes/depois. |

---

## `ux-ui/`

| Subpasta/Área | Conteúdo geral | Cruza com | Justificativa curta |
|---|---|---|---|
| `prototipo/` | Protótipo HTML standalone (splash, login, gate-cnae, fluxo-entrada) com Lottie embarcado. | `app/` (fora de escopo, mas relevante) | É um protótipo pré-código do que hoje já existe implementado no app real — provável candidato a arquivar como histórico, não como referência viva. |
| `lotties-originais/` (+ `.zip`) | Assets de animação Lottie fonte (confetti, loading, steps etc). | `ux-ui/prototipo/` | São o asset-fonte que o protótipo consome; deviam estar mais explicitamente linkados como par fonte→uso. |

---

## Os 3-4 cruzamentos que eu destacaria primeiro

1. **`pesquisa/` raiz ↔ `mkt/`** — o mais forte de todos. Tem estratégia de marketing pronta (funil, posicionamento, economia de CAC/LTV) vivendo dentro de "pesquisa" em vez de "marketing".
2. **`execucao/specs/` ↔ `execucao/` raiz (mapas e specs remanescentes)** — autoridade de conteúdo de tela fragmentada em 3-4 arquivos com sobreposição parcial e numeração antiga viva em alguns.
3. **`marca/naming/` ↔ `marca/decisoes-marca.md`** — doc de naming desatualizado desde o rebrand de 03/08, mesmo padrão do achado #1/#2 do inventário geral (autoridade que não acompanhou a decisão nova).
4. **`execucao/` raiz (pautas/PDFs de reunião) ↔ `reunioes/`** — split artificial entre pré e pós reunião do mesmo evento.
