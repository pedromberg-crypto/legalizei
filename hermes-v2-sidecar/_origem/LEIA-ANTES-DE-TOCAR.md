---
tipo: origem
status: congelado
data: 2026-09-20
assunto: hermes-v2-sidecar
tags: [sidecar, refatoracao, origem, baseline, leo]
---

# `_origem/` — a entrada da refatoração, congelada

🔴 **Nada aqui se edita.** Esta pasta é a **foto do que está em produção** no dia em que
a refatoração Sidecar começou. Ela existe para que o trabalho novo tenha um baseline
byte a byte para comparar, e para que a pasta `hermes-v2-sidecar/` seja auto-suficiente,
como pede o Passo 0 (todo o trabalho vive dentro dela).

**Congelado em:** 2026-09-20, commit `b177b10`, a partir do pacote **v12**.
**Verificação:** `diff -r` contra a fonte no momento da cópia saiu **vazio**.

---

## O que veio, e de onde

### `vault-v12/` — o pacote que o agente lê hoje

Cópia de `execucao/agente-whatsapp-vault/`, **sem** o `_arquivo/`.

| arquivo | chars | papel |
|---|---|---|
| `00-SOUL-personalidade.md` | 23.297 | sempre no prompt · **entrada da Tarefa 1** |
| `skills-legalizai/DESCRIPTION.md` | 1.869 | passa inteiro no prompt |
| `skills-legalizai/atendimento/SKILL.md` | 11.358 | piso da conversa |
| `skills-legalizai/vendas/SKILL.md` | 19.403 | 5% de aproveitamento medido |
| `skills-legalizai/escalacao/SKILL.md` | 9.224 | os gatilhos duros |
| `skills-legalizai/base-legalizai/SKILL.md` | 950 | casca do conhecimento |
| `skills-legalizai/base-legalizai/references/00..12` | 69.123 | as 13 notas |
| `_testes/` | 68.092 | 2 suítes + runner + 1 relatório |
| `README.md` · `sync-vps.sh` | 11.472 | operação |
| `config.yaml` | — | 🆕 **snapshot do runtime**, não mora no vault |

⚠️ O `config.yaml` veio de `_arquivo/pacote-v12-2026-09-20/runtime/`. Ele está aqui
porque é **a prova** de qual toolset está ligado (`platform_toolsets.whatsapp: [skills]`)
e qual está apenas no catálogo (`memory`, `context_engine`, `file`, `cronjob`,
`connections`, `session_search`). Sem ele, a refatoração discute arquitetura de memória
sem saber o que existe hoje.

### `marca/` — a fonte da personalidade

| arquivo | chars | por quê |
|---|---|---|
| `personagem-leo.md` | 22.864 | 🔑 **a FONTE do personagem.** O `SOUL.md` é derivado dela |
| `leo-render-3d-doutrina.md` | 20.533 | o Léo visual, para o tom não divergir do desenho |

🔴 **Aviso que a Tarefa 1 precisa levar em conta: a personalidade do Léo já vive em 4
cópias, e 2 já divergiram.** A fonte é `marca/personagem-leo.md`. Criar um `PERSONA.md`
novo aqui produz a **5ª cópia**. Isso não é motivo para não fazer — é motivo para o
`PERSONA.md` nascer declarando de onde deriva e para a divergência virar decisão, não
acidente. A cópia do Ateliê congelou em 26/08 e ainda descreve o polo com "L" em vez do
check, corrigido na fonte em 29/08: é exatamente assim que acontece.

---

## As datas, que não são as mesmas

| origem | último commit |
|---|---|
| `vault-v12/*` | **2026-09-20** (`df4a82c`, a reversão para o v12) |
| `marca/personagem-leo.md` | 2026-09-09 (`18358e9`) |
| `marca/leo-render-3d-doutrina.md` | 2026-09-09 (`18358e9`) |

O vault é 11 dias mais novo que a fonte de marca. Onde os dois discordarem sobre **tom**,
manda a marca; onde discordarem sobre **regra operacional**, manda o vault, que passou
por medição e bateria de testes em setembro.

---

## O que NÃO veio, de propósito

* **`_arquivo/pacote-v12-2026-09-20/`** (245.457 chars, 27 arquivos) — é backup do
  mesmo v12 que já está em `vault-v12/`. Copiar seria duplicar a duplicata.
* **O `USER.md` do runtime** — não está versionado no repo, e hoje injeta o perfil do
  Pedro em toda conversa de cliente. É pendência conhecida, não insumo.
* **Chaves, IP do servidor e telefones** — não entram nesta pasta em hipótese alguma.

---

## Leitura recomendada antes de refatorar

Fora desta pasta, mas no mesmo repo:

* `ESTRUTURA/02-arquitetura-vs-realidade.md` — quais caixas do diagrama existem
* `ESTRUTURA/04-perguntas-da-arquitetura-sidecar.md` — as 3 decisões abertas e o risco
  medido de separar regra de exemplo
* `execucao/entregas/briefing-agente-leo-2026-09-20.md` — o contexto completo da frente
