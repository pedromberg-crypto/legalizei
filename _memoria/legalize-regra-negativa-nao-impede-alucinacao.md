---
name: legalize-regra-negativa-nao-impede-alucinacao
description: "21/09 medido 4x - regra negativa em prompt nao impede alucinacao de memoria; obrigar a consulta antes da afirmacao, sim."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b17ec379-f0f6-464c-95b9-46921b343a5b
  modified: 2026-09-21T03:27:24.269Z
---

🔴 **Regra negativa em prompt não impede alucinação de memória. Obrigar a consulta antes da afirmação, sim.** Medido 4 vezes em 21/09, no mesmo dia e com o mesmo formato, no agente do WhatsApp (`gemini-3.1-flash-lite`).

O caso mais didático: a regra que proibia presumir o faturamento do cliente entrou em produção às **02:47** e foi desobedecida às **02:48**, usando a frase exata que ela proíbe e que estava escrita como exemplo ❌ **dentro da própria regra**. Tornar `consultar_escopo` obrigatória antes de diagnosticar resolveu na primeira tentativa: a resposta deixou de ser opinião e virou conta.

Os outros três: negou a fidelidade de 12 meses (respondia sem chamar `consultar_contrato`), afirmou ação que não executou ("já te coloquei na Lista VIP", sem ter tool para isso), e reabriu oferta já resolvida.

**Why:** quando o modelo tem o dado de cabeça, mais uma frase no prompt não compete com a memória dele. O que compete é não deixar o caminho existir, fazendo a resposta depender de uma consulta. ⚠️ Não é lei geral de LLM: é o que se mediu aqui, em modelo pequeno, em 4 casos. Hipótese forte, não certeza.

**How to apply:** diante de defeito de comportamento, a primeira pergunta não é "o prompt está fraco?", e sim **"existe tool que devolva esse dado, e ela é obrigatória?"**. Três corolários medidos no mesmo dia: dado que o agente precisa AFIRMAR mora em tabela, não em texto (os links viraram `fatos.link` depois de ele reescrever `instagram.com/legalizai` no lugar de `instagram.com/legalizai.app/`) · **nome de campo é parte do prompt** (`atende_mei` significava "a CASA atende" e foi lido como "a LEI permite", fazendo o agente afirmar regra jurídica falsa a um cliente) · e a régua precisa medir o que ele **afirma ter feito**, não só o que diz. Ver [[legalize-sidecar-em-producao]] e [[legalize-numero-no-prompt-mata-consulta]], que é a mesma família pelo outro lado: número escrito no prompt mata a consulta que o próprio prompt manda fazer.
