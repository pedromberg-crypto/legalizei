---
name: legalize-pedro-confere-ui-sozinho
description: "Subir o servidor local pro Pedro é serviço e pode; abrir o navegador pra CONFERIR é dele, não meu."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d8a3e7a3-16ca-4581-bed7-1c454d019eb2
  modified: 2026-07-29T12:34:59.345Z
---

**A linha divisória é CHECAGEM, não a ferramenta** (precisado por ele em 2026-07-19):

- ✅ **Subir o servidor local quando ele pede** ("abre o mockup pra mim") — é serviço, faz sem hesitar: `preview_start` com `legalizei-app`, e pronto.
- ❌ **Abrir o navegador pra "ver se ficou bom"** — screenshot, contar elementos, confirmar que renderizou. Isso é review, e review é dele.

Instrução original 2026-07-16. Em 19/07 eu subi o server (certo) e emendei screenshot + `javascript_tool` contando iframes pra "confirmar que carregou" (errado) — a entrega termina no servidor no ar.

**Why:** o loop dele é mais rápido que o meu. Ele vê a tela inteira num olhar; eu gasto vários tool calls e ainda erro. Nesta sessão o `computer{screenshot}` estourou 30s duas vezes e um `left_click` não despachou — a mesma instabilidade de captura já estava anotada em `app/src/app/(wizard)/gate/page.tsx`, onde ela chegou a produzir um falso-positivo (culpar o typewriter por um timeout da ferramenta). Tempo meu no browser = tempo dele esperando por uma leitura pior.

**How to apply:** escrever o código, rodar `tsc`/`eslint`, dizer o que mudou e o que olhar, e **parar**. Se ele pedir a porta, subir o server e parar aí também. Ele reporta o que quebrou. O hook do preview server vai pedir verificação a cada Edit — a instrução do Pedro ganha do hook.

⚠️ **`next build` e `next dev` brigam no mesmo `.next`** (achado 19/07): usar `next build` como verificação com o dev server ativo corrompe os manifests e faz TODAS as rotas darem 404 pro Pedro, mesmo com o build passando. Verificar com `tsc` + `eslint`, que não tocam no `.next`. Se as rotas derem 404 do nada: `rm -rf app/.next` e subir de novo.

Continua valendo medir por DOM (`javascript_tool`) **quando o número É a resposta** e o olho não resolveria: provar que um inset de 59px chegou dentro do iframe, medir se a tela estoura a altura. Isso é medição, não review. O que morre é o "abrir pra ver".

🔁 **REFORÇADO 2026-07-29** ("vc nunca confere no browser, essa é minha tarefa, apenas quando eu pedir"). No 19º flow eu reincidi em série: navegar + `get_page_text` + `read_console_messages` + clicar em CTA depois de CADA rota nova, sessão inteira. A exceção "medir por DOM" virou a porta pela qual o review voltou — se estou clicando em botão pra ver o que acontece, **não é medição, é review**. Default agora: `tsc` + `eslint`, dizer o que mudou, parar. Browser só com pedido explícito dele.

Ver [[legalize-reordenacao-e-telas-em-codigo]] · [[legalize-prototipo-ux]].
