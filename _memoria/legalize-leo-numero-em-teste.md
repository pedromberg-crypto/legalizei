---
name: legalize-leo-numero-em-teste
description: "22/09 travado - o numero do WhatsApp do Leo esta em TESTE e fica assim por um bom tempo; nao ha cliente real atendendo, entao restart/build/carga nao pedem janela de silencio. O que continua intocavel e a sessao pareada (bridge.js), nao o server."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-22T13:54:52.837Z
---

🧪 **O número do Léo está em TESTE** — travado pelo Pedro em 22/09/2026, e vale até ele dizer o contrário. **Não existe cliente real do outro lado.**

🔑 **O que isso muda na prática:** reiniciar o `leo-sidecar`, subir build, rodar `seed:rag` e mandar mensagem de verdade no número **não pedem** janela de silêncio, aviso ao Mauro nem medo de cortar conversa. Não há atendimento a interromper. Tratar o Léo como produção delicada estava custando cautela à toa — eu mesmo sugeri "reiniciar quando não tiver ninguém conversando" antes de saber disso.

🔴 **O que continua intocável, e por outro motivo:** `bridge.js`, a pasta de sessão e os `.service`. O risco ali **não é derrubar cliente, é perder o pareamento** — a pasta de sessão é um aparelho registrado no WhatsApp, e quebrá-la exige re-parear por QR, presencialmente, com o número fora do ar. Nenhum `git revert` desfaz isso.

📌 A correção está escrita no `hermes-v2-sidecar/CLAUDE.md`, que antes afirmava *"existe um número de WhatsApp ao vivo atendendo cliente real do outro lado"* — frase de 21/09 que **não** era verdade. O §1 deixou de se chamar "PRODUÇÃO" e passou a separar o que exige cuidado (a sessão) do que não exige (o serviço).

Ver [[legalize-sidecar-em-producao]] · [[legalize-agente-whatsapp-vault-isolado]].
