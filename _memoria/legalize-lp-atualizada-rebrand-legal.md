---
name: legalize-lp-atualizada-rebrand-legal
description: LP institucional atualizada pro DS/Storybook + rebrand Legalizai + páginas legais (Google/Meta Ads) + nova LP coming-soon, 03/08
metadata:
  node_type: memory
  type: project
  modified: 2026-08-03T00:00:00.000Z
---

03/08: auditei `ux-ui/lp/` contra o DS canônico/Storybook. Cores já batiam 100% (tokens locais = primitivos de `app/src/app/globals.css`). Corrigi `--r-card` 22px→16px (padrão `rounded-2xl`) e troquei 2 dos 4 cards de "Diferenciais" de tom genérico pra diferencial real (CNAE fiscalmente ótimo · número vivo/monitoramento).

**Rebrand Legalizai virou de fato** (não só app) — ver [[legalize-rename-legalizai]]. Troquei wordmark+ícone em toda a LP pelos paths oficiais de `logo.tsx` (fidelidade por construção) + 15 ocorrências de copy "Legalizai Story Book"→"Legalizai". Domínio pago continua `legalizai-story-book.app`.

**CNPJ real capturado** (cartão da Legalize Digital LTDA, PDF do Pedro): 41.569.345/0001-48, natureza 206-2 Ltda, R. Satélite 328 sala 411 Caiçara-Adelaide BH/MG, e-mail legal legalizacao@legalizegroup.com.br. Usado nas 2 páginas legais novas + rodapé da LP.

**2 páginas criadas** (`ux-ui/lp/privacidade.html` + `termos.html`) — exigência de aprovação Google Ads + verificação Meta Business. Template padrão LGPD preenchido com dado real, não placeholder. Footer da LP trocou `<span>...em breve</span>` por links reais.

**Nova LP `ux-ui/coming-soon/`** — página única de captura de lista de espera (mesmo padrão fake-sem-backend do validador da LP principal, marcado no comentário do código), 3 bullets de diferencial real, reusa tokens/botões de `ux-ui/lp/styles.css`.

**ATUALIZAÇÃO 03/08 (mesmo dia, sessão seguinte): as 2 LPs foram AO AR no Vercel.** Time `legalizeiofc` (Legalizai Story Book, Pro) — Pedro tinha permissão de deploy mas não de criar projeto via CLI (403), resolveu no dashboard. 2 projetos novos: `legalizai-story-book-lp` (https://legalizai-story-book-lp.vercel.app) e `legalizai-story-book-em-breve` (https://legalizai-story-book-em-breve.vercel.app). Deploy é upload direto dos arquivos locais (`vercel --prod`), NÃO é git-integration — não redeploya sozinho a cada push, precisa rodar de novo manualmente.

**2 bugs de deploy achados nesse processo** (classe "funciona local, quebra em produção"): (1) sem `/` no final da URL local, o navegador resolvia asset relativo 1 nível acima → corrigido com `serve.json` (`trailingSlash`). (2) **o mais sério:** as 2 LPs viraram projetos Vercel SEPARADOS, então a referência cross-pasta `../lp/styles.css` + links `../lp/*.html` da coming-soon quebravam 404 em produção (não existe `../lp/` no domínio da coming-soon). Corrigido: `coming-soon/styles.css` virou autocontido, rodapé linka o domínio de produção direto. `vercel.json` (`cleanUrls`) tirou o `.html` de `/termos` e `/privacidade`. Lição: ao separar em projetos/domínios distintos, NUNCA usar caminho relativo cross-projeto — sempre URL absoluta ou ativo duplicado/autocontido.

Formulário da coming-soon também ganhou nome/sobrenome/cidade/WhatsApp (mascarado), além do e-mail.

Relacionado: [[legalize-lp-construida]] · [[legalize-rename-legalizai]] · [[legalize-card-radius-padrao]] · [[legalize-cnae-fiscalmente-otimo]].
