---
name: legalize-descricao-de-tool-nao-move-chamada
description: "22/09 medido - descricao de tool molda o TEXTO que o modelo escreve, mas nao move o que ele decide CHAMAR. Quatro tools dizem \"OBRIGATORIA\" e estao em zero; a proibicao literal de uma string funcionou sem a tool ser chamada uma vez. O que move decisao e codigo."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-22T18:40:07.420Z
---

🔴 **Descrição de tool funciona como REGRA DE REDAÇÃO, não como gatilho de chamada.** Medido em 22/09 com a instrumentação nova (chamada × efeito), na suíte de 20 casos.

**A prova em dois números.** O `consultar_links` foi oferecido em **28 de 28** turnos e chamado em **0**. Reescrevi a descrição no molde da única tool que era chamada — gatilho na língua do cliente + frase proibida literal + os defeitos medidos escritos dentro — e deu **0 de 27 de novo**, inclusive nos **quatro turnos que tinham o gatilho nomeado** ("me manda o link", gate de saída). ✅ **Mas "Lista VIP" — nome de canal inventado, que aparecia em 3 turnos — sumiu para zero, sem a tool ter sido chamada uma única vez.** O schema vai no prompt todo turno, então o modelo **lê** a descrição: obedece o "não escreva X" e ignora o "chame antes".

⚠️ **A correlação que parecia óbvia era inversa.** Das oito tools, **quatro já diziam "obrigatória"** — o `buscar_cartao` abre com *"USO OBRIGATORIO. Você DEVE chamar ANTES de responder"* — e as quatro estavam em zero absoluto. Escrever a palavra com mais força era o movimento errado, e conferir as oito descrições antes de recomendar foi o que evitou a rodada perdida.

🔑 **Os três níveis, e o papel de cada um:** **prompt** (descrição/regra) molda o texto; **conteúdo** (o RAG) melhora por tabela — o link saiu certo quando o `buscar_base` trouxe a nota com a URL literal dentro; **código** é o único que não depende de o modelo cooperar. Para garantir que algo **aconteça**, é código.

⚠️ **Cuidado com n pequeno:** na mesma rodada o `consultar_escopo` caiu de 6 para 2 chamadas, e ele era a base da hipótese do molde. Com 20 casos e o sigma de 1,07 que o próprio `e2e.ts` declara, diferença de 2 ou 3 é ruído. A conclusão sobre descrição × chamada se sustenta porque é **0 contra 0**, não porque a amostra é grande.

📌 O achado só foi possível porque a instrumentação nasceu antes: até 22/09 o relatório contava tool **por efeito**, então `buscar_base` chamado que volta vazio era idêntico a não ter sido chamado. Ver [[legalize-regra-negativa-nao-impede-alucinacao]] e [[legalize-base-do-leo-fatiador-e-ondas]].
