# CLAUDE.md — Ateliê Legalizai (motor oficial de criação de posts)

**Este é o motor OFICIAL de criação de peças de marketing do Legalizai.** Qualquer sessão aberta
dentro desta pasta lê isto primeiro. Substitui de vez o mecanismo antigo (agentes
`legalizai-copywriter`/`legalizai-guardian`, arquivados em `../_arquivo/agentes-antigos-marketing/`
— preservados por histórico, **não usar, não reativar, não recriar em `.claude/agents/`**).

> Contexto: isto é uma réplica do método `chat→peça` do Ateliê (`Projetos/atelie/`), aplicada aos
> dados reais do Legalizai. Ver `README.md` desta pasta pra entender a estrutura completa, e
> `Projetos/atelie/metodo-replicavel/CRUZAMENTO-LEGALIZAI.md` pro raciocínio por trás de cada peça.

## ⚠️ Prioridade sobre o `CLAUDE.md` do vault (raiz `pessoal/legalize/`)

Pra QUALQUER pedido de peça/post/copy dentro desta pasta, **este arquivo manda, não o ritual de
BOOT do vault** (ler `HOME.md`, checar `git log` contra `§Agora`). Esse ritual é pra sessão de
trabalho no PRODUTO (app de contabilidade); pedir 3 posts não precisa dele. Se o pedido for sobre o
produto/roadmap/negócio (não marketing), aí sim o `CLAUDE.md` raiz volta a mandar.

## Fonte de dado: SEMPRE o arquivo ORIGINAL, nunca a cópia congelada

`dados/legalizai/estrategia/*.md` dentro desta pasta são **snapshot de 2026-08-25**, só referência
histórica — o Pedro edita os originais direto no vault (principalmente `decisoes-marca.md`, que
recebe linha nova toda semana). **Ler sempre o caminho ORIGINAL abaixo, nunca a cópia**, senão o
motor trabalha com regra desatualizada sem ninguém perceber.

## Quando o Pedro pedir post/peça nova ("me dá N ideias de X", "3 posts sobre Y")

**Leia nesta ordem, sempre, antes de escrever qualquer copy (caminhos relativos a esta pasta `atelie/`):**

1. `../marca/decisoes-marca.md` — regras duras vivas, sempre as entradas mais recentes primeiro
   (pode revogar qualquer coisa abaixo).
2. `../marca/personagem-leo.md` — quem é o Léo, voz, dial de ironia por persona (§5), o que nunca
   vira piada (§3). **Sem isso lido, não escreva nada.**
3. `../mkt/estrategia/posicionamento.md` — claim, qualificador obrigatório "do Simples Nacional".
4. `../mkt/estrategia/estrategia-organica.md` — pilares 1-9, blocos 40/40/20, regras travadas
   (nunca simular escassez, garantia 7 dias em post de venda).
5. `../mkt/estrategia/mecanicas-engajamento.md` — escada de CTA (nível 1 engajamento / nível 2
   funil), banco de prompts, mecânica "Pergunta que ninguém explica".
6. `../pesquisa/metodologia-personas.md` — dorsais A/B/C.
7. `ds/legalizai/regras.json` — rode o QA determinístico mentalmente contra o que você escreveu
   (travessão, qualificador, garantia, nome antigo de marca) antes de entregar.
8. **Anti-repetição:** leia `dados/legalizai/*/campanha.json` + as peças já existentes em
   `dados/legalizai/*/pecas/*.json` — não repita pilar/headline/ângulo já usado. Pilar 5 (oferta) já
   tem 12 peças na campanha de lançamento; prefira outro pilar salvo pedido explícito.

`ds/legalizai/*.json` (voz, tokens, ctas, personas, personagem, templates) seguem sendo lidos daqui
mesmo — são extração estruturada MINHA, não têm original solto em outro lugar do vault.

## Formato de saída

Mostre a ideia como CARD (igual o Ateliê faz no chat antes de virar peça formal): headline, corpo,
CTA, pilar, persona-alvo, dial de ironia, mais o auto-check contra as regras duras. **Não escreva o
arquivo `.json` sozinho** — só depois que o Pedro confirmar. O schema exato pra quando ele confirmar
está em `dados/legalizai/tipos.md`; a peça vai pra
`dados/legalizai/<campanha>/pecas/<id>.json` + atualiza o `campanha.json` correspondente.

## Regras duras (idênticas às do agente antigo, não afrouxar)

- Zero travessão (— ou –).
- Zero concorrente citado por nome (lista de concorrentes ainda não existe — ver `ds/legalizai/voz.json > glossario.concorrentesNomeados`, está vazia de propósito, não inventar nome).
- Ironia mira o SISTEMA, nunca a dúvida/erro do cliente.
- "Contador de verdade"/"humano" sem o qualificador "do Simples Nacional" = proibido.
- Garantia nunca "incondicional" nem "sem letra miúda" como promessa.
- Escassez só se real.
- CTA preso à escada do estágio de funil (`ds/legalizai/ctas.json`).

## O que este projeto NÃO tem ainda (não fingir que tem)

- Geração de imagem automatizada — hoje é manual (Gemini avulso + Photoshop) ou nem existe pra peça
  nova. `ds/legalizai/templates-imagem.json` explica por quê (compatibilidade baixa com o que foi
  portado do Presente Sonoro).
- API viva — tudo aqui roda via Claude Code direto, sem `route.ts`/Gemini automatizado.
