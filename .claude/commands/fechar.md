---
description: Ritual de fecho de flow no vault Legalizei — atualiza estado, registra decisões, commita e empurra
---

Ritual de FECHO de flow no vault do Legalizei. Faça, nesta ordem, só o que de fato aconteceu no flow (não invente estado):

1. **`HOME.md` → `## 📍 Agora`:** atualize o estado das frentes que mudaram, o que ficou aberto / o próximo passo, e a linha "Última atualização: <data de hoje>".
2. **Decisão travada?** Registre no ADR `marca/decisoes-marca.md` e/ou crie um marco em `execucao/marcos/AAAA-MM-DD-<slug>.md`.
3. **Fato durável cross-sessão?** Atualize a auto-memória do projeto (e o `MEMORY.md`).
4. **Rendeu item de reporte?** Atualize `execucao/evolucao-para-mauro.md` (tabela interna + bloco WhatsApp).
5. **Git:** `git add -A && git commit` com mensagem clara (terminando em `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`) e `git push`.
6. Dê o veredito 🪟 de saúde da janela e confirme, em 1 linha, que está seguro fechar e que a próxima janela deve abrir com `/boot`.

Seja sucinto. Anti-guru: só registra o que aconteceu, com fonte quando for dado.
