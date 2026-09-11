---
name: legalize-lp-na-raiz-modo-espera
description: "11/09 a LP virou a raiz de legalizai.com.br em modo pré-lançamento; o modo é um comando, e lp/_lab é a fonte mas NÃO está versionada"
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-11T13:33:59.279Z
---

**`legalizai.com.br/` serve a LP desde 11/09**, em **modo pré-lançamento**. O redirect pra `/em-breve` saiu do `vercel.json`. Conferido no ar: HTTP 200, `data-modo="espera"`.

**Why:** `/em-breve` **segue no ar e fora do índice**, por decisão do Pedro — continua captando a fila de espera, mas é página de captura, não conteúdo; indexá-la criaria uma segunda porta competindo com a raiz pelo mesmo termo.

**How to apply — o modo é um ESTADO, não uma edição:**
```
node lp/_lab/modo-copy.mjs espera   → lista de espera (ME R$ 79 nos 3 primeiros meses)
node lp/_lab/modo-copy.mjs app      → app publicado  (ME R$ 99)
node lp/_lab/modo-copy.mjs          → só diz em que modo está
```
Depois de trocar: `cd lp && node build-lp.mjs` + commit + push. **Nunca editar `lp/index.html`** — é gerado, o build sobrescreve. A fonte é sempre `lp/_lab/`.

O script **recusa gravar** se qualquer frase da tabela não bater com a página, e isso já salvou uma rodada: pegou a página metade em R$99 e metade em R$79. Ida-e-volta devolve o arquivo **idêntico byte a byte** — testar isso a cada mudança é o que garante que o comando de volta não perde nada.

Os badges das lojas **não foram apagados**: dizem "Em breve na App Store" e apontam pra `/em-breve`. Apagar obrigaria a reconstruir os SVGs no lançamento.

🔴 **`lp/_lab/` está no `.gitignore` e é A FONTE.** O que subiu no GitHub é só a saída minificada, de onde nada se recupera (nem o `modo-copy.mjs`, nem os comentários). Um `lp/.vercelignore` com `_lab/` mantém a pasta fora do deploy e dentro do git. **Oferecido ao Pedro, não decidido.**

🕓 Pendências: indexação da raiz no Search Console (é do Pedro); o WhatsApp ainda é placeholder e por isso os 4 CTAs dele estão ocultos (`WHATSAPP_ATIVO = false` no `atendimento.js`); dobra do blog oculta até ter dono.

Relacionado: [[legalize-endereco-fiscal-49]], [[legalize-lp-atualizada-rebrand-legal]].
