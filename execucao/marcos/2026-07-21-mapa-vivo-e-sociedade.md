---
tipo: marco
status: vivo
data: 2026-07-21
assunto: [mapa-flow, sociedade, n14, concorrente]
tags: [marco, produto, ux, telas, concorrente, decisao]
---

# 🗺️ Marco 2026-07-21 — Mapa vivo do flow + decisão de sociedade

> 6º flow. Debate de produto (sociedade) + ferramenta nova (mapa vivo) + correções de tela (N10, N14) + cadeia de pesquisa em fonte pública sobre como a Contabilizei trata sociedade.

## 1. Mapa VIVO do flow (ferramenta nova)
`execucao/mapa-flow-mermaid.md` deixou de ser nota manual e virou **derivado gerado**:
- **Fonte-única:** `execucao/flow/flow-data.mjs` (NODES + EDGES + status de validação por nó).
- **Gerador:** `node execucao/flow/gerar-mapa.mjs` → redesenha o diagrama Mermaid (26 telas + condicionais) + a tabela "validação tela por tela", **checa drift** contra `app/src/app/**` (rota órfã ou nó sem rota = aviso), e **versiona** em `execucao/flow/versoes/` (`.json` p/ diff + `.mmd` legível) com resumo do diff no histórico da nota. Só bumpa se mudou estrutura.
- Rodou **v1** (40 nós/44 conexões) → **v2** (falta-validar em N14). O drift pegou os 3 modos do teaser (colapsados no N5) e curou-se via `rotasCobre`.
- ⚠️ **Não editar a nota à mão** (edição some na próxima geração). Convenção na auto-memória → [[legalize-mapa-flow-vivo]].
- 🔜 **Decisão aberta:** auto-trigger (git hook × passo no `/fechar`). Recomendação: `/fechar`.

## 2. Decisão travada — sociedade fica no MVP (até 2 sócios grátis)
Debatemos cortar sociedade do MVP (abrir solo-only, oferecer sócio depois por valor simbólico). **Rejeitado.** Motivo: adicionar sócio após a constituição é **alteração contratual** (DAE JUCEMG ~R$268 🟡 + redação + Redesim), então "simbólico" subsidiaria custo real, e o co-founder de day-1 seria penalizado (2 registros vs 1). **Mantém até 2 sócios grátis na constituição, como o líder.** N12/N15 ficam como estão. Consequência: dissolve o fix menor "carry-forward N4→N12" (sem corte, ele volta a ser só um polimento opcional).

## 3. Correções de tela
- **N14 (CNAE secundários) — regra estrutural:** só sugere secundárias **similares E de mesmo-imposto** (mesmo anexo + Fator R). Regime-changer **nunca aparece, nem com aviso**. Removido o comércio `4751` + a máquina `fora`/`algumFora`/`Aviso`. As 4 sugestões passam a ser as vizinhas já vetadas `mesmo-imposto` no N4 (`6202`/`6204`/`7410`/`6203`). A restrição virou argumento na copy ("todas ficam no mesmo imposto, então incluir não muda o que você paga"). `tsc`+eslint limpos.
- **N10:** rótulo "Dados do sócio" → **"Seus dados"** no mapa + legenda do `/mockup`. A tela já mostrava certo.

## 4. Pesquisa Contabilizei (fonte pública, anti-guru)
- **Dois "grátis" diferentes:** abertura é grátis de **honorários** (cliente paga taxas de governo); *"até 2 sócios grátis"* é o **pró-labore mensal** do plano. A abertura grátis exige **fidelidade 12 meses**.
- **Headcount = driver do tier:** 3+ sócios sobe de plano (Experts Essencial inclui 3). É o mesmo motivo de a calculadora unificar *"sócios ou funcionários"* (sócio = pró-labore, funcionário = folha, ambos "pessoa a processar/mês").
- **Sociedade de 2 é self-service online:** 1 pessoa fornece os dados de todos; a contabilidade redige o contrato social; **cada sócio assina eletronicamente** (Gov.br/e-CPF). Mapeia N12 (coleta) + N22 (assinatura, planejado) + B5 (convite). Fricção real = a assinatura do 2º sócio. ⚠️ Fluxo logado não atravessado (criar conta = proibido) → mecânica de tela inferida.
- **Naturezas (artigo ME/sócio):** **SLU = forma unipessoal da sociedade limitada** (substituiu a EIRELI; serve até regulada; EI expõe patrimônio e é vedado pra regulada) → puxa A FAVOR do item Larissa "SLU=LTDA de sócio único", **mas sem citar 206-2 → segue 🟡**. **A lei NÃO limita nº de sócios** → lastro externo pra copy da tela `saída/3+ sócios`.

Fontes: [[plano-padrao-195-referencia]] (bloco 21/07) · [[fila-validacao-humana]] (item SLU×LTDA atualizado).

## Links
[[mapa-flow-mermaid]] · [[legalize-mapa-flow-vivo]] · [[plano-padrao-195-referencia]] · [[fila-validacao-humana]] · [[mapa-ramificacoes-flow]] · [[HOME]]
