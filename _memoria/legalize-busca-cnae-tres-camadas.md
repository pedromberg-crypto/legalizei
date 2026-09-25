---
name: legalize-busca-cnae-tres-camadas
description: "24/09 - a busca de CNAE fechou 21/21 com 3 camadas; sinonimo e DADO e so entra por seed, nao por deploy de codigo."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-25T02:17:49.939Z
---

A `fatos.consultar_cnae` fechou em **21 de 21** (`npm run teste:cnae`, medido no banco da VPS em 24/09), **zero violação do critério A3** — nenhum CNAE dos 87 volta em 1º para quem a casa não atende. Antes disso, 3 de 6 frases de não-cliente voltavam com CNAE nosso no topo.

**As três camadas, e cada uma resolve um buraco diferente:**

1. **Termos de busca** (`atividades`, 542 chars de média) entraram com **teto de 0.30**, abaixo da faixa típica de título. Sem o teto, `sou advogado` devolvia um CNAE por termo cruzado a 0.36 à frente de `SERVIÇOS ADVOCATÍCIOS` a 0.308 — violando o A5 que eu mesmo tinha escrito.
2. **Bônus de corroboração** `+0.15` quando título **e** termos casam. Levantou sete respostas certas de uma vez, não só a que eu estava consertando.
3. **Sinônimos** para o que não existe em campo nenhum da tabela (`psicologo`, `personal trainer`). Ver [[legalize-sinonimo-cnae-e-frase-nao-verbo]].

🔑 **O fato operacional que custou uma rodada: sinônimo é DADO, não código.** Ele vive em `pesquisa/cnae-matriz/cnae-aliases.json` e só chega ao banco por `npm run seed:cnae`. Um `git pull` + restart **não** carrega alias novo. A rodada deu 19/21 por isso, com a busca já correta. O `scripts/testar-cnae.mjs` agora conta `fatos.cnae_sinonimos` contra o JSON e avisa antes de rodar caso nenhum.

**Why:** o sintoma de alias não carregado é idêntico ao de busca ruim — a frase volta errada — e leva a mexer em limiar quando o problema é carga. Mesma família do falso negativo do E2E de 21/09: ambiente errado produzindo veredito confiante.

**How to apply:** ao mexer em busca de CNAE, a ordem é `git pull` → `npm run seed:cnae` → `npm run teste:cnae`. Antes de ajustar peso ou limiar por causa de uma frase, conferir se o dado que a frase depende está no banco. E o caso `faco sites` (6201502, passa raspando em 0.55) é o canário: qualquer mexida em limiar cai nele primeiro, e ali a diferença não é ranking, é **6% contra 15,5%** na conta do cliente — Web design é Fator R, Hospedagem e Portal são Anexo III fixo.

⚠️ Isso prova que os casos medidos como quebrados pararam de quebrar, não que o ranking está bom fora das 21 frases. A pergunta de embedding em [[legalize-agente-whatsapp-vault-isolado]] segue **adiada, não respondida**.
