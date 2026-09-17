---
name: legalize-flow-2-migrar-construido
description: "Flow #2 (migrar de contador) construído em 30/07 — 9 telas M1–M5, cobra ANTES do TTRT com promessa de devolução"
metadata: 
  node_type: memory
  type: project
  originSessionId: 08f36f5b-e369-47bd-8358-547022ddfc18
  modified: 2026-07-30T17:21:33.645Z
---

**O FLOW #2 EXISTE** (30/07). Era o blind spot mais antigo — *"metade do mercado, zero testado"* desde 15/07. A lógica já estava modelada e testada no motor (`_arquivo/motor-testes/flow-migrar.js`, M0–M5, personas `migra-limpo`/`migra-passivo`/`migra-refem`); **faltavam só as telas**.

`components/wizard-migrar.tsx` · 7 rotas (`(wizard)/migrar/*` + `(app)/migrar/*`) · grupo no `/mockup` · espelhado na `/apresentacao` com pills próprias. **A porta que era beco virou caminho:** o fork do N3 mandava quem tem CNPJ pra um card "essa parte ainda não existe".

**As 4 diferenças estruturais vs. o flow #1** (não são detalhe, mudam o produto):
1. **Sem entrevista de atividade** — o CNAE já está registrado, a gente lê o cartão CNPJ. Todo o N4 (pills, IA, desambiguação) desaparece.
2. **Diagnóstico com o número REAL** dos 12 meses (CGSN 140/18 art. 26, sem proporcionalizar) → **a dívida `promessa-quebrada` NÃO se aplica ao flow #2**. É o oposto do teaser do #1, que promete em cima de faixa.
3. **Sem taxa de governo** — a empresa já existe. O choque de custo do N7 não acontece.
4. 🔴 **A pausa mais perigosa do produto inteiro:** o TTRT (CRC-MG) é aberto por nós e **validado pelo contador ANTIGO**. Todas as pausas do flow #1 esperam órgão neutro ou o próprio cliente; esta espera **um concorrente que está perdendo o cliente**.

**💰 DECISÃO TRAVADA: cobra ANTES do TTRT** (Pedro, 30/07), com **contrapartida obrigatória** no contrato do M3b: *"se a transferência não for concluída por motivo fora do seu controle, você recebe tudo de volta"*. ⚠️ **Se essa linha sair, a decisão precisa ser reaberta** — sem ela, é cobrar por resultado que não controlamos, sem saída pro cliente.

**⚖️ Guarda-corpo de honestidade (M2):** se o contador atual já acertou o enquadramento, a tela DIZ isso e vende serviço, não economia inventada (`?cenario=ja-otimo`).

**🟡 Pendência D não resolvida:** o nº da resolução CFC e o código "Evento 232" do Redesim **não foram ratificados em fonte primária**. Por isso **nenhuma tela exibe esses códigos** — a copy fala em linguagem de gente. A mecânica está certa; a citação é que não pode ir pra tela.

**🕓 Aberto com o Mauro:** passivo herdado é upsell ou fora de escopo? (a tela hoje oferece como serviço à parte, leitura menos comprometedora).

**Why:** flow #2 é metade do mercado e o produto simplesmente não tinha porta pra ele. E o diagnóstico com número real é o argumento comercial mais forte que existe no produto inteiro — mais forte que o do flow #1, porque não é promessa.

**How to apply:** ao mexer em qualquer tela de migração, ler `flow-migrar.js` primeiro (é a fonte da lógica, não o inverso). As telas são fonte única em `wizard-migrar.tsx`; as pages são wrappers finos. Nunca colocar código de resolução/Evento na tela até a pendência D fechar.

Ver [[legalize-telas-padrao-layout]] · [[legalize-motor-testes-arquitetura]] · [[legalize-apresentacao-gestao]].
