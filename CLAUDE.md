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

## 🪟 Regra de SAÚDE DA JANELA — ❌ REVOGADA (04/09, pedido do Pedro)
**Não emitir a linha 🟢/🟡/🔴 no fim do flow, nem sugerir `/fechar` por aquecimento.** A janela é ~1M e o Pedro acompanha a barra sozinho; o aviso virou ruído repetido no fim de toda resposta. Continua valendo só a parte silenciosa: se você se pegar repetindo, perdendo o fio ou entrando numa 2ª compactação, **diga isso em uma linha** — não como carimbo de rotina, mas como fato.

## 🔒 Regra de FECHO (fim de todo flow)
Nunca encerre um flow sem: (1) atualizar `HOME §Agora`; (2) registrar decisão travada no ADR `marca/decisoes-marca.md` e/ou marco em `execucao/marcos/`; (3) atualizar `execucao/evolucao-para-mauro.md` se rendeu reporte; (4) `git commit` + `push`. Atalho: comando `/fechar`.

## Onde as coisas vivem
- `HOME.md` — hub + §Agora (estado corrente). `BASE-ESTRATEGICA.md` — teses/custo/equity/roadmap.
- `marca/` — `decisoes-marca.md` (ADR, log de decisões travadas), `conceito/`, `identidade-visual/` (`paleta-cores.md`), `naming/`, `referencias/`.
- `execucao/` — `spec-mvp-v0.md`, `marcos/` (descobertas datadas), `evolucao-para-mauro.md` (reporte sócio), `kanban-legalizai-story-book.md`, `parking-lot.md`.
- `pesquisa/` — `concorrentes/` (teardowns), `cnae-matriz/`, `mercado-*`, `PESQUISA-MERCADO.md`.
- `reunioes/` — atas Plaud (1 nota/reunião). Auto-memória — fatos duráveis cross-sessão.

## 🔁 Como o Pedro pede alteração de tela (travado 02/09)
O Pedro revisa o produto **só** por `/apresentacao` e `/mapa`, e pede de onde estiver olhando. Um pedido pode ser layout, flow, ou os dois juntos. O método abaixo existe porque, antes dele, ele virou o detector de bug sistêmico: apontava um sintoma numa tela, eu corrigia só ali, e o mesmo bug reaparecia na próxima (o degradê de rolagem foi pedido 4 vezes; o carry-forward que não atravessa a demo, 2).

1. **Mapa é espelho da apresentação.** Mesma coleção de telas, duas vistas: uma conectada e em ordem de flow, a outra navegável. Nada existe num sem existir no outro. A coleção única é `NODES` em `execucao/flow/flow-data.mjs`; a fita de pills da apresentação **deriva** dela (`TELAS_DO_FLOW`), não é mais lista escrita à mão.
2. **Tela nova nasce declarada, não copiada.** Um nó no `flow-data` (com `caminho`), o render na apresentação, e a linha no `MOMENTO_POR_NO`. Rodar `node execucao/flow/gerar-mapa.mjs`: mapa, doc do dev e `/conferencia` se atualizam juntos, e a auditoria de espelho avisa o que ficou solto. Sem render, a pill aparece apagada como **"sem tela ainda"** em vez de sumir.
3. **Pré-voo antes de tocar na tela.** "Vou mexer na tela X" → devolver, ANTES de editar: código e nome, rota, o que ela coleta, o que recebe das telas anteriores, o que passa adiante, variantes/estados que ela tem, e onde ela aparece. Custa segundos e evita rodada de correção besta.
4. **Lote por tela, não por ajuste.** Esperar o Pedro apontar tudo o que viu numa tela e aplicar junto, em vez de uma rodada por micro-correção.
5. **Sintoma repetido = bug de raiz.** Se o mesmo tipo de defeito aparece na 2ª tela, parar de corrigir a tela e corrigir a origem (foi assim que nasceram o `Rolagem` e o espelho derivado).
6. 🔴 **Toda tela de wizard tem VOLTAR, e o `meta` nomeia o DESTINO.** Dois erros que apareceram 4 vezes em 02/09 (gate 29/08, C0, C5, C2): (a) a página esquece de passar `onVoltar` e o `TelaHeader` renderiza só o texto, sem seta e **sem erro** — a tela nasce sem saída e só o Pedro pega, testando no aparelho; (b) o `meta` recebe o nome da PRÓPRIA tela, quando ele é o nome de pra onde o voltar leva. Quem não tem voltar de propósito (splash, saída terminal, laboratório) declara `semVoltar`. Duas travas já no código: o componente avisa em dev, e `gerar-mapa.mjs` audita as telas do flow a cada rodada.

## Regras de trabalho
- 🔴 **Playwright/E2E só quando o Pedro PEDIR.** Nunca rodar por iniciativa própria, nem "pra conferir", nem no fim de uma leva de alterações. Padrão de verificação é `tsc` + `eslint`. Se achar que vale rodar, **pergunta** — não roda. (Travado 30/08, reforçado 01/09.)
- 🔴 **Escopo padrão = flow ME "abrir empresa".** MEI e Migração estão FORA de qualquer alteração, salvo pedido explícito. Quando uma tela é compartilhada (mesmo componente serve ME e MEI), a mudança tem que ser **guardada por regime** pra não vazar; se não der pra guardar, avisar antes de mexer.
- **Anti-guru:** número sem fonte não entra. Sempre valor + fonte + confiança.
- **Uma nota = um assunto.** Linkar sempre (`[[ ]]`). kebab-case, datas `AAAA-MM-DD`.
- **Commit ao fim de cada flow** (Co-Authored-By). Push quando fechar. Sem force em `main` sem ok.
- **PT-BR.** Dados sensíveis podem ficar (só o Pedro mexe por ora) — se for replicar/compartilhar, debater antes.
