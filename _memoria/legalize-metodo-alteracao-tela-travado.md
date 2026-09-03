---
name: legalize-metodo-alteracao-tela-travado
description: "03/09 — regra 6 do CLAUDE.md, consolidada — mapa espelha a apresentação por construção, pré-voo antes de tocar tela, lote por tela, sintoma repetido = bug de raiz. Duas travas automáticas no gerador (espelho + voltar)."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30062edd-3fc7-4585-8e46-701476cb9321
  modified: 2026-09-03T13:48:34.761Z
---

O Pedro travou (02-03/09) como quer que eu trabalhe alteração de tela, depois de um dia inteiro corrigindo o mesmo tipo de bug em telas diferentes (degradê de continuidade pedido 4x, "meta" do voltar errado 4x).

**As 4 regras:**
1. Mapa é **espelho por construção** da apresentação — a fita de pills deriva de `execucao/flow/flow-data.mjs`, nunca é lista escrita à mão.
2. **Pré-voo obrigatório** antes de tocar numa tela: o que ela coleta, recebe das anteriores, passa adiante, variantes que tem.
3. **Lote por tela**, não correção avulsa a cada frase.
4. **Sintoma repetido = bug de raiz.** Parar de corrigir a tela e corrigir a origem.

Está escrita como regra 6 do `CLAUDE.md` do projeto (`Como o Pedro pede alteração de tela`).

**Duas travas automáticas** (`execucao/flow/gerar-mapa.mjs`, roda a cada mudança de flow):
- **Auditoria de espelho** — nó órfão, nó sem vínculo com a demo, nó declarado sem tela construída, título do painel vindo de outra tela.
- **Auditoria de voltar** — tela do flow sem `onVoltar` nem `semVoltar` declarado. `TelaHeader` também avisa em dev quando falta `onVoltar`.

**Cuidado técnico achado ao construir a auditoria de voltar:** rota dentro de route group Next.js (`(app)/`, `(wizard)/`) dá falso "tudo certo" se o caminho do `page.tsx` não for remontado respeitando os grupos — o group não aparece na URL mas aparece no disco.

**Como aplicar:** antes de mexer em qualquer tela do flow Legalizai, seguir as 4 regras acima. Se o mesmo tipo de bug aparecer pela 2ª vez em telas diferentes, não corrigir pontualmente — construir a trava (como `Rolagem`, o espelho derivado, e a auditoria de voltar).

Relacionado: [[legalize-espelho-mapa-apresentacao]] · [[legalize-mapa-flow-vivo]]
