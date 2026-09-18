---
name: legalize-vault-organizado
description: O vault tem indice de autoridade (quem manda em cada assunto + mapa T->N), fila-validacao-humana (🕓 nao bloqueia) e verificar.js. A memoria mora em _memoria/ dentro do vault via junction. Vocabulario fechado: 8 tipos (09/09: `marco` e `referencia` promovidos), 5 status.
metadata:
  node_type: memory
  type: feedback
---

**Reorganização de 2026-07-16, provocada pelo Pedro:** *"vejo com muita frequência vc falando:
passou despercebido, errei em tal coisa... não temos tempo pra esses delírios."* Ele estava certo:
**nove "achei agora" num dia só**, todos por sorte.

## 🧭 LEIA ISTO ANTES DE AFIRMAR QUALQUER COISA: `_sistema/indice-autoridade.md`
Responde **quem manda em cada assunto**. A regra central:
> **Um documento pode ser VERDADE sobre um assunto e MENTIR sobre outro.**
> A pergunta nunca é *"esse doc está vivo?"*, é **"esse doc manda NESTE assunto?"**.

Ex.: `spec-telas-entrada-b1-b2.md` tem a **ordem velha** (mente) e o **campo-a-campo válido**
(verdade). Quase carimbei 6 specs como "superadas" — teria jogado fora 28kb de conteúdo bom.

**Tem o mapa T→N.** A numeração velha (T1–T23) aparece em ~8 docs e **não vai ser reescrita**
(custaria um dia e criaria 8 docs novos pra manter). Traduza pelo mapa.

**Precedência:** código que roda > documento · fato datado > decisão · decisão nova > velha
(só no assunto que ela decidiu). **"✅ na spec" NÃO significa implementado** — a auditoria de
16/07 achou **5** itens ✅ que nunca viraram código.

## 🕓 `fila-validacao-humana.md` — e a diferença entre 🕓 e 🔴
**Decisão do Pedro:** placeholders **não são críticos**. Ele valida com Mauro/Larissa **quando
for a hora**, depois da casa organizada.
- 🕓 = **fila**. Constrói com placeholder marcado e segue. (preço, DAE, SLU×LTDA, `TEASER_PISO`,
  UX-42, TTRT, passivo do flow #2.)
- 🔴 = **bloqueia**. Raro. **Hoje há UM: avisar o dev** (contrato de 14 personas; hoje são 19,
  a ordem inverteu, existe flow #2).

**Vício meu que isso corrige:** eu inflava 🔴, misturando *"isto trava a construção"* com
*"isto precisa de um contador"*. Não fazer mais.

## 🔧 `node _sistema/verificar.cjs`
Audita o vault sozinho: derivado desatualizado (`deriva_de` no frontmatter) · link quebrado ·
vocabulário fora do fechado · órfã. **Usa a `data:` do frontmatter, não o mtime** (edição em
massa reseta mtime e cega o script).
🆕 **09/09: roda sozinho**, junto com `node produto/_flow/gerar-mapa.mjs`, como AVISO (padrão da
trava de anatomia do MEI). Antes existia havia 2 meses e nada o chamava.
🔴 **Bug crítico corrigido em 09/09:** a regex de frontmatter era `/^---
/` (só LF) e o vault é
CRLF — ele lia **140 de 663 notas (21%)**. Nunca trocar por `
` seco.
🔴 **Limite conhecido:** aviso genérico vira ruído — precisa dizer *o que* mudou, não só que a
fonte é mais nova. Saídas honestas: `revisado_em` (olhei, continua valendo), `deriva_de_codigo`
(código não tem data) e `gerado_por` (a `data:` é carimbo de build).

## 🔗 A memória mora no VAULT
`_memoria/` dentro do vault; a pasta do harness é uma **junction** apontando pra lá. Conteúdo num
lugar só, versionado no git do Pedro, visível no Obsidian, e os `[[links]]` pra ela **funcionam**
(links quebrados: **56 → 4**). Ideia do Pedro — eu tinha apresentado falso dilema (duplicar ×
não conectar).

⚠️ **A memória carrega ANTES do índice de autoridade.** Se ela mente, a sessão começa
acreditando. Em 16/07 duas notas mentiam sobre o motor. **Manter estas notas em dia é prioridade,
não higiene.**

## 🏷️ Vocabulário fechado (era 20 status, 25 tipos improvisados)
`tipo`: hub · verdade · derivado · fato · historico · operacao
`status`: vivo · superado · rascunho · congelado · fila-humana
Campos de dependência: `deriva_de` · `supera` · `superado_por` · `assunto`.

## 🎯 Os padrões que produziram os 9 achados
1. **O `/fechar` atualiza uma ponta e esquece a outra** (UX-44, UX-32, tiers do B3).
2. **Fato do concorrente vestido de fato nosso** — o mais perigoso: é datado, tem documento, tem
   número, e passa por todos os filtros. **Todo número medido precisa dizer em QUAL operação.**
3. **Regra existe, código não tem** — quando um formato de teste substitui outro, o **diff dos
   casos é obrigatório**.

Ver [[indice-autoridade]] · [[fila-validacao-humana]] · [[legalize-janela-contexto-1m]].
