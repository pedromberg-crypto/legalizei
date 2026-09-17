---
name: legalize-reorg-repo-inteiro-25-08
description: "25/08 Pedro retoma a pergunta grande de 31/07 (reorg do vault) agindo como PM — 6 achados de inventário real + 6 passos priorizados, árvore-alvo proposta pra aprovação antes de executar"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8ff9f927-e2e8-43a2-a26f-6d75d139b96a
  modified: 2026-08-25T19:27:55.350Z
---

**25/08 — Pedro respondeu "do jeito dele" a pergunta grande deixada aberta em [[legalize-reorganizacao-flow-design-em-curso]] (31/07).** Pediu inventário do repo inteiro e debate de reorganização agindo explicitamente como Product Manager, "tocando" a reorg com Claude.

**Inventário real (Bash, não memória) — 6 achados:**
1. **`reorganizacao-flow-design/HOME-reorganizacao.md` (30/07) segue travada, nunca fechou.** Regra original dizia "só esta pasta edita até fechar veredito" — quase 1 mês depois, ninguém voltou. É a mesma conversa reaberta em 25/08, precisa fechar ou herdar antes de reorg nova rodar.
2. **`_sistema/indice-autoridade.md` (16/07) desatualizado** — já estava 🔴 em 28/07 (gate cidade, veredito 3 vias fora), segue sem update. É o árbitro de "quem manda em cada assunto" e ele mesmo perdeu autoridade.
3. **`HOME.md §Agora` virou log infinito** — 109KB, append-only, 34 flows encadeados. Viola a própria regra "uma nota = um assunto" do CLAUDE.md do projeto.
4. **`execucao/` é dumping ground** — 47 arquivos soltos na raiz da pasta sem subpasta, apesar de já existir `flow/`, `marcos/`, `_arquivo/motor-testes/`, `portal/`, `tarefas/`. `_arquivo/motor-testes/relatorios/` sozinho = 382 arquivos, provável output regenerável.
5. **Lixo solto**: `body.json` na raiz (0 bytes, órfão); `_sistema/pdf/.build/` (PNGs de build) não está no `.gitignore`; binários pesados versionados (`marca/identidade-visual/lotties.zip`, PSDs em `mkt/campanhas/`, PDFs em `execucao/`).
6. **`diario/` está morto** — `status: congelado` desde 16/07, 1 entrada só, decisão explícita mas ainda sentado na raiz junto com pastas ativas.

**Números do vault (exclui `app/`):** 14 pastas raiz, ~1347 `.md`. 3 maiores: `execucao/` (563 arquivos), `pesquisa/` (200), `_memoria/` (65 — mirror git-tracked do auto-memory real, sincronizado, não é problema).

**6 passos priorizados propostos:** (1) fechar/herdar o reorg travado de 30/07 · (2) atualizar `indice-autoridade.md` · (3) quebrar `HOME.md §Agora` em log rotativo · (4) dar taxonomia aos 47 soltos de `execucao/` · (5) limpeza mecânica (lixo, `.gitignore`, destino de binários) · (6) arquivar `diario/` formalmente.

**Why:** mesmo padrão do achado de 31/07 — múltiplas representações/pastas sem hierarquia clara de autoridade, crescendo sem taxonomia.

**How to apply:** antes de qualquer execução de reorg nesta frente, checar se este plano ainda é o vigente (pode ter avançado passos em janelas seguintes). Árvore de pastas alvo foi desenhada nesta mesma sessão pra aprovação do Pedro — se não achar registrada aqui ainda, procurar marco mais recente em `execucao/marcos/` ou decisão em `marca/decisoes-marca.md`.

**FECHADO 25/08.** Todas as fases executadas e pushadas (`75a860d`→`e158a41`, 8 commits): reorg de `execucao/`+`pesquisa/` (fase A/B), validação pasta-a-pasta com o Pedro de todas as 11 pastas (fase C-F), e criação de `financeiro/` (domínio novo, não previsto no plano original — surgiu de um achado real testando o próprio resultado: preço só saía certo se soubesse ler `decisoes-marca.md` até o fim; 3 docs + `wizard-dinheiro.tsx` ainda citavam MEI R$49,90 velho). `financeiro/estado-atual.md` é o arquivo mãe (não é log) pra preço/CAC/margem daqui pra frente. Marco completo em `execucao/marcos/2026-08-25-reorg-vault-completa.md`.

Ver [[legalize-reorganizacao-flow-design-em-curso]] · [[legalize-vault-organizado]].
