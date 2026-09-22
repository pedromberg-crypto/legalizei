# GEMINI.md — Legalizai Story Book (espelho pro Gemini CLI)

Fonte-verdade completa é `CLAUDE.md` (raiz desta pasta) — leia ele também. Este arquivo é só o resumo duro pra Gemini não precisar do Claude Code pra saber as regras.

## Boot obrigatório (antes de qualquer ação num assunto novo)
1. Leia `HOME.md` — bloco `## 📍 Agora`.
2. Rode `git log -1 --date=short`, compare com "Última atualização" do §Agora. Divergiu → avisa que dashboard pode estar velho.
3. Devolve briefing curto (onde estamos + o que está aberto) antes de executar.

## 🪟 Jurisdição — duas janelas, e a divisão não é hierarquia (22/09/2026)

| | **Janela da VPS** | **Janela do vault** (aqui) |
|---|---|---|
| Roda | teste, `seed:rag`, `build`, `systemctl`, `journalctl` | análise |
| Escreve | só relatório em `hermes-v2-sidecar/reports/` | o **conteúdo**: cartões, notas, PERSONA, RULES |
| Entrega | relatório commitado | correção, por `npm run deploy:docs` |

- 🔴 **Execução fica na VPS** porque o banco do sidecar resolve **só em IPv6** e esta máquina não alcança. Em 21/09 rodar local deu **falso negativo**: as tools de banco zeraram, o roteador engoliu o `ENOTFOUND` e o teste passou mascarado.
- 🔴 **Conhecimento nunca se edita na VPS.** O Obsidian é a fonte; o caminho de volta é o `deploy:docs`, que valida com o parser real, **recusa se a VPS tiver trabalho não commitado** e confere a contagem do banco depois da carga.
- 🔑 **Documento do Léo tem dois caminhos:** `CARTOES-PRODUTO.md` e `references/*.md` vão ao Postgres por `seed:rag`; `PERSONA.md` e `RULES.md` são copiados para `.build/` e só valem após **build + restart**.
- 📦 **Correção vai em PACOTE**, nunca ajuste solto: cada carga custa embedding, cada restart é um ciclo, e um a um ninguém sabe qual mudança produziu qual efeito.

## Regras duras (não repetir erro já corrigido no Claude)
- 🔴 Escopo padrão = flow ME "abrir empresa". MEI e Migração FORA, salvo pedido explícito. Tela compartilhada entre regimes → guardar por regime ou avisar antes.
- 🔴 Playwright/E2E só se PEDIDO explicitamente nesta sessão. Padrão de verificação = `tsc` + `eslint`.
- 🔴 Copy pública NUNCA usa travessão (`—`). Reescrever com ponto/vírgula/"e".
- Toda tela de wizard tem VOLTAR; `meta` nomeia o DESTINO do voltar, não a própria tela. Quem não tem volta de propósito declara `semVoltar`.
- Mapa (`/mapa`) e apresentação (`/apresentacao`) são espelho um do outro — mesma coleção `NODES` em `produto/_flow/flow-data.mjs`. Tela nova = nó no flow-data + render na apresentação + linha em `MOMENTO_POR_NO`. Rodar `node produto/_flow/gerar-mapa.mjs` depois.
- Pré-voo antes de editar tela: código/nome, rota, o que coleta, o que recebe/passa adiante, variantes, onde aparece.
- Lote por tela — espera todos os apontamentos antes de aplicar.
- Sintoma repetido em 2ª tela = bug de raiz, não patch local.
- Commit ao fim de flow (mensagem com atribuição Gemini, não Claude). Push só quando fechar. Sem force em `main` sem confirmação.
- PT-BR sempre. Sem `.env*.local`/secrets no commit.

## Onde as coisas vivem
- `HOME.md` — hub + §Agora. `BASE-ESTRATEGICA.md` — teses/custo/equity/roadmap.
- `marca/decisoes-marca.md` — ADR, log de decisões travadas.
- `execucao/spec-mvp-v0.md`, `execucao/marcos/`, `execucao/mauro/evolucao-para-mauro.md`, `execucao/kanban-legalizai-story-book.md`.
- `app/` — código Next.js (App Router) + TS + Tailwind v4. Telas em `.tsx`, flow declarado em `produto/_flow/flow-data.mjs`.
- `reunioes/` — atas Plaud.

## Se este arquivo e o CLAUDE.md divergirem
`CLAUDE.md` manda. Avisa o Pedro pra sincronizar este resumo.
