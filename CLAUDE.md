# CLAUDE.md — Legalizai Story Book (vault + projeto)

Constituição desta janela. O `CLAUDE.md` da raiz `Projetos/` continua valendo acima deste.

## O que é
**Legalizai Story Book** — app de contabilidade digital (MVP tipo Contabilizei, melhor). Sociedade **Pedro** (PM/sócio, dev solo) + **Mauro** (dono da Legalize Digital, escritório 22 anos BH). Negócio fechado 2026-07-07. Nicho: ME serviço no Simples, geo BH/MG. Fonte-verdade estratégica: `BASE-ESTRATEGICA.md`.

Este diretório **é o vault do Obsidian** — todo `.md` é nota viva (`[[links]]`, properties, Bases). Git = backup/histórico. Auto-memória (`.claude/.../memory/`) = cache cross-sessão que carrega sozinho.

## 🔑 Regra de BOOT (início de toda janela)
Antes de QUALQUER ação num assunto novo:
1. Leia `HOME.md` — em especial o bloco `## 📍 Agora` (torre de controle).
2. Rode `git log -1 --date=short` e compare a data do último commit com a "Última atualização" do §Agora. Divergiu? **Avise que o dashboard pode estar velho.**
3. Devolva um briefing curto (onde estamos + o que está aberto) e pergunte qual flow tocar. Só então execute.
Atalho: comando `/boot`.

## 🎨 Exceção de prioridade — motor de posts (`atelie/`)
Pedido de post/peça/copy de marketing **dentro da pasta `atelie/`**: quem manda é `atelie/CLAUDE.md`, não a Regra de BOOT acima (não precisa ler `HOME.md`/checar `git log` pra pedir 3 posts). Fora de `atelie/`, ou se o pedido for sobre produto/roadmap/negócio, o BOOT deste arquivo volta a valer normalmente. Motor migrado 25/08 pra `atelie/` (peça vira JSON com schema); agentes antigos `legalizai-copywriter`/`legalizai-guardian` foram **arquivados** (`_arquivo/agentes-antigos-marketing/`) — não recriar em `.claude/agents/`. ADR completo: `marca/decisoes-marca.md` 2026-08-25.

## 🪟 Regra de SAÚDE DA JANELA (proativa — Claude dispara, Pedro não monitora)
Ao **fim de cada flow**, emita uma linha:
- 🟢 saudável (segue) · 🟡 aquecendo (bom pra `/fechar`) · 🔴 pesada (fecha já).
Suba pra 🟡/🔴 se: já compactou 1x · vários flows na mesma janela · muito dump grande acumulado · você se pega repetindo/perdendo o fio. **Nunca deixe entrar numa 2ª compactação automática.** Unidade segura = FLOW, não token.

## 🔒 Regra de FECHO (fim de todo flow)
Nunca encerre um flow sem: (1) atualizar `HOME §Agora`; (2) registrar decisão travada no ADR `marca/decisoes-marca.md` e/ou marco em `execucao/marcos/`; (3) atualizar `execucao/evolucao-para-mauro.md` se rendeu reporte; (4) `git commit` + `push`. Atalho: comando `/fechar`.

## Onde as coisas vivem
- `HOME.md` — hub + §Agora (estado corrente). `BASE-ESTRATEGICA.md` — teses/custo/equity/roadmap.
- `marca/` — `decisoes-marca.md` (ADR, log de decisões travadas), `conceito/`, `identidade-visual/` (`paleta-cores.md`), `naming/`, `referencias/`.
- `execucao/` — `spec-mvp-v0.md`, `marcos/` (descobertas datadas), `evolucao-para-mauro.md` (reporte sócio), `kanban-legalizai-story-book.md`, `parking-lot.md`.
- `pesquisa/` — `concorrentes/` (teardowns), `cnae-matriz/`, `mercado-*`, `PESQUISA-MERCADO.md`.
- `reunioes/` — atas Plaud (1 nota/reunião). Auto-memória — fatos duráveis cross-sessão.

## Regras de trabalho
- 🔴 **Playwright/E2E só quando o Pedro PEDIR.** Nunca rodar por iniciativa própria, nem "pra conferir", nem no fim de uma leva de alterações. Padrão de verificação é `tsc` + `eslint`. Se achar que vale rodar, **pergunta** — não roda. (Travado 30/08, reforçado 01/09.)
- 🔴 **Escopo padrão = flow ME "abrir empresa".** MEI e Migração estão FORA de qualquer alteração, salvo pedido explícito. Quando uma tela é compartilhada (mesmo componente serve ME e MEI), a mudança tem que ser **guardada por regime** pra não vazar; se não der pra guardar, avisar antes de mexer.
- **Anti-guru:** número sem fonte não entra. Sempre valor + fonte + confiança.
- **Uma nota = um assunto.** Linkar sempre (`[[ ]]`). kebab-case, datas `AAAA-MM-DD`.
- **Commit ao fim de cada flow** (Co-Authored-By). Push quando fechar. Sem force em `main` sem ok.
- **PT-BR.** Dados sensíveis podem ficar (só o Pedro mexe por ora) — se for replicar/compartilhar, debater antes.
